import type { HttpClient } from '../../client/http-client';
import type { ListParams } from '../../common/types';
import type { SendVoiceOptions, VoiceBatch, VoiceBatchList, VoiceUpload } from './types';

export class Voice {
  constructor(private readonly client: HttpClient) {}

  send(options: SendVoiceOptions) {
    return this.client.request<VoiceBatch>('POST', '/voice/send', { body: options });
  }

  get(batchId: string) {
    return this.client.request<VoiceBatch>('GET', `/voice/${batchId}`);
  }

  list(params?: ListParams) {
    return this.client.request<VoiceBatchList>('GET', '/voice', { query: params });
  }

  upload(file: Blob, filename: string) {
    const form = new FormData();
    form.append('file', file, filename);
    return this.client.request<VoiceUpload>('POST', '/voice/upload', { multipart: form });
  }
}
