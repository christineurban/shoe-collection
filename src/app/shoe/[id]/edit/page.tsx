'use client';

import { useEffect, useState } from 'react';
import { AddEditForm } from '@/components/AddEditForm';
import type { Shoe } from '@/types/shoe';
import { PageHeader } from '@/components/PageHeader';
import { StyledContainer } from '@/app/shoe/add/page.styled';

interface Options {
  brands: string[];
  colors: string[];
  dressStyles: string[];
  shoeTypes: string[];
  heelTypes: string[];
  locations: string[];
}

export default function EditShoePage({ params }: { params: { id: string } }) {
  const [shoe, setShoe] = useState<Shoe | null>(null);
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
    const fetchData = async () => {
      try {
        const [shoeResponse, optionsResponse] = await Promise.all([
          fetch(`/api/shoe/${params.id}`),
          fetch('/api/options')
        ]);

        if (!shoeResponse.ok || !optionsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const [shoeData, optionsData] = await Promise.all([
          shoeResponse.json(),
          optionsResponse.json()
        ]);

        console.log('Received shoe data:', shoeData);

        if (!shoeData || !shoeData.brand || !shoeData.heelType || !shoeData.shoeType || !shoeData.dressStyle || !shoeData.location) {
          console.error('Missing required fields:', {
            hasData: !!shoeData,
            brand: shoeData?.brand,
            heelType: shoeData?.heelType,
            shoeType: shoeData?.shoeType,
            dressStyle: shoeData?.dressStyle,
            location: shoeData?.location
          });
          throw new Error('Invalid shoe data');
        }

        // Convert API response to Shoe type
        const convertedShoe: Shoe = {
          id: shoeData.id,
          brand: shoeData.brand,
          name: `${shoeData.brand} ${shoeData.heelType} ${shoeData.shoeType}`,
          imageUrl: shoeData.imageUrl || null,
          colors: shoeData.colors,
          dressStyle: shoeData.dressStyle,
          shoeType: shoeData.shoeType,
          heelType: shoeData.heelType,
          location: shoeData.location,
          notes: shoeData.notes || ''
        };

        setShoe(convertedShoe);
        setOptions(optionsData);
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
        initialData={shoe}
        isEditing={true}
        brands={options.brands}
        colors={options.colors}
        dressStyles={options.dressStyles}
        shoeTypes={options.shoeTypes}
        heelTypes={options.heelTypes}
        locations={options.locations}
      />
    </StyledContainer>
  );
}
