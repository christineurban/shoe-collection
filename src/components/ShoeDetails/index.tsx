'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { useAuth } from '@/lib/auth/AuthContext';
import { Shoe } from '@/types/shoe';
import {
  StyledContainer,
  StyledDetails,
  StyledImageContainer,
  StyledImageActions,
  StyledDetailsContent,
  StyledDisabledMessage
} from './index.styled';
import { useRouter, useSearchParams } from 'next/navigation';

interface ShoeDetailsProps {
  shoe: Shoe;
  title?: string;
}

export const ShoeDetails = (props: ShoeDetailsProps) => {
  return (
    <SuspenseBoundary>
      <ShoeDetailsContent {...props} />
    </SuspenseBoundary>
  );
};

function ShoeDetailsContent({ shoe, title }: ShoeDetailsProps) {
  const [isRemovingImage, setIsRemovingImage] = useState(false);
  const [isMarkingNoImage, setIsMarkingNoImage] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const returnTo = searchParams.get('returnTo');

  const handleRemoveImage = async () => {
    try {
      setIsRemovingImage(true);
      const response = await fetch('/api/remove-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: shoe.id
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove image');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error removing image:', error);
      alert('Failed to remove image. Please try again.');
    } finally {
      setIsRemovingImage(false);
    }
  };

  const handleMarkNoImage = async () => {
    try {
      setIsMarkingNoImage(true);
      const response = await fetch('/api/update-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: shoe.id,
          imageUrl: 'n/a'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark as no image available');
      }

      window.location.reload();
    } catch (error) {
      console.error('Error marking as no image available:', error);
      alert('Failed to mark as no image available. Please try again.');
    } finally {
      setIsMarkingNoImage(false);
    }
  };

  return (
    <StyledContainer>
      <PageHeader
        title={title || `${shoe.brand} ${shoe.heelType} ${shoe.shoeType}`}
      />
      <StyledDetails>
        <div>
          <StyledImageContainer>
            {shoe.imageUrl && shoe.imageUrl !== 'n/a' ? (
              <Image
                src={shoe.imageUrl}
                alt={`${shoe.brand} ${shoe.heelType} ${shoe.shoeType}`}
                fill
                priority
              />
            ) : shoe.imageUrl === 'n/a' ? (
              <p>❌ Marked as no image</p>
            ) : (
              <p>No image available</p>
            )}
          </StyledImageContainer>
          {isAuthenticated && (
            <StyledImageActions>
              {shoe.imageUrl !== 'n/a' && (
                <Button
                  onClick={() => router.push(`/shoe/${shoe.id}/select-image`)}
                >
                  {shoe.imageUrl ? 'Change Image' : 'Add Image'}
                </Button>
              )}
              {shoe.imageUrl && shoe.imageUrl !== 'n/a' && (
                <Button
                  onClick={handleRemoveImage}
                  disabled={isRemovingImage}
                  $variant="danger"
                >
                  Remove Image
                </Button>
              )}
              {!shoe.imageUrl && (
                <Button
                  onClick={handleMarkNoImage}
                  disabled={isMarkingNoImage}
                  $variant="tertiary"
                >
                  Mark as No Image Available
                </Button>
              )}
              {shoe.imageUrl === 'n/a' && (
                <Button
                  onClick={() => router.push(`/shoe/${shoe.id}/select-image`)}
                  $variant="secondary"
                >
                  Add Image
                </Button>
              )}
            </StyledImageActions>
          )}
        </div>
        <StyledDetailsContent>
          <h2>Details</h2>
          <p><strong>Color</strong>{shoe.color}</p>
          <p><strong>Dress Style</strong>{shoe.dressStyle}</p>
          <p><strong>Shoe Type</strong>{shoe.shoeType}</p>
          <p><strong>Heel Type</strong>{shoe.heelType}</p>
          <p><strong>Location</strong>{shoe.location}</p>
          <p><strong>Notes</strong>{shoe.notes || '-'}</p>
          {isAuthenticated ? (
            <Button onClick={() => router.push(`/shoe/${shoe.id}/edit?returnTo=${returnTo || `/shoe/${shoe.id}`}`)} $fullWidth>
              Edit Shoe
            </Button>
          ) : (
            <StyledDisabledMessage>
              Please log in to edit this shoe
            </StyledDisabledMessage>
          )}
        </StyledDetailsContent>
      </StyledDetails>
    </StyledContainer>
  );
}
