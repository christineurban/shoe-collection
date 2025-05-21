'use client';

import styled from 'styled-components';
import Link from 'next/link';

export const StyledNav = styled.nav`
  background: ${({ theme }) => theme.colors.background.gradient};
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 10;
  box-shadow: ${({ theme }) => theme.shadows.md};
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${({ theme }) => `${theme.colors.primary[400]}30`};

  @media (max-width: 480px) {
    padding: 0.5rem 0;
  }
`;

export const StyledContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 1024px) {
    padding: 0 1.5rem;
    justify-content: space-between;
  }

  @media (max-width: 480px) {
    padding: 0 1rem;
    gap: 0.5rem;
  }
`;

export const StyledLogo = styled(Link)`
  color: ${({ theme }) => theme.colors.text.inverse};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-right: auto;
  padding: 0.5rem 0;
  position: relative;
  cursor: pointer;

  &::after {
    display: none;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text.inverse};
  }

  @media (max-width: 1024px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }

  @media (max-width: 480px) {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    padding: 0.25rem 0;
  }
`;

export const StyledLink = styled(Link)<{ $isActive: boolean }>`
  color: ${({ $isActive }) =>
    $isActive ? 'white' : 'rgba(255, 255, 255, 0.5)'};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $isActive }) =>
    $isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  transition: all ${({ theme }) => theme.transitions.base};
  backdrop-filter: ${({ $isActive }) => ($isActive ? 'blur(4px)' : 'none')};

  @media (max-width: 480px) {
    padding: 0.375rem 0.75rem;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.text.inverse};
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(4px);
    text-shadow: 0 0 20px ${({ theme }) => `${theme.colors.primary[400]}50`};
  }
`;

export const StyledLinks = styled.div<{ $isOpen: boolean }>`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 1112px) {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    flex-direction: column;
    background: ${({ theme }) => theme.colors.background.gradient};
    padding: 1rem;
    gap: 0.5rem;
    transform: translateY(${({ $isOpen }) => ($isOpen ? '0' : '-100%')});
    opacity: ${({ $isOpen }) => ($isOpen ? '1' : '0')};
    visibility: ${({ $isOpen }) => ($isOpen ? 'visible' : 'hidden')};
    transition: all 0.3s ease;
    box-shadow: ${({ theme }) => theme.shadows.md};
    backdrop-filter: blur(8px);
    border-bottom: 1px solid #479bcb30;
  }

  @media (max-width: 480px) {
    padding: 0.75rem;
  }
`;

export const StyledHamburger = styled.button<{ $isOpen: boolean }>`
  display: none;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s ease;
  position: relative;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;

  svg {
    width: 32px;
    height: 32px;
    transition: transform 0.3s ease;
    transform: ${({ $isOpen }) => ($isOpen ? 'rotate(90deg)' : 'rotate(0)')};
  }

  @media (max-width: 1112px) {
    display: flex;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    padding: 0.375rem;

    svg {
      width: 28px;
      height: 28px;
    }
  }

  &:hover {
    transform: scale(1.1);
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
