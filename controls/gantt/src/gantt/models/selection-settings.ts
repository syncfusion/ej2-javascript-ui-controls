import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SelectionMode, CellSelectionMode, SelectionType } from '@syncfusion/ej2-grids';

/**
 * Configures the selection behavior of the Gantt.
 */
export class SelectionSettings extends ChildProperty<SelectionSettings> {
    /**
     * Gantt supports row, cell, and both (row and cell) selection mode.
     *
     * @default Syncfusion.EJ2.Grids.SelectionMode.Row
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.SelectionMode
     */
    @Property('Row')
    public mode: SelectionMode;

    /**
     * To define selection mode of cell.
     *
     * @default Syncfusion.EJ2.Grids.CellSelectionMode.Flow
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.CellSelectionMode
     */
    @Property('Flow')
    public cellSelectionMode: CellSelectionMode;

    /**
     * Defines options for selection type. They are
     * * `Single`: Allows selection of only a row or a cell.
     * * `Multiple`: Allows selection of multiple rows or cells.
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
