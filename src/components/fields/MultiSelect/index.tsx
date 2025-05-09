'use client';

import { useRef, useState, useEffect } from 'react';
import { StyledContainer } from '../index.styled';
import {
  StyledButton,
  StyledOption,
  StyledTag,
  StyledInput,
  StyledNoMatches,
} from './index.styled';
import { StyledDropdown } from '../index.styled';

interface MultiSelectProps {
  values: string[];
  options: string[];
  placeholder?: string;
  onChange: (values: string[]) => void;
  renderOption?: (option: string) => React.ReactNode;
  renderSelectedPreview?: (values: string[]) => React.ReactNode;
  disableSearch?: boolean;
}

export const MultiSelect = ({
  values,
  options,
  placeholder = 'Select...',
  onChange,
  renderOption,
  renderSelectedPreview,
  disableSearch = false,
}: MultiSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current && !disableSearch) {
      inputRef.current.focus();
    }
  }, [isOpen, disableSearch]);

  useEffect(() => {
    setFilteredOptions(
      options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, options]);

  const handleButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleSelect = (option: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newValues = values.includes(option)
      ? values.filter(v => v !== option)
      : [...values, option];
    onChange(newValues);
  };

  const handleRemove = (valueToRemove: string) => {
    const newValues = values.filter(value => value !== valueToRemove);
    onChange(newValues);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const renderDefaultSelectedPreview = () => (
    <>
      {values.map(value => (
        <StyledTag key={value}>
          {value}
          {mounted && (
            <button onClick={(e) => {
              e.stopPropagation();
              handleRemove(value);
            }}>&times;</button>
          )}
        </StyledTag>
      ))}
    </>
  );

  const renderDefaultOption = (option: string) => (
    <StyledOption key={option}>
      <input
        type="checkbox"
        checked={values.includes(option)}
        onChange={(e) => {
          e.stopPropagation();
          handleSelect(option, e as unknown as React.MouseEvent);
        }}
      />
      {option}
    </StyledOption>
  );

  return (
    <StyledContainer ref={containerRef}>
      <StyledButton
        ref={buttonRef}
        type="button"
        onClick={handleButtonClick}
        $isOpen={isOpen}
      >
        {values.length > 0 ? (
          renderSelectedPreview ? renderSelectedPreview(values) : renderDefaultSelectedPreview()
        ) : (
          placeholder
        )}
      </StyledButton>
      <StyledDropdown $isOpen={isOpen}>
        {isOpen && !disableSearch && (
          <StyledInput
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type to search..."
          />
        )}
        {filteredOptions.map(option => (
          renderOption ? renderOption(option) : renderDefaultOption(option)
        ))}
        {filteredOptions.length === 0 && (
          <StyledNoMatches>
            No matches found
          </StyledNoMatches>
        )}
      </StyledDropdown>
    </StyledContainer>
  );
};
