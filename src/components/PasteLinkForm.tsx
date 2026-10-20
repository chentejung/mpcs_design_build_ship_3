"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { validateLink } from "@/lib/validate";
import { Button } from "./Button";
import { Field } from "./Field";
import { Input } from "./Input";

/** Paste a job link, then finish adding it on /add with the link filled in. */
export function PasteLinkForm({ hint }: { hint?: string }) {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const problem = validateLink(link);
    setError(problem);
    if (!problem) router.push(`/add?url=${encodeURIComponent(link.trim())}`);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3">
      <Field label="Job link" hint={hint} error={error}>
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
