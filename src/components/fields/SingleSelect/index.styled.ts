'use client';

import styled from 'styled-components';
import { formStyles } from '@/theme/form';
import {
  fieldStyles,
  chevronIconStyles,
} from '../index.styled';

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

export const StyledNoMatches = styled.div`
  padding: 0.75rem 1rem;
  color: #666;
`;

export const StyledButtonContainer = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'none' : 'flex'};
`;
