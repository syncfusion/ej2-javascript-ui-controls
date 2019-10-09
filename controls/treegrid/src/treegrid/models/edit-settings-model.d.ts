import { ChildProperty, Property } from '@syncfusion/ej2-base';import { EditMode, RowPosition } from '../enum';import { IDialogUI } from '@syncfusion/ej2-grids';

/**
 * Interface for a class EditSettings
 */
export interface EditSettingsModel {

    /**
     * If `allowAdding` is set to true, new records can be added to the TreeGrid.  
     * @default false 
     */
    allowAdding?: boolean;

    /**
     * If `allowEditing` is set to true, values can be updated in the existing record.  
     * @default false 
     */
    allowEditing?: boolean;

    /**
     * If `allowDeleting` is set to true, existing record can be deleted from the TreeGrid.    
     * @default false 
     */
    allowDeleting?: boolean;

    /**
     * Defines the mode to edit. The available editing modes are:
     * * Cell
     * * Row
     * * Dialog
     * * Batch
     * @default Cell 
     * @isEnumeration true
     */
    mode?: EditMode;

    /**
     * Defines the row position for new records. The available row positions are:
     * * Top
     * * Bottom
     * * Above
     * * Below
     * * Child
     * @default Top 
     */
    newRowPosition?: RowPosition;

    /**
     * If `allowEditOnDblClick` is set to false, TreeGrid will not allow editing of a record on double click. 
     * @default true 
     */
    allowEditOnDblClick?: boolean;

    /**
     * if `showConfirmDialog` is set to false, confirm dialog does not show when batch changes are saved or discarded.
     * @default true 
     */
    showConfirmDialog?: boolean;

    /**
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.
     * @default false 
     */
    showDeleteConfirmDialog?: boolean;

    /**
     * Defines the custom edit elements for the dialog template.
     * @default ''
     */
    template?: string;

    /**
     * Defines the dialog params to edit.
     * @default {}
     */
    dialog?: IDialogUI;

}