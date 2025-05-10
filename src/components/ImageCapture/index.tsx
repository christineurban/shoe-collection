import React, { useRef } from 'react';
import { FaCamera } from 'react-icons/fa';
import { StyledImageSection, StyledImagePreview, StyledImagePlaceholder, StyledButtonGroup, StyledImageCaptureButton, StyledImageInput } from './index.styled';

type ImageCaptureProps = {
  value: string | null;
  onChange: (file: File) => void;
  isLoading?: boolean;
  onClear?: () => void;
};

export const ImageCapture: React.FC<ImageCaptureProps> = ({ value, onChange, isLoading = false, onClear }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleTakePhoto = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
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
    onChange(file);
  };

  return (
    <StyledImageSection>
      <StyledImagePreview>
        {value ? (
          <img src={value} alt="Shoe preview" />
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
          {value ? 'Change Image' : 'Choose from Gallery'}
        </StyledImageCaptureButton>
        <StyledImageCaptureButton
          type="button"
          onClick={handleTakePhoto}
          disabled={isLoading}
        >
          <FaCamera />
          Take Photo
        </StyledImageCaptureButton>
        {value && onClear && (
          <StyledImageCaptureButton type="button" onClick={onClear} disabled={isLoading}>
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
  );
};
