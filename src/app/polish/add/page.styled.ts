'use client';

import styled from 'styled-components';

export const StyledHeader = styled.header`
  margin-bottom: 3rem;

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    line-height: 1.2;
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  }
`;

export const StyledContainer = styled.main`
  width: 100%;
`;
