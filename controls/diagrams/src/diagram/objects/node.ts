/// <reference path='./node-base-model.d.ts'/>
import { Property, Complex, Collection, ChildProperty, ComplexFactory } from '@syncfusion/ej2-base';
import { ShapeStyle, Margin, TextStyle, Shadow } from '../core/appearance';
import { ShapeStyleModel, TextStyleModel, ShadowModel, } from '../core/appearance-model';
import { Point } from '../primitives/point';
import { Size } from '../primitives/size';
import { PointModel } from '../primitives/point-model';
import { Shapes, BasicShapes, FlowShapes, Scale, ImageAlignment } from '../enum/enum';
import { IElement } from './interface/IElement';
import { Container } from '../core/containers/container';
import { Canvas } from '../core/containers/canvas';
import { getBasicShape } from './dictionary/basic-shapes';
import { DiagramElement } from '../core/elements/diagram-element';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { ImageElement } from '../core/elements/image-element';
import { DiagramNativeElement } from '../core/elements/native-element';
import { Port, PointPort } from './port';
import { PointPortModel } from './port-model';
import { Annotation, ShapeAnnotation } from './annotation';
import { ShapeAnnotationModel, HyperlinkModel } from './annotation-model';
import { getPortShape, getIconShape } from './dictionary/common';
import { getFlowShape } from './dictionary/flow-shapes';
import { HorizontalAlignment, VerticalAlignment, BpmnShapes, BpmnEvents, BpmnTriggers, BpmnGateways, NodeConstraints } from '../enum/enum';
import { BpmnDataObjects, BpmnTasks, BpmnSubProcessTypes, BpmnLoops } from '../enum/enum';
import { BpmnBoundary, BpmnActivities } from '../enum/enum';
import { MarginModel } from '../core/appearance-model';
import { BpmnEventModel, BpmnSubEventModel, BpmnAnnotationModel, BpmnActivityModel } from './node-model';
import { BpmnTaskModel, BpmnSubProcessModel, BpmnGatewayModel } from './node-model';
import { ShapeModel, BasicShapeModel, FlowShapeModel, ImageModel, PathModel, BpmnShapeModel, BpmnDataObjectModel } from './node-model';
import { TextModel, NativeModel, HtmlModel } from './node-model';
import { LayoutModel } from '../layout/layout-base-model';
import { checkPortRestriction } from './../utility/diagram-util';
import { randomId, getFunction } from './../utility/base-util';
import { NodeBase } from './node-base';
import { canShadow } from './../utility/constraints-util';
import { NodeModel, BpmnTransactionSubProcessModel } from '../objects/node-model';
import { PortVisibility, Stretch } from '../enum/enum';
import { IconShapeModel } from './icon-model';
import { IconShape } from './icon';
import { measurePath } from './../utility/dom-util';
import { Rect } from '../primitives/rect';
import { getPolygonPath } from './../utility/path-util';
import { DiagramHtmlElement } from '../core/elements/html-element';

let getShapeType: Function = (obj: Shape): Object => {
    switch (obj.type) {
        case 'Basic':
            return BasicShape;
        case 'Flow':
            return FlowShape;
        case 'Path':
            return Path;
        case 'Image':
            return Image;
        case 'Text':
            return Text;
        case 'Bpmn':
            return BpmnShape;
        case 'Native':
            return Native;
        case 'HTML':
            return Html;
        default:
            return BasicShape;
    }
};

/**
 * Defines the behavior of default shape
 */
export class Shape extends ChildProperty<Shape> {
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
     * @default 'Basic'
     */
    @Property('Basic')
    public type: Shapes;
}

/**
 * Defines the behavior of path shape
 */
export class Path extends Shape {
    /**
     * Defines the type of node shape
     * @default 'Basic'
     */
    @Property('Path')
    public type: Shapes;

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
    @Property('')
    public data: string;
}

/**
 * Defines the behavior of Native shape
 */
export class Native extends Shape {
    /**
     * Defines the type of node shape.
     * @default 'Basic'
     */
    @Property('Native')
    public type: Shapes;
    /**
     * Defines the geometry of a native element.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100,
     * shape: { scale: 'Stretch', 
     *   type: 'Native', content: '<g><path d="M90,43.841c0,24.213-19.779,43.841-44.182,43.841c-7.747,0-15.025-1.98-21.357-5.455'+
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
     * 'C58.2,65.771,58.2,64.336,60.186,64.156c1.984-0.179,6.406-2.599,7.312-5.107C68.398,56.537,68.398,54.386,68.129,53.938z">'+
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
    @Property('')
    public content: string | SVGElement;

    /**
     * Defines the scale of the native element.
     * * None - Sets the stretch type for diagram as None
     * * Stretch - Sets the stretch type for diagram as Stretch
     * * Meet - Sets the stretch type for diagram as Meet
     * * Slice - Sets the stretch type for diagram as Slice
     * @default 'Stretch'
     */
    @Property('Stretch')
    public scale: Stretch;
}

