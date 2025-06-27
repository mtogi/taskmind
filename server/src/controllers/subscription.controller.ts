import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { userQueries, subscriptionQueries } from '../database/queries';
import * as stripeService from '../services/stripe.service';

// Get available subscription plans
export const getPlans = async (req: Request, res: Response) => {
  try {
    const prices = await stripeService.listPrices();
    
    // Format the response for the frontend
    const plans = prices.map((price: any) => ({
      id: price.id,
      name: price.product.name,
      description: price.product.description,
      amount: price.unit_amount / 100, // Convert from cents to dollars
      currency: price.currency,
      interval: price.recurring?.interval,
      features: price.product.metadata.features 
        ? JSON.parse(price.product.metadata.features) 
        : [],
    }));
    
    return res.status(200).json(plans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return res.status(500).json({ message: 'Error fetching subscription plans.' });
  }
};

// Create a checkout session for subscription
export const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { priceId } = req.body;
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    
    // Get user info to create or retrieve Stripe customer
    const user = await userQueries.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Create or get Stripe customer ID
    let stripeCustomerId = user.stripe_customer_id;
    
    if (!stripeCustomerId) {
      stripeCustomerId = await stripeService.createCustomer(user.email, user.name);
      
      // Update user with Stripe customer ID
      await userQueries.update(userId, { stripe_customer_id: stripeCustomerId });
    }
    
    // Create checkout session
    const successUrl = `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${req.headers.origin}/pricing`;
    
    const sessionUrl = await stripeService.createCheckoutSession(
      stripeCustomerId,
      priceId,
      successUrl,
      cancelUrl
    );
    
    return res.status(200).json({ url: sessionUrl });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ message: 'Error creating checkout session.' });
  }
};

// Create a customer portal session for managing subscription
export const createCustomerPortalSession = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    
    // Get user info to retrieve Stripe customer
    const user = await userQueries.findById(userId);
    
    if (!user || !user.stripe_customer_id) {
      return res.status(404).json({ message: 'No subscription found.' });
    }
    
    // Create customer portal session
    const returnUrl = `${req.headers.origin}/settings`;
    const portalUrl = await stripeService.createCustomerPortalSession(
      user.stripe_customer_id,
      returnUrl
    );
    
    return res.status(200).json({ url: portalUrl });
  } catch (error) {
    console.error('Error creating customer portal session:', error);
    return res.status(500).json({ message: 'Error creating customer portal session.' });
  }
};

// Get current subscription
export const getCurrentSubscription = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    
    // Get user info to retrieve Stripe customer
    const user = await userQueries.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    
    // Get subscription from database
    const subscription = await subscriptionQueries.findByUserId(userId);
    
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
      const stripeSubscription = await stripeService.getSubscription(
        subscription.stripe_subscription_id
      );
      
      return res.status(200).json({
        plan: subscription.plan_id,
        status: stripeSubscription.status,
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
      });
    } catch (error) {
      // If Stripe subscription no longer exists, reset to free plan
      console.error('Error fetching Stripe subscription:', error);
      return res.status(200).json({
        plan: 'free',
        status: 'active',
        currentPeriodEnd: null,
      });
    }
  } catch (error) {
    console.error('Error fetching subscription:', error);
    return res.status(500).json({ message: 'Error fetching subscription details.' });
  }
};

// Process webhook events from Stripe
export const handleWebhook = async (req: Request, res: Response) => {
  const signature = req.headers['stripe-signature'] as string;
  
  if (!signature) {
    return res.status(400).json({ message: 'Missing Stripe signature' });
  }
  
  try {
    const event = await stripeService.handleWebhook(signature, req.body);
    
    // Handle subscription-related events
    if (event.event.includes('customer.subscription')) {
      const subscription = event.subscription;
      
      if (!subscription) {
        return res.status(400).json({ message: 'Invalid event data' });
      }
      
      // Find user by Stripe customer ID
      const user = await userQueries.updateByEmail('', { stripe_customer_id: subscription.customer as string });
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update subscription in our database
      if (event.event === 'customer.subscription.created' || 
          event.event === 'customer.subscription.updated') {
        
        await subscriptionQueries.upsert({
          id: uuidv4(),
          user_id: user.id,
          plan_id: subscription.items.data[0].price.id,
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000),
          stripe_subscription_id: subscription.id,
        });
      } else if (event.event === 'customer.subscription.deleted') {
        await subscriptionQueries.delete(user.id);
      }
    }
    
    return res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(400).json({ message: 'Webhook error' });
  }
}; 