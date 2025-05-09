import styled, { css } from 'styled-components';

interface StyledTileContentProps {
  $variant?: 'stat' | 'attribute';
}

interface StyledTileProps {
  $isActive?: boolean;
  $isClickable?: boolean;
}

export const StyledTile = styled.div<StyledTileProps>`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: all ${({ theme }) => theme.transitions.base};
  border: 2px solid transparent;
  transform: translateY(0);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;

  .delete-icon {
    color: ${({ theme }) => theme.colors.error};
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    transition: opacity 0.2s ease;
    position: absolute;
    top: 1rem;
    right: 1rem;

    &:hover {
      opacity: 0.8;
    }

    @media (max-width: 480px) {
      top: 0.75rem;
      right: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;
    gap: 0.75rem;
  }

  ${({ $isClickable }) => $isClickable && css`
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: ${({ theme }) => theme.shadows.md};
    }
  `}

  ${({ $isActive, theme }) => $isActive && css`
    border-color: ${theme.colors.primary[500]};
    box-shadow: ${theme.shadows.md}, 0 0 0 1px ${theme.colors.primary[500]};

    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.lg}, 0 0 0 1px ${theme.colors.primary[500]};
    }
  `}
`;

export const StyledTileContent = styled.div<StyledTileContentProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  ${({ theme, $variant = 'stat' }) => $variant === 'stat' ? css`
    h3 {
      margin: 0 0 0.5rem;
      color: ${theme.colors.text.primary};
      font-size: ${theme.typography.fontSize.lg};
    }

    @media (max-width: 480px) {
      justify-content: space-between;
      height: 100%;
    }
  ` : css`
    gap: 0.5rem;

    h3 {
      margin: 0;
      color: ${theme.colors.text.primary};
    }

    div {
      display: flex;
      gap: 0.25rem;
      justify-content: space-between;
    }

    span {
      color: ${theme.colors.text.secondary};
    }
  `}
`;

export const StyledValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary[500]};
  margin: 0.5rem 0;

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    margin: 0.25rem 0;
  }
`;

export const StyledDescription = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

export const StyledPercentage = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;
