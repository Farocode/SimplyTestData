# Project Nebo — Handoff (for next chat)

Date: 2026-09-08

## Where things stand

Personal Generator (`personal.html`) just went through its planned final style pass. Everything below is in the working tree but **not yet committed/pushed** — that's the first thing to do next, or now if you want to close it out before ending this session.

Repo: `~/Documents/GitHub/project-nebo` on the Mac (linked via device bridge). GitHub Pages: farocode.github.io/project-nebo/

## What just got built (this session)

All five items from the roadmap's "final style pass" punch-list:

1. **Row alignment** — First Name and Last Name are now paired into one stacked field-group (same field-row/field-item pattern as Full Name+SSN below them), so the top of the page reads consistently with the grouped rows underneath instead of two separate boxes next to a paired one.
2. **Empty grid cell on desktop** — turned out to be the CSV export row, not Username/Password (that pair was already fine). The export row wasn't a `.field-group`, so it wasn't covered by the full-width-span rule and was landing in one grid column with an empty cell beside it. Added `.generator-panel > .export-row` to that rule.
3. **Long emails wrapping** — you confirmed this is already fine now that Email spans the full row on its own line, so no change made there.
4. **Name dataset skew** — split the first/last name lists into a balanced pool (the original hand-curated 30/30) and an extra pool (the larger CSV-merged batch that skews Western/Hispanic), with a new `pickName()` that draws from each pool with equal 50/50 probability before picking within it. The small balanced pool no longer gets drowned out by the bigger skewed one, and nothing was deleted.
5. **State-select control position** — moved to lead the City/State/Zip row (was underneath it), matching the Age Range → DOB/Age pattern: the control now comes before the fields it drives, not after.

Also done as part of the same pass: **password generator hardening** — `generatePassword()` now retries (up to 25 times) against a new `hasRepeatedRun()` check so it never returns a password with 3+ identical characters in a row, without touching the existing complexity guarantee or UI.

Files touched: `personal.html`, `js/personal.js`, `css/components.css`, `docs/roadmap.md`.

## Verification done

- `node --check js/personal.js` — syntax OK
- HTML `<div>`/`</div>` balance and CSS brace balance — both OK
- Headless Node smoke test against the actual file: confirmed pool sizes (30/136 first, 30/93 last), ~50/50 draw rate across 20,000 `pickName()` calls, zero repeated-character runs across 10,000 sampled passwords (lengths 8 and 12), and a full `generatePerson()` record still comes out correctly shaped.
- **Not yet done: a visual look in Safari.** I couldn't get a live render of the page from here this session (tried spinning up a local server and pointing the built-in browser at it, but it wouldn't load), so all of the above is code-level verification only — the actual on-screen layout (First/Last pairing, state-control position, export row spanning full width) hasn't been eyeballed yet. Worth a look before calling this fully done.

## Not yet done — needs a look

1. **Commit and push.** Nothing from this session is committed yet.
2. **Visual check in Safari** (see above) — especially the two-column desktop layout, since that's where the export-row fix and the new First/Last pairing actually change what you see.

## Next up (bigger picture)

With the final style pass done, Personal Generator should be feature- and style-complete for this round (pending your visual check). Per the roadmap, the natural next steps are:
- Build out the Healthcare card (MBI, Medicare Part A/B dates, coverage info)
- Build out the Banking card
- Build out the QA Tools card (JSON/XML/SQL formatters)
- A pre-release refactor/cleanup pass across the codebase (after more cards exist, not before)
- A color/style pass beyond the current white/dark-blue look, once there's more than one tool page to design against

## Dev loop reminder

Sublime Text (edit) → Safari (local preview) → GitHub Desktop (commit/push). Full-file replacement is safer than partial pastes when moving code from chat into Sublime. Mac sleeps when you step away, so the device link drops between sessions — that's expected, not a bug.
