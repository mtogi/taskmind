# TaskMind Backend 🚀

The Node.js/Express backend for TaskMind - an AI-powered task management application.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key

### Installation
```bash
cd server
npm install
```

### Environment Setup
Create a `.env` file in the server directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=http://localhost:3000
```

### Development
```bash
npm run dev
```
Starts the server with nodemon on [http://localhost:5000](http://localhost:5000).

### Production
```bash
npm start
```

## 🛠️ Tech Stack

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **OpenAI API** - AI language model integration
- **Bcrypt** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

## 📁 Project Structure

```
server/
├── controllers/         # Route controllers
│   ├── authController.js
│   ├── taskController.js
│   ├── userController.js
│   └── aiController.js
├── models/              # MongoDB models
│   ├── User.js
│   ├── Task.js
│   └── Category.js
├── middleware/          # Custom middleware
│   ├── auth.js          # JWT authentication
│   ├── validation.js    # Request validation
│   └── errorHandler.js  # Error handling
├── routes/              # API routes
│   ├── auth.js
│   ├── tasks.js
│   ├── users.js
│   └── ai.js
├── services/            # Business logic layer
│   ├── authService.js
│   ├── taskService.js
│   ├── aiService.js     # OpenAI integration
│   └── emailService.js
├── utils/               # Utility functions
│   ├── dateUtils.js
│   ├── validation.js
│   └── constants.js
├── config/              # Configuration files
│   ├── database.js
│   └── env.js
├── tests/               # Test files
│   ├── unit/
│   └── integration/
└── server.js            # Main server file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Tasks
- `GET /api/tasks` - Get user tasks (with filtering/pagination)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get specific task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PUT /api/tasks/:id/complete` - Mark task as complete

### AI Integration
- `POST /api/ai/categorize` - AI task categorization
- `POST /api/ai/generate-subtasks` - Generate subtasks
- `POST /api/ai/parse-natural-language` - Parse natural language input
- `POST /api/ai/priority-score` - Calculate AI priority score
- `GET /api/ai/suggestions` - Get task suggestions

### Categories
- `GET /api/categories` - Get user categories
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## 🗄️ Database Models

### User Model
```javascript
{
  email: String (unique),
  password: String (hashed),
  firstName: String,
  lastName: String,
  avatar: String,
  preferences: {
    theme: String,
    notifications: Boolean,
    aiSuggestions: Boolean
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Task Model
```javascript
{
  userId: ObjectId (ref: User),
  title: String,
  description: String,
  category: String,
  priority: Number (1-5),
  status: String (pending, in-progress, completed),
  dueDate: Date,
  estimatedTime: Number,
  actualTime: Number,
  subtasks: Array,
  tags: Array,
  aiGenerated: Boolean,
  aiScore: Number,
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}
```

### Category Model
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  color: String,
  icon: String,
  isDefault: Boolean,
  createdAt: Date
}
```

## 🤖 AI Integration

### OpenAI Features
- **Smart Categorization**: Automatically categorize tasks based on content
- **Natural Language Processing**: Parse natural language task input
- **Subtask Generation**: Break down complex tasks into manageable steps
- **Priority Scoring**: Calculate intelligent priority scores

### Example AI Service Usage
```javascript
const aiService = require('./services/aiService');

// Categorize a task
const category = await aiService.categorizeTask(taskTitle, taskDescription);

// Generate subtasks
const subtasks = await aiService.generateSubtasks(taskTitle, taskDescription);

// Parse natural language
const parsedTask = await aiService.parseNaturalLanguage(userInput);
```

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run seed` - Seed database with sample data

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - Bcrypt password encryption
- **Input Validation** - Express-validator for request validation
- **Rate Limiting** - Prevent API abuse
- **CORS Protection** - Cross-origin resource sharing
- **Helmet Security** - Security headers
- **Environment Variables** - Secure configuration management

## 🧪 Testing

```bash
npm test
```

Tests are written using:
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **MongoDB Memory Server** - In-memory database for testing

### Test Structure
```
tests/
├── unit/
│   ├── controllers/
│   ├── services/
│   └── utils/
└── integration/
    ├── auth.test.js
    ├── tasks.test.js
    └── ai.test.js
```

## 🚀 Deployment

### Railway (Recommended)
```bash
railway login
railway init
railway up
```

### Manual Deployment
1. Set environment variables
2. Install dependencies: `npm install`
3. Start server: `npm start`

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secure_jwt_secret
OPENAI_API_KEY=sk-...
CLIENT_URL=https://your-frontend-domain.com
```

## 📊 Monitoring & Logging

- **Morgan** - HTTP request logging
- **Error Handling** - Centralized error management
- **Health Check** - `/api/health` endpoint
- **Performance Monitoring** - Response time tracking

## 🤝 Contributing

1. Follow the MVC architecture
2. Write comprehensive tests
3. Use proper error handling
4. Follow the existing code style
5. Update API documentation

## 📝 Code Style

- **ESLint** for code linting
- **Prettier** for code formatting
- **Conventional Commits** for commit messages
- **JSDoc** for function documentation

---

**Backend Version**: 1.0.0  
**Node.js Version**: 18+  
**Last Updated**: May 23, 2025 