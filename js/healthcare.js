// --- Utilities (duplicated from personal.js rather than shared — each
// tool page on this project is self-contained by design). ---

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromList(list) {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
}

function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

// "" (the dropdown's "Random" option) resolves to a random pick from the
// option list; any other value passes through as-is. Same pattern as
// resolveStateSelection() in personal.js.
function resolveSelection(value, options) {
    if (value === "") {
        return randomFromList(options);
    }
    return value;
}

// --- MBI (Medicare Beneficiary Identifier) -------------------------------
// Format per CMS: https://www.cms.gov/medicare/new-medicare-card/understanding-the-mbi-with-format.pdf
// 11 characters, "non-intelligent" (no embedded meaning, so a flat random
// pick per position is correct — no checksum to replicate). Letters S, L,
// O, I, B, Z are excluded everywhere to avoid confusion with digits/each
// other. Displayed with dashes (CMS's own convention, e.g. "1EG4-TE5-MK73")
// — the dashes are visual only, not part of the identifier itself.

const MBI_NUMERIC = "0123456789";
const MBI_NUMERIC_NONZERO = "123456789";
const MBI_ALPHA = "ACDEFGHJKMNPQRTUVWXY"; // A-Z minus S,L,O,I,B,Z
const MBI_ALPHANUMERIC = MBI_ALPHA + MBI_NUMERIC;

const MBI_POSITION_POOLS = [
    MBI_NUMERIC_NONZERO, // 1
    MBI_ALPHA,           // 2
    MBI_ALPHANUMERIC,    // 3
    MBI_NUMERIC,         // 4
    MBI_ALPHA,           // 5
    MBI_ALPHANUMERIC,    // 6
    MBI_NUMERIC,         // 7
    MBI_ALPHA,           // 8
    MBI_ALPHA,           // 9
    MBI_NUMERIC,         // 10
    MBI_NUMERIC          // 11
];

function generateMBI() {
    const raw = MBI_POSITION_POOLS
        .map((pool) => randomFromList(pool.split("")))
        .join("");
    return `${raw.slice(0, 4)}-${raw.slice(4, 7)}-${raw.slice(7, 11)}`;
}

// --- NPI (National Provider Identifier) ------------------------------------
// 10 digits: 9 random base digits + 1 Luhn check digit, per CMS's spec:
// https://www.cms.gov/Regulations-and-Guidance/Administrative-Simplification/NationalProvIdentStand/Downloads/NPIcheckdigit.pdf
// The check-digit algorithm below is verified against CMS's own worked
// example (base 123456789 -> check digit 3).

function computeNpiCheckDigit(nineDigits) {
    // Constant 24 substitutes for the "80840" issuer prefix used when an
    // NPI appears on a card issuer identifier, so a standalone NPI
    // produces the same check digit either way.
    let sum = 24;
    for (let i = nineDigits.length - 1; i >= 0; i--) {
        let digit = parseInt(nineDigits[i], 10);
        const positionFromRight = nineDigits.length - i;
        if (positionFromRight % 2 === 1) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
    }
    const remainder = sum % 10;
    return remainder === 0 ? 0 : 10 - remainder;
}

function generateNPI() {
    // No real NPI starts with 0.
    let base = String(randomInt(1, 9));
    for (let i = 0; i < 8; i++) {
        base += String(randomInt(0, 9));
    }
    return base + computeNpiCheckDigit(base);
}

// --- Enrollment period -> Part A / Part B effective date -----------------
// Rules per medicare.gov (When does Medicare coverage start / Open
// Enrollment): Part A and Part B share one effective date in this model
// (the common case — a delayed Part B via an employer-coverage SEP would
// need its own date, not modeled here). AEP and the Medicare Advantage OEP
// are plan-*switch* windows for people already enrolled, not initial
// Part A/B enrollment, so they're not part of this selector — see
// docs/healthcare-generator-spec.md.

const ENROLLMENT_PERIODS = ["IEP", "GEP", "SEP"];

const ENROLLMENT_PERIOD_LABELS = {
    IEP: "Initial Enrollment Period (IEP)",
    GEP: "General Enrollment Period (GEP)",
    SEP: "Special Enrollment Period (SEP)"
};

// Date normalizes an out-of-range month index (negative or > 11)
// correctly, rolling into the adjacent year — used throughout below
// instead of manually clamping/wrapping months.
function monthStart(year, monthIndex) {
    return new Date(year, monthIndex, 1);
}

