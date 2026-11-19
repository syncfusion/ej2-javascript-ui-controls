/**
 * Pivot table model: fields, axes, data fields, options, and the worksheet
 * collection (`worksheet.pivotTables`).
 *
 * The model is a pure in-memory description. The pivot store serializes it
 * into `pivotTableN.xml` / cache parts at save time.
 *
 * Citations: ECMA-376-1 §18.10.1.73 `pivotTableDefinition`; transitional
 * `sml.xsd` `CT_pivotTableDefinition`, `CT_PivotField`, `CT_DataField`,
 * `CT_PivotTableStyle`; `docs/specs/pivot-tables.md`.
 *
 * @private
 */

import { formatA1, parseA1, parseA1Range } from '../address/cell-address';
import { InvalidArgumentError, InvalidPivotTableError } from '../core/errors';
import { PivotCacheImpl } from './pivot-cache';
import { PivotCachesImpl } from './pivot-cache';
import {
    PivotAxis,
    PivotAxisFields,
    PivotBuiltInStyle,
    PivotCache,
    PivotDataField,
    PivotDataFieldOptions,
    PivotDataFields,
    PivotField,
    PivotFieldSubtotal,
    PivotFields,
    PivotFunction,
    PivotLayout,
    PivotSortOrder,
    PivotTable,
    PivotTableAddOptions,
    PivotTableOptions,
    PivotTables,
} from './pivot-types';

const FUNCTIONS: ReadonlyArray<PivotFunction> = [
    'sum', 'count', 'average', 'max', 'min', 'product', 'countNumbers', 'standardDeviation', 'populationStandardDeviation', 'variance', 'populationVariance',
];

const FUNCTION_LABELS: { readonly [fn: string]: string } = {
    sum: 'Sum',
    count: 'Count',
    average: 'Average',
    max: 'Max',
    min: 'Min',
    product: 'Product',
    countNumbers: 'Count Numbers',
    standardDeviation: 'StdDev',
    populationStandardDeviation: 'StdDevp',
    var: 'Var',
    populationVariance: 'Varp',
};

const SORT_ORDERS: ReadonlyArray<PivotSortOrder> = ['manual', 'ascending', 'descending'];
const LAYOUTS: ReadonlyArray<PivotLayout> = ['compact', 'outline', 'tabular'];
const AXES: ReadonlyArray<PivotAxis> = ['none', 'row', 'column', 'filter'];

const BUILT_IN_STYLES: ReadonlyArray<string> = ((): string[] => {
    const names: string[] = ['none'];
    for (const kind of ['Light', 'Medium', 'Dark']) {
        for (let i: number = 1; i <= 28; i++) {
            names.push(`PivotStyle${kind}${i}`);
        }
    }
    return names;
})();

const MAX_NAME_LENGTH: number = 255;

/**
 * True when `value` is a built-in pivot style name (or `'none'`).
 *
 * @param {string} value - Candidate.
 * @returns {boolean} Whether it is a built-in style.
 * @private
 */
export function isBuiltInPivotStyle(value: string): value is PivotBuiltInStyle {
    return BUILT_IN_STYLES.indexOf(value) >= 0;
}

/**
 * What a loaded `pivotField` looked like, to tell what an edit changed. The
 * markup itself is re-read from the package part when the table is rewritten.
 *
 * @private
 */
export interface LoadedField {
    readonly axis: PivotAxis;
    readonly caption: string | undefined;
    readonly subtotals: ReadonlyArray<PivotFieldSubtotal>;
    readonly sortOrder: PivotSortOrder;
    readonly showItemsWithoutData: boolean;
    readonly numberFormat: string | undefined;
    readonly isData: boolean;
}

/**
 * What a loaded `dataField` looked like.
 *
 * @private
 */
export interface LoadedDataField {
    /** Position of the element among the original `dataFields` children. */
    readonly index: number;
    readonly name: string;
    readonly function: PivotFunction;
    readonly numberFormat: string | undefined;
}

/**
 * What a loaded `pivotTableDefinition` looked like.
 *
 * @private
 */
export interface LoadedTable {
    /** The part text as read, the base every rewrite patches. */
    readonly originalXml: string;
    readonly layout: PivotLayout;
    /** Where the pseudo field `x="-2"` (the values) sat in `rowFields` / `colFields`. */
    readonly valuesAxis: 'row' | 'column' | undefined;
    readonly valuesPosition: number;
}

/**
 * True when `value` is a pivot function name.
 *
 * @param {unknown} value - Candidate.
 * @returns {boolean} Whether it is a known function.
 * @private
 */
export function isPivotFunction(value: unknown): value is PivotFunction {
    return typeof value === 'string' && FUNCTIONS.indexOf(value as PivotFunction) >= 0;
}

function requireText(value: unknown, what: string): string {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new InvalidPivotTableError(`${what} must be a non-blank string`);
    }
    if (value.length > MAX_NAME_LENGTH) {
        throw new InvalidPivotTableError(`${what} must be at most ${MAX_NAME_LENGTH} characters`);
    }
    return value;
}

