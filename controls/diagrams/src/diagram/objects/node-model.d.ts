import { Property, Complex, Collection, ChildProperty, ComplexFactory, isBlazor } from '@syncfusion/ej2-base';import { ShapeStyle, Margin, TextStyle, Shadow } from '../core/appearance';import { ShapeStyleModel, TextStyleModel, ShadowModel, } from '../core/appearance-model';import { Point } from '../primitives/point';import { Size } from '../primitives/size';import { PointModel } from '../primitives/point-model';import { Shapes, BasicShapes, FlowShapes, UmlActivityShapes, Scale, ImageAlignment, Status, ElementAction } from '../enum/enum';import { IElement } from './interface/IElement';import { Container } from '../core/containers/container';import { Canvas } from '../core/containers/canvas';import { getBasicShape } from './dictionary/basic-shapes';import { DiagramElement } from '../core/elements/diagram-element';import { PathElement } from '../core/elements/path-element';import { TextElement } from '../core/elements/text-element';import { ImageElement } from '../core/elements/image-element';import { DiagramNativeElement } from '../core/elements/native-element';import { RubberBandSelectionMode, ThumbsConstraints } from '../enum/enum';import { Port, PointPort } from './port';import { PointPortModel } from './port-model';import { SelectorConstraints } from '../enum/enum';import { Annotation, ShapeAnnotation } from './annotation';import { ShapeAnnotationModel, HyperlinkModel, PathAnnotationModel } from './annotation-model';import { getPortShape, getIconShape } from './dictionary/common';import { getFlowShape } from './dictionary/flow-shapes';import { HorizontalAlignment, VerticalAlignment, BpmnShapes, BpmnEvents, BpmnTriggers, BpmnGateways, NodeConstraints } from '../enum/enum';import { BpmnDataObjects, BpmnTasks, BpmnSubProcessTypes, BpmnLoops, BranchTypes } from '../enum/enum';import { BpmnBoundary, BpmnActivities, UmlScope } from '../enum/enum';import { MarginModel } from '../core/appearance-model';import { LayoutModel } from '../layout/layout-base-model';import { checkPortRestriction, setUMLActivityDefaults, getUMLActivityShapes } from './../utility/diagram-util';import { updatePortEdges, initfixedUserHandlesSymbol } from './../utility/diagram-util';import { setSwimLaneDefaults } from './../utility/diagram-util';import { randomId, getFunction } from './../utility/base-util';import { NodeBase } from './node-base';import { canShadow } from './../utility/constraints-util';import { PortVisibility, Stretch } from '../enum/enum';import { IconShapeModel } from './icon-model';import { IconShape } from './icon';import { measurePath, getContent, getTemplateContent } from './../utility/dom-util';import { Rect } from '../primitives/rect';import { getPolygonPath } from './../utility/path-util';import { DiagramHtmlElement } from '../core/elements/html-element';import { StackPanel } from '../core/containers/stack-panel';import { GridPanel, RowDefinition, ColumnDefinition } from '../core/containers/grid';import { Orientation, ContainerTypes, ClassifierShape } from '../enum/enum';import { getULMClassifierShapes } from '../utility/uml-util';import { initSwimLane } from './../utility/swim-lane-util';import { AnnotationModel } from './annotation-model';import { ConnectorModel } from './connector-model';import { Diagram } from '../../diagram/diagram';import { Connector } from './connector';import { UserHandleModel } from '../interaction/selector-model';import { UserHandle } from '../interaction/selector';import { LayoutInfo } from '../diagram/layoutinfo';import { LayoutInfoModel } from '../diagram/layoutinfo-model';import { SymbolSizeModel } from './preview-model';import { SymbolSize } from './preview';import { NodeFixedUserHandleModel } from './fixed-user-handle-model';import { NodeFixedUserHandle } from './fixed-user-handle';
import {NodeBaseModel} from "./node-base-model";

/**
 * Interface for a class Shape
 */
export interface ShapeModel {

    /**
     * Defines the type of node shape
     * * Path - Sets the type of the node as Path
     * * Text - Sets the type of the node as Text
     * * Image - Sets the type of the node as Image
     * * Basic - Sets the type of the node as Basic
     * * Flow - Sets the type of the node as Flow
     * * Bpmn - Sets the type of the node as Bpmn
     * * Native - Sets the type of the node as Native
     * * HTML - Sets the type of the node as HTML
     * * UMLActivity - Sets the type of the node as UMLActivity
     * @default 'Basic'
     */
    type?: Shapes;

}

/**
 * Interface for a class Path
 */
export interface PathModel extends ShapeModel{

    /**
     * Defines the type of node shape
     * @default 'Basic'
     */
    type?: Shapes;

    /**
     * Defines the geometry of a path
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *   shape: { type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296'+
     *   'L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366'+
     *   'L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z' }
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default ''
     */
    data?: string;

}

/**
 * Interface for a class Native
 */
export interface NativeModel extends ShapeModel{

    /**
     * Defines the type of node shape.
     * @default 'Basic'
     */
    type?: Shapes;

    /**
     * Defines the geometry of a native element.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100,
     * shape: { scale: 'Stretch', 
     *   type: 'Native', content: '<g><path d='M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455'+
     * 'L0,90l7.975-23.522' +
     * 'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
     * 'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
     * 'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
     * 'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
     * 'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
     * 'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
     * 'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
     * 'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
     * 'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
     * 'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z'>'+
     * '</path></g>',
     *        }
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default ''
     */
    content?: string | SVGElement;

    /**
     * Defines the scale of the native element.
     * * None - Sets the stretch type for diagram as None
     * * Stretch - Sets the stretch type for diagram as Stretch
     * * Meet - Sets the stretch type for diagram as Meet
     * * Slice - Sets the stretch type for diagram as Slice
     * @default 'Stretch'
     */
    scale?: Stretch;

}

/**
 * Interface for a class Html
 */
export interface HtmlModel extends ShapeModel{

    /**
     * Defines the type of node shape.
     * @default 'Basic'
     */
    type?: Shapes;

    /**
     * Defines the geometry of a html element.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
     * shape: { type: 'HTML', 
     * content: '<div style='background:red;height:100%;width:100%;'><input type='button' value='{{:value}}' /></div>' }
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default ''
     */
    content?: string | HTMLElement;

}

/**
 * Interface for a class Image
 */
export interface ImageModel extends ShapeModel{

    /**
     * Defines the type of node shape
     * @default 'Basic'
     */
    type?: Shapes;

