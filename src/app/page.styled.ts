'use client';

import styled from 'styled-components';

export const StyledHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};

  h1 {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing[6]};
`;
