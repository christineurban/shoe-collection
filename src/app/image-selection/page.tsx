'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { ImageSelector } from '@/components/ImageSelector';
import { EmptyState } from '@/components/EmptyState';
import { Pagination } from '@/components/Pagination';
import { Shoe } from '@/types/shoe';

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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

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
  }, [currentPage, isAuthenticated, router]);

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

      const { successfulIds } = await response.json() as { successfulIds: string[] };

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
    return <div>Error: {error}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (shoes.length === 0) {
    return (
      <EmptyState
        title="No Shoes Need Images"
        description="All shoes in your collection have images."
      />
    );
  }

  return (
    <div>
      <div>
        <h1>Image Selection</h1>
        <p>Select images for multiple shoes and save them all at once.</p>
      </div>

      <div>
        {shoes.map(shoe => (
          <ImageSelector
            key={shoe.id}
            shoe={shoe}
            onImageSelected={handleImageSelected}
            selectedImage={selectedImages[shoe.id]}
          />
        ))}
      </div>

      <div>
        <button
          onClick={handleSave}
          disabled={Object.keys(selectedImages).length === 0 || isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Selected Images'}
        </button>
      </div>

      <div>
        <Pagination
          currentPage={currentPage}
          totalItems={totalItems}
          itemsPerPage={25}
          onPageChange={setCurrentPage}
        />
        <p>
          Showing {((currentPage - 1) * 25) + 1} to {Math.min(currentPage * 25, totalItems)} of {totalItems} shoes
        </p>
      </div>
    </div>
  );
}