    /**
     * Defines the source of the image
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
     * shape: { type: 'Image', source: 'https://www.w3schools.com/images/w3schools_green.jpg' }
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default ''
     */
    source?: string;

    /**
     * Allows to stretch the image as you desired (either to maintain proportion or to stretch)
     * * None - Scale value will be set as None for the image
     * * Meet - Scale value Meet will be set for the image
     * * Slice - Scale value Slice will be set for the image
     * @default 'None'
     */
    scale?: Scale;

    /**
     * Defines the alignment of the image within the node boundary.
     * * None - Alignment value will be set as none
     * * XMinYMin - smallest X value of the view port and  smallest Y value of the view port
     * * XMidYMin - midpoint X value of the view port and  smallest Y value of the view port
     * * XMaxYMin - maximum X value of the view port and  smallest Y value of the view port
     * * XMinYMid - smallest X value of the view port and midpoint Y value of the view port
     * * XMidYMid - midpoint X value of the view port and midpoint Y value of the view port
     * * XMaxYMid - maximum X value of the view port and midpoint Y value of the view port
     * * XMinYMax - smallest X value of the view port and maximum Y value of the view port
     * * XMidYMax - midpoint X value of the view port and maximum Y value of the view port
     * * XMaxYMax - maximum X value of the view port and maximum Y value of the view port
     * @default 'None'
     */
    align?: ImageAlignment;

}

/**
 * Interface for a class Text
 */
export interface TextModel extends ShapeModel{

    /**
     * Defines the type of node shape
     * @default 'Basic'
     */
    type?: Shapes;

    /**
     * Defines the content of a text
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
     * shape: { type: 'Text', content: 'Text Element' }
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default ''
     */
    content?: string;

    /**
     * Defines the space to be let between the node and its immediate parent
     * @default 0
     */
    margin?: MarginModel;

}

/**
 * Interface for a class BasicShape
 */
export interface BasicShapeModel extends ShapeModel{

    /**
     * Defines the type of node shape
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let shape: BasicShapeModel = { type: 'Basic', shape: 'Rectangle' };
     * let nodes: NodeModel[] = [{
     * id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100, shape: shape
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default 'Basic'
     */
    type?: Shapes;

    /**
     * Defines the type of the basic shape
     * * Rectangle - Sets the type of the basic shape as Rectangle
     * * Ellipse - Sets the type of the basic shape as Ellipse
     * * Hexagon - Sets the type of the basic shape as Hexagon
     * * Parallelogram - Sets the type of the basic shape as Parallelogram
     * * Triangle - Sets the type of the basic shape as Triangle
     * * Plus - Sets the type of the basic shape as Plus
     * * Star - Sets the type of the basic shape as Star
     * * Pentagon - Sets the type of the basic shape as Pentagon
     * * Heptagon - Sets the type of the basic shape as Heptagon
     * * Octagon - Sets the type of the basic shape as Octagon
     * * Trapezoid - Sets the type of the basic shape as Trapezoid
     * * Decagon - Sets the type of the basic shape as Decagon
     * * RightTriangle - Sets the type of the basic shape as RightTriangle
     * * Cylinder - Sets the type of the basic shape as Cylinder
     * * Diamond - Sets the type of the basic shape as Diamond
     * @default 'Rectangle'
     */
    shape?: BasicShapes;

    /**
     * Sets the corner of the node
     * @default 0
     */
    cornerRadius?: number;

    /**
     * Defines the collection of points to draw a polygon
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    points?: PointModel[];

}

/**
 * Interface for a class FlowShape
 */
export interface FlowShapeModel extends ShapeModel{

    /**
     * Defines the type of node shape
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *     shape: { type: 'Flow', shape: 'Terminator' },
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default 'Basic'
     */
    type?: Shapes;

    /**
     * Defines the type of the flow shape
     * * Process - Sets the type of the flow shape as Process
     * * Decision - Sets the type of the flow shape as Decision
     * * Document - Sets the type of the flow shape as Document
     * * PreDefinedProcess - Sets the type of the flow shape as PreDefinedProcess
     * * Terminator - Sets the type of the flow shape as Terminator
     * * PaperTap - Sets the type of the flow shape as PaperTap
     * * DirectData - Sets the type of the flow shape as DirectData
     * * SequentialData - Sets the type of the flow shape as SequentialData
     * * MultiData - Sets the type of the flow shape as MultiData
     * * Collate - Sets the type of the flow shape as Collate
     * * SummingJunction - Sets the type of the flow shape as SummingJunction
     * * Or - Sets the type of the flow shape as Or
     * * InternalStorage - Sets the type of the flow shape as InternalStorage
     * * Extract - Sets the type of the flow shape as Extract
     * * ManualOperation - Sets the type of the flow shape as ManualOperation
     * * Merge - Sets the type of the flow shape as Merge
     * * OffPageReference - Sets the type of the flow shape as OffPageReference
     * * SequentialAccessStorage - Sets the type of the flow shape as SequentialAccessStorage
     * * Annotation - Sets the type of the flow shape as Annotation
     * * Annotation2 - Sets the type of the flow shape as Annotation2
     * * Data - Sets the type of the flow shape as Data
     * * Card - Sets the type of the flow shape as Card
     * * Delay - Sets the type of the flow shape as Delay
     * * Preparation - Sets the type of the flow shape as Preparation
     * * Display - Sets the type of the flow shape as Display
     * * ManualInput - Sets the type of the flow shape as ManualInput
     * * LoopLimit - Sets the type of the flow shape as LoopLimit
     * * StoredData - Sets the type of the flow shape as StoredData
     * @default 'Terminator'
     */
    shape?: FlowShapes;

}

/**
 * Interface for a class BpmnGateway
 */
export interface BpmnGatewayModel {

    /**
     * Defines the type of the BPMN Gateway
     * * None - Sets the type of the gateway as None
     * * Exclusive - Sets the type of the gateway as Exclusive
     * * Inclusive - Sets the type of the gateway as Inclusive
     * * Complex - Sets the type of the gateway as Complex
     * * EventBased - Sets the type of the gateway as EventBased
     * * ExclusiveEventBased - Sets the type of the gateway as ExclusiveEventBased
     * * ParallelEventBased - Sets the type of the gateway as ParallelEventBased
     * @default 'None'
     */
    type?: BpmnGateways;

}

/**
 * Interface for a class BpmnDataObject
 */
export interface BpmnDataObjectModel {

