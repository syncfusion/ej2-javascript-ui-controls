import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Event, EmitType, ChildProperty } from '@syncfusion/ej2-base';import { getComponent, closest, EventHandler, getUniqueID, isNullOrUndefined } from '@syncfusion/ej2-base';import { Collection, Complex } from '@syncfusion/ej2-base';import { Tab, Toolbar, ItemModel, SelectingEventArgs, MenuItemModel, ClickEventArgs, TabItemModel } from '@syncfusion/ej2-navigations';import { Menu, MenuEventArgs, BeforeOpenCloseMenuEventArgs, Item, MenuItem } from '@syncfusion/ej2-navigations';import { SelectEventArgs as TabSelectEventArgs } from '@syncfusion/ej2-navigations';import { SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import {ExpandCollapseEventArgs} from "./ribbon";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class RibbonHeader
 */
export interface RibbonHeaderModel {

    /**
     * Specifies the display text of the Ribbon tab header.
     *
     * @default ''
     */
    text?: string;

    /**
     * Specifies the icon class that is used to render an icon in the Ribbon tab header.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Options for positioning the icon in the Ribbon tab header. This property depends on `iconCss` property.
     * The possible values are:
     * - Left: Places the icon to the `left` of the item.
     * - Top: Places the icon on the `top` of the item.
     * - Right: Places the icon to the `right` end of the item.
     * - Bottom: Places the icon at the `bottom` of the item.
     *
     * @default 'left'
     */
    iconPosition?: string;

}

/**
 * Interface for a class RibbonItem
 */
export interface RibbonItemModel {

    /**
     * The object used for configuring the Tab item header properties.
     *
     * @default {}
     */
    header?: RibbonHeaderModel;

    /**
     * Specifies the content of Tab item, that is displayed when concern item header is selected.
     *
     * @default ''
     */
    content?: ItemModel[];

    /**
     * Sets the CSS classes to the Tab item to customize its styles.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Sets true to disable user interactions of the Tab item.
     *
     * @default false
     */
    disabled?: boolean;

}

/**
 * Interface for a class Ribbon
 */
export interface RibbonModel extends ComponentModel{

    /**
     * Defines class/multiple classes separated by a space in the Spreadsheet element.
     *
     * @default ""
     */
    cssClass?: string;

    /**
     * Used the specify the ribbon menu type as `Menu` or `Sidebar`.
     *
     * @default true
     */
    menuType?: boolean;

    /**
     * An array of object that is used to configure the Ribbon menu.
     *
     * @default []
     */
    menuItems?: MenuItemModel[];

    /**
     * Specifies the index for activating the current Ribbon tab.
     *
     * @default 0
     */
    selectedTab?: number;

    /**
     * An array of object that is used to configure the Ribbon tab.
     *
     * @default []
     */
    items?: RibbonItemModel[];

    /**
     * Triggers while selecting the tab item.
     *
     * @event anEvent
     */
    selecting?: EmitType<SelectingEventArgs>;

    /**
     * Triggers while selecting the file menu item.
     *
     * @event anEvent
     */
    fileMenuItemSelect?: EmitType<MenuEventArgs>;

    /**
     * Triggers while rendering each file menu item.
     *
     * @event anEvent
     */
    beforeFileMenuItemRender?: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the file menu.
     *
     * @event anEvent
     */
    beforeOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the file menu.
     *
     * @event anEvent
     */
    beforeClose?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers format dropdown items gets selected.
     *
     * @event anEvent
     * @hidden
     */
    selectFormat?: EmitType<SelectEventArgs>;

    /**
     * Triggers while clicking the ribbon content elements.
     *
     * @event anEvent
     */
    clicked?: EmitType<ClickEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event anEvent
     */
    created?: EmitType<Event>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event anEvent
     */
    expandCollapse?: EmitType<ExpandCollapseEventArgs>;

}