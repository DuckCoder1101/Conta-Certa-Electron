import React, { useState } from 'react';
import { nanoid } from 'nanoid';

import Toast from '@components/Toast';

import { AlertsContext } from './AlertsContext';
import { IToastInfo } from '@t/Toast';

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<IToastInfo[]>([]);

  const showToast = (newToast: IToastInfo) => {
    setToasts((t) => [...t, { id: nanoid(), ...newToast }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id != id));
  };

  return (
    <AlertsContext.Provider value={{ showToast }}>
      <div className="fixed bottom-2 right-2 z-50 flex flex-col gap-2">
        {toasts.map(({ id, type, title, message }) => (
          <Toast key={id} id={id!} type={type} title={title} message={message} onClose={removeToast} />
        ))}
      </div>
      {children}
    </AlertsContext.Provider>
  );
}