/**
 * Defines the behavior of html shape
 */
export class Html extends Shape {
    /**
     * Defines the type of node shape.
     * @default 'Basic'
     */
    @Property('HTML')
    public type: Shapes;

    /**
     * Defines the geometry of a html element.
     * ```html
     * <div id='diagram'></div>
     * ```
     * ```typescript
     * let nodes: NodeModel[] = [{
     * id: 'node1', width: 100, height: 100, offsetX: 300, offsetY: 100,
     * shape: { type: 'HTML', 
     * content: '<div style="background:red;height:100%;width:100%;"><input type="button" value="{{:value}}" /></div>' }
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
    @Property('')
    public content: string | HTMLElement;
}

/**
 * Defines the behavior of image shape
 */
export class Image extends Shape {
    /**
     * Defines the type of node shape
     * @default 'Basic'
     */
    @Property('Image')
    public type: Shapes;
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
    @Property('')
    public source: string;

    /**
     * Allows to stretch the image as you desired (either to maintain proportion or to stretch)
     * * None - Scale value will be set as None for the image
     * * Meet - Scale value Meet will be set for the image
     * * Slice - Scale value Slice will be set for the image
     * @default ''
     */
    @Property('')
    public scale: Scale;

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
    @Property('None')
    public align: ImageAlignment;

}

/**
 * Defines the behavior of the text shape
 */
export class Text extends Shape {
    /**
     * Defines the type of node shape
     * @default 'Basic'
     */
    @Property('Text')
    public type: Shapes;
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
    @Property('')
    public content: string;

    /**
     * Defines the space to be let between the node and its immediate parent
     * @default 0
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;
}


/**
 * Defines the behavior of the basic shape
 */
export class BasicShape extends Shape {
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
    @Property('Basic')
    public type: Shapes;
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
    @Property('Rectangle')
    public shape: BasicShapes;

    /**
     * Sets the corner of the node
     * @default 0
     */
    @Property(0)
    public cornerRadius: number;

    /**
     * Defines the collection of points to draw a polygon
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Collection<PointModel>([], Point)
    public points: PointModel[];
}

/**
 * Defines the behavior of the flow shape
 */
export class FlowShape extends Shape {
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
    @Property('Flow')
    public type: Shapes;

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
     * @default ''
     */
    @Property('Terminator')
    public shape: FlowShapes;
}

/**
 * Defines the behavior of the bpmn gateway shape
 */
export class BpmnGateway extends ChildProperty<BpmnGateway> {
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
    @Property('None')
    public type: BpmnGateways;
}

/**
 * Defines the behavior of the bpmn data object
 */
export class BpmnDataObject extends ChildProperty<BpmnDataObject> {
    /**
     * Defines the type of the BPMN data object
     * * None - Sets the type of the data object as None
     * * Input - Sets the type of the data object as Input
     * * Output - Sets the type of the data object as Output
     * @default 'None'
     */
    @Property('None')
    public type: BpmnDataObjects;

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
    @Property(false)
    public collection: boolean;
}
/**
 * Defines the behavior of the bpmn task shape
 */
export class BpmnTask extends ChildProperty<BpmnTask> {

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
    @Property('None')
    public type: BpmnTasks;

    /**
     * Defines the type of the BPMN loops
     * * None - Sets the type of the Bpmn loop as None
     * * Standard - Sets the type of the Bpmn loop as Standard
     * * ParallelMultiInstance - Sets the type of the Bpmn loop as ParallelMultiInstance
     * * SequenceMultiInstance - Sets the type of the Bpmn loop as SequenceMultiInstance
     * @default 'None'
     */
    @Property('None')
    public loop: BpmnLoops;

    /**
     * Sets whether the task is global or not
     * @default false
     */
    @Property(false)
    public call: boolean;

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
    @Property(false)
    public compensation: boolean;

}

/**
 * Defines the behavior of the bpmn Event shape
 */
export class BpmnEvent extends ChildProperty<BpmnEvent> {
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
     */
    @Property('Start')
    public event: BpmnEvents;

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
    @Property('None')
    public trigger: BpmnTriggers;

}

/**
 * Defines the behavior of the bpmn sub event
 */
export class BpmnSubEvent extends ChildProperty<BpmnSubEvent> {

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
    @Property('None')
    public trigger: BpmnTriggers;

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
    @Property('Start')
    public event: BpmnEvents;

