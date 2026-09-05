/** Keep untrusted business names as text when opened in spreadsheet software. */
export function escapeCsvCell(value: unknown): string {
  let text = String(value ?? "");
  let start = 0;
  while (start < text.length && (text.charCodeAt(start) <= 32 || /\s/.test(text[start]!))) start++;
  if (typeof value === "string" && /^[=+@-]/.test(text.slice(start))) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}
