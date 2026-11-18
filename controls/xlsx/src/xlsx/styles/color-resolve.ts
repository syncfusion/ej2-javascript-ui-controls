/**
 * Read-only resolution of SpreadsheetML `CT_Color` to `#RRGGBB`.
 *
 * Stored attributes (`auto`, `indexed`, `rgb`, `theme`, `tint`) are never
 * rewritten. `rgbColor` is a computed view and must not be serialized.
 *
 * Citations:
 * - ECMA-376-1 §18.3.1.15 `color` / `tint` (HLS, HLSMAX = 255)
 * - ECMA-376-1 §18.8.27 `indexedColors` (implied default palette)
 * - ECMA-376-1 §20.1.6.2 `clrScheme` (theme index order; `sysClr` / `srgbClr`)
 * - ECMA-376-1 §14.2.7 Theme Part (Strict relationship)
 * - ECMA-376-4 §12.2.7 Theme Part (Transitional relationship)
 */

/** HLSMAX from ECMA-376-1 §18.3.1.15. */
const HLSMAX: number = 255;

/**
 * ECMA-376-1 §20.1.6.2 sequence. SpreadsheetML `theme` is this index, not the
 * Office UI order (lt1, dk1, …).
 */
const THEME_COLOR_NAMES: ReadonlyArray<string> = [
    'dk1',
    'lt1',
    'dk2',
    'lt2',
    'accent1',
    'accent2',
    'accent3',
    'accent4',
    'accent5',
    'accent6',
    'hlink',
    'folHlink'
];

/**
 * Office default theme `srgbClr` values, used only when the package has no
 * theme part. `dk1` / `lt1` follow the usual `windowText` / `window` lastClr
 * stand-ins (black / white). Not written into the package.
 *
 * Citation: ECMA-376-1 §20.1.6.2 (twelve-color scheme). RGB values are the
 * Office theme that Excel applies when `theme1.xml` is absent — resolution
 * only, never serialized.
 */
const DEFAULT_THEME_SRGB: ReadonlyArray<string> = [
    '000000',
    'FFFFFF',
    '44546A',
    'E7E6E6',
    '4472C4',
    'ED7D31',
    'A5A5A5',
    'FFC000',
    '5B9BD5',
    '70AD47',
    '0563C1',
    '954F72'
];

/**
 * SpreadsheetML `theme` index → slot in `THEME_COLOR_NAMES` / the parsed
 * scheme. 0↔1 and 2↔3 match Excel (`theme="1"` is `dk1`, `theme="3"` is
 * `dk2`). 4–11 are identity.
 */
const THEME_INDEX_TO_SCHEME: ReadonlyArray<number> = [
    1,
    0,
    3,
    2,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11
];

/**
 * ECMA-376-1 §18.8.27 default indexed palette, indexes 0–63, RGB only
 * (alpha byte dropped). Indexes 64 and 65 are system colors and stay
 * unresolved.
 */
const DEFAULT_INDEXED_RGB: ReadonlyArray<string | undefined> = [
    '000000',
    'FFFFFF',
    'FF0000',
    '00FF00',
    '0000FF',
    'FFFF00',
    'FF00FF',
    '00FFFF',
    '000000',
    'FFFFFF',
    'FF0000',
    '00FF00',
    '0000FF',
    'FFFF00',
    'FF00FF',
    '00FFFF',
    '800000',
    '008000',
    '000080',
    '808000',
    '800080',
    '008080',
    'C0C0C0',
    '808080',
    '9999FF',
    '993366',
    'FFFFCC',
    'CCFFFF',
    '660066',
    'FF8080',
    '0066CC',
    'CCCCFF',
    '000080',
    'FF00FF',
    'FFFF00',
    '00FFFF',
    '800080',
    '800000',
    '008080',
    '0000FF',
    '00CCFF',
    'CCFFFF',
    'CCFFCC',
    'FFFF99',
    '99CCFF',
    'FF99CC',
    'CC99FF',
    'FFCC99',
    '3366FF',
    '33CCCC',
    '99CC00',
    'FFCC00',
    'FF9900',
    'FF6600',
    '666699',
    '969696',
    '003366',
    '339966',
    '003300',
    '333300',
    '993300',
    '993366',
    '333399',
    '333333'
];

