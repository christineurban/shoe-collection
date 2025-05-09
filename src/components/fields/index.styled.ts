'use client';

import styled, { css } from 'styled-components';
import { theme } from '@/lib/theme';
import { formStyles } from '@/theme/form';

// Base field container styles
export const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  isolation: isolate;
  z-index: 0;

  &:focus-within {
    z-index: 1;
  }
`;

// Base label styles
export const StyledLabel = styled.label`
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text};
`;

// Base field wrapper styles (for label + field combination)
export const StyledFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xs};
  width: 100%;

  .error {
    color: ${theme.colors.error};
    font-size: ${theme.typography.fontSize.sm};
    margin-top: ${theme.spacing.xs};
  }
`;

// Shared field styles
export const fieldStyles = css`
  min-height: ${formStyles.height};
  padding: ${formStyles.padding};
  border: ${formStyles.border} ${({ theme }) => theme.colors.border.default};
  border-radius: ${formStyles.borderRadius};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${formStyles.fontSize};
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.base};
  position: relative;

  &:hover {
    border-color: #666666;
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.border.medium};
    box-shadow: 0 0 0 1px rgba(203, 213, 225, 0.3);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.border.default};
    cursor: not-allowed;
  }
`;

// Chevron icon styles
export const chevronIconStyles = css<{ $isOpen: boolean }>`
  &:after {
    content: '';
    width: 1em;
    height: 1em;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    transition: transform 0.2s ease;
    transform: ${({ $isOpen }) => $isOpen ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

export const StyledDropdown = styled.div<{ $isOpen: boolean }>`
    position: absolute;
    background: ${({ theme }) => theme.colors.background.primary};
    border: 2px solid ${({ theme }) => theme.colors.border.medium};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: ${({ theme }) => theme.shadows.lg};
    max-height: ${({ $isOpen }) => ($isOpen ? '200px' : '0')};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    overflow-y: ${({ $isOpen }) => ($isOpen ? 'auto' : 'hidden')};
    transition: all 0.2s ease;
    z-index: 10;
    width: 100%;
    margin-top: 4px;
`;
