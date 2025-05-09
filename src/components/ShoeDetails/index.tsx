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
import { useRouter, useSearchParams } from 'next/navigation';

interface ShoeDetailsProps {
  shoe: Shoe;
  onChooseImage?: (id: string) => void;
}

export const ShoeDetails = ({ shoe, onChooseImage }: ShoeDetailsProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleChooseImage = async () => {
    if (!onChooseImage) return;
    setIsLoading(true);
    try {
      await onChooseImage(shoe.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer>
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
