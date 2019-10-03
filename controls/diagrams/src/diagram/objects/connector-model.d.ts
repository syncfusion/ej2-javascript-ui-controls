import { Property, Complex, Collection, ChildProperty, ComplexFactory, CollectionFactory } from '@syncfusion/ej2-base';import { ShapeStyle, StrokeStyle } from '../core/appearance';import { StrokeStyleModel, ShapeStyleModel } from '../core/appearance-model';import { Point } from '../primitives/point';import { TextElement } from '../core/elements/text-element';import { PointModel } from '../primitives/point-model';import { Segments, DecoratorShapes, Transform, ConnectorConstraints, Direction, LayoutOrientation, Status } from '../enum/enum';import { Rect } from '../primitives/rect';import { Size } from '../primitives/size';import { findAngle, findConnectorPoints, Bridge, getOuterBounds } from '../utility/connector';import { getAnnotationPosition, alignLabelOnSegments, updateConnector, setUMLActivityDefaults } from '../utility/diagram-util';import { findDistance, findPath, updatePathElement, setConnectorDefaults } from '../utility/diagram-util';import { randomId, getFunction } from './../utility/base-util';import { flipConnector } from './../utility/diagram-util';import { PathElement } from '../core/elements/path-element';import { PathAnnotation } from './annotation';import { Canvas } from '../core/containers/canvas';import { getDecoratorShape } from './dictionary/common';import { IElement } from './interface/IElement';import { Container } from '../core/containers/container';import { DiagramElement } from '../core/elements/diagram-element';import { HorizontalAlignment, VerticalAlignment, AssociationFlow, ClassifierShape, Multiplicity } from '../enum/enum';import { ConnectionShapes, UmlActivityFlows, BpmnFlows, BpmnMessageFlows, BpmnSequenceFlows, BpmnAssociationFlows } from '../enum/enum';import { SegmentInfo, Alignment } from '../rendering/canvas-interface';import { PathAnnotationModel } from './annotation-model';import { NodeBase } from './node-base';import { DiagramTooltipModel } from './tooltip-model';import { DiagramTooltip } from './tooltip';import { Matrix, identityMatrix, rotateMatrix, scaleMatrix, transformPointsByMatrix, transformPointByMatrix } from '../primitives/matrix';import { DiagramHtmlElement } from '../core/elements/html-element';
import {NodeBaseModel} from "./node-base-model";

/**
 * Interface for a class Decorator
 */
export interface DecoratorModel {

    /**
     * Sets the width of the decorator

     */
    width?: number;

    /**
     * Sets the height of the decorator

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

     */
    style?: ShapeStyleModel;

    /**
     * Defines the position of the decorator with respect to the source/target point of the connector
     */
    pivot?: PointModel;

    /**
     * Defines the geometry of the decorator shape

     */
    pathData?: string;

}

/**
 * Interface for a class Vector
 */
export interface VectorModel {

    /**
     * Defines the angle between the connector end point and control point of the bezier segment

     */
    angle?: number;

    /**
     * Defines the distance between the connector end point and control point of the bezier segment

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

     * @IgnoreSingular
     */
    flow?: UmlActivityFlows;

    /**
     * Defines the height of the exception flow.

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

     */
    flow?: BpmnFlows;

    /**
     * Sets the type of the Bpmn Sequence flows
     * * Default - Sets the type of the sequence flow as Default
     * * Normal - Sets the type of the sequence flow as Normal
     * * Conditional - Sets the type of the sequence flow as Conditional

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
     */
    message?: BpmnMessageFlows;

    /**
     * Sets the type of the Bpmn association flows
     * * Default - Sets the type of Association flow as Default
     * * Directional - Sets the type of Association flow as Directional
     * * BiDirectional - Sets the type of Association flow as BiDirectional

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

     */
    type?: Segments;

    /**
     * Defines the segment to be drag or not

     */
    allowDrag?: boolean;

}

/**
 * Interface for a class StraightSegment
 */
export interface StraightSegmentModel extends ConnectorSegmentModel{

    /**
     * Sets the end point of the connector segment

     */
    point?: PointModel;

}

