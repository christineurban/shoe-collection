import { createGlobalStyle } from 'styled-components';
import { Theme } from './types';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  *:focus {
    outline: none !important;
  }

  *:focus-visible {
    outline: none !important;
    box-shadow: 0 0 0 2px rgba(203, 213, 225, 0.4) !important;
  }

  html {
    font-size: 16px;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.body};
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: ${({ theme }) => theme.typography.lineHeight.normal};
    color: ${({ theme }) => theme.colors.text.primary};
    background:
      linear-gradient(120deg, ${({ theme }) => `${theme.colors.primary[100]}15`} 0%, transparent 30%),
      linear-gradient(60deg, ${({ theme }) => `${theme.colors.primary[100]}10`} 10%, transparent 40%),
      ${({ theme }) => theme.colors.background.primary};
    min-height: 100vh;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }

  a {
    color: ${({ theme }) => theme.colors.primary[600]};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.base};
    position: relative;

    &:hover {
      color: ${({ theme }) => theme.colors.primary[700]};
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: ${({ theme }) => theme.colors.background.gradient};
      transition: width ${({ theme }) => theme.transitions.base};
    }

    &:hover::after {
      width: 100%;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.typography.fontFamily.heading};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
    line-height: ${({ theme }) => theme.typography.lineHeight.tight};
    color: ${({ theme }) => theme.colors.text.primary};
    margin-bottom: ${({ theme }) => theme.spacing[4]};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
    background: ${({ theme }) => theme.colors.background.gradient};
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: ${({ theme }) => theme.spacing[6]};
    position: relative;
    display: inline-block;

    @media (max-width: 1024px) {
      font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    }

    @media (max-width: 480px) {
      font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
      margin-bottom: ${({ theme }) => theme.spacing[4]};
    }
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    color: ${({ theme }) => theme.colors.primary[700]};

    @media (max-width: 1024px) {
      font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    }

    @media (max-width: 480px) {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
    }
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};

    @media (max-width: 1024px) {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
    }

    @media (max-width: 480px) {
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
    }
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
  }

  h5 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  h6 {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    line-height: ${({ theme }) => theme.typography.lineHeight.relaxed};
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    padding: 0;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 1px rgba(203, 213, 225, 0.3);
    }
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
    border: 2px solid ${({ theme }) => theme.colors.border.light};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: ${({ theme }) => theme.colors.background.primary};
    transition: all ${({ theme }) => theme.transitions.base};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.border.medium};
      box-shadow: 0 0 0 1px rgba(203, 213, 225, 0.3);
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.text.muted};
    }
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.primary[200]};
    color: ${({ theme }) => theme.colors.primary[900]};
  }
`;
