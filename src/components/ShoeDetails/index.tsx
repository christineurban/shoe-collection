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
  StyledImageContainer,
  StyledImage,
  StyledContent,
  StyledName,
  StyledBrand,
  StyledDetails,
  StyledDetailItem,
  StyledDetailLabel,
  StyledDetailValue,
  StyledNotes,
  StyledNotesLabel,
  StyledNotesContent,
  StyledChooseImageButton,
  StyledChooseImageIcon,
  StyledChooseImageText,
  StyledLoadingSpinner,
  StyledLoadingText,
} from './index.styled';
import { useRouter } from 'next/navigation';

interface ShoeDetailsProps {
  shoe: Shoe;
  title?: string;
}

export const ShoeDetails = ({ shoe, title }: ShoeDetailsProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChooseImage = () => {
    router.push(`/shoe/${shoe.id}/select-image`);
  };

  return (
    <StyledContainer>
      <PageHeader title={title || `${shoe.brand} ${shoe.heelType} ${shoe.shoeType}`} />
      <StyledImageContainer>
        {!shoe.imageUrl ? (
          isAuthenticated ? (
            <StyledChooseImageButton onClick={handleChooseImage} disabled={isLoading}>
              {isLoading ? (
                <>
                  <StyledLoadingSpinner />
                  <StyledLoadingText>Loading...</StyledLoadingText>
                </>
              ) : (
                <>
                  <StyledChooseImageIcon>📷</StyledChooseImageIcon>
                  <StyledChooseImageText>Choose Image</StyledChooseImageText>
                </>
              )}
            </StyledChooseImageButton>
          ) : (
            <StyledChooseImageText>No image available</StyledChooseImageText>
          )
        ) : (
          <StyledImage src={shoe.imageUrl} alt={shoe.name} />
        )}
      </StyledImageContainer>
      <StyledContent>
        <StyledName>{shoe.name}</StyledName>
        <StyledBrand>{shoe.brand}</StyledBrand>
        <StyledDetails>
          <StyledDetailItem>
            <StyledDetailLabel>Color</StyledDetailLabel>
            <StyledDetailValue>{shoe.color}</StyledDetailValue>
          </StyledDetailItem>
          <StyledDetailItem>
            <StyledDetailLabel>Dress Style</StyledDetailLabel>
            <StyledDetailValue>{shoe.dressStyle}</StyledDetailValue>
          </StyledDetailItem>
          <StyledDetailItem>
            <StyledDetailLabel>Shoe Type</StyledDetailLabel>
            <StyledDetailValue>{shoe.shoeType}</StyledDetailValue>
          </StyledDetailItem>
          <StyledDetailItem>
            <StyledDetailLabel>Heel Type</StyledDetailLabel>
            <StyledDetailValue>{shoe.heelType}</StyledDetailValue>
          </StyledDetailItem>
          <StyledDetailItem>
            <StyledDetailLabel>Location</StyledDetailLabel>
            <StyledDetailValue>{shoe.location}</StyledDetailValue>
          </StyledDetailItem>
        </StyledDetails>
        {shoe.notes && (
          <StyledNotes>
            <StyledNotesLabel>Notes</StyledNotesLabel>
            <StyledNotesContent>{shoe.notes}</StyledNotesContent>
          </StyledNotes>
        )}
      </StyledContent>
    </StyledContainer>
  );
};
