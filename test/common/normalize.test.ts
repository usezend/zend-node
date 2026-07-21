import { describe, it, expect } from 'vitest';
import { normalizeResponse } from '../../src/common/normalize';

describe('normalizeResponse', () => {
  it('maps _id to id and drops __v', () => {
    expect(normalizeResponse({ _id: 'abc', __v: 0, name: 'x' })).toEqual({ id: 'abc', name: 'x' });
  });

  it('recurses into arrays and nested documents', () => {
    expect(
      normalizeResponse({ items: [{ _id: 'a', __v: 1 }], sub: { _id: 'b', title: 't' } }),
    ).toEqual({ items: [{ id: 'a' }], sub: { id: 'b', title: 't' } });
  });

  it('collapses a duplicate _id when a clean id is already present (additive responses)', () => {
    expect(normalizeResponse({ id: 'e1', _id: 'e1', __v: 0, name: 'x' })).toEqual({ id: 'e1', name: 'x' });
  });

  it('leaves already-clean objects unchanged', () => {
    expect(normalizeResponse({ id: 'e1', status: 'sent' })).toEqual({ id: 'e1', status: 'sent' });
  });

  it('passes primitives through', () => {
    expect(normalizeResponse(null)).toBe(null);
    expect(normalizeResponse('x')).toBe('x');
    expect(normalizeResponse(7)).toBe(7);
  });
});
