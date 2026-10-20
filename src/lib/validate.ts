/** Returns an error message for a job link, or null if it's valid. */
export function validateLink(value: string): string | null {
  const link = value.trim();
  if (!link) return "Paste a job link";
  try {
    const url = new URL(link);
    if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error();
    if (!url.hostname.includes(".")) throw new Error();
  } catch {
    return "Paste a full link starting with https://";
  }
  return null;
}
