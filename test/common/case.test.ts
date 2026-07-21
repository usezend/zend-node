import { describe, it, expect } from 'vitest';
import { toSnakeCase, toCamelCase } from '../../src/common/case';

describe('toSnakeCase', () => {
  it('converts nested keys and arrays', () => {
    expect(
      toSnakeCase({ preferredChannels: ['sms'], fallbackEnabled: true, nested: { senderId: 'X' } }),
    ).toEqual({ preferred_channels: ['sms'], fallback_enabled: true, nested: { sender_id: 'X' } });
  });

  it('leaves pass-through map values verbatim at any depth', () => {
    expect(
      toSnakeCase(
        { templateId: 't1', templateParams: { firstName: 'John' }, messages: [{ templateParams: { lastName: 'Doe' } }] },
        ['templateParams'],
      ),
    ).toEqual({
      template_id: 't1',
      template_params: { firstName: 'John' },
      messages: [{ template_params: { lastName: 'Doe' } }],
    });
  });

  it('passes primitives through', () => {
    expect(toSnakeCase('hello')).toBe('hello');
    expect(toSnakeCase(42)).toBe(42);
    expect(toSnakeCase(null)).toBe(null);
  });
});

describe('toCamelCase', () => {
  it('converts nested keys and arrays', () => {
    expect(
      toCamelCase({ estimated_cost: 0.02, channel_variants: [{ media_url: 'u' }] }),
    ).toEqual({ estimatedCost: 0.02, channelVariants: [{ mediaUrl: 'u' }] });
  });
});
