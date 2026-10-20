"use client";

import { ApplicationRow } from "@/components/ApplicationRow";
import { ButtonLink } from "@/components/Button";
import { WeeklyGoal } from "@/components/WeeklyGoal";
import { plural, timeAgo } from "@/lib/format";
import { countThisWeek, useTracker, type TrackerState } from "@/lib/store";
import { Onboarding } from "./Onboarding";

export default function Home() {
  const tracker = useTracker();
  if (!tracker) return null; // Not hydrated yet; avoids flashing the wrong view.

  return tracker.applications.length > 0 ? <WelcomeBack tracker={tracker} /> : <Onboarding />;
}

function WelcomeBack({ tracker }: { tracker: TrackerState }) {
  const all = tracker.applications;
  const interviewing = all.filter((a) => a.status === "Interviewing").length;
  const offers = all.filter((a) => a.status === "Offer").length;
  const latest = all.reduce((a, b) => (a.createdAt > b.createdAt ? a : b));
  const recent = [...all].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 3);

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-6">
        <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          Welcome back.
        </h1>

        <div className="rounded-lg border-l-4 border-accent bg-card px-5 py-4">
          <p className="font-serif text-2xl leading-snug text-ink">
            <Count n={all.length} word="application" /> · <Count n={interviewing} word="interviewing" fixed /> ·{" "}
            <Count n={offers} word="offer" />
          </p>
          <p className="mt-1 text-lg text-ink">
            Last added: <strong className="font-semibold text-accent">{latest.company}</strong>, {timeAgo(latest.createdAt)}
          </p>
        </div>

        <ButtonLink href="/add" className="self-start px-6 py-3 text-base">
          + Add an application
        </ButtonLink>
      </section>

      <WeeklyGoal done={countThisWeek(all)} goal={tracker.weeklyGoal} />

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
          {all.length === 1 ? "See it in Applications" : `See all ${all.length} applications`}
        </ButtonLink>
      </section>
    </div>
  );
}

/** A count with its number emphasized, e.g. "**3** applications". */
function Count({ n, word, fixed = false }: { n: number; word: string; fixed?: boolean }) {
  const [num, ...rest] = (fixed ? `${n} ${word}` : plural(n, word)).split(" ");
  return (
    <span className="whitespace-nowrap">
      <strong className="font-semibold text-accent">{num}</strong> {rest.join(" ")}
    </span>
  );
}
