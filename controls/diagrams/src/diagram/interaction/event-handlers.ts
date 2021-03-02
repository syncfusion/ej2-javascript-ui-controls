import { Browser } from '@syncfusion/ej2-base';
import { PointModel } from '../primitives/point-model';
import { Point } from '../primitives/point';
import { IElement, IClickEventArgs, IDoubleClickEventArgs, IMouseEventArgs, StackEntryObject } from '../objects/interface/IElement';
import { UserHandleEventsArgs } from '../objects/interface/IElement';
import { ICommandExecuteEventArgs, IKeyEventArgs } from '../objects/interface/IElement';
import { IBlazorDoubleClickEventArgs, IBlazorClickEventArgs, IBlazorMouseEventArgs } from '../objects/interface/IElement';
import { DiagramElement } from '../core/elements/diagram-element';
import { Container } from '../core/containers/container';
import { MarginModel } from '../core/appearance-model';
import { Diagram } from '../diagram';
import { Connector } from '../objects/connector';
import { NodeDrawingTool, ConnectorDrawingTool, TextDrawingTool } from './tool';
import { PolygonDrawingTool, PolyLineDrawingTool, FixedUserHandleTool } from './tool';
import { Node, SwimLane } from '../objects/node';
import { ConnectorModel } from '../objects/connector-model';
import { PointPortModel } from '../objects/port-model';
import { NodeModel, BpmnShapeModel, BasicShapeModel, SwimLaneModel, LaneModel, PhaseModel } from '../objects/node-model';
import { ToolBase, SelectTool, MoveTool, ResizeTool, RotateTool, ConnectTool, ExpandTool, LabelTool, ZoomPanTool } from './tool';
import { LabelDragTool, LabelResizeTool, LabelRotateTool } from './tool';
import { ConnectorEditing } from './connector-editing';
import { Selector } from '../objects/node';
import { CommandHandler } from './command-manager';
import { Actions, findToolToActivate, isSelected, getCursor, contains } from './actions';
import { DiagramAction, KeyModifiers, Keys, DiagramEvent, DiagramTools, RendererAction, DiagramConstraints } from '../enum/enum';
import { BlazorAction, ScrollActions } from '../enum/enum';
import { isPointOverConnector, findObjectType, insertObject, getObjectFromCollection, getTooltipOffset } from '../utility/diagram-util';
import { getObjectType, getInOutConnectPorts, removeChildNodes, cloneBlazorObject, checkPort } from '../utility/diagram-util';
import { canZoomPan, canDraw, canDrag, canZoomTextEdit, canVitualize, canPreventClearSelection } from './../utility/constraints-util';
import { canMove, canEnablePointerEvents, canSelect, canEnableToolTip } from './../utility/constraints-util';
import {
    canOutConnect, canInConnect, canPortInConnect, canPortOutConnect, canAllowDrop, canUserInteract, defaultTool
} from './../utility/constraints-util';
import { CommandModel } from '../diagram/keyboard-commands-model';
import { updateTooltip } from '../objects/tooltip';
import { DiagramTooltipModel } from '../objects/tooltip-model';
import { PortVisibility, NodeConstraints, ConnectorConstraints, RealAction } from '../enum/enum';
import { addTouchPointer, measureHtmlText, getAdornerLayerSvg } from '../utility/dom-util';
import { TextElement } from '../core/elements/text-element';
import { Size } from '../primitives/size';
import { cloneObject as clone, cloneObject } from './../utility/base-util';
import { TransformFactor } from '../interaction/scroller';
import { InputArgs } from '@syncfusion/ej2-inputs';
import { Rect } from '../primitives/rect';
import { identityMatrix, rotateMatrix, transformPointByMatrix, Matrix } from './../primitives/matrix';
import { LayerModel } from '../diagram/layer-model';
import { ITouches, ActiveLabel } from '../objects/interface/interfaces';
import { removeRulerMarkers, drawRulerMarkers, getRulerSize, updateRuler } from '../ruler/ruler';
import { canContinuousDraw, canDrawOnce } from '../utility/constraints-util';
import { SelectorModel } from '../objects/node-model';
import { getFunction, cornersPointsBeforeRotation } from '../utility/base-util';
import { ShapeAnnotationModel, PathAnnotationModel } from '../objects/annotation-model';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';
import { updateCanvasBounds, checkChildNodeInContainer, checkParentAsContainer, removeChildInContainer } from './container-interaction';
import { moveChildInStack, renderStackHighlighter, } from './container-interaction';
import { updateSwimLaneObject } from '../utility/swim-lane-util';
import { getConnectors, updateHeaderMaxWidth, laneInterChanged, updateConnectorsProperties } from '../utility/swim-lane-util';
import { HistoryEntry } from '../diagram/history';
import { GridPanel } from '../core/containers/grid';
import { Canvas } from '../core/containers/canvas';
import { DiagramHtmlElement } from '../core/elements/html-element';
import { randomId } from '../index';
import { Tooltip } from '@syncfusion/ej2-popups';
import { isBlazor } from '@syncfusion/ej2-base';
import { BlazorTooltip } from '../blazor-tooltip/blazor-Tooltip';


/**
 * This module handles the mouse and touch events
 */
export class DiagramEventHandler {
    private currentAction: Actions = 'None';
    private previousAction: Actions = 'None';

    /**   @private  */
    public focus: boolean = false;

    private get action(): Actions {
        return this.currentAction;
    }

    private set action(action: Actions) {
        if (action !== this.currentAction) {
            if (this.currentAction === 'PortDraw') {
                this.diagram.tool &= ~DiagramTools.DrawOnce;
                if (this.tool) {
                    this.tool.mouseUp({ position: this.currentPosition });
                }
                this.tool = null;
            }
            if (action === 'Rotate' || action === 'LabelRotate') {
                this.diagram.diagramCanvas.classList.add('e-diagram-rotate');
            } else if (this.currentAction === 'Rotate' || this.currentAction === 'LabelRotate') {
                this.diagram.diagramCanvas.classList.remove('e-diagram-rotate');
            }
            this.currentAction = action;
            if (this.currentAction !== 'None' && this.currentAction !== 'Select' &&
                !(this.diagram.diagramActions & DiagramAction.TextEdit) || this.commandHandler.isUserHandle(this.currentPosition)) {
                this.diagram.diagramActions = this.diagram.diagramActions | DiagramAction.ToolAction;
            } else {
                this.diagram.diagramActions = this.diagram.diagramActions & ~DiagramAction.ToolAction;
            }
            this.diagram.setCursor(this.diagram.getCursor(action, this.inAction));
        }
    }

    private isBlocked: boolean = false;

    private get blocked(): boolean {
        return this.isBlocked;
    }

    private set blocked(blocked: boolean) {
        this.isBlocked = blocked;
        if (this.blocked) {
            this.diagram.setCursor('not-allowed');
        } else {
            this.diagram.setCursor(this.diagram.getCursor(this.action, this.inAction));
        }
    }

    private commandHandler: CommandHandler;

    private isMouseDown: boolean = false;

    private inAction: boolean = false;

    private resizeTo: Object;

    private currentPosition: PointModel;

    private timeOutValue: Object;

    private doingAutoScroll: boolean = false;

    private prevPosition: PointModel;

    private diagram: Diagram = null;

    private objectFinder: ObjectFinder = null;

    private tool: ToolBase = null;

    private eventArgs: MouseEventArgs = null;

    private userHandleObject: string;

    private lastObjectUnderMouse: NodeModel | ConnectorModel;

    private hoverElement: NodeModel | ConnectorModel;

    private hoverNode: NodeModel;

    private isScrolling: boolean;

    private initialEventArgs: MouseEventArgs;
    /** @private */
    public touchStartList: ITouches[] | TouchList;
    /** @private */
    public touchMoveList: ITouches[] | TouchList;
    /** @private */
    constructor(diagram: Diagram, commandHandler: CommandHandler) {
        this.diagram = diagram;
        this.objectFinder = new ObjectFinder();
        this.commandHandler = commandHandler;
    }
    /** @private */
    public getMousePosition(e: MouseEvent | PointerEvent | TouchEvent): PointModel {
        let touchArg: TouchEvent;
        let offsetX: number;
        let offsetY: number;
        if (e.type.indexOf('touch') !== -1) {
            touchArg = <TouchEvent & PointerEvent>e;
            offsetX = touchArg.changedTouches[0].clientX;
            offsetY = touchArg.changedTouches[0].clientY;
        } else {
            offsetX = (e as PointerEvent).clientX;
            offsetY = (e as PointerEvent).clientY;
        }
        let position: Size = new Size();
        position = getRulerSize(this.diagram);
        let boundingRect: ClientRect = this.diagram.element.getBoundingClientRect();
        offsetX = offsetX + this.diagram.diagramCanvas.scrollLeft - boundingRect.left - position.width;
        offsetY = offsetY + this.diagram.diagramCanvas.scrollTop - boundingRect.top - position.height;
        offsetX /= this.diagram.scroller.transform.scale;
        offsetY /= this.diagram.scroller.transform.scale;
        offsetX -= this.diagram.scroller.transform.tx;
        offsetY -= this.diagram.scroller.transform.ty;
        return { x: offsetX, y: offsetY };
    }

    /**
     * @private
     */
    public windowResize(evt: Event): boolean {

        if (this.resizeTo) {
            clearTimeout(this.resizeTo as number);
        }
        this.resizeTo = setTimeout(
            (): void => {
                this.updateViewPortSize(this.diagram.element);
            },
            300);
        return false;
    }


    /**
     * @private
     */
    public updateViewPortSize(element: HTMLElement): void {
        let container: HTMLElement = document.getElementById(element.id);
        if (container) {
            let bounds: ClientRect = container.getBoundingClientRect();
            this.diagram.scroller.setViewPortSize(bounds.width, bounds.height);
            let position: Size = new Size();
            position = getRulerSize(this.diagram);
            let width: string = this.diagram.getSizeValue(this.diagram.width, position.width);
            let height: string = this.diagram.getSizeValue(this.diagram.height, position.height);
            this.diagram.diagramCanvas.style.width = width;
            this.diagram.diagramCanvas.style.height = height;
            this.diagram.scroller.setSize();
            this.diagram.transformLayers();
            if (this.diagram.rulerSettings.showRulers) {
                updateRuler(this.diagram);
            }
        }
    }

    /** @private */
    public canHideResizers(): boolean {
        return ((this.tool instanceof MoveTool || this.tool instanceof RotateTool) && this.isMouseDown);
    }


    /** @private */
    private updateCursor(): void {
        if ((this.diagram.selectedItems.nodes.length === 1 || this.diagram.selectedItems.connectors.length === 1)) {
            let list: (NodeModel | ConnectorModel)[] = [];
            list = list.concat(this.diagram.selectedItems.nodes, this.diagram.selectedItems.connectors);
            // Bug fix - EJ2-44495 -Node does not gets selected on slight movement of mouse when drag constraints disabled for node
            this.blocked = (this.eventArgs && this.eventArgs.source && !canMove(this.eventArgs.source)) ? false :
                (this.isMouseDown && list.length === 1 && this.tool instanceof SelectTool && !canMove(list[0]));
        }
    }
    private isForeignObject(target: HTMLElement, isTextBox?: boolean): HTMLElement {
        let foreignobject: HTMLElement = target;
        if (foreignobject) {
            while (foreignobject.parentNode !== null) {
                if (typeof foreignobject.className === 'string' &&
                    ((!isTextBox && foreignobject.className.indexOf('foreign-object') !== -1) ||
                        (isTextBox && foreignobject.className.indexOf('e-diagram-text-edit') !== -1))) {
                    return foreignobject;
                } else {
                    foreignobject = foreignobject.parentNode as HTMLElement;
                }
            }
        }
        return null;
    }

    private isMetaKey(evt: PointerEvent | WheelEvent | KeyboardEvent): boolean {
        return navigator.platform.match('Mac') ? evt.metaKey : evt.ctrlKey;
    }
    private renderUmlHighLighter(args: MouseEventArgs): void {
        this.diagram.commandHandler.removeStackHighlighter();
        let node: NodeModel = this.diagram.selectedItems.nodes[0];
        if (node && node.container && node.container.type === 'Stack' && node.shape.type === 'UmlClassifier') {
            let bound: Rect = node.wrapper.bounds;
            if (!bound.containsPoint(this.currentPosition)) {
                let objects: IElement[] = this.diagram.findObjectsUnderMouse({ x: this.currentPosition.x - 20, y: this.currentPosition.y });
                let target: IElement = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
                if (target && (target as Node).parentId && ((target as Node).parentId === node.id)) {
                    let isVertical: boolean = this.diagram.nameTable[(target as Node).parentId].container.orientation === 'Vertical';
                    renderStackHighlighter(
                        target.wrapper, isVertical, args.position, this.diagram, true);
                }
            }
        }
    }
    private isDeleteKey(key: string, value: string): boolean {
        return (navigator.platform.match('Mac') && key === 'Backspace' && value === 'delete');
    }

    private isMouseOnScrollBar(evt: PointerEvent): boolean {
        let x: number = evt.offsetX;
        let y: number = evt.offsetY;
        let diagramCanvas: HTMLElement = this.diagram.diagramCanvas;
        let height: number = diagramCanvas.offsetHeight;
        let width: number = diagramCanvas.offsetWidth;
        let topLeft: PointModel;
        let topRight: PointModel;
        let bottomLeft: PointModel;
        let bottomRight: PointModel;
        let bounds: Rect;
        if (height < diagramCanvas.scrollHeight) {
            //default scrollbar width in browser is '17pixels'.
            topLeft = { x: (width - 17), y: 0 };
            topRight = { x: width, y: 0 };
            bottomLeft = { x: (width - 17), y: height };
            bottomRight = { x: width, y: height };
            bounds = Rect.toBounds([topLeft, topRight, bottomLeft, bottomRight]);
            if (bounds.containsPoint({ x: x, y: y })) {
                return true;
            }
        }
        if (width < diagramCanvas.scrollWidth) {
            topLeft = { x: 0, y: (height - 17) };
            topRight = { x: width, y: (height - 17) };
            bottomLeft = { x: 0, y: height };
            bottomRight = { x: width, y: height };
            bounds = Rect.toBounds([topLeft, topRight, bottomLeft, bottomRight]);
            if (bounds.containsPoint({ x: x, y: y })) {
                return true;
            }
        }
        return false;
    }

