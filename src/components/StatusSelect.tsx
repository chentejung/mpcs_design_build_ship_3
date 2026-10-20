"use client";

import { STATUSES, type Status } from "@/lib/store";

export function StatusSelect({
  value,
  onChange,
  label,
}: {
  value: Status;
  onChange: (status: Status) => void;
  /** Accessible name, e.g. "Status for Acme Co., Product Designer". */
  label: string;
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value as Status)}
      className="rounded-md border border-field bg-card px-2.5 py-2 text-sm font-medium text-ink"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