/**
 * Interface for a class BezierSegment
 */
export interface BezierSegmentModel extends StraightSegmentModel{

    /**
     * Sets the first control point of the connector

     */
    point1?: PointModel;

    /**
     * Sets the second control point of the connector

     */
    point2?: PointModel;

    /**
     * Defines the length and angle between the source point and the first control point of the diagram

     */
    vector1?: VectorModel;

    /**
     * Defines the length and angle between the target point and the second control point of the diagram

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

     */
    length?: number;

    /**
     * Sets the direction of orthogonal segment
     * * Left - Sets the direction type as Left
     * * Right - Sets the direction type as Right
     * * Top - Sets the direction type as Top
     * * Bottom - Sets the direction type as Bottom

     */
    direction?: Direction;

}

/**
 * Interface for a class MultiplicityLabel
 */
export interface MultiplicityLabelModel {

    /**
     * Defines the type of the Classifier Multiplicity

     * @IgnoreSingular
     */
    optional?: boolean;

    /**
     * Defines the type of the Classifier Multiplicity

     * @IgnoreSingular
     */
    lowerBounds?: string;

    /**
     * Defines the type of the Classifier Multiplicity

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

     * @IgnoreSingular
     */
    type?: Multiplicity;

    /**
     * Defines the type of the Classifier Multiplicity

     * @IgnoreSingular
     */
    target?: MultiplicityLabelModel;

    /**
     * Defines the type of the Classifier Multiplicity

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

     * @IgnoreSingular
     */
    type?: ConnectionShapes;

    /**
     * Defines the association direction

     * @IgnoreSingular
     */
    relationship?: ClassifierShape;

    /**
     * Defines the association direction

     * @IgnoreSingular
     */
    associationType?: AssociationFlow;

    /**
     * Defines the type of the Classifier Multiplicity

     * @IgnoreSingular
     */
    multiplicity?: ClassifierMultiplicityModel;

}

/**
 * Interface for a class Connector
 */
export interface ConnectorModel extends NodeBaseModel{

    /**
     * Defines the shape of the connector


     */
    shape?: ConnectorShapeModel | BpmnFlowModel | RelationShipModel;

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



     */
    constraints?: ConnectorConstraints;

    /**
     * Defines the bridgeSpace of connector

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
     */
    annotations?: PathAnnotationModel[];

    /**
     * Sets the beginning point of the connector

     */
    sourcePoint?: PointModel;

    /**
     * Sets the end point of the connector

     */
    targetPoint?: PointModel;

    /**
     * Defines the segments



     */
    segments?: (OrthogonalSegmentModel | StraightSegmentModel | BezierSegmentModel)[];

    /**
     * Sets the source node/connector object of the connector

     */
    sourceID?: string;

    /**
     * Sets the target node/connector object of the connector

     */
    targetID?: string;

    /**
     * Sets the connector padding value

     */
    hitPadding?: number;

    /**
     * Defines the type of the connector
     * * Straight - Sets the segment type as Straight
     * * Orthogonal - Sets the segment type as Orthogonal
     * * Bezier - Sets the segment type as Bezier




     */
    type?: Segments;

    /**
     * Sets the corner radius of the connector

     */
    cornerRadius?: number;

    /**
     * Defines the source decorator of the connector

     */
    sourceDecorator?: DecoratorModel;

    /**
     * Defines the target decorator of the connector

     */
    targetDecorator?: DecoratorModel;

    /**
     * defines the tooltip for the connector

     */
    tooltip?: DiagramTooltipModel;

    /**
     * Sets the unique id of the source port of the connector

     */
    sourcePortID?: string;

    /**
     * Sets the unique id of the target port of the connector

     */
    targetPortID?: string;

    /**
     * Sets the source padding of the connector


     */
    sourcePadding?: number;

    /**
     * Sets the target padding of the connector


     */
    targetPadding?: number;

    /**
     * Defines the appearance of the connection path

     */
    style?: StrokeStyleModel;

    /**
     * Defines the UI of the connector

     */
    wrapper?: Container;

}