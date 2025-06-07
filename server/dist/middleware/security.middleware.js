"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectValidationRules = exports.taskValidationRules = exports.userValidationRules = exports.handleValidationErrors = exports.sanitizeData = exports.preventParamPollution = exports.securityHeaders = exports.authLimiter = exports.apiLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const express_validator_1 = require("express-validator");
// Rate limiting configuration - explicitly configured for Express
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' },
});
// More strict rate limiting for authentication endpoints
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 auth requests per hour
    standardHeaders: true,
    legacyHeaders: false,
    message: { message: 'Too many authentication attempts, please try again after an hour' },
});
// Set security headers
exports.securityHeaders = (0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", 'js.stripe.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
            fontSrc: ["'self'", 'fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'res.cloudinary.com'],
            connectSrc: ["'self'", 'api.stripe.com'],
            frameSrc: ["'self'", 'hooks.stripe.com', 'js.stripe.com'],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: [],
        },
    },
    crossOriginEmbedderPolicy: false, // Needed for Stripe
});
// Prevent parameter pollution
exports.preventParamPollution = (0, hpp_1.default)();
// XSS prevention
const sanitizeData = (req, res, next) => {
    if (req.body) {
        // Simple function to recursively sanitize an object
        const sanitizeObject = (obj) => {
            if (typeof obj !== 'object' || obj === null) {
                return obj;
            }
            if (Array.isArray(obj)) {
                return obj.map(sanitizeObject);
            }
            const sanitized = {};
            for (const [key, value] of Object.entries(obj)) {
                if (typeof value === 'string') {
                    // Basic XSS protection for strings
                    sanitized[key] = value
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&#x27;')
                        .replace(/\//g, '&#x2F;');
                }
                else {
                    sanitized[key] = sanitizeObject(value);
                }
            }
            return sanitized;
        };
        req.body = sanitizeObject(req.body);
    }
    next();
};
exports.sanitizeData = sanitizeData;
// Error handler for validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation error',
            errors: errors.array()
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
// Common validation rules for user input
exports.userValidationRules = [
    (0, express_validator_1.body)('email').isEmail().withMessage('Please provide a valid email'),
    (0, express_validator_1.body)('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/).withMessage('Password must contain at least one number'),
    (0, express_validator_1.body)('name').isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
];
// Validation rules for task creation
exports.taskValidationRules = [
    (0, express_validator_1.body)('title').notEmpty().withMessage('Task title is required'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['TODO', 'IN_PROGRESS', 'DONE'])
        .withMessage('Status must be one of: TODO, IN_PROGRESS, DONE'),
    (0, express_validator_1.body)('priority')
        .optional()
        .isIn(['LOW', 'MEDIUM', 'HIGH'])
        .withMessage('Priority must be one of: LOW, MEDIUM, HIGH'),
    (0, express_validator_1.body)('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date in ISO 8601 format'),
];
// Validation rules for project creation
exports.projectValidationRules = [
    (0, express_validator_1.body)('name').notEmpty().withMessage('Project name is required'),
];