function generateEnrollmentEffectiveDate(period) {
    const today = new Date();
    const year = today.getFullYear();

    if (period === "GEP") {
        // Signup Jan 1 - Mar 31; coverage starts the month after signup.
        const signupMonth = randomInt(0, 2);
        return monthStart(year, signupMonth + 1);
    }

    if (period === "SEP") {
        // Qualifying-event windows vary by circumstance (job loss,
        // Medicaid loss, disaster, etc.) — modeled generically as a
        // recent signup rather than per-event. Coverage starts the
        // month after signup.
        const monthsAgo = randomInt(1, 8);
        const signupMonth = today.getMonth() - monthsAgo;
        return monthStart(year, signupMonth + 1);
    }

    // IEP: 7-month window, 3 months before the birth month through
    // 3 months after.
    // - Signup in the 3 months before the birth month -> coverage
    //   starts the birth month itself.
    // - Signup in the birth month or the 3 months after -> coverage
    //   starts the month after signup.
    const birthMonth = randomInt(0, 11);
    const offset = randomInt(-3, 3);
    if (offset < 0) {
        return monthStart(year, birthMonth);
    }
    const signupMonth = birthMonth + offset;
    return monthStart(year, signupMonth + 1);
}

// --- Plan type -> payer / member ID / group number ------------------------

const PLAN_TYPES = [
    "Original Medicare (Parts A & B only)",
    "Medicare Advantage (Part C)",
    "Original Medicare + Medigap + Part D",
    "Original Medicare + Part D only"
];

// Real, currently-operating US health insurers / Medicare carriers.
// Plausible test data, same "real names, generic ID formats" approach as
// the STATE_CITIES address data in personal.js.
const INSURERS = [
    "UnitedHealthcare", "Humana", "Aetna", "Cigna Healthcare",
    "Elevance Health (Anthem Blue Cross Blue Shield)", "Kaiser Permanente",
    "Centene Corporation", "Molina Healthcare", "Highmark",
    "Blue Cross Blue Shield of Michigan", "Independence Blue Cross",
    "Blue Shield of California", "EmblemHealth",
    "Health Care Service Corporation (HCSC)", "Florida Blue (GuideWell)",
    "CareFirst BlueCross BlueShield", "WellCare", "Oscar Health",
    "Devoted Health", "Clover Health", "SCAN Health Plan",
    "UPMC Health Plan", "Priority Health", "Regence BlueCross BlueShield"
];

const ID_LETTERS = "ABCDEFGHJKLMNPQRSTUVWXYZ".split("");

function randomLetters(count) {
    let result = "";
    for (let i = 0; i < count; i++) {
        result += randomFromList(ID_LETTERS);
    }
    return result;
}

// Plausible generic formats — real carriers each use their own scheme,
// so these aren't tied to any one insurer's actual ID format, same
// "plausible, not precision-tied" approach as the phone area codes in
// personal.js.
function generateMemberId() {
    const digits = String(randomInt(0, 999999999)).padStart(9, "0");
    return `${randomLetters(3)}${digits}`;
}

function generateGroupNumber() {
    const digits = String(randomInt(0, 999999)).padStart(6, "0");
    return `${randomLetters(2)}${digits}`;
}

function generateCoverage(planType, mbi) {
    if (planType === PLAN_TYPES[0]) {
        // Original Medicare only: no private carrier. Medicare doesn't
        // issue a separate member ID (the MBI is the member ID) or use
        // group numbers.
        return { payer: "Medicare (Original)", memberId: mbi, groupNumber: "N/A" };
    }
    return {
        payer: randomFromList(INSURERS),
        memberId: generateMemberId(),
        groupNumber: generateGroupNumber()
    };
}

// --- Medication / Condition / Diagnosis Code --------------------------------
// A fixed pool of 20 common, real medications, each paired with the
// condition it's typically prescribed for and a verified ICD-10-CM
// diagnosis code (checked individually against icd10data.com). Several
// medications share a code where that's clinically accurate (e.g. four
// different blood-pressure medications all map to I10) rather than
// forcing 20 distinct codes.

