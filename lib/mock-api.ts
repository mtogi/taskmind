/**
 * Mock API service for testing and development
 */

// Mock user data
const mockUsers = [
  {
    id: "test-user-id",
    email: "test@taskmind.dev",
    name: "Test User",
    password: "testpassword123", // In a real app, passwords would be hashed
  }
];

// Mock login function
export const mockLogin = (email: string, password: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      const user = mockUsers.find(u => u.email === email);
      
      if (!user || user.password !== password) {
        reject(new Error("Invalid email or password"));
        return;
      }
      
      // Return a successful login response
      resolve({
        token: "mock-jwt-token-for-testing",
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      });
    }, 500); // 500ms delay to simulate network
  });
};

// Mock registration function
export const mockRegister = (name: string, email: string, password: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      // Check if user already exists
      if (mockUsers.some(u => u.email === email)) {
        reject(new Error("User with this email already exists"));
        return;
      }
      
      // Create a new user
      const newUser = {
        id: `user-${Date.now()}`,
        email,
        name,
        password
      };
      
      // Add to mock users (in a real app, this would be saved to a database)
      mockUsers.push(newUser);
      
      // Return a successful registration response
      resolve({
        token: "mock-jwt-token-for-testing",
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name
        }
      });
    }, 800); // 800ms delay to simulate network
  });
};

// Mock task data
const mockTasks = [
  {
    id: "1",
    title: "Finalize project proposal",
    description: "Complete the final draft of the project proposal",
    status: "TODO",
    priority: "HIGH",
    dueDate: new Date("2023-09-15").toISOString(),
    createdAt: new Date("2023-09-01").toISOString(),
  },
  {
    id: "2",
    title: "Schedule team meeting",
    description: "Set up weekly sync meeting with the development team",
    status: "DONE",
    priority: "MEDIUM",
    dueDate: new Date("2023-09-12").toISOString(),
    createdAt: new Date("2023-09-05").toISOString(),
  }
];

// Mock get all tasks
export const mockGetAllTasks = (): Promise<any> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ tasks: mockTasks });
    }, 600);
  });
};

// Export the mock API
export const mockApi = {
  auth: {
    login: mockLogin,
    register: mockRegister
  },
  tasks: {
    getAllTasks: mockGetAllTasks
  }
}; 