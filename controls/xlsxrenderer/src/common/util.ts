import { isNullOrUndefined } from '@syncfusion/ej2-base';
import { PdfColor, PdfFont, PdfStandardFont, PdfStringFormat, Size } from '@syncfusion/ej2-pdf';
import { Rgba, ExcelToPdfConverterSettings } from './interface';
import { LayoutOptions, GridLinesDisplayStyle } from './enum';

/** Default fallback black Rgba color structure. */
const DEFAULT_BLACK: Rgba = { r: 0, g: 0, b: 0, a: 255 };

/**
 * Normalizes an arbitrary hex color string into a 6-digit uppercase hex format.
 *
 * @param {string} rgb - The input hex string (3, 6, or 8 digits, with or without `#`).
 * @returns {string} Standardized 6-digit hex string, or empty string if input is falsy.
 */
export function formatHexColor(rgb: string): string {
    if (!rgb) {
        return '';
    }
    let hexString: string = rgb.startsWith('#') ? rgb.substring(1) : rgb;
    if (hexString.length === 8) {
        hexString = hexString.substring(2);
    } else if (hexString.length === 3) {
        hexString = hexString.split('').map((hexChar: string): string => hexChar + hexChar).join('');
    }
    return ('#' + hexString).toUpperCase();
}

/**
 * Parses a hex color string into an `Rgba` numerical object.
 * Supports 3-digit, 6-digit, and 8-digit forms. An 8-digit value starts with the alpha channel.
 *
 * @param {string} hexString - The hexadecimal color string to parse.
 * @param {Rgba} [defaultColor=DEFAULT_BLACK] - Optional default color used if parsing fails. Defaults to solid black.
 * @returns {Rgba} The evaluated `Rgba` color object.
 */
export function parseHexColor(hexString: string, defaultColor: Rgba = DEFAULT_BLACK): Rgba {
    if (!hexString) {
        return { r: defaultColor.r, g: defaultColor.g, b: defaultColor.b, a: defaultColor.a };
    }
    const clean: string = hexString.replace('#', '').trim();
    if (clean.length === 8) {
        return {
            a: parseInt(clean.substring(0, 2), 16),
            r: parseInt(clean.substring(2, 4), 16),
            g: parseInt(clean.substring(4, 6), 16),
            b: parseInt(clean.substring(6, 8), 16)
        };
    }
    if (clean.length === 6) {
        return {
            r: parseInt(clean.substring(0, 2), 16),
            g: parseInt(clean.substring(2, 4), 16),
            b: parseInt(clean.substring(4, 6), 16),
            a: 255
        };
    }
    if (clean.length === 3) {
        const c0: string = clean.charAt(0);
        const c1: string = clean.charAt(1);
        const c2: string = clean.charAt(2);
        return {
            r: parseInt(c0 + c0, 16),
            g: parseInt(c1 + c1, 16),
            b: parseInt(c2 + c2, 16),
            a: 255
        };
    }
    return { r: defaultColor.r, g: defaultColor.g, b: defaultColor.b, a: defaultColor.a };
}

/**
 * Ensures an Rgba color is non-transparent by converting zero alpha to fully opaque.
 *
 * @param {Rgba} color - The Rgba color to normalize.
 * @returns {Rgba} Normalized Rgba color.
 */
export function normalizeColor(color: Rgba): Rgba {
    return color.a === 0 ? { r: color.r, g: color.g, b: color.b, a: 255 } : color;
}

/**
 * Maps an internal Rgba structure into an ej2-pdf `PdfColor` object.
 *
 * @param {Rgba} color - Source Rgba color.
 * @returns {PdfColor} Compatible `PdfColor` object.
 */
export function toPdfColor(color: Rgba): PdfColor {
    return { r: color.r, g: color.g, b: color.b };
}


/**
 * Sanitizes a string for safe rendering with standard 14 PDF fonts (Latin-1 Windows-1252 character range).
 * Replaces unsupported symbols (e.g. ₹ to 'Rs.') and strips out-of-range Unicode characters to prevent font rendering errors.
 *
 * @param {string} text - The raw text string.
 * @param {PdfFont} font - Target PDF font instance.
 * @returns {string} Filtered, safe string compatible with standard font encodings.
 */
export function sanitizeTextForFont(text: string, font: PdfFont): string {
    if (isNullOrUndefined(text) || text.length === 0 || !(font instanceof PdfStandardFont)) {
        return isNullOrUndefined(text) ? '' : text;
    }
    const replaced: string = text.replace(/\u20B9/g, 'Rs.');
    let out: string = '';
    for (let charIndex: number = 0; charIndex < replaced.length; charIndex++) {
        const code: number = replaced.charCodeAt(charIndex);
        const isAsciiPrintable: boolean = (code >= 32 && code <= 126) || (code >= 160 && code <= 255);
        const isWhitespace: boolean = code === 9 || code === 10 || code === 13;
        const isSpecialQuoteOrDash: boolean = code === 0x20AC || code === 0x2013 || code === 0x2014
            || code === 0x2018 || code === 0x2019 || code === 0x201C || code === 0x201D;
        const keep: boolean = isWhitespace || isAsciiPrintable || isSpecialQuoteOrDash;
        out += keep ? (replaced.charAt(charIndex)) : '';
    }
    return out;
}

/**
 * Measures the physical rendering size (width and height in points) of a text string using the specified PDF font and format.
 *
 * @param {string} text - The text string to measure.
 * @param {PdfFont} font - The PDF font used for rendering.
 * @param {PdfStringFormat} [fmt] - Optional string formatting options (line alignment, wrapping, etc.).
 * @returns {Size} Size structure containing calculated width and height in points.
 */
export function measurePdfText(text: string, font: PdfFont, fmt?: PdfStringFormat): Size {
    const safeText: string = sanitizeTextForFont(text, font);
    try {
        const fontWithMeasure: { measureString: (val: string, format?: PdfStringFormat) => Size } =
            font as unknown as { measureString: (val: string, format?: PdfStringFormat) => Size };
        return !isNullOrUndefined(fmt) ? fontWithMeasure.measureString(safeText, fmt) : fontWithMeasure.measureString(safeText);
    } catch (_err) {
        return { width: safeText.length * font.size * 0.5, height: font.size * 1.2 };
    }
}


/**
 * Converts image payload data from various formats (Base64 string, Data URL, ArrayBuffer, Uint8Array) into a clean `Uint8Array`.
 *
 * @param {Uint8Array | ArrayBuffer | string | undefined} data - The input image data as binary or base64 text.
 * @returns {Uint8Array | null} Decoded `Uint8Array` of image bytes, or `null` if the input is null or undefined.
 */
