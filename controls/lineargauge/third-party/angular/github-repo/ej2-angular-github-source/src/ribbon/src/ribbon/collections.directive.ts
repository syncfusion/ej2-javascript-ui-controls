import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { RibbonItemsDirective } from './items.directive';

let input: string[] = ['cssClass', 'id', 'items'];
let outputs: string[] = [];

@Directive({
    selector: 'e-ribbon-collection',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childItems: new ContentChild(RibbonItemsDirective)
    }
})
export class RibbonCollectionDirective extends ComplexBase<RibbonCollectionDirective> {
    public directivePropList: any;
	
    public declare childItems: any;
    public tags: string[] = ['items'];
    /** 
     * Defines one or more CSS classes to customize the appearance of collection.
     * @default ''
     */
    public declare cssClass: any;
    /** 
     * Defines a unique identifier for the collection.
     * @default ''
     */
    public declare id: any;
    /** 
     * Defines the list of ribbon items.
     * @default []
     * @asptype List<RibbonItem>
     */
    public declare items: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * RibbonCollection Array Directive
 * @private
 */
@Directive({
    selector: 'e-ribbon-collections',
    standalone: true,
    queries: {
        children: new ContentChildren(RibbonCollectionDirective)
    },
})
export class RibbonCollectionsDirective extends ArrayBase<RibbonCollectionsDirective> {
    constructor() {
        super('collections');
    }
}