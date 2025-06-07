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
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const index_1 = require("../index");
// Get all tasks for the authenticated user
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        const tasks = yield index_1.prisma.task.findMany({
            where: {
                assigneeId: userId,
            },
            include: {
                subtasks: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return res.status(200).json(tasks);
    }
    catch (error) {
        console.error('Error fetching tasks:', error);
        return res.status(500).json({ message: 'Error fetching tasks.' });
    }
});
exports.getTasks = getTasks;
// Get a single task by ID
const getTaskById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        const task = yield index_1.prisma.task.findFirst({
            where: {
                id,
                assigneeId: userId,
            },
            include: {
                subtasks: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        return res.status(200).json(task);
    }
    catch (error) {
        console.error('Error fetching task:', error);
        return res.status(500).json({ message: 'Error fetching task.' });
    }
});
exports.getTaskById = getTaskById;
// Create a new task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description, status, priority, dueDate, projectId, parentTaskId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        const task = yield index_1.prisma.task.create({
            data: {
                title,
                description,
                status: status || 'TODO',
                priority: priority || 'MEDIUM',
                dueDate: dueDate ? new Date(dueDate) : undefined,
                assignee: {
                    connect: { id: userId },
                },
                project: projectId ? {
                    connect: { id: projectId },
                } : undefined,
                parentTask: parentTaskId ? {
                    connect: { id: parentTaskId },
                } : undefined,
            },
            include: {
                subtasks: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return res.status(201).json(task);
    }
    catch (error) {
        console.error('Error creating task:', error);
        return res.status(500).json({ message: 'Error creating task.' });
    }
});
exports.createTask = createTask;
// Update an existing task
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const { title, description, status, priority, dueDate, projectId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        // Check if the task exists and belongs to the user
        const existingTask = yield index_1.prisma.task.findFirst({
            where: {
                id,
                assigneeId: userId,
            },
        });
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        const updatedTask = yield index_1.prisma.task.update({
            where: { id },
            data: {
                title,
                description,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate) : undefined,
                project: projectId ? {
                    connect: { id: projectId },
                } : undefined,
            },
            include: {
                subtasks: true,
                project: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        });
        return res.status(200).json(updatedTask);
    }
    catch (error) {
        console.error('Error updating task:', error);
        return res.status(500).json({ message: 'Error updating task.' });
    }
});
exports.updateTask = updateTask;
// Delete a task
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        // Check if the task exists and belongs to the user
        const existingTask = yield index_1.prisma.task.findFirst({
            where: {
                id,
                assigneeId: userId,
            },
        });
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        yield index_1.prisma.task.delete({
            where: { id },
        });
        return res.status(200).json({ message: 'Task deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Error deleting task.' });
    }
});
exports.deleteTask = deleteTask;
