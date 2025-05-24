import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Development mode - simulates backend when no server is running
const isDevelopmentMode = process.env.NODE_ENV === 'development' && !process.env.REACT_APP_USE_REAL_API;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // 5 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const message = error.response?.data?.error || error.message || 'Something went wrong';
    
    // If token is invalid, remove it
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    
    return Promise.reject(new Error(message));
  }
);

// Mock data for development
const mockUsers = {
  'demo@taskmind.com': {
    id: 'demo-user-id',
    name: 'Demo User',
    email: 'demo@taskmind.com',
    password: 'Demo123!',
    preferences: {
      theme: 'light',
      emailNotifications: true,
      taskReminders: true
    }
  }
};

// Development mode functions
const devModeAuth = {
  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    
    const user = mockUsers[email];
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials');
    }
    
    const token = 'dev-token-' + Date.now();
    const userData = { ...user };
    delete userData.password;
    
    return { user: userData, token };
  },
  
  register: async (name, email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (mockUsers[email]) {
      throw new Error('User already exists');
    }
    
    const newUser = {
      id: 'user-' + Date.now(),
      name,
      email,
      preferences: {
        theme: 'light',
        emailNotifications: true,
        taskReminders: true
      }
    };
    
    mockUsers[email] = { ...newUser, password };
    const token = 'dev-token-' + Date.now();
    
    return { user: newUser, token };
  },
  
  getMe: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const token = localStorage.getItem('token');
    if (!token || !token.startsWith('dev-token-')) {
      throw new Error('Invalid token');
    }
    
    return { user: mockUsers['demo@taskmind.com'] };
  },
  
  logout: async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

export const authService = {
  // Register user
  register: async (name, email, password) => {
    if (isDevelopmentMode) {
      console.log('🔧 Using development mode for register');
      return devModeAuth.register(name, email, password);
    }
    
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      return response;
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('⚠️ Backend not available, falling back to development mode');
        return devModeAuth.register(name, email, password);
      }
      throw error;
    }
  },

  // Login user
  login: async (email, password) => {
    if (isDevelopmentMode) {
      console.log('🔧 Using development mode for login');
      return devModeAuth.login(email, password);
    }
    
    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      return response;
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('⚠️ Backend not available, falling back to development mode');
        return devModeAuth.login(email, password);
      }
      throw error;
    }
  },

  // Logout user
  logout: async () => {
    if (isDevelopmentMode) {
      console.log('🔧 Using development mode for logout');
      return devModeAuth.logout();
    }
    
    try {
      const response = await api.post('/auth/logout');
      return response;
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('⚠️ Backend not available, falling back to development mode');
        return devModeAuth.logout();
      }
      throw error;
    }
  },

  // Get current user
  getMe: async () => {
    if (isDevelopmentMode) {
      console.log('🔧 Using development mode for getMe');
      return devModeAuth.getMe();
    }
    
    try {
      const response = await api.get('/auth/me');
      return response;
    } catch (error) {
      if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
        console.log('⚠️ Backend not available, falling back to development mode');
        return devModeAuth.getMe();
      }
      throw error;
    }
  },

  // Update profile
  updateProfile: async (userData) => {
    const response = await api.put('/auth/update-profile', userData);
    return response;
  },

  // Change password
  changePassword: async (currentPassword, newPassword) => {
    const response = await api.put('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response;
  },

  // Update preferences
  updatePreferences: async (preferences) => {
    const response = await api.put('/auth/update-preferences', preferences);
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response;
  },
};

export default api; 