import api from './authService';

// Development mode - simulates backend when no server is running
const isDevelopmentMode = process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_REAL_API;

// Mock task data for development
const mockTaskStats = {
  total: 12,
  completed: 8,
  inProgress: 3,
  pending: 1,
  overdue: 0
};

const mockTasks = [
  { id: 1, title: 'Complete project proposal', status: 'in-progress', priority: 'high', dueDate: 'Today' },
  { id: 2, title: 'Review team feedback', status: 'pending', priority: 'medium', dueDate: 'Tomorrow' },
  { id: 3, title: 'Schedule dentist appointment', status: 'completed', priority: 'low', dueDate: 'Completed' },
  { id: 4, title: 'Plan weekend trip', status: 'pending', priority: 'low', dueDate: 'Next week' }
];

// Development mode functions
const devModeTask = {
  getTasks: async (params = {}) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data: mockTasks, total: mockTasks.length };
  },
  
  getTaskStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: mockTaskStats };
  },
  
  getOverdueTasks: async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return { data: [] };
  }
};

export const taskService = {
  // Get all tasks
  getTasks: async (params = {}) => {
    if (isDevelopmentMode) {
      console.log('🔧 Using development mode for getTasks');
      return devModeTask.getTasks(params);
    }
    
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.get(`/tasks?${queryString}`);
      return response;
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('⚠️ Backend not available, falling back to development mode for getTasks');
        return devModeTask.getTasks(params);
      }
      throw error;
    }
  },

  // Get single task
  getTask: async (id) => {
    const response = await api.get(`/tasks/${id}`);
    return response;
  },

  // Create task
  createTask: async (taskData) => {
    const response = await api.post('/tasks', taskData);
    return response;
  },

  // Update task
  updateTask: async (id, taskData) => {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response;
  },

  // Delete task
  deleteTask: async (id) => {
    const response = await api.delete(`/tasks/${id}`);
    return response;
  },

  // Complete task
  completeTask: async (id) => {
    const response = await api.patch(`/tasks/${id}/complete`);
    return response;
  },

  // Archive task
  archiveTask: async (id) => {
    const response = await api.patch(`/tasks/${id}/archive`);
    return response;
  },

  // Restore task
  restoreTask: async (id) => {
    const response = await api.patch(`/tasks/${id}/restore`);
    return response;
  },

  // Add subtask
  addSubtask: async (taskId, title) => {
    const response = await api.post(`/tasks/${taskId}/subtasks`, { title });
    return response;
  },

  // Update subtask
  updateSubtask: async (taskId, subtaskId, data) => {
    const response = await api.put(`/tasks/${taskId}/subtasks/${subtaskId}`, data);
    return response;
  },

  // Delete subtask
  deleteSubtask: async (taskId, subtaskId) => {
    const response = await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
    return response;
  },

  // Toggle subtask
  toggleSubtask: async (taskId, subtaskId) => {
    const response = await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`);
    return response;
  },

  // Search tasks
  searchTasks: async (query, params = {}) => {
    const queryString = new URLSearchParams({ q: query, ...params }).toString();
    const response = await api.get(`/tasks/search?${queryString}`);
    return response;
  },

  // Get overdue tasks
  getOverdueTasks: async () => {
    if (isDevelopmentMode) {
      console.log('🔧 Using development mode for getOverdueTasks');
      return devModeTask.getOverdueTasks();
    }
    
    try {
      const response = await api.get('/tasks/overdue');
      return response;
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('⚠️ Backend not available, falling back to development mode for getOverdueTasks');
        return devModeTask.getOverdueTasks();
      }
      throw error;
    }
  },

  // Get task statistics
  getTaskStats: async () => {
    if (isDevelopmentMode) {
      console.log('🔧 Using development mode for getTaskStats');
      return devModeTask.getTaskStats();
    }
    
    try {
      const response = await api.get('/tasks/stats');
      return response;
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('⚠️ Backend not available, falling back to development mode for getTaskStats');
        return devModeTask.getTaskStats();
      }
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    const response = await api.get('/tasks/categories');
    return response;
  },

  // Bulk operations
  bulkComplete: async (taskIds) => {
    const response = await api.patch('/tasks/bulk/complete', { taskIds });
    return response;
  },

  bulkDelete: async (taskIds) => {
    const response = await api.patch('/tasks/bulk/delete', { taskIds });
    return response;
  },

  bulkArchive: async (taskIds) => {
    const response = await api.patch('/tasks/bulk/archive', { taskIds });
    return response;
  },
}; 