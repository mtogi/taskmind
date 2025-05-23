# TaskMind API Documentation 📡

## Overview

The TaskMind API is a RESTful web service that provides comprehensive task management functionality with AI-powered features. This documentation covers all available endpoints, request/response formats, authentication, and error handling.

**Base URL**: `https://taskmind-api.railway.app/api`  
**Development URL**: `http://localhost:5000/api`  
**Version**: 1.0  
**Authentication**: JWT Bearer Token

## 📋 Table of Contents

- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
  - [Authentication Routes](#authentication-routes)
  - [User Management](#user-management)
  - [Task Management](#task-management)
  - [Category Management](#category-management)
  - [AI Integration](#ai-integration)
- [Data Models](#data-models)
- [Examples](#examples)

## 🔐 Authentication

TaskMind API uses JWT (JSON Web Token) based authentication. Include the token in the Authorization header for protected routes.

### Authentication Header
```http
Authorization: Bearer <your_jwt_token>
```

### Token Lifecycle
- **Expiration**: 24 hours
- **Refresh**: Automatic refresh on successful requests
- **Storage**: Store securely on client-side (localStorage/httpOnly cookies)

## ❌ Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": {
    "code": "ERROR_CODE",
    "details": "Additional error details"
  }
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created successfully
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

### Common Error Codes
- `VALIDATION_ERROR` - Request validation failed
- `AUTH_TOKEN_MISSING` - Authorization token not provided
- `AUTH_TOKEN_INVALID` - Invalid or expired token
- `USER_NOT_FOUND` - User does not exist
- `TASK_NOT_FOUND` - Task does not exist
- `AI_SERVICE_ERROR` - AI processing failed
- `DATABASE_ERROR` - Database operation failed

## ⚡ Rate Limiting

- **General API**: 100 requests per 15 minutes per IP
- **Authentication**: 10 requests per 15 minutes per IP
- **AI Endpoints**: 20 requests per minute per user

Rate limit headers included in responses:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1640995200
```

## 🛠️ API Endpoints

### Authentication Routes

#### Register User
Create a new user account.

```http
POST /api/auth/register
```

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "64b1234567890abcdef12345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "createdAt": "2025-05-23T10:30:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login User
Authenticate user and receive access token.

```http
POST /api/auth/login
```

**Request Body**:
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "64b1234567890abcdef12345",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User
Retrieve current authenticated user information.

```http
GET /api/auth/me
```

**Headers**:
```http
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "64b1234567890abcdef12345",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "preferences": {
      "theme": "light",
      "notifications": true,
      "aiSuggestions": true
    },
    "createdAt": "2025-05-23T10:30:00.000Z"
  }
}
```

#### Logout User
Invalidate current session token.

```http
POST /api/auth/logout
```

**Headers**:
```http
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### User Management

#### Update User Profile
Update current user's profile information.

```http
PUT /api/auth/profile
```

**Headers**:
```http
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "firstName": "John",
  "lastName": "Smith",
  "preferences": {
    "theme": "dark",
    "notifications": false,
    "aiSuggestions": true
  }
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    "id": "64b1234567890abcdef12345",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.doe@example.com",
    "preferences": {
      "theme": "dark",
      "notifications": false,
      "aiSuggestions": true
    }
  }
}
```

### Task Management

#### Get Tasks
Retrieve user's tasks with optional filtering and pagination.

```http
GET /api/tasks
```

**Query Parameters**:
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)
- `status` (string): Filter by status (`pending`, `in-progress`, `completed`)
- `category` (string): Filter by category name
- `priority` (number): Filter by priority (1-5)
- `search` (string): Search in title and description
- `sortBy` (string): Sort field (`createdAt`, `dueDate`, `priority`, `title`)
- `sortOrder` (string): Sort order (`asc`, `desc`)

**Example Request**:
```http
GET /api/tasks?status=pending&priority=4&sortBy=dueDate&sortOrder=asc&page=1&limit=10
```

**Headers**:
```http
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": "64b1234567890abcdef12345",
        "title": "Complete project proposal",
        "description": "Finalize the Q4 project proposal document",
        "category": "Work",
        "priority": 4,
        "status": "pending",
        "dueDate": "2025-05-25T09:00:00.000Z",
        "estimatedTime": 120,
        "tags": ["urgent", "proposal"],
        "subtasks": [
          {
            "id": "sub1",
            "title": "Research competitors",
            "completed": true,
            "createdAt": "2025-05-23T10:30:00.000Z"
          }
        ],
        "aiGenerated": false,
        "aiScore": 8.5,
        "createdAt": "2025-05-23T10:30:00.000Z",
        "updatedAt": "2025-05-23T11:15:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 48,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

#### Create Task
Create a new task.

```http
POST /api/tasks
```

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Buy groceries",
  "description": "Weekly grocery shopping at the supermarket",
  "category": "Personal",
  "priority": 2,
  "dueDate": "2025-05-24T18:00:00.000Z",
  "estimatedTime": 60,
  "tags": ["shopping", "weekly"],
  "subtasks": [
    {
      "title": "Make shopping list",
      "completed": false
    },
    {
      "title": "Check weekly deals",
      "completed": false
    }
  ]
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": "64b9876543210fedcba98765",
    "title": "Buy groceries",
    "description": "Weekly grocery shopping at the supermarket",
    "category": "Personal",
    "priority": 2,
    "status": "pending",
    "dueDate": "2025-05-24T18:00:00.000Z",
    "estimatedTime": 60,
    "tags": ["shopping", "weekly"],
    "subtasks": [
      {
        "id": "sub1",
        "title": "Make shopping list",
        "completed": false,
        "createdAt": "2025-05-23T12:00:00.000Z"
      },
      {
        "id": "sub2",
        "title": "Check weekly deals",
        "completed": false,
        "createdAt": "2025-05-23T12:00:00.000Z"
      }
    ],
    "aiGenerated": false,
    "createdAt": "2025-05-23T12:00:00.000Z",
    "updatedAt": "2025-05-23T12:00:00.000Z"
  }
}
```

#### Get Single Task
Retrieve details of a specific task.

```http
GET /api/tasks/:id
```

**Headers**:
```http
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "64b1234567890abcdef12345",
    "title": "Complete project proposal",
    "description": "Finalize the Q4 project proposal document",
    "category": "Work",
    "priority": 4,
    "status": "in-progress",
    "dueDate": "2025-05-25T09:00:00.000Z",
    "estimatedTime": 120,
    "actualTime": 45,
    "tags": ["urgent", "proposal"],
    "subtasks": [
      {
        "id": "sub1",
        "title": "Research competitors",
        "completed": true,
        "createdAt": "2025-05-23T10:30:00.000Z"
      }
    ],
    "aiGenerated": false,
    "aiScore": 8.5,
    "createdAt": "2025-05-23T10:30:00.000Z",
    "updatedAt": "2025-05-23T11:15:00.000Z"
  }
}
```

#### Update Task
Update an existing task.

```http
PUT /api/tasks/:id
```

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body** (partial update allowed):
```json
{
  "title": "Complete project proposal - URGENT",
  "status": "in-progress",
  "priority": 5,
  "actualTime": 45,
  "subtasks": [
    {
      "id": "sub1",
      "title": "Research competitors",
      "completed": true
    },
    {
      "title": "Draft executive summary",
      "completed": false
    }
  ]
}
```

**Response** (200):
```json
{
  "success": true,
  "message": "Task updated successfully",
  "data": {
    "id": "64b1234567890abcdef12345",
    "title": "Complete project proposal - URGENT",
    "status": "in-progress",
    "priority": 5,
    "actualTime": 45,
    "updatedAt": "2025-05-23T13:30:00.000Z"
  }
}
```

#### Delete Task
Delete a task permanently.

```http
DELETE /api/tasks/:id
```

**Headers**:
```http
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### Complete Task
Mark a task as completed.

```http
PUT /api/tasks/:id/complete
```

**Headers**:
```http
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Task marked as completed",
  "data": {
    "id": "64b1234567890abcdef12345",
    "status": "completed",
    "completedAt": "2025-05-23T14:00:00.000Z",
    "updatedAt": "2025-05-23T14:00:00.000Z"
  }
}
```

### Category Management

#### Get Categories
Retrieve user's categories.

```http
GET /api/categories
```

**Headers**:
```http
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "64b1111111111111111111111",
      "name": "Work",
      "color": "#3B82F6",
      "icon": "briefcase",
      "isDefault": true,
      "taskCount": 15,
      "createdAt": "2025-05-23T10:00:00.000Z"
    },
    {
      "id": "64b2222222222222222222222",
      "name": "Personal",
      "color": "#10B981",
      "icon": "user",
      "isDefault": true,
      "taskCount": 8,
      "createdAt": "2025-05-23T10:00:00.000Z"
    }
  ]
}
```

#### Create Category
Create a new category.

```http
POST /api/categories
```

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "Health & Fitness",
  "color": "#EF4444",
  "icon": "heart"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "Category created successfully",
  "data": {
    "id": "64b3333333333333333333333",
    "name": "Health & Fitness",
    "color": "#EF4444",
    "icon": "heart",
    "isDefault": false,
    "createdAt": "2025-05-23T15:00:00.000Z"
  }
}
```

