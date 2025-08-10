// src/utils/img.ts
/**
 * Liefert eine Bild-URL für einen Companion.
 * - Wenn eine explizite URL vorhanden ist, nutze sie.
 * - sonst versuche /images/companions/{id}.png
 * - sonst /no-image.png
 */
export function withFallback(src?: string, id?: number): string {
  if (src && src.trim().length > 0) return src;
  if (typeof id === 'number') return `/images/companions/${id}.png`;
  return '/no-image.png';
}
