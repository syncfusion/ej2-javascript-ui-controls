import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Interface for a class Group
 */
export interface GroupModel {

    /**
     * When set to `true`, groups the resources by date where each day renders all the resource names under it.
     * @default false
     */
    byDate?: boolean;

    /**
     * Decides whether to allow the resource hierarchy to group by ID. It is set to `true` by default and when set to false,
     *  all the resources under child collection will be mapped against each available parent. 
     * @default true
     */
    byGroupID?: boolean;

    /**
     * Allows creation and editing of linked appointments assigned to multiple resources. When set to `true`,
     *  a single appointment object instance will be maintained in schedule dataSource that are created for
     *  multiple resources, whereas displayed individually on UI.  
     * @default false
     */
    allowGroupEdit?: boolean;

    /**
     * Accepts the collection of resource names assigned to each resources and allows the grouping order on schedule based on it.
     * @default []
     */
    resources?: string[];

    /**
     * Decides whether to display the resource grouping layout in normal or compact mode in mobile devices. When set to `false`,
     *  the default grouping layout on desktop will be displayed on mobile devices with scrolling enabled.
     * @default true
     */
    enableCompactView?: boolean;

    /**
     * Template option to customize the tooltip that displays over the resource header bar. By default, no tooltip will be
     *  displayed on resource header bar. It accepts either the string or HTMLElement as template design content and
     *  parse it appropriately before displaying it onto the tooltip. All the resource fields mapped for resource dataSource
     *  can be accessed within this template code.
     * @default null
     */
    headerTooltipTemplate?: string;

}