import { PointModel } from '../primitives/point-model';
import { Node } from '../objects/node';
import { Connector, BezierSegment, StraightSegment } from '../objects/connector';
import { NodeModel, BasicShapeModel } from '../objects/node-model';
import { ConnectorModel, StraightSegmentModel } from '../objects/connector-model';
import { Point } from '../primitives/point';
import { BpmnSubEvent } from '../objects/node';
import { PointPort } from '../objects/port';
import { IElement, ISizeChangeEventArgs, IDraggingEventArgs, IEndChangeEventArgs } from '../objects/interface/IElement';
import { IRotationEventArgs, IDoubleClickEventArgs, IClickEventArgs, IDropEventArgs } from '../objects/interface/IElement';
import { CommandHandler } from './command-manager';
import { rotatePoint, cloneObject } from '../utility/base-util';
import { Rect } from '../primitives/rect';
import { getPolygonPath } from '../utility/path-util';
import { canOutConnect, canInConnect, canAllowDrop } from '../utility/constraints-util';
import { HistoryEntry } from '../diagram/history';
import { Matrix, transformPointByMatrix, rotateMatrix, identityMatrix } from '../primitives/matrix';
import { Snap } from './../objects/snapping';
import { NodeConstraints, DiagramEvent, ObjectTypes } from './../enum/enum';
import { PointPortModel, PortModel } from './../objects/port-model';
import { ITouches } from '../objects/interface/interfaces';
import { SelectorModel } from './selector-model';
import { MouseEventArgs } from './event-handlers';
import { TextElement } from '../core/elements/text-element';
import { PathElement } from '../core/elements/path-element';
import { Container } from '../core/containers/container';
import { contains, Actions } from './actions';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';
import { Selector } from './selector';
import { DiagramElement } from '../core/elements/diagram-element';
/**
 * Defines the interactive tools
 */
export class ToolBase {
    /**
     * Initializes the tool
     * @param command Command that is corresponding to the current action
     */
    constructor(command: CommandHandler, protectChange: boolean = false) {
        this.commandHandler = command;
        this.isProtectChange = protectChange;
    }

    /**
     * Command that is corresponding to the current action
     */
    protected commandHandler: CommandHandler = null;

    /**
     * Sets/Gets whether the interaction is being done
     */
    protected inAction: boolean = false;

    /**
     * Sets/Gets the protect change
     */
    protected isProtectChange: boolean = false;

    /**
     * Sets/Gets the current mouse position
     */
    protected currentPosition: PointModel;

    /**
     * Sets/Gets the previous mouse position
     */
    public prevPosition: PointModel;

    /**
     * Sets/Gets the initial mouse position
     */
    protected startPosition: PointModel;

    /**
     * Sets/Gets the current element that is under mouse
     */
    protected currentElement: IElement = null;

    /**   @private  */
    public blocked: boolean = false;

    protected isTooltipVisible: boolean = false;

    /** @private */
    public childTable: {} = {};

    /**
     * Sets/Gets the previous object when mouse down
     */
    protected undoElement: SelectorModel = { nodes: [], connectors: [] };

    protected undoParentElement: SelectorModel = { nodes: [], connectors: [] };

    protected startAction(currentElement: IElement): void {
        this.currentElement = currentElement;
        this.inAction = true;
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.currentElement = args.source;
        this.startPosition = this.currentPosition = this.prevPosition = args.position;
        this.isTooltipVisible = true;
        this.startAction(args.source);
        this.commandHandler.startTransaction(this.isProtectChange);
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        this.currentPosition = args.position;
        //this.currentElement = currentElement;
        return !this.blocked;

    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        this.currentPosition = args.position;
        // this.currentElement = currentElement;
        this.isTooltipVisible = false;
        this.commandHandler.endTransaction(this.isProtectChange);
        //At the end
        this.endAction();
    }

    protected endAction(): void {
        if (!this.isTooltipVisible) {
            this.commandHandler.closeTooltip();
        }
        this.commandHandler = null;
        this.currentElement = null;
        this.currentPosition = null;
        this.inAction = false;
        this.blocked = false;
    }

    /**   @private  */
    public mouseWheel(args: MouseEventArgs): void {
        this.currentPosition = args.position;
    }

    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }
    protected updateSize(
        shape: SelectorModel, startPoint: PointModel, endPoint: PointModel, corner: string, initialBounds: Rect, angle?: number): Rect {
        let horizontalsnap: Snap = { snapped: false, offset: 0, left: false, right: false };
        let verticalsnap: Snap = { snapped: false, offset: 0, top: false, bottom: false };
        let difx: number = this.currentPosition.x - this.startPosition.x;
        let dify: number = this.currentPosition.y - this.startPosition.y;
        let snapEnabled: boolean = (!(shape instanceof TextElement)) && this.commandHandler.snappingModule
            && this.commandHandler.snappingModule.canSnap();
        let snapLine: SVGElement = snapEnabled ? this.commandHandler.snappingModule.getLayer() : null;
        let rotateAngle: number = (shape instanceof TextElement) ? angle : shape.rotateAngle;
        let matrix: Matrix;
        matrix = identityMatrix();
        rotateMatrix(matrix, -rotateAngle, 0, 0);
        let x: number = shape.offsetX; let y: number = shape.offsetY;
        let w: number = shape.width; let h: number = shape.height;
        x = x - w * shape.pivot.x; y = y - h * shape.pivot.y;
        let deltaWidth: number = 0; let deltaHeight: number = 0;
        let diff: PointModel;
        let width: number = (shape instanceof TextElement) ? shape.actualSize.width : shape.width;
        let height: number = (shape instanceof TextElement) ? shape.actualSize.height : shape.height;
        switch (corner) {
            case 'ResizeWest':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                deltaHeight = 1;
                difx = snapEnabled ? this.commandHandler.snappingModule.snapLeft(
                    horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) : difx;
                dify = 0; deltaWidth = (initialBounds.width - difx) / width; break;
            case 'ResizeEast':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify }));
                difx = diff.x;
                dify = diff.y;
                difx = snapEnabled ? this.commandHandler.snappingModule.snapRight(
                    horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) :
                    difx;
                dify = 0;
                deltaWidth = (initialBounds.width + difx) / width;
                deltaHeight = 1;
                break;
            case 'ResizeNorth':
                deltaWidth = 1;
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                dify = snapEnabled ? this.commandHandler.snappingModule.snapTop(
                    horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) :
                    dify;
                deltaHeight = (initialBounds.height - dify) / height; break;
            case 'ResizeSouth':
                deltaWidth = 1;
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                dify = snapEnabled ? this.commandHandler.snappingModule.snapBottom(
                    horizontalsnap, verticalsnap, snapLine, diff.x, diff.y, shape, endPoint === startPoint, initialBounds) :
                    dify;
                deltaHeight = (initialBounds.height + dify) / height; break;
            case 'ResizeNorthEast':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                difx = snapEnabled ? this.commandHandler.snappingModule.snapRight(
                    horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) :
                    difx;
                dify = snapEnabled ? this.commandHandler.snappingModule.snapTop(
                    horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) :
                    dify;
                deltaWidth = (initialBounds.width + difx) / width; deltaHeight = (initialBounds.height - dify) / height;
                break;
            case 'ResizeNorthWest':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                dify = !snapEnabled ? dify : this.commandHandler.snappingModule.snapTop(
                    horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds);
                difx = !snapEnabled ? difx : this.commandHandler.snappingModule.snapLeft(
                    horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds);
                deltaWidth = (initialBounds.width - difx) / width; deltaHeight = (initialBounds.height - dify) / height;
                break;
            case 'ResizeSouthEast':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                dify = !snapEnabled ? dify : this.commandHandler.snappingModule.snapBottom(
                    horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds);
                difx = !snapEnabled ? difx : this.commandHandler.snappingModule.snapRight(
                    horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds);
                deltaHeight = (initialBounds.height + dify) / height; deltaWidth = (initialBounds.width + difx) / width;
                break;
            case 'ResizeSouthWest':
                diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
                dify = snapEnabled ? this.commandHandler.snappingModule.snapBottom(
                    horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) : dify;
                difx = snapEnabled ? this.commandHandler.snappingModule.snapLeft(
                    horizontalsnap, verticalsnap, snapLine, difx, dify, shape, endPoint === startPoint, initialBounds) : difx;
                deltaWidth = (initialBounds.width - difx) / width; deltaHeight = (initialBounds.height + dify) / height; break;
        }
        return { width: deltaWidth, height: deltaHeight } as Rect;
    }

    protected getPivot(corner: string): PointModel {
        switch (corner) {
            case 'ResizeWest':
                return { x: 1, y: 0.5 };
            case 'ResizeEast':
                return { x: 0, y: 0.5 };
            case 'ResizeNorth':
                return { x: 0.5, y: 1 };
            case 'ResizeSouth':
                return { x: 0.5, y: 0 };
            case 'ResizeNorthEast':
                return { x: 0, y: 1 };
            case 'ResizeNorthWest':
                return { x: 1, y: 1 };
            case 'ResizeSouthEast':
                return { x: 0, y: 0 };
            case 'ResizeSouthWest':
                return { x: 1, y: 0 };
        }
        return { x: 0.5, y: 0.5 };
    }
}

