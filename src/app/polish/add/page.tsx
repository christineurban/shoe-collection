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
  finishes: string[];
}

export default function AddPolishPage() {
  const [options, setOptions] = useState<Options>({
    brands: [],
    colors: [],
    finishes: [],
  });

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await fetch('/api/options');
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <StyledContainer>
      <StyledFormContainer>
        <PageHeader
          title="Add New Nail Polish"
        />
        <AddEditForm
          brands={options.brands}
          availableColors={options.colors}
          availableFinishes={options.finishes}
        />
      </StyledFormContainer>
    </StyledContainer>
  );
}
