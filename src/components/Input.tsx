import type { ComponentProps } from "react";

export function Input({ className = "", ...props }: ComponentProps<"input">) {
  return (
    <input
      className={`w-full rounded-md border bg-card px-3 py-2.5 text-base text-ink placeholder:text-muted aria-invalid:border-error aria-invalid:ring-1 aria-invalid:ring-error border-line ${className}`}
      {...props}
    />
  );
}