/**
 * Helps to select the objects
 */
export class SelectTool extends ToolBase {
    private action: Actions;
    constructor(commandHandler: CommandHandler, protectChange: boolean, action?: Actions) {
        super(commandHandler, true);
        this.action = action;
    }
    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        super.mouseDown(args);
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        //draw selected region
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            let rect: Rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
            this.commandHandler.drawSelectionRectangle(rect.x, rect.y, rect.width, rect.height);
        }
        return !this.blocked;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        //rubber band selection
        if (Point.equals(this.currentPosition, this.prevPosition) === false && this.inAction) {
            let region: Rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
            this.commandHandler.doRubberBandSelection(region);
        } else {
            //single selection
            let arrayNodes: (NodeModel | ConnectorModel)[] = this.commandHandler.getSelectedObject();
            if (!this.commandHandler.hasSelection() || !args.info || !args.info.ctrlKey) {
                this.commandHandler.clearSelection(args.source === null ? true : false);
                if (this.action === 'LabelSelect') {
                    this.commandHandler.labelSelect(args.source, args.sourceWrapper);
                } else if (args.source) {
                    this.commandHandler.selectObjects([args.source], false, arrayNodes);
                }
            } else {
                //handling multiple selection
                if (args && args.source) {
                    if (!this.commandHandler.isSelected(args.source)) {
                        this.commandHandler.selectObjects([args.source], true);
                    } else {
                        if (args.clickCount === 1) {
                            this.commandHandler.unSelect(args.source);
                        }
                    }
                }
            }
        }
        this.inAction = false;
        super.mouseUp(args);
    }

    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        if (this.inAction) {
            this.mouseUp(args);
        }
    }
}

/**
 * Helps to edit the selected connectors
 */
export class ConnectTool extends ToolBase {

    protected endPoint: string;

    /**   @private  */
    public selectedSegment: BezierSegment;

