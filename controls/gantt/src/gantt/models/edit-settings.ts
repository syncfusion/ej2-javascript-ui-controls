import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { EditMode, RowPosition  } from '../base/enum';

/**
 * Configures edit settings of Gantt.
 */
export class EditSettings extends ChildProperty<EditSettings> {
    /**
     * If `allowEditing` is set to true, values can be updated in the existing record.
     *
     * @default false
     */
    @Property(false)
    public allowEditing: boolean;

    /**
     * If `allowAdding` is set to true, new records can be added to the Gantt.
     *
     * @default false
     */
    @Property(false)
    public allowAdding: boolean;

    /**
     * If `allowDeleting` is set to true, existing record can be deleted from the Gantt.
     *
     * @default false
     */
    @Property(false)
    public allowDeleting: boolean;

    /**
     * Defines edit mode in Gantt.
     * * `Auto` - Defines cell edit mode in grid side and dialog mode in chart side.
     * * `Dialog` - Defines dialog edit mode on both sides.
     *
     * @default Auto
     * @isEnumeration true
     * @asptype EditMode
     */
    @Property('Auto')
    public mode: EditMode;

    /**
     * Defines the row position for new records. The available row positions are:
     * * Top
     * * Bottom
     * * Above
     * * Below
     * * Child
     *
     * @default Top
     */
    @Property('Top')
    public newRowPosition: RowPosition;

    /**
     * If `showDeleteConfirmDialog` is set to true, confirm dialog will show delete action. You can also cancel delete command.
     *
     * @default false
     */
    @Property(false)
    public showDeleteConfirmDialog: boolean;

    /**
     * Enable or disable the taskbar editing, such as updating start date, end date,
     * progress and dependency tasks values, through user interaction.
     *
     * @default false
     */
    @Property(false)
    public allowTaskbarEditing: boolean;
    /**
     * If `allowNextRowEdit` is set as true, editing is continued to next row with keyboard navigation.
     *
     * @default false
     */
    @Property(false)
    public allowNextRowEdit : boolean;
}
