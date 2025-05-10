'use client';

import styled from 'styled-components';
import { formStyles } from '@/theme/form';
import {
  fieldStyles,
  chevronIconStyles,
} from '../index.styled';

export const StyledContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledButtonContainer = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'none' : 'flex'};
`;

export const StyledButton = styled.button<{ $isOpen: boolean }>`
  ${fieldStyles}
  ${chevronIconStyles}
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${formStyles.height};
`;

export const StyledOption = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary[50] : 'none'};
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary[700] : theme.colors.text.primary};
  text-align: left;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:after {
    content: ${({ $isSelected }) => $isSelected ? "'✓'" : "none"};
    font-size: 1.1em;
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 0.5rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
`;

export const StyledDropdown = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin-top: 0.5rem;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export const StyledNoMatches = styled.div`
  padding: 0.75rem 1rem;
  color: #666;
`;

export const StyledCreateNew = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.primary[500]};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.base};
  background: none;
  border: none;
  text-align: left;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;
