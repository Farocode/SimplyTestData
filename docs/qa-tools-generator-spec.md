# Spec: QA Tools (qa-tools.html)

Status: spec revised 2026-09-08 to a zero-dependency, zero-cost scope per explicit instruction: "I do want to eliminate anything that relies on external libraries or costs me anything, so that stuff can go straight out." **Nothing built yet — this is the scope the build will follow.**

## Scope philosophy — one page, not a family of pages

Per your own framing ("whatever common languages, tools, translators, whatever, can be easily added and adapted without being its own new app or something") — this is **one** `qa-tools.html` page holding many small tools as sections/tabs within it, not a new top-level page per tool the way Personal/Healthcare/Banking each got their own `.html` file. A tool only gets its own separate page later if it clearly outgrows living inside this one.

## A new UI pattern for this project

Personal/Healthcare/Banking are all the same shape: one record generator, a Generate button, CSV export. QA Tools is a genuinely different shape — a set of independent **input → transform → output** utilities (paste or type text in, click an action, get a result out, copy it). Layout: a row of tab buttons across the top switching between tool categories, one category's panel visible at a time (plain JS show/hide, no routing needed), each individual tool inside a category getting its own small textarea-in / textarea-or-value-out block with a copy button, matching the copy-button convention already established on every other page.

## What's being built — all zero-dependency, native-browser-API only

Every tool below runs entirely in the browser with no CDN script, no vendored library, no third-party API call, and no cost to you. Same "runs locally, no accounts, no tracking" identity as the rest of the site.

### Text Tools
- **Whitespace cleanup** — trim leading/trailing whitespace per line, collapse repeated internal spaces, optional blank-line removal. Pure string ops.
- **Case conversion** — UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE. One textarea in, a row of buttons, converted result out. A word-boundary tokenizer (splits on spaces/punctuation and on camelCase humps) feeds all nine conversions from one input.
- **Readability analyzer (Hemingway-style, approximate)** — flags long/complex sentences, a passive-voice heuristic (regex for "was/were/been + past participle"), an adverb heuristic (words ending "-ly"), and a rough Flesch-Kincaid grade-level score from a syllable-counting heuristic. Labeled clearly in the UI as an approximation, not a claim to match the commercial Hemingway App's exact output — this is the analyzer/flagging half; see "Not building" below for the rewriter half.
- **Basic spell-check** — instead of bundling a dictionary, the analyzer's input textarea uses the browser's native `spellcheck="true"` attribute, which underlines unrecognized words using Safari/Chrome's own built-in dictionary. Zero-dependency, zero-maintenance, and arguably better than a small bundled wordlist since it's using the browser's real dictionary.

### Format & Validate
- **JSON** — validate + pretty-print + minify, with the parser's own line/column reported on a parse failure. Native `JSON.parse`/`JSON.stringify`, no library needed for JSON specifically (unlike JS/SQL/XML/YAML below, which need a real grammar-aware formatter).

### Encode / Decode
- Base64 encode/decode (`btoa`/`atob`, with UTF-8 handled correctly so it doesn't break on non-ASCII text)
- URL encode/decode (`encodeURIComponent`/`decodeURIComponent`)
- HTML entity encode/decode (hand-written table for the common named entities plus numeric fallback)

### Generators / Converters
- UUID v4 generator (`crypto.randomUUID()` — a real built-in browser API, not a library)
- Hash generator — SHA-256/384/512 via the browser's native Web Crypto API (`crypto.subtle.digest`). SHA-1 included too since the API supports it, with a note that it's legacy/not secure. MD5 is left out entirely — it's not in the Web Crypto API on purpose (insecure, deprecated), and hand-rolling one just to check a legacy box isn't worth the code for a test-data tool.
- Timestamp converter — Unix timestamp → human-readable date, and the reverse, as two explicit sub-tools (avoids guessing which direction ambiguous input means). Native `Date`, no library.
- Color converter — hex ↔ RGB ↔ HSL. Pure math, no library.

## Not building — cut for relying on a library, a paid API, or ongoing cost

Per your instruction, these are staying out of the build entirely rather than being stubbed or half-built. Two of them are genuine value-adds with a bounded, well-understood path back in, so instructions are below for whenever it's worth doing. One is more architecturally involved and is just flagged as an idea, not a recipe.

### Worth adding later — instructions below
**JS / SQL / XML / YAML formatting.** These need a real parser to format correctly, which is a much bigger undertaking than hand-rolling — every other project like this leans on an established library. Two ways to add it later without giving up the offline-first identity:
- *Vendor a copy* (recommended over a CDN, keeps the page fully offline): download one release of a formatter — [Prettier's standalone browser build](https://prettier.io/docs/en/browser.html) covers JS/CSS/HTML/YAML in one file, and [sql-formatter](https://github.com/sql-formatter-org/sql-formatter) covers SQL — and commit the minified file(s) under a new `vendor/` folder. Load with a plain `<script src="vendor/prettier.standalone.js">` tag on `qa-tools.html` only, so the other three pages stay untouched. Call its format function from a new tab in the Format & Validate category, following the same tab/panel pattern the rest of the page uses.
- *CDN-loaded instead*, if repo size ever becomes a concern: same idea, but point the `<script>` tag at a pinned version on a CDN like jsDelivr instead of vendoring. Simpler, but that one tool goes down if the CDN is unreachable — contained to just that tool, the rest of the page keeps working either way.
- Either path is additive — a new script tag and a new tab, nothing existing gets touched.

**Real grammar checking.** Genuine grammar checking (subject-verb agreement, comma splices, style suggestions — what Grammarly/LanguageTool actually do) needs either a paid API or self-hosting a language-checking server; there's no realistic zero-cost, zero-dependency version of this. If it's ever wanted: [LanguageTool](https://languagetool.org) has a public API with a free tier (rate-limited) and is also self-hostable. Adding it would mean a fetch() call out to that API from the readability tool's "check grammar" button, which is a real step away from "nothing leaves your browser" for whatever text is typed in — worth deciding deliberately if it comes up again, not something to wire in quietly.

### Not sketching a recipe for — bigger lift, revisit only if it's actually wanted
**The Hemingway "rewriter"** (actually rewriting prose, not just flagging problems) needs real language understanding — in practice, an LLM API call, which means a backend or API-key handling, a different category of thing than everything else on this page. Not writing instructions for this one since it'd mean designing a small backend, not adding a library — worth a real conversation if it comes up again rather than a few bullet points now.

## Build order for this pass

1. Text Tools (whitespace, case conversion, readability analyzer w/ native spellcheck)
2. Format & Validate (JSON only)
3. Encode/Decode (Base64, URL, HTML entities)
4. Generators/Converters (UUID, hash, timestamp, color)

All four ship together as one page in this pass — same size as Healthcare or Banking, nothing deferred within what's listed above as "being built."
