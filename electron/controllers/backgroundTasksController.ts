import { IBackgroundTask } from '../@types/tasks';

import { StartTaskService } from '../services/backgroundTasksService';

export async function StartTaskController(ev: Electron.IpcMainEvent, taskCode: string): Promise<void> {
  try {
    const task: IBackgroundTask = {
      id: crypto.randomUUID(),
      code: taskCode,
    };

    await StartTaskService(task);
  } catch (err) {
    console.error(err);
  }
}