export function decodeImageBytes(data: Uint8Array | ArrayBuffer | string | undefined): Uint8Array | null {
    if (isNullOrUndefined(data)) {
        return null;
    }
    if (data instanceof Uint8Array) {
        return data;
    }
    if (typeof data === 'string') {
        let str: string = data;
        const commaIdx: number = str.indexOf(',');
        if (str.indexOf('base64') !== -1 && commaIdx !== -1) {
            str = str.substring(commaIdx + 1);
        }
        const binStr: string = atob(str);
        const bytes: Uint8Array = new Uint8Array(binStr.length);
        for (let charIndex: number = 0; charIndex < binStr.length; charIndex++) {
            bytes.set([binStr.charCodeAt(charIndex)], charIndex);
        }
        return bytes;
    }
    return new Uint8Array(data);
}

/**
 * Inspects binary magic header bytes to verify if data represents a PNG image.
 *
 * @param {Uint8Array | null} bytes - Target byte buffer.
 * @returns {boolean} True if the byte header starts with the PNG signature (`\x89PNG`).
 */
export function isPngBytes(bytes: Uint8Array | null): boolean {
    return !isNullOrUndefined(bytes) && bytes.length >= 8
        && bytes[0 as number] === 137 && bytes[1 as number] === 80 && bytes[2 as number] === 78 && bytes[3 as number] === 71;
}

/**
 * Inspects binary magic header bytes to verify if data represents a JPEG image.
 *
 * @param {Uint8Array | null} bytes - Target byte buffer.
 * @returns {boolean} True if the byte header starts with the JPEG SOI signature (`\xFF\xD8`).
 */
export function isJpegBytes(bytes: Uint8Array | null): boolean {
    return !isNullOrUndefined(bytes) && bytes.length >= 2
        && bytes[0 as number] === 255 && bytes[1 as number] === 216;
}


/**
 * Formatted value interface with text and optional color.
 */
export interface FormattedValue {
    /** Formatted text string. */
    text: string;
    /** Optional resolved color hex code. */
    color?: string;
}

/**
 * Parsed format section representation.
 */
interface Section {
    body: string;
    color?: string;
    cond?: { op: string; value: number };
}

/**
 * Excel serial date components representation.
 */
export interface ExcelDateComponents {
    /** Year */
    y: number;
    /** Month (1-12) */
    m: number;
    /** Day of month (1-31) */
    d: number;
    /** Day of week (0-6) */
    wd: number;
}

/**
 * Token representation for parsed number format tokens.
 */
interface FormatToken {
    type: 'literal' | 'character' | 'bracket';
    value: string;
}

const NAMED_COLORS: { [key: string]: string } = {
    black: '#000000', blue: '#0000FF', cyan: '#00FFFF', green: '#00FF00',
    magenta: '#FF00FF', red: '#FF0000', white: '#FFFFFF', yellow: '#FFFF00'
};
const MONTHS: string[] = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
    'September', 'October', 'November', 'December'];
const DAYS: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Determines whether the specified format string represents a General format.
 *
 * @param {string | null | undefined} format - Format string to test
 * @returns {boolean} True if General or empty; false otherwise
 */
export function isGeneralFormat(format: string | null | undefined): boolean {
    return !format || format.trim().toLowerCase() === 'general';
}

/**
 * Formats a number using Excel General display rules with up to maxDigits significant digits.
 *
 * @param {number} value - Numeric value to format
 * @param {number} maxDigits - Maximum significant digits (default 10)
 * @returns {string} Formatted number string
 */
export function formatGeneral(value: number, maxDigits: number = 10): string {
    if (value === 0) {
        return '0';
    }
    if (!isFinite(value)) {
        return String(value);
    }
    const absoluteVal: number = Math.abs(value);
    if (absoluteVal >= 1e11 || absoluteVal < 1e-9) {
        const parts: string[] = value.toExponential(Math.max(0, Math.min(5, maxDigits - 1))).split('e');
        let mant: string = parts[0];
        if (mant.indexOf('.') >= 0) {
            mant = mant.replace(/0+$/, '').replace(/\.$/, '');
        }
        const exp: number = parseInt(parts[1], 10);
        const expAbsStr: string = String(Math.abs(exp));
        return mant + 'E' + (exp < 0 ? '-' : '+') + (expAbsStr.length < 2 ? '0' + expAbsStr : expAbsStr);
    }
    const rounded: number = parseFloat(value.toPrecision(maxDigits));
    if (Math.abs(rounded) < 1e-6) {
        const decimals: number = Math.min(20, maxDigits + Math.ceil(-Math.log(Math.abs(rounded)) / Math.LN10));
        return rounded.toFixed(decimals).replace(/0+$/, '').replace(/\.$/, '');
    }
    return String(rounded);
}

/**
 * Splits a full number format string into individual section strings.
 *
 * @param {string} formatPattern - Format pattern string
 * @returns {string[]} Array of section strings
 */
function splitSections(formatPattern: string): string[] {
    const out: string[] = [];
    let cur: string = '';
    let inQuotes: boolean = false;
    let inBracket: boolean = false;
    for (let charIndex: number = 0; charIndex < formatPattern.length; charIndex++) {
        const ch: string = formatPattern.charAt(charIndex);
        if (ch === '\\' && !inQuotes) {
            cur += ch + formatPattern.charAt(charIndex + 1);
            charIndex++;
            continue;
        }
        if (ch === '"') {
            inQuotes = !inQuotes;
        } else if (!inQuotes && ch === '[') {
            inBracket = true;
        } else if (!inQuotes && ch === ']') {
            inBracket = false;
        }
        if (ch === ';' && !inQuotes && !inBracket) {
            out.push(cur);
            cur = '';
        } else {
            cur += ch;
        }
    }
    out.push(cur);
    return out;
}

/**
 * Parses an individual format section into body, condition, and color.
 *
 * @param {string} rawSection - Raw section string
 * @returns {Section} Parsed section structure
 */
