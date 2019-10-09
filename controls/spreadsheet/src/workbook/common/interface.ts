import { CellStyleModel } from './class-model';
import { SaveType, SortOrder } from './enum';
import { Sheet } from '../base/sheet';

export interface SaveOptions {
    url?: string;
    fileName?: string;
    saveType?: SaveType;
}

export interface BeforeSaveEventArgs extends SaveOptions {
    customParams: Object;
    isFullPost: boolean;
    needBlobData: boolean;
    cancel: boolean;
}

export interface SaveCompleteEventArgs extends SaveOptions {
    blobData: Blob;
    status: string;
    message: string;
}

/** @hidden */
export interface CellFormatArgs {
    style: CellStyleModel;
    rowIdx: number;
    colIdx: number;
    cell?: HTMLElement;
    row?: HTMLElement;
    hRow?: HTMLElement;
    lastCell?: boolean;
    isHeightCheckNeeded?: boolean;
    manualUpdate?: boolean;
    onActionUpdate?: boolean;
}

/**
 * @hidden
 */
export interface ExtendedSheet extends Sheet {
    isLocalData?: boolean;
}

/**
 * Specifies before cell formatting arguments.
 */
export interface BeforeCellFormatArgs {
    range: number[];
    value: string;
    format: string;
    requestType: string;
    cancel?: boolean;
}

/** @hidden */
export interface AggregateArgs {
    Count: number;
    Sum: string;
    Avg: string;
    Min: string;
    Max: string;
}
/**
 * Specifies the procedure for sorting.
 */
export interface SortDescriptor {
    field?: string;
    order?: SortOrder;
    sortComparer?: Function;
}

/**
 * Specifies the arguments for sorting.
 */
export interface SortEventArgs {
    range?: string;
    sortOptions?: SortOptions;
}

/**
 * Specifies the options for sorting.
 */
export interface SortOptions {
    sortDescriptors?: SortDescriptor | SortDescriptor[];
    containsHeader?: boolean;
}

/**
 * Specifies before sorting arguments.
 */
export interface BeforeSortEventArgs extends SortEventArgs {
    cancel?: boolean;
}
