/**
 * Adobe Form Helper format/keystroke recognition for text boxes.
 * Pure functions. No DOM, no script evaluation.
 *
 * @hidden
 */

/**
 * Recognized AF category. `date` and `time` are recognized only so callers can delegate.
 */
export type AfFormatKind = 'none' | 'number' | 'percent' | 'special' | 'date' | 'time';

/**
 * Catalog entry id for the Format tab separator-style dropdown.
 *
 * `commaPeriod` maps to AF separator 0 (`1,234.56`);
 * `noCommaPeriod` to 1 (`1234.56`);
 * `periodComma` to 2 (`1.234,56`);
 * `noCommaComma` to 3 (`1234,56`);
 * `apostrophePeriod` to 4 (`1'234.56`).
 */
export type AfSeparatorStyle = 'commaPeriod' | 'noCommaPeriod' | 'periodComma' | 'noCommaComma' | 'apostrophePeriod';

/**
 * Catalog entry id for the Format tab symbol-location dropdown.
 *
 * `beforeSpace`     -> prepend=true  + ' ' inserted between symbol and digits.
 * `beforeNoSpace`   -> prepend=true  + no space.
 * `afterSpace`      -> prepend=false + ' ' inserted between digits and symbol.
 * `afterNoSpace`    -> prepend=false + no space.
 *
 * AF scripts only encode `prepend`. The space variant is a viewer-side
 * formatting choice and is preserved on the field model via a non-AF marker
 * so the dialog reopens with the same selection; the AF script emitted on
 * save still uses the bare prepend flag.
 */
export type AfCurrencyLocation = 'beforeSpace' | 'beforeNoSpace' | 'afterSpace' | 'afterNoSpace';

/**
 * Catalog entry id for the Format tab currency-symbol dropdown.
 *
 * Each id maps to the literal symbol string written into the AF `currency`
 * argument. `none` suppresses the symbol entirely.
 */
export type AfCurrencySymbolId =
    'none' | 'dollar' | 'euro' | 'chf' | 'krona' | 'lira' | 'pound' | 'rand' | 'yen' | 'zloty'
    | 'real' | 'nt' | 'won' | 'koruna' | 'forint' | 'litas' | 'lats' | 'lev' | 'leu' | 'hryvnia'
    | 'ruble' | 'pMark' | 'kuna';

/**
 * Parsed format configuration. Original scripts are always preserved for round-trip.
 */
export interface AfFormatConfig {
    kind: AfFormatKind;
    decimals: number;
    /** 0–3 AF separator, or 4 for the apostrophe grouping. */
    separator: number;
    negative: number;
    currency: string;
    prepend: boolean;
    /** Special preset 0–3, or -1 when unused. */
    specialType: number;
    /** Arbitrary mask from AFSpecial_KeystrokeEx, or ''. */
    mask: string;
    formatScript: string;
    keystrokeScript: string;
    /** Viewer-side marker: insert a space between the currency symbol and the digits. */
    currencySpacing: 'none' | 'space';
}

/**
 * Catalog of separator styles for the Format tab. The order matches the
 * `separator` argument order used by AFNumber_Format / AFPercent_Format
 * (0..3) plus the apostrophe variant (4).
 */
export const SEPARATOR_STYLE_CATALOG: { id: AfSeparatorStyle; value: number; sample: string }[] = [
    { id: 'commaPeriod', value: 0, sample: '1,234.56' },
    { id: 'noCommaPeriod', value: 1, sample: '1234.56' },
    { id: 'periodComma', value: 2, sample: '1.234,56' },
    { id: 'noCommaComma', value: 3, sample: '1234,56' },
    { id: 'apostrophePeriod', value: 4, sample: '1\'234.56' }
];

/**
 * Catalog of currency symbols for the Format tab. The text is the literal
 * symbol written into the AF `currency` argument; spacing/placement are
 * separate dialog controls. `none` produces the empty currency string so the
 * AF call still emits `""` as the fifth argument and Acrobat reads it as
 * no-symbol.
 */
export const CURRENCY_SYMBOL_CATALOG: { id: AfCurrencySymbolId; text: string; sample: string }[] = [
    { id: 'none', text: 'None', sample: '' },
    { id: 'dollar', text: '$', sample: '$' },
    { id: 'euro', text: '€', sample: '€' },
    { id: 'chf', text: 'CHF', sample: 'CHF' },
    { id: 'krona', text: 'kr', sample: 'kr' },
    { id: 'lira', text: 'TL', sample: 'TL' },
    { id: 'pound', text: '£', sample: '£' },
    { id: 'rand', text: 'R', sample: 'R' },
    { id: 'yen', text: '¥', sample: '¥' },
    { id: 'zloty', text: 'zł', sample: 'zł' },
    { id: 'real', text: 'R$', sample: 'R$' },
    { id: 'nt', text: 'NT$', sample: 'NT$' },
    { id: 'won', text: '₩', sample: '₩' },
    { id: 'koruna', text: 'Kč', sample: 'Kč' },
    { id: 'forint', text: 'Ft', sample: 'Ft' },
    { id: 'litas', text: 'Lt', sample: 'Lt' },
    { id: 'lats', text: 'Ls', sample: 'Ls' },
    { id: 'lev', text: 'лв', sample: 'лв' },
    { id: 'leu', text: 'lei', sample: 'lei' },
    { id: 'hryvnia', text: '₴', sample: '₴' },
    { id: 'ruble', text: 'руб', sample: 'руб' },
    { id: 'pMark', text: 'p-', sample: 'p-' },
    { id: 'kuna', text: 'kn', sample: 'kn' }
];

/**
 * Catalog of currency locations for the Format tab. The id encodes both
 * prepend (true for before, false for after) and whether the symbol is
 * separated from the digits by a space. The AF script only carries
 * prepend; the space is applied at runtime.
 */
export const CURRENCY_LOCATION_CATALOG: { id: AfCurrencyLocation; prepend: boolean; spacing: 'none' | 'space'; label: string }[] = [
    { id: 'beforeSpace', prepend: true, spacing: 'space', label: 'Before with space' },
    { id: 'beforeNoSpace', prepend: true, spacing: 'none', label: 'Before no space' },
    { id: 'afterSpace', prepend: false, spacing: 'space', label: 'After with space' },
    { id: 'afterNoSpace', prepend: false, spacing: 'none', label: 'After no space' }
];

/**
 * Catalog of AF Special presets for the Format tab. The id is the preset
 * code written into AFSpecial_Format / AFSpecial_Keystroke; `arbitraryMask`
 * maps to AFSpecial_KeystrokeEx with a separate dialog textbox.
 */
export const SPECIAL_TYPE_CATALOG: { id: string; label: string; value: number; isMask: boolean }[] = [
    { id: 'zip', label: 'Zip Code', value: 0, isMask: false },
    { id: 'zipPlus4', label: 'Zip Code + 4', value: 1, isMask: false },
    { id: 'phone', label: 'Phone Number', value: 2, isMask: false },
    { id: 'ssn', label: 'Social Security Number', value: 3, isMask: false },
    { id: 'arbitraryMask', label: 'Arbitrary Mask', value: -1, isMask: true }
];

