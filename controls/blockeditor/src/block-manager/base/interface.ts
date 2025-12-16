import { EditorExecCommand } from '../../common/types';
import { BlockModel, TableColumnModel, ITableBlockSettings, TableRowModel, TableCellModel } from '../../models/index';

export interface CommandOptions {
    command: EditorExecCommand
    state?: any
}

export interface BlockManagerModel {
    rootEditorElement: HTMLElement;
}

/* Table block Interfaces */

export interface ITableRowInsertOptions {
    blockId: string;
    rowIndex: number;
    rowModel?: TableRowModel;
    isUndoRedoAction?: boolean
}

export interface ITableRowDeletionOptions {
    blockId: string;
    modelIndex: number;
    isUndoRedoAction?: boolean
}

export interface ITableColumnInsertOptions {
    blockId: string;
    colIndex: number;
    columnModel?: TableColumnModel;
    columnCells?: TableCellModel[];
    isUndoRedoAction?: boolean;
}

export interface ITableColumnDeletionOptions {
    blockId: string;
    colIndex: number;
    isUndoRedoAction?: boolean
}

export interface ITableCellsClearOperation {
    blockId: string;
    cells: Array<{ dataRow: number; dataCol: number; prevBlocks: BlockModel[] }>
}

export type RowMeta = { index: number; rowModel: TableRowModel };
export interface IBulkRowsDeleteOperation {
    blockId: string;
    rows: Array<RowMeta>;
}

export type ColMeta = { index: number; columnModel: TableColumnModel; columnCells: TableCellModel[] };
export interface IBulkColumnsDeleteOperation {
    blockId: string;
    cols: Array<ColMeta>;
}

export type PastedCellContext = { dataRow: number; dataCol: number; oldBlocks: BlockModel[]; newBlocks: BlockModel[] };
export interface ITableCellsPasteOperation {
    blockId: string;
    cells: Array<PastedCellContext>
    structureDelta?: { rowsAdded?: number[]; colsAdded?: number[] }
    focus?: { row: number; col: number }
}

export interface ITableHeaderInputOperation {
    blockId: string;
    oldColumns: TableColumnModel[]
    updatedColumns: TableColumnModel[]
}

export type TableClipboardMode = 'cells' | 'table';

export interface TableClipboardMeta {
    rows: number;
    cols: number;
    enableHeader: boolean;
    enableRowNumbers: boolean;
}

export interface TableClipboardPayload {
    type: 'table';
    mode: TableClipboardMode;
    meta: TableClipboardMeta;
    // Whole table copy
    table?: { props: ITableBlockSettings };
    // Cells/columns data payload: matrix of cells with BlockModel[] (by row, by col)
    cells?: BlockModel[][][];
}

export interface TableContext {
    tableBlockEl: HTMLElement
    tableEl: HTMLTableElement
    props: ITableBlockSettings
    startDataRow: number
    startDataCol: number
}
