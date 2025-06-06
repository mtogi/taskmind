# TaskMind Setup Guide

This document outlines the setup process for the TaskMind application, including both frontend and backend components.

## Project Structure

```
taskmind-pro/
├── app/                   # Next.js app folder
│   ├── components/        # React components
│   ├── api/               # API routes for Next.js
│   └── ...                # Pages, layouts, etc.
├── public/                # Static assets
├── styles/                # CSS and Tailwind styles
├── server/                # Backend server
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── middlewares/   # Express middlewares
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── prisma/            # Prisma schema and migrations
│   └── ...                # Configuration files
└── ...                    # Configuration files, READMEs, etc.
```

## Frontend Setup

The frontend is built with Next.js 15+ and React 19+. It features a modern UI built with Tailwind CSS and shadcn/ui components.

## Backend Setup

The backend is built with Node.js, Express.js, and TypeScript. It uses PostgreSQL as the database with Prisma ORM for database access.

### Backend Components Implemented

1. **Authentication System**
   - User registration
   - User login
   - JWT-based authentication

2. **Task Management**
   - CRUD operations for tasks
   - Task prioritization
   - Task assignment

3. **Natural Language Processing (NLP)**
   - Task text parsing using OpenAI API

4. **Database Schema**
   - User model
   - Task model
   - Project model
   - Subscription model
   - Invitation model

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- OpenAI API key
- Stripe API keys (for payment processing)

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/taskmind.git
cd taskmind
```

2. Set up the environment variables:
   - Copy `server/.env.example` to `server/.env`
   - Fill in the required values (database connection, API keys, etc.)

3. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

4. Set up the database:
```bash
cd server
npx prisma migrate dev
npx prisma generate
```

5. Seed the database with demo data (optional):
```bash
cd server
npm run db:seed
```

6. Start the development servers:
```bash
# On Unix/Linux/macOS
./dev.sh

# On Windows
dev.bat
```

7. Visit `http://localhost:3000` to see the application.

## Docker Setup

For Docker-based development:

```bash
# Start the Docker containers
docker-compose up

# Seed the database (optional)
docker-compose exec backend npm run db:seed
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in an existing user

### Tasks
- `GET /api/tasks` - Get all tasks for the authenticated user
- `GET /api/tasks/:id` - Get a specific task by ID
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update an existing task
- `DELETE /api/tasks/:id` - Delete a task

### Natural Language Processing
- `POST /api/nlp/parse-task` - Parse natural language into structured task data

## Additional Notes

- The authentication system is JWT-based
- The NLP component uses OpenAI's API for parsing natural language
- The database schema is defined in `server/prisma/schema.prisma`
- The frontend API client is defined in `lib/api.ts` 