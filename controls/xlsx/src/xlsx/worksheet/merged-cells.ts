/**
 * Worksheet merged ranges (`CT_MergeCells` / `CT_MergeCell@ref`).
 *
 * Citations:
 * - ECMA-376-1 §18.3.1.55 `mergeCells` / §18.3.1.56 `mergeCell`
 * - transitional sml.xsd `CT_MergeCells` / `CT_MergeCell` / `ST_Ref`
 * - docs/specs/merged-cells.md; docs/ooxml-mapping/merged-cells.md
 *
 * Meaningful cell content for a merge lives in the **top-left** cell.
 * This API does not move, clear, or rewrite covered cell values on add/remove.
 */

import { formatA1Range, parseA1Range } from '../address/cell-address';
import { InvalidArgumentError, MergeOverlapError } from '../core/errors';
import { InvalidMergeRefError } from '../core/errors';
import { attrsToXmlExcluding, escapeXml, parseAttrMap } from '../core/xml/minimal-xml';

/**
 * Defines a rectangular block of cells as the bounds of a merged region,
 * from its first to last row and column.
 */
export interface MergeRange {
    /** The first row of the merged area — 1-based, like Excel rows. */
    readonly startRow: number;
    /** The first column of the merged area — 1-based, like Excel columns. */
    readonly startCol: number;
    /** The last row of the merged area — 1-based, inclusive. */
    readonly endRow: number;
    /** The last column of the merged area — 1-based, inclusive. */
    readonly endCol: number;
}

/**
 * Represents the merged cell regions in a worksheet, letting you merge,
 * find, and unmerge ranges of cells.
 *
 * Exact-ref `has` / `remove` use normalized compact A1 (`A1` or `A1:B2`).
 * Overlapping adds are rejected; exact same normalized ref is idempotent.
 */
export interface MergedCells {
    /** The number of merged areas on the worksheet. */
    readonly count: number;
    /**
     * Get all merged areas as a list of A1 range addresses, in the order
     * they appear on the worksheet.
     *
     * @returns {*} the current merged-area addresses.
     */
    list(): ReadonlyArray<string>;
    /**
     * Check whether the worksheet contains a merged area with exactly this
     * address.
     *
     * @param ref - The range address to look for, like `'A1:B2'`.
     * @returns {*} `true` when a merged area with the exact address exists.
     */
    has(ref: string): boolean;
    /**
     * Merge the cells in a range into a single area. The area's content is
     * kept in its top-left cell, as in Excel.
     *
     * @param ref - The range to merge, like `'A1:B2'`.
     * @throws InvalidArgumentError when `ref` is empty/whitespace
     * @throws InvalidMergeRefError when the ref is unparseable or inverted
     * @throws MergeOverlapError when the range overlaps an existing merge
     *   (the exact same address is a no-op, not an overlap)
     */
    add(ref: string): void;
    /**
     * Remove the merged area with exactly this address. The cells keep their
     * values; only the merge is removed.
     *
     * @param ref - The range address to remove, like `'A1:B2'`.
     */
    remove(ref: string): void;
    /** Remove every merged area on the worksheet. Cell values are kept. */
    clear(): void;
}

/**
 * Opaque extras on a single `mergeCell` for round-trip.
 *
 * @private
 */
export interface MergeCellEntry {
    readonly range: MergeRange;
    /** Extra attributes excluding `ref` (XML fragment without leading space). */
    readonly extraAttrsXml: string;
}

/**
 * Host notifications for merge mutations.
 *
 * @private
 */
export interface MergedCellsHost {
    markDirty(): void;
}

/**
 * Mutable merged-cells store backed by an ordered entry list.
 *
 * @private
 */
export class MergedCellsImpl implements MergedCells {
    private readonly entries: MergeCellEntry[] = [];
    private host: MergedCellsHost | undefined;

    /**
     * Creates an instance.
     *
     * @param {Object} initial - The initial parameter.
     */
    public constructor(initial?: ReadonlyArray<MergeCellEntry>) {
        if (initial !== undefined) {
            for (const e of initial) {
                this.entries.push({
                    range: { ...e.range },
                    extraAttrsXml: e.extraAttrsXml
                });
            }
        }
    }

    /**
     * bindHost method.
     *
     * @param {MergedCellsHost} host - The host parameter.
     * @returns {void} - Returns the result.
     */
    public bindHost(host: MergedCellsHost): void {
        this.host = host;
    }

    /**
     * Gets count.
     *
     * @returns {number} - Returns the result.
     */
    public get count(): number {
        return this.entries.length;
    }

