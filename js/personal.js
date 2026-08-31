const FIRST_NAMES = [
    "Wei", "Fatima", "Carlos", "Aisha", "Liam",
    "Yuki", "Diego", "Priya", "Malik", "Elena",
    "Kwame", "Sofia", "Arjun", "Ngozi", "Hiro",
    "Mateo", "Amara", "Dmitri", "Layla", "Noah",
    "Mei", "Omar", "Isabella", "Kenji", "Zara",
    "Lucas", "Aaliyah", "Ravi", "Chidi", "Emma"
];

const LAST_NAMES = [
    "Nguyen", "Garcia", "Kim", "Patel", "Silva",
    "Okafor", "Kowalski", "Hassan", "Yamamoto", "Rossi",
    "Kumar", "Diallo", "Andersson", "Santos", "Ivanov",
    "Chen", "Abara", "Muller", "Osei", "Novak",
    "Ferreira", "Choi", "Haddad", "Larsen", "Mendez",
    "Wang", "Adeyemi", "Kovac", "Reyes", "Singh"
];

// Single source of truth for state data: abbreviation, area code,
// and one verified small-town city/zip pair per state (plus DC).
const STATE_DATA = {
    AL: { name: "Alabama", areaCode: "205", city: "Mentone", zip: "35984" },
    AK: { name: "Alaska", areaCode: "907", city: "Delta Junction", zip: "99737" },
    AZ: { name: "Arizona", areaCode: "602", city: "Jerome", zip: "86331" },
    AR: { name: "Arkansas", areaCode: "501", city: "Jasper", zip: "72641" },
    CA: { name: "California", areaCode: "213", city: "Bodfish", zip: "93205" },
    CO: { name: "Colorado", areaCode: "303", city: "Creede", zip: "81130" },
    CT: { name: "Connecticut", areaCode: "203", city: "Scotland", zip: "06264" },
    DE: { name: "Delaware", areaCode: "302", city: "Slaughter Beach", zip: "19963" },
    FL: { name: "Florida", areaCode: "305", city: "Ochopee", zip: "34141" },
    GA: { name: "Georgia", areaCode: "404", city: "Plains", zip: "31780" },
    HI: { name: "Hawaii", areaCode: "808", city: "Hawi", zip: "96719" },
    ID: { name: "Idaho", areaCode: "208", city: "Stanley", zip: "83278" },
    IL: { name: "Illinois", areaCode: "312", city: "Makanda", zip: "62958" },
    IN: { name: "Indiana", areaCode: "317", city: "Santa Claus", zip: "47579" },
    IA: { name: "Iowa", areaCode: "515", city: "Beaconsfield", zip: "50033" },
    KS: { name: "Kansas", areaCode: "316", city: "Lebanon", zip: "66952" },
    KY: { name: "Kentucky", areaCode: "502", city: "Rabbit Hash", zip: "41005" },
    LA: { name: "Louisiana", areaCode: "504", city: "Grand Isle", zip: "70358" },
    ME: { name: "Maine", areaCode: "207", city: "Monhegan", zip: "04852" },
    MD: { name: "Maryland", areaCode: "410", city: "Bittinger", zip: "21522" },
    MA: { name: "Massachusetts", areaCode: "617", city: "Goshen", zip: "01032" },
    MI: { name: "Michigan", areaCode: "313", city: "Copper Harbor", zip: "49918" },
    MN: { name: "Minnesota", areaCode: "612", city: "Angle Inlet", zip: "56711" },
    MS: { name: "Mississippi", areaCode: "601", city: "Rodney", zip: "39154" },
    MO: { name: "Missouri", areaCode: "314", city: "Weston", zip: "64098" },
    MT: { name: "Montana", areaCode: "406", city: "Polebridge", zip: "59928" },
    NE: { name: "Nebraska", areaCode: "402", city: "Arthur", zip: "69121" },
    NV: { name: "Nevada", areaCode: "702", city: "Jarbidge", zip: "89826" },
    NH: { name: "New Hampshire", areaCode: "603", city: "Dixville", zip: "03576" },
    NJ: { name: "New Jersey", areaCode: "201", city: "Layton", zip: "07851" },
    NM: { name: "New Mexico", areaCode: "505", city: "Chloride", zip: "87926" },
    NY: { name: "New York", areaCode: "212", city: "Speculator", zip: "12164" },
    NC: { name: "North Carolina", areaCode: "704", city: "Ocracoke", zip: "27960" },
    ND: { name: "North Dakota", areaCode: "701", city: "Regent", zip: "58650" },
    OH: { name: "Ohio", areaCode: "216", city: "Bainbridge", zip: "45612" },
    OK: { name: "Oklahoma", areaCode: "405", city: "Kenton", zip: "73946" },
    OR: { name: "Oregon", areaCode: "503", city: "Shaniko", zip: "97057" },
    PA: { name: "Pennsylvania", areaCode: "215", city: "Centralia", zip: "17921" },
    RI: { name: "Rhode Island", areaCode: "401", city: "New Shoreham", zip: "02807" },
    SC: { name: "South Carolina", areaCode: "803", city: "McClellanville", zip: "29458" },
    SD: { name: "South Dakota", areaCode: "605", city: "Scenic", zip: "57780" },
    TN: { name: "Tennessee", areaCode: "615", city: "Bell Buckle", zip: "37020" },
    TX: { name: "Texas", areaCode: "214", city: "Luckenbach", zip: "78624" },
    UT: { name: "Utah", areaCode: "801", city: "Boulder", zip: "84716" },
    VT: { name: "Vermont", areaCode: "802", city: "Grafton", zip: "05146" },
    VA: { name: "Virginia", areaCode: "804", city: "Clinchco", zip: "24226" },
    WA: { name: "Washington", areaCode: "206", city: "Stehekin", zip: "98852" },
    WV: { name: "West Virginia", areaCode: "304", city: "Thurmond", zip: "25936" },
    WI: { name: "Wisconsin", areaCode: "414", city: "Stockholm", zip: "54769" },
    WY: { name: "Wyoming", areaCode: "307", city: "Ten Sleep", zip: "82442" },
    DC: { name: "Washington DC", areaCode: "202", city: "Washington", zip: "20005" }
};

