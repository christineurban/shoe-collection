'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImageSelector } from '@/components/ImageSelector';
import { PageHeader } from '@/components/PageHeader';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { Shoe } from '@/types/shoe';
import {
  StyledLink,
} from './page.styled';

export default function SelectImagePage({ params }: { params: { id: string } }) {
  return (
    <SuspenseBoundary>
      <SelectImagePageContent params={params} />
    </SuspenseBoundary>
  );
}

function SelectImagePageContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const response = await fetch(`/api/shoe/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch shoe details');
        const data = await response.json();
        setShoe(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch shoe details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShoe();
  }, [params.id]);

  const handleImageSaved = () => {
    const returnTo = searchParams.get('returnTo');
    if (!returnTo) {
      // If no returnTo parameter, return to the shoe details page
      router.push(`/shoe/${params.id}`);
    } else {
      // If returnTo parameter exists, use that path
      router.push(returnTo);
    }
    router.refresh();
  };

  if (isLoading) {
    return (
      <PageHeader title="Loading..." />
    );
  }

  if (error || !shoe) {
    return (
      <div>
        <PageHeader
          title="Error"
          description={error || 'Shoe not found'}
        />
        <StyledLink href="/">
          Return to Home
        </StyledLink>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Select Image for ${shoe.brand} ${shoe.heelType} ${shoe.shoeType}`}
        description="Paste an image from your clipboard to add it to this shoe"
      />
      <ImageSelector
        shoe={shoe}
        returnTo={searchParams.get('returnTo') || undefined}
        onImageSelected={() => {}}
        selectedImage={null}
      />
    </div>
  );
}