    constructor(commandHandler: CommandHandler, endPoint: string) {
        super(commandHandler, true);
        this.endPoint = endPoint;
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        this.undoElement = undefined;
        if (!(this instanceof ConnectorDrawingTool)) {
            this.undoElement = cloneObject(args.source);
        }
        super.mouseDown(args);
        let oldValue: PointModel;
        let connectors: ConnectorModel;
        if (args.source && (args.source as SelectorModel).connectors) {
            oldValue = { x: this.prevPosition.x, y: this.prevPosition.y };
            connectors = (args.source as SelectorModel).connectors[0];
        }
        // Sets the selected segment 
        if (this.endPoint === 'BezierSourceThumb' || this.endPoint === 'BezierTargetThumb') {
            for (let i: number = 0; i < connectors.segments.length; i++) {
                let segment: BezierSegment = connectors.segments[i] as BezierSegment;
                let segmentpoint1: PointModel = !Point.isEmptyPoint(segment.point1) ? segment.point1 : segment.bezierPoint1;
                let segmentpoint2: PointModel = !Point.isEmptyPoint(segment.point2) ? segment.point2 : segment.bezierPoint2;
                if (contains(this.currentPosition, segmentpoint1, connectors.hitPadding) ||
                    contains(this.currentPosition, segmentpoint2, connectors.hitPadding)) {
                    this.selectedSegment = segment;
                }
            }
        }
        this.currentPosition = args.position;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        this.commandHandler.updateSelector();
        this.commandHandler.removeSnap();
        this.commandHandler.changeAnnotationDrag(args);
        if ((!(this instanceof ConnectorDrawingTool)) && ((this.endPoint === 'ConnectorSourceEnd' &&
            (args.source as SelectorModel).connectors.length &&
            ((!Point.equals((args.source as SelectorModel).connectors[0].sourcePoint, this.undoElement.connectors[0].sourcePoint) ||
                ((args.source as SelectorModel).connectors[0].sourceID !== this.undoElement.connectors[0].sourceID)))) ||
            (this.endPoint === 'ConnectorTargetEnd' &&
                ((!Point.equals((args.source as SelectorModel).connectors[0].targetPoint, this.undoElement.connectors[0].targetPoint))
                    || ((args.source as SelectorModel).connectors[0].targetID !== this.undoElement.connectors[0].targetID))))) {

            let oldValues: PointModel;
            let connector: ConnectorModel;
            if (args.source && (args.source as SelectorModel).connectors) {
                oldValues = {
                    x: this.prevPosition.x, y: this.prevPosition.y
                };
                connector = (args.source as SelectorModel).connectors[0];
            }
            let targetPortName: string;
            let targetNodeNode: string;
            if (args.target) {
                let target: NodeModel | PointPortModel = this.commandHandler.findTarget(
                    args.targetWrapper, args.target, this.endPoint === 'ConnectorSourceEnd', true) as NodeModel | PointPortModel;
                (target instanceof PointPort) ? targetPortName = target.id : targetNodeNode = target.id;
            }
            let arg: IEndChangeEventArgs = {
                connector: connector, state: 'Completed', targetNode: targetNodeNode,
                oldValue: oldValues, newValue: oldValues, cancel: false, targetPort: targetPortName
            };
            let trigger: number = this.endPoint === 'ConnectorSourceEnd' ? DiagramEvent.sourcePointChange : DiagramEvent.targetPointChange;
            this.commandHandler.triggerEvent(trigger, arg);
            this.commandHandler.removeTerminalSegment(connector as Connector, true);
            if (this.undoElement && args.source) {
                let obj: SelectorModel;
                obj = cloneObject(args.source);
                let entry: HistoryEntry = {
                    type: 'ConnectionChanged', redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement),
                    category: 'Internal'
                };
                this.commandHandler.addHistoryEntry(entry);
            }
        } else if (!(this instanceof ConnectorDrawingTool) &&
            (this.endPoint === 'BezierTargetThumb' || this.endPoint === 'BezierSourceThumb')) {
            if (this.undoElement && args.source) {
                let obj: SelectorModel;
                obj = cloneObject(args.source);
                let entry: HistoryEntry = {
                    type: 'SegmentChanged', redoObject: obj, undoObject: this.undoElement, category: 'Internal'
                };
                this.commandHandler.addHistoryEntry(entry);
            }
        }
        super.mouseUp(args);
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if ((!(this instanceof ConnectorDrawingTool)) && ((this.endPoint === 'ConnectorSourceEnd' &&
            Point.equals((args.source as SelectorModel).connectors[0].sourcePoint, this.undoElement.connectors[0].sourcePoint)) ||
            (this.endPoint === 'ConnectorTargetEnd' &&
                Point.equals((args.source as SelectorModel).connectors[0].targetPoint, this.undoElement.connectors[0].targetPoint)))) {
            let oldValue: PointModel;
            let connectors: ConnectorModel;
            if (args.source && (args.source as SelectorModel).connectors) {
                oldValue = { x: this.prevPosition.x, y: this.prevPosition.y };
                connectors = (args.source as SelectorModel).connectors[0];
            }
            let targetPort: string;
            let targetNode: string;
            if (args.target) {
                targetNode = (args.target as NodeModel).id;
                let target: NodeModel | PointPortModel = this.commandHandler.findTarget(
                    args.targetWrapper, args.target, this.endPoint === 'ConnectorSourceEnd', true) as NodeModel | PointPortModel;
                (target instanceof PointPort || target instanceof BpmnSubEvent) ? targetPort = target.id : targetNode = target.id;
            }
            let arg: IEndChangeEventArgs = {
                connector: connectors, state: 'Start', targetNode: targetNode,
                oldValue: oldValue, newValue: oldValue, cancel: false, targetPort: targetPort
            };
            let trigger: number = this.endPoint === 'ConnectorSourceEnd' ?
                DiagramEvent.sourcePointChange : DiagramEvent.targetPointChange;
            this.commandHandler.triggerEvent(trigger, arg);
        }
        this.currentPosition = args.position;
        if (this.currentPosition && this.prevPosition) {
            let diffX: number = this.currentPosition.x - this.prevPosition.x;
            let diffY: number = this.currentPosition.y - this.prevPosition.y;
            let newValue: PointModel;
            let oldValue: PointModel;
            this.currentPosition = this.commandHandler.snapConnectorEnd(this.currentPosition);
            let connector: ConnectorModel;
            if (args.source && (args.source as SelectorModel).connectors) {
                newValue = {
                    x: this.currentPosition.x, y: this.currentPosition.y,
                };
                oldValue = {
                    x: this.prevPosition.x, y: this.prevPosition.y
                };
                connector = (args.source as SelectorModel).connectors[0];
            }
            let targetPortId: string;
            let targetNodeId: string;
            if (args.target) {
                let target: NodeModel | PointPortModel = this.commandHandler.findTarget(
                    args.targetWrapper, args.target, this.endPoint === 'ConnectorSourceEnd', true) as NodeModel | PointPortModel;
                (target instanceof PointPort) ? targetPortId = target.id : targetNodeId = target.id;
            }
            let arg: IEndChangeEventArgs = {
                connector: connector, state: 'Progress', targetNode: targetNodeId,
                oldValue: oldValue, newValue: newValue, cancel: false, targetPort: targetPortId
            };
            if (!(this instanceof ConnectorDrawingTool)) {
                let trigger: number = this.endPoint === 'ConnectorSourceEnd' ?
                    DiagramEvent.sourcePointChange : DiagramEvent.targetPointChange;
                this.commandHandler.triggerEvent(trigger, arg);
            }
            if (!arg.cancel && this.inAction && this.endPoint !== undefined && diffX !== 0 || diffY !== 0) {
                this.blocked = !this.commandHandler.dragConnectorEnds(
                    this.endPoint, args.source, this.currentPosition, this.selectedSegment, args.target, targetPortId);
                this.commandHandler.updateSelector();
                if (args.target && ((this.endPoint === 'ConnectorSourceEnd' && canOutConnect(args.target))
                    || (this.endPoint === 'ConnectorTargetEnd' && canInConnect(args.target)))) {
                    if (this.commandHandler.canDisconnect(this.endPoint, args, targetPortId, targetNodeId)) {
                        this.commandHandler.disConnect(args.source, this.endPoint);
                    }
                    this.commandHandler.connect(this.endPoint, args);
                } else if (this.endPoint.indexOf('Bezier') === -1) {
                    this.commandHandler.disConnect(args.source, this.endPoint);
                    this.commandHandler.updateSelector();
                }
            }
            if (this.commandHandler.canEnableDefaultTooltip()) {
                let content: string = this.getTooltipContent(args.position);
                this.commandHandler.showTooltip(args.source, args.position, content, 'ConnectTool', this.isTooltipVisible);
                this.isTooltipVisible = false;
            }
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }
    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    private getTooltipContent(position: PointModel): string {
        return 'X:' + Math.round(position.x) + ' ' + 'Y:' + Math.round(position.y);
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
        this.prevPosition = null;
        this.endPoint = null;
    }
}

/**
 * Drags the selected objects
 */
export class MoveTool extends ToolBase {
    /**
     * Sets/Gets the previous mouse position
     */
    public prevPosition: PointModel;

    private initialOffset: PointModel;

    /**   @private  */
    public currentTarget: IElement = null;

    private objectType: ObjectTypes;

    private portId: string;

    private source: NodeModel | PortModel;

