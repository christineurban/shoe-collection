import { prisma } from '@/lib/prisma';

export async function getColors() {
  return prisma.colors.findMany({
    orderBy: { name: 'asc' },
    select: { name: true }
  });
}
