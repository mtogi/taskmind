<div align="center">
  <img src="public/placeholder-logo.png" alt="TaskMind Logo" width="150" height="150" style="border-radius: 10px;"/>
  
  # ✨ TaskMind ✨

  <p>AI-powered task management for the modern mind</p>
  
  [![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
</div>

## 🧠 About TaskMind

TaskMind revolutionizes task management with AI-powered organization, prioritization, and efficiency tools. Stop juggling tasks in your head and let TaskMind's intelligent system help you work smarter.

> "The mind is for having ideas, not holding them." – David Allen

## ✨ Features

- 🤖 **AI-Powered Processing** - Create tasks using natural language and let AI understand context automatically
- 📊 **Dashboard Overview** - Get a quick view of your productivity metrics and upcoming tasks
- 📅 **Calendar Integration** - Visualize your tasks and events in a calendar view
- 📈 **Analytics** - Track your productivity with detailed charts and insights
- 📱 **Multi-platform Support** - Access your tasks from any device with real-time sync

## 🛠️ Technology Stack

<table>
  <tr>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=nextjs" width="48" height="48" alt="Next.js" />
      <br>Next.js 15
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=ts" width="48" height="48" alt="TypeScript" />
      <br>TypeScript
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=tailwind" width="48" height="48" alt="Tailwind" />
      <br>Tailwind
    </td>
    <td align="center" width="96">
      <img src="https://skillicons.dev/icons?i=react" width="48" height="48" alt="React" />
      <br>React 19
    </td>
  </tr>
</table>

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mtogi/taskmind.git
   cd taskmind
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

- `/app` - Next.js application routes and pages
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and shared logic
- `/public` - Static assets

## License

MIT

## 📸 Screenshots

<details>
<summary>View screenshots</summary>
<br>

![Dashboard](https://placehold.co/600x400?text=Dashboard+Screenshot)
![Tasks](https://placehold.co/600x400?text=Tasks+Screenshot)
![Calendar](https://placehold.co/600x400?text=Calendar+Screenshot)

</details>


## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

## Recent Implementations

We've recently added several key features to the TaskMind application:

1. **Enhanced Calendar View**: Added a comprehensive calendar view that displays tasks based on their due dates with status indicators and priority badges.

2. **Natural Language Task Input**: Implemented a powerful natural language task input component that can parse free-text descriptions into structured task data using OpenAI integration.

3. **Email Notification System**: Added a complete email notification system for task reminders and user communications with professionally designed email templates.

4. **Security Enhancements**: Implemented rate limiting, XSS protection, parameter pollution prevention, and other security features to protect the application from various attacks.

5. **Logging System**: Added a structured logging system for better error tracking and monitoring of application performance.

6. **Mock API System**: Implemented a comprehensive mock API system that allows the frontend to function without a running backend server, perfect for development and demonstration.

7. **Test Account Functionality**: Added a robust test account system that works offline, allowing users to test the application without setting up the backend.

## Features

- Task management with prioritization
- Natural language task input
- Project organization
- Calendar view
- Email notifications
- User authentication and profile management
- Subscription management with Stripe

## Quick Test

The easiest way to try TaskMind is to use our test account:

1. Navigate to the login page at `/login`
2. Click on the "Use Test Account" button
3. You'll be automatically logged in using our test credentials:
   - Email: test@taskmind.dev
   - Password: testpassword123

Alternatively, you can go directly to `/test-login` for a simplified login experience.

## Development Features

### Mock API System

For development purposes, we've implemented a mock API system that allows the frontend to function without requiring the backend server to be running:

- Located in `lib/mock-api.ts`
- Provides mock implementations of authentication, tasks, and other API functions
- Automatically used as a fallback when the backend is unavailable
- Great for frontend-only development and demonstrations

To use the mock API:
1. Simply run the frontend without starting the backend server
2. The application will automatically detect connection issues and use mock data
3. Use the test account credentials to log in

### Offline Development

You can develop and test most frontend features without running the backend server:

1. Start only the frontend with `npm run dev`
2. Use the test account to log in
3. All basic functionality will work with mock data

## Tech Stack

### Frontend
- Next.js with React 19
- TypeScript
- Tailwind CSS
- shadcn/ui components

### Backend
- Node.js with Express
- TypeScript
- PostgreSQL with Prisma ORM
- JWT authentication
- OpenAI integration
- Stripe payment processing

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/taskmind.git
cd taskmind
```

2. Install dependencies
```bash
npm install --legacy-peer-deps
```

3. Create .env file in the server directory with the following variables:
```
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://username:password@localhost:5432/taskmind
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
APP_URL=http://localhost:3000
ENABLE_SCHEDULER=true
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email_user
EMAIL_PASSWORD=your_email_password
EMAIL_FROM=noreply@taskmind.com
```

4. Run Prisma migrations
```bash
cd server
npx prisma migrate dev
```

5. Start the development servers
```bash
# In Windows
dev.bat

# In Linux/macOS
./dev.sh

# Or manually
npm run dev
```

## License
MIT
