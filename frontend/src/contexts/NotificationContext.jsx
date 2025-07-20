import React, { createContext, useContext, useState } from 'react';
import ToastContainer from '../components/UI/ToastContainer/ToastContainer';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now();
    const newToast = {
      id,
      ...toast,
      timestamp: new Date(),
    };

    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAll = () => {
    setToasts([]);
  };

  const showSuccess = (message, options = {}) => {
    return addToast({
      type: 'success',
      message,
      ...options,
    });
  };

  const showError = (message, options = {}) => {
    return addToast({
      type: 'error',
      message,
      ...options,
    });
  };

  const showWarning = (message, options = {}) => {
    return addToast({
      type: 'warning',
      message,
      ...options,
    });
  };

  const showInfo = (message, options = {}) => {
    return addToast({
      type: 'info',
      message,
      ...options,
    });
  };

  const value = {
    toasts,
    addToast,
    removeToast,
    clearAll,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };

  return (
    <>
      <NotificationContext.Provider value={value}>
        {children}
      </NotificationContext.Provider>
      <ToastContainer 
        toasts={toasts} 
        onRemove={removeToast}
        position="top-right"
      />
    </>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};