'use client';

import { useEffect, useState } from 'react';
import { AddEditForm } from '@/components/AddEditForm';
import type { Shoe, ShoeWithRelations } from '@/types/shoe';
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

        // Convert ShoeWithRelations to Shoe
        const convertedShoe: Shoe = {
          id: shoeData.id,
          name: `${shoeData.brand.name} ${shoeData.heel_type.name} ${shoeData.shoe_type.name}`,
          brand: shoeData.brand.name,
          imageUrl: shoeData.image_url,
          colors: shoeData.colors.map((c: { color: { name: string } }) => c.color.name),
          dressStyle: shoeData.dress_style.name,
          shoeType: shoeData.shoe_type.name,
          heelType: shoeData.heel_type.name,
          location: shoeData.location.name,
          notes: shoeData.notes
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
