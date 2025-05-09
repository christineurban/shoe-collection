'use client';

import styled from 'styled-components';

const StyledMain = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 3.5rem 2rem;
  min-height: calc(100vh - 78px); /* Account for nav height */

  @media (max-width: 640px) {
    padding: 1.5rem;
  }
`;

interface MainContainerProps {
  children: React.ReactNode;
}

export const MainContainer = ({ children }: MainContainerProps) => {
  return <StyledMain>{children}</StyledMain>;
};
