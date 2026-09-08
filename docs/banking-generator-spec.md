# Spec: Banking Generator (banking.html)

Status: spec written 2026-09-08, about to be built this session.

## Safety design (the core requirement)

Per user request: **Safe Mode is on by default.** When on, every bank-identity field is obviously, unmistakably fake:

- Bank Name: drawn from a small pool of clearly fictional names (e.g. "Test National Bank," "Sample Trust Bank") — never a real bank name, never close enough to one to be confused for it.
- Routing Number: `111111111` (nine 1's) — not a real, checksum-valid ABA number.
- Account Number: `2222222222` (ten 2's).
- Bank Address: a clearly placeholder street (e.g. "123 Placeholder Ave") in a real financial-hub city (NYC or Wilmington, DE — user's own suggestion, alternated randomly) with that city's real zip. The city/state being real is fine (public, non-sensitive); the street is the obviously-fake part.

When Safe Mode is off (user must actively uncheck it), the generator produces real bank names paired with each bank's real, verified ABA routing number, and a real HQ city for the address — see "Real bank data" below for why this is fine to do, and what's deliberately *not* faked even in "off" mode.

The Bank selector is disabled (grayed out) whenever Safe Mode is checked, since it has no effect while Safe Mode overrides Name/Routing — re-enabled the moment Safe Mode is unchecked.

## Real bank data — why it's fine, and what's verified vs. not

Bank names and ABA routing numbers are public directory information: routing numbers are printed on every check a bank issues and are freely searchable (this is precisely how they were verified below — official bank sites where available, otherwise Wise.com's routing number database, a widely-used reference). A routing number alone cannot move money — it identifies the institution for a transaction, nothing more, the same category of "real but public" data already used elsewhere in this project (real insurer names in Healthcare, real city/zip pairs in Personal).

**What's real:** bank name, routing number, HQ city/state (all public, verified below).
**What's always synthetic, even in "off" mode:** the account number (there's no public registry of real account numbers to avoid or match — same logic as SSN in Personal, a valid-*format* number that isn't a real assigned one) and the street-level address (a real HQ city paired with a made-up street, never a claim about the bank's actual literal street address — same pattern as Personal's real-city + fictional-street approach).

### Verified bank + routing number list

| Bank | Routing Number | Source | HQ City, State |
|---|---|---|---|
| JPMorgan Chase | 021000021 | [Wise](https://www.wise.com/us/routing-number/bank/chase) (NY wire routing) | New York, NY |
| Bank of America | 026009593 | [Wise](https://wise.com/us/routing-number/026009593) | Charlotte, NC |
| Wells Fargo | 121000248 | [wellsfargo.com](https://www.wellsfargo.com/help/routing-number/) (official) | San Francisco, CA |
| Citibank | 021000089 | [Wise](https://wise.com/us/routing-number/citibank) (NY) | New York, NY |
| U.S. Bank | 071004200 | [Wise](https://www.wise.com/us/routing-number/us-bank/ohio) | Minneapolis, MN |
| Capital One | 065000090 | [Wise](https://wise.com/us/routing-number/065000090) (VA) | McLean, VA |
| PNC Bank | 043000122 | [Wise](https://wise.com/us/routing-number/043000122) (PA) | Pittsburgh, PA |
| TD Bank | 031201360 | [Wise](https://wise.com/us/routing-number/031201360) (ME) | Cherry Hill, NJ |
| Truist Bank | 064000046 | [Wise](https://wise.com/us/routing-number/064000046) (NC) | Charlotte, NC |
| USAA Federal Savings Bank | 314074269 | [Wise](https://wise.com/us/routing-number/314074269) (TX) | San Antonio, TX |
| Navy Federal Credit Union | 256074974 | [Wise](https://wise.com/us/routing-number/256074974) (VA) | Vienna, VA |
| Citizens Bank | 211070078 | [Wise](https://wise.com/us/routing-number/211070078) (RI) | Providence, RI |

Caveat worth knowing: large banks (Chase, BofA, TD, etc.) actually have *several* real routing numbers depending on which state/legacy-bank an account traces back to (a side effect of decades of mergers). One well-documented number per bank was picked for this generator rather than trying to model every regional variant — noted here so it's not mistaken for the *only* real routing number that bank uses.

## Fields

1. **Safe Mode** toggle (checkbox, checked by default) — own row, drives Bank Name/Routing/Account/Address everywhere below.
2. **Bank** control (leads, disabled while Safe Mode is on) → **Bank Name** | **Routing Number** (one row), then **Account Number** | **Account Type** (Checking/Savings, second fixed row) — same two-fixed-rows pattern as Plan Type/Payer + Group Number/Member ID in Healthcare.
3. **Bank Address** — Street | City | State | Zip (one row, no control — driven by Safe Mode + Bank together).
4. **Card Network** control (leads) → **Card Number** | **Expiration** | **CVV** (one row). Independent of Safe Mode — see below.
5. Generate button.
6. CSV export row — same pattern as the other two pages.

## Card Number generation

Real network BIN prefixes + a correct Luhn check digit — the same convention every payment processor's own published test/dummy card numbers already use (e.g. Visa's official test number `4111111111111111` is exactly this: a real prefix, a valid Luhn check digit, not tied to any actual issued card). A randomly generated number built the same way carries the same "obviously a test number, not a real card" property by construction, so it isn't gated behind Safe Mode the way bank identity fields are.

- Visa: prefix `4`, 16 digits, 3-digit CVV.
- Mastercard: prefix `51`-`55`, 16 digits, 3-digit CVV.
- American Express: prefix `34` or `37`, 15 digits, 4-digit CVV.
- Discover: prefix `6011` or `65`, 16 digits, 3-digit CVV.

Luhn algorithm (standard, not company-specific — the same checksum used industry-wide): double every second digit counting from the rightmost digit of the *prefix* (i.e. the digit immediately left of where the check digit will go), subtract 9 from any doubled result over 9, sum everything, check digit = `(10 - (sum % 10)) % 10`.

Expiration date: a random month/year 1-48 months in the future from today, formatted MM/YY.

## CSV export

Same pattern as the other two pages: "Records to export" + Export CSV button, same escaping/CRLF/filename conventions (`nebo-banking-records-YYYYMMDD.csv`).
