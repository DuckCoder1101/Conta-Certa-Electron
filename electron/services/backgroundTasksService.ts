import { BrowserWindow } from 'electron';

import { IBackgroundTask, TaskHandler } from '../@types/tasks';
import AppError from '../errors/AppError';

const TaskHandlers = new Map<string, TaskHandler>();

export async function StartTaskService(task: IBackgroundTask): Promise<void> {
  const handler = TaskHandlers.get(task.id);

  if (!handler) {
    throw new AppError(`BACKGROUND_TASK.INVALID_TASK_HANDLER`, 500);
  }

  const mainWindow = BrowserWindow.getAllWindows()[0];

  // Confirma o início da tarefa
  mainWindow.webContents.send('task:event', {
    task,
    type: 'started',
  });

  try {
    await handler({
      task,
      progress: (value) => {
        mainWindow.webContents.send('task:event', {
          task,
          type: 'progress',
          progress: value,
        });
      },
    });

    mainWindow.webContents.send('task:event', {
      task,
      type: 'success',
    });
  } catch (error) {
    mainWindow.webContents.send('task:event', {
      task,
      type: 'error',
    });
  }
}
