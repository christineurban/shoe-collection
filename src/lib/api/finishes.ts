import { prisma } from '@/lib/prisma';

export async function getFinishes() {
  return prisma.finishes.findMany({
    orderBy: { name: 'asc' },
    select: { name: true }
  });
}
