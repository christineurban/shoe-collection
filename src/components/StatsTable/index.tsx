'use client';

import { useState, useMemo } from 'react';
import { StatItem } from '@/types/stats';
import { StyledTable, StyledTableCell, StyledTableHeader, StyledTableRow, StyledTableControls, StyledSortButton } from './index.styled';
import { Input } from '@/components/fields/Input';

interface StatsTableProps {
  title: string;
  stats: StatItem[];
}

type SortField = 'name' | 'count' | 'percentage';
type SortDirection = 'asc' | 'desc';

export const StatsTable = ({ title, stats }: StatsTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('count');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const filteredAndSortedStats = useMemo(() => {
    return stats
      .filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        const multiplier = sortDirection === 'asc' ? 1 : -1;
        if (sortField === 'name') {
          return multiplier * a.name.localeCompare(b.name);
        }
        return multiplier * (a[sortField] - b[sortField]);
      });
  }, [stats, searchTerm, sortField, sortDirection]);

  return (
    <div>
      <h2>{title}</h2>
      <StyledTableControls>
        <Input
          placeholder={`Search ${title.toLowerCase()}...`}
          value={searchTerm}
          onChange={setSearchTerm}
          aria-label={`Search ${title}`}
        />
      </StyledTableControls>
      <StyledTable>
        <thead>
          <StyledTableRow>
            <StyledTableHeader>
              <StyledSortButton
                onClick={() => handleSort('name')}
                active={sortField === 'name'}
                direction={sortField === 'name' ? sortDirection : undefined}
              >
                Name
              </StyledSortButton>
            </StyledTableHeader>
            <StyledTableHeader>
              <StyledSortButton
                onClick={() => handleSort('count')}
                active={sortField === 'count'}
                direction={sortField === 'count' ? sortDirection : undefined}
              >
                Count
              </StyledSortButton>
            </StyledTableHeader>
            <StyledTableHeader>
              <StyledSortButton
                onClick={() => handleSort('percentage')}
                active={sortField === 'percentage'}
                direction={sortField === 'percentage' ? sortDirection : undefined}
              >
                Percentage
              </StyledSortButton>
            </StyledTableHeader>
          </StyledTableRow>
        </thead>
        <tbody>
          {filteredAndSortedStats.map((item) => (
            <StyledTableRow key={item.name}>
              <StyledTableCell>{item.name}</StyledTableCell>
              <StyledTableCell>{item.count}</StyledTableCell>
              <StyledTableCell>{item.percentage.toFixed(2)}%</StyledTableCell>
            </StyledTableRow>
          ))}
          {filteredAndSortedStats.length === 0 && (
            <StyledTableRow>
              <StyledTableCell colSpan={3}>No results found</StyledTableCell>
            </StyledTableRow>
          )}
        </tbody>
      </StyledTable>
    </div>
  );
};