/**
 * Theme scheme used to resolve `theme` indexes. Twelve `#RRGGBB` slots
 * (alpha omitted). Missing slots stay unresolved.
 */
export interface ThemeColorScheme {
    readonly colors: ReadonlyArray<string | undefined>;
}

/**
 * Workbook color context for resolution. Indexed overrides replace the
 * implied §18.8.27 palette from index 0 when a `colors` collection is present.
 */
export interface ColorResolutionContext {
    readonly theme: ThemeColorScheme;
    readonly indexedRgb?: ReadonlyArray<string | undefined>;
}

/** Stored SpreadsheetML color attributes (no computed view). */
export interface StoredColor {
    readonly auto?: boolean;
    readonly indexed?: number;
    readonly rgb?: string;
    readonly theme?: number;
    readonly tint?: number;
}

/**
 * Apply ECMA-376-1 §18.3.1.15 tint to an RGB triple.
 * `tint` 0 leaves the color unchanged. Out-of-range tint is clamped to [-1, 1].
 *
 * @param {number} r - Red channel, 0–255.
 * @param {number} g - Green channel, 0–255.
 * @param {number} b - Blue channel, 0–255.
 * @param {number} tint - SpreadsheetML tint in [-1, 1].
 * @returns {{ r: number, g: number, b: number }} - Tinted RGB triple.
 */
export function applySpreadsheetTint(
    r: number,
    g: number,
    b: number,
    tint: number
): { r: number; g: number; b: number } {
    if (!Number.isFinite(tint) || tint === 0) {
        return { r: clampByte(r), g: clampByte(g), b: clampByte(b) };
    }
    const t: number = tint < -1 ? -1 : tint > 1 ? 1 : tint;
    const hsl: { h: number; l: number; s: number } = rgbToHls(clampByte(r), clampByte(g), clampByte(b));
    const lum: number = applyTintToLuminance(hsl.l, t);
    return hlsToRgb(hsl.h, lum, hsl.s);
}

/**
 * §18.3.1.15 luminance step. Exported so tests can pin the spec examples
 * without OOXML.
 *
 * @param {number} lum - Luminance in HLSMAX units.
 * @param {number} tint - SpreadsheetML tint.
 * @returns {number} - Adjusted luminance.
 */
export function applyTintToLuminance(lum: number, tint: number): number {
    // Spec examples are whole luminance units (Lum 100, tint 0.75 → 217).
    if (tint < 0) {
        return Math.round(lum * (1.0 + tint));
    }
    if (tint > 0) {
        return Math.round(lum * (1.0 - tint) + (HLSMAX - HLSMAX * (1.0 - tint)));
    }
    return lum;
}

/**
 * Resolve a stored color to `#RRGGBB`, or `undefined` when automatic,
 * system-indexed, or otherwise unresolvable. Does not invent a color for
 * `auto`.
 *
 * @param {StoredColor | undefined} color - Stored color attributes.
 * @param {ColorResolutionContext} context - Theme and indexed palette.
 * @returns {string | undefined} - `#RRGGBB`, or undefined when unresolvable.
 */
export function resolveColorToRgb(
    color: StoredColor | undefined,
    context: ColorResolutionContext
): string | undefined {
    if (color === undefined || color.auto === true) {
        return undefined;
    }
    let base: { r: number; g: number; b: number } | undefined = baseRgb(color, context);
    if (base === undefined) {
        return undefined;
    }
    if (color.tint !== undefined && color.tint !== 0) {
        const tinted: { r: number; g: number; b: number } = applySpreadsheetTint(base.r, base.g, base.b, color.tint);
        base = tinted;
    }
    return formatRgbHex(base.r, base.g, base.b);
}

/**
 * Parse a theme part for the first `clrScheme` twelve-color list.
 * `srgbClr@val` wins; otherwise `sysClr@lastClr`. Unreadable slots are
 * undefined (callers may fall back only when the whole part is absent).
 *
 * @param {string} themeXml - Theme part markup.
 * @returns {ThemeColorScheme} - Twelve-slot scheme; missing slots are undefined.
 */
