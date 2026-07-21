import { describe, it, expect, vi, afterEach } from 'vitest';
import { HttpClient } from '../../src/client/http-client';
import { Templates } from '../../src/resources/templates/templates';

afterEach(() => vi.unstubAllGlobals());
const client = () => new HttpClient({ apiKey: 'k', baseUrl: 'https://api.test', timeout: 5000 });

describe('Templates', () => {
  it('list GETs /templates with query and camelCases the response', async () => {
    const fetchFn = vi.fn(async () =>
      new Response(JSON.stringify({ templates: [{ id: 't1', is_whatsapp_approved: true }], total: 1 }), { status: 200 }),
    );
    vi.stubGlobal('fetch', fetchFn);

    const res = await new Templates(client()).list({ category: 'transactional', limit: 10 });

    expect(res.data).toEqual({ templates: [{ id: 't1', isWhatsappApproved: true }], total: 1 });
    expect(fetchFn.mock.calls[0][0]).toBe('https://api.test/templates?category=transactional&limit=10');
  });

  it('get GETs /templates/:id', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ id: 't1' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);
    await new Templates(client()).get('t1');
    expect(fetchFn.mock.calls[0][0]).toBe('https://api.test/templates/t1');
  });
});
