import { ChildProperty, Property } from '@syncfusion/ej2-base';import { EditMode, RowPosition } from '../enum';import { IDialogUI } from '@syncfusion/ej2-grids';

/**
 * Interface for a class EditSettings
 */
export interface EditSettingsModel {

    /**
     * If `allowAdding` is set to true, new records can be added to the TreeGrid.  

     */
    allowAdding?: boolean;

    /**
     * If `allowEditing` is set to true, values can be updated in the existing record.  

     */
    allowEditing?: boolean;

    /**
     * If `allowDeleting` is set to true, existing record can be deleted from the TreeGrid.    

     */
    allowDeleting?: boolean;

    /**
     * Defines the mode to edit. The available editing modes are:
     * * Cell
     * * Row
     * * Dialog
     * * Batch


     */
    mode?: EditMode;

    /**
     * Defines the row position for new records. The available row positions are:
     * * Top
     * * Bottom
     * * Above
     * * Below
     * * Child

     */
    newRowPosition?: RowPosition;

    /**
     * If `allowEditOnDblClick` is set to false, TreeGrid will not allow editing of a record on double click. 

     */
    allowEditOnDblClick?: boolean;

    /**
     * if `showConfirmDialog` is set to false, confirm dialog does not show when batch changes are saved or discarded.

     */
    showConfirmDialog?: boolean;

    /**
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.

     */
    showDeleteConfirmDialog?: boolean;

    /**
     * Defines the custom edit elements for the dialog template.

     */
    template?: string;

    /**
     * Defines the dialog params to edit.

     */
    dialog?: IDialogUI;

}