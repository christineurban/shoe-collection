'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { ImageSelector } from '@/components/ImageSelector';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/Pagination';
import { PageHeader } from '@/components/PageHeader';
import { Shoe } from '@/types/shoe';
import styled from 'styled-components';



const StyledSaveButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
  margin: 2rem 0;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

const StyledPaginationContainer = styled.div`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const StyledLoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
`;

const StyledLoadingSpinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid ${({ theme }) => theme.colors.gray[200]};
  border-top: 4px solid ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

interface PageProps {
  searchParams: {
    page?: string;
  };
}

export default function ImageSelectionPage({ searchParams }: PageProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [selectedImages, setSelectedImages] = useState<Record<string, string | null>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.page || '1'));
  const [totalItems, setTotalItems] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check');
        const data = await response.json();
        setAuthChecked(true);
        if (!data.isAuthenticated) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!authChecked) return;

    const fetchShoes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/shoes?hasImage=false&page=${currentPage}&limit=25`);
        if (!response.ok) throw new Error('Failed to fetch shoe details');
        const data = await response.json();
        setShoes(data.shoes);
        setTotalItems(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShoes();
  }, [currentPage, authChecked]);

  const handleImageSelected = (shoeId: string, imageUrl: string | null) => {
    setSelectedImages(prev => {
      const newState = { ...prev };
      if (imageUrl === null) {
        delete newState[shoeId];
      } else {
        newState[shoeId] = imageUrl;
      }
      return newState;
    });
  };

  const handleSave = async () => {
    if (Object.keys(selectedImages).length === 0) return;

    try {
      setIsSaving(true);
      const updates = Object.entries(selectedImages).map(([shoeId, imageUrl]) => ({
        shoeId,
        imageUrl
      }));

      const response = await fetch('/api/update-bulk-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ updates }),
      });

      if (!response.ok) throw new Error('Failed to save images');

      const { results } = await response.json() as { results: Array<{ id: string, success: boolean }> };

      // Get IDs of successfully updated shoes
      const successfulIds = results
        .filter(result => result.success)
        .map(result => result.id);

      // Remove successful shoes from the page
      setShoes(prev => prev.filter(s => !successfulIds.includes(s.id)));

      // Clear selected images for successful updates
      setSelectedImages(prev => {
        const newState = { ...prev };
        successfulIds.forEach(id => delete newState[id]);
        return newState;
      });

      // If this was the last shoe on the page and not the first page, go to previous page
      if (shoes.length === successfulIds.length && currentPage > 1) {
        setCurrentPage(prev => prev - 1);
      } else {
        // Refresh the current page
        const response = await fetch(`/api/shoes?hasImage=false&page=${currentPage}&limit=25`);
        if (!response.ok) throw new Error('Failed to fetch shoe details');
        const data = await response.json();
        setShoes(data.shoes);
        setTotalItems(data.total);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  if (error) {
    return (
        <PageHeader
          title="Error"
          description={error}
        />
    );
  }

  if (isLoading) {
    return (
        <PageHeader title="Loading..." />
    );
  }

  if (shoes.length === 0) {
    return (
      <>
        <PageHeader
          title="Image Selection"
          description="Select images for multiple shoes and save them all at once."
        />
        <EmptyState
          title="No Shoes Need Images"
          description="All shoes in your collection have images."
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Image Selection"
        description="Select images for multiple shoes and save them all at once."
      />

      <div>
        {shoes.map(shoe => (
          <ImageSelector
            key={shoe.id}
            shoe={shoe}
            onImageSelected={handleImageSelected}
            selectedImage={selectedImages[shoe.id]}
            bulkMode={true}
          />
        ))}
      </div>

      <StyledSaveButton
        onClick={handleSave}
        disabled={Object.keys(selectedImages).length === 0 || isSaving}
      >
        {isSaving ? 'Saving...' : 'Save Selected Images'}
      </StyledSaveButton>

      <StyledPaginationContainer>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={25}
          onPageChange={setCurrentPage}
        />
        <p>
          Showing {((currentPage - 1) * 25) + 1} to {Math.min(currentPage * 25, totalItems)} of {totalItems} shoes
        </p>
      </StyledPaginationContainer>
    </>
  );
}
