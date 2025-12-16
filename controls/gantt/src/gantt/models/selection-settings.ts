import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SelectionMode, CellSelectionMode, SelectionType } from '@syncfusion/ej2-grids';

/**
 * Configures the selection behavior of the Gantt.
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {
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
    @Property('Row')
    public mode: SelectionMode;

    /**
     * The cell selection modes are flow and box. It requires the selection `mode` to be either cell or both.
     * * `Flow`: Selects the range of cells between start index and end index that also includes the other cells of the selected rows.
     * * `Box`: Selects the range of cells within the start and end column indexes that includes in between cells of rows within the range.
     * * `BoxWithBorder`: Selects the range of cells as like Box mode with borders.
     *
     * The supported cell selection modes are defined in the [CellSelectionMode](../grid/cellselectionmode) enumeration.
     * @default Syncfusion.EJ2.Grids.CellSelectionMode.Flow
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.CellSelectionMode
     */
    @Property('Flow')
    public cellSelectionMode: CellSelectionMode;

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
    @Property('Single')
    public type: SelectionType;

    /**
     * If 'persistSelection' set to true, then the Gantt selection is persisted on all operations.
     *
     * @default false
     */
    @Property(false)
    public persistSelection: boolean;

    /**
     * If 'enableToggle' set to true, then the user can able to perform toggle for the selected row.
     *
     * @default false
     */
    @Property(false)
    public enableToggle: boolean;
}
