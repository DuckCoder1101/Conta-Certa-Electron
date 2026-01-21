import React, { useCallback, useState } from 'react';
import { nanoid } from 'nanoid';

import Toast from '@components/Toast';

import { AlertsContext } from '@contexts/AlertsContext';

import { IToastInfo } from '@t/Toast';

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Map<string, IToastInfo>>(() => new Map());

  // Cria um novo toast
  const showToast = useCallback((info: IToastInfo) => {
    const toastId = nanoid();

    setToasts((prev) => {
      const next = new Map(prev);
      next.set(toastId, info);
      return next;
    });

    return toastId;
  }, []);

  // Atualiza o progresso de um toast
  const updateToastProgress = useCallback((toastId: string, progress: number) => {
    setToasts((prev) => {
      const toast = prev.get(toastId);
      if (!toast || toast.type !== 'progress') return prev;

      const next = new Map(prev);
      next.set(toastId, { ...toast, progress });

      return next;
    });
  }, []);

  // Remove um toast
  const removeToast = useCallback((toastId: string) => {
    setToasts((prev) => {
      const next = new Map(prev);
      next.delete(toastId);
      return next;
    });
  }, []);

  return (
    <AlertsContext.Provider value={{ showToast, updateToastProgress, removeToast }}>
      <div className="fixed bottom-2 right-2 z-50 flex flex-col gap-2">
        {[...toasts.values()].map((info) => (
          <Toast key={info.id} info={info} onClose={removeToast} />
        ))}
      </div>
      {children}
    </AlertsContext.Provider>
  );
}
