import Stripe from 'stripe';
import config from '../config/config';

// Initialize Stripe
const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2023-10-16',
});

// Create a new customer in Stripe
export const createCustomer = async (email: string, name: string): Promise<string> => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        source: 'TaskMind App'
      }
    });
    
    return customer.id;
  } catch (error) {
    console.error('Error creating Stripe customer:', error);
    throw new Error('Failed to create customer');
  }
};

// Create a checkout session for subscription
export const createCheckoutSession = async (
  customerId: string,
  priceId: string,
  successUrl: string,
  cancelUrl: string
): Promise<string> => {
  try {
    const session = await stripe.checkout.sessions.create({
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
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw new Error('Failed to create checkout session');
  }
};

// Create a customer portal session
export const createCustomerPortalSession = async (
  customerId: string,
  returnUrl: string
): Promise<string> => {
  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    
    return session.url;
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    throw new Error('Failed to create customer portal session');
  }
};

// Fetch subscription information
export const getSubscription = async (subscriptionId: string) => {
  try {
    return await stripe.subscriptions.retrieve(subscriptionId);
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw new Error('Failed to fetch subscription information');
  }
};

// Cancel a subscription
export const cancelSubscription = async (subscriptionId: string): Promise<void> => {
  try {
    await stripe.subscriptions.cancel(subscriptionId);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription');
  }
};

// List available plans/prices
export const listPrices = async () => {
  try {
    const prices = await stripe.prices.list({
      active: true,
      limit: 10,
      expand: ['data.product'],
    });
    
    return prices.data;
  } catch (error) {
    console.error('Error listing prices:', error);
    throw new Error('Failed to list prices');
  }
};

// Handle Stripe webhooks
export const handleWebhook = async (
  signature: string,
  payload: Buffer
) => {
  try {
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      config.stripe.webhookSecret
    );
    
    // Handle specific events
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        return { event: event.type, subscription };
        
      case 'invoice.paid':
      case 'invoice.payment_failed':
        const invoice = event.data.object as Stripe.Invoice;
        return { event: event.type, invoice };
        
      default:
        return { event: event.type };
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    throw new Error('Webhook signature verification failed');
  }
}; 