# Project Nebo — Handoff (for next chat)

Date: 2026-09-08

## Where things stand

Personal Generator (`personal.html`) is feature- and style-complete for this round — the final style pass (row alignment, empty grid cell, name balance, state-control position, password hardening) is **committed and pushed** already.

This session's only remaining changes are documentation — `docs/roadmap.md` updated and a new `docs/identity-row-condense-spec.md` added — **not yet committed**. No code changed this round.

Repo: `~/Documents/GitHub/project-nebo` on the Mac (linked via device bridge). GitHub Pages: farocode.github.io/project-nebo/

## What happened this session

You gave three pieces of feedback after the style pass; all were logging/spec requests, nothing was built:

1. **Street field position** — you flagged Street sitting "precariously on the right side," at risk with longer addresses. Logged in `docs/roadmap.md` under "Logged for later," with the likely direction spelled out: give Street its own full-width row like Email got, and Phone would need the same treatment to avoid orphaning it into an empty half-row (the same bug pattern already fixed twice this project). Not built — needs a decision on the vertical-space tradeoff first.
2. **More street name variety** — you said a few more word-bank combinations wouldn't hurt (current: 12 adjectives × 10 nouns × 7 suffixes = 840 combos, deliberately avoiding real street names). Logged, no specific count requested yet.
3. **Condense the First/Last/Full Name/SSN rows** — you asked for this to be spec'd, not built. Spec is in `docs/identity-row-condense-spec.md`: proposes merging the two rows into one `field-row` with all four as `field-item`s (First, Last, Full Name, SSN), reusing the existing 3-item-row pattern. Nothing would be removed. Spec flags open questions (item order, whether 4-in-a-row reads as too dense, a fallback of dropping Full Name if so) for you to weigh in on before it gets built.

## Not yet done — needs a look

1. **Commit and push** the roadmap/spec doc updates from this session.
2. All three logged items above are unbuilt — next session should confirm direction (especially the Street/Phone tradeoff and the row-condense open questions) before writing any code.
3. Standing item: this session still can't get a live render of the page (tried a local server + the built-in browser last time, didn't work) — any future layout change here still needs your usual Safari check.

## Next up (bigger picture)

Once the three logged items above are resolved (or deliberately deferred), the natural next steps per the roadmap are:
- Build out the Healthcare card (MBI, Medicare Part A/B dates, coverage info)
- Build out the Banking card
- Build out the QA Tools card (JSON/XML/SQL formatters)
- A pre-release refactor/cleanup pass across the codebase (after more cards exist, not before)
- A color/style pass beyond the current white/dark-blue look, once there's more than one tool page to design against

## Dev loop reminder

Sublime Text (edit) → Safari (local preview) → GitHub Desktop (commit/push). Full-file replacement is safer than partial pastes when moving code from chat into Sublime. Mac sleeps when you step away, so the device link drops between sessions — that's expected, not a bug.
