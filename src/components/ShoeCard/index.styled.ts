import styled from 'styled-components';
import { getColorMapping } from '@/utils/colors';
import Image from 'next/image';

export const StyledCard = styled.div<{ $isAuthenticated?: boolean }>`
  container-name: card;
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
  cursor: ${({ $isAuthenticated }) => $isAuthenticated ? 'pointer' : 'default'};
  transition: ${({ theme }) => theme.transitions.base};

  ${({ $isAuthenticated, theme }) => $isAuthenticated && `
    &:hover {
      transform: translateY(-4px);
      box-shadow: ${theme.shadows.lg};
    }
  `}

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const StyledImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
`;

export const StyledChooseImageButton = styled.button<{ $isAuthenticated?: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background.muted};
  color: ${({ theme }) => theme.colors.text.secondary};
  border: none;
  cursor: ${({ $isAuthenticated }) => $isAuthenticated ? 'pointer' : 'default'};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: ${({ theme }) => theme.transitions.base};

  ${({ $isAuthenticated, theme }) => $isAuthenticated && `
    &:hover {
      background-color: ${theme.colors.gray[200]};
      color: ${theme.colors.gray[700]};
    }
  `}

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const StyledImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => `${theme.borderRadius.sm} ${theme.borderRadius.sm} 0 0`};
`;

export const StyledContent = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  position: relative;

  @container card (max-width: 200px) {
    padding: ${({ theme }) => theme.spacing[3]};
    gap: ${({ theme }) => theme.spacing[2]};
  }
`;

export const StyledMetadata = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing[2]};

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing[1]};
  }

  @container card (max-width: 200px) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing[1]};
  }
`;

export const StyledBrandNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  flex: 1;

  @container card (max-width: 200px) {
    order: 2;
  }
`;

export const StyledBrand = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  @media (max-width: 600px) {
    margin-bottom: ${({ theme }) => theme.spacing[1]};
  }

  @container card (max-width: 200px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

export const StyledTagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[1]};

  @media (max-width: 600px) {
    margin-top: ${({ theme }) => theme.spacing[1]};
  }

  @container card (max-width: 200px) {
    gap: ${({ theme }) => theme.spacing[1]};
  }
`;

export const StyledTag = styled.span<{ $type: string }>`
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  background: ${({ theme }) => theme.colors.gray[100]};
  color: ${({ theme }) => theme.colors.gray[700]};
  display: inline-block;

  @container card (max-width: 200px) {
    padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
  }
`;

export const StyledColorChip = styled.div<{ $color: string }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  ${({ $color }) => {
    const colorMapping = getColorMapping($color);
    return `background: ${colorMapping.background};`;
  }}
  border: 1px solid ${({ theme }) => theme.colors.border.default};
`;

export const StyledClickableArea = styled.div<{ $isAuthenticated?: boolean }>`
  cursor: ${({ $isAuthenticated }) => $isAuthenticated ? 'pointer' : 'default'};
`;

export const StyledBrandRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  width: 100%;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: ${({ theme }) => theme.spacing[1]};
  }
`;
