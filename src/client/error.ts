export interface ZendErrorParams {
  message: string;
  name?: string;
  statusCode?: number;
  code?: string;
}

export class ZendError extends Error {
  readonly statusCode?: number;
  readonly code?: string;

  constructor(params: ZendErrorParams) {
    super(params.message);
    this.name = params.name ?? 'ZendError';
    this.statusCode = params.statusCode;
    this.code = params.code;
    Object.setPrototypeOf(this, ZendError.prototype);
  }
}
