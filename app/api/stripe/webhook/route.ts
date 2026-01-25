import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';

function resolvePlan(priceId?: string | null) {
  if (!priceId) return null;
  if (priceId === env.STRIPE_PRICE_ID_CREATOR_PLUS) return 'CREATOR_PLUS';
  if (priceId === env.STRIPE_PRICE_ID_CREATOR) return 'CREATOR';
  return null;
}

export async function POST(request: Request) {
  const sig = request.headers.get('stripe-signature');
  if (!sig) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return NextResponse.json(
      { error: `Webhook error: ${(error as Error).message}` },
      { status: 400 }
    );
  }

  await prisma.stripeEventLog.create({
    data: {
      eventId: event.id,
      eventType: event.type,
      payload: JSON.stringify(event)
    }
  });

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const subscriptionId = session.subscription as string | null;
    const customerId = session.customer as string | null;

    if (customerId && subscriptionId) {
      await prisma.channel.updateMany({
        where: { stripeCustomerId: customerId },
        data: {
          stripeSubscriptionId: subscriptionId,
          subscriptionStatus: 'ACTIVE'
        }
      });
    }
  }

  if (event.type === 'invoice.paid' || event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription;
    const priceId = subscription.items.data[0]?.price.id;
    const plan = resolvePlan(priceId);

    await prisma.channel.updateMany({
      where: { stripeCustomerId: subscription.customer as string },
      data: {
        subscriptionStatus: subscription.status === 'active' ? 'ACTIVE' : 'PAST_DUE',
        subscriptionPlan: plan ?? 'CREATOR'
      }
    });
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription;
    await prisma.channel.updateMany({
      where: { stripeCustomerId: subscription.customer as string },
      data: { subscriptionStatus: 'INACTIVE' }
    });
  }

  return NextResponse.json({ received: true });
}
