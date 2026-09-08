# Handoff

Last updated: 2026-09-08

## Where things stand

Four tool pages exist: Personal, Healthcare, Banking, and QA Tools. `index.html` links to all four in a 2x2 card grid. The QA Tools consolidation is committed. **Uncommitted this round:** the QA Tools alignment/height fix, the site-wide style pass, and — most recent — a full rebrand from "Project Nebo" to "Simply Test Data."

## Uncommitted this round

**Rebrand: Project Nebo → Simply Test Data.** Every page title, `<h1>`, back-link ("&larr; ..."), and footer line across all five pages now reads "Simply Test Data." Also updated:
- `js/app.js` console log message.
- CSV export filenames — `nebo-personal-records-...` / `nebo-healthcare-records-...` / `nebo-banking-records-...` are now `simply-test-data-personal-records-...` etc. (in `js/personal.js`, `js/healthcare.js`, `js/banking.js`).
- `README.md` title and description.
- `docs/roadmap.md` heading, and every filename example across `docs/roadmap.md`, `docs/csv-export-spec.md`, `docs/healthcare-generator-spec.md`, `docs/banking-generator-spec.md`.

**Left alone on purpose:** the `localStorage` key used to remember your light/dark theme choice (`nebo-theme` in `js/theme.js`) — it's invisible to you, and renaming it would just silently reset your saved theme preference once for no real benefit. Say the word if you'd rather it match too.

**Not touched:** the GitHub repo itself and its Pages URL (`farocode.github.io/project-nebo/`) — that's still your rename to make on GitHub's side. Nothing in the code references that URL directly, so there's nothing here that breaks either way once you do rename it.

**Also from this round (before the rebrand request):**
1. QA Tools input/output boxes now line up side by side — the tool selector + description moved to a full-width block above the two-column workspace so both sides start from a matching single-line label.
2. QA Tools textareas grown ~25% taller.
3. A site-wide style/finish pass — transitions, a consistent accent-colored focus ring, hover elevation on the landing cards, tactile button press states, a smoother theme-toggle fade. Colors and layout untouched. Full detail in `docs/roadmap.md`.

## What's NOT built, on purpose
- JS/SQL/XML/YAML formatting, real grammar-checking, and the Hemingway "rewriter" — cut from QA Tools, spec has instructions for adding the two worth it later.
- A tool directly usable on the landing page — logged, not built, per your call to leave it for now.

## Still outstanding from before this round (unchanged)
- Street field position on Personal Generator, more street-name variety, identity-row condensing spec — all logged, not acted on.
- A handful of small nitpicks you said you'd batch up "once all the pages are done."

## Verification done this round
- `node --check` on every JS file — clean.
- Grepped the whole repo for "nebo"/"Nebo" after the rename — only the internal (invisible) localStorage key remains, deliberately.
- Style-pass verification (tag/brace balance) carried over from the prior round, unaffected by the rename since it's text-only.

## Still needed — visual check
Same standing gap — hover/focus states, transitions, and the QA Tools alignment fix are all worth an actual look in Safari, and now every page's header/footer text changed too, worth a quick skim to confirm nothing reads oddly.

## Dev loop reminder
Sublime Text → Safari (local preview) → GitHub Desktop (commit/push). I don't commit or push — that's still on you.
