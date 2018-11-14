import { PointModel } from '../primitives/point-model';
import { Point } from '../primitives/point';
import { IElement, IClickEventArgs, IDoubleClickEventArgs, IMouseEventArgs } from '../objects/interface/IElement';
import { DiagramElement } from '../core/elements/diagram-element';
import { Container } from '../core/containers/container';
import { MarginModel } from '../core/appearance-model';
import { Diagram } from '../diagram';
import { Connector } from '../objects/connector';
import { NodeDrawingTool, ConnectorDrawingTool, TextDrawingTool, PolygonDrawingTool, PolyLineDrawingTool } from './tool';
import { Node } from '../objects/node';
import { ConnectorModel } from '../objects/connector-model';
import { PointPortModel } from '../objects/port-model';
import { NodeModel, BpmnShapeModel, BasicShapeModel } from '../objects/node-model';
import { ToolBase, SelectTool, MoveTool, ResizeTool, RotateTool, ConnectTool, ExpandTool, LabelTool, ZoomPanTool } from './tool';
import { LabelDragTool, LabelResizeTool, LabelRotateTool } from './tool';
import { ConnectorEditing } from './connector-editing';
import { Selector } from './selector';
import { CommandHandler } from './command-manager';
import { Actions, findToolToActivate, isSelected, getCursor, contains } from './actions';
import { DiagramAction, KeyModifiers, Keys, DiagramEvent, DiagramTools } from '../enum/enum';
import { isPointOverConnector, findObjectType, insertObject, getObjectFromCollection, getTooltipOffset } from '../utility/diagram-util';
import { getObjectType } from '../utility/diagram-util';
import { canZoomPan, canDraw, canDrag, canZoomTextEdit } from './../utility/constraints-util';
import { canMove, canEnablePointerEvents, canSelect, canEnableToolTip } from './../utility/constraints-util';
import { canOutConnect, canInConnect, canAllowDrop, canUserInteract, defaultTool } from './../utility/constraints-util';
import { CommandModel } from '../diagram/keyboard-commands-model';
import { updateTooltip } from '../objects/tooltip';
import { PortVisibility, NodeConstraints, ConnectorConstraints } from '../enum/enum';
import { addTouchPointer, measureHtmlText } from '../utility/dom-util';
import { TextElement } from '../core/elements/text-element';
import { Size } from '../primitives/size';
import { TransformFactor } from '../interaction/scroller';
import { InputArgs } from '@syncfusion/ej2-inputs';
import { Rect } from '../primitives/rect';
import { identityMatrix, rotateMatrix, transformPointByMatrix, Matrix } from './../primitives/matrix';
import { LayerModel } from '../diagram/layer-model';
import { ITouches } from '../objects/interface/interfaces';
import { removeRulerMarkers, drawRulerMarkers, getRulerSize, updateRuler } from '../ruler/ruler';
import { canContinuousDraw, canDrawOnce } from '../utility/constraints-util';
import { SelectorModel } from './selector-model';
import { getFunction, cornersPointsBeforeRotation } from '../utility/base-util';
import { ShapeAnnotationModel, PathAnnotationModel } from '../objects/annotation-model';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';


/**
 * This module handles the mouse and touch events
 */
