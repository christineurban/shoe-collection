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

interface SingleSelectProps {
  value: string;
  options: string[];
  placeholder?: string;
  onChange: (value: string) => void;
  disableSearch?: boolean;
  isBrand?: boolean;
  isColor?: boolean;
  'data-error'?: boolean;
}

export const SingleSelect = ({ value, options, placeholder = 'Select...', onChange, disableSearch = false, isBrand = false, isColor = false, 'data-error': hasError }: SingleSelectProps) => {
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

    const newBrand = searchTerm.trim();
    setSearchTerm('');
    setIsOpen(false);
    onChange(newBrand);
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

  return (
    <StyledContainer ref={containerRef}>
      <StyledButtonContainer $isOpen={isOpen}>
        <StyledButton
          ref={buttonRef}
          type="button"
          onClick={handleButtonClick}
          $isOpen={isOpen}
          data-error={hasError}
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
          <StyledCreateNew
            type="button"
            onClick={handleCreateNew}
          >
            Create new {isBrand ? 'brand' : 'color'}: &ldquo;{searchTerm.trim()}&rdquo;
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
