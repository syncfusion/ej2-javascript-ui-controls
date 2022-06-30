/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable jsdoc/require-param */
/* eslint-disable max-len */
/* eslint-disable valid-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable no-case-declarations */
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path='./node-base-model.d.ts'/>
import { Property, Complex, Collection, ChildProperty, ComplexFactory, isBlazor, extend, cloneNode, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ShapeStyle, Margin, TextStyle, Shadow } from '../core/appearance';
import { ShapeStyleModel, TextStyleModel, ShadowModel} from '../core/appearance-model';
import { Point } from '../primitives/point';
import { Size } from '../primitives/size';
import { PointModel } from '../primitives/point-model';
import { Shapes, BasicShapes, FlowShapes, UmlActivityShapes, Scale, ImageAlignment, Status, ElementAction } from '../enum/enum';
import { IElement } from './interface/IElement';
import { Container } from '../core/containers/container';
import { Canvas } from '../core/containers/canvas';
import { getBasicShape } from './dictionary/basic-shapes';
import { DiagramElement } from '../core/elements/diagram-element';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { ImageElement } from '../core/elements/image-element';
import { DiagramNativeElement } from '../core/elements/native-element';
import { RubberBandSelectionMode, ThumbsConstraints } from '../enum/enum';
import { Port, PointPort } from './port';
import { PointPortModel } from './port-model';
import { SelectorConstraints } from '../enum/enum';
import { Annotation, ShapeAnnotation } from './annotation';
import { ShapeAnnotationModel, HyperlinkModel, PathAnnotationModel } from './annotation-model';
import { getPortShape, getIconShape } from './dictionary/common';
import { getFlowShape } from './dictionary/flow-shapes';
import { HorizontalAlignment, VerticalAlignment, BpmnShapes, BpmnEvents, BpmnTriggers, BpmnGateways, NodeConstraints } from '../enum/enum';
import { BpmnDataObjects, BpmnTasks, BpmnSubProcessTypes, BpmnLoops, BranchTypes } from '../enum/enum';
import { BpmnBoundary, BpmnActivities, UmlScope } from '../enum/enum';
import { MarginModel } from '../core/appearance-model';
import { UmlActivityShapeModel, MethodArgumentsModel, UmlClassModel } from './node-model';
import { BpmnEventModel, BpmnSubEventModel, BpmnAnnotationModel, BpmnActivityModel } from './node-model';
import { BpmnTaskModel, BpmnSubProcessModel, BpmnGatewayModel } from './node-model';
import { ShapeModel, BasicShapeModel, FlowShapeModel, ImageModel, PathModel, BpmnShapeModel, BpmnDataObjectModel } from './node-model';
import { TextModel, NativeModel, HtmlModel, DiagramShapeModel } from './node-model';
import { LayoutModel } from '../layout/layout-base-model';
import { checkPortRestriction, setUMLActivityDefaults, getUMLActivityShapes } from './../utility/diagram-util';
import { updatePortEdges, initfixedUserHandlesSymbol } from './../utility/diagram-util';
import { setSwimLaneDefaults, setPortsEdges } from './../utility/diagram-util';
import { randomId, getFunction, cloneObject } from './../utility/base-util';
import { NodeBase } from './node-base';
import { canShadow } from './../utility/constraints-util';
import { NodeModel, BpmnTransactionSubProcessModel, SwimLaneModel, LaneModel, HeaderModel, PhaseModel } from '../objects/node-model';
import { PortVisibility, Stretch } from '../enum/enum';
import { IconShapeModel } from './icon-model';
import { IconShape } from './icon';
import { measurePath, getContent, getTemplateContent } from './../utility/dom-util';
import { Rect } from '../primitives/rect';
import { getPolygonPath } from './../utility/path-util';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { ChildContainerModel, UmlClassMethodModel, UmlClassAttributeModel, UmlClassifierShapeModel } from './node-model';
import { UmlEnumerationModel, UmlInterfaceModel, UmlEnumerationMemberModel } from './node-model';
import { StackPanel } from '../core/containers/stack-panel';
import { GridPanel, RowDefinition, ColumnDefinition } from '../core/containers/grid';
import { Orientation, ContainerTypes, ClassifierShape } from '../enum/enum';
import { getULMClassifierShapes } from '../utility/uml-util';
import { initSwimLane } from './../utility/swim-lane-util';
import { AnnotationModel } from './annotation-model';
import { ConnectorModel } from './connector-model';
import { Diagram } from '../../diagram/diagram';
import { Connector } from './connector';
import { UserHandleModel } from '../interaction/selector-model';
import { UserHandle } from '../interaction/selector';
import { LayoutInfo } from '../diagram/layoutinfo';
import { LayoutInfoModel } from '../diagram/layoutinfo-model';
import { SymbolSizeModel } from './preview-model';
import { SymbolSize } from './preview';
import { NodeFixedUserHandleModel } from './fixed-user-handle-model';
import { NodeFixedUserHandle } from './fixed-user-handle';

const getShapeType: Function = (obj: Shape): Object => {
    if (obj) {
        if (isBlazor()) {
            return DiagramShape;
        } else {
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
            case 'UmlActivity':
                return UmlActivityShape;
            case 'UmlClassifier':
                return UmlClassifierShape;
            case 'SwimLane':
                return SwimLane;
            default:
                return BasicShape;
            }
        }
    }
    return (isBlazor()) ? DiagramShape : BasicShape;
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
     * * UMLActivity - Sets the type of the node as UMLActivity
     *
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
     *
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
     *
     * @default ''
     */
    @Property('')
    public data: string;

    /**
     * getClassName method \
     *
     * @returns { string } toBounds method .\
     *
     * @private
     */
    public getClassName(): string {
        return 'Path';
    }
}

/**
 * Defines the behavior of Native shape
 */
export class Native extends Shape {
    /**
     * Defines the type of node shape.
     *
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
     *
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
     *
     * @default 'Stretch'
     */
    @Property('Stretch')
    public scale: Stretch;

    /**
     * Returns the name of class Native
     *
     * @private
     */
    public getClassName(): string {
        return 'Native';
    }
}

/**
 * Defines the behavior of html shape
 */
export class Html extends Shape {
    /**
     * Defines the type of node shape.
     *
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
     * content: '<div style='background:red;height:100%;width:100%;'><input type='button' value='{{:value}}' /></div>' }
     * }];
     * let diagram: Diagram = new Diagram({
     * ...
     * nodes: nodes
     * ...
     * });
     * diagram.appendTo('#diagram');
     * ```
     *
     * @default ''
     */
    @Property('')
    public content: string | HTMLElement;

    /**
     * Returns the name of class Html
     *
     * @private
     */
    public getClassName(): string {
        return 'Html';
    }
}

/**
 * Defines the behavior of image shape
 */
export class Image extends Shape {
    /**
     * Defines the type of node shape
     *
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
     *
     * @default ''
     */
    @Property('')
    public source: string;

    /**
     * Allows to stretch the image as you desired (either to maintain proportion or to stretch)
     * * None - Scale value will be set as None for the image
     * * Meet - Scale value Meet will be set for the image
     * * Slice - Scale value Slice will be set for the image
     *
     * @default 'None'
     */
    @Property('None')
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
     *
     * @default 'None'
     */
    @Property('None')
    public align: ImageAlignment;

    /**
     * Returns the name of class Image
     *
     * @private
     */
    public getClassName(): string {
        return 'Image';
    }

}

/**
 * Defines the behavior of the text shape
 */
export class Text extends Shape {
    /**
     * Defines the type of node shape
     *
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
     *
     * @default ''
     */
    @Property('')
    public content: string;

