# Spec: CSV Export (Personal Generator)

Status: proposed, not started. For review — not committing to build yet.

## What it does
Adds a way to generate multiple independent records at once and download
them as a CSV, instead of only ever having the one record shown on screen.

## UI
One new control near the Generate button:
- A number input, "Records to export" (default 1, min 1, max 500 — cap is
  just to stop a mistyped huge number from freezing the browser tab).
- An "Export CSV" button.

Nothing about the existing single-record display/Generate button changes.

## Behavior
- Export CSV runs the existing `generatePerson()` function N times (using
  whatever Age Range / State / Password settings are currently set), so
  each row is a fully independent random record — not N copies of the one
  on screen.
- Columns match the fields as they currently appear on the page, in the
  same order: First Name, Last Name, Full Name, SSN, Date of Birth, Age,
  Phone, Street, City, State, Zip, Email, Username, Password. (Age Range
  and State Select are generation controls, not data, so they're not
  columns.)
- Runs entirely in the browser — builds the CSV text in JS, triggers a
  download via a Blob + temporary link. No server, no library needed.
- Filename: something like `nebo-personal-<N>-records-<date>.csv`.

## Edge cases
- Non-numeric or blank input defaults to 1.
- Every field gets quoted defensively (in case a future data source ever
  introduces a comma or quote into a value) even though none currently do.

## Effort
Small. Reuses `generatePerson()` as-is — no changes to existing generator
logic. New code is roughly:
- A loop that calls `generatePerson()` N times.
- A CSV-formatting function (rows → quoted/escaped CSV text).
- A tiny download trigger (Blob + `<a download>`).
- One number input + one button in the HTML, a bit of CSS to match the
  existing control styling.

No new dependencies. Low risk — doesn't touch anything already working.
