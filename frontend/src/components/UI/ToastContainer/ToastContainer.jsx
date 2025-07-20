import React from 'react';
import Toast from '../Toast/Toast';
import styles from './ToastContainer.module.css';

const ToastContainer = ({ toasts, onRemove, position = 'top-right' }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className={`${styles.container} ${styles[position]}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={onRemove}
          position={position}
        />
      ))}
    </div>
  );
};

export default ToastContainer;