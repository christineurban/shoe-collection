'use client';

import { useEffect, useState } from 'react';
import { AddEditForm } from '@/components/AddEditForm';
import { StyledContainer } from './page.styled';
import { PageHeader } from '@/components/PageHeader';
import styled from 'styled-components';

const StyledFormContainer = styled.div`
  width: 100%;
  margin: 0 auto;
`;

interface Options {
  brands: string[];
  colors: string[];
}

export default function AddShoePage() {
  const [options, setOptions] = useState<Options>({ brands: [], colors: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [brandsResponse, colorsResponse] = await Promise.all([
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

    fetchOptions();
  }, []);

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

  return (
    <StyledContainer>
      <PageHeader
        title="Add New Shoe"
        description="Fill in the details below to add a new shoe to your collection"
      />
      <StyledFormContainer>
        <AddEditForm
          brands={options.brands}
          colors={options.colors}
        />
      </StyledFormContainer>
    </StyledContainer>
  );
}
