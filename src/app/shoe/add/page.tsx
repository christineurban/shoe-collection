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
  const [options, setOptions] = useState<Options>({
    brands: [],
    colors: [],
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
          title="Add New Shoe"
        />
        <AddEditForm
          brands={options.brands}
          colors={options.colors}
        />
      </StyledFormContainer>
    </StyledContainer>
  );
}
