"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("../controllers/subscription.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
// Public routes (no authentication required)
router.post('/webhook', express_1.default.raw({ type: 'application/json' }), subscription_controller_1.handleWebhook);
// Protected routes (authentication required)
router.get('/plans', subscription_controller_1.getPlans);
router.get('/current', auth_1.authenticate, subscription_controller_1.getCurrentSubscription);
router.post('/create-checkout-session', auth_1.authenticate, subscription_controller_1.createCheckoutSession);
router.post('/create-portal-session', auth_1.authenticate, subscription_controller_1.createCustomerPortalSession);
exports.default = router;
