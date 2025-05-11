import React from 'react';
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import StyledComponentsRegistry from '../lib/registry';
import { ThemeProvider } from '../theme';
import { Nav } from '@/components/Nav';
import { MainContainer } from '@/components/MainContainer';
import { AuthProvider } from '@/lib/auth/AuthContext';

const onest = Onest({
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-onest',
  weight: ['400', '500', '600', '700'],
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: true,
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Onest:wght@100..900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <StyledComponentsRegistry>
          <ThemeProvider>
            <AuthProvider>
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
