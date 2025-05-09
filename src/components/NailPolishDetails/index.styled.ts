import styled from 'styled-components';

export const StyledContainer = styled.div`
  width: 100%;
`;

export const StyledImageContainer = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: ${({ theme }) => theme.colors.background.muted};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.lg};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  p {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin: 0;
    color: ${({ theme }) => theme.colors.text.secondary};
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

export const StyledImageActions = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  button {
    width: 100%;
  }
`;

export const StyledDisabledMessage = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border-radius: 4px;
  margin: 0;
`;

export const StyledButton = styled.button<{ $variant?: 'danger' }>`
  background: ${({ theme }) => theme.colors.primary[500]};
  color: ${({ theme }) => theme.colors.text.inverse};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[600]};
    transform: translateY(-1px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.text.muted};
    cursor: not-allowed;
    transform: none;
  }

  ${props => props.$variant === 'danger' && `
    background: #dc3545;
    &:hover {
      background: #c82333;
    }
  `}
`;

export const StyledFormContainer = styled.div`
  width: 100%;
`;

export const StyledHeader = styled.div`
  margin-bottom: 3rem;

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0;
    line-height: 1.2;
    font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  }
`;

export const StyledDetails = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 4rem;
  align-items: flex-start;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .details-content {
    background: ${({ theme }) => theme.colors.background.primary};
    border-radius: ${({ theme }) => theme.borderRadius.xl};
    padding: 2rem;
    box-shadow: ${({ theme }) => theme.shadows.sm};
    border: 1px solid ${({ theme }) => theme.colors.border.medium};

    h2 {
      font-size: ${({ theme }) => theme.typography.fontSize.xl};
      color: ${({ theme }) => theme.colors.text.primary};
      margin: 0 0 2rem 0;
      font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
      padding-bottom: 1rem;
      border-bottom: 2px solid ${({ theme }) => theme.colors.border.dark};
    }

    p {
      margin: 0;
      padding: 1rem 0;
      font-size: ${({ theme }) => theme.typography.fontSize.base};
      line-height: 1.6;
      color: ${({ theme }) => theme.colors.text.secondary};
      display: flex;
      align-items: baseline;
      border-bottom: 1px solid ${({ theme }) => theme.colors.border.medium};

      &:last-of-type {
        border-bottom: none;
      }

      strong {
        color: ${({ theme }) => theme.colors.text.primary};
        margin-right: 1rem;
        min-width: 140px;
        font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
      }

      a {
        color: ${({ theme }) => theme.colors.primary[500]};
        text-decoration: none;
        transition: color ${({ theme }) => theme.transitions.base};
        padding: 0.25rem 0.75rem;
        border-radius: ${({ theme }) => theme.borderRadius.md};
        background: ${({ theme }) => theme.colors.primary[50]};
        font-weight: ${({ theme }) => theme.typography.fontWeights.medium};

        &:hover {
          color: ${({ theme }) => theme.colors.primary[600]};
          background: ${({ theme }) => theme.colors.primary[100]};
        }
      }
    }

    ${StyledButton} {
      margin-top: 2rem;
      width: 100%;
    }
  }
`;

export const StyledDetailsContent = styled.div`
  background: ${({ theme }) => theme.colors.background.primary};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border: 1px solid ${({ theme }) => theme.colors.border.medium};

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize.xl};
    color: ${({ theme }) => theme.colors.text.primary};
    margin: 0 0 2rem 0;
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    padding-bottom: 1rem;
    border-bottom: 2px solid ${({ theme }) => theme.colors.border.dark};

    @media (max-width: 768px) {
      font-size: ${({ theme }) => theme.typography.fontSize.lg};
      margin: 0 0 1.5rem 0;
    }
  }

  p {
    margin: 0;
    padding: 1rem 0;
    font-size: ${({ theme }) => theme.typography.fontSize.base};
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.secondary};
    display: flex;
    align-items: baseline;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border.medium};

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.75rem 0;
    }

    &:last-of-type {
      border-bottom: none;
    }

    strong {
      color: ${({ theme }) => theme.colors.text.primary};
      margin-right: 1rem;
      min-width: 140px;
      font-weight: ${({ theme }) => theme.typography.fontWeights.medium};

      @media (max-width: 768px) {
        min-width: auto;
        margin-right: 0;
      }
    }

    a {
      color: ${({ theme }) => theme.colors.primary[500]};
      text-decoration: none;
      transition: color ${({ theme }) => theme.transitions.base};
      padding: 0.25rem 0.75rem;
      border-radius: ${({ theme }) => theme.borderRadius.md};
      background: ${({ theme }) => theme.colors.primary[50]};
      font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
      word-break: break-all;

      &:hover {
        color: ${({ theme }) => theme.colors.primary[600]};
        background: ${({ theme }) => theme.colors.primary[100]};
      }
    }
  }