    constructor(commandHandler: CommandHandler, objType?: ObjectTypes) {
        super(commandHandler, true);
        this.objectType = objType;
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        if (args.source instanceof Node || args.source instanceof Connector) {
            this.commandHandler.selectObjects([args.source], args.info && args.info.ctrlKey);
            let selectedObject: SelectorModel = { nodes: [], connectors: [] };
            if (args.source instanceof Node) {
                selectedObject.nodes.push(cloneObject(args.source) as Node);
            } else {
                selectedObject.connectors.push(cloneObject(args.source) as Connector);
            }
            this.undoElement = cloneObject(selectedObject);
        } else {
            this.undoElement = cloneObject(args.source);
        }

        this.undoParentElement = this.commandHandler.getSubProcess(args.source);
        if (this.objectType === 'Port') {
            this.portId = args.sourceWrapper.id;
        }
        super.mouseDown(args);
        this.initialOffset = { x: 0, y: 0 };
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        let obj: SelectorModel; let historyAdded: boolean = false;
        let redoObject: SelectorModel = { nodes: [], connectors: [] };
        if (this.objectType !== 'Port') {
            if (args.source instanceof Node || args.source instanceof Connector) {
                if (args.source instanceof Node) {
                    redoObject.nodes.push(cloneObject(args.source) as Node);
                } else {
                    redoObject.connectors.push(cloneObject(args.source) as Connector);
                }
                obj = cloneObject(redoObject);
                let wrapper: Container = args.source.wrapper;
                obj.offsetX = wrapper.offsetX;
                obj.offsetY = wrapper.offsetY;

            } else {
                obj = cloneObject(args.source);
            }
            if (obj.offsetX !== this.undoElement.offsetX || obj.offsetY !== this.undoElement.offsetY) {
                let oldValues: SelectorModel; let newValues: SelectorModel;
                if (args.source) {
                    newValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
                    oldValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
                }
                let arg: IDraggingEventArgs = {
                    source: args.source, state: 'Completed', oldValue: oldValues, newValue: newValues,
                    target: this.currentTarget, targetPosition: this.currentPosition, allowDrop: true, cancel: false
                };

                this.commandHandler.triggerEvent(DiagramEvent.positionChange, arg);
                this.commandHandler.startGroupAction(); historyAdded = true;
                let entry: HistoryEntry = {
                    type: 'PositionChanged',
                    redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement), category: 'Internal'
                };
                if ((obj.nodes[0] as Node) && (obj.nodes[0] as Node).processId) {
                    let entry: HistoryEntry = {
                        type: 'SizeChanged', category: 'Internal',
                        undoObject: this.undoParentElement, redoObject: this.commandHandler.getSubProcess(args.source)
                    };
                    this.commandHandler.addHistoryEntry(entry);
                }
                this.commandHandler.addHistoryEntry(entry);
            }
            let snappedPoint: PointModel = this.commandHandler.snapPoint(
                this.prevPosition, this.currentPosition, 0, 0);
            this.commandHandler.removeSnap();

            this.commandHandler.removeHighlighter();
            if (args.source && this.currentTarget && canAllowDrop(this.currentTarget) &&
                this.commandHandler.isDroppable(args.source, this.currentTarget)) {
                this.commandHandler.drop(this.currentElement, this.currentTarget, this.currentPosition);
                let arg: IDropEventArgs = {
                    element: args.source, target: this.currentTarget, position: this.currentPosition, cancel: false
                };
                this.commandHandler.triggerEvent(DiagramEvent.drop, arg);
            }
            if (args.source && this.currentTarget) {
                this.commandHandler.dropAnnotation(args.source, this.currentTarget);
            }
            this.commandHandler.updateSelector();
            if (historyAdded) {
                this.commandHandler.endGroupAction();
            }
        } else {
            redoObject.nodes.push(cloneObject(args.source) as Node);
            obj = cloneObject(redoObject);
            let entry: HistoryEntry = {
                type: 'PortPositionChanged', changeObjectId: this.portId,
                redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement), category: 'Internal'
            };
            this.commandHandler.addHistoryEntry(entry);
        }
        super.mouseUp(args);
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let isSame: boolean = false;
        if (args.source instanceof Node || args.source instanceof Connector) {
            if (args.source instanceof Node) {
                if (args.source.offsetX === this.undoElement.nodes[0].offsetX &&
                    args.source.offsetY === this.undoElement.nodes[0].offsetY) {
                    isSame = true;
                }
            } else {
                if (Point.equals(args.source.sourcePoint, this.undoElement.connectors[0].sourcePoint) &&
                    Point.equals(args.source.targetPoint, this.undoElement.connectors[0].targetPoint)) {
                    isSame = true;
                }
            }
        } else {
            if (args.source.wrapper.offsetX === this.undoElement.wrapper.offsetX &&
                args.source.wrapper.offsetY === this.undoElement.wrapper.offsetY) {
                isSame = true;
            }
        }
        let oldValues: SelectorModel;
        if (args.source) {
            oldValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
        }
        let arg: IDraggingEventArgs = {
            source: args.source, state: 'Start', oldValue: oldValues, newValue: oldValues,
            target: args.target, targetPosition: args.position, allowDrop: true, cancel: false
        };
        if (isSame) {
            this.commandHandler.triggerEvent(DiagramEvent.positionChange, arg);
        }
        this.currentPosition = args.position;
        if (this.objectType !== 'Port') {
            let x: number = this.currentPosition.x - this.prevPosition.x;
            let y: number = this.currentPosition.y - this.prevPosition.y;

            let diffX: number = this.initialOffset.x + (this.currentPosition.x - this.prevPosition.x);
            let diffY: number = this.initialOffset.y + (this.currentPosition.y - this.prevPosition.y);

            this.commandHandler.dragOverElement(args, this.currentPosition);
            this.commandHandler.disConnect(args.source);
            this.commandHandler.removeSnap();
            let oldValues: SelectorModel;
            let newValues: SelectorModel;
            let snappedPoint: PointModel = this.commandHandler.snapPoint(
                this.prevPosition, this.currentPosition, diffX, diffY);
            this.initialOffset.x = diffX - snappedPoint.x;
            this.initialOffset.y = diffY - snappedPoint.y;
            if (args.source) {
                oldValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
                newValues = {
                    offsetX: args.source.wrapper.offsetX + snappedPoint.x,
                    offsetY: args.source.wrapper.offsetY + snappedPoint.y
                };
            }
            if (this.currentTarget && args.target !== this.currentTarget) {
                this.commandHandler.removeChildFromBPmn(args.source, args.target, this.currentTarget);
            }
            this.currentTarget = args.target;
            let arg: IDraggingEventArgs = {
                source: args.source, state: 'Progress', oldValue: oldValues, newValue: newValues,
                target: args.target, targetPosition: args.position, allowDrop: true, cancel: false
            };
            this.commandHandler.triggerEvent(DiagramEvent.positionChange, arg);
            if (!arg.cancel) {
                this.blocked = !this.commandHandler.dragSelectedObjects(snappedPoint.x, snappedPoint.y);
                let blocked: boolean = !(this.commandHandler.mouseOver(this.currentElement, this.currentTarget, this.currentPosition));
                this.blocked = this.blocked || blocked;
            }
            if (this.currentTarget && (args.source !== this.currentTarget) &&
                this.commandHandler.isDroppable(args.source, this.currentTarget)) {
                this.commandHandler.drawHighlighter(this.currentTarget as IElement);
            } else {
                this.commandHandler.removeHighlighter();
            }
            if (this.commandHandler.canEnableDefaultTooltip()) {
                let content: string = this.getTooltipContent(args.source as SelectorModel);
                this.commandHandler.showTooltip(args.source, args.position, content, 'MoveTool', this.isTooltipVisible);
                this.isTooltipVisible = false;
            }
        } else {
            this.commandHandler.portDrag(
                args.source, args.sourceWrapper, args.position.x - this.prevPosition.x,
                args.position.y - this.prevPosition.y);
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }

    private getTooltipContent(node: SelectorModel): string {
        return 'X:' + Math.round(node.wrapper.bounds.x) + ' ' + 'Y:' + Math.round(node.wrapper.bounds.y);
    }

    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
        this.currentTarget = null;
        this.prevPosition = null;
    }
}

