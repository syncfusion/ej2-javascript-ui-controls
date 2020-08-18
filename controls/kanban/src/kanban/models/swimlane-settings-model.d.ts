import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SortDirection } from '../base/type';

/**
 * Interface for a class SwimlaneSettings
 */
export interface SwimlaneSettingsModel {

    /**
     * Defines the swimlane key field
     * @default null
     */
    keyField?: string;

    /**
     * Defines the swimlane header text field
     * @default null
     */
    textField?: string;

    /**
     * Enable or disable empty swimlane
     * @default false
     */
    showEmptyRow?: boolean;

    /**
     * Enable or disable items count
     * @default true
     */
    showItemCount?: boolean;

    /**
     * Enable or disable the card drag and drop actions
     * @default false
     */
    allowDragAndDrop?: boolean;

    /**
     * Defines the swimlane row template
     * @default null
     * @deprecated
     */
    template?: string;

    /**
     * Sort the swimlane resources. The possible values are:
     * * Ascending
     * * Descending
     * @default 'Ascending'
     */
    sortDirection?: SortDirection;

    /**
     * Enable or disable unassigned swimlane group
     * @default true
     * @deprecated
     */
    showUnassignedRow?: boolean;

}