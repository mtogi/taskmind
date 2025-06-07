"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectStats = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const index_1 = require("../index");
// Get all projects for the authenticated user
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        const projects = yield index_1.prisma.project.findMany({
            where: {
                OR: [
                    { ownerId: userId },
                    { members: { some: { id: userId } } },
                ],
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                _count: {
                    select: {
                        tasks: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return res.status(200).json(projects);
    }
    catch (error) {
        console.error('Error fetching projects:', error);
        return res.status(500).json({ message: 'Error fetching projects.' });
    }
});
exports.getProjects = getProjects;
// Get a single project by ID
const getProjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        const project = yield index_1.prisma.project.findFirst({
            where: {
                id,
                OR: [
                    { ownerId: userId },
                    { members: { some: { id: userId } } },
                ],
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                tasks: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        assignee: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        return res.status(200).json(project);
    }
    catch (error) {
        console.error('Error fetching project:', error);
        return res.status(500).json({ message: 'Error fetching project.' });
    }
});
exports.getProjectById = getProjectById;
// Create a new project
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, description, memberIds } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        // Validate input
        if (!name || name.trim() === '') {
            return res.status(400).json({ message: 'Project name is required.' });
        }
        // Prepare member connections if provided
        const memberConnections = memberIds && memberIds.length > 0
            ? {
                connect: memberIds.map((id) => ({ id })),
            }
            : undefined;
        const project = yield index_1.prisma.project.create({
            data: {
                name,
                description,
                owner: {
                    connect: { id: userId },
                },
                members: memberConnections,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return res.status(201).json(project);
    }
    catch (error) {
        console.error('Error creating project:', error);
        return res.status(500).json({ message: 'Error creating project.' });
    }
});
exports.createProject = createProject;
// Update an existing project
const updateProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { name, description, memberIds } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        // Check if the project exists and user is the owner
        const existingProject = yield index_1.prisma.project.findFirst({
            where: {
                id,
                ownerId: userId,
            },
        });
        if (!existingProject) {
            return res.status(404).json({
                message: 'Project not found or you do not have permission to update it.'
            });
        }
        // Prepare member connections if provided
        let memberUpdateOperation;
        if (memberIds) {
            memberUpdateOperation = {
                set: memberIds.map((id) => ({ id })),
            };
        }
        const updatedProject = yield index_1.prisma.project.update({
            where: { id },
            data: {
                name,
                description,
                members: memberUpdateOperation,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                members: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        return res.status(200).json(updatedProject);
    }
    catch (error) {
        console.error('Error updating project:', error);
        return res.status(500).json({ message: 'Error updating project.' });
    }
});
exports.updateProject = updateProject;
// Delete a project
const deleteProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        // Check if the project exists and user is the owner
        const existingProject = yield index_1.prisma.project.findFirst({
            where: {
                id,
                ownerId: userId,
            },
        });
        if (!existingProject) {
            return res.status(404).json({
                message: 'Project not found or you do not have permission to delete it.'
            });
        }
        // Delete all tasks associated with the project first
        yield index_1.prisma.task.deleteMany({
            where: {
                projectId: id,
            },
        });
        // Delete the project
        yield index_1.prisma.project.delete({
            where: { id },
        });
        return res.status(200).json({ message: 'Project deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting project:', error);
        return res.status(500).json({ message: 'Error deleting project.' });
    }
});
exports.deleteProject = deleteProject;
// Get project statistics
const getProjectStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        // Check if the project exists and user has access
        const existingProject = yield index_1.prisma.project.findFirst({
            where: {
                id,
                OR: [
                    { ownerId: userId },
                    { members: { some: { id: userId } } },
                ],
            },
        });
        if (!existingProject) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        // Get task counts by status
        const taskStats = yield index_1.prisma.task.groupBy({
            by: ['status'],
            where: {
                projectId: id,
            },
            _count: {
                status: true,
            },
        });
        // Get task counts by priority
        const priorityStats = yield index_1.prisma.task.groupBy({
            by: ['priority'],
            where: {
                projectId: id,
            },
            _count: {
                priority: true,
            },
        });
        // Get count of overdue tasks
        const now = new Date();
        const overdueTasksCount = yield index_1.prisma.task.count({
            where: {
                projectId: id,
                dueDate: {
                    lt: now,
                },
                status: {
                    not: 'DONE',
                },
            },
        });
        // Format the statistics
        const statistics = {
            tasksByStatus: taskStats.reduce((acc, curr) => {
                acc[curr.status] = curr._count.status;
                return acc;
            }, {}),
            tasksByPriority: priorityStats.reduce((acc, curr) => {
                acc[curr.priority] = curr._count.priority;
                return acc;
            }, {}),
            overdueTasks: overdueTasksCount,
            totalTasks: yield index_1.prisma.task.count({
                where: {
                    projectId: id,
                },
            }),
        };
        return res.status(200).json(statistics);
    }
    catch (error) {
        console.error('Error fetching project statistics:', error);
        return res.status(500).json({ message: 'Error fetching project statistics.' });
    }
});
exports.getProjectStats = getProjectStats;
