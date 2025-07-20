import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import LoadingSpinner from '../../UI/LoadingSpinner/LoadingSpinner';
import Button from '../../UI/Button/Button';
import styles from './PageContainer.module.css';

const PageContainer = ({ 
  children, 
  variant = 'default',
  loading = false,
  error = null,
  className = '' 
}) => {
  const containerClasses = [
    styles.container,
    styles[variant],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <Header />
      <main id="main" className={styles.main} role="main">
        <div className={styles.content}>
          {loading ? (
            <div className={styles.loading}>
              <LoadingSpinner size="large" text="Loading..." />
            </div>
          ) : error ? (
            <div className={styles.error}>
              <h1 className={styles.errorTitle}>Something went wrong</h1>
              <p className={styles.errorMessage}>{error}</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            children
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

const Hero = ({ 
  title, 
  subtitle, 
  actions, 
  children,
  className = '' 
}) => {
  const heroClasses = [
    styles.hero,
    className,
  ].filter(Boolean).join(' ');

  return (
    <section className={heroClasses}>
      <div className={styles.content}>
        <div className={styles.heroContent}>
          {title && <h1 className={styles.heroTitle}>{title}</h1>}
          {subtitle && <p className={styles.heroSubtitle}>{subtitle}</p>}
          {actions && (
            <div className={styles.heroActions}>
              {actions}
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
};

const Section = ({ 
  title, 
  description, 
  children, 
  className = '' 
}) => {
  const sectionClasses = [
    styles.section,
    className,
  ].filter(Boolean).join(' ');

  return (
    <section className={sectionClasses}>
      {(title || description) && (
        <header className={styles.sectionHeader}>
          {title && <h2 className={styles.sectionTitle}>{title}</h2>}
          {description && <p className={styles.sectionDescription}>{description}</p>}
        </header>
      )}
      {children}
    </section>
  );
};

const Grid = ({ 
  columns = 3, 
  children, 
  className = '' 
}) => {
  const gridClasses = [
    styles.grid,
    styles[`grid${columns}`],
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
};

const EmptyState = ({ 
  icon, 
  title, 
  message, 
  action,
  className = '' 
}) => {
  const emptyClasses = [
    styles.empty,
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={emptyClasses}>
      {icon && <div className={styles.emptyIcon}>{icon}</div>}
      {title && <h3 className={styles.emptyTitle}>{title}</h3>}
      {message && <p className={styles.emptyMessage}>{message}</p>}
      {action}
    </div>
  );
};

PageContainer.Hero = Hero;
PageContainer.Section = Section;
PageContainer.Grid = Grid;
PageContainer.EmptyState = EmptyState;

export default PageContainer;