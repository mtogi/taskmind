import fs from 'fs';
import path from 'path';
import { format } from 'date-fns';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Log file paths
const errorLogPath = path.join(logsDir, 'error.log');
const infoLogPath = path.join(logsDir, 'info.log');
const accessLogPath = path.join(logsDir, 'access.log');

// Log levels
enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

// Log formatter
const formatLogMessage = (level: LogLevel, message: string, meta?: any): string => {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
  const metaString = meta ? `\n${JSON.stringify(meta, null, 2)}` : '';
  return `[${timestamp}] [${level}] ${message}${metaString}\n`;
};

// Write log to file
const writeToFile = (filePath: string, message: string): void => {
  fs.appendFileSync(filePath, message);
};

// Log error
export const logError = (message: string, error?: any): void => {
  const formattedMessage = formatLogMessage(
    LogLevel.ERROR,
    message,
    error ? {
      message: error.message,
      stack: error.stack,
      ...(typeof error === 'object' ? error : {}),
    } : undefined
  );
  
  console.error(formattedMessage);
  writeToFile(errorLogPath, formattedMessage);
};

// Log warning
export const logWarn = (message: string, meta?: any): void => {
  const formattedMessage = formatLogMessage(LogLevel.WARN, message, meta);
  console.warn(formattedMessage);
  writeToFile(errorLogPath, formattedMessage);
};

// Log info
export const logInfo = (message: string, meta?: any): void => {
  const formattedMessage = formatLogMessage(LogLevel.INFO, message, meta);
  console.info(formattedMessage);
  writeToFile(infoLogPath, formattedMessage);
};

// Log debug (only in development)
export const logDebug = (message: string, meta?: any): void => {
  if (process.env.NODE_ENV !== 'production') {
    const formattedMessage = formatLogMessage(LogLevel.DEBUG, message, meta);
    console.debug(formattedMessage);
    writeToFile(infoLogPath, formattedMessage);
  }
};

// Log HTTP access
export const logAccess = (req: any, res: any, responseTime: number): void => {
  const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
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
    
    logWarn(`HTTP ${res.statusCode} response`, errorDetails);
  }
  
  writeToFile(accessLogPath, message + '\n');
};

// Express middleware for logging HTTP requests
export const httpLogger = (req: any, res: any, next: any): void => {
  const startTime = Date.now();
  
  // Capture response finish event
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    logAccess(req, res, responseTime);
  });
  
  next();
}; 