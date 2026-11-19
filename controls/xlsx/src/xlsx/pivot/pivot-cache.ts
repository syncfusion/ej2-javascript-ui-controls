/**
 * Pivot cache collection (`workbook.pivotCaches`).
 *
 * A cache records which worksheet block feeds a pivot table and the source
 * headings. Package parts (`pivotCacheDefinitionN.xml`,
 * `pivotCacheRecordsN.xml`) are written at save time by the pivot store
 * (API-RULES R5.1: side effects deferred to `save()`).
 *
 * Citations: ECMA-376-1 §18.10.1.67 `pivotCacheDefinition`; transitional
 * `sml.xsd` `CT_PivotCacheDefinition`, `CT_CacheSource`, `CT_WorksheetSource`;
 * `docs/specs/pivot-tables.md`.
 *
 * @private
 */

import { formatA1Range } from '../address/cell-address';
import { CellRange } from '../address/cell-address';
import { InvalidArgumentError, InvalidPivotTableError } from '../core/errors';
import { WorksheetImpl } from '../workbook/worksheet';
import { Range } from '../worksheet/range';
import { PivotCache, PivotCaches } from './pivot-types';
import { classifyPivotValue, readCacheSnapshot } from './pivot-snapshot';
import { PivotCacheSnapshot, PivotItem } from './pivot-snapshot';

/** Excel's field limit. */
const MAX_FIELDS: number = 16384;

/**
 * Quote a sheet name for display in `Sheet!A1:B2` when needed.
 *
 * @param {string} name - Worksheet name.
 * @returns {string} The name, single-quoted when it has special characters.
 * @private
 */
export function quoteSheetName(name: string): string {
    return /^[A-Za-z_][A-Za-z0-9_.]*$/.test(name) ? name : `'${name.replace(/'/g, "''")}'`;
}

/**
 * Convert a heading cell value to a field name.
 *
 * @param {unknown} value - The heading cell value.
 * @returns {string} The heading text; empty when blank.
 */
function headingText(value: unknown): string {
    const item = classifyPivotValue(value);
    switch (item.kind) {
    case 'string':
        return item.value;
    case 'number':
        return String(item.value);
    case 'boolean':
        return item.value ? 'TRUE' : 'FALSE';
    case 'error':
        return item.value;
    default:
        return '';
    }
}

/**
 * Package state of a cache read from a file.
 *
 * @private
 */
export interface LoadedCacheState {
    readonly refreshOnOpen: boolean;
    readonly cacheId: number;
    readonly definitionPartName: string;
    readonly recordsPartName: string;
    readonly workbookRelId: string;
    /** `worksheetSource@sheet` as the file spells it. */
    readonly sheetName: string;
    /** Listed shared items per cache field; `undefined` where a field lists none. */
    readonly sharedItems: ReadonlyArray<ReadonlyArray<PivotItem> | undefined>;
}

/**
 * One pivot cache, authored or read from a file.
 *
 * @private
 */
export class PivotCacheImpl implements PivotCache {
    /** Source worksheet. */
    public readonly sheet: WorksheetImpl;
    /** Source block (1-based, inclusive), headings in the first row. */
    public readonly bounds: CellRange;
    public readonly fieldNames: ReadonlyArray<string>;
    /** True when the cache was read from a file rather than authored. */
    public readonly adopted: boolean;
    /** True once an adopted cache's own settings were edited. */
    public modified: boolean = false;
    /** True when a pivot table the model cannot describe, or an unreadable one, still reads from this cache. */
    public pinned: boolean = false;
    /** Number of adopted tables that were built over this cache. */
    public adoptedTables: number = 0;
    /** Loaded package state; present for adopted caches. */
    public readonly loaded: LoadedCacheState | undefined;
    private _refreshOnOpen: boolean = true;

    /** Collection that created this cache (ownership check). */
    public readonly owner: PivotCachesImpl;

    /** Package bookkeeping, owned by the pivot store. */
    public cacheId: number | undefined;
    public definitionPartName: string | undefined;
    public recordsPartName: string | undefined;
    public workbookRelId: string | undefined;

    /**
     * Creates a cache.
     *
     * @param {PivotCachesImpl} owner - Owning collection.
     * @param {WorksheetImpl} sheet - Source worksheet.
     * @param {CellRange} bounds - Source block.
     * @param {ReadonlyArray<string>} fieldNames - Source headings.
     * @param {LoadedCacheState} [loaded] - Package state when the cache came from a file.
     */
    public constructor(
        owner: PivotCachesImpl,
        sheet: WorksheetImpl,
        bounds: CellRange,
        fieldNames: ReadonlyArray<string>,
        loaded?: LoadedCacheState,
    ) {
        this.owner = owner;
        this.sheet = sheet;
        this.bounds = bounds;
        this.fieldNames = fieldNames;
        this.adopted = loaded !== undefined;
        this.loaded = loaded;
        if (loaded !== undefined) {
            this._refreshOnOpen = loaded.refreshOnOpen;
            this.cacheId = loaded.cacheId;
            this.definitionPartName = loaded.definitionPartName;
            this.recordsPartName = loaded.recordsPartName;
            this.workbookRelId = loaded.workbookRelId;
        }
    }

    /** @returns {boolean} Whether Excel rebuilds the tables on open. */
    public get refreshOnOpen(): boolean {
        return this._refreshOnOpen;
    }

    /** @param {boolean} value - Rebuild on open. */
    public set refreshOnOpen(value: boolean) {
        this._refreshOnOpen = value === true;
        this.modified = true;
        this.owner.touch();
    }

