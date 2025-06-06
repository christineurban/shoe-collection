'use client';

import styled from 'styled-components';

interface TableHeaderProps {
  $active?: boolean;
  $direction?: 'asc' | 'desc';
}

export const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 0.875rem;
  }
`;

export const StyledTableRow = styled.tr`
  &:nth-child(even) {
    background-color: ${({ theme }) => theme.colors.background.muted};
  }

  &:nth-child(odd) {
    background-color: ${({ theme }) => theme.colors.background.primary};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

export const StyledTableCell = styled.td`
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  word-break: break-word;
  min-width: 60px;

  &:nth-child(2),
  &:nth-child(3) {
    text-align: center;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;

    &:first-child {
      max-width: 150px;
    }
  }
`;

export const StyledTableHeader = styled.th<TableHeaderProps>`
  padding: 1rem;
  text-align: left;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: #ffffff;
  font-weight: 600;
  white-space: nowrap;

  &:nth-child(2),
  &:nth-child(3) {
    text-align: center;
  }

  @media (max-width: 768px) {
    padding: 0.75rem 0.5rem;
  }

  &:after {
    content: '${({ $direction }) => $direction === 'asc' ? '↑' : $direction === 'desc' ? '↓' : ''}';
    display: ${({ $active }) => $active ? 'inline-block' : 'none'};
    margin-left: 0.5rem;
    opacity: 0.8;
  }
`;

export const StyledTableControls = styled.div`
  margin-bottom: 1rem;
  display: flex;
  gap: 1rem;
  align-items: center;

  > div {
    width: 300px;
    @media (max-width: 768px) {
      width: 100%;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

export const StyledNameCell = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .delete-icon {
    color: ${({ theme }) => theme.colors.error};
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.8;
    }
  }
`;

export const StyledPercentageHeader = styled.span`
  .desktop-only {
    display: inline;
    @media (max-width: 768px) {
      display: none;
    }
  }

  .mobile-only {
    display: none;
    @media (max-width: 768px) {
      display: inline;
    }
  }
`;
