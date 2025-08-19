import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SelectionMode, CellSelectionMode, SelectionType } from '@syncfusion/ej2-grids';

/**
 * Interface for a class SelectionSettings
 */
export interface SelectionSettingsModel {

    /**
     * Defines the selection mode for the Gantt. It supports row, cell, and both (row and cell) selection modes.
     *
     * - `Row`: Selects entire rows.
     * - `Cell`: Selects individual cells.
     * - `Both`: Allows selection of both rows and cells.
     *
     * @default Syncfusion.EJ2.Grids.SelectionMode.Row
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.SelectionMode
     */
    mode?: SelectionMode;

    /**
     * To define selection mode of cell.
     *
     * @default Syncfusion.EJ2.Grids.CellSelectionMode.Flow
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.CellSelectionMode
     */
    cellSelectionMode?: CellSelectionMode;

    /**
     * Defines the selection type for rows or cells.
     * * `Single`: Allows only a single row or cell to be selected at a time.
     * * `Multiple`: Allows multiple rows or cells to be selected simultaneously.
     *
     * @default Syncfusion.EJ2.Grids.SelectionType.Single
     * @aspDefaultValueIgnore
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.SelectionType
     */
    type?: SelectionType;

    /**
     * If 'persistSelection' set to true, then the Gantt selection is persisted on all operations.
     *
     * @default false
     */
    persistSelection?: boolean;

    /**
     * If 'enableToggle' set to true, then the user can able to perform toggle for the selected row.
     *
     * @default false
     */
    enableToggle?: boolean;

}