function parseSection(rawSection: string): Section {
    const sec: Section = { body: '' };
    let charIndex: number = 0;
    while (charIndex < rawSection.length) {
        const ch: string = rawSection.charAt(charIndex);
        if (ch === '"') {
            const end: number = rawSection.indexOf('"', charIndex + 1);
            const stop: number = end < 0 ? rawSection.length - 1 : end;
            sec.body += rawSection.substring(charIndex, stop + 1);
            charIndex = stop + 1;
        } else if (ch === '\\') {
            sec.body += rawSection.substring(charIndex, charIndex + 2);
            charIndex += 2;
        } else if (ch === '[') {
            const end: number = rawSection.indexOf(']', charIndex);
            if (end < 0) {
                sec.body += rawSection.substring(charIndex);
                break;
            }
            const inner: string = rawSection.substring(charIndex + 1, end);
            const lower: string = inner.toLowerCase();
            const trimmedInner: string = inner.trim();
            let op: string = '';
            let valStr: string = '';
            if (trimmedInner.startsWith('<=') || trimmedInner.startsWith('>=') || trimmedInner.startsWith('<>')) {
                op = trimmedInner.substring(0, 2);
                valStr = trimmedInner.substring(2).trim();
            } else if (trimmedInner.startsWith('<') || trimmedInner.startsWith('>') || trimmedInner.startsWith('=')) {
                op = trimmedInner.substring(0, 1);
                valStr = trimmedInner.substring(1).trim();
            }
            const isNumeric: boolean = valStr.length > 0 && !isNaN(Number(valStr));
            if (Object.prototype.hasOwnProperty.call(NAMED_COLORS, lower)) {
                const colorMap: { [key: string]: string } = NAMED_COLORS;
                sec.color = colorMap[lower as string];
            } else if (/^color\s*\d+$/.test(lower)) {
                sec.color = undefined;
            } else if (isNumeric) {
                sec.cond = { op: op, value: parseFloat(valStr) };
            } else {
                sec.body += rawSection.substring(charIndex, end + 1);
            }
            charIndex = end + 1;
        } else {
            sec.body += ch;
            charIndex++;
        }
    }
    return sec;
}

/**
 * Tokenizes the body of a format section into literal and placeholder tokens.
 *
 * @param {string} body - Format section body string
 * @returns {FormatToken[]} Array of tokens
 */
function tokenize(body: string): FormatToken[] {
    const tokens: FormatToken[] = [];
    let charIndex: number = 0;
    while (charIndex < body.length) {
        const ch: string = body.charAt(charIndex);
        if (ch === '"') {
            const end: number = body.indexOf('"', charIndex + 1);
            const stop: number = end < 0 ? body.length : end;
            tokens.push({ type: 'literal', value: body.substring(charIndex + 1, stop) });
            charIndex = stop + 1;
        } else if (ch === '\\') {
            tokens.push({ type: 'literal', value: body.charAt(charIndex + 1) });
            charIndex += 2;
        } else if (ch === '_') {
            tokens.push({ type: 'literal', value: ' ' });
            charIndex += 2;
        } else if (ch === '*') {
            charIndex += 2;
        } else if (ch === '[') {
            const end: number = body.indexOf(']', charIndex);
            const stop: number = end < 0 ? body.length : end;
            const inner: string = body.substring(charIndex + 1, stop);
            if (inner.charAt(0) === '$') {
                const dash: number = inner.indexOf('-');
                const sym: string = dash >= 0 ? inner.substring(1, dash) : inner.substring(1);
                const lcid: string = dash >= 0 ? inner.substring(dash + 1).toLowerCase() : '';
                const fallbackSym: string = lcid.indexOf('4009') >= 0 ? '₹ ' : (lcid === '409' ? '$' : (lcid === '809' ? '£' : ''));
                const resolvedSym: string = sym || fallbackSym;
                tokens.push({ type: 'literal', value: resolvedSym });
            } else {
                tokens.push({ type: 'bracket', value: inner });
            }
            charIndex = stop + 1;
        } else {
            tokens.push({ type: 'character', value: ch });
            charIndex++;
        }
    }
    return tokens;
}

/**
 * Checks if a token is a digit placeholder (0, #, ?).
 *
 * @param {FormatToken | undefined} token - Token to check
 * @returns {boolean} True if placeholder; false otherwise
 */
function isPh(token: FormatToken | undefined): boolean {
    return !isNullOrUndefined(token) && token.type === 'character'
        && (token.value === '0' || token.value === '#' || token.value === '?');
}

/**
 * Checks if the tokens represent a date/time format pattern.
 *
 * @param {FormatToken[]} tokens - Token array
 * @returns {boolean} True if date format tokens; false otherwise
 */
function isDateTokens(tokens: FormatToken[]): boolean {
    let letters: string = '';
    for (let charIndex: number = 0; charIndex < tokens.length; charIndex++) {
        const token: FormatToken = tokens[charIndex as number];
        if (!isNullOrUndefined(token)) {
            if (token.type === 'bracket' && /^(h+|m+|s+)$/i.test(token.value)) {
                return true;
            }
            if (token.type === 'character') {
                letters += token.value;
            }
        }
    }
    const cleanLetters: string = letters.replace(/general/ig, '');
    return /[ymdhs]/i.test(cleanLetters) || /am\/pm|a\/p/i.test(cleanLetters);
}

/**
 * Formats a number to fixed decimals with standard rounding.
 *
 * @param {number} value - Numeric value
 * @param {number} decimals - Number of decimal places
 * @returns {string} Fixed string
 */
function toFixedRounded(value: number, decimals: number): string {
    const strVal: string = String(value);
    if (strVal.indexOf('e') >= 0 || value >= 1e15) {
        return value.toFixed(decimals);
    }
    const shifted: number = Math.round(Number(strVal + 'e' + decimals));
    if (isNaN(shifted)) {
        return value.toFixed(decimals);
    }
    return Number(shifted + 'e-' + decimals).toFixed(decimals);
}

/**
 * Extracts literal output from a token.
 *
 * @param {FormatToken} token - Token to extract text from
 * @returns {string} Literal string
 */
function literalOut(token: FormatToken): string {
    return token.type === 'bracket' ? '' : token.value;
}

/**
 * Formats a number with plain decimal / integer format tokens.
 *
 * @param {FormatToken[]} tokens - Token array
 * @param {number} valueIn - Input numeric value
 * @returns {string} Formatted plain numeric string
 */
