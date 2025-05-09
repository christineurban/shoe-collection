import styled from 'styled-components';
import Link from 'next/link';

export const StyledErrorContainer = styled.div`
  padding: 1rem;
  text-align: center;
`;

export const StyledErrorMessage = styled.p`
  margin-bottom: 1rem;
`;

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

export const StyledLinkContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  gap: 5px;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  padding: 0 1rem;
`;

export const StyledDivider = styled.div`
  color: ${({ theme }) => theme.colors.gray[500]};
`;
