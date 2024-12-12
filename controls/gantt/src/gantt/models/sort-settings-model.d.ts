import { ChildProperty, Property, Collection } from '@syncfusion/ej2-base';import { SortDirection } from '../base/enum';

/**
 * Interface for a class SortDescriptor
 */
export interface SortDescriptorModel {

    /**
     * Defines the field (column) name to sort by.
     *
     * @default ''
     */
    field?: string;

    /**
     * Defines the direction of the sort operation.
     * * `Ascending`: Sorts the column in ascending order.
     * * `Descending`: Sorts the column in descending order.
     *
     * @default null
     * @isEnumeration true
     * @asptype SortDirection
     *
     */
    direction?: SortDirection;

}

/**
 * Interface for a class SortSettings
 */
export interface SortSettingsModel {

    /**
     * Specifies the columns to sort by when the Gantt chart is initially rendered.
     * It also allows access to the currently sorted columns.
     *
     * @default []
     */
    columns?: SortDescriptorModel[];

    /**
     * If `allowUnsort` set to false, the user can not get the Tree grid in unsorted state by clicking the sorted column header.
     *
     * @default true
     */
    allowUnsort?: boolean;

}