    /**
     * Sets the id of the BPMN sub event
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Defines the position of the sub event
     * @default new Point(0.5,0.5)
     */

    @Complex<PointModel>({}, Point)
    public offset: PointModel;

    /**
     * Defines the collection of textual annotations of the sub events
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Collection<ShapeAnnotationModel>([], ShapeAnnotation)
    public annotations: ShapeAnnotationModel[];

    /**
     * Defines the collection of connection points of the sub events
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Collection<PointPortModel>([], PointPort)
    public ports: PointPortModel[];

    /**
     * Sets the width of the node
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets the height of the node
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Defines the space to be left between the node and its immediate parent
     * @default 0
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Sets how to horizontally align a node with respect to its immediate parent
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Left - Aligns the diagram element at the left of its immediate parent
     * * Right - Aligns the diagram element at the right of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Center'
     */
    @Property('Center')
    public horizontalAlignment: HorizontalAlignment;

    /**
     * Sets how to vertically align a node with respect to its immediate parent
     * * Stretch - Stretches the diagram element throughout its immediate parent
     * * Top - Aligns the diagram element at the top of its immediate parent
     * * Bottom - Aligns the diagram element at the bottom of its immediate parent
     * * Center - Aligns the diagram element at the center of its immediate parent
     * * Auto - Aligns the diagram element based on the characteristics of its immediate parent
     * @default 'Center'
     */
    @Property('Center')
    public verticalAlignment: VerticalAlignment;

    /**
     * Sets the visibility of the sub event
     * @default true
     */
    @Property(true)
    public visible: boolean;

}


export class BpmnTransactionSubProcess extends ChildProperty<BpmnTransactionSubProcess> {
    /**
     * Defines the size and position of the success port
     */
    @Complex<BpmnSubEventModel>({ id: 'success', event: 'End', offset: { x: 1, y: 0.5 } }, BpmnSubEvent)
    public success: BpmnSubEventModel;

    /**
     * Defines the size and position of the failure port
     */
    @Complex<BpmnSubEventModel>({ id: 'failure', event: 'Intermediate', trigger: 'Error', offset: { x: 0.25, y: 1 } }, BpmnSubEvent)
    public failure: BpmnSubEventModel;


    /**
     * Defines the size and position of the cancel port
     */
    @Complex<BpmnSubEventModel>({ id: 'cancel', event: 'Intermediate', trigger: 'Cancel', offset: { x: 0.75, y: 1 } }, BpmnSubEvent)
    public cancel: BpmnSubEventModel;
}


/**
 * Defines the behavior of the BPMNSubProcess
 */
export class BpmnSubProcess extends ChildProperty<BpmnSubProcess> {

    /**
     * Defines the type of the sub process
     * * None - Sets the type of the Sub process as None
     * * Transaction - Sets the type of the Sub process as Transaction
     * * Event - Sets the type of the Sub process as Event
     * @default 'None'
     */
    @Property('None')
    public type: BpmnSubProcessTypes;

    /**
     * Defines whether the sub process is without any prescribed order or not
     * @default false
     */
    @Property(false)
    public adhoc: boolean;

    /**
     * Defines the boundary type of the BPMN process
     * * Default - Sets the type of the boundary as Default
     * * Call - Sets the type of the boundary as Call
     * * Event - Sets the type of the boundary as Event
     * @default 'Default'
     */
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
    @Property('Default')
    public boundary: BpmnBoundary;

    /**
     * Defines the whether the task is triggered as a compensation of another task
     * @default false
     */
    @Property(false)
    public compensation: boolean;

    /**
     * Defines the  type of the BPMNLoop
     * * None - Sets the type of the Bpmn loop as None
     * * Standard - Sets the type of the Bpmn loop as Standard
     * * ParallelMultiInstance - Sets the type of the Bpmn loop as ParallelMultiInstance
     * * SequenceMultiInstance - Sets the type of the Bpmn loop as SequenceMultiInstance
     * @default 'None'
     */
    @Property('None')
    public loop: BpmnLoops;

    /**
     * Defines the whether the shape is collapsed or not
     * @default true
     */
    @Property(true)
    public collapsed: boolean;

    /**
     * Defines the collection of events of the BPMN sub event
     * @default 'undefined'
     */
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
     */
    @Collection<BpmnSubEventModel>([], BpmnSubEvent)
    public events: BpmnSubEventModel[];

