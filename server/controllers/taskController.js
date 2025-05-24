const { validationResult } = require('express-validator');
const Task = require('../models/Task');

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const {
      page = 1,
      limit = 10,
      status,
      priority,
      category,
      tags,
      dueDate,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      archived = false
    } = req.query;

    // Build query
    const query = {
      user: req.user._id,
      isDeleted: false,
      isArchived: archived === 'true'
    };

    // Add filters
    if (status) query.status = status;
    if (priority) query.priority = parseInt(priority);
    if (category) query.category = new RegExp(category, 'i');
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Date filters
    if (dueDate) {
      const date = new Date(dueDate);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      query.dueDate = {
        $gte: date,
        $lt: nextDay
      };
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute query
    const tasks = await Task.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email');

    // Get total count for pagination
    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    // Task is already loaded by checkTaskOwnership middleware
    const task = req.task;

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    // Add user to req.body
    req.body.user = req.user._id;

    // Set default priority from user preferences if not provided
    if (!req.body.priority) {
      req.body.priority = req.user.preferences.defaultTaskPriority || 3;
    }

    const task = await Task.create(req.body);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete task (soft delete)
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = req.task;
    await task.softDelete();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete task
// @route   PATCH /api/tasks/:id/complete
// @access  Private
const completeTask = async (req, res, next) => {
  try {
    const task = req.task;
    await task.markCompleted();

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Archive task
// @route   PATCH /api/tasks/:id/archive
// @access  Private
const archiveTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { isArchived: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Restore task from archive
// @route   PATCH /api/tasks/:id/restore
// @access  Private
const restoreTask = async (req, res, next) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { isArchived: false },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add subtask
// @route   POST /api/tasks/:id/subtasks
// @access  Private
const addSubtask = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const task = req.task;
    await task.addSubtask(req.body.title);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update subtask
// @route   PUT /api/tasks/:id/subtasks/:subtaskId
// @access  Private
const updateSubtask = async (req, res, next) => {
  try {
    const task = req.task;
    const subtask = task.subtasks.id(req.params.subtaskId);

    if (!subtask) {
      return res.status(404).json({
        success: false,
        error: 'Subtask not found'
      });
    }

    if (req.body.title) subtask.title = req.body.title;
    if (req.body.completed !== undefined) {
      subtask.completed = req.body.completed;
      subtask.completedAt = req.body.completed ? new Date() : null;
    }

    await task.save();

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete subtask
// @route   DELETE /api/tasks/:id/subtasks/:subtaskId
// @access  Private
const deleteSubtask = async (req, res, next) => {
  try {
    const task = req.task;
    task.subtasks.id(req.params.subtaskId).remove();
    await task.save();

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle subtask completion
// @route   PATCH /api/tasks/:id/subtasks/:subtaskId/toggle
// @access  Private
const toggleSubtask = async (req, res, next) => {
  try {
    const task = req.task;
    await task.toggleSubtask(req.params.subtaskId);

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search tasks
// @route   GET /api/tasks/search
// @access  Private
const searchTasks = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const query = {
      user: req.user._id,
      isDeleted: false,
      $text: { $search: q }
    };

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const tasks = await Task.find(query)
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get overdue tasks
// @route   GET /api/tasks/overdue
// @access  Private
const getOverdueTasks = async (req, res, next) => {
  try {
    const tasks = await Task.findOverdue(req.user._id);

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const stats = await Task.getStats(req.user._id);

    // Get additional stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayTasks = await Task.countDocuments({
      user: req.user._id,
      isDeleted: false,
      dueDate: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const thisWeek = new Date(today);
    thisWeek.setDate(today.getDate() - today.getDay());
    const nextWeek = new Date(thisWeek);
    nextWeek.setDate(thisWeek.getDate() + 7);

    const weekTasks = await Task.countDocuments({
      user: req.user._id,
      isDeleted: false,
      dueDate: {
        $gte: thisWeek,
        $lt: nextWeek
      }
    });

    const result = stats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      overdue: 0
    };

    result.today = todayTasks;
    result.thisWeek = weekTasks;
    result.completionRate = result.total > 0 ? Math.round((result.completed / result.total) * 100) : 0;

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's categories
// @route   GET /api/tasks/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const categories = await Task.distinct('category', {
      user: req.user._id,
      isDeleted: false
    });

    res.status(200).json({
      success: true,
      data: categories.filter(cat => cat && cat.trim() !== '')
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk complete tasks
// @route   PATCH /api/tasks/bulk/complete
// @access  Private
const bulkCompleteTask = async (req, res, next) => {
  try {
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Task IDs array is required'
      });
    }

    const result = await Task.updateMany(
      {
        _id: { $in: taskIds },
        user: req.user._id,
        isDeleted: false
      },
      {
        status: 'completed',
        completedAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} tasks completed`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete tasks
// @route   PATCH /api/tasks/bulk/delete
// @access  Private
const bulkDeleteTasks = async (req, res, next) => {
  try {
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Task IDs array is required'
      });
    }

    const result = await Task.updateMany(
      {
        _id: { $in: taskIds },
        user: req.user._id
      },
      {
        isDeleted: true,
        deletedAt: new Date()
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} tasks deleted`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk archive tasks
// @route   PATCH /api/tasks/bulk/archive
// @access  Private
const bulkArchiveTasks = async (req, res, next) => {
  try {
    const { taskIds } = req.body;

    if (!Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Task IDs array is required'
      });
    }

    const result = await Task.updateMany(
      {
        _id: { $in: taskIds },
        user: req.user._id,
        isDeleted: false
      },
      {
        isArchived: true
      }
    );

    res.status(200).json({
      success: true,
      message: `${result.modifiedCount} tasks archived`,
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  completeTask,
  archiveTask,
  restoreTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  toggleSubtask,
  searchTasks,
  getOverdueTasks,
  getTaskStats,
  getCategories,
  bulkCompleteTask,
  bulkDeleteTasks,
  bulkArchiveTasks
}; 