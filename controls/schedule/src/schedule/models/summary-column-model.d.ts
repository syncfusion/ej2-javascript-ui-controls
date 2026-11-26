import { Property, ChildProperty } from '@syncfusion/ej2-base';import { SummaryColumnCellUnit } from '../base/type';

/**
 * Interface for a class SummaryColumn
 */
export interface SummaryColumnModel {

    /**
     * Decides whether to render the summary column, with its label cell, at the trailing edge of the content (right in LTR and left in RTL).
     * When set to `false`, no summary column elements are rendered and no summary events are triggered for it.
     *
     * @default false
     */
    enable?: boolean;

    /**
     * Defines how many time axis rows one summary column cell covers. It is applicable only to the Day, Week and Work Week views.
     * The timeline and Month views have a fixed unit and ignore this property.
     *
     * @default 'Slot'
     */
    cellUnit?: SummaryColumnCellUnit;

    /**
     * Template option to customize each summary column cell.
     * It accepts either the string or HTMLElement as template design content and parses it appropriately before displaying it.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template?: string | Function;

    /**
     * Template option to customize the label cell of the summary column. The template is rendered with an empty context.
     * It accepts either the string or HTMLElement as template design content and parses it appropriately before displaying it.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    labelTemplate?: string | Function;

}