    /**
     * Defines the transaction sub process
     */
    @Complex<BpmnTransactionSubProcessModel>({}, BpmnTransactionSubProcess)
    public transaction: BpmnTransactionSubProcessModel;

    /**
     * Defines the transaction sub process
     * @default []
     */
    @Property(undefined)
    public processes: string[];
}

/**
 * Defines the behavior of the bpmn activity shape
 */
export class BpmnActivity extends ChildProperty<BpmnActivity> {

    /**
     * Defines the type of the activity
     * * None - Sets the type of the Bpmn Activity as None
     * * Task - Sets the type of the Bpmn Activity as Task
     * * SubProcess - Sets the type of the Bpmn Activity as SubProcess
     * @default 'Task'
     */
    @Property('Task')
    public activity: BpmnActivities;

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
    @Complex<BpmnTaskModel>({}, BpmnTask)
    public task: BpmnTaskModel;


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
    @Complex<BpmnSubProcessModel>({}, BpmnSubProcess)
    public subProcess: BpmnSubProcessModel;

}

/**
 * Defines the behavior of the bpmn annotation
 */
export class BpmnAnnotation extends ChildProperty<BpmnAnnotation> {
    // tslint:disable-next-line:no-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }
    /**
     * Sets the text to annotate the bpmn shape
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Sets the id of the BPMN sub event
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Sets the angle between the bpmn shape and the annotation
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property(0)
    public angle: number;

    /**
     * Sets the height of the text
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Sets the width of the text
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets the distance between the bpmn shape and the annotation
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property(0)
    public length: number;

    /** @private */
    public nodeId: string;
}

/**
 * Defines the behavior of the bpmn shape
 */
export class BpmnShape extends Shape {
    /**
     * Defines the type of node shape
     * @default 'Bpmn'
     */
    @Property('Bpmn')
    public type: Shapes;

    /**
     * Defines the type of the BPMN shape
     * * Event - Sets the type of the Bpmn Shape as Event
     * * Gateway - Sets the type of the Bpmn Shape as Gateway
     * * Message - Sets the type of the Bpmn Shape as Message
     * * DataObject - Sets the type of the Bpmn Shape as DataObject
     * * DataSource - Sets the type of the Bpmn Shape as DataSource
     * * Activity - Sets the type of the Bpmn Shape as Activity
     * * Group - Sets the type of the Bpmn Shape as Group
     * * TextAnnotation - Represents the shape as Text Annotation
     * @default 'Event'
     */
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
    @Property('Event')
    public shape: BpmnShapes;

    /**
     * Defines the type of the BPMN Event shape
     * @default 'None'
     */
    @Complex<BpmnEventModel>({}, BpmnEvent)
    public event: BpmnEventModel;

    /**
     * Defines the type of the BPMN Gateway shape
     * @default 'None'
     */
    @Complex<BpmnGatewayModel>({}, BpmnGateway)
    public gateway: BpmnGatewayModel;

    /**
     * Defines the type of the BPMN DataObject shape
     * @default 'None'
     */
    @Complex<BpmnDataObjectModel>({}, BpmnDataObject)
    public dataObject: BpmnDataObjectModel;

    /**
     * Defines the type of the BPMN Activity shape
     * @default 'None'
     */
    @Complex<BpmnActivityModel>({}, BpmnActivity)
    public activity: BpmnActivityModel;

    /**
     * Defines the text of the bpmn annotation
     * @default 'None'
     */
    @Complex<BpmnAnnotationModel>({}, BpmnAnnotation)
    public annotation: BpmnAnnotationModel;
    /**
     * Defines the text of the bpmn annotation collection
     * @default 'None'
     */

    @Collection<BpmnAnnotationModel>([], BpmnAnnotation)
    public annotations: BpmnAnnotationModel[];

}

/**
 * Defines the behavior of nodes
 */
export class Node extends NodeBase implements IElement {

    /**
     * Defines the collection of textual annotations of nodes/connectors
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Collection<ShapeAnnotationModel>([], ShapeAnnotation)
    public annotations: ShapeAnnotationModel[];

    /**
     * Sets the x-coordinate of the position of the node
     * @default 0
     */
    @Property(0)
    public offsetX: number;

    /**
     * Sets the y-coordinate of the position of the node
     * @default 0
     */
    @Property(0)
    public offsetY: number;

    /**
     * Sets the reference point, that will act as the offset values(offsetX, offsetY) of a node
     * @default new Point(0.5,0.5)
     */
    @Complex<PointModel>({ x: 0.5, y: 0.5 }, Point)
    public pivot: PointModel;