/**
 * Pivot table field.
 *
 * @private
 */
export class PivotFieldImpl implements PivotField {
    public readonly name: string;
    public readonly index: number;
    private readonly table: PivotTableImpl;
    private _caption: string | undefined;
    private _axis: PivotAxis = 'none';
    private _subtotals: PivotFieldSubtotal[] = ['automatic'];
    private _sortOrder: PivotSortOrder = 'manual';
    private _showItemsWithoutData: boolean = false;
    private _numberFormat: string | undefined;
    /** Present when the field was read from a file. */
    public loaded: LoadedField | undefined;

    /**
     * Creates a field.
     *
     * @param {PivotTableImpl} table - Owning table.
     * @param {number} index - Zero-based source column.
     * @param {string} name - Source heading.
     */
    public constructor(table: PivotTableImpl, index: number, name: string) {
        this.table = table;
        this.index = index;
        this.name = name;
    }

    /**
     * Apply state read from a file (no edit is recorded).
     *
     * @param {LoadedField} loaded - What the file held for this field.
     */
    public initialize(loaded: LoadedField): void {
        this._caption = loaded.caption;
        this._subtotals = loaded.subtotals.slice();
        this._sortOrder = loaded.sortOrder;
        this._showItemsWithoutData = loaded.showItemsWithoutData;
        this._numberFormat = loaded.numberFormat;
        this.loaded = loaded;
    }

    /** @returns {PivotTableImpl} The owning table. */
    public get owner(): PivotTableImpl {
        return this.table;
    }

    /** @returns {string | undefined} Caption shown instead of the heading. */
    public get caption(): string | undefined {
        return this._caption;
    }

    /** @param {string | undefined} value - New caption. */
    public set caption(value: string | undefined) {
        if (value === undefined) {
            this._caption = undefined;
            this.table.touch();
            return;
        }
        const text: string = requireText(value, 'Pivot field caption');
        this.table.assertFieldLabelFree(text, this);
        this._caption = text;
        this.table.touch();
    }

    /** @returns {string} Caption when set, else the heading. */
    public get displayName(): string {
        return this._caption !== undefined ? this._caption : this.name;
    }

    /** @returns {PivotAxis} The axis the field is on. */
    public get axis(): PivotAxis {
        return this._axis;
    }

    /** @param {PivotAxis} value - The new axis. */
    public set axis(value: PivotAxis) {
        if (AXES.indexOf(value) < 0) {
            throw new InvalidArgumentError(`Unknown pivot axis "${String(value)}"; use none, row, column, or page`);
        }
        this.table.moveField(this, value);
    }

    /**
     * Internal axis write (used by the table after list bookkeeping).
     *
     * @param {PivotAxis} value - New axis.
     */
    public assignAxis(value: PivotAxis): void {
        this._axis = value;
    }

    /** @returns {ReadonlyArray<PivotFieldSubtotal>} Subtotals shown. */
    public get subtotals(): ReadonlyArray<PivotFieldSubtotal> {
        return this._subtotals.slice();
    }

    /** @param {ReadonlyArray<PivotFieldSubtotal>} value - New subtotals. */
    public set subtotals(value: ReadonlyArray<PivotFieldSubtotal>) {
        if (!Array.isArray(value)) {
            throw new InvalidArgumentError('Pivot field subtotals must be an array');
        }
        const next: PivotFieldSubtotal[] = [];
        for (const entry of value) {
            if (entry !== 'automatic' && !isPivotFunction(entry)) {
                throw new InvalidArgumentError(`Unknown pivot subtotal "${String(entry)}"`);
            }
            if (next.indexOf(entry) < 0) {
                next.push(entry);
            }
        }
        this._subtotals = next;
        this.table.touch();
    }

    /** @returns {PivotSortOrder} Item order. */
    public get sortOrder(): PivotSortOrder {
        return this._sortOrder;
    }

    /** @param {PivotSortOrder} value - New item order. */
    public set sortOrder(value: PivotSortOrder) {
        if (SORT_ORDERS.indexOf(value) < 0) {
            throw new InvalidArgumentError(`Unknown pivot sort order "${String(value)}"`);
        }
        this._sortOrder = value;
        this.table.touch();
    }

    /** @returns {boolean} Whether empty items are shown. */
    public get showItemsWithoutData(): boolean {
        return this._showItemsWithoutData;
    }

    /** @param {boolean} value - Show items with no data. */
    public set showItemsWithoutData(value: boolean) {
        this._showItemsWithoutData = value === true;
        this.table.touch();
    }

    /** @returns {string | undefined} Number format code of the items. */
    public get numberFormat(): string | undefined {
        return this._numberFormat;
    }

    /** @param {string | undefined} value - Format code. */
    public set numberFormat(value: string | undefined) {
        if (value !== undefined && (typeof value !== 'string' || value.trim().length === 0)) {
            throw new InvalidArgumentError('Pivot field numberFormat must be a non-blank format code or undefined');
        }
        this._numberFormat = value;
        this.table.touch();
    }
}

