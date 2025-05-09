import styled from 'styled-components';

export const StyledAttributeList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

export const StyledAttributeCard = styled.div`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
  }

  span {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const StyledDeleteButton = styled.button`
  background: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.5rem;
  cursor: pointer;
  margin-top: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;

export const StyledSortControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

export const StyledSortButton = styled.button<{ $isActive: boolean }>`
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary[500] : theme.colors.background.secondary};
  color: ${({ theme, $isActive }) =>
    $isActive ? 'white' : theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.5rem 1rem;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

export const StyledInputContainer = styled.div`
  max-width: 300px;
  margin-bottom: 1rem;
  flex-shrink: 0;
`;

export const StyledAddForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;

  ${StyledInputContainer} {
    width: 300px;
    margin-bottom: 0;
  }

  button {
    flex-shrink: 0;
  }
`;

export const StyledMessage = styled.div<{ $type: 'error' | 'success' }>`
  background: ${({ theme, $type }) =>
    $type === 'error' ? theme.colors.error : theme.colors.success};
  color: white;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 1rem;
`;

export const StyledViewControls = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

export const StyledViewButton = styled.button<{ $isActive: boolean }>`
  background: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.primary[500] : theme.colors.background.secondary};
  color: ${({ theme, $isActive }) =>
    $isActive ? 'white' : theme.colors.text.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 0.5rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    opacity: 0.9;
  }
`;
