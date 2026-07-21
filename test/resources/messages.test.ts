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

  it('get returns the full message record (normalized + camelCased)', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({
      _id: 'm1', status: 'sent', channel_used: 'sms', to: '+233201234567', body: 'Hi',
      total_cost: 0.03,
      delivery_attempts: [{ channel: 'sms', status: 'sent', attempted_at: '2026-01-01T00:00:00Z', cost: 0.03, error_message: '' }],
      created_at: '2026-01-01T00:00:00Z', sent_at: '2026-01-01T00:00:01Z', error_message: '',
    }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);
    const res = await new Messages(client()).get('m1');
    expect(res.data?.id).toBe('m1');
    expect(res.data?.channelUsed).toBe('sms');
    expect(res.data?.totalCost).toBe(0.03);
    expect(res.data?.deliveryAttempts?.[0].channel).toBe('sms');
  });

  it('list returns messages plus pagination', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({
      messages: [{ _id: 'm1', status: 'sent' }], total: 100, page: 1, pages: 50,
    }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);
    const res = await new Messages(client()).list({ limit: 2 });
    expect(res.data?.messages[0].id).toBe('m1');
    expect(res.data?.total).toBe(100);
    expect(res.data?.page).toBe(1);
    expect(res.data?.pages).toBe(50);
  });
});
