// --- Utilities (duplicated from personal.js / healthcare.js rather than
// shared — each tool page on this project is self-contained by design). ---

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFromList(list) {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
}

function resolveSelection(value, options) {
    if (value === "") {
        return randomFromList(options);
    }
    return value;
}

// --- Real bank data ---------------------------------------------------
// Bank name + routing number verified against the bank's own site where
// available, otherwise Wise.com's routing number database — see
// docs/banking-generator-spec.md for sources and the "one real routing
// number per bank, big banks actually have several" caveat. HQ city/zip
// are public knowledge; the zip is a generic one for that city/area, not
// claimed as the bank's literal mailing zip.

const BANKS = [
    { name: "JPMorgan Chase", routing: "021000021", city: "New York", state: "NY", zip: "10004" },
    { name: "Bank of America", routing: "026009593", city: "Charlotte", state: "NC", zip: "28202" },
    { name: "Wells Fargo", routing: "121000248", city: "San Francisco", state: "CA", zip: "94104" },
    { name: "Citibank", routing: "021000089", city: "New York", state: "NY", zip: "10004" },
    { name: "U.S. Bank", routing: "071004200", city: "Minneapolis", state: "MN", zip: "55402" },
    { name: "Capital One", routing: "065000090", city: "McLean", state: "VA", zip: "22102" },
    { name: "PNC Bank", routing: "043000122", city: "Pittsburgh", state: "PA", zip: "15222" },
    { name: "TD Bank", routing: "031201360", city: "Cherry Hill", state: "NJ", zip: "08002" },
    { name: "Truist Bank", routing: "064000046", city: "Charlotte", state: "NC", zip: "28202" },
    { name: "USAA Federal Savings Bank", routing: "314074269", city: "San Antonio", state: "TX", zip: "78216" },
    { name: "Navy Federal Credit Union", routing: "256074974", city: "Vienna", state: "VA", zip: "22180" },
    { name: "Citizens Bank", routing: "211070078", city: "Providence", state: "RI", zip: "02903" }
];

function resolveBank(selection) {
    if (selection === "") {
        return randomFromList(BANKS);
    }
    return BANKS.find((b) => b.name === selection) || randomFromList(BANKS);
}

// --- Safe Mode ----------------------------------------------------------
// On by default. Every bank-identity value is obviously, unmistakably
// fake -- never a real bank name or a real/checksum-valid routing number.

const FAKE_BANK_NAMES = [
    "Test National Bank", "Sample Trust Bank", "Fictional Federal Bank",
    "Placeholder Savings Bank", "Example Community Bank", "Demo State Bank"
];

const SAFE_STREETS = ["123 Placeholder Ave", "1 Sample Plaza", "100 Test Street", "42 Fictional Way"];

// User's own suggestion: NYC or Delaware (Wilmington) as the placeholder
// city, alternated for a little variety.
const SAFE_LOCATIONS = [
    { city: "New York", state: "NY", zip: "10001" },
    { city: "Wilmington", state: "DE", zip: "19801" }
];

function generateBankIdentity(safeMode, bankSelection) {
    if (safeMode) {
        const location = randomFromList(SAFE_LOCATIONS);
        return {
            bankName: randomFromList(FAKE_BANK_NAMES),
            routingNumber: "111111111",
            accountNumber: "2222222222",
            street: randomFromList(SAFE_STREETS),
            city: location.city,
            state: location.state,
            zip: location.zip
        };
    }

    const bank = resolveBank(bankSelection);
    return {
        bankName: bank.name,
        routingNumber: bank.routing,
        accountNumber: generateRealModeAccountNumber(),
        street: generateBankStreet(),
        city: bank.city,
        state: bank.state,
        zip: bank.zip
    };
}

// Never a real assigned account number (there's no public registry to
// check against, the same "valid format, not a real assignment" logic
// as SSN in Personal) -- a plausible-length random digit string.
function generateRealModeAccountNumber() {
    let digits = "";
    const length = randomInt(10, 12);
    for (let i = 0; i < length; i++) {
        digits += String(randomInt(0, 9));
    }
    return digits;
}

// Generic financial-sounding street words for a bank HQ, distinct from
// Personal's residential street-name generator.
const BANK_STREET_NOUNS = ["Financial", "Commerce", "Market", "Corporate", "Federal", "Liberty"];
const BANK_STREET_SUFFIXES = ["Plaza", "Street", "Avenue", "Center", "Way", "Boulevard"];

function generateBankStreet() {
    const number = randomInt(1, 999);
    const noun = randomFromList(BANK_STREET_NOUNS);
    const suffix = randomFromList(BANK_STREET_SUFFIXES);
    return `${number} ${noun} ${suffix}`;
}

const ACCOUNT_TYPES = ["Checking", "Savings"];

// --- Card number (Luhn) --------------------------------------------------
// Real network BIN prefix + a correct Luhn check digit -- the same
// convention every payment processor's own published test card numbers
// use (e.g. Visa's official 4111111111111111). Not tied to any real
// issued card, so it isn't gated behind Safe Mode. See
// docs/banking-generator-spec.md for the algorithm and prefix sources.

const CARD_NETWORKS = {
    Visa: { prefixes: ["4"], length: 16, cvvLength: 3 },
    Mastercard: { prefixes: ["51", "52", "53", "54", "55"], length: 16, cvvLength: 3 },
    "American Express": { prefixes: ["34", "37"], length: 15, cvvLength: 4 },
    Discover: { prefixes: ["6011", "65"], length: 16, cvvLength: 3 }
};

const CARD_NETWORK_NAMES = Object.keys(CARD_NETWORKS);

