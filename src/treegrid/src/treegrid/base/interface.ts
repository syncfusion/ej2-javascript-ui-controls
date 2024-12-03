import { Column } from '../models/column';
import { SaveEventArgs, DataStateChangeEventArgs as GridDataStateChangeEventArgs, ExcelExportProperties, RowDragEventArgs as GridRowDragEventArgs } from '@syncfusion/ej2-grids';
import { PdfExportProperties } from '@syncfusion/ej2-grids';
/**
 * Specifies FlatData interfaces.
 *
 * @hidden
 */
export interface ITreeData {
    /**
     * Specifies the childRecords of a parentData
     */
    childRecords?: ITreeData[];
    /**
     * Specifies whether the record contains child records
     */
    hasChildRecords?: boolean;
    /**
     * Specifies whether the record contains filtered child records
     */
    hasFilteredChildRecords?: boolean;
    /**
     * Specifies whether the child records are expanded
     */
    expanded?: boolean;
    /**
     * Specifies the parentItem of childRecords
     */
    parentItem?: ITreeData;
    /**
     * Specifies the index of current record
     */
    index?: number;
    /**
     * Specifies the hierarchy level of record
     */
    level?: number;
    /**
     * Specifies the hierarchy level of filtered record
     */
    filterLevel?: number;
    /**
     * Specifies the parentID
     */
    //parentIdMapping?: number;
    /**
     * Specifies the unique ID of a record
     */
    uniqueID?: string;
    /**
     * Specifies the parent Unique ID of a record
     */
    parentUniqueID?: string;
    /**
     * Specifies the checkbox state of a record
     */
    checkboxState?: string;
    /**
     * Specifies the summary of a record
     */
    isSummaryRow?: boolean;
    /**
     * Specifies the main data
     */
    taskData?: ITreeData;
    /**
     * Specifies the Primary data
     */
    primaryParent?: ITreeData;
}

/** Specifies the Tree Grid ExcelExport properties */
export interface TreeGridExcelExportProperties extends ExcelExportProperties {
    /** Specifies the collapsed state persistence in exported file */
    isCollapsedStatePersist: boolean;
}

/** Specifies the Tree Grid PdfExport properties */
export interface TreeGridPdfExportProperties extends PdfExportProperties {
    /** Specifies the collapsed state persistence in exported file */
    isCollapsedStatePersist: boolean;
}

export interface AggregateTemplateContext {
    /** Gets sum aggregate value */
    sum: string;
    /** Gets average aggregate value */
    average: string;
    /** Gets maximum aggregate value */
    max: string;
    /** Gets minimum aggregate value */
    min: string;
    /** Gets count aggregate value */
    count: string;
    /** Gets true count aggregate value */
    trueCount: string;
    /** Specifies false count aggregate value */
    falseCount: string;
    /** Gets custom aggregate value */
    custom: string;
    /** Gets the current group field name */
    field?: string;
    /** Gets header text of the grouped column */
    headerText?: string;
    /** Gets grouped data key value */
    key?: string;
}

/**
 * @hidden
 */
export interface ITreeGridCellFormatter {
    getValue(column: Column, data: Object): Object;
}
export interface RowExpandedEventArgs {
    /**
     * Defines the parent row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
}
export interface RowExpandingEventArgs {
    /**
     * Defines the parent row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
    /** Cancel the row expanding action */
    cancel?: boolean;
    /** Provides an option to ExpandAll the nested parent rows of the current row. */
    expandAll?: boolean
}
export interface RowCollapsedEventArgs {
    /**
     * Defines the parent row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
}
export interface RowCollapsingEventArgs {
    /**
     * Defines the parent row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
    /** Cancel the row collapsing action */
    cancel?: boolean;
    /** Provides an option to CollapseAll the nested parent rows of the current row. */
    collapseAll?: boolean
}
export interface CellSaveEventArgs extends SaveEventArgs {
    /** Defines edited column */
    column?: Column;
}
export interface DataStateChangeEventArgs extends GridDataStateChangeEventArgs {
    /** Defines the child records for the respective parent row */
    childData? : ITreeData[];
    /**
     * Defines the parent row data.
     *
     * @isGenericType true
     */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
    /** Cancel the row expanding action */
    cancel?: boolean;
    /** Defines the expand or collapse request for the parent record. */
    requestType?: string;
    /** Defines the resolve function for the promise. */
    childDataBind?: Function;
}
export interface RowDragEventArgs extends GridRowDragEventArgs {
    dropPosition: string;
}
