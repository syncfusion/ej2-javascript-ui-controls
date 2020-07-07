import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SortDirection, SortOrderBy } from '../base/type';

/**
 * Interface for a class SortSettings
 */
export interface SortSettingsModel {

    /**
     * Sort the cards. The possible values are:
     * * DataSourceOrder
     * * Index
     * * Custom
     * @deprecated
     * @default 'DataSourceOrder'
     */
    sortBy?: SortOrderBy;

    /**
     * Defines the sort field
     * @deprecated
     * @default null
     */
    field?: string;

    /**
     * Sort the cards. The possible values are:
     * * Ascending
     * * Descending
     * @deprecated
     * @default 'Ascending'
     */
    direction?: SortDirection;

}