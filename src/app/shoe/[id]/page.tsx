import { Suspense } from 'react';
import { ShoeDetails } from '@/components/ShoeDetails';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { getShoeById } from '@/lib/api/shoe';
import { Shoe } from '@/types/shoe';

interface PageProps {
  params: {
    id: string;
  };
}

export default async function ShoePage({ params }: PageProps) {
  try {
    const data = await getShoeById(params.id);
    const shoe: Shoe = {
      id: data.id,
      brand: data.brand.name,
      name: data.brand.name,
      imageUrl: data.image_url,
      color: data.color.name,
      dressStyle: data.dress_style.name,
      shoeType: data.shoe_type.name,
      heelType: data.heel_type.name,
      location: data.location.name,
      notes: data.notes,
      link: data.link
    };

    return (
      <SuspenseBoundary>
        <ShoeDetails
          shoe={shoe}
          title={`${shoe.brand} ${shoe.heelType} ${shoe.shoeType}`}
        />
      </SuspenseBoundary>
    );
  } catch (error) {
    return (
      <div>
        {error instanceof Error ? error.message : 'An error occurred'}
      </div>
    );
  }
}
