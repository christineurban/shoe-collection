'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { HiOutlineMenu, HiOutlineX } from 'react-icons/hi';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  StyledNav,
  StyledContainer,
  StyledLogo,
  StyledLink,
  StyledLinks,
  StyledHamburger
} from './index.styled';

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const publicRoutes = [
    { path: '/', label: 'Search' },
  ];

  const protectedRoutes = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/shoe/add', label: 'Add New Shoe' },
  ];

  const routes = [
    ...publicRoutes,
    ...(isAuthenticated ? protectedRoutes : []),
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMenuOpen(false);
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Check if the new focused element is within the navigation menu
    const navMenu = document.querySelector('nav');
    if (navMenu && !navMenu.contains(e.relatedTarget as Node)) {
      setIsMenuOpen(false);
    }
  };

  return (
    <StyledNav>
      <StyledContainer>
        <StyledLogo href="/">Christine's Shoe Collection 👡</StyledLogo>
        <StyledHamburger
          onClick={toggleMenu}
          onBlur={handleBlur}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          $isOpen={isMenuOpen}
        >
          {isMenuOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </StyledHamburger>
        <StyledLinks $isOpen={isMenuOpen}>
          {routes.map(({ path, label }) => (
            <StyledLink
              key={path}
              href={path}
              $isActive={pathname === path}
              aria-current={pathname === path ? 'page' : undefined}
              onClick={() => handleNavigation(path)}
            >
              {label}
            </StyledLink>
          ))}
          {isAuthenticated ? (
            <StyledLink
              href="#"
              $isActive={false}
              onClick={(e) => {
                e.preventDefault();
                logout();
                setIsMenuOpen(false);
              }}
            >
              Logout
            </StyledLink>
          ) : (
            <StyledLink
              href="#"
              $isActive={pathname === '/login'}
              onClick={(e) => {
                e.preventDefault();
                handleNavigation('/login');
              }}
            >
              Login
            </StyledLink>
          )}
        </StyledLinks>
      </StyledContainer>
    </StyledNav>
  );
}
