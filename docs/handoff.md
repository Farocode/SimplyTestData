# Project Nebo — Handoff (for next chat)

Date: 2026-09-08

## Where things stand

Banking Generator (`banking.html`) is built — the project's third tool page, wired up from the index.html card. **Not yet committed/pushed.** Healthcare's NPI/Medication round from earlier today is also still uncommitted, stacked underneath this.

Repo: `~/Documents/GitHub/project-nebo` on the Mac (linked via device bridge). GitHub Pages: farocode.github.io/project-nebo/

## What just got built (this session, this round)

Spec-then-build per your description (real banks/routing/account, safe mode default-on with all-1s/all-2s/fake name) plus one confirmed addition (payment card field). Spec: `docs/banking-generator-spec.md`, roadmap entry in `docs/roadmap.md`.

- **Safe Mode** — checked by default, exactly as you asked. Fictional bank name, routing `111111111`, account `2222222222`, placeholder street in NYC or Wilmington DE (your own suggestion, alternated randomly). The Bank dropdown visibly grays out while Safe Mode is on, since it's a no-op then.
- **Bank → Bank Name/Routing Number, Account Number/Type** — 12 real US banks with real ABA routing numbers, each individually sourced (bank's own site where available, otherwise Wise.com's routing database) — full table with sources is in the spec. As an extra check, all 12 independently passed the real ABA checksum algorithm too. Account numbers are always synthetic even in real mode (no public registry to check against, same logic as SSN in Personal).
- **Card Network → Card Number/Expiration/CVV** — Visa/Mastercard/Amex/Discover, real BIN prefixes with a correct Luhn check digit, same convention as the official test card numbers payment processors publish. This one's independent of Safe Mode since it's already "obviously not a real account" by construction.
- **CSV export** — same pattern as the other two pages.

Files: `banking.html`, `js/banking.js` (new), `index.html` (Banking card now links to the tool), `docs/banking-generator-spec.md` (new), `docs/roadmap.md`.

## Verification done

- `node --check js/banking.js` — syntax OK
- HTML div-balance and duplicate-id checks — OK
- Headless Node smoke test: all 12 routing numbers verified against the real ABA mod-10 checksum (independent of the sourcing); 8,000 generated card numbers (4 networks × 2,000 each) all Luhn-valid with correct length and prefix; Safe Mode checked across 1,000 samples — never produced a real bank name/routing, and correctly overrode an explicit bank selection; real mode checked across 1,000 samples — never produced the safe-mode sentinel values; CSV structure checked.
- **Not yet done: a visual look in Safari.** Same standing limitation as every round this session.

## Not yet done — needs a look

1. **Commit and push** — this covers both this Banking round and the earlier Healthcare NPI/Medication round today.
2. **Visual check in Safari**, especially the Safe Mode checkbox/disable behavior and the 4-item Card Network row.
3. Still open from earlier rounds, untouched: Street/Phone position on Personal, more street name combos, condense the Personal Generator identity rows. See `docs/roadmap.md`'s "Logged for later" sections and `docs/identity-row-condense-spec.md`.
4. **QA Tools is next** — you gave a first wishlist mid-session (JSON/JS/SQL formatting and validation, spelling/grammar, a Hemingway-style rewriter, whitespace trim, case conversion — capitalize/camelCase/lowercase/etc., and a general "keep it lightweight, no separate apps" principle). Logged in `docs/roadmap.md` under "QA Tools card — wishlist," not scoped or spec'd yet.

## Next up (bigger picture)

Per the roadmap: build out QA Tools (your stated favorite), then a pre-release refactor/cleanup pass across the codebase now that there are three tool pages, and a color/style pass beyond the current white/dark-blue look.

## Dev loop reminder

Sublime Text (edit) → Safari (local preview) → GitHub Desktop (commit/push). Full-file replacement is safer than partial pastes when moving code from chat into Sublime. Mac sleeps when you step away, so the device link drops between sessions — that's expected, not a bug.