    /**
     * Defines the type of the BPMN data object
     * * None - Sets the type of the data object as None
     * * Input - Sets the type of the data object as Input
     * * Output - Sets the type of the data object as Output
     * @default 'None'
     */
    type?: BpmnDataObjects;

    /**
     * Sets whether the data object is a collection or not
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *  id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *  shape: {
     *   type: 'Bpmn', shape: 'DataObject',
     *   dataObject: { collection: false, type: 'Input' }
     *         } as BpmnShapeModel,
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default false
     */
    collection?: boolean;

}

/**
 * Interface for a class BpmnTask
 */
export interface BpmnTaskModel {

    /**
     * Defines the type of the task
     * * None - Sets the type of the Bpmn Tasks as None
     * * Service - Sets the type of the Bpmn Tasks as Service
     * * Receive - Sets the type of the Bpmn Tasks as Receive
     * * Send - Sets the type of the Bpmn Tasks as Send
     * * InstantiatingReceive - Sets the type of the Bpmn Tasks as InstantiatingReceive
     * * Manual - Sets the type of the Bpmn Tasks as Manual
     * * BusinessRule - Sets the type of the Bpmn Tasks as BusinessRule
     * * User - Sets the type of the Bpmn Tasks as User
     * * Script - Sets the type of the Bpmn Tasks as Script
     * @default 'None'
     */
    type?: BpmnTasks;

    /**
     * Defines the type of the BPMN loops
     * * None - Sets the type of the Bpmn loop as None
     * * Standard - Sets the type of the Bpmn loop as Standard
     * * ParallelMultiInstance - Sets the type of the Bpmn loop as ParallelMultiInstance
     * * SequenceMultiInstance - Sets the type of the Bpmn loop as SequenceMultiInstance
     * @default 'None'
     */
    loop?: BpmnLoops;

    /**
     * Sets whether the task is global or not
     * @default false
     */
    call?: boolean;

    /**
     * Sets whether the task is triggered as a compensation of another specific activity
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *  id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *  shape: {
     *   type: 'Bpmn', shape: 'Activity', activity: {
     *       activity: 'Task',
     *       task: { call: true, compensation: false, type: 'Service', loop: 'ParallelMultiInstance' }
     *   }} as BpmnShapeModel,
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default false
     */
    compensation?: boolean;

}

/**
 * Interface for a class BpmnEvent
 */
export interface BpmnEventModel {

    /**
     * 
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *  id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *  shape: {
     *  type: 'Bpmn', shape: 'Event',
     *   event: { event: 'Start', trigger: 'None' } } as BpmnShapeModel,
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default 'Start'
     */
    event?: BpmnEvents;

    /**
     * Defines the type of the trigger
     * * None - Sets the type of the trigger as None
     * * Message - Sets the type of the trigger as Message
     * * Escalation - Sets the type of the trigger as Escalation
     * * Link - Sets the type of the trigger as Link
     * * Error - Sets the type of the trigger as Error
     * * Compensation - Sets the type of the trigger as Compensation
     * * Signal - Sets the type of the trigger as Signal
     * * Multiple - Sets the type of the trigger as Multiple
     * * Parallel - Sets the type of the trigger as Parallel
     * * Cancel - Sets the type of the trigger as Cancel
     * * Conditional - Sets the type of the trigger as Conditional
     * * Terminate - Sets the type of the trigger as Terminate
     * @default 'None'
     */
    trigger?: BpmnTriggers;

}

/**
 * Interface for a class BpmnSubEvent
 */
export interface BpmnSubEventModel {

    /**
     * Defines the type of the trigger
     * * None - Sets the type of the trigger as None
     * * Message - Sets the type of the trigger as Message
     * * Escalation - Sets the type of the trigger as Escalation
     * * Link - Sets the type of the trigger as Link
     * * Error - Sets the type of the trigger as Error
     * * Compensation - Sets the type of the trigger as Compensation
     * * Signal - Sets the type of the trigger as Signal
     * * Multiple - Sets the type of the trigger as Multiple
     * * Parallel - Sets the type of the trigger as Parallel
     * * Cancel - Sets the type of the trigger as Cancel
     * * Conditional - Sets the type of the trigger as Conditional
     * * Terminate - Sets the type of the trigger as Terminate
     * @default 'None'
     */
    trigger?: BpmnTriggers;

    /**
     * Sets the type of the BPMN Event
     * * Start - Sets the type of the Bpmn Event as Start
     * * Intermediate - Sets the type of the Bpmn Event as Intermediate
     * * End - Sets the type of the Bpmn Event as End
     * * NonInterruptingStart - Sets the type of the Bpmn Event as NonInterruptingStart
     * * NonInterruptingIntermediate - Sets the type of the Bpmn Event as NonInterruptingIntermediate
     * * ThrowingIntermediate - Sets the type of the Bpmn Event as ThrowingIntermediate
     * @default 'Start'
     */
    event?: BpmnEvents;

    /**
     * Sets the id of the BPMN sub event
     * @default ''
     */
    id?: string;

    /**
     * Defines the position of the sub event
     * @default new Point(0.5,0.5)
     * @blazorType BpmnSubEventOffset
     */

    offset?: PointModel;

    /**
     * Defines the collection of textual annotations of the sub events
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @blazorType ObservableCollection<DiagramNodeAnnotation>
     */
    annotations?: ShapeAnnotationModel[];

    /**
     * Defines the collection of connection points of the sub events
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @blazorType ObservableCollection<DiagramPort>
     */
    ports?: PointPortModel[];

    /**
     * Sets the width of the node
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    width?: number;

    /**
     * Sets the height of the node
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    height?: number;

    /**
     * Defines the space to be left between the node and its immediate parent
     * @default 0
     */
    margin?: MarginModel;

    /**
     * Sets how to horizontally align a node with respect to its immediate parent
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Left - Aligns the diagram element at the left of its immediate parent
     * * Right - Aligns the diagram element at the right of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Center'
     */
    horizontalAlignment?: HorizontalAlignment;

    /**
     * Sets how to vertically align a node with respect to its immediate parent
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Top - Aligns the diagram element at the top of its immediate parent
     * * Bottom - Aligns the diagram element at the bottom of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Center'
     */
    verticalAlignment?: VerticalAlignment;

    /**
     * Sets the visibility of the sub event
     * @default true
     */
    visible?: boolean;

}

/**
 * Interface for a class BpmnTransactionSubProcess
 */
export interface BpmnTransactionSubProcessModel {

    /**
     * Defines the size and position of the success port
     */
    success?: BpmnSubEventModel;

