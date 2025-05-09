'use client';

import styled from 'styled-components';

export const StyledContainer = styled.div`
  width: 100%;
  margin-bottom: 2rem;
`;

export const StyledHeader = styled.div`
  h1::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 100%;
    height: 4px;
    background: ${({ theme }) => theme.colors.background.gradient};
    border-radius: ${({ theme }) => theme.borderRadius.full};
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    color: ${({ theme }) => theme.colors.text.secondary};
    margin-top: 1rem;
    margin-bottom: 0;

    @media (max-width: 1024px) {
      font-size: ${({ theme }) => theme.typography.fontSize.base};
    }

    @media (max-width: 480px) {
      font-size: ${({ theme }) => theme.typography.fontSize.sm};
      margin-top: 0;
    }
  }
`;
