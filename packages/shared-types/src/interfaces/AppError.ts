export interface IAppError {
  code: string;
  status: number;
  params?: Record<string, string>;
}
