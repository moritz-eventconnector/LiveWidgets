import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password) {
  console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set');
  process.exit(1);
}

try {
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
} catch (error) {
  if (error?.code === 'P2021') {
    console.error('Database schema missing. Run prisma migrate deploy or prisma db push before seeding.');
  } else {
    console.error(error);
  }
  await prisma.$disconnect();
  process.exit(1);
}
