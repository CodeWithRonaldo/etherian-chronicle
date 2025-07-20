import React from 'react';
import styles from './Button.module.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  iconOnly = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  const classes = [
    styles.button,
    styles[variant],
    styles[size],
    loading && styles.loading,
    fullWidth && styles.fullWidth,
    iconOnly && styles.iconOnly,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;