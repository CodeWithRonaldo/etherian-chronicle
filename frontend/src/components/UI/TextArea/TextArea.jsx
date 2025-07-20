import React, { forwardRef } from 'react';
import styles from '../Input/Input.module.css';

const TextArea = forwardRef(({
  label,
  required = false,
  error,
  helpText,
  size = 'medium',
  className = '',
  ...props
}, ref) => {
  const textareaClasses = [
    styles.input,
    styles.textarea,
    styles[size],
    error && styles.error,
    className,
  ].filter(Boolean).join(' ');

  const id = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={styles.inputContainer}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-label="required"> *</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={id}
        className={textareaClasses}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={
          error ? `${id}-error` : helpText ? `${id}-help` : undefined
        }
        {...props}
      />
      
      {error && (
        <div id={`${id}-error`} className={styles.errorMessage} role="alert">
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div id={`${id}-help`} className={styles.helpText}>
          {helpText}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;