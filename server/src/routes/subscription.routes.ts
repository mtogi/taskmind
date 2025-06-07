import express from 'express';
import { 
  getPlans,
  createCheckoutSession,
  createCustomerPortalSession,
  getCurrentSubscription,
  handleWebhook
} from '../controllers/subscription.controller';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// Public routes (no authentication required)
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

// Protected routes (authentication required)
router.get('/plans', getPlans);
router.get('/current', authenticate, getCurrentSubscription);
router.post('/create-checkout-session', authenticate, createCheckoutSession);
router.post('/create-portal-session', authenticate, createCustomerPortalSession);

export default router; 