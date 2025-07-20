import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({
  size = 'medium',
  variant = 'primary',
  fullPage = false,
  overlay = false,
  center = false,
  text,
  className = '',
}) => {
  const spinnerClasses = [
    styles.spinner,
    styles[size],
    styles[variant],
    className,
  ].filter(Boolean).join(' ');

  const spinner = <div className={spinnerClasses} />;

  if (fullPage) {
    return (
      <div className={styles.fullPage}>
        {text ? (
          <div className={styles.withText}>
            {spinner}
            <span className={styles.text}>{text}</span>
          </div>
        ) : (
          spinner
        )}
      </div>
    );
  }

  if (overlay) {
    return (
      <div className={styles.overlay}>
        {text ? (
          <div className={styles.withText}>
            {spinner}
            <span className={styles.text}>{text}</span>
          </div>
        ) : (
          spinner
        )}
      </div>
    );
  }

  if (center) {
    return (
      <div className={styles.center}>
        {text ? (
          <div className={styles.withText}>
            {spinner}
            <span className={styles.text}>{text}</span>
          </div>
        ) : (
          spinner
        )}
      </div>
    );
  }

  if (text) {
    return (
      <div className={styles.withText}>
        {spinner}
        <span className={styles.text}>{text}</span>
      </div>
    );
  }

  return spinner;
};

export default LoadingSpinner;