import { PrismaClient } from '@prisma/client';
import { postgres } from '@prisma/adapter-postgresql';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const adapter = postgres(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['error', 'warn']
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
