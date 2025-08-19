import { Property, ChildProperty } from '@syncfusion/ej2-base';import { PageSizeMode } from '../enum';

/**
 * Interface for a class PageSettings
 */
export interface PageSettingsModel {

    /**
     * Specifies the number of records to display per page in the TreeGrid. Adjust this setting to control the volume of data presented on each page.
     *
     * @default 12
     */
    pageSize?: number;

    /**
     * Determines the number of page numbers displayed in the TreeGrid pager container. This setting helps users navigate between different parts of the dataset.
     *
     * @default 8
     */
    pageCount?: number;

    /**
     * Sets the current page number in the TreeGrid, defining which page of data is initially displayed to users.
     *
     * @default 1
     */
    currentPage?: number;

    /**
     * @hidden
     * Retrieves the total number of records in the TreeGrid. This property is primarily used internally by the TreeGrid component.
     */
    totalRecordsCount?: number;

    /**
     * When set to true, appends the current page information as a query string to the remote service URL during page navigation within the TreeGrid.
     *
     * @default false
     */
    enableQueryString?: boolean;

    /**
     * Enables a DropDownList in the TreeGrid pager, allowing users to select the page size. Accepts either a boolean to toggle this feature or an array of page size options.
     *
     * @default false
     */
    pageSizes?: boolean | (number | string)[];

    /**
     * Provides a custom template for rendering pager elements in the TreeGrid, offering enhanced flexibility and control over the pager's appearance and functionality. Accepts a template string or the ID of an HTML element.
     *
     * @default null
     * @aspType string
     */
    template?: string | Function;

    /**
     * Specifies the mode for counting records on a page, determining whether all records are counted or only zeroth level parent records. The available options are:
     * * `All`: Includes all records in the count.
     * * `Root`: Includes only zeroth level parent records.
     *
     * @default All
     */
    pageSizeMode?: PageSizeMode;

}