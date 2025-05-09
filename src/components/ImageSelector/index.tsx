'use client';

import { useState } from 'react';
import {
  StyledContainer,
  StyledImageContainer,
  StyledImage,
  StyledContent,
  StyledName,
  StyledBrand,
  StyledImageInput,
  StyledImageInputLabel,
  StyledImageInputText,
  StyledImageInputIcon,
  StyledRemoveButton,
  StyledRemoveIcon,
  StyledLoadingSpinner,
  StyledLoadingText
} from './index.styled';
import { useRouter } from 'next/navigation';
import { Shoe } from '@/types/shoe';

interface ImageSelectorProps {
  shoe: Shoe;
  returnTo?: string;
  onImageSelected: (shoeId: string, imageUrl: string | null) => void;
  selectedImage: string | null;
}

export const ImageSelector: React.FC<ImageSelectorProps> = ({ shoe, returnTo, onImageSelected, selectedImage }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const { url } = await response.json();
      await handleImageSaved(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = () => {
    // Implement the logic to remove the image
  };

  const handleImageSaved = async (imageUrl: string) => {
    try {
      const response = await fetch(`/api/shoe/${shoe.id}/update-image`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to update shoe image');
      }

      if (returnTo) {
        router.push(returnTo);
      } else {
        router.push(`/shoe/${shoe.id}`);
      }

      onImageSelected(shoe.id, imageUrl);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update shoe image');
    }
  };

  return (
    <StyledContainer>
      <StyledImageContainer>
        <StyledImageInputLabel>
          <StyledImageInput
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isLoading}
          />
          <StyledImageInputIcon>+</StyledImageInputIcon>
          <StyledImageInputText>Add Image</StyledImageInputText>
        </StyledImageInputLabel>
        {isLoading && (
          <>
            <StyledLoadingSpinner />
            <StyledLoadingText>Uploading...</StyledLoadingText>
          </>
        )}
      </StyledImageContainer>
      <StyledContent>
        <StyledName>{shoe.name}</StyledName>
        <StyledBrand>{shoe.brand}</StyledBrand>
        {error && <div>Error: {error}</div>}
      </StyledContent>
    </StyledContainer>
  );
};
