'use client';

import styled from 'styled-components';

export const StyledContainer = styled.div`
  padding: 1rem;
`;

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
`;

export const StyledTableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border.medium};
`;

export const StyledTableRow = styled.tr`
  &:nth-child(even) {
    background: ${({ theme }) => theme.colors.background.secondary};
  }
`;

export const StyledTableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
`;

export const StyledAddForm = styled.form`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

export const StyledErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error[500]};
  margin: 1rem 0;
`;

export const StyledActionsCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.light};
  text-align: right;
`;

export const StyledPolishCount = styled.span`
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-right: 1rem;
`;