// Curated fake street names for DC only — DC is dense enough that a
// randomly generated street name has a real chance of coincidentally
// existing, so these are deliberately fictional-sounding instead.
const DC_STREET_NAMES = [
    "Cedar Hollow Lantern Way",
    "Maple Ridge Quarry Lane",
    "Willowmere Crossing Drive",
    "Pine Valley Orchard Road",
    "Silver Creek Meadow Lane"
];

// Word banks for generating random street names in every other state.
// Deliberately excludes "Main" to avoid the most common real street name.
const STREET_ADJECTIVES = [
    "Willow", "Cedar", "Amber", "Birch", "Sunset", "Autumn",
    "Hidden", "Silver", "Whispering", "Golden", "Foggy", "Quiet"
];
const STREET_NOUNS = [
    "Hollow", "Ridge", "Creek", "Orchard", "Meadow", "Grove",
    "Valley", "Brook", "Glen", "Summit"
];
const STREET_SUFFIXES = [
    "Lane", "Way", "Drive", "Road", "Court", "Trail", "Circle"
];

function randomFromList(list) {
    const index = Math.floor(Math.random() * list.length);
    return list[index];
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function daysInMonth(year, monthIndex) {
    // monthIndex is 0-11; day 0 of the next month rolls back to the
    // last day of this one, which correctly accounts for leap years.
    return new Date(year, monthIndex + 1, 0).getDate();
}

function generateDOB(minAge, maxAge) {
    const today = new Date();
    const age = randomInt(minAge, maxAge);
    const birthYear = today.getFullYear() - age;
    const birthMonth = randomInt(0, 11);
    const birthDay = randomInt(1, daysInMonth(birthYear, birthMonth));
    const dob = new Date(birthYear, birthMonth, birthDay);
    return dob;
}

function calculateAge(dob) {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const hasHadBirthdayThisYear =
        today.getMonth() > dob.getMonth() ||
        (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());
    if (!hasHadBirthdayThisYear) {
        age -= 1;
    }
    return age;
}

function formatDate(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function generateSSN() {
    let area;
    do {
        area = randomInt(1, 899);
    } while (area === 666);

    const group = randomInt(1, 99);
    const serial = randomInt(1, 9999);

    const areaStr = String(area).padStart(3, "0");
    const groupStr = String(group).padStart(2, "0");
    const serialStr = String(serial).padStart(4, "0");

    return `${areaStr}-${groupStr}-${serialStr}`;
}

function generatePhone(stateAbbr) {
    const areaCode = STATE_DATA[stateAbbr].areaCode;

    let exchange;
    do {
        const first = randomInt(2, 9);
        const rest = randomInt(0, 99);
        exchange = `${first}${String(rest).padStart(2, "0")}`;
    } while (exchange.endsWith("11"));

    const subscriber = String(randomInt(0, 9999)).padStart(4, "0");

    return `(${areaCode}) ${exchange}-${subscriber}`;
}

function generateStreetName(stateAbbr) {
    if (stateAbbr === "DC") {
        return randomFromList(DC_STREET_NAMES);
    }
    const adjective = randomFromList(STREET_ADJECTIVES);
    const noun = randomFromList(STREET_NOUNS);
    const suffix = randomFromList(STREET_SUFFIXES);
    return `${adjective} ${noun} ${suffix}`;
}

function generateAddress(stateAbbr) {
    const stateInfo = STATE_DATA[stateAbbr];
    const streetNumber = randomInt(100, 9999);
    const streetName = generateStreetName(stateAbbr);

    return {
        street: `${streetNumber} ${streetName}`,
        city: stateInfo.city,
        state: stateAbbr,
        zip: stateInfo.zip
    };
}

function generateEmail(firstName, lastName) {
    const domains = ["example.com", "example.org", "example.net"];
    const domain = randomFromList(domains);
    const randomDigits = randomInt(1, 999);
    return `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomDigits}@${domain}`;
}

function generateUsername(firstName, lastName) {
    const randomDigits = randomInt(10, 999);
    return `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomDigits}`;
}

function generatePassword() {
    const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const lowercase = "abcdefghijkmnpqrstuvwxyz";
    const numbers = "23456789";
    const symbols = "!@#$%^&*";

    let password = [
        randomFromList(uppercase.split("")),
        randomFromList(lowercase.split("")),
        randomFromList(numbers.split("")),
        randomFromList(symbols.split(""))
    ];

    const allChars = uppercase + lowercase + numbers + symbols;
    for (let i = 0; i < 8; i++) {
        password.push(randomFromList(allChars.split("")));
    }

    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    return password.join("");
}

function generatePerson(minAge, maxAge, stateAbbr) {
    const firstName = randomFromList(FIRST_NAMES);
    const lastName = randomFromList(LAST_NAMES);
    const fullName = `${firstName} ${lastName}`;

    const dob = generateDOB(minAge, maxAge);
    const age = calculateAge(dob);
    const ssn = generateSSN();
    const phone = generatePhone(stateAbbr);
    const address = generateAddress(stateAbbr);
    const email = generateEmail(firstName, lastName);
    const username = generateUsername(firstName, lastName);
    const password = generatePassword();

    return {
        firstName,
        lastName,
        fullName,
        dob,
        age,
        ssn,
        phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zip: address.zip,
        email,
        username,
        password
    };
}

function renderPerson(person) {
    document.getElementById("firstName").textContent = person.firstName;
    document.getElementById("lastName").textContent = person.lastName;
    document.getElementById("fullName").textContent = person.fullName;
    document.getElementById("dob").textContent = formatDate(person.dob);
    document.getElementById("age").textContent = person.age;
    document.getElementById("ssn").textContent = person.ssn;
    document.getElementById("phone").textContent = person.phone;
    document.getElementById("street").textContent = person.street;
    document.getElementById("city").textContent = person.city;
    document.getElementById("state").textContent = person.state;
    document.getElementById("zip").textContent = person.zip;
    document.getElementById("email").textContent = person.email;
    document.getElementById("username").textContent = person.username;
    document.getElementById("password").textContent = person.password;
}

function getAgeRange() {
    const minInput = document.getElementById("minAge");
    const maxInput = document.getElementById("maxAge");

    let min = parseInt(minInput.value, 10);
    let max = parseInt(maxInput.value, 10);

    if (isNaN(min) || min < 0) min = 0;
    if (isNaN(max) || max > 120) max = 120;
    if (min > max) {
        const temp = min;
        min = max;
        max = temp;
    }

    return { min, max };
}

function populateStateDropdown() {
    const select = document.getElementById("stateSelect");
    Object.keys(STATE_DATA).forEach((abbr) => {
        const option = document.createElement("option");
        option.value = abbr;
        option.textContent = `${STATE_DATA[abbr].name} (${abbr})`;
        select.appendChild(option);
    });
}

function resolveStateSelection(selectedValue) {
    if (selectedValue === "") {
        const allAbbrs = Object.keys(STATE_DATA);
        return randomFromList(allAbbrs);
    }
    return selectedValue;
}

function initializePersonalGenerator() {
    populateStateDropdown();

    const regenerateBtn = document.getElementById("regenerateBtn");
    const stateSelect = document.getElementById("stateSelect");

    regenerateBtn.addEventListener("click", () => {
        const { min, max } = getAgeRange();
        const stateAbbr = resolveStateSelection(stateSelect.value);
        const person = generatePerson(min, max, stateAbbr);
        renderPerson(person);
    });

    const { min, max } = getAgeRange();
    const stateAbbr = resolveStateSelection(stateSelect.value);
    renderPerson(generatePerson(min, max, stateAbbr));
}

document.addEventListener("DOMContentLoaded", () => {
    initializePersonalGenerator();
});