/**
 * API utility functions for interacting with the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

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

// Generic API call function
export const apiCall = async (endpoint: string, options: ApiOptions = {}) => {
  const token = getToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Auth-related API calls
export const authApi = {
  register: (userData: { email: string; password: string; name: string }) => 
    apiCall('/auth/register', { method: 'POST', body: userData }),
  
  login: (credentials: { email: string; password: string }) => 
    apiCall('/auth/login', { method: 'POST', body: credentials }),
  
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
};

// Task-related API calls
export const taskApi = {
  getAllTasks: () => apiCall('/tasks'),
  
  getTaskById: (id: string) => apiCall(`/tasks/${id}`),
  
  createTask: (taskData: any) => apiCall('/tasks', { method: 'POST', body: taskData }),
  
  updateTask: (id: string, taskData: any) => apiCall(`/tasks/${id}`, { method: 'PUT', body: taskData }),
  
  deleteTask: (id: string) => apiCall(`/tasks/${id}`, { method: 'DELETE' }),
  
  parseTaskText: async (text: string): Promise<{ parsedTask: any }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/nlp/parse-task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ text }),
      });
      
      if (!response.ok) {
        throw new Error(`Error parsing task text: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to parse task text:', error);
      throw error;
    }
  },
};

// Project-related API calls
export const projectApi = {
  getAllProjects: () => apiCall('/projects'),
  
  getProjectById: (id: string) => apiCall(`/projects/${id}`),
  
  createProject: (projectData: { 
    name: string; 
    description?: string;
    memberIds?: string[];
  }) => apiCall('/projects', { method: 'POST', body: projectData }),
  
  updateProject: (id: string, projectData: {
    name?: string;
    description?: string;
    memberIds?: string[];
  }) => apiCall(`/projects/${id}`, { method: 'PUT', body: projectData }),
  
  deleteProject: (id: string) => apiCall(`/projects/${id}`, { method: 'DELETE' }),
  
  getProjectStats: (id: string) => apiCall(`/projects/${id}/stats`),
  
  getProjectTasks: (id: string) => apiCall(`/projects/${id}`)
    .then(data => data.tasks || []),
};

// User-related API calls
export const userApi = {
  getProfile: () => apiCall('/user/profile'),
  
  updateProfile: (profileData: {
    name?: string;
    email?: string;
  }) => apiCall('/user/profile', { method: 'PUT', body: profileData }),
  
  changePassword: (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => apiCall('/user/change-password', { method: 'PUT', body: passwordData }),
  
  updatePreferences: (preferences: {
    emailNotifications?: boolean;
    pushNotifications?: boolean;
    taskReminders?: boolean;
  }) => apiCall('/user/preferences', { method: 'PUT', body: preferences }),
};

// Subscription-related API calls
export const subscriptionApi = {
  getPlans: () => apiCall('/subscription/plans'),
  
  getCurrentSubscription: () => apiCall('/subscription/current'),
  
  createCheckoutSession: (priceId: string) => 
    apiCall('/subscription/create-checkout-session', { 
      method: 'POST', 
      body: { priceId } 
    }),
  
  createCustomerPortalSession: () => 
    apiCall('/subscription/create-portal-session', { 
      method: 'POST' 
    }),
}; 