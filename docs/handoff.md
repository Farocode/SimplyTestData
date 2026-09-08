# Project Nebo — Handoff (for next chat)

Date: 2026-09-08

## Where things stand

Personal Generator (`personal.html`) is feature-complete and just picked up CSV export, its last planned feature for this round. Everything below is pushed to the local repo working tree but **not yet committed/pushed** — that's the first thing to do in the next session, or now if you want to do it before closing this one out.

Repo: `~/Documents/GitHub/project-nebo` on the Mac (linked via device bridge). GitHub Pages: farocode.github.io/project-nebo/

## What just got built (this session)

**CSV export** on Personal Generator:
- New row below the Generate button: a "Records to export" number input (default 1, max 500) + an Export CSV button, styled to match the existing password-length control.
- Exports all current fields as-is (First/Last/Full Name, SSN, DOB, Age, Phone, Street, City, State, Zip, Email, Username, Password), one row per generated record.
- Each export run generates fresh random records (reusing `generatePerson()`), not just the one currently on screen.
- Handles comma/quote/newline escaping properly, CRLF line endings, filename stamped with the date: `nebo-personal-records-YYYYMMDD.csv`.
- Verified: JS syntax check, HTML div-balance and CSS brace-balance checks, and a headless Node smoke test that actually ran `generateCsv()` against sample data and confirmed correct row counts, CRLF, and escaping.

Files touched: `personal.html`, `js/personal.js`, `css/components.css`, `docs/roadmap.md`, plus a new `docs/csv-export-spec.md` written before building it.

**Note on placement**: you asked for the export controls "in line with the password length selector" — I built it as its own row below Generate, styled to match the password-length control's look, rather than literally inside that same control box. If you pictured it literally sharing space with the password Length & Symbols row, flag it and I'll move it.

## Not yet done — needs a look

1. **Commit and push.** Nothing from this session is committed yet. Working tree has uncommitted changes in `css/components.css`, `docs/roadmap.md`, `js/personal.js`, `personal.html`, plus the new `docs/csv-export-spec.md`.
2. **Visual check on real devices** — the export row hasn't been eyeballed on mobile or against your iPhone/Chrome setup yet, only verified programmatically. Worth a look before calling it fully done.

## Open items from the roadmap (not blocking, just logged)

- Row alignment: First Name / Last Name / Full Name+SSN still feels a little inconsistent to you compared to the more clearly grouped rows below — no fix decided, just flagged.
- Empty grid cell next to Username on desktop (Password spans full width, nothing pairs with Username) — cosmetic, parked for the eventual style pass.
- Long emails can still wrap to a second line — you were considering a character limit as part of a future style pass rather than more layout tweaking.
- Name dataset skew: the merged 166/123 name list leans toward common Western/Hispanic surnames from the CSV you added, vs. the original hand-balanced 30/30. You said you preferred the original mix — parked for later (weighting, or blending in a second balanced batch).
- Password generator hardening: guard against 3+ identical repeated characters in a row (for strict password policies). Small, not started.
- State-select control position: you weren't sure it's in the right spot in the City/State/Zip area — unresolved, no action taken.
- Deferred by design (not urgent): full refactor/cleanup pass with consistent code comments (planned after more cards are built), and branching/release process (deferred until something is actually live to protect).

## Next up (bigger picture)

Once the Personal Generator is pushed and confirmed working, the natural next steps per the roadmap are:
- Build out the Healthcare card (MBI, Medicare Part A/B dates, coverage info)
- Build out the Banking card
- Build out the QA Tools card (JSON/XML/SQL formatters)
- A pre-release refactor/cleanup pass across the codebase (after more cards exist, not before)
- A color/style pass beyond the current white/dark-blue look, once there's more than one tool page to design against

## Dev loop reminder

Sublime Text (edit) → Safari (local preview) → GitHub Desktop (commit/push). Full-file replacement is safer than partial pastes when moving code from chat into Sublime. Mac sleeps when you step away, so the device link drops between sessions — that's expected, not a bug.
