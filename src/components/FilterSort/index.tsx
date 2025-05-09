'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getColorMapping, getTextColor } from '@/utils/colors';
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
  StyledColorPreview,
  StyledColorOption,
  StyledClearButton,
  StyledOption,
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
import { StyledTag } from '@/components/fields/MultiSelect/index.styled';

interface FilterSortProps {
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
  displayedPolishes: number;
}

export const FilterSort = (props: FilterSortProps) => {
  return (
    <SuspenseBoundary>
      <FilterSortContent {...props} />
    </SuspenseBoundary>
  );
};

function FilterSortContent({
  brands,
  finishes,
  colors,
  currentFilters,
  totalPolishes,
  displayedPolishes,
}: FilterSortProps): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState(currentFilters);
  const [isFiltersVisible, setIsFiltersVisible] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  const ratings = [
    'A_PLUS', 'A', 'A_MINUS',
    'B_PLUS', 'B', 'B_MINUS',
    'C_PLUS', 'C', 'C_MINUS',
    'D_PLUS', 'D', 'D_MINUS',
    'F'
  ];

  const formatRatingForDisplay = (rating: string): string => {
    return rating.replace('_PLUS', '+').replace('_MINUS', '-');
  };

  const updateUrl = (newFilters: typeof filters) => {
    const params = new URLSearchParams();

    Object.entries(newFilters).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // Clear any existing values for this key
        params.delete(key);
        // Add each value as a separate parameter
        value.forEach(v => {
          if (v) {
            params.append(key, v);
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
    updateUrl(newFilters);
  };

  const handleBrandChange = (value: string) => {
    const newFilters = {
      ...filters,
      brand: value ? [value] : []
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
      finish: [],
      color: [],
      search: '',
      sort: '',
      rating: [],
      hasImage: '',
      isOld: ''
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
    const hasArrayFilters = ['brand', 'finish', 'color', 'rating'].some(
      key => filters[key as keyof typeof filters].length > 0
    );

    // Check string filters, excluding empty strings and default values
    const hasStringFilters = ['search', 'sort', 'hasImage', 'isOld'].some(
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
    if (filters.finish.length > 0) count++;
    if (filters.color.length > 0) count++;
    if (filters.rating.length > 0) count++;
    if (filters.sort) count++;
    if (filters.hasImage) count++;
    if (filters.isOld) count++;
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
          placeholder="Search polishes..."
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
        <SingleSelect
          value={filters.brand[0] || ''}
          options={brands}
          placeholder="Select brand"
          onChange={handleBrandChange}
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Finish</StyledLabel>
          {filters.finish.length > 0 && (
            <StyledClearButton onClick={() => clearFilter('finish')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <MultiSelect
          values={filters.finish}
          options={finishes}
          placeholder="Select finishes"
          onChange={(values) => {
            const newFilters = {
              ...filters,
              finish: values
            };
            setFilters(newFilters);
            updateUrl(newFilters);
          }}
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Color</StyledLabel>
          {filters.color.length > 0 && (
            <StyledClearButton onClick={() => clearFilter('color')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <MultiSelect
          values={filters.color}
          options={colors}
          placeholder="Select colors"
          renderOption={(color) => (
            <StyledColorOption key={color} $colorName={color.toLowerCase()}>
              <input
                type="checkbox"
                checked={filters.color.includes(color)}
                onChange={() => {
                  const newValues = filters.color.includes(color)
                    ? filters.color.filter(c => c !== color)
                    : [...filters.color, color];
                  const newFilters = {
                    ...filters,
                    color: newValues
                  };
                  setFilters(newFilters);
                  updateUrl(newFilters);
                }}
              />
              {color}
            </StyledColorOption>
          )}
          renderSelectedPreview={(values) => (
            values.map(color => (
              <StyledTag key={color}>
                {color}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const newValues = values.filter(c => c !== color);
                    const newFilters = {
                      ...filters,
                      color: newValues
                    };
                    setFilters(newFilters);
                    updateUrl(newFilters);
                  }}
                >
                  &times;
                </button>
              </StyledTag>
            ))
          )}
          onChange={(values) => {
            const newFilters = {
              ...filters,
              color: values
            };
            setFilters(newFilters);
            updateUrl(newFilters);
          }}
        />
      </StyledFilterGroup>

      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Rating</StyledLabel>
          {filters.rating.length > 0 && (
            <StyledClearButton onClick={() => clearFilter('rating')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <MultiSelect
          values={filters.rating}
          options={ratings}
          placeholder="Select ratings"
          renderOption={(rating) => (
            <StyledOption key={rating}>
              <input
                type="checkbox"
                checked={filters.rating.includes(rating)}
                onChange={() => {
                  const newValues = filters.rating.includes(rating)
                    ? filters.rating.filter(r => r !== rating)
                    : [...filters.rating, rating];
                  const newFilters = {
                    ...filters,
                    rating: newValues
                  };
                  setFilters(newFilters);
                  updateUrl(newFilters);
                }}
              />
              {formatRatingForDisplay(rating)}
            </StyledOption>
          )}
          renderSelectedPreview={(values) => (
            <>
              {values.map(rating => (
                <StyledTag key={rating}>
                  {formatRatingForDisplay(rating)}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const newValues = values.filter(r => r !== rating);
                      const newFilters = {
                        ...filters,
                        rating: newValues
                      };
                      setFilters(newFilters);
                      updateUrl(newFilters);
                    }}
                  >
                    &times;
                  </button>
                </StyledTag>
              ))}
            </>
          )}
          onChange={(values) => {
            const newFilters = {
              ...filters,
              rating: values
            };
            setFilters(newFilters);
            updateUrl(newFilters);
          }}
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

      <StyledFilterGroup>
        <StyledFilterHeader>
          <StyledLabel>Hide Old</StyledLabel>
          {filters.isOld && (
            <StyledClearButton onClick={() => clearFilter('isOld')}>
              Clear
            </StyledClearButton>
          )}
        </StyledFilterHeader>
        <SingleSelect
          value={filters.isOld === 'true' ? 'Yes' : 'No'}
          options={['Yes', 'No']}
          placeholder="Hide old polishes?"
          onChange={(selectedValue) => {
            handleChange('isOld')(selectedValue === 'Yes' ? 'true' : '');
          }}
        />
      </StyledFilterGroup>
    </>
  );

  return (
    <StyledFiltersContainer>
      <StyledHeader>
        <StyledCountDisplay>
          Showing {displayedPolishes} of {totalPolishes} polishes
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
            {renderFilterContent()}
            {hasActiveFilters() && (
              <StyledClearAllContainer>
                <Button onClick={clearAllFilters} $variant="danger" $fullWidth>
                  Clear All Filters
                </Button>
              </StyledClearAllContainer>
            )}
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
  );
}
