import { HttpClient } from './client/http-client';
import { DEFAULT_BASE_URL, DEFAULT_TIMEOUT } from './common/constants';
import { Emails } from './resources/emails/emails';
import { Messages } from './resources/messages/messages';
import { Voice } from './resources/voice/voice';
import { Templates } from './resources/templates/templates';

export interface ZendOptions {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class Zend {
  readonly emails: Emails;
  readonly messages: Messages;
  readonly voice: Voice;
  readonly templates: Templates;

  constructor(apiKey?: string, options: ZendOptions = {}) {
    const key = apiKey ?? process.env.ZEND_API_KEY;
    if (!key) {
      throw new Error(
        'Zend: an API key is required. Pass it to `new Zend(apiKey)` or set the ZEND_API_KEY environment variable.',
      );
    }

    const client = new HttpClient({
      apiKey: key,
      baseUrl: options.baseUrl ?? process.env.ZEND_BASE_URL ?? DEFAULT_BASE_URL,
      timeout: options.timeout ?? DEFAULT_TIMEOUT,
      headers: options.headers,
    });

    this.emails = new Emails(client);
    this.messages = new Messages(client);
    this.voice = new Voice(client);
    this.templates = new Templates(client);
  }
}