export function parseThemeColorScheme(themeXml: string): ThemeColorScheme {
    const scheme: string | undefined = extractFirstElement(themeXml, 'clrScheme');
    if (scheme === undefined) {
        return { colors: [] };
    }
    const colors: Array<string | undefined> = [];
    for (const name of THEME_COLOR_NAMES) {
        const slot: string | undefined = extractFirstElement(scheme, name);
        colors.push(slot === undefined ? undefined : colorFromThemeSlot(slot));
    }
    return { colors };
}

/**
 * Office default scheme used only when no theme part is present.
 *
 * @returns {ThemeColorScheme} - Default twelve-color scheme.
 */
export function defaultThemeColorScheme(): ThemeColorScheme {
    return { colors: DEFAULT_THEME_SRGB.slice() };
}

/**
 * Parse `indexedColors` / `rgbColor@rgb` overrides (ECMA-376-1 §18.8.27).
 * Returns undefined when the collection is absent.
 *
 * @param {string | undefined} colorsCollectionXml - Styles `colors` collection markup.
 * @returns {ReadonlyArray<string | undefined> | undefined} - Override palette, or undefined.
 */
export function parseIndexedColorOverrides(
    colorsCollectionXml: string | undefined
): ReadonlyArray<string | undefined> | undefined {
    if (colorsCollectionXml === undefined || colorsCollectionXml.trim().length === 0) {
        return undefined;
    }
    const indexed: string | undefined = extractFirstElement(colorsCollectionXml, 'indexedColors');
    if (indexed === undefined) {
        return undefined;
    }
    const out: Array<string | undefined> = [];
    // Fixed OOXML local name; not built from caller input.
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const re: RegExp = /<(?:[\w.]+:)?rgbColor\b([^>]*?)\/?>/gi;
    let match: RegExpExecArray | null = re.exec(indexed);
    while (match !== null) {
        const attrs: string = match[1] !== undefined ? match[1] : '';
        const rgb: string | undefined = readAttr(attrs, 'rgb');
        out.push(rgbToComponents(rgb) !== undefined ? normalizeRgbDigits(rgb) : undefined);
        match = re.exec(indexed);
    }
    return out;
}

/**
 * Resolve stored attributes to an RGB triple before tint.
 *
 * @param {StoredColor} color - Stored color attributes.
 * @param {ColorResolutionContext} context - Theme and indexed palette.
 * @returns {{ r: number, g: number, b: number } | undefined} - Base RGB, or undefined.
 */
function baseRgb(
    color: StoredColor,
    context: ColorResolutionContext
): { r: number; g: number; b: number } | undefined {
    if (color.rgb !== undefined && color.rgb !== '') {
        return rgbToComponents(color.rgb);
    }
    if (color.theme !== undefined) {
        const schemeIndex: number = THEME_INDEX_TO_SCHEME[color.theme] !== undefined
            ? THEME_INDEX_TO_SCHEME[color.theme]
            : color.theme;
        const slot: string | undefined = context.theme.colors[schemeIndex];
        return slot === undefined ? undefined : rgbToComponents(slot);
    }
    if (color.indexed !== undefined) {
        const palette: ReadonlyArray<string | undefined> =
            context.indexedRgb !== undefined ? context.indexedRgb : DEFAULT_INDEXED_RGB;
        const slot: string | undefined = palette[color.indexed];
        return slot === undefined ? undefined : rgbToComponents(slot);
    }
    return undefined;
}

/**
 * Read `srgbClr@val` or `sysClr@lastClr` from one theme color slot.
 *
 * @param {string} slotXml - One `clrScheme` child element.
 * @returns {string | undefined} - Six hex digits, or undefined.
 */
function colorFromThemeSlot(slotXml: string): string | undefined {
    const srgb: string | undefined = extractFirstElement(slotXml, 'srgbClr');
    if (srgb !== undefined) {
        const val: string | undefined = readAttr(openTagAttrs(srgb), 'val');
        if (rgbToComponents(val) !== undefined) {
            return normalizeRgbDigits(val);
        }
    }
    const sys: string | undefined = extractFirstElement(slotXml, 'sysClr');
    if (sys !== undefined) {
        const last: string | undefined = readAttr(openTagAttrs(sys), 'lastClr');
        if (rgbToComponents(last) !== undefined) {
            return normalizeRgbDigits(last);
        }
    }
    return undefined;
}

