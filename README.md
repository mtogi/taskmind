# TaskMind 🧠✅

[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://taskmind-app.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Live-blue)](https://taskmind-api.railway.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)

> An AI-powered task management application that transforms how you organize and prioritize your work through intelligent automation and natural language processing.

## 🌟 Overview

TaskMind combines traditional task management with cutting-edge AI technology to create a truly intelligent productivity assistant. Unlike conventional to-do apps, TaskMind understands your tasks in natural language, suggests smart categorizations, and helps break down complex projects into manageable steps.

### 🎯 Key Features

- **🤖 AI-Powered Task Processing**: Natural language task creation and smart categorization
- **📋 Intelligent Subtask Generation**: Automatically break down complex tasks
- **🎯 Smart Priority Scoring**: AI-driven priority recommendations based on context
- **📱 Responsive Design**: Seamless experience across desktop and mobile devices
- **🌙 Dark/Light Theme**: Customizable interface for any environment
- **🔐 Secure Authentication**: JWT-based user authentication and data protection

## 🚀 Live Demo

Experience TaskMind in action:
- **Frontend**: [https://taskmind-app.vercel.app](https://taskmind-app.vercel.app)
- **API Documentation**: [https://taskmind-api.railway.app/docs](https://taskmind-api.railway.app/docs)

### Demo Account
```
Email: demo@taskmind.com
Password: Demo123!
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls
- **React Hook Form** - Efficient form handling
- **React Query** - Server state management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **OpenAI API** - AI language model integration

### DevOps & Deployment
- **Vercel** - Frontend hosting
- **Railway** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **GitHub Actions** - CI/CD pipeline

## 🏁 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mtogi/taskmind.git
   cd taskmind
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install

   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Environment Setup**
   
   Create `.env` files in both client and server directories:
   
   **Server (.env)**
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key
   CLIENT_URL=http://localhost:3000
   ```
   
   **Client (.env)**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_APP_NAME=TaskMind
   ```

4. **Start Development Servers**
   ```bash
   # Terminal 1 - Start backend server
   cd server
   npm run dev

   # Terminal 2 - Start frontend server
   cd client
   npm start
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📖 Usage Examples

### Natural Language Task Creation
```
Input: "Schedule dentist appointment next Tuesday at 2pm"
Output: 
- Title: "Dentist appointment"
- Due Date: Next Tuesday, 2:00 PM
- Category: "Health" (AI suggested)
- Priority: Medium
```

### AI-Powered Subtask Generation
```
Input: "Plan birthday party"
AI Generated Subtasks:
- Send invitations to guests
- Order birthday cake
- Book venue or prepare space
- Buy decorations
- Plan activities and games
```

## 🏗️ Project Structure

```
taskmind/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── context/        # React Context providers
│   │   └── utils/          # Utility functions
│   ├── package.json
│   └── tailwind.config.js
├── server/                 # Node.js backend
│   ├── controllers/        # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── services/           # Business logic
│   ├── config/             # Configuration files
│   └── package.json
├── docs/                   # Project documentation
├── README.md
├── LICENSE
└── .gitignore
```

## 🔧 Development

### Available Scripts

**Frontend (client/)**
```bash
npm start          # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run lint       # Check code style
```

**Backend (server/)**
```bash
npm run dev        # Start with nodemon
npm start          # Start production server
npm run test       # Run tests
npm run seed       # Seed database with sample data
```

### Code Style

This project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for pre-commit hooks

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test TaskService.test.js
```

See [TESTING.md](./TESTING.md) for detailed testing guidelines.

## 🚀 Deployment

This application is deployed using:
- **Frontend**: Vercel (automatic deployments from main branch)
- **Backend**: Railway (connected to GitHub repository)
- **Database**: MongoDB Atlas

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 📊 Performance

- **Frontend**: Lighthouse score 95+ (Performance, Accessibility, Best Practices)
- **Backend**: Average API response time <300ms
- **Database**: Optimized queries with proper indexing
- **AI Processing**: Task categorization <2 seconds

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

### Quick Contribution Steps
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 API Documentation

For detailed API endpoint documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md).

### Quick API Reference
```bash
# Authentication
POST /api/auth/register    # User registration
POST /api/auth/login       # User login

# Tasks
GET    /api/tasks          # Get user tasks
POST   /api/tasks          # Create new task
PUT    /api/tasks/:id      # Update task
DELETE /api/tasks/:id      # Delete task

# AI Features
POST /api/ai/categorize          # AI categorization
POST /api/ai/parse-natural       # Natural language parsing
POST /api/ai/generate-subtasks   # Subtask generation
```

## 🐛 Known Issues

- AI suggestions may take longer during peak OpenAI API usage
- Mobile keyboard may occasionally cover input fields (iOS Safari)
- Large task lists (500+) may experience slower rendering

See [Issues](https://github.com/mtogi/taskmind/issues) for current bug reports and feature requests.

## 📈 Roadmap

### Version 1.1 (Next Release)
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Task templates and recurring tasks
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard

### Version 2.0 (Future)
- [ ] Mobile application (React Native)
- [ ] Offline functionality with sync
- [ ] Machine learning model for personalized suggestions
- [ ] Integration with popular productivity tools

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 👨‍💻 Author

**Mustafa Toygar Baykal**
- Email: mtoygarby@gmail.com
- LinkedIn: [Mustafa Toygar Baykal](https://linkedin.com/in/mbaykal)
- GitHub: [@mtogi](https://github.com/mtogi)
- Portfolio: [Coming Soon]

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for providing the AI capabilities
- [React](https://reactjs.org/) community for excellent documentation
- [Tailwind CSS](https://tailwindcss.com/) for the amazing utility-first framework
- [MongoDB](https://mongodb.com/) for the flexible database solution

## 📞 Support

If you have any questions or need help with the project:

1. Check the [documentation](./docs/)
2. Search [existing issues](https://github.com/mtogi/taskmind/issues)
3. Create a [new issue](https://github.com/mtogi/taskmind/issues/new)
4. Contact me directly at mtoygarby@gmail.com

---

⭐ **Star this repository if you find it helpful!**

Made with ❤️ and ☕ by Mustafa Toygar Baykal
