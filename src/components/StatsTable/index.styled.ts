'use client';

import styled, { css } from 'styled-components';

interface SortButtonProps {
  active?: boolean;
  direction?: 'asc' | 'desc';
}

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const StyledTableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

export const StyledTableCell = styled.td`
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

export const StyledTableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: #ffffff;
  font-weight: 600;
`;

export const StyledTableControls = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;

  > div {
    width: 300px;
  }
`;

export const StyledSortButton = styled.button<SortButtonProps>`
  background: none;
  border: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  padding: 0;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #ffffff;

  &:after {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 0.5rem;
    opacity: ${({ active }) => active ? '1' : '0.3'};
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;

    ${({ direction }) => direction === 'asc' && css`
      border-bottom: 6px solid currentColor;
    `}

    ${({ direction }) => direction === 'desc' && css`
      border-top: 6px solid currentColor;
    `}
  }

  &:hover:after {
    opacity: 1;
  }
`;
