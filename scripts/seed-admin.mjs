import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
  process.exit(1);
}

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  console.log('Admin user already exists');
  await prisma.$disconnect();
  process.exit(0);
}

const hash = await bcrypt.hash(password, 12);
await prisma.user.create({
  data: {
    email,
    passwordHash: hash,
    role: 'ADMIN'
  }
});

console.log('Admin user created');
await prisma.$disconnect();
