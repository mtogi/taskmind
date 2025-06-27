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
const uuid_1 = require("uuid");
const queries_1 = require("../database/queries");
// Get all projects for the authenticated user
const getProjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        const projects = yield queries_1.projectQueries.findByUserId(userId);
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
        const project = yield queries_1.projectQueries.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        // Check if user has access to the project
        const members = yield queries_1.projectQueries.getMembers(id);
        const hasAccess = project.owner_id === userId || members.some(member => member.id === userId);
        if (!hasAccess) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        // Get project tasks
        const tasks = yield queries_1.taskQueries.findByProjectId(id);
        const projectWithTasks = Object.assign(Object.assign({}, project), { tasks,
            members });
        return res.status(200).json(projectWithTasks);
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
        const project = yield queries_1.projectQueries.create({
            id: (0, uuid_1.v4)(),
            name,
            description,
            owner_id: userId,
        });
        // Add members if provided
        if (memberIds && memberIds.length > 0) {
            for (const memberId of memberIds) {
                yield queries_1.projectQueries.addMember(project.id, memberId);
            }
        }
        // Get the created project with members
        const members = yield queries_1.projectQueries.getMembers(project.id);
        const projectWithMembers = Object.assign(Object.assign({}, project), { members });
        return res.status(201).json(projectWithMembers);
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
        const existingProject = yield queries_1.projectQueries.findById(id);
        if (!existingProject) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        if (existingProject.owner_id !== userId) {
            return res.status(403).json({
                message: 'You do not have permission to update this project.'
            });
        }
        // Update project
        const updates = {};
        if (name !== undefined)
            updates.name = name;
        if (description !== undefined)
            updates.description = description;
        const updatedProject = yield queries_1.projectQueries.update(id, updates);
        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        // Update members if provided
        if (memberIds) {
            // Remove all current members
            const currentMembers = yield queries_1.projectQueries.getMembers(id);
            for (const member of currentMembers) {
                yield queries_1.projectQueries.removeMember(id, member.id);
            }
            // Add new members
            for (const memberId of memberIds) {
                yield queries_1.projectQueries.addMember(id, memberId);
            }
        }
        // Get updated project with members
        const members = yield queries_1.projectQueries.getMembers(id);
        const projectWithMembers = Object.assign(Object.assign({}, updatedProject), { members });
        return res.status(200).json(projectWithMembers);
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
        const existingProject = yield queries_1.projectQueries.findById(id);
        if (!existingProject) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        if (existingProject.owner_id !== userId) {
            return res.status(403).json({
                message: 'You do not have permission to delete this project.'
            });
        }
        const deleted = yield queries_1.projectQueries.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Project not found.' });
        }
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
        const project = yield queries_1.projectQueries.findById(id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found.' });
        }
        // Check if user has access to the project
        const members = yield queries_1.projectQueries.getMembers(id);
        const hasAccess = project.owner_id === userId || members.some(member => member.id === userId);
        if (!hasAccess) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        // Get project tasks
        const tasks = yield queries_1.taskQueries.findByProjectId(id);
        // Calculate statistics
        const stats = {
            totalTasks: tasks.length,
            completedTasks: tasks.filter(task => task.status === 'DONE').length,
            inProgressTasks: tasks.filter(task => task.status === 'IN_PROGRESS').length,
            pendingTasks: tasks.filter(task => task.status === 'TODO').length,
            highPriorityTasks: tasks.filter(task => task.priority === 'HIGH').length,
            overdueTasks: tasks.filter(task => task.due_date && new Date(task.due_date) < new Date() && task.status !== 'DONE').length,
        };
        return res.status(200).json(stats);
    }
    catch (error) {
        console.error('Error fetching project stats:', error);
        return res.status(500).json({ message: 'Error fetching project statistics.' });
    }
});
exports.getProjectStats = getProjectStats;
