'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SingleSelect } from '@/components/fields/SingleSelect';
import { MultiSelect } from '@/components/fields/MultiSelect';
import { Button } from '@/components/Button';
import { Input } from '@/components/fields/Input';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { FiFilter } from 'react-icons/fi';
import { MdClose } from 'react-icons/md';
import {
  StyledFiltersContainer,
  StyledContainer,
  StyledClearAllContainer,
  StyledFilterGroup,
  StyledFilterHeader,
  StyledLabel,
  StyledClearButton,
  StyledCountDisplay,
  StyledHeader,
  StyledToggleButton,
  StyledMobileButton,
  StyledDrawerBackdrop,
  StyledDrawer,
  StyledDrawerHeader,
  StyledDrawerTitle,
  StyledDrawerCloseButton,
  StyledFilterCountBadge,
} from './index.styled';

interface Option {
  value: string;
  label: string;
}

interface FilterSortProps {
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
  displayedShoes: number;
}

export const FilterSort = (props: FilterSortProps) => {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterSortProps['currentFilters']>(props.currentFilters);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const updateUrl = (newFilters: typeof filters) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Clear any existing values for this key
        params.delete(key);
        // Add each value as a separate parameter
        value.forEach(v => {
          if (v.value) {
            params.append(key, v.value);
          }
        });
      } else if (value) {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    router.push(queryString ? `/?${queryString}` : '/');
  };

  const handleChange = (key: keyof typeof filters) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | string
  ) => {
    const value = typeof event === 'string' ? event : event.target.value;
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);

    // If this is a search input, debounce the URL update
    if (key === 'search') {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
      const timeout = setTimeout(() => {
        updateUrl(newFilters);
      }, 500);
      setSearchTimeout(timeout);
    } else {
      updateUrl(newFilters);
    }
  };

  const handleMultiChange = (key: keyof typeof filters) => (values: Option[]) => {
    const newFilters = {
      ...filters,
      [key]: values
    };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const clearFilter = (key: keyof typeof filters) => {
    const newFilters = {
      ...filters,
      [key]: Array.isArray(filters[key]) ? [] : ''
    };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  const clearAllFilters = () => {
    const newFilters = {
      brand: [],
      colors: [],
      dressStyle: [],
      shoeType: [],
      heelType: [],
      location: [],
      search: '',
      sort: '',
      hasImage: ''
    };
    setFilters(newFilters);
    updateUrl(newFilters);
  };

  // Add these options at the component level
  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'brand-asc', label: 'Brand (A-Z)' },
    { value: 'brand-desc', label: 'Brand (Z-A)' },
    { value: 'name-asc', label: 'Name (A-Z)' },
    { value: 'name-desc', label: 'Name (Z-A)' },
    { value: 'rating-desc', label: 'Rating (High-Low)' },
    { value: 'rating-asc', label: 'Rating (Low-High)' },
    { value: 'updated-desc', label: 'Recently Updated' },
    { value: 'updated-asc', label: 'Oldest Updated' }
  ];

  const hasImageOptions = [
    { value: '', label: 'All' },
    { value: 'true', label: 'With Image' },
    { value: 'false', label: 'Without Image' }
  ];

  const hasActiveFilters = () => {
    // Check array filters
    const hasArrayFilters = ['brand', 'colors', 'dressStyle', 'shoeType', 'heelType', 'location'].some(
      key => filters[key as keyof typeof filters].length > 0
    );

    // Check string filters, excluding empty strings and default values
    const hasStringFilters = ['search', 'sort', 'hasImage'].some(
      key => {
        const value = filters[key as keyof typeof filters];
        return value !== '' && value !== 'false';
      }
    );

    return hasArrayFilters || hasStringFilters;
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  // Count the number of active filters
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.brand.length > 0) count++;
    if (filters.colors.length > 0) count++;
    if (filters.dressStyle.length > 0) count++;
    if (filters.shoeType.length > 0) count++;
    if (filters.heelType.length > 0) count++;
    if (filters.location.length > 0) count++;
    if (filters.sort) count++;
    if (filters.hasImage) count++;
    return count;
  };
  const activeFilterCount = getActiveFilterCount();

  const renderFilterContent = () => (
    <>
      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Search</StyledLabel>
          {filters.search && (
            <StyledClearButton onClick={() => clearFilter('search')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <Input
          type="text"
          placeholder="Search shoes..."
          value={filters.search}
          onChange={(value) => handleChange('search')(value)}
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Brand</StyledLabel>
          {filters.brand.length > 0 && (
            <StyledClearButton onClick={() => clearFilter('brand')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <MultiSelect
          options={props.brands}
          values={filters.brand.map(b => b.value)}
          onChange={(values) => handleMultiChange('brand')(values.map(v => ({ value: v, label: v })))}
          placeholder="Select brands..."
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Color</StyledLabel>
          {filters.colors.length > 0 && (
            <StyledClearButton onClick={() => clearFilter('colors')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <MultiSelect
          options={props.colors}
          values={filters.colors.map(c => c.value)}
          onChange={(values) => handleMultiChange('colors')(values.map(v => ({ value: v, label: v })))}
          placeholder="Select colors..."
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Dress Style</StyledLabel>
          {filters.dressStyle.length > 0 && (
            <StyledClearButton onClick={() => clearFilter('dressStyle')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <MultiSelect
          options={props.dressStyles}
          values={filters.dressStyle.map(s => s.value)}
          onChange={(values) => handleMultiChange('dressStyle')(values.map(v => ({ value: v, label: v })))}
          placeholder="Select dress styles..."
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Shoe Type</StyledLabel>
          {filters.shoeType.length > 0 && (
            <StyledClearButton onClick={() => clearFilter('shoeType')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <MultiSelect
          options={props.shoeTypes}
          values={filters.shoeType.map(t => t.value)}
          onChange={(values) => handleMultiChange('shoeType')(values.map(v => ({ value: v, label: v })))}
          placeholder="Select shoe types..."
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Heel Type</StyledLabel>
          {filters.heelType.length > 0 && (
            <StyledClearButton onClick={() => clearFilter('heelType')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <MultiSelect
          options={props.heelTypes}
          values={filters.heelType.map(t => t.value)}
          onChange={(values) => handleMultiChange('heelType')(values.map(v => ({ value: v, label: v })))}
          placeholder="Select heel types..."
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Location</StyledLabel>
          {filters.location.length > 0 && (
            <StyledClearButton onClick={() => clearFilter('location')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <MultiSelect
          options={props.locations}
          values={filters.location.map(l => l.value)}
          onChange={(values) => handleMultiChange('location')(values.map(v => ({ value: v, label: v })))}
          placeholder="Select locations..."
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Sort By</StyledLabel>
          {filters.sort && (
            <StyledClearButton onClick={() => clearFilter('sort')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <SingleSelect
          value={sortOptions.find(option => option.value === filters.sort)?.label || 'Default'}
          options={sortOptions.map(option => option.label)}
          placeholder="Select sort order"
          onChange={(selectedLabel) => {
            const selectedOption = sortOptions.find(option => option.label === selectedLabel);
            handleChange('sort')(selectedOption?.value || '');
          }}
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Has Image</StyledLabel>
          {filters.hasImage && (
            <StyledClearButton onClick={() => clearFilter('hasImage')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <SingleSelect
          value={hasImageOptions.find(option => option.value === filters.hasImage)?.label || 'All'}
          options={hasImageOptions.map(option => option.label)}
          placeholder="Select image filter"
          onChange={(selectedLabel) => {
            const selectedOption = hasImageOptions.find(option => option.label === selectedLabel);
            handleChange('hasImage')(selectedOption?.value || '');
          }}
        />
      </StyledFilterGroup>
    </>
  );

  return (
    <SuspenseBoundary>
      <StyledFiltersContainer>
        <StyledHeader>
          <StyledCountDisplay>
            Showing {props.displayedShoes} of {props.totalShoes} shoes
          </StyledCountDisplay>
          {!isMobile && (
            <StyledToggleButton
              onClick={() => setIsFiltersVisible(!isFiltersVisible)}
              aria-expanded={isFiltersVisible}
              aria-controls="filters-container"
              $isExpanded={isFiltersVisible}
            >
              {isFiltersVisible ? 'Hide Filters' : 'Show Filters'}
            </StyledToggleButton>
          )}
        </StyledHeader>

        {isMobile ? (
          <>
            <StyledMobileButton
              onClick={handleDrawerOpen}
              aria-label={`Filter & Sort${activeFilterCount > 0 ? `, ${activeFilterCount} filters selected` : ''}`}
            >
              <FiFilter />
              Filter & Sort
              {activeFilterCount > 0 && !isDrawerOpen && (
                <StyledFilterCountBadge>{activeFilterCount}</StyledFilterCountBadge>
              )}
            </StyledMobileButton>
            <StyledDrawerBackdrop
              $isOpen={isDrawerOpen}
              onClick={handleDrawerClose}
            />
            <StyledDrawer $isOpen={isDrawerOpen}>
              <StyledDrawerHeader>
                <StyledDrawerTitle>Filter & Sort</StyledDrawerTitle>
                <StyledDrawerCloseButton onClick={handleDrawerClose} aria-label="Close filter and sort drawer">
                  <MdClose />
                </StyledDrawerCloseButton>
              </StyledDrawerHeader>
              {hasActiveFilters() && (
                <StyledClearAllContainer>
                  <Button onClick={clearAllFilters} $variant="danger" $fullWidth>
                    Clear All Filters
                  </Button>
                </StyledClearAllContainer>
              )}
              {renderFilterContent()}
            </StyledDrawer>
          </>
        ) : (
          <StyledContainer id="filters-container" $isVisible={isFiltersVisible}>
            {renderFilterContent()}
            {hasActiveFilters() && (
              <StyledClearAllContainer>
                <Button onClick={clearAllFilters} $variant="danger" $fullWidth>
                  Clear All Filters
                </Button>
              </StyledClearAllContainer>
            )}
          </StyledContainer>
        )}
      </StyledFiltersContainer>
    </SuspenseBoundary>
  );
}
