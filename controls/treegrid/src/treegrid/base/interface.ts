import { Column } from '../models/column';
import { SaveEventArgs } from '@syncfusion/ej2-grids';
/**
 * Specifies FlatData interfaces.
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
     * Specifies the index of parent record
     */
    parentIndex?: number;
    /**
     * Specifies the index of current record
     */
    index?: number;
    /**
     * Specifies the filtered index of current record
     */
    filterIndex?: number;
    /**
     * Specifies the filtered root index of current record
     */
    filterRootIndex?: number;
   /**
    * Specifies the root index of current record
    */
    rootIndex?: number;
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
    parentIdMapping?: number;
    /**
     * Specifies the unique ID of a record
     */
    uniqueID?: string;
    /**
     * Specifies the parent Unique ID of a record
     */
    parentUniqueID?: string;

}

export interface ITreeGridCellFormatter {
    getValue(column: Column, data: Object): Object;
}
export interface RowExpandedEventArgs {
    /** Defines the parent row data. */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
}
export interface RowExpandingEventArgs {
    /** Defines the parent row data. */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
    /** Cancel the row expanding action */
    cancel?: boolean;
}
export interface RowCollapsedEventArgs {
    /** Defines the parent row data. */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
}
export interface RowCollapsingEventArgs {
    /** Defines the parent row data. */
    data?: Object;
    /** Defines the parent row element. */
    row?: HTMLTableRowElement;
    /** Cancel the row collapsing action */
    cancel?: boolean;
}
export interface CellSaveEventArgs extends SaveEventArgs {
    /** Defines edited column */
    column?: Column;
}