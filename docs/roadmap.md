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
- Expand address dataset from 1 verified city/zip per state to 50+ per state, each with a matching area code (multiple towns/area codes per state, not just the one currently on file). Bigger lift — needs real research/verification per city, not a quick fill-in. Do not start until explicitly asked.
  - Source found for the city/zip half: user supplied an official USPS city/state/zip list (~29.5k rows, all 50 states + DC + territories covered), saved at docs/data/ZIP_Locale_Detail.csv — solves city/zip coverage.
  - Area code accuracy per city is a lower bar than originally assumed (cell phones + people moving around means it doesn't need to be tightly correct) — one reasonable area code per state is fine, no need to source/verify per-city area codes.
  - Still not started — waiting on explicit go-ahead.

## Password generator hardening
- Add a regenerate-on-collision guard against 3+ identical characters in a row (some strict policies reject repeated-character runs). Small, contained fix — no new UI, no customizable options.

## Deferred by design
- Branching/release process — solo dev, nothing live to protect yet; will pick this up hands-on when it's actually needed.
- Full refactor/cleanup pass (section grouping, consistent comments) — planned after more cards are built, not after every feature.
