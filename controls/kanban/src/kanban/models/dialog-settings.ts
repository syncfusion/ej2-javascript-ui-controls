import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { DialogFieldsModel } from './dialog-fields-model';
import { KanbanDialogModel } from './kanban-dialog-model';

/**
 * Holds the configuration of editor settings.
 */
export class DialogSettings extends ChildProperty<DialogSettings> {
    /**
     * Defines the dialog template
     * @deprecated
     * @default null
     */
    @Property()
    public template: string;

    /**
     * Defines the dialog fields
     * @deprecated
     * @default []
     */
    @Property([])
    public fields: DialogFieldsModel[];

    /**
     * Customize the model object configuration for the edit or add Dialog component.
     * @default null
     */
    @Property(null)
    public model: KanbanDialogModel;
}
