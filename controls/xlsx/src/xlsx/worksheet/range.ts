/**
 * Rectangular range view on a worksheet (`ST_Ref`).
 *
 * L1 authoring surface for merges and intersecting hyperlinks — prefer over
 * sheet collections when working a single range. Storage still lives on the
 * worksheet.
 *
 * Citations:
 * - ECMA-376-1 §18.3.1.55 `mergeCells` / §18.3.1.56 `mergeCell`
 * - ECMA-376-1 §18.3.1.47 `hyperlink` / §18.3.1.48 `hyperlinks`
 * - transitional sml.xsd `CT_MergeCells` / `CT_MergeCell` / `ST_Ref`
 * - docs/specs/merged-cells.md; docs/specs/hyperlinks.md; docs/api/API-RULES.md
 *
 * Meaningful cell content for a merge lives in the **top-left** cell.
 * {@link Range.merge} does not move or clear covered cell values.
 */

import { formatA1Range, parseA1Range, CellRange } from '../address/cell-address';
import { InvalidArgumentError } from '../core/errors';
import { WorksheetImpl } from '../workbook/worksheet';
import { Hyperlink, Hyperlinks, HyperlinkType } from './hyperlinks';

/**
 * View over a single A1 range on a worksheet.
 *
 * Obtained via {@link Worksheet.range}. Coordinates are 1-based inclusive.
 */
export class Range {
    private readonly sheet: WorksheetImpl;
    private readonly range: CellRange;
    private readonly addressKey: string;

    /**
     * Creates an instance.
     *
     * @param {WorksheetImpl} sheet - The sheet parameter.
     * @param {CellRange} range - The range parameter.
     */
    public constructor(sheet: WorksheetImpl, range: CellRange) {
        this.sheet = sheet;
        this.range = {
            startRow: range.startRow,
            startCol: range.startCol,
            endRow: range.endRow,
            endCol: range.endCol
        };
        this.addressKey = formatA1Range(this.range);
    }

    /**
     * The worksheet implementation this range reads from.
     *
     * @returns {WorksheetImpl} The source worksheet.
     * @private
     */
    public get worksheetImpl(): WorksheetImpl {
        return this.sheet;
    }

    /**
     * Normalized compact A1 address for this range (`A1` or `A1:B2`).
     *
     * @returns {string} - Returns the result.
     */
    public get address(): string {
        return this.addressKey;
    }

    /**
     * Inclusive 1-based corners.
     *
     * @returns {CellRange} - Returns the result.
     */
    public get bounds(): CellRange {
        return {
            startRow: this.range.startRow,
            startCol: this.range.startCol,
            endRow: this.range.endRow,
            endCol: this.range.endCol
        };
    }

    /**
     * First (top) 1-based row index of this range.
     *
     * @returns {number} - Returns the result.
     */
    public get firstRow(): number {
        return this.range.startRow;
    }

    /**
     * Last (bottom) 1-based row index of this range.
     *
     * @returns {number} - Returns the result.
     */
    public get lastRow(): number {
        return this.range.endRow;
    }

    /**
     * First (left) 1-based column index of this range.
     *
     * @returns {number} - Returns the result.
     */
    public get firstColumn(): number {
        return this.range.startCol;
    }

    /**
     * Last (right) 1-based column index of this range.
     *
     * @returns {number} - Returns the result.
     */
    public get lastColumn(): number {
        return this.range.endCol;
    }

    /**
     * True when this exact normalized address is present in {@link Worksheet.merges}.
     *
     * @returns {boolean} - Returns the result.
     */
    public get isMerged(): boolean {
        return this.sheet.merges.has(this.addressKey);
    }

    /**
     * Hyperlinks whose ref intersects this range (XlsIO `Range.HyperLinks` parity). View is live against the sheet collection: `add` defaults `ref` to this range address when omitted; `remove` / `clear` / `removeAt` only affect intersecting entries. `findByCell` remains sheet-wide (same as sheet API).
     *
     * @returns {Hyperlinks} - Returns the result.
     */
    public get hyperlinks(): Hyperlinks {
        return new RangeHyperlinksView(this.sheet, this.range, this.addressKey);
    }

    /**
     * Add this range to the sheet merge collection. Idempotent for the exact same normalized address. Overlaps throw {@link MergeOverlapError} via {@link MergedCells.add}. Content rule: keep visible values/styles on the **top-left** cell; this method does not move or clear covered cells.
     *
     * @returns {void} - Returns the result.
     */
    public merge(): void {
        this.sheet.merges.add(this.addressKey);
    }

