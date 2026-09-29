import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['align', 'cssClass', 'disabled', 'htmlAttributes', 'id', 'overflow', 'prefixIcon', 'showAlwaysInPopup', 'showTextOn', 'suffixIcon', 'tabIndex', 'template', 'text', 'tooltipText', 'type', 'visible', 'width'];
let outputs: string[] = ['click'];
/**
 * 'e-item' directive represent a item of the Angular Toolbar.
 * It must be contained in a Toolbar component(`ejs-toolbar`). 
 * ```html
 * <ejs-toolbar> 
 *   <e-items>
 *    <e-item text='Cut'></e-item>
 *    <e-item text='Copy'></e-item>
 *   </e-items>
 * </ejs-toolbar>
 * ```
 */
@Directive({
    selector: 'e-items>e-item',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        template: new ContentChild('template')
    }
})
export class ItemDirective extends ComplexBase<ItemDirective> {
    public directivePropList: any;
	public declare click: any;


    /** 
     * Specifies the types of command to be rendered in the Toolbar. 
     * Supported types are: 
     * * `Button`: Creates the Button control with its given properties like text, prefixIcon, etc. 
     * * `Separator`: Adds a horizontal line that separates the Toolbar commands. 
     * * `Input`: Creates an input element that is applicable to template rendering with Syncfusion controls like DropDownList, 
     * AutoComplete, etc.
     * @default 'Button'
     */
    public declare type: any;
    /** 
     * Specifies the location for aligning Toolbar items on the Toolbar. Each command will be aligned according to the `align` property. 
     * The possible values for this property as follows 
     * * `Left`: To align commands to the left side of the Toolbar. 
     * * `Center`: To align commands at the center of the Toolbar. 
     * * `Right`: To align commands to the right side of the Toolbar. 
     * 
     * @default "Left"
     * @asppopulatedefaultvalue 
     */
    public declare align: any;
    /** 
     * Defines single/multiple classes (separated by space) to be used for customization of commands.
     * @default ""
     */
    public declare cssClass: any;
    /** 
     * Specifies whether an item should be disabled or not.
     * @default false
     */
    public declare disabled: any;
    /** 
     * Defines htmlAttributes used to add custom attributes to Toolbar command. 
     * Supports HTML attributes such as style, class, etc.
     * @default null
     */
    public declare htmlAttributes: any;
    /** 
     * Specifies the unique ID to be used with button or input element of Toolbar items.
     * @default ""
     */
    public declare id: any;
    /** 
     * Specifies the Toolbar command display area when an element's content is too large to fit available space. 
     * This is applicable only to `popup` mode. The possible values for this property as follows 
     * * `Show`:  Always shows the item as the primary priority on the *Toolbar*. 
     * * `Hide`: Always shows the item as the secondary priority on the *popup*. 
     * * `None`: No priority for display, and as per normal order moves to popup when content exceeds.
     * @default 'None'
     */
    public declare overflow: any;
    /** 
     * Defines single/multiple classes separated by space used to specify an icon for the button. 
     * The icon will be positioned before the text content if text is available, otherwise the icon alone will be rendered.
     * @default ""
     */
    public declare prefixIcon: any;
    /** 
     * Defines the priority of items to display it in popup always. 
     * It allows to maintain toolbar item on popup always but it does not work for toolbar priority items.
     * @default false
     */
    public declare showAlwaysInPopup: any;
    /** 
     * Specifies where the button text will be displayed on *popup mode* of the Toolbar. 
     * The possible values for this property as follows 
     * * `Toolbar`:  Text will be displayed on *Toolbar* only. 
     * * `Overflow`: Text will be displayed only when content overflows to *popup*. 
     * * `Both`: Text will be displayed on *popup* and *Toolbar*.
     * @default 'Both'
     */
    public declare showTextOn: any;
    /** 
     * Defines single/multiple classes separated by space used to specify an icon for the button. 
     * The icon will be positioned after the text content if text is available.
     * @default ""
     */
    public declare suffixIcon: any;
    /** 
     * Specifies the tab order of the Toolbar items. When positive values assigned, it allows to switch focus to the next/previous toolbar items with Tab/ShiftTab keys. 
     * By default, user can able to switch between items only via arrow keys. 
     * If the value is set to 0 for all tool bar items, then tab switches based on element order.
     * @default -1
     */
    public declare tabIndex: any;
    /** 
     * Specifies the text to be displayed on the Toolbar button.
     * @default ""
     */
    public declare text: any;
    /** 
     * Specifies the text to be displayed on hovering the Toolbar button.
     * @default ""
     */
    public declare tooltipText: any;
    /** 
     * Specifies whether an item should be hidden or not.
     * @default true
     */
    public declare visible: any;
    /** 
     * Specifies the width of the Toolbar button commands.
     * @default 'auto'
     */
    public declare width: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(ItemDirective.prototype, 'template');

/**
 * Item Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-toolbar>e-items',
    standalone: true,
    queries: {
        children: new ContentChildren(ItemDirective)
    },
})
export class ItemsDirective extends ArrayBase<ItemsDirective> {
    constructor() {
        super('items');
    }
}