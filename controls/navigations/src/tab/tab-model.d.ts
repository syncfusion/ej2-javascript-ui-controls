import { Component, Property, Event, EmitType, closest, Collection, Complex, attributes, detach, Instance, isNullOrUndefined } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, select, isVisible } from '@syncfusion/ej2-base';import { KeyboardEvents, KeyboardEventArgs, MouseEventArgs, Effect, Browser, formatUnit, DomElements, L10n } from '@syncfusion/ej2-base';import { setStyleAttribute as setStyle, isNullOrUndefined as isNOU, selectAll, addClass, removeClass, remove } from '@syncfusion/ej2-base';import { EventHandler, rippleEffect, Touch, SwipeEventArgs, compile, Animation, AnimationModel, BaseEventArgs } from '@syncfusion/ej2-base';import { getRandomId, SanitizeHtmlHelper, Draggable, DragEventArgs as DragArgs, DropEventArgs } from '@syncfusion/ej2-base';import { Base } from '@syncfusion/ej2-base';import { Popup, PopupModel } from '@syncfusion/ej2-popups';import { Toolbar, OverflowMode, ClickEventArgs } from '../toolbar/toolbar';import { ToolbarModel } from '../toolbar';
import {HeaderPosition,HeightStyles,ContentLoad,AddEventArgs,SelectingEventArgs,SelectEventArgs,RemoveEventArgs,DragEventArgs} from "./tab";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class TabActionSettings
 */
export interface TabActionSettingsModel {

    /**
     * Specifies the animation effect for displaying Tab content.
     *
     * @default 'SlideLeftIn'
     * @aspType string
     */
    effect?: 'None' | Effect;

    /**
     * Specifies the time duration to transform content.
     *
     * @default 600
     */
    duration?: number;

    /**
     * Specifies easing effect applied while transforming content.
     *
     * @default 'ease'
     */
    easing?: string;

}

/**
 * Interface for a class TabAnimationSettings
 */
export interface TabAnimationSettingsModel {

    /**
     * Specifies the animation to appear while moving to previous Tab content.
     *
     * @default { effect: 'SlideLeftIn', duration: 600, easing: 'ease' }
     */
    previous?: TabActionSettingsModel;

    /**
     * Specifies the animation to appear while moving to next Tab content.
     *
     * @default { effect: 'SlideRightIn', duration: 600, easing: 'ease' }
     */
    next?: TabActionSettingsModel;

}

/**
 * Interface for a class Header
 */
export interface HeaderModel {

    /**
     * Specifies the display text of the Tab item header.
     *
     * @default ''
     */
    text?: string | HTMLElement;

    /**
     * Specifies the icon class that is used to render an icon in the Tab header.
     *
     * @default ''
     */
    iconCss?: string;

    /**
     * Options for positioning the icon in the Tab item header. This property depends on `iconCss` property.
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
 * Interface for a class TabItem
 */
export interface TabItemModel {

    /**
     * The object used for configuring the Tab item header properties.
     *
     * @default {}
     */
    header?: HeaderModel;

    /**
     * Specifies the header text of Tab item.
     *
     * @default null
     */
    headerTemplate?: string;

    /**
     * Specifies the content of Tab item, that is displayed when concern item header is selected.
     *
     * @default ''
     */
    content?: string | HTMLElement;

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

    /**
     * Sets false to hide the Tab item.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Sets unique ID to Tab item.
     *
     * @default null
     */
    id?: string;

}

/**
 * Interface for a class Tab
 */
export interface TabModel extends ComponentModel{

    /**
     * An array of object that is used to configure the Tab component.
     * ```typescript
     *   let tabObj: Tab = new Tab( {
     *     items: [
     *       { header: { text: 'TabItem1' }, content: 'Tab Item1 Content' },
     *       { header: { text: 'TabItem2' }, content: 'Tab Item2 Content' }
     *     ]
     *   });
     *   tabObj.appendTo('#tab');
     * ```
     *
     * @default []
     */
    items?: TabItemModel[];

    /**
     * Specifies the width of the Tab component. Default, Tab width sets based on the width of its parent.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Specifies the height of the Tab component. By default, Tab height is set based on the height of its parent.
     * To use height property, heightAdjustMode must be set to 'None'.
     *
     * @default 'auto'
     */
    height?: string | number;

    /**
     * Sets the CSS classes to root element of the Tab that helps to customize component styles.
     *
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the index for activating the current Tab item.
     * ```typescript
     *   let tabObj: Tab = new Tab( {
     *     selectedItem: 1,
     *     items: [
     *       { header: { text: 'TabItem1' }, content: 'Tab Item1 Content' },
     *       { header: { text: 'TabItem2' }, content: 'Tab Item2 Content' }
     *     ]
     *   });
     *   tabObj.appendTo('#tab');
     * ```
     *
     * @default 0
     */
    selectedItem?: number;

