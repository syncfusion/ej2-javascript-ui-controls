import { Property, ChildProperty } from '@syncfusion/ej2-base';
import { SummaryRowCellUnit } from '../base/type';

/**
 * A class that holds the group summary related configurations. The group summary turns the parent resource row of one level into
 * the summary of its group in the timeline views.
 */
export class GroupSummary extends ChildProperty<GroupSummary> {
    /**
     * Decides whether the parent resource rows of the resolved levels show the group summary.
     * When set to `false`, no group summary elements are rendered and no group summary events are triggered.
     *
     * @default false
     */
    @Property(false)
    public enable: boolean;

    /**
     * Defines the `name` of the grouped resources whose parent rows show the group summary, as in the `group.resources` option.
     * Each named parent row summarizes all of its descendants at every depth. Several names enable a multi level group summary.
     * When it is not set or empty, every grouped resource level that has child levels is used.
     * Unknown names and the name of the last level are ignored.
     *
     * @default null
     */
    @Property(null)
    public resources: string[];

    /**
     * Defines how much time one group summary cell covers in the timeline views. By default, one cell covers one bottom header tier of the view.
     * The value that is not allowed in the active view falls back to the default.
     *
     * @default null
     */
    @Property(null)
    public cellUnit: SummaryRowCellUnit;

    /**
     * Template option to customize each group summary cell.
     * It accepts either the string or HTMLElement as template design content and parses it appropriately before displaying it.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property(null)
    public template: string | Function;
}
