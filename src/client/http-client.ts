import { toCamelCase, toSnakeCase } from '../common/case';
import { normalizeResponse } from '../common/normalize';
import { ZendError } from './error';
import type { ZendResponse } from '../common/types';
import { VERSION } from '../version';

export interface HttpClientConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
  headers?: Record<string, string>;
}

export interface RequestOptions {
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  passThrough?: string[];
  multipart?: FormData;
}

export class HttpClient {
  constructor(private readonly config: HttpClientConfig) {}

  async request<T>(method: string, path: string, options: RequestOptions = {}): Promise<ZendResponse<T>> {
    const url = this.buildUrl(path, options.query);
    const headers: Record<string, string> = {
      'X-API-Key': this.config.apiKey,
      Accept: 'application/json',
      'User-Agent': `@zend/node/${VERSION}`,
      ...this.config.headers,
    };

    let body: string | FormData | undefined;
    if (options.multipart) {
      body = options.multipart;
    } else if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(toSnakeCase(options.body, options.passThrough));
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const res = await fetch(url, { method, headers, body, signal: controller.signal });
      const text = await res.text();
      let json: any = null;
      if (text) {
        try {
          json = JSON.parse(text);
        } catch {
          json = null;
        }
      }

      if (!res.ok) {
        const message = Array.isArray(json?.message)
          ? json.message.join(', ')
          : json?.message || json?.error || (text || res.statusText) || 'Request failed';
        return {
          data: null,
          error: new ZendError({ message, name: json?.error || 'api_error', statusCode: res.status }),
        };
      }

      return { data: toCamelCase(normalizeResponse(json)) as T, error: null };
    } catch (err) {
      const isAbort = err instanceof Error && err.name === 'AbortError';
      return {
        data: null,
        error: new ZendError({
          message: isAbort ? `Request timed out after ${this.config.timeout}ms` : (err as Error).message,
          name: isAbort ? 'timeout' : 'application_error',
        }),
      };
    } finally {
      clearTimeout(timer);
    }
  }

  private buildUrl(path: string, query?: RequestOptions['query']): string {
    const url = new URL(this.config.baseUrl.replace(/\/$/, '') + path);
    if (query) {
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined) url.searchParams.set(k, String(v));
      }
    }
    return url.toString();
  }
}