    /**
     * Specifies the orientation of Tab header.
     * The possible values are:
     * - Top: Places the Tab header on the top.
     * - Bottom: Places the Tab header at the bottom.
     * - Left: Places the Tab header on the left.
     * - Right: Places the Tab header at the right.
     *
     * @default 'Top'
     */
    headerPlacement?: HeaderPosition;

    /**
     * Specifies the height style for Tab content.
     * The possible values are:
     * - None: Based on the given height property, the content panel height is set.
     * - Auto: Tallest panel height of a given Tab content is set to all the other panels.
     * - Content: Based on the corresponding content height, the content panel height is set.
     * - Fill: Based on the parent height, the content panel height is set.
     *
     * @default 'Content'
     */
    heightAdjustMode?: HeightStyles;

    /**
     * Specifies the Tab display mode when Tab content exceeds the viewing area.
     * The possible modes are:
     * - Scrollable: All the elements are displayed in a single line with horizontal scrolling enabled.
     * - Popup: Tab container holds the items that can be placed within the available space and rest of the items are moved to the popup.
     * If the popup content overflows the height of the page, the rest of the elements can be viewed by scrolling the popup.
     *
     * @default 'Scrollable'
     */
    overflowMode?: OverflowMode;

    /**
     * Specifies the modes for Tab content.
     * The possible modes are:
     * `Dynamic` Load Tab content dynamically at the time of switching it's header.
     * `Init` Load all tab contents at initial load.
     * `Demand` Load Tab content when required but keep content once it is rendered.
     *
     * @default 'Dynamic'
     */
    loadOn?: ContentLoad;

    /**
     * Enable or disable persisting component's state between page reloads.
     * If enabled, following list of states will be persisted.
     * 1. selectedItem
     *
     * @default false
     */
    enablePersistence?: boolean;

    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default false
     */
    enableHtmlSanitizer?: boolean;

    /**
     * Specifies whether to show the close button for header items to remove the item from the Tab.
     *
     * @default false
     */
    showCloseButton?: boolean;

    /**
     * Determines whether to re-order tab items to show active tab item in the header area or popup when OverflowMode is Popup.
     *  True, if active tab item should be visible in header area instead of pop-up. The default value is true.
     *
     * @default true
     */
    reorderActiveTab?: boolean;

    /**
     * Specifies the scrolling distance in scroller.
     *
     * @default null
     */
    scrollStep?: number;

    /**
     * Defines the area in which the draggable element movement will be occurring. Outside that area will be restricted
     * for the draggable element movement. By default, the draggable element movement occurs in the toolbar. 
     * @default null
     */
    dragArea?: string;

    /**
     * Sets true to allow drag and drop the Tab items
     * @default false
     */
    allowDragAndDrop?: boolean;

    /**
     * Specifies the animation configuration settings while showing the content of the Tab.
     *
     * @default
     * { previous: { effect: 'SlideLeftIn', duration: 600, easing: 'ease' },
     * next: { effect: 'SlideRightIn', duration: 600, easing: 'ease' } }
     */
    animation?: TabAnimationSettingsModel;

    /**
     * The event will be fired once the component rendering is completed.
     *
     * @event
     */
    created?: EmitType<Event>;

    /**
     * The event will be fired before adding the item to the Tab.
     *
     * @event
     */
    adding?: EmitType<AddEventArgs>;

    /**
     * The event will be fired after adding the item to the Tab.
     *
     * @event
     */
    added?: EmitType<AddEventArgs>;

    /**
     * The event will be fired before the item gets selected.
     *
     * @event
     */
    selecting?: EmitType<SelectingEventArgs>;

    /**
     * The event will be fired after the item gets selected.
     *
     * @event
     */
    selected?: EmitType<SelectEventArgs>;

    /**
     * The event will be fired before removing the item from the Tab.
     *
     * @event
     */
    removing?: EmitType<RemoveEventArgs>;

    /**
     * The event will be fired after removing the item from the Tab.
     *
     * @event
     */
    removed?: EmitType<RemoveEventArgs>;

    /**
     * The event will be fired before dragging the item from Tab
     * @event
     */
    onDragStart?: EmitType<DragEventArgs>;

    /**
     * The event will be fired while dragging the Tab item
     * @event
     */
    dragging?: EmitType<DragEventArgs>;

    /**
     * The event will be fired after dropping the Tab item
     * @event
     */
    dragged?: EmitType<DragEventArgs>;

    /**
     * The event will be fired when the component gets destroyed.
     *
     * @event
     */
    destroyed?: EmitType<Event>;

}