/**
 * Pivot data field (value).
 *
 * @private
 */
export class PivotDataFieldImpl implements PivotDataField {
    public readonly field: PivotFieldImpl;
    private readonly table: PivotTableImpl;
    private _name: string;
    private _function: PivotFunction;
    private _numberFormat: string | undefined;
    /** Present when the data field was read from a file. */
    public loaded: LoadedDataField | undefined;

    /**
     * Creates a data field.
     *
     * @param {PivotTableImpl} table - Owning table.
     * @param {PivotFieldImpl} field - Source field.
     * @param {string} name - Caption.
     * @param {PivotFunction} fn - Summary function.
     * @param {string | undefined} numberFormat - Format code.
     */
    public constructor(
        table: PivotTableImpl,
        field: PivotFieldImpl,
        name: string,
        fn: PivotFunction,
        numberFormat: string | undefined,
    ) {
        this.table = table;
        this.field = field;
        this._name = name;
        this._function = fn;
        this._numberFormat = numberFormat;
    }

    /** @returns {string} Caption. */
    public get name(): string {
        return this._name;
    }

    /** @param {string} value - New caption. */
    public set name(value: string) {
        const text: string = requireText(value, 'Pivot data field name');
        this.table.assertDataFieldNameFree(text, this);
        this._name = text;
        this.table.touch();
    }

    /** @returns {PivotFunction} Summary function. */
    public get function(): PivotFunction {
        return this._function;
    }

    /** @param {PivotFunction} value - New summary function. */
    public set function(value: PivotFunction) {
        if (!isPivotFunction(value)) {
            throw new InvalidArgumentError(`Unknown pivot function "${String(value)}"`);
        }
        this._function = value;
        this.table.touch();
    }

    /** @returns {string | undefined} Number format code. */
    public get numberFormat(): string | undefined {
        return this._numberFormat;
    }

    /** @param {string | undefined} value - Format code. */
    public set numberFormat(value: string | undefined) {
        if (value !== undefined && (typeof value !== 'string' || value.trim().length === 0)) {
            throw new InvalidArgumentError('Pivot data field numberFormat must be a non-blank format code or undefined');
        }
        this._numberFormat = value;
        this.table.touch();
    }
}

class PivotFieldsImpl implements PivotFields {
    private readonly table: PivotTableImpl;

    public constructor(table: PivotTableImpl) {
        this.table = table;
    }

    public get count(): number {
        return this.table.allFields().length;
    }

    public list(): ReadonlyArray<PivotField> {
        return this.table.allFields().slice();
    }

    public get(indexOrName: number | string): PivotField {
        return this.table.resolveField(indexOrName);
    }
}

class PivotAxisFieldsImpl implements PivotAxisFields {
    private readonly table: PivotTableImpl;
    private readonly axis: PivotAxis;

    public constructor(table: PivotTableImpl, axis: PivotAxis) {
        this.table = table;
        this.axis = axis;
    }

    public get count(): number {
        return this.table.axisList(this.axis).length;
    }

    public list(): ReadonlyArray<PivotField> {
        return this.table.axisList(this.axis).slice();
    }

    public get(index: number): PivotField {
        const list: ReadonlyArray<PivotFieldImpl> = this.table.axisList(this.axis);
        if (!Number.isInteger(index) || index < 0 || index >= list.length) {
            throw new InvalidArgumentError(`Pivot ${this.axis} field index ${String(index)} is out of range (0..${list.length - 1})`);
        }
        return list[index];
    }

    public add(field: PivotField | number | string): PivotField {
        const target: PivotFieldImpl = typeof field === 'number' || typeof field === 'string'
            ? this.table.resolveField(field)
            : this.table.requireOwnField(field);
        this.table.moveField(target, this.axis, true);
        return target;
    }

    public remove(field: PivotField): void {
        const target: PivotFieldImpl = this.table.requireOwnField(field);
        if (target.axis !== this.axis) {
            throw new InvalidArgumentError(`Pivot field "${target.name}" is not on the ${this.axis} axis`);
        }
        this.table.moveField(target, 'none');
    }

    public clear(): void {
        for (const f of this.table.axisList(this.axis).slice()) {
            this.table.moveField(f, 'none');
        }
    }
}

class PivotDataFieldsImpl implements PivotDataFields {
    private readonly table: PivotTableImpl;

    public constructor(table: PivotTableImpl) {
        this.table = table;
    }

    public get count(): number {
        return this.table.dataFieldList().length;
    }

    public list(): ReadonlyArray<PivotDataField> {
        return this.table.dataFieldList().slice();
    }

    public get(index: number): PivotDataField {
        const list: ReadonlyArray<PivotDataFieldImpl> = this.table.dataFieldList();
        if (!Number.isInteger(index) || index < 0 || index >= list.length) {
            throw new InvalidArgumentError(`Pivot data field index ${String(index)} is out of range (0..${list.length - 1})`);
        }
        return list[index];
    }

