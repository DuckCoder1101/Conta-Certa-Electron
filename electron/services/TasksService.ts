import { BrowserWindow } from 'electron';

import { ITask, TaskHandler } from '@app/shared-types';

import AppError from '../errors/AppError';

import { ExportLocalBackup } from '../handlers/BackupsHandlers';

const TaskHandlers = new Map<string, TaskHandler>([['SAVE_LOCAL_BACKUP', ExportLocalBackup]]);

export async function StartTaskService(task: ITask, payload?: unknown): Promise<void> {
  const handler = TaskHandlers.get(task.code);

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
      payload,
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
    if (error instanceof AppError) {
      mainWindow.webContents.send('task:event', {
        task,
        type: 'error',
        error: error,
      });
    } else {
      console.error(error);

      mainWindow.webContents.send('task:event', {
        task,
        type: 'error',
        error: new AppError('UNEXPECTED_ERROR', 500),
      });
    }
  }
}
