import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SelectionMode, CellSelectionMode, SelectionType, CheckboxSelectionType } from '@syncfusion/ej2-grids';

/**
 * Configures the selection behavior of the TreeGrid.
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**
     * TreeGrid supports row, cell, and both (row and cell) selection mode.
     * ```props
     * * Row :- Selects the entire row.
     * * Cell :- Selects the cell alone.
     * * Both :- Selects the entire row and its cell.
     * ```
     *
     * @default Syncfusion.EJ2.Grids.SelectionMode.Row
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.SelectionMode
     */
    @Property('Row')
    public mode: SelectionMode;

    /**
     * The cell selection modes are flow and box. It requires the selection
     * [`mode`](#mode) to be either cell or both.
     * ```props
     * * Flow :- Selects the range of cells between start index and end index that also includes the other cells of the selected rows.
     * * Box :- Selects the range of cells within the start and end column indexes that includes in between cells of rows within the range.
     * ```
     *
     * @default Syncfusion.EJ2.Grids.CellSelectionMode.Flow
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.CellSelectionMode
     */
    @Property('Flow')
    public cellSelectionMode: CellSelectionMode;

    /**
     * Defines options for selection type. They are
     * ```props
     * * Single :- Allows selection of only a row or a cell.
     * * Multiple :- Allows selection of multiple rows or cells.
     * ```
     *
     * @default Syncfusion.EJ2.Grids.SelectionType.Single
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.SelectionType
     */
    @Property('Single')
    public type: SelectionType;

    /**
     * If 'persistSelection' set to true, then the TreeGrid selection is persisted on all operations.
     * For persisting selection in the TreeGrid, any one of the column should be enabled as a primary key.
     *
     * @default false
     */
    @Property(false)
    public persistSelection: boolean;
    /**
     * Defines options for checkbox selection Mode. They are
     * ```props
     * * Default :- This is the default value of the checkboxMode. In this mode, user can select multiple rows by clicking rows one by one.
     * * ResetOnRowClick :- In ResetOnRowClick mode, on clicking a row it will reset previously selected row and also multiple.
     * ```
     *  rows can be selected by using CTRL or SHIFT key.
     *
     * @default Syncfusion.EJ2.Grids.CheckboxSelectionType.Default
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.CheckboxSelectionType
     */
    @Property('Default')
    public checkboxMode: CheckboxSelectionType;
    /**
     * If 'checkboxOnly' set to true, then the TreeGrid selection is allowed only through checkbox.
     *
     * > To enable checkboxOnly selection, should specify the column type as `checkbox`.
     *
     * @default false
     */
    @Property(false)
    public checkboxOnly: boolean;
    /**
     * If ‘enableToggle’ set to true, then the user can able to perform toggle for the selected row.
     *
     * @default true
     */
    @Property(true)
    public enableToggle: boolean;
}
