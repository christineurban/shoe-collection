import styled from 'styled-components';
import { getColorMapping, getTextColor } from '@/utils/colors';

export const StyledFiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    gap: 2rem;
  }
`;

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

export const StyledFilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[4]};
  align-items: flex-start;
  padding: ${({ theme }) => theme.spacing[4]};
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
`;

export const StyledFilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
  min-width: 200px;
  flex: 1;
`;

export const StyledFilterLabel = styled.label`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

export const StyledFilterSelect = styled.select`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[100]};
  }

  &[multiple] {
    height: 120px;
  }
`;

export const StyledSearchInput = styled.input`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  width: 100%;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[100]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const StyledSortSelect = styled(StyledFilterSelect)`
  min-width: 200px;
`;

export const StyledResultsCount = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  text-align: right;
`;

export const StyledFilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.gray[300]};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary[100]};
  }
`;

export const StyledFilterIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

export const StyledFilterCount = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-left: ${({ theme }) => theme.spacing[2]};
`;

export const StyledFilterCountBadge = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 ${({ theme }) => theme.spacing[1]};
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

export const StyledFilterCountText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

export const StyledFilterCountReset = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  background: ${({ theme }) => theme.colors.gray[100]};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const StyledFilterCountResetIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

export const StyledClearAllContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-end;
  width: 100%;

  @media (max-width: 767px) {
    margin-top: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }

  @media (min-width: 768px) {
    margin-top: 0;
    padding-top: 0;
    border-top: none;
  }

  @media (min-width: 600px) and (max-width: 1199px) {
    grid-column: 1 / -1;
  }

  @media (min-width: 1200px) {
    grid-column: 3;
    grid-row: 3;
    align-self: flex-end;
  }
`;

export const StyledFilterHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 24px;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

export const StyledLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: #2D3748;
  letter-spacing: 0.025em;
  padding: 0.25rem 0;
`;

export const StyledColorPreview = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.25rem;
`;

export const StyledColorOption = styled.label<{ $colorName: string }>`
  ${({ $colorName }) => {
    const colorMapping = getColorMapping($colorName);
    return colorMapping.isGradient
      ? `background: ${colorMapping.background};`
      : `background-color: ${colorMapping.background};`;
  }}
  color: ${({ $colorName }) => {
    const colorMapping = getColorMapping($colorName);
    return getTextColor(colorMapping.background);
  }};
  border-radius: 8px;
  margin: 0.25rem;
  padding: 0.875rem 1rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  min-height: 44px;
  user-select: none;

  &:hover {
    opacity: 0.9;
  }

  input {
    margin-right: 0.75rem;
    width: 20px;
    height: 20px;
    cursor: pointer;
  }

  @media (min-width: 768px) {
    border-radius: 6px;
    padding: 0.75rem 1rem;
    min-height: 40px;

    input {
      width: 16px;
      height: 16px;
    }
  }
`;

export const StyledClearButton = styled.button`
  background: none;
  border: none;
  color: #E53E3E;
  font-size: 0.75rem;
  padding: 0.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  transition: all 0.2s ease;
  font-weight: 500;
  min-height: 24px;
  min-width: 24px;

  &:hover {
    color: #C53030;
  }

  &:focus {
    outline: none;
  }

  &::before {
    content: '×';
    font-size: 1.25rem;
    line-height: 1;
  }
`;

export const StyledOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.875rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  margin: 0.25rem;
  min-height: 44px;
  user-select: none;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }

  input {
    margin-right: 0.75rem;
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: ${({ theme }) => theme.colors.primary[500]};
  }

  @media (min-width: 768px) {
    padding: 0.75rem 1rem;
    border-radius: 6px;
    min-height: 40px;

    input {
      width: 16px;
      height: 16px;
    }
  }
`;

export const StyledCountDisplay = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 0.875rem;
  white-space: nowrap;
`;

export const StyledHeader = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  gap: 1rem;
  width: 100%;
  flex-wrap: wrap;
`;

export const StyledToggleButton = styled.button<{ $isExpanded: boolean }>`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary[600]};
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;

  &:after {
    content: '${({ $isExpanded }) => $isExpanded ? '↑' : '↓'}';
    margin-left: 0.25rem;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:focus {
    outline: none;
  }

  &:focus-visible {
    outline: none;
    box-shadow: none;
  }

  &:focus:not(:focus-visible) {
    outline: none;
    box-shadow: none;
  }
`;

export const StyledMobileButton = styled.button`
  display: none;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-bottom: 1rem;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  @media (max-width: 767px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }
`;

export const StyledDrawerBackdrop = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  opacity: ${({ $isOpen }) => ($isOpen ? 1 : 0)};
  transition: opacity 0.3s ease;
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'auto' : 'none')};

  @media (max-width: 767px) {
    display: block;
  }
`;

export const StyledDrawer = styled.div<{ $isOpen: boolean }>`
  display: none;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  z-index: 1001;
  transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
  transition: transform 0.3s ease;
  max-height: 90vh;
  overflow-y: auto;
  padding: 1rem;
  box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1);

  @media (max-width: 767px) {
    display: block;
  }
`;

export const StyledDrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

export const StyledDrawerTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

export const StyledDrawerCloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;
