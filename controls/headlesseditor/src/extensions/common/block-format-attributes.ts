/**
 * Shared building blocks for block-level format attributes (alignment + indent).
 */

/**
 * Schema-aware defaults for the format attributes. Each entry describes one
 * attribute:
 *   - `name`  — node-attribute name (matches `AttributeDefinition.name`)
 *   - `value` — value to use when the DOM element does not declare the
 *               corresponding CSS property (typically the schema default)
 */
export interface BlockFormatDefault {
    readonly name: 'align' | 'indent';
    readonly value: unknown;
}

const TEXT_ALIGN_PROPERTIES: ReadonlySet<string> = new Set([
    'text-align',
    'text-align-last' // accept any of the three; only `text-align` writes.
]);

/**
 * Reads a single CSS declaration from a `style="…"` string.
 *
 * Returns `null` when the property is absent, the value when present.
 * The match is case-insensitive on the property name and tolerant of
 * stray whitespace.
 *
 * @param {string} style - The raw inline style declaration.
 * @param {string} property - The CSS property name to look up.
 * @returns {string | null} The value, or `null` when absent.
 * @hidden
 */
function readStyleProperty(style: string, property: string): string | null {
    if (!style) { return null; }
    const declarations: string[] = style.split(';');
    for (const declaration of declarations) {
        const colonIndex: number = declaration.indexOf(':');
        if (colonIndex < 0) { continue; }
        const name: string = declaration.slice(0, colonIndex).trim().toLowerCase();
        if (name !== property.toLowerCase()) { continue; }
        return declaration.slice(colonIndex + 1).trim();
    }
    return null;
}

/**
 * Reads the `text-align` value from an inline style declaration.
 *
 * @param {string | null} style - The raw inline style declaration, or null.
 * @returns {string | null} The normalised value, or `null` when absent.
 * @hidden
 */
function readTextAlign(style: string | null): string | null {
    if (!style) { return null; }
    for (const property of Array.from(TEXT_ALIGN_PROPERTIES)) {
        const value: string | null = readStyleProperty(style, property);
        if (value) { return value.toLowerCase(); }
    }
    return null;
}

/**
 * Parses the `margin-left` declaration into a positive integer indent count,
 * rounding to the nearest multiple of `INDENT_STEP_PX` (20px). Anything that
 * fails to parse, is negative, or lies below one full step collapses to 0.
 *
 * @param {string | null} style - The raw inline style declaration, or null.
 * @param {number} stepPx - Pixel width of one indent step.
 * @returns {number} The normalised indent value.
 * @hidden
 */
function readMarginLeftAsIndent(style: string | null, stepPx: number): number {
    if (!style) { return 0; }
    const marginLeft: string | null = readStyleProperty(style, 'margin-left');
    if (!marginLeft) { return 0; }
    // eslint-disable-next-line security/detect-unsafe-regex
    const pixelMatch: RegExpMatchArray | null = marginLeft.match(/^(-?\d+(?:\.\d+)?)px$/);
    if (!pixelMatch) { return 0; }
    const pixels: number = parseFloat(pixelMatch[1]);
    if (!Number.isFinite(pixels) || pixels <= 0) { return 0; }
    return Math.round(pixels / stepPx);
}

/**
 * Resolves the `align` attribute for a parsed DOM element.
 *
 * Recognised sources, in order:
 *   1. The `align` HTML attribute (legacy Word / older Google Docs path).
 *   2. The `text-align` inline CSS property.
 *   3. The schema default supplied via `defaults`.
 *
 * @param {HTMLElement} dom - The parsed DOM element.
 * @param {ReadonlyArray<BlockFormatDefault>} defaults - Schema defaults.
 * @returns {any} The resolved align attribute value.
 * @hidden
 */
function resolveAlign(
    dom: HTMLElement,
    defaults: readonly BlockFormatDefault[]
): any {
    const allowed: ReadonlySet<string> = new Set(['left', 'center', 'right', 'justify']);
    const fallback: any = defaults.find((d: BlockFormatDefault): boolean => d.name === 'align')?.value;
    const htmlAlign: string | null = dom.getAttribute('align');
    if (htmlAlign && allowed.has(htmlAlign.toLowerCase())) {
        return htmlAlign.toLowerCase();
    }
    const styleAlign: string | null = readTextAlign(dom.getAttribute('style'));
    if (styleAlign && allowed.has(styleAlign)) {
        return styleAlign;
    }
    return fallback;
}

/**
 * Resolves the `indent` attribute for a parsed DOM element.
 *
 * Recognised sources:
 *   1. The `margin-left` inline CSS property (preferred — matches our
 *      `mergeIndentStyle` serializer exactly).
 *   2. The schema default supplied via `defaults`.
 *
 * @param {HTMLElement} dom - The parsed DOM element.
 * @param {ReadonlyArray<BlockFormatDefault>} defaults - Schema defaults.
 * @param {number} stepPx - Pixel width of one indent step.
 * @returns {any} The resolved indent attribute value.
 * @hidden
 */
function resolveIndent(
    dom: HTMLElement,
    defaults: readonly BlockFormatDefault[],
    stepPx: number
): any {
    const fallback: any = defaults.find((d: BlockFormatDefault): boolean => d.name === 'indent')?.value;
    const fromStyle: number = readMarginLeftAsIndent(dom.getAttribute('style'), stepPx);
    if (fromStyle > 0) { return fromStyle; }
    return fallback;
}

/**
 * Parses block-level format attributes (`align`, `indent`) from a DOM element.
 *
 * Unknown or unparsable values fall back to the matching schema default so
 * the resulting node attrs are always schema-valid.
 *
 * @param {unknown} dom - The parsed DOM element (cast to `HTMLElement`).
 * @param {ReadonlyArray<BlockFormatDefault>} defaults - Schema defaults.
 * @param {number} [stepPx=20] - Pixel width of one indent step.
 * @returns {Record<string, any>} The parsed attribute bag.
 * @hidden
 */
export function parseBlockFormat(
    dom: unknown,
    defaults: readonly BlockFormatDefault[],
    stepPx: number = 20
): Record<string, any> {
    const element: HTMLElement = dom as HTMLElement;
    const result: Record<string, any> = {};
    result['align'] = resolveAlign(element, defaults);
    result['indent'] = resolveIndent(element, defaults, stepPx);
    return result;
}
