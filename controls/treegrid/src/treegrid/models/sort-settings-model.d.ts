import { ChildProperty, Property, Collection } from '@syncfusion/ej2-base';import { SortDirection } from '@syncfusion/ej2-grids';

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
     * @isEnumeration true
     * @blazorDefaultValueIgnore
     * @aspType Syncfusion.EJ2.Grids.SortDirection
     * @blazorType Syncfusion.Blazor.Grids.SortDirection
     */
    direction?: SortDirection;

}

/**
 * Interface for a class SortSettings
 */
export interface SortSettingsModel {

    /**
     * Specifies the columns to sort at initial rendering of TreeGrid.
     * Also user can get current sorted columns. 
     * @default []
     */
    columns?: SortDescriptorModel[];

    /**
     * If `allowUnsort` set to false the user can not get the TreeGrid in unsorted state by clicking the sorted column header.
     * @default true
     */
    allowUnsort?: boolean;

}