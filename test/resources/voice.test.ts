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
});