const MEDICATIONS = [
    { medication: "Metformin", condition: "Type 2 Diabetes", icd10: "E11.9" },
    { medication: "Lisinopril", condition: "Hypertension", icd10: "I10" },
    { medication: "Atorvastatin", condition: "High Cholesterol", icd10: "E78.5" },
    { medication: "Levothyroxine", condition: "Hypothyroidism", icd10: "E03.9" },
    { medication: "Albuterol", condition: "Asthma", icd10: "J45.909" },
    { medication: "Omeprazole", condition: "GERD", icd10: "K21.9" },
    { medication: "Amlodipine", condition: "Hypertension", icd10: "I10" },
    { medication: "Metoprolol", condition: "Hypertension", icd10: "I10" },
    { medication: "Gabapentin", condition: "Chronic Pain", icd10: "G89.29" },
    { medication: "Sertraline", condition: "Generalized Anxiety Disorder", icd10: "F41.1" },
    { medication: "Losartan", condition: "Hypertension", icd10: "I10" },
    { medication: "Simvastatin", condition: "High Cholesterol", icd10: "E78.5" },
    { medication: "Furosemide", condition: "Heart Failure", icd10: "I50.9" },
    { medication: "Insulin Glargine", condition: "Type 2 Diabetes", icd10: "E11.9" },
    { medication: "Hydrochlorothiazide", condition: "Hypertension", icd10: "I10" },
    { medication: "Warfarin", condition: "Atrial Fibrillation", icd10: "I48.91" },
    { medication: "Prednisone", condition: "Rheumatoid Arthritis", icd10: "M06.9" },
    { medication: "Amoxicillin", condition: "Upper Respiratory Infection", icd10: "J06.9" },
    { medication: "Ibuprofen", condition: "Joint Pain", icd10: "M25.50" },
    { medication: "Escitalopram", condition: "Major Depressive Disorder", icd10: "F32.9" }
];

function resolveMedication(selection) {
    if (selection === "") {
        return randomFromList(MEDICATIONS);
    }
    return MEDICATIONS.find((entry) => entry.medication === selection) || randomFromList(MEDICATIONS);
}

// --- Height / Weight / BMI -------------------------------------------------
// "Standard" is a general reference band (18.5-29.9), not a fixed
// regulatory or universal insurer cutoff — real underwriting tables vary
// by carrier and product, and Medicare Part A/B itself has no BMI-based
// eligibility test (guaranteed issue). This control is meant for
// exercising edge-case logic in whatever system is being tested, not for
// replicating one specific real insurer's table. See
// docs/healthcare-generator-spec.md.

const BODY_RANGES = ["standard", "outside"];

// generateBmiTarget()'s "outside" bounds (17.9 / 30.5) leave a half-point
// buffer on each side of the standard band's edges (18.5 / 29.9) so that
// rounding the derived weight to a whole pound can never push the actual
// computed BMI back across the boundary into the standard band.

function generateBmiTarget(range) {
    if (range === "outside") {
        if (Math.random() < 0.5) {
            return randomInt(140, 179) / 10; // 14.0-17.9, underweight
        }
        // Mostly 30.5-39.9, with some extreme 40.0-55.0 outliers rather
        // than a flat spread across the whole "outside" range.
        return Math.random() < 0.75
            ? randomInt(305, 399) / 10
            : randomInt(400, 550) / 10;
    }
    return randomInt(185, 299) / 10; // 18.5-29.9, standard band
}

function generateHeightWeightBmi(range) {
    const heightInches = randomInt(58, 76); // 4'10" - 6'4"
    const targetBmi = generateBmiTarget(range);
    const weightLbs = Math.round((targetBmi * heightInches * heightInches) / 703);
    const actualBmi = Math.round(((weightLbs / (heightInches * heightInches)) * 703) * 10) / 10;

    const feet = Math.floor(heightInches / 12);
    const inches = heightInches % 12;

    return {
        height: `${feet}'${inches}"`,
        weight: `${weightLbs} lbs`,
        bmi: actualBmi.toFixed(1)
    };
}

// --- Record assembly -------------------------------------------------------

function generateHealthcareRecord(enrollmentSelection, planTypeSelection, medicationSelection, bodyRangeSelection) {
    const mbi = generateMBI();
    const npi = generateNPI();

    const period = resolveSelection(enrollmentSelection, ENROLLMENT_PERIODS);
    const effectiveDate = generateEnrollmentEffectiveDate(period);

    const planType = resolveSelection(planTypeSelection, PLAN_TYPES);
    const coverage = generateCoverage(planType, mbi);

    const medicationEntry = resolveMedication(medicationSelection);

    const bodyRange = resolveSelection(bodyRangeSelection, BODY_RANGES);
    const body = generateHeightWeightBmi(bodyRange);

    return {
        mbi,
        npi,
        enrollmentPeriod: ENROLLMENT_PERIOD_LABELS[period],
        partAEffective: formatDate(effectiveDate),
        partBEffective: formatDate(effectiveDate),
        planType,
        payer: coverage.payer,
        memberId: coverage.memberId,
        groupNumber: coverage.groupNumber,
        medication: medicationEntry.medication,
        condition: medicationEntry.condition,
        diagnosisCode: medicationEntry.icd10,
        height: body.height,
        weight: body.weight,
        bmi: body.bmi
    };
}

