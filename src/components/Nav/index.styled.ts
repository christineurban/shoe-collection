'use client';

import styled from 'styled-components';
import Link from 'next/link';

export const StyledNav = styled.nav`
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 1rem 2rem;
`;

export const StyledNavList = styled.ul`
  display: flex;
  align-items: center;
  gap: 2rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const StyledNavItem = styled.li`
  display: flex;
  align-items: center;
`;

export const StyledNavLink = styled(Link)<{ $isActive: boolean }>`
  color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.text.primary : theme.colors.text.secondary};
  text-decoration: none;
  font-weight: ${({ $isActive }) => $isActive ? '600' : '400'};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const StyledLogo = styled(Link)`
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: 1.5rem;
  font-weight: 600;
  text-decoration: none;
  margin-right: 2rem;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const StyledAuthButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.text.secondary};
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const StyledAuthButtonText = styled.span`
  font-weight: 500;
`;
