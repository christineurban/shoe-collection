'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  StyledNav,
  StyledNavList,
  StyledNavItem,
  StyledNavLink,
  StyledLogo,
  StyledAuthButton,
  StyledAuthButtonText
} from './index.styled';

const navItems = [
  { path: '/', label: 'Home' },
  { path: '/shoe/add', label: 'Add New Shoe' },
  { path: '/image-selection', label: 'Image Selection' }
];

export const Nav = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();

  return (
    <StyledNav>
      <StyledNavList>
        <StyledNavItem>
          <StyledLogo href="/">Christine's Shoe Collection 👠</StyledLogo>
        </StyledNavItem>
        {navItems.map((item) => (
          <StyledNavItem key={item.path}>
            <StyledNavLink
              href={item.path}
              $isActive={pathname === item.path}
            >
              {item.label}
            </StyledNavLink>
          </StyledNavItem>
        ))}
        <StyledNavItem>
          <StyledAuthButton
            onClick={isAuthenticated ? logout : () => window.location.href = '/login'}
          >
            <StyledAuthButtonText>
              {isAuthenticated ? 'Logout' : 'Login'}
            </StyledAuthButtonText>
          </StyledAuthButton>
        </StyledNavItem>
      </StyledNavList>
    </StyledNav>
  );
};
