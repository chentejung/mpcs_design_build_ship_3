/** Adds https:// when someone pastes a bare address like "stripe.com/jobs/123". */
export function withScheme(value: string) {
  const link = value.trim();
  if (!link || /^[a-z][a-z0-9+.-]*:\/\//i.test(link)) return link;
  return /^[^\s/]+\.[^\s/]+/.test(link) ? `https://${link}` : link;
}

/** Returns an error message for a job link, or null if it's valid. */
export function validateLink(value: string): string | null {
  const link = withScheme(value);
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

export const DUPLICATE_LINK = "You already added this link.";

export type JobForm = { url: string; company: string; role: string };
export type JobFormErrors = Partial<Record<keyof JobForm, string>>;

/** Validates the add-job form. `isDuplicate` checks whether the link is already saved. */
export function validateJob(form: JobForm, isDuplicate: (url: string) => boolean): JobFormErrors {
  const errors: JobFormErrors = {};
  const linkError = validateLink(form.url);
  if (linkError) errors.url = linkError;
  else if (isDuplicate(withScheme(form.url))) errors.url = DUPLICATE_LINK;
  if (!form.company.trim()) errors.company = "Enter the company name";
  if (!form.role.trim()) errors.role = "Enter the role";
  return errors;
}

export const MAX_GOAL = 50;

/** Returns an error message for the weekly goal, or null if it's a whole number 1–50. */
export function validateGoal(value: string): string | null {
  const n = Number(value.trim());
  if (!value.trim() || !Number.isInteger(n) || n < 1 || n > MAX_GOAL) {
    return `Enter a whole number from 1 to ${MAX_GOAL}`;
  }
  return null;
}
