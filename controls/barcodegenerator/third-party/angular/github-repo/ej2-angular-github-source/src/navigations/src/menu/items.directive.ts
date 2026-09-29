import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['htmlAttributes', 'iconCss', 'id', 'items', 'separator', 'text', 'url'];
let outputs: string[] = [];

@Directive({
    selector: 'ejs-menu>e-menu-items>e-menu-item>',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class MenuItemDirective extends ComplexBase<MenuItemDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the htmlAttributes property to support adding custom attributes to the menu items in the menu component.
     * @default null
     */
    public declare htmlAttributes: any;
    /** 
     * Defines class/multiple classes separated by a space for the menu Item that is used to include an icon. 
     * Menu Item can include font icon and sprite image.
     * @default null
     */
    public declare iconCss: any;
    /** 
     * Specifies the id for menu item.
     * @default ''
     */
    public declare id: any;
    /** 
     * Specifies the sub menu items that is the array of MenuItem model.
     * @default []
     */
    public declare items: any;
    /** 
     * Specifies separator between the menu items. Separator are either horizontal or vertical lines used to group menu items.
     * @default false
     */
    public declare separator: any;
    /** 
     * Specifies text for menu item.
     * @default ''
     */
    public declare text: any;
    /** 
     * Specifies url for menu item that creates the anchor link to navigate to the url provided.
     * @default ''
     */
    public declare url: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * MenuItem Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-menu>e-menu-items',
    standalone: true,
    queries: {
        children: new ContentChildren(MenuItemDirective)
    },
})
export class MenuItemsDirective extends ArrayBase<MenuItemsDirective> {
    constructor() {
        super('items');
    }
}