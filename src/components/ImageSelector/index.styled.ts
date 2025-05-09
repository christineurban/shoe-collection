import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

export const StyledShoeCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  box-shadow: ${({ theme }) => theme.shadows.base};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

export const StyledImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  margin-top: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 8px;
    margin-top: 15px;
  }
`;

export const StyledImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 300px;
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledImage = styled.img<{ $isSelected?: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${({ $isSelected }) => ($isSelected ? 0.7 : 1)};
  transition: opacity ${({ theme }) => theme.transitions.base};
`;

export const StyledSaveButton = styled.button`
  background: #2196F3;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 5;

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    margin-top: 10px;
    margin-bottom: 1.25rem;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

export const StyledRemoveButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.background.secondary};
  }
`;

export const StyledRemoveIcon = styled.span`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1;
`;

export const StyledMetadata = styled.div`
  margin-bottom: 10px;
`;

export const StyledNoImages = styled.p`
  color: red;
`;

export const StyledLoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  z-index: 10;
`;

export const StyledLoadingSpinner = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 2rem;
  height: 2rem;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.primary[500]};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
`;

export const StyledLoadingText = styled.p`
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const StyledName = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const StyledBrand = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const StyledImageInput = styled.input`
  display: none;
`;

export const StyledImageInputLabel = styled.label`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.base};

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

export const StyledImageInputText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.5rem;
`;

export const StyledImageInputIcon = styled.span`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export const StyledImageCount = styled.div`
  background-color: ${({ theme }) => theme.colors.primary[50]};
  color: ${({ theme }) => theme.colors.primary[700]};
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
`;

export const StyledShoeLink = styled(Link)`
  text-decoration: none;
  color: inherit;

  &:hover {
    text-decoration: none;
  }
`;

export const StyledImagePreviewContainer = styled.div`
  margin-top: 20px;
  text-align: center;
  padding: 20px;
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: 8px;
  border: 1px dashed ${({ theme }) => theme.colors.gray[300]};

  @media (max-width: 768px) {
    padding: 15px;
    margin-top: 15px;
  }

  h3 {
    margin-bottom: 16px;
    color: ${({ theme }) => theme.colors.gray[700]};

    @media (max-width: 768px) {
      margin-bottom: 12px;
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
    }
  }

  ${StyledImage} {
    max-width: 300px;
    margin: 0 auto;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }
`;

export const StyledMetadataContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 15px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    margin-bottom: 1.5rem;
    row-gap: 0.75rem;
  }

  p {
    word-break: break-all;
    overflow-wrap: anywhere;
    max-width: 100%;
    margin-bottom: 0.5rem;
    @media (max-width: 768px) {
      margin-bottom: 0.75rem;
    }
  }
`;

export const StyledLinkContainer = styled.div`
  margin-top: 8px;
`;

export const StyledActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    align-items: stretch;
  }
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StyledImageCountContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 768px) {
    justify-content: center;
    text-align: center;
    width: 100%;
    margin-top: 1.25rem;
  }
`;

export const StyledCurrentImageContainer = styled.div`
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 15px;
  }

  h3 {
    @media (max-width: 768px) {
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
    }
  }
`;

export const StyledCurrentImage = styled(StyledImage)`
  max-width: 300px;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: min(100%, 500px);
  }
`;

export const StyledHiddenImage = styled(StyledImage)`
  display: none;
`;