/**
 * Parse an `RRGGBB` or `AARRGGBB` token into channels. Alpha is dropped.
 *
 * @param {string | undefined} raw - Hex color token.
 * @returns {{ r: number, g: number, b: number } | undefined} - Channels, or undefined.
 */
function rgbToComponents(raw: string | undefined): { r: number; g: number; b: number } | undefined {
    if (raw === undefined) {
        return undefined;
    }
    const hex: string = raw.trim();
    if (!/^[0-9A-Fa-f]+$/.test(hex)) {
        return undefined;
    }
    const digits: string | undefined = hex.length === 8 ? hex.slice(2) : hex.length === 6 ? hex : undefined;
    if (digits === undefined) {
        return undefined;
    }
    return {
        r: Number.parseInt(digits.slice(0, 2), 16),
        g: Number.parseInt(digits.slice(2, 4), 16),
        b: Number.parseInt(digits.slice(4, 6), 16)
    };
}

/**
 * Normalize a hex token to six uppercase digits.
 *
 * @param {string | undefined} raw - Hex color token.
 * @returns {string | undefined} - `RRGGBB`, or undefined.
 */
function normalizeRgbDigits(raw: string | undefined): string | undefined {
    const parts: { r: number; g: number; b: number } | undefined = rgbToComponents(raw);
    if (parts === undefined) {
        return undefined;
    }
    return (
        toHexByte(parts.r) + toHexByte(parts.g) + toHexByte(parts.b)
    );
}

/**
 * `#RRGGBB` uppercase, no alpha.
 *
 * @param {number} r - Red channel.
 * @param {number} g - Green channel.
 * @param {number} b - Blue channel.
 * @returns {string} - `#RRGGBB`.
 */
export function formatRgbHex(r: number, g: number, b: number): string {
    return '#' + toHexByte(r) + toHexByte(g) + toHexByte(b);
}

/**
 * Clamp and format one channel as two uppercase hex digits.
 *
 * @param {number} n - Channel value.
 * @returns {string} - Two hex digits.
 */
function toHexByte(n: number): string {
    const v: number = clampByte(Math.round(n));
    const hex: string = v.toString(16).toUpperCase();
    return hex.length === 1 ? '0' + hex : hex;
}

/**
 * Clamp a channel to 0–255.
 *
 * @param {number} n - Channel value.
 * @returns {number} - Clamped byte.
 */
function clampByte(n: number): number {
    if (!Number.isFinite(n) || n < 0) {
        return 0;
    }
    if (n > 255) {
        return 255;
    }
    return n;
}

/**
 * RGB → HLS with HLSMAX 255, matching the integer HSL used by Excel's
 * SpreadsheetML tint (not DrawingML percentage tint).
 *
 * @param {number} r - Red channel.
 * @param {number} g - Green channel.
 * @param {number} b - Blue channel.
 * @returns {{ h: number, l: number, s: number }} - HLS triple.
 */
function rgbToHls(
    r: number,
    g: number,
    b: number
): { h: number; l: number; s: number } {
    const max: number = Math.max(r, g, b);
    const min: number = Math.min(r, g, b);
    const l: number = Math.round((max + min) / 2);
    if (max === min) {
        return { h: 0, l, s: 0 };
    }
    const delta: number = max - min;
    const s: number =
        l <= 127
            ? Math.round((delta * HLSMAX) / (max + min))
            : Math.round((delta * HLSMAX) / (2 * HLSMAX - max - min));
    let h: number;
    if (r === max) {
        h = Math.round(((g - b) * HLSMAX) / delta);
    } else if (g === max) {
        h = Math.round(((b - r) * HLSMAX) / delta) + 2 * HLSMAX;
    } else {
        h = Math.round(((r - g) * HLSMAX) / delta) + 4 * HLSMAX;
    }
    if (h < 0) {
        h += 6 * HLSMAX;
    }
    return { h, l, s };
}

/**
 * HLS → RGB with HLSMAX 255.
 *
 * @param {number} h - Hue.
 * @param {number} l - Luminance.
 * @param {number} s - Saturation.
 * @returns {{ r: number, g: number, b: number }} - RGB triple.
 */
