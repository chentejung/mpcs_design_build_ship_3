"use client";

import Link from "next/link";
import { findByLink } from "@/lib/store";
import { DUPLICATE_LINK, withScheme } from "@/lib/validate";

/** A link error; for duplicates, adds a link to the job that's already saved. */
export function LinkError({ error, link }: { error: string | null | undefined; link: string }) {
  if (!error) return null;
  if (error !== DUPLICATE_LINK) return <>{error}</>;
  const existing = findByLink(withScheme(link));
  return (
    <>
      {error}{" "}
      {existing && (
        <Link href={`/applications?show=${existing.id}`} className="underline underline-offset-2">
          See {existing.company} in Applications
        </Link>
      )}
    </>
  );
}
