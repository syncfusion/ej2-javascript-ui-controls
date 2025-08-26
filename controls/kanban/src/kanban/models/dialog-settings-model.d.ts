import { Property, ChildProperty } from '@syncfusion/ej2-base';import { DialogFieldsModel } from './dialog-fields-model';import { KanbanDialogModel } from './kanban-dialog-model';

/**
 * Interface for a class DialogSettings
 */
export interface DialogSettingsModel {

    /**
     * Defines the dialog template
     *
     * @default null
     * @aspType string
     */
    template?: string | Function;

    /**
     * Defines the dialog fields
     *
     * @default []
     */
    fields?: DialogFieldsModel[];

    /**
     * Customize the model object configuration for the edit or add Dialog of Kanban.
     *
     * @default null
     */
    model?: KanbanDialogModel;

}