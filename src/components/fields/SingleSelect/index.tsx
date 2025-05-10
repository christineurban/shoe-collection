import { useRef, useState, useEffect } from 'react';
import { StyledContainer } from '../index.styled';
import {
  StyledButton,
  StyledOption,
  StyledInput,
  StyledNoMatches,
  StyledButtonContainer,
  StyledCreateNew,
} from './index.styled';
import { StyledDropdown } from '../index.styled';
import type { CSSProperties } from 'react';

interface SingleSelectProps {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
  disableSearch?: boolean;
  isBrand?: boolean;
  isColor?: boolean;
}

export const SingleSelect = ({ value, options, placeholder = 'Select...', onChange, disableSearch = false, isBrand = false, isColor = false }: SingleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

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
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange('');
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleCreateNew = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!searchTerm.trim()) return;

    try {
      const response = await fetch('/api/attributes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: isBrand ? 'brand' : 'color',
          name: searchTerm.trim()
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to create ${isBrand ? 'brand' : 'color'}`);
      }

      const data = await response.json();
      onChange(searchTerm.trim());
      setIsOpen(false);
      setSearchTerm('');
    } catch (error) {
      console.error(`Error creating ${isBrand ? 'brand' : 'color'}:`, error);
      alert(`Failed to create ${isBrand ? 'brand' : 'color'}. Please try again.`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && filteredOptions.length > 0) {
      onChange(filteredOptions[0]);
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  const inputStyles: CSSProperties = {
    width: '100%',
    height: '40px',
    padding: '0.5rem 1rem',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1rem',
  };

  return (
    <StyledContainer ref={containerRef}>
      <StyledButtonContainer $isOpen={isOpen}>
        <StyledButton
          ref={buttonRef}
          type="button"
          onClick={handleButtonClick}
          $isOpen={isOpen}
        >
          {value || placeholder}
        </StyledButton>
      </StyledButtonContainer>
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
      <StyledDropdown $isOpen={isOpen}>
        <StyledOption
          key="clear"
          $isSelected={!value}
          onClick={handleClear}
        >
          {placeholder}
        </StyledOption>
        {filteredOptions.map(option => (
          <StyledOption
            key={option}
            $isSelected={value === option}
            onClick={(e) => handleSelect(option, e)}
          >
            {option}
          </StyledOption>
        ))}
        {filteredOptions.length === 0 && searchTerm.trim() && (isBrand || isColor) && (
          <StyledCreateNew onClick={handleCreateNew}>
            Create new {isBrand ? 'brand' : 'color'}: "{searchTerm.trim()}"
          </StyledCreateNew>
        )}
        {filteredOptions.length === 0 && !searchTerm.trim() && (
          <StyledNoMatches>
            No matches found
          </StyledNoMatches>
        )}
      </StyledDropdown>
    </StyledContainer>
  );
};
