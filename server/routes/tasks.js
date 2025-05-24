const express = require('express');
const { body, query } = require('express-validator');
const taskController = require('../controllers/taskController');
const { protect, checkTaskOwnership } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Validation rules
const createTaskValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot be more than 2000 characters'),
  body('priority')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Priority must be between 1 and 5'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot be more than 50 characters'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 minute'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot be more than 30 characters')
];

const updateTaskValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot be more than 2000 characters'),
  body('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in-progress, completed, cancelled'),
  body('priority')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Priority must be between 1 and 5'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Category cannot be more than 50 characters'),
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date'),
  body('estimatedDuration')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Estimated duration must be at least 1 minute'),
  body('actualDuration')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Actual duration cannot be negative'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Each tag cannot be more than 30 characters')
];

const subtaskValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subtask title must be between 1 and 200 characters')
];

const queryValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('status')
    .optional()
    .isIn(['pending', 'in-progress', 'completed', 'cancelled'])
    .withMessage('Status must be one of: pending, in-progress, completed, cancelled'),
  query('priority')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Priority must be between 1 and 5'),
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'dueDate', 'priority', 'title'])
    .withMessage('SortBy must be one of: createdAt, updatedAt, dueDate, priority, title'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('SortOrder must be either asc or desc')
];

// Task CRUD routes
router.get('/', queryValidation, taskController.getTasks);
router.post('/', createTaskValidation, taskController.createTask);
router.get('/stats', taskController.getTaskStats);
router.get('/search', taskController.searchTasks);
router.get('/overdue', taskController.getOverdueTasks);
router.get('/categories', taskController.getCategories);

// Single task routes (require ownership check)
router.get('/:id', checkTaskOwnership, taskController.getTask);
router.put('/:id', checkTaskOwnership, updateTaskValidation, taskController.updateTask);
router.delete('/:id', checkTaskOwnership, taskController.deleteTask);

// Task status routes
router.patch('/:id/complete', checkTaskOwnership, taskController.completeTask);
router.patch('/:id/archive', checkTaskOwnership, taskController.archiveTask);
router.patch('/:id/restore', checkTaskOwnership, taskController.restoreTask);

// Subtask routes
router.post('/:id/subtasks', checkTaskOwnership, subtaskValidation, taskController.addSubtask);
router.put('/:id/subtasks/:subtaskId', checkTaskOwnership, taskController.updateSubtask);
router.delete('/:id/subtasks/:subtaskId', checkTaskOwnership, taskController.deleteSubtask);
router.patch('/:id/subtasks/:subtaskId/toggle', checkTaskOwnership, taskController.toggleSubtask);

// Bulk operations
router.patch('/bulk/complete', taskController.bulkCompleteTask);
router.patch('/bulk/delete', taskController.bulkDeleteTasks);
router.patch('/bulk/archive', taskController.bulkArchiveTasks);

module.exports = router; 