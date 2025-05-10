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
  dressStyles: string[];
  shoeTypes: string[];
  heelTypes: string[];
  locations: string[];
}

export default function AddShoePage() {
  const [options, setOptions] = useState<Options>({
    brands: [],
    colors: [],
    dressStyles: [],
    shoeTypes: [],
    heelTypes: [],
    locations: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/options');

        if (!response.ok) {
          throw new Error('Failed to fetch options');
        }

        const data = await response.json();

        setOptions({
          brands: data.brands,
          colors: data.colors,
          dressStyles: data.dressStyles,
          shoeTypes: data.shoeTypes,
          heelTypes: data.heelTypes,
          locations: data.locations
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
          dressStyles={options.dressStyles}
          shoeTypes={options.shoeTypes}
          heelTypes={options.heelTypes}
          locations={options.locations}
        />
      </StyledFormContainer>
    </StyledContainer>
  );
}