`;

export const StyledEditForm = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  background: ${({ theme }) => theme.colors.background.primary};
  padding: 3rem;
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const StyledFormRow = styled.div`
  display: flex;
  gap: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

export const StyledFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;

  label {
    font-size: ${({ theme }) => theme.typography.fontSize.sm};
    font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

export const StyledInput = styled.input`
  padding: 0.875rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.base};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.medium};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.border.medium};
    box-shadow: 0 0 0 1px rgba(203, 213, 225, 0.3);
  }

  &[type="checkbox"] {
    width: 1.25rem;
    height: 1.25rem;
    margin-top: 0.5rem;
    cursor: pointer;
  }
`;

export const StyledSelect = styled.select`
  padding: 0.875rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  width: 100%;
  transition: all ${({ theme }) => theme.transitions.base};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1em;
  padding-right: 2.5rem;

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.medium};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.border.medium};
    box-shadow: 0 0 0 1px rgba(203, 213, 225, 0.3);
  }
`;

export const StyledTextarea = styled.textarea`
  ${StyledInput}
  min-height: 120px;
  resize: vertical;
  line-height: 1.5;
`;

export const StyledButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid ${({ theme }) => theme.colors.border.medium};

  ${StyledButton} {
    min-width: 120px;
  }
`;

export const StyledMultiSelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledMultiSelect = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.75rem;
  min-height: 3rem;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.background.primary};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.medium};
  }

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.border.medium};
    box-shadow: 0 0 0 1px rgba(203, 213, 225, 0.3);
  }

  &:empty::before {
    content: 'Select...';
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

export const StyledTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.75rem;
  background: ${({ theme }) => theme.colors.primary[100]};
  color: ${({ theme }) => theme.colors.primary[700]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};

  button {
    border: none;
    background: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.primary[700]};
    opacity: 0.7;
    transition: opacity ${({ theme }) => theme.transitions.base};

    &:hover {
      opacity: 1;
    }
  }
`;

export const StyledDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 2px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;

export const StyledOption = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.base};

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;

export const StyledSingleSelectContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const StyledSingleSelectButton = styled.button`
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.background.primary};
  color: ${({ theme }) => theme.colors.text.primary};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  text-align: left;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.base};
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:after {
    content: '';
    width: 1em;
    height: 1em;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    transition: transform 0.2s ease;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.border.medium};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary[500]};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const StyledSingleDropdown = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: ${({ theme }) => theme.colors.background.primary};
  border: 2px solid ${({ theme }) => theme.colors.border.medium};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
`;

export const StyledSingleOption = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary[50] : 'none'};
  color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.primary[700] : theme.colors.text.primary};
  text-align: left;
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  transition: all ${({ theme }) => theme.transitions.base};
  display: flex;
  align-items: center;
  justify-content: space-between;

  &:hover {
    background: ${({ theme }) => theme.colors.primary[50]};
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:focus {
    outline: none;
    background: ${({ theme }) => theme.colors.primary[100]};
    color: ${({ theme }) => theme.colors.primary[700]};
  }

  &:after {
    content: ${({ $isSelected }) => $isSelected ? "'✓'" : "none"};
    font-size: 1.1em;
    color: ${({ theme }) => theme.colors.primary[700]};
  }
`;