    /**
     * list method.
     *
     * @returns {string} - Returns the result.
     */
    public list(): ReadonlyArray<string> {
        return this.entries.map((e: MergeCellEntry): string => formatA1Range(e.range));
    }

    /**
     * has method.
     *
     * @param {string} ref - The ref parameter.
     * @returns {boolean} - Returns the result.
     */
    public has(ref: string): boolean {
        const key: string = normalizeMergeRefKey(ref);
        return this.entries.some((e: MergeCellEntry): boolean => formatA1Range(e.range) === key);
    }

    /**
     * add method.
     *
     * @param {string} ref - The ref parameter.
     * @returns {void} - Returns the result.
     */
    public add(ref: string): void {
        const trimmed: string = ref.trim();
        if (trimmed.length === 0) {
            throw new InvalidArgumentError('Merge ref must be a non-empty string');
        }
        const range: any = parseA1Range(trimmed);
        const key: string = formatA1Range(range);
        for (const existing of this.entries) {
            const existingKey: string = formatA1Range(existing.range);
            if (existingKey === key) {
                return;
            }
            if (rangesOverlap(existing.range, range)) {
                throw new MergeOverlapError(`Merge ref "${key}" overlaps existing merge "${existingKey}"`);
            }
        }
        this.entries.push({ range, extraAttrsXml: '' });
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * remove method.
     *
     * @param {string} ref - The ref parameter.
     * @returns {void} - Returns the result.
     */
    public remove(ref: string): void {
        const trimmed: string = ref.trim();
        if (trimmed.length === 0) {
            return;
        }
        let key: string;
        try {
            key = normalizeMergeRefKey(trimmed);
        } catch {
            return;
        }
        const idx: number = this.entries.findIndex((e: MergeCellEntry): boolean => formatA1Range(e.range) === key);
        if (idx < 0) {
            return;
        }
        this.entries.splice(idx, 1);
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * clear method.
     *
     * @returns {void} - Returns the result.
     */
    public clear(): void {
        if (this.entries.length === 0) {
            return;
        }
        this.entries.length = 0;
        if (this.host != null) {
            this.host.markDirty();
        }
    }

    /**
     * Replace contents from parse (does not mark dirty).
     *
     * @param {Object} entries - The entries parameter.
     * @returns {void} - Returns the result.
     */
    public replaceFromParse(entries: ReadonlyArray<MergeCellEntry>): void {
        this.entries.length = 0;
        for (const e of entries) {
            this.entries.push({
                range: { ...e.range },
                extraAttrsXml: e.extraAttrsXml
            });
        }
    }

    /**
     * Snapshot for serialize.
     *
     * @returns {Object} - Returns the result.
     */
    public toEntries(): ReadonlyArray<MergeCellEntry> {
        return this.entries.map((e: MergeCellEntry): any => ({
            range: { ...e.range },
            extraAttrsXml: e.extraAttrsXml
        }));
    }
}

/**
 * Axis-aligned bounding box overlap (inclusive edges). Touching edges count as overlap (Excel merges share boundary cells).
 *
 * @param {MergeRange} a - The a parameter.
 * @param {MergeRange} b - The b parameter.
 * @returns {boolean} - Returns the result.
 */
export function rangesOverlap(a: MergeRange, b: MergeRange): boolean {
    if (a.endRow < b.startRow || b.endRow < a.startRow) {
        return false;
    }
    if (a.endCol < b.startCol || b.endCol < a.startCol) {
        return false;
    }
    return true;
}

/**
 * Normalize a user/file ref to compact uppercase A1 key.
 *
 * @param {string} ref - The ref parameter.
 * @returns {string} - Returns the result.
 */
export function normalizeMergeRefKey(ref: string): string {
    const trimmed: string = ref.trim();
    if (trimmed.length === 0) {
        throw new InvalidArgumentError('Merge ref must be a non-empty string');
    }
    return formatA1Range(parseA1Range(trimmed));
}

/**
 * CT_Worksheet local names that appear **before** `mergeCells` after `sheetData`
 * (schema sequence order).
 *
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const MERGE_CELLS_PREDECESSORS_AFTER_SHEET_DATA: ReadonlyArray<string> = [
    'sheetCalcPr',
    'sheetProtection',
    'protectedRanges',
    'scenarios',
    'autoFilter',
    'sortState',
    'dataConsolidate',
    'customSheetViews'
];

/**
 * CT_Worksheet local names that appear **after** `mergeCells`.
 *
 * Citation: transitional sml.xsd `CT_Worksheet`.
 */
export const MERGE_CELLS_SUCCESSORS: ReadonlyArray<string> = [
    'phoneticPr',
    'conditionalFormatting',
    'dataValidations',
    'hyperlinks',
    'printOptions',
    'pageMargins',
    'pageSetup',
    'headerFooter',
    'rowBreaks',
    'colBreaks',
    'customProperties',
    'cellWatches',
    'ignoredErrors',
    'smartTags',
    'drawing',
    'legacyDrawing',
    'legacyDrawingHF',
    'drawingHF',
    'picture',
    'oleObjects',
    'controls',
    'webPublishItems',
    'tableParts',
    'extLst'
];

const PREDECESSOR_SET: ReadonlySet<string> = new Set(MERGE_CELLS_PREDECESSORS_AFTER_SHEET_DATA);
const SUCCESSOR_SET: ReadonlySet<string> = new Set(MERGE_CELLS_SUCCESSORS);

/**
 * Index at which to insert serialized `mergeCells` among after-sheetData siblings. Prefer: after the last known predecessor present; else before the first known successor; else append. Unknown elements keep relative order.
 *
 * @param {string} afterSheetDataLocals - The afterSheetDataLocals parameter.
 * @returns {number} - Returns the result.
 */
export function findMergeCellsInsertIndex(afterSheetDataLocals: ReadonlyArray<string>): number {
    let lastPred: number = -1;
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && PREDECESSOR_SET.has(name)) {
            lastPred = i;
        }
    }
    if (lastPred >= 0) {
        return lastPred + 1;
    }
    for (let i: number = 0; i < afterSheetDataLocals.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const name: string = afterSheetDataLocals[i];
        if (name !== undefined && SUCCESSOR_SET.has(name)) {
            return i;
        }
    }
    return afterSheetDataLocals.length;
}

