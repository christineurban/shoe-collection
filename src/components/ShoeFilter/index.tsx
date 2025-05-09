'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  StyledContainer,
  StyledFilterSection,
  StyledFilterGroup,
  StyledFilterLabel,
  StyledFilterSelect,
  StyledSearchInput,
  StyledSortSelect,
  StyledResultsCount,
  StyledFilterButton,
  StyledFilterIcon,
  StyledFilterCount,
  StyledFilterCountBadge,
  StyledFilterCountText,
  StyledFilterCountReset,
  StyledFilterCountResetIcon,
} from './index.styled';
import { IoFilter } from 'react-icons/io5';
import { IoClose } from 'react-icons/io5';

interface ShoeFilterProps {
  brands: string[];
  dressStyles: string[];
  shoeTypes: string[];
  heelTypes: string[];
  locations: string[];
  currentFilters: {
    brand: string[];
    dressStyle: string[];
    shoeType: string[];
    heelType: string[];
    location: string[];
    search: string;
    sort: string;
    hasImage: string;
  };
  totalShoes: number;
  displayedShoes: number;
}

export const ShoeFilter = ({
  brands,
  dressStyles,
  shoeTypes,
  heelTypes,
  locations,
  currentFilters,
  totalShoes,
  displayedShoes,
}: ShoeFilterProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterChange = (key: string, value: string[]) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value.length > 0) {
      params.set(key, value.join(','));
    } else {
      params.delete(key);
    }
    router.push(`?${params.toString()}`);
  };

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('sort', value);
    } else {
      params.delete('sort');
    }
    router.push(`?${params.toString()}`);
  };

  const handleHasImageChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set('hasImage', value);
    } else {
      params.delete('hasImage');
    }
    router.push(`?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push('/');
  };

  const activeFilterCount = Object.values(currentFilters).reduce((count, value) => {
    if (Array.isArray(value)) {
      return count + value.length;
    }
    return count + (value ? 1 : 0);
  }, 0);

  return (
    <StyledContainer>
      <StyledFilterSection>
        <StyledFilterGroup>
          <StyledFilterLabel htmlFor="search">Search</StyledFilterLabel>
          <StyledSearchInput
            id="search"
            type="text"
            placeholder="Search shoes..."
            value={currentFilters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </StyledFilterGroup>

        <StyledFilterGroup>
          <StyledFilterLabel htmlFor="sort">Sort By</StyledFilterLabel>
          <StyledSortSelect
            id="sort"
            value={currentFilters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="">Default</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="brand_asc">Brand (A-Z)</option>
            <option value="brand_desc">Brand (Z-A)</option>
          </StyledSortSelect>
        </StyledFilterGroup>

        <StyledFilterGroup>
          <StyledFilterLabel htmlFor="hasImage">Image Status</StyledFilterLabel>
          <StyledFilterSelect
            id="hasImage"
            value={currentFilters.hasImage}
            onChange={(e) => handleHasImageChange(e.target.value)}
          >
            <option value="">All</option>
            <option value="true">Has Image</option>
            <option value="false">No Image</option>
          </StyledFilterSelect>
        </StyledFilterGroup>

        <StyledFilterButton
          type="button"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          aria-expanded={isFilterOpen}
          aria-controls="filter-section"
        >
          <StyledFilterIcon>
            <IoFilter />
          </StyledFilterIcon>
          Filters
          {activeFilterCount > 0 && (
            <StyledFilterCount>
              <StyledFilterCountBadge>
                <StyledFilterCountText>{activeFilterCount}</StyledFilterCountText>
              </StyledFilterCountBadge>
              <StyledFilterCountReset onClick={handleResetFilters}>
                <StyledFilterCountResetIcon>
                  <IoClose />
                </StyledFilterCountResetIcon>
                Reset
              </StyledFilterCountReset>
            </StyledFilterCount>
          )}
        </StyledFilterButton>
      </StyledFilterSection>

      {isFilterOpen && (
        <StyledFilterSection id="filter-section">
          <StyledFilterGroup>
            <StyledFilterLabel htmlFor="brand">Brand</StyledFilterLabel>
            <StyledFilterSelect
              id="brand"
              multiple
              value={currentFilters.brand}
              onChange={(e) =>
                handleFilterChange(
                  'brand',
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </StyledFilterSelect>
          </StyledFilterGroup>

          <StyledFilterGroup>
            <StyledFilterLabel htmlFor="dressStyle">Dress Style</StyledFilterLabel>
            <StyledFilterSelect
              id="dressStyle"
              multiple
              value={currentFilters.dressStyle}
              onChange={(e) =>
                handleFilterChange(
                  'dressStyle',
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {dressStyles.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </StyledFilterSelect>
          </StyledFilterGroup>

          <StyledFilterGroup>
            <StyledFilterLabel htmlFor="shoeType">Shoe Type</StyledFilterLabel>
            <StyledFilterSelect
              id="shoeType"
              multiple
              value={currentFilters.shoeType}
              onChange={(e) =>
                handleFilterChange(
                  'shoeType',
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {shoeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </StyledFilterSelect>
          </StyledFilterGroup>

          <StyledFilterGroup>
            <StyledFilterLabel htmlFor="heelType">Heel Type</StyledFilterLabel>
            <StyledFilterSelect
              id="heelType"
              multiple
              value={currentFilters.heelType}
              onChange={(e) =>
                handleFilterChange(
                  'heelType',
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {heelTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </StyledFilterSelect>
          </StyledFilterGroup>

          <StyledFilterGroup>
            <StyledFilterLabel htmlFor="location">Location</StyledFilterLabel>
            <StyledFilterSelect
              id="location"
              multiple
              value={currentFilters.location}
              onChange={(e) =>
                handleFilterChange(
                  'location',
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </StyledFilterSelect>
          </StyledFilterGroup>
        </StyledFilterSection>
      )}

      <StyledResultsCount>
        Showing {displayedShoes} of {totalShoes} shoes
      </StyledResultsCount>
    </StyledContainer>
  );
};