    /**
     * Defines the size and position of the failure port
     */
    failure?: BpmnSubEventModel;

    /**
     * Defines the size and position of the cancel port
     */
    cancel?: BpmnSubEventModel;

}

/**
 * Interface for a class BpmnSubProcess
 */
export interface BpmnSubProcessModel {

    /**
     * Defines the type of the sub process
     * * None - Sets the type of the Sub process as None
     * * Transaction - Sets the type of the Sub process as Transaction
     * * Event - Sets the type of the Sub process as Event
     * @default 'None'
     */
    type?: BpmnSubProcessTypes;

    /**
     * Defines whether the sub process is without any prescribed order or not
     * @default false
     */
    adhoc?: boolean;

    /**
     * 
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
     * shape: {
     *               type: 'Bpmn', shape: 'Activity', activity: {
     *                   activity: 'SubProcess',
     *                   subProcess: { adhoc: false, boundary: 'Default', collapsed: true }
     *               },
     *           }
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     */
    boundary?: BpmnBoundary;

    /**
     * Defines the whether the task is triggered as a compensation of another task
     * @default false
     */
    compensation?: boolean;

    /**
     * Defines the  type of the BPMNLoop
     * * None - Sets the type of the Bpmn loop as None
     * * Standard - Sets the type of the Bpmn loop as Standard
     * * ParallelMultiInstance - Sets the type of the Bpmn loop as ParallelMultiInstance
     * * SequenceMultiInstance - Sets the type of the Bpmn loop as SequenceMultiInstance
     * @default 'None'
     */
    loop?: BpmnLoops;

    /**
     * Defines the whether the shape is collapsed or not
     * @default true
     */
    collapsed?: boolean;

    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let node1: NodeModel = {
     *           id: 'node1', width: 190, height: 190, offsetX: 300, offsetY: 200,
     *           shape: {
     *               type: 'Bpmn', shape: 'Activity', activity: {
     *                   activity: 'SubProcess',
     *                   subProcess: {
     *                       type: 'Event', loop: 'ParallelMultiInstance',
     *                       compensation: true, adhoc: false, boundary: 'Event', collapsed: true,
     *                       events: [{
     *                           height: 20, width: 20, offset: { x: 0, y: 0 }, margin: { left: 10, top: 10 },
     *                           horizontalAlignment: 'Left',
     *                           verticalAlignment: 'Top',
     *                           annotations: [{
     *                               id: 'label3', margin: { bottom: 10 },
     *                                horizontalAlignment: 'Center',
     *                               verticalAlignment: 'Top',
     *                               content: 'Event', offset: { x: 0.5, y: 1 },
     *                               style: {
     *                                   color: 'black', fontFamily: 'Fantasy', fontSize: 8
     *                               }
     *                           }],
     *                           event: 'Intermediate', trigger: 'Error'
     *                       }]
     *                   }
     *               }
     *           }
     *       };
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @blazorType ObservableCollection<DiagramBpmnSubEvent>
     */
    events?: BpmnSubEventModel[];

    /**
     * Defines the transaction sub process
     */
    transaction?: BpmnTransactionSubProcessModel;

    /**
     * Defines the transaction sub process
     * @default []
     */
    processes?: string[];

}

/**
 * Interface for a class BpmnActivity
 */
export interface BpmnActivityModel {

    /**
     * Defines the type of the activity
     * * None - Sets the type of the Bpmn Activity as None
     * * Task - Sets the type of the Bpmn Activity as Task
     * * SubProcess - Sets the type of the Bpmn Activity as SubProcess
     * @default 'Task'
     */
    activity?: BpmnActivities;

    /**
     * Defines the BPMN task
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *  id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *     shape: {
     *     type: 'Bpmn', shape: 'Activity', activity: {
     *     activity: 'Task', task: {
     *           type: 'Service'
     *       }
     *   }
     *  },
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default 'new BPMNTask()'
     */
    task?: BpmnTaskModel;

    /**
     * Defines the type of the SubProcesses
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *  id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *     shape: {
     *     type: 'Bpmn', shape: 'Activity', activity: {
     *     activity: 'SubProcess',
     *     subProcess: { collapsed: true } as BpmnSubProcessModel
     *   }
     *  },
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default 'None'
     */
    subProcess?: BpmnSubProcessModel;

}

/**
 * Interface for a class BpmnAnnotation
 */
export interface BpmnAnnotationModel {

    /**
     * Sets the text to annotate the bpmn shape
     * @default ''
     */
    text?: string;

    /**
     * Sets the id of the BPMN sub event
     * @default ''
     */
    id?: string;

    /**
     * Sets the angle between the bpmn shape and the annotation
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    angle?: number;

    /**
     * Sets the height of the text
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    height?: number;

    /**
     * Sets the width of the text
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    width?: number;

    /**
     * Sets the distance between the bpmn shape and the annotation
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    length?: number;

}

/**
 * Interface for a class BpmnShape
 */
export interface BpmnShapeModel extends ShapeModel{

    /**
     * Defines the type of node shape
     * @default 'Basic'
     */
    type?: Shapes;

    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *  id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *  shape: {
     *   type: 'Bpmn', shape: 'Gateway',
     *   gateway: { type: 'EventBased' } as BpmnGatewayModel
     *         } as BpmnShapeModel,
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     */
    shape?: BpmnShapes;

    /**
     * Defines the type of the BPMN Event shape
     * @default 'None'
     */
    event?: BpmnEventModel;

    /**
     * Defines the type of the BPMN Gateway shape
     * @default 'None'
     */
    gateway?: BpmnGatewayModel;

    /**
     * Defines the type of the BPMN DataObject shape
     * @default 'None'
     */
    dataObject?: BpmnDataObjectModel;

    /**
     * Defines the type of the BPMN Activity shape
     * @default 'None'
     */
    activity?: BpmnActivityModel;

    /**
     * Defines the text of the bpmn annotation
     * @default 'None'
     */
    annotation?: BpmnAnnotationModel;

    /**
     * Defines the text of the bpmn annotation collection
     * @default 'None'
     */

    annotations?: BpmnAnnotationModel[];

}

/**
 * Interface for a class UmlActivityShape
 */
export interface UmlActivityShapeModel extends ShapeModel{

    /**
     * Defines the type of node shape
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let shape: UmlActivityShapeModel = { type: 'UMLActivity', shape: 'Action' };
     * let nodes: NodeModel[] = [{
     * id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100, shape: shape
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default 'Basic'
     */
    type?: Shapes;

