"use client";

import { useSyncExternalStore } from "react";

export const STATUSES = ["Applied", "Interviewing", "Offer", "Rejected"] as const;
export type Status = (typeof STATUSES)[number];

export type Application = {
  id: string;
  url: string;
  company: string;
  role: string;
  status: Status;
  createdAt: string; // ISO date
  example?: boolean;
};

export type TrackerState = {
  applications: Application[];
  weeklyGoal: number;
};

const STORAGE_KEY = "job-tracker:v1";

const EXAMPLES: Application[] = [
  {
    id: "example-1",
    url: "https://example.com/jobs/acme-designer",
    company: "Acme Co.",
    role: "Product Designer",
    status: "Applied",
    createdAt: "2026-01-01T00:00:00.000Z",
    example: true,
  },
  {
    id: "example-2",
    url: "https://example.com/jobs/globex-pm",
    company: "Globex",
    role: "Product Manager",
    status: "Interviewing",
    createdAt: "2026-01-01T00:00:00.000Z",
    example: true,
  },
  {
    id: "example-3",
    url: "https://example.com/jobs/initech-engineer",
    company: "Initech",
    role: "Software Engineer",
    status: "Offer",
    createdAt: "2026-01-01T00:00:00.000Z",
    example: true,
  },
];

const DEFAULT_STATE: TrackerState = { applications: EXAMPLES, weeklyGoal: 5 };

// Cache the parsed snapshot so useSyncExternalStore gets a stable reference.
let cachedRaw: string | null | undefined;
let cachedState: TrackerState = DEFAULT_STATE;
const listeners = new Set<() => void>();

function read(): TrackerState {
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    // Storage unavailable (e.g. privacy mode): fall back to defaults.
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedState = raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
    } catch {
      cachedState = DEFAULT_STATE;
    }
  }
  return cachedState;
}

function write(next: TrackerState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota/availability errors; the UI still updates for this session.
    cachedRaw = undefined;
    cachedState = next;
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/** Saved tracker state, or `null` during server render / before hydration. */
export function useTracker(): TrackerState | null {
  return useSyncExternalStore(subscribe, read, () => null);
}

export function setStatus(id: string, status: Status) {
  const state = read();
  write({
    ...state,
    applications: state.applications.map((a) => (a.id === id ? { ...a, status } : a)),
  });
}

export function clearExamples() {
  const state = read();
  write({ ...state, applications: state.applications.filter((a) => !a.example) });
}

/** Real (non-example) applications added since Monday 00:00 local time. */
export function countThisWeek(applications: Application[], now = new Date()) {
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return applications.filter((a) => !a.example && new Date(a.createdAt) >= monday).length;
}

/** Compare links loosely: ignore case of the host, trailing slashes, and #fragments. */
export function normalizeLink(link: string) {
  try {
    const url = new URL(link.trim());
    url.hash = "";
    return `${url.hostname.toLowerCase()}${url.pathname.replace(/\/+$/, "")}${url.search}`;
  } catch {
    return link.trim().toLowerCase();
  }
}

export function hasLink(link: string) {
  const target = normalizeLink(link);
  return read().applications.some((a) => !a.example && normalizeLink(a.url) === target);
}

export function addApplication(input: { url: string; company: string; role: string }): Application {
  const state = read();
  const application: Application = {
    id: crypto.randomUUID(),
    url: input.url.trim(),
    company: input.company.trim(),
    role: input.role.trim(),
    status: "Applied",
    createdAt: new Date().toISOString(),
  };
  write({ ...state, applications: [application, ...state.applications] });
  return application;
}

export function setWeeklyGoal(goal: number) {
  write({ ...read(), weeklyGoal: goal });
}
