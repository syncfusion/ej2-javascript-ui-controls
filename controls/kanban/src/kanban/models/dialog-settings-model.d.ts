import { Property, ChildProperty } from '@syncfusion/ej2-base';import { DialogFieldsModel } from './dialog-fields-model';

/**
 * Interface for a class DialogSettings
 */
export interface DialogSettingsModel {

    /**
     * Defines the dialog template
     * @default null
     */
    template?: string;

    /**
     * Defines the dialog fields
     * @default []
     */
    fields?: DialogFieldsModel[];

}