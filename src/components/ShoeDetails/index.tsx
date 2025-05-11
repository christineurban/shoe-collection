'use client';

import Image from 'next/image';
import { PageHeader } from '@/components/PageHeader';
import { Button } from '@/components/Button';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { useAuth } from '@/lib/auth/AuthContext';
import { Shoe } from '@/types/shoe';
import {
  StyledContainer,
  StyledDetails,
  StyledImageContainer,
  StyledDetailsContent,
  StyledDisabledMessage
} from './index.styled';
import { useRouter, useSearchParams } from 'next/navigation';

interface ShoeDetailsProps {
  shoe: Shoe;
  title?: string;
}

export const ShoeDetails = (props: ShoeDetailsProps) => {
  return (
    <SuspenseBoundary>
      <ShoeDetailsContent {...props} />
    </SuspenseBoundary>
  );
};

function ShoeDetailsContent({ shoe, title }: ShoeDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const returnTo = searchParams.get('returnTo');

  return (
    <StyledContainer>
      <PageHeader
        title={title || `${shoe.brand} ${shoe.heelType} ${shoe.shoeType}`}
      />
      <StyledDetails>
        <div>
          <StyledImageContainer>
            {shoe.imageUrl ? (
              <Image
                src={shoe.imageUrl}
                alt={`${shoe.brand} ${shoe.heelType} ${shoe.shoeType}`}
                fill
                priority
              />
            ) : (
              <p>No image</p>
            )}
          </StyledImageContainer>
        </div>
        <StyledDetailsContent>
          <h2>Details</h2>
          <p><strong>Color</strong>{shoe.colors.join(', ')}</p>
          <p><strong>Dress Style</strong>{shoe.dressStyle}</p>
          <p><strong>Shoe Type</strong>{shoe.shoeType}</p>
          <p><strong>Heel Type</strong>{shoe.heelType}</p>
          <p><strong>Location</strong>{shoe.location}</p>
          <p><strong>Notes</strong>{shoe.notes || '-'}</p>
          {isAuthenticated ? (
            <Button onClick={() => router.push(`/shoe/${shoe.id}/edit?returnTo=${returnTo || `/shoe/${shoe.id}`}`)} $fullWidth>
              Edit Shoe
            </Button>
          ) : (
            <StyledDisabledMessage>
              Please log in to edit this shoe
            </StyledDisabledMessage>
          )}
        </StyledDetailsContent>
      </StyledDetails>
    </StyledContainer>
  );
}
