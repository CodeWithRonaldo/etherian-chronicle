import React from 'react';
import styles from './Avatar.module.css';

const Avatar = ({
  src,
  alt,
  size = 'medium',
  variant = 'circle',
  status,
  interactive = false,
  onClick,
  children,
  className = '',
  ...props
}) => {
  const classes = [
    styles.avatar,
    styles[size],
    styles[variant],
    interactive && styles.interactive,
    status && styles.statusContainer,
    className,
  ].filter(Boolean).join(' ');

  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const handleClick = () => {
    if (interactive && onClick) {
      onClick();
    }
  };

  const handleKeyDown = (e) => {
    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={classes}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? 'button' : undefined}
      {...props}
    >
      {src ? (
        <img src={src} alt={alt} className={styles.image} />
      ) : (
        children || getInitials(alt)
      )}
      
      {status && (
        <div className={`${styles.statusIndicator} ${styles[`status${status.charAt(0).toUpperCase() + status.slice(1)}`]}`} />
      )}
    </div>
  );
};

export default Avatar;