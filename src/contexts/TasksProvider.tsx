import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { AlertsContext } from '@contexts/AlertsContext';
import { TasksContext } from '@contexts/TasksContext';

import { ITaskEvent } from '@t/Task';

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const { showToast, updateToastProgress, removeToast } = useContext(AlertsContext);

  // Cria uma nova tarefa e requisita o seu início ao backend
  const startTask = async (taskCode: string) => {
    window.api.send('task:start', taskCode);
  };

  // Trata os eventos das tarefas do backend
  const handleTaskEvent = useCallback(
    (_e: unknown, event: ITaskEvent) => {
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
          title: t(`toasts.tasks.${event.task.code}.${event.type}.title`),
          message:
            event.type === 'success'
              ? t(`toasts.tasks.${event.task.code}.success.message`)
              : t(`errors:${event.error?.code}`),
        });
      }
    },
    [t, showToast, updateToastProgress, removeToast],
  );

  // Ref do callback de coleta de evento
  const handlerRef = useRef(handleTaskEvent);

  useEffect(() => {
    handlerRef.current = handleTaskEvent;
  }, [handleTaskEvent]);

  useEffect(() => {
    const unsubscribe = window.api.on('task:event', (_e: unknown, event: ITaskEvent) => {
      handlerRef.current(_e, event);
    });

    return () => unsubscribe();
  }, []);

  return <TasksContext.Provider value={{ startTask }}>{children}</TasksContext.Provider>;
}
