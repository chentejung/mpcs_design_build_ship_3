"use client";

import { ApplicationRow } from "@/components/ApplicationRow";
import { Button, ButtonLink } from "@/components/Button";
import { PasteLinkForm } from "@/components/PasteLinkForm";
import { WeeklyGoal } from "@/components/WeeklyGoal";
import { clearExamples, countThisWeek, useTracker, type Application, type TrackerState } from "@/lib/store";

export default function Home() {
  const tracker = useTracker();
  if (!tracker) return null; // Not hydrated yet; avoids flashing the wrong view.

  const real = tracker.applications.filter((a) => !a.example);
  return real.length > 0 ? <WelcomeBack tracker={tracker} real={real} /> : <FirstVisit tracker={tracker} />;
}

function FirstVisit({ tracker }: { tracker: TrackerState }) {
  const examples = tracker.applications.filter((a) => a.example);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Track every job you apply to.
        </h1>
        <p className="mt-3 text-lg text-muted">Saved on this device. No sign-up.</p>
      </section>

      <PasteLinkForm hint="Paste the link to a job posting to add it." />

      <WeeklyGoal done={0} goal={tracker.weeklyGoal} />

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

function WelcomeBack({ tracker, real }: { tracker: TrackerState; real: Application[] }) {
  const interviewing = real.filter((a) => a.status === "Interviewing").length;
  const offers = real.filter((a) => a.status === "Offer").length;
  const latest = real.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
  const recent = [...real].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);

  return (
    <div className="flex flex-col gap-10">
      <section>
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Welcome back.
        </h1>
        <p className="mt-3 text-lg text-muted">
          {plural(real.length, "application")} · {interviewing} interviewing · {plural(offers, "offer")}
        </p>
        <p className="mt-1 text-muted">
          Last added: {latest.company}, {timeAgo(latest.createdAt)}
        </p>
      </section>

      <WeeklyGoal done={countThisWeek(real)} goal={tracker.weeklyGoal} />

      <PasteLinkForm hint="Applied somewhere new? Paste the link." />

      <section aria-labelledby="recent-heading" className="flex flex-col gap-3">
        <h2 id="recent-heading" className="font-serif text-2xl font-semibold">
          Most recent
        </h2>
        <ul className="flex flex-col gap-2">
          {recent.map((a) => (
            <ApplicationRow key={a.id} application={a} />
          ))}
        </ul>
        <ButtonLink href="/applications" variant="secondary" className="self-start">
          See all {real.length} applications
        </ButtonLink>
      </section>
    </div>
  );
}

function plural(n: number, word: string) {
  return `${n} ${word}${n === 1 ? "" : "s"}`;
}

function timeAgo(iso: string) {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
}
