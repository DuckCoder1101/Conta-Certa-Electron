import React, { useCallback, useState } from 'react';
import { nanoid } from 'nanoid';

import Toast from '@components/Toast';

import { AlertsContext } from '@contexts/AlertsContext';

import { IToastInfo } from '@t/Toast';

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<IToastInfo[]>([]);

  // Cria um novo toast
  const showToast = useCallback((info: IToastInfo) => {
    const id = info.id ?? nanoid();
    setToasts((prev) => [...prev, { ...info, id }]);
  }, []);

  // Atualiza o progresso de um toast
  const updateToastProgress = useCallback((toastId: string, progress: number) => {
    setToasts((prev) => {
      const index = prev.findIndex((toast) => toast.id === toastId);
      if (index === -1) return prev;

      const copy = [...prev];
      copy[index].progress = progress;
      return copy;
    });
  }, []);

  // Remove um toast
  const removeToast = useCallback((toastId: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== toastId));
  }, []);

  return (
    <AlertsContext.Provider value={{ showToast, updateToastProgress, removeToast }}>
      <div className="fixed bottom-2 right-2 z-50 flex flex-col gap-2">
        {toasts.map((info) => (
          <Toast key={info.id} info={info} onClose={removeToast} />
        ))}
      </div>
      {children}
    </AlertsContext.Provider>
  );
}
