import { Suspense } from 'react';

interface SuspenseBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SuspenseBoundary = ({ children, fallback = <div>Loading...</div> }: SuspenseBoundaryProps) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};
