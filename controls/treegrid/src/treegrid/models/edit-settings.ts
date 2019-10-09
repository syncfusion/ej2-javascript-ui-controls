import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { EditMode, RowPosition } from '../enum';
import { IDialogUI } from '@syncfusion/ej2-grids';

/**   
 * Configures the edit behavior of the TreeGrid.    
 */
export class EditSettings extends ChildProperty<EditSettings> {
    /**   
     * If `allowAdding` is set to true, new records can be added to the TreeGrid.  
     * @default false 
     */
    @Property(false)
    public allowAdding: boolean;

    /**   
     * If `allowEditing` is set to true, values can be updated in the existing record.  
     * @default false 
     */
    @Property(false)
    public allowEditing: boolean;

    /**   
     * If `allowDeleting` is set to true, existing record can be deleted from the TreeGrid.    
     * @default false 
     */
    @Property(false)
    public allowDeleting: boolean;

    /**   
     * Defines the mode to edit. The available editing modes are:
     * * Cell
     * * Row
     * * Dialog
     * * Batch
     * @default Cell 
     * @isEnumeration true
     */
    @Property('Cell')
    public mode: EditMode;
    /**   
     * Defines the row position for new records. The available row positions are:
     * * Top
     * * Bottom
     * * Above
     * * Below
     * * Child
     * @default Top 
     */
    @Property('Top')
    public newRowPosition: RowPosition;
    /**   
     * If `allowEditOnDblClick` is set to false, TreeGrid will not allow editing of a record on double click. 
     * @default true 
     */
    @Property(true)
    public allowEditOnDblClick: boolean;

    /**   
     * if `showConfirmDialog` is set to false, confirm dialog does not show when batch changes are saved or discarded.
     * @default true 
     */
    @Property(true)
    public showConfirmDialog: boolean;

    /**   
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.
     * @default false 
     */
    @Property(false)
    public showDeleteConfirmDialog: boolean;

    /**
     * Defines the custom edit elements for the dialog template.
     * @default ''
     */
    @Property('')
    public template: string;

    /**   
     * Defines the dialog params to edit.
     * @default {}
     */
    @Property({})
    public dialog: IDialogUI;
}