// Security-first sanitization helpers.
// We intentionally keep it conservative and deterministic.

export function escapeHtml(str: string): string {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '<')
    .replaceAll('>', '>')
    .replaceAll('"', '"')
    .replaceAll("'", '&#39;');
}

const dangerousHtmlPattern = /<\s*\/?\s*(script|style|iframe|object|embed|link|meta|svg|math)\b[^>]*>/gi;

export function removeDangerousHtml(input: string): string {
  // Remove script/style and other high-risk tags entirely.
  return input.replace(dangerousHtmlPattern, '');
}

// Basic unsafe character filtering.
// We do not try to be perfect; we aim to prevent common injection patterns.
export function filterUnsafeCharacters(input: string): string {
  // Remove null bytes and control characters except common whitespace.
  return input.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
}

export function sanitizeContactField(fieldValue: string): string {
  // 1) Trim
  let v = fieldValue.trim();
  // 2) Remove dangerous HTML tags
  v = removeDangerousHtml(v);
  // 3) Filter control chars
  v = filterUnsafeCharacters(v);
  // 4) Escape remaining HTML brackets to reduce XSS risk if stored/rendered later
  v = escapeHtml(v);
  return v;
}

