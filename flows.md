# Flows

**Main task:** I paste a job link and add the company and role → it's on my applications list as "Applied" → whenever I come back, all my applications are still there, with their latest status.

## Pages

| Route | Step | What's on it |
|---|---|---|
| `/` | First visit / Welcome back | New: two short steps. (1) Add your first application: job link, company, role; it folds up once all three are valid. (2) Set your weekly application goal. When both are done, an **Add** button finishes onboarding. Returning: a "Welcome back" summary of your progress, a prominent **+ Add an application** button, your weekly goal, and your most recent jobs. |
| `/add` | The form | Job link, Company, Role in one column. Status starts as Applied. |
| `/applications` | The list | Every application, each with a status you can change. |

Shared navigation on every page: **Home · Applications · + Add** (the Add link is a filled button so it's always easy to find).

## Diagram

**1. First visit: two-step onboarding**

```mermaid
flowchart TD
    Saved{"Open the app:<br/>anything saved?"} -- No --> Step1["Step 1: Add your first application<br/>(link, company, role)"]
    Saved -- Yes --> Welcome["Welcome back<br/>(see flow 4)"]
    Step1 -- "Empty or wrong" --> Err1["Error next to the field,<br/>typed input kept"]
    Err1 --> Step1
    Step1 -- "All valid: step folds up" --> Step2["Step 2: Set your<br/>weekly goal"]
    Step2 -- "Not a whole number" --> Err2["Enter a whole<br/>number, 1 or more"]
    Err2 --> Step2
    Step2 -- "Both done" --> Add["Add button appears"]
    Add --> Save1[("Save job + goal")]
    Save1 --> List["Applications list"]
```

**2. Add a job (/add)**

```mermaid
flowchart TD
    Form["Add form<br/>(link, company, role)"] --> Valid{"Valid?"}
    Valid -- "Company empty" --> E1["Enter the<br/>company name"]
    Valid -- "Role empty" --> E2["Enter the role"]
    Valid -- "Bad link" --> E3["Paste a full link<br/>starting with https://"]
    Valid -- "Duplicate" --> E4["You already<br/>added this link"]
    E1 & E2 & E3 & E4 -- "Typed input kept" --> Form
    Valid -- Yes --> Save[("Save as Applied")]
    Save --> List["Applications list<br/>Added Stripe"]
```

**3. The list (/applications)**

```mermaid
flowchart TD
    List["Applications list"] --> Status["Change status<br/>Applied, Interviewing,<br/>Offer, Rejected"]
    Status --> Saved[("Save")]
    Saved --> List
    List -- "Delete" --> Undo["Deleted Stripe<br/>+ Undo (8 sec)"]
    Undo --> List
    List -- "Filter has no matches" --> Empty["Empty state<br/>Show all or Add"]
    Empty --> Form["Add form"]
```

**4. Coming back (/)**

```mermaid
flowchart TD
    Welcome["Welcome back<br/>8 applications,<br/>2 interviewing, 1 offer<br/>Last added: Stripe"] --> Goal["This week:<br/>3 of 5 applications"]
    Goal -- "Change goal" --> SaveGoal[("Save goal")]
    SaveGoal --> Welcome
    Welcome -- "+ Add an application" --> Form["Add form"]
    Welcome -- "See all" --> List["Applications list"]
```

## States and errors kept

- **First visit (onboarding):** never a blank screen. Two numbered steps:
  1. **Add your first application:** job link, company, role. A bad link is flagged as soon as you leave the field; leaving the step with something missing shows every error next to its field. Once all three are valid and you move on (Tab, click, or Enter), the step folds up to a one-line summary with **Edit**.
  2. **Set your weekly application goal:** any whole number, 1 or more (no upper limit).
  When both are done, "Both steps done. Press Add to save." and an **Add** button appear; Add saves both and opens your list. Enter moves through the steps, so it all works by keyboard.
- **Empty state:** a filter with no matches explains itself and links to Add.
- **Form errors** (placed next to the field, typed input kept):
  - "Enter the company name"
  - "Enter the role"
  - "Paste a full link starting with https://"
  - "You already added this link"
- **Status:** Applied → Interviewing → Offer / Rejected, saved on change.
- **Delete** (added after the first-run check): removes a job, with Undo for 8 seconds. Each card shows when it was added.
- **Links:** bare addresses like `stripe.com/jobs/1` get `https://` added; duplicates are caught as soon as the link is pasted.
- **Coming back:** applications, statuses, and the goal are remembered on this device. Home shows "Welcome back." with a highlighted summary (counts and the last company in terracotta), a prominent **+ Add an application** button, the weekly goal, and the 3 most recent jobs.
- **Weekly goal:** "3 of 5 applications this week" (week starts Monday, set during onboarding, changeable on the home page, no upper limit). Saved locally.

Considered and dropped (simplicity): a "followed up" button, notes, editing, a 7-day "gone quiet" banner. Example jobs on the first visit were tried and then removed: adding your own first job is more useful than playing with fake ones. The paste-link field on the returning home page was replaced by the **+ Add** button.
