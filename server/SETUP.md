# TaskMind Backend Setup Guide

## 🚀 Quick Start (No AI Features)

### 1. Environment Setup

Copy the example environment file and configure it:

```bash
cp config/env.example .env
```

Edit `.env` with your configuration:

```env
# Minimum required configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmind
JWT_SECRET=your_super_secure_jwt_secret_here_make_it_long_and_random
CLIENT_URL=http://localhost:3000
ENABLE_AI_FEATURES=false
```

### 2. MongoDB Setup

**Option A: Local MongoDB**
- Install MongoDB locally
- Start MongoDB service
- Database will be created automatically

**Option B: MongoDB Atlas (Recommended)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get your connection string
4. Replace `MONGODB_URI` in `.env`

### 3. Install Dependencies

```bash
npm install
```

### 4. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

### 5. Test the API

Health check:
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "TaskMind API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 📋 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/update-profile` - Update profile
- `PUT /api/auth/change-password` - Change password
- `POST /api/auth/logout` - Logout user

### Tasks
- `GET /api/tasks` - Get all tasks (with filtering, pagination)
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/complete` - Mark task as completed
- `GET /api/tasks/stats` - Get task statistics
- `GET /api/tasks/search?q=query` - Search tasks

### Users
- `GET /api/users/profile` - Get user profile
- `GET /api/users/dashboard` - Get dashboard data

## 🔧 Core Features Implemented

✅ **User Authentication**
- Registration with email verification
- Login/logout with JWT tokens
- Password reset functionality
- User profile management

✅ **Task Management**
- CRUD operations for tasks
- Task categories and tags
- Priority levels (1-5)
- Due dates and status tracking
- Subtasks support
- Soft delete and archive

✅ **Advanced Features**
- Full-text search
- Filtering and sorting
- Pagination
- Task statistics
- Bulk operations
- Overdue task detection

✅ **Security**
- JWT authentication
- Password hashing with bcrypt
- Rate limiting
- Input validation
- CORS protection

## 🎯 Ready for AI Integration

The codebase is structured to easily add AI features later:

```javascript
// Example: AI features can be toggled
if (process.env.ENABLE_AI_FEATURES === 'true') {
  // AI functionality here
}
```

When you're ready to add AI features, simply:
1. Set `ENABLE_AI_FEATURES=true`
2. Add your `OPENAI_API_KEY`
3. Implement AI controllers and services

## 🐛 Troubleshooting

**MongoDB Connection Issues:**
- Check if MongoDB is running
- Verify connection string in `.env`
- Ensure network access for Atlas

**JWT Token Issues:**
- Make sure `JWT_SECRET` is set
- Check token expiration settings

**Port Already in Use:**
- Change `PORT` in `.env`
- Kill existing processes on port 5000

## 📝 Next Steps

1. **Set up MongoDB** (Atlas recommended)
2. **Configure environment variables**
3. **Start the server**
4. **Test with Postman or curl**
5. **Build the React frontend**
6. **Deploy to production**

The backend is now ready for your React frontend to connect to! 