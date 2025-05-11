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
  StyledBrandNameContainer,
  StyledBrand,
  StyledTitle,
  StyledTag,
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
            if (imageUrl) {
              return (
                <StyledImage
                  src={imageUrl}
                  alt={`${brand} ${name}`}
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