/**
 * Parse `mergeCells` element XML into ordered entries. Soft-skips individual bad `mergeCell@ref` values (keep valid siblings).
 *
 * @param {string} mergeCellsXml - The mergeCellsXml parameter.
 * @returns {MergeCellEntry[]} - Returns the result.
 */
export function parseMergeCellsXml(mergeCellsXml: string): MergeCellEntry[] {
    const inner: string = elementInnerLocal(mergeCellsXml);
    const children: string[] = splitTopLevelLocal(inner);
    const out: MergeCellEntry[] = [];
    for (const child of children) {
        if (elementLocalNameLocal(child) !== 'mergeCell') {
            continue;
        }
        const attrs: Map<string, string> = parseAttrMap(elementOpenAttrsLocal(child));
        const ref: string = attrs.get('ref');
        if (ref === undefined || ref.trim().length === 0) {
            continue;
        }
        let range: MergeRange;
        try {
            range = parseA1Range(ref);
        } catch {
            continue;
        }
        const extra: string = attrsToXmlExcluding(attrs, new Set(['ref']));
        out.push({ range, extraAttrsXml: extra });
    }
    return out;
}

/**
 * Serialize merge entries to a `mergeCells` element, or `undefined` when empty.
 *
 * @param {Object} entries - The entries parameter.
 * @returns {string} - Returns the result.
 */
export function serializeMergeCellsXml(entries: ReadonlyArray<MergeCellEntry>): string | undefined {
    if (entries.length === 0) {
        return undefined;
    }
    const parts: string[] = [`<mergeCells count="${entries.length}">`];
    for (const e of entries) {
        const ref: string = formatA1Range(e.range);
        const extra: string = e.extraAttrsXml.trim().length > 0 ? ` ${e.extraAttrsXml.trim()}` : '';
        parts.push(`<mergeCell ref="${escapeXml(ref)}"${extra}/>`);
    }
    parts.push('</mergeCells>');
    return parts.join('');
}

/* ── minimal local XML helpers (mirror worksheet-xml style, keep module free of cycles) ── */