    /**
     * Sets the width of the node
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets the height of the node
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Sets the minimum width of the node
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public minWidth: number;

    /**
     * Sets the minimum height of the node
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public minHeight: number;

    /**
     * Sets the maximum width of the node
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public maxWidth: number;

    /**
     * Sets the maximum height of the node
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public maxHeight: number;

    /**
     * Sets the rotate angle of the node
     * @default 0
     */
    @Property(0)
    public rotateAngle: number;

    /**
     * Sets the shape style of the node
     * @default new ShapeStyle()
     * @aspType object
     */
    @Complex<ShapeStyleModel | TextStyleModel>({}, TextStyle)
    public style: ShapeStyleModel | TextStyleModel;

    /**
     * Sets the background color of the shape
     * @default 'transparent'
     */
    @Property('transparent')
    public backgroundColor: string;
    /**
     * Sets the border color of the node
     * @default 'none'
     */
    @Property('none')
    public borderColor: string;

    /**
     * Sets the border width of the node
     * @default 0
     */
    @Property(0)
    public borderWidth: number;

    /**
     * Sets the data source of the node
     */
    @Property()
    public data: Object;

    /* tslint:disable */
    /**
     * Defines the shape of a node
     * @default Basic Shape
     * @aspType object
     */
    @ComplexFactory(getShapeType)
    public shape: ShapeModel | FlowShapeModel | BasicShapeModel | ImageModel | PathModel | TextModel | BpmnShapeModel | NativeModel | HtmlModel;
    /* tslint:enable */


    /**
     * Sets or gets the UI of a node
     * @default null
     */
    @Property(null)
    public wrapper: Container;

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
     */
    @Property(NodeConstraints.Default)
    public constraints: NodeConstraints;

    /**
     * Defines the shadow of a shape/path
     * @default null
     */
    @Complex<ShadowModel>({}, Shadow)
    public shadow: ShadowModel;

    /**
     * Defines the children of group element
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public children: string[];

    /** @private */
    public parentId: string = '';
    /** @private */
    public processId: string = '';
    /** @private */
    public outEdges: string[] = [];
    /** @private */
    public inEdges: string[] = [];
    /** @private */
    public get actualSize(): Size {
        if (this.wrapper !== null) {
            return this.wrapper.actualSize;
        } else {
            return new Size(this.width || 0, this.height || 0);
        }
    }

    // tslint:disable-next-line:no-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
        if (this.children && this.children.length > 0) {
            let nodeDefault: NodeModel = defaultValue;
            if (!nodeDefault.style || !nodeDefault.style.fill) {
                this.style.fill = 'transparent';
            }
            if (!nodeDefault.style || !nodeDefault.style.strokeColor) {
                this.style.strokeColor = 'transparent';
            }
        }
    }

