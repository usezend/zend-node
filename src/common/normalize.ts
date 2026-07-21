// Normalize a successful API response body (before camelCasing): map MongoDB's
// `_id` to a clean `id` and drop the internal `__v` version key, recursively.
// This keeps the data the SDK returns clean even when an endpoint hands back a
// raw database document — callers always get `id`, never `_id`/`__v`. If a
// response already carries a clean `id`, it is preserved (an accompanying `_id`
// of the same value is simply collapsed away).

// Mirrors the plain-object check in ./case.ts: only true plain objects are
// walked, so Date/Map/class instances pass through untouched.
const isPlainObject = (v: unknown): v is Record<string, unknown> => {
  if (typeof v !== 'object' || v === null || Array.isArray(v)) return false;
  const proto = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null;
};

export function normalizeResponse(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((v) => normalizeResponse(v));
  if (isPlainObject(value)) {
    const out: Record<string, unknown> = {};
    for (const [key, v] of Object.entries(value)) {
      if (key === '__v') continue;
      if (key === '_id') {
        out.id = normalizeResponse(v);
        continue;
      }
      out[key] = normalizeResponse(v);
    }
    return out;
  }
  return value;
}
