import { Zend } from '../src';

const zend = new Zend(process.env.ZEND_API_KEY);

async function main() {
  const sms = await zend.messages.send({ to: '+233201234567', body: 'Hello!', preferredChannels: ['sms'] });
  if (sms.error) throw sms.error;
  console.log(`Message ${sms.data.id} (${sms.data.status})`);

  await zend.messages.send({
    to: '+233201234567',
    templateId: 'welcome',
    templateParams: { first_name: 'John' },
    preferredChannels: ['whatsapp', 'sms'],
    fallbackEnabled: true,
  });

  const email = await zend.emails.send({
    from: 'you@example.com',
    to: 'user@gmail.com',
    subject: 'hello world',
    html: '<p>it works!</p>',
  });
  console.log(`Email ${email.data?.id ?? '(error)'} sent`);

  await zend.voice.send({
    recipients: ['+233201234567'],
    text: 'Your order has shipped.',
    fallback: { sms: true, smsText: 'Your order has shipped.' },
  });

  const templates = await zend.templates.list();
  console.log(`You have ${templates.data?.total ?? 0} templates`);
}

void main();
