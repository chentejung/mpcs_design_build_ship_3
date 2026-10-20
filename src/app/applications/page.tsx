import { ButtonLink } from "@/components/Button";

// Placeholder: the full list is built in step 5.
export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-serif text-4xl font-semibold">Applications</h1>
      <p className="text-muted">Your full list arrives in the next step.</p>
      <ButtonLink href="/" variant="secondary" className="self-start">
        Back to home
      </ButtonLink>
    </div>
  );
}
