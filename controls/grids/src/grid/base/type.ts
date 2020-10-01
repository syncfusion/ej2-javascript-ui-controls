import { ColumnModel, AggregateColumnModel } from '../models/models';

/**
 * Exports types used by Grid.
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

export type BatchChanges = { addedRecords?: Object[], changedRecords?: Object[], deletedRecords?: Object[] };
