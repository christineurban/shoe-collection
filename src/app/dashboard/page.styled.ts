import styled, { keyframes } from 'styled-components';

export const StyledDashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
`;

export const StyledScrollIndicator = styled.div`
  display: none;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;
  color: ${({ theme }) => theme.colors.primary[500]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  animation: ${bounceAnimation} 2s infinite;

  @media (max-width: 768px) {
    display: flex;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const StyledStatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[8]};
`;

export const StyledAttributeList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-top: 1rem;
  grid-auto-flow: dense;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    > *:first-child {
      flex: 1;
    }
  }
`;

export const StyledSortControls = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin: 0 0 1.5rem 0;
    width: 100%;

    button {
      flex: 1;
      justify-content: center;
    }
  }
`;

export const StyledSortButton = styled.button<{ $isActive: boolean; $direction?: 'asc' | 'desc' }>`
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary[500] : theme.colors.background.secondary};
  color: ${({ theme, $isActive }) =>
    $isActive ? 'white' : theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  display: flex;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 480px) {
    padding: 0.375rem 0.75rem;
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
  }

  &::after {
    content: '${({ $direction }) => $direction === 'asc' ? '↑' : $direction === 'desc' ? '↓' : ''}';
    opacity: ${({ $direction }) => $direction ? '1' : '0.3'};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;
  }
`;

export const StyledInputControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
`;

export const StyledAddButtonContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: ${({ theme }) => theme.colors.primary[500]};
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
    text-decoration: none;
    padding: 0.5rem;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    transition: all ${({ theme }) => theme.transitions.base};

    &:hover {
      background: ${({ theme }) => theme.colors.primary[50]};
    }
  }
`;

export const StyledAddForm = styled.form`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-left: auto;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const StyledMessage = styled.div<{ $type: 'error' | 'success' }>`
  padding: 1rem;
  margin: 1rem 0;
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme, $type }) =>
    $type === 'error' ? theme.colors.error[100] : theme.colors.success[100]};
  color: ${({ theme, $type }) =>
    $type === 'error' ? theme.colors.error[700] : theme.colors.success[700]};
  border: 1px solid ${({ theme, $type }) =>
    $type === 'error' ? theme.colors.error[300] : theme.colors.success[300]};
`;

export const StyledViewControls = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    margin-bottom: 1.5rem;
  }
`;

export const StyledViewButton = styled.button<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary[500] : theme.colors.background.secondary};
  color: ${({ theme, $isActive }) =>
    $isActive ? 'white' : theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};

  @media (max-width: 768px) {
    flex: 1;
    justify-content: center;
    padding: 0.75rem;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary[500]};
    color: white;
  }
`;

export const StyledInputContainer = styled.div`
  width: 300px;
  margin-bottom: 1rem;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 0;
  }
`;

export const StyledSectionHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin: 2rem 0 1rem;

  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

export const StyledNote = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: 1rem;
  font-style: italic;
`;

export const StyledDashboard = styled.div`
  padding: ${({ theme }) => theme.spacing[4]};
`;

export const StyledAttributeSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing[8]};

  h2 {
    margin-bottom: ${({ theme }) => theme.spacing[4]};
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;
