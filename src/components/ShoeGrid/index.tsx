'use client';

import { useState } from 'react';
import { FilterSort } from '@/components/FilterSort';
import { ShoeCard } from '@/components/ShoeCard';
import {
  StyledGrid,
  StyledEmptyState,
  StyledViewToggle,
  StyledToggleContainer,
} from './index.styled';
import { BsGrid } from 'react-icons/bs';
import { MdOutlineViewAgenda } from 'react-icons/md';

interface Option {
  value: string;
  label: string;
}

interface Shoe {
  id: string;
  brand: string;
  imageUrl: string | null;
  colors: string[];
  dressStyle: string;
  shoeType: string;
  heelType: string;
  location: string;
}

interface ShoeGridProps {
  shoes: Shoe[];
  brands: string[];
  colors: string[];
  dressStyles: string[];
  shoeTypes: string[];
  heelTypes: string[];
  locations: string[];
  currentFilters: {
    brand: Option[];
    colors: Option[];
    dressStyle: Option[];
    shoeType: Option[];
    heelType: Option[];
    location: Option[];
    search: string;
    sort: string;
    hasImage: string;
  };
  totalShoes: number;
}

type ViewMode = 'grid' | 'list';

export const ShoeGrid = ({
  shoes,
  brands,
  colors,
  dressStyles,
  shoeTypes,
  heelTypes,
  locations,
  currentFilters,
  totalShoes,
}: ShoeGridProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  return (
    <>
      <FilterSort
        brands={brands}
        colors={colors}
        dressStyles={dressStyles}
        shoeTypes={shoeTypes}
        heelTypes={heelTypes}
        locations={locations}
        currentFilters={currentFilters}
        totalShoes={totalShoes}
        displayedShoes={shoes.length}
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
        {shoes.length > 0 ? (
          shoes.map((shoe) => (
            <ShoeCard
              key={shoe.id}
              id={shoe.id}
              brand={shoe.brand}
              imageUrl={shoe.imageUrl}
              colors={shoe.colors}
              location={shoe.location}
              dressStyle={shoe.dressStyle}
              heelType={shoe.heelType}
              shoeType={shoe.shoeType}
            />
          ))
        ) : (
          <StyledEmptyState>
            <h2>No Shoes Found</h2>
            <p>Try adjusting your filters to find what you&apos;re looking for.</p>
          </StyledEmptyState>
        )}
      </StyledGrid>
    </>
  );
};
