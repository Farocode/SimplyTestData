# Project Nebo — Handoff (for next chat)

Date: 2026-09-08

## Where things stand

Healthcare Generator (`healthcare.html`) is built — the project's second tool page, wired up from the index.html card. **Not yet committed/pushed.** The three logged-but-not-built items from the prior round (Street/Phone position, more street name variety, condense First/Last/Full Name/SSN rows) are still open and untouched — see `docs/roadmap.md`'s "Logged for later" section.

Repo: `~/Documents/GitHub/project-nebo` on the Mac (linked via device bridge). GitHub Pages: farocode.github.io/project-nebo/

## What just got built (this session)

Full spec-then-build per your feature list (MBI, real insurer names, Part A/B dates with an enrollment-period selector, height/weight with an underwriting-edge-case option) plus a few additions. Spec: `docs/healthcare-generator-spec.md`, roadmap entry: `docs/roadmap.md` under "Healthcare Generator."

- **MBI** — matches the real CMS 11-character format (verified against CMS's own format PDF), displayed dashed like an actual card.
- **Enrollment Period selector (IEP/GEP/SEP or Random)** drives Part A + Part B Effective Date using the actual medicare.gov coverage-start rules for each period. Deliberately left out AEP and the Medicare Advantage OEP — those are plan-*switch* windows for people already enrolled, not initial Part A/B enrollment, so they'd drive a different kind of date. Logged as a possible separate addition.
- **Plan Type selector** (Original Medicare only / Medicare Advantage / Medigap+Part D / Part D only) drives Payer, Member ID, and Group Number. Original Medicare correctly gets no private carrier (Payer = "Medicare (Original)", Member ID = the MBI, Group Number = "N/A"). Everything else draws from a curated list of ~24 real, currently-operating US insurers.
- **Body Composition Range selector** (Standard / Outside Standard Range / Random) drives Height, Weight, and BMI — "Outside" covers both underweight and obese/extreme-obese, for exercising underwriting edge cases. Labeled clearly (in the spec and the control label) as a general reference band, not a specific regulatory or carrier cutoff.
- **CSV export** — same pattern as Personal Generator.
- Every field group on this page is full-width from the start — no plain/paired-by-DOM-order groups — deliberately sidestepping the empty-grid-cell bug class that hit Personal Generator twice.

Files: `healthcare.html`, `js/healthcare.js` (new), `index.html` (Healthcare card now links to the tool instead of "Coming Soon"), `docs/healthcare-generator-spec.md` (new), `docs/roadmap.md`.

## Verification done

- `node --check js/healthcare.js` — syntax OK
- HTML div-balance and duplicate-id checks on both `healthcare.html` and `index.html` — OK
- Headless Node smoke test against the actual file: MBI format regex-verified across 5,000 samples (0 failures); GEP/IEP/SEP effective-date rules checked (right months, always the 1st of a month); Original-Medicare-vs-private-carrier coverage logic checked (500 samples each plan type, 0 mismatches); CSV structure/escaping checked.
- Caught and fixed a real bug during verification: a small number of "Outside Standard Range" BMI values could round to exactly 18.5 (the standard band's edge) after weight rounded to a whole pound. Widened the buffer so the generated target can never land there; re-verified with 20,000 samples afterward, 0 landed in the standard band.
- **Not yet done: a visual look in Safari.** Same standing limitation noted in the last handoff — this session still can't get a live render of a page from here, so the actual on-screen layout (especially the 4-item Plan Type row on desktop) hasn't been eyeballed.

## Not yet done — needs a look

1. **Commit and push.** Nothing from this session is committed yet.
2. **Visual check in Safari** (see above), especially the desktop two-column layout and the 4-item Plan Type/Payer/Member ID/Group Number row — that's the widest row on this page and hasn't been eyeballed.
3. The three items logged last round (Street/Phone position, more street combos, condense identity rows) are still untouched — worth deciding whether to fold those in before or after this Healthcare build settles.

## Next up (bigger picture)

Per the roadmap, with Healthcare built:
- Build out the Banking card
- Build out the QA Tools card (JSON/XML/SQL formatters)
- A pre-release refactor/cleanup pass across the codebase (after more cards exist — there are two now)
- A color/style pass beyond the current white/dark-blue look, once there's more than one tool page to design against

## Dev loop reminder

Sublime Text (edit) → Safari (local preview) → GitHub Desktop (commit/push). Full-file replacement is safer than partial pastes when moving code from chat into Sublime. Mac sleeps when you step away, so the device link drops between sessions — that's expected, not a bug.
