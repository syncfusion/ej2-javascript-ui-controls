import { Property, Complex, Collection, ChildProperty, ComplexFactory, CollectionFactory, isBlazor } from '@syncfusion/ej2-base';import { ShapeStyle, StrokeStyle } from '../core/appearance';import { StrokeStyleModel, ShapeStyleModel } from '../core/appearance-model';import { Point } from '../primitives/point';import { TextElement } from '../core/elements/text-element';import { PointModel } from '../primitives/point-model';import { Segments, DecoratorShapes, Transform, ConnectorConstraints } from '../enum/enum';import { Direction, LayoutOrientation, Status, PortConstraints } from '../enum/enum';import { Rect } from '../primitives/rect';import { Size } from '../primitives/size';import { getAnnotationPosition, alignLabelOnSegments, updateConnector } from '../utility/diagram-util';import { setUMLActivityDefaults, initfixedUserHandlesSymbol } from '../utility/diagram-util';import { findDistance, findPath, updatePathElement, setConnectorDefaults } from '../utility/diagram-util';import { randomId, getFunction } from './../utility/base-util';import { flipConnector } from './../utility/diagram-util';import { PathElement } from '../core/elements/path-element';import { PathAnnotation } from './annotation';import { Canvas } from '../core/containers/canvas';import { getDecoratorShape } from './dictionary/common';import { IElement } from './interface/IElement';import { Container } from '../core/containers/container';import { DiagramElement } from '../core/elements/diagram-element';import { HorizontalAlignment, VerticalAlignment, AssociationFlow, ClassifierShape, Multiplicity, DiagramAction } from '../enum/enum';import { ConnectionShapes, UmlActivityFlows, BpmnFlows, BpmnMessageFlows, BpmnSequenceFlows, BpmnAssociationFlows } from '../enum/enum';import { SegmentInfo, Alignment } from '../rendering/canvas-interface';import { PathAnnotationModel } from './annotation-model';import { NodeBase } from './node-base';import { DiagramTooltipModel } from './tooltip-model';import { DiagramTooltip } from './tooltip';import { Matrix, identityMatrix, rotateMatrix, scaleMatrix, transformPointsByMatrix, transformPointByMatrix } from '../primitives/matrix';import { DiagramHtmlElement } from '../core/elements/html-element';import { getTemplateContent } from '../utility/dom-util';import { SymbolSizeModel } from './preview-model';import { SymbolSize } from './preview';import { ConnectorFixedUserHandle } from './fixed-user-handle';import { ConnectorFixedUserHandleModel } from './fixed-user-handle-model';
import {NodeBaseModel} from "./node-base-model";

/**
 * Interface for a class Decorator
 */
export interface DecoratorModel {

    /**
     * Sets the width of the decorator
     * @default 10
     */
    width?: number;