    /**   @private  */
    public updateVirtualization(): void {
        let delay: number = 50;
        let removeObjectInterval: Object;
        removeObjectInterval = setInterval(
            (args: PointerEvent | TouchEvent) => {
                this.diagram.removeVirtualObjects(removeObjectInterval);
            },
            delay);
        setTimeout(
            () => {
                this.diagram.deleteVirtualObject = true;
            },
            delay);
    }
    private checkPreviousAction(): void {
        if (this.action !== this.previousAction && this.diagram.selectedItems.userHandles.length) {
            for (let i: number = 0; i < this.diagram.selectedItems.userHandles.length; i++) {
                if (this.previousAction && this.diagram.selectedItems.userHandles[i]) {
                    this.checkUserHandleEvent(DiagramEvent.onUserHandleMouseLeave);
                    this.previousAction = 'None';
                }
            }
        }
    }
    private checkUserHandleEvent(eventName: DiagramEvent): void {
        if (this.diagram.selectedItems && this.diagram.selectedItems.userHandles.length > 0) {
            let currentAction: Actions = (eventName === DiagramEvent.onUserHandleMouseLeave) ? this.previousAction : this.action;
            let arg: UserHandleEventsArgs = { element: undefined };
            for (let i: number = 0; i < this.diagram.selectedItems.userHandles.length; i++) {
                if ((currentAction === this.diagram.selectedItems.userHandles[i].name) ||
                    (eventName === DiagramEvent.onUserHandleMouseUp && currentAction === 'Select')) {
                    arg.element = this.diagram.selectedItems.userHandles[i];
                    if (eventName === DiagramEvent.onUserHandleMouseEnter) {
                        this.previousAction = this.action;
                    }
                    if (eventName === DiagramEvent.onUserHandleMouseDown) {
                        this.userHandleObject = this.diagram.selectedItems.userHandles[i].name;
                    }
                    let element: HTMLElement = document.getElementById(this.diagram.selectedItems.userHandles[i].name + '_userhandle');

                    if (eventName === DiagramEvent.onUserHandleMouseUp) {
                        if (this.commandHandler.isUserHandle(this.currentPosition)
                            && element && element.id === this.userHandleObject + '_userhandle') {
                            this.diagram.triggerEvent(eventName, arg);
                        }
                    } else {
                        this.diagram.triggerEvent(eventName, arg);
                    }
                }
            }
        }
    }

    public mouseDown(evt: PointerEvent): void {
        this.focus = true;
        let touches: TouchList;
        touches = (<TouchEvent & PointerEvent>evt).touches;
        if (this.isMouseOnScrollBar(evt)) {
            this.isScrolling = true;
            evt.preventDefault();
            return;
        }
        // commanded by gowtham- unwanted cloning of selectedItems
        // if (isBlazor()) {
        //     this.commandHandler.oldSelectedObjects = cloneObject(this.diagram.selectedItems);
        // }
        this.checkUserHandleEvent(DiagramEvent.onUserHandleMouseDown);
        if (!this.checkEditBoxAsTarget(evt) && (canUserInteract(this.diagram)) ||
            (canZoomPan(this.diagram) && !defaultTool(this.diagram))) {
            if (this.action === 'Select' || this.action === 'Drag') {
                this.diagram.updatePortVisibility(this.hoverElement as Node, PortVisibility.Hover, true);
            }
            if (((this.tool instanceof PolygonDrawingTool || this.tool instanceof PolyLineDrawingTool)
                && (evt.button === 2 || evt.buttons === 2))) {
                let arg: IClickEventArgs = {
                    element: cloneBlazorObject(this.diagram), position: cloneBlazorObject(this.currentPosition),
                    count: evt.buttons, actualObject: cloneBlazorObject(this.eventArgs.actualObject),
                    button: (evt.button === 0) ? 'Left' : (evt.button === 1) ? 'Middle' : 'Right'
                };
                this.inAction = false;
                this.tool.mouseUp(this.eventArgs);
            } else if (((this.inAction === true) && this.isMouseDown === true &&
                (this.tool instanceof PolygonDrawingTool || this.tool instanceof PolyLineDrawingTool))) {
                this.isMouseDown = true;
                this.eventArgs = {};
                this.getMouseEventArgs(this.currentPosition, this.eventArgs);
                this.eventArgs.position = this.currentPosition;
                this.tool.mouseDown(this.eventArgs);
            } else {
                this.isMouseDown = true;
                this.currentPosition = this.prevPosition = this.getMousePosition(evt);
                this.eventArgs = {};
                if (this.diagram.textEditing && !this.isMouseOnScrollBar(evt)) {
                    this.diagram.endEdit();
                    this.diagram.textEditing = false;
                }
                let target: NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel;
                let objects: IElement[] = this.objectFinder.findObjectsUnderMouse(
                    this.currentPosition, this.diagram, this.eventArgs, null, this.action);
                let obj: IElement = this.objectFinder.findObjectUnderMouse(
                    this.diagram, objects, this.action, this.inAction, this.eventArgs, this.currentPosition);
                let sourceElement: DiagramElement = null;
                if (obj !== null) {
                    sourceElement = this.diagram.findElementUnderMouse(obj, this.currentPosition);
                    if (sourceElement) {
                        target = this.commandHandler.findTarget(sourceElement, obj);
                    }
                }
                this.action = this.diagram.findActionToBeDone(obj, sourceElement, this.currentPosition, target);
                //work around - correct it
                let ctrlKey: boolean = this.isMetaKey(evt);
                if (ctrlKey && evt.shiftKey && this.diagram.connectorEditingToolModule) {
                    this.action = 'SegmentEnd';
                } else if ((ctrlKey || evt.shiftKey) && (!canZoomPan(this.diagram))) {
                    this.action = 'Select';
                }
                this.tool = this.diagram.getTool(this.action);
                if (!this.tool) {
                    this.action = 'Select';
                    this.tool = this.diagram.getTool(this.action);
                }
                this.getMouseEventArgs(this.currentPosition, this.eventArgs);

                if (ctrlKey || evt.shiftKey) {
                    let info: Info = (ctrlKey && evt.shiftKey) ? { ctrlKey: ctrlKey, shiftKey: evt.shiftKey } : { ctrlKey: true };
                    this.eventArgs.info = info;
                }
                this.eventArgs.position = this.currentPosition;
                this.tool.mouseDown(this.eventArgs);
                this.initialEventArgs = { source: this.eventArgs.source, sourceWrapper: this.eventArgs.sourceWrapper };
                this.initialEventArgs.position = this.currentPosition;
                this.initialEventArgs.info = this.eventArgs.info;
                this.inAction = false;
                if (evt.type === 'touchstart') {
                    if (touches && touches.length >= 2) {
                        this.touchStartList = addTouchPointer(<ITouches[]>this.touchStartList, evt, touches);
                    }
                    if (!touches) {
                        evt.preventDefault();
                    }
                }
            }
        }
        if (!this.isForeignObject(evt.target as HTMLElement) && !this.isForeignObject(evt.target as HTMLElement, true) && (!touches)) {
            evt.preventDefault();
        }
    }

    /**   @private  */
    public mouseMoveExtend(e: PointerEvent | TouchEvent, obj: IElement): void {
        if (this.tool instanceof PolygonDrawingTool || this.tool instanceof PolyLineDrawingTool) {
            this.tool.mouseMove(this.eventArgs);
        }
        if (this.diagram.scrollSettings.canAutoScroll) {
            this.checkAutoScroll(e);
        } else {
            if (!this.blocked) {
                (this.tool.mouseMove(this.eventArgs));
            }
        }
        if (this.eventArgs.target) {
            this.hoverElement = this.eventArgs.target;
        }
        let isNode: boolean = this.eventArgs.target instanceof Node && obj instanceof Node ? false : true;
        if (this.tool instanceof ConnectTool) {
            this.diagram.updatePortVisibility(
                this.hoverElement instanceof Node ? this.hoverElement : this.hoverNode as Node,
                PortVisibility.Connect | PortVisibility.Hover, isNode);
        }
        if (this.hoverElement instanceof Node
            && this.hoverNode instanceof Node && this.hoverNode && this.hoverNode.id !== this.hoverElement.id) {
            this.diagram.updatePortVisibility(this.hoverNode, PortVisibility.Connect | PortVisibility.Hover, true);
        }
        this.hoverElement = isNode ? null : obj;
        this.hoverNode = isNode ? null : obj;
    }

    /** @private */
    public checkAction(obj: IElement): void {
        if (this.action === 'LabelSelect' && this.eventArgs.sourceWrapper &&
            (this.eventArgs.sourceWrapper instanceof TextElement || this.eventArgs.sourceWrapper instanceof DiagramHtmlElement)) {
            let annotation: ShapeAnnotation | PathAnnotation = this.commandHandler.findTarget(
                this.eventArgs.sourceWrapper, this.eventArgs.source) as ShapeAnnotation | PathAnnotation;
            if (!isSelected(this.diagram, annotation, false, this.eventArgs.sourceWrapper) && canMove(annotation)) {
                this.action = 'LabelDrag';
                this.tool = this.getTool(this.action);
                this.tool.mouseDown(this.initialEventArgs);
            }
        } else if (canMove(obj) && canSelect(obj) && this.initialEventArgs &&
            this.initialEventArgs.source && this.action === 'Select') {
            if (!isSelected(this.diagram, this.eventArgs.source, false) &&
                this.eventArgs.source instanceof Selector) {
                this.getMouseEventArgs(this.currentPosition, this.eventArgs);
            }
            if (!(obj instanceof Connector) || (obj instanceof Connector &&
                !(contains(this.currentPosition, obj.sourcePoint, obj.hitPadding) ||
                    contains(this.currentPosition, obj.targetPoint, obj.hitPadding)))) {
                this.action = 'Drag';
            }
            this.tool = this.getTool(this.action);
            this.tool.mouseDown(this.initialEventArgs);
        }
    }

    private isSwimlaneElements(obj: Node): boolean {
        if (obj && (obj.isLane || obj.isPhase || obj.isHeader)) {
            return false;
        } else {
            return true;
        }
    }
    /* tslint:disable */
    /** @private */
    public mouseMove(e: PointerEvent | TouchEvent, touches: TouchList): void {
        this.focus = true;
        if (this.isScrolling) { e.preventDefault(); return; }
        if (canUserInteract(this.diagram) || (canZoomPan(this.diagram) && !defaultTool(this.diagram))) {
            this.currentPosition = this.getMousePosition(e);
            let objects: IElement[] = this.diagram.findObjectsUnderMouse(this.currentPosition);
            let obj: IElement = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
            drawRulerMarkers(this.diagram, this.currentPosition);
            let force: boolean = false; let target: NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel;
            if (e.type === 'touchmove') {
                touches = (<TouchEvent & PointerEvent>e).touches;
                if (touches && touches.length > 1) {
                    this.touchMoveList = addTouchPointer(<ITouches[]>this.touchMoveList, (<PointerEvent>e), touches);
                    if (this.action !== 'PinchZoom') {
                        force = true;
                    }
                }
            }
            if (Point.equals(this.currentPosition, this.prevPosition) === false || this.inAction) {
                if (this.isMouseDown === false || force) {
                    this.eventArgs = {};
                    let sourceElement: DiagramElement = null;
                    if (obj !== null) {
                        sourceElement = this.diagram.findElementUnderMouse(obj, this.currentPosition);
                        if (obj !== this.hoverElement) {
                            let content: string | HTMLElement = this.getContent();
                            if (this.hoverElement && this.hoverElement.tooltip.openOn === 'Auto' && content !== '') {
                                this.elementLeave();
                            }
                            this.diagram.updatePortVisibility(this.hoverElement as Node, PortVisibility.Hover, true);
                            if (obj instanceof Node) {
                                this.hoverNode = obj;
                            }
                            let canResetElement: boolean = true;
                            if (!this.isSwimlaneElements(obj as Node)
                                && (this.hoverElement && this.isSwimlaneElements(this.hoverElement as Node))) {
                                canResetElement = false;
                            }
                            this.hoverElement = canResetElement ? obj : this.hoverElement
                            if (canResetElement) {
                                this.elementEnter(this.currentPosition, false);
                            } else {
                                this.hoverElement = obj;
                            }
                        } else if (!this.hoverElement && this.hoverElement === obj) {
                            this.elementEnter(this.currentPosition, true);
                        }
                        if (sourceElement) { target = this.commandHandler.findTarget(sourceElement, obj); }
                    }
                    this.action = this.diagram.findActionToBeDone(obj, sourceElement, this.currentPosition, target);
                    this.checkUserHandleEvent(DiagramEvent.onUserHandleMouseEnter);
                    this.checkPreviousAction();
                    this.getMouseEventArgs(this.currentPosition, this.eventArgs);
                    this.tool = this.getTool(this.action);
                    this.mouseEvents();
                    if (this.tool instanceof ConnectorDrawingTool ||
                        this.tool instanceof PolyLineDrawingTool ||
                        this.tool instanceof PolygonDrawingTool) {
                        this.tool.mouseMove(this.eventArgs);
                    } else if (touches && this.tool instanceof ZoomPanTool) {
                        this.tool.mouseDown(this.eventArgs);
                    }
                    this.updateCursor();
                    this.renderUmlHighLighter(this.eventArgs);
                    let isNode: boolean = false;
                    if (!(this.hoverElement && (!(this.tool instanceof ZoomPanTool))
                        && (obj instanceof Node && this.isSwimlaneElements(obj)) &&
                        (this.diagram.selectedItems.nodes.length === 0 || !isSelected(this.diagram, this.hoverElement)))) {
                        isNode = true;
                    }
                    this.diagram.updatePortVisibility(this.hoverElement as Node, PortVisibility.Hover, isNode);
                    let content: string | HTMLElement = this.getContent();
                    if (obj === null && this.hoverElement && this.hoverElement.tooltip.openOn === 'Auto' && content) {
                        this.hoverElement = null;
                        this.elementLeave();
                    }
                    force = false;
                } else {
                    this.eventArgs.position = this.currentPosition;
                    if (this.action === 'Drag' && !isSelected(this.diagram, this.eventArgs.source, false) &&
                        this.eventArgs.source instanceof Selector) {
                        this.getMouseEventArgs(this.currentPosition, this.eventArgs);
                    }
                    this.mouseEvents();
                    if (e.ctrlKey || e.shiftKey) {
                        let info: Info = (e.ctrlKey && e.shiftKey) ? { ctrlKey: e.ctrlKey, shiftKey: e.shiftKey } : { ctrlKey: true };
                        this.eventArgs.info = info;
                    }
                    this.checkAction(obj);
                    let padding: number = this.getConnectorPadding(this.eventArgs);
                    this.getMouseEventArgs(this.currentPosition, this.eventArgs, this.eventArgs.source, padding);
                    this.updateCursor();
                    this.inAction = true;
                    this.initialEventArgs = null;
                    if (this.action === 'Drag' || this.action === 'Rotate') {
                        this.diagram.diagramActions = this.diagram.diagramActions | DiagramAction.Interactions;
                    }
                    this.mouseMoveExtend(e, obj);
                }
                this.prevPosition = this.currentPosition;
                if (!this.isForeignObject(e.target as HTMLElement, true)) {
                    e.preventDefault();
                }
            }
        }
    }
    /* tslint:enable */

