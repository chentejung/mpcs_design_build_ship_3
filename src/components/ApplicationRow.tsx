"use client";

import { timeAgo } from "@/lib/format";
import { deleteApplication, setStatus, type Application } from "@/lib/store";
import { Button } from "./Button";
import { StatusSelect } from "./StatusSelect";

export function ApplicationRow({ application, highlight = false }: { application: Application; highlight?: boolean }) {
  const { id, company, role, url, status, example, createdAt } = application;

  return (
    <li
      id={`application-${id}`}
      className={`flex items-center justify-between gap-4 rounded-lg border bg-card px-4 py-3 ${
        highlight ? "border-accent ring-1 ring-accent" : "border-line"
      }`}
    >
      <div className="min-w-0">
        {example && (
          <span className="mb-1 inline-block rounded-sm bg-paper px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Example
          </span>
        )}
        <p className="break-words font-serif text-lg leading-tight">{company}</p>
        <p className="break-words text-sm text-muted">
          {example ? (
            role
          ) : (
            <a href={url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
              {role}
              <span className="sr-only"> (opens job posting in a new tab)</span>
            </a>
          )}
        </p>
        {!example && <p className="mt-0.5 text-xs text-muted">Added {timeAgo(createdAt)}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <StatusSelect
          value={status}
          onChange={(next) => setStatus(id, next)}
          label={`Status for ${company}, ${role}`}
        />
        {!example && (
          <Button variant="quiet" className="px-2" aria-label={`Delete ${company}, ${role}`} onClick={() => deleteApplication(id)}>
            Delete
          </Button>
        )}
      </div>
    </li>
  );
}
