export function withFallback(src?: string) {
  return src && /^https?:\/\//.test(src) ? src : "/no-image.png";
}
