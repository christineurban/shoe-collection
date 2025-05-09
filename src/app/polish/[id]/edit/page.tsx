'use client';

import { useEffect, useState } from 'react';
import { AddEditForm } from '@/components/AddEditForm';
import { getPolishById } from '@/lib/api/polish';
import type { Polish } from '@/types/polish';
import type { Rating } from '@prisma/client';
import { PageHeader } from '@/components/PageHeader';

interface Options {
  brands: string[];
  colors: string[];
  finishes: string[];
}

interface EditPageProps {
  params: {
    id: string;
  };
  searchParams: {
    polish?: string;
  };
}

export default function EditPage({ params, searchParams }: EditPageProps) {
  const [polish, setPolish] = useState<Polish | null>(null);
  const [options, setOptions] = useState<Options>({
    brands: [],
    colors: [],
    finishes: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch polish data
        const response = await fetch(`/api/polish/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch polish');
        const polishData = await response.json();
        setPolish(polishData);

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

  if (isLoading || !polish) {
    return (
      <PageHeader
        title="Loading..."
      />
    );
  }

  const transformedPolish = {
    id: polish.id,
    brand: polish.brand,
    name: polish.name,
    imageUrl: polish.imageUrl || undefined,
    colors: polish.colors,
    finishes: polish.finishes,
    rating: polish.rating || undefined,
    link: polish.link || undefined,
    coats: polish.coats || undefined,
    notes: polish.notes || undefined,
    lastUsed: polish.lastUsed || undefined,
    totalBottles: polish.totalBottles || 1,
    emptyBottles: polish.emptyBottles || 0,
    isOld: polish.isOld
  };

  return (
    <>
      <PageHeader
        title={`Edit ${polish.brand} - ${polish.name}`}
      />
      <AddEditForm
        initialData={transformedPolish}
        isEditing={true}
        brands={options.brands}
        availableColors={options.colors}
        availableFinishes={options.finishes}
      />
    </>
  );
}
