"use client";

import { useState, type FormEvent } from "react";
import { setWeeklyGoal } from "@/lib/store";
import { MAX_GOAL, validateGoal } from "@/lib/validate";
import { Button } from "./Button";
import { Field } from "./Field";
import { Input } from "./Input";

export function WeeklyGoal({ done, goal }: { done: number; goal: number }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(String(goal));
  const [error, setError] = useState<string | null>(null);
  const met = done >= goal;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const problem = validateGoal(value);
    setError(problem);
    if (problem) return;
    setWeeklyGoal(Number(value.trim()));
    setEditing(false);
  }

  return (
    <section aria-labelledby="goal-heading" className="flex flex-col gap-3 border-y border-line py-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="goal-heading" className="font-serif text-lg">
          This week: <strong>{done}</strong> of {goal} applications
        </h2>
        {!editing && (
          <Button
            variant="quiet"
            onClick={() => {
              setValue(String(goal));
              setEditing(true);
            }}
          >
            Change goal
          </Button>
        )}
      </div>
      <div
        role="progressbar"
        aria-label="Weekly goal progress"
        aria-valuemin={0}
        aria-valuemax={goal}
        aria-valuenow={Math.min(done, goal)}
        className="h-2 overflow-hidden rounded-full bg-line"
      >
        <div className="h-full bg-accent" style={{ width: `${Math.min(100, (done / goal) * 100)}%` }} />
      </div>
      <p className="text-sm text-muted">
        {met ? "Goal met. Nice work this week." : `${goal - done} to go. The count resets every Monday.`}
      </p>

      {editing && (
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 pt-2">
          <Field label="Applications per week" hint={`A number from 1 to ${MAX_GOAL}.`} error={error}>
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              max={MAX_GOAL}
              autoFocus
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError(null);
              }}
              className="max-w-32"
            />
          </Field>
          <div className="flex items-center gap-3">
            <Button type="submit">Save goal</Button>
            <Button type="button" variant="quiet" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
