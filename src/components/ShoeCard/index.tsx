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
  StyledMetadata,
  StyledBrandNameContainer,
  StyledBrand,
  StyledTitle,
  StyledTag,
  StyledTagsContainer,
  StyledChooseImageButton,
  StyledClickableArea
} from './index.styled';

interface ShoeCardProps {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  location?: string;
}

export const ShoeCard: FC<ShoeCardProps> = ({
  id,
  brand,
  name,
  imageUrl,
  location = ''
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = () => {
    if (isAuthenticated) {
      setIsLoading(true);
      router.push(`/shoe/${id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isAuthenticated) return;

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
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
          onClick={handleClick}
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
                aria-label="View details for shoe"
                $isAuthenticated={isAuthenticated}
              >
                No Image
              </StyledChooseImageButton>
            );
          })()}
        </StyledClickableArea>

        <StyledClickableArea
          as={StyledContent}
          onClick={handleClick}
          $isAuthenticated={isAuthenticated}
        >
          <StyledMetadata>
            <StyledBrandNameContainer>
              <StyledBrand>{brand}</StyledBrand>
              <StyledTitle>{name}</StyledTitle>
            </StyledBrandNameContainer>
            {location && <StyledTag $type="location">{location}</StyledTag>}
          </StyledMetadata>
        </StyledClickableArea>
      </StyledCard>
    </>
  );
};
