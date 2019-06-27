import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SelectionMode, CellSelectionMode, SelectionType } from '@syncfusion/ej2-grids';

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Gantt supports row, cell, and both (row and cell) selection mode. 
     * @default Row
     * @aspDefaultValueIgnore
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.SelectionMode
     */
    mode?: SelectionMode;

    /**
     * To define selection mode of cell.
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.CellSelectionMode
     */
    cellSelectionMode?: CellSelectionMode;

    /**
     * Defines options for selection type. They are
     * * `Single`: Allows selection of only a row or a cell.
     * * `Multiple`: Allows selection of multiple rows or cells.
     * @default Single
     * @aspDefaultValueIgnore
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.SelectionType
     */
    type?: SelectionType;

    /**
     * If 'persistSelection' set to true, then the Gantt selection is persisted on all operations.
     * @default false
     */
    persistSelection?: boolean;

}