'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { NailPolishGrid } from '@/components/NailPolishGrid';
import { Rating } from '@prisma/client';
import { StyledPagination } from '@/components/Pagination/index.styled';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';

interface Polish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  colors: string[];
  finishes: string[];
  rating: Rating | null;
}

interface ApiResponse {
  polishes: Polish[];
  total: number;
  page: number;
  totalPages: number;
}

export default function Home() {
  return (
    <SuspenseBoundary>
      <HomeContent />
    </SuspenseBoundary>
  );
}

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [polishes, setPolishes] = useState<Polish[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [finishes, setFinishes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPolishes, setTotalPolishes] = useState(0);

  // Get current filters from URL
  const currentFilters = {
    brand: searchParams.getAll('brand'),
    finish: searchParams.getAll('finish'),
    color: searchParams.getAll('color'),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    rating: searchParams.getAll('rating'),
    hasImage: searchParams.get('hasImage') || '',
    isOld: searchParams.get('isOld') || '',
    page: searchParams.get('page') || '1',
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/options');
        if (!response.ok) throw new Error('Failed to fetch options');
        const data = await response.json();
        setBrands(data.brands);
        setColors(data.colors);
        setFinishes(data.finishes);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchPolishes = async () => {
      try {
        // Build the query string from currentFilters
        const params = new URLSearchParams();
        if (currentFilters.search) params.set('search', currentFilters.search);
        if (currentFilters.hasImage) params.set('hasImage', currentFilters.hasImage);
        if (currentFilters.isOld) params.set('isOld', currentFilters.isOld);
        if (currentFilters.brand.length > 0) {
          currentFilters.brand.forEach(brand => params.append('brand', brand));
        }
        if (currentFilters.finish.length > 0) {
          currentFilters.finish.forEach(finish => params.append('finish', finish));
        }
        if (currentFilters.color.length > 0) {
          currentFilters.color.forEach(color => params.append('color', color));
        }
        if (currentFilters.rating.length > 0) {
          currentFilters.rating.forEach(rating => params.append('rating', rating));
        }
        params.set('page', currentFilters.page);
        params.set('limit', '45');

        const response = await fetch(`/api/polishes?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch polishes');
        const data: ApiResponse = await response.json();

        if (!data || !data.polishes || !Array.isArray(data.polishes)) {
          throw new Error('Invalid data format received from API');
        }

        setPolishes(data.polishes);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setTotalPolishes(data.total);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolishes();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/?${params.toString()}`);
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

  return (
    <>
      <PageHeader
        title="All Nail Polishes"
        description="Browse, filter, and sort below ⬇"
      />
      <NailPolishGrid
        polishes={polishes}
        brands={brands}
        colors={colors}
        finishes={finishes}
        currentFilters={currentFilters}
        totalPolishes={totalPolishes}
      />
      <StyledPagination>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          Next
        </button>
      </StyledPagination>
    </>
  );
}
