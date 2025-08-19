import { ChildProperty, Property } from '@syncfusion/ej2-base';
import { ItemType } from '@syncfusion/ej2-navigations';
import { BuiltInToolbar } from '../../base/enums';

/**
 * Represents a toolbar item model in the block editor component.
 */
export class ToolbarItem extends ChildProperty<ToolbarItem> {

    /**
     * Specifies the unique identifier for the toolbar item.
     * This property is used to uniquely identify each item.
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Specifies the toolbar item type.
     * Supports built-in formatting options or custom commands.
     *
     * @default 'Custom'
     */
    @Property('Custom')
    public item: BuiltInToolbar;

    /**
     * Specifies the CSS classes for the icon associated with the item.
     * Allows styling and representation of icons next to item headers.
     *
     * @default ''
     */
    @Property('')
    public iconCss: string;

    /**
     * Specifies the text content associated with the item.
     * It can be used as a label or description. Default is empty.
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Specifies the type of the item, determining its function or category.
     * The default type is ItemType.Button.
     *
     * @default 'Button'
     */
    @Property('Button')
    public type: ItemType;

    /**
     * Specifies whether the item is visible.
     * This controls the visibility of the item in the UI. Default is true.
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Specifies whether the item is disabled.
     * When set to true, the item is not interactive. Default is false.
     *
     * @default false
     */
    @Property(false)
    public disabled: boolean;

    /**
     * Specifies the tooltip text that appears when hovering over the item.
     * It provides additional information or context. Default is an empty string.
     *
     * @default ''
     */
    @Property('')
    public tooltip: string;

    /**
     * Specifies additional CSS classes for styling the item.
     * This allows for further customization of the item's appearance. Default is an empty string.
     *
     * @default ''
     */
    @Property('')
    public cssClass: string;

    /**
     * Specifies the tab index of the item when it appears in a tabbing sequence.
     * This controls the keyboard focus order. Default is -1, indicating no focus.
     *
     * @default -1
     */
    @Property(-1)
    public tabIndex: number;

    /**
     * Specifies the template used for rendering the item.
     * It can be a string or a function returning a string, allowing for customized rendering. Default is null.
     *
     * @default null
     */
    @Property(null)
    public template: string | Object | Function;

    /**
     * Defines htmlAttributes used to add custom attributes to Toolbar command.
     * Supports HTML attributes such as style, class, etc.
     *
     * @default null
     */
    @Property(null)
    public htmlAttributes: { [key: string]: string };
}
