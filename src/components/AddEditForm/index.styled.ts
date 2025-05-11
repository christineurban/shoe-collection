'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledForm = styled.form`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 0;
    border-radius: 0;
  }
`;

export const StyledFormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
    color: ${({ theme }) => theme.colors.text.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    margin: 0;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid ${({ theme }) => theme.colors.border.medium};
  }
`;

export const StyledFormRow = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

export const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;

  label {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const StyledTextarea = styled.textarea`
  padding: 0.875rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.base};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  min-height: 120px;
  resize: vertical;
  line-height: 1.5;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.medium};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
  justify-content: center;
  margin: 0 auto;
`;

export const StyledDangerZone = styled.div`
  margin-top: 48px;
  padding: 24px;
  background-color: ${({ theme }) => `${theme.colors.error}10`};
  border: 1px solid ${({ theme }) => `${theme.colors.error}33`};
  border-radius: 8px;

  h3 {
    margin-top: 0;
    margin-bottom: 12px;
    color: ${({ theme }) => theme.colors.error};
    font-size: 1.25rem;
  }

  p {
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.error};
  }
`;

export const StyledImageSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  align-items: center;
  justify-content: center;
  padding: 0;
`;

export const StyledImagePreview = styled.div`
  width: 100%;
  max-width: 300px;
  aspect-ratio: 1;
  border: 2px dashed ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background: ${({ theme }) => theme.colors.background.secondary};
  touch-action: manipulation;
  margin: 0 auto;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;

export const StyledImageCaptureButton = styled.button`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  justify-content: center;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:active {
    transform: scale(0.98);
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

export const StyledImageInput = styled.input`
  display: none;
`;

export const StyledImagePlaceholder = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: 2rem;
  width: 100%;
  height: 100%;

  svg {
    width: 48px;
    height: 48px;
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    margin: 0;
  }

  @media (max-width: 768px) {
    svg {
      width: 64px;
      height: 64px;
    }
  }
`;
