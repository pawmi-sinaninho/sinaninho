export function arrayFromParam(value: string | string[] | null): string[] {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value.flatMap(v => v.split(",")).map(v => v.trim()).filter(Boolean);
  }
  return value.split(",").map(v => v.trim()).filter(Boolean);
}

export function toQuery(params: Record<string, string | string[] | undefined>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (!v) continue;
    if (Array.isArray(v)) {
      if (v.length) usp.set(k, v.join(","));
    } else if (v) {
      usp.set(k, v);
    }
  }
  const s = usp.toString();
  return s ? `?${s}` : "";
}
