import { CellStyleModel } from './class-model';
import { SaveType } from './enum';
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