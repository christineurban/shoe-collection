import { StyledStatCard } from './index.styled';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  onClick?: () => void;
  $isActive?: boolean;
}

export const StatCard = ({ title, value, description, onClick, $isActive }: StatCardProps) => {
  return (
    <StyledStatCard onClick={onClick} $isActive={$isActive}>
      <h3>{title}</h3>
      <div className="value">{value}</div>
      <div className="description">{description}</div>
    </StyledStatCard>
  );
};
