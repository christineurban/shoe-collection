'use client';

import { ButtonHTMLAttributes } from 'react';
import { StyledButton } from './index.styled';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  $variant?: 'danger' | 'secondary' | 'tertiary';
  $fullWidth?: boolean;
  $size?: 'small' | 'default';
}

export const Button = ({
  children,
  $variant,
  $fullWidth,
  $size = 'default',
  ...props
}: ButtonProps) => {
  return (
    <StyledButton
      $variant={$variant}
      $fullWidth={$fullWidth}
      $size={$size}
      {...props}
    >
      {children}
    </StyledButton>
  );
};