    public add(field: PivotField, options?: PivotDataFieldOptions): PivotDataField {
        return this.table.addDataField(field, options);
    }

    public remove(dataField: PivotDataField): void {
        this.table.removeDataField(dataField);
    }

    public clear(): void {
        this.table.clearDataFields();
    }
}

/**
 * Create the default options object.
 *
 * @returns {PivotTableOptions} Defaults matching Excel's new-pivot state.
 * @private
 */
function defaultOptions(): PivotTableOptions {
    return {
        rowGrand: true,
        columnGrand: true,
        showDrillIndicators: true,
        showFieldHeaders: true,
        mergeLabels: false,
        autoFormat: true,
        preserveFormatting: true,
        rowHeaderCaption: undefined,
        columnHeaderCaption: undefined,
        grandTotalCaption: undefined,
        dataCaption: 'Values',
        errorCaption: undefined,
        emptyCellCaption: undefined,
        showRowHeaders: true,
        showColumnHeaders: true,
        showRowStripes: false,
        showColumnStripes: false,
        showLastColumn: true,
    };
}

/**
 * Host surface the worksheet provides to its pivot table collection.
 *
 * @private
 */
export interface PivotTablesHost {
    markDirty(): void;
    /** Package part name of the owning worksheet; `undefined` when it has none. */
    sheetPartName(): string | undefined;
}

/**
 * One authored pivot table.
 *
 * @private
 */
export class PivotTableImpl implements PivotTable {
    public readonly cache: PivotCacheImpl;
    public readonly fields: PivotFields;
    public readonly rowFields: PivotAxisFields;
    public readonly columnFields: PivotAxisFields;
    public readonly filterFields: PivotAxisFields;
    public readonly dataFields: PivotDataFields;
    public readonly options: PivotTableOptions = defaultOptions();

    /** True when the table was read from a file rather than authored. */
    public adopted: boolean = false;
    /** What the file held; present for adopted tables. */
    public loaded: LoadedTable | undefined;
    /** Signatures of the table as loaded, to tell what an edit changed. */
    public baselineStructure: string = '';
    public baselineGeometry: string = '';
    /** Option values as loaded. */
    public baselineOptions: { readonly [key: string]: unknown } = {};
    public baselineName: string = '';
    public baselineStyle: PivotBuiltInStyle = 'none';
    public baselineLocation: string = '';
    /** True once a setter or collection call changed the table. */
    public modified: boolean = false;

    /** Owning collection. */
    public readonly collection: PivotTablesImpl;

    /** Package bookkeeping, owned by the pivot store. */
    public partName: string | undefined;
    public sheetRelId: string | undefined;

    private _name: string;
    private _row: number;
    private _col: number;
    private _layout: PivotLayout = 'compact';
    private _pivotStyle: PivotBuiltInStyle = 'PivotStyleLight16';
    private readonly fieldList: PivotFieldImpl[] = [];
    private readonly rowList: PivotFieldImpl[] = [];
    private readonly colList: PivotFieldImpl[] = [];
    private readonly pageList: PivotFieldImpl[] = [];
    private readonly dataList: PivotDataFieldImpl[] = [];

    /**
     * Creates a pivot table.
     *
     * @param {PivotTablesImpl} collection - Owning collection.
     * @param {PivotCacheImpl} cache - Source cache.
     * @param {string} name - Table name.
     * @param {number} row - 1-based top row.
     * @param {number} col - 1-based left column.
     */
    public constructor(collection: PivotTablesImpl, cache: PivotCacheImpl, name: string, row: number, col: number) {
        this.collection = collection;
        this.cache = cache;
        this._name = name;
        this._row = row;
        this._col = col;
        for (let i: number = 0; i < cache.fieldNames.length; i++) {
            this.fieldList.push(new PivotFieldImpl(this, i, cache.fieldNames[i]));
        }
        this.fields = new PivotFieldsImpl(this);
        this.rowFields = new PivotAxisFieldsImpl(this, 'row');
        this.columnFields = new PivotAxisFieldsImpl(this, 'column');
        this.filterFields = new PivotAxisFieldsImpl(this, 'filter');
        this.dataFields = new PivotDataFieldsImpl(this);
    }

    /** @returns {string} Table name. */
    public get name(): string {
        return this._name;
    }

    /** @param {string} value - New name. */
    public set name(value: string) {
        const text: string = requireText(value, 'Pivot table name');
        this.collection.assertNameFree(text, this);
        this._name = text;
        this.touch();
    }

    /** @returns {string} Top-left A1 address. */
    public get location(): string {
        return formatA1(this._row, this._col);
    }

    /** @param {string} value - New A1 address (range uses top-left). */
    public set location(value: string) {
        const cell = parseLocation(value);
        this._row = cell.row;
        this._col = cell.col;
        this.touch();
    }

