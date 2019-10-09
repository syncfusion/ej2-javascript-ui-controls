import { Component, Property, NotifyPropertyChanges, INotifyPropertyChanged, Event, EmitType, ChildProperty } from '@syncfusion/ej2-base';import { getComponent, closest, EventHandler } from '@syncfusion/ej2-base';import { Collection, Complex } from '@syncfusion/ej2-base';import { Tab, Toolbar, ItemModel, SelectingEventArgs, MenuItemModel, ClickEventArgs, TabItemModel } from '@syncfusion/ej2-navigations';import { Menu, MenuEventArgs, BeforeOpenCloseMenuEventArgs, HeaderModel, Header, Item, MenuItem } from '@syncfusion/ej2-navigations';import { SelectEventArgs } from '@syncfusion/ej2-dropdowns';
import {RibbonItemType,ExpandCollapseEventArgs} from "./ribbon";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class RibbonItem
 */
export interface RibbonItemModel {

    /**
     * The object used for configuring the Tab item header properties.
     * @default {}
     */
    header?: HeaderModel;

    /**
     * Specifies the content of Tab item, that is displayed when concern item header is selected.
     * @default ''
     */
    content?: ItemModel[];

    /**
     * Sets the CSS classes to the Tab item to customize its styles.
     * @default ''
     */
    cssClass?: string;

    /**
     * Sets true to disable user interactions of the Tab item.
     * @default false
     */
    disabled?: boolean;

    /**
     * Sets true to disable user interactions of the Tab item.
     * @default 'Tab'
     */
    type?: RibbonItemType;

    /**
     * Specifies the sub menu items that is the array of MenuItem model.
     * @default []
     */
    menuItems?: MenuItemModel[];

}

/**
 * Interface for a class Ribbon
 */
export interface RibbonModel extends ComponentModel{

    /**
     * Defines class/multiple classes separated by a space in the Spreadsheet element.
     * @default ""
     */
    cssClass?: string;

    /**
     * An array of object that is used to configure the Tab component.
     * @default []
     */
    items?: RibbonItemModel[];

    /**
     * Triggers while selecting the tab item.
     * @event
     */
    selecting?: EmitType<SelectingEventArgs>;

    /**
     * Triggers while selecting the file menu item.
     * @event
     */
    fileItemSelect?: EmitType<MenuEventArgs>;

    /**
     * Triggers while rendering each file menu item.
     * @event
     */
    beforeFileItemRender?: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the file menu.
     * @event
     */
    beforeOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the file menu.
     * @event
     */
    beforeClose?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers format dropdown items gets selected.
     * @event
     * @hidden
     */
    selectFormat?: EmitType<SelectEventArgs>;

    /**
     * Triggers while clicking the ribbon content elements.
     * @event
     */
    clicked?: EmitType<ClickEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     */
    created?: EmitType<Event>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     */
    expandCollapse?: EmitType<ExpandCollapseEventArgs>;

}