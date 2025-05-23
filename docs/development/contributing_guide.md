# Contributing to TaskMind 🤝

Thank you for your interest in contributing to TaskMind! This document provides guidelines and information for contributors to ensure a smooth and productive collaboration process.

## 📋 Table of Contents
- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Contribution Workflow](#contribution-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Development Resources](#development-resources)

## 🤲 Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. Please be respectful, constructive, and collaborative in all interactions.

### Our Standards
- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 Getting Started

### Prerequisites
Before contributing, ensure you have:
- Node.js 18+ installed
- npm or yarn package manager
- Git version control
- Code editor (VS Code recommended)
- MongoDB Atlas account (for database access)
- OpenAI API key (for AI features)

### First-Time Setup
1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/taskmind.git
   cd taskmind
   ```
3. **Add the upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-username/taskmind.git
   ```
4. **Install dependencies**:
   ```bash
   # Backend
   cd server && npm install
   
   # Frontend
   cd ../client && npm install
   ```

## 🛠️ Development Setup

### Environment Configuration

Create environment files for both client and server:

**Server Environment (server/.env)**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=http://localhost:3000
```

**Client Environment (client/.env)**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=TaskMind
REACT_APP_VERSION=1.0.0
```

### Development Servers

Start both servers in separate terminals:

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

### Database Setup

1. Create a MongoDB Atlas cluster or use local MongoDB
2. Create a database named `taskmind_dev`
3. Run the seed script to populate sample data:
   ```bash
   cd server
   npm run seed
   ```

## 🔄 Contribution Workflow

### Branch Strategy
- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical production fixes

### Step-by-Step Process

1. **Sync with upstream**:
   ```bash
   git checkout main
   git fetch upstream
   git merge upstream/main
   ```

2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** following coding standards

4. **Test your changes**:
   ```bash
   npm run test
   npm run lint
   ```

5. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

6. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request** on GitHub

## 📝 Coding Standards

### General Guidelines
- Write clean, readable, and maintainable code
- Follow existing code style and patterns
- Add comments for complex logic
- Use meaningful variable and function names
- Keep functions small and focused

### JavaScript/React Standards

**Code Style**:
```javascript
// Use modern JavaScript features
const getUserTasks = async (userId) => {
  try {
    const tasks = await Task.find({ userId });
    return tasks;
  } catch (error) {
    throw new Error(`Failed to fetch tasks: ${error.message}`);
  }
};

// React component structure
const TaskCard = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  
  return (
    <div className="task-card">
      {/* Component JSX */}
    </div>
  );
};
```

**Naming Conventions**:
- Variables and functions: `camelCase`
- Components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`
- Files: `camelCase` for utilities, `PascalCase` for components

### CSS/Styling Standards

**Tailwind CSS Usage**:
```javascript
// Preferred: Utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// Avoid: Inline styles unless absolutely necessary
<div style={{display: 'flex', padding: '16px'}}>
```

**Component Styling**:
- Use Tailwind utility classes primarily
- Create custom CSS classes only when necessary
- Follow mobile-first responsive design
- Maintain consistent spacing and typography

### API Development Standards

**Route Structure**:
```javascript
// routes/tasks.js
const express = require('express');
const router = express.Router();
const { getTasks, createTask } = require('../controllers/taskController');
const auth = require('../middleware/auth');

router.get('/', auth, getTasks);
router.post('/', auth, createTask);

module.exports = router;
```

**Error Handling**:
```javascript
// controllers/taskController.js
const getTasks = async (req, res) => {
  try {
    const tasks = await taskService.getUserTasks(req.user.id);
    res.json({ success: true, data: tasks });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

## 🧪 Testing Guidelines

### Testing Requirements
- All new features must include tests
- Maintain test coverage above 80%
- Write both unit and integration tests
- Test error handling and edge cases

### Frontend Testing
```javascript
// Example: Component test
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../TaskCard';

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    completed: false
  };

  it('renders task title correctly', () => {
    render(<TaskCard task={mockTask} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('calls onComplete when task is clicked', () => {
    const mockOnComplete = jest.fn();
    render(<TaskCard task={mockTask} onComplete={mockOnComplete} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockOnComplete).toHaveBeenCalledWith('1');
  });
});
```

### Backend Testing
```javascript
// Example: API test
const request = require('supertest');
const app = require('../app');

describe('POST /api/tasks', () => {
  it('should create a new task', async () => {
    const taskData = {
      title: 'New Task',
      description: 'Task description'
    };

    const response = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send(taskData)
      .expect(201);

    expect(response.body.data.title).toBe(taskData.title);
  });
});
```

### Running Tests
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test TaskCard.test.js
```

## 📬 Pull Request Process

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] Tests pass locally (`npm run test`)
- [ ] Linting passes (`npm run lint`)
- [ ] Documentation updated if needed
- [ ] Self-review completed
- [ ] Related issues referenced

### Pull Request Template
When creating a PR, please include:

```markdown
## Description
Brief description of changes made

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Manual testing completed
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code where necessary
- [ ] I have made corresponding changes to documentation
```

### Review Process
1. **Automated checks** must pass (CI/CD pipeline)
2. **Code review** by at least one maintainer
3. **Testing verification** in development environment
4. **Approval and merge** by project maintainer

## 🐛 Issue Reporting

### Bug Reports
When reporting bugs, please include:
- **Environment details** (OS, browser, Node.js version)
- **Steps to reproduce** the issue
- **Expected vs actual behavior**
- **Screenshots or error messages**
- **Possible solution** (if known)

### Feature Requests
For new features, please provide:
- **Clear description** of the proposed feature
- **Use case and motivation**
- **Possible implementation approach**
- **Alternative solutions considered**

### Issue Labels
- `bug` - Something isn't working
- `enhancement` - New feature or request
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed
- `documentation` - Improvements to documentation

## 📚 Development Resources

### Useful Commands
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run lint         # Check code style
npm run format       # Format code with Prettier

# Database
npm run seed         # Seed database with sample data
npm run migrate      # Run database migrations
npm run db:reset     # Reset database (development only)

# Deployment
npm run deploy       # Deploy to production
npm run preview      # Preview production build
```

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Node.js Documentation](https://nodejs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide)
- [MongoDB Manual](https://docs.mongodb.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Tools and Extensions
**Recommended VS Code Extensions**:
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer
- GitLens
- Prettier - Code formatter
- ESLint

## 💬 Communication

### Getting Help
- **GitHub Discussions** - General questions and discussions
- **GitHub Issues** - Bug reports and feature requests
- **Email** - mtoygarby@gmail.com for direct contact

### Response Times
- **Issues and PRs**: We aim to respond within 48 hours
- **Security issues**: Reported privately will be addressed within 24 hours
- **General questions**: Response within 72 hours

## 🎯 Development Priorities

### Current Focus Areas
1. **AI Feature Enhancement** - Improving accuracy and performance
2. **Mobile Responsiveness** - Better mobile user experience
3. **Performance Optimization** - Faster loading and interactions
4. **Test Coverage** - Achieving 90%+ coverage

### Future Roadmap
- Calendar integration
- Team collaboration features
- Mobile app development
- Advanced analytics

## 🏆 Recognition

Contributors will be recognized in:
- Project README.md
- Release notes
- Social media acknowledgments
- Future project opportunities

Thank you for contributing to TaskMind! Your efforts help make this project better for everyone. 🚀