function luhnCheckDigit(digitsStr) {
    let sum = 0;
    let shouldDouble = true; // rightmost digit of the prefix doubles first
    for (let i = digitsStr.length - 1; i >= 0; i--) {
        let digit = parseInt(digitsStr[i], 10);
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        shouldDouble = !shouldDouble;
    }
    const remainder = sum % 10;
    return remainder === 0 ? 0 : 10 - remainder;
}

function generateCardNumber(networkName) {
    const spec = CARD_NETWORKS[networkName];
    const prefix = randomFromList(spec.prefixes);
    let digits = prefix;
    while (digits.length < spec.length - 1) {
        digits += String(randomInt(0, 9));
    }
    digits += String(luhnCheckDigit(digits));
    return digits;
}

function generateCvv(networkName) {
    const spec = CARD_NETWORKS[networkName];
    let cvv = "";
    for (let i = 0; i < spec.cvvLength; i++) {
        cvv += String(randomInt(0, 9));
    }
    return cvv;
}

function generateExpiration() {
    const today = new Date();
    const monthsOut = randomInt(1, 48);
    const expiry = new Date(today.getFullYear(), today.getMonth() + monthsOut, 1);
    const mm = String(expiry.getMonth() + 1).padStart(2, "0");
    const yy = String(expiry.getFullYear() % 100).padStart(2, "0");
    return `${mm}/${yy}`;
}

// --- Record assembly -------------------------------------------------------

function generateBankingRecord(safeMode, bankSelection, cardNetworkSelection) {
    const identity = generateBankIdentity(safeMode, bankSelection);
    const accountType = randomFromList(ACCOUNT_TYPES);

    const network = resolveSelection(cardNetworkSelection, CARD_NETWORK_NAMES);
    const cardNumber = generateCardNumber(network);
    const cvv = generateCvv(network);
    const expiration = generateExpiration();

    return {
        bankName: identity.bankName,
        routingNumber: identity.routingNumber,
        accountNumber: identity.accountNumber,
        accountType,
        street: identity.street,
        city: identity.city,
        state: identity.state,
        zip: identity.zip,
        cardNetwork: network,
        cardNumber,
        expiration,
        cvv
    };
}

function renderRecord(record) {
    document.getElementById("bankName").textContent = record.bankName;
    document.getElementById("routingNumber").textContent = record.routingNumber;
    document.getElementById("accountNumber").textContent = record.accountNumber;
    document.getElementById("accountType").textContent = record.accountType;
    document.getElementById("street").textContent = record.street;
    document.getElementById("city").textContent = record.city;
    document.getElementById("state").textContent = record.state;
    document.getElementById("zip").textContent = record.zip;
    document.getElementById("cardNetwork").textContent = record.cardNetwork;
    document.getElementById("cardNumber").textContent = record.cardNumber;
    document.getElementById("expiration").textContent = record.expiration;
    document.getElementById("cvv").textContent = record.cvv;
}

function populateBankDropdown() {
    const select = document.getElementById("bankSelect");
    BANKS.forEach((bank) => {
        const option = document.createElement("option");
        option.value = bank.name;
        option.textContent = bank.name;
        select.appendChild(option);
    });
}

// --- CSV export -------------------------------------------------------

const CSV_HEADERS = [
    "Bank Name", "Routing Number", "Account Number", "Account Type",
    "Street", "City", "State", "Zip",
    "Card Network", "Card Number", "Expiration", "CVV"
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
        record.bankName,
        record.routingNumber,
        record.accountNumber,
        record.accountType,
        record.street,
        record.city,
        record.state,
        record.zip,
        record.cardNetwork,
        record.cardNumber,
        record.expiration,
        record.cvv
    ];
    return fields.map(escapeCsvField).join(",");
}

function generateCsv(count, safeMode, bankSelection, cardNetworkSelection) {
    const rows = [CSV_HEADERS.join(",")];
    for (let i = 0; i < count; i++) {
        const record = generateBankingRecord(safeMode, bankSelection, cardNetworkSelection);
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
    link.download = `nebo-banking-records-${stamp}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// --- Init ---------------------------------------------------------------

function initializeBankingGenerator() {
    populateBankDropdown();

    const regenerateBtn = document.getElementById("regenerateBtn");
    const safeModeCheckbox = document.getElementById("safeMode");
    const bankSelect = document.getElementById("bankSelect");
    const cardNetworkSelect = document.getElementById("cardNetworkSelect");
    const exportCsvBtn = document.getElementById("exportCsvBtn");

    // Bank selection has no effect while Safe Mode overrides it -- gray
    // it out so that's visually obvious, not just a silent no-op.
    function syncBankSelectDisabled() {
        bankSelect.disabled = safeModeCheckbox.checked;
    }
    syncBankSelectDisabled();
    safeModeCheckbox.addEventListener("change", syncBankSelectDisabled);

    regenerateBtn.addEventListener("click", () => {
        const record = generateBankingRecord(
            safeModeCheckbox.checked,
            bankSelect.value,
            cardNetworkSelect.value
        );
        renderRecord(record);
    });

    exportCsvBtn.addEventListener("click", () => {
        const count = getExportCount();
        const csvText = generateCsv(
            count,
            safeModeCheckbox.checked,
            bankSelect.value,
            cardNetworkSelect.value
        );
        downloadCsv(csvText);
    });

    renderRecord(generateBankingRecord(
        safeModeCheckbox.checked,
        bankSelect.value,
        cardNetworkSelect.value
    ));
}

document.addEventListener("DOMContentLoaded", () => {
    initializeBankingGenerator();
});
