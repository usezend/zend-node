import type { HttpClient } from '../../client/http-client';
import type { ListParams } from '../../common/types';
import type { Email, EmailList, SendEmailOptions } from './types';

export class Emails {
  constructor(private readonly client: HttpClient) {}

  send(options: SendEmailOptions) {
    const { attachments, ...rest } = options;
    const body = attachments?.length
      ? {
          ...rest,
          attachments: attachments.map(({ content, ...a }) => ({
            ...a,
            content: typeof content === 'string' ? content : Buffer.from(content).toString('base64'),
          })),
        }
      : options;
    return this.client.request<Email>('POST', '/email/send', { body });
  }

  get(id: string) {
    return this.client.request<Email>('GET', `/email/messages/${id}`);
  }

  list(params?: ListParams) {
    return this.client.request<EmailList>('GET', '/email/messages', { query: params ? { ...params } : undefined });
  }
}
