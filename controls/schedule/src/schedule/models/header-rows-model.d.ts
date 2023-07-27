import { Property, ChildProperty } from '@syncfusion/ej2-base';import { HeaderRowType } from '../base/type';

/**
 * Interface for a class HeaderRows
 */
export interface HeaderRowsModel {

    /**
     * It defines the header row type, which accepts either of the following values.
     * * `Year`: Denotes the year row in the header bar.
     * * `Month`: Denotes the month row in the header bar.
     * * `Week`: Denotes the week row in the header bar.
     * * `Date`: Denotes the date row in the header bar.
     * * `Hour`: Denotes the hour row in the header bar.
     *
     * @default null
     */
    option?: HeaderRowType;

    /**
     * Template option to customize the individual header rows. It accepts either the string or HTMLElement as template design
     *  content and parse it appropriately before displaying it onto the header cells. The field that
     *  can be accessed via this template is `date`.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template?: string | Function;

}