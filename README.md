# @zend/node

Official Node.js/TypeScript client for the [Zend](https://tryzend.dev) messaging platform. Send SMS, WhatsApp, email, and voice messages — and manage message templates — from a single, typed client.

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

You can override the base URL (e.g. for a staging environment) either via the `ZEND_BASE_URL` environment variable or the `baseUrl` option:

```ts
const zend = new Zend('sent_live_...', {
  baseUrl: 'https://staging.api.tryzend.com',
  timeout: 30_000, // ms, defaults to 30s
});
```

> **Note:** `baseUrl` defaults to `https://api.tryzend.com`. To target another environment, pass `baseUrl` explicitly or set the `ZEND_BASE_URL` environment variable.

Every method returns a promise that resolves to `{ data, error }` — see [Errors](#errors) below.

## Send SMS / WhatsApp

Send a plain-text SMS:

```ts
const sms = await zend.messages.send({ to: '+233201234567', body: 'Hello!', preferredChannels: ['sms'] });
if (sms.error) throw sms.error;
console.log(`Message ${sms.data.id} (${sms.data.status})`);
```

Send a templated message over WhatsApp, falling back to SMS if delivery fails:

```ts
await zend.messages.send({
  to: '+233201234567',
  templateId: 'welcome',
  templateParams: { first_name: 'John' },
  preferredChannels: ['whatsapp', 'sms'],
  fallbackEnabled: true,
});
```

Other `messages` methods: `sendBulk(options)`, `get(id)`, `list(params?)`, `cancel(id)`, `retry(id)`.

## Send Email

```ts
const email = await zend.emails.send({
  from: 'you@example.com',
  to: 'user@gmail.com',
  subject: 'hello world',
  html: '<p>it works!</p>',
});
console.log(`Email ${email.data?.id ?? '(error)'} sent`);
```

Other `emails` methods: `get(id)`, `list(params?)`.

## Send Voice

```ts
await zend.voice.send({
  recipients: ['+233201234567'],
  text: 'Your order has shipped.',
  fallback: { sms: true, smsText: 'Your order has shipped.' },
});
```

Other `voice` methods: `get(batchId)`, `list(params?)`, `upload(file, filename)`.

## Templates

Templates are read-only from this SDK — list and fetch templates managed elsewhere:

```ts
const templates = await zend.templates.list();
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
  throw sms.error; // ZendError
}
console.log(sms.data.id);
```

`ZendError` extends `Error` and adds:

- `name` — e.g. `"api_error"`, `"timeout"`, `"application_error"`
- `statusCode` — HTTP status code, when available
- `code` — provider error code, when available

## Full example

See [`examples/quickstart.ts`](./examples/quickstart.ts) for a complete, type-checked walkthrough of sending SMS, WhatsApp, email, and voice messages, plus listing templates.