export class DiagramEventHandler {
    private currentAction: Actions = 'None';

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
                !(this.diagram.diagramActions & DiagramAction.TextEdit)) {
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
            this.blocked = (this.isMouseDown && list.length === 1 && this.tool instanceof SelectTool && !canMove(list[0]));
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
    public mouseDown(evt: PointerEvent): void {
        this.focus = true;
        let touches: TouchList;
        touches = (<TouchEvent & PointerEvent>evt).touches;
        if (this.isMouseOnScrollBar(evt)) {
            this.isScrolling = true;
            evt.preventDefault();
            return;
        }
        if (!this.checkEditBoxAsTarget(evt) && (canUserInteract(this.diagram)) ||
            (canZoomPan(this.diagram) && !defaultTool(this.diagram))) {
            if (this.action === 'Select' || this.action === 'Drag') {
                this.diagram.updatePortVisibility(this.hoverElement as Node, PortVisibility.Hover, true);
            }
            if (((this.tool instanceof PolygonDrawingTool || this.tool instanceof PolyLineDrawingTool)
                && (evt.button === 2 || evt.buttons === 2))) {
                let arg: IClickEventArgs = {
                    element: this.diagram, position: this.currentPosition, count: evt.buttons, actualObject: this.eventArgs.actualObject
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
                    this.diagram, objects, this.action, this.inAction, this.eventArgs, evt);
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
            this.eventArgs.sourceWrapper instanceof TextElement) {
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
                            if (this.hoverElement) {
                                this.elementLeave();
                                this.diagram.updatePortVisibility(this.hoverElement as Node, PortVisibility.Hover, true);
                            }
                            if (obj instanceof Node) {
                                this.hoverNode = obj;
                            }
                            this.hoverElement = obj;
                            this.elementEnter(this.currentPosition, false);
                        } else if (!this.hoverElement && this.hoverElement === obj) {
                            this.elementEnter(this.currentPosition, true);
                        }
                        if (sourceElement) { target = this.commandHandler.findTarget(sourceElement, obj); }
                    }
                    this.action = this.diagram.findActionToBeDone(obj, sourceElement, this.currentPosition, target);
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
                    let isNode: boolean = false;
                    if (!(this.hoverElement && (!(this.tool instanceof ZoomPanTool)) && obj instanceof Node &&
                        (this.diagram.selectedItems.nodes.length === 0 || !isSelected(this.diagram, this.hoverElement)))) {
                        isNode = true;
                    }
                    this.diagram.updatePortVisibility(this.hoverElement as Node, PortVisibility.Hover, isNode);
                    if (obj === null && this.hoverElement) {
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
                    this.getMouseEventArgs(this.currentPosition, this.eventArgs, this.eventArgs.source);
                    this.updateCursor();
                    this.inAction = true;
                    this.initialEventArgs = null;
                    this.mouseMoveExtend(e, obj);
                }
                this.prevPosition = this.currentPosition;
                if (!this.isForeignObject(e.target as HTMLElement, true)) {
                    e.preventDefault();
                }
            }
        }
    }

    private checkAutoScroll(e: PointerEvent | TouchEvent): void {
        let autoScrollPosition: string = this.startAutoScroll(e);
        if (!autoScrollPosition && this.doingAutoScroll) {
            this.doingAutoScroll = false;
            clearInterval(this.timeOutValue as number);
        } else if (autoScrollPosition) {
            if ((this.tool instanceof MoveTool || this.tool instanceof ResizeTool
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
    /** @private */
    public mouseUp(evt: PointerEvent): void {
        let touches: TouchList;
        touches = (<TouchEvent & PointerEvent>evt).touches;
        if (this.isScrolling) {
            this.isScrolling = false;
            evt.preventDefault();
            return;
        }
        if (!this.checkEditBoxAsTarget(evt) && (canUserInteract(this.diagram))
            || (canZoomPan(this.diagram) && !defaultTool(this.diagram))) {
            if (this.tool && (!(this.tool instanceof PolygonDrawingTool || this.tool instanceof PolyLineDrawingTool) ||
                ((this.tool instanceof PolygonDrawingTool || this.tool instanceof PolyLineDrawingTool)
                    && evt.detail === 2))) {
                if (!this.isForeignObject(evt.target as HTMLElement)) {
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
                            && evt.which === 1) {
                            isMultipleSelect = false;
                            this.commandHandler.clearSelection();
                        }
                        if (!isSelected(this.diagram, obj) || (!isMultipleSelect)) {
                            this.commandHandler.selectObjects([obj]);
                        }
                    }
                }
                this.inAction = false;
                this.isMouseDown = false;
                this.currentPosition = this.getMousePosition(evt);
                if (this.tool && (this.tool.prevPosition || this.tool instanceof LabelTool)) {
                    this.eventArgs.position = this.currentPosition;
                    this.getMouseEventArgs(this.currentPosition, this.eventArgs, this.eventArgs.source);
                    let ctrlKey: boolean = this.isMetaKey(evt);
                    if (ctrlKey || evt.shiftKey) {
                        let info: Info = (ctrlKey && evt.shiftKey) ? { ctrlKey: ctrlKey, shiftKey: evt.shiftKey } :
                            { ctrlKey: true };
                        this.eventArgs.info = info;
                    }
                    this.eventArgs.clickCount = evt.detail;
                    this.tool.mouseUp(this.eventArgs);
                }
                this.blocked = false;
                if (this.hoverElement) {
                    let portVisibility: PortVisibility = PortVisibility.Connect;
                    if (isSelected(this.diagram, this.hoverElement)) {
                        portVisibility |= PortVisibility.Hover;
                    }
                    this.diagram.updatePortVisibility(this.hoverElement as Node, portVisibility, true);
                    this.hoverElement = null;
                }
                this.touchStartList = null;
                this.touchMoveList = null;
                if (!(this.tool instanceof TextDrawingTool)) {
                    this.tool = null;
                }
            }
            if (!touches) {
                evt.preventDefault();
            }
            this.diagram.currentDrawingObject = undefined;
            let selector: SelectorModel = this.diagram.selectedItems;
            if (!this.inAction && selector.wrapper && selector.userHandles.length > 0) {
                this.diagram.renderSelector(true);
            }
            if (!this.inAction && !this.diagram.currentSymbol) {
                let arg: IClickEventArgs = {
                    element: this.eventArgs.source || this.diagram, position: this.eventArgs.position, count: evt.detail,
                    actualObject: this.eventArgs.actualObject
                };
                this.diagram.triggerEvent(DiagramEvent.click, arg);
            }
            this.eventArgs = {};
        }
        //end the corresponding tool
    }
    /** @private */
    public mouseLeave(evt: PointerEvent): void {
        //Define what has to happen on mouse leave
        if (this.tool && this.inAction) {
            this.tool.mouseLeave(this.eventArgs);
        }
        if (this.eventArgs && this.eventArgs.source) {
            this.diagram.updatePortVisibility(this.eventArgs.source as Node, PortVisibility.Hover, true);
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
        this.isMouseDown = false;
        this.focus = false;
        this.touchStartList = null;
        this.touchMoveList = null;
        this.commandHandler.removeSnap();
        this.inAction = false;
        this.eventArgs = {};
        this.tool = null;
        removeRulerMarkers();
        if (this.action === 'Rotate') {
            this.diagram.diagramCanvas.classList.remove('e-diagram-rotate');
        }
        evt.preventDefault();
    }
    /** @private */
    public mouseWheel(evt: WheelEvent): void {
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
            if (evt.shiftKey) {
                this.diagram.scroller.zoom(1, change, 0, mousePosition);
            } else {
                this.diagram.scroller.zoom(1, 0, change, mousePosition);
            }
            if (horizontalOffset !== this.diagram.scroller.horizontalOffset
                || verticalOffset !== this.diagram.scroller.verticalOffset) {
                evt.preventDefault();
            }
        }
        if (this.diagram.textEditing) {
            this.diagram.isTriggerEvent = true;
            this.diagram.startTextEdit();
            this.diagram.isTriggerEvent = false;
        }
    }
    /** @private */
    public keyDown(evt: KeyboardEvent): void {
        if (!(this.diagram.diagramActions & DiagramAction.TextEdit) &&
            !(this.checkEditBoxAsTarget(evt)) || (evt.key === 'Escape' || evt.keyCode === 27)) {
            let i: string;
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
                            if (canExecute && canExecute({
                                'keyDownEventArgs': KeyboardEvent,
                                parameter: command.parameter
                            })) {
                                evt.preventDefault();
                                if (evt.key === 'Escape' && (this.checkEditBoxAsTarget(evt))) {
                                    document.getElementById(this.diagram.diagramCanvas.id).focus();
                                }
                                if (command.execute) {
                                    // if (i === 'nudgeUp' || i === "nudgeRight" || i === "nudgeDown" || i === 'nudgeLeft') {
                                    //     command.execute()
                                    // } else {
                                    let execute: Function = getFunction(command.execute);
                                    execute({ 'keyDownEventArgs': KeyboardEvent, parameter: command.parameter });
                                    // }
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
    }

    private startAutoScroll(e: PointerEvent | TouchEvent): string {
        let position: PointModel = this.getMousePosition(e);
        position.x *= this.diagram.scroller.currentZoom;
        position.y *= this.diagram.scroller.currentZoom;
        let rulerSize: Size = getRulerSize(this.diagram);
        let movingPosition: string;
        let autoScrollBorder: MarginModel = this.diagram.scrollSettings.autoScrollBorder;
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
        if ((this.tool instanceof MoveTool || this.tool instanceof ResizeTool
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
            this.tool.mouseMove(this.eventArgs);
            this.diagram.scroller.zoom(1, -left, -top, pos);
        }
    }
    private mouseEvents(): void {
        let target: (NodeModel | ConnectorModel)[] = this.diagram.findObjectsUnderMouse(this.currentPosition);
        for (let i: number = 0; i < target.length; i++) {
            if (this.eventArgs.actualObject === target[i]) {
                target.splice(i, 1);
            }
        }
        let arg: IMouseEventArgs = {
            targets: target,
            element: (this.eventArgs.source === this.eventArgs.actualObject) ? undefined : this.eventArgs.source,
            actualObject: this.eventArgs.actualObject
        };
        if (this.lastObjectUnderMouse && (!this.eventArgs.actualObject || (this.lastObjectUnderMouse !== this.eventArgs.actualObject))) {
            let arg: IMouseEventArgs = { targets: undefined, element: this.lastObjectUnderMouse, actualObject: undefined };
            this.diagram.triggerEvent(DiagramEvent.mouseLeave, arg);
            this.lastObjectUnderMouse = null;
        }
        if (!this.lastObjectUnderMouse && this.eventArgs.source || (this.lastObjectUnderMouse !== this.eventArgs.actualObject)) {
            this.lastObjectUnderMouse = this.eventArgs.actualObject;
            this.diagram.triggerEvent(DiagramEvent.mouseEnter, arg);
        }
        if (this.eventArgs.actualObject) {
            this.diagram.triggerEvent(DiagramEvent.mouseOver, arg);
        }
    }

    private elementEnter(mousePosition: PointModel, elementOver: Boolean): void {
        if (!elementOver) {
            let isPrivateTooltip: number = ((this.hoverElement instanceof Node) &&
                (this.hoverElement as Node).constraints & NodeConstraints.Tooltip) ||
                ((this.hoverElement instanceof Connector) && (this.hoverElement as Connector).constraints & ConnectorConstraints.Tooltip);
            updateTooltip(this.diagram, isPrivateTooltip ? this.hoverElement : undefined);
            let offset: PointModel = getTooltipOffset(this.diagram, mousePosition, this.hoverElement);
            this.diagram.tooltipObject.close();
            this.diagram.tooltipObject.offsetX = offset.x;
            this.diagram.tooltipObject.offsetY = offset.y;
            this.diagram.tooltipObject.dataBind();
            if (canEnableToolTip(this.hoverElement, this.diagram)) {
                this.diagram.tooltipObject.open(this.diagram.element);
            }
        }
    }

    private elementLeave(): void {
        this.diagram.tooltipObject.close();
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
                        source: obj || this.diagram, position: this.currentPosition, count: evt.detail
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
                                id = (obj as Node).id.split('_textannotation_')[1];
                            }
                            this.diagram.startTextEdit
                                (obj, id || (annotation instanceof TextElement ?
                                    (annotation.id).split((obj as Node).id + '_')[1] : undefined));
                        }
                    }
                }
            }
            let arg: IDoubleClickEventArgs = {
                source: obj || this.diagram, position: this.currentPosition, count: evt.detail
            };
            this.diagram.triggerEvent(DiagramEvent.doubleClick, arg);

        }
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
        if (!node && this.tool instanceof TextDrawingTool) {

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

    private getMouseEventArgs(position: PointModel, args: MouseEventArgs, source?: IElement): MouseEventArgs {
        args.position = position;
        let obj: IElement;
        let objects: IElement[];
        if (!source) {
            if (this.action === 'Drag' || this.action === 'ConnectorSourceEnd' || this.action === 'SegmentEnd' ||
                this.action === 'OrthoThumb' || this.action === 'BezierSourceThumb' || this.action === 'BezierTargetThumb' ||
                this.action === 'ConnectorTargetEnd' || this.action.indexOf('Rotate') !== -1 || this.action.indexOf('Resize') !== -1) {
                obj = this.diagram.selectedItems as IElement;
            } else {
                objects = this.diagram.findObjectsUnderMouse(this.currentPosition);
                obj = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
            }
        } else {
            objects = this.diagram.findObjectsUnderMouse(this.currentPosition, source);
            obj = this.diagram.findTargetObjectUnderMouse(objects, this.action, this.inAction, args.position, source);
        }
        let wrapper: DiagramElement;
        if (obj) {
            wrapper = this.diagram.findElementUnderMouse(obj, this.currentPosition);
        }
        if (!source) {
            args.source = obj;
            args.sourceWrapper = wrapper;
        } else {
            args.target = obj;
            args.targetWrapper = wrapper;
        }
        args.actualObject = this.eventArgs.actualObject;
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
                let shape: string = 'shape';
                let type: string = findObjectType(this.diagram.drawingObject);
                if (type === 'Node' && this.diagram.drawingObject.shape.type === 'Text') {
                    return new TextDrawingTool(this.commandHandler);
                } else if (type === 'Node' && this.diagram.drawingObject.shape[shape] === 'Polygon' &&
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
    public findElementUnderMouse(obj: IElement, position: PointModel): DiagramElement {
        return this.objectFinder.findElementUnderSelectedItem(obj, position);
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
        let container: Container;
        let bounds: Rect;
        let child: DiagramElement;
        let matrix: Matrix;
        let objArray: Object[] = diagram.spatialSearch.findObjects(new Rect(pt.x - 50, pt.y - 50, 100, 100));
        let layerObjTable: {} = {};
        let layerTarger: (NodeModel | ConnectorModel)[];
        for (let obj of objArray) {
            let point: PointModel = pt;
            bounds = (obj as NodeModel).wrapper.outerBounds;
            let pointInBounds: boolean = ((obj as NodeModel).rotateAngle) ? false : bounds.containsPoint(point);
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
                                matrix, -(child.rotateAngle + child.parentTransform),
                                child.offsetX, child.offsetY);
                            point = transformPointByMatrix(matrix, pt);
                            if (cornersPointsBeforeRotation(child).containsPoint(point)) {
                                pointInBounds = true;
                            }
                        }
                    }
                    if (!source || (isSelected(diagram, obj) === false)) {
                        if (canEnablePointerEvents(obj, diagram)) {
                            if ((obj instanceof Connector) ? isPointOverConnector(obj, pt) : pointInBounds) {
                                let padding: number = (obj instanceof Connector) ? obj.hitPadding || 0 : 0;
                                let element: DiagramElement;
                                element = this.findElementUnderMouse(obj as IElement, pt, padding);
                                if (element) {
                                    if (obj instanceof Connector && diagram.bpmnModule) {
                                        //    obj = diagram.bpmnModule.findInteractableObject(obj, diagram);
                                    }
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
                    if (index > -1) {
                        actualTarget.splice(index, 1);
                    }
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
        }
        if (action === 'ConnectorSourceEnd' && connector.targetID) {
            let targetNode: NodeModel = diagram.nameTable[connector.targetID];
            if (targetNode && targetNode.shape && ((targetNode.shape as BpmnShapeModel).shape === 'TextAnnotation')) {
                let id: string[] = connector.id.split('_');
                if (((targetNode.shape.type === 'Bpmn') && actualTarget.shape.type !== 'Bpmn') || (id[0] === actualTarget.id) ||
                    (actualTarget.shape as BpmnShapeModel).shape === 'TextAnnotation') {
                    actualTarget = null;
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
                    if (objects[i] instanceof Node && canOutConnect(objects[i] as NodeModel)) {
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
                    if (objects[i] instanceof Node && canInConnect(objects[i] as NodeModel)) {
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
            } else if (action === 'Select' && diagram[eventHandler].tool) {
                for (let i: number = objects.length - 1; i >= 0; i--) {
                    if (objects[i] instanceof Connector) {
                        if (objects[i - 1] instanceof Node && objects[i - 1].ports) {
                            let portElement: DiagramElement = this.findTargetElement(objects[i - 1].wrapper, position, undefined);
                            if ((portElement && (portElement.id.match('_icon_content_shape$') || portElement.id.match('_icon_content_rect$')))) {
                                return objects[i - 1] as IElement;
                            }
                            for (let j: number = 0; j < objects[i - 1].ports.length; j++) {
                                if (portElement && portElement.id.match('_' + objects[i - 1].ports[j].id + '$')) {
                                    if (canDraw(objects[i - 1].ports[j], diagram)) {
                                        return objects[i - 1] as IElement;
                                    }
                                }
                            }
                        }
                    }
                }
                actualTarget = objects[objects.length - 1];
                eventArg.actualObject = actualTarget as Node;
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
            } else if (action === 'Pan' || action === 'LayoutAnimation') {
                for (let i: number = objects.length - 1; i >= 0; i--) {
                    if (objects[i] instanceof Node) {
                        let portElement = this.findTargetElement(objects[i].wrapper, position, undefined);
                        if ((action === 'LayoutAnimation' || action === 'Pan') || ((portElement && (portElement.id.match('_icon_content_shape$') || portElement.id.match('_icon_content_rect$'))))) {
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
    public findElementUnderSelectedItem(obj: IElement, position: PointModel): DiagramElement {
        //rewrite this for multiple selection
        if (obj instanceof Selector) {
            if (obj.nodes.length === 1 && (!obj.connectors || !obj.connectors.length)) {
                return this.findElementUnderMouse(obj.nodes[0] as IElement, position);
            } else if ((!obj.nodes || obj.nodes.length) && obj.connectors.length === 1) {
                return this.findElementUnderMouse(obj.connectors[0] as IElement, position);
            }
        } else {
            return this.findElementUnderMouse(obj, position);
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
            if (element && element.outerBounds.containsPoint(position)) {
                if (element instanceof Container) {
                    let target: DiagramElement = this.findTargetElement(element, position);
                    if (target) {
                        return target;
                    }
                }
                if (element.bounds.containsPoint(position)) {
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
}