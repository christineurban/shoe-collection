import styled from 'styled-components';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const StyledContainer = styled.div`
  width: 100%;
`;

export const StyledPolishCard = styled(motion.div)`
  border: 1px solid #ccc;
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
  position: relative;

  @media (max-width: 768px) {
    padding: 15px;
    margin: 15px 0;
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
`;

export const StyledImage = styled.img<{ $isSelected?: boolean }>`
  max-width: 100%;
  height: auto;
  border: 1px solid #eee;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => props.$isSelected && `
    border: 5px solid #4CAF50;
  `}

  &:hover {
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    ${props => props.$isSelected && `
      border: 3px solid #4CAF50;
    `}
  }
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

export const StyledRemoveButton = styled.button<{ $hasSelectedImage?: boolean }>`
  background: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  top: 20px;
  right: ${props => props.$hasSelectedImage ? '150px' : '20px'};
  z-index: 5;

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    margin-top: 10px;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }

  &:hover {
    background: #c82333;
  }
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

export const StyledSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196F3;
  border-radius: 50%;
`;

export const StyledContent = styled(motion.div)`
  overflow: hidden;
`;

export const StyledCollapseText = styled.div`
  color: ${({ theme }) => theme.colors.primary[600]};
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
    text-decoration: underline;
  }
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

export const StyledPolishLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary[700]};
  transition: color 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[900]};
    text-decoration: underline;
  }

  h3 {
    margin: 0;
    display: inline-block;
    margin-bottom: 0.5rem;
    @media (max-width: 768px) {
      margin-bottom: 1rem;
    }
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