    /**
     * Defines the type of the UMLActivity shape
     * * Action - Sets the type of the UMLActivity Shape as Action
     * * Decision - Sets the type of the UMLActivity Shape as Decision
     * * MergeNode - Sets the type of the UMLActivity Shape as MergeNode
     * * InitialNode - Sets the type of the UMLActivity Shape as InitialNode
     * * FinalNode - Sets the type of the UMLActivity Shape as FinalNode
     * * ForkNode - Sets the type of the UMLActivity Shape as ForkNode
     * * JoinNode - Sets the type of the UMLActivity Shape as JoinNode
     * * TimeEvent - Sets the type of the UMLActivity Shape as TimeEvent
     * * AcceptingEvent - Sets the type of the UMLActivity Shape as AcceptingEvent
     * * SendSignal - Sets the type of the UMLActivity Shape as SendSignal
     * * ReceiveSignal - Sets the type of the UMLActivity Shape as ReceiveSignal
     * * StructuredNode - Sets the type of the UMLActivity Shape as StructuredNode
     * * Note - Sets the type of the UMLActivity Shape as Note
     * @default 'Action'
     * @IgnoreSingular
     */
    shape?: UmlActivityShapes;

}

/**
 * Interface for a class MethodArguments
 */
export interface MethodArgumentsModel {

    /**
     * Defines the name of the attributes
     * @default ''
     * @IgnoreSingular
     */
    name?: string;

    /**
     * Defines the type of the attributes
     * @default ''
     * @IgnoreSingular
     */
    type?: string;

    /**
     * Sets the shape style of the node
     * @default new ShapeStyle()
     * @aspType object
     * @blazorType UMLParameterShapeStyle
     */
    style?: ShapeStyleModel | TextStyleModel;

}

/**
 * Interface for a class UmlClassAttribute
 */
export interface UmlClassAttributeModel extends MethodArgumentsModel{

    /**
     * Defines the type of the attributes
     * @default 'Public'
     * @IgnoreSingular
     */
    scope?: UmlScope;

    /**
     * Defines the separator of the attributes
     * @default false
     * @IgnoreSingular
     */
    isSeparator?: boolean;

}

/**
 * Interface for a class UmlClassMethod
 */
export interface UmlClassMethodModel extends UmlClassAttributeModel{

    /**
     * Defines the type of the arguments
     * @default ''
     * @IgnoreSingular
     * @blazorType ObservableCollection<DiagramMethodArguments>
     */

    parameters?: MethodArgumentsModel[];

}

/**
 * Interface for a class UmlClass
 */
export interface UmlClassModel {

    /**
     * Defines the name of the attributes
     * @default ''
     * @IgnoreSingular
     */
    name?: string;

    /**
     * Defines the text of the bpmn annotation collection
     * @default 'None'
     * @blazorType ObservableCollection<DiagramUmlClassAttribute>
     */

    attributes?: UmlClassAttributeModel[];

    /**
     * Defines the text of the bpmn annotation collection
     * @default 'None'
     * @blazorType ObservableCollection<DiagramUmlClassMethod>
     */

    methods?: UmlClassMethodModel[];

    /**
     * Sets the shape style of the node
     * @default new ShapeStyle()
     * @aspType object
     */
    style?: TextStyleModel;

}

/**
 * Interface for a class UmlInterface
 */
export interface UmlInterfaceModel extends UmlClassModel{

    /**
     * Defines the separator of the attributes
     * @default false
     * @IgnoreSingular
     */
    isSeparator?: boolean;

}

/**
 * Interface for a class UmlEnumerationMember
 */
export interface UmlEnumerationMemberModel {

    /**
     * Defines the value of the member
     * @default ''
     * @IgnoreSingular
     */
    name?: string;

    /**
     * Defines the value of the member
     * @default ''
     * @IgnoreSingular
     */
    value?: string;

    /**
     * Defines the separator of the attributes
     * @default false
     * @IgnoreSingular
     */
    isSeparator?: boolean;

    /**
     * Sets the shape style of the node
     * @default new ShapeStyle()
     * @aspType object
     * @blazorType EnumerationMemberShapeStyle
     */
    style?: ShapeStyleModel | TextStyleModel;

}

/**
 * Interface for a class UmlEnumeration
 */
export interface UmlEnumerationModel {

    /**
     * Defines the name of the attributes
     * @default ''
     * @IgnoreSingular
     */
    name?: string;

    /**
     * Defines the text of the bpmn annotation collection
     * @default 'None'
     * @blazorType ObservableCollection<DiagramUmlEnumerationMember>
     */

    members?: UmlEnumerationMemberModel[];

    /**
     * Sets the shape style of the node
     * @default new ShapeStyle()
     * @aspType object
     * @blazorType UMLEnumerationShapeStyle
     */
    style?: ShapeStyleModel | TextStyleModel;

}

/**
 * Interface for a class UmlClassifierShape
 */
export interface UmlClassifierShapeModel extends ShapeModel{

    /**
     * Defines the type of node shape
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let shape: UmlActivityShapeModel = { type: 'UMLActivity', shape: 'Action' };
     * let nodes: NodeModel[] = [{
     * id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100, shape: shape
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default 'Basic'
     */
    type?: Shapes;

    /**
     * Defines the text of the bpmn annotation collection
     * @default 'None'
     */
    classShape?: UmlClassModel;

    /**
     * Defines the text of the bpmn annotation collection
     * @default 'None'
     */
    interfaceShape?: UmlInterfaceModel;

    /**
     * Defines the text of the bpmn annotation collection
     * @default 'None'
     * @blazorType UMLEnumerationShapeStyle
     */
    enumerationShape?: UmlEnumerationModel;

    /**
     * Defines the type of classifier
     * @default 'Class'
     * @IgnoreSingular
     */
    classifier?: ClassifierShape;

}

/**
 * Interface for a class DiagramShape
 */
export interface DiagramShapeModel {

    /**
     * Defines the type of node shape
     * @isBlazorNullableType true
     */
    type?: Shapes;

    /**
     * Defines the type of the basic shape
     * @blazorDefaultValue 'Rectangle'
     */
    basicShape?: BasicShapes;

    /**
     * Defines the type of the flow shape
     */
    flowShape?: FlowShapes;

    /**
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *  id: 'node', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *  shape: {
     *   type: 'Bpmn', shape: 'Gateway',
     *   gateway: { type: 'EventBased' } as BpmnGatewayModel
     *         } as BpmnShapeModel,
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes : nodes,
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default 'Event'
     */
    bpmnShape?: BpmnShapes;