function renderRecord(record) {
    document.getElementById("mbi").textContent = record.mbi;
    document.getElementById("npi").textContent = record.npi;
    document.getElementById("enrollmentPeriod").textContent = record.enrollmentPeriod;
    document.getElementById("partAEffective").textContent = record.partAEffective;
    document.getElementById("partBEffective").textContent = record.partBEffective;
    document.getElementById("planType").textContent = record.planType;
    document.getElementById("payer").textContent = record.payer;
    document.getElementById("memberId").textContent = record.memberId;
    document.getElementById("groupNumber").textContent = record.groupNumber;
    document.getElementById("medication").textContent = record.medication;
    document.getElementById("condition").textContent = record.condition;
    document.getElementById("diagnosisCode").textContent = record.diagnosisCode;
    document.getElementById("height").textContent = record.height;
    document.getElementById("weight").textContent = record.weight;
    document.getElementById("bmi").textContent = record.bmi;
}

// --- CSV export -------------------------------------------------------

const CSV_HEADERS = [
    "MBI", "NPI", "Enrollment Period", "Part A Effective Date", "Part B Effective Date",
    "Plan Type", "Payer", "Member ID", "Group Number",
    "Medication", "Condition", "Diagnosis Code (ICD-10)", "Height", "Weight", "BMI"
];

function getExportCount() {
    const input = document.getElementById("exportCount");
    let count = parseInt(input.value, 10);
    if (isNaN(count) || count < 1) count = 1;
    if (count > 500) count = 500;
    return count;
}

function escapeCsvField(value) {
    const str = String(value);
    if (/["\n\r,]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

function recordToCsvRow(record) {
    const fields = [
        record.mbi,
        record.npi,
        record.enrollmentPeriod,
        record.partAEffective,
        record.partBEffective,
        record.planType,
        record.payer,
        record.memberId,
        record.groupNumber,
        record.medication,
        record.condition,
        record.diagnosisCode,
        record.height,
        record.weight,
        record.bmi
    ];
    return fields.map(escapeCsvField).join(",");
}

function generateCsv(count, enrollmentSelection, planTypeSelection, medicationSelection, bodyRangeSelection) {
    const rows = [CSV_HEADERS.join(",")];
    for (let i = 0; i < count; i++) {
        const record = generateHealthcareRecord(enrollmentSelection, planTypeSelection, medicationSelection, bodyRangeSelection);
        rows.push(recordToCsvRow(record));
    }
    return rows.join("\r\n");
}

function downloadCsv(csvText) {
    const blob = new Blob([csvText], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const today = new Date();
    const stamp = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, "0")}${String(today.getDate()).padStart(2, "0")}`;

    const link = document.createElement("a");
    link.href = url;
    link.download = `simply-test-data-healthcare-records-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// --- Init ---------------------------------------------------------------

function initializeHealthcareGenerator() {
    const regenerateBtn = document.getElementById("regenerateBtn");
    const enrollmentSelect = document.getElementById("enrollmentSelect");
    const planTypeSelect = document.getElementById("planTypeSelect");
    const medicationSelect = document.getElementById("medicationSelect");
    const bodyRangeSelect = document.getElementById("bodyRangeSelect");
    const exportCsvBtn = document.getElementById("exportCsvBtn");

    regenerateBtn.addEventListener("click", () => {
        const record = generateHealthcareRecord(
            enrollmentSelect.value,
            planTypeSelect.value,
            medicationSelect.value,
            bodyRangeSelect.value
        );
        renderRecord(record);
    });

    exportCsvBtn.addEventListener("click", () => {
        const count = getExportCount();
        const csvText = generateCsv(
            count,
            enrollmentSelect.value,
            planTypeSelect.value,
            medicationSelect.value,
            bodyRangeSelect.value
        );
        downloadCsv(csvText);
    });

    renderRecord(generateHealthcareRecord(
        enrollmentSelect.value,
        planTypeSelect.value,
        medicationSelect.value,
        bodyRangeSelect.value
    ));
}

document.addEventListener("DOMContentLoaded", () => {
    initializeHealthcareGenerator();
});
