import React from 'react';
import styles from './Card.module.css';

const Card = ({
  children,
  variant = 'default',
  interactive = false,
  onClick,
  className = '',
  ...props
}) => {
  const classes = [
    styles.card,
    styles[variant],
    interactive && styles.interactive,
    className,
  ].filter(Boolean).join(' ');

  const Component = interactive ? 'button' : 'div';

  return (
    <Component
      className={classes}
      onClick={onClick}
      {...props}
    >
      {children}
    </Component>
  );
};

const CardHeader = ({ children, compact = false, className = '' }) => {
  const classes = [
    styles.header,
    compact && styles.headerCompact,
    className,
  ].filter(Boolean).join(' ');

  return (
    <header className={classes}>
      {children}
    </header>
  );
};

const CardBody = ({ children, compact = false, noPadding = false, className = '' }) => {
  const classes = [
    noPadding ? styles.bodyNoPadding : compact ? styles.bodyCompact : styles.body,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, compact = false, className = '' }) => {
  const classes = [
    styles.footer,
    compact && styles.footerCompact,
    className,
  ].filter(Boolean).join(' ');

  return (
    <footer className={classes}>
      {children}
    </footer>
  );
};

const CardImage = ({ src, alt, overlay, className = '' }) => {
  if (overlay) {
    return (
      <div className={`${styles.imageContainer} ${className}`}>
        <img src={src} alt={alt} className={styles.image} />
        <div className={styles.imageOverlay}>
          <div className={styles.imageOverlayContent}>
            {overlay}
          </div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={`${styles.image} ${className}`}
    />
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
Card.Image = CardImage;

export default Card;