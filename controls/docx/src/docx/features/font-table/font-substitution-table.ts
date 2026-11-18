import { DocxError } from '../../core/errors/docx-error';
import { FontTablePart } from './font-table';
import { FontTableFont } from './font-table-entry';
/**
 * Dictionary of primary → alternate font names (`w:font/@w:name` → `w:altName/@w:val`).
 *
 * Facade over {@link FontTablePart} / {@link FontTableFont.alternateName} — not a
 * separate string store. Entries exist only for fonts with a modeled non-empty
 * alternate (ECMA-376-1 §17.8.3.1).
 *
 * **Preferred public entry:** {@link WordDocument.fontSubstitutionTable}. Prefer this
 * over {@link fontTableFor} for substitution-only workflows (TASK-8067). Use
 * `fontTableFor` for full `CT_Font` catalog metadata (panose, embeds, residual).
 *
 * Lookup keys are case-insensitive (locale-independent lower-case), matching
 * {@link FontTablePart.font}. Stored primary casing is preserved on alternate-only
 * updates; new rows keep the trimmed caller primary casing.
 *
 * @private
 */
export interface FontSubstitutionTable extends Iterable<[
    string,
    string
]> {
    /** Number of fonts that currently declare a non-empty alternate name. */
    readonly size: number;
    /**
     * Upsert a substitution. Creates a minimal `w:font` row when the primary is absent.
     *
     * @returns `this` for chaining.
     * @throws DocxError `content/unsupported` when either name is null, undefined,
     * empty, or whitespace-only after trim.
     */
    set(primaryFont: string, alternateFont: string): this;
    /** Alternate for `primaryFont`, or `undefined` when absent / no `w:altName`. */
    get(primaryFont: string): string | undefined;
    /** Whether a modeled non-empty alternate exists for `primaryFont`. */
    has(primaryFont: string): boolean;
    /**
     * Clear alternate on the matching font row only. Keeps `w:font` and other metadata.
     *
     * @returns `true` when an alternate was removed; `false` when nothing changed.
     */
    delete(primaryFont: string): boolean;
    /**
     * Clear alternate on every font row. Keeps all rows and non-altName metadata.
     */
    clear(): void;
    entries(): IterableIterator<[
        string,
        string
    ]>;
    keys(): IterableIterator<string>;
    values(): IterableIterator<string>;
    [Symbol.iterator](): IterableIterator<[
        string,
        string
    ]>;
}
/**
 * Runtime validation for public `set` boundaries (TS types are `string`).
 *
 * @param {string | null | undefined} value - The value.
 * @param {string} role - The role.
 * @returns {string} The result.
 */
function requireTrimmedFontName(value: string | null | undefined, role: string): string {
    if (value === null || value === undefined) {
        throw new DocxError('content/unsupported', `${role} must not be empty`);
    }
    const trimmed: string = String(value).trim();
    if (trimmed.length === 0) {
        throw new DocxError('content/unsupported', `${role} must not be empty`);
    }
    return trimmed;
}
function substitutionPairs(part: FontTablePart): [
    string,
    string
][] {
    const pairs: [
        string,
        string
    ][] = [];
    for (const font of part.fonts()) {
        const alternate: string = font.alternateName;
        if (alternate !== undefined && alternate.trim().length > 0) {
            pairs.push([font.name, alternate]);
        }
    }
    return pairs;
}
/**
 * {@link FontSubstitutionTable} backed by a live {@link FontTablePart}.
 *
 * @private
 * Constructed by the font-table feature host (`WordDocument.fontSubstitutionTable`).
 */
export class FontSubstitutionTableImpl implements FontSubstitutionTable {
    private readonly part: FontTablePart;
    /**
     * @param {FontTablePart} part - The part.
     * @private
     */
    constructor(part: FontTablePart) {
        this.part = part;
    }
    /**
     * @returns {FontTablePart} The result.
     * @private
     * Live part this facade projects (same instance as {@link fontTableFor}).
     */
    boundPart(): FontTablePart {
        return this.part;
    }
    get size(): number {
        return substitutionPairs(this.part).length;
    }
    set(primaryFont: string, alternateFont: string): this {
        const primary: string = requireTrimmedFontName(primaryFont, 'Font name');
        const alternate: string = requireTrimmedFontName(alternateFont, 'Alternate font name');
        const entry: FontTableFont = this.part.appendFont(primary);
        entry.alternateName = alternate;
        return this;
    }
    get(primaryFont: string): string | undefined {
        let ts330: any;
        if (primaryFont === null || primaryFont === undefined) {
            return undefined;
        }
        const key: string = String(primaryFont).trim();
        if (key.length === 0) {
            return undefined;
        }
        const alternate: string = ((ts330 = this.part.font(key)), ts330 == null ? undefined : ts330.alternateName);
        if (alternate === undefined || alternate.trim().length === 0) {
            return undefined;
        }
        return alternate;
    }
    has(primaryFont: string): boolean {
        return this.get(primaryFont) !== undefined;
    }
    delete(primaryFont: string): boolean {
        if (primaryFont === null || primaryFont === undefined) {
            return false;
        }
        const key: string = String(primaryFont).trim();
        if (key.length === 0) {
            return false;
        }
        const entry: FontTableFont = this.part.font(key);
        if (entry === undefined) {
            return false;
        }
        if (entry.alternateName === undefined || entry.alternateName.trim().length === 0) {
            return false;
        }
        entry.alternateName = undefined;
        return true;
    }
    clear(): void {
        for (const font of this.part.fonts()) {
            if (font.alternateName !== undefined) {
                font.alternateName = undefined;
            }
        }
    }
    *entries(): IterableIterator<[
        string,
        string
    ]> {
        yield* substitutionPairs(this.part);
    }
    *keys(): IterableIterator<string> {
        for (const [primary] of substitutionPairs(this.part)) {
            yield primary;
        }
    }
    *values(): IterableIterator<string> {
        for (const [, alternate] of substitutionPairs(this.part)) {
            yield alternate;
        }
    }
    [Symbol.iterator](): IterableIterator<[
        string,
        string
    ]> {
        return this.entries();
    }
}
