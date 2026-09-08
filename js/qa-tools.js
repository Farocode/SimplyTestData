/* ============================================================
   QA Tools — tabbed input -> transform -> output utilities.
   Every tool here runs on native browser APIs only: no CDN
   script, no vendored library, no third-party call. See
   docs/qa-tools-generator-spec.md for the tools deliberately
   left out and how to add them later.
   ============================================================ */

/* ----------------------- Tabs ------------------------------ */

function initializeTabs() {
    const tabs = document.querySelectorAll(".qa-tab");
    const panels = document.querySelectorAll(".qa-category");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const category = tab.getAttribute("data-category");

            tabs.forEach((t) => {
                t.classList.toggle("active", t === tab);
                t.setAttribute("aria-selected", t === tab ? "true" : "false");
            });
            panels.forEach((panel) => {
                panel.hidden = panel.getAttribute("data-panel") !== category;
            });
        });
    });
}

/* ----------------------- Text Tools ------------------------- */

function cleanWhitespace(text, removeBlankLines) {
    const lines = text
        .split("\n")
        .map((line) => line.trim().replace(/[ \t]+/g, " "));

    const filtered = removeBlankLines
        ? lines.filter((line) => line.length > 0)
        : lines;

    return filtered.join("\n");
}

function initializeWhitespaceCleanup() {
    const input = document.getElementById("wsInput");
    const output = document.getElementById("wsOutput");
    const removeBlankLines = document.getElementById("wsRemoveBlankLines");
    const btn = document.getElementById("wsCleanBtn");

    btn.addEventListener("click", () => {
        output.value = cleanWhitespace(input.value, removeBlankLines.checked);
    });
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

function initializeCaseConversion() {
    const input = document.getElementById("caseInput");
    const output = document.getElementById("caseOutput");
    const buttons = document.querySelectorAll("[data-case]");

    buttons.forEach((btn) => {
        btn.addEventListener("click", () => {
            output.value = convertCase(input.value, btn.getAttribute("data-case"));
        });
    });
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
        return "Type or paste some text above, then click Analyze.";
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

function initializeReadabilityAnalyzer() {
    const input = document.getElementById("readInput");
    const output = document.getElementById("readOutput");
    const btn = document.getElementById("readAnalyzeBtn");

    btn.addEventListener("click", () => {
        const result = analyzeReadability(input.value);
        output.textContent = formatReadabilityResult(result);
    });
}

/* ----------------------- Format & Validate ------------------- */

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

function setJsonStatus(message, isValid) {
    const status = document.getElementById("jsonStatus");
    status.textContent = message;
    status.classList.remove("valid", "invalid");
    if (isValid === true) status.classList.add("valid");
    if (isValid === false) status.classList.add("invalid");
}

function initializeJsonTools() {
    const input = document.getElementById("jsonInput");
    const output = document.getElementById("jsonOutput");

    document.getElementById("jsonValidateBtn").addEventListener("click", () => {
        try {
            JSON.parse(input.value);
            setJsonStatus("Valid JSON.", true);
        } catch (err) {
            const loc = getJsonErrorLocation(input.value, err.message);
            setJsonStatus(
                loc ? `Invalid JSON — ${err.message} (${loc})` : `Invalid JSON — ${err.message}`,
                false
            );
        }
    });

    document.getElementById("jsonPrettyBtn").addEventListener("click", () => {
        try {
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed, null, 2);
            setJsonStatus("Valid JSON — pretty-printed below.", true);
        } catch (err) {
            const loc = getJsonErrorLocation(input.value, err.message);
            setJsonStatus(
                loc ? `Invalid JSON — ${err.message} (${loc})` : `Invalid JSON — ${err.message}`,
                false
            );
        }
    });

    document.getElementById("jsonMinifyBtn").addEventListener("click", () => {
        try {
            const parsed = JSON.parse(input.value);
            output.value = JSON.stringify(parsed);
            setJsonStatus("Valid JSON — minified below.", true);
        } catch (err) {
            const loc = getJsonErrorLocation(input.value, err.message);
            setJsonStatus(
                loc ? `Invalid JSON — ${err.message} (${loc})` : `Invalid JSON — ${err.message}`,
                false
            );
        }
    });
}

/* ----------------------- Encode / Decode --------------------- */

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

function initializeBase64Tool() {
    const input = document.getElementById("b64Input");
    const output = document.getElementById("b64Output");
    const status = document.getElementById("b64Status");

    document.getElementById("b64EncodeBtn").addEventListener("click", () => {
        try {
            output.value = utf8ToBase64(input.value);
            status.textContent = "";
        } catch (err) {
            status.textContent = `Couldn't encode: ${err.message}`;
        }
    });

    document.getElementById("b64DecodeBtn").addEventListener("click", () => {
        try {
            output.value = base64ToUtf8(input.value);
            status.textContent = "";
        } catch (err) {
            status.textContent = "That doesn't look like valid Base64.";
        }
    });
}

function initializeUrlTool() {
    const input = document.getElementById("urlInput");
    const output = document.getElementById("urlOutput");
    const status = document.getElementById("urlStatus");

    document.getElementById("urlEncodeBtn").addEventListener("click", () => {
        output.value = encodeURIComponent(input.value);
        status.textContent = "";
    });

    document.getElementById("urlDecodeBtn").addEventListener("click", () => {
        try {
            output.value = decodeURIComponent(input.value);
            status.textContent = "";
        } catch (err) {
            status.textContent = "That doesn't look like a valid encoded URL component.";
        }
    });
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

function initializeHtmlEntityTool() {
    const input = document.getElementById("htmlInput");
    const output = document.getElementById("htmlOutput");

    document.getElementById("htmlEncodeBtn").addEventListener("click", () => {
        output.value = encodeHtmlEntities(input.value);
    });

    document.getElementById("htmlDecodeBtn").addEventListener("click", () => {
        output.value = decodeHtmlEntities(input.value);
    });
}

/* ----------------------- Generators / Converters -------------- */

function initializeUuidGenerator() {
    const output = document.getElementById("uuidOutput");
    document.getElementById("uuidGenBtn").addEventListener("click", () => {
        output.textContent = crypto.randomUUID();
    });
}

function bufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

function initializeHashGenerator() {
    const input = document.getElementById("hashInput");
    const output = document.getElementById("hashOutput");
    const buttons = document.querySelectorAll("[data-hash]");

    buttons.forEach((btn) => {
        btn.addEventListener("click", async () => {
            const algorithm = btn.getAttribute("data-hash");
            const data = new TextEncoder().encode(input.value);
            const digest = await crypto.subtle.digest(algorithm, data);
            output.value = bufferToHex(digest);
        });
    });
}

function initializeTimestampConverter() {
    const unixInput = document.getElementById("tsUnixInput");
    const dateLocalOutput = document.getElementById("tsDateLocalOutput");
    const dateIsoOutput = document.getElementById("tsDateIsoOutput");

    document.getElementById("tsToDateBtn").addEventListener("click", () => {
        const seconds = Number(unixInput.value);
        if (!Number.isFinite(seconds)) {
            dateLocalOutput.textContent = "Enter a valid number of seconds.";
            dateIsoOutput.textContent = "—";
            return;
        }
        const date = new Date(seconds * 1000);
        dateLocalOutput.textContent = date.toString();
        dateIsoOutput.textContent = date.toISOString();
    });

    const dateInput = document.getElementById("tsDateInput");
    const unixOutput = document.getElementById("tsUnixOutput");

    document.getElementById("tsToUnixBtn").addEventListener("click", () => {
        if (!dateInput.value) {
            unixOutput.textContent = "Pick a date and time first.";
            return;
        }
        const date = new Date(dateInput.value);
        unixOutput.textContent = String(Math.floor(date.getTime() / 1000));
    });
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

function initializeColorConverter() {
    const hexInput = document.getElementById("colorHexInput");
    const rgbOutput = document.getElementById("colorRgbOutput");
    const hslOutput = document.getElementById("colorHslOutput");
    const status = document.getElementById("colorStatus");

    document.getElementById("colorConvertBtn").addEventListener("click", () => {
        const rgb = hexToRgb(hexInput.value);
        if (!rgb) {
            status.textContent = "Enter a valid hex color, e.g. #38bdf8 or #fff.";
            rgbOutput.textContent = "—";
            hslOutput.textContent = "—";
            return;
        }
        status.textContent = "";
        const hsl = rgbToHsl(rgb);
        rgbOutput.textContent = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        hslOutput.textContent = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
    });
}

/* ----------------------- Init --------------------------------- */

function initializeQaTools() {
    initializeTabs();
    initializeWhitespaceCleanup();
    initializeCaseConversion();
    initializeReadabilityAnalyzer();
    initializeJsonTools();
    initializeBase64Tool();
    initializeUrlTool();
    initializeHtmlEntityTool();
    initializeUuidGenerator();
    initializeHashGenerator();
    initializeTimestampConverter();
    initializeColorConverter();
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
        getJsonErrorLocation,
        utf8ToBase64,
        base64ToUtf8,
        encodeHtmlEntities,
        decodeHtmlEntities,
        bufferToHex,
        hexToRgb,
        rgbToHsl,
    };
}