function formatPlain(tokens: FormatToken[], valueIn: number): string {
    let numericValue: number = valueIn;
    let dotIdx: number = -1;
    for (let i: number = 0; i < tokens.length; i++) {
        const curTok: FormatToken = tokens[i as number];
        if (!isNullOrUndefined(curTok) && curTok.type === 'character' && curTok.value === '.') {
            dotIdx = i;
            break;
        }
    }
    const intEnd: number = dotIdx >= 0 ? dotIdx : tokens.length;
    const intPh: number[] = [];
    for (let i: number = 0; i < intEnd; i++) {
        if (isPh(tokens[i as number])) {
            intPh.push(i);
        }
    }
    const decPh: number[] = [];
    if (dotIdx >= 0) {
        for (let i: number = dotIdx + 1; i < tokens.length; i++) {
            if (isPh(tokens[i as number])) {
                decPh.push(i);
            }
        }
    }
    if (intPh.length === 0 && decPh.length === 0) {
        let literalStr: string = '';
        for (let i: number = 0; i < tokens.length; i++) {
            const t: FormatToken = tokens[i as number];
            if (!isNullOrUndefined(t)) {
                literalStr += literalOut(t);
            }
        }
        return literalStr;
    }
    let commaCount: number = 0;
    const scaleIdx: Set<number> = new Set<number>();
    for (let i: number = intEnd - 1; i >= 0; i--) {
        const curTok: FormatToken = tokens[i as number];
        if (!isNullOrUndefined(curTok) && curTok.type === 'character' && curTok.value === ',') {
            if (intPh.length > 0 && i > (intPh[(intPh.length - 1) as number] || 0)) {
                commaCount++;
                scaleIdx.add(i);
            }
        } else if (isPh(curTok)) {
            break;
        }
    }
    if (commaCount > 0) {
        numericValue = numericValue / Math.pow(1000, commaCount);
    }
    const useGrouping: boolean = tokens.some((t: FormatToken, idx: number): boolean =>
        t.type === 'character' && t.value === ',' && !scaleIdx.has(idx) && intPh.length > 0
        && idx > (intPh[0 as number] || 0) && idx < (intPh[(intPh.length - 1) as number] || 0));
    const decCount: number = decPh.length;
    const roundedStr: string = toFixedRounded(numericValue, decCount);
    const splitDot: string[] = roundedStr.split('.');
    let intStr: string = splitDot[0 as number] || '';
    const decStr: string = splitDot[1 as number] || '';
    if (decCount === 0 && dotIdx < 0) {
        intStr = toFixedRounded(numericValue, 0);
    }
    if (useGrouping) {
        let grpResult: string = '';
        let count: number = 0;
        for (let grpIdx: number = intStr.length - 1; grpIdx >= 0; grpIdx--) {
            const grpChar: string = intStr.charAt(grpIdx);
            if (grpChar >= '0' && grpChar <= '9') {
                if (count > 0 && count % 3 === 0) {
                    grpResult = ',' + grpResult;
                }
                count++;
            }
            grpResult = grpChar + grpResult;
        }
        intStr = grpResult;
    }
    let out: string = '';
    const intChars: string[] = intStr.split('');
    const firstInt: number = intPh.length > 0 ? (intPh[0 as number] || -1) : -1;
    const lastInt: number = intPh.length > 0 ? (intPh[(intPh.length - 1) as number] || -1) : -1;
    let phIntCursor: number = intPh.length - 1;
    let valIntCursor: number = intChars.length - 1;
    const intEmit: Map<number, string> = new Map<number, string>();
    while (phIntCursor >= 0 || valIntCursor >= 0) {
        if (phIntCursor >= 0 && valIntCursor >= 0) {
            const phIdx: number = intPh[phIntCursor as number] || 0;
            const phTok: FormatToken = tokens[phIdx as number];
            const ch: string = !isNullOrUndefined(phTok) ? phTok.value : '';
            const digit: string = intChars[valIntCursor as number] || '';
            if (ch === '0' || ch === '#') {
                intEmit.set(phIdx, digit);
            } else if (ch === '?') {
                intEmit.set(phIdx, digit);
            }
            phIntCursor--;
            valIntCursor--;
        } else if (phIntCursor >= 0) {
            const phIdx: number = intPh[phIntCursor as number] || 0;
            const phTok: FormatToken = tokens[phIdx as number];
            const ch: string = !isNullOrUndefined(phTok) ? phTok.value : '';
            if (ch === '0') {
                intEmit.set(phIdx, '0');
            } else if (ch === '?') {
                intEmit.set(phIdx, ' ');
            }
            phIntCursor--;
        } else {
            const rest: string = intChars.slice(0, valIntCursor + 1).join('');
            const targetIdx: number = firstInt >= 0 ? firstInt : 0;
            const existing: string = intEmit.get(targetIdx) || '';
            intEmit.set(targetIdx, rest + existing);
            break;
        }
    }
    const decEmit: Map<number, string> = new Map<number, string>();
    let lastNonZeroDec: number = -1;
    for (let i: number = decStr.length - 1; i >= 0; i--) {
        if (decStr.charAt(i) !== '0') {
            lastNonZeroDec = i;
            break;
        }
    }
    for (let i: number = 0; i < decPh.length; i++) {
        const phIdx: number = decPh[i as number] || 0;
        const phTok: FormatToken = tokens[phIdx as number];
        const ch: string = !isNullOrUndefined(phTok) ? phTok.value : '';
        const digit: string = i < decStr.length ? decStr.charAt(i) : '0';
        if (ch === '0') {
            decEmit.set(phIdx, digit);
        } else if (ch === '#') {
            if (i <= lastNonZeroDec) {
                decEmit.set(phIdx, digit);
            }
        } else if (ch === '?') {
            if (i <= lastNonZeroDec) {
                decEmit.set(phIdx, digit);
            } else {
                decEmit.set(phIdx, ' ');
            }
        }
    }
    const hasDecDigits: boolean = Array.from(decEmit.values()).some((str: string): boolean => str.trim().length > 0);
    for (let i: number = 0; i < tokens.length; i++) {
        const t: FormatToken = tokens[i as number];
        if (isNullOrUndefined(t)) {
            continue;
        }
        if (intEmit.has(i)) {
            out += intEmit.get(i);
        } else if (intPh.indexOf(i) >= 0) {
            // Unfilled integer placeholder (e.g. '#' when value doesn't have enough digits) emits nothing
        } else if (decEmit.has(i)) {
            out += decEmit.get(i);
        } else if (decPh.indexOf(i) >= 0) {
            // Unfilled decimal placeholder (e.g. '#' when no trailing non-zero decimal) emits nothing
        } else if (i === dotIdx) {
            if (hasDecDigits || decPh.length === 0) {
                out += '.';
            }
        } else if (t.type === 'character' && t.value === ',') {
            if (!(i > firstInt && i < lastInt) && !scaleIdx.has(i)) {
                out += ',';
            }
        } else {
            out += literalOut(t);
        }
    }
    return out;
}

/**
 * Formats a number using scientific notation.
 *
 * @param {FormatToken[]} tokens - Token array
 * @param {number} eIdx - Index of exponential token
 * @param {number} value - Input value
 * @returns {string} Formatted scientific string
 */
