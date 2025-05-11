import styled from 'styled-components';

export const StyledContainer = styled.div`
  width: 100%;
`;

export const StyledImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: ${({ theme }) => theme.colors.background.muted};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

export const StyledImageActions = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  button {
    width: 100%;
  }
`;

export const StyledDisabledMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 4px;
  margin: 0;
`;

export const StyledDetails = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 4rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

export const StyledDetailsContent = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 2rem 0;
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    padding-bottom: 1rem;
    border-bottom: 2px solid ${({ theme }) => theme.colors.border.dark};

    @media (max-width: 768px) {
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
      margin: 0 0 1.5rem 0;
    }
  }

  p {
    margin: 0;
    padding: 1rem 0;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.secondary};
    display: flex;
    align-items: baseline;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.medium};

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem 0;
    }

    &:last-of-type {
      border-bottom: none;
    }

    strong {
      color: ${({ theme }) => theme.colors.text.primary};
      margin-right: 1rem;
      min-width: 140px;
      font-weight: ${({ theme }) => theme.typography.fontWeights.medium};

      @media (max-width: 768px) {
        min-width: auto;
        margin-right: 0;
      }
    }

    a {
      color: ${({ theme }) => theme.colors.primary[500]};
      text-decoration: none;
      transition: color ${({ theme }) => theme.transitions.base};
      padding: 0.25rem 0.75rem;
      border-radius: ${({ theme }) => theme.borderRadius.md};
      background: ${({ theme }) => theme.colors.primary[50]};
      font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
      word-break: break-all;

      &:hover {
        color: ${({ theme }) => theme.colors.primary[600]};
        background: ${({ theme }) => theme.colors.primary[100]};
      }
    }
  }
`;
