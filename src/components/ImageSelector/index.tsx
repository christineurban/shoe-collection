'use client';

import { useState, useEffect } from 'react';
import {
  StyledContainer,
  StyledPolishCard,
  StyledImagesGrid,
  StyledImageContainer,
  StyledImage,
  StyledMetadata,
  StyledNoImages,
  StyledLoadingOverlay,
  StyledSpinner,
  StyledCollapseText,
  StyledImageCount,
  StyledPolishLink,
  StyledImagePreviewContainer,
  StyledMetadataContainer,
  StyledLinkContainer,
  StyledActionsContainer,
  StyledButtonGroup,
  StyledImageCountContainer,
  StyledCurrentImageContainer,
  StyledCurrentImage,
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
}

interface ImageSelectorProps {
  polish: Polish;
  onImageSaved?: () => void;
  bulkMode?: boolean;
  onImageSelected?: (polishId: string, imageUrl: string | null) => void;
  selectedImage?: string | null;
}

export const ImageSelector = ({
  polish,
  onImageSaved,
  bulkMode = false,
  onImageSelected,
  selectedImage: externalSelectedImage
}: ImageSelectorProps) => {
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
      onImageSelected(polish.id, imageUrl);
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
          id: polish.id
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
          id: polish.id,
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
      onImageSelected(polish.id, 'n/a');
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
          id: polish.id,
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

  const fetchImages = async () => {
    if (!polish.link) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/fetch-images?url=${encodeURIComponent(polish.link)}`);
      if (!response.ok) throw new Error('Failed to fetch images');

      const data = await response.json();
      setImages(data.images || []);
    } catch (error) {
      console.error(`Error fetching images for ${polish.brand} - ${polish.name}:`, error);
      setImages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handlePastedImage = (imageUrl: string) => {
    setImages(prevImages => [imageUrl, ...prevImages]);
    setSelectedImage(imageUrl);
  };

  useEffect(() => {
    if (polish?.link) {
      fetchImages();
    }
  }, [polish]);

  if (!polish) {
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
        <StyledPolishCard>
          <StyledMetadata>
            <StyledMetadataContainer>
              <div>
                <StyledPolishLink href={`/polish/${polish.id}`}>
                  <h3>{polish.brand} - {polish.name}</h3>
                </StyledPolishLink>
                {polish.link ? (
                  <StyledLinkContainer>
                    <p>
                      Link: <a href={polish.link} target="_blank" rel="noopener noreferrer">
                        {polish.link}
                      </a>
                    </p>
                    <a href={`/polish/${polish.id}/edit?returnTo=/image-selection`}>Edit link</a>
                  </StyledLinkContainer>
                ) : (
                  <StyledLinkContainer>
                    <p>No source link available. <a href={`/polish/${polish.id}/edit?returnTo=/image-selection`}>Add a link</a></p>
                  </StyledLinkContainer>
                )}
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
                <StyledImageCountContainer>
                  {!isLoading && images.length > 0 && (
                    <StyledImageCount>
                      {images.length} image{images.length !== 1 ? 's' : ''} found
                    </StyledImageCount>
                  )}
                  <StyledCollapseText onClick={handleCollapse}>
                    {isCollapsed ? 'Show Images' : 'Hide Images'}
                  </StyledCollapseText>
                </StyledImageCountContainer>
              </StyledActionsContainer>
            </StyledMetadataContainer>
          </StyledMetadata>

          {!isCollapsed && (
            <>
              {polish.imageUrl && polish.imageUrl !== 'n/a' && (
                <StyledCurrentImageContainer>
                  <h3>Current Image</h3>
                  <StyledCurrentImage
                    src={polish.imageUrl}
                    alt={`Current image for ${polish.brand} - ${polish.name}`}
                  />
                </StyledCurrentImageContainer>
              )}

              <ImagePasteZone onImagePasted={handlePastedImage} />

              {selectedImage && !polish.link && selectedImage !== 'n/a' && (
                <StyledImagePreviewContainer>
                  <h3>Preview Image</h3>
                  <StyledImage
                    src={selectedImage}
                    alt={`Preview image for ${polish.brand} - ${polish.name}`}
                    onClick={() => handleImageSelect(selectedImage)}
                    $isSelected={bulkMode ? externalSelectedImage === selectedImage : selectedImage === selectedImage}
                  />
                </StyledImagePreviewContainer>
              )}

              {!polish.link ? (
                <></>
              ) : isLoading ? (
                <StyledLoadingOverlay>
                  <StyledSpinner
                    as={motion.div}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />
                  <p>Loading images...</p>
                </StyledLoadingOverlay>
              ) : images.length === 0 ? (
                <StyledNoImages>No images found on the linked page</StyledNoImages>
              ) : (
                <>
                  <StyledImagesGrid>
                    {images.map((img, index) => (
                      <StyledImageContainer key={index}>
                        <StyledImage
                          src={img}
                          alt={`${polish.brand} - ${polish.name} - Image ${index + 1}`}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            const hiddenImg = document.createElement('img');
                            hiddenImg.src = img;
                            hiddenImg.alt = `${polish.brand} - ${polish.name} - Image ${index + 1}`;
                            hiddenImg.style.display = 'none';
                            target.replaceWith(hiddenImg);
                          }}
                          onClick={() => handleImageSelect(img)}
                          $isSelected={bulkMode ? externalSelectedImage === img : selectedImage === img}
                        />
                      </StyledImageContainer>
                    ))}
                  </StyledImagesGrid>
                </>
              )}
            </>
          )}
        </StyledPolishCard>

        <SuccessMessage
          message={isSuccess ? successMessage : null}
          onClose={() => setIsSuccess(false)}
        />
      </StyledContainer>
    </AnimatePresence>
  );
};
