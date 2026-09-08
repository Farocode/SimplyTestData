# Spec: condense the First/Last/Full Name/SSN rows

Status: **spec only, not implemented.** Logged 2026-09-08 per user request to "consider and spec" this before building it.

## Current state

Two separate rows at the top of the panel:

- Row 1 (`field-group stacked`, one `field-row`): First Name, Last Name — 2 `field-item`s
- Row 2 (`field-group stacked`, one `field-row`): Full Name, SSN — 2 `field-item`s

Each row gets its own border-bottom, its own vertical padding, and spans the full panel width on desktop. Four related identity values, two rows.

## Proposed change

Merge both rows into a single `field-group stacked` with one `field-row` containing all four as `field-item`s, in this order: **First Name, Last Name, Full Name, SSN**.

This reuses the exact pattern already in place for DOB/Age/Age Range and City/State/Zip (a `field-row` holding 3 short values that wrap to fewer per line on narrow screens via `flex-wrap`, no new breakpoint needed) — just with 4 items instead of 3. No new CSS should be required; `.field-item`'s existing `flex: 0 1 auto; min-width: 90px` and the row's `flex-wrap` should handle it.

Nothing is removed: First Name, Last Name, Full Name, and SSN all stay individually visible and copyable — First/Last stay separate because a lot of real forms have separate first/last inputs, and Full Name stays because it's still handy for single-field name inputs, even though it's derived from First+Last.

## Open questions / things to decide before building

1. **Item order** — First, Last, Full Name, SSN reads as "parts, then whole, then the odd one out." An alternative is Full Name, SSN, First, Last (headline value first). Recommend the first (parts → whole) since it matches how Age Range → DOB → Age and State → City/State/Zip already read left-to-right as build-up order.
2. **Density** — four short values on one row is more visually busy than two clean rows, even though it saves vertical space. Worth an actual look in Safari before committing to it, not just a code read.
3. **Fallback if too dense**: drop Full Name from the row entirely (First | Last | SSN only, 3 items) since it's derivable and the space savings would be larger. This trades away a currently-working, verified field/copy button, so it's a fallback, not the default recommendation.
4. Standard verification-not-done caveat: like the last style pass, this session can't get a live render of the page, so any implementation of this spec still needs your usual Safari check before calling it done.

## Not in scope for this spec

Street/Phone repositioning and street name variety are logged separately in `docs/roadmap.md` — unrelated to this row.
