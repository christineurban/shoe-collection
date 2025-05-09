'use client';

import styled from 'styled-components';

export const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding: 1rem 0;
`;

export const StyledBrandSection = styled.section`
  background: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows?.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
`;

export const StyledControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    color: ${({ theme }) => theme.colors.text.primary};
  }

  div {
    display: flex;
    gap: 1rem;
  }
`;

export const StyledPolishList = styled.div`
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const StyledMixedStatus = styled.div`
  background: ${({ theme }) => theme.colors.warning + '20'};
  color: ${({ theme }) => theme.colors.warning};
  padding: 0.5rem 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StyledPolishGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

export const StyledPolishName = styled.div`
  padding: 0.5rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 1px solid ${({ theme }) => theme.colors.border.default};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

export const StyledPolishToggle = styled.button<{ $isOld: boolean }>`
  padding: 0.75rem;
  background: ${({ theme, $isOld }) =>
    $isOld ? theme.colors.primary[100] : theme.colors.background.primary};
  border: 1px solid ${({ theme, $isOld }) =>
    $isOld ? theme.colors.primary[300] : theme.colors.border.default};
  border-radius: 4px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme, $isOld }) =>
    $isOld ? theme.colors.primary[700] : theme.colors.text.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  text-align: left;
  width: 100%;
  position: relative;
  padding-right: 2.5rem;

  &:after {
    content: ${({ $isOld }) => ($isOld ? '"OLD"' : '"NEW"')};
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    font-size: 0.75rem;
    font-weight: bold;
    opacity: 0.7;
  }

  &:hover {
    background: ${({ theme, $isOld }) =>
      $isOld ? theme.colors.primary[200] : theme.colors.gray[100]};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows?.sm};
  }

  &:active {
    transform: translateY(0);
  }
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: flex-end;
  margin-top: 1rem;
`;
