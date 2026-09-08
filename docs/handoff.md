# Project Nebo — Handoff (for next chat)

Date: 2026-09-08

## Where things stand

Healthcare Generator got two follow-up rounds after the initial build (both already pushed as a separate commit before this): a layout fix (Member ID/Group Number, MBI label) and then two new fields (NPI, Medication/Condition/Diagnosis Code). **This second round is not yet committed/pushed.**

Repo: `~/Documents/GitHub/project-nebo` on the Mac (linked via device bridge). GitHub Pages: farocode.github.io/project-nebo/

## What just got built (this session, this round)

Two new fields added per your follow-up feedback, after confirming scope with you first (fixed generator-side pool, not a user-facing picker; NPI + ICD-10 both wanted):

- **NPI (Provider ID)** — paired with MBI on its own row, no control needed (same "two short IDs, no dropdown" pattern as Personal's First/Last Name). Real CMS check-digit algorithm (Luhn with the "80840" card-issuer prefix folded into a constant) — verified against CMS's own published worked example before writing any code, then re-verified against 5,000 generated NPIs.
- **Medication → Condition → Diagnosis Code (ICD-10)** — fixed pool of 20 real medications (confirmed with you: pool size, not a checklist UI). Each medication's ICD-10 code was individually checked against icd10data.com rather than recalled from memory — full table's in `docs/healthcare-generator-spec.md`. A Medication selector leads the row (Random by default), same pattern as Plan Type/Enrollment Period.

Files: `js/healthcare.js`, `healthcare.html`, `docs/healthcare-generator-spec.md`, `docs/roadmap.md`.

## Verification done

- `node --check js/healthcare.js` — syntax OK
- HTML div-balance and duplicate-id checks — OK (23 unique ids)
- Headless Node smoke test: NPI check digit matches CMS's own worked example exactly (base `123456789` → `3`); 5,000 generated NPIs all format- and check-digit-correct; medication pool confirmed at exactly 20 unique entries, all 20 reachable via "Random" over 5,000 draws; specific-medication selection resolves correctly; full record and CSV structure checked.
- **Not yet done: a visual look in Safari.** Same standing limitation as every round this session — still can't get a live render from here. This round adds a new NPI/MBI pairing and a new 3-item Medication row, neither eyeballed yet.

## Not yet done — needs a look

1. **Commit and push** this round (NPI + Medication fields, plus the spec/roadmap updates).
2. **Visual check in Safari**, especially the new MBI/NPI row and the Medication/Condition/Diagnosis Code row.
3. Still open from earlier rounds, untouched: Street/Phone position, more street name combos, condense the Personal Generator identity rows (First/Last/Full Name/SSN) — see `docs/roadmap.md`'s "Logged for later" section and `docs/identity-row-condense-spec.md`.

## Next up (bigger picture)

Per the roadmap:
- Build out the Banking card
- Build out the QA Tools card (JSON/XML/SQL formatters)
- A pre-release refactor/cleanup pass across the codebase
- A color/style pass beyond the current white/dark-blue look

## Dev loop reminder

Sublime Text (edit) → Safari (local preview) → GitHub Desktop (commit/push). Full-file replacement is safer than partial pastes when moving code from chat into Sublime. Mac sleeps when you step away, so the device link drops between sessions — that's expected, not a bug.
