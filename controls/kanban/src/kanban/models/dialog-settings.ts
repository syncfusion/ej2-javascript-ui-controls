import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { DialogFieldsModel } from './dialog-fields-model';

/**
 * Holds the configuration of editor settings.
 */

export class DialogSettings extends ChildProperty<DialogSettings> {
    /**
     * Defines the dialog template
     * @default null
     */
    @Property()
    public template: string;

    /**
     * Defines the dialog fields
     * @default []
     */
    @Property([])
    public fields: DialogFieldsModel[];

}
