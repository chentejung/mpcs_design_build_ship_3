"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, type FocusEvent, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { LinkError } from "@/components/LinkError";
import { completeOnboarding, hasLink } from "@/lib/store";
import { validateGoal, validateJob, validateLink, withScheme, type JobForm, type JobFormErrors } from "@/lib/validate";

const JOB_FIELDS: (keyof JobForm)[] = ["url", "company", "role"];

/**
 * First visit: two short steps, then "Add".
 * Step 1 folds up on its own once all three fields are filled in correctly
 * and focus moves on (Tab, click elsewhere, or Enter).
 */
export function Onboarding() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [job, setJob] = useState<JobForm>({ url: "", company: "", role: "" });
  const [jobErrors, setJobErrors] = useState<JobFormErrors>({});
  const [jobDone, setJobDone] = useState(false);
  const [goal, setGoal] = useState("");
  const [goalError, setGoalError] = useState<string | null>(null);

  const jobValid = Object.keys(validateJob(job, hasLink)).length === 0;
  const goalValid = validateGoal(goal) === null;
  const ready = jobDone && goalValid;

  function focusField(name: string) {
    (formRef.current?.elements.namedItem(name) as HTMLInputElement | null)?.focus();
  }

  function updateJob(key: keyof JobForm, value: string) {
    setJob((j) => ({ ...j, [key]: value }));
    if (jobErrors[key]) setJobErrors((e) => ({ ...e, [key]: undefined }));
  }

  /** Validates step 1; folds it up if everything is correct. Returns whether it's done. */
  function finishJobStep({ showEmpty }: { showEmpty: boolean }) {
    const found = validateJob(job, hasLink);
    if (Object.keys(found).length === 0) {
      setJobErrors({});
      setJobDone(true);
      return true;
    }
    const touched = JOB_FIELDS.some((key) => job[key].trim());
    if (showEmpty || touched) setJobErrors(found);
    return false;
  }

  function onJobStepBlur(e: FocusEvent<HTMLFieldSetElement>) {
    // Only act when focus leaves step 1 entirely, not when tabbing between its fields.
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    finishJobStep({ showEmpty: false });
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Enter moves through the steps: finish step 1, then the goal, then Add.
    if (!jobDone) {
      if (finishJobStep({ showEmpty: true })) focusField("goal");
      else focusField(JOB_FIELDS.find((key) => validateJob(job, hasLink)[key]) ?? "url");
      return;
    }
    const problem = validateGoal(goal);
    setGoalError(problem);
    if (problem) {
      focusField("goal");
      return;
    }
    const saved = completeOnboarding({ ...job, url: withScheme(job.url) }, Number(goal.trim()));
    router.push(`/applications?added=${saved.id}`);
  }

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Track every job you apply to.
        </h1>
        <p className="mt-3 text-lg text-muted">Saved on this device. No sign-up. Two quick steps to start.</p>
      </section>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        // Until the Add button appears there's no submit button, so browsers won't submit on Enter.
        // Handle Enter here so it always moves to the next step.
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
            e.preventDefault();
            e.currentTarget.requestSubmit();
          }
        }}
        noValidate
        className="flex flex-col gap-6"
      >
        <fieldset onBlur={jobDone ? undefined : onJobStepBlur} className="rounded-lg border border-line bg-card p-5 sm:p-6">
          <StepLegend n={1} done={jobDone}>
            Add your first application
          </StepLegend>

          {jobDone ? (
            <div className="clear-both pt-3 flex items-center justify-between gap-4">
              <p className="min-w-0 break-words">
                <span className="font-serif text-lg">{job.company.trim()}</span>
                <span className="text-muted"> — {job.role.trim()}</span>
              </p>
              <Button
                type="button"
                variant="quiet"
                aria-label="Edit your first application"
                onClick={() => {
                  setJobDone(false);
                  requestAnimationFrame(() => focusField("url"));
                }}
              >
                Edit
              </Button>
            </div>
          ) : (
            <div className="clear-both flex flex-col gap-5 pt-4">
              <p className="text-sm text-muted">Fill in all three. This step folds up once they look right.</p>
              <Field
                label="Job link"
                hint="Paste the link to the job posting."
                error={jobErrors.url && <LinkError error={jobErrors.url} link={job.url} />}
              >
                <Input
                  name="url"
                  type="url"
                  inputMode="url"
                  autoComplete="off"
                  value={job.url}
                  onChange={(e) => updateJob("url", e.target.value)}
                  onBlur={() => {
                    // Catch a malformed link right away, not just when leaving the step.
                    if (job.url.trim()) setJobErrors((errs) => ({ ...errs, url: validateLink(job.url) ?? undefined }));
                  }}
                />
              </Field>
              <Field label="Company" error={jobErrors.company}>
                <Input
                  name="company"
                  autoComplete="organization"
                  value={job.company}
                  onChange={(e) => updateJob("company", e.target.value)}
                />
              </Field>
              <Field label="Role" hint="The job title, e.g. Product Designer." error={jobErrors.role}>
                <Input
                  name="role"
                  autoComplete="organization-title"
                  value={job.role}
                  onChange={(e) => updateJob("role", e.target.value)}
                />
              </Field>
            </div>
          )}
        </fieldset>

        <fieldset className="rounded-lg border border-line bg-card p-5 sm:p-6">
          <StepLegend n={2} done={goalValid}>
            Set your weekly application goal
          </StepLegend>
          <div className="clear-both pt-4">
            <Field label="Applications per week" hint="How many jobs do you want to apply to each week?" error={goalError}>
              <Input
                name="goal"
                type="number"
                inputMode="numeric"
                min={1}
                value={goal}
                onChange={(e) => {
                  setGoal(e.target.value);
                  if (goalError) setGoalError(null);
                }}
                onBlur={() => {
                  if (goal.trim()) setGoalError(validateGoal(goal));
                }}
                className="max-w-40"
              />
            </Field>
          </div>
        </fieldset>

        <div aria-live="polite" className="flex flex-col items-start gap-3">
          {ready ? (
            <>
              <p className="font-serif text-lg">You&rsquo;re all set.</p>
              <Button type="submit" className="px-8 py-3 text-base">
                Add
              </Button>
            </>
          ) : (
            <p className="text-sm text-muted">
              {jobDone || jobValid ? "Now set your weekly goal" : "Finish both steps"} and an Add button will appear here.
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

function StepLegend({ n, done, children }: { n: number; done: boolean; children: ReactNode }) {
  return (
    <legend className="float-left flex w-full items-center gap-3">
      <span
        aria-hidden="true"
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-serif text-base font-semibold ${
          done ? "bg-accent text-paper" : "border border-ink text-ink"
        }`}
      >
        {done ? "✓" : n}
      </span>
      <span className="font-serif text-xl font-semibold sm:text-2xl">
        <span className="sr-only">Step {n}: </span>
        {children}
      </span>
      {done && <span className="sr-only">(done)</span>}
    </legend>
  );
}
