import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['activeSize', 'allowedSizes', 'buttonSettings', 'checkBoxSettings', 'colorPickerSettings', 'comboBoxSettings', 'cssClass', 'disabled', 'displayOptions', 'dropDownSettings', 'gallerySettings', 'groupButtonSettings', 'id', 'itemTemplate', 'keyTip', 'ribbonTooltipSettings', 'splitButtonSettings', 'type'];
let outputs: string[] = [];

@Directive({
    selector: 'e-ribbon-item',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        itemTemplate: new ContentChild('itemTemplate')
    }
})
export class RibbonItemDirective extends ComplexBase<RibbonItemDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the type of control to be added as the Ribbon Item.
     * @isenumeration true
     * @default RibbonItemType.Button
     * @asptype RibbonItemType
     */
    public declare type: any;
    /** 
     * Defines the active size of the ribbon item.
     * @default 'Medium'
     * @aspnumberenum 
     */
    public declare activeSize: any;
    /** 
     * Defines the sizes that are allowed for the ribbon item on ribbon resize.
     * @default null
     * @aspnumberenum 
     */
    public declare allowedSizes: any;
    /** 
     * Defines the settings for the ribbon button.
     * @default {}
     */
    public declare buttonSettings: any;
    /** 
     * Defines the settings for the ribbon checkbox.
     * @default {}
     */
    public declare checkBoxSettings: any;
    /** 
     * Defines the settings for the ribbon color picker.
     * @default {}
     */
    public declare colorPickerSettings: any;
    /** 
     * Defines the settings for the ribbon combobox.
     * @default {}
     */
    public declare comboBoxSettings: any;
    /** 
     * Defines one or more CSS classes to customize the appearance of item.
     * @default ''
     */
    public declare cssClass: any;
    /** 
     * Defines whether the item is disabled or not.
     * @default false
     */
    public declare disabled: any;
    /** 
     * Defines the display options for the ribbon item.
     * @default 'Auto'
     * @aspnumberenum 
     */
    public declare displayOptions: any;
    /** 
     * Defines the settings for the ribbon dropdown button.
     * @default {}
     */
    public declare dropDownSettings: any;
    /** 
     * Defines the properties of the gallery view in Ribbon.
     * @default {}
     */
    public declare gallerySettings: any;
    /** 
     * Defines the properties for group button in Ribbon
     * @default {}
     */
    public declare groupButtonSettings: any;
    /** 
     * Defines a unique identifier for the item.
     * @default ''
     */
    public declare id: any;
    /** 
     * Defines the key tip text to be accessed for specified Ribbon item.
     * @default ''
     */
    public declare keyTip: any;
    /** 
     * Defines the settings for the tooltip of the item.
     * @default {}
     */
    public declare ribbonTooltipSettings: any;
    /** 
     * Defines the settings for the ribbon split button.
     * @default {}
     */
    public declare splitButtonSettings: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(RibbonItemDirective.prototype, 'itemTemplate');

/**
 * RibbonItem Array Directive
 * @private
 */
@Directive({
    selector: 'e-ribbon-items',
    standalone: true,
    queries: {
        children: new ContentChildren(RibbonItemDirective)
    },
})
export class RibbonItemsDirective extends ArrayBase<RibbonItemsDirective> {
    constructor() {
        super('items');
    }
}