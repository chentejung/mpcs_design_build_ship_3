"use client";

import { useEffect } from "react";
import { dismissUndo, undoDelete, useLastDeleted } from "@/lib/store";
import { Button } from "./Button";

/** After a delete, offers Undo for a few seconds. */
export function UndoBar() {
  const deleted = useLastDeleted();

  useEffect(() => {
    if (!deleted) return;
    const timer = setTimeout(dismissUndo, 8000);
    return () => clearTimeout(timer);
  }, [deleted]);

  return (
    <div role="status" className="fixed inset-x-0 bottom-6 flex justify-center px-5">
      {deleted && (
        <div className="flex items-center gap-4 rounded-md bg-ink py-2 pl-4 pr-2 text-sm text-paper shadow-lg">
          <span>
            Deleted {deleted.company} — {deleted.role}
          </span>
          <Button variant="secondary" className="border-paper py-1.5 text-paper hover:bg-accent-ink" onClick={undoDelete}>
            Undo
          </Button>
        </div>
      )}
    </div>
  );
}
