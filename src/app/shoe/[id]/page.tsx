'use client';

import { ShoeDetails } from '@/components/ShoeDetails';
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
        const response = await fetch(`/api/shoe/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch shoe details');
        }
        const data = await response.json();
        setShoe(data);
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
