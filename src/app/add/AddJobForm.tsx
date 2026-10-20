"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button, ButtonLink } from "@/components/Button";
import { Field } from "@/components/Field";
import { Input } from "@/components/Input";
import { addApplication, hasLink } from "@/lib/store";
import { validateJob, type JobForm, type JobFormErrors } from "@/lib/validate";

const FIELD_ORDER: (keyof JobForm)[] = ["url", "company", "role"];

export function AddJobForm() {
  const router = useRouter();
  const pastedLink = useSearchParams().get("url") ?? "";
  const [form, setForm] = useState<JobForm>({ url: pastedLink, company: "", role: "" });
  const [errors, setErrors] = useState<JobFormErrors>({});

  function update(key: keyof JobForm, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    // Clear a field's error once the person starts fixing it.
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateJob(form, hasLink);
    setErrors(found);

    const firstInvalid = FIELD_ORDER.find((key) => found[key]);
    if (firstInvalid) {
      // Keep everything typed; move focus to the first field that needs attention.
      (e.currentTarget.elements.namedItem(firstInvalid) as HTMLInputElement | null)?.focus();
      return;
    }

    const saved = addApplication(form);
    router.push(`/applications?added=${saved.id}`);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <Field label="Job link" error={errors.url}>
        <Input
          name="url"
          type="url"
          inputMode="url"
          autoComplete="off"
          autoFocus={!pastedLink}
          value={form.url}
          onChange={(e) => update("url", e.target.value)}
        />
      </Field>
      <Field label="Company" error={errors.company}>
        <Input
          name="company"
          autoComplete="organization"
          autoFocus={!!pastedLink}
          value={form.company}
          onChange={(e) => update("company", e.target.value)}
        />
      </Field>
      <Field label="Role" error={errors.role}>
        <Input
          name="role"
          autoComplete="organization-title"
          value={form.role}
          onChange={(e) => update("role", e.target.value)}
        />
      </Field>
      <div className="flex items-center gap-3 pt-2">
        <Button type="submit">Add to applications</Button>
        <ButtonLink href="/applications" variant="quiet">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
