# Handoff

Last updated: 2026-09-08

## Where things stand

Four tool pages exist: Personal, Healthcare, Banking, and QA Tools. `index.html` links to all four in a bigger 2x2 card grid. **Nothing in this round is committed yet** — everything below is sitting as local changes for you to review in GitHub Desktop.

### Uncommitted this round

**QA Tools — built, then reworked same day.** First pass was a tabbed page (11 tools, each with its own input/output box). Per your feedback, reworked to one shared input textarea + one shared output textarea, with a `<select>` to pick which of the 11 tools the action buttons act on, and a Clear All button — so the page only ever shows one input/output pair, not eleven. UUID is the one tool that hides the input box (nothing to read for it). Everything's still zero-dependency: native browser APIs only, no CDN, no library, no paid API.
- `qa-tools.html` + `js/qa-tools.js` — the consolidated page. The pure logic functions (case conversion, whitespace cleanup, readability analysis, JSON, Base64, URL, HTML entities, hashing, timestamp, color) are unchanged from the first pass and already verified; this rework was a DOM/wiring rewrite driven by a `TOOLS` config object, so adding a 12th tool later is one config entry.
- `css/components.css` — QA Tools styles replaced with the two-column workspace layout; also has the bigger-card styles for the index page (see below).
- `js/clipboard.js` — small tweak so the copy button works on `<textarea>` values, not just the `<span>` values the other three pages use.
- `index.html` — QA Tools card links to the real page; card grid pinned to a real 2x2 above ~700px width, cards bigger with the "Open Tool" button pinned to the bottom so all four match height.
- `css/main.css` — the `.card-grid` breakpoint change behind the 2x2.
- `docs/qa-tools-generator-spec.md` — revised down to the zero-cost scope, with a "not building — how to add later" section for what got cut.
- `docs/index-redesign-spec.md` — new spec covering both the 2x2 grid (built) and the "should the landing page have a working tool on it" question (logged, not built — see below).
- `docs/roadmap.md` — QA Tools and landing-page sections rewritten to reflect what actually shipped.

### What's NOT built, on purpose
- JS/SQL/XML/YAML formatting, real grammar-checking, and the Hemingway "rewriter" — all cut from QA Tools since they'd need a library, a paid API, or an LLM call. Spec has vendor/CDN instructions for the two judged worth documenting.
- A tool directly usable on the landing page (e.g. a small UUID-generator widget) — explicitly held back per your last message ("without the working tools option, we can leave that logged"). Three options are written up in `docs/index-redesign-spec.md` if you want to pick this back up.

### Still outstanding from before this round (unchanged)
- Street field position on Personal Generator (sits on the right, risk with long addresses) — logged, not yet acted on.
- More street-name word-bank variety — logged, not yet acted on.
- Identity-row condensing spec (`docs/identity-row-condense-spec.md`) — written, not built.
- A handful of small nitpicks you said you'd batch up "once all the pages are done."
- Possibly renaming the project to "Simply Test Data" — you mentioned it, said you'd rename the repo yourself. Nothing touched on my end; once the repo's renamed, the docs/page titles referencing "Project Nebo" need a pass to match.

## Verification done this round
- `node --check` on all changed JS files — clean.
- HTML id-uniqueness check on `qa-tools.html` — 9 ids (down from 50 in the tabbed version), zero duplicates.
- Headless Node smoke tests: re-ran the original pure-function tests (case conversion round-trips, Base64 UTF-8 round-trip incl. emoji, HTML entity round-trip, hex→RGB→HSL) against the unchanged logic, plus a new pass that exercises every tool's every action through the `TOOLS` config with representative input — confirms nothing throws and each action returns a sane result shape.
- Re-verified JSON validate/pretty-print correctness and the SHA-256 hash against a known test vector (`sha256("hello")`), using Node's own Web Crypto — same native API the browser uses.

## Still needed — visual check
Same standing gap as every round: this session can't get a live Safari render. The two-column QA Tools layout, the select-driven tool switching, and the bigger index cards are all verified at the logic/HTML level but haven't been eyeballed on screen. Worth a look before or right after you push.

## Dev loop reminder
Sublime Text → Safari (local preview) → GitHub Desktop (commit/push). I don't commit or push — that's still on you.
