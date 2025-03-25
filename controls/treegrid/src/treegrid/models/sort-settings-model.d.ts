import { ChildProperty, Property, Collection } from '@syncfusion/ej2-base';import { SortDirection } from '@syncfusion/ej2-grids';

/**
 * Interface for a class SortDescriptor
 */
export interface SortDescriptorModel {

    /**
     * Specifies the field name of the column to be sorted.
     *
     * @default ''
     */
    field?: string;

    /**
     * Specifies the direction of sorting for the column. The available options are:
     * * `Ascending`: Sorts the column in ascending order.
     * * `Descending`: Sorts the column in descending order.
     *
     * @default ''
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Grids.SortDirection
     */
    direction?: SortDirection;

}

/**
 * Interface for a class SortSettings
 */
export interface SortSettingsModel {

    /**
     * Specifies the columns to be sorted at initial rendering of the TreeGrid.
     * This property can also be used to get or modify the currently sorted columns at runtime.
     *
     * @default []
     */
    columns?: SortDescriptorModel[];

    /**
     * If set to false, the user cannot reset the TreeGrid to an unsorted state by clicking on the sorted column header.
     * When true, clicking an already sorted column header will toggle the sort direction or remove sorting.
     *
     * @default true
     */
    allowUnsort?: boolean;

}