    /**
     * Set the flag without recording an edit (the store forces a rebuild when
     * it rewrites a cache read from a file).
     *
     * @param {boolean} value - Rebuild on open.
     */
    public assignRefreshOnLoad(value: boolean): void {
        this._refreshOnOpen = value;
    }

    /**
     * Source as `Sheet!A1:D10`.
     *
     * @returns {string} The display source.
     */
    public get source(): string {
        return `${quoteSheetName(this.sheet.name)}!${formatA1Range(this.bounds)}`;
    }

    /**
     * Read the source data now.
     *
     * @returns {PivotCacheSnapshot} The snapshot.
     */
    public snapshot(): PivotCacheSnapshot {
        return readCacheSnapshot(this.sheet, this.bounds, this.fieldNames, this.loaded === undefined ? undefined : this.loaded.sharedItems);
    }
}

/**
 * Host surface the workbook provides to the caches collection.
 *
 * @private
 */
export interface PivotCachesHost {
    markDirty(): void;
    /** True when the worksheet is still part of the workbook. */
    containsSheet(sheet: WorksheetImpl): boolean;
}

/**
 * Workbook-level collection of authored pivot caches.
 *
 * @private
 */
export class PivotCachesImpl implements PivotCaches {
    private readonly host: PivotCachesHost;
    private readonly entries: PivotCacheImpl[] = [];

    /**
     * Creates the collection.
     *
     * @param {PivotCachesHost} host - Workbook host.
     */
    public constructor(host: PivotCachesHost) {
        this.host = host;
    }

    /**
     * The number of caches.
     *
     * @returns {number} Count.
     */
    public get count(): number {
        return this.entries.length;
    }

    /**
     * All caches in creation order.
     *
     * @returns {ReadonlyArray<PivotCache>} Snapshot list.
     */
    public list(): ReadonlyArray<PivotCache> {
        return this.entries.slice();
    }

    /**
     * Internal typed list.
     *
     * @returns {ReadonlyArray<PivotCacheImpl>} Live entries.
     */
    public internalEntries(): ReadonlyArray<PivotCacheImpl> {
        return this.entries;
    }

    /**
     * Cache at a zero-based position.
     *
     * @param {number} index - Position.
     * @returns {PivotCache} The cache.
     */
    public get(index: number): PivotCache {
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new InvalidArgumentError(
                `Pivot cache index ${String(index)} is out of range (0..${this.entries.length - 1})`,
            );
        }
        return this.entries[index];
    }

    /** Record a mutation. */
    public touch(): void {
        this.host.markDirty();
    }

    /**
     * Register a cache read from a file (no edit is recorded).
     *
     * @param {PivotCacheImpl} cache - The adopted cache.
     */
    public register(cache: PivotCacheImpl): void {
        this.entries.push(cache);
    }

    /**
     * Drop a cache whose parts were removed.
     *
     * @param {PivotCacheImpl} cache - The cache.
     */
    public discard(cache: PivotCacheImpl): void {
        const at: number = this.entries.indexOf(cache);
        if (at >= 0) {
            this.entries.splice(at, 1);
        }
    }

    /**
     * True when `cache` was created by this collection.
     *
     * @param {PivotCache} cache - Candidate.
     * @returns {boolean} Ownership.
     */
    public owns(cache: PivotCache): boolean {
        return cache instanceof PivotCacheImpl && cache.owner === this;
    }

    /**
     * True when the cache's source sheet is still in the workbook.
     *
     * @param {PivotCacheImpl} cache - The cache.
     * @returns {boolean} Whether the source is still reachable.
     */
    public sourceIsLive(cache: PivotCacheImpl): boolean {
        return this.host.containsSheet(cache.sheet);
    }

    /**
     * Create a cache over a source range (headings first).
     *
     * @param {Range} source - Source range.
     * @returns {PivotCache} The new cache.
     */
    public add(source: Range): PivotCache {
        if (source === null || source === undefined || typeof source.bounds !== 'object') {
            throw new InvalidArgumentError('pivotCaches.add requires a source Range such as sheet.range("A1:D10")');
        }
        const sheet: WorksheetImpl = source.worksheetImpl;
        if (!this.host.containsSheet(sheet)) {
            throw new InvalidPivotTableError('Pivot cache source range belongs to a worksheet outside this workbook');
        }
        const bounds: CellRange = source.bounds;
        if (bounds.endRow - bounds.startRow < 1) {
            throw new InvalidPivotTableError(
                `Pivot cache source "${source.address}" needs a heading row and at least one data row`,
            );
        }
        const width: number = bounds.endCol - bounds.startCol + 1;
        if (width > MAX_FIELDS) {
            throw new InvalidPivotTableError(`Pivot cache source "${source.address}" has more than ${MAX_FIELDS} columns`);
        }
        const names: string[] = [];
        const seen: Set<string> = new Set<string>();
        for (let c: number = bounds.startCol; c <= bounds.endCol; c++) {
            const name: string = headingText(sheet.cell(bounds.startRow, c).value);
            if (name.trim().length === 0) {
                throw new InvalidPivotTableError(
                    `Pivot cache source "${source.address}" has a blank heading in column ${c - bounds.startCol + 1}; every column needs a heading`,
                );
            }
            const key: string = name.toLowerCase();
            if (seen.has(key)) {
                throw new InvalidPivotTableError(
                    `Pivot cache source "${source.address}" has more than one column headed "${name}"; headings must be unique`,
                );
            }
            seen.add(key);
            names.push(name);
        }
        const cache: PivotCacheImpl = new PivotCacheImpl(this, sheet, {
            startRow: bounds.startRow,
            startCol: bounds.startCol,
            endRow: bounds.endRow,
            endCol: bounds.endCol,
        }, names);
        this.entries.push(cache);
        this.host.markDirty();
        return cache;
    }
}
