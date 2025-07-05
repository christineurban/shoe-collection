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

export const StyledContainer = styled.div<{ $isVisible: boolean }>`
  background: linear-gradient(to bottom right, #ffffff, #f8fafc);
  border-radius: 16px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06),
    inset 0 2px 4px rgba(255, 255, 255, 0.9);
  width: 100%;
  display: ${({ $isVisible }) => ($isVisible ? 'grid' : 'none')};
  grid-template-columns: 1fr;
  gap: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  padding: 1.5rem;

  /* For 2 columns layout */
  @media (min-width: 600px) and (max-width: 1199px) {
    grid-template-columns: repeat(2, 1fr);
  }

  /* For 3 columns layout */
  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (min-width: 768px) {
    padding: 2rem;
    gap: 2rem;
  }
`;

export const StyledClearAllContainer = styled.div`
  grid-column: 1 / -1;
  display: flex;
  align-items: flex-end;
  width: 100%;

  @media (max-width: 767px) {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    padding-top: 1rem;
    padding-bottom: 1rem;
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
    grid-column: 1 / -1;
    grid-row: auto;
    align-self: flex-end;
  }
`;

export const StyledFilterGroup = styled.div`
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 0.5rem;
  min-width: 0;
  height: 100%;
  margin-bottom: 1rem;

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 767px) {
    margin-bottom: 1.25rem;
  }

  @media (min-width: 768px) {
    margin-bottom: 0;
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

export const StyledFilterCountBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5em;
  height: 1.5em;
  padding: 0 0.4em;
  background: ${({ theme }) => theme.colors.primary[600]};
  color: #fff;
  font-size: 0.875rem;
  font-weight: 700;
  border-radius: 999px;
  margin-left: 0.5em;
  line-height: 1;
`;
