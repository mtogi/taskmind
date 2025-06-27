# TaskMind Backend Server

A Node.js/Express.js backend server for the TaskMind task management application, built with TypeScript and PostgreSQL using Supabase.

## 🚀 Features

- **Authentication**: JWT-based user authentication with bcrypt password hashing
- **Task Management**: Full CRUD operations for tasks with subtasks support
- **Project Management**: Create and manage projects with team collaboration
- **Natural Language Processing**: OpenAI integration for task parsing
- **Subscription Management**: Stripe integration for premium features
- **Email Notifications**: Automated task reminders and welcome emails
- **Scheduled Jobs**: Cron-based task reminder system
- **Security**: Rate limiting, CORS, helmet, and input sanitization

## 🛠️ Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL (hosted on Supabase)
- **Authentication**: JWT + bcrypt
- **Payment**: Stripe
- **AI**: OpenAI API
- **Email**: Nodemailer
- **Scheduling**: Cron jobs
- **Security**: Helmet, CORS, rate limiting

## 📋 Prerequisites

- Node.js 18+ 
- Supabase account and project
- Stripe account (for payments)
- OpenAI API key
- SMTP email service

## 🔧 Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory with the following variables:

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

### 3. Supabase Setup

1. Create a new project on [Supabase](https://supabase.com)
2. Go to Settings > Database to get your connection string
3. Replace the placeholders in your `.env` file with your actual Supabase credentials

### 4. Database Setup

Run the database setup script to create all necessary tables:

```bash
npm run db:setup
```

### 5. Seed Database (Optional)

Populate the database with test data:

```bash
npm run db:seed
```

This creates:
- Demo user: `demo@taskmind.com` / `password123`
- Test user: `test@taskmind.dev` / `testpassword123`

### 6. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:5000`

## 📊 Database Schema

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

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Tasks
- `GET /api/tasks` - Get all tasks for user
- `GET /api/tasks/:id` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/:taskId/subtasks` - Get subtasks

### Projects
- `GET /api/projects` - Get all projects for user
- `GET /api/projects/:id` - Get specific project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/stats` - Get project statistics

### Natural Language Processing
- `POST /api/nlp/parse` - Parse natural language task input

### Subscriptions
- `GET /api/subscription/plans` - Get available plans
- `POST /api/subscription/checkout` - Create checkout session
- `POST /api/subscription/portal` - Create customer portal session
- `GET /api/subscription/current` - Get current subscription
- `POST /api/subscription/webhook` - Stripe webhook handler

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents abuse of API endpoints
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers
- **Input Sanitization**: Prevents XSS attacks
- **Parameter Pollution Protection**: Prevents parameter pollution attacks

## 📧 Email System

The application includes automated email notifications:

- **Welcome Emails**: Sent to new users upon registration
- **Task Reminders**: Daily reminders for tasks due soon
- **Password Reset**: Secure password reset functionality

## ⏰ Scheduled Jobs

The scheduler service runs automated tasks:

- **Task Reminders**: Daily at 9:00 AM UTC, sends reminders for tasks due in the next 2 days

## 🧪 Testing

To run tests (when implemented):

```bash
npm test
```

## 🚀 Production Deployment

### Environment Variables
Ensure all environment variables are properly configured for production.

### Database
- Use Supabase production database
- Enable SSL connections
- Configure connection pooling

### Security
- Use strong JWT secrets
- Enable HTTPS
- Configure proper CORS origins
- Set up proper rate limiting

### Monitoring
- Set up logging and monitoring
- Configure error tracking
- Monitor database performance

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:setup` - Set up database tables
- `npm run db:seed` - Seed database with test data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API endpoints
- Check the database schema
- Review the environment configuration 