'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Autocomplete } from '@/components/Autocomplete';
import {
  StyledContainer,
  StyledGrid,
  StyledImageCard,
  StyledImage,
  StyledDeleteButton,
  StyledSaveButton,
  StyledHeaderContainer,
  StyledErrorMessage,
} from './page.styled';

interface Polish {
  id: string;
  name: string;
  brands: {
    name: string;
  };
}

interface ImageItem {
  url: string;
  name: string;
  selectedPolishId?: string;
  markedForDeletion?: boolean;
}

export default function ImageManager() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [polishes, setPolishes] = useState<Polish[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalImages, setTotalImages] = useState(0);
  const [matchedImages, setMatchedImages] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch images and their associations
      const imagesResponse = await fetch('/api/images');
      if (!imagesResponse.ok) {
        const errorData = await imagesResponse.json();
        throw new Error(errorData.error || 'Failed to fetch images');
      }
      const imagesData = await imagesResponse.json();
      setImages(imagesData.images);
      setTotalImages(imagesData.totalImages);
      setMatchedImages(imagesData.matchedImages);

      // Fetch polish details
      const polishesResponse = await fetch('/api/admin/polishes');
      const polishesData = await polishesResponse.json();
      setPolishes(polishesData.polishes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePolishSelect = (imageIndex: number, polishId: string) => {
    setImages(prev => prev.map((img, idx) =>
      idx === imageIndex ? { ...img, selectedPolishId: polishId } : img
    ));
  };

  const toggleDeletion = (imageIndex: number) => {
    setImages(prev => prev.map((img, idx) =>
      idx === imageIndex ? { ...img, markedForDeletion: !img.markedForDeletion } : img
    ));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Handle deletions
      const imagesToDelete = images.filter(img => img.markedForDeletion);
      const imagesToUpdate = images.filter(img => img.selectedPolishId && !img.markedForDeletion);

      // Delete marked images
      if (imagesToDelete.length > 0) {
        console.log('Deleting images:', imagesToDelete.map(img => img.name));
        const deleteResponse = await fetch('/api/delete-bulk-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ images: imagesToDelete.map(img => img.name) })
        });

        if (!deleteResponse.ok) {
          const errorData = await deleteResponse.json();
          throw new Error(errorData.error || 'Failed to delete images');
        }

        const deleteResult = await deleteResponse.json();
        console.log('Delete response:', deleteResult);
      }

      // Update polish image URLs
      if (imagesToUpdate.length > 0) {
        const updateResponse = await fetch('/api/update-bulk-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            updates: imagesToUpdate.map(img => ({
              polishId: img.selectedPolishId,
              imageUrl: img.url
            }))
          })
        });

        if (!updateResponse.ok) {
          const errorData = await updateResponse.json();
          throw new Error(errorData.error || 'Failed to update polish images');
        }
      }

      // Clear browser's memory cache
      if ('caches' in window) {
        try {
          const cacheNames = await caches.keys();
          await Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        } catch (e) {
          console.error('Error clearing cache:', e);
        }
      }

      // Force a hard refresh of the page
      window.location.href = window.location.href.split('?')[0] + '?t=' + new Date().getTime();
    } catch (error) {
      alert('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Add cache-busting parameter to image URLs
  const getCacheBustedUrl = (url: string) => {
    const cacheBuster = new Date().getTime();
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${cacheBuster}`;
  };

  if (isLoading) {
    return (
      <StyledContainer>
        <PageHeader
          title="Image Manager"
          description="Loading images..."
        />
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <PageHeader
          title="Image Manager"
          description="An error occurred while loading the image manager"
        />
        <StyledErrorMessage>{error}</StyledErrorMessage>
      </StyledContainer>
    );
  }

  if (totalImages === 0) {
    return (
      <StyledContainer>
        <PageHeader
          title="Image Manager"
          description="No Images Found"
        />
        <p>There are no images in storage. Upload images to begin matching them with polishes.</p>
      </StyledContainer>
    );
  }

  if (images.length === 0 && matchedImages === totalImages) {
    return (
      <StyledContainer>
        <PageHeader
          title="Image Manager"
          description="Match unmatched images to nail polishes"
        />
        <p>All {totalImages} images in storage have been matched to polishes.</p>
      </StyledContainer>
    );
  }

  const hasChanges = images.some(img => img.selectedPolishId || img.markedForDeletion);

  const polishOptions = polishes.map(polish => ({
    value: polish.id,
    label: `${polish.brands.name} - ${polish.name}`
  }));

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <PageHeader
          title="Image Manager"
          description="Match unmatched images to nail polishes"
        />
        <StyledSaveButton
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? 'Saving...' : hasChanges ? 'Save All Changes' : 'No Changes'}
        </StyledSaveButton>
      </StyledHeaderContainer>

      <p>
        Showing {images.length} unmatched {images.length === 1 ? 'image' : 'images'}
        {totalImages > 0 && ` (${matchedImages} of ${totalImages} total images matched)`}
      </p>

      <StyledGrid>
        {images.map((image, index) => (
          <StyledImageCard
            key={image.name}
            $markedForDeletion={image.markedForDeletion}
          >
            <StyledImage
              src={getCacheBustedUrl(image.url)}
              alt={image.name}
            />
            <Autocomplete
              options={polishOptions}
              value={image.selectedPolishId || ''}
              onChange={(value) => handlePolishSelect(index, value)}
              disabled={image.markedForDeletion}
              placeholder="Select a polish..."
            />
            <StyledDeleteButton
              onClick={() => toggleDeletion(index)}
              $active={image.markedForDeletion}
            >
              {image.markedForDeletion ? 'Unmark for Deletion' : 'Mark for Deletion'}
            </StyledDeleteButton>
          </StyledImageCard>
        ))}
      </StyledGrid>
    </StyledContainer>
  );
}
