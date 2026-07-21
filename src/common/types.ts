import type { ZendError } from '../client/error';

export type ZendResponse<T> =
  | { data: T; error: null }
  | { data: null; error: ZendError };

export interface ListParams {
  limit?: number;
  offset?: number;
}
