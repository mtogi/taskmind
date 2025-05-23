# TaskMind Frontend 🎨

The React.js frontend for TaskMind - an AI-powered task management application.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend server running on port 5000

### Installation
```bash
cd client
npm install
```

### Development
```bash
npm start
```
Runs the app in development mode on [http://localhost:3000](http://localhost:3000).

### Build for Production
```bash
npm run build
```
Builds the app for production to the `build` folder.

## 🛠️ Tech Stack

- **React 18** - Modern UI library with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls
- **React Hook Form** - Efficient form handling
- **React Query** - Server state management
- **Framer Motion** - Smooth animations
- **React Hot Toast** - Beautiful notifications
- **React Icons** - Icon library

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Generic components (Button, Modal, etc.)
│   ├── layout/          # Layout components (Header, Sidebar)
│   ├── task/            # Task-specific components
│   └── auth/            # Authentication components
├── pages/               # Main application pages
│   ├── Dashboard.jsx
│   ├── TaskList.jsx
│   ├── Login.jsx
│   └── Profile.jsx
├── hooks/               # Custom React hooks
│   ├── useAuth.js
│   ├── useTasks.js
│   └── useAI.js
├── services/            # API service layer
│   ├── api.js           # Base API configuration
│   ├── taskService.js   # Task-related API calls
│   ├── authService.js   # Authentication API calls
│   └── aiService.js     # AI integration API calls
├── context/             # React Context providers
│   ├── AuthContext.js
│   └── TaskContext.js
├── utils/               # Utility functions
│   ├── dateHelpers.js
│   ├── taskHelpers.js
│   └── validators.js
└── styles/              # CSS/SCSS files
    ├── globals.css
    ├── components/
    └── variables.css
```

## 🎨 UI Components

### Common Components
- **Button** - Reusable button with variants
- **Modal** - Accessible modal dialogs
- **Input** - Form input components
- **Loading** - Loading states and spinners

### Layout Components
- **Header** - Navigation and user menu
- **Sidebar** - Main navigation sidebar
- **Layout** - Page layout wrapper

### Task Components
- **TaskCard** - Individual task display
- **TaskForm** - Task creation/editing form
- **TaskList** - Task list with filtering
- **TaskModal** - Task detail modal

### Auth Components
- **LoginForm** - User login form
- **RegisterForm** - User registration form
- **ProtectedRoute** - Route protection wrapper

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking

## 🌐 Environment Variables

Create a `.env` file in the client directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=TaskMind
```

## 🎯 Key Features

### AI Integration
- Natural language task input
- Smart categorization suggestions
- Intelligent subtask generation
- Priority scoring

### User Experience
- Responsive design (mobile-first)
- Dark/light theme toggle
- Smooth animations
- Keyboard shortcuts
- Drag-and-drop functionality

### Performance
- Code splitting
- Lazy loading
- Optimized re-renders
- Efficient state management

## 🧪 Testing

```bash
npm test
```

Tests are written using:
- **Jest** - Testing framework
- **React Testing Library** - Component testing
- **MSW** - API mocking

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Manual Deployment
```bash
npm run build
# Deploy the build folder to your hosting service
```

## 🤝 Contributing

1. Follow the component structure
2. Use TypeScript for type safety
3. Write tests for new components
4. Follow the existing code style
5. Update documentation

## 📝 Code Style

- **ESLint** for code linting
- **Prettier** for code formatting
- **Tailwind CSS** for styling
- **Conventional Commits** for commit messages

---

**Frontend Version**: 1.0.0  
**React Version**: 18.2.0  
**Last Updated**: May 23, 2025 