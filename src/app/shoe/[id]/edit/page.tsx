'use client';

import { useEffect, useState } from 'react';
import { AddEditForm } from '@/components/AddEditForm';
import { getShoeById } from '@/lib/api/shoe';
import type { Shoe } from '@/types/shoe';
import { PageHeader } from '@/components/PageHeader';

interface Options {
  brands: string[];
  colors: string[];
}

interface EditPageProps {
  params: {
    id: string;
  };
  searchParams: {
    shoe?: string;
  };
}

export default function EditPage({ params, searchParams }: EditPageProps) {
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [options, setOptions] = useState<Options>({
    brands: [],
    colors: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch shoe data
        const response = await fetch(`/api/shoe/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch shoe');
        const shoeData = await response.json();
        setShoe(shoeData);

        // Fetch options
        const optionsResponse = await fetch('/api/options');
        if (!optionsResponse.ok) throw new Error('Failed to fetch options');
        const optionsData = await optionsResponse.json();
        setOptions(optionsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (isLoading || !shoe) {
    return (
      <PageHeader
        title="Loading..."
      />
    );
  }

  const transformedShoe = {
    id: shoe.id,
    brand: shoe.brand,
    name: shoe.name,
    imageUrl: shoe.imageUrl || undefined,
    color: shoe.color,
    location: shoe.location,
    shoeType: shoe.shoeType,
    heelType: shoe.heelType,
    dressStyle: shoe.dressStyle,
    link: shoe.link || undefined,
    notes: shoe.notes || undefined
  };

  return (
    <>
      <PageHeader
        title={`Edit ${shoe.brand} - ${shoe.name}`}
      />
      <AddEditForm
        initialData={transformedShoe}
        isEditing={true}
        brands={options.brands}
        colors={options.colors}
      />
    </>
  );
}
