import { ChildProperty, Property, Event, EmitType, Complex, Collection, BaseEventArgs } from '@syncfusion/ej2-base';
import { MenuAnimationSettings, MenuAnimationSettingsModel, MenuItem, MenuItemModel } from '@syncfusion/ej2-navigations';
import { RibbonTooltip } from './ribbon-tooltip';
import { RibbonTooltipModel } from './ribbon-tooltip-model';

/**
 * Defines the ribbon file menu settings.
 */
export class FileMenuSettings extends ChildProperty<FileMenuSettings>  {

    /**
     * Defines the text content of file menu button.
     *
     * @default 'File'
     */
    @Property('File')
    public text: string;

    /**
     * Defines whether to show the file menu button.
     *
     * @default false
     */
    @Property(false)
    public visible: boolean;

    /**
     * Defines the list of menu items for the file menu.
     *
     * @default []
     */
    @Collection<MenuItemModel>([], MenuItem)
    public menuItems: MenuItemModel[];

    /**
     * Specifies whether to show the sub menu or not on click.
     * When set to true, the sub menu will open only on mouse click.
     *
     * @default false
     */
    @Property(false)
    public showItemOnClick: boolean;

    /**
     * Specifies the animation settings for the sub menu open/close.
     *
     * @default ''
     */
    @Complex<MenuAnimationSettingsModel>({}, MenuAnimationSettings)
    public animationSettings: MenuAnimationSettingsModel;

    /**
     * Specifies the template for file menu item.
     *
     * @default ''
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    @Property('')
    public itemTemplate: string | Function;

    /**
     * Specifies the custom content for the file menu popup.
     *
     * @default ''
     * @angularType string | HTMLElement
     * @reactType string | HTMLElement | JSX.Element
     * @vueType string | HTMLElement
     * @aspType string
     */
    @Property('')
    public popupTemplate: string | HTMLElement;

    /**
     * Specifies the tooltip settings for the file menu button.
     *
     * @default {}
     */
    @Complex<RibbonTooltipModel>({}, RibbonTooltip)
    public ribbonTooltipSettings: RibbonTooltipModel;

    /**
     * Event triggers before closing the file menu popup.
     *
     * @event beforeClose
     */
    @Event()
    public beforeClose: EmitType<FileMenuBeforeOpenCloseEventArgs>;

    /**
     * Event triggers before opening the file menu popup.
     *
     * @event beforeOpen
     */
    @Event()
    public beforeOpen: EmitType<FileMenuBeforeOpenCloseEventArgs>;

    /**
     * Event triggers while rendering each ribbon file menu item.
     *
     * @event beforeItemRender
     */
    @Event()
    public beforeItemRender: EmitType<FileMenuEventArgs>;

    /**
     * Event triggers when file menu popup is closed.
     *
     * @event close
     */
    @Event()
    public close: EmitType<FileMenuOpenCloseEventArgs>;

    /**
     * Event triggers when file menu popup is opened.
     *
     * @event open
     */
    @Event()
    public open: EmitType<FileMenuOpenCloseEventArgs>;

    /**
     * Event triggers while selecting an item in ribbon file menu.
     *
     * @event select
     */
    @Event()
    public select: EmitType<FileMenuEventArgs>;

    /**
     * @param {Object} prop - Gets the property of FileMenu.
     * @param {boolean} muteOnChange - Gets the boolean value of muteOnChange.
     * @returns {void}
     * @private
     */
    public setProperties(prop: Object, muteOnChange: boolean): void {
        super.setProperties(prop, muteOnChange);
    }
}

/**
 * Event Triggers when selecting or creating the file menu item.
 */
export interface FileMenuEventArgs extends BaseEventArgs {
    /**
     *  Provides the HTML element of the file menu item.
     */
    element: HTMLElement;

    /**
     * Provides the file menu item object.
     */
    item: MenuItemModel;

    /**
     * Provides the actual native event.
     */
    event?: Event;
}

/**
 * Event Triggers when opening or closing the file menu.
 */
export interface FileMenuOpenCloseEventArgs extends BaseEventArgs {
    /**
     *  Provides the HTML element of the file menu popup.
     */
    element: HTMLElement;

    /**
     * Provides the file menu item object.
     */
    items?: MenuItemModel[];

    /**
     * Provides the parent file menu item of the popup, in case of sub-menu.
     */
    parentItem?: MenuItemModel;
}

/**
 * Event Triggers before opening or closing the file menu.
 */
export interface FileMenuBeforeOpenCloseEventArgs extends BaseEventArgs {

    /**
     * Defines whether to cancel the file menu popup opening or closing.
     */
    cancel: boolean;

    /**
     *  Provides the HTML element of the file menu popup.
     */
    element: HTMLElement;

    /**
     * Provides the file menu item object.
     */
    items?: MenuItemModel[];

    /**
     * Provides the parent file menu item of the popup, in case of sub-menu.
     */
    parentItem?: MenuItemModel;

    /**
     * Provides the actual native event.
     */
    event: Event;
}
