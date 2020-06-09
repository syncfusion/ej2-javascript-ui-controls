import { Property, ChildProperty } from '@syncfusion/ej2-base';import { DialogFieldsModel } from './dialog-fields-model';import { KanbanDialogModel } from './kanban-dialog-model';

/**
 * Interface for a class DialogSettings
 */
export interface DialogSettingsModel {

    /**
     * Defines the dialog template
     * @deprecated
     * @default null
     */
    template?: string;

    /**
     * Defines the dialog fields
     * @deprecated
     * @default []
     */
    fields?: DialogFieldsModel[];

    /**
     * Customize the model object configuration for the edit or add Dialog component.
     * @default null
     */
    model?: KanbanDialogModel;

}