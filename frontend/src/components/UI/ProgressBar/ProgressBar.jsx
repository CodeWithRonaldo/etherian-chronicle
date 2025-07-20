import React from 'react';
import styles from './ProgressBar.module.css';

const ProgressBar = ({
  value = 0,
  max = 100,
  label,
  showPercentage = false,
  size = 'medium',
  variant = 'primary',
  striped = false,
  animated = false,
  circular = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  if (circular) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const circularClasses = [
      styles.circular,
      styles[`circular${size.charAt(0).toUpperCase()}${size.slice(1)}`],
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={circularClasses}>
        <svg className={styles.circularSvg} viewBox="0 0 120 120">
          <circle
            className={styles.circularBackground}
            cx="60"
            cy="60"
            r={radius}
          />
          <circle
            className={`${styles.circularProgress} ${styles[variant]}`}
            cx="60"
            cy="60"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <div className={styles.circularText}>
          {Math.round(percentage)}%
        </div>
      </div>
    );
  }

  const containerClasses = [
    styles.progressContainer,
    className,
  ].filter(Boolean).join(' ');

  const barClasses = [
    styles.progressBar,
    styles[size],
    styles[variant],
    striped && styles.striped,
    animated && styles.animated,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {(label || showPercentage) && (
        <div className={styles.label}>
          {label && <span>{label}</span>}
          {showPercentage && (
            <span className={styles.percentage}>
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      <div className={barClasses}>
        <div
          className={styles.progressFill}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={label}
        />
      </div>
    </div>
  );
};

export default ProgressBar;