import { IAppError } from './AppError';

export interface IAppResponse<T = undefined> {
  success: boolean;
  data?: T;
  error?: IAppError;
}