    private getContent(): string | HTMLElement {
        let isPrivateTooltip: number = ((this.hoverElement instanceof Node) &&
            (this.hoverElement as Node).constraints & NodeConstraints.Tooltip) ||
            ((this.hoverElement instanceof Connector) &&
                (this.hoverElement as Connector).constraints & ConnectorConstraints.Tooltip);
        let content: string | HTMLElement = isPrivateTooltip ? this.hoverElement.tooltip.content :
            this.diagram.tooltip.content;
        return content;
    }

    private checkAutoScroll(e: PointerEvent | TouchEvent): void {
        let autoScrollPosition: string = this.startAutoScroll(e);
        if (!autoScrollPosition && this.doingAutoScroll) {
            this.doingAutoScroll = false;
            clearInterval(this.timeOutValue as number);
        } else if (autoScrollPosition) {
            if ((this.tool instanceof NodeDrawingTool || this.tool instanceof ConnectorDrawingTool
                || this.tool instanceof MoveTool || this.tool instanceof ResizeTool
                || this.tool instanceof SelectTool) && this.inAction) {
                let diagram: DiagramEventHandler = this;
                let delay: number = 100;
                if (this.diagram.scrollSettings.canAutoScroll && autoScrollPosition && !this.doingAutoScroll) {
                    this.doingAutoScroll = true;
                    this.timeOutValue = setInterval(
                        (args: PointerEvent | TouchEvent) => {
                            diagram.doAutoScroll(autoScrollPosition, e, delay);
                        },
                        delay);
                }
            }
        } else {
            this.blocked = !(this.tool.mouseMove(this.eventArgs));
        }
    }
    /* tslint:disable */
    /** @private */
    public mouseUp(evt: PointerEvent): void {
        let touches: TouchList;
        this.checkUserHandleEvent(DiagramEvent.onUserHandleMouseUp);
        if (this.diagram.mode === 'SVG' && canVitualize(this.diagram)) {
            this.updateVirtualization();
        }
        this.diagram.previousSelectedObject = null;
        this.diagram.diagramRenderer.rendererActions =
            this.diagram.removeConstraints(this.diagram.diagramRenderer.rendererActions, RendererAction.DrawSelectorBorder);
        touches = (<TouchEvent & PointerEvent>evt).touches;
        if (this.isScrolling) {
            this.isScrolling = false; evt.preventDefault(); return;
        }
        if (!this.checkEditBoxAsTarget(evt) && (canUserInteract(this.diagram))
            || (canZoomPan(this.diagram) && !defaultTool(this.diagram))) {
            if (this.tool && (!(this.tool instanceof PolygonDrawingTool || this.tool instanceof PolyLineDrawingTool) ||
                ((this.tool instanceof PolygonDrawingTool || this.tool instanceof PolyLineDrawingTool)
                    && evt.detail === 2))) {
                if (!this.isForeignObject(evt.target as HTMLElement) && this.isMouseDown) {
                    document.getElementById(this.diagram.element.id + 'content').focus();
                }
                if (!this.inAction && evt.which !== 3) {
                    if (this.action === 'Drag') {
                        this.action = 'Select';
                        let objects: IElement[] = this.diagram.findObjectsUnderMouse(this.currentPosition);
                        let obj: IElement = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
                        let isMultipleSelect: boolean = true;
                        if ((!evt.ctrlKey && this.isMouseDown
                            && (this.diagram.selectedItems.nodes.length + this.diagram.selectedItems.connectors.length) > 1)
                            && evt.which === 1 && !canPreventClearSelection(this.diagram.diagramActions)) {
                            isMultipleSelect = false; this.commandHandler.clearSelection();
                        }
                        if (!isSelected(this.diagram, obj) || (!isMultipleSelect)) {
                            this.commandHandler.selectObjects([obj]);
                        }
                    }
                }
                let history: HistoryLog = this.updateContainerProperties();
                let isGroupAction: boolean; this.addUmlNode();
                this.inAction = false; this.isMouseDown = false; this.currentPosition = this.getMousePosition(evt);
                if (this.diagram.selectedObject.helperObject) { isGroupAction = this.updateContainerBounds(); }
                if (this.tool && (this.tool.prevPosition || this.tool instanceof LabelTool)) {
                    this.eventArgs.position = this.currentPosition;
                    let padding: number = this.getConnectorPadding(this.eventArgs);
                    this.getMouseEventArgs(this.currentPosition, this.eventArgs, this.eventArgs.source, padding);
                    let ctrlKey: boolean = this.isMetaKey(evt);
                    if (ctrlKey || evt.shiftKey) {
                        let info: Info = (ctrlKey && evt.shiftKey) ? { ctrlKey: ctrlKey, shiftKey: evt.shiftKey } :
                            { ctrlKey: true };
                        this.eventArgs.info = info;
                    }
                    if (this.diagram.diagramActions & DiagramAction.Interactions) {
                        this.diagram.diagramActions = this.diagram.diagramActions & ~DiagramAction.Interactions;
                    }
                    this.eventArgs.clickCount = evt.detail;
                    if (this.diagram.selectedObject.helperObject && (this.tool instanceof MoveTool || this.tool instanceof ResizeTool)) {
                        if (this.diagram.selectedObject.actualObject &&
                            (this.diagram.selectedObject.actualObject as Node).parentId !== '') {
                            let parentNode: Node = this.diagram.getObject(
                                (this.diagram.selectedObject.actualObject as Node).parentId) as Node;
                            if (parentNode && parentNode.isLane) {
                                this.commandHandler.isContainer = true;
                            }
                        }
                        this.tool.mouseUp(this.eventArgs, history.isPreventHistory);
                    } else {
                        this.tool.mouseUp(this.eventArgs);
                        if (this.diagram.checkMenu && (window.navigator.userAgent.indexOf('Linux') !== -1 || window.navigator.userAgent.indexOf('X11') !== -1)) {
                            this.diagram.contextMenuModule.contextMenu.open(evt.pageY, evt.pageX, this.diagram.element);
                            this.diagram.checkMenu = false;
                        }
                    }
                    if (history.hasStack) { this.diagram.endGroupAction(); }
                }
                if (isGroupAction) { this.diagram.endGroupAction(); }
                this.updateContainerBounds(true);
                if (this.eventArgs.clickCount !== 2) {
                    this.commandHandler.updateSelectedNodeProperties(this.eventArgs.source);
                }
                if (this.diagram.selectedObject && this.diagram.selectedObject.helperObject) {
                    this.diagram.remove(this.diagram.selectedObject.helperObject);
                    this.diagram.selectedObject = { helperObject: undefined, actualObject: undefined };
                    // EJ2-42605 - Annotation undo redo not working properly if the line routing is enabled committed by sivakumar sekar
                    // committed to remove the diagram actions public method when line routing is enabled
                    if ((this.diagram.diagramActions & DiagramAction.PublicMethod) && (this.diagram.constraints & DiagramConstraints.LineRouting)) {
                        this.diagram.diagramActions = this.diagram.diagramActions & ~DiagramAction.PublicMethod;
                    }
                }
                this.blocked = false;
                if (this.hoverElement) {
                    let portVisibility: PortVisibility = PortVisibility.Connect;
                    if (isSelected(this.diagram, this.hoverElement)) { portVisibility |= PortVisibility.Hover; }
                    this.diagram.updatePortVisibility(this.hoverElement as Node, portVisibility, true);
                    this.hoverElement = null;
                }
                this.touchStartList = null; this.touchMoveList = null;
                if (!(this.tool instanceof TextDrawingTool)) { this.tool = null; }
            }
            if (!touches) { evt.preventDefault(); }
            this.diagram.currentDrawingObject = undefined; let selector: SelectorModel = this.diagram.selectedItems;
            let disbleRenderSelector: boolean = false;
            if (this.commandHandler.isUserHandle(this.currentPosition)) {
                if (this.isForeignObject(evt.target as HTMLElement)) {
                    disbleRenderSelector = true;
                }
            }
            if (!this.inAction && selector.wrapper && selector.userHandles.length > 0 && !disbleRenderSelector) {
                this.diagram.renderSelector(true);
            }
            if (!this.inAction && !this.diagram.currentSymbol && this.eventArgs) {
                let arg: IClickEventArgs | IBlazorClickEventArgs = {
                    element: cloneBlazorObject(this.eventArgs.source) || cloneBlazorObject(this.diagram),
                    position: cloneBlazorObject(this.eventArgs.position), count: evt.detail,
                    actualObject: cloneBlazorObject(this.eventArgs.actualObject),
                    button: (evt.button === 0) ? 'Left' : (evt.button === 1) ? 'Middle' : 'Right'
                };
                if (isBlazor() && this.diagram.click) { arg = this.getBlazorClickEventArgs(arg); }
                if (this.diagram.tool !== DiagramTools.ZoomPan) {
                    this.diagram.triggerEvent(DiagramEvent.click, arg);
                }
            }
            this.eventArgs = {};
        }
        this.eventArgs = {}; this.diagram.commandHandler.removeStackHighlighter();// end the corresponding tool
    }
    /* tslint:enable */

    private getConnectorPadding(eventArgs: MouseEventArgs): number {
        let padding: number;
        let targetObject: SelectorModel = eventArgs.source;
        if (targetObject && (targetObject instanceof Selector) && targetObject.connectors.length) {
            let selectedConnector: ConnectorModel = targetObject.connectors[0];
            padding = (selectedConnector.constraints & ConnectorConstraints.ConnectToNearByPort) ? selectedConnector.connectionPadding : 0;
        }
        return padding || 0;
    }
    private getBlazorClickEventArgs(arg: IClickEventArgs | IBlazorClickEventArgs): IBlazorClickEventArgs {
        arg = {
            element: this.eventArgs.source ? { selector: cloneBlazorObject(this.eventArgs.source) } :
                { diagram: cloneBlazorObject(this.diagram) },
            position: cloneBlazorObject(this.eventArgs.position), count: arg.count,
            actualObject: this.eventArgs.actualObject ? { selector: cloneBlazorObject(this.eventArgs.actualObject) } :
                { diagram: cloneBlazorObject(this.diagram) },
            button: arg.button
        } as IBlazorClickEventArgs;
        if (this.eventArgs.source instanceof Node) {
            (arg as IBlazorClickEventArgs).element.selector.nodes = [];
            (arg as IBlazorClickEventArgs).element.selector.nodes.push(cloneBlazorObject(this.eventArgs.source) as Node);
        } else if (this.eventArgs.source instanceof Connector) {
            (arg as IBlazorClickEventArgs).element.selector.connectors = [];
            (arg as IBlazorClickEventArgs).element.selector.connectors.push(cloneBlazorObject(this.eventArgs.source) as Connector);
        }
        return arg;
    }

    public addSwimLaneObject(selectedNode: NodeModel): void {
        let swimlaneNode: NodeModel; let targetNode: NodeModel; let shape: SwimLaneModel; let value: number; let canInsert: boolean;
        let index: number = 0; let offset: number;
        let actualShape: SwimLaneModel = (selectedNode.shape as SwimLaneModel);
        let objects: IElement[] = this.objectFinder.findObjectsUnderMouse(
            this.currentPosition, this.diagram, this.eventArgs, null, this.action);
        if (!targetNode) {
            targetNode = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
        }
        this.diagram.clearSelectorLayer();
        if (targetNode && !((targetNode as Node).isLane || (targetNode as Node).isPhase || (targetNode as Node).isHeader)) {
            for (let i: number = 0; i < objects.length; i++) {
                let laneNode: Node = this.diagram.nameTable[(objects[i] as NodeModel).id];
                if (laneNode.isLane || laneNode.isPhase || laneNode.isHeader) { targetNode = laneNode; }
            }
        }
        if (targetNode && (actualShape.isPhase || (actualShape.isLane && (targetNode as SwimLaneModel).isLane))) {
            let id: string = (targetNode as Node).parentId;
            swimlaneNode = this.diagram.nameTable[id];
        }
        if (swimlaneNode) {
            shape = (swimlaneNode.shape as SwimLaneModel);
            canInsert = (actualShape.isLane) ? actualShape.orientation === shape.orientation :
                actualShape.orientation !== shape.orientation;
        }
        if (canInsert && (targetNode as Node)) {
            if (shape.header && (shape as SwimLane).hasHeader && shape.orientation === 'Horizontal') { index = 1; }
            if (shape.phases.length > 0) { index += 1; }
            if (actualShape.isPhase) {
                if (shape.orientation === 'Horizontal') {
                    offset = this.currentPosition.x - swimlaneNode.wrapper.bounds.x;
                } else {
                    offset = this.currentPosition.y - (swimlaneNode.wrapper.bounds.y + shape.header.height);
                }
                let phases: PhaseModel = { id: randomId(), offset: offset, header: { annotation: { content: 'Phase' } } } as PhaseModel;
                this.diagram.addPhases(swimlaneNode, [phases]);
            } else {
                let laneHeight: number = actualShape.lanes[0].header.height;
                let lane: LaneModel = {
                    id: randomId(), style: actualShape.lanes[0].style, header: {
                        annotation: {
                            content: actualShape.lanes[0].header.annotation.content,
                            style: actualShape.lanes[0].header.annotation.style
                        },
                        style: actualShape.lanes[0].header.style
                    },
                } as LaneModel;
                let orientation: boolean = (actualShape.orientation === 'Horizontal') ? true : false;
                orientation ? lane.height = actualShape.lanes[0].height : lane.width = actualShape.lanes[0].width;
                if (shape.orientation === 'Horizontal') {
                    value = (targetNode as Node).rowIndex ? (targetNode as Node).rowIndex :
                        this.diagram.nameTable[(targetNode as Node).parentId].rowIndex;
                    if (targetNode.wrapper.offsetY < this.currentPosition.y) { value += 1; }
                } else {
                    value = (targetNode as Node).columnIndex ? (targetNode as Node).columnIndex :
                        this.diagram.nameTable[(targetNode as Node).parentId].columnIndex;
                    if (this.currentPosition.x < targetNode.wrapper.bounds.center.x) { value -= 1; }
                }
                if (shape.lanes.length > (value - index)) {
                    lane.header.width = shape.lanes[value - index].header.width;
                    lane.header.height = shape.lanes[value - index].header.height;
                } else {
                    lane.header.width = shape.lanes[value - index - 1].header.width;
                    lane.header.height = shape.lanes[value - index - 1].header.height;
                }
                this.diagram.addLanes(swimlaneNode, [lane], value - index);
            }
            this.commandHandler.select(swimlaneNode);
        } else if (actualShape.isLane) {
            let swimLaneobj: NodeModel = {
                id: randomId(), width: selectedNode.width, height: selectedNode.height, addInfo: selectedNode.addInfo,
                shape: {
                    type: 'SwimLane', header: {
                        annotation: { content: 'Header' }, height: 50, style: actualShape.lanes[0].header.style
                    },
                    phases: [{ id: randomId(), header: { annotation: { content: 'Phase' } } }],
                    lanes: [{
                        id: randomId(), height: selectedNode.height, width: selectedNode.width, style: actualShape.lanes[0].style,
                        header: {
                            annotation: {
                                content: actualShape.lanes[0].header.annotation.content,
                                style: actualShape.lanes[0].header.annotation.style
                            },
                            style: actualShape.lanes[0].header.style
                        },
                    }], orientation: actualShape.orientation,
                }
            } as NodeModel;
            if (actualShape.orientation === 'Vertical') { swimLaneobj.width += 20; }
            swimLaneobj.offsetX = this.currentPosition.x + (swimLaneobj.width / 2);
            swimLaneobj.offsetY = this.currentPosition.y + (swimLaneobj.height / 2);
            this.diagram.add(swimLaneobj);
        }
    }

