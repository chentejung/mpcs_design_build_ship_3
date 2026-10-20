import { ButtonLink } from "@/components/Button";

// Placeholder: the add form is built in step 5.
export default function AddPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-serif text-4xl font-semibold">Add a job</h1>
      <p className="text-muted">The form arrives in the next step.</p>
      <ButtonLink href="/" variant="secondary" className="self-start">
        Back to home
      </ButtonLink>
    </div>
  );
}
