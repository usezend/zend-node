import type { HttpClient } from '../../client/http-client';
import type { ListTemplatesParams, Template, TemplateList } from './types';

export class Templates {
  constructor(private readonly client: HttpClient) {}

  list(params?: ListTemplatesParams) {
    return this.client.request<TemplateList>('GET', '/templates', { query: params ? { ...params } : undefined });
  }

  get(id: string) {
    return this.client.request<Template>('GET', `/templates/${id}`);
  }
}
