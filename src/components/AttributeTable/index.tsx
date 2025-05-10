import { Attribute } from '@/types/attribute';
import {
  StyledTable,
  StyledTableHeader,
  StyledTableRow,
  StyledTableCell,
  StyledNameCell,
  StyledPercentageHeader
} from './index.styled';
import { BsTrash } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';
import { useState } from 'react';

type SortKey = 'name' | 'count' | 'percentage';
type SortOrder = 'asc' | 'desc';

interface AttributeTableProps {
  attributes: Attribute[];
  onDelete: (id: string) => void;
}

export const AttributeTable = ({ attributes, onDelete }: AttributeTableProps) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedAttributes = [...attributes].sort((a, b) => {
    const modifier = sortOrder === 'asc' ? 1 : -1;

    switch (sortKey) {
      case 'name':
        return modifier * a.name.localeCompare(b.name);
      case 'count':
        return modifier * (a.count - b.count);
      case 'percentage':
        return modifier * (a.percentage - b.percentage);
      default:
        return 0;
    }
  });

  const columns = [
    {
      header: 'Name',
      key: 'name' as const,
      sortable: true,
      render: (item: Attribute) => (
        <StyledNameCell>
          {item.name}
          {Number(item.count) <= 0 && (
            <>
              <BsTrash
                onClick={() => onDelete(item.id)}
                role="button"
                aria-label={`Delete ${item.name}`}
                className="delete-icon"
                data-tooltip-id={`delete-tooltip-${item.id}`}
                data-tooltip-content={`Delete ${item.name}`}
              />
              <Tooltip id={`delete-tooltip-${item.id}`} />
            </>
          )}
        </StyledNameCell>
      )
    },
    {
      header: 'Count',
      key: 'count' as const,
      sortable: true,
      render: (item: Attribute) => item.count.toString()
    },
    {
      header: <StyledPercentageHeader><span className="desktop-only">Percentage</span><span className="mobile-only">%</span></StyledPercentageHeader>,
      key: 'percentage' as const,
      sortable: true,
      render: (item: Attribute) => `${item.percentage.toFixed(1)}%`
    }
  ];

  return (
    <StyledTable>
      <thead>
        <StyledTableRow>
          {columns.map((column) => (
            <StyledTableHeader
              key={column.key}
              onClick={() => column.sortable && handleSort(column.key)}
              style={{ cursor: column.sortable ? 'pointer' : 'default' }}
            >
              {column.header}
              {column.sortable && sortKey === column.key && (
                <span>{sortOrder === 'asc' ? ' ↑' : ' ↓'}</span>
              )}
            </StyledTableHeader>
          ))}
        </StyledTableRow>
      </thead>
      <tbody>
        {sortedAttributes.map((attribute) => (
          <StyledTableRow key={attribute.id}>
            {columns.map((column) => (
              <StyledTableCell key={column.key}>
                {column.render(attribute)}
              </StyledTableCell>
            ))}
          </StyledTableRow>
        ))}
      </tbody>
    </StyledTable>
  );
};
