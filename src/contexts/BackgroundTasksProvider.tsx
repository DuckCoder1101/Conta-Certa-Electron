import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { AlertsContext } from '@contexts/AlertsContext';
import { BackgroundTasksContext } from '@contexts/BackgroundTasksContext';

import { IBackgroundTaskEvent } from '@t/Tasks';

export default function BackgroundTasksProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { showToast, updateToastProgress, removeToast } = useContext(AlertsContext);

  // Cria uma nova tarefa e requisita o seu início ao backend
  const createBackgroundTask = async (taskCode: string) => {
    window.api.send('task:start', taskCode);
  };

  // Trata os eventos das tarefas do backend
  const handleTaskEvent = useCallback(
    (event: IBackgroundTaskEvent) => {
      if (event.type === 'started') {
        // Cria um novo toast para a task
        showToast({
          id: event.task.id,
          type: 'progress',
          title: t(`toasts.tasks.${event.task.code}.start.title`),
          message: t(`toasts.tasks.${event.task.code}.start.message`),
          progress: 0,
        });
      } else if (event.type === 'progress') {
        // Atualiza o progresso do toast
        updateToastProgress(event.task.id, event.progress!);
      } else {
        // Deleta o toast de progresso e cria o toast final
        removeToast(event.task.id);

        showToast({
          type: event.type,
          title: t(`toasts.tasks.${event.task.code}.start.title`),
          message: t(`toasts.tasks.${event.task.code}.start.message`),
        });
      }
    },
    [t, showToast, updateToastProgress, removeToast],
  );

  useEffect(() => {
    window.api.on('task:event', handleTaskEvent);
    return () => window.api.off('task:event', handleTaskEvent);
  }, [handleTaskEvent]);

  return <BackgroundTasksContext.Provider value={{ createBackgroundTask }}>{children}</BackgroundTasksContext.Provider>;
}
