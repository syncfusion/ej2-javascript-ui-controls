import { Property, ChildProperty, Event, EmitType } from '@syncfusion/ej2-base';import { ClickEventArgs, DisplayMode, ItemAlign, ItemType, OverflowOption } from '@syncfusion/ej2-navigations';import { ToolbarName } from '../base/type';

/**
 * Interface for a class ToolbarItem
 */
export interface ToolbarItemModel {

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
     * This is applicable only to `popup` mode. The possible values for this property as follows
     * * `Show`:  Always shows the item as the primary priority on the *Toolbar*.
     * * `Hide`: Always shows the item as the secondary priority on the *popup*.
     * * `None`: No priority for display, and as per normal order moves to popup when content exceeds.
     *
     * @default 'None'
     * @aspDefaultValue Syncfusion.EJ2.Navigations.OverflowOption.None
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Navigations.OverflowOption
     */
    overflow?: OverflowOption;

    /**
     * Specifies the HTML element/element ID as a string that can be added as a Toolbar command.
     * ```
     * E.g - items: [{ template: '<input placeholder="Search"/>' },{ template: '#checkbox1' }]
     * ```
     *
     * @default ""
     * @angularType string | object
     * @reactType string | function | JSX.Element
     * @vueType string | function
     * @aspType string
     */
    template?: string | Object | Function;

    /**
     * Specifies the types of command to be rendered in the Toolbar.
     * Supported types are:
     * * `Button`: Creates the Button control with its given properties like text, prefixIcon, etc.
     * * `Separator`: Adds a horizontal line that separates the Toolbar commands.
     * * `Input`: Creates an input element that is applicable to template rendering with Syncfusion controls like DropDownList,
     * AutoComplete, etc.
     *
     * @default 'Button'
     * @aspDefaultValue Syncfusion.EJ2.Navigations.ItemType.Button
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Navigations.ItemType
     */
    type?: ItemType;

    /**
     * Specifies where the button text will be displayed on *popup mode* of the Toolbar.
     * The possible values for this property as follows
     * * `Toolbar`:  Text will be displayed on *Toolbar* only.
     * * `Overflow`: Text will be displayed only when content overflows to *popup*.
     * * `Both`: Text will be displayed on *popup* and *Toolbar*.
     *
     * @default 'Both'
     * @aspDefaultValue Syncfusion.EJ2.Navigations.DisplayMode.Both
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Navigations.DisplayMode
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
     * The possible values for this property as follows
     * * `Left`: To align commands to the left side of the Toolbar.
     * * `Center`: To align commands at the center of the Toolbar.
     * * `Right`: To align commands to the right side of the Toolbar.
     *
     * @default 'Left'
     * @aspDefaultValue Syncfusion.EJ2.Navigations.ItemAlign.Left
     * @isEnumeration true
     * @aspType Syncfusion.EJ2.Navigations.ItemAlign
     */
    align?: ItemAlign;

    /**
     * Specifies the tab order of the Toolbar items. When positive values assigned, it allows to switch focus to the next/previous toolbar items with Tab/ShiftTab keys.
     * By default, user can able to switch between items only via arrow keys.
     * If the value is set to 0 for all tool bar items, then tab switches based on element order.
     *
     * @default -1
     */
    tabIndex?: number;

    /**
     * Specifies the unique name for each toolbar item rendered in Schedule. This name is used to map the toolbar items in the Schedule component.
     *
     * To access the default toolbar items, provide the name below,
     *
     * * `Custom`: Schedule component render the custom toolbar item.
     * * `Previous`: Schedule component navigates to the previous date from the current date.
     * * `Next`: Schedule component navigates to the next date from the current date.
     * * `Today`: Schedule component navigates to the current date from any date.
     * * `Views`: Schedule component render the defined view options in the toolbar. If view option is not defined, then it will render default view options in the Schedule.
     * * `DateRangeText`: Schedule component displays the current date text range.
     * * `NewEvent`: Schedule component render the icon to add a new event.
     *
     * @default 'Custom'
     * @aspDefaultValue Custom
     * @isEnumeration true
     * @aspType ToolbarName
     */
    name?: ToolbarName;

    /**
     * Event triggers when `click` the toolbar item.
     *
     * @event click
     */
    click?: EmitType<ClickEventArgs>;

}