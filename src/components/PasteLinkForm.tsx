"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { hasLink } from "@/lib/store";
import { DUPLICATE_LINK, validateLink, withScheme } from "@/lib/validate";
import { Button } from "./Button";
import { Field } from "./Field";
import { Input } from "./Input";
import { LinkError } from "./LinkError";

/** Paste a job link, then finish adding it on /add with the link filled in. */
export function PasteLinkForm({ hint }: { hint?: string }) {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const url = withScheme(link);
    const problem = validateLink(url) ?? (hasLink(url) ? DUPLICATE_LINK : null);
    setError(problem);
    // Focus the field so its error is announced.
    if (problem) e.currentTarget.querySelector("input")?.focus();
    else router.push(`/add?url=${encodeURIComponent(url)}`);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <Field label="Job link" hint={hint} error={error && <LinkError error={error} link={link} />}>
        <Input
          type="url"
          inputMode="url"
          autoComplete="off"
          value={link}
          onChange={(e) => {
            setLink(e.target.value);
            if (error) setError(null);
          }}
        />
      </Field>
      <Button type="submit" className="self-start">
        Add this job
      </Button>
    </form>
  );
}
