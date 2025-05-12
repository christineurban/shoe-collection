'use client';

import { FC, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  StyledCard,
  StyledImageContainer,
  StyledImage,
  StyledContent,
  StyledMetadata,
  StyledBrand,
  StyledTag,
  StyledChooseImageButton,
  StyledClickableArea,
  StyledTagsContainer,
  StyledBrandRow
} from './index.styled';

interface ShoeCardProps {
  id: string;
  brand: string;
  imageUrl: string | null;
  location?: string;
  dressStyle: string;
}

export const ShoeCard: FC<ShoeCardProps> = ({
  id,
  brand,
  imageUrl,
  location = '',
  dressStyle
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
        aria-label={isAuthenticated ? `View details for ${brand}` : brand}
        $isAuthenticated={isAuthenticated}
      >
        <StyledClickableArea
          as={StyledImageContainer}
          onClick={handleClick}
          $isAuthenticated={isAuthenticated}
        >
          {(() => {
            if (imageUrl) {
              return (
                <StyledImage
                  src={imageUrl}
                  alt={brand}
                  width={200}
                  height={200}
                />
              );
            }

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
          <StyledBrandRow>
            <StyledBrand>{brand}</StyledBrand>
            {location && <StyledTag $type="location">{location}</StyledTag>}
          </StyledBrandRow>
          <StyledMetadata>
            <StyledTagsContainer>
              {dressStyle && (
                <StyledTag $type="dressStyle" aria-label={`Dress style: ${dressStyle.toLowerCase() === 'either' ? 'Dressy/Casual' : dressStyle}`}>{dressStyle.toLowerCase() === 'either' ? 'Dressy/Casual' : dressStyle}</StyledTag>
              )}
            </StyledTagsContainer>
          </StyledMetadata>
        </StyledClickableArea>
      </StyledCard>
    </>
  );
};
