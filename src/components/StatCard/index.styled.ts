import styled from 'styled-components';

export const StyledStatCard = styled.div<{ $isActive?: boolean }>`
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing[4]};
  cursor: ${({ onClick }) => onClick ? 'pointer' : 'default'};
  transition: all 0.2s ease-in-out;

  &:hover {
    transform: ${({ onClick }) => onClick ? 'translateY(-2px)' : 'none'};
    box-shadow: ${({ onClick }) => onClick ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none'};
  }

  ${({ $isActive, theme }) => $isActive && `
    border-color: ${theme.colors.primary[500]};
    background: ${theme.colors.primary[100]};
  `}

  h3 {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
  }

  .value {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
    margin: ${({ theme }) => theme.spacing[2]} 0;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  .description {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const StyledValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;
