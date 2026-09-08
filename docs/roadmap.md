# Project Nebo — Roadmap

## Personal Generator — nearing done
- Name-dataset expansion and password options are both done. Next action per user: a style pass (revision/refactor/reduction) — the pre-release refactor pass already noted under "Deferred by design" below. No new fields planned before that.
- DONE (first style-pass item) — Responsive layout fix: header/back-bar and the generator panel now share one width via a `body.tool-page` shell class (900px cap), so they line up on the same edges instead of the header spanning full width while the panel floats centered on its own. Below ~800px window width the panel stays a single centered column (reads as "mobile" whether it's a phone or a shrunk desktop window); above it, the panel becomes a real two-column grid so a full desktop window isn't wasted on a narrow strip with empty space on both sides. `body.tool-page` is meant to be the standard pattern for future tool pages too, same as the back-nav bar.
- Color palette is intentionally NOT part of this pass — user said the current white/dark-blue look can wait until more tool pages exist, so there's more to design against.
- DONE — Mobile overflow fix: long unbroken values (email addresses, longer generated passwords, longer street names) were pushing rows wider than the card instead of wrapping, so far-right elements (like the Email copy button) got shoved off-screen. Root cause was flex items' default min-width refusing to shrink; fixed with flex-wrap + min-width:0 + overflow-wrap on field rows, control rows, and stacked field-groups (Age/State/Password).
- DONE — Desktop two-column grid refinement: label/value pairs were stretching to the far edges of each ~400px grid cell, leaving an odd empty gap in the middle. Now they cluster on the left of each cell instead, matching how the single-column layout already reads.
- DONE — Label contrast: field labels (First Name, Street, etc.) were noticeably dimmer than their bold values and didn't draw the eye. Added a dedicated `--text-label` theme token (brighter than `--text-secondary` in dark mode, darker in light mode) and bumped label font-weight to 600.

## Still open for the final style pass
- Empty grid cell next to Username on desktop (Password is full-width, so nothing pairs with Username in the second column) — cosmetic, not a bug, flagged for consideration alongside the rest.
- Longer emails (e.g. "elizabeth.johnson233@example.net") are still long enough to wrap the row to a second line even with the overflow fix — user is considering a character limit on generated emails as part of the style pass, rather than more layout tweaking.

## Field grouping
- DONE — Date of Birth + Age grouped into one row (same underlying data), and City + State + Zip grouped into one row (one location). Each related value gets a compact label-over-value block (new `.field-item` class) instead of the full label-left/value-right row, so they can sit side by side. Rows wrap to fewer items per line on narrow screens automatically (flex-wrap, no separate breakpoint needed) rather than needing to be full-width or fully stacked — matches "same general area if not the same row." Age-range and state-select controls still live directly under their respective group.
- DONE — Age Range control moved from a control-row below DOB/Age into the same row as a third compact item (DOB, Age, and Age Range are all short/fixed values, so all three fit together). Bounds changed from 0-120 to 0-117.
- DONE — Username + Password grouped into one row, same pattern as DOB/Age and City/State/Zip.
- DONE — `.field-control-row` (Password's "Length & symbols", State's "Select state") now shrinks to its content width instead of stretching the full row — was noticeably oversized for what it holds.
- OPEN — User isn't sure yet whether the State control's position (currently directly under the City/State/Zip row) is right, wants to reconsider later. No change made.
- DONE — SSN moved off its own row onto Full Name's row (right side) — not a data relationship, just two short values sharing space, same idea as elsewhere.
- DONE — Age Range control reordered to lead the DOB/Age row (was DOB, Age, Age Range → now Age Range, DOB, Age) so it reads as the control that produces the two fields after it.

## Next up
- Build out Healthcare card (MBI, Medicare Part A/B dates, coverage info)
- Build out Banking card
- Build out QA Tools card (JSON/XML/SQL formatters)

## Ideas parked for later
- Stylish global nav to switch between any tool page from any other tool page (not just back-to-home). Revisit once there are 2-3 tool pages built, so the pattern reflects real navigation needs instead of a guess.

## Variety / dataset expansion
- DONE — Name dataset expanded from 30/30 to 166 first names / 123 last names, merged from a user-supplied CSV sample (deduped against the original curated list, nothing removed). Note: the added names skew toward common Western/Hispanic surnames since that's what the source file was dominated by — the original 30/30 was deliberately balanced across regions, so the overall pool is now less evenly weighted than before. Worth a look if even representation across generations matters for a given test run.
  - User confirmed: preferred the more evenly-balanced original mix, and the merged-in CSV was intentionally curated to match real US demographic skew by race, not equal representation. Not a priority to fix right now, but flagged as wanting a revisit later — e.g. weighting picks instead of a flat pool, or curating a second balanced batch to blend in.
- More street name word-bank variety (adjectives/nouns/suffixes).
- More phone exchange variety within the existing N11-avoidance rule.
- DONE — Address dataset expanded from 1 verified city/zip per state to up to 75 per state (all ~22 for DC, which is genuinely one city), sourced from the official USPS ZIP locale list (docs/data/ZIP_Locale_Detail.csv). City/zip now lives in a new `STATE_CITIES` object in personal.js; `STATE_DATA` slimmed down to just name + area code. Area code stays one per state (unchanged, per-state accuracy was already good enough) — phone generation logic untouched.

## Password generator hardening
- Add a regenerate-on-collision guard against 3+ identical characters in a row (some strict policies reject repeated-character runs). Small, contained fix — no new UI, no customizable options.

## Password generator options (new UI controls)
- DONE — Length selector (8-64, default 12) and a symbols on/off toggle added, inline under the Password field (same pattern as State/Age). Complexity guarantee (1 upper, 1 lower, 1 number, +1 symbol if enabled) still enforced regardless of settings.

## Deferred by design
- Branching/release process — solo dev, nothing live to protect yet; will pick this up hands-on when it's actually needed.
- Full refactor/cleanup pass (section grouping, consistent comments) — planned after more cards are built, not after every feature.
