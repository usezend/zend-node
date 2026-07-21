const snakeKey = (k: string): string => k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`);
const camelKey = (k: string): string => k.replace(/_([a-z0-9])/g, (_, c: string) => c.toUpperCase());

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v);

export function toSnakeCase(value: unknown, passThrough: string[] = []): unknown {
  if (Array.isArray(value)) return value.map((v) => toSnakeCase(v, passThrough));
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      out[snakeKey(k)] = passThrough.includes(k) ? v : toSnakeCase(v, passThrough);
    }
    return out;
  }
  return value;
}

export function toCamelCase(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((v) => toCamelCase(v));
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) out[camelKey(k)] = toCamelCase(v);
    return out;
  }
  return value;
}
