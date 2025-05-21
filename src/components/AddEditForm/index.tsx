'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../Button';
import { SingleSelect } from '../fields/SingleSelect';
import { MultiSelect } from '../fields/MultiSelect';
import { SuccessMessage } from '@/components/SuccessMessage';
import { FaCamera } from 'react-icons/fa';
import {
  StyledForm,
  StyledFormGroup,
  StyledTextarea,
  StyledButtonGroup,
  StyledFormSection,
  StyledFormRow,
  StyledDangerZone,
  StyledImageSection,
  StyledImagePreview,
  StyledImageCaptureButton,
  StyledImageInput,
  StyledImagePlaceholder
} from './index.styled';
import { SuspenseBoundary } from '@/components/SuspenseBoundary';
import type { Shoe } from '@/types/shoe';

interface AddEditFormData {
  id?: string;
  imageUrl?: string;
  brand: string;
  colors: string[];
  dressStyle: string;
  shoeType: string;
  heelType: string;
  location: string;
  notes?: string;
}

interface AddEditFormProps {
  initialData?: Partial<Shoe>;
  isEditing?: boolean;
  brands?: string[];
  colors?: string[];
  dressStyles?: string[];
  shoeTypes?: string[];
  heelTypes?: string[];
  locations?: string[];
  onBrandsChange?: (newBrands: string[]) => void;
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
  locations = [],
  onBrandsChange
}: AddEditFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<AddEditFormData>({
    id: initialData?.id,
    brand: initialData?.brand || '',
    colors: initialData?.colors || [],
    dressStyle: initialData?.dressStyle || '',
    shoeType: initialData?.shoeType || '',
    heelType: initialData?.heelType || '',
    location: initialData?.location || '',
    imageUrl: initialData?.imageUrl || '',
    notes: initialData?.notes || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.imageUrl || null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const scrollToFirstError = () => {
    setTimeout(() => {
      const firstErrorElement = document.querySelector('[data-error="true"]');
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest'
        });
      }
    }, 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate all required fields
    const errors: { [key: string]: string } = {};
    if (!formData.brand) errors.brand = 'Brand is required.';
    if (!formData.colors || formData.colors.length === 0) errors.colors = 'At least one color is required.';
    if (!formData.dressStyle) errors.dressStyle = 'Dress style is required.';
    if (!formData.shoeType) errors.shoeType = 'Shoe type is required.';
    if (!formData.heelType) errors.heelType = 'Heel type is required.';
    if (!formData.location) errors.location = 'Location is required.';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      setIsLoading(false);
      scrollToFirstError();
      return;
    }

    try {
      // If there's a new image, upload it first
      let imageUrl = formData.imageUrl;
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const uploadData = await uploadResponse.json();
        imageUrl = uploadData.data.image_url;
      }

      // Save the shoe with the image URL
      const endpoint = isEditing ? `/api/shoe/${formData.id}` : '/api/shoe/add';
      const response = await fetch(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: imageUrl || null
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save shoe');
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

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: keyof AddEditFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error if field has a value
    if (value) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleImageCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
      // Remove the capture attribute after clicking to allow gallery selection next time
      setTimeout(() => {
        if (fileInputRef.current) {
          fileInputRef.current.removeAttribute('capture');
        }
      }, 100);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Store the file for later upload
    setImageFile(file);

    // Create a temporary preview URL
    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview);
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setImageFile(null);
    setFormData(prev => ({ ...prev, imageUrl: '' }));
  };

  if (isSuccess) {
    return (
      <SuccessMessage
        message={successMessage}
        onClose={() => {}}
      />
    );
  }

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <StyledFormSection>
          <h3>Image</h3>
          <StyledImageSection>
            <StyledImagePreview>
              {previewUrl ? (
                <img src={previewUrl} alt="Shoe preview" />
              ) : (
                <StyledImagePlaceholder>
                  <FaCamera />
                  <p>No image selected</p>
                </StyledImagePlaceholder>
              )}
            </StyledImagePreview>
            <StyledButtonGroup>
              <StyledImageCaptureButton
                type="button"
                onClick={handleImageCapture}
                disabled={isLoading}
              >
                <FaCamera />
                {previewUrl ? 'Change Image' : 'Choose from Gallery'}
              </StyledImageCaptureButton>
              <StyledImageCaptureButton
                type="button"
                onClick={handleTakePhoto}
                disabled={isLoading}
              >
                <FaCamera />
                Take Photo
              </StyledImageCaptureButton>
              {isEditing && previewUrl && (
                <StyledImageCaptureButton
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={isLoading}
                  $variant="danger"
                >
                  Remove Image
                </StyledImageCaptureButton>
              )}
            </StyledButtonGroup>
            <StyledImageInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </StyledImageSection>
        </StyledFormSection>

        <StyledFormSection>
          <h3>Basic Information</h3>
          <StyledFormRow>
            <StyledFormGroup>
              <label>Brand *</label>
              <SingleSelect
                value={formData.brand}
                options={brands}
                placeholder="Select brand"
                onChange={(value) => handleSelectChange('brand', value)}
                onOptionsChange={(newBrands) => {
                  if (onBrandsChange) {
                    onBrandsChange(newBrands);
                  }
                }}
                isBrand={true}
                data-error={!!formErrors.brand}
              />
              {formErrors.brand && <span style={{ color: 'red', fontSize: '0.9em' }}>{formErrors.brand}</span>}
            </StyledFormGroup>
            <StyledFormGroup>
              <label>Colors *</label>
              <MultiSelect
                values={formData.colors}
                options={colors}
                onChange={(newColors) => setFormData({ ...formData, colors: newColors })}
                data-error={!!formErrors.colors}
              />
              {formErrors.colors && <span style={{ color: 'red', fontSize: '0.9em' }}>{formErrors.colors}</span>}
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
                onChange={(value) => handleSelectChange('dressStyle', value)}
                data-error={!!formErrors.dressStyle}
              />
              {formErrors.dressStyle && <span style={{ color: 'red', fontSize: '0.9em' }}>{formErrors.dressStyle}</span>}
            </StyledFormGroup>
            <StyledFormGroup>
              <label>Shoe Type *</label>
              <SingleSelect
                value={formData.shoeType}
                options={shoeTypes}
                placeholder="Select shoe type"
                onChange={(value) => handleSelectChange('shoeType', value)}
                data-error={!!formErrors.shoeType}
              />
              {formErrors.shoeType && <span style={{ color: 'red', fontSize: '0.9em' }}>{formErrors.shoeType}</span>}
            </StyledFormGroup>
          </StyledFormRow>

          <StyledFormRow>
            <StyledFormGroup>
              <label>Heel Type *</label>
              <SingleSelect
                value={formData.heelType}
                options={heelTypes}
                placeholder="Select heel type"
                onChange={(value) => handleSelectChange('heelType', value)}
                data-error={!!formErrors.heelType}
              />
              {formErrors.heelType && <span style={{ color: 'red', fontSize: '0.9em' }}>{formErrors.heelType}</span>}
            </StyledFormGroup>
            <StyledFormGroup>
              <label>Location *</label>
              <SingleSelect
                value={formData.location}
                options={locations}
                placeholder="Select location"
                onChange={(value) => handleSelectChange('location', value)}
                data-error={!!formErrors.location}
              />
              {formErrors.location && <span style={{ color: 'red', fontSize: '0.9em' }}>{formErrors.location}</span>}
            </StyledFormGroup>
          </StyledFormRow>

          <StyledFormGroup>
            <label>Notes</label>
            <StyledTextarea
              name="notes"
              value={formData.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              placeholder="Add any notes about this shoe"
            />
          </StyledFormGroup>
        </StyledFormSection>

        <StyledButtonGroup>
          <Button
            type="submit"
            disabled={isLoading}
            $isLoading={isLoading}
          >
            {isEditing ? 'Update Shoe' : 'Add Shoe'}
          </Button>
        </StyledButtonGroup>
      </StyledForm>

      {isEditing && (
        <StyledDangerZone>
          <h3>Danger Zone</h3>
          <p>Once you delete a shoe, there is no going back. Please be certain.</p>
          <Button
            onClick={handleDelete}
            disabled={isDeleting}
            $variant="danger"
          >
            {isDeleting ? 'Deleting...' : 'Delete Shoe'}
          </Button>
        </StyledDangerZone>
      )}
    </>
  );
}
