import { z } from 'zod';

const envSchema = z.object({
  APP_URL: z.string().url(),
  DATABASE_URL: z.string(),
  NEXTAUTH_SECRET: z.string(),
  NEXTAUTH_URL: z.string().url(),
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),
  STRIPE_PRICE_ID_CREATOR: z.string(),
  STRIPE_PRICE_ID_CREATOR_PLUS: z.string(),
  TWITCH_CLIENT_ID: z.string(),
  TWITCH_CLIENT_SECRET: z.string(),
  AUTHENTIK_ISSUER: z.string().url(),
  AUTHENTIK_CLIENT_ID: z.string(),
  AUTHENTIK_CLIENT_SECRET: z.string(),
  BOT_TWITCH_USERNAME: z.string(),
  BOT_TWITCH_OAUTH_TOKEN: z.string(),
  REDIS_PASSWORD: z.string(),
  ADMIN_EMAIL: z.string().email().optional(),
  ADMIN_PASSWORD: z.string().optional()
});

export const env = envSchema.parse({
  APP_URL: process.env.APP_URL,
  DATABASE_URL: process.env.DATABASE_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_PRICE_ID_CREATOR: process.env.STRIPE_PRICE_ID_CREATOR,
  STRIPE_PRICE_ID_CREATOR_PLUS: process.env.STRIPE_PRICE_ID_CREATOR_PLUS,
  TWITCH_CLIENT_ID: process.env.TWITCH_CLIENT_ID,
  TWITCH_CLIENT_SECRET: process.env.TWITCH_CLIENT_SECRET,
  AUTHENTIK_ISSUER: process.env.AUTHENTIK_ISSUER,
  AUTHENTIK_CLIENT_ID: process.env.AUTHENTIK_CLIENT_ID,
  AUTHENTIK_CLIENT_SECRET: process.env.AUTHENTIK_CLIENT_SECRET,
  BOT_TWITCH_USERNAME: process.env.BOT_TWITCH_USERNAME,
  BOT_TWITCH_OAUTH_TOKEN: process.env.BOT_TWITCH_OAUTH_TOKEN,
  REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
});
