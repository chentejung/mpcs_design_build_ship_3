"use client";

import { setStatus, type Application } from "@/lib/store";
import { StatusSelect } from "./StatusSelect";

export function ApplicationRow({ application }: { application: Application }) {
  const { id, company, role, url, status, example } = application;

  return (
    <li className="flex items-center justify-between gap-4 rounded-lg border border-line bg-card px-4 py-3">
      <div className="min-w-0">
        {example && (
          <span className="mb-1 inline-block rounded-sm bg-paper px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted">
            Example
          </span>
        )}
        <p className="truncate font-serif text-lg leading-tight">{company}</p>
        <p className="truncate text-sm text-muted">
          {example ? (
            role
          ) : (
            <a href={url} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-ink">
              {role}
              <span className="sr-only"> (opens job posting in a new tab)</span>
            </a>
          )}
        </p>
      </div>
      <StatusSelect
        value={status}
        onChange={(next) => setStatus(id, next)}
        label={`Status for ${company}, ${role}`}
      />
    </li>
  );
}
