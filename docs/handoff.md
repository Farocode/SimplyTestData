# Handoff

Last updated: 2026-09-08

## Where things stand

Four tool pages exist: Personal, Healthcare, Banking, and QA Tools. `index.html` links to all four in a bigger 2x2 card grid. **The QA Tools consolidation from earlier today is committed** (you pushed it). Everything below this point — the alignment fix, taller boxes, and the site-wide style pass — is new, uncommitted local changes.

## Uncommitted this round

**QA Tools — two small fixes on the page you just committed:**
1. Input/output boxes now actually line up side by side. The Tool selector + description used to sit above the input box only; moved them to a full-width block above the two-column workspace instead, so both columns start with a matching one-line "Input"/"Output" label right before their textarea and the boxes always align, regardless of how long a given tool's description is.
2. Textareas are ~25% taller (400px min-height, was 320px).

**All-tool style pass — a finish/polish pass across every page** (Personal, Healthcare, Banking, QA Tools, index). Feel and interaction, not colors or layout — the color palette is still untouched on purpose. What changed, all in the shared stylesheets so it applies everywhere at once:
- Shared shadow tokens for subtle elevation on cards/panels.
- Smooth transitions on every button, select, input, textarea, and link — most of these had zero transition before, so hover/focus was an instant snap.
- One consistent accent-colored focus ring everywhere (keyboard-navigable, same in both themes) instead of each browser's own default outline.
- The four landing-page cards lift and glow on hover.
- Buttons press down slightly on click; primary action buttons lift with a shadow on hover.
- The light/dark theme toggle now fades instead of snapping.

Full detail: see the "All-tool style pass" entry in `docs/roadmap.md`.

## What's NOT built, on purpose
- JS/SQL/XML/YAML formatting, real grammar-checking, and the Hemingway "rewriter" — cut from QA Tools, spec has instructions for adding the two worth it later.
- A tool directly usable on the landing page — logged, not built, per your call to leave it for now.

## Still outstanding from before this round (unchanged)
- Street field position on Personal Generator, more street-name variety, identity-row condensing spec — all logged, not acted on.
- A handful of small nitpicks you said you'd batch up "once all the pages are done."
- Possibly renaming the project to "Simply Test Data" — your call, on GitHub's side. Nothing touched on my end.

## Verification done this round
- Div open/close tag-balance check on all 5 HTML pages — clean.
- CSS brace-balance check on all 3 stylesheets — clean.
- This round was CSS/HTML-only (no JS changed), so the existing headless logic-test suite for QA Tools still applies unchanged and wasn't re-run.

## Still needed — visual check
This one matters more than usual this round: hover states, focus rings, transitions, and box alignment are exactly the kind of thing that needs an actual look, not just a balance check. Worth pulling this up in Safari before or right after you push.

## Dev loop reminder
Sublime Text → Safari (local preview) → GitHub Desktop (commit/push). I don't commit or push — that's still on you.
