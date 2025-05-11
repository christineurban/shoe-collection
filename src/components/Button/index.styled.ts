'use client';

import styled, { css } from 'styled-components';
import { formStyles } from '@/theme/form';

interface StyledButtonProps {
  $variant?: 'danger' | 'secondary' | 'tertiary';
  $fullWidth?: boolean;
  $size?: 'small' | 'default';
}

export const StyledButton = styled.button<StyledButtonProps>`
  height: ${props => props.$size === 'small' ? '32px' : formStyles.height};
  padding: ${props => props.$size === 'small' ? '0.25rem 0.75rem' : formStyles.padding};
  border: ${formStyles.border} transparent;
  border-radius: ${props => props.$size === 'small' ? '0' : formStyles.borderRadius};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.text.inverse};
  font-size: ${props => props.$size === 'small' ? '0.875rem' : formStyles.fontSize};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.05em;
  width: ${props => props.$fullWidth ? '100%' : 'auto'};

  &:hover {
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.text.muted};
    cursor: not-allowed;
    transform: none;
  }

  ${({ theme, $variant }) => !$variant && css`
    &:hover {
      background: ${theme.colors.primary[600]};
    }
  `}

  ${({ theme, $variant }) => $variant === 'danger' && css`
    background: ${theme.colors.error};
    &:hover {
      opacity: 0.9;
    }
  `}

  ${({ theme, $variant }) => $variant === 'secondary' && css`
    background: ${theme.colors.gray[200]};
    color: ${theme.colors.gray[700]};
    &:hover {
      background: ${theme.colors.gray[300]};
    }
  `}

  ${({ theme, $variant }) => $variant === 'tertiary' && css`
    background: transparent;
    border: 2px solid ${theme.colors.primary[500]};
    color: ${theme.colors.primary[500]};
    &:hover {
      background: ${theme.colors.primary[50]};
      border-color: ${theme.colors.primary[600]};
      color: ${theme.colors.primary[600]};
    }
    &:disabled {
      background: transparent;
      border-color: ${theme.colors.gray[300]};
      color: ${theme.colors.gray[400]};
    }
  `}
`;
