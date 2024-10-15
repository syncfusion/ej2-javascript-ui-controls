import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { DialogFieldsModel } from './dialog-fields-model';
import { KanbanDialogModel } from './kanban-dialog-model';

/**
 * Holds the configuration of editor settings.
 */
export class DialogSettings extends ChildProperty<DialogSettings> {

    /**
     * Defines the dialog template
     *
     * @default null
     * @aspType string
     */
    @Property()
    public template: string | Function;

    /**
     * Defines the dialog fields
     *
     * @default []
     */
    @Property([])
    public fields: DialogFieldsModel[];

    /**
     * Customize the model object configuration for the edit or add Dialog of Kanban.
     *
     * @default null
     */
    @Property(null)
    public model: KanbanDialogModel;

}