    /**
     * Defines the space to be let between the node and its immediate parent
     *
     * @default 0
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Returns the name of class Text
     *
     * @private
     */
    public getClassName(): string {
        return 'Text';
    }
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
     *
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
     *
     * @default 'Rectangle'
     */
    @Property('Rectangle')
    public shape: BasicShapes;

    /**
     * Sets the corner of the node
     *
     * @default 0
     */
    @Property(0)
    public cornerRadius: number;

    /**
     * Defines the collection of points to draw a polygon
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Collection<PointModel>([], Point)
    public points: PointModel[];

    /**
     * Returns the name of class BasicShape
     *
     * @private
     *
     */
    public getClassName(): string {
        return 'BasicShape';
    }
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
     *
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
     *
     * @default 'Terminator'
     */
    @Property('Terminator')
    public shape: FlowShapes;

    /**
     * Returns the name of class FlowShape
     *
     * @private
     */
    public getClassName(): string {
        return 'FlowShape';
    }
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
     *
     * @default 'None'
     */
    @Property('None')
    public type: BpmnGateways;

    /**
     * Returns the name of class BpmnGateway
     *
     * @private
     */
    public getClassName(): string {
        return 'BpmnGateway';
    }
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
     *
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
     *
     * @default false
     */
    @Property(false)
    public collection: boolean;

    /**
     * Returns the name of class BpmnDataObject
     *
     * @private
     */
    public getClassName(): string {
        return 'BpmnDataObject';
    }
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
     *
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
     *
     * @default 'None'
     */
    @Property('None')
    public loop: BpmnLoops;

    /**
     * Sets whether the task is global or not
     *
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
     *
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
     *
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
     *
     * @default 'Start'
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
     *
     * @default 'None'
     */
    @Property('None')
    public trigger: BpmnTriggers;

    /**
     * Returns the name of class BpmnEvent
     *
     * @private
     */
    public getClassName(): string {
        return 'BpmnEvent';
    }

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
     *
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
     *
     * @default 'Start'
     */
    @Property('Start')
    public event: BpmnEvents;

    /**
     * Sets the id of the BPMN sub event
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Defines the position of the sub event
     *
     * @default new Point(0.5,0.5)
     */

    @Complex<PointModel>({}, Point)
    public offset: PointModel;

    /**
     * Defines the collection of textual annotations of the sub events
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Collection<ShapeAnnotationModel>([], ShapeAnnotation)
    public annotations: ShapeAnnotationModel[];

    /**
     * Defines the collection of connection points of the sub events
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Collection<PointPortModel>([], PointPort)
    public ports: PointPortModel[];

    /**
     * Sets the width of the node
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets the height of the node
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Defines the space to be left between the node and its immediate parent
     *
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
     *
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
     *
     * @default 'Center'
     */
    @Property('Center')
    public verticalAlignment: VerticalAlignment;

    /**
     * Sets the visibility of the sub event
     *
     * @default true
     */
    @Property(true)
    public visible: boolean;

    /**
     * Returns the name of class BpmnSubEvent
     *
     * @private
     */
    public getClassName(): string {
        return 'BpmnSubEvent';
    }
}

/**
 * Defines the behavior of the BpmnTransactionSubProcess
 */
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
     *
     * @default 'None'
     */
    @Property('None')
    public type: BpmnSubProcessTypes;

    /**
     * Defines whether the sub process is without any prescribed order or not
     *
     * @default false
     */
    @Property(false)
    public adhoc: boolean;

    /**
     * Defines the boundary type of the BPMN process
     * * Default - Sets the type of the boundary as Default
     * * Call - Sets the type of the boundary as Call
     * * Event - Sets the type of the boundary as Event
     *
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
     *
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
     *
     * @default 'None'
     */
    @Property('None')
    public loop: BpmnLoops;

    /**
     * Defines the whether the shape is collapsed or not
     *
     * @default true
     */
    @Property(true)
    public collapsed: boolean;

    /**
     * Defines the collection of events of the BPMN sub event
     *
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
     *
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
     *
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
     *
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
     *
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
     *
     * @default 'None'
     */
    @Complex<BpmnSubProcessModel>({}, BpmnSubProcess)
    public subProcess: BpmnSubProcessModel;

    /**
     * Returns the name of class BpmnActivity
     *
     * @private
     */
    public getClassName(): string {
        return 'BpmnActivity';
    }

}

/**
 * Defines the behavior of the bpmn annotation
 *
 */
export class BpmnAnnotation extends ChildProperty<BpmnAnnotation> {
    // tslint:disable-next-line:no-any
    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
    }
    /**
     * Sets the text to annotate the bpmn shape
     *
     * @default ''
     */
    @Property('')
    public text: string;

    /**
     * Sets the id of the BPMN sub event
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Sets the angle between the bpmn shape and the annotation
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property(0)
    public angle: number;

    /**
     * Sets the height of the text
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Sets the width of the text
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets the distance between the bpmn shape and the annotation
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property(0)
    public length: number;

    /** @private */
    public nodeId: string;

    /**
     * @private
     * Returns the name of class BpmnAnnotation
     */
    public getClassName(): string {
        return 'BpmnAnnotation';
    }
}

/**
 * Defines the behavior of the bpmn shape
 */
export class BpmnShape extends Shape {
    /**
     * Defines the type of node shape
     *
     * @default 'Basic'
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
     *
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
     *
     * @default 'None'
     */
    @Complex<BpmnEventModel>({}, BpmnEvent)
    public event: BpmnEventModel;

    /**
     * Defines the type of the BPMN Gateway shape
     *
     * @default 'None'
     */
    @Complex<BpmnGatewayModel>({}, BpmnGateway)
    public gateway: BpmnGatewayModel;

    /**
     * Defines the type of the BPMN DataObject shape
     *
     * @default 'None'
     */
    @Complex<BpmnDataObjectModel>({}, BpmnDataObject)
    public dataObject: BpmnDataObjectModel;

    /**
     * Defines the type of the BPMN Activity shape
     *
     * @default 'None'
     */
    @Complex<BpmnActivityModel>({}, BpmnActivity)
    public activity: BpmnActivityModel;

    /**
     * Defines the text of the bpmn annotation
     *
     * @default 'None'
     */
    @Complex<BpmnAnnotationModel>({}, BpmnAnnotation)
    public annotation: BpmnAnnotationModel;
    /**
     * Defines the text of the bpmn annotation collection
     *
     * @default 'None'
     */

    @Collection<BpmnAnnotationModel>([], BpmnAnnotation)
    public annotations: BpmnAnnotationModel[];

    /**
     * Returns the name of class BpmnShape
     *
     * @private
     */
    public getClassName(): string {
        return 'BpmnShape';
    }

}

/**
 * Defines the behavior of the UMLActivity shape
 */
export class UmlActivityShape extends Shape {
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
     *
     * @default 'Basic'
     */
    @Property('UmlActivity')
    public type: Shapes;
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
     *
     * @default 'Action'
     * @IgnoreSingular
     */
    @Property('Action')
    public shape: UmlActivityShapes;

    /**
     * Returns the name of class UmlActivityShape
     *
     * @private
     */
    public getClassName(): string {
        return 'UmlActivityShape';
    }
}


/**
 * Defines the behavior of the uml class method
 */
export class MethodArguments extends ChildProperty<MethodArguments> {
    /**
     * Defines the name of the attributes
     *
     * @default ''
     * @IgnoreSingular
     */
    @Property('')
    public name: string;
    /**
     * Defines the type of the attributes
     *
     * @default ''
     * @IgnoreSingular
     */
    @Property('')
    public type: string;
    /**
     * Sets the shape style of the node
     *
     * @default new ShapeStyle()
     * @aspType object
     */
    @Complex<ShapeStyleModel | TextStyleModel>({}, TextStyle)
    public style: ShapeStyleModel | TextStyleModel;

