export interface IBackgroundTask {
  id: string;
  code: string;
}

export interface IBackgroundTaskEvent {
  task: IBackgroundTask;
  type: 'started' | 'progress' | 'success' | 'error';
  progress?: number;
}

export type TaskHandler = (ctx: ITaskContext) => Promise<void>;
export interface ITaskContext {
  task: IBackgroundTask;
  progress: (value: number) => void;
}
