export interface IAppError {
  code: string;
  status: number;
  params?: Record<string, string>;
}

export interface IAppResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: IAppError;
}
