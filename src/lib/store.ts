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
};

export type TrackerState = {
  applications: Application[];
  weeklyGoal: number;
};

const STORAGE_KEY = "job-tracker:v1";

const DEFAULT_STATE: TrackerState = { applications: [], weeklyGoal: 5 };

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
      const saved = raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
      // Earlier versions stored demo jobs flagged `example`; drop them.
      cachedState = {
        ...saved,
        applications: saved.applications.filter((a: Application & { example?: boolean }) => !a.example),
      };
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

/** Applications added since Monday 00:00 local time. */
export function countThisWeek(applications: Application[], now = new Date()) {
  const monday = new Date(now);
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  return applications.filter((a) => new Date(a.createdAt) >= monday).length;
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

/** The saved application with this link, if any. */
export function findByLink(link: string) {
  const target = normalizeLink(link);
  return read().applications.find((a) => normalizeLink(a.url) === target);
}

export function hasLink(link: string) {
  return !!findByLink(link);
}

function newApplication(input: { url: string; company: string; role: string }): Application {
  return {
    id: crypto.randomUUID(),
    url: input.url.trim(),
    company: input.company.trim(),
    role: input.role.trim(),
    status: "Applied",
    createdAt: new Date().toISOString(),
  };
}

export function addApplication(input: { url: string; company: string; role: string }): Application {
  const state = read();
  const application = newApplication(input);
  write({ ...state, applications: [application, ...state.applications] });
  return application;
}

/** Finishes onboarding: saves the first application and the weekly goal together. */
export function completeOnboarding(input: { url: string; company: string; role: string }, weeklyGoal: number) {
  const state = read();
  const application = newApplication(input);
  write({ ...state, weeklyGoal, applications: [application, ...state.applications] });
  return application;
}

export function setWeeklyGoal(goal: number) {
  write({ ...read(), weeklyGoal: goal });
}

// The most recently deleted application, kept in memory so it can be undone.
let lastDeleted: { application: Application; index: number } | null = null;

export function deleteApplication(id: string) {
  const state = read();
  const index = state.applications.findIndex((a) => a.id === id);
  if (index === -1) return;
  lastDeleted = { application: state.applications[index], index };
  write({ ...state, applications: state.applications.filter((a) => a.id !== id) });
}

export function undoDelete() {
  if (!lastDeleted) return;
  const { application, index } = lastDeleted;
  lastDeleted = null;
  const applications = [...read().applications];
  applications.splice(Math.min(index, applications.length), 0, application);
  write({ ...read(), applications });
}

export function dismissUndo() {
  lastDeleted = null;
  listeners.forEach((listener) => listener());
}

export function useLastDeleted(): Application | null {
  return useSyncExternalStore(
    subscribe,
    () => lastDeleted?.application ?? null,
    () => null,
  );
}
