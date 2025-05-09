'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  StyledCard,
  StyledImageContainer,
  StyledImage,
  StyledContent,
  StyledName,
  StyledBrand,
  StyledChooseImageButton,
  StyledClickableArea
} from './index.styled';

interface ShoeCardProps {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  color?: string;
  dressStyle?: string;
  shoeType?: string;
  heelType?: string;
  location?: string;
  onChooseImage?: (id: string) => void;
}

export const ShoeCard: FC<ShoeCardProps> = ({
  id,
  brand,
  name,
  imageUrl,
  color = '',
  dressStyle = '',
  shoeType = '',
  heelType = '',
  location = '',
  onChooseImage
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleContentClick = () => {
    if (isAuthenticated) {
      setIsLoading(true);
      router.push(`/shoe/${id}`);
    }
  };

  const handleImageAreaClick = () => {
    if (!isAuthenticated) return;

    // Go to details page if we have any image (including 'n/a')
    if (imageUrl !== null) {
      setIsLoading(true);
      router.push(`/shoe/${id}`);
    } else {
      // Only go to image selection if there's no image at all
      onChooseImage?.(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isAuthenticated) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleContentClick();
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner text="Loading shoe details..." />}
      <StyledCard
        onKeyDown={handleKeyDown}
        tabIndex={isAuthenticated ? 0 : -1}
        role={isAuthenticated ? "button" : "article"}
        aria-label={isAuthenticated ? `View details for ${brand} ${name}` : `${brand} ${name}`}
        $isAuthenticated={isAuthenticated}
      >
        <StyledClickableArea
          as={StyledImageContainer}
          onClick={(e) => {
            e.stopPropagation();
            handleImageAreaClick();
          }}
          $isAuthenticated={isAuthenticated}
        >
          {(() => {
            // Case 1: Marked as no image available
            if (imageUrl === 'n/a') {
              return (
                <StyledChooseImageButton
                  type="button"
                  aria-label="View details for shoe"
                  $isNoImage
                  $isAuthenticated={isAuthenticated}
                >
                  ❌ Marked as no image
                </StyledChooseImageButton>
              );
            }

            // Case 2: Has an actual image
            if (imageUrl && imageUrl !== 'n/a') {
              return (
                <StyledImage
                  src={imageUrl}
                  alt={`${brand} ${name}`}
                  width={200}
                  height={200}
                />
              );
            }

            // Case 3: No image (null or undefined)
            return (
              <StyledChooseImageButton
                type="button"
                aria-label="Choose image for shoe"
                $isAuthenticated={isAuthenticated}
              >
                Choose Image
              </StyledChooseImageButton>
            );
          })()}
        </StyledClickableArea>
        <StyledContent onClick={handleContentClick}>
          <StyledBrand>{brand}</StyledBrand>
          <StyledName>{name}</StyledName>
          {color && <div>Color: {color}</div>}
          {dressStyle && <div>Style: {dressStyle}</div>}
          {shoeType && <div>Type: {shoeType}</div>}
          {heelType && <div>Heel: {heelType}</div>}
          {location && <div>Location: {location}</div>}
        </StyledContent>
      </StyledCard>
    </>
  );
};
