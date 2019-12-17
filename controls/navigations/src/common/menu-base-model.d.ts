import { Component, Property, ChildProperty, NotifyPropertyChanges, INotifyPropertyChanged, AnimationModel } from '@syncfusion/ej2-base';import { Event, EventHandler, EmitType, BaseEventArgs, KeyboardEvents, KeyboardEventArgs, Touch, TapEventArgs } from '@syncfusion/ej2-base';import { attributes, Animation, AnimationOptions, TouchEventArgs, MouseEventArgs } from '@syncfusion/ej2-base';import { Browser, Collection, setValue, getValue, getUniqueID, getInstance, isNullOrUndefined } from '@syncfusion/ej2-base';import { select, selectAll, closest, detach, append, rippleEffect, isVisible, Complex, addClass, removeClass } from '@syncfusion/ej2-base';import { ListBase, ListBaseOptions } from '@syncfusion/ej2-lists';import { getZindexPartial, calculatePosition, OffsetPosition, isCollide, flip, fit, Popup } from '@syncfusion/ej2-popups';import { updateBlazorTemplate, resetBlazorTemplate, blazorTemplates, extend, SanitizeHtmlHelper, isBlazor } from '@syncfusion/ej2-base';import { getScrollableParent } from '@syncfusion/ej2-popups';import { HScroll } from '../common/h-scroll';import { VScroll } from '../common/v-scroll';
import {MenuEffect,MenuEventArgs,BeforeOpenCloseMenuEventArgs,OpenCloseMenuEventArgs} from "./menu-base";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FieldSettings
 */
export interface FieldSettingsModel {

    /**
     * Specifies the itemId field for Menu item.
     * @default 'id'
     */
    itemId?: string | string[];

    /**
     * Specifies the parentId field for Menu item.
     * @default 'parentId'
     */
    parentId?: string | string[];

    /**
     * Specifies the text field for Menu item.
     * @default 'text'
     */
    text?: string | string[];

    /**
     * Specifies the css icon field for Menu item.
     * @default 'iconCss'
     */
    iconCss?: string | string[];

    /**
     * Specifies the Url field for Menu item.
     * @default 'url'
     */
    url?: string | string[];

    /**
     * Specifies the separator field for Menu item.
     * @default 'separator'
     */
    separator?: string | string[];

    /**
     * Specifies the children field for Menu item. 
     * @default 'items'
     */
    children?: string | string[];

}

/**
 * Interface for a class MenuItem
 */
export interface MenuItemModel {

    /**
     * Defines class/multiple classes separated by a space for the menu Item that is used to include an icon.
     * Menu Item can include font icon and sprite image.
     * @default null
     */
    iconCss?: string;

    /**
     * Specifies the id for menu item.
     * @default ''
     */
    id?: string;

    /**
     * Specifies separator between the menu items. Separator are either horizontal or vertical lines used to group menu items.
     * @default false
     */
    separator?: boolean;

    /**
     * Specifies the sub menu items that is the array of MenuItem model.
     * @default []
     */
    items?: MenuItemModel[];

    /**
     * Specifies text for menu item.
     * @default ''
     */
    text?: string;

    /**
     * Specifies url for menu item that creates the anchor link to navigate to the url provided.
     * @default ''
     */
    url?: string;

}

/**
 * Interface for a class MenuAnimationSettings
 */
export interface MenuAnimationSettingsModel {

    /**
     * Specifies the effect that shown in the sub menu transform.
     * The possible effects are:
     * * None: Specifies the sub menu transform with no animation effect.
     * * SlideDown: Specifies the sub menu transform with slide down effect.
     * * ZoomIn: Specifies the sub menu transform with zoom in effect.
     * * FadeIn: Specifies the sub menu transform with fade in effect.
     * @default 'SlideDown'
     * @aspType Syncfusion.EJ2.Navigations.MenuEffect
     * @blazorType Syncfusion.EJ2.Navigations.MenuEffect
     * @isEnumeration true
     */
    effect?: MenuEffect;

    /**
     * Specifies the time duration to transform object.
     * @default 400
     */
    duration?: number;

    /**
     * Specifies the easing effect applied while transform.
     * @default 'ease'
     */
    easing?: string;

}

/**
 * Interface for a class MenuBase
 * @private
 */
export interface MenuBaseModel extends ComponentModel{

    /**
     * Triggers while rendering each menu item.
     * @event
     * @blazorProperty 'OnItemRender'
     */
    beforeItemRender?: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the menu item.
     * @event
     * @blazorProperty 'OnOpen'
     */
    beforeOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the menu item.
     * @event
     * @blazorProperty 'Opened'
     */
    onOpen?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the menu.
     * @event
     * @blazorProperty 'OnClose'
     */
    beforeClose?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while closing the menu.
     * @event
     * @blazorProperty 'Closed'
     */
    onClose?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting menu item.
     * @event
     * @blazorProperty 'ItemSelected'
     */
    select?: EmitType<MenuEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event
     * @blazorProperty 'Created'
     */
    created?: EmitType<Event>;

    /**
     * Defines class/multiple classes separated by a space in the Menu wrapper.
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies whether to show the sub menu or not on click.
     * When set to true, the sub menu will open only on mouse click.
     * @default false
     */
    showItemOnClick?: boolean;

    /**
     * Specifies target element selector in which the ContextMenu should be opened.
     * Specifies target element to open/close Menu while click in Hamburger mode.
     * @default ''
     * @private
     */
    target?: string;

    /**
     * Specifies the filter selector for elements inside the target in that the context menu will be opened.
     * Not applicable to Menu component.
     * @default ''
     * @private
     */
    filter?: string;

    /**
     * Specifies the template for Menu item.
     * Not applicable to ContextMenu component.
     * @default null
     * @private
     */
    template?: string;

    /**
     * Specifies whether to enable / disable the scrollable option in Menu.
     * Not applicable to ContextMenu component.
     * @default false
     * @private
     */
    enableScrolling?: boolean;

    /**
     * Defines whether to allow the cross-scripting site or not.
     * @default false
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Specifies mapping fields from the dataSource.
     * Not applicable to ContextMenu component.
     * @default { itemId: "id", text: "text", parentId: "parentId", iconCss: "iconCss", url: "url", separator: "separator",
     * children: "items" }
     * @private
     */
    fields?: FieldSettingsModel;

    /**
     * Specifies menu items with its properties which will be rendered as Menu.
     * @default []
     */
    items?: MenuItemModel[] | { [key: string]: Object }[];

    /**
     * Specifies the animation settings for the sub menu open.
     * @default { duration: 400, easing: 'ease', effect: 'SlideDown' }
     */
    animationSettings?: MenuAnimationSettingsModel;

}