/**
 * Default `decimals` value for the Format tab number/percentage section.
 */
export const DEFAULT_DECIMALS: number = 2;

/**
 * Maps a separator-style id to the AF separator integer (0..4).
 *
 * @param {string} id - separator style id
 * @returns {number} AF separator integer (0..4)
 */
export function separatorValueOf(id: string): number {
    const entry: { id: string, value: number } | undefined = SEPARATOR_STYLE_CATALOG.find(
        (item: { id: string, value: number }) => item.id === id);
    return entry ? entry.value : 0;
}

/**
 * Maps a separator integer (0..4) back to a separator-style id.
 *
 * @param {number} value - AF separator integer (0..4)
 * @returns {AfSeparatorStyle} separator style id
 */
export function separatorIdOf(value: number): AfSeparatorStyle {
    const entry: { id: AfSeparatorStyle, value: number } | undefined = SEPARATOR_STYLE_CATALOG.find(
        (item: { id: AfSeparatorStyle, value: number }) => item.value === value);
    return entry ? entry.id : 'commaPeriod';
}

/**
 * Escapes the symbol characters of a currency literal into their `\uXXXX` form.
 *
 * The AF `currency` argument carries the symbol as a unicode escape, so the saved
 * script reads `AFNumber_Format(2, 0, 0, 0, "\u0024 ", true)` instead of embedding
 * the glyph directly. Only the symbol characters are escaped; the spacing character
 * around the symbol stays literal so it keeps separating the symbol from the digits.
 *
 * @param {string} symbol - literal symbol text, without spacing
 * @returns {string} symbol text with the escaped characters
 * @private
 */
export function escapeCurrencySymbol(symbol: string): string {
    const text: string = symbol || '';
    if (!text) {
        return '';
    }
    let escaped: string = '';
    for (let i: number = 0; i < text.length; i++) {
        const ch: string = text.charAt(i);
        // The spacing character is not part of the symbol and stays literal, so the
        // escaped symbol still reads as `<symbol><space>` in the AF script.
        if (ch === ' ') {
            escaped += ch;
            continue;
        }
        const code: string = ch.charCodeAt(0).toString(16);
        escaped += '\\u' + ('0000' + code).slice(-4);
    }
    return escaped;
}

/**
 * Decodes the `\uXXXX` escapes of a currency literal back into their characters.
 *
 * A symbol that is already literal (a script authored outside the viewer) is kept
 * as it is, so both spellings load to the same symbol. The doubled-backslash
 * spelling (`\\uXXXX`) is accepted as well, so a script that carries the escape
 * through a JavaScript string escape still decodes to the symbol.
 *
 * @param {string} text - currency literal, possibly containing `\uXXXX` escapes
 * @returns {string} currency literal with the escapes decoded
 * @private
 */
export function decodeCurrencySymbol(text: string): string {
    const literal: string = text || '';
    if (!literal || literal.indexOf('\\u') === -1) {
        return literal;
    }
    return literal.replace(/\\\\u([0-9a-fA-F]{4})|\\u([0-9a-fA-F]{4})/g,
                           (match: string, doubled: string, single: string): string => {
                               return String.fromCharCode(parseInt(doubled || single, 16));
                           });
}

/**
 * Maps a currency-symbol id to its literal text. `none` returns ''.
 *
 * @param {string} id - currency symbol id
 * @returns {string} literal symbol text
 */
export function currencyTextOf(id: string): string {
    // `none` suppresses the symbol entirely. The catalog entry uses 'None' as the
    // human-readable dropdown label, so we cannot rely on `entry.text` for it -
    // doing so would write the literal 'None' into the AFNumber_Format script.
    if (id === 'none') {
        return '';
    }
    const entry: { id: string, text: string } | undefined = CURRENCY_SYMBOL_CATALOG.find(
        (item: { id: string, text: string }) => item.id === id);
    return entry ? entry.text : '';
}

/**
 * Maps a currency literal back to its catalog id. Unrecognized text returns 'none'.
 *
 * @param {string} text - literal currency text
 * @returns {AfCurrencySymbolId} catalog id
 */
export function currencyIdOf(text: string): AfCurrencySymbolId {
    const trimmed: string = (text || '').trim();
    if (!trimmed) {
        return 'none';
    }
    const entry: { id: AfCurrencySymbolId, text: string } | undefined = CURRENCY_SYMBOL_CATALOG.find(
        (item: { id: AfCurrencySymbolId, text: string }) => item.text === trimmed);
    return entry ? entry.id : 'none';
}

/**
 * Builds the currency literal written into the AF `currency` argument.
 *
 * The AF script encodes the space between the symbol and the digits by carrying it
 * inside the literal itself: a prepended symbol keeps a trailing space ("$ ") and an
 * appended symbol keeps a leading space (" $"). A symbol placed without a space is
 * written bare. This keeps the spacing inside the PDF script, so it survives a
 * save / load round-trip.
 *
 * @param {string} symbol - literal symbol text, without spacing
 * @param {boolean} prepend - true when the symbol precedes the digits
 * @param {string} spacing - 'none' | 'space'
 * @returns {string} currency literal for the AF script
 */
export function currencyLiteralOf(symbol: string, prepend: boolean, spacing: 'none' | 'space'): string {
    const text: string = symbol || '';
    if (!text || spacing !== 'space') {
        return text;
    }
    // A symbol that already carries the spacing is kept as it is, so the literal is
    // never written with a doubled space.
    if (text !== text.trim()) {
        return text;
    }
    return prepend ? (text + ' ') : (' ' + text);
}

/**
 * Maps a currency-location id to its prepend boolean and spacing marker.
 *
 * @param {string} id - currency location id
 * @returns {Object} object with `prepend` and `spacing`
 */
export function currencyLocationOf(id: string): { prepend: boolean, spacing: 'none' | 'space' } {
    const entry: { id: string, prepend: boolean, spacing: 'none' | 'space' } | undefined =
        CURRENCY_LOCATION_CATALOG.find((item: { id: string, prepend: boolean, spacing: 'none' | 'space' }) => item.id === id);
    return entry ? { prepend: entry.prepend, spacing: entry.spacing } : { prepend: true, spacing: 'none' };
}

/**
 * Maps a prepend/spacing pair back to a currency-location id.
 *
 * @param {boolean} prepend - prepend flag
 * @param {string} spacing - 'none' | 'space'
 * @returns {AfCurrencyLocation} location id
 */
export function currencyLocationIdOf(prepend: boolean, spacing: 'none' | 'space'): AfCurrencyLocation {
    const entry: { id: AfCurrencyLocation, prepend: boolean, spacing: 'none' | 'space' } | undefined =
        CURRENCY_LOCATION_CATALOG.find((item: { id: AfCurrencyLocation, prepend: boolean, spacing: 'none' | 'space' }) =>
            item.prepend === prepend && item.spacing === spacing);
    return entry ? entry.id : (prepend ? 'beforeNoSpace' : 'afterNoSpace');
}

