'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../Button';
import { SingleSelect } from '../fields/SingleSelect';
import { Input } from '../fields/Input';
import { SuccessMessage } from '@/components/SuccessMessage';
import {
  StyledForm,
  StyledFormGroup,
  StyledTextarea,
  StyledButtonGroup,
  StyledFormSection,
  StyledFormRow,
  StyledDangerZone
} from './index.styled';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';

interface AddEditFormData {
  id?: string;
  imageUrl?: string;
  brand: string;
  color: string;
  dressStyle: string;
  shoeType: string;
  heelType: string;
  location: string;
  notes?: string;
}

interface AddEditFormProps {
  initialData?: AddEditFormData;
  isEditing?: boolean;
  brands?: string[];
  colors?: string[];
  dressStyles?: string[];
  shoeTypes?: string[];
  heelTypes?: string[];
  locations?: string[];
}

export const AddEditForm = (props: AddEditFormProps) => {
  return (
    <SuspenseBoundary>
      <AddEditFormContent {...props} />
    </SuspenseBoundary>
  );
};

function AddEditFormContent({
  initialData,
  isEditing = false,
  brands = [],
  colors = [],
  dressStyles = [],
  shoeTypes = [],
  heelTypes = [],
  locations = []
}: AddEditFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const [formData, setFormData] = useState<AddEditFormData>(
    initialData || {
      brand: '',
      color: '',
      dressStyle: '',
      shoeType: '',
      heelType: '',
      location: '',
    }
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isEditing ? `/api/shoe/${formData.id}` : '/api/shoe';
      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save shoe');
      }

      const savedShoe = await response.json();
      setSuccessMessage(isEditing ? 'Shoe updated successfully!' : 'Shoe added successfully!');
      setIsSuccess(true);
      setTimeout(() => {
        if (isEditing) {
          router.push(returnTo || `/shoe/${formData.id}`);
        } else {
          router.push(`/shoe/${savedShoe.id}`);
        }
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error('Error saving shoe:', error);
      alert('Failed to save shoe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.id) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete this shoe? This action cannot be undone.`
    );

    if (!confirmed) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/shoe/${formData.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete shoe');
      }

      setSuccessMessage('Shoe deleted successfully!');
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error('Error deleting shoe:', error);
      alert('Failed to delete shoe. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <StyledFormSection>
          <h3>Basic Information</h3>
          <StyledFormRow>
            <StyledFormGroup>
              <label>Brand *</label>
              <SingleSelect
                value={formData.brand}
                options={brands}
                placeholder="Select brand"
                onChange={(value) => setFormData((prev) => ({ ...prev, brand: value }))}
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <label>Color *</label>
              <SingleSelect
                value={formData.color}
                options={colors}
                placeholder="Select color"
                onChange={(value) => setFormData((prev) => ({ ...prev, color: value }))}
              />
            </StyledFormGroup>
          </StyledFormRow>
        </StyledFormSection>

        <StyledFormSection>
          <h3>Details</h3>
          <StyledFormRow>
            <StyledFormGroup>
              <label>Dress Style *</label>
              <SingleSelect
                value={formData.dressStyle}
                options={dressStyles}
                placeholder="Select dress style"
                onChange={(value) => setFormData((prev) => ({ ...prev, dressStyle: value }))}
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <label>Shoe Type *</label>
              <SingleSelect
                value={formData.shoeType}
                options={shoeTypes}
                placeholder="Select shoe type"
                onChange={(value) => setFormData((prev) => ({ ...prev, shoeType: value }))}
              />
            </StyledFormGroup>
          </StyledFormRow>

          <StyledFormRow>
            <StyledFormGroup>
              <label>Heel Type *</label>
              <SingleSelect
                value={formData.heelType}
                options={heelTypes}
                placeholder="Select heel type"
                onChange={(value) => setFormData((prev) => ({ ...prev, heelType: value }))}
              />
            </StyledFormGroup>
            <StyledFormGroup>
              <label>Location *</label>
              <SingleSelect
                value={formData.location}
                options={locations}
                placeholder="Select location"
                onChange={(value) => setFormData((prev) => ({ ...prev, location: value }))}
              />
            </StyledFormGroup>
          </StyledFormRow>

          <StyledFormGroup>
            <label>Notes</label>
            <StyledTextarea
              value={formData.notes || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              rows={4}
            />
          </StyledFormGroup>
        </StyledFormSection>

        <StyledButtonGroup>
          <Button onClick={() => router.back()} type="button" $variant="secondary" disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : isEditing ? 'Update Shoe' : 'Add Shoe'}
          </Button>
        </StyledButtonGroup>

        {isEditing && (
          <StyledDangerZone>
            <h3>Danger Zone</h3>
            <p>Once you delete a shoe, there is no going back. Please be certain.</p>
            <Button
              onClick={handleDelete}
              type="button"
              $variant="danger"
              disabled={isDeleting}
              $fullWidth
            >
              {isDeleting ? 'Deleting...' : 'Delete Shoe'}
            </Button>
          </StyledDangerZone>
        )}
      </StyledForm>

      <SuccessMessage
        message={successMessage}
        onClose={() => setIsSuccess(false)}
      />
    </>
  );
}