/**
 * elementLocalNameLocal function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementLocalNameLocal(el: string): string {
    // eslint-disable-next-line security/detect-unsafe-regex -- fixed OOXML/token grammar literal
    const m: RegExpExecArray = /^<([A-Za-z_][\w.-]*:)?([A-Za-z_][\w.-]*)/.exec(el.trim());
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[2]);
}

/**
 * elementOpenAttrsLocal function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementOpenAttrsLocal(el: string): string {
    const trimmed: string = el.trim();
    const m: RegExpExecArray = /^<[^>\s]+\s([^>]*?)\/?>/.exec(trimmed);
    return ((__t: string): string => (__t != null ? __t : ''))(m == null ? undefined : m[1]);
}

/**
 * findTagEndLocal function.
 *
 * @param {string} s - The s parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findTagEndLocal(s: string, from: number): number {
    let inQuote: '"' | '\'' | null = null;
    for (let i: number = from; i < s.length; i += 1) {
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const ch: string = s[i];
        if (inQuote !== null) {
            if (ch === inQuote) {
                inQuote = null;
            }
            continue;
        }
        if (ch === '"' || ch === '\'') {
            inQuote = ch;
            continue;
        }
        if (ch === '>') {
            return i;
        }
    }
    return -1;
}

/**
 * findClosingLocal function.
 *
 * @param {string} s - The s parameter.
 * @param {string} localName - The localName parameter.
 * @param {number} from - The from parameter.
 * @returns {number} - Returns the result.
 */
function findClosingLocal(s: string, localName: string, from: number): number {
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const openPat: RegExp = new RegExp(`<([A-Za-z_][\\w.-]*:)?${escapeRegExpLocal(localName)}(?=[\\s>/])`, 'g');
    // eslint-disable-next-line security/detect-non-literal-regexp -- RegExp built from escapeRegExp(localName) only
    const closePat: RegExp = new RegExp(`</([A-Za-z_][\\w.-]*:)?${escapeRegExpLocal(localName)}\\s*>`, 'g');
    let depth: number = 1;
    let i: number = from;
    while (i < s.length && depth > 0) {
        openPat.lastIndex = i;
        closePat.lastIndex = i;
        const om: RegExpExecArray = openPat.exec(s);
        const cm: RegExpExecArray = closePat.exec(s);
        if (cm === null) {
            return -1;
        }
        if (om !== null && om.index < cm.index) {
            const tagEnd: number = findTagEndLocal(s, om.index);
            if (tagEnd >= 0) {
                const tag: string = s.slice(om.index, tagEnd + 1);
                if (!/\/\s*>$/.test(tag)) {
                    depth += 1;
                }
                i = tagEnd + 1;
                continue;
            }
        }
        depth -= 1;
        if (depth === 0) {
            return cm.index + cm[0].length;
        }
        i = cm.index + cm[0].length;
    }
    return -1;
}

/**
 * elementInnerLocal function.
 *
 * @param {string} el - The el parameter.
 * @returns {string} - Returns the result.
 */
function elementInnerLocal(el: string): string {
    const trimmed: string = el.trim();
    if (/\/>$/.test(trimmed)) {
        return '';
    }
    const openEnd: number = findTagEndLocal(trimmed, 0);
    if (openEnd < 0) {
        return '';
    }
    const closeStart: number = trimmed.lastIndexOf('</');
    if (closeStart < 0 || closeStart <= openEnd) {
        return '';
    }
    return trimmed.slice(openEnd + 1, closeStart);
}

/**
 * splitTopLevelLocal function.
 *
 * @param {string} s - The s parameter.
 * @returns {string[]} - Returns the result.
 */
function splitTopLevelLocal(s: string): string[] {
    const result: string[] = [];
    let i: number = 0;
    while (i < s.length) {
        const lt: number = s.indexOf('<', i);
        if (lt < 0) {
            break;
        }
        if (s.startsWith('</', lt)) {
            break;
        }
        if (s.startsWith('<?', lt) || s.startsWith('<!', lt)) {
            const endPi: number = s.indexOf('>', lt);
            i = endPi < 0 ? s.length : endPi + 1;
            continue;
        }
        const openEnd: number = findTagEndLocal(s, lt);
        if (openEnd < 0) {
            break;
        }
        const openTag: string = s.slice(lt, openEnd + 1);
        if (openTag.endsWith('/>') || /\/\s*>$/.test(openTag)) {
            result.push(s.slice(lt, openEnd + 1));
            i = openEnd + 1;
            continue;
        }
        const local: string = elementLocalNameLocal(openTag);
        const close: number = findClosingLocal(s, local, openEnd + 1);
        if (close < 0) {
            result.push(s.slice(lt).trim());
            break;
        }
        result.push(s.slice(lt, close).replace(/\s+$/, ''));
        i = close;
    }
    return result.map((x: string): string => x.trim()).filter((x: string): boolean => x.length > 0);
}

/**
 * escapeRegExpLocal function.
 *
 * @param {string} value - The value parameter.
 * @returns {string} - Returns the result.
 */
function escapeRegExpLocal(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Re-export error type name used only for docs link stability.
export { InvalidMergeRefError };
