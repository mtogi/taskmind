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
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.getCurrentSubscription = exports.createCustomerPortalSession = exports.createCheckoutSession = exports.getPlans = void 0;
const uuid_1 = require("uuid");
const queries_1 = require("../database/queries");
const stripeService = __importStar(require("../services/stripe.service"));
// Get available subscription plans
const getPlans = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prices = yield stripeService.listPrices();
        // Format the response for the frontend
        const plans = prices.map((price) => {
            var _a;
            return ({
                id: price.id,
                name: price.product.name,
                description: price.product.description,
                amount: price.unit_amount / 100, // Convert from cents to dollars
                currency: price.currency,
                interval: (_a = price.recurring) === null || _a === void 0 ? void 0 : _a.interval,
                features: price.product.metadata.features
                    ? JSON.parse(price.product.metadata.features)
                    : [],
            });
        });
        return res.status(200).json(plans);
    }
    catch (error) {
        console.error('Error fetching plans:', error);
        return res.status(500).json({ message: 'Error fetching subscription plans.' });
    }
});
exports.getPlans = getPlans;
// Create a checkout session for subscription
const createCheckoutSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { priceId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        // Get user info to create or retrieve Stripe customer
        const user = yield queries_1.userQueries.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Create or get Stripe customer ID
        let stripeCustomerId = user.stripe_customer_id;
        if (!stripeCustomerId) {
            stripeCustomerId = yield stripeService.createCustomer(user.email, user.name);
            // Update user with Stripe customer ID
            yield queries_1.userQueries.update(userId, { stripe_customer_id: stripeCustomerId });
        }
        // Create checkout session
        const successUrl = `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
        const cancelUrl = `${req.headers.origin}/pricing`;
        const sessionUrl = yield stripeService.createCheckoutSession(stripeCustomerId, priceId, successUrl, cancelUrl);
        return res.status(200).json({ url: sessionUrl });
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        return res.status(500).json({ message: 'Error creating checkout session.' });
    }
});
exports.createCheckoutSession = createCheckoutSession;
// Create a customer portal session for managing subscription
const createCustomerPortalSession = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        // Get user info to retrieve Stripe customer
        const user = yield queries_1.userQueries.findById(userId);
        if (!user || !user.stripe_customer_id) {
            return res.status(404).json({ message: 'No subscription found.' });
        }
        // Create customer portal session
        const returnUrl = `${req.headers.origin}/settings`;
        const portalUrl = yield stripeService.createCustomerPortalSession(user.stripe_customer_id, returnUrl);
        return res.status(200).json({ url: portalUrl });
    }
    catch (error) {
        console.error('Error creating customer portal session:', error);
        return res.status(500).json({ message: 'Error creating customer portal session.' });
    }
});
exports.createCustomerPortalSession = createCustomerPortalSession;
// Get current subscription
const getCurrentSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(401).json({ message: 'Authentication required.' });
        }
        // Get user info to retrieve Stripe customer
        const user = yield queries_1.userQueries.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        // Get subscription from database
        const subscription = yield queries_1.subscriptionQueries.findByUserId(userId);
        // If no subscription data in our DB, return free plan
        if (!subscription || !subscription.stripe_subscription_id) {
            return res.status(200).json({
                plan: 'free',
                status: 'active',
                currentPeriodEnd: null,
            });
        }
        // Get subscription details from Stripe
        try {
            const stripeSubscription = yield stripeService.getSubscription(subscription.stripe_subscription_id);
            return res.status(200).json({
                plan: subscription.plan_id,
                status: stripeSubscription.status,
                currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
                cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
            });
        }
        catch (error) {
            // If Stripe subscription no longer exists, reset to free plan
            console.error('Error fetching Stripe subscription:', error);
            return res.status(200).json({
                plan: 'free',
                status: 'active',
                currentPeriodEnd: null,
            });
        }
    }
    catch (error) {
        console.error('Error fetching subscription:', error);
        return res.status(500).json({ message: 'Error fetching subscription details.' });
    }
});
exports.getCurrentSubscription = getCurrentSubscription;
// Process webhook events from Stripe
const handleWebhook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const signature = req.headers['stripe-signature'];
    if (!signature) {
        return res.status(400).json({ message: 'Missing Stripe signature' });
    }
    try {
        const event = yield stripeService.handleWebhook(signature, req.body);
        // Handle subscription-related events
        if (event.event.includes('customer.subscription')) {
            const subscription = event.subscription;
            if (!subscription) {
                return res.status(400).json({ message: 'Invalid event data' });
            }
            // Find user by Stripe customer ID
            const user = yield queries_1.userQueries.updateByEmail('', { stripe_customer_id: subscription.customer });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Update subscription in our database
            if (event.event === 'customer.subscription.created' ||
                event.event === 'customer.subscription.updated') {
                yield queries_1.subscriptionQueries.upsert({
                    id: (0, uuid_1.v4)(),
                    user_id: user.id,
                    plan_id: subscription.items.data[0].price.id,
                    status: subscription.status,
                    current_period_end: new Date(subscription.current_period_end * 1000),
                    stripe_subscription_id: subscription.id,
                });
            }
            else if (event.event === 'customer.subscription.deleted') {
                yield queries_1.subscriptionQueries.delete(user.id);
            }
        }
        return res.status(200).json({ received: true });
    }
    catch (error) {
        console.error('Webhook error:', error);
        return res.status(400).json({ message: 'Webhook error' });
    }
});
exports.handleWebhook = handleWebhook;