/**
 * Rotates the selected objects
 */
export class RotateTool extends ToolBase {

    constructor(commandHandler: CommandHandler) {
        super(commandHandler, true);
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.undoElement = cloneObject(args.source);
        if (this.undoElement.nodes[0] && this.undoElement.nodes[0].children) {
            let objects: (NodeModel | ConnectorModel)[] = [];
            let nodes: (NodeModel | ConnectorModel)[] = this.commandHandler.getAllDescendants(this.undoElement.nodes[0], objects);
            for (let i: number = 0; i < nodes.length; i++) {
                let node: NodeModel = this.commandHandler.cloneChild(nodes[i].id);
                this.childTable[nodes[i].id] = cloneObject(node);
            }
        }


        super.mouseDown(args);
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        if (this.undoElement.rotateAngle !== args.source.wrapper.rotateAngle) {
            let oldValue: SelectorModel = { rotateAngle: args.source.wrapper.rotateAngle };
            let arg: IRotationEventArgs = {
                source: args.source, state: 'Completed', oldValue: oldValue,
                newValue: oldValue, cancel: false
            };
            this.commandHandler.triggerEvent(DiagramEvent.rotateChange, arg);
            let obj: SelectorModel;
            obj = cloneObject(args.source);
            let entry: HistoryEntry = {
                type: 'RotationChanged', redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement), category: 'Internal',
                childTable: this.childTable
            };
            this.commandHandler.addHistoryEntry(entry);
            this.commandHandler.updateSelector();
        }
        super.mouseUp(args);
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.undoElement.rotateAngle === args.source.wrapper.rotateAngle) {
            let oldValue: SelectorModel = { rotateAngle: args.source.wrapper.rotateAngle };

            let arg: IRotationEventArgs = {
                source: args.source, state: 'Start', oldValue: oldValue, newValue: oldValue, cancel: false
            };
            this.commandHandler.triggerEvent(DiagramEvent.rotateChange, arg);
        }

        this.currentPosition = args.position;
        let refPoint: PointModel = { x: this.currentElement.wrapper.offsetX, y: this.currentElement.wrapper.offsetY };
        let angle: number = Point.findAngle(refPoint, this.currentPosition) + 90;
        let snapAngle: number = this.commandHandler.snapAngle(angle);
        angle = snapAngle !== 0 ? snapAngle : angle;
        angle = (angle + 360) % 360;
        let oldValue: SelectorModel = { rotateAngle: args.source.wrapper.rotateAngle };
        let newValue: SelectorModel = { rotateAngle: angle };
        let arg: IRotationEventArgs = {
            source: args.source, state: 'Progress', oldValue: oldValue,
            newValue: newValue, cancel: false
        };

        this.commandHandler.triggerEvent(DiagramEvent.rotateChange, arg);
        if (!arg.cancel) {
            this.blocked = !(this.commandHandler.rotateSelectedItems(angle - this.currentElement.wrapper.rotateAngle));
        }
        if (this.commandHandler.canEnableDefaultTooltip()) {
            let content: string = this.getTooltipContent(args.source as SelectorModel);
            this.commandHandler.showTooltip(args.source, args.position, content, 'RotateTool', this.isTooltipVisible);
            this.isTooltipVisible = false;
        }
        return !this.blocked;
    }


    private getTooltipContent(node: SelectorModel): string {
        return Math.round((node.rotateAngle % 360)).toString() + '\xB0';
    }

    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
    }
}

/**
 * Scales the selected objects
 */
export class ResizeTool extends ToolBase {
    /**
     * Sets/Gets the previous mouse position
     */
    public prevPosition: PointModel;

    private corner: string;

    /**   @private  */
    public initialOffset: PointModel;

    /**   @private  */
    public initialBounds: Rect = new Rect();


