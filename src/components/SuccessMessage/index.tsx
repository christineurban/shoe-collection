import { useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { StyledOverlay, StyledMessage } from './index.styled';

interface SuccessMessageProps {
  message: string | null;
  onClose: () => void;
  autoHideDuration?: number;
}

export const SuccessMessage = ({
  message,
  onClose,
  autoHideDuration = 3000
}: SuccessMessageProps) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, autoHideDuration);

      return () => clearTimeout(timer);
    }
  }, [message, onClose, autoHideDuration]);

  return (
    <AnimatePresence>
      {message && (
        <StyledOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <StyledMessage
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.8,
              transition: {
                duration: 0.2,
                ease: "easeOut"
              }
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {message}
          </StyledMessage>
        </StyledOverlay>
      )}
    </AnimatePresence>
  );
};
