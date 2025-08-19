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

export type CustomSummaryType = (data: Object[] | Object, column: AggregateColumnModel) => Object;

export type ReturnType = { result: Object[], count: number, aggregates?: Object, foreignColumnsData?: Object };

export type SentinelType = {
    check?: (rect: ClientRect, info: SentinelType) => boolean,
    top?: number, entered?: boolean,
    axis?: string;
};

export type SentinelInfo = { up?: SentinelType, down?: SentinelType, right?: SentinelType, left?: SentinelType };

export type Offsets = { top?: number, left?: number };
/** @hidden */
export type BatchChanges = { addedRecords?: Object[], changedRecords?: Object[], deletedRecords?: Object[] };
