import { Router } from 'express';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Register route
router.post('/register', authController.register);

// Login route
router.post('/login', authController.login);

export default router; 