    /**
     * Returns the name of class MethodArguments
     *
     * @private
     */
    public getClassName(): string {
        return 'MethodArguments';
    }
}
/**
 * Defines the behavior of the uml class attributes
 */
export class UmlClassAttribute extends MethodArguments {
    /**
     * Defines the type of the attributes
     *
     * @default 'Public'
     * @IgnoreSingular
     */
    @Property('Public')
    public scope: UmlScope;
    /**
     * Defines the separator of the attributes
     *
     * @default false
     * @IgnoreSingular
     */
    @Property(false)
    public isSeparator: boolean;

    /**
     * Returns the name of class UmlClassAttribute
     *
     * @private
     */
    public getClassName(): string {
        return 'UmlClassAttribute';
    }
}

/**
 * Defines the behavior of the uml class method
 */
export class UmlClassMethod extends UmlClassAttribute {
    /**
     * Defines the type of the arguments
     *
     * @default ''
     * @IgnoreSingular
     */

    @Collection<MethodArgumentsModel>([], MethodArguments)
    public parameters: MethodArgumentsModel[];

    /**
     * Returns the name of class UmlClassMethod
     *
     * @private
     */
    public getClassName(): string {
        return 'UmlClassMethod';
    }
}

/**
 * Defines the behavior of the uml class shapes
 */
export class UmlClass extends ChildProperty<UmlClass> {
    /**
     * Defines the name of the attributes
     *
     * @default ''
     * @IgnoreSingular
     */
    @Property('')
    public name: string;
    /**
     * Defines the text of the bpmn annotation collection
     *
     * @default 'None'
     */

    @Collection<UmlClassAttributeModel>([], UmlClassAttribute)
    public attributes: UmlClassAttributeModel[];
    /**
     * Defines the text of the bpmn annotation collection
     *
     * @default 'None'
     */

    @Collection<UmlClassMethodModel>([], UmlClassMethod)
    public methods: UmlClassMethodModel[];

    /**
     * Sets the shape style of the node
     *
     * @default new ShapeStyle()
     * @aspType object
     */
    @Complex<TextStyleModel>({}, TextStyle)
    public style: TextStyleModel;

    /**
     * Returns the name of class UmlClass
     *
     * @private
     */
    public getClassName(): string {
        return 'UmlClass';
    }
}

/**
 * Defines the behavior of the uml interface shapes
 */
export class UmlInterface extends UmlClass {
    /**
     * Defines the separator of the attributes
     *
     * @default false
     * @IgnoreSingular
     */
    @Property(false)
    public isSeparator: boolean;

    /**
     * Returns the name of class UmlInterface
     *
     * @private
     */
    public getClassName(): string {
        return 'UmlInterface';
    }
}

/**
 * Defines the behavior of the uml interface shapes
 */
export class UmlEnumerationMember extends ChildProperty<UmlEnumerationMember> {
    /**
     * Defines the value of the member
     *
     * @default ''
     * @IgnoreSingular
     */
    @Property('')
    public name: string;
    /**
     * Defines the value of the member
     *
     * @default ''
     * @IgnoreSingular
     */
    @Property('')
    public value: string;
    /**
     * Defines the separator of the attributes
     *
     * @default false
     * @IgnoreSingular
     */
    @Property(false)
    public isSeparator: boolean;
    /**
     * Sets the shape style of the node
     *
     * @default new ShapeStyle()
     * @aspType object
     */
    @Complex<ShapeStyleModel | TextStyleModel>({}, TextStyle)
    public style: ShapeStyleModel | TextStyleModel;

    /**
     * Returns the name of class UmlEnumerationMember
     *
     * @private
     */
    public getClassName(): string {
        return 'UmlEnumerationMember';
    }
}

/**
 * Defines the behavior of the uml interface shapes
 */
export class UmlEnumeration extends ChildProperty<UmlEnumeration> {
    /**
     * Defines the name of the attributes
     *
     * @default ''
     * @IgnoreSingular
     */
    @Property('')
    public name: string;
    /**
     * Defines the text of the bpmn annotation collection
     *
     * @default 'None'
     */

    @Collection<UmlEnumerationMemberModel>([], UmlEnumerationMember)
    public members: UmlEnumerationMemberModel[];
    /**
     * Sets the shape style of the node
     *
     * @default new ShapeStyle()
     * @aspType object
     */
    @Complex<ShapeStyleModel | TextStyleModel>({}, TextStyle)
    public style: ShapeStyleModel | TextStyleModel;

    /**
     * Returns the name of class UmlEnumeration
     *
     * @private
     */
    public getClassName(): string {
        return 'UmlEnumeration';
    }
}

/**
 * Defines the behavior of the UMLActivity shape
 */
export class UmlClassifierShape extends Shape {
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
     *
     * @default 'Basic'
     */
    @Property('UmlClassifier')
    public type: Shapes;

    /**
     * Defines the text of the bpmn annotation collection
     *
     * @default 'None'
     */
    @Complex<UmlClassModel>({} as UmlClass, UmlClass)
    public classShape: UmlClassModel;
    /**
     * Defines the text of the bpmn annotation collection
     *
     * @default 'None'
     */
    @Complex<UmlInterfaceModel>({} as UmlInterface, UmlInterface)
    public interfaceShape: UmlInterfaceModel;
    /**
     * Defines the text of the bpmn annotation collection
     *
     * @default 'None'
     */
    @Complex<UmlEnumerationModel>({} as UmlEnumeration, UmlEnumeration)
    public enumerationShape: UmlEnumerationModel;
    /**
     * Defines the type of classifier
     *
     * @default 'Class'
     * @IgnoreSingular
     */
    @Property('Class')
    public classifier: ClassifierShape;

    /**
     * Returns the name of class UmlClassifierShape
     *
     * @private
     */
    public getClassName(): string {
        return 'UmlClassifierShape';
    }
}

/* tslint:disable */
/**
 * Defines the behavior of the UMLActivity shape
 */
export class DiagramShape extends ChildProperty<DiagramShape> {
    /**
     * Defines the type of node shape
     *
     */
    @Property('Basic')
    public type: Shapes;

    /**
     * Defines the type of the basic shape
     *
     */
    @Property('Rectangle')
    public basicShape: BasicShapes;

    /**
     * Defines the type of the flow shape
     */
    @Property('Terminator')
    public flowShape: FlowShapes;

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
     *
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
     *
     * @default 'Event'
     */
    @Property('Event')
    public bpmnShape: BpmnShapes;

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
     *
     * @default 'Action'
     * @IgnoreSingular
     */
    @Property('Action')
    public umlActivityShape: UmlActivityShapes;

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
     *
     * @default ''
     */
    @Property('')
    public data: string;

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
     *
     * @default ''
     */
    @Property('')
    public content: SVGElement | HTMLElement;

    /**
     * Defines the text of the text element
     */
    @Property('')
    public textContent: string;

    /**
     * Defines the scale of the native element.
     * * None - Sets the stretch type for diagram as None
     * * Stretch - Sets the stretch type for diagram as Stretch
     * * Meet - Sets the stretch type for diagram as Meet
     * * Slice - Sets the stretch type for diagram as Slice
     *
     * @default 'Stretch'
     */
    @Property('Stretch')
    public scale: Stretch;

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
     *
     * @default ''
     */
    @Property('')
    public source: string;

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
     *
     * @default 'None'
     */
    @Property('None')
    public align: ImageAlignment;

    /**
     * Defines the space to be let between the node and its immediate parent
     *
     * @default 0
     */
    @Complex<MarginModel>({}, Margin)
    public margin: MarginModel;

