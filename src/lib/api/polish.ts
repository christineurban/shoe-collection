import { prisma } from '@/lib/prisma';
import type { NailPolishWithRelations } from '@/types/polish';

export async function getPolishById(id: string): Promise<NailPolishWithRelations> {
  const polish = await prisma.nail_polish.findUnique({
    where: { id },
    include: {
      brands: true,
      colors: {
        include: {
          color: true
        }
      },
      finishes: {
        include: {
          finish: true
        }
      }
    }
  });

  if (!polish) {
    throw new Error('Polish not found');
  }

  return polish;
}
