'use client';

import React, { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  StyledCard,
  StyledContent,
  StyledImageContainer,
  StyledBrand,
  StyledTitle,
  StyledRating,
  StyledMetadata,
  StyledFinishes,
  StyledTag,
  StyledImage,
  StyledColorChip,
  StyledColorPreview,
  StyledChooseImageButton,
  StyledClickableArea,
  StyledBrandNameContainer,
} from './index.styled';
import { Rating } from '@prisma/client';

const formatRating = (rating: Rating): string => {
  return rating.replace('_PLUS', '+').replace('_MINUS', '-');
};

interface NailPolishCardProps {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  colors?: string[];
  finishes?: string[];
  rating?: Rating;
  onChooseImage?: (id: string) => void;
}

export const NailPolishCard: FC<NailPolishCardProps> = ({
  id,
  brand,
  name,
  imageUrl,
  colors = [],
  finishes = [],
  rating,
  onChooseImage
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleContentClick = () => {
    if (isAuthenticated) {
      setIsLoading(true);
      router.push(`/polish/${id}`);
    }
  };

  const handleImageAreaClick = () => {
    if (!isAuthenticated) return;

    // Go to details page if we have any image (including 'n/a')
    if (imageUrl !== null) {
      setIsLoading(true);
      router.push(`/polish/${id}`);
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
      {isLoading && <LoadingSpinner text="Loading polish details..." />}
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
                  aria-label="View details for nail polish"
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
                aria-label="Choose image for nail polish"
                $isAuthenticated={isAuthenticated}
              >
                Choose Image
              </StyledChooseImageButton>
            );
          })()}
        </StyledClickableArea>

        <StyledClickableArea
          as={StyledContent}
          onClick={(e) => {
            e.stopPropagation();
            handleContentClick();
          }}
          $isAuthenticated={isAuthenticated}
        >
          <StyledMetadata>
            <StyledBrandNameContainer>
              <StyledBrand>{brand}</StyledBrand>
              <StyledTitle>{name}</StyledTitle>
            </StyledBrandNameContainer>
            <StyledRating>{rating ? formatRating(rating) : 'Not Rated'}</StyledRating>
          </StyledMetadata>

          <StyledColorPreview>
            {colors?.map((color, index) => (
              <StyledColorChip key={index} $color={color} />
            ))}
          </StyledColorPreview>

          <StyledFinishes>
            {finishes?.map((finish, index) => (
              <StyledTag key={index} $type={finish}>
                {finish}
              </StyledTag>
            ))}
          </StyledFinishes>
        </StyledClickableArea>
      </StyledCard>
    </>
  );
};