    /**
     * Allows to initialize the UI of a node
     */
    /** @private */
    /* tslint:disable */
    public init(diagram: any): DiagramElement {
        let content: DiagramElement = new DiagramElement();
        let textStyle: TextStyle;
        let changedProperties: string = 'changedProperties';
        let oldProperties: string = 'oldProperties';
        this.shape[changedProperties] = {};
        this.shape[oldProperties] = {};

        switch (this.shape.type) {
            case 'Path':
                let pathContent: PathElement = new PathElement();
                pathContent.data = (this.shape as Path).data;
                content = pathContent; break;
            case 'Image':
                let imageContent: ImageElement = new ImageElement();
                imageContent.source = (this.shape as Image).source;
                imageContent.imageAlign = (this.shape as Image).align;
                imageContent.imageScale = (this.shape as Image).scale; content = imageContent; break;
            case 'Text':
                let textContent: TextElement = new TextElement();
                textContent.content = (this.shape as Text).content;
                content = textContent; textStyle = this.style as TextStyle;
                content.style = textStyle; break;
            case 'Basic':
                if ((this.shape as BasicShape).shape === 'Rectangle') {
                    let basicshape: DiagramElement = new DiagramElement();
                    content = basicshape;
                    content.cornerRadius = (this.shape as BasicShape).cornerRadius;
                } else if ((this.shape as BasicShape).shape === 'Polygon') {
                    let path: PathElement = new PathElement();
                    path.data = getPolygonPath((this.shape as BasicShape).points) as string; content = path;
                } else {
                    let basicshape: PathElement = new PathElement();
                    let basicshapedata: string = getBasicShape((this.shape as BasicShape).shape);
                    basicshape.data = basicshapedata; content = basicshape;
                } break;
            case 'Flow':
                let flowshape: PathElement = new PathElement();
                let flowshapedata: string = getFlowShape((this.shape as FlowShape).shape);
                flowshape.data = flowshapedata; content = flowshape;
                break;
            case 'Bpmn':
                if (diagram.bpmnModule) {
                    content = diagram.bpmnModule.initBPMNContent(content, this, diagram);
                    let subProcess: BpmnSubProcessModel = (this.shape as BpmnShape).activity.subProcess;
                    if (subProcess.processes && subProcess.processes.length) {
                        let children: string[] = (this.shape as BpmnShape).activity.subProcess.processes;
                        for (let i of children) {
                            if (diagram.nameTable[i] && (!diagram.nameTable[i].processId || diagram.nameTable[i].processId === this.id)) {
                                diagram.nameTable[i].processId = this.id;
                                if (subProcess.collapsed) {
                                    diagram.updateElementVisibility(
                                        diagram.nameTable[i].wrapper, diagram.nameTable[i], !subProcess.collapsed);
                                }
                                (content as Container).children.push(diagram.nameTable[i].wrapper);
                            }
                        }
                    }
                }
                break;
            case 'Native':
                let nativeContent: DiagramNativeElement = new DiagramNativeElement(this.id, diagram.element.id);
                nativeContent.content = (this.shape as Native).content;
                nativeContent.scale = (this.shape as Native).scale;
                content = nativeContent;
                break;
            case 'HTML':
                let htmlContent: DiagramHtmlElement = new DiagramHtmlElement(this.id, diagram.element.id);
                htmlContent.content = (this.shape as Html).content;
                content = htmlContent;
                break;
        }
        content.id = this.id + '_content'; content.relativeMode = 'Object';
        if (this.width !== undefined) {
            content.width = this.width;
        }
        content.horizontalAlignment = 'Stretch';
        if (this.height !== undefined) {
            content.height = this.height;
        }
        if (this.minHeight !== undefined) {
            content.minHeight = this.minHeight;
        }
        if (this.maxHeight !== undefined) {
            content.maxHeight = this.maxHeight;
        }
        if (this.minWidth !== undefined) {
            content.minWidth = this.minWidth;
        }
        if (this.maxWidth !== undefined) {
            content.maxWidth = this.maxWidth;
        }
        if ((this.shape as BasicShape).shape === 'Rectangle' && !(this.shape as BasicShape).cornerRadius) {
            content.isRectElement = true;
        }
        content.verticalAlignment = 'Stretch';
        if (this.shape instanceof Text) {
            content.margin = this.shape.margin;
        }
        if (canShadow(this as NodeModel)) {
            if ((this.constraints & NodeConstraints.Shadow) !== 0) {
                content.shadow = this.shadow;
            }
        }
        if (this.shape.type !== 'Bpmn' || (this.shape as BpmnShape).shape === 'Message' ||
            (this.shape as BpmnShape).shape === 'DataSource') {
            if (this.shape.type !== 'Text') {
                content.style = this.style;
            }
        }
        return content;
    }
    /* tslint:enable */
    /** @private */
    public initContainer(): Container {
        if (!this.id) {
            this.id = randomId();
        }
        // Creates canvas element
        let canvas: Container = this.children ? new Container() : new Canvas();
        canvas.id = this.id;
        canvas.offsetX = this.offsetX;
        canvas.offsetY = this.offsetY;
        canvas.visible = this.visible;
        canvas.style.fill = this.backgroundColor;
        canvas.style.strokeColor = this.borderColor;
        canvas.style.strokeWidth = this.borderWidth;
        canvas.rotateAngle = this.rotateAngle;
        canvas.minHeight = this.minHeight;
        canvas.minWidth = this.minWidth;
        canvas.maxHeight = this.maxHeight;
        canvas.maxWidth = this.maxWidth;
        canvas.pivot = this.pivot;
        canvas.margin = this.margin as Margin;
        this.wrapper = canvas;
        return canvas;
    }
    /** @private */
    public initPorts(accessibilityContent: Function | string, container: Container): void {
        let canvas: Container = this.wrapper;
        let port: DiagramElement;

        for (let i: number = 0; this.ports !== undefined, i < this.ports.length; i++) {
            port = this.initPortWrapper(this.ports[i] as Port);
            // tslint:disable-next-line:no-any
            let wrapperContent: any;
            let contentAccessibility: Function = getFunction(accessibilityContent);
            if (contentAccessibility) {
                wrapperContent = contentAccessibility(port, this);
            }
            port.description = wrapperContent ? wrapperContent : port.id;
            container.children.push(port);
        }
    }