    constructor(commandHandler: CommandHandler, corner: string) {
        super(commandHandler, true);
        this.corner = corner;
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.undoElement = cloneObject(args.source);
        this.undoParentElement = this.commandHandler.getSubProcess(args.source);
        super.mouseDown(args);
        if (this.undoElement.nodes[0] && this.undoElement.nodes[0].children) {
            let elements: (NodeModel | ConnectorModel)[] = [];
            let nodes: (NodeModel | ConnectorModel)[] = this.commandHandler.getAllDescendants(this.undoElement.nodes[0], elements);
            for (let i: number = 0; i < nodes.length; i++) {
                let node: NodeModel = this.commandHandler.cloneChild(nodes[i].id);
                this.childTable[nodes[i].id] = cloneObject(node);
            }
        }
        super.mouseDown(args);
        this.initialBounds.x = args.source.wrapper.offsetX;
        this.initialBounds.y = args.source.wrapper.offsetY;
        this.initialBounds.height = args.source.wrapper.actualSize.height;
        this.initialBounds.width = args.source.wrapper.actualSize.width;

    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): boolean {
        this.commandHandler.removeSnap();
        if (this.undoElement.offsetX !== args.source.wrapper.offsetX || this.undoElement.offsetY !== args.source.wrapper.offsetY) {
            let deltaValues: Rect = this.updateSize(args.source, this.currentPosition, this.prevPosition, this.corner, this.initialBounds);
            this.blocked = this.scaleObjects(
                deltaValues.width, deltaValues.height, this.corner, this.currentPosition, this.prevPosition, args.source);
            let oldValue: SelectorModel = {
                offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY,
                width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
            };
            let arg: ISizeChangeEventArgs = {
                source: args.source, state: 'Completed',
                oldValue: oldValue, newValue: oldValue, cancel: false
            };
            this.commandHandler.triggerEvent(DiagramEvent.sizeChange, arg);
            let obj: SelectorModel = cloneObject(args.source);
            let entry: HistoryEntry = {
                type: 'SizeChanged', redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement), category: 'Internal',
                childTable: this.childTable
            };
            this.commandHandler.startGroupAction();
            this.commandHandler.addHistoryEntry(entry);
            if ((obj.nodes[0] as Node) && (obj.nodes[0] as Node).processId) {
                let entry: HistoryEntry = {
                    type: 'SizeChanged', redoObject: this.commandHandler.getSubProcess(args.source),
                    undoObject: this.undoParentElement, category: 'Internal'
                };
                this.commandHandler.addHistoryEntry(entry);
            }
            this.commandHandler.endGroupAction();
        }
        super.mouseUp(args);
        return !this.blocked;
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.undoElement.offsetX === args.source.wrapper.offsetX && this.undoElement.offsetY === args.source.wrapper.offsetY) {
            let oldValue: SelectorModel = {
                offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY,
                width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
            };

            let arg: ISizeChangeEventArgs = {
                source: args.source, state: 'Start', oldValue: oldValue, newValue: this.currentElement, cancel: false
            };
            this.commandHandler.triggerEvent(DiagramEvent.sizeChange, arg);
        }
        this.currentPosition = args.position;
        let x: number = this.currentPosition.x - this.startPosition.x;
        let y: number = this.currentPosition.y - this.startPosition.y;
        let changes: PointModel = { x: x, y: y };
        changes = rotatePoint(-this.currentElement.wrapper.rotateAngle, undefined, undefined, changes);
        let sx: number = (this.currentElement.wrapper.actualSize.width + changes.x) / this.currentElement.wrapper.actualSize.width;
        let sy: number = (this.currentElement.wrapper.actualSize.height + changes.y) / this.currentElement.wrapper.actualSize.height;
        changes = this.getChanges(changes);
        this.commandHandler.removeSnap();
        let deltaValues: Rect = this.updateSize(args.source, this.startPosition, this.currentPosition, this.corner, this.initialBounds);
        this.blocked = !(this.scaleObjects(
            deltaValues.width, deltaValues.height, this.corner, this.startPosition, this.currentPosition, args.source));
        if (this.commandHandler.canEnableDefaultTooltip()) {
            let content: string = this.getTooltipContent(args.source as SelectorModel);
            this.commandHandler.showTooltip(args.source, args.position, content, 'ResizeTool', this.isTooltipVisible);
            this.isTooltipVisible = false;
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }
    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }
    private getTooltipContent(node: SelectorModel): string {
        return 'W:' + Math.round(node.wrapper.bounds.width) + ' ' + 'H:' + Math.round(node.wrapper.bounds.height);
    }

    private getChanges(change: PointModel): PointModel {
        switch (this.corner) {
            case 'ResizeEast':
                return { x: change.x, y: 0 };
            case 'ResizeSouthEast':
                return change;
            case 'ResizeSouth':
                return { x: 0, y: change.y };
            case 'ResizeNorth':
                return { x: 0, y: -change.y };
            case 'ResizeNorthEast':
                return { x: change.x, y: -change.y };
            case 'ResizeNorthWest':
                return { x: -change.x, y: -change.y };
            case 'ResizeWest':
                return { x: - change.x, y: 0 };
            case 'ResizeSouthWest':
                return { x: - change.x, y: change.y };
        }
        return change;
    }
    /**
     * Updates the size with delta width and delta height using scaling.
     */

    /**
     * Aspect ratio used to resize the width or height based on resizing the height or width
     */
    private scaleObjects(
        deltaWidth: number, deltaHeight: number, corner: string, startPoint: PointModel, endPoint: PointModel,
        source?: SelectorModel)
        : boolean {
        if (source.nodes.length === 1 && source.nodes[0].constraints & NodeConstraints.AspectRatio) {
            if (corner === 'ResizeWest' || corner === 'ResizeEast' || corner === 'ResizeNorth' || corner === 'ResizeSouth') {
                if (!(deltaHeight === 1 && deltaWidth === 1)) {
                    deltaHeight = deltaWidth = Math.max(deltaHeight === 1 ? 0 : deltaHeight, deltaWidth === 1 ? 0 : deltaWidth);
                }
            } else if (startPoint !== endPoint) {
                deltaHeight = deltaWidth = Math.max(deltaHeight, deltaWidth);
            } else {
                deltaHeight = deltaWidth = 0;
            }
        }
        let oldValue: SelectorModel = {
            offsetX: source.offsetX, offsetY: source.offsetY,
            width: source.width, height: source.height
        };
        this.blocked = this.commandHandler.scaleSelectedItems(deltaWidth, deltaHeight, this.getPivot(this.corner));
        let newValue: SelectorModel = {
            offsetX: source.offsetX, offsetY: source.offsetY,
            width: source.width, height: source.height
        };
        let arg: ISizeChangeEventArgs = { source: source, state: 'Progress', oldValue: oldValue, newValue: newValue, cancel: false };
        this.commandHandler.triggerEvent(DiagramEvent.sizeChange, arg);
        if (arg.cancel) {
            this.commandHandler.scaleSelectedItems(1 / deltaWidth, 1 / deltaHeight, this.getPivot(this.corner));
        }
        return this.blocked;
    }


}

/**
 * Draws a node that is defined by the user
 */
export class NodeDrawingTool extends ToolBase {
    /** @private */
    public drawingObject: Node | Connector;
    /** @private */
    public sourceObject: Node | Connector;

    constructor(commandHandler: CommandHandler, sourceObject: Node | Connector) {
        super(commandHandler, true);
        this.sourceObject = sourceObject;
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let checkBoundaryConstraints: boolean;
        let node: NodeModel = {
            offsetX: this.currentPosition.x, width: 3, height: 3,
            offsetY: this.currentPosition.y
        };
        if (!this.drawingObject) {
            this.drawingObject = this.commandHandler.drawObject(node as Node);
        }
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            let rect: Rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
            checkBoundaryConstraints = this.commandHandler.checkBoundaryConstraints(undefined, undefined, rect);
            if (checkBoundaryConstraints) {
                this.commandHandler.updateNodeDimension(this.drawingObject, rect);
            }
        }
        return checkBoundaryConstraints;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        let checkBoundaryConstraints: boolean;
        let rect: Rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
        checkBoundaryConstraints = this.commandHandler.checkBoundaryConstraints(undefined, undefined, rect);
        if (this.drawingObject && this.drawingObject instanceof Node) {
            this.commandHandler.addObjectToDiagram(this.drawingObject);
            this.drawingObject = null;
        }
        super.mouseUp(args);
        this.inAction = false;
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
    }

    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        if (this.inAction) {
            this.mouseUp(args);
        }
    }

}
/**
 * Draws a connector that is defined by the user
 */
export class ConnectorDrawingTool extends ConnectTool {
    /** @private */
    public drawingObject: Node | Connector;
    /** @private */
    public sourceObject: Node | Connector;

    constructor(commandHandler: CommandHandler, endPoint: string, sourceObject: Node | Connector) {
        super(commandHandler, endPoint);
        this.sourceObject = sourceObject;
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        if (this.inAction) {
            let connector: ConnectorModel = {
                sourcePoint: this.currentPosition, targetPoint: this.currentPosition,
            };
            if (!this.drawingObject) {
                this.drawingObject = this.commandHandler.drawObject(connector as Connector);
            }
            args.source = this.drawingObject;
            if (args.target) {
                this.commandHandler.connect(this.endPoint, args);
            }
            this.endPoint = 'ConnectorTargetEnd';
        }
        if (!this.inAction) {
            this.commandHandler.updateSelector();
            if (args.source && args.sourceWrapper) {
                this.commandHandler.renderHighlighter(args, true);
            }
        }
        super.mouseMove(args);
        return !this.blocked;

    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        if (this.drawingObject && this.drawingObject instanceof Connector) {
            this.commandHandler.addObjectToDiagram(this.drawingObject);
            this.drawingObject = null;
        }
        this.inAction = false;
        super.mouseUp(args);
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
    }

    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        if (this.inAction) {
            this.mouseUp(args);
        }
    }

}

export class TextDrawingTool extends ToolBase {


    /**   @private  */
    public drawingNode: Node | Connector;

