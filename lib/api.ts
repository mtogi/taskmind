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
  
  parseTaskText: (text: string) => apiCall('/nlp/parse-task', { method: 'POST', body: { text } }),
}; 