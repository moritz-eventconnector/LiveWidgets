import { getServerSession } from 'next-auth';
import { getAuthOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getSessionUser() {
  const session = await getServerSession(getAuthOptions());
  if (!session?.user?.id) {
    return null;
  }

  return prisma.user.findUnique({ where: { id: session.user.id } });
}

export async function getChannelForUser(userId: string) {
  return prisma.channel.findFirst({
    where: { ownerUserId: userId }
  });
}