### AI Integration

#### AI Task Categorization
Get AI suggestion for task category.

```http
POST /api/ai/categorize
```

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Schedule dentist appointment",
  "description": "Need to book a regular checkup with Dr. Smith"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "suggestedCategory": "Health",
    "confidence": 0.95,
    "reasoning": "Task involves medical appointment scheduling"
  }
}
```

#### Natural Language Task Parsing
Parse natural language input into structured task data.

```http
POST /api/ai/parse-natural-language
```

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "input": "Schedule dentist appointment next Tuesday at 2pm, high priority"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "title": "Schedule dentist appointment",
    "dueDate": "2025-05-27T14:00:00.000Z",
    "priority": 4,
    "category": "Health",
    "estimatedTime": 30,
    "confidence": 0.92
  }
}
```

#### Generate Subtasks
AI-powered subtask generation for complex tasks.

```http
POST /api/ai/generate-subtasks
```

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Plan birthday party",
  "description": "Organize a surprise birthday party for my friend"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "subtasks": [
      {
        "title": "Create guest list",
        "estimatedTime": 15
      },
      {
        "title": "Send invitations",
        "estimatedTime": 30
      },
      {
        "title": "Order birthday cake",
        "estimatedTime": 20
      },
      {
        "title": "Buy decorations",
        "estimatedTime": 45
      },
      {
        "title": "Plan activities and games",
        "estimatedTime": 60
      }
    ],
    "confidence": 0.88
  }
}
```

#### AI Priority Scoring
Calculate intelligent priority score for a task.

```http
POST /api/ai/priority-score
```

**Headers**:
```http
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Submit tax documents",
  "description": "Deadline is approaching for annual tax filing",
  "dueDate": "2025-05-30T23:59:59.000Z",
  "category": "Finance"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "priorityScore": 9,
    "reasoning": "High urgency due to approaching deadline and legal importance",
    "factors": {
      "urgency": 9,
      "importance": 8,
      "complexity": 6,
      "dependencies": 3
    }
  }
}
```

#### Get AI Suggestions
Receive personalized task suggestions based on user patterns.

```http
GET /api/ai/suggestions
```

**Headers**:
```http
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "focus_recommendation",
        "title": "Focus on Work tasks today",
        "description": "You have 3 high-priority work tasks due soon",
        "taskIds": ["64b1234567890abcdef12345", "64b1234567890abcdef12346"]
      },
      {
        "type": "overdue_reminder",
        "title": "2 tasks are overdue",
        "description": "Consider rescheduling or completing these tasks",
        "taskIds": ["64b1234567890abcdef12347"]
      }
    ],
    "productivity_insights": {
      "completed_today": 5,
      "completion_rate": 0.75,
      "most_productive_time": "09:00-11:00"
    }
  }
}
```

## 📊 Data Models

### User Model
```json
{
  "id": "string",
  "firstName": "string",
  "lastName": "string",
  "email": "string (unique)",
  "password": "string (hashed)",
  "avatar": "string (URL, optional)",
  "preferences": {
    "theme": "string (light|dark)",
    "notifications": "boolean",
    "aiSuggestions": "boolean"
  },
  "createdAt": "ISO 8601 date",
  "updatedAt": "ISO 8601 date"
}
```

### Task Model
```json
{
  "id": "string",
  "userId": "string (ref: User)",
  "title": "string (required)",
  "description": "string (optional)",
  "category": "string",
  "priority": "number (1-5)",
  "status": "string (pending|in-progress|completed)",
  "dueDate": "ISO 8601 date (optional)",
  "estimatedTime": "number (minutes, optional)",
  "actualTime": "number (minutes, optional)",
  "subtasks": [
    {
      "id": "string",
      "title": "string",
      "completed": "boolean",
      "createdAt": "ISO 8601 date"
    }
  ],
  "tags": ["string"],
  "aiGenerated": "boolean",
  "aiScore": "number (0-10, optional)",
  "createdAt": "ISO 8601 date",
  "updatedAt": "ISO 8601 date",
  "completedAt": "ISO 8601 date (optional)"
}
```

### Category Model
```json
{
  "id": "string",
  "userId": "string (ref: User)",
  "name": "string (required)",
  "color": "string (hex color)",
  "icon": "string (icon name)",
  "isDefault": "boolean",
  "createdAt": "ISO 8601 date"
}
```

## 💡 Examples

### Complete Task Creation Flow
```javascript
// 1. Parse natural language input
const parseResponse = await fetch('/api/ai/parse-natural-language', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    input: "Schedule dentist appointment next Tuesday at 2pm"
  })
});

// 2. Create task with AI-parsed data
const taskData = await parseResponse.json();
const createResponse = await fetch('/api/tasks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(taskData.data)
});

// 3. Generate subtasks if needed
const task = await createResponse.json();
const subtasksResponse = await fetch('/api/ai/generate-subtasks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: task.data.title,
    description: task.data.description
  })
});
```

### Error Handling Example
```javascript
try {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(taskData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  const result = await response.json();
  console.log('Task created:', result.data);
} catch (error) {
  console.error('Error creating task:', error.message);
  // Handle different error types
  if (error.message.includes('validation')) {
    // Handle validation errors
  } else if (error.message.includes('authentication')) {
    // Redirect to login
  }
}
```

---

## 📞 Support

For API support and questions:
- **Documentation Issues**: Create an issue on GitHub
- **API Bugs**: Report via GitHub Issues
- **Integration Help**: Contact mtoygarby@gmail.com

**Response Time**: We aim to respond to API-related inquiries within 24 hours.

---

*Last updated: May 23, 2025*  
*API Version: 1.0*