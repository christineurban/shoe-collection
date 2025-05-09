import styled from 'styled-components';

export const StyledGrid = styled.div<{ $isSingleColumn?: boolean }>`
  display: grid;
  grid-template-columns: ${({ $isSingleColumn }) =>
    $isSingleColumn ? '1fr' : 'repeat(auto-fill, minmax(280px, 1fr))'};
  gap: 2rem;
  margin-top: 2rem;
  will-change: grid-template-columns;

  @media (max-width: 768px) {
    grid-template-columns: ${({ $isSingleColumn }) =>
      $isSingleColumn ? '1fr' : 'repeat(2, 1fr)'};
    gap: 1.75rem;
    margin-top: 1.5rem;
  }

  @media (max-width: 480px) {
    grid-template-columns: ${({ $isSingleColumn }) =>
      $isSingleColumn ? '1fr' : 'repeat(2, 1fr)'};
    gap: 1rem;
    margin-top: 1rem;
  }
`;

export const StyledEmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  grid-column: 1 / -1;

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    margin-bottom: 1rem;

    @media (max-width: 480px) {
      font-size: 1.25rem;
    }
  }

  p {
    color: #4a5568;
    margin-bottom: 2rem;

    @media (max-width: 480px) {
      font-size: 0.875rem;
      margin-bottom: 1.5rem;
    }
  }
`;

export const StyledToggleContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const StyledViewToggle = styled.button<{ $isActive: boolean }>`
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
  will-change: background-color, color;

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
