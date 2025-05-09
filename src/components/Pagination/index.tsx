import {
  StyledContainer,
  StyledButton,
  StyledButtonGroup,
  StyledPageInfo
} from './index.styled';

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <StyledContainer>
      <StyledPageInfo>
        Showing {startItem} to {endItem} of {totalItems} items
      </StyledPageInfo>
      <StyledButtonGroup>
        <StyledButton
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </StyledButton>
        <StyledButton
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </StyledButton>
      </StyledButtonGroup>
    </StyledContainer>
  );
};
