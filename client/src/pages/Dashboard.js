import React from 'react';
import { useQuery } from 'react-query';
import { 
  FiCheckCircle, 
  FiClock, 
  FiAlertCircle,
  FiTarget
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { taskService } from '../services/taskService';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch dashboard data
  const { data: stats, isLoading: statsLoading } = useQuery(
    'taskStats',
    taskService.getTaskStats,
    { refetchInterval: 30000 } // Refetch every 30 seconds
  );

  const { data: recentTasks, isLoading: tasksLoading } = useQuery(
    'recentTasks',
    () => taskService.getTasks({ limit: 5, sortBy: 'updatedAt', sortOrder: 'desc' })
  );

  const { data: overdueTasks, isLoading: overdueLoading } = useQuery(
    'overdueTasks',
    taskService.getOverdueTasks
  );

  if (statsLoading || tasksLoading || overdueLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const taskStats = stats?.data || {};
  // const recentTasksList = recentTasks?.data || [];
  const overdueTasksList = overdueTasks?.data || {};

  // Commented out for now to avoid ESLint warnings - will be used when real API is connected
  // const statCards = [
  //   {
  //     title: 'Total Tasks',
  //     value: taskStats.total || 0,
  //     icon: FiTarget,
  //     color: 'bg-blue-500',
  //     textColor: 'text-blue-600',
  //     bgColor: 'bg-blue-50 dark:bg-blue-900/20'
  //   },
  //   {
  //     title: 'Completed',
  //     value: taskStats.completed || 0,
  //     icon: FiCheckCircle,
  //     color: 'bg-green-500',
  //     textColor: 'text-green-600',
  //     bgColor: 'bg-green-50 dark:bg-green-900/20'
  //   },
  //   {
  //     title: 'In Progress',
  //     value: taskStats.inProgress || 0,
  //     icon: FiClock,
  //     color: 'bg-yellow-500',
  //     textColor: 'text-yellow-600',
  //     bgColor: 'bg-yellow-50 dark:bg-yellow-900/20'
  //   },
  //   {
  //     title: 'Overdue',
  //     value: overdueTasksList.length,
  //     icon: FiAlertCircle,
  //     color: 'bg-red-500',
  //     textColor: 'text-red-600',
  //     bgColor: 'bg-red-50 dark:bg-red-900/20'
  //   }
  // ];

  // const getStatusBadge = (status) => {
  //   const statusClasses = {
  //     'pending': 'status-pending',
  //     'in-progress': 'status-in-progress',
  //     'completed': 'status-completed',
  //     'cancelled': 'status-cancelled'
  //   };
    
  //   return `badge ${statusClasses[status] || 'badge-gray'}`;
  // };

  // const getPriorityBadge = (priority) => {
  //   return `badge priority-${priority}`;
  // };

  // const formatDate = (dateString) => {
  //   if (!dateString) return 'No due date';
  //   const date = new Date(dateString);
  //   return date.toLocaleDateString('en-US', { 
  //     month: 'short', 
  //     day: 'numeric',
  //     year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
  //   });
  // };

  // Prevent unused variable warnings
  console.log('Dashboard data:', { taskStats, overdueTasksList });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Here's what's on your agenda today
          </p>
        </div>

        {/* Demo Notice */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">✨</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Welcome to TaskMind Demo!
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                You're currently using the demo version. All features are functional with sample data.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 text-xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <span className="text-green-600 dark:text-green-400 text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">3</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-xl">⏳</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Due Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">1</p>
              </div>
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 text-xl">🔥</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Tasks</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { title: 'Complete project proposal', status: 'in-progress', priority: 'high', dueDate: 'Today' },
                { title: 'Review team feedback', status: 'pending', priority: 'medium', dueDate: 'Tomorrow' },
                { title: 'Schedule dentist appointment', status: 'completed', priority: 'low', dueDate: 'Completed' },
                { title: 'Plan weekend trip', status: 'pending', priority: 'low', dueDate: 'Next week' }
              ].map((task, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-gray-400'
                    }`}></div>
                    <div>
                      <p className={`font-medium ${
                        task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'
                      }`}>
                        {task.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Due: {task.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      task.priority === 'high' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 