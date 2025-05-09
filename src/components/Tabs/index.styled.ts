import styled from 'styled-components';

interface StyledTabProps {
  $active: boolean;
}

export const StyledTabList = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const StyledTab = styled.button<StyledTabProps>`
  padding: 1rem 2rem;
  border: none;
  background: none;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${({ $active, theme }) => $active ? theme.colors.primary[500] : theme.colors.text};
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;

  &:after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    height: 2px;
    background-color: ${({ $active, theme }) => $active ? theme.colors.primary[500] : 'transparent'};
    transition: background-color 0.2s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

export const StyledTabPanel = styled.div`
  &[hidden] {
    display: none;
  }
`;
