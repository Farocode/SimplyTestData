# Spec: Healthcare Generator (healthcare.html)

Status: spec written 2026-09-08, about to be built this session.

## Sources checked (accuracy matters — these are real formats/rules real backends validate against)

- MBI character format: [CMS — Understanding the MBI Format (PDF)](https://www.cms.gov/medicare/new-medicare-card/understanding-the-mbi-with-format.pdf)
- Medicare enrollment periods & coverage-start rules: [medicare.gov — When does Medicare coverage start](https://www.medicare.gov/basics/get-started-with-medicare/sign-up/when-does-medicare-coverage-start), [medicare.gov — Open Enrollment](https://www.medicare.gov/health-drug-plans/open-enrollment), [UHC — Medicare Advantage OEP](https://www.uhc.com/news-articles/medicare-articles/what-is-the-medicare-advantage-open-enrollment-period)
- Current major carrier names (still active 2026): [Healthcare Dive — 2026 MA plan coverage](https://www.healthcaredive.com/news/medicare-advantage-plans-2026-unitedhealthcare-humana-aetna/801761/), general market knowledge

## Field list

All groups are full-width `field-group stacked` rows (like Email in Personal) — deliberately avoiding the plain/paired-by-DOM-order pattern that caused the empty-grid-cell bug twice already in Personal Generator. No plain field-groups on this page.

1. **MBI** — own row, single value + copy button. Label reads "Medicare ID (MBI)" (2026-09-08: added "Medicare ID" context per feedback — MBI on its own reads as inside baseball to anyone not already familiar with the term).
2. **Enrollment Period** control (leads the row) → **Part A Effective Date** | **Part B Effective Date** (2 field-items, one row) — same "control leads the fields it drives" pattern as Age Range → DOB/Age.
3. **Plan Type** control (leads the row) → **Plan Type** | **Payer** on one line, then **Group Number** | **Member ID** on a fixed second line (2026-09-08: split into two fixed field-rows rather than one 4-item wrapping row, per feedback — Group Number/Member ID were landing on a different line depending on which values happened to be longest; now they always share their own line, in that order).
4. **Body Composition Range** control (leads the row) → **Height** | **Weight** | **BMI** (3 field-items, one row).
5. Generate button.
6. CSV export row — same "records to export" + button pattern as Personal.

## MBI generation

11 characters, positions per the CMS format (dashes below are visual only, same as CMS's own display convention `1EG4-TE5-MK73` — displayed with dashes, copy button copies the dashed display value):

| Position | Type | Allowed |
|---|---|---|
| 1 | numeric | 1-9 |
| 2 | alpha | A-Z excluding S,L,O,I,B,Z |
| 3 | alphanumeric | 0-9 and A-Z excluding S,L,O,I,B,Z |
| 4 | numeric | 0-9 |
| 5 | alpha | A-Z excluding S,L,O,I,B,Z |
| 6 | alphanumeric | 0-9 and A-Z excluding S,L,O,I,B,Z |
| 7 | numeric | 0-9 |
| 8 | alpha | A-Z excluding S,L,O,I,B,Z |
| 9 | alpha | A-Z excluding S,L,O,I,B,Z |
| 10 | numeric | 0-9 |
| 11 | numeric | 0-9 |

MBIs are "non-intelligent" (randomly generated, no embedded meaning) per CMS, so a flat random generator per position is correct — no checksum to replicate.

## Enrollment Period → Part A/B effective dates

Selector options: **Initial Enrollment Period (IEP)**, **General Enrollment Period (GEP)**, **Special Enrollment Period (SEP)**. (Annual Enrollment Period and the Medicare Advantage OEP are plan-*switch* windows for people already enrolled, not initial Part A/B enrollment — logged as a possible future addition below, not built now, since they don't drive a Part A/B effective date the way IEP/GEP/SEP do.)

Part A and Part B share one effective date in this model (the common case). Delayed Part B via employer-coverage SEP would need its own date, logged as a future refinement.

- **IEP**: 7-month window, 3 months before the birth month through 3 months after. Model: pick a birth month, pick a signup offset from -3 to +3 relative to it.
  - Signup in the 3 months *before* birth month → effective date = 1st of birth month.
  - Signup *in* birth month or the 3 months after → effective date = 1st of the month *after* signup.
- **GEP**: signup date is a random day in Jan 1 – Mar 31 of a given year → effective date = 1st of the month after signup.
- **SEP**: signup date is a random recent date (qualifying-event windows vary by circumstance — job loss, Medicaid loss, disaster, etc. — modeled generically rather than per-event) → effective date = 1st of the month after signup.

## Plan Type → Payer / Member ID / Group Number

Four plan types, randomly weighted: Original Medicare only, Medicare Advantage (Part C), Original Medicare + Medigap + Part D, Original Medicare + Part D only.

- **Original Medicare only**: Payer = "Medicare (Original)", Member ID = same value as the generated MBI (accurate — Original Medicare doesn't issue a separate member ID), Group Number = "N/A" (Original Medicare has no group numbers).
- **Any plan type with a private carrier** (Advantage, Medigap, Part D): Payer = random pick from a curated list of ~20 real, currently-operating US health insurers/Medicare carriers (UnitedHealthcare, Humana, Aetna, Cigna Healthcare, Elevance Health/Anthem, Kaiser Permanente, Centene, Molina Healthcare, Highmark, Blue Cross Blue Shield of Michigan, Independence Blue Cross, Blue Shield of California, EmblemHealth, HCSC, Florida Blue/GuideWell, CareFirst BlueCross BlueShield, WellCare, Oscar Health, Devoted Health, Clover Health, SCAN Health Plan, UPMC Health Plan, Priority Health, Regence BlueCross BlueShield). Member ID and Group Number are generated in a plausible generic alphanumeric format — real carriers each use their own scheme, so these are plausible-format test values, not validated against any one carrier's real ID format (same "plausible, not precision-tied" approach already used for phone area codes in Personal).

## Height / Weight / BMI

- Height: random 58–76 inches (4'10"–6'4"), displayed as feet'inches.
- BMI formula: `(weight_lbs / height_in²) × 703`.
- **Body Composition Range** control: "Standard" generates a BMI in the 18.5–29.9 band; "Outside standard range" generates one below 18.5 or at/above 30 (including some extreme outliers ≥40) — for exercising underwriting edge cases in QA.
  - **Caveat to flag to the user**: 18.5–29.9 is a general reference band, not a fixed regulatory or universal insurer cutoff — real underwriting tables vary by carrier and product, and Medicare Part A/B itself has no BMI-based eligibility test (guaranteed issue). This control is meant for exercising edge-case logic in whatever system is being tested, not for replicating one specific real insurer's table.
- Weight generated to fit the chosen BMI band at the chosen height, displayed in lbs.

## CSV export

Same pattern as Personal Generator: "Records to export" number input (default 1, max 500) + Export CSV button, reusing per-record generation, comma/quote/newline escaping, CRLF line endings, filename `simply-test-data-healthcare-records-YYYYMMDD.csv`.

## Added 2026-09-08: NPI, Medication/Condition/Diagnosis Code

Three fields added after the initial build, per follow-up feedback:

- **NPI (Provider ID)** — paired with MBI on its own row (same "two short ID values, no control needed" pattern as First/Last Name in Personal). 10 digits: 9 random base digits (first digit non-zero) + 1 Luhn check digit, computed per [CMS's NPI check digit spec](https://www.cms.gov/Regulations-and-Guidance/Administrative-Simplification/NationalProvIdentStand/Downloads/NPIcheckdigit.pdf) (the constant 24 substituting for the "80840" card-issuer prefix). Verified against CMS's own worked example (base `123456789` → check digit `3`).
- **Medication → Condition / Diagnosis Code (ICD-10)** — a fixed pool of 20 real, common medications (per user request: "select up to 20 different medications" = a fixed generator-side pool, not a user-facing picker), each paired with the condition it's typically prescribed for and a verified ICD-10-CM code. Every code was checked individually against icd10data.com (not just recalled) — see the table below. A Medication selector (leads the row, same pattern as Plan Type/Enrollment Period) drives Condition and Diagnosis Code together; "Random" (default) draws one of the 20 pool entries per record, same as the other selectors on this page.

| Medication | Condition | ICD-10 |
|---|---|---|
| Metformin | Type 2 Diabetes | E11.9 |
| Lisinopril | Hypertension | I10 |
| Atorvastatin | High Cholesterol | E78.5 |
| Levothyroxine | Hypothyroidism | E03.9 |
| Albuterol | Asthma | J45.909 |
| Omeprazole | GERD | K21.9 |
| Amlodipine | Hypertension | I10 |
| Metoprolol | Hypertension | I10 |
| Gabapentin | Chronic Pain | G89.29 |
| Sertraline | Generalized Anxiety Disorder | F41.1 |
| Losartan | Hypertension | I10 |
| Simvastatin | High Cholesterol | E78.5 |
| Furosemide | Heart Failure | I50.9 |
| Insulin Glargine | Type 2 Diabetes | E11.9 |
| Hydrochlorothiazide | Hypertension | I10 |
| Warfarin | Atrial Fibrillation | I48.91 |
| Prednisone | Rheumatoid Arthritis | M06.9 |
| Amoxicillin | Upper Respiratory Infection | J06.9 |
| Ibuprofen | Joint Pain | M25.50 |
| Escitalopram | Major Depressive Disorder | F32.9 |

Several medications intentionally share a code (e.g. four blood-pressure drugs all map to I10) rather than forcing 20 distinct codes — that's clinically accurate, not a shortcut.

Each generated record (on-screen or per CSV row) gets exactly one medication/condition/diagnosis-code triple — not a multi-medication list per person. If a person taking several medications at once turns out to be useful later, that's a bigger change (a variable-length list per record, different CSV shape) and would need its own decision, not an assumption baked in here.

## Logged for later, not in this build

- Delayed Part B effective date via employer-coverage SEP (separate from Part A date).
- AEP / Medicare Advantage OEP as plan-*switch* dates, distinct from initial Part A/B enrollment.
- Tying this page's generated person to Personal Generator's (shared identity across tool pages) — each tool page is currently independent by design, revisit if cross-page linking becomes useful.
