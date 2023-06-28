import { Property, ChildProperty } from '@syncfusion/ej2-base';import { PageSizeMode } from '../enum';

/**
 * Interface for a class PageSettings
 */
export interface PageSettingsModel {

    /**
     * Defines the number of records to be displayed in TreeGrid per page.
     *
     * @default 12
     */
    pageSize?: number;

    /**
     * Defines the number of pages to be displayed in the TreeGrid pager container.
     *
     * @default 8
     */
    pageCount?: number;

    /**
     * Defines the current page number of the pager in TreeGrid.
     *
     * @default 1
     */
    currentPage?: number;

    /**
     * @hidden
     * Gets the total records count of the TreeGrid.
     */
    totalRecordsCount?: number;

    /**
     * If `enableQueryString` set to true,
     * then it pass current page information as a query string along with the URL while navigating to other page in TreeGrid.
     *
     * @default false
     */
    enableQueryString?: boolean;

    /**
     * If `pageSizes` set to true or Array of values,
     * It renders DropDownList in the pager of TreeGrid which allow us to select pageSize from DropDownList.
     *
     * @default false
     */
    pageSizes?: boolean | (number | string)[];

    /**
     * Defines the template which renders customized elements in pager of TreeGrid instead of default elements.
     * It accepts either [template string](https://ej2.syncfusion.com/documentation/common/template-engine/) or HTML element ID.
     *
     * @default null
     * @aspType string
     */
    template?: string | Function;

    /**
     * Specifies the mode of record count in a page. The options are,
     * * `All`: Count all the records.
     * * `Root`: Count only zeroth level parent records.
     *
     * @default All
     */
    pageSizeMode?: PageSizeMode;

}