function formatScientific(tokens: FormatToken[], eIdx: number, value: number): string {
    const mantToks: FormatToken[] = tokens.slice(0, eIdx);
    const signTok: FormatToken = tokens[(eIdx + 1) as number];
    const sign: string = !isNullOrUndefined(signTok) ? signTok.value : '';
    let j: number = eIdx + 2;
    let expDigits: number = 0;
    while (j < tokens.length && isPh(tokens[j as number])) {
        expDigits++;
        j++;
    }
    let intDigits: number = 0;
    let decDigits: number = 0;
    let seenDot: boolean = false;
    for (let i: number = 0; i < mantToks.length; i++) {
        const curTok: FormatToken = mantToks[i as number];
        if (!isNullOrUndefined(curTok)) {
            if (curTok.type === 'character' && curTok.value === '.') {
                seenDot = true;
            }
            if (isPh(curTok)) {
                if (seenDot) {
                    decDigits++;
                } else {
                    intDigits++;
                }
            }
        }
    }
    intDigits = Math.max(1, intDigits);
    let exp: number = value === 0 ? 0 : Math.floor(Math.log(value) / Math.LN10) - (intDigits - 1);
    let mant: number = value === 0 ? 0 : value / Math.pow(10, exp);
    if (value !== 0 && parseFloat(toFixedRounded(mant, decDigits)) >= Math.pow(10, intDigits)) {
        exp++;
        mant = value / Math.pow(10, exp);
    }
    const expAbs: string = String(Math.abs(exp));
    const padded: string = expAbs.length < Math.max(1, expDigits) ?
        new Array(Math.max(1, expDigits) - expAbs.length + 1).join('0') + expAbs : expAbs;
    const expSign: string = exp < 0 ? '-' : (sign === '+' ? '+' : '');
    let tail: string = '';
    for (let i: number = j; i < tokens.length; i++) {
        const curTok: FormatToken = tokens[i as number];
        if (!isNullOrUndefined(curTok)) {
            tail += literalOut(curTok);
        }
    }
    return formatPlain(mantToks, mant) + 'E' + expSign + padded + tail;
}

/**
 * Formats a numeric value as a fraction according to format tokens.
 *
 * @param {FormatToken[]} tokens - Token array
 * @param {number} slash - Slash index
 * @param {number} value - Input value
 * @returns {string} Formatted fraction string
 */
function formatFraction(tokens: FormatToken[], slash: number, value: number): string {
    let numStart: number = slash;
    while (numStart - 1 >= 0 && isPh(tokens[(numStart - 1) as number])) {
        numStart--;
    }
    let denEnd: number = slash + 1;
    let fixedDen: string = '';
    let phDen: number = 0;
    while (denEnd < tokens.length) {
        const t: FormatToken = tokens[denEnd as number];
        if (isNullOrUndefined(t)) {
            break;
        }
        if (t.type === 'character' && /[1-9]/.test(t.value) && phDen === 0) {
            fixedDen += t.value;
            denEnd++;
            while (denEnd < tokens.length) {
                const subT: FormatToken = tokens[denEnd as number];
                if (!isNullOrUndefined(subT) && subT.type === 'character' && /[0-9]/.test(subT.value)) {
                    fixedDen += subT.value;
                    denEnd++;
                } else {
                    break;
                }
            }
            break;
        } else if (isPh(t) && fixedDen === '') {
            phDen++;
            denEnd++;
        } else {
            break;
        }
    }
    const numLen: number = slash - numStart;
    let wholeStart: number = -1;
    let wholeEnd: number = -1;
    const prev1: FormatToken = tokens[(numStart - 1) as number];
    const prev2: FormatToken = tokens[(numStart - 2) as number];
    if (numStart - 2 >= 0 && !isNullOrUndefined(prev1) && prev1.type === 'character' && prev1.value === ' ' && isPh(prev2)) {
        wholeEnd = numStart - 2;
        wholeStart = wholeEnd;
        while (wholeStart - 1 >= 0 && isPh(tokens[(wholeStart - 1) as number])) {
            wholeStart--;
        }
    }
    const hasWhole: boolean = wholeStart >= 0;
    const whole: number = hasWhole ? Math.floor(value) : 0;
    const frac: number = hasWhole ? value - whole : value;
    let num: number = 0;
    let den: number = 1;
    if (fixedDen) {
        den = parseInt(fixedDen, 10);
        num = Math.round(frac * den);
    } else {
        const maxDen: number = Math.pow(10, Math.max(1, phDen)) - 1;
        let best: number = Infinity;
        for (let dd: number = 1; dd <= maxDen; dd++) {
            const nn: number = Math.round(frac * dd);
            const err: number = Math.abs(frac - nn / dd);
            if (err < best - 1e-12) {
                best = err;
                num = nn;
                den = dd;
            }
        }
    }
    let wholeOut: number = whole;
    if (hasWhole && num >= den) {
        wholeOut += 1;
        num = 0;
    }
    const prefixEnd: number = hasWhole ? wholeStart : numStart;
    let out: string = '';
    for (let i: number = 0; i < prefixEnd; i++) {
        const curTok: FormatToken = tokens[i as number];
        if (!isNullOrUndefined(curTok)) {
            out += literalOut(curTok);
        }
    }
    if (hasWhole) {
        out += wholeOut === 0 && num !== 0 ? '' : String(wholeOut);
        out += num === 0 ? '' : ' ';
    }
    if (num !== 0 || !hasWhole) {
        let ns: string = String(num);
        const numStartTok: FormatToken = tokens[numStart as number];
        while (ns.length < numLen && !isNullOrUndefined(numStartTok) && numStartTok.value === '?') {
            ns = ' ' + ns;
        }
        out += num === 0 && !hasWhole ? '0' : ns + '/' + den;
    }
    for (let i: number = denEnd; i < tokens.length; i++) {
        const curTok: FormatToken = tokens[i as number];
        if (!isNullOrUndefined(curTok)) {
            out += literalOut(curTok);
        }
    }
    return out;
}

/**
 * Left-pads a number to 2 digits.
 *
 * @param {number} val - Number to pad
 * @returns {string} 2-digit padded string
 */
function pad2(val: number): string {
    return val < 10 ? '0' + val : String(val);
}

/**
 * Converts an Excel serial date number to year, month, day, and weekday components.
 *
 * @param {number} serial - Excel serial date
 * @returns {ExcelDateComponents} Date components
 */
function serialToDate(serial: number): ExcelDateComponents {
    if (serial < 1) {
        return { y: 1900, m: 1, d: 0, wd: 6 };
    }
    if (serial === 60) {
        return { y: 1900, m: 2, d: 29, wd: 3 };
    }
    const base: number = serial < 60 ? Date.UTC(1899, 11, 31) : Date.UTC(1899, 11, 30);
    const dt: Date = new Date(base + serial * 86400000);
    return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate(), wd: (serial - 1) % 7 };
}

/**
 * Date component token representation for parsed date format tokens.
 */
interface DateFormatPart {
    type: string;
    value: string;
}

/**
 * Formats an Excel date serial using date/time format tokens.
 *
 * @param {FormatToken[]} tokens - Token array
 * @param {number} serial - Excel serial date number
 * @returns {string} Formatted date string
 */
