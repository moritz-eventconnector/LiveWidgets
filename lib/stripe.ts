import Stripe from 'stripe';
import { getEnv } from '@/lib/env';

let stripeClient: Stripe | null = null;

export const getStripe = () => {
  if (stripeClient) {
    return stripeClient;
  }

  const env = getEnv();
  stripeClient = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20'
  });
  return stripeClient;
};
