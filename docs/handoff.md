# Handoff

Last updated: 2026-09-08

## Where things stand

Four tool pages now exist: Personal, Healthcare, Banking, and QA Tools (just built). `index.html` links to all four. **Nothing in this round is committed yet** — everything below is sitting as local changes for you to review in GitHub Desktop.

### Uncommitted this round: QA Tools first pass
- `qa-tools.html` + `js/qa-tools.js` — new page, tabbed Text Tools / Format & Validate / Encode-Decode / Generators-Converters, zero-dependency (native browser APIs only, no CDN, no library, no paid API — per your instruction to cut anything that costs money or relies on external libraries).
- `css/components.css` — QA Tools styles appended at the bottom (tabs, tool cards, textareas, subtool blocks).
- `js/clipboard.js` — small tweak so the copy button works on `<textarea>`/`<input>` values, not just the `<span>` values the other three pages use.
- `index.html` — QA Tools card now links to the real page instead of "Coming Soon".
- `docs/qa-tools-generator-spec.md` — revised from the original 3-decision-point spec down to the trimmed, zero-cost scope, with a "not building — how to add later" section for the library/API-dependent tools that were cut.
- `docs/roadmap.md` — QA Tools section rewritten to reflect what actually got built vs. what was deliberately cut (with pointers to the "add later" instructions).

Full detail on what's in each tab: see the "DONE, built 2026-09-08" entry under QA Tools in `docs/roadmap.md`.

### What's NOT in this pass, on purpose
JS/SQL/XML/YAML formatting, real grammar-checking, and the Hemingway "rewriter" are all cut — they needed a library, a paid API, or an LLM call. The spec (`docs/qa-tools-generator-spec.md`) has vendor-vs-CDN instructions for the formatting tools and grammar-checking if you ever want them; the rewriter is just flagged as a bigger, separate conversation.

### Still outstanding from before this round (unchanged)
- Street field position on Personal Generator (sits on the right, risk with long addresses) — logged, not yet acted on.
- More street-name word-bank variety — logged, not yet acted on.
- Identity-row condensing spec (`docs/identity-row-condense-spec.md`) — written, not built.
- A handful of small nitpicks you said you'd batch up "once all the pages are done" rather than fix one at a time.

## Verification done this round
- `node --check` on `js/qa-tools.js` and `js/clipboard.js` — clean.
- HTML id-uniqueness check on `qa-tools.html` — 50 ids, zero duplicates.
- Headless Node smoke tests against the pure logic (case conversion incl. round-trips, whitespace cleanup, Base64 UTF-8 round-trip incl. emoji/CJK, HTML entity round-trip, hex→RGB→HSL, syllable/readability sanity checks, passive-voice detection).
- Node's own Web Crypto (`crypto.webcrypto`, same API surface as the browser) checked against a known SHA-256 test vector and produced a real UUID — confirms the hash/UUID generator logic is correct, since it's the same native API the browser uses.

## Still needed — visual check
Same standing gap as every round: this session can't get a live Safari render of the new page. Everything above is verified at the logic/data level, but the actual on-screen layout (tab switching, textarea sizing, the new subtool blocks) hasn't been eyeballed. Worth a look before or right after you push.

## Not yet actioned — from your most recent message
You raised turning the four dashboard cards on `index.html` into a bigger 2x2 grid now that there are four tools, and separately floated maybe not liking a landing page with no tool immediately usable on it. Neither is built — flagging it here since it came in mid-build and deserves its own pass rather than a rushed change bolted onto this one.

## Dev loop reminder
Sublime Text → Safari (local preview) → GitHub Desktop (commit/push). I don't commit or push — that's still on you.
