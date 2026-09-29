import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['cornerRadius', 'fill', 'handleStrokeColor', 'handleStrokeWidth', 'height', 'iconStrokeColor', 'iconStrokeWidth', 'id', 'margin', 'offset', 'padding', 'pathData', 'tooltip', 'visibility', 'width'];
let outputs: string[] = [];
/**
 * Nodes Directive
 * ```html
 * <e-nodes>
 * <e-node>
 * <e-node-fixeduserhandles>
 * <e-node-fixeduserhandle>
 * </e-node-fixeduserhandle>
 * </e-node-fixeduserhandles>
 * </e-node>
 * </e-nodes>
 * ```
 */
@Directive({
    selector: 'e-node>e-node-fixeduserhandles>e-node-fixeduserhandle',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class NodeFixedUserHandleDirective extends ComplexBase<NodeFixedUserHandleDirective> {
    public directivePropList: any;
	


    /** 
     * Specifies the cornerRadius for fixed user handle container
     * @default 0
     */
    public declare cornerRadius: any;
    /** 
     * Specifies the fill color of the fixed user handle
     * @default 'transparent'
     */
    public declare fill: any;
    /** 
     * Specifies the stroke color of the fixed user handle container
     * @default ''
     */
    public declare handleStrokeColor: any;
    /** 
     * Specifies the stroke width of the fixed user handle container
     * @default 1
     */
    public declare handleStrokeWidth: any;
    /** 
     * Specifies the height of the fixed user handle
     * @default 10
     */
    public declare height: any;
    /** 
     * Specifies the stroke color of the fixed user handle
     * @default 'transparent'
     */
    public declare iconStrokeColor: any;
    /** 
     * Specifies the stroke width of the fixed user handle
     * @default 0
     */
    public declare iconStrokeWidth: any;
    /** 
     * Specifies the unique id of the fixed user handle
     * @default ''
     */
    public declare id: any;
    /** 
     * Specifies the space that the fixed user handle has to be moved from its actual position
     * @default new Margin(0,0,0,0)
     */
    public declare margin: any;
    /** 
     * Specifies the position of the node fixed user handle
     * @default { x: 0, y: 0 }
     */
    public declare offset: any;
    /** 
     * Specifies the space between the fixed user handle and container
     * @default new Margin(0,0,0,0)
     */
    public declare padding: any;
    /** 
     * Specifies the shape information for fixed user handle
     * @default ''
     */
    public declare pathData: any;
    /** 
     * Used to show tooltip for fixed user handle on mouse over.
     * @default {}
     */
    public declare tooltip: any;
    /** 
     * Specifies the visibility of the fixed user handle
     * @default true
     */
    public declare visibility: any;
    /** 
     * Specifies the width of the fixed user handle
     * @default 10
     */
    public declare width: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * NodeFixedUserHandle Array Directive
 * @private
 */
@Directive({
    selector: 'e-node>e-node-fixeduserhandles',
    standalone: true,
    queries: {
        children: new ContentChildren(NodeFixedUserHandleDirective)
    },
})
export class NodeFixedUserHandlesDirective extends ArrayBase<NodeFixedUserHandlesDirective> {
    constructor() {
        super('fixeduserhandles');
    }
}