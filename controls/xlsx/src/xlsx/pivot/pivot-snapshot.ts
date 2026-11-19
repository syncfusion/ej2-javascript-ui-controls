/**
 * Point-in-time read of a pivot cache's source data.
 *
 * The snapshot is taken when the workbook is saved, never when the cache is
 * created, so cells written after `pivotCaches.add(...)` are included. Values
 * are classified the way `CT_SharedItems` / `CT_Record` classify them
 * (`m` missing, `n` number, `s` string, `b` boolean, `e` error).
 *
 * Citations: transitional `sml.xsd` `CT_SharedItems`, `CT_Record`;
 * `docs/specs/pivot-tables.md`.
 *
 * @private
 */

import { CellRange } from '../address/cell-address';
import { isCellError } from '../cell/types';
import { WorksheetImpl } from '../workbook/worksheet';

/**
 * One classified source value.
 *
 * @private
 */
export type PivotItem =
    | { readonly kind: 'blank' }
    | { readonly kind: 'number'; readonly value: number }
    | { readonly kind: 'string'; readonly value: string }
    | { readonly kind: 'boolean'; readonly value: boolean }
    | { readonly kind: 'error'; readonly value: string };

/**
 * One source column: its values per record and its distinct items.
 *
 * @private
 */
export interface PivotColumnSnapshot {
    readonly name: string;
    /** Distinct items in first-seen order (the `sharedItems` order). */
    readonly items: ReadonlyArray<PivotItem>;
    /** Per record, the index into {@link items}. */
    readonly recordItem: ReadonlyArray<number>;
    /** Item indices in Excel's default ascending display order. */
    readonly sortedItemIndices: ReadonlyArray<number>;
    readonly hasNumber: boolean;
    readonly hasString: boolean;
    readonly hasBoolean: boolean;
    readonly hasError: boolean;
    readonly hasBlank: boolean;
    readonly allIntegers: boolean;
    readonly minValue: number | undefined;
    readonly maxValue: number | undefined;
}

/**
 * Source data of one cache.
 *
 * @private
 */
export interface PivotCacheSnapshot {
    readonly recordCount: number;
    readonly columns: ReadonlyArray<PivotColumnSnapshot>;
}

const KIND_RANK: { readonly [kind: string]: number } = {
    number: 0,
    string: 1,
    boolean: 2,
    error: 3,
    blank: 4,
};

/**
 * Classify a cell value.
 *
 * @param {unknown} value - Cell value (`null`, number, string, boolean, or error).
 * @returns {PivotItem} The classified item.
 * @private
 */
export function classifyPivotValue(value: unknown): PivotItem {
    if (value === null || value === undefined) {
        return { kind: 'blank' };
    }
    if (typeof value === 'number') {
        return Number.isFinite(value) ? { kind: 'number', value } : { kind: 'blank' };
    }
    if (typeof value === 'boolean') {
        return { kind: 'boolean', value };
    }
    if (typeof value === 'string') {
        return value.length === 0 ? { kind: 'blank' } : { kind: 'string', value };
    }
    if (isCellError(value)) {
        return { kind: 'error', value: value.code };
    }
    return { kind: 'blank' };
}

/**
 * Identity of an item for grouping (case-insensitive for text).
 *
 * @param {PivotItem} item - The item.
 * @returns {string} Grouping key.
 * @private
 */
export function itemKey(item: PivotItem): string {
    switch (item.kind) {
    case 'blank':
        return 'm';
    case 'number':
        return `n:${String(item.value)}`;
    case 'string':
        // Excel groups items case-insensitively.
        return `s:${item.value.toLowerCase()}`;
    case 'boolean':
        return item.value ? 'b:1' : 'b:0';
    default:
        return `e:${item.value}`;
    }
}

/**
 * Compare items in Excel's default ascending order: numbers, text (case
 * insensitive), logicals, errors, then blank.
 *
 * @param {PivotItem} a - First item.
 * @param {PivotItem} b - Second item.
 * @returns {number} Negative, zero, or positive.
 * @private
 */
