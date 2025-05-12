'use client';

import { ShoeDetails } from '@/components/ShoeDetails';
import { getShoeById } from '@/lib/api/shoe';
import { Shoe } from '@/types/shoe';
import { PageHeader } from '@/components/PageHeader';
import { useEffect, useState } from 'react';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ShoePage({ params }: PageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const data = await getShoeById(params.id);
        const shoeData: Shoe = {
          id: data.id,
          brand: data.brand.name,
          name: data.brand.name,
          imageUrl: data.image_url,
          colors: data.colors.map(c => c.color.name),
          dressStyle: data.dress_style.name,
          shoeType: data.shoe_type.name,
          heelType: data.heel_type.name,
          location: data.location.name,
          notes: data.notes,
        };
        setShoe(shoeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShoe();
  }, [params.id]);

  if (isLoading) {
    return <PageHeader title="Loading..." />;
  }

  if (error) {
    return (
      <PageHeader
        title="Error"
        description={error}
      />
    );
  }

  if (!shoe) {
    return null;
  }

  return (
    <ShoeDetails
      shoe={shoe}
      title={`${shoe.brand} ${shoe.heelType} ${shoe.shoeType}`}
    />
  );
}
