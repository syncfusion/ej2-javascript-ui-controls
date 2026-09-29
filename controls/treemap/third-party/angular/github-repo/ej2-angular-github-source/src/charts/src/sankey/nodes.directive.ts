import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['color', 'id', 'label', 'offset'];
let outputs: string[] = [];
/**
 * Sankey Nodes Directive
 * ```html
 * <e-sankey-nodes>
 * <e-sankey-node></e-sankey-node>
 * </e-sankey-nodes>
 * ```
 */
@Directive({
    selector: 'e-sankey-nodes>e-sankey-node',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class SankeyNodeDirective extends ComplexBase<SankeyNodeDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the color applied to the node. 
     * The node color is applied based on the current theme if this property is not specified.
     * @default null
     */
    public declare color: any;
    /** 
     * A unique string identifier for the node. 
     * Ensure the `id` is unique across all nodes in the Sankey chart.
     * @default null
     */
    public declare id: any;
    /** 
     * Options for customizing the data label of the Sankey node.
     */
    public declare label: any;
    /** 
     * Specifies a custom offset position for the node. 
     * This allows shifting the node horizontally (in Horizontal orientation) or vertically (in Vertical orientation), relative to its computed layout position.
     * @default 0
     */
    public declare offset: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * SankeyNode Array Directive
 * @private
 */
@Directive({
    selector: 'ejs-sankey>e-sankey-nodes',
    standalone: true,
    queries: {
        children: new ContentChildren(SankeyNodeDirective)
    },
})
export class SankeyNodesCollectionDirective extends ArrayBase<SankeyNodesCollectionDirective> {
    constructor() {
        super('nodes');
    }
}