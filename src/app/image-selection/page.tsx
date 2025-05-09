'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImageSelector } from '@/components/ImageSelector';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import {
  StyledPagination,
  StyledPaginationButton,
  StyledPaginationInfo
} from './page.styled';

interface Polish {
  id: string;
  name: string;
  link: string | null;
  imageUrl: string | null;
  brand: string;
}

interface PaginatedResponse {
  polishes: Polish[];
  total: number;
  page: number;
  totalPages: number;
}

interface SelectedImage {
  polishId: string;
  imageUrl: string;
}

export default function ImageSelectionPage() {
  const router = useRouter();
  const [polishes, setPolishes] = useState<Polish[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedImages, setSelectedImages] = useState<Record<string, string>>({});
  const [isSavingBulk, setIsSavingBulk] = useState(false);

  const fetchPolishes = async () => {
    try {
      const response = await fetch(`/api/polishes?hasImage=false&page=${currentPage}&limit=25`);
      if (!response.ok) throw new Error('Failed to fetch polish details');
      const data: PaginatedResponse = await response.json();
      setPolishes(data.polishes);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPolishes();
  }, [currentPage]);

  const handleImageSelected = (polishId: string, imageUrl: string | null) => {
    setSelectedImages(prev => {
      if (imageUrl === null) {
        const newState = { ...prev };
        delete newState[polishId];
        return newState;
      }
      return { ...prev, [polishId]: imageUrl };
    });
  };

  const handleBulkSave = async () => {
    if (Object.keys(selectedImages).length === 0) return;

    try {
      setIsSavingBulk(true);
      const updates = Object.entries(selectedImages).map(([polishId, imageUrl]) => ({
        polishId,
        imageUrl
      }));

      const response = await fetch('/api/update-bulk-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) {
        throw new Error('Failed to save images');
      }

      const data = await response.json();

      // Remove successful updates from the list
      const successfulIds = data.results
        .filter((result: { success: boolean }) => result.success)
        .map((result: { id: string }) => result.id);

      // Remove successful polishes from the page
      setPolishes(prev => prev.filter(p => !successfulIds.includes(p.id)));

      // Clear selected images
      setSelectedImages({});

      // If this was the last polish on the page and not the first page, go to previous page
      if (polishes.length === successfulIds.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        // Refetch the data to get the updated list
        await fetchPolishes();
      }
    } catch (error) {
      console.error('Error saving images:', error);
    } finally {
      setIsSavingBulk(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return (
      <PageHeader title="Loading..." />
    );
  }

  if (error) {
    return (
      <PageHeader
        title="Error"
        description={error}
      />
    );
  }

  if (polishes.length === 0) {
    return (
      <PageHeader
        title="No Polishes Need Images"
        description="All polishes in your collection have images."
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Select Images"
        description='Select images for multiple polishes and save them all at once.'
      />
      {Object.keys(selectedImages).length > 0 && (
        <Button
          onClick={handleBulkSave}
          disabled={isSavingBulk}
          style={{ margin: '20px 0' }}
        >
          {isSavingBulk ? 'Saving...' : `Save ${Object.keys(selectedImages).length} Selected Images`}
        </Button>
      )}
      {polishes.map(polish => (
        <ImageSelector
          key={polish.id}
          polish={polish}
          bulkMode={true}
          onImageSelected={handleImageSelected}
          selectedImage={selectedImages[polish.id]}
        />
      ))}
      <StyledPagination>
        <StyledPaginationInfo>
          Showing {((currentPage - 1) * 25) + 1} to {Math.min(currentPage * 25, totalItems)} of {totalItems} polishes
        </StyledPaginationInfo>
        <div>
          <StyledPaginationButton
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </StyledPaginationButton>
          <StyledPaginationButton
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </StyledPaginationButton>
        </div>
      </StyledPagination>
    </>
  );
}
