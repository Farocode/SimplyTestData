# Spec: Landing Page (index.html) Redesign

Status: spec written 2026-09-08, per request — **nothing built yet.** Two separate ideas raised together; splitting them out since one seems closer to decided than the other.

## Idea 1 — Bigger 2x2 card grid

Now that there are four tools (Personal, Healthcare, Banking, QA Tools), a deliberate 2x2 grid reads more like "here are the four things this does" than a loose row of tiles.

**Current state:** `.card-grid` uses `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` with no column count pinned — on a wide desktop window this can lay out as 4-across in one row rather than 2x2, and card size is whatever that math produces (currently fairly small/compact).

**Proposed change:**
- Cap the grid at two columns on wider screens (e.g. `grid-template-columns: repeat(2, 1fr)` above ~700-800px, single column below it, matching the same breakpoint philosophy already used on the tool pages), so it's a true 2x2 regardless of window width.
- Grow the cards: more padding, a larger icon/emoji, and room for a touch more text per card — right now each card is a one-line description; a 2x2 layout has room for a short second line (e.g. 2-3 example fields, similar to how the QA Tools card could say "JSON, Base64, hashes, and more").
- Cards stay the same visual style (existing `.card` — surface background, border, radius) just bigger and in a fixed 2-up layout; no new color palette or card shape.

This part seems close to a "yes, do it" — flagging it here mainly so the actual card copy (any new second-line blurb per tool) gets a look before it's written, not because the layout idea itself seems in question.

## Idea 2 — A tool usable directly on the landing page

The concern raised: a landing page that's purely a directory of links means a first-time visitor has to click through before they see the thing actually work. Three ways to address that, roughly in order of how much they change the page:

**Option A — Do nothing here, just ship the bigger 2x2 grid.** The four cards plus slightly richer descriptions (Idea 1) may already be enough to signal "these are real, working tools" without needing something live on the page itself. Simplest, no new JS on `index.html`, keeps the landing page's job purely as a directory.

**Option B — One small "quick tool" widget above or beside the grid.** A single, self-contained mini-tool embedded directly on the landing page as a demo — something stateless and instant, no multi-step flow. Candidates, roughly in order of how well they'd read as a "look, it just works" moment:
- **UUID generator** — one button, one output, copy button. Dead simple, zero ambiguity, matches the "click it and get something real back" pitch of the whole site.
- **Password generator** — slightly more relatable to a first-time visitor than a UUID, still one button/one output.
- A one-field **case converter** or **timestamp converter** — also simple, but less obviously *the* headline feature of the site.

This does mean a small amount of JS lands on `index.html` for the first time (currently just `theme.js`/`app.js`) and it's logic that's otherwise "owned" by Personal or QA Tools — so it's either a tiny bit of duplicated logic, or `index.html` starts pulling in one function from an existing page's JS file. Neither is a big deal at this size, just worth deciding rather than defaulting into.

**Option C — Make one card itself interactive (e.g. an inline-expanding QA Tools card).** Clicking or hovering a card reveals a working mini-version of that tool right in the grid, rather than a separate widget elsewhere on the page. Closest to "the landing page has a tool on it" in spirit, but the most work and the most that could make the page feel cluttered or unclear about what's a preview vs. the real tool page.

**My lean, not a decision:** Option B with the UUID generator is the smallest change that actually answers the concern — one clearly-labeled "try it" widget near the top, that doesn't compete with or duplicate the four cards below it, and doesn't touch their layout or copy at all.

## Open questions for you

1. Idea 1 (bigger 2x2 grid) — go ahead as described, or hold it for the same pass as Idea 2 so they ship together?
2. Idea 2 — build something here at all right now, or is the bigger/richer card grid enough for now and this gets revisited later if it still feels missing?
3. If building a widget (Option B): which tool, and does it get its own small labeled section ("Try it now") above the card grid, or live off to the side of the header?

## Not proposing yet
Exact copy for the richer card descriptions, and exact CSS values for the "bit bigger" card sizing — both are quick to write once the direction above is picked, no reason to lock them in ahead of that.
