import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/config';
import { userQueries } from '../database/queries';

interface DecodedToken {
  userId: string;
}

// Extend the Express Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required. No token provided.' });
    }

    // Extract the token
    const token = authHeader.split(' ')[1];

    // Special handling for test account with mock token
    if (token === 'mock-jwt-token-for-testing') {
      // For test account, find the user by email
      const testUser = await userQueries.findByEmail('test@taskmind.dev');
      
      if (!testUser) {
        return res.status(401).json({ message: 'Test user not found.' });
      }

      // Add the user to the request object
      req.user = { id: testUser.id };
      next();
      return;
    }

    // Regular JWT verification for real tokens
    const decoded = jwt.verify(token, config.jwtSecret) as DecodedToken;

    // Check if the user exists
    const user = await userQueries.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found.' });
    }

    // Add the user to the request object
    req.user = { id: user.id };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
}; 