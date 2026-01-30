import { ITask } from '@app/shared-types';

import { StartTaskService } from '../services/TasksService';

export async function StartTaskController(
  ev: Electron.IpcMainEvent,
  taskCode: string,
  payload?: unknown,
): Promise<void> {
  console.log('STARTING TASK: ' + taskCode);

  try {
    const task: ITask = {
      id: crypto.randomUUID(),
      code: taskCode,
    };

    await StartTaskService(task, payload);
  } catch (err) {
    console.error(err);
  }
}
