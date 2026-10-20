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

export type JobForm = { url: string; company: string; role: string };
export type JobFormErrors = Partial<Record<keyof JobForm, string>>;

/** Validates the add-job form. `isDuplicate` checks whether the link is already saved. */
export function validateJob(form: JobForm, isDuplicate: (url: string) => boolean): JobFormErrors {
  const errors: JobFormErrors = {};
  const linkError = validateLink(form.url);
  if (linkError) errors.url = linkError;
  else if (isDuplicate(form.url)) errors.url = "You already added this link. Find it in Applications.";
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
