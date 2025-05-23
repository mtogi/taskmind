# TaskMind Testing Guide 🧪

This document outlines the comprehensive testing strategy for TaskMind, including unit tests, integration tests, end-to-end tests, and quality assurance practices.

## 📋 Table of Contents

- [Testing Philosophy](#testing-philosophy)
- [Testing Pyramid](#testing-pyramid)
- [Test Environment Setup](#test-environment-setup)
- [Frontend Testing](#frontend-testing)
- [Backend Testing](#backend-testing)
- [API Testing](#api-testing)
- [End-to-End Testing](#end-to-end-testing)
- [AI Feature Testing](#ai-feature-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Test Coverage](#test-coverage)
- [Continuous Integration](#continuous-integration)
- [Testing Best Practices](#testing-best-practices)

## 🎯 Testing Philosophy

TaskMind follows a comprehensive testing approach that ensures:

- **Reliability**: All features work as expected under various conditions
- **Maintainability**: Tests serve as living documentation
- **Confidence**: Safe refactoring and feature additions
- **Quality**: High-quality user experience across all platforms

### Testing Principles

1. **Test Early, Test Often**: Write tests during development, not after
2. **Test Behavior, Not Implementation**: Focus on what the code does, not how
3. **Maintainable Tests**: Keep tests simple, readable, and focused
4. **Fast Feedback**: Prioritize fast-running tests for development workflow
5. **Realistic Testing**: Use realistic test data and scenarios

## 🏗️ Testing Pyramid

TaskMind implements a balanced testing pyramid:

```
        /\
       /  \
      / E2E \ (10-20%)
     /______\
    /        \
   / Integration \ (20-30%)
  /____________\
 /              \
/   Unit Tests    \ (50-70%)
/________________\
```

### Test Distribution
- **Unit Tests (50-70%)**: Individual component/function testing
- **Integration Tests (20-30%)**: API endpoints and database interactions
- **End-to-End Tests (10-20%)**: Complete user workflows

## 🛠️ Test Environment Setup

### Prerequisites

```bash
# Required Node.js and npm versions
node --version  # 18+
npm --version   # 8+

# Install test dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev supertest mongodb-memory-server
```

### Environment Configuration

Create test environment files:

#### Frontend Test Environment
```javascript
// client/.env.test
REACT_APP_API_URL=http://localhost:5001/api
REACT_APP_APP_NAME=TaskMind Test
REACT_APP_ENVIRONMENT=test
```

#### Backend Test Environment
```javascript
// server/.env.test
NODE_ENV=test
PORT=5001
MONGODB_URI=mongodb://localhost:27017/taskmind_test
JWT_SECRET=test_jwt_secret_for_testing_only
OPENAI_API_KEY=test_key_or_mock
```

### Test Database Setup

```javascript
// server/tests/setup/database.js
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
```

## ⚛️ Frontend Testing

### Component Testing Setup

```javascript
// client/src/setupTests.js
import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({ testIdAttribute: 'data-testid' });

// Mock API calls
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;
```

### React Component Tests

#### Basic Component Test
```javascript
// client/src/components/TaskCard/TaskCard.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskCard from './TaskCard';

const mockTask = {
  id: '1',
  title: 'Test Task',
  description: 'Test Description',
  status: 'pending',
  priority: 3,
  dueDate: '2025-05-25T10:00:00.000Z',
  category: 'Work'
};

describe('TaskCard Component', () => {
  it('renders task information correctly', () => {
    render(<TaskCard task={mockTask} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Work')).toBeInTheDocument();
  });

  it('handles task completion', async () => {
    const mockOnComplete = jest.fn();
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);
    
    const completeButton = screen.getByRole('button', { name: /complete/i });
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalledWith('1');
    });
  });

  it('displays priority indicator correctly', () => {
    render(<TaskCard task={mockTask} />);
    
    const priorityIndicator = screen.getByTestId('priority-indicator');
    expect(priorityIndicator).toHaveClass('priority-3');
  });
});
```

#### Form Component Test
```javascript
// client/src/components/TaskForm/TaskForm.test.js
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from './TaskForm';

describe('TaskForm Component', () => {
  it('submits form with valid data', async () => {
    const mockOnSubmit = jest.fn();
    const user = userEvent.setup();
    
    render(<TaskForm onSubmit={mockOnSubmit} />);
    
    await user.type(screen.getByLabelText(/title/i), 'New Task');
    await user.type(screen.getByLabelText(/description/i), 'Task description');
    await user.selectOptions(screen.getByLabelText(/priority/i), '4');
    
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        title: 'New Task',
        description: 'Task description',
        priority: 4
      });
    });
  });

  it('displays validation errors for empty fields', async () => {
    render(<TaskForm onSubmit={jest.fn()} />);
    
    fireEvent.click(screen.getByRole('button', { name: /create task/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });
  });
});
```

### Hook Testing

```javascript
// client/src/hooks/useTasks.test.js
import { renderHook, act } from '@testing-library/react';
import { useTasks } from './useTasks';

// Mock API
jest.mock('../services/taskService', () => ({
  getTasks: jest.fn(),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn()
}));

describe('useTasks Hook', () => {
  it('loads tasks on mount', async () => {
    const mockTasks = [{ id: '1', title: 'Test Task' }];
    require('../services/taskService').getTasks.mockResolvedValue(mockTasks);
    
    const { result } = renderHook(() => useTasks());
    
    await act(async () => {
      await result.current.loadTasks();
    });
    
    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.loading).toBe(false);
  });

  it('handles task creation', async () => {
    const newTask = { title: 'New Task', description: 'Description' };
    const createdTask = { id: '2', ...newTask };
    
    require('../services/taskService').createTask.mockResolvedValue(createdTask);
    
    const { result } = renderHook(() => useTasks());
    
    await act(async () => {
      await result.current.createTask(newTask);
    });
    
    expect(result.current.tasks).toContain(createdTask);
  });
});
```

## 🚀 Backend Testing

### API Route Testing

```javascript
// server/tests/routes/tasks.test.js
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/User');
const Task = require('../../models/Task');
const { generateToken } = require('../../utils/auth');

describe('Task Routes', () => {
  let authToken;
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    });
    
    authToken = generateToken(testUser._id);
  });

  describe('GET /api/tasks', () => {
    it('returns user tasks with authentication', async () => {
      const task = await Task.create({
        title: 'Test Task',
        userId: testUser._id,
        category: 'Work',
        priority: 3
      });

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].title).toBe('Test Task');
    });

    it('returns 401 without authentication', async () => {
      await request(app)
        .get('/api/tasks')
        .expect(401);
    });

    it('filters tasks by status', async () => {
      await Task.create([
        { title: 'Pending Task', userId: testUser._id, status: 'pending' },
        { title: 'Completed Task', userId: testUser._id, status: 'completed' }
      ]);

      const response = await request(app)
        .get('/api/tasks?status=pending')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data.tasks).toHaveLength(1);
      expect(response.body.data.tasks[0].status).toBe('pending');
    });
  });

  describe('POST /api/tasks', () => {
    it('creates new task with valid data', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        category: 'Personal',
        priority: 4,
        dueDate: '2025-05-25T10:00:00.000Z'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe(taskData.title);
      expect(response.body.data.userId).toBe(testUser._id.toString());
    });

    it('validates required fields', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('title');
    });
  });
});
```

### Service Layer Testing

```javascript
// server/tests/services/taskService.test.js
const taskService = require('../../services/taskService');
const Task = require('../../models/Task');
const User = require('../../models/User');

describe('Task Service', () => {
  let testUser;

  beforeEach(async () => {
    testUser = await User.create({
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      password: 'password123'
    });
  });

  describe('createTask', () => {
    it('creates task with AI categorization', async () => {
      const taskData = {
        title: 'Buy groceries',
        description: 'Weekly shopping',
        userId: testUser._id
      };

      const result = await taskService.createTask(taskData);

      expect(result.title).toBe(taskData.title);
      expect(result.category).toBeDefined();
      expect(result.aiGenerated).toBe(true);
    });

    it('handles AI service failures gracefully', async () => {
      // Mock AI service failure
      jest.spyOn(require('../../services/aiService'), 'categorizeTask')
        .mockRejectedValue(new Error('AI service unavailable'));

      const taskData = {
        title: 'Test Task',
        userId: testUser._id
      };

      const result = await taskService.createTask(taskData);

      expect(result.title).toBe(taskData.title);
      expect(result.category).toBe('General'); // Fallback category
      expect(result.aiGenerated).toBe(false);
    });
  });

  describe('getUserTasks', () => {
    it('returns paginated results', async () => {
      // Create 25 tasks
      const tasks = Array.from({ length: 25 }, (_, i) => ({
        title: `Task ${i + 1}`,
        userId: testUser._id
      }));
      await Task.insertMany(tasks);

      const result = await taskService.getUserTasks(testUser._id, {
        page: 1,
        limit: 10
      });

      expect(result.tasks).toHaveLength(10);
      expect(result.pagination.totalItems).toBe(25);
      expect(result.pagination.totalPages).toBe(3);
    });
  });
});
```

## 🔗 API Testing

### Postman/Newman Integration

```json
// tests/api/TaskMind.postman_collection.json
{
  "info": {
    "name": "TaskMind API Tests",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register User",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"firstName\": \"John\",\n  \"lastName\": \"Doe\",\n  \"email\": \"john@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test('Status code is 201', function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  "pm.test('Response has token', function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData.data.token).to.be.a('string');",
                  "    pm.environment.set('authToken', jsonData.data.token);",
                  "});"
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### API Test Automation

```bash
# Run API tests with Newman
npm run test:api

# Generate API test report
newman run tests/api/TaskMind.postman_collection.json \
  --environment tests/api/test.postman_environment.json \
  --reporters html,cli \
  --reporter-html-export reports/api-tests.html
```

## 🎭 End-to-End Testing

### Playwright E2E Tests

```javascript
// e2e/tests/task-management.spec.js
import { test, expect } from '@playwright/test';

test.describe('Task Management Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[data-testid=email-input]', 'test@example.com');
    await page.fill('[data-testid=password-input]', 'password123');
    await page.click('[data-testid=login-button]');
    await page.waitForURL('/dashboard');
  });

  test('user can create and complete a task', async ({ page }) => {
    // Create task
    await page.click('[data-testid=add-task-button]');
    await page.fill('[data-testid=task-title-input]', 'E2E Test Task');
    await page.fill('[data-testid=task-description-input]', 'Testing task creation');
    await page.selectOption('[data-testid=task-priority-select]', '4');
    await page.click('[data-testid=create-task-button]');

    // Verify task appears in list
    await expect(page.locator('[data-testid=task-card]')).toContainText('E2E Test Task');

    // Complete task
    await page.click('[data-testid=task-complete-button]');
    await expect(page.locator('[data-testid=task-card]')).toHaveClass(/completed/);
  });

  test('AI categorization works correctly', async ({ page }) => {
    await page.click('[data-testid=add-task-button]');
    await page.fill('[data-testid=task-title-input]', 'Schedule dentist appointment');
    
    // Wait for AI categorization
    await page.waitForTimeout(2000);
    
    const categoryValue = await page.inputValue('[data-testid=task-category-select]');
    expect(categoryValue).toBe('Health');
  });

  test('task filtering works correctly', async ({ page }) => {
    // Apply filter
    await page.selectOption('[data-testid=status-filter]', 'completed');
    
    // Verify only completed tasks are shown
    const taskCards = page.locator('[data-testid=task-card]');
    await expect(taskCards).toHaveCount(0); // Assuming no completed tasks initially
  });
});
```

## 🤖 AI Feature Testing

### AI Service Testing

```javascript
// server/tests/services/aiService.test.js
const aiService = require('../../services/aiService');

describe('AI Service', () => {
  describe('categorizeTask', () => {
    it('categorizes health-related tasks correctly', async () => {
      const taskData = {
        title: 'Schedule dentist appointment',
        description: 'Regular checkup with Dr. Smith'
      };

      const result = await aiService.categorizeTask(taskData);

      expect(result.category).toBe('Health');
      expect(result.confidence).toBeGreaterThan(0.8);
    });

    it('handles ambiguous tasks with lower confidence', async () => {
      const taskData = {
        title: 'Do something',
        description: ''
      };

      const result = await aiService.categorizeTask(taskData);

      expect(result.confidence).toBeLessThan(0.5);
      expect(result.category).toBe('General');
    });
  });

  describe('parseNaturalLanguage', () => {
    it('extracts date and priority from natural language', async () => {
      const input = 'Schedule dentist appointment next Tuesday at 2pm, high priority';

      const result = await aiService.parseNaturalLanguage(input);

      expect(result.title).toContain('dentist appointment');
      expect(result.priority).toBeGreaterThan(3);
      expect(new Date(result.dueDate)).toBeInstanceOf(Date);
    });
  });

  describe('generateSubtasks', () => {
    it('generates relevant subtasks for complex tasks', async () => {
      const taskData = {
        title: 'Plan birthday party',
        description: 'Surprise party for my friend'
      };

      const result = await aiService.generateSubtasks(taskData);

      expect(result.subtasks).toHaveLength(3); // At least 3 subtasks
      expect(result.subtasks.some(task => 
        task.title.toLowerCase().includes('invitation')
      )).toBe(true);
    });
  });
});
```

### AI Mock Testing

```javascript
// server/tests/mocks/aiService.js
const aiService = {
  categorizeTask: jest.fn().mockImplementation(async (taskData) => {
    // Mock categorization logic
    if (taskData.title.toLowerCase().includes('doctor') || 
        taskData.title.toLowerCase().includes('dentist')) {
      return { category: 'Health', confidence: 0.95 };
    }
    if (taskData.title.toLowerCase().includes('work') || 
        taskData.title.toLowerCase().includes('meeting')) {
      return { category: 'Work', confidence: 0.90 };
    }
    return { category: 'General', confidence: 0.60 };
  }),

  parseNaturalLanguage: jest.fn().mockImplementation(async (input) => {
    return {
      title: input.split(' ').slice(0, 3).join(' '),
      priority: input.includes('high') ? 4 : 2,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      confidence: 0.85
    };
  }),

  generateSubtasks: jest.fn().mockImplementation(async (taskData) => {
    return {
      subtasks: [
        { title: 'Plan and prepare', estimatedTime: 30 },
        { title: 'Execute main task', estimatedTime: 60 },
        { title: 'Follow up and review', estimatedTime: 15 }
      ],
      confidence: 0.80
    };
  })
};

module.exports = aiService;
```

## ⚡ Performance Testing

### Load Testing with Artillery

```yaml
# tests/performance/load-test.yml
config:
  target: 'https://taskmind-api.railway.app'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 50
    - duration: 60
      arrivalRate: 100
  defaults:
    headers:
      Content-Type: 'application/json'

scenarios:
  - name: 'Task CRUD Operations'
    weight: 70
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'test@example.com'
            password: 'password123'
          capture:
            - json: '$.data.token'
              as: 'authToken'
      - get:
          url: '/api/tasks'
          headers:
            Authorization: 'Bearer {{ authToken }}'
      - post:
          url: '/api/tasks'
          headers:
            Authorization: 'Bearer {{ authToken }}'
          json:
            title: 'Load Test Task'
            description: 'Created during load testing'
            priority: 3

  - name: 'AI Features'
    weight: 30
    flow:
      - post:
          url: '/api/auth/login'
          json:
            email: 'test@example.com'
            password: 'password123'
          capture:
            - json: '$.data.token'
              as: 'authToken'
      - post:
          url: '/api/ai/categorize'
          headers:
            Authorization: 'Bearer {{ authToken }}'
          json:
            title: 'Schedule meeting with client'
            description: 'Quarterly review meeting'
```

### Frontend Performance Testing

```javascript
// e2e/performance/lighthouse.js
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
  
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance', 'accessibility', 'best-practices'],
    port: chrome.port,
  };

  const results = await lighthouse('https://taskmind-app.vercel.app', options);
  
  // Assert performance scores
  const performance = results.lhr.categories.performance.score * 100;
  const accessibility = results.lhr.categories.accessibility.score * 100;
  
  console.log(`Performance Score: ${performance}`);
  console.log(`Accessibility Score: ${accessibility}`);
  
  expect(performance).toBeGreaterThan(90);
  expect(accessibility).toBeGreaterThan(95);
  
  await chrome.kill();
}
```

## 🔒 Security Testing

### Authentication Testing

```javascript
// server/tests/security/auth.test.js
const request = require('supertest');
const app = require('../../app');

describe('Security Tests', () => {
  describe('Authentication Security', () => {
    it('prevents SQL injection in login', async () => {
      const maliciousPayload = {
        email: "admin'; DROP TABLE users; --",
        password: 'password'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(maliciousPayload)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('enforces rate limiting on auth endpoints', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      // Make multiple failed login attempts
      const promises = Array(20).fill().map(() =>
        request(app).post('/api/auth/login').send(loginData)
      );

      const responses = await Promise.all(promises);
      const rateLimitedResponses = responses.filter(r => r.status === 429);
      
      expect(rateLimitedResponses.length).toBeGreaterThan(0);
    });

    it('validates JWT tokens properly', async () => {
      const invalidToken = 'invalid.jwt.token';

      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body.message).toContain('Invalid token');
    });
  });

  describe('Input Validation', () => {
    it('sanitizes XSS attempts in task titles', async () => {
      const xssPayload = {
        title: '<script>alert("XSS")</script>',
        description: 'Normal description'
      };

      // This test would require authentication setup
      // Implementation depends on your sanitization approach
    });
  });
});
```

## 📊 Test Coverage

### Coverage Configuration

```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/setupTests.js',
    '!src/**/*.stories.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85
    }
  },
  coverageReporters: ['text', 'lcov', 'html']
};
```

### Coverage Analysis

```bash
# Generate coverage report
npm run test:coverage

# View detailed coverage
open coverage/lcov-report/index.html

# Coverage commands
npm run test:coverage:frontend
npm run test:coverage:backend
npm run test:coverage:combined
```

## 🔄 Continuous Integration

### GitHub Actions Test Workflow

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      
      - name: Install dependencies
        run: |
          cd client
          npm ci
      
      - name: Run tests
        run: |
          cd client
          npm run test:coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: client/coverage

  backend-tests:
    runs-on: ubuntu-latest
    services:
      mongodb:
        image: mongo:5.0
        ports:
          - 27017:27017
    
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
          cache-dependency-path: server/package-lock.json
      
      - name: Install dependencies
        run: |
          cd server
          npm ci
      
      - name: Run tests
        run: |
          cd server
          npm run test:coverage
        env:
          MONGODB_URI: mongodb://localhost:27017/taskmind_test
          JWT_SECRET: test_secret
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          directory: server/coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright
        run: npx playwright install
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📈 Testing Best Practices

### Test Organization

```
tests/
├── unit/              # Unit tests
│   ├── components/    # React component tests
│   ├── hooks/         # Custom hook tests
│   ├── utils/         # Utility function tests
│   └── services/      # Service layer tests
├── integration/       # Integration tests
│   ├── api/          # API endpoint tests
│   └── database/     # Database operation tests
├── e2e/              # End-to-end tests
│   ├── specs/        # Test specifications
│   └── fixtures/     # Test data
├── performance/      # Performance tests
├── security/         # Security tests
└── mocks/           # Mock implementations
```

### Test Data Management

```javascript
// tests/fixtures/testData.js
export const testUsers = {
  validUser: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'SecurePass123!'
  },
  adminUser: {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@example.com',
    password: 'AdminPass123!'
  }
};

export const testTasks = {
  basicTask: {
    title: 'Basic Test Task',
    description: 'Simple task for testing',
    priority: 3,
    category: 'General'
  },
  urgentTask: {
    title: 'Urgent Task',
    description: 'High priority task',
    priority: 5,
    category: 'Work',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
};
```

### Test Utilities

```javascript
// tests/utils/testHelpers.js
export const createAuthenticatedUser = async () => {
  const user = await User.create(testUsers.validUser);
  const token = generateToken(user._id);
  return { user, token };
};

export const createTestTask = async (userId, overrides = {}) => {
  return await Task.create({
    ...testTasks.basicTask,
    userId,
    ...overrides
  });
};

export const waitForElement = async (selector, timeout = 5000) => {
  return screen.findByTestId(selector, {}, { timeout });
};
```

## 🎯 Testing Commands

### Development Testing
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test TaskCard.test.js

# Run tests with coverage
npm run test:coverage

# Debug tests
npm run test:debug
```

### Production Testing
```bash
# Run production test suite
npm run test:prod

# Run performance tests
npm run test:performance

# Run security tests
npm run test:security

# Run all test types
npm run test:all
```

### Frontend Specific
```bash
# Component tests
npm run test:components

# Hook tests
npm run test:hooks

# Integration tests
npm run test:integration

# Accessibility tests
npm run test:a11y
```

### Backend Specific
```bash
# API tests
npm run test:api

# Database tests
npm run test:db

# Service tests
npm run test:services

# Authentication tests
npm run test:auth
```

---

## 📞 Testing Support

For testing-related questions:
- **Documentation Issues**: Create GitHub issue
- **Test Failures**: Check CI/CD logs and create issue
- **Performance Issues**: Run local performance tests first
- **Email**: mtoygarby@gmail.com for urgent testing support

---

*Last updated: May 23, 2025*  
*Testing framework versions: Jest 29, React Testing Library 13, Playwright 1.40*