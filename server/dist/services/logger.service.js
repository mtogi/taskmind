"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpLogger = exports.logAccess = exports.logDebug = exports.logInfo = exports.logWarn = exports.logError = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const date_fns_1 = require("date-fns");
// Ensure logs directory exists
const logsDir = path_1.default.join(process.cwd(), 'logs');
if (!fs_1.default.existsSync(logsDir)) {
    fs_1.default.mkdirSync(logsDir, { recursive: true });
}
// Log file paths
const errorLogPath = path_1.default.join(logsDir, 'error.log');
const infoLogPath = path_1.default.join(logsDir, 'info.log');
const accessLogPath = path_1.default.join(logsDir, 'access.log');
// Log levels
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
    LogLevel["INFO"] = "INFO";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (LogLevel = {}));
// Log formatter
const formatLogMessage = (level, message, meta) => {
    const timestamp = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const metaString = meta ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `[${timestamp}] [${level}] ${message}${metaString}\n`;
};
// Write log to file
const writeToFile = (filePath, message) => {
    fs_1.default.appendFileSync(filePath, message);
};
// Log error
const logError = (message, error) => {
    const formattedMessage = formatLogMessage(LogLevel.ERROR, message, error ? Object.assign({ message: error.message, stack: error.stack }, (typeof error === 'object' ? error : {})) : undefined);
    console.error(formattedMessage);
    writeToFile(errorLogPath, formattedMessage);
};
exports.logError = logError;
// Log warning
const logWarn = (message, meta) => {
    const formattedMessage = formatLogMessage(LogLevel.WARN, message, meta);
    console.warn(formattedMessage);
    writeToFile(errorLogPath, formattedMessage);
};
exports.logWarn = logWarn;
// Log info
const logInfo = (message, meta) => {
    const formattedMessage = formatLogMessage(LogLevel.INFO, message, meta);
    console.info(formattedMessage);
    writeToFile(infoLogPath, formattedMessage);
};
exports.logInfo = logInfo;
// Log debug (only in development)
const logDebug = (message, meta) => {
    if (process.env.NODE_ENV !== 'production') {
        const formattedMessage = formatLogMessage(LogLevel.DEBUG, message, meta);
        console.debug(formattedMessage);
        writeToFile(infoLogPath, formattedMessage);
    }
};
exports.logDebug = logDebug;
// Log HTTP access
const logAccess = (req, res, responseTime) => {
    const timestamp = (0, date_fns_1.format)(new Date(), 'yyyy-MM-dd HH:mm:ss');
    const message = `[${timestamp}] ${req.method} ${req.originalUrl} ${res.statusCode} ${responseTime}ms`;
    // Log additional details for non-200 responses
    if (res.statusCode >= 400) {
        const errorDetails = {
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
            responseTime,
            ip: req.ip,
            userAgent: req.get('user-agent'),
            requestBody: req.method !== 'GET' ? req.body : undefined,
            requestQuery: Object.keys(req.query).length ? req.query : undefined,
            requestParams: Object.keys(req.params).length ? req.params : undefined,
        };
        (0, exports.logWarn)(`HTTP ${res.statusCode} response`, errorDetails);
    }
    writeToFile(accessLogPath, message + '\n');
};
exports.logAccess = logAccess;
// Express middleware for logging HTTP requests
const httpLogger = (req, res, next) => {
    const startTime = Date.now();
    // Capture response finish event
    res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        (0, exports.logAccess)(req, res, responseTime);
    });
    next();
};
exports.httpLogger = httpLogger;
