import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class PageSettings
 */
export interface PageSettingsModel {

    /**
     * Defines the number of records to be displayed per page.
     *
     * @default 12
     * @blazorType int
     */
    pageSize?: number;

    /**
     * Defines the number of pages to be displayed in the pager container.
     *
     * @default 8
     * @blazorType int
     */
    pageCount?: number;

    /**
     * Defines the current page number of the pager.
     *
     * @default 1
     * @blazorType int
     */
    currentPage?: number;

    /**
     * @hidden
     * Gets the total records count of the Grid.
     *
     * @blazorType int
     */
    totalRecordsCount?: number;

    /**
     * If `enableQueryString` set to true,
     * then it pass current page information as a query string along with the URL while navigating to other page.
     *
     * @default false
     */
    enableQueryString?: boolean;

    /**
     * If `pageSizes` set to true or Array of values,
     * It renders DropDownList in the pager which allow us to select pageSize from DropDownList.
     *
     * @default false
     */
    pageSizes?: boolean | (number | string)[];

    /**
     * Defines the template which renders customized elements in pager instead of default elements.
     * It accepts either [template string](../../common/template-engine/) or HTML element ID.
     *
     * @default null
     */
    template?: string;

}