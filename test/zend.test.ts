import { describe, it, expect, beforeEach } from 'vitest';
import { Zend } from '../src/zend';
import { Emails } from '../src/resources/emails/emails';

describe('Zend', () => {
  beforeEach(() => {
    delete process.env.ZEND_API_KEY;
  });

  it('throws when no API key is provided and none in env', () => {
    expect(() => new Zend()).toThrow(/API key is required/);
  });

  it('reads the API key from ZEND_API_KEY when the arg is omitted', () => {
    process.env.ZEND_API_KEY = 'sent_live_env';
    expect(() => new Zend()).not.toThrow();
  });

  it('exposes all four resources', () => {
    const zend = new Zend('sent_live_x');
    expect(zend.emails).toBeInstanceOf(Emails);
    expect(zend.messages).toBeDefined();
    expect(zend.voice).toBeDefined();
    expect(zend.templates).toBeDefined();
  });
});
