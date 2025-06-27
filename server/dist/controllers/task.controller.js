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
exports.getSubtasks = exports.deleteTask = exports.updateTask = exports.createTask = exports.getTaskById = exports.getTasks = void 0;
const uuid_1 = require("uuid");
const queries_1 = require("../database/queries");
// Get all tasks for the authenticated user
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        const tasks = yield queries_1.taskQueries.findByUserId(userId);
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
        const task = yield queries_1.taskQueries.findById(id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        // Check if the task belongs to the user
        if (task.assignee_id !== userId) {
            return res.status(403).json({ message: 'Access denied.' });
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
        const task = yield queries_1.taskQueries.create({
            id: (0, uuid_1.v4)(),
            title,
            description,
            status: status || 'TODO',
            priority: priority || 'MEDIUM',
            due_date: dueDate ? new Date(dueDate) : undefined,
            assignee_id: userId,
            project_id: projectId,
            parent_task_id: parentTaskId,
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
        const existingTask = yield queries_1.taskQueries.findById(id);
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        if (existingTask.assignee_id !== userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        const updates = {};
        if (title !== undefined)
            updates.title = title;
        if (description !== undefined)
            updates.description = description;
        if (status !== undefined)
            updates.status = status;
        if (priority !== undefined)
            updates.priority = priority;
        if (dueDate !== undefined)
            updates.due_date = dueDate ? new Date(dueDate) : null;
        if (projectId !== undefined)
            updates.project_id = projectId;
        const updatedTask = yield queries_1.taskQueries.update(id, updates);
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }
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
        const existingTask = yield queries_1.taskQueries.findById(id);
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        if (existingTask.assignee_id !== userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        const deleted = yield queries_1.taskQueries.delete(id);
        if (!deleted) {
            return res.status(404).json({ message: 'Task not found.' });
        }
        return res.status(200).json({ message: 'Task deleted successfully.' });
    }
    catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Error deleting task.' });
    }
});
exports.deleteTask = deleteTask;
// Get subtasks for a task
const getSubtasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { taskId } = req.params;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        // Check if the parent task exists and belongs to the user
        const parentTask = yield queries_1.taskQueries.findById(taskId);
        if (!parentTask) {
            return res.status(404).json({ message: 'Parent task not found.' });
        }
        if (parentTask.assignee_id !== userId) {
            return res.status(403).json({ message: 'Access denied.' });
        }
        const subtasks = yield queries_1.taskQueries.findSubtasks(taskId);
        return res.status(200).json(subtasks);
    }
    catch (error) {
        console.error('Error fetching subtasks:', error);
        return res.status(500).json({ message: 'Error fetching subtasks.' });
    }
});
exports.getSubtasks = getSubtasks;
