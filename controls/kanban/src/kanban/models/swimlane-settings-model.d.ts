import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SortComparerFunction } from '../base/interface';import { SortDirection } from '../base/type';

/**
 * Interface for a class SwimlaneSettings
 */
export interface SwimlaneSettingsModel {

    /**
     * Defines the swimlane key field
     *
     * @default null
     */
    keyField?: string;

    /**
     * Defines the swimlane header text field
     *
     * @default null
     */
    textField?: string;

    /**
     * Enable or disable empty swimlane
     *
     * @default false
     */
    showEmptyRow?: boolean;

    /**
     * Enable or disable items count
     *
     * @default true
     */
    showItemCount?: boolean;

    /**
     * Enable or disable the card drag and drop actions
     *
     * @default false
     */
    allowDragAndDrop?: boolean;

    /**
     * Defines the swimlane row template
     *
     * @default null
     */
    template?: string;

    /**
     * Sort the swimlane resources. The possible values are:
     * * Ascending
     * * Descending
     *
     * @default 'Ascending'
     */
    sortDirection?: SortDirection;

    /**
     * Defines the custom sort comparer function.
     * The sort comparer function has the same functionality like
     * [`Array.sort`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) sort comparer.
     *
     * @default null
     */
    sortComparer?: SortComparerFunction;

    /**
     * Enable or disable unassigned swimlane group
     *
     * @default true
     */
    showUnassignedRow?: boolean;

    /**
     * Enables or disables the freeze the swimlane rows
     *
     * @default false
     */
    enableFrozenRows?: boolean;

}