import { prisma } from '@/lib/prisma';

export async function getBrands() {
  return prisma.brands.findMany({
    orderBy: { name: 'asc' },
    select: { name: true }
  });
}
