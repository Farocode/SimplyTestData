# Project Nebo — Roadmap

## Personal Generator — nearing done
- Name-dataset expansion and password options are both done. Next action per user: a style pass (revision/refactor/reduction) — the pre-release refactor pass already noted under "Deferred by design" below. No new fields planned before that.
- DONE (first style-pass item) — Responsive layout fix: header/back-bar and the generator panel now share one width via a `body.tool-page` shell class (900px cap), so they line up on the same edges instead of the header spanning full width while the panel floats centered on its own. Below ~800px window width the panel stays a single centered column (reads as "mobile" whether it's a phone or a shrunk desktop window); above it, the panel becomes a real two-column grid so a full desktop window isn't wasted on a narrow strip with empty space on both sides. `body.tool-page` is meant to be the standard pattern for future tool pages too, same as the back-nav bar.
- Color palette is intentionally NOT part of this pass — user said the current white/dark-blue look can wait until more tool pages exist, so there's more to design against.
- DONE — Mobile overflow fix: long unbroken values (email addresses, longer generated passwords, longer street names) were pushing rows wider than the card instead of wrapping, so far-right elements (like the Email copy button) got shoved off-screen. Root cause was flex items' default min-width refusing to shrink; fixed with flex-wrap + min-width:0 + overflow-wrap on field rows, control rows, and stacked field-groups (Age/State/Password).
- DONE — Desktop two-column grid refinement: label/value pairs were stretching to the far edges of each ~400px grid cell, leaving an odd empty gap in the middle. Now they cluster on the left of each cell instead, matching how the single-column layout already reads.
- DONE — Label contrast: field labels (First Name, Street, etc.) were noticeably dimmer than their bold values and didn't draw the eye. Added a dedicated `--text-label` theme token (brighter than `--text-secondary` in dark mode, darker in light mode) and bumped label font-weight to 600.

## Final style pass — DONE
- Empty grid cell on desktop, actually caused by the CSV export row (not a `.field-group`, so it wasn't in the full-span rule and was landing in a single grid column with an empty cell beside it) — fixed by adding `.generator-panel > .export-row` to the full-span selector alongside `.field-group.stacked` and the Generate button.
- Long generated emails: user confirmed this is no longer an issue now that Email spans the full row on its own line — no character-limit change needed.

## Field grouping
- DONE — Date of Birth + Age grouped into one row (same underlying data), and City + State + Zip grouped into one row (one location). Each related value gets a compact label-over-value block (new `.field-item` class) instead of the full label-left/value-right row, so they can sit side by side. Rows wrap to fewer items per line on narrow screens automatically (flex-wrap, no separate breakpoint needed) rather than needing to be full-width or fully stacked — matches "same general area if not the same row." Age-range and state-select controls still live directly under their respective group.
- DONE — Age Range control moved from a control-row below DOB/Age into the same row as a third compact item (DOB, Age, and Age Range are all short/fixed values, so all three fit together). Bounds changed from 0-120 to 0-117.
- DONE — Username + Password grouped into one row, same pattern as DOB/Age and City/State/Zip.
- DONE — `.field-control-row` (Password's "Length & symbols", State's "Select state") now shrinks to its content width instead of stretching the full row — was noticeably oversized for what it holds.
- DONE — State-select control moved to lead the City/State/Zip row (was directly under it), matching the Age Range → DOB/Age pattern above: the control that drives the fields now comes before them instead of after.

## Investigated: "City/State/Zip randomly spreads wider on Generate"
- Not actually a Generate bug — regenerating only sets text content (renderPerson), no JS touches layout or styles. Confirmed via the two screenshots' own file dimensions: they were literally different browser window sizes (1806x2438 vs 1924x2328), not the same window before/after a click.
- The real, worth-fixing issue underneath: `.field-item` (used by every grouped row — DOB/Age/AgeRange, City/State/Zip, Full Name/SSN, Username/Password) had `flex-grow: 1`, so items stretched to fill whatever width was available in the row — meaning the same short values (e.g. "KS", "05489") could look tightly clustered or spread far apart purely based on window width, with nothing else changing. FIXED — flex-grow removed so items sit at their natural width and cluster together regardless of window size, consistent with how single-value rows already behave.
- DONE — SSN moved off its own row onto Full Name's row (right side) — not a data relationship, just two short values sharing space, same idea as elsewhere.
- DONE — Age Range control reordered to lead the DOB/Age row (was DOB, Age, Age Range → now Age Range, DOB, Age) so it reads as the control that produces the two fields after it.
- DONE — Found and fixed the actual cause of Full Name wrapping to a second line despite looking like it had room: the Full Name+SSN row wasn't spanning the full panel width on desktop — it was confined to a single ~400px grid cell (only groups with a control-row got the full-width span before), so it never actually got the space next to it that just looked empty on the page. Now spans full width like the other paired rows.

## Row alignment — DONE
- First Name and Last Name are now paired into one stacked field-group (field-row of two field-items), the same pattern as Full Name+SSN below them — the top of the page reads consistently with the grouped rows underneath it instead of two independent boxes next to a paired one.

## Next up
- Healthcare card — DONE, see "Healthcare Generator" below
- Banking card — DONE, see "Banking Generator" below
- Build out QA Tools card — logged wishlist below, not started

## Logged for later (not started) — from 2026-09-08 feedback

- **Street field position.** User's read: Street "sits precariously on the right side" and can run afoul of longer generated addresses. Root cause: Phone and Street are plain (non-stacked) field-groups that happen to land in the same grid row (Phone in the left ~400px column, Street in the right one) purely by DOM order/grid auto-placement — not because they're paired on purpose. That confines Street to a narrow column, the same underlying issue Full Name and Email each had before their full-width fixes.
  - Likely direction (not decided/built): give Street its own full-width row, same treatment as Email. That alone would orphan Phone into an empty half-row (the exact bug already fixed twice — Email, and the CSV export row) — so Phone would need the same full-width treatment too, not just Street alone. Tradeoff: costs one extra row of vertical height on desktop (Phone+Street go from one combined row to two full rows) in exchange for giving Street real room. Needs a decision before building, and the usual Safari check after.
- **More street name combinations.** Current word banks: 12 adjectives × 10 nouns × 7 suffixes = 840 possible combinations (`STREET_ADJECTIVES`, `STREET_NOUNS`, `STREET_SUFFIXES` in personal.js), deliberately excluding "Main" and any other real/common street names to avoid accidentally generating a real address. User confirmed a modest expansion of the word banks would be welcome — no specific count requested yet, just logged as wanting more variety, with the same real-address-avoidance care as the existing lists.
- **Condense First/Last/Full Name/SSN rows.** Spec written, not built: see `docs/identity-row-condense-spec.md`.

## Healthcare Generator (healthcare.html) — DONE, built 2026-09-08

Spec: `docs/healthcare-generator-spec.md`. First build of the second tool page, `js/healthcare.js`, wired up from the index.html card (was "Coming Soon").

- **MBI** — CMS-format-correct 11-character Medicare Beneficiary Identifier (verified against the official CMS format PDF), displayed dashed like a real card (`1EG4-TE5-MK73`). Verified: 5,000 generated MBIs all match the exact per-position character-class regex.
- **Enrollment Period → Part A/Part B Effective Date** — selector (IEP / GEP / SEP, or Random) drives both dates via the real medicare.gov coverage-start rules for each period. AEP and the Medicare Advantage OEP are plan-*switch* windows for existing enrollees, not initial Part A/B enrollment, so they're intentionally not part of this selector — logged below as a possible separate addition.
- **Plan Type → Payer / Member ID / Group Number** — 4 plan types (Original Medicare only, Medicare Advantage, Medigap+Part D, Part D only). Original Medicare correctly gets no private carrier (Payer = "Medicare (Original)", Member ID = the MBI itself, Group Number = "N/A" — Medicare doesn't use group numbers). Any plan type with a private carrier draws from a curated list of ~24 real, currently-operating US health insurers/Medicare carriers, with a plausible (not carrier-specific) generic Member ID/Group Number format.
- **Body Composition Range → Height / Weight / BMI** — "Standard" generates BMI 18.5-29.9; "Outside Standard Range" generates underweight (<18.5) or overweight/obese (≥30, with some extreme ≥40 outliers) for underwriting edge-case testing. Flagged clearly (in the spec and on the page's control label) as a general reference band, not a fixed regulatory or universal insurer cutoff.
- **CSV export** — same "records to export" + Export CSV pattern as Personal Generator.
- Every field group on this page is a full-width `field-group stacked` row from the start (no plain/paired-by-DOM-order groups) — deliberately sidesteps the empty-grid-cell bug class that hit Personal Generator twice.

Verified: `node --check`, HTML div-balance + duplicate-id checks, and a headless Node smoke test — MBI format (5,000 samples, 0 failures), GEP/IEP/SEP effective-date rules, Original Medicare vs. private-carrier coverage logic (500 samples each, 0 mismatches), BMI range boundaries (20,000 samples, 0 landed in the wrong band after a rounding-boundary bug the smoke test itself caught and got fixed), and CSV structure/escaping.

**Not yet done: a visual check in Safari** — same standing limitation as the Personal Generator style pass; this session still can't get a live render of a page from here.

- **NPI (Provider ID) + Medication/Condition/Diagnosis Code** — DONE, added 2026-09-08 after the initial Healthcare Generator build. NPI paired on the MBI row (real CMS check-digit algorithm, verified against CMS's own worked example). Medication selector (fixed pool of 20 real medications, each verified against icd10data.com for its paired ICD-10 code) drives Condition + Diagnosis Code. Full detail and the medication/code table: `docs/healthcare-generator-spec.md`.
- 2026-09-08 feedback, applied: Plan Type/Payer and Group Number/Member ID split into two fixed field-rows instead of one 4-item wrapping row, so Group Number and Member ID (reordered, Group Number first) always land on their own line together rather than drifting depending on value length. MBI's label now reads "Medicare ID (MBI)" for context, since MBI alone reads as jargon to anyone unfamiliar with the term.

### Logged for later, not built
- Delayed Part B effective date via employer-coverage SEP (separate from Part A's date).
- AEP / Medicare Advantage OEP as plan-*switch* dates, distinct from initial Part A/B enrollment.
- Tying this page's generated record to Personal Generator's (shared identity across tool pages) — each tool page is currently independent by design.

## Banking Generator (banking.html) — DONE, built 2026-09-08

Spec: `docs/banking-generator-spec.md`. Third tool page, `js/banking.js`, wired up from the index.html card.

- **Safe Mode** — checked by default, per explicit user request. When on, Bank Name/Routing/Account/Address are all obviously fake (fictional bank name, routing `111111111`, account `2222222222`, a placeholder street in NYC or Wilmington DE — user's own suggestion). The Bank dropdown visibly disables while Safe Mode is on, since it has no effect.
- **Bank → Bank Name/Routing Number, Account Number/Type** — 12 real US banks, each with a real ABA routing number verified against the bank's own site or Wise.com's routing database (all 12 independently re-checked against the actual ABA mod-10 checksum algorithm too — passed). HQ city/state is real per bank; the street and account number are always synthetic (no public registry to check account numbers against, same logic as SSN in Personal).
- **Card Network → Card Number/Expiration/CVV** — real network BIN prefixes (Visa/Mastercard/Amex/Discover) with a correct Luhn check digit, the same convention real payment processors' own published test numbers use. Independent of Safe Mode since it's already a "not tied to a real account" convention by construction.
- **CSV export** — same pattern as the other two pages.

Verified: `node --check`, HTML div-balance + duplicate-id checks, and a headless smoke test — all 12 routing numbers pass the real ABA checksum algorithm; 8,000 generated card numbers (4 networks × 2,000) all Luhn-valid, correct length, correct prefix; Safe Mode never leaks a real bank name/routing/account across 1,000 samples and correctly overrides an explicit bank selection; real mode never produces the safe-mode sentinel values; CSV structure checked.

**Not yet done: a visual look in Safari** — same standing limitation as every round this session.

### Logged for later, not built
- Regional routing-number variants — big banks (Chase, BofA, TD, etc.) actually have several real routing numbers depending on legacy-bank/state; this generator picked one well-documented number per bank rather than modeling every variant.

## QA Tools card — spec written 2026-09-08, not built

User's favorite planned page, per their own words. Full spec: `docs/qa-tools-generator-spec.md`.

**DONE, built 2026-09-08 (first pass, trimmed scope).** Per explicit instruction — "I do want to eliminate anything that relies on external libraries or costs me anything, so that stuff can go straight out" — this pass shipped only zero-dependency, zero-cost, native-browser-API tools. `qa-tools.html` + `js/qa-tools.js`, one page holding four tabbed categories (a new UI shape: input → transform → output, distinct from the record-generator pattern the other three pages use):
- **Text Tools** — whitespace cleanup (trim/collapse/optional blank-line removal), case conversion (9 styles: upper/lower/title/sentence/camel/pascal/snake/kebab/CONSTANT, via a camelCase-aware word tokenizer), a Hemingway-style readability analyzer (approximate Flesch-Kincaid grade level from a syllable-counting heuristic, passive-voice and adverb heuristics, long/very-long sentence flagging) with spelling handled by the browser's own native `spellcheck="true"` rather than a bundled dictionary.
- **Format & Validate** — JSON only (validate/pretty-print/minify via native `JSON.parse`/`stringify`, with a best-effort line/column on parse errors).
- **Encode/Decode** — Base64 (UTF-8 safe via TextEncoder/Decoder), URL, HTML entities (named + numeric).
- **Generators/Converters** — UUID v4 (`crypto.randomUUID()`), SHA-1/256/384/512 hashing (`crypto.subtle.digest`, MD5 deliberately excluded — not in Web Crypto and not worth hand-rolling), Unix↔date timestamp conversion, hex→RGB/HSL color conversion.

Cut from this pass, not stubbed — the three items that needed a library, a paid API, or ongoing cost:
1. **JS/SQL/XML/YAML formatting** (needs a real parser/library) — judged a genuine value-add with a bounded path back in, so the spec has vendor-vs-CDN instructions for adding it later without breaking the offline-first identity.
2. **Real grammar-checking** (needs a third-party API, e.g. LanguageTool) — also judged worth documenting; instructions are in the spec, flagged as a deliberate step away from "nothing leaves your browser" if it's ever added.
3. **The Hemingway "rewriter"** (needs an LLM API/backend) — not given a recipe, just flagged as a bigger, different-shaped conversation for later if wanted.

Verified: `node --check` on both changed JS files, HTML id-uniqueness check, and a headless Node smoke-test suite (case conversion incl. camelCase/PascalCase roundtrips, whitespace cleanup, Base64 UTF-8 roundtrip incl. emoji, HTML entity roundtrip, hex→RGB→HSL, readability grade-level ordering + passive-voice detection) plus Node's own Web Crypto (`crypto.webcrypto`) checked against a known SHA-256 test vector. Visual check in Safari still needed — see handoff.md.

## Ideas parked for later
- Stylish global nav to switch between any tool page from any other tool page (not just back-to-home). Revisit once there are 2-3 tool pages built, so the pattern reflects real navigation needs instead of a guess.

## Variety / dataset expansion
- DONE — Name dataset expanded from 30/30 to 166 first names / 123 last names, merged from a user-supplied CSV sample (deduped against the original curated list, nothing removed).
  - DONE — Weighted pick to fix the skew: split into `FIRST_NAMES_BALANCED`/`FIRST_NAMES_EXTRA` (30/136) and `LAST_NAMES_BALANCED`/`LAST_NAMES_EXTRA` (30/93) — the original hand-balanced 30/30 vs. the CSV-merged batch that skews toward common Western/Hispanic names. `pickName()` picks one of the two pools with equal 50/50 probability, then draws randomly within it, so the small balanced pool isn't drowned out by the much larger skewed one. Verified: ~50/50 draw rate across 20,000 samples, `generatePerson()` still produces correct records end to end.
- More street name word-bank variety (adjectives/nouns/suffixes) — re-flagged 2026-09-08, see "Logged for later" below for current combo count and constraints.
- More phone exchange variety within the existing N11-avoidance rule.
- DONE — Address dataset expanded from 1 verified city/zip per state to up to 75 per state (all ~22 for DC, which is genuinely one city), sourced from the official USPS ZIP locale list (docs/data/ZIP_Locale_Detail.csv). City/zip now lives in a new `STATE_CITIES` object in personal.js; `STATE_DATA` slimmed down to just name + area code. Area code stays one per state (unchanged, per-state accuracy was already good enough) — phone generation logic untouched.

## Password generator hardening — DONE
- Added a regenerate-on-collision guard: `buildPasswordAttempt()` holds the existing generation/shuffle logic, and `generatePassword()` retries it (up to 25 attempts) until the result has no run of 3+ identical characters, via a new `hasRepeatedRun()` check. No new UI, no customizable options, existing complexity guarantee untouched. Verified with a 10,000-password sample (lengths 8 and 12) — zero repeated runs.

## Password generator options (new UI controls)
- DONE — Length selector (8-64, default 12) and a symbols on/off toggle added, inline under the Password field (same pattern as State/Age). Complexity guarantee (1 upper, 1 lower, 1 number, +1 symbol if enabled) still enforced regardless of settings.

## Deferred by design
- Branching/release process — solo dev, nothing live to protect yet; will pick this up hands-on when it's actually needed.
- Full refactor/cleanup pass (section grouping, consistent comments) — planned after more cards are built, not after every feature.

## Email full-width fix
- DONE — Same bug as Full Name: Email was a plain (non-stacked) field-group with no plain sibling to pair with (City/State/Zip stacked before it, Username/Password stacked after it), so it landed alone in a single ~400px grid cell with an empty cell beside it — not the full width it visually appeared to have. Now spans the full row like the other fixed rows.
- Note (2026-09-08): Phone/Street being "properly paired" turned out to still be a problem — see "Logged for later" below. Pairing them avoided the orphaned-cell bug, but it confines Street to a narrow ~400px column, which is cramped for longer generated addresses.

## Export to CSV (done)
- Spec: docs/csv-export-spec.md. Exports all fields as they appear, with a record-count input (default 1, max 500) next to a new Export CSV button below Generate.
- Reuses generatePerson() per row. Handles comma/quote/newline escaping, CRLF line endings, filename stamped with the date (nebo-personal-records-YYYYMMDD.csv).
- Verified: node syntax check, HTML/CSS balance checks, headless smoke test of generateCsv/escapeCsvField with sample data.
