import React, { useState } from 'react';

import Toast from '@components/Toast';

import { AlertsContext } from './AlertsContext';
import { ToastInfo } from '@t/toastInfo';

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  const showInfoToast = (newToast: ToastInfo) => {
    setToasts((t) => [...t, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id != id));
  };

  return (
    <AlertsContext.Provider value={{ addToast: showInfoToast }}>
      <div className="fixed bottom-2 right-2 z-50 flex flex-col gap-2">
        {toasts.map(({ id, type, title, message }) => (
          <Toast key={id} id={id} type={type} title={title} message={message} onClose={removeToast} />
        ))}
      </div>
      {children}
    </AlertsContext.Provider>
  );
}
