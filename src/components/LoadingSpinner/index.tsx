import { StyledLoadingOverlay, StyledSpinner, StyledSpinnerContainer, StyledLoadingText } from './index.styled';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner = ({ text = 'Loading...' }: LoadingSpinnerProps) => {
  return (
    <StyledLoadingOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <StyledSpinnerContainer>
        <StyledSpinner
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <StyledLoadingText>{text}</StyledLoadingText>
      </StyledSpinnerContainer>
    </StyledLoadingOverlay>
  );
};
