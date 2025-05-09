'use client';

import { ReactNode } from 'react';
import {
  StyledTable,
  StyledTableCell,
  StyledTableHeader,
  StyledTableRow,
  StyledTableControls
} from './index.styled';

interface Column<T> {
  header: string | ReactNode;
  key: keyof T;
  render?: (item: T) => ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortField?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export const Table = <T extends object>({
  data,
  columns,
  sortField,
  sortDirection,
  onSort
}: TableProps<T>) => {
  return (
    <StyledTable>
      <thead>
        <StyledTableRow>
          {columns.map((column) => (
            <StyledTableHeader
              key={column.key as string}
              onClick={column.sortable && onSort ? () => onSort(column.key as string) : undefined}
              style={{ cursor: column.sortable ? 'pointer' : 'default' }}
              $active={sortField === column.key}
              $direction={sortField === column.key ? sortDirection : undefined}
            >
              {column.header}
            </StyledTableHeader>
          ))}
        </StyledTableRow>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <StyledTableRow key={index}>
            {columns.map((column) => (
              <StyledTableCell key={column.key as string}>
                {column.render
                  ? column.render(item)
                  : item[column.key] as ReactNode}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        ))}
        {data.length === 0 && (
          <StyledTableRow>
            <StyledTableCell colSpan={columns.length}>
              No results found
            </StyledTableCell>
          </StyledTableRow>
        )}
      </tbody>
    </StyledTable>
  );
};