function formatDate(tokens: FormatToken[], serial: number): string {
    const parts: DateFormatPart[] = [];
    let hasFrac: boolean = false;
    let hasAmPm: boolean = false;
    let i: number = 0;
    while (i < tokens.length) {
        const tk: FormatToken = tokens[i as number];
        if (isNullOrUndefined(tk)) {
            i++;
            continue;
        }
        if (tk.type === 'literal') {
            parts.push({ type: 'literal', value: tk.value });
            i++;
        } else if (tk.type === 'bracket') {
            parts.push({ type: 'elapsed', value: tk.value });
            i++;
        } else {
            const ch: string = tk.value;
            let run: string = ch;
            let j: number = i + 1;
            while (j < tokens.length) {
                const nextTk: FormatToken = tokens[j as number];
                if (!isNullOrUndefined(nextTk) && nextTk.type === 'character' && nextTk.value.toLowerCase() === ch.toLowerCase()) {
                    run += nextTk.value;
                    j++;
                } else {
                    break;
                }
            }
            const low: string = run.toLowerCase();
            if (low.charAt(0) === 'a' && (low === 'am/pm' || low === 'a/p')) {
                hasAmPm = true;
                parts.push({ type: 'ampm', value: run });
            } else if (low.charAt(0) === 'y') {
                parts.push({ type: 'y', value: run });
            } else if (low.charAt(0) === 'm') {
                parts.push({ type: 'm', value: run });
            } else if (low.charAt(0) === 'd') {
                parts.push({ type: 'd', value: run });
            } else if (low.charAt(0) === 'h') {
                parts.push({ type: 'h', value: run });
            } else if (low.charAt(0) === 's') {
                parts.push({ type: 's', value: run });
            } else if (low.charAt(0) === '0') {
                hasFrac = true;
                parts.push({ type: 'frac', value: run });
            } else {
                parts.push({ type: 'literal', value: run });
            }
            i = j;
        }
    }
    for (let k: number = 0; k < parts.length; k++) {
        const curPart: DateFormatPart = parts[k as number];
        if (!isNullOrUndefined(curPart) && curPart.type === 'm') {
            let prevH: boolean = false;
            for (let p: number = k - 1; p >= 0; p--) {
                const prevPart: DateFormatPart = parts[p as number];
                if (!isNullOrUndefined(prevPart)) {
                    if (prevPart.type === 'h' || prevPart.type === 'elapsed') {
                        prevH = true;
                        break;
                    }
                    if (prevPart.type === 'y' || prevPart.type === 'd') {
                        break;
                    }
                }
            }
            let nextS: boolean = false;
            for (let p: number = k + 1; p < parts.length; p++) {
                const nextPart: DateFormatPart = parts[p as number];
                if (!isNullOrUndefined(nextPart)) {
                    if (nextPart.type === 's') {
                        nextS = true;
                        break;
                    }
                    if (nextPart.type === 'y' || nextPart.type === 'd') {
                        break;
                    }
                }
            }
            if (prevH || nextS) {
                curPart.type = 'min';
            }
        }
    }
    const daySerial: number = Math.floor(serial);
    const timeFrac: number = serial - daySerial;
    const totalSecs: number = Math.round(timeFrac * 86400 * (hasFrac ? 1000 : 1)) / (hasFrac ? 1000 : 1);
    const date: ExcelDateComponents = serialToDate(daySerial);
    const hh: number = Math.floor(totalSecs / 3600) % 24;
    const mm: number = Math.floor((totalSecs % 3600) / 60);
    const ss: number = Math.floor(totalSecs % 60);
    const ms: number = Math.round((totalSecs - Math.floor(totalSecs)) * 1000);
    let out: string = '';
    for (let k: number = 0; k < parts.length; k++) {
        const pt: DateFormatPart = parts[k as number];
        if (isNullOrUndefined(pt)) {
            continue;
        }
        const n: number = pt.value.length;
        switch (pt.type) {
        case 'literal':
            out += pt.value;
            break;
        case 'y':
            out += n <= 2 ? pad2(date.y % 100) : String(date.y);
            break;
        case 'm': {
            const monthIdx: number = date.m - 1;
            const monthsList: string[] = MONTHS;
            if (n === 1) {
                out += String(date.m);
            } else if (n === 2) {
                out += pad2(date.m);
            } else if (n === 3) {
                out += monthsList[monthIdx as number].substring(0, 3);
            } else if (n === 5) {
                out += monthsList[monthIdx as number].charAt(0);
            } else {
                out += monthsList[monthIdx as number];
            }
            break;
        }
        case 'd': {
            const daysList: string[] = DAYS;
            const dayIdx: number = date.wd;
            out += n === 1 ? String(date.d) : (n === 2 ? pad2(date.d) :
                (n === 3 ? daysList[dayIdx as number].substring(0, 3) : daysList[dayIdx as number]));
            break;
        }
        case 'h': {
            const h: number = hasAmPm ? ((hh % 12) === 0 ? 12 : hh % 12) : hh;
            out += n === 1 ? String(h) : pad2(h);
            break;
        }
        case 'min':
            out += n === 1 ? String(mm) : pad2(mm);
            break;
        case 's':
            out += n === 1 ? String(ss) : pad2(ss);
            break;
        case 'frac': {
            const msStr: string = pad2(ms) + '0';
            out += msStr.substring(0, Math.min(n, msStr.length));
            break;
        }
        case 'ampm': {
            const isPm: boolean = hh >= 12;
            const isShort: boolean = pt.value.toLowerCase() === 'a/p';
            out += isPm ? (isShort ? 'P' : 'PM') : (isShort ? 'A' : 'AM');
            break;
        }
        case 'elapsed': {
            const code: string = pt.value.toLowerCase();
            if (code.indexOf('h') >= 0) {
                out += String(Math.floor(serial * 24));
            } else if (code.indexOf('m') >= 0) {
                out += String(Math.floor(serial * 1440));
            } else if (code.indexOf('s') >= 0) {
                out += String(Math.floor(serial * 86400));
            }
            break;
        }
        default:
            break;
        }
    }
    return out;
}

/**
 * Checks whether a number matches a section's condition.
 *
 * @param {Section} sec - Section with optional condition
 * @param {number} value - Numeric value to compare
 * @returns {boolean} True if section matches; false otherwise
 */
function sectionMatches(sec: Section, value: number): boolean {
    if (!sec.cond) {
        return true;
    }
    const c: { op: string; value: number } = sec.cond;
    switch (c.op) {
    case '<':
        return value < c.value;
    case '<=':
        return value <= c.value;
    case '>':
        return value > c.value;
    case '>=':
        return value >= c.value;
    case '=':
        return value === c.value;
    case '<>':
        return value !== c.value;
    default:
        return false;
    }
}

