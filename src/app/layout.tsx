import React from 'react';
import type { Metadata } from "next";
import { Onest } from 'next/font/google';
import StyledComponentsRegistry from '../lib/registry';
import { ThemeProvider } from '../theme';
import { Nav } from '@/components/Nav';
import { MainContainer } from '@/components/MainContainer';
import { AuthProvider } from '@/lib/auth/AuthContext';
import { ScrollToTop } from '@/components/ScrollToTop';

const onest = Onest({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Shoe Collection",
  description: "Track and manage your shoe collection",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={onest.className}>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <AuthProvider>
            <ScrollToTop />
              <Nav />
              <MainContainer>
                {children}
              </MainContainer>
            </AuthProvider>
          </ThemeProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
