# TaskMind Setup Guide

This document outlines the setup process for the TaskMind application, including both frontend and backend components.

## Project Structure

```
taskmind/
├── app/                   # Next.js app folder
│   ├── components/        # React components
│   ├── api/               # API routes for Next.js
│   └── ...                # Pages, layouts, etc.
├── public/                # Static assets
├── styles/                # CSS and Tailwind styles
├── server/                # Backend server
│   ├── src/
│   │   ├── controllers/   # API controllers
│   │   ├── database/      # Database connection and queries
│   │   ├── middlewares/   # Express middlewares
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── utils/         # Utility functions
│   ├── .env               # Environment variables
│   └── ...                # Configuration files
└── ...                    # Configuration files, READMEs, etc.
```

## Frontend Setup

The frontend is built with Next.js 15+ and React 19+. It features a modern UI built with Tailwind CSS and shadcn/ui components.

## Backend Setup

The backend is built with Node.js, Express.js, and TypeScript. It uses PostgreSQL as the database with Supabase hosting and direct SQL queries.

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
- Supabase account
- Stripe account (for payments)
- OpenAI API key
- SMTP email service

### Step 1: Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/mtogi/taskmind.git
cd taskmind

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### Step 2: Set Up Supabase

1. Create a new project on [Supabase](https://supabase.com)
2. Go to Settings > Database to get your connection string
3. Note your project URL and service key

### Step 3: Configure Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database Configuration (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_SERVICE_KEY="[YOUR-SUPABASE-SERVICE-KEY]"

# JWT Configuration
JWT_SECRET="your_jwt_secret_key"
JWT_EXPIRES_IN="7d"

# OpenAI Configuration
OPENAI_API_KEY="your_openai_api_key"

# Stripe Configuration
STRIPE_SECRET_KEY="your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="your_stripe_webhook_secret"

# App Configuration
APP_URL="http://localhost:3000"
ENABLE_SCHEDULER=true

# Email Configuration
EMAIL_HOST="smtp.example.com"
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER="your_email_user"
EMAIL_PASSWORD="your_email_password"
EMAIL_FROM="noreply@taskmind.com"
```

### Step 4: Set Up Database

```bash
# From the server directory
cd server

# Create database tables
npm run db:setup

# Seed with test data (optional)
npm run db:seed
```

### Step 5: Start Development Servers

```bash
# Start backend (from server directory)
npm run dev

# Start frontend (from root directory, in a new terminal)
cd ..
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR, Unique)
- `password` (VARCHAR, Hashed)
- `name` (VARCHAR)
- `avatar` (VARCHAR, Optional)
- `is_email_verified` (BOOLEAN)
- `verification_token` (VARCHAR, Optional)
- `reset_password_token` (VARCHAR, Optional)
- `stripe_customer_id` (VARCHAR, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tasks Table
- `id` (UUID, Primary Key)
- `title` (VARCHAR)
- `description` (TEXT, Optional)
- `status` (VARCHAR, Default: 'TODO')
- `priority` (VARCHAR, Default: 'MEDIUM')
- `due_date` (TIMESTAMP, Optional)
- `reminder_sent` (BOOLEAN, Default: false)
- `assignee_id` (UUID, Foreign Key to Users)
- `project_id` (UUID, Foreign Key to Projects, Optional)
- `parent_task_id` (UUID, Foreign Key to Tasks, Optional)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Projects Table
- `id` (UUID, Primary Key)
- `name` (VARCHAR)
- `description` (TEXT, Optional)
- `owner_id` (UUID, Foreign Key to Users)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Project Members Table (Junction)
- `project_id` (UUID, Foreign Key to Projects)
- `user_id` (UUID, Foreign Key to Users)
- `created_at` (TIMESTAMP)

### Subscriptions Table
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to Users, Unique)
- `plan_id` (VARCHAR)
- `status` (VARCHAR)
- `current_period_end` (TIMESTAMP)
- `stripe_subscription_id` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Invitations Table
- `id` (UUID, Primary Key)
- `email` (VARCHAR)
- `token` (VARCHAR, Unique)
- `project_id` (UUID, Foreign Key to Projects)
- `invited_by_id` (UUID, Foreign Key to Users)
- `status` (VARCHAR, Default: 'PENDING')
- `expires_at` (TIMESTAMP)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Test Accounts

After running the seed script, you can use these test accounts:

- **Demo User**: `demo@taskmind.com` / `password123`
- **Test User**: `test@taskmind.dev` / `testpassword123`

## Development Features

### Mock API System

For frontend-only development, TaskMind includes a comprehensive mock API system:

- Located in `lib/mock-api.ts`
- Provides mock implementations of all API functions
- Automatically used when backend is unavailable
- Perfect for frontend development and demonstrations

### Offline Development

You can develop and test most frontend features without running the backend:

1. Start only the frontend: `npm run dev`
2. Use test account credentials to log in
3. All basic functionality works with mock data

## Database Commands

```bash
# Set up database tables
npm run db:setup

# Seed with test data
npm run db:seed

# Drop all tables (development only)
npm run db:setup drop
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check your Supabase credentials in `.env`
   - Ensure your Supabase project is active
   - Verify the connection string format

2. **Port Already in Use**
   - Change the port in the `.env` file
   - Kill existing processes using the port

3. **Environment Variables Missing**
   - Ensure all required variables are set in `.env`
   - Check the variable names match exactly

4. **Database Tables Not Created**
   - Run `npm run db:setup` to create tables
   - Check for any error messages during setup

### Getting Help

- Check the [README.md](README.md) for detailed information
- Review the [PROGRESS.md](PROGRESS.md) for development status
- Check the server logs for error messages
- Verify all environment variables are correctly set

## Production Deployment

For production deployment:

1. Set up a production Supabase database
2. Configure production environment variables
3. Set up proper CORS origins
4. Enable SSL/TLS
5. Configure monitoring and logging
6. Set up database backups
7. Use strong JWT secrets
8. Enable rate limiting

## License

MIT 