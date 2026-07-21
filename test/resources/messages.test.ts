import { describe, it, expect, vi, afterEach } from 'vitest';
import { HttpClient } from '../../src/client/http-client';
import { Messages } from '../../src/resources/messages/messages';

afterEach(() => vi.unstubAllGlobals());
const client = () => new HttpClient({ apiKey: 'k', baseUrl: 'https://api.test', timeout: 5000 });

describe('Messages', () => {
  it('send POSTs /messages, snake_cases fields, preserves templateParams keys', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ id: 'm1', status: 'pending' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);

    const res = await new Messages(client()).send({
      to: '+233201234567',
      templateId: 'welcome',
      templateParams: { firstName: 'John' },
      preferredChannels: ['whatsapp', 'sms'],
      fallbackEnabled: true,
    });

    expect(res.data).toEqual({ id: 'm1', status: 'pending' });
    const init = fetchFn.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(init.body as string)).toEqual({
      to: '+233201234567',
      template_id: 'welcome',
      template_params: { firstName: 'John' },
      preferred_channels: ['whatsapp', 'sms'],
      fallback_enabled: true,
    });
  });

  it('cancel PUTs /messages/:id/cancel', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ id: 'm1', status: 'cancelled' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);
    await new Messages(client()).cancel('m1');
    expect(fetchFn.mock.calls[0][0]).toBe('https://api.test/messages/m1/cancel');
    expect((fetchFn.mock.calls[0][1] as RequestInit).method).toBe('PUT');
  });
});
