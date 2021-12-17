import { Component, EventHandler, Property, Event, EmitType, BaseEventArgs } from '@syncfusion/ej2-base';import { addClass, removeClass, isVisible, closest, attributes, detach, classList, KeyboardEvents } from '@syncfusion/ej2-base';import { selectAll, setStyleAttribute as setStyle, KeyboardEventArgs, select } from '@syncfusion/ej2-base';import { isNullOrUndefined as isNOU, getUniqueID, formatUnit, Collection, compile as templateCompiler } from '@syncfusion/ej2-base';import { INotifyPropertyChanged, NotifyPropertyChanges, ChildProperty, Browser, SanitizeHtmlHelper } from '@syncfusion/ej2-base';import { Popup } from '@syncfusion/ej2-popups';import { calculatePosition } from '@syncfusion/ej2-popups';import { Button, IconPosition } from '@syncfusion/ej2-buttons';import { HScroll } from '../common/h-scroll';import { VScroll } from '../common/v-scroll';
import {OverflowOption,ItemType,DisplayMode,ItemAlign,ClickEventArgs,OverflowMode,BeforeCreateArgs} from "./toolbar";
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class Item
 */
export interface ItemModel {

    /**
     * Specifies the unique ID to be used with button or input element of Toolbar items.
     *
     * @default ""
     */
    id?: string;

    /**
     * Specifies the text to be displayed on the Toolbar button.
     *
     * @default ""
     */
    text?: string;

    /**
     * Specifies the width of the Toolbar button commands.
     *
     * @default 'auto'
     */
    width?: number | string;

    /**
     * Defines single/multiple classes (separated by space) to be used for customization of commands.
     *
     * @default ""
     */
    cssClass?: string;

    /**
     * Defines the priority of items to display it in popup always.
     * It allows to maintain toolbar item on popup always but it does not work for toolbar priority items.
     *
     * @default false
     */
    showAlwaysInPopup?: boolean;

    /**
     * Specifies whether an item should be disabled or not.
     *
     * @default false
     */
    disabled?: boolean;

    /**
     * Defines single/multiple classes separated by space used to specify an icon for the button.
     * The icon will be positioned before the text content if text is available, otherwise the icon alone will be rendered.
     *
     * @default ""
     */
    prefixIcon?: string;

    /**
     * Defines single/multiple classes separated by space used to specify an icon for the button.
     * The icon will be positioned after the text content if text is available.
     *
     * @default ""
     */
    suffixIcon?: string;

    /**
     * Specifies whether an item should be hidden or not.
     *
     * @default true
     */
    visible?: boolean;

    /**
     * Specifies the Toolbar command display area when an element's content is too large to fit available space.
     * This is applicable only to `popup` mode. Possible values are:
     * - Show:  Always shows the item as the primary priority on the *Toolbar*.
     * - Hide: Always shows the item as the secondary priority on the *popup*.
     * - None: No priority for display, and as per normal order moves to popup when content exceeds.
     *
     * @default 'None'
     */
    overflow?: OverflowOption;

    /**
     * Specifies the HTML element/element ID as a string that can be added as a Toolbar command.
     * ```
     * E.g - items: [{ template: '<input placeholder="Search"/>' },{ template: '#checkbox1' }]
     * ```
     *
     * @default ""
     */
    template?: string | Object;

    /**
     * Specifies the types of command to be rendered in the Toolbar.
     * Supported types are:
     * - Button: Creates the Button control with its given properties like text, prefixIcon, etc.
     * - Separator: Adds a horizontal line that separates the Toolbar commands.
     * - Input: Creates an input element that is applicable to template rendering with Syncfusion controls like DropDownList,
     * AutoComplete, etc.
     *
     * @default 'Button'
     */
    type?: ItemType;

    /**
     * Specifies where the button text will be displayed on *popup mode* of the Toolbar.
     * Possible values are:
     * - Toolbar:  Text will be displayed on *Toolbar* only.
     * - Overflow: Text will be displayed only when content overflows to *popup*.
     * - Both: Text will be displayed on *popup* and *Toolbar*.
     *
     * @default 'Both'
     */
    showTextOn?: DisplayMode;

    /**
     * Defines htmlAttributes used to add custom attributes to Toolbar command.
     * Supports HTML attributes such as style, class, etc.
     *
     * @default null
     */
    htmlAttributes?: { [key: string]: string };

    /**
     * Specifies the text to be displayed on hovering the Toolbar button.
     *
     * @default ""
     */
    tooltipText?: string;

    /**
     * Specifies the location for aligning Toolbar items on the Toolbar. Each command will be aligned according to the `align` property.
     * Possible values are:
     * - Left: To align commands to the left side of the Toolbar.
     * - Center: To align commands at the center of the Toolbar.
     * - Right: To align commands to the right side of the Toolbar.
     * ```html
     * <div id="element"> </div>
     * ```
     * ```typescript
     * let toolbar: Toolbar = new Toolbar({
     *     items: [
     *         { text: "Home" },
     *         { text: "My Home Page" , align: 'Center' },
     *         { text: "Search", align: 'Right' }
     *         { text: "Settings", align: 'Right' }
     *     ]
     * });
     * toolbar.appendTo('#element');
     * ```
     *
     * @default "Left"
     */
    align?: ItemAlign;

    /**
     * Event triggers when `click` the toolbar item.
     *
     * @event click
     */
    click?: EmitType<ClickEventArgs>;

}

/**
 * Interface for a class Toolbar
 */
export interface ToolbarModel extends ComponentModel{

    /**
     * An array of items that is used to configure Toolbar commands.
     *
     * @default []
     */
    items?: ItemModel[];

    /**
     * Specifies the width of the Toolbar in pixels/numbers/percentage. Number value is considered as pixels.
     *
     * @default 'auto'
     */
    width?: string | number;

    /**
     * Specifies the height of the Toolbar in pixels/number/percentage. Number value is considered as pixels.
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
     * Specifies the Toolbar display mode when Toolbar content exceeds the viewing area.
     * Possible modes are:
     * - Scrollable: All the elements are displayed in a single line with horizontal scrolling enabled.
     * - Popup: Prioritized elements are displayed on the Toolbar and the rest of elements are moved to the *popup*.
     * - MultiRow: Displays the overflow toolbar items as an in-line of a toolbar.
     * - Extended: Hide the overflowing toolbar items in the next row.  Show the overflowing toolbar items when you click the expand icons.
     * If the popup content overflows the height of the page, the rest of the elements will be hidden.
     *
     * @default 'Scrollable'
     */
    overflowMode?: OverflowMode;

    /**
     * Specifies the scrolling distance in scroller.
     *
     * @default null
     */
    scrollStep?: number;

    /**
     * Enable or disable the popup collision.
     *
     * @default true
     */
    enableCollision?: boolean;

    /**
     * Defines whether to allow the cross-scripting site or not.
     *
     * @default true
     */
    enableHtmlSanitizer?: boolean;

    /**
     * When this property is set to true, it allows the keyboard interaction in toolbar.
     *
     * @default true
     */
    allowKeyboard?: boolean;

    /**
     * The event will be fired on clicking the Toolbar elements.
     *
     * @event clicked
     */
    clicked?: EmitType<ClickEventArgs>;

    /**
     * The event will be fired when the control is rendered.
     *
     * @event created
     */
    created?: EmitType<Event>;

    /**
     * The event will be fired when the control gets destroyed.
     *
     * @event destroyed
     */
    destroyed?: EmitType<Event>;

    /**
     * The event will be fired before the control is rendered on a page.
     *
     * @event beforeCreate
     */
    beforeCreate?: EmitType<BeforeCreateArgs>;

}