    /** @private */
    public mouseLeave(evt: PointerEvent): void {
        //Define what has to happen on mouse leave
        if (this.tool && this.inAction) {
            this.tool.mouseLeave(this.eventArgs);
        }
        if (this.diagram.selectedObject.helperObject) {
            this.updateContainerProperties();
            let isGroupAction: boolean = this.updateContainerBounds();
            if (isGroupAction) {
                this.diagram.endGroupAction();
            }
        }
        if (this.eventArgs && this.eventArgs.source) {
            this.diagram.updatePortVisibility(this.eventArgs.source as Node, PortVisibility.Hover, true);
            this.hoverElement = null;
        }
        if (this.eventArgs && !this.eventArgs.source && this.hoverElement) {
            this.hoverElement = null;
        }
        if (this.tool instanceof ConnectTool && this.eventArgs && this.eventArgs.target && this.eventArgs.target instanceof Node) {
            this.diagram.updatePortVisibility(this.eventArgs.target as Node, PortVisibility.Hover | PortVisibility.Connect, true);
            this.hoverElement = null;
        }
        let selector: SelectorModel = this.diagram.selectedItems;
        if (selector && selector.wrapper) {
            this.diagram.renderSelector(true);
        }
        if (this.diagram.diagramActions & DiagramAction.Interactions || this.diagram.diagramActions & DiagramAction.ToolAction) {
            this.diagram.diagramActions = this.diagram.diagramActions & ~DiagramAction.ToolAction;
        }
        this.isMouseDown = false;
        this.focus = false;
        this.touchStartList = null;
        this.touchMoveList = null;
        this.elementLeave();
        this.commandHandler.removeSnap();
        this.inAction = false;
        this.eventArgs = {};
        if (this.diagram.selectedObject && this.diagram.selectedObject.helperObject) {
            this.diagram.remove(this.diagram.selectedObject.helperObject);
            this.diagram.selectedObject = { helperObject: undefined, actualObject: undefined };
        }
        this.tool = null;
        removeRulerMarkers();
        if (this.action === 'Rotate') {
            this.diagram.diagramCanvas.classList.remove('e-diagram-rotate');
        }
        evt.preventDefault();
    }
    /** @private */
    public mouseWheel(evt: WheelEvent): void {
        this.diagram.blazorActions |= BlazorAction.interaction;
        let up: boolean = (evt.wheelDelta > 0 || -40 * evt.detail > 0) ? true : false;
        let mousePosition: PointModel = this.getMousePosition(evt);
        this.diagram.tooltipObject.close();
        let ctrlKey: boolean = this.isMetaKey(evt);
        if (ctrlKey) {
            this.diagram.zoom(up ? (1.2) : 1 / (1.2), mousePosition);
            evt.preventDefault();
        } else {
            let horizontalOffset: number = this.diagram.scroller.horizontalOffset;
            let verticalOffset: number = this.diagram.scroller.verticalOffset;
            let change: number = up ? 20 : -20;
            if (this.tool && (this.tool instanceof PolygonDrawingTool || this.tool instanceof PolyLineDrawingTool)) {
                this.eventArgs = {};
                this.getMouseEventArgs(mousePosition, this.eventArgs);
                this.eventArgs.position = mousePosition;
                this.tool.mouseWheel(this.eventArgs);
            }
            this.diagram.scrollActions |= ScrollActions.Interaction;
            if (evt.shiftKey) {
                this.diagram.scroller.zoom(1, change, 0, mousePosition);
            } else {
                this.diagram.scroller.zoom(1, 0, change, mousePosition);
            }
            this.diagram.scrollActions &= ~ScrollActions.Interaction;
            if (horizontalOffset !== this.diagram.scroller.horizontalOffset
                || verticalOffset !== this.diagram.scroller.verticalOffset) {
                evt.preventDefault();
            }
        }
        if (this.diagram.textEditing) {
            this.diagram.isTriggerEvent = true;
            if (this.diagram.activeLabel.parentId) {
                let node: NodeModel | ConnectorModel = this.diagram.getObject(this.diagram.activeLabel.parentId);
                this.diagram.startTextEdit(node, this.diagram.activeLabel.id);
            }
            this.diagram.isTriggerEvent = false;
        }
        this.diagram.blazorActions = this.diagram.blazorActions & ~BlazorAction.interaction;
    }
    private keyArgs: IKeyEventArgs = {};
    /** @private */
    public keyDown(evt: KeyboardEvent): void {
        if (!(this.diagram.diagramActions & DiagramAction.TextEdit) &&
            !(this.checkEditBoxAsTarget(evt)) || (evt.key === 'Escape' || evt.keyCode === 27)) {
            let i: string; let inAction: string = 'inAction';
            let command: CommandModel;
            let keycode: number = evt.keyCode ? evt.keyCode : evt.which;
            let key: string = evt.key;
            let ctrlKey: boolean = this.isMetaKey(evt);
            if (this.diagram.commandManager && this.diagram.commands) {
                let commands: {} = this.diagram.commands;
                for (let i of Object.keys(commands)) {
                    command = this.diagram.commands[i];
                    if (command && (command.gesture.keyModifiers || command.gesture.key)) {
                        if ((keycode === command.gesture.key || (key === Keys[command.gesture.key])
                            || this.isDeleteKey(key, i))
                            && (((!command.gesture.keyModifiers) && (!evt.altKey) && (!evt.shiftKey) && (!ctrlKey)) ||
                                (command.gesture.keyModifiers && (ctrlKey || evt.altKey || evt.shiftKey) &&
                                    (this.altKeyPressed(command.gesture.keyModifiers) && evt.altKey) ||
                                    (this.shiftKeyPressed(command.gesture.keyModifiers) && evt.shiftKey) ||
                                    (this.ctrlKeyPressed(command.gesture.keyModifiers) && ctrlKey)))) {
                            let canExecute: Function = getFunction(command.canExecute);
                            if (isBlazor() || (canExecute &&
                                canExecute({
                                    'keyDownEventArgs': KeyboardEvent,
                                    parameter: command.parameter
                                }))) {
                                evt.preventDefault();
                                if (evt.key === 'Escape') {
                                    if (this.checkEditBoxAsTarget(evt)) {
                                        document.getElementById(this.diagram.diagramCanvas.id).focus();
                                    } else if (this.diagram.currentSymbol) {
                                        let selectedSymbols: string = 'selectedSymbols';
                                        let source: string = 'sourceElement'; let intDestroy: string = 'intDestroy';
                                        this.diagram.removeFromAQuad(this.diagram.currentSymbol);
                                        this.diagram.removeObjectsFromLayer(this.diagram.nameTable[this.diagram.currentSymbol.id]);
                                        this.diagram.removeElements(this.diagram.currentSymbol);
                                        removeChildNodes(this.diagram.currentSymbol as Node, this.diagram);
                                        delete this.diagram.nameTable[this.diagram.currentSymbol.id];
                                        let sourceElement: HTMLElement = this.diagram.droppable[source];
                                        sourceElement.draggable[intDestroy]();
                                        let element: HTMLElement = this.diagram.droppable[selectedSymbols];
                                        element.parentNode.removeChild(element);
                                        let diagramActions: DiagramAction = this.diagram.diagramActions;
                                        this.diagram.diagramActions =
                                            this.diagram.addConstraints(diagramActions, DiagramAction.PreventClearSelection);
                                        this.tool.mouseUp(this.eventArgs);
                                        this.diagram.diagramRenderer.rendererActions = this.diagram.removeConstraints(
                                            this.diagram.diagramRenderer.rendererActions, RendererAction.DrawSelectorBorder
                                        );
                                        if (this.diagram.previousSelectedObject) {
                                            this.diagram.select(this.diagram.previousSelectedObject);
                                        }
                                        this.action = 'Select';
                                        this.diagram.previousSelectedObject = null;
                                        this.diagram.currentSymbol = null;
                                        this.diagram.diagramActions =
                                            this.diagram.removeConstraints(diagramActions, DiagramAction.PreventClearSelection);
                                        this.isMouseDown = false;
                                    } else if (this.inAction && this.diagram.drawingObject && this.tool && this.tool[inAction]) {
                                        this.tool.mouseUp(this.eventArgs);
                                        this.tool = null;
                                        this.isMouseDown = false;
                                    }
                                }
                                if (command.execute) {
                                    if (this.diagram.tool !== DiagramTools.ZoomPan) {
                                        // if (i === 'nudgeUp' || i === 'nudgeRight' || i === 'nudgeDown' || i === 'nudgeLeft') {
                                        //     command.execute()
                                        // } else {
                                        let execute: Function = getFunction(command.execute);
                                        execute({ 'keyDownEventArgs': KeyboardEvent, parameter: command.parameter });
                                    }
                                    // }
                                }
                                if (isBlazor()) {
                                    let arg: ICommandExecuteEventArgs = { gesture: command.gesture };
                                    this.diagram.triggerEvent(DiagramEvent.commandExecute, arg);
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        let selectedObject: (NodeModel | ConnectorModel)[] = (this.diagram.selectedItems.nodes.length) ?
            this.diagram.selectedItems.nodes : this.diagram.selectedItems.connectors;
        this.keyArgs = {
            element: cloneBlazorObject(this.diagram.selectedItems),
            key: evt.key, keyCode: evt.keyCode ? evt.keyCode : evt.which,
        };
        this.getKeyModifier(this.keyArgs, evt);
        if ((this.diagram.diagramActions & DiagramAction.TextEdit)) {
            this.getlabel(this.keyArgs, evt);
        }
        this.diagram.triggerEvent(DiagramEvent.keyDown, this.keyArgs);

    }

    private getlabel(args: IKeyEventArgs, evt: KeyboardEvent): void {
        let label: ActiveLabel = this.diagram.activeLabel;
        args.target = this.diagram.element.id + '_editBox';
        let node: NodeModel = this.diagram.nameTable[label.parentId];
        if (document.getElementById(this.diagram.element.id + '_editBox')) {
            args.text = (document.getElementById(this.diagram.element.id + '_editBox') as HTMLTextAreaElement).value;
            for (let i: number = 0; i < node.annotations.length; i++) {
                if (node.annotations[i].id === label.id) {
                    args.label = node.annotations[i];
                    break;
                }
            }
        }
    }

    private getKeyModifier(args: IKeyEventArgs, evt: KeyboardEvent): void {
        args.keyModifiers = KeyModifiers.None;
        if (evt.ctrlKey) {
            args.keyModifiers |= KeyModifiers.Control;
        }
        if (evt.shiftKey) {
            args.keyModifiers |= KeyModifiers.Shift;
        }
        if (evt.altKey) {
            args.keyModifiers |= KeyModifiers.Alt;
        }
        if (this.isMetaKey(evt)) {
            args.keyModifiers |= KeyModifiers.Meta;
        }
    }

    public keyUp(evt: KeyboardEvent): void {
        this.keyArgs = {
            element: cloneBlazorObject(this.diagram.selectedItems), key: evt.key, keyCode: evt.keyCode ? evt.keyCode : evt.which,
        };
        let selectedObject: (NodeModel | ConnectorModel)[] = (this.diagram.selectedItems.nodes.length) ?
            this.diagram.selectedItems.nodes : this.diagram.selectedItems.connectors;
        this.getKeyModifier(this.keyArgs, evt);
        if ((this.diagram.diagramActions & DiagramAction.TextEdit)) {
            this.getlabel(this.keyArgs, evt);
        }
        this.diagram.triggerEvent(DiagramEvent.keyUp, this.keyArgs);
    }

    private startAutoScroll(e: PointerEvent | TouchEvent): string {
        let position: PointModel = this.getMousePosition(e);
        position.x *= this.diagram.scroller.currentZoom;
        position.y *= this.diagram.scroller.currentZoom;
        let rulerSize: Size = getRulerSize(this.diagram);
        let movingPosition: string;
        let autoScrollBorder: MarginModel = this.diagram.scrollSettings.autoScrollBorder;
        if (Browser.info.name === 'mozilla') {
            if (this.diagram.scroller.viewPortWidth === 0) {
                let bounds: ClientRect | DOMRect = document.getElementById(this.diagram.element.id).getBoundingClientRect();
                if (bounds.width !== this.diagram.scroller.viewPortWidth) {
                    this.diagram.scroller.setViewPortSize(bounds.width, bounds.height);
                }
            }
        }
        if (this.diagram.scrollSettings.canAutoScroll) {
            if (position.x + this.diagram.scroller.horizontalOffset + autoScrollBorder.right + rulerSize.width >=
                this.diagram.scroller.viewPortWidth - 18) {
                movingPosition = 'right';
            } else if (position.x + this.diagram.scroller.horizontalOffset < autoScrollBorder.left) {
                movingPosition = 'left';
            } else if (position.y + this.diagram.scroller.verticalOffset + autoScrollBorder.bottom + rulerSize.height >
                this.diagram.scroller.viewPortHeight - 18) {
                movingPosition = 'bottom';
            } else if (position.y + this.diagram.scroller.verticalOffset < autoScrollBorder.top) {
                movingPosition = 'top';
            }
        }
        return movingPosition;
    }

    private doAutoScroll(option: string, e: PointerEvent | TouchEvent, delay?: number, autoScroll?: boolean): void {
        let position: string = option;
        if ((this.tool instanceof NodeDrawingTool || this.tool instanceof ConnectorDrawingTool
            || this.tool instanceof MoveTool || this.tool instanceof ResizeTool
            || this.tool instanceof SelectTool) && this.inAction) {
            let diagram: DiagramEventHandler = this;
            let pos: PointModel = this.getMousePosition(e);
            let autoScrollBorder: MarginModel = this.diagram.scrollSettings.autoScrollBorder;
            let newDelay: number = delay ? delay : 100;
            let left: number = 0; let top: number = 0;
            let point: PointModel = { x: pos.x, y: pos.y };
            switch (position) {
                case 'right':
                    point.x = pos.x + 10;
                    left = 10;
                    break;
                case 'left':
                    point.x = pos.x - 10;
                    left = -10;
                    break;
                case 'bottom':
                    point.y = pos.y + 10;
                    top = 10;
                    break;
                case 'top':
                    point.y = pos.y - 10;
                    top = -10;
                    break;
            }
            this.eventArgs.position = { x: point.x, y: point.y };
            this.currentPosition = this.eventArgs.position;
            let objects: IElement[] = this.objectFinder.findObjectsUnderMouse(
                this.currentPosition, this.diagram, this.eventArgs, null, this.action);
            this.eventArgs.target = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
            this.tool.mouseMove(this.eventArgs);
            this.diagram.scrollActions |= ScrollActions.Interaction;
            this.diagram.scroller.zoom(1, -left, -top, pos);
            this.diagram.scrollActions &= ~ScrollActions.Interaction;
        }
    }
    private mouseEvents(): void {
        let target: (NodeModel | ConnectorModel)[] = this.diagram.findObjectsUnderMouse(this.currentPosition);
        for (let i: number = 0; i < target.length; i++) {
            if (this.eventArgs.actualObject === target[i]) {
                target.splice(i, 1);
            }
        }
        let arg: IMouseEventArgs | IBlazorMouseEventArgs = {
            targets: {} as NodeModel[]
        } as IMouseEventArgs;
        if (!isBlazor()) {
            arg = {
                targets: cloneBlazorObject(target) as NodeModel[],
                element: cloneBlazorObject((this.eventArgs.source === this.eventArgs.actualObject) ? undefined : this.eventArgs.source),
                actualObject: cloneBlazorObject(this.eventArgs.actualObject)
            };
        }
        if (isBlazor() && (this.diagram.mouseEnter || this.diagram.mouseOver)) {
            arg.actualObject = getObjectType(this.eventArgs.actualObject) === Connector ? {
                connector: cloneBlazorObject(this.eventArgs.actualObject)
            }
                : {
                    node: cloneBlazorObject(this.eventArgs.actualObject)
                };
            (arg as IBlazorMouseEventArgs).targets.connector = [];
            (arg as IBlazorMouseEventArgs).targets.node = [];
            this.getBlazorCollectionObject(target, arg as IBlazorMouseEventArgs);
        }
        if (this.lastObjectUnderMouse && this.diagram.mouseLeave
            && (!this.eventArgs.actualObject || (this.lastObjectUnderMouse !== this.eventArgs.actualObject))) {
            let arg: IMouseEventArgs | IBlazorMouseEventArgs = {
                targets: undefined, element: cloneBlazorObject(this.lastObjectUnderMouse), actualObject: undefined
            };
            if (isBlazor()) {
                arg = {
                    targets: undefined,
                    element: getObjectType(this.lastObjectUnderMouse) === Connector ? { connector: cloneBlazorObject(target) }
                        : {
                            node: cloneBlazorObject(this.lastObjectUnderMouse)
                        },
                    actualObject: undefined
                } as IBlazorMouseEventArgs;
            }
            this.diagram.triggerEvent(DiagramEvent.mouseLeave, arg);
            this.lastObjectUnderMouse = null;
        }
        if (!this.lastObjectUnderMouse && this.eventArgs.source || (this.lastObjectUnderMouse !== this.eventArgs.actualObject)) {
            this.lastObjectUnderMouse = this.eventArgs.actualObject;
            if (this.eventArgs.actualObject !== undefined) {
                this.diagram.triggerEvent(DiagramEvent.mouseEnter, arg);
            }
        }
        if (this.eventArgs.actualObject) {
            this.diagram.triggerEvent(DiagramEvent.mouseOver, arg);
        }
    }

    private getBlazorCollectionObject(obj: (NodeModel | ConnectorModel)[], arg1: IBlazorMouseEventArgs): void {
        if (obj) {
            for (let i: number = 0; i < obj.length; i++) {
                if (getObjectType(obj[i]) === Connector) {
                    arg1.targets.connector.push(cloneBlazorObject(obj[i]));
                } else {
                    arg1.targets.node.push(cloneBlazorObject(obj[i]));
                }
            }
        }
    }

    private elementEnter(mousePosition: PointModel, elementOver: Boolean): void {
        if (!elementOver) {
            let isPrivateTooltip: number = ((this.hoverElement instanceof Node) &&
                (this.hoverElement as Node).constraints & NodeConstraints.Tooltip) ||
                ((this.hoverElement instanceof Connector) && (this.hoverElement as Connector).constraints & ConnectorConstraints.Tooltip);
            let content: string | HTMLElement = this.getContent();
            if (this.hoverElement.tooltip.openOn === 'Auto' && content !== '') {
                updateTooltip(this.diagram, isPrivateTooltip ? this.hoverElement : undefined);
            }
            let offset: PointModel = getTooltipOffset(this.diagram, mousePosition, this.hoverElement);
            if (this.hoverElement.tooltip.openOn === 'Auto' && content !== '') {
                (this.diagram.tooltipObject as Tooltip).close();
                (this.diagram.tooltipObject as DiagramTooltipModel).openOn = (this.hoverElement.tooltip as DiagramTooltipModel).openOn;
                this.diagram.tooltipObject.offsetX = offset.x;
                this.diagram.tooltipObject.offsetY = offset.y;
                if (isBlazor()) {
                    (this.diagram.tooltipObject as BlazorTooltip).open(this.diagram.element, {});
                } else {
                    (this.diagram.tooltipObject as Tooltip).dataBind();
                }
            }
            if (canEnableToolTip(this.hoverElement, this.diagram) && this.hoverElement.tooltip.openOn === 'Auto') {
                (this.diagram.tooltipObject as Tooltip).open(this.diagram.element);
            }
        }
    }

    private elementLeave(): void {
       if (this.diagram.tooltipObject && (this.diagram.tooltipObject as DiagramTooltipModel).openOn !== 'Custom') {
            this.diagram.tooltipObject.close();
       }
    }

    private altKeyPressed(keyModifier: KeyModifiers): boolean {
        if (keyModifier & KeyModifiers.Alt) {
            return true;
        }
        return false;
    }

    private ctrlKeyPressed(keyModifier: KeyModifiers): boolean {
        if (keyModifier & KeyModifiers.Control) {
            return true;
        }
        return false;
    }
    private shiftKeyPressed(keyModifier: KeyModifiers): boolean {
        if (keyModifier & KeyModifiers.Shift) {
            return true;

        }
        return false;
    }

    /** @private */
    public scrolled(evt: PointerEvent): void {
        this.diagram.updateScrollOffset();
        if (isBlazor() && (this.diagram.realActions & RealAction.OverViewAction)) {
            this.diagram.setBlazorDiagramProps(false);
        }
    }

    /** @private */
    public doubleClick(evt: PointerEvent): void {
        if (canUserInteract(this.diagram)) {
            let annotation: DiagramElement;
            let objects: IElement[] = this.diagram.findObjectsUnderMouse(this.currentPosition);
            let obj: IElement = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
            if (obj !== null && canUserInteract(this.diagram)) {
                let node: (NodeModel | ConnectorModel) = obj;
                annotation = this.diagram.findElementUnderMouse(obj, this.currentPosition);
                if (this.tool && (this.tool instanceof PolygonDrawingTool || this.tool instanceof PolyLineDrawingTool)) {
                    let arg: IDoubleClickEventArgs = {
                        source: cloneBlazorObject(obj) || cloneBlazorObject(this.diagram),
                        position: this.currentPosition, count: evt.detail
                    };
                    this.tool.mouseUp(this.eventArgs);
                    this.isMouseDown = false;
                    this.eventArgs = {};
                    this.tool = null;
                    evt.preventDefault();
                } else {
                    let layer: LayerModel = this.diagram.commandHandler.getObjectLayer((obj as NodeModel).id);
                    if (layer && !layer.lock && layer.visible) {
                        if (!(this.diagram.diagramActions & DiagramAction.TextEdit)) {
                            let id: string = '';
                            if (((obj as Node).shape as BpmnShapeModel).shape === 'TextAnnotation') {
                                id = obj.wrapper.children[1].id.split('_')[1];
                            }
                            this.diagram.startTextEdit
                                (obj, id || (annotation instanceof TextElement ?
                                    (annotation.id).split((obj as Node).id + '_')[1] : undefined));
                        }
                    }
                }
            }
            let arg: IDoubleClickEventArgs | IBlazorDoubleClickEventArgs = {
                source: cloneBlazorObject(obj) || cloneBlazorObject(this.diagram),
                position: this.currentPosition, count: evt.detail
            };
            if (isBlazor()) {
                let selector: SelectorModel;
                if (obj instanceof Node) {
                    selector = { nodes: [cloneBlazorObject(obj) as Node] };
                } else if (obj instanceof Connector) {
                    selector = { connectors: [cloneBlazorObject(obj) as Connector] };
                } else {
                    selector = cloneBlazorObject(obj);
                }
                arg = {
                    source: obj ? { selector: selector } : { diagram: cloneBlazorObject(this.diagram) },
                    position: this.currentPosition, count: evt.detail
                } as IBlazorDoubleClickEventArgs;
            }
            this.diagram.triggerEvent(DiagramEvent.doubleClick, arg);
        }
    }

    /**
     * @private
     */
    public itemClick(actualTarget: NodeModel, diagram: Diagram): NodeModel {
        let obj: Node = actualTarget as Node;
        if (checkParentAsContainer(this.diagram, obj, true)) {
            return obj;
        }
        return null;
    }

    /**
     * @private
     */
    public inputChange(evt: InputArgs): void {
        let minWidth: number = 90; let maxWidth: number;
        let minHeight: number = 12; let fontsize: number;
        let textWrapper: DiagramElement;
        let node: NodeModel | ConnectorModel;
        let height: number; let width: number;
        let textBounds: Size; let textBoxWidth: number;
        let transforms: TransformFactor; let scale: number;
        let editTextBox: HTMLElement = document.getElementById(this.diagram.element.id + '_editBox');
        let editTextBoxDiv: HTMLElement = document.getElementById(this.diagram.element.id + '_editTextBoxDiv');
        let text: string = ((editTextBox as HTMLTextAreaElement).value);
        let line: string[] = text.split('\n');
        node = (this.diagram.selectedItems.nodes[0]) ? this.diagram.selectedItems.nodes[0] : this.diagram.selectedItems.connectors[0];
        if ((!node && this.tool instanceof TextDrawingTool) || (node && node.shape.type === 'SwimLane')) {
            node = this.diagram.nameTable[this.diagram.activeLabel.parentId];
        }
        if (node && ((node.shape.type !== 'Text' && node.annotations.length > 0) || (node.shape.type === 'Text'))) {
            textWrapper = this.diagram.getWrapper(node.wrapper, this.diagram.activeLabel.id);

            maxWidth = node.wrapper.bounds.width < textWrapper.bounds.width ? node.wrapper.bounds.width : textWrapper.bounds.width;
            maxWidth = maxWidth > minWidth ? maxWidth : minWidth;
            textBounds = measureHtmlText(textWrapper.style, text, undefined, undefined, maxWidth);
            fontsize = Number((editTextBox.style.fontSize).split('px')[0]);
            if (line.length > 1 && line[line.length - 1] === '') {
                textBounds.height = textBounds.height + fontsize;
            }
            transforms = this.diagram.scroller.transform;
            scale = canZoomTextEdit(this.diagram) ? transforms.scale : 1;
            width = textBounds.width;
            width = ((minWidth > width) ? minWidth : width) * scale;
            height = ((minHeight > textBounds.height) ? minHeight : textBounds.height) * scale;
            editTextBoxDiv.style.left = ((((textWrapper.bounds.center.x + transforms.tx) * transforms.scale) - width / 2) - 2.5) + 'px';
            editTextBoxDiv.style.top = ((((textWrapper.bounds.center.y + transforms.ty) * transforms.scale) - height / 2) - 3) + 'px';
            editTextBoxDiv.style.width = width + 'px';
            editTextBoxDiv.style.height = height + 'px';
            editTextBox.style.minHeight = minHeight + 'px';
            editTextBox.style.minWidth = minWidth + 'px';
            editTextBox.style.width = width + 'px';
            editTextBox.style.height = height + 'px';
        }
    }

    /**
     * @private
     */
    public isAddTextNode(node: Node | Connector, focusOut?: boolean): boolean {
        if (this.tool instanceof TextDrawingTool || focusOut) {
            this.tool = null;
            if (node && (!(canContinuousDraw(this.diagram)))) {
                this.diagram.drawingObject = undefined;
                this.diagram.currentDrawingObject = undefined;
            }
            if (getObjectFromCollection(this.diagram.nodes, node.id) ||
                getObjectFromCollection(this.diagram.connectors, node.id) ||
                (this.diagram.bpmnModule && this.diagram.bpmnModule.textAnnotationConnectors.indexOf(node as Connector) > -1)) {
                return false;
            }
            return true;
        }
        return false;
    }


    private checkEditBoxAsTarget(evt: PointerEvent | KeyboardEvent | TouchEvent): boolean {
        if ((evt.target && (evt.target as HTMLElement).id === this.diagram.element.id + '_editBox')) {
            return true;
        }
        return false;
    }

    private getMouseEventArgs(position: PointModel, args: MouseEventArgs, source?: IElement, padding?: number): MouseEventArgs {
        args.position = position;
        let obj: IElement;
        let objects: IElement[];
        if (!source) {
            if (this.action === 'Drag' || this.action === 'ConnectorSourceEnd' || this.action === 'SegmentEnd' ||
                this.action === 'OrthoThumb' || this.action === 'BezierSourceThumb' || this.action === 'BezierTargetThumb' ||
                this.action === 'ConnectorTargetEnd' || this.action.indexOf('Rotate') !== -1 || this.action.indexOf('Resize') !== -1) {
                obj = this.diagram.selectedItems as IElement;
                if (!this.diagram.currentSymbol && this.action === 'Drag' && obj && this.diagram.selectedItems.nodes.length > 0 &&
                    this.diagram.selectedItems.nodes[0].shape.type === 'SwimLane') {
                    objects = this.diagram.findObjectsUnderMouse(this.currentPosition);
                    obj = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
                }
            } else {
                objects = this.diagram.findObjectsUnderMouse(this.currentPosition);
                obj = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
            }
        } else {
            objects = this.diagram.findObjectsUnderMouse(this.currentPosition, source);
            obj = this.diagram.findTargetObjectUnderMouse(objects, this.action, this.inAction, args.position, source);
        }
        if (obj && (obj as Node).isHeader) {
            obj = this.diagram.nameTable[(obj as Node).parentId];
            this.eventArgs.actualObject = obj;
        }
        let wrapper: DiagramElement;
        if (obj) {
            wrapper = this.diagram.findElementUnderMouse(obj, this.currentPosition, padding);
            let currentConnector: ConnectorModel;
            let nearNode: IElement;
            let i: number;
            if ((wrapper && (obj as Node).ports && (obj as Node).ports.length && !checkPort(obj, wrapper) || !wrapper ||
                !(obj as Node)) && objects && objects.length && (source instanceof Selector)) {
                currentConnector = source.connectors[0];
                for (i = objects.length - 1; i >= 0; i--) {
                    nearNode = objects[i];
                    if ((nearNode instanceof Node) && currentConnector && currentConnector.connectionPadding) {
                        obj = nearNode;
                        wrapper = this.diagram.findElementUnderMouse(obj, this.currentPosition, padding);
                        if (((currentConnector.constraints & ConnectorConstraints.ConnectToNearByPort) && (obj as Node) &&
                            (obj as Node).ports && (obj as Node).ports.length && checkPort(obj, wrapper))) {
                            break;
                        }
                        if ((nearNode instanceof Node) && currentConnector && currentConnector.connectionPadding
                            && nearNode.wrapper.outerBounds.containsPoint(this.currentPosition) &&
                            (currentConnector.constraints & ConnectorConstraints.ConnectToNearByNode) &&
                            !(currentConnector.constraints & ConnectorConstraints.ConnectToNearByPort)) {
                            obj = nearNode;
                            wrapper = this.diagram.findElementUnderMouse(obj, this.currentPosition, 0);
                            break;
                        }
                    }
                }
            }
        }
        if (!source) {
            args.source = obj;
            args.sourceWrapper = wrapper;
        } else {
            args.target = obj;
            args.targetWrapper = wrapper;
        }
        args.actualObject = this.eventArgs.actualObject;
        if (args.source instanceof Selector && args.actualObject === undefined &&
            (args.source.nodes.length > 0 || args.source.connectors.length > 0)) {
            args.actualObject = args.source.nodes.length > 0 ? this.diagram.nameTable[args.source.nodes[0].id]
                : this.diagram.nameTable[args.source.connectors[0].id];
        }
        args.startTouches = this.touchStartList;
        args.moveTouches = this.touchMoveList;
        return args;
    }

    /** @private */
    public resetTool(): void {
        this.action = 'Select';
        this.hoverElement = null;
        this.hoverNode = null;
        this.tool = this.diagram.getTool(this.action);
        this.updateCursor();
    }

    /** @private */
    public getTool(action: Actions): ToolBase {
        switch (action) {
            case 'Select':
                return new SelectTool(this.commandHandler, true);
            case 'Drag':
                return new MoveTool(this.commandHandler);
            case 'Rotate':
                return new RotateTool(this.commandHandler);
            case 'LayoutAnimation':
                return new ExpandTool(this.commandHandler);
            case 'FixedUserHandle':
                return new FixedUserHandleTool(this.commandHandler, true);

            case 'Hyperlink':
                return new LabelTool(this.commandHandler);
            case 'ResizeSouthEast':
            case 'ResizeSouthWest':
            case 'ResizeNorthEast':
            case 'ResizeNorthWest':
            case 'ResizeSouth':
            case 'ResizeNorth':
            case 'ResizeWest':
            case 'ResizeEast':
                return new ResizeTool(this.commandHandler, action);
            case 'ConnectorSourceEnd':
            case 'ConnectorTargetEnd':
            case 'BezierSourceThumb':
            case 'BezierTargetThumb':
                return new ConnectTool(this.commandHandler, action);
            case 'SegmentEnd':
            case 'OrthoThumb':
                return new ConnectorEditing(this.commandHandler, action);
            case 'Draw':
                let shape: string = 'shape'; let basicShape: string = 'basicShape';
                let type: string = findObjectType(this.diagram.drawingObject);
                if (type === 'Node' && this.diagram.drawingObject.shape.type === 'Text') {
                    return new TextDrawingTool(this.commandHandler);
                } else if (type === 'Node' && (this.diagram.drawingObject.shape[shape] === 'Polygon' ||
                    (isBlazor() && this.diagram.drawingObject.shape[basicShape] === 'Polygon')) &&
                    !((this.diagram.drawingObject.shape as BasicShapeModel).points)) {
                    return new PolygonDrawingTool(this.commandHandler);
                } else if (type === 'Node' ||
                    (type === 'Node' && this.diagram.drawingObject.shape[shape] === 'Polygon' &&
                        ((this.diagram.drawingObject.shape as BasicShapeModel).points))) {
                    return new NodeDrawingTool(this.commandHandler, this.diagram.drawingObject as Node);
                } else if (type === 'Connector' && (this.diagram.drawingObject as Connector).type === 'Polyline') {
                    return new PolyLineDrawingTool(
                        this.commandHandler);
                } else if (type === 'Connector') {
                    return new ConnectorDrawingTool(
                        this.commandHandler, 'ConnectorSourceEnd', this.diagram.drawingObject as Connector);
                }
                break;
            case 'Pan':
                return new ZoomPanTool(this.commandHandler, false);
            case 'PinchZoom':
                return new ZoomPanTool(this.commandHandler, true);
            case 'PortDrag':
                return new MoveTool(this.commandHandler, 'Port');
            case 'PortDraw':
                return new ConnectorDrawingTool(
                    this.commandHandler, 'ConnectorSourceEnd', this.diagram.drawingObject as Connector);
            case 'LabelSelect':
                return new SelectTool(this.commandHandler, true, 'LabelSelect');
            case 'LabelDrag':
                return new LabelDragTool(this.commandHandler);
            case 'LabelResizeSouthEast':
            case 'LabelResizeSouthWest':
            case 'LabelResizeNorthEast':
            case 'LabelResizeNorthWest':
            case 'LabelResizeSouth':
            case 'LabelResizeNorth':
            case 'LabelResizeWest':
            case 'LabelResizeEast':
                return new LabelResizeTool(this.commandHandler, action);
            case 'LabelRotate':
                return new LabelRotateTool(this.commandHandler);

            //for coverage
            // case 'Custom':
            //     return this.diagram.getTool(action);
        }
        return null;
    }
    /** @private */
    public getCursor(action: Actions): string {
        let object: DiagramElement | SelectorModel = ((this.diagram.selectedItems as Selector).annotation) ?
            this.diagram.selectedItems.wrapper.children[0] : this.diagram.selectedItems;
        let rotateAngle: number = ((this.diagram.selectedItems as Selector).annotation) ?
            (object.rotateAngle + (object as DiagramElement).parentTransform) : object.rotateAngle;
        return getCursor(action, rotateAngle);
    }

    //start region - interface betweend diagram and interaction
    /** @private */
    public findElementUnderMouse(obj: IElement, position: PointModel, padding?: number): DiagramElement {
        return this.objectFinder.findElementUnderSelectedItem(obj, position, padding);
    }
    /** @private */
    public findObjectsUnderMouse(position: PointModel, source?: IElement): IElement[] {
        return this.objectFinder.findObjectsUnderMouse(position, this.diagram, this.eventArgs, source);
    }
    /** @private */
    public findObjectUnderMouse(objects: (NodeModel | ConnectorModel)[], action: Actions, inAction: boolean): IElement {
        return this.objectFinder.findObjectUnderMouse(this.diagram, objects, action, inAction, this.eventArgs, this.currentPosition);
    }
    /** @private */
    public findTargetUnderMouse(
        objects: (NodeModel | ConnectorModel)[], action: Actions, inAction: boolean, position: PointModel, source?: IElement): IElement {
        return this.objectFinder.findObjectUnderMouse(this.diagram, objects, action, inAction, this.eventArgs, position, source);
    }
    /** @private */
    public findActionToBeDone(
        obj: NodeModel | ConnectorModel, wrapper: DiagramElement,
        position: PointModel, target?: NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel): Actions {
        return findToolToActivate(
            obj, wrapper, this.currentPosition, this.diagram, this.touchStartList, this.touchMoveList, target);
    }

    private updateContainerBounds(isAfterMouseUp?: boolean): boolean {
        let isGroupAction: boolean = false;
        if (this.diagram.selectedObject.helperObject && this.diagram.selectedObject.actualObject instanceof Node) {

            let boundsUpdate: boolean = (this.tool instanceof ResizeTool) ? true : false;
            let obj: NodeModel = this.diagram.selectedObject.actualObject;
            let parentNode: Node = this.diagram.nameTable[(obj as Node).parentId];

            if (isAfterMouseUp) {
                removeChildInContainer(this.diagram, obj, this.currentPosition, boundsUpdate);
            } else {
                if (!parentNode || (parentNode && parentNode.shape.type !== 'SwimLane')) {
                    this.diagram.updateDiagramObject(obj);
                }
                isGroupAction = updateCanvasBounds(this.diagram, obj, this.currentPosition, boundsUpdate);
                this.diagram.updateSelector();
                if ((obj as Node).isLane || (obj as Node).isPhase) {
                    this.diagram.clearSelection();
                    this.commandHandler.selectObjects([obj]);
                }
            }
        }
        return isGroupAction;
    }


    // tslint:disable-next-line:max-func-body-length
    private updateContainerProperties(): HistoryLog {
        let helperObject: NodeModel; let isChangeProperties: boolean = false;
        let hasStack: boolean; let connectors: string[]; let hasGroup: boolean = false; let obj: NodeModel;
        let history: HistoryLog = { hasStack: false, isPreventHistory: false };
        if (this.diagram.selectedObject.helperObject) {
            let objects: IElement[] = this.diagram.findObjectsUnderMouse(this.currentPosition);
            let target: IElement = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
            helperObject = this.diagram.selectedObject.helperObject as Node; obj = this.diagram.selectedObject.actualObject;
            if (obj instanceof Node) {
                if (obj.shape.type === 'SwimLane') {
                    connectors = getConnectors(this.diagram, (obj.wrapper.children[0] as GridPanel), 0, true);
                }
                if (obj.shape.type !== 'SwimLane' && (obj as Node).parentId &&
                    (this.diagram.getObject((obj as Node).parentId) as NodeModel).shape.type === 'SwimLane') {
                    if (target instanceof Node && this.diagram.getObject((target as Node).parentId) &&
                        (this.diagram.getObject((target as Node).parentId) as NodeModel).shape.type !== 'SwimLane') {
                        target = this.diagram.getObject(target.parentId) as Node;
                    }
                }
                if (this.currentAction === 'Drag' && obj.container && obj.container.type === 'Canvas' && (obj as Node).parentId &&
                    (this.diagram.getObject((obj as Node).parentId) as NodeModel).shape.type === 'SwimLane' && target && target !== obj &&
                    (target as Node).container && (target as Node).container.type === 'Canvas' && (target as Node).isLane &&
                    (obj as Node).isLane && (target as Node).parentId === (obj as Node).parentId) {
                    laneInterChanged(this.diagram, obj, (target as Node), this.currentPosition);
                    history.isPreventHistory = true;
                } else {
                    let parentNode: Node = this.diagram.nameTable[(obj as Node).parentId];
                    if (!parentNode || (parentNode && parentNode.shape.type !== 'SwimLane')) {
                        if (parentNode && parentNode.isLane && (obj.constraints & NodeConstraints.AllowMovingOutsideLane)) {
                            let swimlane: Node = this.diagram.getObject(parentNode.parentId) as Node;
                            let laneId: string = swimlane.id + (swimlane.shape as SwimLaneModel).lanes[0].id + '0';
                            let firstlane: NodeModel = this.diagram.getObject(laneId) as Node;
                            let x: number = firstlane.wrapper.bounds.x; let y: number = firstlane.wrapper.bounds.y;
                            let width: number = swimlane.wrapper.bounds.bottomRight.x - x;
                            let height: number = swimlane.wrapper.bounds.bottomRight.y - y;
                            let swimlaneBounds: Rect = new Rect(x, y, width, height);
                            if (swimlaneBounds.containsPoint(this.currentPosition)) {
                                (obj as Node).offsetX = helperObject.offsetX; (obj as Node).offsetY = helperObject.offsetY;
                                (obj as Node).width = helperObject.width; (obj as Node).height = helperObject.height;
                                (obj as Node).rotateAngle = helperObject.rotateAngle;
                            }
                        } else {

                            (obj as Node).offsetX = helperObject.offsetX; (obj as Node).offsetY = helperObject.offsetY;
                            if (obj && obj.shape && obj.shape.type !== 'UmlClassifier') {
                                if (obj.shape.type !== 'Bpmn' ||
                                    (obj.shape.type === 'Bpmn' && (obj.shape as BpmnShapeModel).shape !== 'TextAnnotation')) {
                                    (obj as Node).width = helperObject.width; (obj as Node).height = helperObject.height;
                                }
                            }
                            (obj as Node).rotateAngle = helperObject.rotateAngle;
                        }
                    }
                    let undoElement: StackEntryObject;
                    if (parentNode && parentNode.container && parentNode.container.type === 'Stack') {
                        this.diagram.startGroupAction(); hasGroup = true;
                    }
                    if (!target && parentNode && parentNode.container && parentNode.container.type === 'Stack' && this.action === 'Drag') {
                        let index: number = parentNode.wrapper.children.indexOf(obj.wrapper);
                        undoElement = { targetIndex: undefined, target: undefined, sourceIndex: index, source: clone(obj) };
                        if (index > -1) {
                            let children: string[] = parentNode.children; children.splice(children.indexOf(obj.id), 1);
                            this.diagram.nameTable[obj.id].parentId = ''; hasStack = true; parentNode.wrapper.children.splice(index, 1);
                        }
                    }
                    moveChildInStack(obj as Node, target as Node, this.diagram, this.action);
                    parentNode = checkParentAsContainer(this.diagram, obj) ? this.diagram.nameTable[(obj as Node).parentId] :
                        (this.diagram.nameTable[(obj as Node).parentId] || obj);
                    if (parentNode && parentNode.container && parentNode.container.type === 'Canvas') {
                        parentNode.wrapper.maxWidth = parentNode.maxWidth = parentNode.wrapper.actualSize.width;
                        parentNode.wrapper.maxHeight = parentNode.maxHeight = parentNode.wrapper.actualSize.height;
                        isChangeProperties = true;
                    }
                    if (checkParentAsContainer(this.diagram, obj, true) && parentNode && parentNode.container.type === 'Canvas') {
                        checkChildNodeInContainer(this.diagram, obj as NodeModel);
                    } else {
                        history = this.updateContainerPropertiesExtend(parentNode, obj, connectors, helperObject, history);
                    }
                    if ((this.diagram.lineRoutingModule && (this.diagram.constraints & DiagramConstraints.LineRouting))
                        && (!checkParentAsContainer(this.diagram, obj, true))) {
                        if (obj.children) {
                            this.diagram.realActions |= RealAction.EnableGroupAction;
                        }
                        this.diagram.nodePropertyChange(obj, {} as Node, {
                            width: obj.width, height: obj.height,
                            offsetX: obj.offsetX, offsetY: obj.offsetY
                        } as Node);
                        if (obj.children) {
                            this.diagram.realActions &= ~RealAction.EnableGroupAction;
                        }
                    }
                    if ((obj.shape as SwimLaneModel).lanes) {
                        this.updateLaneChildNode(obj);
                    }
                    if (isChangeProperties) {
                        parentNode.maxWidth = parentNode.wrapper.maxWidth = undefined;
                        parentNode.maxHeight = parentNode.wrapper.maxHeight = undefined;
                    }
                    if (hasStack) {
                        this.diagram.nodePropertyChange(parentNode, {} as Node, {
                            offsetX: parentNode.offsetX, offsetY: parentNode.offsetY, width: parentNode.width, height: parentNode.height,
                            rotateAngle: parentNode.rotateAngle
                        } as Node);
                        let entry: HistoryEntry = {
                            redoObject: { sourceIndex: undefined, source: undoElement.source } as NodeModel,
                            type: 'StackChildPositionChanged', undoObject: undoElement as NodeModel, category: 'Internal'
                        };
                        if (!(this.diagram.diagramActions & DiagramAction.UndoRedo)) { this.diagram.addHistoryEntry(entry); }
                    }
                    if (obj && obj.container && (obj.container.type === 'Stack' ||
                        (obj.container.type === 'Canvas' && (obj as Node).parentId === ''))) {
                        if (obj && obj.shape && obj.shape.type === 'UmlClassifier') {
                            obj.wrapper.measureChildren = true;
                        }
                        this.diagram.nodePropertyChange(obj as Node, {} as Node, {
                            offsetX: obj.offsetX, offsetY: obj.offsetY, width: obj.width, height: obj.height, rotateAngle: obj.rotateAngle
                        } as Node);
                        if (obj && obj.shape && obj.shape.type === 'UmlClassifier') {
                            obj.wrapper.measureChildren = false;
                        }
                    }
                }
                updateConnectorsProperties(connectors, this.diagram);
                history.hasStack = hasGroup;
            }
        }
        if (obj && ((obj as SwimLane).isPhase || (obj as SwimLane).isLane ||
            (obj.shape && obj.shape.type === 'SwimLane'))) {
            this.diagram.updateDiagramElementQuad();
        }
        return history;
    }


    private updateLaneChildNode(obj: NodeModel): void {
        for (let i: number = 0; i < ((obj.shape as SwimLaneModel).lanes.length); i++) {
            if ((obj.shape as SwimLaneModel).lanes[i].children && (obj.shape as SwimLaneModel).lanes[i].children.length > 0) {
                for (let j: number = 0; j < (obj.shape as SwimLaneModel).lanes[i].children.length; j++) {
                    let id: string = (obj.shape as SwimLaneModel).lanes[i].children[j].id;
                    let childNode: NodeModel = this.diagram.nameTable[id];
                    childNode.offsetX = childNode.wrapper.offsetX;
                    childNode.offsetY = childNode.wrapper.offsetY;
                }
            }
        }
    }

    private updateContainerPropertiesExtend(
        parentNode: Node, obj: NodeModel, connectors: string[], helperObject: NodeModel, history: HistoryLog): HistoryLog {
        if (this.currentAction === 'ResizeEast' || this.currentAction === 'ResizeSouth' || obj.shape.type === 'SwimLane') {
            let undoObj: NodeModel = cloneObject(obj); let isUpdateRow: boolean = false;
            if (parentNode && parentNode.container && parentNode.container.type === 'Grid') {
                let shape: boolean = parentNode.shape.type === 'SwimLane' ? true : false;
                let container: GridPanel = (shape ? parentNode.wrapper.children[0] : parentNode.wrapper) as GridPanel;
                let padding: number = shape ? (parentNode.shape as SwimLane).padding : undefined;
                let x: number = parentNode.wrapper.bounds.x; let y: number = parentNode.wrapper.bounds.y;
                if (obj.columnIndex !== undefined && (parentNode.container.orientation === 'Horizontal' &&
                    ((shape && (obj as Node).isPhase) || (!shape && obj.rowIndex === 1))) ||
                    (parentNode.container.orientation === 'Vertical' &&
                        ((!shape && obj.rowIndex > 0 && obj.columnIndex > 0) || (shape && (obj as Node).isLane)))) {
                    if (parentNode.container.orientation === 'Horizontal' && (obj as Node).isPhase && obj.wrapper.width > obj.maxWidth) {
                        obj.maxWidth = obj.wrapper.width;
                        obj.wrapper.maxWidth = obj.wrapper.width;
                    }
                    updateSwimLaneObject(this.diagram, obj as Node, parentNode, helperObject);
                    container.updateColumnWidth(obj.columnIndex, helperObject.width, true, padding);
                    if ((obj as Node).isPhase) {
                        let id: string = (parentNode.shape as SwimLaneModel).phases[obj.columnIndex].header.id;
                        let node: Node = this.diagram.nameTable[id];
                        if (node.maxWidth < helperObject.width) {
                            node.maxWidth = helperObject.width;
                            node.wrapper.maxWidth = helperObject.width;
                        }
                    }
                    if (parentNode.shape.type === 'SwimLane') {
                        parentNode.width = (parentNode.width) ? container.width : parentNode.width;
                        updateHeaderMaxWidth(this.diagram, parentNode);
                        parentNode.wrapper.width = parentNode.width;
                        connectors = getConnectors(this.diagram, container, obj.rowIndex, false);
                    }
                } else if (obj.rowIndex !== undefined) {
                    isUpdateRow = true;
                    updateSwimLaneObject(this.diagram, obj as Node, parentNode, helperObject);
                    container.updateRowHeight(obj.rowIndex, helperObject.height, true, padding);
                    if (parentNode.shape.type === 'SwimLane') {
                        parentNode.height = (parentNode.height) ? container.height : parentNode.height;
                        parentNode.wrapper.height = parentNode.height;
                        connectors = getConnectors(this.diagram, container, obj.rowIndex, true);
                    }
                }
                if (parentNode.shape.type === 'SwimLane') {
                    history.isPreventHistory = true;
                }
                this.diagram.nodePropertyChange(parentNode, {} as Node, {
                    offsetX: parentNode.offsetX, offsetY: parentNode.offsetY,
                    rotateAngle: parentNode.rotateAngle
                } as Node);
                this.diagram.drag(parentNode, x - parentNode.wrapper.bounds.x, y - parentNode.wrapper.bounds.y);
            } else {
                if (obj && obj.shape && obj.shape.type === 'UmlClassifier') {
                    obj.wrapper.measureChildren = true;
                }
                this.diagram.nodePropertyChange(obj as Node, {} as Node, {
                    offsetX: obj.offsetX, offsetY: obj.offsetY, width: obj.width, height: obj.height, rotateAngle: obj.rotateAngle
                } as Node);
                obj.wrapper.measureChildren = false;
            }
            obj.wrapper.measure(new Size(obj.wrapper.width, obj.wrapper.height));
            obj.wrapper.arrange(obj.wrapper.desiredSize);
            if (this.currentAction === 'ResizeEast' || this.currentAction === 'ResizeSouth') {
                let redoObject: NodeModel = cloneObject(obj);
                let entry: HistoryEntry = {
                    category: 'Internal',
                    type: (isUpdateRow) ? 'RowHeightChanged' : 'ColumnWidthChanged',
                    undoObject: undoObj, redoObject: redoObject
                };
                this.diagram.addHistoryEntry(entry);
            }
        }
        updateConnectorsProperties(connectors, this.diagram);
        return history;
    }

    private addUmlNode(): void {
        let node: NodeModel = this.diagram.selectedItems.nodes[0];
        let objects: IElement[] = this.diagram.findObjectsUnderMouse({ x: this.currentPosition.x + 20, y: this.currentPosition.y });
        let target: IElement = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
        if (!target) {
            objects = this.diagram.findObjectsUnderMouse({ x: this.currentPosition.x - 20, y: this.currentPosition.y });
            target = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
        }
        if (node && node.container && node.container.type === 'Stack' && (target as Node) && (target as Node).parentId
            && (target as Node).parentId === node.id) {
            let innerNode: NodeModel = target as NodeModel;
            let adornerSvg: SVGElement = getAdornerLayerSvg(this.diagram.element.id);
            let highlighter: SVGElement =
                (adornerSvg as SVGSVGElement).getElementById(adornerSvg.id + '_stack_highlighter') as SVGElement;
            if (highlighter) {
                let index: number = node.wrapper.children.indexOf(target.wrapper) + 1;
                this.diagram.enableServerDataBinding(false);
                let temp: NodeModel = new Node(
                    this.diagram, 'nodes', {
                        style: {
                            fill: node.style.fill,
                            strokeColor: (node.style.strokeColor === 'black') ? '#ffffff00' : node.style.strokeColor
                        },
                        annotations: (target as Node).annotations, verticalAlignment: 'Stretch', horizontalAlignment: 'Stretch',
                        constraints: (NodeConstraints.Default | NodeConstraints.HideThumbs) & ~
                            (NodeConstraints.Rotate | NodeConstraints.Drag | NodeConstraints.Resize),
                        minHeight: 25
                    } as NodeModel,
                    true);
                temp.annotations[0].content = ' + Name : Type';
                let id: string[] = innerNode.id.split('_');
                temp.id = randomId() + temp.id;
                (temp as Node).parentId = node.id;
                temp.zIndex = -1;
                (temp as Node).umlIndex = index;
                this.diagram.startGroupAction();
                let redoElement: StackEntryObject = {
                    sourceIndex: node.wrapper.children.indexOf(temp.wrapper), source: temp,
                    target: undefined, targetIndex: undefined
                };
                this.diagram.enableServerDataBinding(true);
                this.diagram.add(temp);
                this.diagram.updateConnectorEdges(node as Node);
                this.diagram.clearSelection();
                this.diagram.select([this.diagram.nameTable[temp.id]]);
                this.diagram.endGroupAction();
                this.diagram.startTextEdit();
            }
        }
    }
    //end region - interface
}

/** @private */
class ObjectFinder {
    /** @private */
    public findObjectsUnderMouse(
        pt: PointModel, diagram: Diagram, eventArgs: MouseEventArgs, source?: IElement, actions?: Actions): IElement[] {
        // finds the collection of the object that is under the mouse;
        let actualTarget: (NodeModel | ConnectorModel)[] = [];
        if (source && source instanceof Selector) {
            if (source.nodes.length + source.connectors.length === 1) {
                source = (source.nodes[0] || source.connectors[0]) as IElement;
                if ((source as Node).children && (source as Node).children.length === 0) {
                    eventArgs.actualObject = source;
                }
            }
        }
        let container: Container; let bounds: Rect; let child: DiagramElement; let matrix: Matrix;
        let endPadding: number = (source && (source instanceof Connector) &&
            ((source.constraints & ConnectorConstraints.ConnectToNearByNode) ||
                (source.constraints & ConnectorConstraints.ConnectToNearByPort)) && source.connectionPadding) || 0;
        let objArray: Object[] = diagram.spatialSearch.findObjects(
            new Rect(pt.x - 50 - endPadding, pt.y - 50 - endPadding, 100 + endPadding, 100 + endPadding));
        let layerObjTable: {} = {}; let layerTarger: (NodeModel | ConnectorModel)[];
        for (let obj of objArray) {
            let point: PointModel = pt; bounds = (obj as NodeModel).wrapper.outerBounds;
            let pointInBounds: boolean = ((obj as NodeModel).rotateAngle) ? false : bounds.containsPoint(point, endPadding);
            if ((obj !== source || diagram.currentDrawingObject instanceof Connector) &&
                (obj instanceof Connector) ? obj !== diagram.currentDrawingObject : true && (obj as NodeModel).wrapper.visible) {
                let layer: LayerModel = diagram.commandHandler.getObjectLayer((obj as NodeModel).id);
                if (layer && !layer.lock && layer.visible) {
                    layerTarger = layerObjTable[layer.zIndex] = layerObjTable[layer.zIndex] || [];
                    if ((obj as NodeModel).rotateAngle) {
                        container = (obj as NodeModel).wrapper;
                        bounds = cornersPointsBeforeRotation(container);
                        for (child of container.children) {
                            matrix = identityMatrix();
                            rotateMatrix(
                                matrix, -(child.rotateAngle + child.parentTransform), child.offsetX, child.offsetY);
                            point = transformPointByMatrix(matrix, pt);
                            if (cornersPointsBeforeRotation(child).containsPoint(point, endPadding)) { pointInBounds = true; }
                        }
                    }
                    if (!source || (isSelected(diagram, obj) === false)) {
                        if (canEnablePointerEvents(obj, diagram)) {
                            if ((obj instanceof Connector) ? isPointOverConnector(obj, pt) : pointInBounds) {
                                let padding: number = (obj instanceof Connector) ? obj.hitPadding || 0 : 0; let element: DiagramElement;
                                element = this.findElementUnderMouse(obj as IElement, pt, endPadding || padding);
                                if (element && (obj as Node).id !== 'helper') {
                                    insertObject(obj, 'zIndex', layerTarger);
                                }
                            }
                        }
                    }
                }
            }
        }
        for (let layer of diagram.layers) {
            actualTarget = actualTarget.concat(layerObjTable[layer.zIndex] || []);
            for (let obj of actualTarget) {
                let eventHandler: string = 'eventHandler';
                if (obj.shape.type === 'Bpmn' && (obj as Node).processId && (!(diagram[eventHandler].tool instanceof MoveTool) ||
                    (diagram[eventHandler].tool instanceof MoveTool) && canAllowDrop(obj))) {
                    let index: number = actualTarget.indexOf(diagram.nameTable[(obj as Node).processId]);
                    if (index > -1) { actualTarget.splice(index, 1); }
                }
                if (obj.shape.type === 'UmlClassifier' && (obj as Node).container && (obj as Node).container.type === 'Stack') {
                    let index: number = actualTarget.indexOf(diagram.nameTable[diagram.nameTable[obj.id].wrapper.children[0].id]);
                    if (index > -1) { actualTarget.splice(index, 1); }
                }
            }
        }
        for (let i: number = 0; i < actualTarget.length; i++) {
            let parentObj: NodeModel = diagram.nameTable[(actualTarget[i] as Node).parentId];
            if (parentObj) {
                let portElement: DiagramElement = this.findElementUnderMouse(parentObj as IElement, pt);
                for (let j: number = 0; j < parentObj.ports.length; j++) {
                    if (portElement.id.match('_' + parentObj.ports[j].id + '$')) {
                        let port: PointPortModel = parentObj.ports[j];
                        if (canDrag(port, diagram) || canDraw(port, diagram)) {
                            return actualTarget as IElement[];
                        }
                    }
                }
            }
            while (parentObj) {
                let index: number = actualTarget.indexOf(parentObj);
                if (index !== -1) {
                    actualTarget.splice(index, 1);
                } else { break; }
                parentObj = diagram.nameTable[(parentObj as Node).parentId];
            }
        }
        if (eventArgs && !eventArgs.source) {
            for (let i: number = 0; i < actualTarget.length; i++) {
                let parentNode: NodeModel = diagram.nameTable[(actualTarget[i] as Node).parentId];
                if (parentNode && parentNode.shape.type === 'SwimLane') {
                    for (let j: number = 0; j < actualTarget.length; j++) {
                        let connector: ConnectorModel | NodeModel = actualTarget[j];
                        if (connector instanceof Connector) { actualTarget.splice(i, 1); }
                    }
                }
            }
        }
        return actualTarget as IElement[];
    }
    /** @private */
    public isTarget(actualTarget: Node, diagram: Diagram, action: string): IElement {
        let connector: ConnectorModel = diagram.selectedItems.connectors[0];
        let node: Node;
        node = action === 'ConnectorSourceEnd' ? diagram.nameTable[connector.targetID] :
            node = diagram.nameTable[connector.sourceID];

        if (node && (!node.processId && !actualTarget.processId || node.processId !== actualTarget.processId)) {
            if (node.processId !== actualTarget.processId) {
                actualTarget = null;
            }
            if (actualTarget && actualTarget.parentId &&
                diagram.nameTable[actualTarget.parentId].shape.type === 'UmlClassifier') {
                actualTarget = diagram.nameTable[actualTarget.parentId];
            }
        }
        if (action === 'ConnectorSourceEnd' && connector.targetID) {
            let targetNode: NodeModel = diagram.nameTable[connector.targetID];
            if (targetNode && targetNode.shape && ((targetNode.shape as BpmnShapeModel).shape === 'TextAnnotation')) {
                let id: string[] = connector.id.split('_');
                if (((targetNode.shape.type === 'Bpmn') && actualTarget.shape.type !== 'Bpmn') || (id[0] === actualTarget.id) ||
                    (actualTarget.shape as BpmnShapeModel).shape === 'TextAnnotation') {
                    actualTarget = null;
                }
                if (actualTarget.parentId &&
                    diagram.nameTable[actualTarget.parentId].shape.type === 'UmlClassifier') {
                    actualTarget = diagram.nameTable[actualTarget.parentId];
                }
            }
        }
        return actualTarget;
    }
    /* tslint:disable */
    /** @private */
    public findObjectUnderMouse(
        diagram: Diagram, objects: (NodeModel | ConnectorModel)[], action: Actions,
        inAction: boolean, eventArg: MouseEventArgs, position?: PointModel, source?: IElement
    ): IElement {
        //we will get the wrapper object here
        //we have to choose the object to be interacted with from the given wrapper
        //Find the object that is under mouse

        let eventHandler: string = 'eventHandler';
        let endPoint: string = 'endPoint';
        let inPort: PointPortModel;
        let outPort: PointPortModel;
        let actualTarget: NodeModel | ConnectorModel = null;
        if (objects.length !== 0) {
            if (source && source instanceof Selector) {
                if (source.nodes.length + source.connectors.length === 1) {
                    source = (source.nodes[0] || source.connectors[0]) as IElement;
                }
            }
            if ((action === 'ConnectorSourceEnd' && source || action === 'PortDraw') ||
                ((canDrawOnce(diagram) || canContinuousDraw(diagram)) && getObjectType(diagram.drawingObject) === Connector)) {
                let connector: ConnectorModel = diagram.selectedItems.connectors[0];
                for (let i: number = objects.length - 1; i >= 0; i--) {
                    outPort = getInOutConnectPorts(objects[i] as Node, false);
                    inPort = getInOutConnectPorts(objects[i] as Node, true);
                    let tool: ConnectTool = (diagram[eventHandler].tool as ConnectTool);
                    var portElement = this.findTargetElement(objects[i].wrapper, position, undefined);

                    if (action === 'Draw' && portElement && (objects[i] instanceof Node) && !checkPort(objects[i], portElement)) {
                        if (((tool && tool[endPoint] === 'ConnectorSourceEnd') && !canOutConnect(objects[i] as NodeModel)) ||
                            ((tool && tool[endPoint] === 'ConnectorTargetEnd') && !canInConnect(objects[i] as NodeModel))) {
                            return actualTarget as IElement
                        }
                    }
                    if (objects[i] instanceof Node && ((canOutConnect(objects[i] as NodeModel) || (canPortOutConnect(outPort)) || canInConnect(objects[i] as NodeModel) || (canPortInConnect(inPort))) ||
                        (action === 'PortDraw' && (tool instanceof ConnectTool) && tool[endPoint] == 'ConnectorTargetEnd' &&
                            (canInConnect(objects[i] as NodeModel) || (canPortInConnect(inPort)))))) {
                        actualTarget = objects[i];
                        if (connector) {
                            actualTarget = this.isTarget(actualTarget as Node, diagram, action);
                        }
                        eventArg.actualObject = actualTarget as Node;
                        return actualTarget as IElement;
                    }
                }
            } else if (action === 'ConnectorTargetEnd' && source) {
                for (let i: number = objects.length - 1; i >= 0; i--) {
                    inPort = getInOutConnectPorts(objects[i] as Node, true);
                    if (objects[i] instanceof Node && (canInConnect(objects[i] as NodeModel) || (canPortInConnect(inPort)))) {
                        actualTarget = objects[i];
                        actualTarget = this.isTarget(actualTarget as Node, diagram, action);
                        eventArg.actualObject = actualTarget as Node;
                        return actualTarget as IElement;
                    }
                }
            } else if (source && (action === 'Drag' || (diagram[eventHandler].tool instanceof MoveTool))) {
                let index: number = 0;
                for (let i: number = 0; i < objects.length; i++) {
                    let temp: NodeModel | ConnectorModel = objects[i];
                    if (source !== temp && (temp instanceof Connector ||
                        !position || temp.wrapper.bounds.containsPoint(position))) {
                        if (canAllowDrop(temp as NodeModel | ConnectorModel)) {
                            if (!actualTarget) {
                                actualTarget = temp;
                                index = (actualTarget as Node | Connector).zIndex;
                            } else {
                                actualTarget = index >= (temp as Node | Connector).zIndex ? actualTarget : temp;
                                index = Math.max(index, (temp as Node | Connector).zIndex);
                            }
                        }
                    }
                }
                if (actualTarget && actualTarget.shape.type === 'Bpmn') {
                    if (diagram.selectedItems.nodes.length > 0 && diagram.selectedItems.nodes[0].shape.type === 'Bpmn') {
                        actualTarget = actualTarget;
                    } else {
                        actualTarget = null;
                    }
                }
                if (actualTarget) {
                    eventArg.actualObject = actualTarget as Node;
                }
                return actualTarget as IElement;
            } else if ((action === 'Select' || action === 'Pan') && diagram[eventHandler].tool) {
                for (let i: number = objects.length - 1; i >= 0; i--) {
                    if (objects[i] instanceof Connector) {
                        let objj1 = objects[i - 1] as NodeModel
                        if (objects[i - 1] instanceof Node && objj1.ports) {
                            let portElement: DiagramElement = this.findTargetElement(objj1.wrapper, position, undefined);
                            if ((portElement && (portElement.id.match('_icon_content_shape$') || portElement.id.match('_icon_content_rect$')))) {
                                return objj1 as IElement;
                            }
                            for (let j: number = 0; j < objj1.ports.length; j++) {
                                if (portElement && portElement.id.match('_' + objj1.ports[j].id + '$')) {
                                    if (canDraw(objj1.ports[j], diagram)) {
                                        return objj1 as IElement;
                                    }
                                }
                            }
                        }
                    }
                }
                actualTarget = objects[objects.length - 1];
                eventArg.actualObject = actualTarget as Node;
                if (!diagram[eventHandler].itemClick(actualTarget, true)) {
                    if ((actualTarget as Node).parentId) {
                        let obj: Node = actualTarget as Node;
                        let selected: boolean = isSelected(diagram, obj);
                        while (obj) {
                            if (isSelected(diagram, obj) && !selected) {
                                break;
                            }
                            actualTarget = obj;
                            obj = diagram.nameTable[obj.parentId];
                        }
                    }
                }
            } else if (action === 'Pan' || action === 'LayoutAnimation') {
                for (let i: number = objects.length - 1; i >= 0; i--) {
                    if (objects[i] instanceof Node || objects[i] instanceof Connector) {
                        let portElement = this.findTargetElement(objects[i].wrapper, position, undefined);
                        if ((action === 'Pan') || ((portElement && (portElement.id.match('_icon_content_shape$') || portElement.id.match('_icon_content_rect$'))))) {
                            return objects[i] as IElement;
                        }
                    }
                }
            } else {
                actualTarget = objects[objects.length - 1];
                if (eventArg && actualTarget) {
                    eventArg.actualObject = actualTarget as Node;
                }
            }
        }
        return actualTarget as IElement;
    }
    /* tslint:enable */
    /** @private */
    public findElementUnderSelectedItem(obj: IElement, position: PointModel, padding?: number): DiagramElement {
        //rewrite this for multiple selection
        if (obj instanceof Selector) {
            if (obj.nodes.length === 1 && (!obj.connectors || !obj.connectors.length)) {
                return this.findElementUnderMouse(obj.nodes[0] as IElement, position);
            } else if ((!obj.nodes || obj.nodes.length) && obj.connectors.length === 1) {
                return this.findElementUnderMouse(obj.connectors[0] as IElement, position);
            }
        } else {
            return this.findElementUnderMouse(obj, position, padding);
        }
        return null;
    }

    private findElementUnderMouse(obj: IElement, position: PointModel, padding?: number): DiagramElement {
        return this.findTargetElement(obj.wrapper, position, padding);
    }
    /** @private */
    public findTargetElement(container: Container, position: PointModel, padding?: number): DiagramElement {
        for (let i: number = container.children.length - 1; i >= 0; i--) {
            let element: DiagramElement = container.children[i];
            if (element && element.outerBounds.containsPoint(position, padding || 0)) {
                if (element instanceof Container) {
                    let target: DiagramElement = this.findTargetElement(element, position);
                    if (target) {
                        return target;
                    }
                }
                if (element.bounds.containsPoint(position, padding || 0)) {
                    return element;
                }
            }
        }

        if (container.bounds.containsPoint(position, padding) && container.style.fill !== 'none') {
            return container;
        }
        return null;
    }
}
/** @private */
export interface Info {
    ctrlKey?: boolean;
    shiftKey?: boolean;
}
/** @private */
export interface MouseEventArgs {
    position?: PointModel;
    source?: IElement;
    sourceWrapper?: DiagramElement;
    target?: IElement;
    targetWrapper?: DiagramElement;
    info?: Info;
    startTouches?: TouchList | ITouches[];
    moveTouches?: TouchList | ITouches[];
    clickCount?: number;
    actualObject?: IElement;
    portId?: string;
}

/** @private */
export interface HistoryLog {
    hasStack?: boolean;
    isPreventHistory?: boolean;
}
