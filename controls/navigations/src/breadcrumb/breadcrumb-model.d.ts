import { Component, NotifyPropertyChanges, INotifyPropertyChanged, ChildProperty, Property, Collection, append, extend, Event, EmitType, BaseEventArgs, EventHandler, closest, addClass, removeClass } from '@syncfusion/ej2-base';import { ListBase, ListBaseOptions } from '@syncfusion/ej2-lists';
import {BreadcrumbOverflowMode,BreadcrumbBeforeItemRenderEventArgs,BreadcrumbClickEventArgs} from "./breadcrumb";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class BreadcrumbItem
 */
export interface BreadcrumbItemModel {

    /**
     * Specifies the text content of the Breadcrumb item.
     *
     * @default ''
     */
    text?: string;

    /**
     * Specifies the Url of the Breadcrumb item that will be activated when clicked.
     *
     * @default ''
     */
    url?: string;

    /**
     * Defines a class/multiple classes separated by a space for the item that is used to include an icon.
     *
     * @default null
     */
    iconCss?: string;

}

/**
 * Interface for a class Breadcrumb
 */
export interface BreadcrumbModel extends ComponentModel{

    /**
     * Defines the Url based on which the Breadcrumb items are generated.
     *
     * @default ''
     */
    url?: string;

    /**
     * Defines the list of Breadcrumb items.
     *
     * @default []
     */
    items?: BreadcrumbItemModel[];

    /**
     * Specifies the Url of the active Breadcrumb item.
     *
     * @default ''
     */
    activeItem?: string;

    /**
     * Specifies an integer to enable overflow behavior when the Breadcrumb items count exceeds and it is based on the overflowMode property.
     *
     * @default 0
     */
    maxItems?: number;

    /**
     * Specifies the overflow mode of the Breadcrumb item when it exceeds maxItems count. The possible values are,
     * - Default: Specified maxItems count will be visible and the remaining items will be hidden. While clicking on the previous item, the hidden item will become visible.
     * - Collapsed: Only the first and last items will be visible, and the remaining items will be hidden in the collapsed icon. When the collapsed icon is clicked, all items become visible.
     *
     * @default 'Default'
     */
    overflowMode?: BreadcrumbOverflowMode;

    /**
     * Defines class/multiple classes separated by a space in the Breadcrumb element.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the width for the Breadcrumb component container element. If the Breadcrumb items overflow, the browsers horizontal scroll will be activated based on the device.
     *
     * @default ''
     */
    width?: string;

    /**
     * Specifies the template for Breadcrumb item.
     *
     * @default null
     */
    itemTemplate?: string;

    /**
     * Specifies the separator template for Breadcrumb.
     *
     * @default '/'
     */
    separatorTemplate?: string;

    /**
     * Enable or disable the item's navigation, when set to false, each item navigation will be prevented.
     *
     * @default true
     */
    enableNavigation?: boolean;

    /**
     * Enable or disable the active item navigation, when set to true, active item will be navigable.
     *
     * @default false
     */
    enableActiveItemNavigation?: boolean;

    /**
     * Overrides the global culture and localization value for this component. Default global culture is 'en-US'.
     *
     * @default ''
     * @private
     * @aspIgnore
     */
    locale?: string;

    /**
     * Triggers while rendering each breadcrumb item.
     *
     * @event beforeItemRender
     */
    beforeItemRender?: EmitType<BreadcrumbBeforeItemRenderEventArgs>;

    /**
     * Triggers while clicking the breadcrumb item.
     *
     * @event itemClick
     */
    itemClick?: EmitType<BreadcrumbClickEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     *
     * @event created
     */
    created?: EmitType<Event>;

}