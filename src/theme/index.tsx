'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { GlobalStyles } from './globalStyles';
import { Theme } from './types';

export const theme: Theme = {
  colors: {
    primary: {
      50: '#f0f7fa',
      100: '#d1e6f2',
      200: '#a3cde5',
      300: '#75b4d8',
      400: '#479bcb',
      500: '#207DA9',
      600: '#1a6487',
      700: '#134b65',
      800: '#0d3244',
      900: '#061922',
    },
    secondary: {
      50: '#f0f9f7',
      100: '#d1e9e3',
      200: '#a3d3c7',
      300: '#75bdab',
      400: '#47a78f',
      500: '#166B5D',
      600: '#12564b',
      700: '#0d4039',
      800: '#092b26',
      900: '#041513',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    blue: {
      100: '#dbeafe',
      700: '#1d4ed8',
    },
    purple: {
      100: '#f3e8ff',
      700: '#6d28d9',
    },
    pink: {
      100: '#fce7f3',
      700: '#be185d',
    },
    orange: {
      100: '#ffedd5',
      700: '#c2410c',
    },
    green: {
      100: '#dcfce7',
      700: '#15803d',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      muted: '#6b7280',
      inverse: '#ffffff',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      muted: '#f3f4f6',
      gradient: 'linear-gradient(90deg, #166B5D 0%, #207DA9 100%)',
    },
    border: {
      default: '#e5e7eb',
      light: '#f3f4f6',
      medium: '#d1d5db',
      dark: '#9ca3af',
    },
    error: '#dc2626',
    success: '#16a34a',
    warning: '#ca8a04',
  },
  typography: {
    fontFamily: {
      body: "'Onest', system-ui, -apple-system, sans-serif",
      heading: "'Onest', system-ui, -apple-system, sans-serif",
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2rem',
    },
    fontWeights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      none: 1,
      tight: 1.25,
      snug: 1.375,
      normal: 1.5,
      relaxed: 1.625,
      loose: 2,
    },
    letterSpacing: {
      tighter: '-0.05em',
      tight: '-0.025em',
      normal: '0',
      wide: '0.025em',
      wider: '0.05em',
      widest: '0.1em',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    '3xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    focus: '0 0 0 1px rgba(203, 213, 225, 0.3)',
  },
  transitions: {
    base: '0.2s ease-in-out',
    slow: '0.3s ease-in-out',
    fast: '0.1s ease-in-out',
    all: 'all 0.2s ease-in-out',
    colors: 'colors 0.2s ease-in-out',
    transform: 'transform 0.2s ease-in-out',
  },
} as const;


interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <StyledThemeProvider theme={theme}>
      <GlobalStyles theme={theme} />
      {children}
    </StyledThemeProvider>
  );
};