    /** @returns {number} 1-based top row. */
    public get row(): number {
        return this._row;
    }

    /** @returns {number} 1-based left column. */
    public get column(): number {
        return this._col;
    }

    /** @returns {PivotLayout} Report layout. */
    public get layout(): PivotLayout {
        return this._layout;
    }

    /** @param {PivotLayout} value - New layout. */
    public set layout(value: PivotLayout) {
        if (LAYOUTS.indexOf(value) < 0) {
            throw new InvalidArgumentError(`Unknown pivot layout "${String(value)}"; use compact, outline, or tabular`);
        }
        this._layout = value;
        this.touch();
    }

    /** @returns {PivotBuiltInStyle} Built-in style. */
    public get pivotStyle(): PivotBuiltInStyle {
        return this._pivotStyle;
    }

    /** @param {PivotBuiltInStyle} value - New style. */
    public set pivotStyle(value: PivotBuiltInStyle) {
        if (BUILT_IN_STYLES.indexOf(value) < 0) {
            throw new InvalidArgumentError(`Unknown pivot built-in style "${String(value)}"`);
        }
        this._pivotStyle = value;
        this.touch();
    }

    /** Record a mutation. */
    public touch(): void {
        this.modified = true;
        this.collection.touch();
    }

    /**
     * Apply state read from a file. No edit is recorded.
     *
     * @param {LoadedTable} loaded - What the file held.
     * @param {PivotBuiltInStyle} pivotStyle - Style read from `pivotTableStyleInfo`.
     * @param {ReadonlyArray<PivotFieldImpl>} rows - Row fields in order.
     * @param {ReadonlyArray<PivotFieldImpl>} columns - Column fields in order.
     * @param {ReadonlyArray<PivotFieldImpl>} pages - Report filters in order.
     * @param {ReadonlyArray<PivotDataFieldImpl>} data - Data fields in order.
     * @param {PivotTableOptions} options - Options read from the root element.
     * @param {string} partName - Package part of the table.
     * @param {string} sheetRelId - Worksheet relationship id of the table.
     */
    public initialize(
        loaded: LoadedTable,
        pivotStyle: PivotBuiltInStyle,
        rows: ReadonlyArray<PivotFieldImpl>,
        columns: ReadonlyArray<PivotFieldImpl>,
        pages: ReadonlyArray<PivotFieldImpl>,
        data: ReadonlyArray<PivotDataFieldImpl>,
        options: PivotTableOptions,
        partName: string,
        sheetRelId: string,
    ): void {
        this.partName = partName;
        this.sheetRelId = sheetRelId;
        this._layout = loaded.layout;
        this._pivotStyle = pivotStyle;
        this.baselineStyle = pivotStyle;
        for (const f of rows) {
            this.rowList.push(f);
            f.assignAxis('row');
        }
        for (const f of columns) {
            this.colList.push(f);
            f.assignAxis('column');
        }
        for (const f of pages) {
            this.pageList.push(f);
            f.assignAxis('filter');
        }
        for (const d of data) {
            this.dataList.push(d);
        }
        const target: { [key: string]: unknown } = this.options as unknown as { [key: string]: unknown };
        const source: { [key: string]: unknown } = options as unknown as { [key: string]: unknown };
        for (const key of Object.keys(source)) {
            target[key] = source[key];
        }
        this.loaded = loaded;
        this.adopted = true;
        this.modified = false;
        this.baselineOptions = { ...(this.options as unknown as { [key: string]: unknown }) };
        this.baselineName = this._name;
        this.baselineLocation = `${this._row},${this._col}`;
        this.baselineStructure = this.structureSignature();
        this.baselineGeometry = this.geometrySignature();
    }

    /**
     * Everything that decides the table's size and position.
     *
     * @returns {string} Geometry signature.
     */
    public geometrySignature(): string {
        const flags: string = this.fieldList
            .map((f: PivotFieldImpl): string => (f.axis === 'none' ? '-' : `${f.subtotals.join('+')}/${f.sortOrder}/${f.showItemsWithoutData ? 1 : 0}`))
            .join(';');
        return `${this.structureSignature()}|${this._layout}|${this.options.rowGrand ? 1 : 0}${this.options.columnGrand ? 1 : 0}|${flags}|${this._row},${this._col}`;
    }

    /**
     * Axis membership and data fields as a comparable string.
     *
     * @returns {string} Structure signature.
     */
    public structureSignature(): string {
        const ids = (list: ReadonlyArray<PivotFieldImpl>): string => list.map((f: PivotFieldImpl): number => f.index).join(',');
        return `r${ids(this.rowList)}|c${ids(this.colList)}|p${ids(this.pageList)}|d${this.dataList
            .map((d: PivotDataFieldImpl): string => `${d.field.index}:${d.function}`).join(',')}`;
    }

