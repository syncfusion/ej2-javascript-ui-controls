import { Directive, ViewContainerRef, ContentChildren, ContentChild } from '@angular/core';
import { ComplexBase, ArrayBase, setValue } from '@syncfusion/ej2-angular-base';

import { ConnectorFixedUserHandlesDirective } from './connector-fixeduserhandle.directive';
import { ConnectorAnnotationsDirective } from './connector-annotation.directive';

let input: string[] = ['addInfo', 'allowNodeOverlap', 'annotations', 'bezierSettings', 'bridgeSpace', 'connectionPadding', 'connectorSpacing', 'constraints', 'cornerRadius', 'dragSize', 'excludeFromLayout', 'fixedUserHandles', 'flip', 'flipMode', 'hitPadding', 'id', 'margin', 'maxSegmentThumb', 'ports', 'previewSize', 'segmentThumbShape', 'segmentThumbSize', 'segments', 'shape', 'sourceDecorator', 'sourceID', 'sourcePadding', 'sourcePoint', 'sourcePortID', 'style', 'symbolInfo', 'targetDecorator', 'targetID', 'targetPadding', 'targetPoint', 'targetPortID', 'tooltip', 'type', 'visible', 'wrapper', 'zIndex'];
let outputs: string[] = [];
/**
 * Connectors Directive
 * ```html
 * <e-connectors>
 * <e-connector></e-connector>
 * </e-connectors>
 * ```
 */
@Directive({
    selector: 'e-connectors>e-connector',
    inputs: input,
    outputs: outputs,
    standalone: true,
    queries: {
        childFixedUserHandles: new ContentChild(ConnectorFixedUserHandlesDirective),
        childAnnotations: new ContentChild(ConnectorAnnotationsDirective)
    }
})
export class ConnectorDirective extends ComplexBase<ConnectorDirective> {
    public directivePropList: any;
	
