import { Suspense } from "react";
import { AddJobForm } from "./AddJobForm";

export default function AddPage() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Add a job</h1>
        <p className="mt-2 text-muted">It starts as Applied. You can change the status any time.</p>
      </header>
      {/* useSearchParams (the pasted link) needs a Suspense boundary. */}
      <Suspense>
        <AddJobForm />
      </Suspense>
    </div>
  );
}
