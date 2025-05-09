'use client';

import { Suspense } from 'react';
import { ShoeDetails } from '@/components/ShoeDetails';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { getShoeById } from '@/lib/api/shoe';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Shoe } from '@/types/shoe';

interface PageProps {
  params: {
    id: string;
  };
}

export default function ShoePage({ params }: PageProps) {
  return (
    <SuspenseBoundary>
      <ShoePageContent id={params.id} />
    </SuspenseBoundary>
  );
}

function ShoePageContent({ id }: { id: string }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const data = await getShoeById(id);
        if (!data) {
          setError('Shoe not found');
          return;
        }
        setShoe({
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
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShoe();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !shoe) {
    return <div>{error || 'Shoe not found'}</div>;
  }

  const handleChooseImage = (id: string) => {
    router.push(`/shoe/${id}/select-image`);
  };

  return (
    <ShoeDetails
      shoe={shoe}
      onChooseImage={isAuthenticated ? handleChooseImage : undefined}
    />
  );
}
