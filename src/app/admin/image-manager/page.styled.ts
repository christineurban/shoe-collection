import styled from 'styled-components';

export const StyledContainer = styled.div`
  padding: 20px;
`;

export const StyledHeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
`;

export const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

export const StyledImageCard = styled.div<{ $markedForDeletion?: boolean }>`
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 8px;
  background: white;
  opacity: ${({ $markedForDeletion }) => ($markedForDeletion ? 0.5 : 1)};
`;

export const StyledImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: contain;
  margin-bottom: 10px;
  background: ${({ theme }) => theme.colors.primary[50]};
  border-radius: 4px;
`;

export const StyledDeleteButton = styled.button<{ $active?: boolean }>`
  width: 100%;
  padding: 8px;
  margin-top: 10px;
  border: none;
  border-radius: 4px;
  background: ${({ $active, theme }) =>
    $active ? theme.colors.error[500] : theme.colors.gray[200]};
  color: ${({ $active }) => ($active ? 'white' : 'inherit')};
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: ${({ $active, theme }) =>
      $active ? theme.colors.error[600] : theme.colors.gray[300]};
  }
`;

export const StyledSaveButton = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  cursor: pointer;
  transition: background-color 0.2s;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.primary[600]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[300]};
    cursor: not-allowed;
  }
`;

export const StyledErrorMessage = styled.p`
  color: red;
`;