    /**
     * Whether the table differs from what was read from the file. Options are
     * a plain object, so they are compared against the loaded baseline.
     *
     * @returns {boolean} True when the table needs rewriting.
     */
    public isModified(): boolean {
        if (this.loaded === undefined) {
            return true;
        }
        if (this.modified) {
            return true;
        }
        const now: { [key: string]: unknown } = this.options as unknown as { [key: string]: unknown };
        return Object.keys(this.baselineOptions).some((key: string): boolean => now[key] !== this.baselineOptions[key]);
    }

    /** @returns {ReadonlyArray<PivotFieldImpl>} All fields in source order. */
    public allFields(): ReadonlyArray<PivotFieldImpl> {
        return this.fieldList;
    }

    /**
     * Fields on an axis in display order.
     *
     * @param {PivotAxis} axis - Axis.
     * @returns {ReadonlyArray<PivotFieldImpl>} Live list.
     */
    public axisList(axis: PivotAxis): ReadonlyArray<PivotFieldImpl> {
        switch (axis) {
        case 'row':
            return this.rowList;
        case 'column':
            return this.colList;
        case 'filter':
            return this.pageList;
        default:
            return [];
        }
    }

    /** @returns {ReadonlyArray<PivotDataFieldImpl>} Data fields in display order. */
    public dataFieldList(): ReadonlyArray<PivotDataFieldImpl> {
        return this.dataList;
    }

    /**
     * Resolve a field by position or heading (heading match is exact, then
     * case-insensitive, then by caption).
     *
     * @param {number | string} indexOrName - Position or heading.
     * @returns {PivotFieldImpl} The field.
     */
    public resolveField(indexOrName: number | string): PivotFieldImpl {
        if (typeof indexOrName === 'number') {
            if (!Number.isInteger(indexOrName) || indexOrName < 0 || indexOrName >= this.fieldList.length) {
                throw new InvalidArgumentError(
                    `Pivot field index ${String(indexOrName)} is out of range (0..${this.fieldList.length - 1})`,
                );
            }
            return this.fieldList[indexOrName];
        }
        if (typeof indexOrName !== 'string') {
            throw new InvalidArgumentError('Pivot field lookup needs a position or a source heading');
        }
        const exact: PivotFieldImpl | undefined = this.fieldList.find((f: PivotFieldImpl): boolean => f.name === indexOrName);
        if (exact !== undefined) {
            return exact;
        }
        const lower: string = indexOrName.toLowerCase();
        const loose: PivotFieldImpl | undefined = this.fieldList.find(
            (f: PivotFieldImpl): boolean => f.name.toLowerCase() === lower || (f.caption !== undefined && f.caption.toLowerCase() === lower),
        );
        if (loose === undefined) {
            throw new InvalidArgumentError(`The pivot table has no field named "${indexOrName}"`);
        }
        return loose;
    }

    /**
     * Require a field handle of this table.
     *
     * @param {PivotField} field - Candidate.
     * @returns {PivotFieldImpl} The field.
     */
    public requireOwnField(field: PivotField): PivotFieldImpl {
        if (!(field instanceof PivotFieldImpl) || field.owner !== this) {
            throw new InvalidPivotTableError(`The field "${field === null || field === undefined ? String(field) : field.name}" does not belong to pivot table "${this._name}"`);
        }
        return field;
    }

    /**
     * Move a field to an axis.
     *
     * @param {PivotFieldImpl} field - The field.
     * @param {PivotAxis} axis - Target axis.
     * @param {boolean} [forceAppend] - Re-append even when already on the axis.
     */
    public moveField(field: PivotFieldImpl, axis: PivotAxis, forceAppend?: boolean): void {
        if (field.axis === axis && forceAppend !== true) {
            return;
        }
        if (field.axis !== 'none') {
            const old: PivotFieldImpl[] = this.mutableList(field.axis);
            const at: number = old.indexOf(field);
            if (at >= 0) {
                old.splice(at, 1);
            }
        }
        if (axis !== 'none') {
            this.mutableList(axis).push(field);
        }
        field.assignAxis(axis);
        this.touch();
    }

    private mutableList(axis: PivotAxis): PivotFieldImpl[] {
        if (axis === 'row') {
            return this.rowList;
        }
        if (axis === 'column') {
            return this.colList;
        }
        return this.pageList;
    }

    /**
     * A field caption must not repeat another field's heading or caption.
     *
     * @param {string} text - Candidate caption.
     * @param {PivotFieldImpl} except - The field being captioned.
     */
    public assertFieldLabelFree(text: string, except: PivotFieldImpl): void {
        const lower: string = text.toLowerCase();
        for (const f of this.fieldList) {
            if (f === except) {
                continue;
            }
            if (f.name.toLowerCase() === lower || (f.caption !== undefined && f.caption.toLowerCase() === lower)) {
                throw new InvalidPivotTableError(`Pivot field caption "${text}" is already used by the field "${f.name}"`);
            }
        }
        if (except.name.toLowerCase() !== lower) {
            // Caption equal to the field's own heading is harmless; any other
            // collision with a data field name is rejected below.
            for (const d of this.dataList) {
                if (d.name.toLowerCase() === lower) {
                    throw new InvalidPivotTableError(`Pivot field caption "${text}" is already used by a data field`);
                }
            }
        }
    }

