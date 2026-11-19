import { FormulaValue } from '../actions/formula';
import { ColumnModel, AggregateColumnModel } from '../models/models';

/**
 * Exports types used by Grid.
 * ```props
 * * number :- Sets value type as number.
 * * string :- Sets value type as string.
 * * Date :- Sets value type as date.
 * * boolean :- Sets value type as boolean.
 * ```
 */

export type ValueType = number | string | Date | boolean;

export type ValueAccessor = (field: string, data: Object, column: ColumnModel) => Object;

export type HeaderValueAccessor = (field: string, column: ColumnModel) => Object;

export type SortComparer = (x: ValueType, y: ValueType) => number;

export type FilterComparer = (value: ValueType, filterValue: ValueType, operator?: string) => FormulaValue | Object;

export type CustomSummaryType = (data: Object[] | Object, column: AggregateColumnModel) => Object;

export type ReturnType = { result: Object[], count: number, aggregates?: Object, foreignColumnsData?: Object, actual?: Object[] };

export type SentinelType = {
    check?: (rect: ClientRect, info: SentinelType) => boolean,
    top?: number, entered?: boolean,
    axis?: string;
};

export type SentinelInfo = { up?: SentinelType, down?: SentinelType, right?: SentinelType, left?: SentinelType };

export type Offsets = { top?: number, left?: number };
/** @hidden */
export type BatchChanges = { addedRecords?: Object[], changedRecords?: Object[], deletedRecords?: Object[] };

/**
 * A function that determines whether a given data row is selectable.
 *
 * @param data - The data object for the row being evaluated.
 * @param columns - The column definitions of the Grid.
 * @returns Returns true to allow selecting the row; false to disable selection.
 */
export type RowSelectable = (data: Object, columns: ColumnModel[]) => boolean;

/**
 * A function that determines whether a given data row is pinned to the top.
 *
 * @param data - The data object for the row being evaluated.
 * @param columns - The column definitions of the Grid.
 * @returns Returns true to pin the row to the top; false otherwise.
 */
export type PinRow = (data: Object, columns: ColumnModel[]) => boolean;

/**
 * A callback function invoked for each row rendered in DOM virtualization mode.
 * Receives the row object and must return the height of that row in pixels.
 * Takes priority over the static `rowHeight` property but is superseded by
 * `domVirtualizationSettings.autoRowHeight: true` (DOM measurement).
 *
 * @param row - The row object for the rendered row.
 * @returns The height of the row in pixels.
 */
export type SetRowHeight = (row: Object) => number;

