'use client';

import { FC } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
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
  heelType: string;
  shoeType: string;
}

export const ShoeCard: FC<ShoeCardProps> = ({
  id,
  brand,
  imageUrl,
  location = '',
  dressStyle,
  heelType,
  shoeType
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      router.push(`/shoe/${id}`);
    } else {
      router.push(`/login?returnTo=/shoe/${id}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  const title = `${brand} ${heelType} ${shoeType}`;

  return (
    <StyledCard
      onKeyDown={handleKeyDown}
      tabIndex={isAuthenticated ? 0 : -1}
      role={isAuthenticated ? "button" : "article"}
      aria-label={isAuthenticated ? `View details for ${title}` : title}
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
                alt={title}
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
          <StyledBrand>{title}</StyledBrand>
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
  );
};
