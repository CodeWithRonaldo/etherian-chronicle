import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  compact = false,
  children,
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      
      // Close modal on escape key
      const handleEscape = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        document.body.style.overflow = 'unset';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const modalClasses = [
    styles.modal,
    styles[size],
    compact && styles.compact,
    className,
  ].filter(Boolean).join(' ');

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={styles.overlay}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className={modalClasses}>
        {title && (
          <header className={styles.header}>
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close modal"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </header>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
};

const ModalBody = ({ children, className = '' }) => (
  <div className={`${styles.body} ${className}`}>
    {children}
  </div>
);

const ModalFooter = ({ children, className = '' }) => (
  <footer className={`${styles.footer} ${className}`}>
    {children}
  </footer>
);

Modal.Body = ModalBody;
Modal.Footer = ModalFooter;

export default Modal;