import { Directive, ViewContainerRef, ContentChildren } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';



let input: string[] = ['addInfo', 'connectionDirection', 'constraints', 'height', 'horizontalAlignment', 'id', 'inEdges', 'margin', 'offset', 'outEdges', 'pathData', 'shape', 'style', 'tooltip', 'verticalAlignment', 'visibility', 'width'];
let outputs: string[] = [];
/**
 * Nodes Directive
 * ```html
 * <e-nodes>
 * <e-node>
 * <e-node-ports>
 * <e-node-port>
 * </e-node-port>
 * </e-node-ports>
 * </e-node>
 * </e-nodes>
 * ```
 */
@Directive({
    selector: 'e-node>e-node-ports>e-node-port',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
    }
})
export class PortDirective extends ComplexBase<PortDirective> {
    public directivePropList: any;
	


    /** 
     * Allows the user to save custom information/data about a port
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare addInfo: any;
    /** 
     * Defines the allowed direction for connections to the port 
     * * Auto - Maintains the default behavior of automatic direction calculation. 
     * * Left - Restricts connections to only connect to the left side of the port. 
     * * Top - Restricts connections to only connect to the top side of the port. 
     * * Right - Restricts connections to only connect to the right side of the port. 
     * * Bottom - Restricts connections to only connect to the bottom side of the port.
     * @default 'Auto'
     */
    public declare connectionDirection: any;
    /** 
     * Defines the constraints of port
     * @default 'Default'
     * @aspnumberenum 
     */
    public declare constraints: any;
    /** 
     * Sets the height of the port
     * @default 12
     */
    public declare height: any;
    /** 
     * Sets the horizontal alignment of the port with respect to its immediate parent(node/connector) 
     * * Stretch - Stretches the diagram element throughout its immediate parent 
     * * Left - Aligns the diagram element at the left of its immediate parent 
     * * Right - Aligns the diagram element at the right of its immediate parent 
     * * Center - Aligns the diagram element at the center of its immediate parent 
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Center'
     */
    public declare horizontalAlignment: any;
    /** 
     * Defines the unique id of the port
     * @default ''
     */
    public declare id: any;
    /** 
     * Defines the collection of the objects that are connected to a particular port
     * @default undefined
     * @blazordefaultvalue new string[] { }
     */
    public declare inEdges: any;
    /** 
     * Defines the space that the port has to be moved from its actual position
     * @default new Margin(0,0,0,0)
     */
    public declare margin: any;
    /** 
     * Defines the position of the port with respect to the boundaries of nodes/connector
     * @default new Point(0.5,0.5)
     * @blazortype NodePortOffset
     */
    public declare offset: any;
    /** 
     * Defines the collection of the objects that are connected to a particular port
     * @default undefined
     * @blazordefaultvalue new string[] { }
     */
    public declare outEdges: any;
    /** 
     * Defines the geometry of the port
     * @default ''
     */
    public declare pathData: any;
    /** 
     * Defines the type of the port shape 
     * * X - Sets the decorator shape as X 
     * * Circle - Sets the decorator shape as Circle 
     * * Square - Sets the decorator shape as Square 
     * * Custom - Sets the decorator shape as Custom
     * @default 'Square'
     */
    public declare shape: any;
    /** 
     * Defines the appearance of the port 
     * 
     * @default {}
     */
    public declare style: any;
    /** 
     * defines the tooltip for the Ports
     * @default new DiagramToolTip();
     */
    public declare tooltip: any;
    /** 
     * Sets the vertical alignment of the port with respect to its immediate parent(node/connector) 
     * * Stretch - Stretches the diagram element throughout its immediate parent 
     * * Top - Aligns the diagram element at the top of its immediate parent 
     * * Bottom - Aligns the diagram element at the bottom of its immediate parent 
     * * Center - Aligns the diagram element at the center of its immediate parent 
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Center'
     */
    public declare verticalAlignment: any;
    /** 
     * Defines the type of the port visibility 
     * * Visible - Always shows the port 
     * * Hidden - Always hides the port 
     * * Hover - Shows the port when the mouse hovers over a node 
     * * Connect - Shows the port when a connection end point is dragged over a node
     * @default 'Connect'
     * @aspnumberenum 
     */
    public declare visibility: any;
    /** 
     * Sets the width of the port
     * @default 12
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
 * Port Array Directive
 * @private
 */
@Directive({
    selector: 'e-node>e-node-ports',
    standalone: true,
    queries: {
        children: new ContentChildren(PortDirective)
    },
})
export class PortsDirective extends ArrayBase<PortsDirective> {
    constructor() {
        super('ports');
    }
}