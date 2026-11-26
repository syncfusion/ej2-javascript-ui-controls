import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SummaryRowCellUnit } from '../base/type';

/**
 * A class that holds the summary row related configurations. The summary row shows one cell per time unit at the bottom of the content area.
 */
export class SummaryRow extends ChildProperty<SummaryRow> {
    /**
     * Decides whether to render the summary row, with its label cell, at the bottom of the content area.
     * When set to `false`, no summary row elements are rendered and no summary events are triggered for it.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Defines how much time one summary row cell covers in the timeline views. By default, one cell covers one bottom header tier of the view.
     * The value that is not allowed in the active view falls back to the default.
     *
     * @default null
     */
    @Property()
    public cellUnit: SummaryRowCellUnit;

    /**
     * Template option to customize each summary row cell.
     * It accepts either the string or HTMLElement as template design content and parses it appropriately before displaying it.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public template: string | Function;

    /**
     * Template option to customize the label cell of the summary row. The template is rendered with an empty context.
     * It accepts either the string or HTMLElement as template design content and parses it appropriately before displaying it.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public labelTemplate: string | Function;

    /**
     * Template option to customize the grand total cell where the summary row and the summary column meet.
     * It is rendered only when the summary column is also enabled.
     * It accepts either the string or HTMLElement as template design content and parses it appropriately before displaying it.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public totalTemplate: string | Function;
}
