'use client';

import { useState } from 'react';
import { FilterSort } from '@/components/FilterSort';
import { NailPolishCard } from '@/components/NailPolishCard';
import { Rating } from '@prisma/client';
import { useRouter } from 'next/navigation';
import {
  StyledGrid,
  StyledEmptyState,
  StyledViewToggle,
  StyledToggleContainer,
} from './index.styled';
import { BsGrid } from 'react-icons/bs';
import { MdOutlineViewAgenda } from 'react-icons/md';
import { useAuth } from '@/lib/auth/AuthContext';

interface Polish {
  id: string;
  brand: string;
  name: string;
  imageUrl: string | null;
  colors: string[];
  finishes: string[];
  rating: Rating | null;
}

interface NailPolishGridProps {
  polishes: Polish[];
  brands: string[];
  finishes: string[];
  colors: string[];
  currentFilters: {
    brand: string[];
    finish: string[];
    color: string[];
    search: string;
    sort: string;
    rating: string[];
    hasImage: string;
    isOld: string;
  };
  totalPolishes: number;
}

type ViewMode = 'grid' | 'list';

export const NailPolishGrid = ({
  polishes,
  brands,
  finishes,
  colors,
  currentFilters,
  totalPolishes,
}: NailPolishGridProps) => {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { isAuthenticated } = useAuth();

  const handleChooseImage = (id: string) => {
    router.push(`/polish/${id}/select-image`);
  };

  return (
    <>
      <FilterSort
        brands={brands}
        finishes={finishes}
        colors={colors}
        currentFilters={currentFilters}
        totalPolishes={totalPolishes}
        displayedPolishes={polishes.length}
      />
      <StyledToggleContainer role="radiogroup" aria-label="View mode">
        <StyledViewToggle
          role="radio"
          aria-checked={viewMode === 'grid'}
          onClick={() => setViewMode('grid')}
          $isActive={viewMode === 'grid'}
          type="button"
          aria-label="Grid view"
        >
          <BsGrid /> Grid
        </StyledViewToggle>
        <StyledViewToggle
          role="radio"
          aria-checked={viewMode === 'list'}
          onClick={() => setViewMode('list')}
          $isActive={viewMode === 'list'}
          type="button"
          aria-label="Column view"
        >
          <MdOutlineViewAgenda /> Column
        </StyledViewToggle>
      </StyledToggleContainer>
      <StyledGrid $isSingleColumn={viewMode === 'list'}>
        {polishes.length > 0 ? (
          polishes.map((polish) => (
            <NailPolishCard
              key={polish.id}
              id={polish.id}
              brand={polish.brand}
              name={polish.name}
              imageUrl={polish.imageUrl}
              colors={polish.colors}
              finishes={polish.finishes}
              rating={polish.rating || undefined}
              onChooseImage={isAuthenticated ? handleChooseImage : undefined}
            />
          ))
        ) : (
          <StyledEmptyState>
            <h2>No Polishes Found</h2>
            <p>Try adjusting your filters to find what you're looking for.</p>
          </StyledEmptyState>
        )}
      </StyledGrid>
    </>
  );
};
