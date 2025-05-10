import { StyledPagination } from './index.styled';

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination = ({
  currentPage,
  onPageChange,
  totalPages: directTotalPages,
  totalItems,
  itemsPerPage = 25
}: PaginationProps) => {
  const calculatedTotalPages = totalItems ? Math.ceil(totalItems / itemsPerPage) : undefined;
  const totalPages = directTotalPages ?? calculatedTotalPages;

  if (!totalPages) {
    return null;
  }

  return (
    <StyledPagination>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        Previous
      </button>
      <span>
        Page {currentPage} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        Next
      </button>
    </StyledPagination>
  );
};
