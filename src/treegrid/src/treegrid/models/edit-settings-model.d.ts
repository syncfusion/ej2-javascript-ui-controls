import { ChildProperty, Property } from '@syncfusion/ej2-base';import { EditMode, RowPosition } from '../enum';import { IDialogUI } from '@syncfusion/ej2-grids';

/**
 * Interface for a class EditSettings
 */
export interface EditSettingsModel {

    /**
     * Enables the ability to add new records to the TreeGrid when set to `true`.
     * This allows users to insert new rows into the data set.
     *
     * @default false
     */
    allowAdding?: boolean;

    /**
     * Permits updating values in existing records if set to `true`.
     * This setting allows inline modification of data cells within the TreeGrid.
     *
     * @default false
     */
    allowEditing?: boolean;

    /**
     * Allows removal of records from the TreeGrid when set to `true`.
     * Users can delete rows from the data set, reflecting changes immediately.
     *
     * @default false
     */
    allowDeleting?: boolean;

    /**
     * Specifies the editing mode for the TreeGrid. Available modes include:
     * * `Cell`: Enables individual cell editing.
     * * `Row`: Allows entire row editing at once.
     * * `Dialog`: Opens a dialog for row editing.
     * * `Batch`: Supports batch editing of cells across multiple rows. Changes are not immediately saved but can be committed all at once, enhancing efficiency in bulk data edits.
     *
     * @default Cell
     * @isEnumeration true
     */
    mode?: EditMode;

    /**
     * Determines the position where new rows are added within the TreeGrid. Options are:
     * * `Top`: Adds new rows at the top of the grid.
     * * `Bottom`: Adds new rows at the bottom of the grid.
     * * `Above`: Inserts a new row above the selected row.
     * * `Below`: Adds a new row below the selected row.
     * * `Child`: Inserts a new row as a child of the currently selected row.
     *
     * @default Top
     */
    newRowPosition?: RowPosition;

    /**
     * If set to `false`, prevents editing on a row double-click, allowing edits through other triggers only.
     *
     * @default true
     */
    allowEditOnDblClick?: boolean;

    /**
     * Controls the display of a confirmation dialog when batch changes are either applied or discarded.
     * Set to `false` to suppress the display of this confirmation prompt.
     *
     * @default true
     */
    showConfirmDialog?: boolean;

    /**
     * If set to `true`, a confirmation dialog appears before record deletion, allowing users to confirm or cancel the operation.
     *
     * @default false
     */
    showDeleteConfirmDialog?: boolean;

    /**
     * Provides a template for custom editing elements within the dialog, supporting both HTML strings and functions.
     *
     * @default ''
     * @aspType string
     */
    template?: string | Function;

    /**
     * Specifies the parameters for customizing the edit dialog, allowing the configuration of elements and behavior.
     *
     * @default {}
     */
    dialog?: IDialogUI;

    /**
     * Enables continued editing in subsequent rows when navigating with keyboard shortcuts if set to `true`.
     *
     * @default false
     */
    allowNextRowEdit?: boolean;

}