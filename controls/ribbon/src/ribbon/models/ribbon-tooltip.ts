import { ChildProperty, Property } from '@syncfusion/ej2-base';

/**
 * Defines the ribbon tooltip.
 */
export class RibbonTooltip extends ChildProperty<RibbonTooltip>  {

    /**
     * Defines the CSS class to customize the appearance of the tooltip.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the unique ID for the tooltip.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Defines the header content of the tooltip.
     *
     * @default ''
     */
    @Property('')
    public title: string;

    /**
     * Defines the content for the tooltip.
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Defines the CSS class for the icons to be shown in tooltip.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;
}
