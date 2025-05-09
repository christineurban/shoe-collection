'use client';

import { useState, useEffect, useRef, KeyboardEvent } from 'react';
import {
  StyledContainer,
  StyledInput,
  StyledDropdown,
  StyledOption,
} from './index.styled';

interface Option {
  value: string;
  label: string;
}

interface AutocompleteProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const Autocomplete = ({
  options,
  value,
  onChange,
  disabled = false,
  placeholder = 'Select...',
}: AutocompleteProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Find the label for the current value
  const selectedOption = options.find(option => option.value === value);

  useEffect(() => {
    setInputValue(selectedOption?.label || '');
  }, [selectedOption]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };

  const handleOptionClick = (option: Option) => {
    onChange(option.value);
    setInputValue(option.label);
    setIsOpen(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(prev =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setIsOpen(true);
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        event.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
          handleOptionClick(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setInputValue(selectedOption?.label || '');
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
  };

  return (
    <StyledContainer ref={containerRef}>
      <StyledInput
        type="text"
        value={inputValue}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleFocus}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={placeholder}
      />
      <StyledDropdown $isOpen={isOpen}>
        {filteredOptions.map((option, index) => (
          <StyledOption
            key={option.value}
            onClick={() => handleOptionClick(option)}
            $isHighlighted={index === highlightedIndex}
          >
            {option.label}
          </StyledOption>
        ))}
      </StyledDropdown>
    </StyledContainer>
  );
};
