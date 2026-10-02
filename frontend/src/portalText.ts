// The public portal is English-only. Formatting never reads or changes the
// separately preserved Docs/workbench language preference.
export function portalText<T>(value: T, params?: Record<string, unknown>): T {
  if (typeof value !== "string" || !params) return value;
  return value.replace(/\{(\w+)\}/g, (token, name) =>
    Object.hasOwn(params, name) ? String(params[name] ?? "") : token) as T;
}
