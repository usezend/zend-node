import { Zend } from '../src';

const zend = new Zend(process.env.ZEND_API_KEY);

async function main() {
  // SMS — every option (keep only what you need)
  const sms = await zend.messages.send({
    to: '+233201234567',
    body: 'Hello from Zend!',
    preferredChannels: ['sms'],
    senderId: 'MyBrand',
    fallbackEnabled: true,
    priority: 'high',
    deliveryPriority: 'speed',
    webhookUrl: 'https://your-app.com/webhooks/zend',
    // scheduledFor: '2026-08-01T09:00:00Z',
  });
  if (sms.error) throw sms.error;
  console.log(`Message ${sms.data.id} (${sms.data.status})`);

  // WhatsApp with a template, falling back to SMS
  await zend.messages.send({
    to: '+233201234567',
    templateId: 'welcome',
    templateParams: { first_name: 'John' },
    preferredChannels: ['whatsapp', 'sms'],
    fallbackEnabled: true,
    senderId: 'MyBrand',
  });

  // Bulk send
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

  // Email
  const email = await zend.emails.send({
    from: 'you@example.com',
    to: 'user@gmail.com',
    subject: 'Hello world',
    html: '<p>It works!</p>',
    text: 'It works!',
  });
  if (email.error) throw email.error;
  console.log(`Email ${email.data.id} sent`);

  // Voice — text-to-speech with all options
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

  // Voice — a pre-recorded audio file
  await zend.voice.send({
    recipients: ['+233201234567'],
    voiceUrl: 'https://cdn.example.com/message.mp3',
    fallback: { sms: true, smsText: 'You have a new message.' },
  });

  // Templates (read-only)
  const templates = await zend.templates.list({
    category: 'transactional',
    status: 'active',
    limit: 20,
    offset: 0,
  });
  console.log(`You have ${templates.data?.total ?? 0} templates`);
}

void main();
