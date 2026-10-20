# Job Application Tracker

MPCS 51238 Design, Build, Ship · Assignment 3: Patterns & Flows

A small tool for anyone job hunting. Paste a job link, add the company and role, and keep track of where each application stands. Everything is saved in your browser (localStorage), so it's still there when you come back.

**Live:** https://mpcs-design-build-ship-3.vercel.app/

## Flows

**Main task:** I paste a job link and add the company and role → it's on my applications list as "Applied" → whenever I come back, all my applications are still there, with their latest status.

```mermaid
flowchart TD
    Start(["Open the app"]) --> Saved{"Anything saved<br/>on this device?"}

    %% 1. First visit
    Saved -- No --> First["/ First visit<br/>'Track every job you apply to'<br/>Paste-link field + 3 example applications"]
    First -- "Try an example:<br/>change its status" --> List
    List -- "Clear examples" --> ClearEx[("Remove examples<br/>from localStorage")]
    ClearEx --> List
    First -- "Paste a link" --> Form

    %% 2. The form and its errors
    Form["/add Form<br/>Job link · Company · Role"] --> Submit{"Valid?"}
    Submit -- "Company empty" --> ErrCompany["'Enter the company name'"]
    Submit -- "Role empty" --> ErrRole["'Enter the role'"]
    Submit -- "Link malformed" --> ErrLink["'Paste a full link starting with https://'"]
    Submit -- "Link already added" --> ErrDup["'You already added this link'"]
    ErrCompany & ErrRole & ErrLink & ErrDup -- "What you typed is kept" --> Form
    Submit -- Yes --> Save[("Save to localStorage<br/>status = Applied<br/>examples removed")]
    Save --> List

    %% 3. It's on my list
    List["/applications List<br/>'Added Stripe — Product Designer'"] --> Status["Change status<br/>Applied → Interviewing → Offer / Rejected"]
    Status --> SaveStatus[("Save to localStorage")]
    SaveStatus --> List
    List -- "Delete" --> Undo["'Deleted Stripe' + Undo"]
    Undo --> List
    List -- "Filter has no matches" --> Empty["Empty state<br/>'No applications here yet' + Add link"]
    Empty --> Form

    %% 4. Coming back
    Saved -- Yes --> Welcome["/ Welcome back<br/>'8 applications · 2 interviewing · 1 offer'<br/>This week: 3 of 5 applications<br/>Last added: Stripe, 3 days ago"]
    Welcome -- "Change weekly goal" --> Goal[("Save goal to localStorage")]
    Goal --> Welcome
    Welcome --> List
    Welcome --> Form
```

Full flow notes, states, and errors: [flows.md](flows.md)

## Onboarding research

Three subagents studied how similar tools welcome someone new (public pages, help centers, and reviews; no accounts created).

| | Huntr | Teal | Simplify |
|---|---|---|---|
| **First screen** | "Less Hassle, More Interviews" + sign-up; no demo | Resume-first landing; "Try a demo" on tracker page | "Your AI Job Search Partner"; dashboard of matches, goals, streaks |
| **What it asks for** | Account (reportedly LinkedIn + target job) | Account + goals survey (target title, timeline) | Account + resume/profile + job preferences |
| **Time to first saved job** | ~4 steps; must pick a board and list first | ~4 steps; tracker **pre-filled with sample jobs** | ~4–6 steps; long profile setup first |
| **Add-job form** | Company, title, board, list; pasted link fills nothing | Title, URL, company, location, description; pasted link fills nothing | Role, company, location, status; CSV import needs only company + title |
| **Reasons to return** | Due/overdue activities | Weekly goals, follow-up dates | Streaks, weekly application goal, match emails |

**Pattern:** all three put an account and setup before anything useful happens.

**What I'm using:**
- **Sample jobs (from Teal):** the first visit shows 3 labelled example applications, one per status, so the list is never empty and you learn by changing a status. A "Clear examples" button removes them.
- **Minimal form (from Simplify/Huntr):** only link, company, and role; status starts at Applied. Nothing asked before the first save.
- **Weekly goal (from Simplify/Teal):** "3 of 5 applications this week" in the welcome back summary, a reason to return without accounts or email.
- **Avoiding:** sign-up walls, setup surveys, and choosing a board/list before saving.

## Accessibility

Checked with the agent:

- **Contrast (WCAG AA):** body text 15.9:1, hints and secondary text 7.0:1, error text 7.0:1, current nav link 6.3:1, primary button 15.9:1. Input, select, and filter borders were 1.4:1 at first; darkened to `#8c7f6c` (3.6:1+) to meet the 3:1 rule for form controls.
- **Labels:** every field has a real `<label>`; hints and errors are linked with `aria-describedby`, and invalid fields get `aria-invalid`. Status dropdowns are named per job ("Status for Stripe, Product Designer").
- **Keyboard:** skip link, visible focus ring everywhere, the full add flow works with Tab and Enter, and on an error focus moves to the first field that needs attention.
- **Automated audit:** axe-core (WCAG 2.1 A/AA + best practices) on the first visit, form errors, list, empty filter, welcome back, and goal editor: no violations.

## First-run check

After deploying, a fresh agent (no access to the code or this conversation) used the live site in headless Chrome as a brand-new job hunter. Goal: *"Add three jobs you applied to this week, then come back later and check on them."* It made natural mistakes on purpose, tried the keyboard, a phone viewport, and returned with the same saved data.

**What worked:** the purpose and first action were clear within seconds, and "No sign-up" built trust. Errors were specific, kept what was typed, and moved the cursor to the field to fix. Pasting a link and landing on a form with it prefilled felt fast. Examples were clearly labelled; filter chips and empty states helped. Data persisted on return and the keyboard-only add worked.

**What it found, and what I did:**

| # | Issue | Severity | Change |
|---|---|---|---|
| 1 | No way to edit or delete your own jobs; a mistaken add stays forever | High | **Fixed:** Delete on each card, with an Undo bar for 8 seconds. (Edit left out for simplicity.) |
| 2 | Cards don't show when you applied; returning tells you nothing new | Medium | **Fixed:** each card shows "Added 6 days ago". (No follow-up nudges: out of scope.) |
| 3 | Duplicate link only caught after filling the whole form; "Find it in Applications" wasn't a link | Medium | **Fixed:** checked as soon as the link is pasted, with a link to the saved job, which is highlighted |
| 4 | Applications said "All 4" while Home said "1 application" (examples counted) | Medium | **Fixed:** examples are removed automatically when you add your first real job |
| 5 | `stripe.com/jobs` rejected instead of fixed | Low | **Fixed:** `https://` is added automatically to bare addresses |
| 6 | Faint focus ring on dark buttons | Low | **Fixed:** 3px outline with a 3px gap |
| 7 | Filter resets on reload or Back | Low | Not changed (kept simple) |
| 8 | "+ Add" wraps on phones | Low | **Fixed:** tighter nav that never wraps |
| 9 | Plain 404 page | Low | Not changed |

**What I learned:** the flows held up, but the agent spotted gaps I had cut for simplicity (deleting) that turn out to be essential, and inconsistencies (example counts) I'd stopped noticing. Testing as a stranger caught things my own scripted tests didn't.

## Run locally

```bash
npm install
npm run dev
```

Built with Next.js and Tailwind CSS. No database, accounts, or external APIs.
