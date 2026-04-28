import { ChildProperty, Collection, Event, EmitType, Property } from '@syncfusion/ej2-base';
import { ItemModel, Item, BeforeOpenCloseMenuEventArgs, MenuEventArgs, OpenCloseMenuEventArgs, ClickEventArgs } from '@syncfusion/ej2-splitbuttons';

/**
 * Defines the ribbon SplitButton item.
 */
export class RibbonSplitButtonSettings extends ChildProperty<RibbonSplitButtonSettings>  {

    /**
     * Specifies the event to close the SplitButton popup.
     *
     * @default ''
     */
    @Property('')
    public closeActionEvents: string;

    /**
     * Specifies the content of the SplitButton.
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Defines one or more CSS classes to customize the appearance of SplitButton.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the CSS class for the icons to be shown in the SplitButton.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Defines the list of items for the SplitButton popup.
     *
     * @default []
     */
    @Collection<ItemModel>([], Item)
    public items: ItemModel[];

    /**
     * Specifies the selector for the element to be shown in the SplitButton popup.
     *
     * @default ''
     * @aspType string
     */
    @Property('')
    public target: string | HTMLElement;

    /**
     * Specifies additional HTML attributes to be applied to the SplitButton.
     *
     * @default {}
     */
    @Property({})
    public htmlAttributes: { [key: string]: string };

    /**
     * Triggers before closing the SplitButton popup.
     *
     * @event beforeClose
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while rendering each Popup item of SplitButton.
     *
     * @event beforeItemRender
     */
    @Event()
    public beforeItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the SplitButton popup.
     *
     * @event beforeOpen
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while closing the SplitButton popup.
     *
     * @event close
     */
    @Event()
    public close: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while clicking the primary button in SplitButton.
     *
     * @event click
     */
    @Event()
    public click: EmitType<ClickEventArgs>;

    /**
     * Event triggers once the SplitButton is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggers while opening the SplitButton popup.
     *
     * @event open
     */
    @Event()
    public open: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting an action item in SplitButton popup.
     *
     * @event select
     */
    @Event()
    public select: EmitType<MenuEventArgs>;

    /**
     * @param {Object} prop - Gets the property of DropDown.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }

}
