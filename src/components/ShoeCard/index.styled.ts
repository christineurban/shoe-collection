import styled from 'styled-components';
import { getColorMapping, getTextColor } from '@/utils/colors';
import Image from 'next/image';

export const StyledCard = styled.div<{ $isAuthenticated: boolean }>`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  transition: all ${({ theme }) => theme.transitions.base};
  cursor: ${({ $isAuthenticated }) => ($isAuthenticated ? 'pointer' : 'default')};

  &:hover {
    transform: ${({ $isAuthenticated }) => ($isAuthenticated ? 'translateY(-2px)' : 'none')};
    box-shadow: ${({ theme, $isAuthenticated }) =>
      $isAuthenticated ? theme.shadows.md : theme.shadows.sm};
  }

  @container card (max-width: 200px) {
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

export const StyledImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: ${({ theme }) => theme.colors.gray[50]};
  overflow: hidden;
`;

export const StyledImage = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const StyledContent = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};

  @container card (max-width: 200px) {
    padding: ${({ theme }) => theme.spacing[2]};
    gap: ${({ theme }) => theme.spacing[1]};
  }
`;

export const StyledBrand = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  @container card (max-width: 200px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

export const StyledName = styled.h3`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin: 0;

  @container card (max-width: 200px) {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }
`;

export const StyledChooseImageButton = styled.button<{
  $isNoImage?: boolean;
  $isAuthenticated: boolean;
}>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${({ theme, $isNoImage }) =>
    $isNoImage ? theme.colors.error[100] : theme.colors.primary[100]};
  color: ${({ theme, $isNoImage }) =>
    $isNoImage ? theme.colors.error[700] : theme.colors.primary[700]};
  border: none;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: ${({ $isAuthenticated }) => ($isAuthenticated ? 'pointer' : 'default')};
  opacity: ${({ $isAuthenticated }) => ($isAuthenticated ? 1 : 0.5)};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme, $isNoImage, $isAuthenticated }) =>
      $isAuthenticated
        ? $isNoImage
          ? theme.colors.error[200]
          : theme.colors.primary[200]
        : $isNoImage
        ? theme.colors.error[100]
        : theme.colors.primary[100]};
  }
`;

export const StyledClickableArea = styled.div<{ $isAuthenticated: boolean }>`
  cursor: ${({ $isAuthenticated }) => ($isAuthenticated ? 'pointer' : 'default')};
`;