    /**
     * A data field name must be unique among data fields and not equal any
     * field heading or caption.
     *
     * @param {string} text - Candidate name.
     * @param {PivotDataFieldImpl | undefined} except - The data field being renamed.
     */
    public assertDataFieldNameFree(text: string, except: PivotDataFieldImpl | undefined): void {
        const lower: string = text.toLowerCase();
        for (const f of this.fieldList) {
            if (f.name.toLowerCase() === lower || (f.caption !== undefined && f.caption.toLowerCase() === lower)) {
                throw new InvalidPivotTableError(
                    `Pivot data field name "${text}" is the name of the source field "${f.name}"; choose another name such as "Sum of ${f.name}"`,
                );
            }
        }
        for (const d of this.dataList) {
            if (d !== except && d.name.toLowerCase() === lower) {
                throw new InvalidPivotTableError(`Pivot data field name "${text}" is already used by another data field`);
            }
        }
    }

    /**
     * Add a data field.
     *
     * @param {PivotField} field - Source field.
     * @param {PivotDataFieldOptions} [options] - Caption, function, format.
     * @returns {PivotDataField} The new data field.
     */
    public addDataField(field: PivotField, options?: PivotDataFieldOptions): PivotDataField {
        const own: PivotFieldImpl = this.requireOwnField(field);
        const fn: PivotFunction = options !== undefined && options.function !== undefined ? options.function : 'sum';
        if (!isPivotFunction(fn)) {
            throw new InvalidArgumentError(`Unknown pivot function "${String(fn)}"`);
        }
        const format: string | undefined = options !== undefined ? options.numberFormat : undefined;
        if (format !== undefined && (typeof format !== 'string' || format.trim().length === 0)) {
            throw new InvalidArgumentError('Pivot data field numberFormat must be a non-blank format code or undefined');
        }
        let name: string;
        if (options !== undefined && options.name !== undefined) {
            name = requireText(options.name, 'Pivot data field name');
            this.assertDataFieldNameFree(name, undefined);
        } else {
            const base: string = `${FUNCTION_LABELS[fn]} of ${own.displayName}`;
            name = base;
            let n: number = 2;
            while (this.dataList.some((d: PivotDataFieldImpl): boolean => d.name.toLowerCase() === name.toLowerCase())
                || this.fieldList.some((f: PivotFieldImpl): boolean => f.displayName.toLowerCase() === name.toLowerCase() || f.name.toLowerCase() === name.toLowerCase())) {
                name = `${base}${n}`;
                n += 1;
            }
        }
        const created: PivotDataFieldImpl = new PivotDataFieldImpl(this, own, name, fn, format);
        this.dataList.push(created);
        this.touch();
        return created;
    }

    /**
     * Remove a data field.
     *
     * @param {PivotDataField} dataField - The data field.
     */
    public removeDataField(dataField: PivotDataField): void {
        const at: number = dataField instanceof PivotDataFieldImpl ? this.dataList.indexOf(dataField) : -1;
        if (at < 0) {
            throw new InvalidArgumentError('The data field is not part of this pivot table');
        }
        this.dataList.splice(at, 1);
        this.touch();
    }

    /** Remove every data field. */
    public clearDataFields(): void {
        this.dataList.length = 0;
        this.touch();
    }
}

/**
 * Parse a location address to its top-left cell.
 *
 * @param {string} value - `A3` or a range such as `A3:C9`.
 * @returns {{row: number, col: number}} Top-left cell.
 * @private
 */
function parseLocation(value: string): { readonly row: number; readonly col: number } {
    if (typeof value !== 'string' || value.trim().length === 0) {
        throw new InvalidArgumentError('Pivot table location must be an A1 address such as "A3"');
    }
    const text: string = value.trim();
    if (text.indexOf(':') >= 0) {
        const r = parseA1Range(text);
        return { row: r.startRow, col: r.startCol };
    }
    const c = parseA1(text);
    return { row: c.row, col: c.col };
}

/**
 * Pivot tables on one worksheet.
 *
 * @private
 */
export class PivotTablesImpl implements PivotTables {
    private readonly host: PivotTablesHost;
    private readonly cachesOwner: PivotCachesImpl;
    private readonly entries: PivotTableImpl[] = [];
    private readonly removed: PivotTableImpl[] = [];

    /**
     * Creates the collection.
     *
     * @param {PivotTablesHost} host - Worksheet host.
     * @param {PivotCachesImpl} caches - Workbook caches (ownership checks).
     */
    public constructor(host: PivotTablesHost, caches: PivotCachesImpl) {
        this.host = host;
        this.cachesOwner = caches;
    }

    /** @returns {number} Table count. */
    public get count(): number {
        return this.entries.length;
    }

    /** @returns {ReadonlyArray<PivotTable>} Tables in creation order. */
    public list(): ReadonlyArray<PivotTable> {
        return this.entries.slice();
    }