    constructor(commandHandler: CommandHandler) {
        super(commandHandler, true);
    }
    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.commandHandler.clearSelection();
        let node: NodeModel = {
            shape: { type: 'Text' },
            offsetX: this.currentPosition.x, width: 50, height: 20,
            offsetY: this.currentPosition.y
        };
        if (!args.source) {
            this.drawingNode = this.commandHandler.drawObject(node as Node);
        }
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (!this.drawingNode) {
            let node: NodeModel = {
                shape: { type: 'Text' }, offsetX: this.currentPosition.x, width: 30, height: 30,
                style: { strokeDashArray: '2 2', fill: 'transparent' }, offsetY: this.currentPosition.y
            };
            this.drawingNode = this.commandHandler.drawObject(node as Node);
        } else {
            this.drawingNode.style.strokeColor = 'black';
            this.drawingNode.style.strokeDashArray = '2 2';
            this.drawingNode.style.fill = 'transparent';
        }
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            let rect: Rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
            this.commandHandler.updateNodeDimension(this.drawingNode, rect);
        }
        return !this.blocked;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        if (this.drawingNode) {
            this.drawingNode.style.strokeColor = 'none';
            this.drawingNode.style.fill = 'none';
        } else {
            this.drawingNode = args.source as Node;
        }
        if (this.drawingNode && (this.drawingNode instanceof Node || this.drawingNode instanceof Connector)) {
            this.commandHandler.addText(this.drawingNode, this.currentPosition);
        }
        super.mouseUp(args);
        this.inAction = false;
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
    }

}


/**
 * Pans the diagram control on drag
 */
export class ZoomPanTool extends ToolBase {
    private zooming: boolean;
    constructor(commandHandler: CommandHandler, zoom: boolean) {
        super(commandHandler);
        this.zooming = zoom;
    }

    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            if (!this.zooming && Point.equals(this.currentPosition, this.prevPosition) === false) {
                let difX: number = this.currentPosition.x - this.prevPosition.x;
                let difY: number = this.currentPosition.y - this.prevPosition.y;
                this.commandHandler.scroll(difX, difY, this.currentPosition);
            } else if (args.moveTouches.length >= 2) {
                let startTouch0: ITouches = args.startTouches[0];
                let startTouch1: ITouches = args.startTouches[1];
                let moveTouch0: ITouches = args.moveTouches[0];
                let moveTouch1: ITouches = args.moveTouches[1];
                let scale: number = this.getDistance(moveTouch0, moveTouch1) / this.getDistance(startTouch0, startTouch1);
                let focusPoint: PointModel = args.position;
                this.commandHandler.zoom(scale, 0, 0, focusPoint);
                this.updateTouch(startTouch0, moveTouch0);
                this.updateTouch(startTouch1, moveTouch1);
            }
        }
        return !this.blocked;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        super.mouseUp(args);
        this.inAction = false;
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
    }

    private getDistance(touch1: ITouches, touch2: ITouches): number {
        let x: number = touch2.pageX - touch1.pageX;
        let y: number = touch2.pageY - touch1.pageY;
        return Math.sqrt((x * x) + (y * y));
    }

    private updateTouch(startTouch: ITouches, moveTouch: ITouches): void {
        startTouch.pageX = moveTouch.pageX;
        startTouch.pageY = moveTouch.pageY;
    }
}

/**
 * Animate the layout during expand and collapse
 */
export class ExpandTool extends ToolBase {
    constructor(commandHandler: CommandHandler) {
        super(commandHandler, true);
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        this.commandHandler.initExpand(args);
        super.mouseUp(args);
    }

}

/**
 * Opens the annotation hypeLink at mouse up
 */
export class LabelTool extends ToolBase {
    constructor(commandHandler: CommandHandler) {
        super(commandHandler, true);
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        let win: Window = window.open((args.sourceWrapper as TextElement).hyperlink.link, '_blank');
        win.focus();
        super.mouseUp(args);
    }
}

/**
 * Draws a Polygon shape node dynamically using polygon Tool
 */
export class PolygonDrawingTool extends ToolBase {
    /** @private */
    public drawingObject: Node | Connector;
    public startPoint: PointModel;
    constructor(commandHandler: CommandHandler) {
        super(commandHandler, true);
    }
    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
        if (!this.drawingObject) {
            this.startPoint = { x: this.startPosition.x, y: this.startPosition.y };
            let node: NodeModel = {
                offsetX: this.currentPosition.x,
                offsetY: this.currentPosition.y,
                width: 5, height: 5,
                style: { strokeColor: 'black', strokeWidth: 1 },
                shape: {
                    type: 'Basic',
                    shape: 'Polygon',
                    points:
                        [{ x: this.startPoint.x, y: this.startPoint.y }, { x: this.currentPosition.x, y: this.currentPosition.y }]
                }
            };
            this.drawingObject = this.commandHandler.drawObject(node as Node);
        } else {
            let pt: PointModel;
            let obj: BasicShapeModel = (this.drawingObject.shape as BasicShapeModel);
            pt = obj.points[obj.points.length - 1];
            pt = { x: pt.x, y: pt.y };
            (this.drawingObject.shape as BasicShapeModel).points.push(pt);
        }
    }

    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            let obj: BasicShapeModel = (this.drawingObject.shape as BasicShapeModel);
            if (this.drawingObject && this.currentPosition) {
                obj.points[obj.points.length - 1].x = this.currentPosition.x;
                obj.points[obj.points.length - 1].y = this.currentPosition.y;
                (this.drawingObject.wrapper.children[0] as PathElement).data = getPolygonPath(
                    (this.drawingObject.shape as BasicShapeModel).points);
                if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
                    let region: Rect = Rect.toBounds((this.drawingObject.shape as BasicShapeModel).points);
                    this.commandHandler.updateNodeDimension(this.drawingObject, region);
                }
            }
        }
        return true;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs, dblClickArgs?: IDoubleClickEventArgs | IClickEventArgs): void {
        super.mouseMove(args);
        if (this.inAction) {
            this.inAction = false;
            if (this.drawingObject) {
                this.commandHandler.addObjectToDiagram(this.drawingObject);
            }
        }
        this.endAction();
    }

    /**   @private  */
    public mouseWheel(args: MouseEventArgs): void {
        super.mouseWheel(args);
        this.mouseMove(args as MouseEventArgs);
    }

    /**   @private  */
    public endAction(): void {
        this.inAction = false;
        this.drawingObject = null;
    }
}
/**
 * Draws a PolyLine Connector dynamically using PolyLine Drawing Tool
 */
export class PolyLineDrawingTool extends ToolBase {
    /** @private */
    public drawingObject: Node | Connector;
    constructor(commandHandler: CommandHandler) {
        super(commandHandler, true);
    }
    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            let obj: Connector = (this.drawingObject as Connector);
            obj.targetPoint = this.currentPosition;
            this.commandHandler.updateConnectorPoints(obj);
        }
        return true;
    }
    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
        if (!this.drawingObject) {
            let connector: ConnectorModel = {
                id: 'Connector',
                type: 'Straight',
                sourcePoint: this.currentPosition,
                targetPoint: this.currentPosition
            };
            this.drawingObject = this.commandHandler.drawObject(connector as Connector);
        } else {
            let drawObject: Connector = this.drawingObject as Connector;
            let segment: StraightSegmentModel;
            segment = new StraightSegment(drawObject, 'segments', { type: 'Straight' }, true);
            segment.point = this.currentPosition;
            drawObject.segments[drawObject.segments.length - 1] = segment;
        }
    }
    /**   @private  */
    public mouseWheel(args: MouseEventArgs): void {
        super.mouseWheel(args); this.mouseMove(args as MouseEventArgs);
    }
    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        super.mouseMove(args);
        if (this.inAction) {
            if (this.drawingObject) {
                this.commandHandler.addObjectToDiagram(this.drawingObject);
            }
        }
        this.endAction();
    }
    /**   @private  */
    public endAction(): void {
        this.drawingObject = null;
        this.inAction = false;
    }
}

