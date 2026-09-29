import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['content', 'cssClass', 'disabled', 'dotCss', 'oppositeContent'];
let outputs: string[] = [];
/**
 * 'e-timelineItem' directive represents a item of the Angular Timeline.
 * It must be contained in a Timeline component(`ejs-timeline`). 
 * ```html
 * <ejs-timeline>
 *  <e-items>
 *   <e-item [dotCss]='e-icons e-folder' [content]='Item 1' />
 *   <e-item [dotCss]='e-icons e-folder' [content]='Item 2' />
 *  </e-items> 
 * </ejs-timeline>
 * ```
 */
@Directive({
    selector: 'ejs-timeline>e-items>e-item',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class ItemDirective extends ComplexBase<ItemDirective> {
    public directivePropList: any;
	


    /** 
     * Defines the text content or template for the Timeline item. The current itemIndex passed as context to build the content.
     * @default ''
     * @angulartype string | object
     * @reacttype string | function | JSX.Element
     * @vuetype string | function
     * @asptype string
     */
    public declare content: any;
    /** 
     * Defines the CSS class to customize the Timeline item appearance.
     * @default ''
     */
    public declare cssClass: any;
    /** 
     * Defines whether to enable or disable the timeline item.
     * @default false
     */
    public declare disabled: any;
    /** 
     * Defines one or more CSS classes to include an icon or image in the Timeline item.
     * @default ''
     */
    public declare dotCss: any;
    /** 
     * Defines the additional text content or template to be displayed opposite side of the item. The current itemIndex passed as context to build the content.
     * @default ''
     * @angulartype string | object
     * @reacttype string | function | JSX.Element
     * @vuetype string | function
     * @asptype string
     */
    public declare oppositeContent: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Item Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-timeline>e-items',
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