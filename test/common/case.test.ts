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

  it('passes non-plain objects (Date) through verbatim so JSON serialization is preserved', () => {
    const d = new Date('2024-01-01T00:00:00.000Z');
    const out = toSnakeCase({ scheduledFor: d }) as { scheduled_for: unknown };
    expect(out.scheduled_for).toBe(d);
    expect(JSON.stringify(out)).toBe('{"scheduled_for":"2024-01-01T00:00:00.000Z"}');
  });
});

describe('toCamelCase', () => {
  it('converts nested keys and arrays', () => {
    expect(
      toCamelCase({ estimated_cost: 0.02, channel_variants: [{ media_url: 'u' }] }),
    ).toEqual({ estimatedCost: 0.02, channelVariants: [{ mediaUrl: 'u' }] });
  });

  it('leaves primitives and non-plain objects untouched', () => {
    expect(toCamelCase('hi')).toBe('hi');
    expect(toCamelCase(7)).toBe(7);
    expect(toCamelCase(null)).toBe(null);
    const d = new Date('2024-01-01T00:00:00.000Z');
    const out = toCamelCase({ created_at: d }) as { createdAt: unknown };
    expect(out.createdAt).toBe(d);
  });
});
