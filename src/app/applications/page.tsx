import { Suspense } from "react";
import { ApplicationList } from "./ApplicationList";

export default function ApplicationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">Applications</h1>
      {/* useSearchParams (the "added" confirmation) needs a Suspense boundary. */}
      <Suspense>
        <ApplicationList />
      </Suspense>
    </div>
  );
}
