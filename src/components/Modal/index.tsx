import { ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { HiX } from 'react-icons/hi';
import {
  StyledOverlay,
  StyledModal,
  StyledHeader,
  StyledCloseButton,
  StyledContent,
  StyledFooter
} from './index.styled';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <StyledOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <StyledModal
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            <StyledHeader>
              <h2>{title}</h2>
              <StyledCloseButton onClick={onClose} aria-label="Close modal">
                <HiX size={24} />
              </StyledCloseButton>
            </StyledHeader>
            <StyledContent>{children}</StyledContent>
            {footer && <StyledFooter>{footer}</StyledFooter>}
          </StyledModal>
        </StyledOverlay>
      )}
    </AnimatePresence>
  );
};
