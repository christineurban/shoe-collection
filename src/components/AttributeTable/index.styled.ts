import styled from 'styled-components';

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: ${({ theme }) => theme.spacing[4]};
`;

export const StyledTableHeader = styled.th`
  text-align: left;
  padding: ${({ theme }) => theme.spacing[2]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

export const StyledTableRow = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

export const StyledTableCell = styled.td`
  padding: ${({ theme }) => theme.spacing[2]};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text.primary};

  button {
    background: none;
    border: none;
    color: ${({ theme }) => theme.colors.error};
    cursor: pointer;
    padding: ${({ theme }) => theme.spacing[1]};
    font-size: ${({ theme }) => theme.typography.fontSize.sm};

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const StyledDeleteButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};

  &:hover {
    text-decoration: underline;
  }
`;
