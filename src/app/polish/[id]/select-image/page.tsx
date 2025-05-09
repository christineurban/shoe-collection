'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImageSelector } from '@/components/ImageSelector';
import { PageHeader } from '@/components/PageHeader';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import Link from 'next/link';
import {
  StyledErrorContainer,
  StyledErrorMessage,
  StyledLink,
  StyledLinkContainer,
  StyledDivider
} from './page.styled';

interface Polish {
  id: string;
  name: string;
  link: string | null;
  imageUrl: string | null;
  brand: string;
}

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
  const [polish, setPolish] = useState<Polish | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPolish = async () => {
      try {
        const response = await fetch(`/api/polish/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch polish details');
        const data = await response.json();
        setPolish(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolish();
  }, [params.id]);

  const handleImageSaved = () => {
    const returnTo = searchParams.get('returnTo');
    if (!returnTo) {
      // If no returnTo parameter, return to the polish details page
      router.push(`/polish/${params.id}`);
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

  if (error || !polish) {
    return (
      <div>
        <PageHeader
          title="Error"
          description={error || 'Polish not found'}
        />
        <StyledLink href="/">
          Return to Home
        </StyledLink>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`Select Image for ${polish.brand} - ${polish.name}`}
        description={polish.link
          ? 'Click on an image to select it, then click "Save Image" to update the database.'
          : 'Paste an image from your clipboard to add it to this polish.'}
      />
      <ImageSelector
        polish={polish}
        onImageSaved={handleImageSaved}
      />
      {!polish.link && (
        <StyledLinkContainer>
          <StyledDivider>or</StyledDivider>
          <StyledLink href={`/polish/${params.id}/edit`}>
            Add a source link to fetch images automatically
          </StyledLink>
        </StyledLinkContainer>
      )}
    </>
  );
}
