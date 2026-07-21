import type { HttpClient } from '../../client/http-client';
import type { ListParams } from '../../common/types';
import type {
  BulkMessageOptions,
  BulkMessageResult,
  Message,
  MessageList,
  SendMessageOptions,
} from './types';

const PASS_THROUGH = ['templateParams'];

export class Messages {
  constructor(private readonly client: HttpClient) {}

  send(options: SendMessageOptions) {
    return this.client.request<Message>('POST', '/messages', { body: options, passThrough: PASS_THROUGH });
  }

  sendBulk(options: BulkMessageOptions) {
    return this.client.request<BulkMessageResult>('POST', '/messages/bulk', {
      body: options,
      passThrough: PASS_THROUGH,
    });
  }

  get(id: string) {
    return this.client.request<Message>('GET', `/messages/${id}`);
  }

  list(params?: ListParams) {
    return this.client.request<MessageList>('GET', '/messages', { query: params ? { ...params } : undefined });
  }

  cancel(id: string) {
    return this.client.request<Message>('PUT', `/messages/${id}/cancel`);
  }

  retry(id: string) {
    return this.client.request<Message>('PUT', `/messages/${id}/retry`);
  }
}
