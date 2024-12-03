import { ChildProperty, Property, Complex, Collection } from '@syncfusion/ej2-base';
import { BackstageBackButton } from './ribbon-back-button';
import { BackstageBackButtonModel } from './ribbon-back-button-model';
import { BackstageItem } from './ribbon-backstage-item';
import { BackstageItemModel } from './ribbon-backstage-item-model';
import { RibbonTooltipModel } from './ribbon-tooltip-model';
import { RibbonTooltip } from './ribbon-tooltip';

/**
 * Defines the ribbon file menu settings.
 */
export class BackStageMenu extends ChildProperty<BackStageMenu>  {

    /**
     * Defines the text content of backstage menu button.
     *
     * @default 'File'
     */
    @Property('File')
    public text: string;

    /**
     * Specifies the keytip content.
     *
     * @default ''
     */
    @Property('')
    public keyTip: string;

    /**
     * Defines whether to show the backstage menu button.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Defines the height of the backstage menu.
     *
     * @default 'auto'
     */
    @Property('auto')
    public height: string;

    /**
     * Defines the width of the backstage menu.
     *
     * @default 'auto'
     */
    @Property('auto')
    public width: string;

    /**
     * Defines the selector that points to the element in which backstage will be positioned.
     *
     * @default null
     */
    @Property(null)
    public target: string | HTMLElement;

    /**
     * Defines the properties of ribbon backstage back button.
     *
     * @default {}
     */
    @Complex<BackstageBackButtonModel>({}, BackstageBackButton)
    public backButton: BackstageBackButtonModel;

    /**
     * Defines the properties of ribbon backstage back button.
     *
     * @default []
     * @aspType List<BackstageItem>
     */
    @Collection<BackstageItemModel>([], BackstageItem)
    public items: BackstageItemModel[];

    /**
     * Defines the template for Backstage content.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public template: string | Function;

    /**
     * Specifies the tooltip settings for the file menu button.
     *
     * @default {}
     */
    @Complex<RibbonTooltipModel>({}, RibbonTooltip)
    public ribbonTooltipSettings: RibbonTooltipModel;

    /**
     * @param {Object} prop - Gets the property of Backstage Menu.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }

}
