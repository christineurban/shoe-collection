'use client';

import { useEffect, useState } from 'react';
import { AddEditForm } from '@/components/AddEditForm';
import { getShoeById } from '@/lib/api/shoe';
import type { Shoe } from '@/types/shoe';
import { PageHeader } from '@/components/PageHeader';
import { StyledContainer } from '@/app/shoe/add/page.styled';

interface Options {
  brands: string[];
  colors: string[];
}

export default function EditShoePage({ params }: { params: { id: string } }) {
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [options, setOptions] = useState<Options>({ brands: [], colors: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shoeResponse, brandsResponse, colorsResponse] = await Promise.all([
          getShoeById(params.id),
          fetch('/api/brands'),
          fetch('/api/colors')
        ]);

        if (!brandsResponse.ok || !colorsResponse.ok) {
          throw new Error('Failed to fetch options');
        }

        const [brands, colors] = await Promise.all([
          brandsResponse.json(),
          colorsResponse.json()
        ]);

        setShoe(shoeResponse);
        setOptions({
          brands: brands.map((b: { name: string }) => b.name),
          colors: colors.map((c: { name: string }) => c.name)
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

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

  if (!shoe) {
    return (
      <StyledContainer>
        <PageHeader
          title="Error"
          description="Shoe not found"
        />
      </StyledContainer>
    );
  }

  return (
    <StyledContainer>
      <PageHeader
        title="Edit Shoe"
        description="Update the details below to modify this shoe"
      />
      <AddEditForm
        shoe={shoe}
        brands={options.brands}
        colors={options.colors}
      />
    </StyledContainer>
  );
}
