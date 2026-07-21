import { describe, it, expect, vi, afterEach } from 'vitest';
import { HttpClient } from '../../src/client/http-client';
import { Voice } from '../../src/resources/voice/voice';

afterEach(() => vi.unstubAllGlobals());
const client = () => new HttpClient({ apiKey: 'k', baseUrl: 'https://api.test', timeout: 5000 });

describe('Voice', () => {
  it('send POSTs /voice/send and snake_cases nested fallback', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ batch_id: 'b1' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);

    const res = await new Voice(client()).send({
      recipients: ['+233201234567'],
      text: 'hello',
      fallback: { sms: true, smsText: 'hello', senderId: 'Brand' },
    });

    expect(res.data).toEqual({ batchId: 'b1' });
    const init = fetchFn.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(init.body as string)).toEqual({
      recipients: ['+233201234567'],
      text: 'hello',
      fallback: { sms: true, sms_text: 'hello', sender_id: 'Brand' },
    });
  });

  it('upload sends multipart FormData to /voice/upload with no JSON content-type', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ url: 'https://cdn/x.mp3' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);

    await new Voice(client()).upload(new Blob(['audio'], { type: 'audio/mpeg' }), 'x.mp3');
    const init = fetchFn.mock.calls[0][1] as RequestInit;
    expect(fetchFn.mock.calls[0][0]).toBe('https://api.test/voice/upload');
    expect(init.body).toBeInstanceOf(FormData);
    expect((init.headers as Record<string, string>)['Content-Type']).toBeUndefined();
  });

  it('get returns { batch, recipients } with normalized recipient ids', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({
      batch: { batch_id: 'voice_1', status: 'failed', counts: { total: 1, answered: 0, no_answer: 0, busy: 0, failed: 0, fallback_sent: 0 } },
      recipients: [{ _id: 'r1', to: '233201234567', status: 'failed', voice_refunded: false, fallback_sms_sent: false }],
    }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);
    const res = await new Voice(client()).get('voice_1');
    expect(res.data?.batch.batchId).toBe('voice_1');
    expect(res.data?.batch.counts?.fallbackSent).toBe(0);
    expect(res.data?.recipients[0].id).toBe('r1');
    expect(res.data?.recipients[0].fallbackSmsSent).toBe(false);
  });

  it('list returns batches plus pagination', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({
      batches: [{ batch_id: 'voice_1', status: 'failed' }], total: 6, page: 1, limit: 2,
    }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);
    const res = await new Voice(client()).list({ limit: 2 });
    expect(res.data?.batches[0].batchId).toBe('voice_1');
    expect(res.data?.total).toBe(6);
    expect(res.data?.limit).toBe(2);
  });
});
