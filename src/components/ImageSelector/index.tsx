'use client';

import { useState } from 'react';
import {
  StyledContainer,
  StyledImagesGrid,
  StyledImageContainer,
  StyledImage,
  StyledMetadata,
  StyledShoeLink,
  StyledImagePreviewContainer,
  StyledMetadataContainer,
  StyledActionsContainer,
  StyledButtonGroup,
  StyledCurrentImageContainer,
  StyledCurrentImage,
  StyledShoeCard,
} from './index.styled';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/Button';
import { ImagePasteZone } from './ImagePasteZone';
import { SuccessMessage } from '@/components/SuccessMessage';

interface Shoe {
  id: string;
  brand: string;
  imageUrl: string | null;
  colors: string[];
  dressStyle: string;
  shoeType: string;
  heelType: string;
  location: string;
  notes: string | null;
}

interface ImageSelectorProps {
  shoe: Shoe;
  onImageSaved?: () => void;
  bulkMode?: boolean;
  onImageSelected?: (id: string, imageUrl: string | null) => void;
  selectedImage?: string | null;
}

export const ImageSelector = ({
  shoe,
  onImageSaved,
  bulkMode = false,
  onImageSelected,
  selectedImage: externalSelectedImage
}: ImageSelectorProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(externalSelectedImage || null);
  const [images, setImages] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isCollapsed] = useState(false);

  const handleImageSelect = (imageUrl: string) => {
    if (bulkMode && onImageSelected) {
      onImageSelected(shoe.id, imageUrl);
    } else {
      setSelectedImage(imageUrl);
      if (onImageSelected) {
        onImageSelected(shoe.id, imageUrl);
      }
    }
  };

  const handleSaveImage = async () => {
    if (!selectedImage) return;

    try {
      setIsSaving(true);

      const response = await fetch('/api/update-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: shoe.id,
          imageUrl: selectedImage
        }),
      });

      if (response.ok) {
        setSuccessMessage('Image saved successfully!');
        setIsSuccess(true);
        if (onImageSaved) {
          setTimeout(() => {
            onImageSaved();
          }, 1500);
        } else {
          setTimeout(() => {
            setIsSuccess(false);
          }, 1500);
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save image');
      }
    } catch (error) {
      console.error('Error saving image:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePastedImage = (imageUrl: string) => {
    setImages(prevImages => [imageUrl, ...prevImages]);
    if (bulkMode && onImageSelected) {
      onImageSelected(shoe.id, imageUrl);
    } else {
      setSelectedImage(imageUrl);
    }
  };

  return (
    <AnimatePresence>
      <StyledContainer
        as={motion.div}
        initial={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledShoeCard>
          <StyledMetadata>
            <StyledMetadataContainer>
              <div>
                <StyledShoeLink href={`/shoe/${shoe.id}`}>
                  <h3>{shoe.brand} {shoe.heelType} {shoe.shoeType}</h3>
                </StyledShoeLink>
                <p>Colors: {shoe.colors.join(', ')}</p>
                <p>Location: {shoe.location}</p>
              </div>
              <StyledActionsContainer>
                <StyledButtonGroup>
                  {!bulkMode && (
                    <Button
                      onClick={handleSaveImage}
                      disabled={!selectedImage || isSaving}
                    >
                      {isSaving ? 'Saving...' : 'Save Image'}
                    </Button>
                  )}
                </StyledButtonGroup>
              </StyledActionsContainer>
            </StyledMetadataContainer>
          </StyledMetadata>

          {!isCollapsed && (
            <>
              {shoe.imageUrl && (
                <StyledCurrentImageContainer>
                  <h3>Current Image</h3>
                  <StyledCurrentImage
                    src={shoe.imageUrl}
                    alt={`Current image for ${shoe.brand} - ${shoe.heelType} ${shoe.shoeType}`}
                  />
                </StyledCurrentImageContainer>
              )}

              <ImagePasteZone onImagePasted={handlePastedImage} />

              {selectedImage && (
                <StyledImagePreviewContainer>
                  <h3>Preview Image</h3>
                  <StyledImage
                    src={selectedImage}
                    alt={`Preview image for ${shoe.brand} - ${shoe.heelType} ${shoe.shoeType}`}
                    onClick={() => handleImageSelect(selectedImage)}
                    $isSelected={bulkMode ? externalSelectedImage === selectedImage : selectedImage === selectedImage}
                  />
                </StyledImagePreviewContainer>
              )}

              {images.length > 0 && (
                <StyledImagesGrid>
                  {images.map((img, index) => (
                    <StyledImageContainer key={index}>
                      <StyledImage
                        src={img}
                        alt={`${shoe.brand} - ${shoe.heelType} ${shoe.shoeType} - Image ${index + 1}`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const hiddenImg = document.createElement('img');
                          hiddenImg.src = img;
                          hiddenImg.alt = `${shoe.brand} - ${shoe.heelType} ${shoe.shoeType} - Image ${index + 1}`;
                          hiddenImg.style.display = 'none';
                          target.replaceWith(hiddenImg);
                        }}
                        onClick={() => handleImageSelect(img)}
                        $isSelected={bulkMode ? externalSelectedImage === img : selectedImage === img}
                      />
                    </StyledImageContainer>
                  ))}
                </StyledImagesGrid>
              )}
            </>
          )}
        </StyledShoeCard>

        <SuccessMessage
          message={isSuccess ? successMessage : null}
          onClose={() => setIsSuccess(false)}
        />
      </StyledContainer>
    </AnimatePresence>
  );
};
