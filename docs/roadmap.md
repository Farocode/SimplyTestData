# Project Nebo — Roadmap

## Next up
- Build out Healthcare card (MBI, Medicare Part A/B dates, coverage info)
- Build out Banking card
- Build out QA Tools card (JSON/XML/SQL formatters)

## Ideas parked for later
- Stylish global nav to switch between any tool page from any other tool page (not just back-to-home). Revisit once there are 2-3 tool pages built, so the pattern reflects real navigation needs instead of a guess.

## Variety / dataset expansion
- More name variety (first/last name pools are currently 30/30).
- More street name word-bank variety (adjectives/nouns/suffixes).
- More phone exchange variety within the existing N11-avoidance rule.
- DONE — Address dataset expanded from 1 verified city/zip per state to up to 75 per state (all ~22 for DC, which is genuinely one city), sourced from the official USPS ZIP locale list (docs/data/ZIP_Locale_Detail.csv). City/zip now lives in a new `STATE_CITIES` object in personal.js; `STATE_DATA` slimmed down to just name + area code. Area code stays one per state (unchanged, per-state accuracy was already good enough) — phone generation logic untouched.

## Password generator hardening
- Add a regenerate-on-collision guard against 3+ identical characters in a row (some strict policies reject repeated-character runs). Small, contained fix — no new UI, no customizable options.

## Deferred by design
- Branching/release process — solo dev, nothing live to protect yet; will pick this up hands-on when it's actually needed.
- Full refactor/cleanup pass (section grouping, consistent comments) — planned after more cards are built, not after every feature.
