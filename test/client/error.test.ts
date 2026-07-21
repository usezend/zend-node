import { describe, it, expect } from 'vitest';
import { ZendError } from '../../src/client/error';

describe('ZendError', () => {
  it('is an Error with the given fields', () => {
    const e = new ZendError({ message: 'nope', name: 'validation_error', statusCode: 422, code: 'bad' });
    expect(e).toBeInstanceOf(Error);
    expect(e).toBeInstanceOf(ZendError);
    expect(e.message).toBe('nope');
    expect(e.name).toBe('validation_error');
    expect(e.statusCode).toBe(422);
    expect(e.code).toBe('bad');
  });

  it('defaults name to ZendError', () => {
    expect(new ZendError({ message: 'x' }).name).toBe('ZendError');
  });
});