export function comparePivotItems(a: PivotItem, b: PivotItem): number {
    const rankA: number = KIND_RANK[a.kind];
    const rankB: number = KIND_RANK[b.kind];
    if (rankA !== rankB) {
        return rankA - rankB;
    }
    if (a.kind === 'number' && b.kind === 'number') {
        return a.value - b.value;
    }
    if (a.kind === 'string' && b.kind === 'string') {
        const la: string = a.value.toLowerCase();
        const lb: string = b.value.toLowerCase();
        return la < lb ? -1 : la > lb ? 1 : 0;
    }
    if (a.kind === 'boolean' && b.kind === 'boolean') {
        return (a.value ? 1 : 0) - (b.value ? 1 : 0);
    }
    if (a.kind === 'error' && b.kind === 'error') {
        return a.value < b.value ? -1 : a.value > b.value ? 1 : 0;
    }
    return 0;
}

/**
 * Build a column snapshot from per-record items.
 *
 * @param {string} name - Field name.
 * @param {ReadonlyArray<PivotItem>} values - One item per record.
 * @param {ReadonlyArray<PivotItem>} [seed] - Items a file already lists, kept first and in order so existing item indices stay valid.
 * @returns {PivotColumnSnapshot} The column snapshot.
 * @private
 */
export function buildColumnSnapshot(
    name: string,
    values: ReadonlyArray<PivotItem>,
    seed?: ReadonlyArray<PivotItem>,
): PivotColumnSnapshot {
    const items: PivotItem[] = [];
    const indexByKey: Map<string, number> = new Map<string, number>();
    const recordItem: number[] = [];
    let hasNumber: boolean = false;
    let hasString: boolean = false;
    let hasBoolean: boolean = false;
    let hasError: boolean = false;
    let hasBlank: boolean = false;
    let allIntegers: boolean = true;
    let minValue: number | undefined;
    let maxValue: number | undefined;
    const note = (item: PivotItem): void => {
        switch (item.kind) {
        case 'number':
            hasNumber = true;
            if (Math.floor(item.value) !== item.value) {
                allIntegers = false;
            }
            if (minValue === undefined || item.value < minValue) {
                minValue = item.value;
            }
            if (maxValue === undefined || item.value > maxValue) {
                maxValue = item.value;
            }
            break;
        case 'string':
            hasString = true;
            break;
        case 'boolean':
            hasBoolean = true;
            break;
        case 'error':
            hasError = true;
            break;
        default:
            hasBlank = true;
        }
    };
    const intern = (item: PivotItem): number => {
        const key: string = itemKey(item);
        let index: number | undefined = indexByKey.get(key);
        if (index === undefined) {
            index = items.length;
            items.push(item);
            indexByKey.set(key, index);
            note(item);
        }
        return index;
    };
    if (seed !== undefined) {
        for (const item of seed) {
            intern(item);
        }
    }
    for (const item of values) {
        recordItem.push(intern(item));
    }
    const sortedItemIndices: number[] = items.map((_item: PivotItem, i: number): number => i);
    sortedItemIndices.sort((x: number, y: number): number => {
        const c: number = comparePivotItems(items[x], items[y]);
        return c !== 0 ? c : x - y;
    });
    return {
        name,
        items,
        recordItem,
        sortedItemIndices,
        hasNumber,
        hasString,
        hasBoolean,
        hasError,
        hasBlank,
        allIntegers,
        minValue,
        maxValue,
    };
}

/**
 * Read a source block into a snapshot. The first row holds headings and is
 * skipped; every other row is a record.
 *
 * @param {WorksheetImpl} sheet - Source worksheet.
 * @param {CellRange} bounds - Source block, headings first.
 * @param {ReadonlyArray<string>} fieldNames - Field names, one per column.
 * @param {ReadonlyArray<ReadonlyArray<PivotItem> | undefined>} [seeds] - Items a file already lists, per column.
 * @returns {PivotCacheSnapshot} The snapshot.
 * @private
 */
export function readCacheSnapshot(
    sheet: WorksheetImpl,
    bounds: CellRange,
    fieldNames: ReadonlyArray<string>,
    seeds?: ReadonlyArray<ReadonlyArray<PivotItem> | undefined>,
): PivotCacheSnapshot {
    const columns: PivotColumnSnapshot[] = [];
    const recordCount: number = bounds.endRow - bounds.startRow;
    for (let c: number = 0; c < fieldNames.length; c++) {
        const values: PivotItem[] = [];
        for (let r: number = bounds.startRow + 1; r <= bounds.endRow; r++) {
            values.push(classifyPivotValue(sheet.cell(r, bounds.startCol + c).value));
        }
        columns.push(buildColumnSnapshot(fieldNames[c], values, seeds === undefined ? undefined : seeds[c]));
    }
    return { recordCount, columns };
}
