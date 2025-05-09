import styled from 'styled-components';
import { motion } from 'framer-motion';

export const StyledPasteZone = styled.div`
  width: 100%;
  min-height: 120px;
  border: 2px dashed ${({ theme }) => theme.colors.gray[300]};
  border-radius: 8px;
  padding: 20px;
  margin: 20px 0;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${({ theme }) => theme.colors.primary[50]};
  position: relative;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary[500]};
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }
`;

export const StyledPasteContent = styled.div`
  text-align: center;
  padding: 20px;
  color: ${({ theme }) => theme.colors.primary[700]};
`;

export const StyledPasteIcon = styled.div`
  font-size: 24px;
  margin-bottom: 8px;
`;

export const StyledPasteText = styled.div`
  font-size: 16px;
  margin-bottom: 4px;
`;

export const StyledPasteSubtext = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.primary[500]};
`;

export const StyledLoadingOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

export const StyledErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error[500]};
  font-size: 14px;
  margin-top: 8px;
  text-align: center;
`;
