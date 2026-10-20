<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


# Job Application Tracker (MPCS 51238 Assignment 3)

A small tool for anyone job hunting: paste a job link, type the company and role, and track each application's status. See `flows.md` for the user flows.

## Constraints
- Next.js (App Router) + Tailwind CSS only. Data lives in the browser via `localStorage`.
- No database, backend, accounts, external APIs, or link scraping. Don't add packages unless clearly needed — ask first.
- Deploys to Vercel's free Hobby plan.

## Design rules
- One route per flow step: `/` (first visit / welcome back), `/add` (form), `/applications` (list). Shared navigation on every page with the current page indicated.
- Shared components (Button, Input, Field with label + error, Select) used consistently everywhere.
- Forms: one column, a real `<label>` on every field, errors next to the field that say what to do next ("Enter the company name", not "Invalid input"), and keep what the person typed when there's an error.
- No dead-end empty screens. Everything works by keyboard; check text contrast.
- Keep it simple: remove unnecessary steps, fields, and interactions.
- Work step by step with the user; this assignment must not be one-shot.
