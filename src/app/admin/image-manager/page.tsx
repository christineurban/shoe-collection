'use client';

import { useEffect, useState } from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Autocomplete } from '@/components/fields/Autocomplete';
import {
  StyledContainer,
  StyledGrid,
  StyledImageCard,
  StyledImage,
  StyledDeleteButton,
  StyledSaveButton,
  StyledHeaderContainer,
} from './page.styled';

interface Shoe {
  id: string;
  image_url: string | null;
  brand: {
    name: string;
  };
}

interface Image {
  name: string;
  url: string;
  size: number;
  lastModified: string;
  selectedShoeId?: string;
  markedForDeletion?: boolean;
}

export default function ImageManager() {
  const [images, setImages] = useState<Image[]>([]);
  const [shoes, setShoes] = useState<Shoe[]>([]);
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

      // Fetch shoe details
      const shoesResponse = await fetch('/api/admin/shoes');
      const shoesData = await shoesResponse.json();
      setShoes(shoesData.shoes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShoeSelect = (imageIndex: number, shoeId: string) => {
    setImages(images.map((img, idx) =>
      idx === imageIndex ? { ...img, selectedShoeId: shoeId } : img
    ));
  };

  const handleMarkForDeletion = (imageIndex: number) => {
    setImages(images.map((img, idx) =>
      idx === imageIndex ? { ...img, markedForDeletion: !img.markedForDeletion } : img
    ));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Get images that need to be updated
      const imagesToUpdate = images.filter(img => img.selectedShoeId && !img.markedForDeletion);
      const imagesToDelete = images.filter(img => img.markedForDeletion);

      // Update shoe image URLs
      for (const img of imagesToUpdate) {
        const response = await fetch('/api/update-image', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: img.selectedShoeId,
            imageUrl: img.url,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update shoe images');
        }
      }

      // Delete marked images
      if (imagesToDelete.length > 0) {
        const response = await fetch('/api/delete-bulk-images', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            images: imagesToDelete.map(img => img.name),
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete images');
        }
      }

      // Refresh data
      await fetchData();
    } catch (error) {
      console.error('Error saving changes:', error);
      setError(error instanceof Error ? error.message : 'Failed to save changes');
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
        <PageHeader title="Loading..." />
      </StyledContainer>
    );
  }

  if (error) {
    return (
      <StyledContainer>
        <PageHeader
          title="Error"
          description={error}
        />
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
        <p>There are no images in storage. Upload images to begin matching them with shoes.</p>
      </StyledContainer>
    );
  }

  if (images.length === 0 && matchedImages === totalImages) {
    return (
      <StyledContainer>
        <PageHeader
          title="Image Manager"
          description="Match unmatched images to shoes"
        />
        <p>All {totalImages} images in storage have been matched to shoes.</p>
      </StyledContainer>
    );
  }

  const hasChanges = images.some(img => img.selectedShoeId || img.markedForDeletion);

  const shoeOptions = shoes.map(shoe => ({
    value: shoe.id,
    label: `${shoe.brand.name}`
  }));

  return (
    <StyledContainer>
      <StyledHeaderContainer>
        <PageHeader
          title="Image Manager"
          description="Match unmatched images to shoes"
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
              options={shoeOptions}
              value={image.selectedShoeId || ''}
              onChange={(value) => handleShoeSelect(index, value)}
              disabled={image.markedForDeletion}
              placeholder="Select a shoe..."
            />
            <StyledDeleteButton
              onClick={() => handleMarkForDeletion(index)}
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
