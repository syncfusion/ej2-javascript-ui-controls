import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['content', 'cssClass', 'disabled', 'expanded', 'header', 'iconCss', 'id', 'visible'];
let outputs: string[] = [];
/**
 * 'e-accordionitem' directive represent a item of the Angular Accordion.
 * It must be contained in a Accordion component(`ejs-accordion`). 
 * ```html
 * <ejs-accordion> 
 *   <e-accordionitems>
 *    <e-accordionitem header='Header1'></e-accordionitem>
 *    <e-accordionitem header='Header2' content='Content2'></e-accordionitem>
 *   </e-accordionitems>
 * </ejs-accordion>
 * ```
 */
@Directive({
    selector: 'e-accordionitems>e-accordionitem',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        header: new ContentChild('header'),
        content: new ContentChild('content')
    }
})
export class AccordionItemDirective extends ComplexBase<AccordionItemDirective> {
    public directivePropList: any;
	


    /** 
     * Defines single/multiple classes (separated by a space) are to be used for Accordion item customization.
     * @default null
     */
    public declare cssClass: any;
    /** 
     * Sets true to disable an accordion item.
     * @default false
     */
    public declare disabled: any;
    /** 
     * Sets the expand (true) or collapse (false) state of the Accordion item. By default, all the items are in a collapsed state.
     * @default false
     */
    public declare expanded: any;
    /** 
     * Defines an icon with the given custom CSS class that is to be rendered before the header text. 
     * Add the css classes to the `iconCss` property and write the css styles to the defined class to set images/icons. 
     * Adding icon is applicable only to the header. 
     * 
     * @default null
     */
    public declare iconCss: any;
    /** 
     * Sets unique ID to accordion item.
     * @default null
     */
    public declare id: any;
    /** 
     * Sets false to hide an accordion item.
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
Template()(AccordionItemDirective.prototype, 'header');
Template()(AccordionItemDirective.prototype, 'content');

/**
 * AccordionItem Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-accordion>e-accordionitems',
    standalone: true,
    queries: {
        children: new ContentChildren(AccordionItemDirective)
    },
})
export class AccordionItemsDirective extends ArrayBase<AccordionItemsDirective> {
    constructor() {
        super('items');
    }
}