    /**
     * Sets the corner of the node
     *
     * @default 0
     */
    @Property(0)
    public cornerRadius: number;

    /**
     * Defines the collection of points to draw a polygon
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Collection<PointModel>([], Point)
    public points: PointModel[];

    /**
     * Defines the type of the BPMN DataObject shape
     *
     * @default 'None'
     */
    @Complex<BpmnDataObjectModel>({}, BpmnDataObject)
    public dataObject: BpmnDataObjectModel;

    /**
     * Defines the type of the BPMN Event shape
     *
     * @default 'None'
     */
    @Complex<BpmnEventModel>({}, BpmnEvent)
    public event: BpmnEventModel;

    /**
     * Defines the type of the BPMN Gateway shape
     *
     * @default 'None'
     */
    @Complex<BpmnGatewayModel>({}, BpmnGateway)
    public gateway: BpmnGatewayModel;

    /**
     * Defines the text of the bpmn annotation collection
     *
     * @default 'None'
     */

    @Collection<BpmnAnnotationModel>([], BpmnAnnotation)
    public annotations: BpmnAnnotationModel[];

    /**
     * Defines the type of the BPMN Activity shape
     *
     * @default 'None'
     */
    @Complex<BpmnActivityModel>({}, BpmnActivity)
    public activity: BpmnActivityModel;

    /**
     * Defines the text of the bpmn annotation
     *
     * @default 'None'
     */
    @Complex<BpmnAnnotationModel>({}, BpmnAnnotation)
    public annotation: BpmnAnnotationModel;

    /**
     * Defines the text of the bpmn annotation collection
     *
     * @default 'None'
     */
    @Complex<UmlEnumerationModel>({} as UmlEnumeration, UmlEnumeration)
    public enumerationShape: UmlEnumerationModel;
    /**
     * Defines the type of classifier
     *
     * @default 'Class'
     * @IgnoreSingular
     */
    @Property('Class')
    public classifier: ClassifierShape;

    /**
     * Defines the text of the bpmn annotation collection
     *
     * @default 'None'
     */
    @Complex<UmlClassModel>({} as UmlClass, UmlClass)
    public classShape: UmlClassModel;
    /**
     * Defines the text of the bpmn annotation collection
     *
     * @default 'None'
     */
    @Complex<UmlInterfaceModel>({} as UmlInterface, UmlInterface)
    public interfaceShape: UmlInterfaceModel;

    /**
     * Returns the name of class UmlClassifierShape
     *
     * @private
     */
    public getClassName(): string {
        return 'DiagramShape';
    }
}

/* tslint:enable */

/**
 * Defines the behavior of nodes
 */
export class Node extends NodeBase implements IElement {

    /**
     * Defines the collection of textual annotations of nodes/connectors
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Collection<ShapeAnnotationModel>([], ShapeAnnotation)
    public annotations: ShapeAnnotationModel[];

    /**
     * Sets the x-coordinate of the position of the node
     *
     * @default 0
     */
    @Property(0)
    public offsetX: number;

    /**
     * Sets the layout properties using node property
     *
     * @default new NodeLayoutInfo()
     * @aspType object
     */
    @Complex<LayoutInfoModel>({}, LayoutInfo)
    public layoutInfo: LayoutInfo;

    /**
     * Sets the y-coordinate of the position of the node
     *
     * @default 0
     */
    @Property(0)
    public offsetY: number;

    /**
     * Defines the collection of connection points of nodes/connectors
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Collection<PointPortModel>([], PointPort)
    public ports: PointPortModel[];

    /**
     * Defines whether the node is expanded or not
     *
     * @default true
     */
    @Property(true)
    public isExpanded: boolean;

    /**
     * Specifies the collection of the fixed user handle
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Collection<NodeFixedUserHandleModel>([], NodeFixedUserHandle)
    public fixedUserHandles: NodeFixedUserHandleModel[];

    /**
     * Defines the expanded state of a node
     *
     * @default {}
     */
    @Complex<IconShapeModel>({}, IconShape)
    public expandIcon: IconShapeModel;

    /**
     * Defines the collapsed state of a node
     *
     * @default {}
     */
    @Complex<IconShapeModel>({}, IconShape)
    public collapseIcon: IconShapeModel;


    /**
     * Sets the reference point, that will act as the offset values(offsetX, offsetY) of a node
     *
     * @default new Point(0.5,0.5)
     */
    @Complex<PointModel>({ x: 0.5, y: 0.5 }, Point)
    public pivot: PointModel;

    /**
     * Sets the width of the node
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets the height of the node
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Sets the minimum width of the node
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public minWidth: number;

    /**
     * Sets the minimum height of the node
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public minHeight: number;

    /**
     * Sets the maximum width of the node
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public maxWidth: number;

    /**
     * Sets the maximum height of the node
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public maxHeight: number;

    /**
     * Sets the rotate angle of the node
     *
     * @default 0
     */
    @Property(0)
    public rotateAngle: number;

    /**
     * Sets the shape style of the node
     *
     * @default new ShapeStyle()
     * @aspType object
     */
    @Complex<ShapeStyleModel | TextStyleModel>({ fill: 'white' }, TextStyle)
    public style: ShapeStyleModel | TextStyleModel;

    /**
     * Sets the background color of the shape
     *
     * @default 'transparent'
     */
    @Property('transparent')
    public backgroundColor: string;
    /**
     * Sets the border color of the node
     *
     * @deprecated
     * @default 'none'
     */
    @Property('none')
    public borderColor: string;

    /**
     * Sets the border width of the node
     *
     * @deprecated
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
     *
     * @default Basic Shape
     * @aspType object
     */
    @ComplexFactory(getShapeType)
    public shape: ShapeModel | FlowShapeModel | BasicShapeModel | ImageModel | PathModel | TextModel | BpmnShapeModel | NativeModel | HtmlModel | UmlActivityShapeModel | UmlClassifierShapeModel | SwimLaneModel | DiagramShapeModel;
    /* tslint:enable */

    /**
     * Defines the size of the symbol preview
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Complex<SymbolSizeModel>({}, SymbolSize)
    public previewSize: SymbolSizeModel;

    /**
     * Defines the size of a drop symbol
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Complex<SymbolSizeModel>({}, SymbolSize)
    public dragSize: SymbolSizeModel;

    /**
     * Sets or gets the UI of a node
     *
     * @default null
     * @deprecated
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
     *
     * @default 'Default'
     * @aspNumberEnum
     */
    @Property(NodeConstraints.Default)
    public constraints: NodeConstraints;

    /**
     * Defines the shadow of a shape/path
     *
     * @default null
     */
    @Complex<ShadowModel>({}, Shadow)
    public shadow: ShadowModel;

    /**
     * Defines the children of group element
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public children: string[];

     /**
     * Defines the space between the group node edges and its children
     *
     * @aspDefaultValueIgnore
     * @default 0
     */
      @Complex<MarginModel>({ left: 0, right: 0, top: 0, bottom: 0 }, Margin)
      public padding: MarginModel;

    /**
     * Defines the type of the container
     *
     * @aspDefaultValueIgnore
     * @default null
     * @deprecated
     */

    @Property(null)
    public container: ChildContainerModel;

    /**
     * Sets the horizontalAlignment of the node
     *
     * @default 'Stretch'
     */
    @Property('Left')
    public horizontalAlignment: HorizontalAlignment;
    /**
     * Sets the verticalAlignment of the node
     *
     * @default 'Stretch'
     */
    @Property('Top')
    public verticalAlignment: VerticalAlignment;
    /**
     * Used to define the rows for the grid container
     *
     * @aspDefaultValueIgnore
     * @deprecated
     * @default undefined
     */

    @Property()
    public rows: RowDefinition[];

