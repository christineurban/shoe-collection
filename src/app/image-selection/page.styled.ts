import styled from 'styled-components';

export const StyledPagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
`;

export const StyledPaginationButton = styled.button`
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 8px 16px;
  margin: 0 5px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background-color: #1976D2;
  }
`;

export const StyledPaginationInfo = styled.div`
  font-size: 14px;
  color: #666;
`;
