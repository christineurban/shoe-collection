import { prisma } from '@/lib/prisma';
import type { ShoeWithRelations } from '@/types/shoe';

export async function getShoeById(id: string): Promise<ShoeWithRelations> {
  const shoe = await prisma.shoes.findUnique({
    where: { id },
    include: {
      brand: true,
      color: true,
      dress_style: true,
      shoe_type: true,
      heel_type: true,
      location: true
    }
  });

  if (!shoe) {
    throw new Error('Shoe not found');
  }

  return shoe;
}
