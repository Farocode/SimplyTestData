# Project Nebo — Roadmap

## Personal Generator — nearing done
- Name-dataset expansion and password options are both done. Next action per user: a style pass (revision/refactor/reduction) — the pre-release refactor pass already noted under "Deferred by design" below. No new fields planned before that.

## Next up
- Build out Healthcare card (MBI, Medicare Part A/B dates, coverage info)
- Build out Banking card
- Build out QA Tools card (JSON/XML/SQL formatters)

## Ideas parked for later
- Stylish global nav to switch between any tool page from any other tool page (not just back-to-home). Revisit once there are 2-3 tool pages built, so the pattern reflects real navigation needs instead of a guess.

## Variety / dataset expansion
- DONE — Name dataset expanded from 30/30 to 166 first names / 123 last names, merged from a user-supplied CSV sample (deduped against the original curated list, nothing removed). Note: the added names skew toward common Western/Hispanic surnames since that's what the source file was dominated by — the original 30/30 was deliberately balanced across regions, so the overall pool is now less evenly weighted than before. Worth a look if even representation across generations matters for a given test run.
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
