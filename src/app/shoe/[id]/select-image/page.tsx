'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ImageCapture } from '@/components/ImageCapture';
import { PageHeader } from '@/components/PageHeader';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import { Shoe } from '@/types/shoe';
import {
  StyledLink
} from './page.styled';

export default function SelectImagePage({ params }: { params: { id: string } }) {
  return (
    <SuspenseBoundary>
      <SelectImagePageContent params={params} />
    </SuspenseBoundary>
  );
}

function SelectImagePageContent({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const response = await fetch(`/api/shoe/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch shoe details');
        const data = await response.json();
        setShoe(data);
        setPreviewUrl(data.imageUrl || null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Failed to fetch shoe details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchShoe();
  }, [params.id]);

  const handleImageChange = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClearImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handleSaveImage = async () => {
    if (!imageFile) return;
    setIsSaving(true);
    try {
      // Upload image to /api/upload (as in AddEditForm)
      const formData = new FormData();
      formData.append('file', imageFile);
      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      if (!uploadRes.ok) throw new Error('Failed to upload image');
      const { publicUrl } = await uploadRes.json();
      // Save image URL to shoe
      const updateRes = await fetch('/api/update-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: params.id, imageUrl: publicUrl }),
      });
      if (!updateRes.ok) throw new Error('Failed to update shoe image');
      router.push(`/shoe/${params.id}`);
      router.refresh();
    } catch (err) {
      alert('Failed to save image.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <PageHeader title="Loading..." />
    );
  }

  if (error || !shoe) {
    return (
      <div>
        <PageHeader
          title="Error"
          description={error || 'Shoe not found'}
        />
        <StyledLink href="/">
          Return to Home
        </StyledLink>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Select Image for ${shoe.brand} ${shoe.heelType} ${shoe.shoeType}`}
        description="Take a photo or choose from gallery to add or change the image for this shoe."
      />
      <ImageCapture
        value={previewUrl}
        onChange={handleImageChange}
        isLoading={isSaving}
        onClear={handleClearImage}
      />
      <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
        <button onClick={handleSaveImage} disabled={!imageFile || isSaving}>
          {isSaving ? 'Saving...' : 'Save Image'}
        </button>
      </div>
    </div>
  );
}
