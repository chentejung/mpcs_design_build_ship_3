# Job Application Tracker

MPCS 51238 Design, Build, Ship · Assignment 3: Patterns & Flows

A small tool for anyone job hunting. Paste a job link, add the company and role, and keep track of where each application stands. Everything is saved in your browser (localStorage), so it's still there when you come back.

**Live:** _coming soon (Vercel)_

## Flows

**Main task:** I paste a job link and add the company and role → it's on my applications list as "Applied" → whenever I come back, all my applications are still there, with their latest status.

```mermaid
flowchart TD
    Start(["Open the app"]) --> Saved{"Anything saved<br/>on this device?"}

    %% 1. First visit
    Saved -- No --> First["/ First visit<br/>'Track every job you apply to'<br/>Paste-link field + a sample application"]
    First -- "Try the sample:<br/>change its status" --> List
    First -- "Paste a link" --> Form

    %% 2. The form and its errors
    Form["/add Form<br/>Job link · Company · Role"] --> Submit{"Valid?"}
    Submit -- "Company empty" --> ErrCompany["'Enter the company name'"]
    Submit -- "Role empty" --> ErrRole["'Enter the role'"]
    Submit -- "Link malformed" --> ErrLink["'Paste a full link starting with https://'"]
    Submit -- "Link already added" --> ErrDup["'You already added this link'"]
    ErrCompany & ErrRole & ErrLink & ErrDup -- "What you typed is kept" --> Form
    Submit -- Yes --> Save[("Save to localStorage<br/>status = Applied")]
    Save --> List

    %% 3. It's on my list
    List["/applications List<br/>'Added Stripe — Product Designer'"] --> Status["Change status<br/>Applied → Interviewing → Offer / Rejected"]
    Status --> SaveStatus[("Save to localStorage")]
    SaveStatus --> List
    List -- "Filter has no matches" --> Empty["Empty state<br/>'No applications here yet' + Add link"]
    Empty --> Form

    %% 4. Coming back
    Saved -- Yes --> Welcome["/ Welcome back<br/>'8 applications · 2 interviewing · 1 offer'<br/>Last added: Stripe, 3 days ago"]
    Welcome --> List
    Welcome --> Form
```

Full flow notes, states, and errors: [flows.md](flows.md)

## Onboarding research

_Coming in step 3._

## First-run check

_Agent usability feedback goes here after deploy._

## Run locally

```bash
npm install
npm run dev
```

Built with Next.js and Tailwind CSS. No database, accounts, or external APIs.
