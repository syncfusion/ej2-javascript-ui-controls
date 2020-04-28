import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { DialogFieldsModel } from './dialog-fields-model';
import { DialogModel } from '@syncfusion/ej2-popups';

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
     * @deprecated
     * @default null
     */
    @Property(null)
    public model: DialogModel;

}
