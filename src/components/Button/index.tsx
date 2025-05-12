'use client';

import { ButtonHTMLAttributes } from 'react';
import { StyledButton, StyledButtonSpinner } from './index.styled';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: 'danger' | 'secondary' | 'tertiary';
  $fullWidth?: boolean;
  $size?: 'small' | 'default';
  $isLoading?: boolean;
}

export const Button = ({
  children,
  $variant,
  $fullWidth,
  $size = 'default',
  $isLoading = false,
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      $variant={$variant}
      $fullWidth={$fullWidth}
      $size={$size}
      disabled={props.disabled || $isLoading}
      aria-busy={$isLoading}
      {...props}
    >
      {$isLoading ? <StyledButtonSpinner aria-label="Loading" /> : children}
    </StyledButton>
  );
};