    /**
     * Sets the height of the decorator
     * @default 10
     */
    height?: number;

    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let connectors: ConnectorModel[] = [{
     *   id: 'connector', type: 'Straight', sourcePoint: { x: 500, y: 100 }, targetPoint: { x: 600, y: 200 },
     *   sourceDecorator: {
     *    style: { fill: 'black' },
     *    shape: 'Arrow',
     *    pivot: { x: 0, y: 0.5 }},
     *   targetDecorator: {
     *    shape: 'Diamond',
     *    style: { fill: 'blue' },
     *    pivot: { x: 0, y: 0.5 }}
     *  },];
     * let diagram: Diagram = new Diagram({
     * ...
     * connectors: connectors
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     */
    shape?: DecoratorShapes;

    /**
     * Defines the appearance of the decorator
     * @default new ShapeStyle()
     * @blazorType DecoratorShapeStyle
     */
    style?: ShapeStyleModel;

    /**
     * Defines the position of the decorator with respect to the source/target point of the connector
     */
    pivot?: PointModel;

    /**
     * Defines the geometry of the decorator shape
     * @default ''
     */
    pathData?: string;

}

/**
 * Interface for a class Vector
 */
export interface VectorModel {

    /**
     * Defines the angle between the connector end point and control point of the bezier segment
     * @default 0
     */
    angle?: number;

    /**
     * Defines the distance between the connector end point and control point of the bezier segment
     * @default 0
     */
    distance?: number;

}

/**
 * Interface for a class ConnectorShape
 */
export interface ConnectorShapeModel {

    /**
     * Defines the application specific type of connector
     * * Bpmn - Sets the type of the connection shape as Bpmn
     * @default 'None'
     */
    type?: ConnectionShapes;

}

/**
 * Interface for a class ActivityFlow
 */
export interface ActivityFlowModel extends ConnectorShapeModel{

    /**
     * Defines the type of the UMLActivity flows
     * Object - Sets the type of the UMLActivity Flow as Object
     * Control - Sets the type of the UMLActivity Flow as Control
     * Exception - Sets the type of the UMLActivity Flow as Exception
     * @default 'Object'
     * @IgnoreSingular
     */
    flow?: UmlActivityFlows;

    /**
     * Defines the height of the exception flow.
     * @default '50'
     */
    exceptionFlowHeight?: number;

}

/**
 * Interface for a class BpmnFlow
 */
export interface BpmnFlowModel extends ConnectorShapeModel{

    /**
     * Sets the type of the Bpmn flows
     * * Sequence - Sets the type of the Bpmn Flow as Sequence
     * * Association - Sets the type of the Bpmn Flow as Association
     * * Message - Sets the type of the Bpmn Flow as Message
     * @default 'Sequence'
     */
    flow?: BpmnFlows;

    /**
     * Sets the type of the Bpmn Sequence flows
     * * Default - Sets the type of the sequence flow as Default
     * * Normal - Sets the type of the sequence flow as Normal
     * * Conditional - Sets the type of the sequence flow as Conditional
     * @default 'Normal'
     */
    sequence?: BpmnSequenceFlows;

    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [
     * {
     *   id: 'node1', width: 60, height: 60, offsetX: 75, offsetY: 90,
     *   shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'Message' } },
     *     },
     * {
     *   id: 'node2', width: 75, height: 70, offsetX: 210, offsetY: 90,
     *   shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'None' } },
     *  }];
     * let connectors: ConnectorModel[] = [{
     *   id: 'connector', type: 'Straight', sourceID: 'node1', targetID: 'node2',
     *   shape: { type: 'Bpmn', flow: 'Message', message: 'InitiatingMessage' } as BpmnFlowModel
     *  },];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes, connectors: connectors
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default 'Default'
     * @blazorDefaultValue 'Default'
     */
    message?: BpmnMessageFlows;

    /**
     * Sets the type of the Bpmn association flows
     * * Default - Sets the type of Association flow as Default
     * * Directional - Sets the type of Association flow as Directional
     * * BiDirectional - Sets the type of Association flow as BiDirectional
     * * @default 'Default'
     * @blazorDefaultValue Default
     */
    association?: BpmnAssociationFlows;

}

/**
 * Interface for a class ConnectorSegment
 */
export interface ConnectorSegmentModel {

    /**
     * Defines the type of the segment
     * * Straight - Sets the segment type as Straight
     * * Orthogonal - Sets the segment type as Orthogonal
     * * Bezier - Sets the segment type as Bezier
     * @default 'Straight'
     */
    type?: Segments;

    /**
     * Defines the segment to be drag or not
     * @default true
     */
    allowDrag?: boolean;

}

/**
 * Interface for a class StraightSegment
 */
export interface StraightSegmentModel extends ConnectorSegmentModel{

    /**
     * Sets the end point of the connector segment
     * @default new Point(0,0)
     */
    point?: PointModel;

}

/**
 * Interface for a class BezierSegment
 */
export interface BezierSegmentModel extends StraightSegmentModel{

    /**
     * Sets the first control point of the connector
     * @default {}
     */
    point1?: PointModel;

    /**
     * Sets the second control point of the connector
     * @default {}
     */
    point2?: PointModel;

    /**
     * Defines the length and angle between the source point and the first control point of the diagram
     * @default {}
     */
    vector1?: VectorModel;

    /**
     * Defines the length and angle between the target point and the second control point of the diagram
     * @default {}
     */
    vector2?: VectorModel;

}

/**
 * Interface for a class OrthogonalSegment
 */