    /** @returns {ReadonlyArray<PivotTableImpl>} Live typed entries. */
    public internalEntries(): ReadonlyArray<PivotTableImpl> {
        return this.entries;
    }

    /** @returns {string | undefined} Package part name of the owning worksheet. */
    public sheetPartName(): string | undefined {
        return this.host.sheetPartName();
    }

    /**
     * Tables removed since the last flush (their parts must be dropped).
     *
     * @returns {PivotTableImpl[]} Removed tables, cleared by the caller.
     */
    public takeRemoved(): PivotTableImpl[] {
        return this.removed.splice(0, this.removed.length);
    }

    /** Record a mutation. */
    public touch(): void {
        this.host.markDirty();
    }

    /**
     * Register a table read from a file (no edit is recorded).
     *
     * @param {PivotTableImpl} table - The loaded table.
     */
    public adopt(table: PivotTableImpl): void {
        this.entries.push(table);
    }

    /**
     * Get by position or name.
     *
     * @param {number | string} indexOrName - Position or name.
     * @returns {PivotTable} The table.
     */
    public get(indexOrName: number | string): PivotTable {
        if (typeof indexOrName === 'number') {
            if (!Number.isInteger(indexOrName) || indexOrName < 0 || indexOrName >= this.entries.length) {
                throw new InvalidArgumentError(
                    `Pivot table index ${String(indexOrName)} is out of range (0..${this.entries.length - 1})`,
                );
            }
            return this.entries[indexOrName];
        }
        const lower: string = String(indexOrName).toLowerCase();
        const found: PivotTableImpl | undefined = this.entries.find((t: PivotTableImpl): boolean => t.name.toLowerCase() === lower);
        if (found === undefined) {
            throw new InvalidArgumentError(`The worksheet has no pivot table named "${String(indexOrName)}"`);
        }
        return found;
    }

    /**
     * Whether a table with this name exists.
     *
     * @param {string} name - Name.
     * @returns {boolean} Whether it exists.
     */
    public has(name: string): boolean {
        const lower: string = String(name).toLowerCase();
        return this.entries.some((t: PivotTableImpl): boolean => t.name.toLowerCase() === lower);
    }

    /**
     * Reject a name already used on this worksheet.
     *
     * @param {string} name - Candidate.
     * @param {PivotTableImpl | undefined} except - The table being renamed.
     */
    public assertNameFree(name: string, except: PivotTableImpl | undefined): void {
        const lower: string = name.toLowerCase();
        for (const t of this.entries) {
            if (t !== except && t.name.toLowerCase() === lower) {
                throw new InvalidPivotTableError(`The worksheet already has a pivot table named "${name}"`);
            }
        }
    }

    /**
     * Add a pivot table.
     *
     * @param {PivotCache} cache - Source cache.
     * @param {PivotTableAddOptions} options - Name and location.
     * @returns {PivotTable} The new table.
     */
    public add(cache: PivotCache, options: PivotTableAddOptions): PivotTable {
        if (options === null || options === undefined || options.location === undefined) {
            throw new InvalidArgumentError('pivotTables.add requires { location } such as { location: "A3" }');
        }
        if (!(cache instanceof PivotCacheImpl) || !this.cachesOwner.owns(cache)) {
            throw new InvalidPivotTableError('The pivot cache does not belong to this workbook; create it with workbook.pivotCaches.add(...)');
        }
        const cell = parseLocation(options.location);
        let name: string;
        if (options.name !== undefined) {
            name = requireText(options.name, 'Pivot table name');
            this.assertNameFree(name, undefined);
        } else {
            let n: number = 1;
            while (this.has(`PivotTable${n}`)) {
                n += 1;
            }
            name = `PivotTable${n}`;
        }
        const created: PivotTableImpl = new PivotTableImpl(this, cache, name, cell.row, cell.col);
        this.entries.push(created);
        this.host.markDirty();
        return created;
    }

    /**
     * Remove a table.
     *
     * @param {PivotTable} table - The table.
     */
    public remove(table: PivotTable): void {
        const at: number = table instanceof PivotTableImpl ? this.entries.indexOf(table) : -1;
        if (at < 0) {
            throw new InvalidArgumentError('The pivot table is not part of this worksheet');
        }
        this.removeAt(at);
    }

    /**
     * Remove the table at a position.
     *
     * @param {number} index - Position.
     */
    public removeAt(index: number): void {
        if (!Number.isInteger(index) || index < 0 || index >= this.entries.length) {
            throw new InvalidArgumentError(
                `Pivot table index ${String(index)} is out of range (0..${this.entries.length - 1})`,
            );
        }
        const [gone] = this.entries.splice(index, 1);
        this.removed.push(gone);
        this.host.markDirty();
    }

    /** Remove every table. */
    public clear(): void {
        while (this.entries.length > 0) {
            this.removeAt(this.entries.length - 1);
        }
    }
}