    /**
     * Remove this exact normalized address from the sheet merge collection. No-op when absent.
     *
     * @returns {void} - Returns the result.
     */
    public unmerge(): void {
        this.sheet.merges.remove(this.addressKey);
    }
}

/**
 * Build a {@link Range} from an A1 ref on `sheet`.
 *
 * @param {WorksheetImpl} sheet - The sheet parameter.
 * @param {string} ref - The ref parameter.
 * @returns {Range} - Returns the result.
 */
export function createRangeFromRef(sheet: WorksheetImpl, ref: string): Range {
    const range: CellRange = parseA1Range(ref);
    return new Range(sheet, range);
}

/**
 * Live Hyperlinks view scoped to links intersecting a range.
 * Storage remains on the worksheet collection.
 */
class RangeHyperlinksView implements Hyperlinks {
    private readonly sheet: WorksheetImpl;
    private readonly range: CellRange;
    private readonly addressKey: string;

    /**
     * Creates an instance.
     *
     * @param {WorksheetImpl} sheet - The sheet parameter.
     * @param {CellRange} range - The range parameter.
     * @param {string} addressKey - The addressKey parameter.
     */
    public constructor(sheet: WorksheetImpl, range: CellRange, addressKey: string) {
        this.sheet = sheet;
        this.range = range;
        this.addressKey = addressKey;
    }

    /**
     * Gets count.
     *
     * @returns {number} - Returns the result.
     */
    public get count(): number {
        return this.sheet.hyperlinksImpl.findIntersecting(this.range).length;
    }

    /**
     * list method.
     *
     * @returns {Object} - Returns the result.
     */
    public list(): ReadonlyArray<Hyperlink> {
        return this.sheet.hyperlinksImpl.findIntersecting(this.range);
    }

    /**
     * get method.
     *
     * @param {number} index - The index parameter.
     * @returns {Hyperlink} - Returns the result.
     */
    public get(index: number): Hyperlink {
        const items: ReadonlyArray<Hyperlink> = this.list();
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const link: Hyperlink = items[index];
        if (!Number.isInteger(index) || index < 0 || link === undefined) {
            throw new InvalidArgumentError(`Hyperlink index ${String(index)} is out of range`);
        }
        return link;
    }

    /**
     * add method.
     *
     * @param {string} ref - The ref parameter.
     * @param {string} target - The target parameter.
     * @param {string} displayText - The displayText parameter.
     * @param {string} tooltip - The tooltip parameter.
     * @param {HyperlinkType} type - The type parameter.
     * @param {string} subAddress - The subAddress parameter.
     * @returns {Hyperlink} - Returns the result.
     */
    public add(ref: string, target: string, displayText?: string, tooltip?: string, type?: HyperlinkType, subAddress?: string): Hyperlink {
        const resolvedRef: string = typeof ref === 'string' && ref.trim().length > 0 ? ref : this.addressKey;
        return this.sheet.hyperlinks.add(
            resolvedRef,
            target,
            displayText, tooltip, type, subAddress);
    }

    /**
     * removeAt method.
     *
     * @param {number} index - The index parameter.
     * @returns {void} - Returns the result.
     */
    public removeAt(index: number): void {
        const items: ReadonlyArray<Hyperlink> = this.list();
        // eslint-disable-next-line security/detect-object-injection -- library-owned record/map access with validated keys
        const link: Hyperlink = items[index];
        if (!Number.isInteger(index) || index < 0 || link === undefined) {
            throw new InvalidArgumentError(`Hyperlink index ${String(index)} is out of range`);
        }
        this.sheet.hyperlinks.remove(link);
    }

    /**
     * remove method.
     *
     * @param {Hyperlink} link - The link parameter.
     * @returns {void} - Returns the result.
     */
    public remove(link: Hyperlink): void {
        this.sheet.hyperlinks.remove(link);
    }

    /**
     * clear method.
     *
     * @returns {void} - Returns the result.
     */
    public clear(): void {
        this.sheet.hyperlinksImpl.removeIntersecting(this.range);
    }

    /**
     * findByCell method.
     *
     * @param {string} address - The address parameter.
     * @returns {Object} - Returns the result.
     */
    public findByCell(address: string): ReadonlyArray<Hyperlink> {
        return this.sheet.hyperlinks.findByCell(address);
    }
}
