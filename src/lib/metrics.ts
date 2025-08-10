import type { Sidekick } from "../types/sidekick";

export function pickTopRoles(s: Sidekick, limit = 3): { role: string; value: number }[] {
  const entries = Object.entries(s.role_strength || {})
    .filter(([, v]) => typeof v === "number" && v > 0)
    .sort((a, b) => (b[1] as number) - (a[1] as number))
    .slice(0, limit)
    .map(([role, value]) => ({ role, value: value as number }));
  return entries;
}

export function indexFrom(s: Sidekick, keys: (keyof NonNullable<Sidekick["role_strength"]>)[]): number {
  let sum = 0;
  for (const k of keys) {
    // @ts-ignore
    sum += (s.role_strength?.[k] ?? 0);
  }
  return sum;
}
