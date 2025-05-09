'use client';

import { StyledContainer, StyledHeader } from './index.styled';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader = ({ title, description }: PageHeaderProps) => {
  return (
    <StyledContainer>
      <StyledHeader>
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </StyledHeader>
    </StyledContainer>
  );
};
