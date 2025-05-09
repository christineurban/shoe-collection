'use client';

import styled from 'styled-components';
import {
  fieldStyles,
  chevronIconStyles,
} from '../index.styled';

export const StyledButton = styled.button<{ $isOpen: boolean }>`
  ${fieldStyles}
  ${chevronIconStyles}
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.125rem;
  position: relative;
  padding: 0.5rem 1rem;
  line-height: 1;

  &:after {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const StyledOption = styled.label`
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 0.25rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[50]};
  }

  input {
    margin-right: 0.75rem;
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: ${({ theme }) => theme.colors.primary[500]};
  }
`;

export const StyledTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.125rem 0.5rem;
  background: ${({ theme }) => theme.colors.background.secondary};
  color: ${({ theme }) => theme.colors.text.primary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin: 0.125rem 0.25rem;

  button {
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    font-size: 1.25em;
    line-height: 1;
    color: currentColor;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.default};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  background: transparent;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

export const StyledNoMatches = styled.div`
  padding: 0.75rem 1rem;
  color: ${({ theme }) => theme.colors.text.muted};
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;
