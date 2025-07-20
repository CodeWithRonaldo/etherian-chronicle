import React from 'react';
import styles from './PageBanner.module.css';

const PageBanner = ({ 
  title, 
  subtitle, 
  backgroundImage, 
  size = 'medium',
  children,
  className = '' 
}) => {
  const bannerClasses = [
    styles.banner,
    styles[size],
    className,
  ].filter(Boolean).join(' ');

  const bannerStyle = backgroundImage ? {
    backgroundImage: `url(${backgroundImage})`,
  } : {};

  return (
    <div className={bannerClasses} style={bannerStyle}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        {title && <h1 className={styles.title}>{title}</h1>}
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default PageBanner;