export interface OrthogonalSegmentModel extends ConnectorSegmentModel{

    /**
     * Defines the length of orthogonal segment
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let connectors: ConnectorModel[] = [{
     *       id: 'link2', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 }, type: 'Orthogonal',
     *       shape: {
     *           type: 'Bpmn',
     *           flow: 'Message',
     *           association: 'directional'
     *       }, style: {
     *           strokeDashArray: '2,2'
     *       },
     *       segments: [{ type: 'Orthogonal', length: 30, direction: 'Bottom' },
     *       { type: 'Orthogonal', length: 80, direction: 'Right' }]
     *   }];
     * let diagram: Diagram = new Diagram({
     * ...
     * connectors: connectors
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default 0
     */
    length?: number;

    /**
     * Sets the direction of orthogonal segment
     * * Left - Sets the direction type as Left
     * * Right - Sets the direction type as Right
     * * Top - Sets the direction type as Top
     * * Bottom - Sets the direction type as Bottom
     * @default null
     */
    direction?: Direction;

}

/**
 * Interface for a class DiagramConnectorSegment
 */
export interface DiagramConnectorSegmentModel {

    /**
     * Defines the type of the segment
     * * Straight - Sets the segment type as Straight
     * * Orthogonal - Sets the segment type as Orthogonal
     * * Bezier - Sets the segment type as Bezier
     * @default 'Straight'
     */
    type?: Segments;

    /**
     * Defines the segment to be drag or not
     * @default true
     */
    allowDrag?: boolean;

    /**
     * Sets the end point of the connector segment
     * @default new Point(0,0)
     */
    point?: PointModel;

    /**
     * Sets the first control point of the connector
     * @default {}
     */
    point1?: PointModel;

    /**
     * Sets the second control point of the connector
     * @default {}
     */
    point2?: PointModel;

    /**
     * Defines the length and angle between the source point and the first control point of the diagram
     * @default {}
     */
    vector1?: VectorModel;

    /**
     * Defines the length and angle between the target point and the second control point of the diagram
     * @default {}
     */
    vector2?: VectorModel;

    /**
     * Defines the length of orthogonal segment
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let connectors: ConnectorModel[] = [{
     *       id: 'link2', sourcePoint: { x: 0, y: 0 }, targetPoint: { x: 40, y: 40 }, type: 'Orthogonal',
     *       shape: {
     *           type: 'Bpmn',
     *           flow: 'Message',
     *           association: 'directional'
     *       }, style: {
     *           strokeDashArray: '2,2'
     *       },
     *       segments: [{ type: 'Orthogonal', length: 30, direction: 'Bottom' },
     *       { type: 'Orthogonal', length: 80, direction: 'Right' }]
     *   }];
     * let diagram: Diagram = new Diagram({
     * ...
     * connectors: connectors
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default 0
     * @isBlazorNullableType true
     */
    length?: number;

    /**
     * Sets the direction of orthogonal segment
     * * Left - Sets the direction type as Left
     * * Right - Sets the direction type as Right
     * * Top - Sets the direction type as Top
     * * Bottom - Sets the direction type as Bottom
     * @default null
     * @isBlazorNullableType true
     */
    direction?: Direction;

}

/**
 * Interface for a class MultiplicityLabel
 */
export interface MultiplicityLabelModel {

    /**
     * Defines the type of the Classifier Multiplicity
     * @default true
     * @IgnoreSingular
     */
    optional?: boolean;

    /**
     * Defines the type of the Classifier Multiplicity
     * @default ''
     * @IgnoreSingular
     */
    lowerBounds?: string;

    /**
     * Defines the type of the Classifier Multiplicity
     * @default ''
     * @IgnoreSingular
     */
    upperBounds?: string;

}

/**
 * Interface for a class ClassifierMultiplicity
 */
export interface ClassifierMultiplicityModel {

    /**
     * Defines the type of the Classifier Multiplicity
     * @default 'OneToOne'
     * @IgnoreSingular
     */
    type?: Multiplicity;

    /**
     * Defines the type of the Classifier Multiplicity
     * @default ''
     * @IgnoreSingular
     */
    target?: MultiplicityLabelModel;

