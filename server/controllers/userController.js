const User = require('../models/User');
const Task = require('../models/Task');

// @desc    Get user profile with task statistics
// @route   GET /api/users/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('taskCount');
    
    // Get task statistics
    const taskStats = await Task.getStats(req.user._id);
    const stats = taskStats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      overdue: 0
    };

    res.status(200).json({
      success: true,
      data: {
        user,
        taskStats: stats
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user dashboard data
// @route   GET /api/users/dashboard
// @access  Private
const getDashboard = async (req, res, next) => {
  try {
    // Get recent tasks
    const recentTasks = await Task.find({
      user: req.user._id,
      isDeleted: false,
      isArchived: false
    })
    .sort({ updatedAt: -1 })
    .limit(5);

    // Get upcoming tasks (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const upcomingTasks = await Task.find({
      user: req.user._id,
      isDeleted: false,
      isArchived: false,
      status: { $ne: 'completed' },
      dueDate: {
        $gte: new Date(),
        $lte: nextWeek
      }
    })
    .sort({ dueDate: 1 })
    .limit(10);

    // Get overdue tasks
    const overdueTasks = await Task.findOverdue(req.user._id);

    // Get task statistics
    const taskStats = await Task.getStats(req.user._id);
    const stats = taskStats[0] || {
      total: 0,
      completed: 0,
      pending: 0,
      inProgress: 0,
      overdue: 0
    };

    // Get completion rate for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCompletedTasks = await Task.countDocuments({
      user: req.user._id,
      status: 'completed',
      completedAt: { $gte: thirtyDaysAgo }
    });

    const recentTotalTasks = await Task.countDocuments({
      user: req.user._id,
      createdAt: { $gte: thirtyDaysAgo }
    });

    const recentCompletionRate = recentTotalTasks > 0 
      ? Math.round((recentCompletedTasks / recentTotalTasks) * 100) 
      : 0;

    // Get categories with task counts
    const categoryStats = await Task.aggregate([
      {
        $match: {
          user: req.user._id,
          isDeleted: false
        }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 5
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          ...stats,
          recentCompletionRate
        },
        recentTasks,
        upcomingTasks,
        overdueTasks: overdueTasks.slice(0, 5), // Limit to 5 most urgent
        categoryStats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  getDashboard
}; 