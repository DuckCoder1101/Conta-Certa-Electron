export default class AppError {
  public code: string;
  public status: number;
  public params?: Record<string, string>;

  constructor(code: string, status: number, params?: Record<string, string>) {
    this.code = code;
    this.status = status;
    this.params = params;
  }
}