    /**
     * Defines the type of the Classifier Multiplicity
     * @default ''
     * @IgnoreSingular
     */
    source?: MultiplicityLabelModel;

}

/**
 * Interface for a class RelationShip
 */
export interface RelationShipModel extends ConnectorShapeModel{

    /**
     * Defines the type of the  UMLConnector
     * @default 'None'
     * @IgnoreSingular
     */
    type?: ConnectionShapes;

    /**
     * Defines the association direction
     * @default 'Aggregation'
     * @IgnoreSingular
     */
    relationship?: ClassifierShape;

    /**
     * Defines the association direction
     * @default 'Directional'
     * @IgnoreSingular
     */
    associationType?: AssociationFlow;

    /**
     * Defines the type of the Classifier Multiplicity
     * @default ''
     * @IgnoreSingular
     */
    multiplicity?: ClassifierMultiplicityModel;

}

/**
 * Interface for a class DiagramConnectorShape
 */
export interface DiagramConnectorShapeModel {

    /**
     * Defines the application specific type of connector
     * * Bpmn - Sets the type of the connection shape as Bpmn
     * @default 'None'
     */
    type?: ConnectionShapes;

    /**
     * Defines the association direction
     * @default 'Directional'
     * @IgnoreSingular
     */
    associationType?: AssociationFlow;

    /**
     * Defines the association direction
     * @default 'Aggregation'
     * @IgnoreSingular
     */
    relationship?: ClassifierShape;

    /**
     * Defines the type of the Classifier Multiplicity
     * @default ''
     * @IgnoreSingular
     */
    multiplicity?: ClassifierMultiplicityModel;

    /**
     * Sets the type of the Bpmn flows
     * * Sequence - Sets the type of the Bpmn Flow as Sequence
     * * Association - Sets the type of the Bpmn Flow as Association
     * * Message - Sets the type of the Bpmn Flow as Message
     * @default 'Sequence'
     */
    bpmnFlow?: BpmnFlows;

    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [
     * {
     *   id: 'node1', width: 60, height: 60, offsetX: 75, offsetY: 90,
     *   shape: { type: 'Bpmn', shape: 'Event', event: { event: 'Start', trigger: 'Message' } },
     *     },
     * {
     *   id: 'node2', width: 75, height: 70, offsetX: 210, offsetY: 90,
     *   shape: { type: 'Bpmn', shape: 'Gateway', gateway: { type: 'None' } },
     *  }];
     * let connectors: ConnectorModel[] = [{
     *   id: 'connector', type: 'Straight', sourceID: 'node1', targetID: 'node2',
     *   shape: { type: 'Bpmn', flow: 'Message', message: 'InitiatingMessage' } as BpmnFlowModel
     *  },];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes, connectors: connectors
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     */
    message?: BpmnMessageFlows;

    /**
     * Sets the type of the Bpmn Sequence flows
     * * Default - Sets the type of the sequence flow as Default
     * * Normal - Sets the type of the sequence flow as Normal
     * * Conditional - Sets the type of the sequence flow as Conditional
     * @default 'Normal'
     */
    sequence?: BpmnSequenceFlows;

    /**
     * Sets the type of the Bpmn association flows
     * * Default - Sets the type of Association flow as Default
     * * Directional - Sets the type of Association flow as Directional
     * * BiDirectional - Sets the type of Association flow as BiDirectional
     * * @default 'Default'
     */
    association?: BpmnAssociationFlows;

    /**
     * Defines the type of the UMLActivity flows
     * Object - Sets the type of the UMLActivity Flow as Object
     * Control - Sets the type of the UMLActivity Flow as Control
     * Exception - Sets the type of the UMLActivity Flow as Exception
     * @default 'Object'
     * @IgnoreSingular
     */
    umlActivityFlow?: UmlActivityFlows;

    /**
     * Defines the height of the exception flow.
     * @default '50'
     */
    exceptionFlowHeight?: number;

}

/**
 * Interface for a class Connector
 */
export interface ConnectorModel extends NodeBaseModel{

