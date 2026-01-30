import { IAppError } from './AppError';

export interface ITask {
  id: string;
  code: string;
}

export interface ITaskEvent {
  task: ITask;
  type: 'started' | 'progress' | 'success' | 'error';
  progress?: number;
  error?: IAppError;
}

export type TaskHandler = (ctx: ITaskContext) => Promise<void>;
export interface ITaskContext {
  task: ITask;
  progress: (value: number) => void;
  payload?: unknown;
}
