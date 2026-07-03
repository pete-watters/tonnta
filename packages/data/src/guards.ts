/** Runtime type guards — API responses are untrusted; no casts. */

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number');
}

export function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/** Numeric or null — ERDDAP emits nulls for missing readings. */
export function isNullableNumberArray(value: unknown): value is (number | null)[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number' || item === null);
}

export function asFiniteNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}
