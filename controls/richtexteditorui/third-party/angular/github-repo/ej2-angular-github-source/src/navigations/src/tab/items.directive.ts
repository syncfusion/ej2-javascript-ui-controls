import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['content', 'cssClass', 'disabled', 'header', 'headerTemplate', 'id', 'tabIndex', 'visible'];
let outputs: string[] = [];
/**
 * 'e-tabitem' directive represent a item of the Angular Tab.
 * It must be contained in a Tab component(`ejs-tab`). 
 * ```html
 * <ejs-tab>
 *  <e-tabitems>
 *   <e-tabitem [header]='Header 1' [content]='Content 1'></e-tabitem>
 *   <e-tabitem [header]='Header 2' [content]='Content 2'></e-tabitem>
 *  <e-tabitems> 
 * </ejs-tab>
 * ```
 */
@Directive({
    selector: 'e-tabitems>e-tabitem',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        content: new ContentChild('content'),
        header_text: new ContentChild('headerText'),
        headerTemplate: new ContentChild('headerTemplate')
    }
})
export class TabItemDirective extends ComplexBase<TabItemDirective> {
    public directivePropList: any;
	


    /** 
     * Sets the CSS classes to the Tab item to customize its styles.
     * @default ''
     */
    public declare cssClass: any;
    /** 
     * Sets true to disable user interactions of the Tab item.
     * @default false
     */
    public declare disabled: any;
    /** 
     * The object used for configuring the Tab item header properties.
     * @default {}
     */
    public declare header: any;
    /** 
     * Sets unique ID to Tab item.
     * @default null
     */
    public declare id: any;
    /** 
     * Specifies the tab order of the Tabs items. When positive values assigned, it allows to switch focus to the next/previous tabs items with Tab/ShiftTab keys. 
     * By default, user can able to switch between items only via arrow keys. 
     * If the value is set to 0 for all tabs items, then tab switches based on element order.
     * @default -1
     */
    public declare tabIndex: any;
    /** 
     * Sets false to hide the Tab item.
     * @default true
     */
    public declare visible: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(TabItemDirective.prototype, 'content');
Template()(TabItemDirective.prototype, 'header_text');
Template()(TabItemDirective.prototype, 'headerTemplate');

/**
 * TabItem Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-tab>e-tabitems',
    standalone: true,
    queries: {
        children: new ContentChildren(TabItemDirective)
    },
})
export class TabItemsDirective extends ArrayBase<TabItemsDirective> {
    constructor() {
        super('items');
    }
}