/**
 * Formats a number (or serial date) with an Excel number-format code.
 *
 * @param {number} value - Numeric value to format
 * @param {string} format - Excel number format string
 * @returns {FormattedValue} Object containing formatted text and optional color
 */
export function formatNumber(value: number, format: string): FormattedValue {
    if (!isFinite(value)) {
        return { text: String(value) };
    }
    if (isGeneralFormat(format)) {
        return { text: formatGeneral(value) };
    }
    const secs: Section[] = splitSections(format).map(parseSection);
    const n: number = secs.length;
    let hasCond: boolean = false;
    for (let i: number = 0; i < n; i++) {
        const curSec: Section = secs[i as number];
        if (!isNullOrUndefined(curSec) && curSec.cond) {
            hasCond = true;
        }
    }
    let idx: number = 0;
    if (!hasCond) {
        if (n === 2) {
            idx = value < 0 ? 1 : 0;
        } else if (n >= 3) {
            idx = value > 0 ? 0 : (value < 0 ? 1 : 2);
        }
    } else {
        idx = n - 1;
        for (let i: number = 0; i < n; i++) {
            const curSec: Section = secs[i as number];
            if (!isNullOrUndefined(curSec) && sectionMatches(curSec, value)) {
                idx = i;
                break;
            }
        }
    }
    const sec: Section = secs[idx as number];
    if (isNullOrUndefined(sec)) {
        return { text: String(value) };
    }
    const tokens: FormatToken[] = tokenize(sec.body);
    const color: string | undefined = sec.color ? formatHexColor(sec.color) : undefined;
    const showMinus: boolean = value < 0 && n === 1;
    const v: number = Math.abs(value);
    if (isDateTokens(tokens)) {
        if (value < 0) {
            return { text: '#######', color: color };
        }
        return { text: formatDate(tokens, value), color: color };
    }
    let text: string;
    const joined: string = tokens.map((t: FormatToken): string => (t.type === 'character' ? t.value : '\u0001')).join('');
    if (/general/i.test(joined)) {
        let o: string = '';
        let i: number = 0;
        while (i < tokens.length) {
            if (/^general/i.test(joined.substring(i))) {
                o += formatGeneral(v);
                i += 7;
            } else {
                const curTok: FormatToken = tokens[i as number];
                o += !isNullOrUndefined(curTok) && curTok.type === 'bracket' ? '' : (!isNullOrUndefined(curTok) ? curTok.value : '');
                i++;
            }
        }
        text = o;
    } else {
        let pct: number = 0;
        for (let i: number = 0; i < tokens.length; i++) {
            const curTok: FormatToken = tokens[i as number];
            if (!isNullOrUndefined(curTok) && curTok.type === 'character' && curTok.value === '%') {
                pct++;
            }
        }
        const pv: number = v * Math.pow(100, pct);
        let eIdx: number = -1;
        for (let i: number = 0; i < tokens.length - 1; i++) {
            const t0: FormatToken = tokens[i as number];
            const t1: FormatToken = tokens[(i + 1) as number];
            if (!isNullOrUndefined(t0) && !isNullOrUndefined(t1) && t0.type === 'character'
                && (t0.value === 'E' || t0.value === 'e') && t1.type === 'character' && (t1.value === '+' || t1.value === '-')) {
                eIdx = i;
                break;
            }
        }
        let slash: number = -1;
        for (let i: number = 1; i < tokens.length - 1; i++) {
            const curTok: FormatToken = tokens[i as number];
            if (!isNullOrUndefined(curTok) && curTok.type === 'character' && curTok.value === '/' && isPh(tokens[(i - 1) as number])) {
                slash = i;
                break;
            }
        }
        if (eIdx >= 0) {
            text = formatScientific(tokens, eIdx, pv);
        } else if (slash >= 0) {
            text = formatFraction(tokens, slash, pv);
        } else {
            text = formatPlain(tokens, pv);
        }
    }
    return { text: (showMinus ? '-' : '') + text, color: color };
}

/**
 * Applies the text section (@) of a format to a string value.
 *
 * @param {string} text - Input text string
 * @param {string} format - Excel number format string
 * @returns {FormattedValue} Object containing formatted text and optional color
 */
export function formatText(text: string, format: string): FormattedValue {
    if (isNullOrUndefined(text)) {
        return { text: '' };
    }
    if (isGeneralFormat(format)) {
        return { text: text };
    }
    const secs: Section[] = splitSections(format).map(parseSection);
    let sec: Section | undefined = secs.length >= 4 ? secs[3 as number] : undefined;
    if (!sec) {
        for (let i: number = 0; i < secs.length; i++) {
            const s: Section = secs[i as number];
            if (!isNullOrUndefined(s) && s.body.indexOf('@') >= 0) {
                sec = s;
                break;
            }
        }
    }
    if (!sec) {
        return { text: text };
    }
    const tokens: FormatToken[] = tokenize(sec.body);
    let out: string = '';
    for (let i: number = 0; i < tokens.length; i++) {
        const curTok: FormatToken = tokens[i as number];
        if (!isNullOrUndefined(curTok)) {
            out += curTok.type === 'character' && curTok.value === '@' ? text : literalOut(curTok);
        }
    }
    return { text: out, color: sec.color ? formatHexColor(sec.color) : undefined };
}

/**
 * Converts a JS Date to an Excel serial number (UTC).
 *
 * @param {Date} dateVal - JavaScript Date object
 * @returns {number} Excel date serial number
 */
export function dateToSerial(dateVal: Date): number {
    if (isNullOrUndefined(dateVal) || isNaN(dateVal.getTime())) {
        return 0;
    }
    return dateVal.getTime() / 86400000 + 25569;
}


/**
 * Utility functions for Excel to PDF conversion
 */

/**
 * Unit converter for various measurements
 */
export class UnitConverter {
    /**
     * Convert points to pixels
     *
     * @param {number} points - Value in points
     * @param {number} dpi - DPI (default 72)
     * @returns {number} Value in pixels
     */
    public static pointsToPixels(points: number, dpi: number = 72): number {
        return points * dpi / 72;
    }

    /**
     * Convert pixels to points
     *
     * @param {number} pixels - Value in pixels
     * @param {number} dpi - DPI (default 72)
     * @returns {number} Value in points
     */
    public static pixelsToPoints(pixels: number, dpi: number = 72): number {
        return pixels * 72 / dpi;
    }

    /**
     * Convert inches to points
     *
     * @param {number} inches - Value in inches
     * @returns {number} Value in points
     */
    public static inchesToPoints(inches: number): number {
        return inches * 72;
    }

