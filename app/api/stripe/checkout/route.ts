import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';

export async function POST(request: Request) {
  const { priceId, channelId } = await request.json();

  if (!priceId || !channelId) {
    return NextResponse.json({ error: 'priceId and channelId required' }, { status: 400 });
  }

  const channel = await prisma.channel.findUnique({
    where: { id: channelId },
    include: { owner: true }
  });
  if (!channel) {
    return NextResponse.json({ error: 'Channel not found' }, { status: 404 });
  }

  let customerId = channel.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: channel.owner.email ?? undefined,
      metadata: { channelId }
    });
    customerId = customer.id;

    await prisma.channel.update({
      where: { id: channelId },
      data: { stripeCustomerId: customerId }
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${env.APP_URL}/app/billing?success=1`,
    cancel_url: `${env.APP_URL}/app/billing?canceled=1`,
    metadata: { channelId }
  });

  return NextResponse.json({ url: session.url });
}