    private getIconOffet(layout: LayoutModel, icon: IconShape): PointModel {
        let x: number;
        let y: number;
        if (layout.orientation === 'BottomToTop') {
            x = (icon as IconShape).offset.x;
            y = 1 - (icon as IconShape).offset.y;
        } else if (layout.orientation === 'LeftToRight') {
            x = (icon as IconShape).offset.y;
            y = (icon as IconShape).offset.x;
        } else if (layout.orientation === 'RightToLeft') {
            x = 1 - (icon as IconShape).offset.y;
            y = (icon as IconShape).offset.x;
        } else {
            x = (icon as IconShape).offset.x;
            y = (icon as IconShape).offset.y;
        }
        return { x, y };
    }
    /** @private */
    public initIcons(accessibilityContent: Function | string, layout: LayoutModel, container: Container, diagramId: string): void {
        let canvas: Container = this.wrapper;
        let offset: PointModel;
        let icon: IconShapeModel = this.isExpanded ? this.expandIcon : this.collapseIcon;
        if (icon.shape !== 'None') {
            let iconContainer: Canvas = new Canvas();
            iconContainer.float = true;
            let children: DiagramElement[] = [];
            iconContainer.id = this.id + '_icon_content';
            iconContainer.children = children;
            iconContainer.height = icon.height;
            iconContainer.width = icon.width;
            iconContainer.style.strokeColor = 'transparent';
            iconContainer.margin = icon.margin as Margin;
            iconContainer.horizontalAlignment = 'Center';
            iconContainer.verticalAlignment = 'Center';
            iconContainer.visible = this.visible;
            offset = this.getIconOffet(layout, icon as IconShape);
            iconContainer.setOffsetWithRespectToBounds(offset.x, offset.y, 'Fraction');
            iconContainer.relativeMode = 'Point';
            this.initIconSymbol(icon, iconContainer, accessibilityContent, diagramId);
            // tslint:disable-next-line:no-any
            let wrapperContent: any;
            let contentAccessibility: Function = getFunction(accessibilityContent);
            if (contentAccessibility) {
                wrapperContent = contentAccessibility(icon, this);
            }
            iconContainer.description = wrapperContent ? wrapperContent : iconContainer.id;
            container.children.push(iconContainer);
        }
    }

    /** @private */
    public initAnnotations(accessibilityContent: Function | string, container: Container): void {
        let annotation: DiagramElement;
        for (let i: number = 0; this.annotations !== undefined, i < this.annotations.length; i++) {
            annotation = this.initAnnotationWrapper(this.annotations[i] as Annotation);
            // tslint:disable-next-line:no-any
            let wrapperContent: any;
            let contentAccessibility: Function = getFunction(accessibilityContent);
            if (contentAccessibility) {
                wrapperContent = contentAccessibility(annotation, this);
            }
            annotation.description = wrapperContent ? wrapperContent : annotation.id;
            container.children.push(annotation);
        }
    }
    /** @private */
    public initPortWrapper(ports: Port): DiagramElement {
        ports.id = ports.id || randomId();
        // Creates port element
        let portContent: PathElement = new PathElement();
        portContent.height = ports.height;
        portContent.width = ports.width;
        let pathdata: string = (ports.shape === 'Custom') ? ports.pathData : getPortShape(ports.shape);
        portContent.id = this.id + '_' + (ports.id);
        portContent.margin = ports.margin as Margin;
        portContent.data = pathdata;
        let style: ShapeStyleModel = ports.style;
        portContent.style = {
            fill: style.fill, strokeColor: style.strokeColor, gradient: null,
            opacity: style.opacity, strokeDashArray: style.strokeDashArray, strokeWidth: style.strokeWidth
        };
        portContent.horizontalAlignment = ports.horizontalAlignment;
        portContent.verticalAlignment = ports.verticalAlignment;
        portContent.setOffsetWithRespectToBounds((ports as PointPort).offset.x, (ports as PointPort).offset.y, 'Fraction');
        if (this.width !== undefined || this.height !== undefined) {
            portContent.float = true;
        }
        portContent.relativeMode = 'Point';
        portContent.visible = checkPortRestriction(ports, PortVisibility.Visible) &&
            !checkPortRestriction(ports, PortVisibility.Hover) && !checkPortRestriction(ports, PortVisibility.Connect) ? true : false;
        return portContent;
    }
    /** @private */
    public initAnnotationWrapper(annotation: Annotation): DiagramElement {
        annotation.id = annotation.id || randomId();
        let label: ShapeAnnotation = annotation as ShapeAnnotation;
        let annotationcontent: TextElement = new TextElement();
        annotationcontent.constraints = annotation.constraints;
        annotationcontent.height = annotation.height;
        annotationcontent.width = annotation.width;
        annotationcontent.visible = annotation.visibility;
        annotationcontent.rotateAngle = annotation.rotateAngle;
        annotationcontent.id = this.id + '_' + annotation.id;
        let style: TextStyleModel = annotation.style;
        let link: HyperlinkModel = annotation.hyperlink.link ? annotation.hyperlink : undefined;
        annotationcontent.style = {
            fill: style.fill, strokeColor: style.strokeColor, strokeWidth: style.strokeWidth,
            bold: style.bold, textWrapping: style.textWrapping,
            color: link ? link.color || annotationcontent.hyperlink.color : style.color, whiteSpace: style.whiteSpace,
            fontFamily: style.fontFamily, fontSize: style.fontSize, italic: style.italic, gradient: null, opacity: style.opacity,
            strokeDashArray: style.strokeDashArray, textAlign: style.textAlign, textOverflow: annotation.style.textOverflow,
            textDecoration: link ? link.textDecoration || annotationcontent.hyperlink.textDecoration : style.textDecoration,
        };
        annotationcontent.hyperlink.link = annotation.hyperlink.link || undefined;
        annotationcontent.hyperlink.content = annotation.hyperlink.content || undefined;
        annotationcontent.hyperlink.textDecoration = annotation.hyperlink.textDecoration || undefined;
        annotationcontent.content = link ? link.content || annotationcontent.hyperlink.link : annotation.content;
        if (this.width !== undefined) {
            if (annotation.width === undefined || (annotation.width > this.width &&
                (annotation.style.textWrapping === 'Wrap' || annotation.style.textWrapping === 'WrapWithOverflow'))) {
                annotationcontent.width = this.width;
            }
        }
        annotationcontent.margin = annotation.margin;
        annotationcontent.horizontalAlignment = annotation.horizontalAlignment;
        annotationcontent.verticalAlignment = annotation.verticalAlignment;
        annotationcontent.setOffsetWithRespectToBounds(label.offset.x, label.offset.y, 'Fraction');
        if (this.width !== undefined || this.height !== undefined) {
            annotationcontent.float = true;
        }
        annotationcontent.relativeMode = 'Point';
        return annotationcontent;
    }

