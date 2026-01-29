import NextAuth, { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import AuthentikProvider from 'next-auth/providers/authentik';
import TwitchProvider from 'next-auth/providers/twitch';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcryptjs';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { env } from '@/lib/env';
import { fetchTwitchProfile } from '@/lib/twitch';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    AuthentikProvider({
      issuer: env.AUTHENTIK_ISSUER,
      clientId: env.AUTHENTIK_CLIENT_ID,
      clientSecret: env.AUTHENTIK_CLIENT_SECRET
    }),
    TwitchProvider({
      clientId: env.TWITCH_CLIENT_ID,
      clientSecret: env.TWITCH_CLIENT_SECRET,
      authorization: { params: { scope: 'user:read:email' } }
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user?.passwordHash) {
          return null;
        }

        const valid = await compare(credentials.password, user.passwordHash);
        if (!valid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.twitchLogin ?? user.email
        };
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'twitch' && account.access_token) {
        const profile = await fetchTwitchProfile(account.access_token);
        await prisma.user.update({
          where: { id: user.id },
          data: {
            twitchUserId: profile.id,
            twitchLogin: profile.login
          }
        });

        const existingChannel = await prisma.channel.findUnique({
          where: { twitchBroadcasterId: profile.id }
        });

        if (!existingChannel) {
          await prisma.channel.create({
            data: {
              slug: profile.login,
              ownerUserId: user.id,
              twitchBroadcasterId: profile.id,
              twitchBroadcasterLogin: profile.login,
              overlayToken: crypto.randomBytes(16).toString('hex'),
              subscriptionStatus: 'INACTIVE'
            }
          });
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.userId) {
        session.user.id = token.userId as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};

export const authHandler = NextAuth(authOptions);
