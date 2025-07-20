import React from 'react';
import styles from './Badge.module.css';

const Badge = ({
  children,
  variant = 'neutral',
  size = 'medium',
  outline = false,
  dot = false,
  className = '',
  ...props
}) => {
  const classes = [
    styles.badge,
    styles[variant],
    styles[size],
    outline && styles.outline,
    dot && styles.dot,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
};

export default Badge;