    /**
     * Defines the shape of the connector
     * @default 'Bpmn'
     * @aspType object
     * @blazorType DiagramConnectorShape
     */
    shape?: ConnectorShapeModel | BpmnFlowModel | RelationShipModel | DiagramConnectorShapeModel;

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
     * @aspNumberEnum
     * @blazorNumberEnum
     */
    constraints?: ConnectorConstraints;

    /**
     * Defines the bridgeSpace of connector
     * @default 10
     */
    bridgeSpace?: number;

    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let connectors: ConnectorModel[] = [{
     *   id: 'connector', type: 'Straight', sourcePoint: { x: 500, y: 100 }, targetPoint: { x: 600, y: 200 },
     * annotations: [{ content: 'No', offset: 0, alignment: 'After' }]
     * ];
     * let diagram: Diagram = new Diagram({
     * ...
     * connectors: connectors
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @blazorType ObservableCollection<DiagramConnectorAnnotation>
     */
    annotations?: PathAnnotationModel[];

    /**
     * Sets the beginning point of the connector
     * @default new Point(0,0)
     */
    sourcePoint?: PointModel;

    /**
     * Sets the end point of the connector
     * @default new Point(0,0)
     */
    targetPoint?: PointModel;

    /**
     * Specifies the collection of the fixed user handle
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @blazorType ObservableCollection<DiagramFixedUserHandle>
     */
    fixedUserHandles?: ConnectorFixedUserHandleModel[];

    /**
     * Defines the segments
     * @default []
     * @aspType object
     * @blazorType ObservableCollection<DiagramConnectorSegment>
     */
    segments?: (OrthogonalSegmentModel | StraightSegmentModel | BezierSegmentModel | DiagramConnectorSegmentModel)[];

    /**
     * Sets the source node/connector object of the connector
     * @default null
     */
    sourceID?: string;

    /**
     * Sets the target node/connector object of the connector
     * @default null
     */
    targetID?: string;

    /**
     * Sets the connector padding value
     * @default 10
     */
    hitPadding?: number;

    /**
     * Sets the connector padding value
     * @default 0
     */
    connectionPadding?: number;

    /**
     * Defines the type of the connector
     * * Straight - Sets the segment type as Straight
     * * Orthogonal - Sets the segment type as Orthogonal
     * * Bezier - Sets the segment type as Bezier
     * @default 'Straight'
     * @aspType Syncfusion.EJ2.Diagrams.Segments
     * @blazorDefaultValueIgnore
     * @blazorDefaultValue  Syncfusion.Blazor.Diagrams.Segments.Straight
     */
    type?: Segments;

    /**
     * Sets the corner radius of the connector
     * @default 0
     */
    cornerRadius?: number;

    /**
     * Defines the source decorator of the connector
     * @default new Decorator()
     * @blazorType ConnectorSourceDecorator
     * @blazorDefaultValue new ConnectorSourceDecorator()
     */
    sourceDecorator?: DecoratorModel;

    /**
     * Defines the target decorator of the connector
     * @default new Decorator()
     * @blazorType ConnectorTargetDecorator
     * @blazorDefaultValue new ConnectorTargetDecorator()
     */
    targetDecorator?: DecoratorModel;

    /**
     * defines the tooltip for the connector
     * @default new DiagramToolTip();
     */
    tooltip?: DiagramTooltipModel;

    /**
     * Sets the unique id of the source port of the connector
     * @default ''
     */
    sourcePortID?: string;

    /**
     * Sets the unique id of the target port of the connector
     * @default ''
     */
    targetPortID?: string;

    /**
     * Sets the source padding of the connector
     * @default 0
     * @isBlazorNullableType true
     */
    sourcePadding?: number;

    /**
     * Defines the size of the symbol preview
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    previewSize?: SymbolSizeModel;

    /**
     * Defines the size of a drop symbol
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    dragSize?: SymbolSizeModel;

    /**
     * Sets the target padding of the connector
     * @default 0
     * @isBlazorNullableType true
     */
    targetPadding?: number;

    /**
     * Defines the appearance of the connection path
     * @default ''
     * @blazorType ConnectorShapeStyle
     * @blazorDefaultValue new ConnectorShapeStyle()
     */
    style?: StrokeStyleModel;

    /**
     * Defines the UI of the connector
     * @default null
     * @deprecated
     */
    wrapper?: Container;

}