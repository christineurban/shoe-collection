import styled from 'styled-components';

export const StyledContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 4px;
  font-size: 14px;
  background: white;
  color: ${({ theme }) => theme.colors.gray[900]};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.primary[500]};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.gray[100]};
    cursor: not-allowed;
  }
`;

export const StyledDropdown = styled.ul<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 200px;
  overflow-y: auto;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;
  background: white;
  border: 1px solid ${({ theme }) => theme.colors.gray[300]};
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
`;

export const StyledOption = styled.li<{ $isHighlighted: boolean }>`
  padding: 8px 12px;
  cursor: pointer;
  background: ${({ $isHighlighted, theme }) =>
    $isHighlighted ? theme.colors.primary[50] : 'white'};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
  }
`;