    private initIconContainer(options: IconShapeModel, iconContainer: Canvas): DiagramElement {
        let rect: DiagramElement = new DiagramElement();
        rect.id = iconContainer.id + '_rect';
        rect.height = options.height;
        rect.width = options.width;
        rect.visible = iconContainer.visible;
        rect.margin = options.margin as Margin;
        rect.cornerRadius = options.cornerRadius;
        rect.style = {
            fill: options.fill, strokeColor: options.borderColor,
            strokeWidth: options.borderWidth
        };
        rect.setOffsetWithRespectToBounds(0.5, 0.5, 'Fraction');
        rect.horizontalAlignment = 'Center';
        rect.verticalAlignment = 'Center';
        rect.relativeMode = 'Object';
        rect.description = rect.description || 'Click here to expand or collapse';
        return rect;
    }

    private initIconSymbol(
        options: IconShapeModel, iconContainer: Canvas, accessibilityContent: Function | string, diagramId: string): void {
        let iconContent: PathElement | DiagramNativeElement;
        iconContainer.children.push(this.initIconContainer(options, iconContainer));
        if (options.shape === 'Template') {
            iconContent = new DiagramNativeElement(this.id, diagramId);
            iconContent.content = options.content;
            iconContent.height = 10;
            iconContent.width = 10;
        } else {
            iconContent = new PathElement();
            iconContent.data = getIconShape(options);
            let iconContentBounds: Rect = measurePath(iconContent.data);
            iconContent.height =
                iconContentBounds.height < 10 ? iconContentBounds.height : 10 - (options.padding.bottom + options.padding.top);
            iconContent.width =
                iconContentBounds.width < 10 ? iconContentBounds.width : 10 - (options.padding.left + options.padding.right);
        }
        iconContent.id = iconContainer.id + '_shape';
        iconContent.horizontalAlignment = 'Center';
        iconContent.verticalAlignment = 'Center';
        iconContent.visible = iconContainer.visible;
        iconContent.visible = iconContainer.visible;
        iconContent.style = {
            fill: 'black', strokeColor: options.borderColor,
            strokeWidth: options.borderWidth
        };
        iconContent.setOffsetWithRespectToBounds(0.5, 0.5, 'Fraction');
        iconContent.relativeMode = 'Object';
        iconContent.description = iconContainer.description || 'Click here to expand or collapse';
        iconContainer.children.push(iconContent);
    }
}
