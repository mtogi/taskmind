"use strict";
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
exports.handleWebhook = exports.listPrices = exports.cancelSubscription = exports.getSubscription = exports.createCustomerPortalSession = exports.createCheckoutSession = exports.createCustomer = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../config/config"));
// Initialize Stripe
const stripe = new stripe_1.default(config_1.default.stripe.secretKey, {
    apiVersion: '2022-11-15',
});
// Create a new customer in Stripe
const createCustomer = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const customer = yield stripe.customers.create({
            email,
            name,
            metadata: {
                source: 'TaskMind App'
            }
        });
        return customer.id;
    }
    catch (error) {
        console.error('Error creating Stripe customer:', error);
        throw new Error('Failed to create customer');
    }
});
exports.createCustomer = createCustomer;
// Create a checkout session for subscription
const createCheckoutSession = (customerId, priceId, successUrl, cancelUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: successUrl,
            cancel_url: cancelUrl,
            metadata: {
                source: 'TaskMind App'
            }
        });
        return session.url || '';
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        throw new Error('Failed to create checkout session');
    }
});
exports.createCheckoutSession = createCheckoutSession;
// Create a customer portal session
const createCustomerPortalSession = (customerId, returnUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const session = yield stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,
        });
        return session.url;
    }
    catch (error) {
        console.error('Error creating customer portal session:', error);
        throw new Error('Failed to create customer portal session');
    }
});
exports.createCustomerPortalSession = createCustomerPortalSession;
// Fetch subscription information
const getSubscription = (subscriptionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return yield stripe.subscriptions.retrieve(subscriptionId);
    }
    catch (error) {
        console.error('Error fetching subscription:', error);
        throw new Error('Failed to fetch subscription information');
    }
});
exports.getSubscription = getSubscription;
// Cancel a subscription
const cancelSubscription = (subscriptionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield stripe.subscriptions.cancel(subscriptionId);
    }
    catch (error) {
        console.error('Error canceling subscription:', error);
        throw new Error('Failed to cancel subscription');
    }
});
exports.cancelSubscription = cancelSubscription;
// List available plans/prices
const listPrices = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prices = yield stripe.prices.list({
            active: true,
            limit: 10,
            expand: ['data.product'],
        });
        return prices.data;
    }
    catch (error) {
        console.error('Error listing prices:', error);
        throw new Error('Failed to list prices');
    }
});
exports.listPrices = listPrices;
// Handle Stripe webhooks
const handleWebhook = (signature, payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const event = stripe.webhooks.constructEvent(payload, signature, config_1.default.stripe.webhookSecret);
        // Handle specific events
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                const subscription = event.data.object;
                return { event: event.type, subscription };
            case 'invoice.paid':
            case 'invoice.payment_failed':
                const invoice = event.data.object;
                return { event: event.type, invoice };
            default:
                return { event: event.type };
        }
    }
    catch (error) {
        console.error('Error processing webhook:', error);
        throw new Error('Webhook signature verification failed');
    }
});
exports.handleWebhook = handleWebhook;
