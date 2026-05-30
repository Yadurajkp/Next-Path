import { createContext, useContext, useState } from 'react';

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const success = (msg) => addToast(msg, 'success');
  const error   = (msg) => addToast(msg, 'error');
  const info    = (msg) => addToast(msg, 'info');
  const warning = (msg) => addToast(msg, 'warning');

  return (
    <NotificationContext.Provider value={{ toasts, success, error, info, warning, removeToast }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotification = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotification must be used inside NotificationProvider');
  return ctx;
};
