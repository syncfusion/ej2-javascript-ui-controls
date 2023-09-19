import { ChildProperty, Collection, Event, EmitType, Property } from '@syncfusion/ej2-base';
import { ItemModel, Item, BeforeOpenCloseMenuEventArgs, MenuEventArgs, OpenCloseMenuEventArgs } from '@syncfusion/ej2-splitbuttons';

/**
 * Defines the ribbon DropDownButton item.
 */
export class RibbonDropDownSettings extends ChildProperty<RibbonDropDownSettings>  {

    /**
     * Specifies the event to close the DropDownButton popup.
     *
     * @default ''
     */
    @Property('')
    public closeActionEvents: string;

    /**
     * Specifies the content of the DropDownButton.
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Defines one or more CSS classes to customize the appearance of DropDownButton.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Defines the CSS class for the icons to be shown in the DropDownButton.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Defines the list of items for the DropDownButton popup.
     *
     * @default []
     */
    @Collection<ItemModel>([], Item)
    public items: ItemModel[];

    /**
     * Specifies the selector for the element to be shown in the DropDownButton popup.
     *
     * @default ''
     * @aspType string
     */
    @Property('')
    public target: string | HTMLElement;

    /**
     * Specifies whether to create popup element on open.
     *
     * @default false
     */
    @Property(false)
    public createPopupOnClick: boolean;

    /**
     * Triggers before closing the DropDownButton popup.
     *
     * @event beforeClose
     */
    @Event()
    public beforeClose: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while rendering each Popup item of DropDownButton.
     *
     * @event beforeItemRender
     */
    @Event()
    public beforeItemRender: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the DropDownButton popup.
     *
     * @event beforeOpen
     */
    @Event()
    public beforeOpen: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while closing the DropDownButton popup.
     *
     * @event close
     */
    @Event()
    public close: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Event triggers once the DropDownButton is created.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Event>;

    /**
     * Triggers while opening the DropDownButton popup.
     *
     * @event open
     */
    @Event()
    public open: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting an action item in DropDownButton popup.
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

