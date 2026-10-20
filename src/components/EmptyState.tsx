import type { ReactNode } from "react";

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-3 rounded-lg border border-dashed border-line px-6 py-8">
      <h2 className="font-serif text-2xl font-semibold">{title}</h2>
      <p className="text-muted">{body}</p>
      {action}
    </div>
  );
}
