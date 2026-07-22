import { describe, it, expect, vi, afterEach } from 'vitest';
import { HttpClient } from '../../src/client/http-client';
import { Emails } from '../../src/resources/emails/emails';

afterEach(() => vi.unstubAllGlobals());
const client = () => new HttpClient({ apiKey: 'k', baseUrl: 'https://api.test', timeout: 5000 });

describe('Emails', () => {
  it('send POSTs /email/send and returns data', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ id: 'e1' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);

    const res = await new Emails(client()).send({ from: 'a@x.com', to: 'b@y.com', subject: 'hi', html: '<p>ok</p>' });

    expect(res.data).toEqual({ id: 'e1' });
    expect(fetchFn.mock.calls[0][0]).toBe('https://api.test/email/send');
    expect((fetchFn.mock.calls[0][1] as RequestInit).method).toBe('POST');
  });

  it('get GETs /email/messages/:id', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ id: 'e1' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);
    await new Emails(client()).get('e1');
    expect(fetchFn.mock.calls[0][0]).toBe('https://api.test/email/messages/e1');
  });

  it('send converts Buffer attachment content to base64 and snake_cases contentType', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ id: 'e2' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);

    await new Emails(client()).send({
      from: 'a@x.com',
      to: 'b@y.com',
      subject: 'inv',
      html: '<p>ok</p>',
      attachments: [{ filename: 'inv.pdf', content: Buffer.from('%PDF-1.4'), contentType: 'application/pdf' }],
    });

    const body = JSON.parse((fetchFn.mock.calls[0][1] as RequestInit).body as string);
    expect(body.attachments).toEqual([
      { filename: 'inv.pdf', content: Buffer.from('%PDF-1.4').toString('base64'), content_type: 'application/pdf' },
    ]);
  });

  it('send passes base64-string attachment content through unchanged and omits content_type when absent', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ id: 'e3' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);

    await new Emails(client()).send({
      from: 'a@x.com',
      to: 'b@y.com',
      subject: 'inv',
      html: '<p>ok</p>',
      attachments: [{ filename: 'inv.pdf', content: 'JVBERi0xLjQ=' }],
    });

    const body = JSON.parse((fetchFn.mock.calls[0][1] as RequestInit).body as string);
    expect(body.attachments).toEqual([{ filename: 'inv.pdf', content: 'JVBERi0xLjQ=' }]);
  });

  it('send omits the attachments key entirely when none are given', async () => {
    const fetchFn = vi.fn(async () => new Response(JSON.stringify({ id: 'e4' }), { status: 200 }));
    vi.stubGlobal('fetch', fetchFn);

    await new Emails(client()).send({ from: 'a@x.com', to: 'b@y.com', subject: 'hi', html: '<p>ok</p>' });

    const body = JSON.parse((fetchFn.mock.calls[0][1] as RequestInit).body as string);
    expect(body.attachments).toBeUndefined();
  });
});
