'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/PageHeader';
import { ShoeGrid } from '@/components/ShoeGrid';
import { StyledContainer as StyledPagination } from '@/components/Pagination/index.styled';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';

interface Shoe {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  color: string;
  dressStyle: string;
  shoeType: string;
  heelType: string;
  location: string;
}

interface ApiResponse {
  shoes: Shoe[];
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
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [dressStyles, setDressStyles] = useState<string[]>([]);
  const [shoeTypes, setShoeTypes] = useState<string[]>([]);
  const [heelTypes, setHeelTypes] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalShoes, setTotalShoes] = useState(0);

  // Get current filters from URL
  const currentFilters = {
    brand: searchParams.getAll('brand'),
    dressStyle: searchParams.getAll('dressStyle'),
    shoeType: searchParams.getAll('shoeType'),
    heelType: searchParams.getAll('heelType'),
    location: searchParams.getAll('location'),
    search: searchParams.get('search') || '',
    sort: searchParams.get('sort') || '',
    hasImage: searchParams.get('hasImage') || '',
    page: searchParams.get('page') || '1',
  };

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/options');
        if (!response.ok) throw new Error('Failed to fetch options');
        const data = await response.json();
        setBrands(data.brands);
        setDressStyles(data.dressStyles);
        setShoeTypes(data.shoeTypes);
        setHeelTypes(data.heelTypes);
        setLocations(data.locations);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        // Build the query string from currentFilters
        const params = new URLSearchParams();
        if (currentFilters.search) params.set('search', currentFilters.search);
        if (currentFilters.hasImage) params.set('hasImage', currentFilters.hasImage);
        if (currentFilters.brand.length > 0) {
          currentFilters.brand.forEach(brand => params.append('brand', brand));
        }
        if (currentFilters.dressStyle.length > 0) {
          currentFilters.dressStyle.forEach(style => params.append('dressStyle', style));
        }
        if (currentFilters.shoeType.length > 0) {
          currentFilters.shoeType.forEach(type => params.append('shoeType', type));
        }
        if (currentFilters.heelType.length > 0) {
          currentFilters.heelType.forEach(type => params.append('heelType', type));
        }
        if (currentFilters.location.length > 0) {
          currentFilters.location.forEach(location => params.append('location', location));
        }
        params.set('page', currentFilters.page);
        params.set('limit', '45');

        const response = await fetch(`/api/shoes?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch shoes');
        const data: ApiResponse = await response.json();

        if (!data || !data.shoes || !Array.isArray(data.shoes)) {
          throw new Error('Invalid data format received from API');
        }

        setShoes(data.shoes);
        setCurrentPage(data.page);
        setTotalPages(data.totalPages);
        setTotalShoes(data.total);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShoes();
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
        title="All Shoes"
        description="Browse, filter, and sort below ⬇"
      />
      <ShoeGrid
        shoes={shoes}
        brands={brands}
        dressStyles={dressStyles}
        shoeTypes={shoeTypes}
        heelTypes={heelTypes}
        locations={locations}
        currentFilters={currentFilters}
        totalShoes={totalShoes}
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
