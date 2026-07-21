# @zend/node

Official Node.js/TypeScript client for the [Zend](https://tryzend.dev) messaging platform. Send SMS, WhatsApp, email, and voice messages — and manage message templates — from a single, typed client.

📚 **[Read the docs →](https://tryzend.com/docs)**

## Installation

```bash
npm i @zend/node
```

Requires Node.js 18 or later (uses the global `fetch` and `FormData` APIs).

## Usage

Create a client with your API key:

```ts
import { Zend } from '@zend/node';

const zend = new Zend('sent_live_...');
```

The API key can also be supplied via the `ZEND_API_KEY` environment variable, in which case you can construct the client with no arguments:

```ts
const zend = new Zend();
```

You can override the base URL (e.g. for a staging environment) or the request timeout, in milliseconds, via options — or the `ZEND_BASE_URL` environment variable:

```ts
const zend = new Zend('sent_live_...', {
  baseUrl: 'https://staging.api.tryzend.com',
  timeout: 30_000,
});
```

> **Note:** `baseUrl` defaults to `https://api.tryzend.com`, and `timeout` defaults to 30s.

Every method returns a promise that resolves to `{ data, error }` — see [Errors](#errors) below.

## Send SMS / WhatsApp

Send a plain-text SMS:

```ts
const sms = await zend.messages.send({
  to: '+233201234567',
  body: 'Hello from Zend!',
  preferredChannels: ['sms'],
  senderId: 'MyBrand',
  fallbackEnabled: true,
  priority: 'high',
  deliveryPriority: 'speed',
  webhookUrl: 'https://your-app.com/webhooks/zend',
});

if (sms.error) throw sms.error;
console.log(`Message ${sms.data.id} (${sms.data.status})`);
```

Send over WhatsApp with a template, falling back to SMS:

```ts
await zend.messages.send({
  to: '+233201234567',
  templateId: 'welcome',
  templateParams: { first_name: 'John' },
  preferredChannels: ['whatsapp', 'sms'],
  fallbackEnabled: true,
  senderId: 'MyBrand',
});
```

> Media (images, documents) on WhatsApp is defined in the approved template itself, not passed at send time.

Send to many recipients in one call:

```ts
await zend.messages.sendBulk({
  messages: [
    { to: '+233201234567', body: 'Hi Ama!' },
    { to: '+233207654321', body: 'Your code is 123456', templateParams: { code: '123456' } },
  ],
  preferredChannels: ['sms'],
  senderId: 'MyBrand',
  fallbackEnabled: true,
  webhookUrl: 'https://your-app.com/webhooks/zend',
});
```

Other `messages` methods: `get(id)`, `list(params?)`, `cancel(id)`, `retry(id)`.

## Send Email

```ts
const email = await zend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'Hello world',
  html: '<p>It works!</p>',
  text: 'It works!',
});

if (email.error) throw email.error;
console.log(`Email ${email.data.id} sent`);
```

Other `emails` methods: `get(id)`, `list(params?)`.

## Send Voice

Send a call using text-to-speech, falling back to SMS if it isn't answered:

```ts
await zend.voice.send({
  recipients: ['+233201234567'],
  text: 'Your order has shipped.',
  voice: 'female',
  retry: true,
  callbackUrl: 'https://your-app.com/webhooks/voice',
  fallback: {
    sms: true,
    smsText: 'Your order has shipped.',
    senderId: 'MyBrand',
  },
});
```

Or play a pre-recorded audio file (a hosted MP3/WAV):

```ts
await zend.voice.send({
  recipients: ['+233201234567'],
  voiceUrl: 'https://cdn.example.com/message.mp3',
  fallback: { sms: true, smsText: 'You have a new message.' },
});
```

To send a local audio file, upload it first with `zend.voice.upload(file, filename)` and pass the returned `url` as `voiceUrl`.

Other `voice` methods: `get(batchId)`, `list(params?)`, `upload(file, filename)`.

## Templates

Templates are read-only from this SDK — list and fetch templates managed elsewhere:

```ts
const templates = await zend.templates.list({
  category: 'transactional',
  status: 'active',
  limit: 20,
  offset: 0,
});

console.log(`You have ${templates.data?.total ?? 0} templates`);
```

```ts
const template = await zend.templates.get('welcome');
console.log(template.data?.name);
```

`list()` accepts optional filters: `{ category?, status?, limit?, offset? }`.

## Errors

Every SDK method resolves — it never throws for API or network errors. The result is always one of:

```ts
{ data: T; error: null } | { data: null; error: ZendError }
```

Check `error` before using `data`:

```ts
const sms = await zend.messages.send({ to: '+233201234567', body: 'Hello!' });

if (sms.error) {
  throw sms.error;
}

console.log(sms.data.id);
```

`ZendError` extends `Error` and adds:

- `name` — e.g. `"api_error"`, `"timeout"`, `"application_error"`
- `statusCode` — HTTP status code, when available
- `code` — provider error code, when available

## Full example

See [`examples/quickstart.ts`](./examples/quickstart.ts) for a complete, type-checked walkthrough of sending SMS, WhatsApp, email, and voice messages, plus listing templates.
