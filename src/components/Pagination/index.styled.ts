import styled from 'styled-components';

export const StyledPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin: 2rem 0;
  padding: 1rem;

  button {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    background-color: white;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: #f0f0f0;
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    font-size: 1rem;
    color: #666;
  }
`;