/**
 * Maps a special-type id to the AF integer (0..3) and mask flag.
 *
 * @param {string} id - special type id
 * @returns {Object} object with `value` and `isMask`
 */
export function specialInfoOf(id: string): { value: number, isMask: boolean } {
    const entry: { id: string, value: number, isMask: boolean } | undefined = SPECIAL_TYPE_CATALOG.find(
        (item: { id: string, value: number, isMask: boolean }) => item.id === id);
    return entry ? { value: entry.value, isMask: entry.isMask } : { value: 0, isMask: false };
}

/**
 * Maps a special AF integer (0..3) or a mask string back to its catalog id.
 *
 * @param {number} value - AF special integer (0..3)
 * @param {boolean} isMask - true when the field carries an arbitrary mask
 * @returns {string} catalog id
 */
export function specialIdOf(value: number, isMask: boolean): string {
    if (isMask) {
        return 'arbitraryMask';
    }
    const entry: { id: string, value: number } | undefined = SPECIAL_TYPE_CATALOG.find(
        (item: { id: string, value: number, isMask: boolean }) => item.value === value && !item.isMask);
    return entry ? entry.id : 'zip';
}

/**
 * Result of a keystroke or commit check.
 */
export interface AfKeystrokeResult {
    value: string;
    selStart: number;
    selEnd: number;
    accepted: boolean;
    /** When set, the caller should write this display string (mask / special). */
    display?: string;
}

/**
 * Result of formatting a committed logical value.
 */
export interface AfFormatResult {
    text: string;
    color?: string;
    rejected?: boolean;
    logical: string;
}

/**
 * Result of committing a typed value against an AFSpecial preset.
 */
export interface AfSpecialCommit {
    valid: boolean;
    /** The masked display text, or the typed value when the validation failed. */
    text: string;
    /** The normalized digits. */
    logical: string;
    /** Human readable description of the accepted digit counts. */
    expected: string;
}

const NONE_CONFIG: AfFormatConfig = {
    kind: 'none', decimals: 0, separator: 0, negative: 0, currency: '', prepend: false,
    specialType: -1, mask: '', formatScript: '', keystrokeScript: '', currencySpacing: 'none'
};

/**
 * Digit counts accepted by the AFSpecial presets: ZIP, ZIP+4, Phone, SSN.
 */
const SPECIAL_MAX_DIGITS: number[] = [5, 9, 10, 9];

/**
 * Display names of the AFSpecial presets, used in the validation message.
 */
const SPECIAL_FORMAT_NAMES: string[] = ['Zip Code', 'Zip Code + 4', 'Phone Number', 'Social Security Number'];

/**
 * Reads the digit count a preset type accepts.
 *
 * The preset type is range checked by the caller, so the lookup is spelled out
 * per type and no dynamic property access is needed.
 *
 * @param {number} type - preset type 0-3
 * @returns {number} digit count (0 for an unknown preset type)
 * @private
 */
function specialMaxDigitsForType(type: number): number {
    switch (type) {
    case 0:
        return SPECIAL_MAX_DIGITS[0];
    case 1:
        return SPECIAL_MAX_DIGITS[1];
    case 2:
        return SPECIAL_MAX_DIGITS[2];
    case 3:
        return SPECIAL_MAX_DIGITS[3];
    default:
        return 0;
    }
}

/**
 * Reads the display name of a preset type.
 *
 * The preset type is range checked by the caller, so the lookup is spelled out
 * per type and no dynamic property access is needed.
 *
 * @param {number} type - preset type 0-3
 * @returns {string} display name of the preset
 * @private
 */
function specialNameForType(type: number): string {
    switch (type) {
    case 0:
        return SPECIAL_FORMAT_NAMES[0];
    case 1:
        return SPECIAL_FORMAT_NAMES[1];
    case 2:
        return SPECIAL_FORMAT_NAMES[2];
    case 3:
        return SPECIAL_FORMAT_NAMES[3];
    default:
        return 'Special';
    }
}

/**
 * Reads a script string from an actions bag slot (`format` or `keyPressed`).
 *
 * @param {any} actions - viewer actions payload
 * @param {string} key - slot name
 * @returns {string} script or ''
 * @private
 */
export function readActionScript(actions: any, key: string): string {
    if (!actions || !actions[`${key}`]) {
        return '';
    }
    const slot: any = actions[`${key}`];
    if (typeof slot === 'string') {
        return slot;
    }
    if (typeof slot.script === 'string') {
        return slot.script;
    }
    return '';
}

function pairScripts(formatScript: string, keystrokeScript: string): AfFormatConfig {
    return {
        kind: 'none', decimals: 0, separator: 0, negative: 0, currency: '', prepend: false,
        specialType: -1, mask: '',
        formatScript: formatScript || '',
        keystrokeScript: keystrokeScript || '',
        currencySpacing: 'none'
    };
}

function intArg(raw: string): number {
    if (!/^-?\d+$/.test((raw || '').trim())) {
        return NaN;
    }
    return parseInt(raw.trim(), 10);
}

function unquote(raw: string): string {
    const text: string = (raw || '').trim();
    if (text.length >= 2 && ((text[0] === '"' && text[text.length - 1] === '"') ||
        (text[0] === '\'' && text[text.length - 1] === '\''))) {
        return text.slice(1, -1).replace(/\\"/g, '"').replace(/\\'/g, '\'');
    }
    return text;
}

function splitArgs(inner: string): string[] {
    const args: string[] = [];
    let current: string = '';
    let quote: string = '';
    for (let i: number = 0; i < inner.length; i++) {
        const ch: string = inner[i as number];
        if (quote) {
            current += ch;
            if (ch === quote && inner[i - 1] !== '\\') {
                quote = '';
            }
            continue;
        }
        if (ch === '"' || ch === '\'') {
            quote = ch;
            current += ch;
            continue;
        }
        if (ch === ',') {
            args.push(current.trim());
            current = '';
            continue;
        }
        current += ch;
    }
    if (current.trim() !== '' || args.length > 0) {
        args.push(current.trim());
    }
    return args;
}

function callOf(script: string, name: string): string[] | null {
    if (!script) {
        return null;
    }
    // eslint-disable-next-line
    const start: number = script.search(new RegExp(name + '\\s*\\(', 'i'));
    if (start === -1) {
        return null;
    }
    // Walk the argument list so that a parenthesis inside a quoted string - a mask
    // such as "(999) 999-9999" - does not end the call early.
    let depth: number = 0;
    let quote: string = '';
    let inner: string = '';
    for (let i: number = start + name.length; i < script.length; i++) {
        const ch: string = script[i as number];
        if (quote) {
            inner += ch;
            if (ch === quote && script[i - 1] !== '\\') {
                quote = '';
            }
            continue;
        }
        if (ch === '"' || ch === '\'') {
            quote = ch;
            inner += ch;
            continue;
        }
        if (ch === '(') {
            depth++;
            if (depth === 1) {
                continue;
            }
        } else if (ch === ')') {
            depth--;
            if (depth === 0) {
                return splitArgs(inner);
            }
        }
        inner += ch;
    }
    return null;
}

