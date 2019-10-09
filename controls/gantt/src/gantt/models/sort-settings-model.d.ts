import { ChildProperty, Property, Collection } from '@syncfusion/ej2-base';import { SortDirection } from '../base/enum';

/**
 * Interface for a class SortDescriptor
 */
export interface SortDescriptorModel {

    /**
     * Defines the field name of sort column. 
     * @default ''
     */
    field?: string;

    /**
     * Defines the direction of sort column. 
     * @default ''
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @isEnumeration true
     * 
     */
    direction?: SortDirection;

}

/**
 * Interface for a class SortSettings
 */
export interface SortSettingsModel {

    /**
     * Specifies the columns to sort at initial rendering of Gantt.
     * Also user can get current sorted columns.
     * @default []
     */
    columns?: SortDescriptorModel[];

    /**
     * If `allowUnsort` set to false the user can not get the Tree grid in unsorted state by clicking the sorted column header.
     * @default true
     */
    allowUnsort?: boolean;

}