    /**
     * Defines the type of the UMLActivity shape
     * * Action - Sets the type of the UMLActivity Shape as Action
     * * Decision - Sets the type of the UMLActivity Shape as Decision
     * * MergeNode - Sets the type of the UMLActivity Shape as MergeNode
     * * InitialNode - Sets the type of the UMLActivity Shape as InitialNode
     * * FinalNode - Sets the type of the UMLActivity Shape as FinalNode
     * * ForkNode - Sets the type of the UMLActivity Shape as ForkNode
     * * JoinNode - Sets the type of the UMLActivity Shape as JoinNode
     * * TimeEvent - Sets the type of the UMLActivity Shape as TimeEvent
     * * AcceptingEvent - Sets the type of the UMLActivity Shape as AcceptingEvent
     * * SendSignal - Sets the type of the UMLActivity Shape as SendSignal
     * * ReceiveSignal - Sets the type of the UMLActivity Shape as ReceiveSignal
     * * StructuredNode - Sets the type of the UMLActivity Shape as StructuredNode
     * * Note - Sets the type of the UMLActivity Shape as Note
     * @default 'Action'
     * @IgnoreSingular
     */
    umlActivityShape?: UmlActivityShapes;

    /**
     * Defines the geometry of a path
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *   shape: { type: 'Path', data: 'M540.3643,137.9336L546.7973,159.7016L570.3633,159.7296'+
     *   'L550.7723,171.9366L558.9053,194.9966L540.3643,179.4996L521.8223,194.9966L529.9553,171.9366'+
     *   'L510.3633,159.7296L533.9313,159.7016L540.3643,137.9336z' }
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default ''
     */
    data?: string;

    /**
     * Defines the geometry of a native element.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100,
     * shape: { scale: 'Stretch', 
     *   type: 'Native', content: '<g><path d='M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455'+
     * 'L0,90l7.975-23.522' +
     * 'c-4.023-6.606-6.34-14.354-6.34-22.637C1.635,19.628,21.416,0,45.818,0C70.223,0,90,19.628,90,43.841z M45.818,6.982' +
     * 'c-20.484,0-37.146,16.535-37.146,36.859c0,8.065,2.629,15.534,7.076,21.61L11.107,79.14l14.275-4.537' +
     * 'c5.865,3.851,12.891,6.097,20.437,6.097c20.481,0,37.146-16.533,37.146-36.857S66.301,6.982,45.818,6.982z M68.129,53.938' +
     * 'c-0.273-0.447-0.994-0.717-2.076-1.254c-1.084-0.537-6.41-3.138-7.4-3.495c-0.993-0.358-1.717-0.538-2.438,0.537' +
     * 'c-0.721,1.076-2.797,3.495-3.43,4.212c-0.632,0.719-1.263,0.809-2.347,0.271c-1.082-0.537-4.571-1.673-8.708-5.333' +
     * 'c-3.219-2.848-5.393-6.364-6.025-7.441c-0.631-1.075-0.066-1.656,0.475-2.191c0.488-0.482,1.084-1.255,1.625-1.882' +
     * 'c0.543-0.628,0.723-1.075,1.082-1.793c0.363-0.717,0.182-1.344-0.09-1.883c-0.27-0.537-2.438-5.825-3.34-7.977' +
     * 'c-0.902-2.15-1.803-1.792-2.436-1.792c-0.631,0-1.354-0.09-2.076-0.09c-0.722,0-1.896,0.269-2.889,1.344' +
     * 'c-0.992,1.076-3.789,3.676-3.789,8.963c0,5.288,3.879,10.397,4.422,11.113c0.541,0.716,7.49,11.92,18.5,16.223' +
     * 'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z'>'+
     * '</path></g>',
     *        }
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default ''
     */
    content?: SVGElement | HTMLElement;

    /**
     * Defines the text of the text element
     */
    textContent?: string;

    /**
     * Defines the scale of the native element.
     * * None - Sets the stretch type for diagram as None
     * * Stretch - Sets the stretch type for diagram as Stretch
     * * Meet - Sets the stretch type for diagram as Meet
     * * Slice - Sets the stretch type for diagram as Slice
     * @default 'Stretch'
     */
    scale?: Stretch;

    /**
     * Defines the source of the image
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
     * shape: { type: 'Image', source: 'https://www.w3schools.com/images/w3schools_green.jpg' }
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @default ''
     */
    source?: string;

    /**
     * Defines the alignment of the image within the node boundary.
     * * None - Alignment value will be set as none
     * * XMinYMin - smallest X value of the view port and  smallest Y value of the view port
     * * XMidYMin - midpoint X value of the view port and  smallest Y value of the view port
     * * XMaxYMin - maximum X value of the view port and  smallest Y value of the view port
     * * XMinYMid - smallest X value of the view port and midpoint Y value of the view port
     * * XMidYMid - midpoint X value of the view port and midpoint Y value of the view port
     * * XMaxYMid - maximum X value of the view port and midpoint Y value of the view port
     * * XMinYMax - smallest X value of the view port and maximum Y value of the view port
     * * XMidYMax - midpoint X value of the view port and maximum Y value of the view port
     * * XMaxYMax - maximum X value of the view port and maximum Y value of the view port
     * @default 'None'
     */
    align?: ImageAlignment;

    /**
     * Defines the space to be let between the node and its immediate parent
     * @default 0
     */
    margin?: MarginModel;

    /**
     * Sets the corner of the node
     * @default 0
     */
    cornerRadius?: number;

    /**
     * Defines the collection of points to draw a polygon
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    points?: PointModel[];

    /**
     * Defines the type of the BPMN DataObject shape
     * @default 'None'
     */
    dataObject?: BpmnDataObjectModel;

    /**
     * Defines the type of the BPMN Event shape
     * @default 'None'
     */
    event?: BpmnEventModel;

    /**
     * Defines the type of the BPMN Gateway shape
     * @default 'None'
     */
    gateway?: BpmnGatewayModel;

    /**
     * Defines the text of the bpmn annotation collection
     * @default 'None'
     * @blazorType ObservableCollection<DiagramBpmnAnnotation>
     */

    annotations?: BpmnAnnotationModel[];

    /**
     * Defines the type of the BPMN Activity shape
     * @default 'None'
     */
    activity?: BpmnActivityModel;