/**
 * Parses a format/keystroke script pair. Malformed input returns `none` and keeps the original strings.
 *
 * @param {string} formatScript - AF format script
 * @param {string} keystrokeScript - AF keystroke script
 * @returns {AfFormatConfig} parsed config
 * @private
 */
export function parseAfScripts(formatScript: string, keystrokeScript: string): AfFormatConfig {
    const format: string = formatScript || '';
    const key: string = keystrokeScript || '';
    const base: AfFormatConfig = pairScripts(format, key);
    if (/AFDate_Format(?:Ex)?\s*\(/i.test(format) || /AFDate_Format(?:Ex)?\s*\(/i.test(key)) {
        return { ...base, kind: 'date' };
    }
    if (/AFTime_Format(?:Ex)?\s*\(/i.test(format) || /AFTime_Format(?:Ex)?\s*\(/i.test(key)) {
        return { ...base, kind: 'time' };
    }
    const maskArgs: string[] = callOf(key, 'AFSpecial_KeystrokeEx');
    if (maskArgs && maskArgs.length === 1) {
        return { ...base, kind: 'special', specialType: -1, mask: unquote(maskArgs[0]) };
    }
    const specialFormat: string[] = callOf(format, 'AFSpecial_Format');
    const specialKey: string[] = callOf(key, 'AFSpecial_Keystroke');
    if (specialFormat || specialKey) {
        const raw: string = (specialFormat && specialFormat[0]) || (specialKey && specialKey[0]);
        const type: number = intArg(raw);
        if (type >= 0 && type <= 3 && (!specialFormat || !specialKey || specialFormat[0] === specialKey[0])) {
            return { ...base, kind: 'special', specialType: type };
        }
        return base;
    }
    const numberFormat: string[] = callOf(format, 'AFNumber_Format');
    const numberKey: string[] = callOf(key, 'AFNumber_Keystroke');
    if (numberFormat || numberKey) {
        const args: string[] = numberFormat || numberKey;
        if (args.length < 6) {
            return base;
        }
        const decimals: number = intArg(args[0]);
        const separator: number = intArg(args[1]);
        const negative: number = intArg(args[2]);
        if (decimals < 0 || separator < 0 || separator > 4 || negative < 0 || negative > 3 ||
            isNaN(decimals) || isNaN(separator) || isNaN(negative)) {
            return base;
        }
        // The space between the currency symbol and the digits is carried by the AF
        // currency literal itself ("$ " when the symbol is prepended, " $" when it is
        // appended), so the spacing survives a PDF save / load round-trip.
        // The symbol itself travels as a `\uXXXX` escape, so it is decoded here to
        // recover the character the Format tab and the formatter work with.
        const rawCurrency: string = unquote(args[4] || '""');
        const decodedCurrency: string = decodeCurrencySymbol(rawCurrency);
        const currency: string = decodedCurrency.trim();
        const currencySpacing: 'none' | 'space' = (currency && currency !== decodedCurrency) ? 'space' : 'none';
        return {
            ...base, kind: 'number', decimals: decimals, separator: separator, negative: negative,
            currency: currency, prepend: /^\s*true\s*$/i.test(args[5] || ''),
            currencySpacing: currencySpacing
        };
    }
    const percentFormat: string[] = callOf(format, 'AFPercent_Format');
    const percentKey: string[] = callOf(key, 'AFPercent_Keystroke');
    if (percentFormat || percentKey) {
        const args: string[] = percentFormat || percentKey;
        if (args.length < 2) {
            return base;
        }
        const decimals: number = intArg(args[0]);
        const separator: number = intArg(args[1]);
        if (decimals < 0 || separator < 0 || separator > 4 || isNaN(decimals) || isNaN(separator)) {
            return base;
        }
        return { ...base, kind: 'percent', decimals: decimals, separator: separator };
    }
    return base;
}

/**
 * Builds the matching helper when the host supplied only one of the pair.
 *
 * @param {string} formatScript - format script or ''
 * @param {string} keystrokeScript - keystroke script or ''
 * @returns {Object} object with `format` and `keyPressed` string slots
 * @private
 */
export function inferActionPair(formatScript: string, keystrokeScript: string): { format: string, keyPressed: string } {
    const format: string = formatScript || '';
    const key: string = keystrokeScript || '';
    if (format && key) {
        return { format: format, keyPressed: key };
    }
    const single: string = format || key;
    if (!single) {
        return { format: '', keyPressed: '' };
    }
    const parsed: AfFormatConfig = parseAfScripts(format || single, key || single);
    if (parsed.kind === 'none' || parsed.kind === 'date' || parsed.kind === 'time') {
        return { format: format, keyPressed: key };
    }
    if (parsed.mask) {
        return { format: format, keyPressed: key || ('AFSpecial_KeystrokeEx("' + parsed.mask.replace(/"/g, '\\"') + '")') };
    }
    const built: { format: string | null, keyPressed: string | null } = buildScripts(parsed);
    return {
        format: format || built.format || '',
        keyPressed: key || built.keyPressed || ''
    };
}

function quoteArg(value: string): string {
    return '"' + (value || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

/**
 * Emits AF helper calls for a recognized number, percent, or special config.
 *
 * @param {AfFormatConfig} config - parsed config
 * @returns {Object} scripts with `format` and `keyPressed` string slots
 * @private
 */
export function buildScripts(config: AfFormatConfig): { format: string | null, keyPressed: string | null } {
    if (!config || config.kind === 'none' || config.kind === 'date' || config.kind === 'time') {
        return { format: null, keyPressed: null };
    }
    if (config.kind === 'number') {
        // The symbol spacing is carried inside the currency literal so that it is
        // written into the AF script and survives a PDF save / load round-trip.
        // The symbol characters are written as `\uXXXX` escapes, so the saved script
        // carries the symbol in the same form as the other PDF viewers. The escaped
        // literal is quoted directly: it holds only escape sequences and spaces, so
        // the JavaScript-string escaping of `quoteArg` would double the backslash
        // and leave a stray `\` in front of the symbol when the script is read back.
        const literal: string = escapeCurrencySymbol(config.currency || '');
        const spaced: string = currencyLiteralOf(literal, config.prepend, config.currencySpacing);
        const args: string = [config.decimals, config.separator, config.negative, 0,
            '"' + spaced + '"', config.prepend ? 'true' : 'false'].join(',');
        return { format: 'AFNumber_Format(' + args + ')', keyPressed: 'AFNumber_Keystroke(' + args + ')' };
    }
    if (config.kind === 'percent') {
        const args: string = config.decimals + ',' + config.separator;
        return { format: 'AFPercent_Format(' + args + ')', keyPressed: 'AFPercent_Keystroke(' + args + ')' };
    }
    if (config.mask) {
        return { format: null, keyPressed: 'AFSpecial_KeystrokeEx(' + quoteArg(config.mask) + ')' };
    }
    if (config.specialType >= 0 && config.specialType <= 3) {
        return {
            format: 'AFSpecial_Format(' + config.specialType + ')',
            keyPressed: 'AFSpecial_Keystroke(' + config.specialType + ')'
        };
    }
    return { format: null, keyPressed: null };
}

function separators(code: number): { group: string, decimal: string } {
    switch (code) {
    case 1: return { group: '', decimal: '.' };
    case 2: return { group: '.', decimal: ',' };
    case 3: return { group: '', decimal: ',' };
    case 4: return { group: '\'', decimal: '.' };
    default: return { group: ',', decimal: '.' };
    }
}

function groupDigits(intPart: string, group: string): string {
    if (!group) {
        return intPart;
    }
    // eslint-disable-next-line
    return intPart.replace(/\B(?=(\d{3})+(?!\d))/g, group);
}

function isCompleteNumber(text: string, decimal: string): boolean {
    if (!text || text === '-' || text === decimal || text === '-' + decimal) {
        return false;
    }
    const escaped: string = decimal === '.' ? '\\.' : decimal;
    // eslint-disable-next-line
    return new RegExp('^-?\\d+(' + escaped + '\\d+)?$').test(text);
}

function stripGrouping(text: string, group: string): string {
    if (!group) {
        return text;
    }
    return text.split(group).join('');
}

/**
 * Formats a committed logical value. Empty stays empty. Incomplete numbers are rejected.
 *
 * @param {AfFormatConfig} config - parsed config
 * @param {string} logical - committed logical value
 * @returns {AfFormatResult} display text and optional color
 * @private
 */
export function formatValue(config: AfFormatConfig, logical: string): AfFormatResult {
    const value: string = logical == null ? '' : String(logical);
    if (!config || config.kind === 'none' || config.kind === 'date' || config.kind === 'time') {
        return { text: value, logical: value };
    }
    if (value === '') {
        return { text: '', logical: '' };
    }
    if (config.kind === 'special') {
        return formatSpecial(config, value);
    }
    const sep: { group: string, decimal: string } = separators(config.separator);
    const normalized: string = stripGrouping(value, sep.group).split(sep.decimal).join('.');
    if (!isCompleteNumber(normalized, '.')) {
        return { text: value, logical: value, rejected: true };
    }
    const numeric: number = config.kind === 'percent' ? parseFloat(normalized) * 100 : parseFloat(normalized);
    const negative: boolean = numeric < 0;
    const abs: string = Math.abs(numeric).toFixed(config.decimals);
    const parts: string[] = abs.split('.');
    let body: string = groupDigits(parts[0], sep.group);
    if (config.decimals > 0) {
        body += (sep.decimal + (parts[1] || '') as any).padEnd(config.decimals, '0');
    }
    let text: string = body;
    let color: string;
    if (config.kind === 'percent') {
        text = (negative ? '-' : '') + body + '%';
    } else {
        const style: number = config.negative;
        const signed: string = negative ? (style >= 2 ? '(' + body + ')' : '-' + body) : body;
        // The symbol is held without spacing; the `currencySpacing` marker supplies the
        // single space, so a symbol that already carries one is not spaced twice.
        const symbol: string = (config.currency || '').trim();
        const joiner: string = (config.currencySpacing === 'space' && symbol) ? ' ' : '';
        text = symbol ? (config.prepend ? symbol + joiner + signed : signed + joiner + symbol) : signed;
        if (negative && (style === 1 || style === 3)) {
            color = 'red';
        }
    }
    return { text: text, color: color, logical: normalized };
}

function specialPattern(type: number, digits: string): string {
    if (type === 0) {
        return digits.slice(0, 5);
    }
    if (type === 1) {
        return digits.length <= 5 ? digits : digits.slice(0, 5) + '-' + digits.slice(5, 9);
    }
    if (type === 3) {
        if (digits.length <= 3) {
            return digits;
        }
        if (digits.length <= 5) {
            return digits.slice(0, 3) + '-' + digits.slice(3);
        }
        return digits.slice(0, 3) + '-' + digits.slice(3, 5) + '-' + digits.slice(5, 9);
    }
    if (digits.length <= 3) {
        return digits;
    }
    if (digits.length <= 7) {
        return digits.length <= 3 ? digits : digits.slice(0, 3) + '-' + digits.slice(3, 7);
    }
    const ten: string = digits.slice(0, 10);
    return '(' + ten.slice(0, 3) + ') ' + ten.slice(3, 6) + '-' + ten.slice(6, 10);
}

function formatSpecial(config: AfFormatConfig, logical: string): AfFormatResult {
    if (config.mask) {
        const applied: string = applyMask(config.mask, logical, true);
        return { text: applied, logical: extractMaskValue(config.mask, applied) };
    }
    const digits: string = (logical || '').replace(/\D/g, '');
    const text: string = specialPattern(config.specialType, digits);
    return { text: text, logical: digits };
}

/**
 * Whether a parsed config is an AFSpecial preset (ZIP, ZIP+4, Phone, SSN).
 * The arbitrary mask variant (`AFSpecial_KeystrokeEx`) is not a preset.
 *
 * @param {AfFormatConfig} config - parsed config
 * @returns {boolean} true for preset types 0-3
 * @private
 */
export function isSpecialPreset(config: AfFormatConfig): boolean {
    return !!config && config.kind === 'special' && !config.mask && config.specialType >= 0 && config.specialType <= 3;
}

/**
 * Maximum number of digits the AFSpecial preset accepts.
 *
 * @param {AfFormatConfig} config - parsed config
 * @returns {number} digit limit (0 when the config is not a preset)
 * @private
 */
export function specialMaxDigits(config: AfFormatConfig): number {
    if (!isSpecialPreset(config)) {
        return 0;
    }
    return SPECIAL_MAX_DIGITS[config.specialType] || 0;
}

/**
 * Validates a typed value against the digit count of the AFSpecial preset.
 *
 * The preset formats accept an exact digit count: ZIP 5, ZIP+4 9, Phone 10 or 7,
 * SSN 9. A value that does not match is rejected and the caller surfaces a
 * validation error instead of applying the mask.
 *
 * @param {AfFormatConfig} config - parsed config
 * @param {string} value - the value typed by the user
 * @returns {AfSpecialCommit} validity, masked text, normalized digits and the expected description
 * @private
 */
export function validateSpecialValue(config: AfFormatConfig, value: string): AfSpecialCommit {
    const digits: string = (value == null ? '' : String(value)).replace(/\D/g, '');
    if (!isSpecialPreset(config)) {
        return { valid: true, text: value == null ? '' : String(value), logical: digits, expected: '' };
    }
    const type: number = config.specialType;
    const maxDigits: number = specialMaxDigitsForType(type) || 0;
    let valid: boolean = digits.length === maxDigits;
    // The AF special phone preset also accepts the seven digit short form.
    if (type === 2 && digits.length === 7) {
        valid = true;
    }
    return {
        valid: valid,
        text: valid ? specialPattern(type, digits) : (value == null ? '' : String(value)),
        logical: digits,
        expected: specialExpectedText(type)
    };
}

/**
 * Result of committing an arbitrary mask value on blur.
 *
 * The mask is a Keystroke-only artifact; the formatted display is rebuilt from
 * the logical value at commit time. A commit is invalid when the logical value
 * is shorter than the mask token count and a non-empty value was already
 * stored on the field before the edit began.
 */
export interface AfMaskCommit {
    valid: boolean;

    /** The masked display for the current logical value. */
    text: string;

    /** The placeholder characters extracted from the masked display. */
    logical: string;

    /** True when the logical value fills every placeholder of the mask. */
    complete: boolean;

    /** True when a non-empty value was stored on the field before this edit began. */
    hasPrior: boolean;

    /** Human readable description of the mask (the literal pattern). */
    expected: string;
}

/**
 * Validates a typed value against an arbitrary mask at commit time.
 *
 * The value is incomplete when the logical value does not fill every
 * placeholder of the mask. An incomplete value is rejected only when a prior
 * value is already stored on the field, so the caller can restore that prior
 * value and surface a popup; an incomplete value with no prior is allowed
 * through so the user can correct it on the next pass.
 *
 * @param {AfFormatConfig} config - parsed config
 * @param {string} logical - the logical value to validate
 * @param {string} prior - the value stored on the field before this edit began (or '')
 * @returns {AfMaskCommit} commit result; `valid` is false only when the value
 * is incomplete AND a prior value exists.
 * @private
 */
export function validateMaskOnCommit(
    config: AfFormatConfig, logical: string, prior: string
): AfMaskCommit {
    const safeLogical: string = logical == null ? '' : String(logical);
    const safePrior: string = prior == null ? '' : String(prior);
    if (!config || !config.mask) {
        return {
            valid: true, text: safeLogical, logical: safeLogical,
            complete: true, hasPrior: !!safePrior, expected: ''
        };
    }
    const tokens: number = maskTokenCount(config.mask);
    const display: string = applyMask(config.mask, safeLogical, true);
    const extracted: string = extractMaskValue(config.mask, display);
    const complete: boolean = extracted.length === tokens;
    const hasPrior: boolean = !!safePrior;
    const valid: boolean = complete || (extracted === '' && !hasPrior);
    return {
        valid: valid,
        text: display,
        logical: extracted,
        complete: complete,
        hasPrior: hasPrior,
        expected: config.mask || ''
    };
}

/**
 * Builds the user facing description of the digit count a preset accepts.
 *
 * @param {number} type - special preset type 0-3
 * @returns {string} description of the accepted digit count
 * @private
 */
function specialExpectedText(type: number): string {
    return specialNameForType(type);
}

function tokenOk(placeholder: string, ch: string): boolean {
    if (placeholder === '9') {
        // eslint-disable-next-line
        return /[0-9]/.test(ch);
    }
    if (placeholder === 'A') {
        // eslint-disable-next-line
        return /[A-Za-z]/.test(ch);
    }
    if (placeholder === 'O') {
        // eslint-disable-next-line
        return /[A-Za-z0-9]/.test(ch);
    }
    if (placeholder === 'X') {
        return ch >= ' ' && ch <= '~';
    }
    return false;
}

function isToken(ch: string): boolean {
    return ch === '9' || ch === 'A' || ch === 'O' || ch === 'X';
}

/**
 * Picks one character a mask placeholder accepts.
 *
 * The character is drawn from the same set the placeholder accepts at runtime,
 * so the Preview never shows a value the field would reject. The pick is random,
 * so the Preview shows a different value on every refresh.
 *
 * @param {string} placeholder - mask placeholder character (9, A, O or X)
 * @returns {string} a character the placeholder accepts
 * @private
 */
function randomTokenChar(placeholder: string): string {
    let pool: string = '';
    if (placeholder === '9') {
        pool = '0123456789';
    } else if (placeholder === 'A') {
        pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    } else if (placeholder === 'O') {
        pool = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    } else if (placeholder === 'X') {
        for (let code: number = 32; code <= 126; code++) {
            pool += String.fromCharCode(code);
        }
    }
    if (!pool) {
        return '0';
    }
    return pool.charAt(Math.floor(Math.random() * pool.length));
}

/**
 * Lists the placeholder characters of a mask in the order they appear.
 *
 * @param {string} mask - mask string
 * @returns {string[]} the placeholder characters of the mask
 * @private
 */
function maskTokens(mask: string): string[] {
    const tokens: string[] = [];
    for (let i: number = 0; i < mask.length; i++) {
        const token: string = mask[i as number];
        if (isToken(token)) {
            tokens.push(token);
        }
    }
    return tokens;
}

/**
 * Maps a position in the masked display string to the matching position in the
 * logical value (the placeholder characters only).
 *
 * @param {string} mask - mask string
 * @param {string} display - masked display string
 * @param {number} position - index inside the display string
 * @returns {number} index inside the logical value
 * @private
 */
function displayToLogicalIndex(mask: string, display: string, position: number): number {
    let logical: number = 0;
    const limit: number = Math.min(position, display.length);
    for (let i: number = 0; i < limit; i++) {
        if (i < mask.length && isToken(mask[i as number])) {
            logical++;
        }
    }
    return logical;
}

/**
 * Works out the text a user inserted into the masked display string.
 *
 * The browser reports the whole new value of the input. The inserted text is the
 * part of that value that is not covered by the previous display string. The
 * selection range of the browser marks the replaced region.
 *
 * @param {string} previousDisplay - display string before the edit
 * @param {string} newValue - value of the input after the edit
 * @param {number} selStart - selection start reported by the browser
 * @param {number} selEnd - selection end reported by the browser
 * @returns {{ inserted: string, start: number, end: number }} inserted text and the replaced range
 * @private
 */
function diffInsertedText(previousDisplay: string, newValue: string, selStart: number, selEnd: number):
{ inserted: string, start: number, end: number } {
    const before: string = previousDisplay || '';
    const after: string = newValue == null ? '' : String(newValue);
    const start: number = selStart == null ? after.length : Math.max(0, Math.min(selStart, after.length));
    const end: number = selEnd == null ? start : Math.max(start, Math.min(selEnd, after.length));
    let prefix: number = 0;
    const maxPrefix: number = Math.min(start, before.length);
    while (prefix < maxPrefix && before.charAt(prefix) === after.charAt(prefix)) {
        prefix++;
    }
    let suffix: number = 0;
    const maxSuffix: number = Math.min(before.length - prefix, after.length - prefix);
    while (suffix < maxSuffix && before.charAt(before.length - 1 - suffix) === after.charAt(after.length - 1 - suffix)) {
        suffix++;
    }
    return {
        inserted: after.slice(prefix, after.length - suffix),
        start: prefix,
        end: before.length - suffix
    };
}

/**
 * Applies a keystroke to a text box that carries an arbitrary mask.
 *
 * The candidate is rebuilt from the logical value, the inserted text and the
 * selection range, so a literal that the mask inserted earlier never becomes part
 * of the candidate. Every inserted character has to satisfy the placeholder of the
 * slot it lands in; a character that does not is rejected and the last accepted
 * value is kept.
 *
 * @param {AfFormatConfig} config - parsed config
 * @param {string} previousLogical - logical value before the edit
 * @param {string} previousDisplay - masked display before the edit
 * @param {string} newValue - value of the input after the edit
 * @param {number} selStart - selection start reported by the browser
 * @param {number} selEnd - selection end reported by the browser
 * @param {boolean} willCommit - true on blur/change
 * @returns {AfKeystrokeResult} accept or reject
 * @private
 */
export function applyMaskKeystroke(
    config: AfFormatConfig, previousLogical: string, previousDisplay: string, newValue: string,
    selStart: number, selEnd: number, willCommit?: boolean
): AfKeystrokeResult {
    const mask: string = config && config.mask ? config.mask : '';
    const logical: string = previousLogical == null ? '' : String(previousLogical);
    const display: string = previousDisplay == null ? '' : String(previousDisplay);
    const tokens: string[] = maskTokens(mask);
    const diff: { inserted: string, start: number, end: number } =
        diffInsertedText(display, newValue, selStart, selEnd);
    const logicalStart: number = displayToLogicalIndex(mask, display, diff.start);
    const logicalEnd: number = displayToLogicalIndex(mask, display, diff.end);
    // A character that the user typed replaces the placeholders it covers.
    const removed: number = Math.max(0, logicalEnd - logicalStart);
    // A deletion that reaches into a mask literal has no placeholder to remove.
    // The literal belongs to the mask and the mask would write it back, so the
    // deleted literal is cut from the display instead. The logical value keeps
    // the characters the placeholders hold.
    let literalCut: boolean = false;
    if (!diff.inserted && diff.end > diff.start) {
        const lastIndex: number = diff.end - 1;
        literalCut = lastIndex >= 0 && lastIndex < mask.length && !isToken(mask.charAt(lastIndex));
    }
    const inserted: string = diff.inserted;
    const spliced: string = logical.slice(0, logicalStart) + inserted + logical.slice(logicalStart + removed);
    const candidate: string = spliced;
    const slot: number = logicalStart;
    for (let i: number = 0; i < inserted.length; i++) {
        const token: string = tokens[slot + i];
        if (!token || !tokenOk(token, inserted[i as number])) {
            // The character does not satisfy the placeholder of its slot. The last
            // accepted value is kept.
            return { value: logical, selStart: display.length, selEnd: display.length, accepted: false, display: display };
        }
    }
    let newDisplay: string = applyMask(mask, candidate, true);
    if (literalCut) {
        // The mask regenerated the literal that the user deleted. The display
        // keeps the characters up to the deletion, so one backspace removes one
        // character of the value.
        const truncated: string = applyMask(mask, candidate, true).slice(0, diff.start);
        if (truncated.length < newDisplay.length) {
            newDisplay = truncated;
        }
    }
    const newLogical: string = extractMaskValue(mask, newDisplay);
    if (willCommit && newLogical.length < tokens.length && newLogical !== '') {
        return { value: logical, selStart: display.length, selEnd: display.length, accepted: false, display: display };
    }
    return {
        value: newLogical,
        selStart: newDisplay.length,
        selEnd: newDisplay.length,
        accepted: true,
        display: newDisplay
    };
}

/**
 * Applies a mask to a logical value.
 *
 * The logical value holds only the characters the placeholders accepted. Every
 * literal of the mask is written by the mask itself and is never read from the
 * value. A literal is written once all the placeholders that precede it hold a
 * value, so a partially filled mask shows the leading literals of the mask but
 * no trailing separator. A placeholder consumes the next value character that
 * satisfies it.
 *
 * @param {string} mask - mask string
 * @param {string} raw - logical value that holds only the placeholder characters
 * @param {boolean} allowPartial - true renders a partially filled mask
 * @returns {string} the masked display
 * @private
 */
function applyMask(mask: string, raw: string, allowPartial: boolean): string {
    let out: string = '';
    let ri: number = 0;
    const source: string = raw || '';
    for (let i: number = 0; i < mask.length; i++) {
        const token: string = mask[i as number];
        if (!isToken(token)) {
            // A literal belongs to the mask. It is written once every
            // placeholder before it holds a value. The literals that open the
            // mask have no placeholder before them, so they are written right
            // away and a trailing separator is not written on a partial value.
            if (ri > 0 || !hasPlaceholderBefore(mask, i)) {
                out += token;
            }
            continue;
        }
        if (ri >= source.length) {
            break;
        }
        const ch: string = source[ri as number];
        if (!tokenOk(token, ch)) {
            break;
        }
        out += ch;
        ri++;
    }
    return out;
}

/**
 * Whether the mask holds a placeholder before the given position.
 *
 * @param {string} mask - mask string
 * @param {number} position - index inside the mask
 * @returns {boolean} true when a placeholder precedes the position
 * @private
 */
function hasPlaceholderBefore(mask: string, position: number): boolean {
    for (let i: number = 0; i < position; i++) {
        if (isToken(mask[i as number])) {
            return true;
        }
    }
    return false;
}

function extractMaskValue(mask: string, display: string): string {
    let value: string = '';
    for (let i: number = 0; i < display.length && i < mask.length; i++) {
        if (isToken(mask[i as number])) {
            value += display[i as number];
        }
    }
    return value;
}

function editingNumber(text: string, decimal: string, group: string): boolean {
    if (text === '' || text === '-' || text === decimal || text === '-' + decimal) {
        return true;
    }
    const body: string = stripGrouping(text, group);
    const escaped: string = decimal === '.' ? '\\.' : decimal;
    // eslint-disable-next-line
    if ((body.match(new RegExp(escaped, 'g')) || []).length > 1) {
        return false;
    }
    // eslint-disable-next-line
    return new RegExp('^-?\\d*(' + escaped + '\\d*)?$').test(body);
}

/**
 * Applies a keystroke. `willCommit` rejects incomplete number/percent values.
 *
 * @param {AfFormatConfig} config - parsed config
 * @param {string} current - value before the edit
 * @param {number} selStart - selection start before the edit
 * @param {number} selEnd - selection end before the edit
 * @param {string} change - inserted text
 * @param {boolean} willCommit - true on blur/change
 * @returns {AfKeystrokeResult} accept or reject
 * @private
 */
/**
 * Whether a keydown should be cancelled before the character is inserted.
 * Paste and other non-character keys are left to the input handler.
 *
 * @param {AfFormatConfig} config - parsed format
 * @param {string} key - KeyboardEvent.key
 * @returns {boolean} true when the key must not be inserted
 * @private
 */
export function shouldBlockKey(config: AfFormatConfig, key: string): boolean {
    if (!config || !key || key.length !== 1) {
        return false;
    }
    if (config.kind !== 'number' && config.kind !== 'percent' && config.kind !== 'special') {
        return false;
    }
    if (config.kind === 'special') {
        if (config.mask) {
            return false;
        }
        return /\D/.test(key);
    }
    if (/[0-9]/.test(key) || key === '-' || key === '+' || key === '.' || key === ',') {
        return false;
    }
    return true;
}

export function applyKeystroke(
    config: AfFormatConfig, current: string, selStart: number, selEnd: number, change: string, willCommit?: boolean
): AfKeystrokeResult {
    const start: number = selStart == null ? (current || '').length : selStart;
    const end: number = selEnd == null ? start : selEnd;
    const base: string = current || '';
    const inserted: string = change == null ? '' : change;
    const candidate: string = base.slice(0, start) + inserted + base.slice(end);
    const reject: AfKeystrokeResult = { value: base, selStart: base.length, selEnd: base.length, accepted: false };
    if (!config || config.kind === 'none' || config.kind === 'date' || config.kind === 'time') {
        return { value: candidate, selStart: start + inserted.length, selEnd: start + inserted.length, accepted: true };
    }
    if (config.kind === 'special') {
        return applySpecialKeystroke(config, base, candidate, willCommit);
    }
    let next: string = candidate;
    if (config.kind === 'percent') {
        if (next.indexOf('%') !== next.length - 1 && next.indexOf('%') !== -1) {
            return reject;
        }
        next = next.replace(/%/g, '');
    }
    const sep: { group: string, decimal: string } = separators(config.separator);
    if (!editingNumber(next, sep.decimal, sep.group)) {
        return reject;
    }
    if (willCommit && next !== '' && !isCompleteNumber(stripGrouping(next, sep.group), sep.decimal)) {
        return reject;
    }
    const logical: string = stripGrouping(next, sep.group);
    return { value: logical, selStart: logical.length, selEnd: logical.length, accepted: true };
}

function applySpecialKeystroke(config: AfFormatConfig, previous: string, candidate: string, willCommit?: boolean): AfKeystrokeResult {
    if (config.mask) {
        const display: string = applyMask(config.mask, candidate, !willCommit);
        const logical: string = extractMaskValue(config.mask, display);
        if (willCommit && logical.length < maskTokenCount(config.mask) && logical !== '') {
            return { value: previous, selStart: previous.length, selEnd: previous.length, accepted: false };
        }
        return { value: logical, selStart: display.length, selEnd: display.length, accepted: true, display: display };
    }
    const digits: string = candidate.replace(/\D/g, '');
    const limit: number = SPECIAL_MAX_DIGITS[config.specialType] || 10;
    const clipped: string = digits.slice(0, limit);
    if (willCommit) {
        // The preset mask is applied on blur only. The commit check validates the
        // digit count and the caller formats the value after the validation passes.
        const check: AfSpecialCommit = validateSpecialValue(config, clipped);
        if (!check.valid) {
            return { value: previous, selStart: previous.length, selEnd: previous.length, accepted: false };
        }
        return { value: check.logical, selStart: check.logical.length, selEnd: check.logical.length, accepted: true };
    }
    // While typing the value stays unformatted - only the digit cap is enforced.
    return { value: clipped, selStart: clipped.length, selEnd: clipped.length, accepted: true };
}

function maskTokenCount(mask: string): number {
    let count: number = 0;
    for (let i: number = 0; i < mask.length; i++) {
        if (isToken(mask[i as number])) {
            count++;
        }
    }
    return count;
}

/**
 * Whether this field should run format actions in the page.
 *
 * @param {any} field - field model
 * @param {boolean} isServer - serviceUrl is set
 * @returns {boolean} true when an input listener should run
 * @private
 */
export function shouldRunFormat(field: any, isServer: boolean): boolean {
    if (!field || isServer) {
        return false;
    }
    if (field.isMultiline || field.isReadOnly || field.isReadonly || field.isPassword) {
        return false;
    }
    const type: string = field.formFieldAnnotationType || field.type || '';
    if (type && type !== 'Textbox' && type !== 'Text') {
        return false;
    }
    const config: AfFormatConfig = fieldConfig(field);
    return config.kind === 'number' || config.kind === 'percent' || config.kind === 'special';
}

/**
 * Parses the scripts stored on a field model.
 *
 * The viewer-side `currencySpacing` marker is a non-AF setting and is read
 * from a sibling property on the field model. AF scripts do not encode the
 * space between the currency symbol and the digits; the marker is therefore
 * preserved only across in-memory edits, not across PDF save/load.
 *
 * @param {any} field - field model with actions
 * @returns {AfFormatConfig} parsed config
 * @private
 */
export function fieldConfig(field: any): AfFormatConfig {
    if (!field) {
        return NONE_CONFIG;
    }
    const actions: any = field.actions || field.Actions;
    const config: AfFormatConfig = parseAfScripts(
        readActionScript(actions, 'format'),
        readActionScript(actions, 'keyPressed'));
    const marker: string = field._afCurrencySpacing;
    if (marker === 'space' || marker === 'none') {
        config.currencySpacing = marker;
    }
    // Apostrophe separator (1'234.56): the AF script carries separator 4, so a saved
    // field parses back with the same grouping. The `_afSeparator` marker stays as the
    // fallback for a field whose script was never written (for example a field that
    // only carries the marker from an earlier session).
    const sepMarker: { kind?: string, value?: number } | null = field._afSeparator || null;
    if (sepMarker && sepMarker.value === 4 && (sepMarker.kind === 'number' || sepMarker.kind === 'percent')) {
        if (config.kind === 'none') {
            return {
                ...config, kind: sepMarker.kind, decimals: DEFAULT_DECIMALS, separator: 4,
                negative: 0, currency: '', prepend: false, currencySpacing: 'none'
            };
        }
        config.separator = 4;
    }
    return config;
}

/**
 * Representative sample value used by the Format tab Preview textbox.
 *
 * Returns a string suitable for the active category (number, percent, special)
 * so the dialog can render a live preview as the user edits the controls.
 * Returns '' for categories that do not have a sensible sample (none / date /
 * time — date/time delegate to the existing preview path).
 *
 * @param {AfFormatConfig} config - parsed config
 * @returns {string} sample logical value
 * @private
 */
export function previewSampleValue(config: AfFormatConfig): string {
    if (!config) {
        return '';
    }
    if (config.kind === 'percent') {
        // 0.5 -> 50.00% at two decimals; matches Acrobat's percent semantics.
        return '0.5';
    }
    if (config.kind === 'number') {
        // -1234.5 exercises grouping, decimal places, currency and negative styling.
        return '-1234.5';
    }
    if (config.kind === 'special') {
        if (config.mask) {
            // The sample is a logical value: one character per placeholder of the
            // mask. The literals are added by the mask itself when the preview
            // renders the sample, so the sample must not carry them.
            // Each placeholder is filled with a character that the placeholder
            // accepts, so the Preview shows a value the field would also accept.
            let sample: string = '';
            let hasPlaceholder: boolean = false;
            for (let i: number = 0; i < config.mask.length; i++) {
                const token: string = config.mask[i as number];
                if (isToken(token)) {
                    sample += randomTokenChar(token);
                    hasPlaceholder = true;
                }
            }
            if (!hasPlaceholder) {
                // A mask without a placeholder has no slot to sample. The literals
                // are the whole mask, so the Preview shows them as they were typed.
                return config.mask;
            }
            return sample;
        }
        if (config.specialType === 0) {
            return '12345';
        }
        if (config.specialType === 1) {
            return '123456789';
        }
        if (config.specialType === 2) {
            return '1234567890';
        }
        if (config.specialType === 3) {
            return '123456789';
        }
    }
    return '';
}
