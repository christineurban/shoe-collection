import { Attribute } from '@/types/attribute';
import { StyledCard } from './index.styled';

interface AttributeCardProps {
  attribute: Attribute;
  onDelete: () => void;
}

export const AttributeCard = ({ attribute, onDelete }: AttributeCardProps) => {
  return (
    <StyledCard>
      <h3>{attribute.name}</h3>
      <div className="count">{attribute.count} {attribute.count === 1 ? 'shoe' : 'shoes'}</div>
      <div className="percentage">{attribute.percentage.toFixed(1)}%</div>
      {attribute.count === 0 && (
        <button onClick={onDelete}>Delete</button>
      )}
    </StyledCard>
  );
};