function hlsToRgb(
    h: number,
    l: number,
    s: number
): { r: number; g: number; b: number } {
    const lum: number = clampByte(Math.round(l));
    if (s === 0) {
        return { r: lum, g: lum, b: lum };
    }
    const magic2: number = lum <= 127
        ? Math.round((lum * (HLSMAX + s)) / HLSMAX)
        : lum + s - Math.round((lum * s) / HLSMAX);
    const magic1: number = 2 * lum - magic2;
    return {
        r: hueToRgb(magic1, magic2, h + 2 * HLSMAX),
        g: hueToRgb(magic1, magic2, h),
        b: hueToRgb(magic1, magic2, h - 2 * HLSMAX)
    };
}

/**
 * One HLS hue channel, clamped to a byte.
 *
 * @param {number} magic1 - HLS magic1.
 * @param {number} magic2 - HLS magic2.
 * @param {number} hue - Hue offset.
 * @returns {number} - Channel byte.
 */
function hueToRgb(magic1: number, magic2: number, hue: number): number {
    let h: number = hue;
    if (h < 0) {
        h += 6 * HLSMAX;
    }
    if (h >= 6 * HLSMAX) {
        h -= 6 * HLSMAX;
    }
    let channel: number;
    if (h < HLSMAX) {
        channel = magic1 + Math.round(((magic2 - magic1) * h) / HLSMAX);
    } else if (h < 3 * HLSMAX) {
        channel = magic2;
    } else if (h < 4 * HLSMAX) {
        channel = magic1 + Math.round(((magic2 - magic1) * (4 * HLSMAX - h)) / HLSMAX);
    } else {
        channel = magic1;
    }
    return clampByte(channel);
}

/**
 * First element with `localName`, including a prefixed or self-closing tag.
 * `localName` is escaped before it is placed in a regular expression.
 *
 * @param {string} xml - Markup to search.
 * @param {string} localName - Element local name.
 * @returns {string | undefined} - Element markup, or undefined.
 */
function extractFirstElement(xml: string, localName: string): string | undefined {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const re: RegExp = new RegExp('<(?:[\\w.]+:)?' + escapeRegExp(localName) + '\\b', 'i');
    const start: RegExpExecArray | null = re.exec(xml);
    if (start === null || start.index === undefined) {
        return undefined;
    }
    const open: string = xml.slice(start.index);
    const tagEnd: number = open.indexOf('>');
    if (tagEnd < 0) {
        return undefined;
    }
    if (open.charAt(tagEnd - 1) === '/') {
        return open.slice(0, tagEnd + 1);
    }
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const closeRe: RegExp = new RegExp('</(?:[\\w.]+:)?' + escapeRegExp(localName) + '\\s*>', 'i');
    const rest: string = open.slice(tagEnd + 1);
    const close: RegExpExecArray | null = closeRe.exec(rest);
    if (close === null || close.index === undefined) {
        return undefined;
    }
    return open.slice(0, tagEnd + 1 + close.index + close[0].length);
}

/**
 * Attribute text of an element's open tag.
 *
 * @param {string} elementXml - Element markup.
 * @returns {string} - Attribute text, or empty.
 */
function openTagAttrs(elementXml: string): string {
    const end: number = elementXml.indexOf('>');
    if (end < 0) {
        return '';
    }
    const open: string = elementXml.slice(0, end);
    const space: number = open.indexOf(' ');
    return space < 0 ? '' : open.slice(space);
}

/**
 * Read one attribute value. `name` is escaped before it is placed in a regular expression.
 *
 * @param {string} attrs - Attribute text.
 * @param {string} name - Attribute local name.
 * @returns {string | undefined} - Attribute value, or undefined.
 */
function readAttr(attrs: string, name: string): string | undefined {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(name) only
    const re: RegExp = new RegExp('\\b' + escapeRegExp(name) + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\')', 'i');
    const m: RegExpExecArray | null = re.exec(attrs);
    if (m === null) {
        return undefined;
    }
    return m[1] !== undefined ? m[1] : m[2];
}

/**
 * Escape a literal for use inside a regular expression.
 *
 * @param {string} value - Literal text.
 * @returns {string} - Escaped pattern fragment.
 */
function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
