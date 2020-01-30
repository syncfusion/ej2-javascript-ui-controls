import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SortType } from '../base/type';

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
     */
    template?: string;

    /**
     * Sort the swimlane resources in ascending or descending order.
     * @default 'Ascending'
     */
    sortBy?: SortType;

}