import { IAppError } from '@app/shared-types';

export default class AppError implements IAppError {
  public readonly code: string;
  public readonly status: number;
  public readonly params?: Record<string, string> | undefined;

  constructor(code: string, status: number, params?: Record<string, string>) {
    this.code = code;
    this.status = status;
    this.params = params;
  }
}
