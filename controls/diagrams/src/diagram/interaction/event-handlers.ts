/* eslint-disable jsdoc/require-returns */
/* eslint-disable jsdoc/require-param */
/* eslint-disable valid-jsdoc */
/* eslint-disable no-case-declarations */
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
import { Native, Node, SwimLane } from '../objects/node';
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
import { isPointOverConnector, findObjectType, insertObject, getObjectFromCollection, getTooltipOffset, findParentInSwimlane } from '../utility/diagram-util';
import { getObjectType, getInOutConnectPorts, removeChildNodes, cloneBlazorObject, checkPort } from '../utility/diagram-util';
import { canZoomPan, canDraw, canDrag, canZoomTextEdit, canVitualize, canPreventClearSelection } from './../utility/constraints-util';
import { selectionHasConnector } from '../utility/diagram-util';
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
import { moveChildInStack, renderStackHighlighter } from './container-interaction';
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
        const boundingRect: ClientRect = this.diagram.element.getBoundingClientRect();
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
        const container: HTMLElement = document.getElementById(element.id);
        if (container) {
            const bounds: ClientRect = container.getBoundingClientRect();
            this.diagram.scroller.setViewPortSize(bounds.width, bounds.height);
            let position: Size = new Size();
            position = getRulerSize(this.diagram);
            const width: string = this.diagram.getSizeValue(this.diagram.width, position.width);
            const height: string = this.diagram.getSizeValue(this.diagram.height, position.height);
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
        //EJ2-55887 - added the beow code to perform pinch zoom in mac os and windows while pinch zoom all browser return ctrl key as true.        
        if (evt.type === 'mousewheel') {
            return evt.ctrlKey;
        }
        else {
            return navigator.platform.match('Mac') ? evt.metaKey : evt.ctrlKey;
        }
    }
    private renderUmlHighLighter(args: MouseEventArgs): void {
        this.diagram.commandHandler.removeStackHighlighter();
        const node: NodeModel = this.diagram.selectedItems.nodes[0];
        if (node && node.container && node.container.type === 'Stack' && node.shape.type === 'UmlClassifier') {
            const bound: Rect = node.wrapper.bounds;
            if (!bound.containsPoint(this.currentPosition)) {
                // eslint-disable-next-line max-len
                const objects: IElement[] = this.diagram.findObjectsUnderMouse({ x: this.currentPosition.x - 20, y: this.currentPosition.y });
                const target: IElement = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
                if (target && (target as Node).parentId && ((target as Node).parentId === node.id)) {
                    // eslint-disable-next-line max-len
                    const isVertical: boolean = this.diagram.nameTable[(target as Node).parentId].container.orientation === 'Vertical';
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
        const x: number = evt.offsetX;
        const y: number = evt.offsetY;
        const diagramCanvas: HTMLElement = this.diagram.diagramCanvas;
        const height: number = diagramCanvas.offsetHeight;
        const width: number = diagramCanvas.offsetWidth;
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
        const delay: number = 50;
        //let removeObjectInterval: Object;
        const removeObjectInterval: Object = setInterval(
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
            const currentAction: Actions = (eventName === DiagramEvent.onUserHandleMouseLeave) ? this.previousAction : this.action;
            const arg: UserHandleEventsArgs = { element: undefined };
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
                    const element: HTMLElement = document.getElementById(this.diagram.selectedItems.userHandles[i].name + '_userhandle');

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
        // EJ2-57541 - Added the below code to check whether diagram tool is instance of node drawing tool or connector drawing tool.
        // If node or connector drawing tool means then we have returned without perform any operation. 
        if (this.inAction === true && ( (this.tool) instanceof NodeDrawingTool || this.tool instanceof ConnectorDrawingTool )) {
            return;
        }
        this.focus = true;
        //let touches: TouchList;
        const touches: TouchList = (<TouchEvent & PointerEvent>evt).touches;
        let isSymblDragging: boolean = document.getElementsByClassName('e-dragclone')[0] ? true : false;
        if (this.isMouseOnScrollBar(evt) && !isSymblDragging) {
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
                // eslint-disable-next-line
                const arg: IClickEventArgs = {
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
                    // EJ2-57743 - Added below code to refresh the diagram layer after the annotation gets edited in canvas mode.
                    if(this.diagram.mode === 'Canvas' && this.diagram.scroller.currentZoom !== 1) {
                        this.diagram.refreshDiagramLayer();
                    }
                }
                let target: NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel;
                const objects: IElement[] = this.objectFinder.findObjectsUnderMouse(
                    this.currentPosition, this.diagram, this.eventArgs, null, this.action);
                const obj: IElement = this.objectFinder.findObjectUnderMouse(
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
                const ctrlKey: boolean = this.isMetaKey(evt);
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
                    const info: Info = (ctrlKey && evt.shiftKey) ? { ctrlKey: ctrlKey, shiftKey: evt.shiftKey } : { ctrlKey: true };
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
        const isNode: boolean = this.eventArgs.target instanceof Node && obj instanceof Node ? false : true;
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
            const annotation: ShapeAnnotation | PathAnnotation = this.commandHandler.findTarget(
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
            const objects: IElement[] = this.diagram.findObjectsUnderMouse(this.currentPosition);
            const obj: IElement = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
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
                            const content: string | HTMLElement = this.getContent();
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
                            this.hoverElement = canResetElement ? obj : this.hoverElement;
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
                    const content: string | HTMLElement = this.getContent();
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
                        const info: Info = (e.ctrlKey && e.shiftKey) ? { ctrlKey: e.ctrlKey, shiftKey: e.shiftKey } : { ctrlKey: true };
                        this.eventArgs.info = info;
                    }
                    this.checkAction(obj);
                    const padding: number = this.getConnectorPadding(this.eventArgs);
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
        const isPrivateTooltip: number = ((this.hoverElement instanceof Node) &&
            (this.hoverElement as Node).constraints & NodeConstraints.Tooltip) ||
            ((this.hoverElement instanceof Connector) &&
                (this.hoverElement as Connector).constraints & ConnectorConstraints.Tooltip);
        let node: NodeModel = this.hoverElement as Node;
        let childNode: NodeModel | ConnectorModel;
        if (node instanceof Node && node.children && node.children.length > 0) {
            childNode = this.findIntersectChild(node);
        }
        let content: string | HTMLElement = isPrivateTooltip ? this.hoverElement.tooltip.content :
            this.diagram.tooltip.content;
        content = childNode ? childNode.tooltip.content : content;
        return content;
    }

    private findIntersectChild(node: NodeModel): NodeModel | ConnectorModel {
        let childNode: NodeModel | ConnectorModel;
        let rect: Rect = new Rect(this.currentPosition.x, this.currentPosition.y, 8, 8);
        for (let i: number = 0; i < node.children.length; i++) {
            childNode = this.diagram.getObject(node.children[i]);
            if (childNode.wrapper.outerBounds.intersects(rect)) {
                return childNode;
            }
        }
        return null;
    }

    private checkAutoScroll(e: PointerEvent | TouchEvent): void {
        const autoScrollPosition: string = this.startAutoScroll(e);
        if (!autoScrollPosition && this.doingAutoScroll) {
            this.doingAutoScroll = false;
            clearInterval(this.timeOutValue as number);
        } else if (autoScrollPosition) {
            if ((this.tool instanceof NodeDrawingTool || this.tool instanceof ConnectorDrawingTool
                || this.tool instanceof MoveTool || this.tool instanceof ResizeTool
                || this.tool instanceof SelectTool) && this.inAction) {
                // eslint-disable-next-line @typescript-eslint/no-this-alias
                const diagram: DiagramEventHandler = this;
                const delay: number = 100;
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
        this.checkUserHandleEvent(DiagramEvent.onUserHandleMouseUp);
        if (this.diagram.mode === 'SVG' && canVitualize(this.diagram)) {
            this.updateVirtualization();
        }
        this.diagram.previousSelectedObject = null;
        this.diagram.diagramRenderer.rendererActions =
            this.diagram.removeConstraints(this.diagram.diagramRenderer.rendererActions, RendererAction.DrawSelectorBorder);
        const touches: TouchList = (<TouchEvent & PointerEvent>evt).touches;
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
                        let oldSelectedValue = (this.diagram.selectedItems.nodes.concat(this.diagram.selectedItems.connectors as NodeModel))
                        const objects: IElement[] = this.diagram.findObjectsUnderMouse(this.currentPosition);
                        const obj: IElement = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
                        let isMultipleSelect: boolean = true;
                        if ((!evt.ctrlKey && this.isMouseDown
                            && (this.diagram.selectedItems.nodes.length + this.diagram.selectedItems.connectors.length) > 1)
                            && evt.which === 1 && !canPreventClearSelection(this.diagram.diagramActions)) {
                            isMultipleSelect = false; this.commandHandler.clearSelection();
                        }
                        if (!isSelected(this.diagram, obj) || (!isMultipleSelect)) {
                            this.commandHandler.selectObjects([obj], undefined, oldSelectedValue);
                        }
                    }
                }
                let avoidDropChildren: boolean = false;
                const history: HistoryLog = this.updateContainerProperties();
                let isGroupAction: boolean; this.addUmlNode();
                this.inAction = false; this.isMouseDown = false; this.currentPosition = this.getMousePosition(evt);
                if (this.diagram.selectedObject.helperObject) { isGroupAction = this.updateContainerBounds(); }
                if (this.tool && (this.tool.prevPosition || this.tool instanceof LabelTool)) {
                    this.eventArgs.position = this.currentPosition;
                    const padding: number = this.getConnectorPadding(this.eventArgs);
                    this.getMouseEventArgs(this.currentPosition, this.eventArgs, this.eventArgs.source, padding);
                    const ctrlKey: boolean = this.isMetaKey(evt);
                    if (ctrlKey || evt.shiftKey) {
                        const info: Info = (ctrlKey && evt.shiftKey) ? { ctrlKey: ctrlKey, shiftKey: evt.shiftKey } :
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
                            const parentNode: Node = this.diagram.getObject(
                                (this.diagram.selectedObject.actualObject as Node).parentId) as Node;
                            if (parentNode && parentNode.isLane) {
                                this.commandHandler.isContainer = true;
                            }
                        }
                        avoidDropChildren = this.diagram.lineRoutingModule
                            && this.diagram.nameTable["helper"] && this.eventArgs.target && (this.eventArgs.target as Node).isLane
                            && ((this.eventArgs.source instanceof Selector && (this.eventArgs.source as Selector).nodes.length > 0
                                && ((this.eventArgs.source as Selector).nodes[0] as Node).parentId === "") || ((this.eventArgs.source as Node).parentId === ""));
                        if (avoidDropChildren) {
                            this.diagram.diagramActions = this.diagram.diagramActions | DiagramAction.PreventLaneContainerUpdate;
                        }
                        this.tool.mouseUp(this.eventArgs, history.isPreventHistory);
                    } else {
                        this.tool.mouseUp(this.eventArgs);
                        if (this.diagram.checkMenu && (window.navigator.userAgent.indexOf('Linux') !== -1 || window.navigator.userAgent.indexOf('X11') !== -1)) {
                            if (!evt.pageY && (evt instanceof TouchEvent) && evt.changedTouches) {
                                window.getSelection().removeAllRanges();
                                this.diagram.contextMenuModule.contextMenu.open(evt.changedTouches[0].pageY, evt.changedTouches[0].pageX, this.diagram.element);
                                evt.preventDefault();
                            } else {
                                this.diagram.contextMenuModule.contextMenu.open(evt.pageY, evt.pageX, this.diagram.element);
                            }
                            this.diagram.checkMenu = false;
                        }
                    }
                    if (history.hasStack) { this.diagram.endGroupAction(); }
                }
                if (isGroupAction) { this.diagram.endGroupAction(); }
                this.updateContainerBounds(true);
                if (this.eventArgs.clickCount !== 2) {
                    this.commandHandler.updateSelectedNodeProperties(this.eventArgs.source);
                    if (avoidDropChildren) {
                        this.diagram.diagramActions = this.diagram.diagramActions & ~DiagramAction.PreventLaneContainerUpdate
                        let nodes: NodeModel[] = this.eventArgs.source instanceof Selector
                            ? (this.eventArgs.source as Selector).nodes : [this.eventArgs.source as Node]
                        if (nodes) {
                            for (let i = 0; i < nodes.length; i++) {
                                if (!nodes[i].container) {
                                    this.commandHandler.dropChildToContainer(this.eventArgs.target, nodes[i]);
                                    this.commandHandler.renderContainerHelper(nodes[i]);
                                }
                            }
                        }
                    }
                }
                if (this.diagram.selectedObject && this.diagram.selectedObject.helperObject) {
                    this.diagram.remove(this.diagram.selectedObject.helperObject);
                    this.diagram.selectedObject = { helperObject: undefined, actualObject: undefined };
                    // EJ2-42605 - Annotation undo redo not working properly if the line routing is enabled committed by sivakumar sekar
                    // committed to remove the diagram actions public method when line routing is enabled
                    // eslint-disable-next-line
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
            this.diagram.currentDrawingObject = undefined; const selector: SelectorModel = this.diagram.selectedItems;
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
        this.diagram.diagramActions = this.diagram.diagramActions & ~DiagramAction.PreventLaneContainerUpdate
        this.eventArgs = {}; this.diagram.commandHandler.removeStackHighlighter();// end the corresponding tool
    }
    /* tslint:enable */

    private getConnectorPadding(eventArgs: MouseEventArgs): number {
        let padding: number;
        const targetObject: SelectorModel = eventArgs.source;
        if (targetObject && (targetObject instanceof Selector) && targetObject.connectors.length) {
            const selectedConnector: ConnectorModel = targetObject.connectors[0];
            padding = (selectedConnector.constraints & ConnectorConstraints.ConnectToNearByPort) ? selectedConnector.connectionPadding : 0;
        }
        else if (targetObject && (targetObject instanceof Connector) && this.action === 'PortDraw' && (this.tool instanceof ConnectorDrawingTool)) {
            if (targetObject.constraints & ConnectorConstraints.ConnectToNearByPort) {
                padding = targetObject.connectionPadding;
            }
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
        const actualShape: SwimLaneModel = (selectedNode.shape as SwimLaneModel);
        const objects: IElement[] = this.objectFinder.findObjectsUnderMouse(
            this.currentPosition, this.diagram, this.eventArgs, null, this.action);
        if (!targetNode) {
            targetNode = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
        }
        this.diagram.clearSelectorLayer();
        if (targetNode && !((targetNode as Node).isLane || (targetNode as Node).isPhase || (targetNode as Node).isHeader)) {
            for (let i: number = 0; i < objects.length; i++) {
                const laneNode: Node = this.diagram.nameTable[(objects[i] as NodeModel).id];
                if (laneNode.isLane || laneNode.isPhase || laneNode.isHeader) { targetNode = laneNode; }
            }
        }
        if (targetNode && (actualShape.isPhase || (actualShape.isLane && (targetNode as SwimLaneModel).isLane))) {
            const id: string = (targetNode as Node).parentId;
            swimlaneNode = this.diagram.nameTable[id];
        }
        if (swimlaneNode) {
            shape = (swimlaneNode.shape as SwimLaneModel);
            canInsert = (actualShape.isLane) ? actualShape.orientation === shape.orientation :
                actualShape.orientation !== shape.orientation;
        }
        if (canInsert && (targetNode as Node)) {
            if (shape && shape.header && (shape as SwimLane).hasHeader && shape.orientation === 'Horizontal') { index = 1; }
            if (shape.phases.length > 0) { index += 1; }
            if (actualShape.isPhase) {
                if (shape.orientation === 'Horizontal') {
                    offset = this.currentPosition.x - swimlaneNode.wrapper.bounds.x;
                } else {
                    offset = this.currentPosition.y - (swimlaneNode.wrapper.bounds.y + shape.header.height);
                }
                const phases: PhaseModel = { id: randomId(), offset: offset, header: { annotation: { content: 'Phase' } } } as PhaseModel;
                this.diagram.addPhases(swimlaneNode, [phases]);
            } else {
                //const laneHeight: number = actualShape.lanes[0].header.height;
                const lane: LaneModel = {
                    id: randomId(), style: actualShape.lanes[0].style, header: {
                        annotation: {
                            content: actualShape.lanes[0].header.annotation.content,
                            style: actualShape.lanes[0].header.annotation.style
                        },
                        style: actualShape.lanes[0].header.style
                    }
                } as LaneModel;
                const orientation: boolean = (actualShape.orientation === 'Horizontal') ? true : false;
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
            const swimLaneobj: NodeModel = {
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
                        }
                    }], orientation: actualShape.orientation
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
            const isGroupAction: boolean = this.updateContainerBounds();
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
        const selector: SelectorModel = this.diagram.selectedItems;
        if (selector && selector.wrapper) {
            if (!(selectionHasConnector(this.diagram, selector as Selector))) {
                this.diagram.renderSelector(true);
            }
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const up: boolean = ((evt as any).wheelDelta > 0 || -40 * evt.detail > 0) ? true : false;
        const mousePosition: PointModel = this.getMousePosition(evt);
        this.diagram.tooltipObject.close();
        const ctrlKey: boolean = this.isMetaKey(evt);
        if (ctrlKey) {
            // SF-362356 - Command below line to implement smooth scroll in diagram.
            // this.diagram.zoom(up ? (1.2) : 1 / (1.2), mousePosition);
            // EJ2-59803 - Added the below code to get the zoom factor value from scroll settings and 
            // set it to zoomFactor args in zoomTo method.
            let zoomFactor: number = this.diagram.scrollSettings.zoomFactor;
            if (up) {
                this.diagram.zoomTo({ type: "ZoomIn", zoomFactor: zoomFactor, focusPoint: mousePosition })
            }
            else {
                this.diagram.zoomTo({ type: "ZoomOut", zoomFactor: zoomFactor, focusPoint: mousePosition })
            }
            evt.preventDefault();
        } else {
            const horizontalOffset: number = this.diagram.scroller.horizontalOffset;
            const verticalOffset: number = this.diagram.scroller.verticalOffset;
            const change: number = up ? 10 : -10;
            if (this.tool && (this.tool instanceof PolygonDrawingTool || this.tool instanceof PolyLineDrawingTool)) {
                this.eventArgs = {};
                this.getMouseEventArgs(mousePosition, this.eventArgs);
                this.eventArgs.position = mousePosition;
                this.tool.mouseWheel(this.eventArgs);
            }
            this.diagram.scrollActions |= ScrollActions.Interaction;
            if (evt.shiftKey || (evt.deltaX && evt.deltaX !== -0)) {
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
                const node: NodeModel | ConnectorModel = this.diagram.getObject(this.diagram.activeLabel.parentId);
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
            let i: string; const inAction: string = 'inAction';
            let command: CommandModel;
            const keycode: number = evt.keyCode ? evt.keyCode : evt.which;
            const key: string = evt.key;
            const ctrlKey: boolean = this.isMetaKey(evt);
            if (this.diagram.commandManager && this.diagram.commands) {
                const commands: {} = this.diagram.commands;
                for (const i of Object.keys(commands)) {
                    command = this.diagram.commands[i];
                    if (command && (command.gesture.keyModifiers || command.gesture.key)) {
                        if ((keycode === command.gesture.key || (key === Keys[command.gesture.key])
                            || this.isDeleteKey(key, i))
                            && (((!command.gesture.keyModifiers) && (!evt.altKey) && (!evt.shiftKey) && (!ctrlKey)) ||
                                (command.gesture.keyModifiers && (ctrlKey || evt.altKey || evt.shiftKey) &&
                                    (this.altKeyPressed(command.gesture.keyModifiers) && evt.altKey) ||
                                    (this.shiftKeyPressed(command.gesture.keyModifiers) && evt.shiftKey) ||
                                    (this.ctrlKeyPressed(command.gesture.keyModifiers) && ctrlKey)))) {
                            const canExecute: Function = getFunction(command.canExecute);
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
                                        const selectedSymbols: string = 'selectedSymbols';
                                        const source: string = 'sourceElement'; const intDestroy: string = 'intDestroy';
                                        this.diagram.removeFromAQuad(this.diagram.currentSymbol);
                                        this.diagram.removeObjectsFromLayer(this.diagram.nameTable[this.diagram.currentSymbol.id]);
                                        this.diagram.removeElements(this.diagram.currentSymbol);
                                        removeChildNodes(this.diagram.currentSymbol as Node, this.diagram);
                                        delete this.diagram.nameTable[this.diagram.currentSymbol.id];
                                        const sourceElement: HTMLElement = this.diagram.droppable[source];
                                        sourceElement.draggable[intDestroy]();
                                        const element: HTMLElement = this.diagram.droppable[selectedSymbols];
                                        element.parentNode.removeChild(element);
                                        const diagramActions: DiagramAction = this.diagram.diagramActions;
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
                                        const execute: Function = getFunction(command.execute);
                                        execute({ 'keyDownEventArgs': KeyboardEvent, parameter: command.parameter });
                                    }
                                    // }
                                }
                                if (isBlazor()) {
                                    const arg: ICommandExecuteEventArgs = { gesture: command.gesture };
                                    this.diagram.triggerEvent(DiagramEvent.commandExecute, arg);
                                }
                                break;
                            }
                        }
                    }
                }
            }
        }
        // eslint-disable-next-line
        let selectedObject: (NodeModel | ConnectorModel)[] = (this.diagram.selectedItems.nodes.length) ?
            this.diagram.selectedItems.nodes : this.diagram.selectedItems.connectors;
        this.keyArgs = {
            element: cloneBlazorObject(this.diagram.selectedItems),
            key: evt.key, keyCode: evt.keyCode ? evt.keyCode : evt.which
        };
        this.getKeyModifier(this.keyArgs, evt);
        if ((this.diagram.diagramActions & DiagramAction.TextEdit)) {
            this.getlabel(this.keyArgs, evt);
        }
        this.diagram.triggerEvent(DiagramEvent.keyDown, this.keyArgs);

    }

    private getlabel(args: IKeyEventArgs, evt: KeyboardEvent): void {
        const label: ActiveLabel = this.diagram.activeLabel;
        args.target = this.diagram.element.id + '_editBox';
        const node: NodeModel = this.diagram.nameTable[label.parentId];
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
            element: cloneBlazorObject(this.diagram.selectedItems), key: evt.key, keyCode: evt.keyCode ? evt.keyCode : evt.which
        };
        const selectedObject: (NodeModel | ConnectorModel)[] = (this.diagram.selectedItems.nodes.length) ?
            this.diagram.selectedItems.nodes : this.diagram.selectedItems.connectors;
        this.getKeyModifier(this.keyArgs, evt);
        if ((this.diagram.diagramActions & DiagramAction.TextEdit)) {
            this.getlabel(this.keyArgs, evt);
        }
        this.diagram.triggerEvent(DiagramEvent.keyUp, this.keyArgs);
    }

    private startAutoScroll(e: PointerEvent | TouchEvent): string {
        const position: PointModel = this.getMousePosition(e);
        position.x *= this.diagram.scroller.currentZoom;
        position.y *= this.diagram.scroller.currentZoom;
        const rulerSize: Size = getRulerSize(this.diagram);
        let movingPosition: string;
        const autoScrollBorder: MarginModel = this.diagram.scrollSettings.autoScrollBorder;
        if (Browser.info.name === 'mozilla') {
            if (this.diagram.scroller.viewPortWidth === 0) {
                const bounds: ClientRect | DOMRect = document.getElementById(this.diagram.element.id).getBoundingClientRect();
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
        const position: string = option;
        if ((this.tool instanceof NodeDrawingTool || this.tool instanceof ConnectorDrawingTool
            || this.tool instanceof MoveTool || this.tool instanceof ResizeTool
            || this.tool instanceof SelectTool) && this.inAction) {
            // eslint-disable-next-line @typescript-eslint/no-this-alias
            const diagram: DiagramEventHandler = this;
            const pos: PointModel = this.getMousePosition(e);
            const autoScrollBorder: MarginModel = this.diagram.scrollSettings.autoScrollBorder;
            const newDelay: number = delay ? delay : 100;
            let left: number = 0; let top: number = 0;
            const point: PointModel = { x: pos.x, y: pos.y };
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
            const objects: IElement[] = this.objectFinder.findObjectsUnderMouse(
                this.currentPosition, this.diagram, this.eventArgs, null, this.action);
            this.eventArgs.target = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
            this.tool.mouseMove(this.eventArgs);
            this.diagram.scrollActions |= ScrollActions.Interaction;
            this.diagram.scroller.zoom(1, -left, -top, pos);
            this.diagram.scrollActions &= ~ScrollActions.Interaction;
        }
    }
    private mouseEvents(): void {
        const target: (NodeModel | ConnectorModel)[] = this.diagram.findObjectsUnderMouse(this.currentPosition);
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
            const isPrivateTooltip: number = ((this.hoverElement instanceof Node) &&
                (this.hoverElement as Node).constraints & NodeConstraints.Tooltip) ||
                ((this.hoverElement instanceof Connector) && (this.hoverElement as Connector).constraints & ConnectorConstraints.Tooltip);
            const content: string | HTMLElement = this.getContent();
            let children: NodeModel | ConnectorModel;
            if (this.hoverElement && (this.hoverElement as NodeModel).children && (this.hoverElement as NodeModel).children.length > 0) {
                // EJ2-56981 - Below method is used to check if the mouse pointer position and group children node gets intersect or not
                children = this.findIntersectChild(this.hoverElement as NodeModel);
            }
            if (this.hoverElement.tooltip.openOn === 'Auto' && content !== '') {
                // EJ2-56981 - If children returned means then update tooltip for child node else update tooltip for group node.
                if(children) {
                    updateTooltip(this.diagram, children);
                } else {
                    updateTooltip(this.diagram, isPrivateTooltip ? this.hoverElement : undefined);
                }
            }
            this.diagram.tooltipObject.offsetX = 0;
            this.diagram.tooltipObject.offsetY = 0;
            const objects: IElement[] = this.diagram.findObjectsUnderMouse(this.currentPosition);
            let obj: IElement = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
            if (obj instanceof Node && obj.children && obj.children.length > 0) {
                // EJ2-56981 - If children returned means then update tooltip for child node else update tooltip for group node.
                obj = children ? children as Node : obj;
            }
            let idName: string = ((obj as Node).shape && (((obj as Node).shape) instanceof Native)) ? '_content_native_element' : '_groupElement';
            let targetEle: HTMLElement = document.getElementById((obj as Node).id + idName);
            if (this.hoverElement.tooltip.openOn === 'Auto' && content !== '') {
                (this.diagram.tooltipObject as Tooltip).close();
                (this.diagram.tooltipObject as DiagramTooltipModel).openOn = (this.hoverElement.tooltip as DiagramTooltipModel).openOn;
                if (isBlazor()) {
                    (this.diagram.tooltipObject as BlazorTooltip).open(targetEle, {});
                } else {
                    (this.diagram.tooltipObject as Tooltip).dataBind();
                }
            }
            if (canEnableToolTip(this.hoverElement, this.diagram) && this.hoverElement.tooltip.openOn === 'Auto') {
                (this.diagram.tooltipObject as Tooltip).open(targetEle);
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
            const objects: IElement[] = this.diagram.findObjectsUnderMouse(this.currentPosition);
            const obj: IElement = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
            if (obj !== null && canUserInteract(this.diagram)) {
                const node: (NodeModel | ConnectorModel) = obj;
                annotation = this.diagram.findElementUnderMouse(obj, this.currentPosition);
                if (this.tool && (this.tool instanceof PolygonDrawingTool || this.tool instanceof PolyLineDrawingTool)) {
                    const arg: IDoubleClickEventArgs = {
                        source: cloneBlazorObject(obj) || cloneBlazorObject(this.diagram),
                        position: this.currentPosition, count: evt.detail
                    };
                    this.tool.mouseUp(this.eventArgs);
                    this.isMouseDown = false;
                    this.eventArgs = {};
                    this.tool = null;
                    evt.preventDefault();
                } else {
                    const layer: LayerModel = this.diagram.commandHandler.getObjectLayer((obj as NodeModel).id);
                    if (layer && !layer.lock && layer.visible) {
                        if (!(this.diagram.diagramActions & DiagramAction.TextEdit)) {
                            let id: string = '';
                            if (((obj as Node).shape as BpmnShapeModel).shape === 'TextAnnotation') {
                                id = obj.wrapper.children[1].id.split('_')[1];
                            }
                            this.diagram.startTextEdit
                                // eslint-disable-next-line no-unexpected-multiline
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
        const obj: Node = actualTarget as Node;
        if (checkParentAsContainer(this.diagram, obj, true)) {
            return obj;
        }
        return null;
    }

    /**
     * @private
     */
    public inputChange(evt: InputArgs): void {
        const minWidth: number = 90; let maxWidth: number;
        const minHeight: number = 12; let fontsize: number;
        let textWrapper: DiagramElement;
        let node: NodeModel | ConnectorModel;
        let height: number; let width: number;
        let textBounds: Size; let textBoxWidth: number;
        let transforms: TransformFactor; let scale: number;
        const editTextBox: HTMLElement = document.getElementById(this.diagram.element.id + '_editBox');
        const editTextBoxDiv: HTMLElement = document.getElementById(this.diagram.element.id + '_editTextBoxDiv');
        const text: string = ((editTextBox as HTMLTextAreaElement).value);
        const line: string[] = text.split('\n');
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
            if (!(node instanceof Connector && node.type === 'Bezier')) {
                editTextBoxDiv.style.left = ((((textWrapper.bounds.center.x + transforms.tx) * transforms.scale) - width / 2) - 2.5) + 'px';
                editTextBoxDiv.style.top = ((((textWrapper.bounds.center.y + transforms.ty) * transforms.scale) - height / 2) - 3) + 'px';
            }
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
                const shape: string = 'shape'; const basicShape: string = 'basicShape';
                const type: string = findObjectType(this.diagram.drawingObject);
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
        const object: DiagramElement | SelectorModel = ((this.diagram.selectedItems as Selector).annotation) ?
            this.diagram.selectedItems.wrapper.children[0] : this.diagram.selectedItems;
        const rotateAngle: number = ((this.diagram.selectedItems as Selector).annotation) ?
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

            const boundsUpdate: boolean = (this.tool instanceof ResizeTool) ? true : false;
            const obj: NodeModel = this.diagram.selectedObject.actualObject;
            const parentNode: Node = this.diagram.nameTable[(obj as Node).parentId];

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
            const objects: IElement[] = this.diagram.findObjectsUnderMouse(this.currentPosition);
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
                            const swimlane: Node = this.diagram.getObject(parentNode.parentId) as Node;
                            const laneId: string = swimlane.id + (swimlane.shape as SwimLaneModel).lanes[0].id + '0';
                            const firstlane: NodeModel = this.diagram.getObject(laneId) as Node;
                            const x: number = firstlane.wrapper.bounds.x; const y: number = firstlane.wrapper.bounds.y;
                            const width: number = swimlane.wrapper.bounds.bottomRight.x - x;
                            const height: number = swimlane.wrapper.bounds.bottomRight.y - y;
                            const swimlaneBounds: Rect = new Rect(x, y, width, height);
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
                        const index: number = parentNode.wrapper.children.indexOf(obj.wrapper);
                        undoElement = { targetIndex: undefined, target: undefined, sourceIndex: index, source: clone(obj) };
                        if (index > -1) {
                            const children: string[] = parentNode.children; children.splice(children.indexOf(obj.id), 1);
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
                        const entry: HistoryEntry = {
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
                    const id: string = (obj.shape as SwimLaneModel).lanes[i].children[j].id;
                    const childNode: NodeModel = this.diagram.nameTable[id];
                    childNode.offsetX = childNode.wrapper.offsetX;
                    childNode.offsetY = childNode.wrapper.offsetY;
                }
            }
        }
    }

    private updateContainerPropertiesExtend(
        parentNode: Node, obj: NodeModel, connectors: string[], helperObject: NodeModel, history: HistoryLog): HistoryLog {
        if (this.currentAction === 'ResizeEast' || this.currentAction === 'ResizeSouth' || obj.shape.type === 'SwimLane') {
            const undoObj: NodeModel = cloneObject(obj); let isUpdateRow: boolean = false;
            if (parentNode && parentNode.container && parentNode.container.type === 'Grid') {
                const shape: boolean = parentNode.shape.type === 'SwimLane' ? true : false;
                const container: GridPanel = (shape ? parentNode.wrapper.children[0] : parentNode.wrapper) as GridPanel;
                const padding: number = shape ? (parentNode.shape as SwimLane).padding : undefined;
                const x: number = parentNode.wrapper.bounds.x; const y: number = parentNode.wrapper.bounds.y;
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
                        const id: string = (parentNode.shape as SwimLaneModel).phases[obj.columnIndex].header.id;
                        const node: Node = this.diagram.nameTable[id];
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
                const redoObject: NodeModel = cloneObject(obj);
                const entry: HistoryEntry = {
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
        const node: NodeModel = this.diagram.selectedItems.nodes[0];
        let objects: IElement[] = this.diagram.findObjectsUnderMouse({ x: this.currentPosition.x + 20, y: this.currentPosition.y });
        let target: IElement = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
        if (!target) {
            objects = this.diagram.findObjectsUnderMouse({ x: this.currentPosition.x - 20, y: this.currentPosition.y });
            target = this.diagram.findObjectUnderMouse(objects, this.action, this.inAction);
        }
        if (node && node.container && node.container.type === 'Stack' && (target as Node) && (target as Node).parentId
            && (target as Node).parentId === node.id) {
            const innerNode: NodeModel = target as NodeModel;
            const adornerSvg: SVGElement = getAdornerLayerSvg(this.diagram.element.id);
            const highlighter: SVGElement =
                (adornerSvg as SVGSVGElement).getElementById(adornerSvg.id + '_stack_highlighter') as SVGElement;
            if (highlighter) {
                const index: number = node.wrapper.children.indexOf(target.wrapper) + 1;
                this.diagram.enableServerDataBinding(false);
                const temp: NodeModel = new Node(
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
                const id: string[] = innerNode.id.split('_');
                temp.id = randomId() + temp.id;
                (temp as Node).parentId = node.id;
                temp.zIndex = -1;
                (temp as Node).umlIndex = index;
                this.diagram.startGroupAction();
                const redoElement: StackEntryObject = {
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
        const endPadding: number = (source && (source instanceof Connector) &&
            ((source.constraints & ConnectorConstraints.ConnectToNearByNode) ||
                (source.constraints & ConnectorConstraints.ConnectToNearByPort)) && source.connectionPadding) || 0;
        const objArray: Object[] = diagram.spatialSearch.findObjects(
            new Rect(pt.x - 50 - endPadding, pt.y - 50 - endPadding, 100 + endPadding, 100 + endPadding));
        const layerObjTable: {} = {}; let layerTarger: (NodeModel | ConnectorModel)[];
        for (const obj of objArray) {
            let point: PointModel = pt; bounds = (obj as NodeModel).wrapper.outerBounds;
            let pointInBounds: boolean = ((obj as NodeModel).rotateAngle) ? false : bounds.containsPoint(point, endPadding);
            if ((obj !== source || diagram.currentDrawingObject instanceof Connector) &&
                (obj instanceof Connector) ? obj !== diagram.currentDrawingObject : true && (obj as NodeModel).wrapper.visible) {
                const layer: LayerModel = diagram.commandHandler.getObjectLayer((obj as NodeModel).id);
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
                                const padding: number = (obj instanceof Connector) ? obj.hitPadding || 0 : 0; //let element: DiagramElement;
                                const element: DiagramElement = this.findElementUnderMouse(obj as IElement, pt, endPadding || padding);
                                if (element && (obj as Node).id !== 'helper') {
                                    insertObject(obj, 'zIndex', layerTarger);
                                }
                            }
                        }
                    }
                }
            }
        }
        for (const layer of diagram.layers) {
            actualTarget = actualTarget.concat(layerObjTable[layer.zIndex] || []);
            for (const obj of actualTarget) {
                const eventHandler: string = 'eventHandler';
                if (obj.shape.type === 'Bpmn' && (obj as Node).processId && (!(diagram[eventHandler].tool instanceof MoveTool) ||
                    (diagram[eventHandler].tool instanceof MoveTool) && canAllowDrop(obj))) {
                    const index: number = actualTarget.indexOf(diagram.nameTable[(obj as Node).processId]);
                    if (index > -1) { actualTarget.splice(index, 1); }
                }
                if (obj.shape.type === 'UmlClassifier' && (obj as Node).container && (obj as Node).container.type === 'Stack') {
                    const index: number = actualTarget.indexOf(diagram.nameTable[diagram.nameTable[obj.id].wrapper.children[0].id]);
                    if (index > -1) { actualTarget.splice(index, 1); }
                }
            }
        }
        for (let i: number = 0; i < actualTarget.length; i++) {
            let parentObj: NodeModel = diagram.nameTable[(actualTarget[i] as Node).parentId];
            if (parentObj) {
                const portElement: DiagramElement = this.findElementUnderMouse(parentObj as IElement, pt);
                for (let j: number = 0; j < parentObj.ports.length; j++) {
                    if (portElement.id.match('_' + parentObj.ports[j].id + '$')) {
                        const port: PointPortModel = parentObj.ports[j];
                        if (canDrag(port, diagram) || canDraw(port, diagram)) {
                            return actualTarget as IElement[];
                        }
                    }
                }
            }
            while (parentObj) {
                const index: number = actualTarget.indexOf(parentObj);
                if (index !== -1) {
                    actualTarget.splice(index, 1);
                } else { break; }
                parentObj = diagram.nameTable[(parentObj as Node).parentId];
            }
        }
        this.checkSwimlane(actualTarget, diagram);
        if (eventArgs && !eventArgs.source) {
            for (let i: number = 0; i < actualTarget.length; i++) {
                const parentNode: NodeModel = diagram.nameTable[(actualTarget[i] as Node).parentId];
                if (parentNode && parentNode.shape.type === 'SwimLane') {
                    for (let j: number = 0; j < actualTarget.length; j++) {
                        const connector: ConnectorModel | NodeModel = actualTarget[j];
                        if (connector instanceof Connector) { actualTarget.splice(i, 1); }
                    }
                }
            }
        }
        return actualTarget as IElement[];
    }
    /** @private */
    public checkSwimlane(actualTarget: (NodeModel | ConnectorModel)[], diagram: Diagram): void {
        let isNode: Boolean;
        for (let m: number = 0; m < actualTarget.length; m++) {
            let obj: NodeModel | ConnectorModel = actualTarget[m];
            let parentNode: string;
            let node: Node;
            if (obj instanceof Node) {
                parentNode = (actualTarget[m] as Node).parentId;
                node = obj as Node;
            }
            if (parentNode === '') {
                if (node.shape.type !== 'SwimLane') {
                    isNode = true;
                } else {
                    isNode = false;
                }
            }
            let parent: NodeModel = diagram.nameTable[parentNode];
            if (parent && (parent as Node).isLane && diagram.nameTable[(parent as Node).parentId].zIndex > (obj as Node).zIndex) {
                actualTarget[m] = parent;
            }
            if (m > 0 && isNode && node && (node.isLane || node.isPhase || node.isHeader)) {
                if ((actualTarget[m] as Node).zIndex < (actualTarget[m - 1] as Node).zIndex) {
                    let swap: NodeModel | ConnectorModel = actualTarget[m];
                    actualTarget[m] = actualTarget[m - 1];
                    actualTarget[m - 1] = swap;
                }
            }
        }
        if (actualTarget.length >= 2) {
            let parent: string = '';
            for (let i: number = actualTarget.length - 1; i >= 0; i--) {
                if ((actualTarget[i] as Node).parentId) {
                    let parent1: string = findParentInSwimlane(actualTarget[i] as Node, diagram, parent);
                    let parent2: string = findParentInSwimlane(actualTarget[i - 1] as Node, diagram, parent);
                    let parentNode1: Node = diagram.nameTable[parent1];
                    let parentNode2: Node = diagram.nameTable[parent2];
                    if (parentNode2 && parent1 !== parent2 && parentNode1.zIndex < parentNode2.zIndex) {
                        actualTarget.splice(i, 1);
                    }
                }
            }
        }
    }

    /** @private */
    public isTarget(actualTarget: Node, diagram: Diagram, action: string): IElement {
        const connector: ConnectorModel = diagram.selectedItems.connectors[0];
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
            const targetNode: NodeModel = diagram.nameTable[connector.targetID];
            if (targetNode && targetNode.shape && ((targetNode.shape as BpmnShapeModel).shape === 'TextAnnotation')) {
                const id: string[] = connector.id.split('_');
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

        const eventHandler: string = 'eventHandler';
        const endPoint: string = 'endPoint';
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
                const connector: ConnectorModel = diagram.selectedItems.connectors[0];
                for (let i: number = objects.length - 1; i >= 0; i--) {
                    outPort = getInOutConnectPorts(objects[i] as Node, false);
                    inPort = getInOutConnectPorts(objects[i] as Node, true);
                    const tool: ConnectTool = (diagram[eventHandler].tool as ConnectTool);
                    const portElement: DiagramElement = this.findTargetElement(objects[i].wrapper, position, undefined);

                    if (action === 'Draw' && portElement && (objects[i] instanceof Node) && !checkPort(objects[i], portElement)) {
                        if (((tool && tool[endPoint] === 'ConnectorSourceEnd') && !canOutConnect(objects[i] as NodeModel)) ||
                            ((tool && tool[endPoint] === 'ConnectorTargetEnd') && !canInConnect(objects[i] as NodeModel))) {
                            return actualTarget as IElement;
                        }
                    }
                    // eslint-disable-next-line max-len
                    if (objects[i] instanceof Node && ((canOutConnect(objects[i] as NodeModel) || (canPortOutConnect(outPort)) || canInConnect(objects[i] as NodeModel) || (canPortInConnect(inPort))) ||
                        (action === 'PortDraw' && (tool instanceof ConnectTool) && tool[endPoint] === 'ConnectorTargetEnd' &&
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
                    const temp: NodeModel | ConnectorModel = objects[i];
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
                        // eslint-disable-next-line no-self-assign
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
                        const objj1 = objects[i - 1] as NodeModel;
                        if (objects[i - 1] instanceof Node && objj1.ports) {
                            const portElement: DiagramElement = this.findTargetElement(objj1.wrapper, position, undefined);
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
                        const selected: boolean = isSelected(diagram, obj);
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
                        const portElement = this.findTargetElement(objects[i].wrapper, position, undefined);
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
            const element: DiagramElement = container.children[i];
            if (element && element.outerBounds.containsPoint(position, padding || 0)) {
                if (element instanceof Container) {
                    const target: DiagramElement = this.findTargetElement(element, position);
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
