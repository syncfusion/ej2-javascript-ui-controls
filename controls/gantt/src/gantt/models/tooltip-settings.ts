import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**
 * Configures tooltip settings for Gantt.
 */
export class TooltipSettings extends ChildProperty<TooltipSettings> {
    /**
     * Enables or disables tooltip of Gantt element.
     * @default true
     */
    @Property(true)
    public showTooltip: boolean;

    /**
     * Defines tooltip template for taskbar elements.
     * @default null
     */
    @Property()
    public taskbar: string;

    /**
     * Defines template for baseline tooltip element.
     * @default null
     */
    @Property()
    public baseline: string;

    /**
     * Defines template for dependency line tooltip.
     * @default null
     */
    @Property()
    public connectorLine: string;

    /**
     * Defines tooltip template for taskbar editing action.
     * @default null
     */
    @Property()
    public editing: string;
}