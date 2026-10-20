"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { ApplicationRow } from "@/components/ApplicationRow";
import { Button } from "@/components/Button";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { clearExamples, countThisWeek, useTracker } from "@/lib/store";
import { validateLink } from "@/lib/validate";

export default function Home() {
  const tracker = useTracker();
  const router = useRouter();
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const problem = validateLink(link);
    setError(problem);
    if (!problem) router.push(`/add?url=${encodeURIComponent(link.trim())}`);
  }

  const examples = tracker?.applications.filter((a) => a.example) ?? [];
  const thisWeek = tracker ? countThisWeek(tracker.applications) : 0;

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Track every job you apply to.
        </h1>
        <p className="mt-3 text-lg text-muted">Saved on this device. No sign-up.</p>
      </section>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
        <Field label="Job link" hint="Paste the link to a job posting to add it." error={error}>
          <Input
            type="url"
            inputMode="url"
            autoComplete="off"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </Field>
        <Button type="submit" className="self-start">
          Add this job
        </Button>
      </form>

      {tracker && (
        <p className="border-y border-line py-4 font-serif text-lg">
          This week: <strong>{thisWeek}</strong> of {tracker.weeklyGoal} applications
        </p>
      )}

      {examples.length > 0 && (
        <section aria-labelledby="examples-heading" className="flex flex-col gap-3">
          <h2 id="examples-heading" className="font-serif text-2xl font-semibold">
            Here&rsquo;s how it looks
          </h2>
          <p className="text-muted">Try changing a status. Your choice is saved right away.</p>
          <ul className="flex flex-col gap-2">
            {examples.map((a) => (
              <ApplicationRow key={a.id} application={a} />
            ))}
          </ul>
          <Button variant="quiet" className="self-end" onClick={clearExamples}>
            Clear examples
          </Button>
        </section>
      )}
    </div>
  );
}
