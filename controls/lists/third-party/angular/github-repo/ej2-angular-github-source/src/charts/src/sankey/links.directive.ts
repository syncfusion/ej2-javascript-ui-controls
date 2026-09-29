import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['sourceId', 'targetId', 'value'];
let outputs: string[] = [];
/**
 * Sankey Links Directive
 * ```html
 * <e-sankey-links>
 * <e-sankey-link></e-sankey-link>
 * </e-sankey-links>
 * ```
 */
@Directive({
    selector: 'e-sankey-links>e-sankey-link',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class SankeyLinkDirective extends ComplexBase<SankeyLinkDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the unique identifier of the source node for this 
     * link. 
     * This should match the `id` of an existing Sankey node.
     * @default null
     */
    public declare sourceId: any;
    /** 
     * Specifies the unique identifier of the target node for this link. 
     * This should match the `id` of an existing Sankey node.
     * @default null
     */
    public declare targetId: any;
    /** 
     * Defines the weight or value of the link. 
     * This determines the thickness of the link in the Sankey diagram.
     * @default null
     */
    public declare value: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * SankeyLink Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-sankey>e-sankey-links',
    standalone: true,
    queries: {
        children: new ContentChildren(SankeyLinkDirective)
    },
})
export class SankeyLinksCollectionDirective extends ArrayBase<SankeyLinksCollectionDirective> {
    constructor() {
        super('links');
    }
}