import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['disabled', 'iconCss', 'id', 'text', 'title'];
let outputs: string[] = [];
/**
 * 'e-speeddialitem' directive represent a item of the Angular SpeedDial.
 * It must be contained in a SpeedDial component(`ejs-speeddial`). 
 * ```html
 * <ejs-speeddial> 
 *   <e-speeddialitems>
 *    <e-speeddialitem text='Cut'></e-speeddialitem>
 *    <e-speeddialitem text='Copy'></e-speeddialitem>
 *   </e-speeddialitems>
 * </ejs-speeddial>
 * ```
 */
@Directive({
    selector: 'e-speeddial-item',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class SpeedDialItemDirective extends ComplexBase<SpeedDialItemDirective> {
    public directivePropList: any;
	


    /** 
     * Defines whether to enable or disable the SpeedDialItem.
     * @default false
     */
    public declare disabled: any;
    /** 
     * Defines one or more CSS classes to include an icon or image in speed dial item.
     * @default ''
     */
    public declare iconCss: any;
    /** 
     * Defines a unique value for the SpeedDialItem which can be used to identify the item in event args.
     * @default ''
     */
    public declare id: any;
    /** 
     * Defines the text content of SpeedDialItem. 
     * Text won't be visible when mode is Radial. 
     * Also, in Linear mode, text won't be displayed when direction is Left or Right.
     * @default ''
     */
    public declare text: any;
    /** 
     * Defines the title of SpeedDialItem to display tooltip.
     * @default ''
     */
    public declare title: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * SpeedDialItem Array Directive
 * @private
 */
@Directive({
    selector: 'e-speeddial-items',
    standalone: true,
    queries: {
        children: new ContentChildren(SpeedDialItemDirective)
    },
})
export class SpeedDialItemsDirective extends ArrayBase<SpeedDialItemsDirective> {
    constructor() {
        super('items');
    }
}