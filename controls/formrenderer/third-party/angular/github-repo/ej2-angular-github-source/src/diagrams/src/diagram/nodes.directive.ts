import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { NodeFixedUserHandlesDirective } from './node-fixeduserhandle.directive';
import { NodeAnnotationsDirective } from './node-annotation.directive';
import { PortsDirective } from './ports.directive';

let input: string[] = ['addInfo', 'annotations', 'backgroundColor', 'borderColor', 'borderWidth', 'branch', 'children', 'collapseIcon', 'columnIndex', 'columnSpan', 'columns', 'constraints', 'container', 'data', 'dragSize', 'excludeFromLayout', 'expandIcon', 'fixedUserHandles', 'flip', 'flipMode', 'height', 'horizontalAlignment', 'id', 'isExpanded', 'layoutInfo', 'margin', 'maxHeight', 'maxWidth', 'minHeight', 'minWidth', 'offsetX', 'offsetY', 'padding', 'pivot', 'ports', 'previewSize', 'rotateAngle', 'rowIndex', 'rowSpan', 'rows', 'shadow', 'shape', 'style', 'symbolInfo', 'tooltip', 'verticalAlignment', 'visible', 'width', 'wrapper', 'zIndex'];
let outputs: string[] = [];
/**
 * Nodes Directive
 * ```html
 * <e-nodes>
 * <e-node></e-node>
 * </e-nodes>
 * ```
 */
@Directive({
    selector: 'e-nodes>e-node',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childFixedUserHandles: new ContentChild(NodeFixedUserHandlesDirective),
        childAnnotations: new ContentChild(NodeAnnotationsDirective),
        childPorts: new ContentChild(PortsDirective)
    }
})
export class NodeDirective extends ComplexBase<NodeDirective> {
    public directivePropList: any;
	