    public declare childFixedUserHandles: any;
    public declare childAnnotations: any;
    public tags: string[] = ['fixedUserHandles', 'annotations'];
    /** 
     * Defines the type of the connector 
     * * Straight - Sets the segment type as Straight 
     * * Orthogonal - Sets the segment type as Orthogonal 
     * * Bezier - Sets the segment type as Bezier
     * @default 'Straight'
     * @asptype Syncfusion.EJ2.Diagrams.Segments
     */
    public declare type: any;
    /** 
     * Allows the user to save custom information/data about a node/connector
     * @aspdefaultvalueignore 
     * @default undefined
     */
    public declare addInfo: any;
    /** 
     * Specifies a value indicating whether to overlap the connector over with the source and target node. 
     * If the LineRouting is enabled in the diagram, then allowNodeOverlap property will not work.
     * @default false
     */
    public declare allowNodeOverlap: any;
    /** 
     * 
     */
    public declare annotations: any;
    /** 
     * Sets the bezier settings of editing the segments.
     * @default null
     */
    public declare bezierSettings: any;
    /** 
     * Defines the bridgeSpace of connector
     * @default 10
     */
    public declare bridgeSpace: any;
    /** 
     * Sets the connector padding value
     * @default 0
     */
    public declare connectionPadding: any;
    /** 
     * Sets the distance between source node and connector
     * @default 13
     */
    public declare connectorSpacing: any;
    /** 
     * Defines the constraints of connector 
     * * None - Interaction of the connectors cannot be done. 
     * * Select - Selects the connector. 
     * * Delete - Delete the connector. 
     * * Drag - Drag the connector. 
     * * DragSourceEnd - Drag the source end of the connector. 
     * * DragTargetEnd - Drag the target end of the connector. 
     * * DragSegmentThump - Drag the segment thumb of the connector. 
     * * AllowDrop - Allow to drop a node. 
     * * Bridging - Creates bridge  on intersection of two connectors. 
     * * InheritBridging - Creates bridge  on intersection of two connectors. 
     * * PointerEvents - Sets the pointer events. 
     * * Tooltip - Displays a tooltip for the connectors. 
     * * InheritToolTip - Displays a tooltip for the connectors. 
     * * Interaction - Features of the connector used for interaction. 
     * * ReadOnly - Enables ReadOnly
     * @default 'Default'
     * @aspnumberenum 
     */
    public declare constraints: any;
    /** 
     * Sets the corner radius of the connector
     * @default 0
     */
    public declare cornerRadius: any;
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
     * Sets the connector padding value
     * @default 10
     */
    public declare hitPadding: any;
    /** 
     * Represents the unique id of nodes/connectors
     * @default ''
     */
    public declare id: any;
    /** 
     * Defines the space to be left between the node and its immediate parent
     * @default {}
     */
    public declare margin: any;
    /** 
     * Sets the maximum segment thumb for the connector
     * @default null
     */
    public declare maxSegmentThumb: any;
    /** 
     * Defines the behavior of connection ports
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
     * Defines the shape for the connector segmentThumb 
     * Rhombus - Sets the segmentThumb shape as Rhombus 
     * Square - Sets the segmentThumb shape as Square 
     * Rectangle - Sets the segmentThumb shape as Rectangle 
     * Ellipse - Sets the segmentThumb shape as Ellipse 
     * Arrow - Sets the segmentThumb shape as Arrow 
     * Diamond - Sets the segmentThumb shape as Diamond 
     * OpenArrow - Sets the segmentThumb shape as OpenArrow 
     * Circle - Sets the segmentThumb shape as Circle 
     * Fletch - Sets the segmentThumb shape as Fletch 
     * OpenFetch - Sets the segmentThumb shape as OpenFetch 
     * IndentedArrow - Sets the segmentThumb shape as Indented Arrow 
     * OutdentedArrow - Sets the segmentThumb shape as Outdented Arrow 
     * DoubleArrow - Sets the segmentThumb shape as DoubleArrow
     * @default 'Circle'
     */
    public declare segmentThumbShape: any;
    /** 
     * Specifies the size of the segment thumb for individual connector. When not set, it defaults to matching the underlying path data
     * @default 10
     */
    public declare segmentThumbSize: any;
    /** 
     * Defines the segments
     * @default []
     * @asptype object
     */
    public declare segments: any;
    /** 
     * Defines the shape of the connector
     * @default 'Bpmn'
     * @asptype object
     */
    public declare shape: any;
    /** 
     * Defines the source decorator of the connector
     * @default new Decorator()
     */
    public declare sourceDecorator: any;
    /** 
     * Sets the source node/connector object of the connector
     * @default null
     */
    public declare sourceID: any;
    /** 
     * Sets the source padding of the connector
     * @default 0
     */
    public declare sourcePadding: any;
    /** 
     * Sets the beginning point of the connector
     * @default new Point(0,0)
     */
    public declare sourcePoint: any;
    /** 
     * Sets the unique id of the source port of the connector
     * @default ''
     */
    public declare sourcePortID: any;
    /** 
     * Defines the appearance of the connection path
     * @default ''
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
     * Defines the target decorator of the connector
     * @default new Decorator()
     */
    public declare targetDecorator: any;
    /** 
     * Sets the target node/connector object of the connector
     * @default null
     */
    public declare targetID: any;
    /** 
     * Sets the target padding of the connector
     * @default 0
     */
    public declare targetPadding: any;
    /** 
     * Sets the end point of the connector
     * @default new Point(0,0)
     */
    public declare targetPoint: any;
    /** 
     * Sets the unique id of the target port of the connector
     * @default ''
     */
    public declare targetPortID: any;
    /** 
     * defines the tooltip for the connector
     * @default new DiagramToolTip();
     */
    public declare tooltip: any;
    /** 
     * Sets the visibility of the node/connector
     * @default true
     */
    public declare visible: any;
    /** 
     * Defines the UI of the connector
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
 * Connector Array Directive
 * @private
 */
@Directive({
    selector: 'ej-diagram>e-connectors',
    standalone: true,
    queries: {
        children: new ContentChildren(ConnectorDirective)
    },
})
export class ConnectorsDirective extends ArrayBase<ConnectorsDirective> {
    constructor() {
        super('connectors');
    }
}