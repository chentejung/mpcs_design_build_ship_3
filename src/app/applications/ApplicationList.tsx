"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ApplicationRow } from "@/components/ApplicationRow";
import { Button, ButtonLink } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { STATUSES, clearExamples, useTracker, type Status } from "@/lib/store";

type Filter = "All" | Status;
const FILTERS: Filter[] = ["All", ...STATUSES];

export function ApplicationList() {
  const tracker = useTracker();
  const addedId = useSearchParams().get("added");
  const [filter, setFilter] = useState<Filter>("All");

  if (!tracker) return null; // Not hydrated yet; avoids flashing an empty state.

  const all = tracker.applications;
  const added = addedId ? all.find((a) => a.id === addedId) : undefined;
  const shown = filter === "All" ? all : all.filter((a) => a.status === filter);
  const hasExamples = all.some((a) => a.example);

  if (all.length === 0) {
    return (
      <EmptyState
        title="No applications yet"
        body="Paste a job link to add your first one. It'll stay saved on this device."
        action={<ButtonLink href="/add">Add a job</ButtonLink>}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <p role="status" className={added ? "rounded-md bg-ink px-4 py-3 text-sm font-medium text-paper" : "sr-only"}>
        {added ? `Added ${added.company} — ${added.role}` : ""}
      </p>

      <fieldset>
        <legend className="sr-only">Show applications by status</legend>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count = f === "All" ? all.length : all.filter((a) => a.status === f).length;
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 text-sm ${
                  active ? "border-ink bg-ink text-paper" : "border-line bg-card text-ink hover:border-ink"
                }`}
              >
                {f} <span className={active ? "text-paper" : "text-muted"}>{count}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {shown.length === 0 ? (
        <EmptyState
          title={`No applications marked ${filter}`}
          body="Change a status from the All view, or add a new job."
          action={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setFilter("All")}>
                Show all
              </Button>
              <ButtonLink href="/add">Add a job</ButtonLink>
            </div>
          }
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {shown.map((a) => (
            <ApplicationRow key={a.id} application={a} highlight={a.id === addedId} />
          ))}
        </ul>
      )}

      {hasExamples && (
        <Button variant="quiet" className="self-end" onClick={clearExamples}>
          Clear examples
        </Button>
      )}
    </div>
  );
}
