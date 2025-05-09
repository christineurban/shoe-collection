import { notFound } from 'next/navigation';
import { NailPolishDetails } from '@/components/NailPolishDetails';
import { getPolishById } from '@/lib/api/polish';
import { getBrands } from '@/lib/api/brands';
import { getColors } from '@/lib/api/colors';
import { getFinishes } from '@/lib/api/finishes';
import type { NailPolishWithRelations } from '@/types/polish';
import type { Rating } from '@prisma/client';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: PageProps) {
  const polish = await getPolishById(params.id);
  const brands = await getBrands();
  const colors = await getColors();
  const finishes = await getFinishes();

  if (!polish) {
    notFound();
  }

  const transformedPolish = {
    id: polish.id,
    brand: polish.brands.name,
    name: polish.name,
    imageUrl: polish.image_url,
    colors: polish.colors.map(c => c.color.name),
    finishes: polish.finishes.map(f => f.finish.name),
    rating: polish.rating as Rating | null,
    link: polish.link,
    coats: polish.coats,
    notes: polish.notes,
    lastUsed: polish.last_used,
    totalBottles: polish.total_bottles,
    emptyBottles: polish.empty_bottles,
    isOld: polish.is_old
  };

  return (
    <NailPolishDetails
      polish={transformedPolish}
    />
  );
}
