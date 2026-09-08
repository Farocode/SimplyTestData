/* ============================================================
   QA Tools — one shared input, one shared output. The tool
   select picks which tool the action buttons below the input
   act on, so the page only ever shows one input/output pair.
   Every tool here runs on native browser APIs only: no CDN
   script, no vendored library, no third-party call. See
   docs/qa-tools-generator-spec.md for the tools deliberately
   left out and how to add them later.
   ============================================================ */

/* ----------------------- Pure logic --------------------------
   Everything in this section takes plain values in and returns
   plain values out -- no DOM. Kept separate from the wiring below
   so it stays unit-testable headlessly (see the smoke tests run
   against this file during development). */

function cleanWhitespace(text, opts) {
    const { removeBlankLines, dedupeLines, stripSpecialChars } = opts || {};

    let lines = text
        .split("\n")
        .map((line) => line.trim().replace(/[ \t]+/g, " "));

    if (stripSpecialChars) {
        // Keeps letters, numbers, common punctuation, and spaces --
        // strips anything else (control chars, symbols, emoji, etc.).
        lines = lines.map((line) => line.replace(/[^A-Za-z0-9 .,;:'"!?()\-]/g, ""));
    }

    if (removeBlankLines) {
        lines = lines.filter((line) => line.length > 0);
    }

    if (dedupeLines) {
        const seen = new Set();
        lines = lines.filter((line) => {
            if (seen.has(line)) return false;
            seen.add(line);
            return true;
        });
    }

    return lines.join("\n");
}

/* splitWords(): tokenizes text for the "programmatic" casing
   styles (camelCase/PascalCase/snake_case/kebab-case/CONSTANT_CASE) —
   splits on camelCase humps first, then on any run of non-alphanumeric
   characters. Title/Sentence/Upper/Lower case don't need this; they
   transform the original string in place so spacing/punctuation is
   preserved untouched. */
function splitWords(text) {
    const spaced = text
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
    return spaced.split(/[^A-Za-z0-9]+/).filter(Boolean);
}

function capitalizeWord(word) {
    if (!word) return word;
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

function convertCase(text, style) {
    switch (style) {
        case "upper":
            return text.toUpperCase();
        case "lower":
            return text.toLowerCase();
        case "title":
            return text.replace(/\w\S*/g, (w) => capitalizeWord(w));
        case "sentence":
            return text
                .toLowerCase()
                .replace(/(^\s*[a-z]|[.!?]\s+[a-z])/g, (c) => c.toUpperCase());
        case "camel": {
            const words = splitWords(text);
            if (words.length === 0) return "";
            return (
                words[0].toLowerCase() +
                words.slice(1).map(capitalizeWord).join("")
            );
        }
        case "pascal":
            return splitWords(text).map(capitalizeWord).join("");
        case "snake":
            return splitWords(text)
                .map((w) => w.toLowerCase())
                .join("_");
        case "kebab":
            return splitWords(text)
                .map((w) => w.toLowerCase())
                .join("-");
        case "constant":
            return splitWords(text)
                .map((w) => w.toUpperCase())
                .join("_");
        default:
            return text;
    }
}

/* countSyllables(): a heuristic (vowel-group counting with common
   silent-e/ed/es trimming), not a dictionary lookup -- good enough for
   an approximate grade-level score, not a claim of precision. */
function countSyllables(word) {
    let w = word.toLowerCase().replace(/[^a-z]/g, "");
    if (w.length === 0) return 0;
    if (w.length <= 3) return 1;

    w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "");
    w = w.replace(/^y/, "");

    const matches = w.match(/[aeiouy]{1,2}/g);
    return matches ? matches.length : 1;
}

function splitSentences(text) {
    return text
        .split(/(?<=[.!?])\s+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
}

function analyzeReadability(text) {
    const sentences = splitSentences(text);
    const words = text.match(/[A-Za-z']+/g) || [];
    const wordCount = words.length;
    const sentenceCount = Math.max(sentences.length, 1);
    const syllableCount = words.reduce((sum, w) => sum + countSyllables(w), 0);

    const gradeLevel =
        wordCount === 0
            ? 0
            : 0.39 * (wordCount / sentenceCount) +
              11.8 * (syllableCount / wordCount) -
              15.59;

    const passiveRegex = /\b(am|is|are|was|were|be|been|being)\b\s+\w+(ed|en)\b/i;
    const longSentences = [];
    const veryLongSentences = [];
    const passiveSentences = [];

    sentences.forEach((sentence) => {
        const wc = (sentence.match(/[A-Za-z']+/g) || []).length;
        if (wc > 30) {
            veryLongSentences.push(sentence);
        } else if (wc > 20) {
            longSentences.push(sentence);
        }
        if (passiveRegex.test(sentence)) {
            passiveSentences.push(sentence);
        }
    });

    const adverbs = words.filter((w) => /\w{3,}ly$/i.test(w));

    return {
        wordCount,
        sentenceCount: sentences.length,
        gradeLevel,
        longSentences,
        veryLongSentences,
        passiveSentences,
        adverbCount: adverbs.length,
    };
}

function formatReadabilityResult(result) {
    if (result.wordCount === 0) {
        return "Type or paste some text on the left, then click Analyze.";
    }

    const lines = [];
    lines.push(
        `Approx. grade level: ${result.gradeLevel.toFixed(1)}  |  ${result.wordCount} words, ${result.sentenceCount} sentences`
    );
    lines.push(`Adverbs (-ly words): ${result.adverbCount}`);
    lines.push(
        `Passive voice: ${result.passiveSentences.length} sentence(s) flagged`
    );
    lines.push(
        `Hard to read: ${result.longSentences.length} sentence(s) over 20 words`
    );
    lines.push(
        `Very hard to read: ${result.veryLongSentences.length} sentence(s) over 30 words`
    );

    if (result.veryLongSentences.length > 0) {
        lines.push("");
        lines.push("Very hard to read:");
        result.veryLongSentences.forEach((s) => lines.push(`  - ${s}`));
    }
    if (result.longSentences.length > 0) {
        lines.push("");
        lines.push("Hard to read:");
        result.longSentences.forEach((s) => lines.push(`  - ${s}`));
    }
    if (result.passiveSentences.length > 0) {
        lines.push("");
        lines.push("Likely passive voice:");
        result.passiveSentences.forEach((s) => lines.push(`  - ${s}`));
    }

    return lines.join("\n");
}

function getJsonErrorLocation(text, message) {
    const posMatch = message.match(/position (\d+)/i);
    if (posMatch) {
        const pos = parseInt(posMatch[1], 10);
        const upToPos = text.slice(0, pos);
        const line = (upToPos.match(/\n/g) || []).length + 1;
        const col = pos - upToPos.lastIndexOf("\n");
        return `line ${line}, column ${col}`;
    }
    const lineColMatch = message.match(/line (\d+) column (\d+)/i);
    if (lineColMatch) {
        return `line ${lineColMatch[1]}, column ${lineColMatch[2]}`;
    }
    return null;
}

function utf8ToBase64(str) {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    bytes.forEach((b) => {
        binary += String.fromCharCode(b);
    });
    return btoa(binary);
}

function base64ToUtf8(str) {
    const binary = atob(str);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

const HTML_NAMED_ENTITIES = [
    ["&", "&amp;"],
    ["<", "&lt;"],
    [">", "&gt;"],
    ['"', "&quot;"],
    ["'", "&#39;"],
];

function encodeHtmlEntities(text) {
    let result = text;
    // & must be replaced first so it doesn't double-encode the entities
    // this same pass just introduced.
    HTML_NAMED_ENTITIES.forEach(([char, entity]) => {
        result = result.split(char).join(entity);
    });
    return result;
}

function decodeHtmlEntities(text) {
    let result = text;
    // Reverse order so &amp; is decoded last, same double-decode reasoning
    // as the encode direction.
    [...HTML_NAMED_ENTITIES].reverse().forEach(([char, entity]) => {
        result = result.split(entity).join(char);
    });
    result = result.replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)));
    result = result.replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)));
    return result;
}

function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

function hexToRgb(hex) {
    const clean = hex.trim().replace(/^#/, "");
    const full =
        clean.length === 3
            ? clean.split("").map((c) => c + c).join("")
            : clean;
    if (!/^[0-9a-f]{6}$/i.test(full)) return null;

    return {
        r: parseInt(full.slice(0, 2), 16),
        g: parseInt(full.slice(2, 4), 16),
        b: parseInt(full.slice(4, 6), 16),
    };
}

function rgbToHsl({ r, g, b }) {
    const rN = r / 255;
    const gN = g / 255;
    const bN = b / 255;
    const max = Math.max(rN, gN, bN);
    const min = Math.min(rN, gN, bN);
    const l = (max + min) / 2;
    let h = 0;
    let s = 0;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case rN:
                h = (gN - bN) / d + (gN < bN ? 6 : 0);
                break;
            case gN:
                h = (bN - rN) / d + 2;
                break;
            default:
                h = (rN - gN) / d + 4;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

/* parseDelimited()/escapeDelimitedField(): a small RFC4180-style
   parser/writer generalized to any single-character delimiter, not
   just comma -- handles quoted fields (so a delimiter or newline
   inside quotes doesn't split the field) and doubled-quote escaping.
   Zero dependency; this is the same algorithm any CSV library
   implements, just not pulled in as one. */
function parseDelimited(text, delimiter) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;
    const normalized = text.replace(/\r\n/g, "\n");

    for (let i = 0; i < normalized.length; i++) {
        const c = normalized[i];
        if (inQuotes) {
            if (c === '"') {
                if (normalized[i + 1] === '"') {
                    field += '"';
                    i++;
                } else {
                    inQuotes = false;
                }
            } else {
                field += c;
            }
        } else if (c === '"') {
            inQuotes = true;
        } else if (c === delimiter) {
            row.push(field);
            field = "";
        } else if (c === "\n") {
            row.push(field);
            field = "";
            rows.push(row);
            row = [];
        } else {
            field += c;
        }
    }

    if (field.length > 0 || row.length > 0) {
        row.push(field);
        rows.push(row);
    }

    return rows;
}

function escapeDelimitedField(field, delimiter) {
    if (field.includes(delimiter) || field.includes('"') || field.includes("\n") || field.includes("\r")) {
        return '"' + field.replace(/"/g, '""') + '"';
    }
    return field;
}

function resolveDelimiterValue(selectValue, customValue) {
    if (selectValue !== "custom") return selectValue;
    if (!customValue) return null;
    // Common escape shorthands so a typed "\t" works as a real tab.
    return customValue.replace(/\\t/g, "\t").replace(/\\n/g, "\n");
}

function convertDelimited(text, inputDelimiter, outputDelimiter) {
    const rows = parseDelimited(text, inputDelimiter);
    const output = rows
        .map((row) => row.map((field) => escapeDelimitedField(field, outputDelimiter)).join(outputDelimiter))
        .join("\n");
    return { output, rowCount: rows.length };
}

/* ----------------------- Tool config ---------------------------
   One entry per tool in the select. `needsInput: false` hides the
   shared textarea (only UUID has nothing to read). `options` render
   as checkboxes above the action buttons. Each action's `run`
   receives (inputText, optionValues) and returns either a plain
   string (written to output, status cleared) or
   { output?, status?, statusClass? } -- output is left untouched
   when omitted, so e.g. JSON's Validate button can report a status
   without overwriting whatever's already in the output box. `run`
   may return a Promise (the hash tool's crypto.subtle.digest is
   async). */

const TOOLS = {
    whitespace: {
        desc: "Trims leading/trailing whitespace on each line and collapses repeated internal spaces. The toggles below cover the other common cleanup asks: dropping duplicate lines and stripping anything outside common letters/numbers/punctuation.",
        placeholder: "Paste text here...",
        sample: "  Hello    world!  \n\n\n  This   line has  extra   spaces.  \n\nDuplicate line\nDuplicate line\nWeird chars: cafe #!! ***",
        options: [
            { id: "wsRemoveBlankLines", label: "Remove blank lines" },
            { id: "wsDedupeLines", label: "Remove duplicate lines" },
            { id: "wsStripSpecialChars", label: "Strip special characters" },
        ],
        actions: [
            {
                label: "Clean",
                run: (input, opts) =>
                    cleanWhitespace(input, {
                        removeBlankLines: Boolean(opts.wsRemoveBlankLines),
                        dedupeLines: Boolean(opts.wsDedupeLines),
                        stripSpecialChars: Boolean(opts.wsStripSpecialChars),
                    }),
            },
        ],
    },
    case: {
        desc: "Convert text between common casing styles.",
        placeholder: "Paste text here...",
        sample: "hello_world example TextToConvert",
        actions: [
            { label: "UPPERCASE", run: (input) => convertCase(input, "upper") },
            { label: "lowercase", run: (input) => convertCase(input, "lower") },
            { label: "Title Case", run: (input) => convertCase(input, "title") },
            { label: "Sentence case", run: (input) => convertCase(input, "sentence") },
            { label: "camelCase", run: (input) => convertCase(input, "camel") },
            { label: "PascalCase", run: (input) => convertCase(input, "pascal") },
            { label: "snake_case", run: (input) => convertCase(input, "snake") },
            { label: "kebab-case", run: (input) => convertCase(input, "kebab") },
            { label: "CONSTANT_CASE", run: (input) => convertCase(input, "constant") },
        ],
    },
    readability: {
        desc: "A rough, Hemingway-style pass: flags long/complex sentences, likely passive voice, adverb-heavy phrasing, and estimates a Flesch-Kincaid grade level from a simple syllable heuristic -- an approximation, not a claim to match any commercial tool's exact scoring. Spelling is flagged by your browser's own built-in spell-checker (underlined in the box) rather than a bundled dictionary.",
        placeholder: "Paste a paragraph or two here...",
        sample: "The meeting was attended by all of the stakeholders and it was decided by the committee that the project would be moved forward with, which was viewed favorably by everyone who was involved in a way that was surprisingly complicated to explain to the newer members of the team.",
        inputSpellcheck: true,
        actions: [
            { label: "Analyze", run: (input) => formatReadabilityResult(analyzeReadability(input)) },
        ],
    },
    json: {
        desc: "Validate, pretty-print, or minify JSON using the browser's native JSON parser.",
        placeholder: "Paste JSON here...",
        sample: "{\"name\":\"Jane Doe\",\"active\":true,\"roles\":[\"admin\",\"tester\"],\"score\":98.6}",
        actions: [
            {
                label: "Validate",
                run: (input) => {
                    try {
                        JSON.parse(input);
                        return { status: "Valid JSON.", statusClass: "valid" };
                    } catch (err) {
                        return jsonErrorResult(input, err);
                    }
                },
            },
            {
                label: "Pretty Print",
                run: (input) => {
                    try {
                        const parsed = JSON.parse(input);
                        return {
                            output: JSON.stringify(parsed, null, 2),
                            status: "Valid JSON — pretty-printed below.",
                            statusClass: "valid",
                        };
                    } catch (err) {
                        return jsonErrorResult(input, err);
                    }
                },
            },
            {
                label: "Minify",
                run: (input) => {
                    try {
                        const parsed = JSON.parse(input);
                        return {
                            output: JSON.stringify(parsed),
                            status: "Valid JSON — minified below.",
                            statusClass: "valid",
                        };
                    } catch (err) {
                        return jsonErrorResult(input, err);
                    }
                },
            },
        ],
    },
    base64: {
        desc: "UTF-8 safe Base64 encode/decode.",
        placeholder: "Text or Base64 here...",
        sample: "Simply Test Data",
        actions: [
            {
                label: "Encode",
                run: (input) => {
                    try {
                        return utf8ToBase64(input);
                    } catch (err) {
                        return { status: `Couldn't encode: ${err.message}`, statusClass: "invalid" };
                    }
                },
            },
            {
                label: "Decode",
                run: (input) => {
                    try {
                        return base64ToUtf8(input);
                    } catch (err) {
                        return { status: "That doesn't look like valid Base64.", statusClass: "invalid" };
                    }
                },
            },
        ],
    },
    url: {
        desc: "Percent-encode or decode a string for safe use in a URL.",
        placeholder: "Text or encoded URL component here...",
        sample: "https://example.com/search?q=simply test data&sort=asc",
        actions: [
            { label: "Encode", run: (input) => encodeURIComponent(input) },
            {
                label: "Decode",
                run: (input) => {
                    try {
                        return decodeURIComponent(input);
                    } catch (err) {
                        return {
                            status: "That doesn't look like a valid encoded URL component.",
                            statusClass: "invalid",
                        };
                    }
                },
            },
        ],
    },
    html: {
        desc: "Encode/decode the common named entities (&amp;, &lt;, &gt;, quotes) plus numeric entities.",
        placeholder: "Text or HTML-escaped text here...",
        sample: "<div class=\"example\">Tom and Jerry are having a \"great\" day</div>",
        actions: [
            { label: "Encode", run: (input) => encodeHtmlEntities(input) },
            { label: "Decode", run: (input) => decodeHtmlEntities(input) },
        ],
    },
    uuid: {
        desc: "Generates a random UUID (v4) using the browser's native crypto API.",
        needsInput: false,
        actions: [{ label: "Generate", run: () => crypto.randomUUID() }],
    },
    hash: {
        desc: "SHA-1/256/384/512 via the browser's native Web Crypto API. SHA-1 is included but flagged legacy -- don't use it anywhere security matters. MD5 isn't offered; it's intentionally left out of Web Crypto and not worth hand-rolling here.",
        placeholder: "Text to hash...",
        sample: "The quick brown fox jumps over the lazy dog",
        actions: [
            { label: "SHA-1", run: (input) => hashText(input, "SHA-1") },
            { label: "SHA-256", run: (input) => hashText(input, "SHA-256") },
            { label: "SHA-384", run: (input) => hashText(input, "SHA-384") },
            { label: "SHA-512", run: (input) => hashText(input, "SHA-512") },
        ],
    },
    timestamp: {
        desc: "Convert between a Unix timestamp (seconds) and a human-readable date. Pick a direction below -- for \"Date → Unix\", type a date your browser can parse, e.g. 2026-09-08T14:30 or 2026-09-08 14:30:00.",
        placeholder: "e.g. 1735689600  or  2026-09-08T14:30",
        sample: "1735689600",
        actions: [
            {
                label: "Unix → Date",
                run: (input) => {
                    const seconds = Number(input.trim());
                    if (!Number.isFinite(seconds) || input.trim() === "") {
                        return { status: "Enter a valid number of seconds.", statusClass: "invalid" };
                    }
                    const date = new Date(seconds * 1000);
                    return {
                        output: `Local: ${date.toString()}\nISO:   ${date.toISOString()}`,
                        status: "",
                        statusClass: "",
                    };
                },
            },
            {
                label: "Date → Unix",
                run: (input) => {
                    if (!input.trim()) {
                        return { status: "Enter a date and time first.", statusClass: "invalid" };
                    }
                    const date = new Date(input.trim());
                    if (Number.isNaN(date.getTime())) {
                        return { status: "That doesn't look like a date your browser can parse.", statusClass: "invalid" };
                    }
                    return {
                        output: String(Math.floor(date.getTime() / 1000)),
                        status: "",
                        statusClass: "",
                    };
                },
            },
        ],
    },
    color: {
        desc: "Enter a hex color to get its RGB and HSL equivalents.",
        placeholder: "#38bdf8 or #fff",
        sample: "#38bdf8",
        actions: [
            {
                label: "Convert",
                run: (input) => {
                    const rgb = hexToRgb(input);
                    if (!rgb) {
                        return { status: "Enter a valid hex color, e.g. #38bdf8 or #fff.", statusClass: "invalid" };
                    }
                    const hsl = rgbToHsl(rgb);
                    return {
                        output: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\nhsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
                        status: "",
                        statusClass: "",
                    };
                },
            },
        ],
    },
    delimiter: {
        desc: "Convert delimited text (CSV, TSV, pipe-separated, or a custom character) from one delimiter to another. Handles quoted fields, so a delimiter or newline inside quotes doesn't split the field.",
        placeholder: 'name,role,notes\n"Doe, Jane",QA Lead,"Uses a comma in her title -- watch for that"\nJohn Smith,Engineer,Works remote',
        sample: 'name,role,notes\n"Doe, Jane",QA Lead,"Uses a comma in her title -- watch for that"\nJohn Smith,Engineer,Works remote',
        options: [
            {
                id: "delimInput",
                type: "select",
                label: "Input delimiter",
                default: ",",
                choices: [
                    { value: ",", label: "Comma" },
                    { value: "\t", label: "Tab" },
                    { value: "|", label: "Pipe" },
                    { value: ";", label: "Semicolon" },
                    { value: "custom", label: "Custom" },
                ],
            },
            {
                id: "delimInputCustom",
                type: "text",
                label: "Custom input delimiter",
                placeholder: "e.g. ~ or \\t",
            },
            {
                id: "delimOutput",
                type: "select",
                label: "Output delimiter",
                default: "\t",
                choices: [
                    { value: ",", label: "Comma" },
                    { value: "\t", label: "Tab" },
                    { value: "|", label: "Pipe" },
                    { value: ";", label: "Semicolon" },
                    { value: "custom", label: "Custom" },
                ],
            },
            {
                id: "delimOutputCustom",
                type: "text",
                label: "Custom output delimiter",
                placeholder: "e.g. ~ or \\t",
            },
        ],
        actions: [
            {
                label: "Convert",
                run: (input, opts) => {
                    const inDelim = resolveDelimiterValue(opts.delimInput, opts.delimInputCustom);
                    const outDelim = resolveDelimiterValue(opts.delimOutput, opts.delimOutputCustom);
                    if (!inDelim) {
                        return { status: "Pick an input delimiter, or enter a custom one.", statusClass: "invalid" };
                    }
                    if (!outDelim) {
                        return { status: "Pick an output delimiter, or enter a custom one.", statusClass: "invalid" };
                    }
                    const { output, rowCount } = convertDelimited(input, inDelim, outDelim);
                    return { output, status: `Converted ${rowCount} row(s).`, statusClass: "valid" };
                },
            },
        ],
    },
};

function jsonErrorResult(text, err) {
    const loc = getJsonErrorLocation(text, err.message);
    return {
        status: loc ? `Invalid JSON — ${err.message} (${loc})` : `Invalid JSON — ${err.message}`,
        statusClass: "invalid",
    };
}

async function hashText(input, algorithm) {
    const data = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest(algorithm, data);
    return bufferToHex(digest);
}

/* ----------------------- DOM wiring ----------------------------- */

const QA_STORAGE_KEY = "std-qa-tools-state";

function initializeQaTools() {
    const toolSelect = document.getElementById("toolSelect");
    const toolDesc = document.getElementById("toolDesc");
    const qaInput = document.getElementById("qaInput");
    const qaOptions = document.getElementById("qaOptions");
    const qaActions = document.getElementById("qaActions");
    const qaOutput = document.getElementById("qaOutput");
    const qaStatus = document.getElementById("qaStatus");
    const clearAllBtn = document.getElementById("clearAllBtn");
    const loadSampleBtn = document.getElementById("loadSampleBtn");

    let saveTimer = null;

    function setStatus(message, statusClass) {
        qaStatus.textContent = message || "";
        qaStatus.classList.remove("valid", "invalid");
        if (statusClass) qaStatus.classList.add(statusClass);
    }

    // Best-effort only -- private browsing, a full quota, or a blocked
    // storage API should never break the tool itself, just skip the
    // "remember this across a refresh" convenience.
    function saveState() {
        try {
            localStorage.setItem(
                QA_STORAGE_KEY,
                JSON.stringify({
                    tool: toolSelect.value,
                    input: qaInput.hidden ? "" : qaInput.value,
                    output: qaOutput.value,
                })
            );
        } catch (err) {
            /* ignore */
        }
    }

    function scheduleSave() {
        if (saveTimer) clearTimeout(saveTimer);
        saveTimer = setTimeout(saveState, 300);
    }

    function loadPersistedState() {
        try {
            const raw = localStorage.getItem(QA_STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (err) {
            return null;
        }
    }

    function renderTool(key) {
        const tool = TOOLS[key];

        toolDesc.textContent = tool.desc;
        qaInput.placeholder = tool.placeholder || "";
        qaInput.hidden = tool.needsInput === false;
        qaInput.spellcheck = Boolean(tool.inputSpellcheck);

        loadSampleBtn.hidden = !tool.sample || tool.needsInput === false;

        qaOptions.innerHTML = "";
        if (tool.options && tool.options.length > 0) {
            qaOptions.hidden = false;
            tool.options.forEach((opt) => {
                const type = opt.type || "checkbox";

                if (type === "checkbox") {
                    const label = document.createElement("label");
                    label.className = "symbol-toggle";
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.id = opt.id;
                    label.appendChild(checkbox);
                    label.appendChild(document.createTextNode(opt.label));
                    qaOptions.appendChild(label);
                } else if (type === "select") {
                    const wrapper = document.createElement("label");
                    wrapper.className = "qa-inline-field";
                    wrapper.appendChild(document.createTextNode(opt.label));
                    const select = document.createElement("select");
                    select.id = opt.id;
                    (opt.choices || []).forEach((choice) => {
                        const optionEl = document.createElement("option");
                        optionEl.value = choice.value;
                        optionEl.textContent = choice.label;
                        select.appendChild(optionEl);
                    });
                    if (opt.default !== undefined) select.value = opt.default;
                    wrapper.appendChild(select);
                    qaOptions.appendChild(wrapper);
                } else if (type === "text") {
                    const wrapper = document.createElement("label");
                    wrapper.className = "qa-inline-field";
                    wrapper.appendChild(document.createTextNode(opt.label));
                    const input = document.createElement("input");
                    input.type = "text";
                    input.id = opt.id;
                    if (opt.placeholder) input.placeholder = opt.placeholder;
                    wrapper.appendChild(input);
                    qaOptions.appendChild(wrapper);
                }
            });
        } else {
            qaOptions.hidden = true;
        }

        qaActions.innerHTML = "";
        tool.actions.forEach((action) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = action.label;
            btn.addEventListener("click", () => runAction(key, action));
            qaActions.appendChild(btn);
        });

        setStatus("", "");
    }

    function collectOptions(tool) {
        const values = {};
        (tool.options || []).forEach((opt) => {
            const el = document.getElementById(opt.id);
            if (!el) {
                values[opt.id] = opt.type === "checkbox" || !opt.type ? false : "";
                return;
            }
            values[opt.id] = opt.type === "checkbox" || !opt.type ? el.checked : el.value;
        });
        return values;
    }

    async function runAction(key, action) {
        const tool = TOOLS[key];
        const inputText = tool.needsInput === false ? "" : qaInput.value;
        const opts = collectOptions(tool);

        const raw = await action.run(inputText, opts);
        const result = typeof raw === "string" ? { output: raw } : raw || {};

        if ("output" in result) {
            qaOutput.value = result.output;
        }
        setStatus(result.status, result.statusClass);
        saveState();
    }

    toolSelect.addEventListener("change", () => {
        renderTool(toolSelect.value);
        saveState();
    });

    clearAllBtn.addEventListener("click", () => {
        qaInput.value = "";
        qaOutput.value = "";
        setStatus("", "");
        qaOptions.querySelectorAll("input[type=checkbox]").forEach((cb) => {
            cb.checked = false;
        });
        qaOptions.querySelectorAll("input[type=text]").forEach((el) => {
            el.value = "";
        });
        saveState();
    });

    loadSampleBtn.addEventListener("click", () => {
        const tool = TOOLS[toolSelect.value];
        if (tool.sample) {
            qaInput.value = tool.sample;
            scheduleSave();
        }
    });

    qaInput.addEventListener("input", scheduleSave);

    const restored = loadPersistedState();
    if (restored && TOOLS[restored.tool]) {
        toolSelect.value = restored.tool;
    }

    renderTool(toolSelect.value);

    if (restored) {
        if (typeof restored.input === "string") qaInput.value = restored.input;
        if (typeof restored.output === "string") qaOutput.value = restored.output;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeQaTools();
});

if (typeof module !== "undefined") {
    module.exports = {
        cleanWhitespace,
        splitWords,
        capitalizeWord,
        convertCase,
        countSyllables,
        splitSentences,
        analyzeReadability,
        formatReadabilityResult,
        getJsonErrorLocation,
        utf8ToBase64,
        base64ToUtf8,
        encodeHtmlEntities,
        decodeHtmlEntities,
        bufferToHex,
        hexToRgb,
        rgbToHsl,
        parseDelimited,
        escapeDelimitedField,
        resolveDelimiterValue,
        convertDelimited,
        TOOLS,
    };
}