    /**
     * Defines the text of the bpmn annotation
     * @default 'None'
     * @blazorType DiagramBpmnAnnotation
     */
    annotation?: BpmnAnnotationModel;

    /**
     * Defines the text of the bpmn annotation collection
     * @default 'None'
     */
    enumerationShape?: UmlEnumerationModel;

    /**
     * Defines the type of classifier
     * @default 'Class'
     * @IgnoreSingular
     */
    classifier?: ClassifierShape;

    /**
     * Defines the text of the bpmn annotation collection
     * @default 'None'
     */
    classShape?: UmlClassModel;

    /**
     * Defines the text of the bpmn annotation collection
     * @default 'None'
     */
    interfaceShape?: UmlInterfaceModel;

}

/**
 * Interface for a class Node
 */
export interface NodeModel extends NodeBaseModel{

    /**
     * Defines the collection of textual annotations of nodes/connectors
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @blazorType ObservableCollection<DiagramNodeAnnotation>
     */
    annotations?: ShapeAnnotationModel[];

    /**
     * Sets the x-coordinate of the position of the node
     * @default 0
     */
    offsetX?: number;

    /**
     * Sets the layout properties using node property
     * @default new NodeLayoutInfo()
     * @aspType object
     * @blazorType DiagramNodeLayoutInfo
     */
    layoutInfo?: LayoutInfo;

    /**
     * Sets the y-coordinate of the position of the node
     * @default 0
     */
    offsetY?: number;

    /**
     * Defines the collection of connection points of nodes/connectors
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @blazorType ObservableCollection<DiagramPort>
     */
    ports?: PointPortModel[];

    /**
     * Defines whether the node is expanded or not
     * @default true
     */
    isExpanded?: boolean;

    /**
     * Specifies the collection of the fixed user handle
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @blazorType ObservableCollection<DiagramNodeFixedUserHandle>
     */
    fixedUserHandles?: NodeFixedUserHandleModel[];

    /**
     * Defines the expanded state of a node
     * @default {}
     */
    expandIcon?: IconShapeModel;

    /**
     * Defines the collapsed state of a node
     * @default {}
     */
    collapseIcon?: IconShapeModel;

    /**
     * Sets the reference point, that will act as the offset values(offsetX, offsetY) of a node
     * @default new Point(0.5,0.5)
     * @blazorType NodePivotPoint
     */
    pivot?: PointModel;

    /**
     * Sets the width of the node
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    width?: number;

    /**
     * Sets the height of the node
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    height?: number;

    /**
     * Sets the minimum width of the node
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    minWidth?: number;

    /**
     * Sets the minimum height of the node
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    minHeight?: number;

    /**
     * Sets the maximum width of the node
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    maxWidth?: number;

    /**
     * Sets the maximum height of the node
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    maxHeight?: number;

    /**
     * Sets the rotate angle of the node
     * @default 0
     */
    rotateAngle?: number;

    /**
     * Sets the shape style of the node
     * @default new ShapeStyle()
     * @aspType object
     * @blazorType NodeShapeStyle
     */
    style?: ShapeStyleModel | TextStyleModel;

    /**
     * Sets the background color of the shape
     * @default 'transparent'
     */
    backgroundColor?: string;

    /**
     * Sets the border color of the node
     * @deprecated
     * @default 'none'
     */
    borderColor?: string;

    /**
     * Sets the border width of the node
     * @deprecated
     * @default 0
     * @isBlazorNullableType true
     */
    borderWidth?: number;

    /**
     * Sets the data source of the node
     */
    data?: Object;

    /**
     * Defines the shape of a node
     * @default Basic Shape
     * @aspType object
     * @blazorType DiagramShape
     */
    shape?: ShapeModel | FlowShapeModel | BasicShapeModel | ImageModel | PathModel | TextModel | BpmnShapeModel | NativeModel | HtmlModel | UmlActivityShapeModel | UmlClassifierShapeModel | SwimLaneModel | DiagramShapeModel;

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
     * Sets or gets the UI of a node
     * @default null
     * @deprecated
     */
    wrapper?: Container;

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
     * @aspNumberEnum
     * @blazorNumberEnum
     */
    constraints?: NodeConstraints;

    /**
     * Defines the shadow of a shape/path
     * @default null
     */
    shadow?: ShadowModel;

    /**
     * Defines the children of group element
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    children?: string[];

    /**
     * Defines the type of the container
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default null
     * @deprecated
     */

    container?: ChildContainerModel;

    /**
     * Sets the horizontalAlignment of the node
     * @default 'Stretch'
     * @blazorDefaultValue 'Left'
     */
    horizontalAlignment?: HorizontalAlignment;

    /**
     * Sets the verticalAlignment of the node
     * @default 'Stretch'
     * @blazorDefaultValue 'Top'
     */
    verticalAlignment?: VerticalAlignment;

    /**
     * Used to define the rows for the grid container
     * @aspDefaultValueIgnore
     * @deprecated
     * @default undefined
     */

    rows?: RowDefinition[];

    /**
     * Used to define the column for the grid container
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */

    columns?: ColumnDefinition[];

    /**
     * Used to define a index of row in the grid
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */

    rowIndex?: number;

    /**
     * Used to define a index of column in the grid
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */

    columnIndex?: number;

    /**
     * Merge the row use the property in the grid container
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    rowSpan?: number;

    /**
     * Merge the column use the property in the grid container
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    columnSpan?: number;

    /**
     * Set the branch for the mind map
     * @aspDefaultValueIgnore
     * @blazorDefaultValue null
     * @isBlazorNullableType true
     * @default ''
     */
    branch?: BranchTypes;

}

/**
 * Interface for a class Header
 */
export interface HeaderModel {

    /**
     * Sets the id of the header
     * @default ''
     */
    id?: string;

    /**
     * Sets the content of the header
     * @default ''
     */
    annotation?: AnnotationModel;

    /**
     * Sets the style of the header
     * @default ''
     */
    style?: TextStyleModel;

    /**
     * Sets the height of the header
     * @default 50
     */
    height?: number;

    /**
     * Sets the width of the header
     * @default 50
     */
    width?: number;

}

/**
 * Interface for a class Lane
 */
export interface LaneModel {

    /**
     * Sets the id of the lane
     * @default ''
     */
    id?: string;

    /**
     * Sets style of the lane
     * @default ''
     */
    style?: ShapeStyleModel;

    /**
     * Defines the collection of child nodes
     * @default []
     * @blazorType ObservableCollection<DiagramNode>
     */
    children?: NodeModel[];

