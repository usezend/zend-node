import { describe, it, expect, vi, afterEach } from 'vitest';
import { HttpClient } from '../../src/client/http-client';
import { ZendError } from '../../src/client/error';

const cfg = { apiKey: 'sent_live_x', baseUrl: 'https://api.test', timeout: 5000 };

function mockFetch(status: number, body: unknown) {
  const fn = vi.fn(async () => new Response(body === null ? '' : JSON.stringify(body), { status }));
  vi.stubGlobal('fetch', fn);
  return fn;
}

afterEach(() => vi.unstubAllGlobals());

describe('HttpClient.request', () => {
  it('sends X-API-Key, snake_cases the body, and camelCases the response on success', async () => {
    const fetchFn = mockFetch(200, { estimated_cost: 0.02, id: 'm1' });
    const client = new HttpClient(cfg);

    const res = await client.request('POST', '/messages', {
      body: { preferredChannels: ['sms'], templateParams: { firstName: 'J' } },
      passThrough: ['templateParams'],
    });

    expect(res.error).toBeNull();
    expect(res.data).toEqual({ estimatedCost: 0.02, id: 'm1' });

    const [url, init] = fetchFn.mock.calls[0];
    expect(url).toBe('https://api.test/messages');
    expect((init as RequestInit).method).toBe('POST');
    const headers = (init as RequestInit).headers as Record<string, string>;
    expect(headers['X-API-Key']).toBe('sent_live_x');
    expect(headers['User-Agent']).toMatch(/^@zend\/node\//);
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      preferred_channels: ['sms'],
      template_params: { firstName: 'J' },
    });
  });

  it('maps a 4xx body to a ZendError and null data', async () => {
    mockFetch(422, { statusCode: 422, message: 'Invalid recipient', error: 'validation_error' });
    const res = await new HttpClient(cfg).request('POST', '/messages', { body: {} });
    expect(res.data).toBeNull();
    expect(res.error?.statusCode).toBe(422);
    expect(res.error?.message).toBe('Invalid recipient');
  });

  it('returns an application_error when fetch throws', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => { throw new Error('boom'); }));
    const res = await new HttpClient(cfg).request('GET', '/messages');
    expect(res.data).toBeNull();
    expect(res.error?.name).toBe('application_error');
    expect(res.error?.message).toBe('boom');
  });

  it('builds query strings, ignoring undefined params', async () => {
    const fetchFn = mockFetch(200, { messages: [], total: 0 });
    await new HttpClient(cfg).request('GET', '/messages', { query: { limit: 10, status: undefined } });
    expect(fetchFn.mock.calls[0][0]).toBe('https://api.test/messages?limit=10');
  });

  it('maps a non-JSON error body to a ZendError that keeps the status code', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('<html>502 Bad Gateway</html>', { status: 502 })));
    const res = await new HttpClient(cfg).request('GET', '/messages');
    expect(res.data).toBeNull();
    expect(res.error?.statusCode).toBe(502);
    expect(res.error?.name).toBe('api_error');
  });

  it('maps an aborted/timed-out request to a timeout error', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => {
      const e = new Error('aborted');
      e.name = 'AbortError';
      throw e;
    }));
    const res = await new HttpClient(cfg).request('GET', '/messages');
    expect(res.data).toBeNull();
    expect(res.error?.name).toBe('timeout');
  });
});
