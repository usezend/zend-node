import type { HttpClient } from '../../client/http-client';
import type { ListParams } from '../../common/types';
import type { Email, EmailList, SendEmailOptions } from './types';

export class Emails {
  constructor(private readonly client: HttpClient) {}

  send(options: SendEmailOptions) {
    return this.client.request<Email>('POST', '/email/send', { body: options });
  }

  get(id: string) {
    return this.client.request<Email>('GET', `/email/messages/${id}`);
  }

  list(params?: ListParams) {
    return this.client.request<EmailList>('GET', '/email/messages', { query: params });
  }
}