    /**
     * Used to define the column for the grid container
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */

    @Property()
    public columns: ColumnDefinition[];

    /**
     * Used to define a index of row in the grid
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */

    @Property()
    public rowIndex: number;

    /**
     * Used to define a index of column in the grid
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */

    @Property()
    public columnIndex: number;

    /**
     * Merge the row use the property in the grid container
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public rowSpan: number;

    /**
     * Merge the column use the property in the grid container
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public columnSpan: number;

    /**
     * Set the branch for the mind map
     *
     * @aspDefaultValueIgnore
     * @default ''
     */
    @Property('')
    public branch: BranchTypes;

    // Used to maintain the old property of gradient value
    /** @private */
    public oldGradientValue: Object;

    /** @private */
    public isCanvasUpdate: boolean = false;
    /** @private */
    public status: Status = 'None';
    /** @private */
    public parentId: string = '';
    /** @private */
    public processId: string = '';
    /** @private */
    public umlIndex: number = -1;
    /** @private */
    public outEdges: string[] = [];
    /** @private */
    public inEdges: string[] = [];
    /** @private */
    public isHeader: boolean = false;
    /** @private */
    public isLane: boolean = false;
    /** @private */
    public isPhase: boolean = false;
    /** @private */
    public get actualSize(): Size {
        if (this.wrapper !== null) {
            return this.wrapper.actualSize;
        } else {
            return new Size(this.width || 0, this.height || 0);
        }
    }


    constructor(parent: any, propName: string, defaultValue: Object, isArray?: boolean) {
        super(parent, propName, defaultValue, isArray);
        let nodeDefault: NodeModel;
        if (this.children && this.children.length > 0) {
            nodeDefault = defaultValue;
            if (!nodeDefault.style || !nodeDefault.style.fill) {
                this.style.fill = 'transparent';
            }
            if (!nodeDefault.style || !nodeDefault.style.strokeColor) {
                this.style.strokeColor = 'transparent';
            }
        }
        if (this.shape && this.shape.type === 'UmlActivity') {
            setUMLActivityDefaults(defaultValue, this);
        }
        if (this.shape && this.shape.type === 'SwimLane') {
            setSwimLaneDefaults(defaultValue, this);
        }
        if (this.ports && this.ports.length) {
            setPortsEdges(this);
        }
    }

