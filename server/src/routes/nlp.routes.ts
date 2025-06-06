import { Router } from 'express';
import * as nlpController from '../controllers/nlp.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Apply authentication middleware to all NLP routes
router.use(authenticate);

// Parse task text
router.post('/parse-task', nlpController.parseTaskText);

export default router; 