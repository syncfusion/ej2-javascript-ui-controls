import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SelectionMode, CellSelectionMode, SelectionType, CheckboxSelectionType } from '@syncfusion/ej2-grids';

/**
 * Configures the selection behavior of the TreeGrid.
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**
     * Specifies the selection mode for the TreeGrid, which supports row, cell, and both (row and cell) selection modes.
     * * `Row`: Selects the entire row.
     * * `Cell`: Selects a single cell.
     * * `Both`: Selects the entire row and its cells.
     *
     * @default Syncfusion.EJ2.Grids.SelectionMode.Row
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.SelectionMode
     */
    @Property('Row')
    public mode: SelectionMode;

    /**
     * Determines the mode for cell selection, available options are flow and box.
     * Requires the selection `mode` to be either cell or both.
     * * `Flow`: Selects the range between start and end indexes, including other cells of selected rows.
     * * `Box`: Selects cells within the start and end column indexes within the selected rows.
     *
     * @default Syncfusion.EJ2.Grids.CellSelectionMode.Flow
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.CellSelectionMode
     */
    @Property('Flow')
    public cellSelectionMode: CellSelectionMode;

    /**
     * Defines the selection type, specifying whether single or multiple selections are allowed.
     * * `Single`: Allows selection of only a single row or cell.
     * * `Multiple`: Allows selection of multiple rows or cells.
     *
     * @default Syncfusion.EJ2.Grids.SelectionType.Single
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.SelectionType
     */
    @Property('Single')
    public type: SelectionType;

    /**
     * When set to true, the TreeGrid selection persists even during various grid operations such as sorting or paging.
     * Requires at least one column to be configured as the primary key for persistence.
     *
     * @default false
     */
    @Property(false)
    public persistSelection: boolean;

    /**
     * Specifies the mode for checkbox selection:
     * * `Default`: Allows selection of multiple rows by clicking on each row individually.
     * * `ResetOnRowClick`: Resets prior selection when a new row is clicked. Multiple rows can be selected using CTRL or SHIFT keys.
     *
     * @default Syncfusion.EJ2.Grids.CheckboxSelectionType.Default
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.CheckboxSelectionType
     */
    @Property('Default')
    public checkboxMode: CheckboxSelectionType;

    /**
     * If set to true, TreeGrid selection is allowed only through checkboxes. Ensure the column type is set to `checkbox` to enable this mode.
     *
     * @default false
     */
    @Property(false)
    public checkboxOnly: boolean;

    /**
     * Enables toggling of the selected row. When true, users can toggle the selection of a row.
     *
     * @default true
     */
    @Property(true)
    public enableToggle: boolean;
}
