import { Component, select, compile, INotifyPropertyChanged, NotifyPropertyChanges, isNullOrUndefined as isNOU, formatUnit, Event, EmitType, append, addClass, removeClass, Property, ChildProperty, Collection, BaseEventArgs } from '@syncfusion/ej2-base';import { attributes, EventHandler, remove } from '@syncfusion/ej2-base';import { TextArea } from '@syncfusion/ej2-inputs';import { ItemType, ItemAlign } from '@syncfusion/ej2-navigations';
import {ToolbarItemClickedEventArgs} from "./interactive-chat-base";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class ToolbarItem
 */
export interface ToolbarItemModel {

    /**
     * Specifies the CSS class for the icon of the toolbar item.
     * Represents the icon displayed for the toolbar item.
     *
     * @type {string}
     * @default ''
     */
    iconCss?: string;

    /**
     * Specifies the text of the toolbar item.
     * Represents the display text of the toolbar item.
     *
     * @type {string}
     * @default null
     */
    text?: string;

    /**
     * Specifies the type of the toolbar item.
     * Represents the item type of the toolbar item.
     *
     * @type {ItemType}
     * @default "Button"
     * @aspPopulateDefaultValue
     */
    type?: ItemType;

    /**
     * Specifies the alignment of the toolbar item.
     *
     * @type {ItemAlign}
     * @default "Left"
     * @aspPopulateDefaultValue
     */
    align?: ItemAlign;

    /**
     * Specifies whether the toolbar item is visible.
     * Indicates if the toolbar item should be displayed.
     *
     * @type {boolean}
     * @default true
     */
    visible?: boolean;

    /**
     * Specifies whether the toolbar item is disabled.
     * Indicates if the toolbar item is interactive or not.
     *
     * @type {boolean}
     * @default false
     */
    disabled?: boolean;

    /**
     * Specifies the tooltip text for the toolbar item.
     * Represents the text shown when hovering over the toolbar item.
     *
     * @type {string}
     * @default ''
     */
    tooltip?: string;

    /**
     * Specifies the CSS class for styling the toolbar item.
     * Represents the additional CSS classes applied to the toolbar item.
     *
     * @type {string}
     * @default ''
     */
    cssClass?: string;

    /**
     * Specifies the template that defines the appearance of the toolbar item.
     * Represents the custom template for rendering the toolbar item, which can be a string or a function.
     *
     * @default null
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template?: string | Function;

    /**
     * Specifies the tab order of the toolbar items.
     * When assigned positive values, it allows switching focus to the next/previous toolbar items using the Tab/Shift+Tab keys.
     * If the value is set to 0 for all toolbar items, the tab order switches based on the element's order in the DOM.
     *
     * @type {number}
     * @default -1
     */
    tabIndex?: number

}

/**
 * Interface for a class ToolbarSettings
 */
export interface ToolbarSettingsModel {

    /**
     * Specifies the collection of toolbar items in the component.
     * Represents the list of items to be displayed in the toolbar.
     *
     * @type {ToolbarItemModel[]}
     * @default []
     */
    items?: ToolbarItemModel[];

    /**
     * Event raised when a toolbar item is clicked in the component.
     *
     * @event itemClicked
     */
    itemClicked?: EmitType<ToolbarItemClickedEventArgs>;

}

/**
 * Interface for a class InterActiveChatBase
 */
export interface InterActiveChatBaseModel extends ComponentModel{

    /**
     * Event triggers when the component is created.
     *
     * @event 'created'
     */
    created?: EmitType<Object>;

}