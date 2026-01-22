export interface IToastInfo {
  id?: string;
  type: 'info' | 'progress' | 'success' | 'warning' | 'error';
  progress?: number;
  title: string;
  message: string;
}
