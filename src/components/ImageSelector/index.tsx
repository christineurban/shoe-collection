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

interface Polish {
  id: string;
  name: string;
  link: string | null;
  imageUrl: string | null;
  brand: string;
  heelType: string;
  shoeType: string;
  color: string;
  location: string;
}

interface Shoe {
  id: string;
  name: string;
  imageUrl: string | null;
  brand: string;
  heelType: string;
  shoeType: string;
  color: string;
  location: string;
}

interface ImageSelectorProps {
  polish?: Polish;
  shoe?: Shoe;
  onImageSaved?: () => void;
  bulkMode?: boolean;
  onImageSelected?: (id: string, imageUrl: string | null) => void;
  selectedImage?: string | null;
  returnTo?: string;
}

export const ImageSelector = ({
  polish,
  shoe,
  onImageSaved,
  bulkMode = false,
  onImageSelected,
  selectedImage: externalSelectedImage,
  returnTo
}: ImageSelectorProps) => {
  const item = polish || shoe;
  if (!item) return null;

  const [selectedImage, setSelectedImage] = useState<string | null>(externalSelectedImage || null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleImageSelect = (imageUrl: string) => {
    if (bulkMode && onImageSelected) {
      onImageSelected(item.id, imageUrl);
    } else {
      setSelectedImage(imageUrl);
    }
  };

  const handleRemoveImage = async () => {
    try {
      setIsRemoving(true);

      const response = await fetch('/api/remove-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: item.id
        }),
      });

      if (response.ok) {
        setSuccessMessage('Image removed successfully!');
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
        throw new Error(errorData.error || 'Failed to remove image');
      }
    } catch (error) {
      console.error('Error removing image:', error);
    } finally {
      setIsRemoving(false);
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
          id: item.id,
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

  const handleMarkNoImage = async () => {
    if (bulkMode && onImageSelected) {
      onImageSelected(item.id, 'n/a');
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch('/api/update-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: item.id,
          imageUrl: 'n/a'
        }),
      });

      if (response.ok) {
        setSuccessMessage('Marked as no image available!');
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
        throw new Error(errorData.error || 'Failed to mark as no image available');
      }
    } catch (error) {
      console.error('Error marking as no image available:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handlePastedImage = (imageUrl: string) => {
    setImages(prevImages => [imageUrl, ...prevImages]);
    setSelectedImage(imageUrl);
  };

  if (!item) {
    return null;
  }

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
                <StyledShoeLink href={polish ? `/polish/${item.id}` : `/shoe/${item.id}`}>
                  <h3>{item.brand} {item.heelType} {item.shoeType}</h3>
                </StyledShoeLink>
                <p>Color: {item.color}</p>
                <p>Location: {item.location}</p>
              </div>
              <StyledActionsContainer>
                <StyledButtonGroup>
                  <Button
                    onClick={handleMarkNoImage}
                    disabled={bulkMode ? false : isSaving}
                    $variant="tertiary"
                  >
                    Mark as No Image Available
                  </Button>
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
              {item.imageUrl && item.imageUrl !== 'n/a' && (
                <StyledCurrentImageContainer>
                  <h3>Current Image</h3>
                  <StyledCurrentImage
                    src={item.imageUrl}
                    alt={`Current image for ${item.brand} - ${item.name}`}
                  />
                </StyledCurrentImageContainer>
              )}

              <ImagePasteZone onImagePasted={handlePastedImage} />

              {selectedImage && selectedImage !== 'n/a' && (
                <StyledImagePreviewContainer>
                  <h3>Preview Image</h3>
                  <StyledImage
                    src={selectedImage}
                    alt={`Preview image for ${item.brand} - ${item.name}`}
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
                        alt={`${item.brand} - ${item.name} - Image ${index + 1}`}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const hiddenImg = document.createElement('img');
                          hiddenImg.src = img;
                          hiddenImg.alt = `${item.brand} - ${item.name} - Image ${index + 1}`;
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
