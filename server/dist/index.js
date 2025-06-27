"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = __importDefault(require("./config/config"));
// Import routes
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const task_routes_1 = __importDefault(require("./routes/task.routes"));
const nlp_routes_1 = __importDefault(require("./routes/nlp.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const subscription_routes_1 = __importDefault(require("./routes/subscription.routes"));
// Import services
const schedulerService = __importStar(require("./services/scheduler.service"));
const logger = __importStar(require("./services/logger.service"));
// Import database connection
const connection_1 = require("./database/connection");
// Import security middleware
const security_middleware_1 = require("./middleware/security.middleware");
// Initialize Express app
const app = (0, express_1.default)();
const PORT = config_1.default.port;
// Security middleware
app.use(security_middleware_1.securityHeaders);
app.use((0, cors_1.default)());
// Special handling for Stripe webhooks (needs raw body)
app.use('/api/subscription/webhook', express_1.default.raw({ type: 'application/json' }));
// Regular middleware for other routes
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use(security_middleware_1.preventParamPollution); // Prevent parameter pollution
app.use(security_middleware_1.sanitizeData); // Sanitize data to prevent XSS
app.use(logger.httpLogger); // HTTP request logging
// Routes
app.use('/api/auth', security_middleware_1.authLimiter, auth_routes_1.default);
app.use('/api/tasks', security_middleware_1.apiLimiter, task_routes_1.default);
app.use('/api/nlp', security_middleware_1.apiLimiter, nlp_routes_1.default);
app.use('/api/projects', security_middleware_1.apiLimiter, project_routes_1.default);
app.use('/api/subscription', security_middleware_1.apiLimiter, subscription_routes_1.default);
// Health check route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to TaskMind API' });
});
// Error handling middleware
app.use((err, req, res, next) => {
    logger.logError('Unhandled error in request', err);
    res.status(500).json({
        message: 'An unexpected error occurred',
        error: config_1.default.nodeEnv === 'development' ? err.message : 'Internal Server Error'
    });
});
// Start server
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Test database connection
        const dbConnected = yield (0, connection_1.testConnection)();
        if (!dbConnected) {
            logger.logError('Failed to connect to database. Exiting...');
            process.exit(1);
        }
        app.listen(PORT, () => {
            logger.logInfo(`Server running on port ${PORT}`);
            // Initialize task scheduler
            if (config_1.default.enableScheduler) {
                schedulerService.initScheduler();
                logger.logInfo('Task scheduler initialized');
            }
        });
    }
    catch (error) {
        logger.logError('Failed to start server:', error);
        process.exit(1);
    }
});
startServer();
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.logError('Unhandled Promise Rejection', err);
    process.exit(1);
});
// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.logError('Uncaught Exception', err);
    process.exit(1);
});
// Handle graceful shutdown
process.on('SIGTERM', () => __awaiter(void 0, void 0, void 0, function* () {
    logger.logInfo('SIGTERM received, shutting down gracefully');
    // Stop scheduler
    schedulerService.stopScheduler();
    // Close database connection
    yield (0, connection_1.closeConnection)();
    process.exit(0);
}));
