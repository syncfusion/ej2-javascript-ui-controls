import { Component, Property, ChildProperty, NotifyPropertyChanges, INotifyPropertyChanged, AnimationModel } from '@syncfusion/ej2-base';import { Event, EventHandler, EmitType, BaseEventArgs, KeyboardEvents, KeyboardEventArgs, Touch, TapEventArgs } from '@syncfusion/ej2-base';import { attributes, Animation, AnimationOptions, TouchEventArgs, MouseEventArgs } from '@syncfusion/ej2-base';import { Browser, Collection, setValue, getValue, getUniqueID, getInstance, isNullOrUndefined } from '@syncfusion/ej2-base';import { select, selectAll, closest, detach, append, rippleEffect, isVisible, Complex, addClass, removeClass } from '@syncfusion/ej2-base';import { ListBase, ListBaseOptions } from '@syncfusion/ej2-lists';import { getZindexPartial, calculatePosition, OffsetPosition, isCollide, flip, fit, Popup } from '@syncfusion/ej2-popups';import { updateBlazorTemplate, resetBlazorTemplate, blazorTemplates, extend } from '@syncfusion/ej2-base';import { getScrollableParent } from '@syncfusion/ej2-popups';import { HScroll } from '../common/h-scroll';import { VScroll } from '../common/v-scroll';
import {MenuEffect,MenuEventArgs,BeforeOpenCloseMenuEventArgs,OpenCloseMenuEventArgs} from "./menu-base";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class FieldSettings
 */
export interface FieldSettingsModel {

    /**
     * Specifies the itemId field for Menu item.

     */
    itemId?: string | string[];

    /**
     * Specifies the parentId field for Menu item.

     */
    parentId?: string | string[];

    /**
     * Specifies the text field for Menu item.

     */
    text?: string | string[];

    /**
     * Specifies the css icon field for Menu item.

     */
    iconCss?: string | string[];

    /**
     * Specifies the Url field for Menu item.

     */
    url?: string | string[];

    /**
     * Specifies the separator field for Menu item.

     */
    separator?: string | string[];

    /**
     * Specifies the children field for Menu item. 

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

     */
    iconCss?: string;

    /**
     * Specifies the id for menu item.

     */
    id?: string;

    /**
     * Specifies separator between the menu items. Separator are either horizontal or vertical lines used to group menu items.

     */
    separator?: boolean;

    /**
     * Specifies the sub menu items that is the array of MenuItem model.

     */
    items?: MenuItemModel[];

    /**
     * Specifies text for menu item.

     */
    text?: string;

    /**
     * Specifies url for menu item that creates the anchor link to navigate to the url provided.

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




     */
    effect?: MenuEffect;

    /**
     * Specifies the time duration to transform object.

     */
    duration?: number;

    /**
     * Specifies the easing effect applied while transform.

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

     */
    beforeItemRender?: EmitType<MenuEventArgs>;

    /**
     * Triggers before opening the menu item.
     * @event

     */
    beforeOpen?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while opening the menu item.
     * @event

     */
    onOpen?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers before closing the menu.
     * @event

     */
    beforeClose?: EmitType<BeforeOpenCloseMenuEventArgs>;

    /**
     * Triggers while closing the menu.
     * @event

     */
    onClose?: EmitType<OpenCloseMenuEventArgs>;

    /**
     * Triggers while selecting menu item.
     * @event

     */
    select?: EmitType<MenuEventArgs>;

    /**
     * Triggers once the component rendering is completed.
     * @event

     */
    created?: EmitType<Event>;

    /**
     * Defines class/multiple classes separated by a space in the Menu wrapper.

     */
    cssClass?: string;

    /**
     * Specifies whether to show the sub menu or not on click.
     * When set to true, the sub menu will open only on mouse click.

     */
    showItemOnClick?: boolean;

    /**
     * Specifies target element selector in which the ContextMenu should be opened.
     * Specifies target element to open/close Menu while click in Hamburger mode.

     * @private
     */
    target?: string;

    /**
     * Specifies the filter selector for elements inside the target in that the context menu will be opened.
     * Not applicable to Menu component.

     * @private
     */
    filter?: string;

    /**
     * Specifies the template for Menu item.
     * Not applicable to ContextMenu component.

     * @private
     */
    template?: string;

    /**
     * Specifies whether to enable / disable the scrollable option in Menu.
     * Not applicable to ContextMenu component.

     * @private
     */
    enableScrolling?: boolean;

    /**
     * Specifies mapping fields from the dataSource.
     * Not applicable to ContextMenu component.

     * children: "items" }
     * @private
     */
    fields?: FieldSettingsModel;

    /**
     * Specifies menu items with its properties which will be rendered as Menu.

     */
    items?: MenuItemModel[] | { [key: string]: Object }[];

    /**
     * Specifies the animation settings for the sub menu open.

     */
    animationSettings?: MenuAnimationSettingsModel;

}