    /**
     * Convert millimeters to points
     *
     * @param {number} mm - Value in millimeters
     * @returns {number} Value in points
     */
    public static mmToPoints(mm: number): number {
        return mm * 72 / 25.4;
    }

    /**
     * Resolve margin value stored in Excel inches (<= 2.5) or points to PDF points.
     *
     * @param {number} value - Margin value in inches or points
     * @returns {number} Margin value in points
     */
    public static resolveMarginPoints(value: number): number {
        return value <= 2.5 ? UnitConverter.inchesToPoints(value) : value;
    }
}

export interface ParsedCellAddress {
    row: number;
    col: number;
}

export interface ParsedRange {
    range: string;
    startRow: number;
    startColumn: number;
    endRow: number;
    endColumn: number;
}

/**
 * Range parser for Excel ranges
 */
export class RangeParser {
    /**
     * Parse an Excel cell address (e.g., "A1", "$B$10") into 1-based row and column indices.
     *
     * @param {string} address - Cell address string
     * @returns {ParsedCellAddress | null} Parsed row and column, or null if invalid
     */
    public static parseCellAddress(address: string): ParsedCellAddress | null {
        const match: RegExpMatchArray | null = address.trim().replace(/\$/g, '').match(/^([A-Za-z]+)(\d+)$/);
        if (!match) {
            return null;
        }
        return {
            row: parseInt(match[2], 10),
            col: RangeParser.columnLetterToIndex(match[1])
        };
    }

    /**
     * Parse Excel range string (e.g., "A1:B10")
     *
     * @param {string} range - Range string
     * @returns {ParsedRange} Parsed range object
     */
    public static parse(range: string): ParsedRange {
        const cleanRange: string = range.replace(/\$/g, '');
        const sheetSplit: string[] = cleanRange.split('!');
        const refPart: string = sheetSplit[sheetSplit.length - 1];
        const sides: string[] = refPart.split(':');
        const startCell: ParsedCellAddress | null = RangeParser.parseCellAddress(sides[0] || '');
        const endCell: ParsedCellAddress | null = sides.length > 1 ? RangeParser.parseCellAddress(sides[1]) : startCell;
        if (!startCell || !endCell) {
            return { range: range, startRow: 1, startColumn: 1, endRow: 1, endColumn: 1 };
        }
        return {
            range: range,
            startRow: Math.min(startCell.row, endCell.row),
            startColumn: Math.min(startCell.col, endCell.col),
            endRow: Math.max(startCell.row, endCell.row),
            endColumn: Math.max(startCell.col, endCell.col)
        };
    }

    /**
     * Convert column letter to index (A=1, B=2, ..., Z=26, AA=27, ...)
     *
     * @param {string} columnLetter - Column letter (e.g., "A", "Z", "AA")
     * @returns {number} Column index (1-based)
     */
    public static columnLetterToIndex(columnLetter: string): number {
        let result: number = 0;
        const upperLetter: string = columnLetter.toUpperCase();
        for (let charIndex: number = 0; charIndex < upperLetter.length; charIndex++) {
            result = result * 26 + (upperLetter.charCodeAt(charIndex) - 64);
        }
        return result;
    }

    /**
     * Convert column index to letter (1=A, 2=B, ..., 26=Z, 27=AA, ...)
     *
     * @param {number} columnIndex - Column index (1-based)
     * @returns {string} Column letter
     */
    public static columnIndexToLetter(columnIndex: number): string {
        let result: string = '';
        while (columnIndex > 0) {
            columnIndex--;
            result = String.fromCharCode((columnIndex % 26) + 'A'.charCodeAt(0)) + result;
            columnIndex = Math.floor(columnIndex / 26);
        }
        return result;
    }
}

/**
 * Performance timer utility
 */
export class PerformanceTimer {
    private startTime: number = 0;
    private marks: Map<string, number> = new Map();

    /**
     * Start timing
     *
     * @returns {void}
     */
    public start(): void {
        this.startTime = Date.now();
    }

    /**
     * Mark a timing point
     *
     * @param {string} name - Mark name
     * @returns {void}
     */
    public mark(name: string): void {
        this.marks.set(name, Date.now() - this.startTime);
    }

    /**
     * Get elapsed time since start
     *
     * @returns {number} Elapsed time in milliseconds
     */
    public elapsed(): number {
        return Date.now() - this.startTime;
    }

    /**
     * Get timing marks
     *
     * @returns {Map<string, number>} Timing marks map
     */
    public getMarks(): Map<string, number> {
        return new Map(this.marks);
    }
}

/**
 * Options for input validation
 */
export interface InputValidatorOptions {
    /**
     * Maximum file size in bytes
     */
    maxFileSize?: number;

    /**
     * Allowed input formats
     */
    allowedFormats?: string[];

    /**
     * Whether to validate encrypted workbooks
     */
    validateEncryption?: boolean;
}

/**
 * Result of input validation
 */
export interface ValidationResult {
    /**
     * Whether the input is valid
     */
    isValid: boolean;

    /**
     * Validation errors if any
     */
    errors: string[];
}

/**
 * Validator for Excel workbook inputs and conversion options
 */
export class InputValidator {
    /**
     * Validates Excel workbook input
     *
     * @param {Object} input - Excel workbook input
     * @param {InputValidatorOptions} [options] - Validation options
     * @returns {ValidationResult} Validation result
     */
    public validate(input: Object, options?: InputValidatorOptions): ValidationResult {
        const result: ValidationResult = {
            isValid: !isNullOrUndefined(input) && !isNullOrUndefined(options),
            errors: []
        };
        return result;
    }

    /**
     * Validates conversion options
     *
     * @param {Object} options - Conversion options to validate
     * @returns {ValidationResult} Validation result
     */
    public validateOptions(options: Object): ValidationResult {
        const result: ValidationResult = {
            isValid: !isNullOrUndefined(options),
            errors: []
        };
        return result;
    }
}

/**
 * Produces a default converter settings instance.
 *
 * @returns {ExcelToPdfConverterSettings} Fully populated `ExcelToPdfConverterSettings` object.
 */
export const defaultSettings: () => ExcelToPdfConverterSettings = (): ExcelToPdfConverterSettings => ({
    layoutOptions: LayoutOptions.Automatic, displayGridLines: GridLinesDisplayStyle.Auto, isConvertBlankPage: true,
    isConvertBlankSheet: true, throwWhenExcelFileIsEmpty: false, exportBookmarks: true, exportDocumentProperties: true,
    enableRtl: false, embedFonts: false, showHeader: true, showFooter: true, showFileNameWithExtension: false,
    exportQualityImage: false, includeHiddenSheets: false
});
