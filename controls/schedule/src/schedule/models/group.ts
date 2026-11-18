import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * A class that holds the resource grouping related configurations on Schedule.
 */
export class Group extends ChildProperty<Group> {
    /**
     * When set to `true`, groups the resources by date where each day renders all the resource names under it.
     *
     * @default false
     */
    @Property(false)
    public byDate: boolean;

    /**
     * Decides whether to allow the resource hierarchy to group by ID. It is set to `true` by default and when set to false,
     *  all the resources under child collection will be mapped against each available parent.
     *
     * @default true
     */
    @Property(true)
    public byGroupID: boolean;

    /**
     * Allows creation and editing of linked appointments assigned to multiple resources. When set to `true`,
     *  a single appointment object instance will be maintained in schedule dataSource that are created for
     *  multiple resources, whereas displayed individually on UI.
     *
     * @default false
     */
    @Property(false)
    public allowGroupEdit: boolean;

    /**
     * Accepts the collection of resource names assigned to each resources and allows the grouping order on schedule based on it.
     *
     * @default []
     */
    @Property([])
    public resources: string[];

    /**
     * Decides whether to display the resource grouping layout in normal or compact mode in mobile devices. When set to `false`,
     *  the default grouping layout on desktop will be displayed on mobile devices with scrolling enabled.
     *
     * @default true
     */
    @Property(true)
    public enableCompactView: boolean;

    /**
     * Template option to customize the tooltip that displays over the resource header bar. By default, no tooltip will be
     *  displayed on resource header bar. It accepts either the string or HTMLElement as template design content and
     *  parse it appropriately before displaying it onto the tooltip. All the resource fields mapped for resource dataSource
     *  can be accessed within this template code.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property()
    public headerTooltipTemplate: string | Function;

    /**
     * Decides whether to show/hide the non-working days. It is set to `false` by default and when set to `true`, it hides the non-working days.
     * This property is applicable for `Day`, `Week`, `WorkWeek` and `month` views, which are grouped under date.
     *
     * @default false
     */
    @Property(false)
    public hideNonWorkingDays: boolean;

}