    /**
     * Allows to initialize the UI of a node
     */
    /** @private */
    /* tslint:disable */
    // tslint:disable-next-line:no-any
    public init(diagram: any): DiagramElement {
        let content: DiagramElement | GridPanel;
        if (this.shape.type !== 'SwimLane') {
            content = new DiagramElement();
        } else {
            content = new GridPanel();
        }
        let textStyle: TextStyle;
        const changedProperties: string = 'changedProperties';
        const oldProperties: string = 'oldProperties';
        this.shape[changedProperties] = {};
        this.shape[oldProperties] = {};

        switch (this.shape.type) {
        case 'Path':
            const pathContent: PathElement = new PathElement();
            pathContent.data = (this.shape as Path).data;
            content = pathContent; break;
        case 'Image':
            const imageContent: ImageElement = new ImageElement();
            imageContent.source = (this.shape as Image).source;
            imageContent.imageAlign = (this.shape as Image).align;
            imageContent.imageScale = (this.shape as Image).scale; content = imageContent; break;
        case 'Text':
            const textContent: TextElement = new TextElement();
            textContent.content = (isBlazor() ? (this.shape as DiagramShape).textContent : (this.shape as Text).content);
            content = textContent; textStyle = this.style as TextStyle;
            content.style = textStyle; break;
        case 'Basic':
            if ((!isBlazor() && (this.shape as BasicShape).shape === 'Rectangle') || (isBlazor() && (this.shape as DiagramShape).basicShape === 'Rectangle')) {
                const basicshape: DiagramElement = new DiagramElement();
                content = basicshape;
                content.cornerRadius = (this.shape as BasicShape).cornerRadius;
            } else if ((!isBlazor() && (this.shape as BasicShape).shape === 'Polygon') || (isBlazor() && (this.shape as DiagramShape).basicShape === 'Polygon')) {
                const path: PathElement = new PathElement();
                path.data = getPolygonPath((this.shape as BasicShape).points) as string; content = path;
            } else {
                const basicshape: PathElement = new PathElement();
                const basicshapedata: string = getBasicShape((isBlazor()) ? (this.shape as DiagramShape).basicShape : (this.shape as BasicShape).shape);
                basicshape.data = basicshapedata; content = basicshape;
            } break;
        case 'Flow':
            const flowshape: PathElement = new PathElement();
            const flowshapedata: string = getFlowShape((isBlazor() ? (this.shape as DiagramShape).flowShape : (this.shape as FlowShape).shape));
            flowshape.data = flowshapedata; content = flowshape;
            break;
        case 'UmlActivity':
            const umlactivityshape: PathElement = new PathElement();
            content = getUMLActivityShapes(umlactivityshape, content, this);
            break;
        case 'Bpmn':
            if (diagram.bpmnModule) {
                content = diagram.bpmnModule.initBPMNContent(content, this, diagram);
                this.wrapper.elementActions = this.wrapper.elementActions | ElementAction.ElementIsGroup;
                const subProcess: BpmnSubProcessModel = (this.shape as BpmnShape).activity.subProcess;
                if (subProcess.processes && subProcess.processes.length) {
                    const children: string[] = (this.shape as BpmnShape).activity.subProcess.processes;
                    for (const i of children) {
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
            const nativeContent: DiagramNativeElement = new DiagramNativeElement(this.id, diagram.element.id);
            nativeContent.content = (this.shape as Native).content;
            nativeContent.scale = (this.shape as Native).scale;
            content = nativeContent;
            break;
        case 'HTML':
            const htmlContent: DiagramHtmlElement = new DiagramHtmlElement(this.id, diagram.element.id, undefined, diagram.nodeTemplate);
            if ((this.shape as Html).content) {
                htmlContent.content = (this.shape as Html).content;
            } else if (diagram.nodeTemplate) {
                htmlContent.isTemplate = true;
                htmlContent.template = htmlContent.content = getContent(htmlContent, true, this) as HTMLElement;
            }
            content = htmlContent;
            break;
        case 'UmlClassifier':
            //   let umlClassifierShape: StackPanel = new StackPanel();
            content = getULMClassifierShapes(content, this, diagram);
            break;
        case 'SwimLane':
            this.annotations = [];
            this.ports = [];
            (content as GridPanel).cellStyle.fill = 'none';
            (content as GridPanel).cellStyle.strokeColor = 'none';
            this.container = { type: 'Grid', orientation: (this.shape as SwimLaneModel).orientation };
            content.id = this.id;
            this.container.orientation = (this.shape as SwimLaneModel).orientation;
            this.constraints |= NodeConstraints.HideThumbs;
            initSwimLane(content as GridPanel, diagram, this);
            break;
        }
        content.id = this.id + '_content'; content.relativeMode = 'Object';
            // (EJ2-56444) - Added the below code to check whether node shape type is basic and shape is rectangle.
        // This code added due to while render radial gradient in canvas mode we want to check this type and pass args according to that
        if(this.shape.type === "Basic" && (this.shape as BasicShape).shape === 'Rectangle') {
            content.shapeType = "Rectangle";
        } else {
            content.shapeType = "Others";
        }
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
        if ((!isBlazor() && (this.shape as BasicShape).shape === 'Rectangle' && !(this.shape as BasicShape).cornerRadius) ||
            ((isBlazor()) && ((this.shape as DiagramShape).basicShape === 'Rectangle'
                && this.shape.type === 'Basic' && !(this.shape as DiagramShape).cornerRadius))) {
            content.isRectElement = true;
        }
        content.verticalAlignment = 'Stretch';
        if ((this.shape instanceof Text) || (isBlazor() && this.shape.type === 'Text')) {
            content.margin = (this.shape as Text).margin;
        }
        if (canShadow(this as NodeModel)) {
            if ((this.constraints & NodeConstraints.Shadow) !== 0) {
                content.shadow = this.shadow;
            }
        }
        if ((this.shape.type !== 'Bpmn' || ((!isBlazor() && (this.shape as BpmnShape).shape === 'Message') || (isBlazor() && (this.shape as DiagramShape).bpmnShape === 'Message')) ||
            ((!isBlazor() && (this.shape as BpmnShape).shape === 'DataSource') || (isBlazor() && (this.shape as DiagramShape).bpmnShape === 'DataSource'))) && (
            (this.shape.type !== 'UmlActivity' || ((!isBlazor() && (this.shape as UmlActivityShape).shape !== 'FinalNode') ||
                    (isBlazor() && (this.shape as DiagramShape).umlActivityShape !== 'FinalNode'))))) {
            if (this.shape.type !== 'Text') {
                content.style = this.style;
                this.oldGradientValue = (this.style.gradient) ? cloneObject(this.style.gradient) : null;
            }
        }
        if (!(this.wrapper.elementActions & ElementAction.ElementIsGroup) && this.flip === 'Horizontal' || this.flip === 'Vertical') {
            content.flip = this.flip;
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
        let canvas: Container;
        if (!this.container || this.shape instanceof SwimLane) {
            canvas = this.children ? new Container() : new Canvas();
        } else {
            switch (this.container.type) {
            case 'Canvas':
                canvas = new Canvas();
                break;
            case 'Stack':
                canvas = new StackPanel();
                break;
            case 'Grid':
                canvas = new GridPanel();
                (canvas as GridPanel).setDefinitions(this.rows, this.columns);
                break;
            }
        }

        canvas.id = this.id;
        canvas.offsetX = this.offsetX;
        canvas.offsetY = this.offsetY;
        canvas.visible = this.visible;
        canvas.horizontalAlignment = this.horizontalAlignment;
        canvas.verticalAlignment = this.verticalAlignment;
        if (this.container) {
            canvas.width = this.width;
            canvas.height = this.height;
            if (this.container.type === 'Stack') {
                (canvas as ChildContainerModel).orientation = this.container.orientation;
            }
        }
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
        canvas.flip = this.flip;
        this.wrapper = canvas;
        return canvas;
    }

    /** @private */
    public initPorts(accessibilityContent: Function | string, container: Container): void {
        for (let i: number = 0; this.ports !== undefined, i < this.ports.length; i++) {
            this.initPort(accessibilityContent, container, this.ports[i] as Port);
        }
    }

    /** @private */
    public initPort(accessibilityContent: Function | string, container: Container, port: Port) : void {
        const canvas: Container = this.wrapper;
        let portWrapper: DiagramElement;
        // eslint-disable-next-line prefer-const
        portWrapper = this.initPortWrapper(port, this);
        // tslint:disable-next-line:no-any
        let wrapperContent: any;
        const contentAccessibility: Function = getFunction(accessibilityContent);
        if (contentAccessibility) {
            wrapperContent = contentAccessibility(portWrapper, this);
        }
        portWrapper.description = wrapperContent ? wrapperContent : portWrapper.id;
        portWrapper.inversedAlignment = canvas.inversedAlignment;
        portWrapper.elementActions = portWrapper.elementActions | ElementAction.ElementIsPort;
        container.children.push(portWrapper);
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
        const canvas: Container = this.wrapper;
        let offset: PointModel;
        const icon: IconShapeModel = this.isExpanded ? this.expandIcon : this.collapseIcon;
        if (icon.shape !== 'None') {
            const iconContainer: Canvas = new Canvas();
            iconContainer.float = true;
            const children: DiagramElement[] = [];
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
            const contentAccessibility: Function = getFunction(accessibilityContent);
            if (contentAccessibility) {
                wrapperContent = contentAccessibility(icon, this);
            }
            iconContainer.description = wrapperContent ? wrapperContent : iconContainer.id;
            iconContainer.inversedAlignment = canvas.inversedAlignment;
            container.children.push(iconContainer);
        }
    }

    /** @private */
    public initfixedUserHandles(fixedUserHandle: NodeFixedUserHandleModel): DiagramElement {
        const canvas: Container = this.wrapper;
        //let fixedUserHandleContainer: Canvas;
        const fixedUserHandleContainer: Canvas = new Canvas();
        fixedUserHandleContainer.float = true;
        const children: DiagramElement[] = [];
        fixedUserHandle.id = fixedUserHandle.id || randomId();
        fixedUserHandleContainer.id = this.id + '_' + fixedUserHandle.id;
        fixedUserHandleContainer.children = children;
        fixedUserHandleContainer.height = fixedUserHandle.height;
        fixedUserHandleContainer.width = fixedUserHandle.width;
        fixedUserHandleContainer.style.strokeColor = fixedUserHandle.handleStrokeColor;
        fixedUserHandleContainer.style.fill = fixedUserHandle.fill;
        fixedUserHandleContainer.style.strokeWidth = fixedUserHandle.handleStrokeWidth;
        fixedUserHandleContainer.margin = fixedUserHandle.margin as Margin;
        fixedUserHandleContainer.visible = fixedUserHandle.visibility;
        fixedUserHandleContainer.cornerRadius = fixedUserHandle.cornerRadius;
        fixedUserHandleContainer.horizontalAlignment = 'Center';
        fixedUserHandleContainer.verticalAlignment = 'Center';
        const offset: PointModel = this.getfixedUserHandleOffet(fixedUserHandle as NodeFixedUserHandle);
        fixedUserHandleContainer.setOffsetWithRespectToBounds(offset.x, offset.y, 'Fraction');
        fixedUserHandleContainer.relativeMode = 'Point';
        const symbolIcon: DiagramElement = initfixedUserHandlesSymbol(fixedUserHandle, fixedUserHandleContainer);
        fixedUserHandleContainer.children.push(symbolIcon);
        fixedUserHandleContainer.description = fixedUserHandleContainer.id;
        fixedUserHandleContainer.inversedAlignment = canvas.inversedAlignment;
        return fixedUserHandleContainer;
    }
    private getfixedUserHandleOffet(fixedUserHandle: NodeFixedUserHandle): PointModel {
        //let x: number;
        //let y: number;
        const x: number = (fixedUserHandle as NodeFixedUserHandle).offset.x;
        const y: number = (fixedUserHandle as NodeFixedUserHandle).offset.y;
        return { x, y };
    }

    /** @private */
    public initAnnotations(
        accessibilityContent: Function | string, container: Container, diagramId: string, virtualize?: boolean, annotationTemplate?: string)
        :
        void {
        let annotation: DiagramElement;
        for (let i: number = 0; this.annotations !== undefined, i < this.annotations.length; i++) {
            annotation = this.initAnnotationWrapper(this.annotations[i] as Annotation, diagramId, virtualize, i, annotationTemplate);
            // tslint:disable-next-line:no-any
            let wrapperContent: any;
            const contentAccessibility: Function = getFunction(accessibilityContent);
            if (contentAccessibility) {
                wrapperContent = contentAccessibility(annotation, this);
            }
            annotation.description = wrapperContent ? wrapperContent : annotation.id;
            annotation.inversedAlignment = container.inversedAlignment;
            container.children.push(annotation);
        }
    }
    /** @private */
    public initPortWrapper(ports: Port, Node?: NodeModel): DiagramElement {
        ports.id = ports.id || randomId();
        // Creates port element
        let portContent: PathElement = new PathElement();
        portContent.height = ports.height;
        portContent.width = ports.width;
        const pathdata: string = (ports.shape === 'Custom') ? ports.pathData : getPortShape(ports.shape);
        portContent.id = this.id + '_' + (ports.id);
        portContent.margin = ports.margin as Margin;
        portContent.data = pathdata;
        const style: ShapeStyleModel = ports.style;
        portContent.style = {
            fill: style.fill, strokeColor: style.strokeColor, gradient: null,
            opacity: style.opacity, strokeDashArray: style.strokeDashArray, strokeWidth: style.strokeWidth
        };
        portContent.horizontalAlignment = ports.horizontalAlignment;
        portContent.verticalAlignment = ports.verticalAlignment;
        if (Node && Node.flipMode !== 'Label' && Node.flipMode !== 'None') {
            portContent = updatePortEdges(portContent, this.flip, ports);
        } else {
            portContent = updatePortEdges(portContent, 'None', ports);
        }
        if (this.width !== undefined || this.height !== undefined) {
            portContent.float = true;
        }
        portContent.relativeMode = 'Point';
        portContent.visible = checkPortRestriction(ports, PortVisibility.Visible) &&
            !checkPortRestriction(ports, PortVisibility.Hover) && !checkPortRestriction(ports, PortVisibility.Connect) ? true : false;
        portContent.elementActions = portContent.elementActions | ElementAction.ElementIsPort;
        return portContent;
    }
    /** @private */
    public initAnnotationWrapper(
        annotation: Annotation, diagramId?: string, virtualize?: boolean,
        value?: number, annotationTemplate?: string | Function)
        :
        DiagramElement {
        annotation.id = annotation.id || value + 'annotation' || randomId();
        const label: ShapeAnnotation = annotation as ShapeAnnotation;
        let annotationcontent: TextElement | DiagramHtmlElement;
        if (isBlazor() && annotation.annotationType === 'Template') {
            annotation.template = annotation.template ? annotation.template : '';
        }
        if (diagramId && (annotation.template || annotation.annotationType === 'Template'
            || (annotationTemplate && annotation.content === ''))) {
            annotationcontent = new DiagramHtmlElement(this.id, diagramId, annotation.id, (annotationTemplate as string));
            annotationcontent = getTemplateContent(annotationcontent, annotation, annotationTemplate);
        } else {
            annotationcontent = new TextElement();
            (annotationcontent as TextElement).canMeasure = !virtualize;
            const style: TextStyleModel = annotation.style;
            const link: HyperlinkModel = annotation.hyperlink.link ? annotation.hyperlink : undefined;
            (annotationcontent as TextElement).style = {
                fill: style.fill, strokeColor: style.strokeColor, strokeWidth: style.strokeWidth,
                bold: style.bold, textWrapping: style.textWrapping,
                color: link ? link.color || (annotationcontent as TextElement).hyperlink.color : style.color, whiteSpace: style.whiteSpace,
                fontFamily: style.fontFamily, fontSize: style.fontSize, italic: style.italic, gradient: null, opacity: style.opacity,
                strokeDashArray: style.strokeDashArray, textAlign: style.textAlign, textOverflow: annotation.style.textOverflow,
                textDecoration: link ? link.textDecoration ||
                    (annotationcontent as TextElement).hyperlink.textDecoration : style.textDecoration
            };
            (annotationcontent as TextElement).hyperlink.link = annotation.hyperlink.link || undefined;
            (annotationcontent as TextElement).hyperlink.hyperlinkOpenState = annotation.hyperlink.hyperlinkOpenState || undefined;
            (annotationcontent as TextElement).hyperlink.content = annotation.hyperlink.content || undefined;
            (annotationcontent as TextElement).hyperlink.textDecoration = annotation.hyperlink.textDecoration || undefined;
            (annotationcontent as TextElement).content = link ? link.content ||
                (annotationcontent as TextElement).hyperlink.link : annotation.content;
        }
        annotationcontent.constraints = annotation.constraints;
        annotationcontent.height = annotation.height;
        annotationcontent.width = annotation.width;
        annotationcontent.visible = annotation.visibility;
        annotationcontent.rotateAngle = annotation.rotateAngle;
        annotationcontent.id = this.id + '_' + annotation.id;
        if (this.width !== undefined && !annotation.template) {
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
        const rect: DiagramElement = new DiagramElement();
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
            const iconContentBounds: Rect = measurePath(iconContent.data);
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

    /**
     * @private
     *
     * Returns the name of class Node
     */
    public getClassName(): string {
        return 'Node';
    }
}

/**
 * Defines the behavior of header in swimLane
 */
export class Header extends ChildProperty<Shape> {

    /**
     * Sets the id of the header
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Sets the content of the header
     *
     * @default ''
     */
    @Complex<AnnotationModel>({}, Annotation)
    public annotation: AnnotationModel;

    /**
     * Sets the style of the header
     *
     * @default ''
     */
    @Complex<ShapeStyleModel>({ fill: '#E7F4FF', strokeColor: '#CCCCCC' }, ShapeStyle)
    public style: TextStyleModel;

    /**
     * Sets the height of the header
     *
     * @default 50
     */
    @Property(50)
    public height: number;

    /**
     * Sets the width of the header
     *
     * @default 50
     */
    @Property(50)
    public width: number;

}

/**
 * Defines the behavior of lane in swimLane
 */
export class Lane extends ChildProperty<Shape> {

    /**
     * Sets the id of the lane
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Sets style of the lane
     *
     * @default ''
     */
    @Complex<ShapeStyleModel>({ fill: '#F9F9F9', strokeColor: '#CCCCCC' }, ShapeStyle)
    public style: ShapeStyleModel;

    /**
     * Defines the collection of child nodes
     *
     * @default []
     */
    @Collection<NodeModel>([], Node)
    public children: NodeModel[];

    /**
     * Defines the height of the lane
     *
     * @default 100
     */
    @Property(100)
    public height: number;

    /**
     * Defines the height of the lane
     *
     * @default 100
     */
    @Property(100)
    public width: number;

    /**
     * Defines the collection of header in the lane.
     *
     * @default new Header()
     */
    @Complex<HeaderModel>({ style: { fill: '#E7F4FF', strokeColor: '#CCCCCC' }, annotation: { content: 'Function' } as Annotation }, Header)
    public header: HeaderModel;

    /**
     * Defines when the lane to be interchanged or not
     *
     * @default true
     */
    @Property(true)
    public canMove: boolean;

    /**
     * Allows the user to save custom information about lanes. Example: addInfo: {'lane': 'lane 1 info' }
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public addInfo: Object 

    /**
     * Returns the name of class Lane
     *
     * @private
     */
    public getClassName(): string {
        return 'Lane';
    }

}

/**
 * Defines the behavior of phase in swimLane
 */
export class Phase extends ChildProperty<Shape> {
    /**
     * Sets the id of the phase
     *
     * @default ''
     */
    @Property('')
    public id: string;

    /**
     * Sets the style of the phase
     *
     * @default ''
     */
    @Complex<ShapeStyleModel>({ strokeColor: '#CCCCCC' }, ShapeStyle)
    public style: ShapeStyleModel;

    /**
     * Sets the header collection of the phase
     *
     * @default  new Header()
     */
    @Complex<HeaderModel>({ annotation: { content: 'Phase' } as Annotation }, Header)
    public header: HeaderModel;

    /**
     * Sets the offset of the phase
     *
     * @default 100
     */
    @Property(100)
    public offset: number;

    /**
     * Allows the user to save custom information about phases. Example: addInfo: {'phase': 'phase 1 info' }
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public addInfo: Object;

    /**
     * Returns the name of class Phase
     *
     * @private
     */
    public getClassName(): string {
        return 'Phase';
    }
}

/**
 * Defines the behavior of swimLane shape
 */
export class SwimLane extends Shape {
    /**
     * Defines the type of node shape.
     *
     * @default 'Basic'
     */
    @Property('SwimLane')
    public type: Shapes;

    /**
     * Defines the size of phase.
     *
     * @default 20
     */
    @Property(20)
    public phaseSize: number;

    /**
     * Defines the collection of phases.
     *
     * @default 'undefined'
     */
    @Collection<PhaseModel>([], Phase)
    public phases: PhaseModel[];

    /**
     * Defines the orientation of the swimLane
     *
     * @default 'Horizontal'
     */
    @Property('Horizontal')
    public orientation: Orientation;

    /**
     * Defines the collection of lanes
     *
     * @default 'undefined'
     */
    @Collection<LaneModel>([], Lane)
    public lanes: LaneModel[];

    /**
     * Defines the collection of header
     *
     * @default 'undefined'
     */
    @Complex<HeaderModel>({ style: { fill: '#E7F4FF', strokeColor: '#CCCCCC' }, annotation: { content: 'Function' } as Annotation }, Header)
    public header: HeaderModel;

    /**
     * Defines the whether the shape is a lane or not
     *
     * @default false
     */
    @Property(false)
    public isLane: boolean;

    /**
     * Defines the whether the shape is a phase or not
     *
     * @default false
     */
    @Property(false)
    public isPhase: boolean;

    /**
     * Defines space between children and lane
     *
     * @private
     *
     */
    public padding: number = 20;

    /**
     * Defines header by user or not
     *
     * @private
     *
     */
    public hasHeader: boolean = true;

    /**
     * Returns the name of class Phase
     *
     * @private
     */
    public getClassName(): string {
        return 'SwimLane';
    }
}

/**
 * Defines the behavior of container
 */
export class ChildContainer {
    /**
     * Defines the type of the container
     *
     * @aspDefaultValueIgnore
     * @default Canvas
     */
    @Property('Canvas')
    public type: ContainerTypes;
    /**
     * Defines the type of the swimLane orientation.
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property('Vertical')
    public orientation: Orientation;

    /**
     * Returns the name of class ChildContainer
     *
     * @private
     */
    public getClassName(): string {
        return 'ChildContainer';
    }
}

/**
 * Defines the size and position of selected items and defines the appearance of selector
 */
export class Selector extends ChildProperty<Selector> implements IElement {
    /**
     * Defines the size and position of the container
     *
     * @default null
     */
    @Property(null)
    public wrapper: Container;

    /**
     * Defines the collection of selected nodes
     *
     */
    @Collection<NodeModel>([], Node)
    public nodes: NodeModel[];

    /**
     * Defines the collection of selected connectors
     *
     */
    @Collection<ConnectorModel>([], Connector)
    public connectors: ConnectorModel[];

    /**
     * @private
     */
    public annotation: ShapeAnnotationModel | PathAnnotationModel;
    /**
     * Sets/Gets the width of the container
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public width: number;

    /**
     * Sets/Gets the height of the container
     *
     * @aspDefaultValueIgnore
     * @default undefined
     */
    @Property()
    public height: number;

    /**
     * Sets the rotate angle of the container
     *
     * @default 0
     */
    @Property(0)
    public rotateAngle: number;

    /**
     * Sets the positionX of the container
     *
     * @default 0
     */
    @Property(0)
    public offsetX: number;

    /**
     * Sets the positionY of the container
     *
     * @default 0
     */
    @Property(0)
    public offsetY: number;

    /**
     * Sets the pivot of the selector
     *
     * @default { x: 0.5, y: 0.5 }
     */
    @Complex<PointModel>({ x: 0.5, y: 0.5 }, Point)
    public pivot: PointModel;

    /**
     * Defines how to pick the objects to be selected using rubber band selection
     * * CompleteIntersect - Selects the objects that are contained within the selected region
     * * PartialIntersect - Selects the objects that are partially intersected with the selected region
     *
     * @default 'CompleteIntersect'
     */
    @Property('CompleteIntersect')
    public rubberBandSelectionMode: RubberBandSelectionMode;

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
     *
     * @default []
     */
    @Collection<UserHandleModel>([], UserHandle)
    public userHandles: UserHandleModel[];

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
     *
     * @default 'All'
     * @aspNumberEnum
     */
    @Property(SelectorConstraints.All)
    public constraints: SelectorConstraints;


    /**
     * set the constraint of the container
     * * Rotate - Enable Rotate Thumb
     * * ConnectorSource - Enable Connector source point
     * * ConnectorTarget - Enable Connector target point
     * * ResizeNorthEast - Enable ResizeNorthEast Resize
     * * ResizeEast - Enable ResizeEast Resize
     * * ResizeSouthEast - Enable ResizeSouthEast Resize
     * * ResizeSouth - Enable ResizeSouth Resize
     * * ResizeSouthWest - Enable ResizeSouthWest Resize
     * * ResizeWest - Enable ResizeWest Resize
     * * ResizeNorthWest - Enable ResizeNorthWest Resize
     * * ResizeNorth - Enable ResizeNorth Resize
     *
     * @private
     * @aspNumberEnum
     */
    public thumbsConstraints: ThumbsConstraints;

    /**
     * setTooltipTemplate helps to customize the content of a tooltip
     *
     * @aspDefaultValueIgnore
     * @default undefined
     * @deprecated
     */
    @Property()
    public setTooltipTemplate: Function | string;

    /**
     * Defines the collection of selected nodes and connectors
     * @default []
     */
      @Collection<NodeModel | ConnectorModel>([], Node)
      public selectedObjects: (NodeModel | ConnectorModel)[];

    /**
     * Initializes the UI of the container
     */
    public init(diagram: Diagram): Container {
        const container: Container = new Container();
        container.measureChildren = false;
        //const consize: Size = new Size();
        container.children = [];
        if (this.annotation) {
            const object: Container = (this.nodes.length > 0) ? diagram.nameTable[this.nodes[0].id].wrapper :
                diagram.nameTable[this.connectors[0].id].wrapper;
            const wrapper: DiagramElement = diagram.getWrapper(object, this.annotation.id);
            container.children.push(wrapper);
        } else {
            if (this.nodes || this.connectors) {
                for (let i: number = 0; i < this.nodes.length; i++) {
                    const node: NodeModel = diagram.nameTable[this.nodes[i].id];
                    const wrapper: Container = node.wrapper;
                    // this.width = wrapper.actualSize.width;
                    // this.height = wrapper.actualSize.height;
                    // this.rotateAngle = wrapper.rotateAngle;
                    // this.offsetX = wrapper.offsetX;
                    // this.offsetY = wrapper.offsetY;
                    container.children.push(wrapper);
                }
                for (let j: number = 0; j < this.connectors.length; j++) {
                    const connector: ConnectorModel = diagram.nameTable[this.connectors[j].id];
                    const wrapper: Container = connector.wrapper;
                    // this.width = wrapper.actualSize.width; this.height = wrapper.actualSize.height;
                    // this.rotateAngle = wrapper.rotateAngle; this.offsetX = wrapper.offsetX;
                    // this.offsetY = wrapper.offsetY;
                    container.children.push(wrapper);
                }
            }
        }
        const isProtectedOnChange: string = 'isProtectedOnChange';
        const diagramProtectPropertyChange: boolean = diagram[isProtectedOnChange];
        diagram.protectPropertyChange(false);
        this.wrapper = container;
        diagram.protectPropertyChange(diagramProtectPropertyChange);
        return container;
    }
}