    /**
     * Defines the height of the phase
     * @default 100
     */
    height?: number;

    /**
     * Defines the height of the phase
     * @default 100
     */
    width?: number;

    /**
     * Defines the collection of header in the phase.
     * @default new Header()
     */
    header?: HeaderModel;

    /**
     * Defines when the lane to be interchanged or not
     * @default true 
     */
    canMove?: boolean;

}

/**
 * Interface for a class Phase
 */
export interface PhaseModel {

    /**
     * Sets the id of the phase
     * @default ''
     */
    id?: string;

    /**
     * Sets the style of the lane
     * @default ''
     */
    style?: ShapeStyleModel;

    /**
     * Sets the header collection of the phase
     * @default  new Header()
     */
    header?: HeaderModel;

    /**
     * Sets the offset of the lane
     * @default 100
     */
    offset?: number;

}

/**
 * Interface for a class SwimLane
 */
export interface SwimLaneModel extends ShapeModel{

    /**
     * Defines the type of node shape.
     * @default 'Basic'
     */
    type?: Shapes;

    /**
     * Defines the size of phase.
     * @default 20
     */
    phaseSize?: number;

    /**
     * Defines the collection of phases.
     * @default 'undefined'
     */
    phases?: PhaseModel[];

    /**
     * Defines the orientation of the swimLane
     * @default 'Horizontal'
     */
    orientation?: Orientation;

    /**
     * Defines the collection of lanes
     * @default 'undefined'
     */
    lanes?: LaneModel[];

    /**
     * Defines the collection of header
     * @default 'undefined'
     */
    header?: HeaderModel;

    /**
     * Defines the whether the shape is a lane or not
     * @default false
     */
    isLane?: boolean;

    /**
     * Defines the whether the shape is a phase or not
     * @default false
     */
    isPhase?: boolean;

}

/**
 * Interface for a class ChildContainer
 */
export interface ChildContainerModel {

    /**
     * Defines the type of the container
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default Canvas
     */
    type?: ContainerTypes;

    /**
     * Defines the type of the swimLane orientation.
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    orientation?: Orientation;

}

/**
 * Interface for a class Selector
 */
export interface SelectorModel {

    /**
     * Defines the size and position of the container
     * @default null
     */
    wrapper?: Container;

    /**
     * Defines the collection of selected nodes
     * @blazorType ObservableCollection<DiagramNode>
     */
    nodes?: NodeModel[];

    /**
     * Defines the collection of selected connectors
     * @blazorType ObservableCollection<DiagramConnector>
     */
    connectors?: ConnectorModel[];

    /**
     * Sets/Gets the width of the container
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    width?: number;

    /**
     * Sets/Gets the height of the container
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     */
    height?: number;

    /**
     * Sets the rotate angle of the container
     * @default 0
     * @isBlazorNullableType true
     */
    rotateAngle?: number;

    /**
     * Sets the positionX of the container
     * @default 0
     * @isBlazorNullableType true
     */
    offsetX?: number;

    /**
     * Sets the positionY of the container
     * @default 0
     * @isBlazorNullableType true
     */
    offsetY?: number;

    /**
     * Sets the pivot of the selector
     * @default { x: 0.5, y: 0.5 } 
     * @blazorType SelectorPivot
     */
    pivot?: PointModel;

    /**
     * Defines how to pick the objects to be selected using rubber band selection
     * * CompleteIntersect - Selects the objects that are contained within the selected region
     * * PartialIntersect - Selects the objects that are partially intersected with the selected region
     * @default 'CompleteIntersect'
     */
    rubberBandSelectionMode?: RubberBandSelectionMode;

    /**
     * Defines the collection of user handle
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     *           id: 'node1', width: 100, height: 100, offsetX: 100, offsetY: 100,
     *           annotations: [{ content: 'Default Shape' }]
     *       },
     *       {
     *           id: 'node2', width: 100, height: 100, offsetX: 300, offsetY: 100,
     *           shape: {
     *               type: 'Basic', shape: 'Ellipse'
     *           },
     *           annotations: [{ content: 'Path Element' }]
     *       }
     *       ];
     *       let connectors: ConnectorModel[] = [{
     *           id: 'connector1',
     *           type: 'Straight',
     *           sourcePoint: { x: 100, y: 300 },
     *           targetPoint: { x: 200, y: 400 },
     *       }];
     * let handle: UserHandleModel[] = [
     * { name: 'handle', margin: { top: 0, bottom: 0, left: 0, right: 0 }, offset: 0,
     * pathData: 'M 376.892,225.284L 371.279,211.95L 376.892,198.617L 350.225,211.95L 376.892,225.284 Z',
     * side: 'Top', horizontalAlignment: 'Center', verticalAlignment: 'Center', 
     * pathColor: 'yellow' }];
     * let diagram: Diagram = new Diagram({
     * ...
     *     connectors: connectors, nodes: nodes,
     *     selectedItems: { constraints: SelectorConstraints.All, userHandles: handle },
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     * @blazorType ObservableCollection<DiagramUserHandle>
     * @default []
     */
    userHandles?: UserHandleModel[];

    /**
     * Controls the visibility of selector.
     * * None - Hides all the selector elements
     * * ConnectorSourceThumb - Shows/hides the source thumb of the connector
     * * ConnectorTargetThumb - Shows/hides the target thumb of the connector
     * * ResizeSouthEast - Shows/hides the bottom right resize handle of the selector
     * * ResizeSouthWest - Shows/hides the bottom left resize handle of the selector
     * * ResizeNorthEast - Shows/hides the top right resize handle of the selector
     * * ResizeNorthWest - Shows/hides the top left resize handle of the selector
     * * ResizeEast - Shows/hides the middle right resize handle of the selector
     * * ResizeWest - Shows/hides the middle left resize handle of the selector
     * * ResizeSouth - Shows/hides the bottom center resize handle of the selector
     * * ResizeNorth - Shows/hides the top center resize handle of the selector
     * * Rotate - Shows/hides the rotate handle of the selector
     * * UserHandles - Shows/hides the user handles of the selector
     * * Resize - Shows/hides all resize handles of the selector
     * @default 'All'
     * @aspNumberEnum
     * @blazorNumberEnum
     */
    constraints?: SelectorConstraints;

    /**
     * setTooltipTemplate helps to customize the content of a tooltip
     * @aspDefaultValueIgnore
     * @blazorDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    setTooltipTemplate?: Function | string;

}