import styled from 'styled-components';
import Link from 'next/link';

export const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary[600]};
  font-weight: 500;
  text-decoration: none;
  transition: color 0.2s ease;
  display: inline-block;
  max-width: 100%;
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;

  &:hover {
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;
