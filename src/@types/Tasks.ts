export interface IBackgroundTask {
  id: string;
  code: string;
}

export interface IBackgroundTaskEvent {
  task: IBackgroundTask;
  type: 'started' | 'progress' | 'success' | 'error';
  progress?: number;
}
