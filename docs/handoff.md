# Handoff

Last updated: 2026-09-08

## Where things stand

Four tool pages exist: Personal, Healthcare, Banking, and QA Tools. `index.html` links to all four in a 2x2 card grid, and all four tool pages now share a unified nav bar to jump between them. The rebrand to "Simply Test Data" is committed. **Uncommitted this round:** everything from an external feedback batch you shared.

## Uncommitted this round — feedback batch build-out

You shared a round of external feedback. Triaged it: some was already built (copy-to-clipboard with confirmation, dark/light theme toggle, QA Tools' Clear All), some was a couple of quick low-risk wins, and four items were bigger asks — checked with you via a multi-select question, all four approved and built:

1. **Unified navigation header** — replaces the old "&larr; Simply Test Data" back-link on all four tool pages with a pill-style nav row (Home / Personal / Healthcare / Banking / QA Tools), current page highlighted. This is the same idea that was already logged in the roadmap as "revisit once 2-3 tool pages exist" — now there are four.
2. **Delimiter Converter** — new QA Tools utility. Converts delimited text (CSV/TSV/pipe/semicolon/custom) from one delimiter to another, with a proper quoted-field-aware parser (handles a delimiter or newline embedded inside quotes, escaped quotes) rather than a naive split — zero dependency.
3. **Load Sample Data** — every QA Tools utility with input now has a "Load Sample" button next to Clear All, so the tool can be seen working without typing anything first.
4. **LocalStorage persistence for QA Tools** — input, output, and the selected tool survive an accidental refresh or tab switch. Scoped to QA Tools only (the generator pages regenerate cheaply, so didn't get this); wrapped in try/catch so it fails silently rather than breaking anything if storage is unavailable.

Also two small quick wins bundled in from the same feedback, no decision needed:
- Whitespace Cleanup gained "remove duplicate lines" and "strip special characters" toggles alongside the existing trim/collapse/remove-blank-lines.
- The theme toggle button moved inline next to the page title instead of sitting in its own corner — feedback said this was really a placement note, not a missing-feature note, since the toggle itself was already built.

## What's NOT built, on purpose
- JS/SQL/XML/YAML formatting, real grammar-checking, the Hemingway "rewriter" — cut from QA Tools earlier, spec has instructions for adding what's worth it later.
- A tool directly usable on the landing page — logged, not built, per your earlier call to leave it for now.

## Still outstanding from before this round (unchanged)
- Street field position on Personal Generator, more street-name variety, identity-row condensing spec.
- A handful of small nitpicks you said you'd batch up "once all the pages are done."

## Verification done this round
- `node --check` on the changed JS file — clean.
- HTML id-uniqueness and div-balance checks across all five pages — clean.
- Headless tests for the new delimiter-conversion logic: quoted-field parsing (embedded delimiter, embedded escaped quote), a parse→escape→reparse round-trip stability check, custom-delimiter resolution including the `\t` shorthand, and the tool's actual `run()` exercised end to end.
- Every QA Tools sample string run through its tool's own actions to confirm nothing throws.

## Still needed — visual check
Extra worth flagging this round: the delimiter tool's select/text option controls are a new UI shape (the other tools only used checkboxes), and the sample-loader/localStorage interplay is new interactive behavior. Worth an actual look in Safari before or right after you push, more than the usual reminder.

## Dev loop reminder
Sublime Text → Safari (local preview) → GitHub Desktop (commit/push). I don't commit or push — that's still on you.
