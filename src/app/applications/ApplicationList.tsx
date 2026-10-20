"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ApplicationRow } from "@/components/ApplicationRow";
import { Button, ButtonLink } from "@/components/Button";
import { EmptyState } from "@/components/EmptyState";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { plural } from "@/lib/format";
import { STATUSES, useTracker, type Status } from "@/lib/store";

type Filter = "All" | Status;
const FILTERS: Filter[] = ["All", ...STATUSES];

export function ApplicationList() {
  const tracker = useTracker();
  const searchParams = useSearchParams();
  const bannerRef = useRef<HTMLParagraphElement>(null);
  // "added" is the job just saved; "show" comes from the duplicate-link error and points at the saved job.
  // Keep them in state so they survive dropping the params from the URL (a refresh shouldn't repeat the banner).
  const [addedId, setAddedId] = useState(() => searchParams.get("added"));
  const [showId, setShowId] = useState(() => searchParams.get("show"));
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  // Next.js keeps this page alive between visits, so pick up new params on every arrival.
  const addedParam = searchParams.get("added");
  const showParam = searchParams.get("show");
  if (addedParam && addedParam !== addedId) setAddedId(addedParam);
  if (showParam && showParam !== showId) setShowId(showParam);

  useEffect(() => {
    if (addedParam || showParam) window.history.replaceState(null, "", "/applications");
  }, [addedParam, showParam]);

  // Clear the one-time banner, highlight, and search when the page is hidden, so they don't reappear stale
  // (a leftover search could hide the job you just added).
  useLayoutEffect(
    () => () => {
      setAddedId(null);
      setShowId(null);
      setQuery("");
    },
    [],
  );

  const hydrated = tracker !== null;
  useEffect(() => {
    // Move focus to the confirmation so keyboard and screen reader users know the save worked.
    if (hydrated && addedId) bannerRef.current?.focus();
  }, [hydrated, addedId]);

  useEffect(() => {
    if (showId) document.getElementById(`application-${showId}`)?.scrollIntoView({ block: "center" });
  }, [showId]);

  if (!tracker) return null; // Not hydrated yet; avoids flashing an empty state.

  const all = tracker.applications;
  const added = addedId ? all.find((a) => a.id === addedId) : undefined;
  const q = query.trim().toLowerCase();
  const matching = q ? all.filter((a) => a.company.toLowerCase().includes(q)) : all;
  const shown = filter === "All" ? matching : matching.filter((a) => a.status === filter);

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
      <p ref={bannerRef} tabIndex={-1} role="status" className={added ? "rounded-md bg-ink px-4 py-3 text-sm font-medium text-paper" : "sr-only"}>
        {added ? `Added ${added.company} — ${added.role}` : ""}
      </p>

      <Field label="Search by company">
        <Input type="search" autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
      </Field>
      {/* Announce the result count while searching, so screen reader users hear the list change. */}
      <p role="status" className="sr-only">
        {q ? `${plural(shown.length, "application")} shown` : ""}
      </p>

      <fieldset>
        <legend className="sr-only">Show applications by status</legend>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const count = f === "All" ? matching.length : matching.filter((a) => a.status === f).length;
            const active = filter === f;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-3.5 py-1.5 text-sm ${
                  active ? "border-ink bg-ink text-paper" : "border-field bg-card text-ink hover:border-ink"
                }`}
              >
                {f} <span className={active ? "text-paper" : "text-muted"}>{count}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      {shown.length === 0 && q ? (
        <EmptyState
          title={`No companies match “${query.trim()}”${filter === "All" ? "" : ` in ${filter}`}`}
          body="Check the spelling, or clear the search to see everything."
          action={
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setQuery("")}>
                Clear search
              </Button>
              <ButtonLink href="/add">Add a job</ButtonLink>
            </div>
          }
        />
      ) : shown.length === 0 ? (
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
            <ApplicationRow key={a.id} application={a} highlight={a.id === addedId || a.id === showId} />
          ))}
        </ul>
      )}

    </div>
  );
}
