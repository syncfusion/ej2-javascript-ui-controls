import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Configures tooltip settings for Gantt.
 */
export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Enables or disables tooltip of Gantt element.
     *
     * @default true
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * Specifies whether split-task segments display segment-specific tooltip content.
     * When disabled, hovering a segment displays the complete task tooltip.
     *
     * @default false
     */
    @Property(false)
    public showSegmentTooltip: boolean;

    /**
     * Defines tooltip template for taskbar elements.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public taskbar: string | Function;

    /**
     * Defines template for baseline tooltip element.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public baseline: string | Function;

    /**
     * Defines template for dependency line tooltip.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public connectorLine: string | Function;

    /**
     * Defines tooltip template for taskbar editing action.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public editing: string | Function;

    /**
     * Defines template for timeLine tooltip element.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public timeline: string | Function;

    /**
     * Defines the template for the S-Curve tooltip.
     * The template receives the hovered point: field, name, date, percentage and value.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public sCurve: string | Function;
}
