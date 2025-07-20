import React, { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({
  label,
  required = false,
  error,
  helpText,
  leftIcon,
  rightIcon,
  size = 'medium',
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const inputClasses = [
    styles.input,
    styles[size],
    styles[variant],
    error && styles.error,
    leftIcon && styles.withLeftIcon,
    rightIcon && styles.withRightIcon,
    className,
  ].filter(Boolean).join(' ');

  const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={styles.inputContainer}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span className={styles.required} aria-label="required"> *</span>}
        </label>
      )}
      
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <div className={styles.leftIcon}>
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          id={id}
          className={inputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={
            error ? `${id}-error` : helpText ? `${id}-help` : undefined
          }
          {...props}
        />
        
        {rightIcon && (
          <div className={styles.rightIcon}>
            {rightIcon}
          </div>
        )}
      </div>
      
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

Input.displayName = 'Input';

export default Input;