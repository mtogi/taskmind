/**
 * API utility functions for interacting with the backend
 */

import { mockApi } from './mock-api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// API options interface
interface ApiOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

// Get the stored auth token
const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('auth_token');
};

// Function to handle API errors
const handleApiError = (error: unknown) => {
  if (error && typeof error === 'object' && 'response' in error) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = error.response as any;
    return Promise.reject({
      message: data.message || 'An error occurred',
      status,
      data
    });
  } else if (error && typeof error === 'object' && 'request' in error) {
    // The request was made but no response was received
    console.error('No response received:', (error as any).request);
    return Promise.reject({
      message: 'No response from server. Please try again later.',
      isConnectionError: true
    });
  } else {
    // Something happened in setting up the request that triggered an Error
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('Error setting up request:', errorMessage);
    return Promise.reject({
      message: errorMessage
    });
  }
};

// Generic API call function
export const apiCall = async (endpoint: string, options: ApiOptions = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions: ApiOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const token = localStorage.getItem('auth_token');
  if (token && defaultOptions.headers) {
    defaultOptions.headers['Authorization'] = `Bearer ${token}`;
  }

  const fetchOptions: ApiOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...(options.headers || {}),
    },
  };

  // Convert body to JSON string if it's an object
  if (fetchOptions.body && typeof fetchOptions.body === 'object') {
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  try {
    const response = await fetch(url, fetchOptions as RequestInit);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Promise.reject({
        message: errorData.message || `Error: ${response.status} ${response.statusText}`,
        status: response.status,
        data: errorData
      });
    }
    
    return response.json();
  } catch (error) {
    return handleApiError(error);
  }
};

// Auth-related API calls
export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    try {
      return await apiCall('/auth/register', {
        method: 'POST',
        body: data,
      });
    } catch (error: any) {
      // If the backend is not available, use mock API
      if (error.isConnectionError) {
        console.log('Using mock register');
        return mockApi.auth.register(data.name, data.email, data.password);
      }
      throw error;
    }
  },
  
  login: async (data: { email: string; password: string }) => {
    try {
      return await apiCall('/auth/login', {
        method: 'POST',
        body: data,
      });
    } catch (error: any) {
      // If the backend is not available, use mock API
      if (error.isConnectionError && data.email === 'test@taskmind.dev') {
        console.log('Using mock login for test account');
        return mockApi.auth.login(data.email, data.password);
      }
      throw error;
    }
  },
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
};

// Task-related API calls
export const taskApi = {
  getAllTasks: async () => {
    try {
      return await apiCall('/tasks');
    } catch (error: any) {
      // If the backend is not available, use mock API
      if (error.isConnectionError) {
        console.log('Using mock tasks data');
        return mockApi.tasks.getAllTasks();
      }
      throw error;
    }
  },
  
  getTask: async (id: string) => {
    return apiCall(`/tasks/${id}`);
  },
  
  createTask: async (data: any) => {
    return apiCall('/tasks', {
      method: 'POST',
      body: data,
    });
  },
  
  updateTask: async (id: string, data: any) => {
    return apiCall(`/tasks/${id}`, {
      method: 'PUT',
      body: data,
    });
  },
  
  deleteTask: async (id: string) => {
    return apiCall(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
  
  parseTaskText: async (text: string): Promise<{ parsedTask: any }> => {
    return apiCall('/tasks/parse', {
      method: 'POST',
      body: { text },
    });
  },
};

// Project-related API calls
export const projectApi = {
  getAllProjects: () => apiCall('/projects'),
  
  getProject: (id: string) => apiCall(`/projects/${id}`),
  
  createProject: (data: any) => apiCall('/projects', {
    method: 'POST',
    body: data,
  }),
  
  updateProject: (id: string, data: any) => apiCall(`/projects/${id}`, {
    method: 'PUT',
    body: data,
  }),
  
  deleteProject: (id: string) => apiCall(`/projects/${id}`, {
    method: 'DELETE',
  }),
  
  getProjectStats: (id: string) => apiCall(`/projects/${id}/stats`),
  
  getProjectTasks: (id: string) => apiCall(`/projects/${id}/tasks`),
  
  addMemberToProject: (projectId: string, userId: string) => 
    apiCall(`/projects/${projectId}/members`, { 
      method: 'POST', 
      body: { userId } 
    }),
  
  removeMemberFromProject: (projectId: string, userId: string) => 
    apiCall(`/projects/${projectId}/members/${userId}`, { 
      method: 'DELETE' 
    }),
};

// User-related API calls
export const userApi = {
  getProfile: () => apiCall('/user/profile'),
  
  updateProfile: (data: any) => apiCall('/user/profile', {
    method: 'PUT',
    body: data,
  }),
  
  changePassword: (data: any) => apiCall('/user/change-password', {
    method: 'PUT',
    body: data,
  }),
  
  updatePreferences: (preferences: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    taskReminders?: boolean;
  }) => apiCall('/user/preferences', { method: 'PUT', body: preferences }),
};

// Subscription-related API calls
export const subscriptionApi = {
  getCurrentPlan: () => apiCall('/subscriptions/current'),
  
  getPlans: () => apiCall('/subscriptions/plans'),
  
  subscribe: (planId: string) => apiCall('/subscriptions/subscribe', {
    method: 'POST',
    body: { planId },
  }),
  
  cancelSubscription: () => apiCall('/subscriptions/cancel', {
    method: 'POST',
  }),
}; 