export class LabelDragTool extends ToolBase {
    private annotationId: string;
    constructor(commandHandler: CommandHandler) {
        super(commandHandler, true);
    }
    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        this.undoElement = cloneObject(args.source);
        this.annotationId = args.sourceWrapper.id;
        super.mouseDown(args);
    }
    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let difx: number = this.currentPosition.x - this.prevPosition.x;
        let dify: number = this.currentPosition.y - this.prevPosition.y;
        let node: NodeModel = args.source;
        if (node instanceof Node) {
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, -node.rotateAngle, 0, 0);
            let diff: PointModel = transformPointByMatrix(matrix, { x: difx, y: dify });
            difx = diff.x; dify = diff.y;
        }
        if (this.inAction) {
            this.commandHandler.labelDrag(args.source, args.sourceWrapper, difx, dify);
            this.commandHandler.updateSelector();
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }
    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        let redoValue: NodeModel | ConnectorModel = args.source;
        this.inAction = false;
        let entryValue: HistoryEntry = {
            type: 'AnnotationPropertyChanged',
            changeObjectId: this.annotationId, undoObject: cloneObject(this.undoElement),
            category: 'Internal', redoObject: cloneObject(redoValue)
        };
        this.commandHandler.addHistoryEntry(entryValue);
        super.mouseUp(args);
    }
    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }
}
export class LabelResizeTool extends ToolBase {
    private corner: Actions;
    private annotationId: string;
    private initialBounds: Rect;
    constructor(commandHandler: CommandHandler, corner: Actions) {
        super(commandHandler, true);
        this.corner = corner;
    }
    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        let object: NodeModel | ConnectorModel = ((args.source as Selector).nodes.length) ?
            (args.source as Selector).nodes[0] : (args.source as Selector).connectors[0];
        this.annotationId = args.source.wrapper.children[0].id;
        this.undoElement = cloneObject(object);
        let annotation: DiagramElement = args.source.wrapper.children[0];
        this.initialBounds = {
            x: annotation.offsetX,
            y: annotation.offsetY,
            width: annotation.actualSize.width,
            height: annotation.actualSize.height
        } as Rect;
        super.mouseDown(args);
    }
    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            this.resizeObject(args);
        }
        return !this.blocked;
    }
    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        let redoObject: NodeModel | ConnectorModel = ((args.source as Selector).nodes.length) ?
            (args.source as Selector).nodes[0] : (args.source as Selector).connectors[0];
        this.inAction = false;
        let entry: HistoryEntry = {
            type: 'AnnotationPropertyChanged', changeObjectId: this.annotationId,
            redoObject: cloneObject(redoObject), undoObject: cloneObject(this.undoElement), category: 'Internal'
        };
        this.commandHandler.addHistoryEntry(entry);
        super.mouseUp(args);
    }
    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }
    /**   @private  */
    public resizeObject(args: MouseEventArgs): void {
        let object: NodeModel | ConnectorModel;
        object = ((args.source as Selector).nodes.length) ? (args.source as Selector).nodes[0] : (args.source as Selector).connectors[0];
        let textElement: DiagramElement = args.source.wrapper.children[0];
        let deltaWidth: number; let deltaHeight: number;
        let center: PointModel = { x: textElement.offsetX, y: textElement.offsetY };
        let rotateAngle: number = textElement.rotateAngle;
        rotateAngle += (object instanceof Node) ? object.rotateAngle : 0; rotateAngle = (rotateAngle + 360) % 360;
        let trans: Matrix = identityMatrix();
        rotateMatrix(trans, rotateAngle, center.x, center.y);
        let corner: string = (this.corner as string).slice(5);
        let pivot: Rect = this.updateSize(textElement, this.startPosition, this.currentPosition, corner, this.initialBounds, rotateAngle);
        let x: number = textElement.offsetX - textElement.actualSize.width * textElement.pivot.x;
        let y: number = textElement.offsetY - textElement.actualSize.height * textElement.pivot.y;
        let pivotPoint: PointModel = this.getPivot(corner);
        pivotPoint = { x: x + textElement.actualSize.width * pivotPoint.x, y: y + textElement.actualSize.height * pivotPoint.y };
        let point: PointModel = transformPointByMatrix(trans, pivotPoint);
        pivot.x = point.x; pivot.y = point.y;
        deltaWidth = pivot.width; deltaHeight = pivot.height;
        deltaWidth = (deltaWidth < 0) ? 1 : deltaWidth;
        deltaHeight = (deltaHeight < 0) ? 1 : deltaHeight;
        this.commandHandler.labelResize(
            object, (args.source as Selector).annotation as ShapeAnnotation, deltaWidth, deltaHeight, pivot, args.source as Selector);
        this.commandHandler.updateSelector();
    }
}
export class LabelRotateTool extends ToolBase {
    private annotationId: string;
    constructor(commandHandler: CommandHandler) {
        super(commandHandler, true);
    }
    /**   @private  */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        this.annotationId = args.source.wrapper.children[0].id;
        let object: NodeModel | ConnectorModel = ((args.source as Selector).nodes.length) ?
            (args.source as Selector).nodes[0] : (args.source as Selector).connectors[0];
        this.undoElement = cloneObject(object);
        super.mouseDown(args);
    }
    /**   @private  */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (args.source) {
            if (this.inAction) {
                let object: NodeModel | ConnectorModel = (args.source as Selector).nodes[0] ? (args.source as Selector).nodes[0] :
                    (args.source as Selector).connectors[0];
                let annotation: ShapeAnnotation | PathAnnotation;
                annotation = ((args.source as Selector).annotation) as ShapeAnnotation | PathAnnotation;
                this.commandHandler.labelRotate(
                    object, annotation, this.currentPosition, args.source as Selector);
                this.commandHandler.updateSelector();
            }
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }

    /**   @private  */
    public mouseUp(args: MouseEventArgs): void {
        this.inAction = false;
        let redoEntry: NodeModel | ConnectorModel = ((args.source as Selector).nodes.length) ?
            (args.source as Selector).nodes[0] : (args.source as Selector).connectors[0];
        let entryObject: HistoryEntry = {
            type: 'AnnotationPropertyChanged', changeObjectId: this.annotationId,
            redoObject: cloneObject(redoEntry),
            undoObject: cloneObject(this.undoElement), category: 'Internal'
        };
        this.commandHandler.addHistoryEntry(entryObject);
        super.mouseUp(args);
    }
    /**   @private  */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }
}