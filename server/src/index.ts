import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/config';

// Import routes
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';
import nlpRoutes from './routes/nlp.routes';
import projectRoutes from './routes/project.routes';
import subscriptionRoutes from './routes/subscription.routes';

// Import services
import * as schedulerService from './services/scheduler.service';
import * as logger from './services/logger.service';

// Import database connection
import { testConnection, closeConnection } from './database/connection';

// Import security middleware
import {
  apiLimiter,
  authLimiter,
  securityHeaders,
  preventParamPollution,
  sanitizeData,
} from './middleware/security.middleware';

// Initialize Express app
const app = express();
const PORT = config.port;

// Security middleware
app.use(securityHeaders);
app.use(cors());

// Special handling for Stripe webhooks (needs raw body)
app.use('/api/subscription/webhook', express.raw({ type: 'application/json' }));

// Regular middleware for other routes
app.use(express.json());
app.use(morgan('dev'));
app.use(preventParamPollution); // Prevent parameter pollution
app.use(sanitizeData); // Sanitize data to prevent XSS
app.use(logger.httpLogger); // HTTP request logging

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/tasks', apiLimiter, taskRoutes);
app.use('/api/nlp', apiLimiter, nlpRoutes);
app.use('/api/projects', apiLimiter, projectRoutes);
app.use('/api/subscription', apiLimiter, subscriptionRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to TaskMind API' });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.logError('Unhandled error in request', err);
  
  res.status(500).json({
    message: 'An unexpected error occurred',
    error: config.nodeEnv === 'development' ? err.message : 'Internal Server Error'
  });
});

// Start server
const startServer = async () => {
  try {
    // Test database connection
    const dbConnected = await testConnection();
    if (!dbConnected) {
      logger.logError('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    app.listen(PORT, () => {
      logger.logInfo(`Server running on port ${PORT}`);
      
      // Initialize task scheduler
      if (config.enableScheduler) {
        schedulerService.initScheduler();
        logger.logInfo('Task scheduler initialized');
      }
    });
  } catch (error) {
    logger.logError('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  logger.logError('Unhandled Promise Rejection', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  logger.logError('Uncaught Exception', err);
  process.exit(1);
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  logger.logInfo('SIGTERM received, shutting down gracefully');
  
  // Stop scheduler
  schedulerService.stopScheduler();
  
  // Close database connection
  await closeConnection();
  
  process.exit(0);
}); 