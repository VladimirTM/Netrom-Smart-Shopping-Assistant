export function placeholderImage(text: string): string {
  const label = text.length > 24 ? text.substring(0, 24) + "…" : text;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="#eeeeee"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999999" font-size="16" font-family="sans-serif">${label}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