    public declare childFixedUserHandles: any;
    public declare childAnnotations: any;
    public declare childPorts: any;
    public tags: string[] = ['fixedUserHandles', 'annotations', 'ports'];
    /** 
     * Allows the user to save custom information/data about a node/connector
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare addInfo: any;
    /** 
     * Defines the collection of textual annotations of nodes/connectors
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare annotations: any;
    /** 
     * Sets the background color of the shape
     * @default 'transparent'
     */
    public declare backgroundColor: any;
    /** 
     * Sets the border color of the node
     * @deprecated 
     * @default 'none'
     */
    public declare borderColor: any;
    /** 
     * Sets the border width of the node
     * @deprecated 
     * @default 0
     */
    public declare borderWidth: any;
    /** 
     * Set the branch for the mind map
     * @aspdefaultvalueignore 
     * @default ''
     */
    public declare branch: any;
    /** 
     * Defines the children of group element
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare children: any;
    /** 
     * Defines the collapsed state of a node
     * @default {}
     */
    public declare collapseIcon: any;
    /** 
     * Used to define a index of column in the grid
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare columnIndex: any;
    /** 
     * Merge the column use the property in the grid container
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare columnSpan: any;
    /** 
     * Used to define the column for the grid container
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare columns: any;
    /** 
     * Enables/Disables certain features of nodes 
     * * None - Disable all node Constraints 
     * * Select - Enables node to be selected 
     * * Drag - Enables node to be Dragged 
     * * Rotate - Enables node to be Rotate 
     * * Shadow - Enables node to display shadow 
     * * PointerEvents - Enables node to provide pointer  option 
     * * Delete - Enables node to delete 
     * * InConnect - Enables node to provide in connect option 
     * * OutConnect - Enables node to provide out connect option 
     * * Individual - Enables node to provide individual resize option 
     * * Expandable - Enables node to provide Expandable option 
     * * AllowDrop - Enables node to provide allow to drop option 
     * * Inherit - Enables node to inherit the interaction option 
     * * ResizeNorthEast - Enable ResizeNorthEast of the node 
     * * ResizeEast - Enable ResizeEast of the node 
     * * ResizeSouthEast - Enable ResizeSouthEast of the node 
     * * ResizeSouth - Enable ResizeSouthWest of the node 
     * * ResizeSouthWest - Enable ResizeSouthWest of the node 
     * * ResizeSouth - Enable ResizeSouth of the node 
     * * ResizeSouthWest - Enable ResizeSouthWest of the node 
     * * ResizeWest - Enable ResizeWest of the node 
     * * ResizeNorth - Enable ResizeNorth of the node 
     * * Resize - Enables the Aspect ratio fo the node 
     * * AspectRatio - Enables the Aspect ratio fo the node 
     * * Tooltip - Enables or disables tool tip for the Nodes 
     * * InheritTooltip - Enables or disables tool tip for the Nodes 
     * * ReadOnly - Enables the  ReadOnly support for Annotation
     * @default 'Default'
     * @aspnumberenum 
     */
    public declare constraints: any;
    /** 
     * Defines the type of the container
     * @aspdefaultvalueignore 
     * @default null
     * @deprecated 
     */
    public declare container: any;
    /** 
     * Sets the data source of the node
     */
    public declare data: any;
    /** 
     * Defines the size of a drop symbol
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare dragSize: any;
    /** 
     * Defines whether the node should be automatically positioned or not. Applicable, if layout option is enabled.
     * @default false
     */
    public declare excludeFromLayout: any;
    /** 
     * Defines the expanded state of a node
     * @default {}
     */
    public declare expandIcon: any;
    /** 
     * Specifies the collection of the fixed user handle
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare fixedUserHandles: any;
    /** 
     * Flip the element in Horizontal/Vertical directions
     * @aspdefaultvalueignore 
     * @default None
     */
    public declare flip: any;
    /** 
     * Allows you to flip only the node or along with port and label.
     * 
     * This functionality is applicable only for nodes.
     *     
     * @aspdefaultvalueignore 
     * @default All
     */
    public declare flipMode: any;
    /** 
     * Sets the height of the node
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare height: any;
    /** 
     * Sets the horizontalAlignment of the node
     * @default 'Stretch'
     */
    public declare horizontalAlignment: any;
    /** 
     * Represents the unique id of nodes/connectors
     * @default ''
     */
    public declare id: any;
    /** 
     * Defines whether the node is expanded or not
     * @default true
     */
    public declare isExpanded: any;
    /** 
     * Sets the layout properties using node property
     * @default new NodeLayoutInfo()
     * @asptype object
     */
    public declare layoutInfo: any;
    /** 
     * Defines the space to be left between the node and its immediate parent
     * @default {}
     */
    public declare margin: any;
    /** 
     * Sets the maximum height of the node
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare maxHeight: any;
    /** 
     * Sets the maximum width of the node
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare maxWidth: any;
    /** 
     * Sets the minimum height of the node
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare minHeight: any;
    /** 
     * Sets the minimum width of the node
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare minWidth: any;
    /** 
     * Sets the x-coordinate of the position of the node
     * @default 0
     */
    public declare offsetX: any;
    /** 
     * Sets the y-coordinate of the position of the node
     * @default 0
     */
    public declare offsetY: any;
    /** 
     * Defines the space between the group node edges and its children
     * @aspdefaultvalueignore 
     * @default 0
     */
    public declare padding: any;
    /** 
     * Sets the reference point, that will act as the offset values(offsetX, offsetY) of a node
     * @default new Point(0.5,0.5)
     */
    public declare pivot: any;
    /** 
     * Defines the collection of connection points of nodes/connectors
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare ports: any;
    /** 
     * Defines the size of the symbol preview
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare previewSize: any;
    /** 
     * Sets the rotate angle of the node
     * @default 0
     */
    public declare rotateAngle: any;
    /** 
     * Used to define a index of row in the grid
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare rowIndex: any;
    /** 
     * Merge the row use the property in the grid container
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare rowSpan: any;
    /** 
     * Used to define the rows for the grid container
     * @aspdefaultvalueignore 
     * @deprecated 
     * @default undefined
     */
    public declare rows: any;
    /** 
     * Defines the shadow of a shape/path
     * @default null
     */
    public declare shadow: any;
    /** 
     * Defines the shape of a node
     * @default Basic Shape
     * @asptype object
     */
    public declare shape: any;
    /** 
     * Sets the shape style of the node
     * @default new ShapeStyle()
     * @asptype object
     */
    public declare style: any;
    /** 
     * Defines the symbol info of a connector
     * @aspdefaultvalueignore 
     * @default undefined
     * @ignoreapilink 
     */
    public declare symbolInfo: any;
    /** 
     * defines the tooltip for the node
     * @default {}
     */
    public declare tooltip: any;
    /** 
     * Sets the verticalAlignment of the node
     * @default 'Stretch'
     */
    public declare verticalAlignment: any;
    /** 
     * Sets the visibility of the node/connector
     * @default true
     */
    public declare visible: any;
    /** 
     * Sets the width of the node
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare width: any;
    /** 
     * Sets or gets the UI of a node
     * @default null
     * @deprecated 
     */
    public declare wrapper: any;
    /** 
     * Defines the visual order of the node/connector in DOM
     * @aspdefaultvalue 5e-324
     * @default Number.MIN_VALUE
     */
    public declare zIndex: any;

    constructor(private viewContainerRef:ViewContainerRef) {
        super();
        setValue('currentInstance', this, this.viewContainerRef);
        this.registerEvents(outputs);
        this.directivePropList = input;
    }
}

/**
 * Node Array Directive
 * @private
 */
@Directive({
    selector: 'ej-diagram>e-nodes',
    standalone: true,
    queries: {
        children: new ContentChildren(NodeDirective)
    },
})
export class NodesDirective extends ArrayBase<NodesDirective> {
    constructor() {
        super('nodes');
    }
}