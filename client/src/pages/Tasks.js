import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  FiPlus, 
  FiSearch, 
  FiFilter,
  FiEdit,
  FiTrash2,
  FiCheck,
  FiClock,
  FiCalendar,
  FiTag,
  FiMoreVertical
} from 'react-icons/fi';
import { taskService } from '../services/taskService';
import LoadingSpinner from '../components/LoadingSpinner';

const Tasks = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  
  // State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showCreateModal, setShowCreateModal] = useState(searchParams.get('action') === 'create');
  const [selectedTask, setSelectedTask] = useState(null);
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    priority: searchParams.get('priority') || '',
    category: searchParams.get('category') || ''
  });

  // Fetch tasks
  const { data: tasksData, isLoading, error } = useQuery(
    ['tasks', { ...filters, q: searchQuery }],
    () => taskService.getTasks({ ...filters, q: searchQuery }),
    { keepPreviousData: true }
  );

  // Mutations
  const createTaskMutation = useMutation(taskService.createTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      queryClient.invalidateQueries('taskStats');
      setShowCreateModal(false);
      toast.success('Task created successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to create task');
    }
  });

  const updateTaskMutation = useMutation(
    ({ id, data }) => taskService.updateTask(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        queryClient.invalidateQueries('taskStats');
        setSelectedTask(null);
        toast.success('Task updated successfully!');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to update task');
      }
    }
  );

  const deleteTaskMutation = useMutation(taskService.deleteTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      queryClient.invalidateQueries('taskStats');
      toast.success('Task deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete task');
    }
  });

  const completeTaskMutation = useMutation(taskService.completeTask, {
    onSuccess: () => {
      queryClient.invalidateQueries('tasks');
      queryClient.invalidateQueries('taskStats');
      toast.success('Task completed!');
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to complete task');
    }
  });

  const tasks = tasksData?.data || [];

  const handleSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchQuery) {
      newParams.set('q', searchQuery);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      'pending': 'status-pending',
      'in-progress': 'status-in-progress',
      'completed': 'status-completed',
      'cancelled': 'status-cancelled'
    };
    
    return `badge ${statusClasses[status] || 'badge-gray'}`;
  };

  const getPriorityBadge = (priority) => {
    return `badge priority-${priority}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    const now = new Date();
    const isOverdue = date < now && dateString;
    
    return (
      <span className={isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}>
        {date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric',
          year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        })}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400">Error loading tasks</p>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary mt-4"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Tasks
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your tasks and stay productive
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center"
          >
            <FiPlus className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-4">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <button type="submit" className="btn-primary">
            Search
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="input-field w-auto"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => handleFilterChange('priority', e.target.value)}
            className="input-field w-auto"
          >
            <option value="">All Priorities</option>
            <option value="1">Priority 1 (Lowest)</option>
            <option value="2">Priority 2</option>
            <option value="3">Priority 3</option>
            <option value="4">Priority 4</option>
            <option value="5">Priority 5 (Highest)</option>
          </select>

          {(filters.status || filters.priority || searchQuery) && (
            <button
              onClick={() => {
                setFilters({ status: '', priority: '', category: '' });
                setSearchQuery('');
                setSearchParams({});
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-12">
            <FiCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No tasks found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery || Object.values(filters).some(f => f) 
                ? "Try adjusting your search or filters"
                : "Get started by creating your first task"
              }
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              <FiPlus className="w-4 h-4 mr-2" />
              Create Task
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task._id} className="card">
              <div className="card-body">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {task.title}
                      </h3>
                      <span className={getStatusBadge(task.status)}>
                        {task.status.replace('-', ' ')}
                      </span>
                      <span className={getPriorityBadge(task.priority)}>
                        Priority {task.priority}
                      </span>
                    </div>
                    
                    {task.description && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-sm">
                      {task.dueDate && (
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="w-4 h-4" />
                          {formatDate(task.dueDate)}
                        </div>
                      )}
                      
                      {task.category && (
                        <div className="flex items-center space-x-1">
                          <FiTag className="w-4 h-4" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {task.category}
                          </span>
                        </div>
                      )}

                      {task.subtasks && task.subtasks.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <FiCheck className="w-4 h-4" />
                          <span className="text-gray-600 dark:text-gray-400">
                            {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtasks
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => completeTaskMutation.mutate(task._id)}
                        disabled={completeTaskMutation.isLoading}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Mark as completed"
                      >
                        <FiCheck className="w-5 h-5" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit task"
                    >
                      <FiEdit className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to delete this task?')) {
                          deleteTaskMutation.mutate(task._id);
                        }
                      }}
                      disabled={deleteTaskMutation.isLoading}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete task"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create/Edit Task Modal would go here */}
      {showCreateModal && (
        <TaskModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={(data) => createTaskMutation.mutate(data)}
          isLoading={createTaskMutation.isLoading}
        />
      )}

      {selectedTask && (
        <TaskModal
          isOpen={!!selectedTask}
          onClose={() => setSelectedTask(null)}
          onSubmit={(data) => updateTaskMutation.mutate({ id: selectedTask._id, data })}
          isLoading={updateTaskMutation.isLoading}
          task={selectedTask}
        />
      )}
    </div>
  );
};

// Simple Task Modal Component
const TaskModal = ({ isOpen, onClose, onSubmit, isLoading, task = null }) => {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || 'pending',
    priority: task?.priority || 3,
    category: task?.category || '',
    dueDate: task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {task ? 'Edit Task' : 'Create New Task'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input-field"
                placeholder="Enter task title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
                rows="3"
                placeholder="Enter task description"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="input-field"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                  className="input-field"
                >
                  <option value={1}>1 (Lowest)</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                  <option value={4}>4</option>
                  <option value={5}>5 (Highest)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
                placeholder="Enter category"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    {task ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  task ? 'Update Task' : 'Create Task'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Tasks; 