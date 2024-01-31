import { ChildProperty, Event, EmitType, Property, Complex } from '@syncfusion/ej2-base';
import { BeforeClickGroupButtonEventArgs, ClickGroupButtonEventArgs } from '../base/interface';
import { RibbonTooltipModel } from './ribbon-tooltip-model';
import { RibbonTooltip } from './ribbon-tooltip';


/**
 * Defines the ribbon group button settings.
 */
export class RibbonGroupButtonItem extends ChildProperty<RibbonGroupButtonItem>  {

    /**
     * Defines the content for the button.
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Defines the CSS class for the icons to be shown in button.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies the tooltip settings for the group button items.
     *
     * @default {}
     */
    @Complex<RibbonTooltipModel>({}, RibbonTooltip)
    public ribbonTooltipSettings: RibbonTooltipModel;

    /**
     * Defines whether the button is selected or not.
     *
     * @default false
     */
    @Property(false)
    public selected: boolean;

    /**
     * Specifies additional HTML attributes to be applied to the group button item.
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Triggers before clicking the button from group button.
     *
     * @event beforeClick
     */
    @Event()
    public beforeClick: EmitType<BeforeClickGroupButtonEventArgs>;

    /**
     * Triggers after clicking the button from group button.
     *
     * @event click
     */
    @Event()
    public click: EmitType<ClickGroupButtonEventArgs>;

    /**
     * @param {Object} prop - Gets the property of group button.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }
}
