import { Attribute } from '@/types/attribute';
import { StyledTable, StyledTableHeader, StyledTableRow, StyledTableCell } from './index.styled';

interface AttributeTableProps {
  attributes: Attribute[];
  onDelete: (id: string) => void;
}

export const AttributeTable = ({ attributes, onDelete }: AttributeTableProps) => {
  return (
    <StyledTable>
      <thead>
        <tr>
          <StyledTableHeader>Name</StyledTableHeader>
          <StyledTableHeader>Count</StyledTableHeader>
          <StyledTableHeader>Percentage</StyledTableHeader>
          <StyledTableHeader>Actions</StyledTableHeader>
        </tr>
      </thead>
      <tbody>
        {attributes.map((attribute) => (
          <StyledTableRow key={attribute.id}>
            <StyledTableCell>{attribute.name}</StyledTableCell>
            <StyledTableCell>{attribute.count}</StyledTableCell>
            <StyledTableCell>{attribute.percentage.toFixed(1)}%</StyledTableCell>
            <StyledTableCell>
              {attribute.count === 0 && (
                <button onClick={() => onDelete(attribute.id)}>Delete</button>
              )}
            </StyledTableCell>
          </StyledTableRow>
        ))}
      </tbody>
    </StyledTable>
  );
};
