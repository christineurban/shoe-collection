'use client';

import styled from 'styled-components';
import { theme } from '../lib/theme';

export const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};

  h1 {
    margin: 0;
    font-size: ${theme.typography.fontSize.xxl};
    color: ${theme.colors.text};
  }
`;

export const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${theme.spacing.lg};
`;
