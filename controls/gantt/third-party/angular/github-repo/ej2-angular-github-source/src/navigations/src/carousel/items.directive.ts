import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';
import { Template } from '@syncfusion/ej2-angular-base';


let input: string[] = ['cssClass', 'htmlAttributes', 'interval', 'template'];
let outputs: string[] = [];
/**
 * `e-carousel-item` directive represent a item of the Angular Carousel.
 * It must be contained in a Carousel component(`ejs-carousel`).
 * ```html
 * <ejs-carousel>
 *   <e-carousel-items>
 *    <e-carousel-item template='#item1'></e-carousel-item>
 *    <e-carousel-item template='#item2'></e-carousel-item>
 *   </e-carousel-items>
 * </ejs-carousel>
 * ```
 */
@Directive({
    selector: 'ejs-carousel>e-carousel-items>e-carousel-item',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        template: new ContentChild('template')
    }
})
export class CarouselItemDirective extends ComplexBase<CarouselItemDirective> {
    public directivePropList: any;
	


    /** 
     * Accepts single/multiple classes (separated by a space) to be used for individual carousel item customization.
     * @default null
     */
    public declare cssClass: any;
    /** 
     * Accepts HTML attributes/custom attributes to add in individual carousel item.
     * @default null
     */
    public declare htmlAttributes: any;
    /** 
     * Accepts the interval duration in milliseconds for individual carousel item transition.
     * @default null
     */
    public declare interval: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}
Template()(CarouselItemDirective.prototype, 'template');

/**
 * CarouselItem Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-carousel>e-carousel-items',
    standalone: true,
    queries: {
        children: new ContentChildren(CarouselItemDirective)
    },
})
export class CarouselItemsDirective extends ArrayBase<CarouselItemsDirective> {
    constructor() {
        super('items');
    }
}