/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
/* eslint-disable valid-jsdoc */
/* eslint-disable max-len */
import { PointModel } from '../primitives/point-model';
import { Node, DiagramShape } from '../objects/node';
import { Connector, BezierSegment, StraightSegment } from '../objects/connector';
import { NodeModel, BasicShapeModel, SwimLaneModel } from '../objects/node-model';
import { ConnectorModel, StraightSegmentModel } from '../objects/connector-model';
import { Point } from '../primitives/point';
import { BpmnSubEvent } from '../objects/node';
import { PointPort } from '../objects/port';
import { IElement, ISizeChangeEventArgs, IDraggingEventArgs, DiagramFixedUserHandle } from '../objects/interface/IElement';
import { BlazorFixedUserHandleClickEventArgs, DiagramEventObject } from '../objects/interface/IElement';
import { IEndChangeEventArgs, FixedUserHandleClickEventArgs } from '../objects/interface/IElement';
import { IBlazorConnectionChangeEventArgs, IConnectionChangeEventArgs } from '../objects/interface/IElement';
import { IBlazorDropEventArgs } from '../objects/interface/IElement';
import { IRotationEventArgs, IDoubleClickEventArgs, IClickEventArgs, IDropEventArgs } from '../objects/interface/IElement';
import { CommandHandler } from './command-manager';
import { IBlazorDraggingEventArgs } from '../objects/interface/IElement';
import { rotatePoint, cloneObject } from '../utility/base-util';
import { Rect } from '../primitives/rect';
import { getPolygonPath } from '../utility/path-util';
import { canOutConnect, canInConnect, canAllowDrop, canPortInConnect, canPortOutConnect, canMove } from '../utility/constraints-util';
import { HistoryEntry } from '../diagram/history';
import { Matrix, transformPointByMatrix, rotateMatrix, identityMatrix } from '../primitives/matrix';
import { Snap } from './../objects/snapping';
import { NodeConstraints, DiagramEvent, ObjectTypes, PortConstraints } from './../enum/enum';
import { PointPortModel, PortModel } from './../objects/port-model';
import { ITouches } from '../objects/interface/interfaces';
import { SelectorModel } from '../objects/node-model';
import { MouseEventArgs } from './event-handlers';
import { TextElement } from '../core/elements/text-element';
import { PathElement } from '../core/elements/path-element';
import { Container } from '../core/containers/container';
import { contains, Actions } from './actions';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';
import { Selector } from '../objects/node';
import { DiagramElement } from '../core/elements/diagram-element';
import { getInOutConnectPorts, cloneBlazorObject, getDropEventArguements, getObjectType, checkPort } from '../utility/diagram-util';
import { isBlazor } from '@syncfusion/ej2-base';
import { DeepDiffMapper } from '../utility/diff-map';
import { NodeFixedUserHandleModel, ConnectorFixedUserHandleModel } from '../objects/fixed-user-handle-model';

/**
 * Defines the interactive tools
 */
export class ToolBase {
    /**
     * Initializes the tool
     *
     * @param {CommandHandler} command Command that is corresponding to the current action
     * @param protectChange
     */
    constructor(command: CommandHandler, protectChange: boolean = false) {
        this.commandHandler = command;
        this.isProtectChange = protectChange;
    }

    /**
     * Command that is corresponding to the current action
     */
    protected commandHandler: CommandHandler = null;


    protected deepDiffer: DeepDiffMapper = new DeepDiffMapper();

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

    private checkProperty: boolean = true;

    protected undoParentElement: SelectorModel = { nodes: [], connectors: [] };

    protected mouseDownElement: (NodeModel | ConnectorModel);

    protected startAction(currentElement: IElement): void {
        this.currentElement = currentElement;
        this.inAction = true;
    }

    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        if (isBlazor()) {
            this.commandHandler.enableCloneObject(true);
            this.commandHandler.ismouseEvents(true);
        }
        this.currentElement = args.source;
        this.startPosition = this.currentPosition = this.prevPosition = args.position;
        this.isTooltipVisible = true;
        this.startAction(args.source);
        this.checkProperty = true;
        // Bug fix - EJ2-44495 -Node does not gets selected on slight movement of mouse when drag constraints disabled for node
        this.mouseDownElement = args.source;
    }

    public checkPropertyValue(): void {
        if (this.checkProperty) {
            this.commandHandler.startTransaction(this.isProtectChange);
        }
    }

    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        this.currentPosition = args.position;
        if (this.inAction) {
            this.commandHandler.startTransaction(this.isProtectChange);
            this.checkProperty = false;
        }
        //this.currentElement = currentElement;
        return !this.blocked;

    }



    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        this.checkPropertyValue();
        this.currentPosition = args.position;
        // this.currentElement = currentElement;
        this.isTooltipVisible = false;
        this.commandHandler.endTransaction(this.isProtectChange);
        if (isBlazor()) {
            this.commandHandler.enableCloneObject(false);
            this.commandHandler.ismouseEvents(false);
            this.commandHandler.getBlazorOldValues(args, this instanceof LabelDragTool);
        }
        this.endAction();
        // Bug fix - EJ2-44495 -Node does not gets selected on slight movement of mouse when drag constraints disabled for node
        this.mouseDownElement = null;
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

    /**
     * @param args
     * @private
     */
    public mouseWheel(args: MouseEventArgs): void {
        this.currentPosition = args.position;
    }

    /**
     * @param args
     * @private
     */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }
    protected updateSize(
        shape: SelectorModel | NodeModel, startPoint: PointModel,
        endPoint: PointModel, corner: string, initialBounds: Rect, angle?: number): Rect {
        shape = this.commandHandler.renderContainerHelper(shape) as NodeModel || shape;
        const horizontalsnap: Snap = { snapped: false, offset: 0, left: false, right: false };
        const verticalsnap: Snap = { snapped: false, offset: 0, top: false, bottom: false };
        let difx: number = this.currentPosition.x - this.startPosition.x;
        let dify: number = this.currentPosition.y - this.startPosition.y;
        const snapEnabled: boolean = (!(shape instanceof TextElement)) && this.commandHandler.snappingModule
            && this.commandHandler.snappingModule.canSnap();
        const snapLine: SVGElement = snapEnabled ? this.commandHandler.snappingModule.getLayer() : null;
        const rotateAngle: number = (shape instanceof TextElement) ? angle : shape.rotateAngle;
        let matrix: Matrix;
        matrix = identityMatrix();
        rotateMatrix(matrix, -rotateAngle, 0, 0);
        let x: number = shape.offsetX; let y: number = shape.offsetY;
        const w: number = shape.width; const h: number = shape.height;
        x = x - w * shape.pivot.x; y = y - h * shape.pivot.y;
        let deltaWidth: number = 0; let deltaHeight: number = 0;
        let diff: PointModel;
        const width: number = (shape instanceof TextElement) ? shape.actualSize.width : shape.width;
        const height: number = (shape instanceof TextElement) ? shape.actualSize.height : shape.height;
        switch (corner) {
        case 'ResizeWest':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            deltaHeight = 1;
            difx = snapEnabled ? this.commandHandler.snappingModule.snapLeft(
                horizontalsnap, verticalsnap, snapLine, difx, dify, shape as SelectorModel, endPoint === startPoint, initialBounds) :
                difx;
            dify = 0; deltaWidth = (initialBounds.width - difx) / width; break;
        case 'ResizeEast':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify }));
            difx = diff.x;
            dify = diff.y;
            difx = snapEnabled ? this.commandHandler.snappingModule.snapRight(
                horizontalsnap, verticalsnap, snapLine, difx, dify, shape as SelectorModel, endPoint === startPoint, initialBounds) :
                difx;
            dify = 0;
            deltaWidth = (initialBounds.width + difx) / width;
            deltaHeight = 1;
            break;
        case 'ResizeNorth':
            deltaWidth = 1;
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            dify = snapEnabled ? this.commandHandler.snappingModule.snapTop(
                horizontalsnap, verticalsnap, snapLine, difx, dify, shape as SelectorModel, endPoint === startPoint, initialBounds) :
                dify;
            deltaHeight = (initialBounds.height - dify) / height; break;
        case 'ResizeSouth':
            deltaWidth = 1;
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            dify = snapEnabled ? this.commandHandler.snappingModule.snapBottom(
                horizontalsnap, verticalsnap, snapLine, difx, dify, shape as SelectorModel, endPoint === startPoint, initialBounds) :
                dify;
            deltaHeight = (initialBounds.height + dify) / height; break;
        case 'ResizeNorthEast':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            difx = snapEnabled ? this.commandHandler.snappingModule.snapRight(
                horizontalsnap, verticalsnap, snapLine, difx, dify, shape as SelectorModel, endPoint === startPoint, initialBounds) :
                difx;
            dify = snapEnabled ? this.commandHandler.snappingModule.snapTop(
                horizontalsnap, verticalsnap, snapLine, difx, dify, shape as SelectorModel, endPoint === startPoint, initialBounds) :
                dify;
            deltaWidth = (initialBounds.width + difx) / width; deltaHeight = (initialBounds.height - dify) / height;
            break;
        case 'ResizeNorthWest':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            dify = !snapEnabled ? dify : this.commandHandler.snappingModule.snapTop(
                horizontalsnap, verticalsnap, snapLine, difx, dify, shape as SelectorModel, endPoint === startPoint, initialBounds);
            difx = !snapEnabled ? difx : this.commandHandler.snappingModule.snapLeft(
                horizontalsnap, verticalsnap, snapLine, difx, dify, shape as SelectorModel, endPoint === startPoint, initialBounds);
            deltaWidth = (initialBounds.width - difx) / width; deltaHeight = (initialBounds.height - dify) / height;
            break;
        case 'ResizeSouthEast':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            dify = !snapEnabled ? dify : this.commandHandler.snappingModule.snapBottom(
                horizontalsnap, verticalsnap, snapLine, difx, dify, shape as SelectorModel, endPoint === startPoint, initialBounds);
            difx = !snapEnabled ? difx : this.commandHandler.snappingModule.snapRight(
                horizontalsnap, verticalsnap, snapLine, difx, dify, shape as SelectorModel, endPoint === startPoint, initialBounds);
            deltaHeight = (initialBounds.height + dify) / height; deltaWidth = (initialBounds.width + difx) / width;
            break;
        case 'ResizeSouthWest':
            diff = transformPointByMatrix(matrix, ({ x: difx, y: dify })); difx = diff.x; dify = diff.y;
            dify = snapEnabled ? this.commandHandler.snappingModule.snapBottom(
                horizontalsnap, verticalsnap, snapLine, difx, dify, shape as SelectorModel,
                endPoint === startPoint, initialBounds) : dify;
            difx = snapEnabled ? this.commandHandler.snappingModule.snapLeft(
                horizontalsnap, verticalsnap, snapLine, difx, dify, shape as SelectorModel,
                endPoint === startPoint, initialBounds) : difx;
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
    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        super.mouseDown(args);
    }

    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        //draw selected region
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            const rect: Rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
            // Bug fix - EJ2-44495 -Node does not gets selected on slight movement of mouse when drag constraints disabled for node
            if (this.mouseDownElement && !canMove(this.mouseDownElement)) {
                this.commandHandler.clearObjectSelection(this.mouseDownElement);
            } else {
                this.commandHandler.clearSelectedItems();
                this.commandHandler.drawSelectionRectangle(rect.x, rect.y, rect.width, rect.height);
            }
        }
        return !this.blocked;
    }


    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        this.checkPropertyValue();
        //rubber band selection
        if (!this.commandHandler.isUserHandle(this.currentPosition)) {
            if (Point.equals(this.currentPosition, this.prevPosition) === false && this.inAction) {
                const region: Rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
                this.commandHandler.doRubberBandSelection(region);
            } else {
                //single selection
                const arrayNodes: (NodeModel | ConnectorModel)[] = this.commandHandler.getSelectedObject();
                if (!this.commandHandler.hasSelection() || !args.info || !args.info.ctrlKey) {
                    this.commandHandler.clearSelection(args.source === null ? true : false);
                    if (this.action === 'LabelSelect') {
                        this.commandHandler.labelSelect(args.source, args.sourceWrapper);
                    } 
                    else if (args.source) {
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
                                this.commandHandler.updateBlazorSelector();
                            }
                        }
                    }
                }
            }
        }
        this.inAction = false;
        super.mouseUp(args);
    }

    /**
     * @param args
     * @private
     */
    public mouseLeave(args: MouseEventArgs): void {
        if (this.inAction) {
            this.mouseUp(args);
        }
    }
}

export class FixedUserHandleTool extends ToolBase {
    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        this.checkPropertyValue();
        this.inAction = false;
        const val: NodeModel | ConnectorModel = args.source;
        let fixedUserHandle: NodeFixedUserHandleModel | ConnectorFixedUserHandleModel;
        const iconId: string = args.sourceWrapper.id;
        for (let i: number = 0; i < val.fixedUserHandles.length; i++) {
            if (iconId.indexOf(val.fixedUserHandles[i].id) > -1) {
                fixedUserHandle = val.fixedUserHandles[i];
            }
        }

        if (isBlazor()) {
            const element: DiagramEventObject = getObjectType(args.source) === Connector ? { connector: args.source }
                : { node: args.source };
            const fixedUserHandles: DiagramFixedUserHandle = getObjectType(args.source) === Connector ?
                { connectorFixedUserHandle: fixedUserHandle } as DiagramFixedUserHandle
                : { nodeFixedUserHandle: fixedUserHandle } as DiagramFixedUserHandle;
            const arg: BlazorFixedUserHandleClickEventArgs = {
                fixedUserHandle: fixedUserHandles,
                element: element
            };
            const trigger: DiagramEvent = DiagramEvent.fixedUserHandleClick;
            this.commandHandler.triggerEvent(trigger, arg);
            super.mouseUp(args);

        } else {
            const arg: FixedUserHandleClickEventArgs = {
                fixedUserHandle: fixedUserHandle,
                element: args.source
            };
            const trigger: DiagramEvent = DiagramEvent.fixedUserHandleClick;
            this.commandHandler.triggerEvent(trigger, arg);
            super.mouseUp(args);
        }
    }
}


/**
 * Helps to edit the selected connectors
 */
export class ConnectTool extends ToolBase {

    protected endPoint: string;

    protected oldConnector: ConnectorModel;

    protected isConnected: boolean = false;

    /** @private */
    public tempArgs: IBlazorConnectionChangeEventArgs;

    /** @private */
    public canCancel: boolean;

    /**   @private  */
    public selectedSegment: BezierSegment;

    constructor(commandHandler: CommandHandler, endPoint: string) {
        super(commandHandler, true);
        this.endPoint = endPoint;
    }

    /**
     * @param args
     * @private
     */
    public async mouseDown(args: MouseEventArgs): Promise<void> {
        if (isBlazor() && args && args.source) {
            this.commandHandler.insertSelectedObjects();
            this.commandHandler.insertBlazorConnector(args.source as Selector);
            const selectorModel: SelectorModel = args.source as SelectorModel;
            if (selectorModel.connectors) {
                const connector: Connector = selectorModel.connectors[0] as Connector;
                this.oldConnector = cloneObject(connector);
                const arg: IBlazorConnectionChangeEventArgs = {
                    connector: cloneBlazorObject(connector),
                    oldValue: { connectorTargetValue: { portId: undefined, nodeId: undefined } },
                    newValue: { connectorTargetValue: { portId: undefined, nodeId: undefined } },
                    cancel: false, state: 'Changing', connectorEnd: this.endPoint
                };
                this.tempArgs = arg;
            }
        }
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
            this.oldConnector = cloneObject(connectors);
        }
        // Sets the selected segment
        if (this.endPoint === 'BezierSourceThumb' || this.endPoint === 'BezierTargetThumb') {
            for (let i: number = 0; i < connectors.segments.length; i++) {
                const segment: BezierSegment = connectors.segments[i] as BezierSegment;
                const segmentpoint1: PointModel = !Point.isEmptyPoint(segment.point1) ? segment.point1 : segment.bezierPoint1;
                const segmentpoint2: PointModel = !Point.isEmptyPoint(segment.point2) ? segment.point2 : segment.bezierPoint2;
                if (contains(this.currentPosition, segmentpoint1, connectors.hitPadding) ||
                    contains(this.currentPosition, segmentpoint2, connectors.hitPadding)) {
                    this.selectedSegment = segment;
                }
            }
        }
        this.currentPosition = args.position;
    }

    /**
     * @param args
     * @private
     */
    public async mouseUp(args: MouseEventArgs): Promise<void> {
        if (isBlazor()) {
            const trigger: DiagramEvent = DiagramEvent.connectionChange;
            let temparg: IBlazorConnectionChangeEventArgs;
            if (this.tempArgs && this.oldConnector) {
                this.commandHandler.updatePropertiesToBlazor(args, false);
                this.tempArgs.state = 'Changed';
                const nodeEndId: string = this.endPoint === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
                const portEndId: string = this.endPoint === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
                this.tempArgs.oldValue = this.endPoint === 'ConnectorSourceEnd' ?
                    { connectorSourceValue: { nodeId: this.oldConnector[nodeEndId], portId: this.oldConnector[portEndId] } } :
                    { connectorTargetValue: { nodeId: this.oldConnector[nodeEndId], portId: this.oldConnector[portEndId] } };
                temparg = {
                    state: this.tempArgs.state, oldValue: this.tempArgs.oldValue,
                    newValue: this.tempArgs.newValue, cancel: this.tempArgs.cancel, connectorEnd: this.tempArgs.connectorEnd
                };
                const diagram: string = 'diagram'; const blazorInterop: string = 'sfBlazor'; const blazor: string = 'Blazor';
                if (window && window[blazor] && this.commandHandler[diagram].connectionChange) {
                    const eventObj: object = { 'EventName': 'connectionChange', args: JSON.stringify(this.tempArgs) };
                    temparg = await window[blazorInterop].updateBlazorDiagramEvents(eventObj, this.commandHandler[diagram]);
                }
                if (temparg) {
                    this.commandHandler.updateConnectorValue(temparg);
                }
            }
        }
        if (!isBlazor() && this.isConnected && (args.source as SelectorModel).connectors) {
            const connector: ConnectorModel = (args.source as SelectorModel).connectors[0];
            const nodeEndId: string = this.endPoint === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
            const portEndId: string = this.endPoint === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
            const arg: IConnectionChangeEventArgs | IBlazorConnectionChangeEventArgs = {
                connector: cloneBlazorObject(connector),
                oldValue: { nodeId: this.oldConnector[nodeEndId], portId: this.oldConnector[portEndId] },
                newValue: { nodeId: connector[nodeEndId], portId: connector[portEndId] }, cancel: false,
                state: 'Changed', connectorEnd: this.endPoint
            };
            if (connector[nodeEndId] !== this.oldConnector[nodeEndId]) {
                this.commandHandler.triggerEvent(DiagramEvent.connectionChange, arg);
                this.isConnected = false;
            }
        }
        this.checkPropertyValue();
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

            let oldValues: PointModel; let connector: ConnectorModel;
            if (args.source && (args.source as SelectorModel).connectors) {
                oldValues = { x: this.prevPosition.x, y: this.prevPosition.y };
                connector = (args.source as SelectorModel).connectors[0];
            }
            let targetPortName: string; let targetNodeNode: string;
            if (args.target) {
                const target: NodeModel | PointPortModel = this.commandHandler.findTarget(
                    args.targetWrapper, args.target, this.endPoint === 'ConnectorSourceEnd', true) as NodeModel | PointPortModel;
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                (target instanceof PointPort) ? targetPortName = target.id : targetNodeNode = target.id;
            }
            let arg: IEndChangeEventArgs = {
                connector: connector, state: 'Completed', targetNode: targetNodeNode,
                oldValue: oldValues, newValue: oldValues, cancel: false, targetPort: targetPortName
            };
            if (isBlazor()) {
                arg = {
                    connector: cloneBlazorObject(connector), state: 'Completed', targetNode: targetNodeNode,
                    oldValue: cloneBlazorObject(oldValues), newValue: oldValues, cancel: arg.cancel, targetPort: targetPortName
                };
            }
            const trigger: number = this.endPoint === 'ConnectorSourceEnd' ? DiagramEvent.sourcePointChange : DiagramEvent.targetPointChange;
            this.commandHandler.triggerEvent(trigger, arg);
            this.commandHandler.removeTerminalSegment(connector as Connector, true);
            if (this.undoElement && args.source) {
                // eslint-disable-next-line prefer-const
                let obj: SelectorModel; obj = cloneObject(args.source);
                const entry: HistoryEntry = {
                    type: 'ConnectionChanged', redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement),
                    category: 'Internal'
                };
                this.commandHandler.addHistoryEntry(entry);
            }
        } else if (!(this instanceof ConnectorDrawingTool) &&
            (this.endPoint === 'BezierTargetThumb' || this.endPoint === 'BezierSourceThumb')) {
            if (this.undoElement && args.source) {
                const obj: SelectorModel = cloneObject(args.source);
                const entry: HistoryEntry = {
                    type: 'SegmentChanged', redoObject: obj, undoObject: this.undoElement, category: 'Internal'
                };
                this.commandHandler.addHistoryEntry(entry);
            }
        }
        this.commandHandler.updateBlazorSelector();
        this.canCancel = undefined; this.tempArgs = undefined;
        super.mouseUp(args);
    }

    /* tslint:disable */
    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let tempArgs: IBlazorConnectionChangeEventArgs;
        if ((!(this instanceof ConnectorDrawingTool)) && ((this.endPoint === 'ConnectorSourceEnd' &&
            Point.equals((args.source as SelectorModel).connectors[0].sourcePoint, this.undoElement.connectors[0].sourcePoint)) ||
            (this.endPoint === 'ConnectorTargetEnd' &&
                Point.equals((args.source as SelectorModel).connectors[0].targetPoint, this.undoElement.connectors[0].targetPoint)))) {
            let oldValue: PointModel; let connectors: ConnectorModel;
            if (args.source && (args.source as SelectorModel).connectors) {
                oldValue = { x: this.prevPosition.x, y: this.prevPosition.y };
                connectors = (args.source as SelectorModel).connectors[0];
            }
            let targetPort: string; let targetNode: string;
            if (args.target) {
                targetNode = (args.target as NodeModel).id;
                const target: NodeModel | PointPortModel = this.commandHandler.findTarget(
                    args.targetWrapper, args.target, this.endPoint === 'ConnectorSourceEnd', true) as NodeModel | PointPortModel;
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                (target instanceof PointPort || target instanceof BpmnSubEvent) ? targetPort = target.id : targetNode = target.id;
            }
            let arg: IEndChangeEventArgs = {
                connector: connectors, state: 'Start', targetNode: targetNode,
                oldValue: oldValue, newValue: oldValue, cancel: false, targetPort: targetPort
            };
            if (isBlazor()) {
                arg = {
                    connector: cloneBlazorObject(connectors), state: 'Start', targetNode: targetNode,
                    oldValue: oldValue, newValue: oldValue, cancel: arg.cancel, targetPort: targetPort
                };
            }
            const trigger: number = this.endPoint === 'ConnectorSourceEnd' ?
                DiagramEvent.sourcePointChange : DiagramEvent.targetPointChange;
            this.commandHandler.triggerEvent(trigger, arg);
        }
        this.currentPosition = args.position;
        if (this.currentPosition && this.prevPosition) {
            const diffX: number = this.currentPosition.x - this.prevPosition.x;
            const diffY: number = this.currentPosition.y - this.prevPosition.y;
            let newValue: PointModel; let oldValue: PointModel; let inPort: PointPortModel; let outPort: PointPortModel;
            this.currentPosition = this.commandHandler.snapConnectorEnd(this.currentPosition); let connector: ConnectorModel;
            if (args.source && (args.source as SelectorModel).connectors) {
                newValue = { x: this.currentPosition.x, y: this.currentPosition.y };
                oldValue = { x: this.prevPosition.x, y: this.prevPosition.y };
                connector = (args.source as SelectorModel).connectors[0];
            }
            let targetPortId: string; let targetNodeId: string;
            if (args.target) {
                const target: NodeModel | PointPortModel = this.commandHandler.findTarget(
                    args.targetWrapper, args.target, this.endPoint === 'ConnectorSourceEnd', true) as NodeModel | PointPortModel;
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                (target instanceof PointPort) ? targetPortId = target.id : targetNodeId = target.id;
            }
            let arg: IEndChangeEventArgs = {
                connector: connector, state: 'Progress', targetNode: targetNodeId,
                oldValue: oldValue, newValue: newValue, cancel: false, targetPort: targetPortId
            };
            if (isBlazor()) {
                arg = {
                    connector: cloneBlazorObject(connector), state: 'Progress', targetNode: targetNodeId,
                    oldValue: oldValue, newValue: newValue, cancel: arg.cancel, targetPort: targetPortId
                };
            }
            if (!(this instanceof ConnectorDrawingTool)) {
                const trigger: number = this.endPoint === 'ConnectorSourceEnd' ?
                    DiagramEvent.sourcePointChange : DiagramEvent.targetPointChange;
                this.commandHandler.triggerEvent(trigger, arg);
            }
            if (args.target) {
                inPort = getInOutConnectPorts((args.target as Node), true); outPort = getInOutConnectPorts((args.target as Node), false);
            }
            if (!arg.cancel && this.inAction && this.endPoint !== undefined && diffX !== 0 || diffY !== 0) {
                this.blocked = !this.commandHandler.dragConnectorEnds(
                    this.endPoint, args.source, this.currentPosition, this.selectedSegment, args.target, targetPortId);
                this.commandHandler.updateSelector();
                if (args.target && ((this.endPoint === 'ConnectorSourceEnd' && (canOutConnect(args.target) || canPortOutConnect(outPort)))
                    || (this.endPoint === 'ConnectorTargetEnd' && (canInConnect(args.target) || canPortInConnect(inPort))))) {
                    if (this.commandHandler.canDisconnect(this.endPoint, args, targetPortId, targetNodeId)) {
                        tempArgs = this.commandHandler.disConnect(
                            args.source, this.endPoint, this.canCancel) as IBlazorConnectionChangeEventArgs;
                        this.isConnected = true;
                    }
                    const target: NodeModel | PointPortModel = this.commandHandler.findTarget(
                        args.targetWrapper, args.target, this.endPoint === 'ConnectorSourceEnd', true) as (NodeModel | PointPortModel);
                    if (target instanceof Node) {
                        if ((canInConnect(target) && this.endPoint === 'ConnectorTargetEnd')
                            || (canOutConnect(target) && this.endPoint === 'ConnectorSourceEnd')) {

                            tempArgs = this.commandHandler.connect(
                                this.endPoint, args, this.canCancel) as IBlazorConnectionChangeEventArgs;
                            this.isConnected = true;
                        }
                    } else {
                        const isConnect: boolean = this.checkConnect(target as PointPortModel);
                        if (isConnect) {
                            this.isConnected = true;
                            tempArgs = this.commandHandler.connect(this.endPoint, args, this.canCancel) as IBlazorConnectionChangeEventArgs;
                        }
                    }
                } else if (this.endPoint.indexOf('Bezier') === -1) {
                    this.isConnected = true;
                    tempArgs = this.commandHandler.disConnect(
                        args.source, this.endPoint, this.canCancel) as IBlazorConnectionChangeEventArgs;
                    this.commandHandler.updateSelector();
                }
            }
            if (this.commandHandler.canEnableDefaultTooltip()) {
                const content: string = this.getTooltipContent(args.position);
                this.commandHandler.showTooltip(args.source, args.position, content, 'ConnectTool', this.isTooltipVisible);
                this.isTooltipVisible = false;
            }
            if (tempArgs) {
                this.tempArgs = tempArgs as IBlazorConnectionChangeEventArgs;
            }
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }
    /**
     * @param args
     * @private
     */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }

    private getTooltipContent(position: PointModel): string {
        return 'X:' + Math.round(position.x) + ' ' + 'Y:' + Math.round(position.y);
    }

    private checkConnect(target: PointPortModel): boolean {
        if (canPortInConnect(target) && this.endPoint === 'ConnectorTargetEnd') {
            return true;
        } else if (canPortOutConnect(target) && this.endPoint === 'ConnectorSourceEnd') {
            return true;
        } else if (!(target.constraints & PortConstraints.None) && !canPortInConnect(target) && !canPortOutConnect(target) 
        && (target.constraints == undefined || (target.constraints & (PortConstraints.Default & ~(PortConstraints.InConnect | PortConstraints.OutConnect))) > 0)) {
            return true;
        }
        return false;
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
    public currentTarget:IElement = null;

    private objectType: ObjectTypes;

    private portId: string;

    private source: NodeModel | PortModel;

    private canCancel: boolean = false;
    private tempArgs: IDraggingEventArgs | IBlazorDraggingEventArgs;
    constructor(commandHandler: CommandHandler, objType?: ObjectTypes) {
        super(commandHandler, true);
        this.objectType = objType;
    }

    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        if (args.source instanceof Node || args.source instanceof Connector) {
            const arrayNodes: (NodeModel | ConnectorModel)[] = this.commandHandler.getSelectedObject();
            this.commandHandler.selectObjects([args.source], args.info && args.info.ctrlKey, arrayNodes);
            const selectedObject: SelectorModel = { nodes: [], connectors: [] };
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
        this.commandHandler.insertBlazorConnector(args.source as Selector);
        let oldValues: SelectorModel;
        if (isBlazor()) {
            this.commandHandler.insertSelectedObjects();
            this.startPosition = this.currentPosition = this.prevPosition = args.position;
            this.initialOffset = { x: 0, y: 0 };

            if (args.source) {
                oldValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
            }
            const arg: IDraggingEventArgs | IBlazorDraggingEventArgs = {
                source: cloneObject(args.source), state: 'Start', oldValue: oldValues, newValue: {},
                target: cloneObject(args.target), targetPosition: args.position, allowDrop: true, cancel: false
            };
            this.tempArgs = arg;

        }
        super.mouseDown(args);
        this.initialOffset = { x: 0, y: 0 };
       }

    /* tslint:disable */
    /**
     * @param args
     * @param isPreventHistory
     * @param args
     * @param isPreventHistory
     * @private
     */
    public async mouseUp(args: MouseEventArgs, isPreventHistory?: boolean): Promise<void> {
        let oldValues: SelectorModel; let newValues: SelectorModel;

        if (isBlazor() && this.objectType !== 'Port') {
            this.commandHandler.updatePropertiesToBlazor(args, false);
            if (args.source) {
                newValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
                oldValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
            }
            const arg: IBlazorDraggingEventArgs = {
                state: 'Completed',
                oldValue: cloneBlazorObject(this.tempArgs.oldValue), newValue: cloneBlazorObject(newValues),
                target: cloneBlazorObject(this.currentTarget), targetPosition: cloneBlazorObject(this.currentPosition),
                allowDrop: true, cancel: false
            };
            let blazorArgs: void | object;
            const diagram: string = 'diagram'; const blazorInterop: string = 'sfBlazor'; const blazor: string = 'Blazor';
            if (window && window[blazor] && this.commandHandler[diagram].positionChange) {
                const eventObj: object = { 'EventName': 'positionChange', args: JSON.stringify(arg) };
                blazorArgs = await window[blazorInterop].updateBlazorDiagramEvents(eventObj, this.commandHandler[diagram]);
            }
            if (blazorArgs && (blazorArgs as IDraggingEventArgs).cancel) { this.commandHandler.enableCloneObject(true); this.commandHandler.ismouseEvents(true); this.canCancel = true; }
            if (this.canCancel) {
                this.commandHandler.insertBlazorObject(args.source);
                const tx: number = this.tempArgs.oldValue.offsetX - (args.source as NodeModel).wrapper.offsetX;
                const ty: number = this.tempArgs.oldValue.offsetY - (args.source as NodeModel).wrapper.offsetY;
                this.commandHandler.dragSelectedObjects(tx, ty);
            }
        }
        this.checkPropertyValue();
        let obj: SelectorModel; let historyAdded: boolean = false; let object: NodeModel | ConnectorModel | SelectorModel;
        const redoObject: SelectorModel = { nodes: [], connectors: [] };
        if (this.objectType !== 'Port') {
            if (args.source instanceof Node || args.source instanceof Connector) {
                if (args.source instanceof Node) {
                    redoObject.nodes.push(cloneObject(args.source) as Node);
                } else {
                    redoObject.connectors.push(cloneObject(args.source) as Connector);
                }
                obj = cloneObject(redoObject); const wrapper: Container = args.source.wrapper;
                obj.offsetX = wrapper.offsetX; obj.offsetY = wrapper.offsetY;
            } else {
                obj = cloneObject(args.source);
            }
            object = (this.commandHandler.renderContainerHelper(args.source as NodeModel) as Node) || args.source as Selector || (this.commandHandler.renderContainerHelper(args.source as ConnectorModel) as Connector);
            if (((object as Node).id === 'helper' && !(obj.nodes[0] as Node).isLane && !(obj.nodes[0] as Node).isPhase)
                || ((object as Node).id !== 'helper')) {
                if ((((object instanceof Selector && Math.round(object.width) === Math.round(this.undoElement.width) && Math.round(object.height) === Math.round(this.undoElement.height)) || !(object instanceof Selector)) && ((object as NodeModel).offsetX !== this.undoElement.offsetX || (object as NodeModel).offsetY !== this.undoElement.offsetY ||
                    (object as ConnectorModel).sourcePoint !== (this.undoElement as any).sourcePoint
                    // eslint-disable-next-line max-len
                    || (object as ConnectorModel).targetPoint !== (this.undoElement as any).targetPoint)) || this.isSelectionHasConnector(object)) {
                    if (args.source) {
                        newValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
                        oldValues = { offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY };
                    }
                    let arg: IDraggingEventArgs | IBlazorDraggingEventArgs = {
                        source: args.source, state: 'Completed', oldValue: oldValues, newValue: newValues,
                        target: this.currentTarget, targetPosition: this.currentPosition, allowDrop: true, cancel: false
                    };
                    arg = {
                        source: cloneBlazorObject(args.source), state: 'Completed',
                        oldValue: cloneBlazorObject(oldValues), newValue: cloneBlazorObject(newValues),
                        target: cloneBlazorObject(this.currentTarget), targetPosition: cloneBlazorObject(this.currentPosition),
                        allowDrop: arg.allowDrop, cancel: arg.cancel
                    };
                    if (isBlazor()) {
                        arg = this.getBlazorPositionChangeEventArgs(arg, this.currentTarget);
                    }
                    if (!isBlazor()) {
                        this.commandHandler.triggerEvent(DiagramEvent.positionChange, arg);
                        this.connectorEndPointChangeEvent(arg);
                    }
                    if (!isPreventHistory) {
                        this.commandHandler.startGroupAction(); historyAdded = true;
                        const entry: HistoryEntry = {
                            type: 'PositionChanged',
                            redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement), category: 'Internal'
                        };
                        if ((obj.nodes[0] as Node) && (obj.nodes[0] as Node).processId) {
                            const entry: HistoryEntry = {
                                type: 'SizeChanged', category: 'Internal',
                                undoObject: this.undoParentElement, redoObject: this.commandHandler.getSubProcess(args.source)
                            };
                            this.commandHandler.addHistoryEntry(entry);
                        }
                        this.commandHandler.addHistoryEntry(entry);
                    }
                }
            }
            const snappedPoint: PointModel = this.commandHandler.snapPoint(this.prevPosition, this.currentPosition, 0, 0);
            this.commandHandler.removeSnap(); this.commandHandler.removeHighlighter();
            if (args.source && this.currentTarget && canAllowDrop(this.currentTarget) &&
                this.commandHandler.isDroppable(args.source, this.currentTarget)) {
                this.commandHandler.drop(this.currentElement, this.currentTarget, this.currentPosition);
                if(this.currentTarget && this.currentTarget instanceof Connector){               
                    if(this.commandHandler.diagram.enableConnectorSplit == true){
                        if(this.currentElement){
                            if (this.currentElement && this.currentElement instanceof Node) {
                                this.commandHandler.connectorSplit(this.currentElement,this.currentTarget)
                            }
                            else if (this.currentElement instanceof Selector && !(this.commandHandler.PreventConnectorSplit)) {
                                if (this.currentElement.nodes.length > 0) {
                                    this.commandHandler.connectorSplit(this.currentElement.nodes[0],this.currentTarget);
                                    this.commandHandler.PreventConnectorSplit = false;
                                }
                            } 
                        }
                    }
                }
                let arg: IDropEventArgs | IBlazorDropEventArgs = {
                    element: args.source, target: this.currentTarget, position: this.currentPosition, cancel: false
                };
                if (isBlazor()) {
                    arg = getDropEventArguements(args, arg as IBlazorDropEventArgs);
                    arg = await this.commandHandler.triggerEvent(DiagramEvent.drop, arg) as IDropEventArgs | IBlazorDropEventArgs || arg;
                } else {
                    this.commandHandler.triggerEvent(DiagramEvent.drop, arg);
                }
                if (!arg.cancel && args.source && this.commandHandler.isParentAsContainer(this.currentTarget)) {
                    const nodes: NodeModel[] = (args.source instanceof Selector) ? args.source.nodes : [args.source as NodeModel];
                    let isEndGroup: boolean = false;
                    let temp: boolean;
                    for (let i = 0; i < nodes.length; i++) {
                        if ((nodes[0] as Node).parentId === (nodes[i] as Node).parentId) {
                            temp = true;
                        } else {
                            temp = false;
                            break;
                        }
                    }
                    for (let i: number = 0; i < nodes.length; i++) {
                        if (!nodes[i].container && temp) {
                            isEndGroup = true;
                            this.commandHandler.updateLaneChildrenZindex(nodes[i] as Node,this.currentTarget);
                            this.commandHandler.dropChildToContainer(this.currentTarget, nodes[i]);
                            this.commandHandler.renderContainerHelper(nodes[i]);
                        }
                    }
                    if (historyAdded && this.commandHandler.isContainer && isEndGroup) {
                        this.commandHandler.endGroupAction();
                    }
                }
            }
            if (args.source && this.currentTarget) {
                this.commandHandler.dropAnnotation(args.source, this.currentTarget);
            }
            this.commandHandler.updateSelector();
            if (historyAdded && !this.commandHandler.isContainer) {
                this.commandHandler.endGroupAction();
            }
        } else {
            redoObject.nodes.push(cloneObject(args.source) as Node);
            args.portId = this.portId;
            obj = cloneObject(redoObject);
            const entry: HistoryEntry = {
                type: 'PortPositionChanged', objectId: this.portId,
                redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement), category: 'Internal'
            };
            this.commandHandler.addHistoryEntry(entry);
        }
        this.commandHandler.updateBlazorSelector();
        super.mouseUp(args);
    }

    //EJ2-59309-While drag the connected node the connector endPointChange event does not get trigger
    private connectorEndPointChangeEvent(arg: any, snappedPoint?: PointModel): void { 
        let selectedElement: any = arg.source;
        if (selectedElement instanceof Selector && selectedElement.nodes.length > 0) {
            for (let i: number = 0; i < selectedElement.nodes.length; i++) {
                let node: NodeModel = selectedElement.nodes[i];
                if(node && (node as any).inEdges.length > 0) {
                    for (let j: number =0; j < (node as any).inEdges.length; j++) {
                        let connector: ConnectorModel = this.commandHandler.diagram.getObject((node as any).inEdges[j]);
                        this.triggerEndPointEvent(connector, arg, snappedPoint, 'targetPointChange');
                    }
                }
                if(node && (node as any).outEdges.length > 0) {
                    for (let j: number =0; j < (node as any).outEdges.length; j++) {
                        let connector: ConnectorModel = this.commandHandler.diagram.getObject((node as any).outEdges[j]);
                        this.triggerEndPointEvent(connector, arg, snappedPoint, 'sourcePointChange');
                    }
                }
            }
        }
    }

    private triggerEndPointEvent(connector: ConnectorModel, arg: any, snappedPoint: PointModel, eventName: string): void {
        let args: IEndChangeEventArgs = {
            connector: connector, state: arg.state, targetNode: connector.targetID, targetPort: connector.targetPortID,
            sourceNode: connector.sourceID, sourcePort: connector.sourcePortID, oldValue: {x: connector.targetPoint.x, y: connector.targetPoint.y}, 
            newValue: {x: connector.targetPoint.x + (snappedPoint?snappedPoint.x:0), y: connector.targetPoint.y + (snappedPoint?snappedPoint.y:0)}, cancel: arg.cancel, 
        };
        this.commandHandler.triggerEvent((eventName === 'targetPointChange')? DiagramEvent.targetPointChange: DiagramEvent.sourcePointChange, args);
    }

    private isSelectionHasConnector(args: any): boolean {
        if (args.nodes && args.connectors && args.nodes.length > 0 && args.connectors.length > 0 &&
            (args.width !== this.undoElement.width || args.height !== this.undoElement.height)) {
            return true;
        }
        return false;
    }

    private getBlazorPositionChangeEventArgs(args: IDraggingEventArgs | IBlazorDraggingEventArgs, target: IElement): IBlazorDraggingEventArgs {
        args = {
            source: cloneBlazorObject(args.source), state: args.state, oldValue: args.oldValue, newValue: args.newValue,
            target: getObjectType(target) === Connector ? { connector: cloneBlazorObject(target) }
                : { node: cloneBlazorObject(target) },
            targetPosition: this.currentPosition, allowDrop: true, cancel: false
        };
        return args as IBlazorDraggingEventArgs;
    }

    /* tslint:disable */
    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args); let isSame: boolean = false; let object: NodeModel | ConnectorModel | SelectorModel;
        object = (this.commandHandler.renderContainerHelper(args.source as NodeModel) as Node) ||
            args.source as Node | Connector | Selector;
        if (object instanceof Node || object instanceof Connector) {
            if (object instanceof Node) {
                if (object.offsetX === this.undoElement.nodes[0].offsetX &&
                    object.offsetY === this.undoElement.nodes[0].offsetY) {
                    isSame = true;
                }
            } else {
                if (Point.equals(object.sourcePoint, this.undoElement.connectors[0].sourcePoint) &&
                    Point.equals(object.targetPoint, this.undoElement.connectors[0].targetPoint)) { isSame = true; }
            }
        } else {
            if (object.wrapper.offsetX === this.undoElement.wrapper.offsetX &&
                object.wrapper.offsetY === this.undoElement.wrapper.offsetY) { isSame = true; }
        }
        let oldValues: SelectorModel;
        if (object) { oldValues = { offsetX: object.wrapper.offsetX, offsetY: object.wrapper.offsetY }; }
        let arg: IDraggingEventArgs | IBlazorDraggingEventArgs = {
            source: object as SelectorModel, state: 'Start', oldValue: oldValues, newValue: oldValues,
            target: args.target, targetPosition: args.position, allowDrop: true, cancel: false
        };
        arg = {
            source: cloneBlazorObject(object) as SelectorModel, state: 'Start', oldValue: cloneBlazorObject(oldValues),
            newValue: cloneBlazorObject(oldValues),
            target: args.target, targetPosition: args.position, allowDrop: arg.allowDrop, cancel: arg.cancel
        };
        if (isSame && !isBlazor()) { 
            this.commandHandler.triggerEvent(DiagramEvent.positionChange, arg); 
            this.connectorEndPointChangeEvent(arg);
        }
        this.currentPosition = args.position; 
        if (this.objectType !== 'Port') {
            const x: number = this.currentPosition.x - this.prevPosition.x; const y: number = this.currentPosition.y - this.prevPosition.y;
            const diffX: number = this.initialOffset.x + (this.currentPosition.x - this.prevPosition.x);
            const diffY: number = this.initialOffset.y + (this.currentPosition.y - this.prevPosition.y);
            this.commandHandler.dragOverElement(args, this.currentPosition);
            this.commandHandler.disConnect(args.source);
            this.commandHandler.removeSnap();
            let oldValues: SelectorModel; let newValues: SelectorModel;
            const snappedPoint: PointModel = this.commandHandler.snapPoint(
                this.prevPosition, this.currentPosition, diffX, diffY);
            this.initialOffset.x = diffX - snappedPoint.x;
            this.initialOffset.y = diffY - snappedPoint.y;
            if (object) {
                oldValues = { offsetX: object.wrapper.offsetX, offsetY: object.wrapper.offsetY };
                newValues = {
                    offsetX: object.wrapper.offsetX + snappedPoint.x,
                    offsetY: object.wrapper.offsetY + snappedPoint.y
                };
            }
            if (this.currentTarget && args.target !== this.currentTarget) {
                this.commandHandler.removeChildFromBPmn(args.source, args.target, this.currentTarget);
            }
            this.currentTarget = args.target;
            let arg: IDraggingEventArgs | IBlazorDraggingEventArgs = {
                source: object as SelectorModel, state: 'Progress', oldValue: oldValues, newValue: newValues,
                target: args.target, targetPosition: args.position, allowDrop: true, cancel: false
            };
            if (isBlazor()) {
                arg = this.getBlazorPositionChangeEventArgs(arg, args.target);
            }
            if (!isBlazor()) {
                this.commandHandler.triggerEvent(DiagramEvent.positionChange, arg);
                this.connectorEndPointChangeEvent(arg, snappedPoint);
            }
            if (!arg.cancel && !this.canCancel) {
                this.blocked = !this.commandHandler.dragSelectedObjects(snappedPoint.x, snappedPoint.y);
                const blocked: boolean = !(this.commandHandler.mouseOver(this.currentElement, this.currentTarget, this.currentPosition));
                this.blocked = this.blocked || blocked;
            }
            this.commandHandler.removeStackHighlighter();
            this.commandHandler.renderStackHighlighter(args);
            if (this.currentTarget && (args.source !== this.currentTarget) &&
                this.commandHandler.isDroppable(args.source, this.currentTarget) && (args.source as Node).id !== 'helper') {
                const object: NodeModel = (args.source instanceof Selector) ? args.source.nodes[0] : args.source;
                if ((!this.commandHandler.isParentAsContainer(object, true))
                    && (object.shape.type !== 'SwimLane' && !(object.shape as SwimLaneModel).isPhase)) {
                    if ((this.currentTarget as Node).isLane) {
                        this.commandHandler.renderStackHighlighter(args, this.currentTarget);
                    } else {
                        this.commandHandler.drawHighlighter(this.currentTarget as IElement);
                    }
                }
            } else {
                this.commandHandler.removeHighlighter();
            }
            if (this.commandHandler.canEnableDefaultTooltip()) {
                const content: string = this.getTooltipContent(args.source as SelectorModel);
                this.commandHandler.showTooltip(args.source, args.position, content, 'MoveTool', this.isTooltipVisible);
                this.isTooltipVisible = false;
            }
        } else {
            const matrix: Matrix = identityMatrix(); const node: NodeModel = args.source as Node;
            rotateMatrix(matrix, -node.rotateAngle, node.offsetX, node.offsetY);
            const prevPosition: PointModel = transformPointByMatrix(matrix, { x: this.prevPosition.x, y: this.prevPosition.y });
            const position: PointModel = transformPointByMatrix(matrix, { x: args.position.x, y: args.position.y });
            this.commandHandler.portDrag(args.source, args.sourceWrapper, position.x - prevPosition.x, position.y - prevPosition.y);
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }


    private getTooltipContent(node: SelectorModel): string {
        return 'X:' + Math.round(node.wrapper.bounds.x) + ' ' + 'Y:' + Math.round(node.wrapper.bounds.y);
    }

    /**
     * @param args
     * @private
     */
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

    /** @private */
    public tempArgs: IRotationEventArgs;

    /** @private */
    public canCancel: boolean;

    constructor(commandHandler: CommandHandler) {
        super(commandHandler, true);
    }

    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        if (isBlazor()) {
            let object: NodeModel | ConnectorModel | SelectorModel;
            object = (this.commandHandler.renderContainerHelper(args.source) as Node) || args.source as Node | Selector;
            const oldValue: SelectorModel = { rotateAngle: object.wrapper.rotateAngle };
            const arg: IRotationEventArgs = {
                source: cloneBlazorObject(args.source), state: 'Start', oldValue: oldValue, newValue: undefined, cancel: false
            };
            const temparg: IRotationEventArgs = arg;
            this.tempArgs = temparg;
            if (this.tempArgs && this.tempArgs.cancel) {
                this.canCancel = true;
            }
        }
        this.undoElement = cloneObject(args.source);

        if (this.undoElement.nodes[0] && this.undoElement.nodes[0].children) {
            const objects: (NodeModel | ConnectorModel)[] = [];
            const nodes: (NodeModel | ConnectorModel)[] = this.commandHandler.getAllDescendants(this.undoElement.nodes[0], objects);
            for (let i: number = 0; i < nodes.length; i++) {
                const node: NodeModel = this.commandHandler.cloneChild(nodes[i].id);
                this.childTable[nodes[i].id] = cloneObject(node);
            }
        }


        super.mouseDown(args);
    }

    /**
     * @param args
     * @private
     */
    public async mouseUp(args: MouseEventArgs): Promise<void> {
        this.checkPropertyValue();
        if (isBlazor()) {
            const diagram: string = 'diagram'; const blazorInterop: string = 'sfBlazor'; const blazor: string = 'Blazor';
            this.commandHandler.updatePropertiesToBlazor(args, false);
            let object: NodeModel | ConnectorModel | SelectorModel;
            object = (this.commandHandler.renderContainerHelper(args.source) as Node) || args.source as Node | Selector;
            const oldValue: SelectorModel = { rotateAngle: this.tempArgs.oldValue.rotateAngle };
            const newValue: SelectorModel = { rotateAngle: object.wrapper.rotateAngle };
            const arg: IRotationEventArgs = {
                state: 'Completed', oldValue: oldValue, newValue: newValue, cancel: false
            };
            let blazorArgs: void | object;
            if (window && window[blazor] && this.commandHandler[diagram].rotateChange) {
                const eventObj: object = { 'EventName': 'rotateChange', args: JSON.stringify(arg) };
                blazorArgs = await window[blazorInterop].updateBlazorDiagramEvents(eventObj, this.commandHandler[diagram]);
            }
            if (blazorArgs && (blazorArgs as IRotationEventArgs).cancel) {
                this.commandHandler.enableCloneObject(true); this.commandHandler.ismouseEvents(true);
                this.canCancel = true;
            }
            if (this.canCancel) {
                this.commandHandler.insertBlazorObject(args.source);
                this.commandHandler.rotatePropertyChnage(this.tempArgs.oldValue.rotateAngle);
            }
        }
        let object: NodeModel | ConnectorModel | SelectorModel;
        object = (this.commandHandler.renderContainerHelper(args.source) as Node) || args.source as Node | Selector;
        if (this.undoElement.rotateAngle !== object.wrapper.rotateAngle) {
            const oldValue: SelectorModel = { rotateAngle: object.wrapper.rotateAngle };
            const arg: IRotationEventArgs = {
                source: args.source, state: 'Completed', oldValue: oldValue,
                newValue: oldValue, cancel: false
            };
            if (!isBlazor())
            {this.commandHandler.triggerEvent(DiagramEvent.rotateChange, arg);}
            let obj: SelectorModel;
            obj = cloneObject(args.source);
            const entry: HistoryEntry = {
                type: 'RotationChanged', redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement), category: 'Internal',
                childTable: this.childTable
            };
            this.commandHandler.addHistoryEntry(entry);
            this.commandHandler.updateSelector();
        }
        this.commandHandler.updateBlazorSelector();
        this.canCancel = undefined;
        this.tempArgs = undefined;
        super.mouseUp(args);
    }

    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let object: NodeModel | ConnectorModel | SelectorModel;
        object = (this.commandHandler.renderContainerHelper(args.source as NodeModel) as Node) || args.source as Node | Selector;
        if (this.undoElement.rotateAngle === object.wrapper.rotateAngle) {
            const oldValue: SelectorModel = { rotateAngle: object.wrapper.rotateAngle };

            const arg: IRotationEventArgs = {
                source: args.source, state: 'Start', oldValue: oldValue, newValue: oldValue, cancel: false
            };
            if (!isBlazor()) {
                this.commandHandler.triggerEvent(DiagramEvent.rotateChange, arg);
            }
        }

        this.currentPosition = args.position;
        const refPoint: PointModel = { x: object.wrapper.offsetX, y: object.wrapper.offsetY };
        let angle: number = Point.findAngle(refPoint, this.currentPosition) + 90;
        const snapAngle: number = this.commandHandler.snapAngle(angle);
        angle = snapAngle !== 0 ? snapAngle : angle;
        angle = (angle + 360) % 360;
        const oldValue: SelectorModel = { rotateAngle: object.wrapper.rotateAngle };
        const newValue: SelectorModel = { rotateAngle: angle };
        const arg: IRotationEventArgs = {
            source: args.source, state: 'Progress', oldValue: oldValue,
            newValue: newValue, cancel: false
        };
        const arg1: IRotationEventArgs = {
            source: cloneBlazorObject(args.source), state: 'Progress', oldValue: cloneBlazorObject(oldValue),
            newValue: cloneBlazorObject(newValue), cancel: arg.cancel
        };
        if (!isBlazor()) {
            this.commandHandler.triggerEvent(DiagramEvent.rotateChange, arg1);
        }
        if ((!isBlazor() && !arg1.cancel) || (isBlazor() && !this.canCancel)) {
            this.blocked = !(this.commandHandler.rotateSelectedItems(angle - object.wrapper.rotateAngle));
        }
        if (this.commandHandler.canEnableDefaultTooltip()) {
            const content: string = this.getTooltipContent(args.source as SelectorModel);
            this.commandHandler.showTooltip(args.source, args.position, content, 'RotateTool', this.isTooltipVisible);
            this.isTooltipVisible = false;
        }
        return !this.blocked;
    }


    private getTooltipContent(node: SelectorModel): string {
        return Math.round((node.rotateAngle % 360)).toString() + '\xB0';
    }

    /**
     * @param args
     * @private
     */
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

    private canCancel: boolean = false;
    private tempArgs: ISizeChangeEventArgs;

    constructor(commandHandler: CommandHandler, corner: string) {
        super(commandHandler, true);
        this.corner = corner;
    }

    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        let oldValues: SelectorModel;
        if (isBlazor()) {
            this.commandHandler.insertSelectedObjects();
            this.startPosition = this.currentPosition = this.prevPosition = args.position;
            this.currentElement = args.source;
            this.initialBounds.x = args.source.wrapper.offsetX;
            this.initialBounds.y = args.source.wrapper.offsetY;
            this.initialBounds.height = args.source.wrapper.actualSize.height;
            this.initialBounds.width = args.source.wrapper.actualSize.width;
            if (args.source) {
                oldValues = {
                    offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY,
                    width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                };
            }
            const arg: ISizeChangeEventArgs = {
                source: cloneBlazorObject(args.source), state: 'Start', oldValue: oldValues, newValue: cloneBlazorObject(this.currentElement), cancel: false
            };
            this.tempArgs = arg;
        }
        this.undoElement = cloneObject(args.source);
        this.undoParentElement = this.commandHandler.getSubProcess(args.source);
        super.mouseDown(args);
        if (this.undoElement.nodes[0] && this.undoElement.nodes[0].children) {
            const elements: (NodeModel | ConnectorModel)[] = [];
            const nodes: (NodeModel | ConnectorModel)[] = this.commandHandler.getAllDescendants(this.undoElement.nodes[0], elements);
            for (let i: number = 0; i < nodes.length; i++) {
                const node: NodeModel = this.commandHandler.cloneChild(nodes[i].id);
                this.childTable[nodes[i].id] = cloneObject(node);
            }
        }
        this.commandHandler.checkSelection((args.source as Selector), this.corner);
        super.mouseDown(args);
        this.initialBounds.x = args.source.wrapper.offsetX;
        this.initialBounds.y = args.source.wrapper.offsetY;
        this.initialBounds.height = args.source.wrapper.actualSize.height;
        this.initialBounds.width = args.source.wrapper.actualSize.width;

    }

    /**
     * @param args
     * @param isPreventHistory
     * @param args
     * @param isPreventHistory
     * @private
     */
    public async mouseUp(args: MouseEventArgs, isPreventHistory?: boolean): Promise<boolean> {
        if (isBlazor()) {
            const diagram: string = 'diagram'; const blazorInterop: string = 'sfBlazor'; const blazor: string = 'Blazor';
            this.commandHandler.updatePropertiesToBlazor(args, false);
            const obj: SelectorModel = cloneObject(args.source);
            const oldValues: SelectorModel = {
                width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height,
                offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY
            };
            const arg: ISizeChangeEventArgs = {
                oldValue: this.tempArgs.oldValue, newValue: oldValues, cancel: false,
                state: 'Completed'
            };
            if (!this.canCancel) {
                let blazorArgs: void | object;
                if (window && window[blazor] && this.commandHandler[diagram].sizeChange) {
                    const eventObj: object = { 'EventName': 'sizeChange', args: JSON.stringify(arg) };
                    blazorArgs = await window[blazorInterop].updateBlazorDiagramEvents(eventObj, this.commandHandler[diagram]);
                }
                if (blazorArgs && (blazorArgs as ISizeChangeEventArgs).cancel) {
                    this.commandHandler.enableCloneObject(true); this.commandHandler.ismouseEvents(true);
                    this.commandHandler.insertBlazorObject(args.source);
                    const scaleWidth: number = this.tempArgs.oldValue.width / obj.wrapper.actualSize.width;
                    const scaleHeight: number = this.tempArgs.oldValue.height / obj.wrapper.actualSize.height;
                    this.commandHandler.scaleSelectedItems(scaleWidth, scaleHeight, this.getPivot(this.corner));
                }
            }
            this.tempArgs = undefined;
            this.canCancel = undefined;
        }
        this.checkPropertyValue();
        this.commandHandler.removeSnap();
        let object: NodeModel | ConnectorModel | SelectorModel;
        this.commandHandler.updateSelector();
        object = (this.commandHandler.renderContainerHelper(args.source as NodeModel) as Node) || args.source as Node | Selector;
        if ((this.undoElement.offsetX !== object.wrapper.offsetX || this.undoElement.offsetY !== object.wrapper.offsetY ||
            this.undoElement.width !== object.wrapper.bounds.width || this.undoElement.height !== object.wrapper.bounds.height)) {
            if (!isBlazor()) {
                const deltaValues: Rect = this.updateSize(args.source, this.currentPosition, this.prevPosition, this.corner, this.initialBounds);
                this.blocked = this.scaleObjects(
                    deltaValues.width, deltaValues.height, this.corner, this.currentPosition, this.prevPosition, object);
                const oldValue: SelectorModel = {
                    offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY,
                    width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
                };
                const arg: ISizeChangeEventArgs = {
                    source: cloneBlazorObject(args.source), state: 'Completed',
                    oldValue: oldValue, newValue: oldValue, cancel: false
                };
                this.commandHandler.triggerEvent(DiagramEvent.sizeChange, arg);
            }
            const obj: SelectorModel = cloneObject(args.source);
            const entry: HistoryEntry = {
                type: 'SizeChanged', redoObject: cloneObject(obj), undoObject: cloneObject(this.undoElement), category: 'Internal',
                childTable: this.childTable
            };
            if (!isPreventHistory) {
                this.commandHandler.startGroupAction();
                this.commandHandler.addHistoryEntry(entry);
                if ((obj.nodes[0] as Node) && (obj.nodes[0] as Node).processId) {
                    const entry: HistoryEntry = {
                        type: 'SizeChanged', redoObject: this.commandHandler.getSubProcess(args.source),
                        undoObject: this.undoParentElement, category: 'Internal'
                    };
                    this.commandHandler.addHistoryEntry(entry);
                }
                this.commandHandler.endGroupAction();
            }
        }
        this.commandHandler.updateBlazorSelector();
        super.mouseUp(args);
        return !this.blocked;
    }

    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let object: NodeModel | ConnectorModel | SelectorModel;
        object = (this.commandHandler.renderContainerHelper(args.source as NodeModel) as Node) || args.source as Node | Selector;
        if (this.undoElement.offsetX === object.wrapper.offsetX && this.undoElement.offsetY === object.wrapper.offsetY) {
            const oldValue: SelectorModel = {
                offsetX: args.source.wrapper.offsetX, offsetY: args.source.wrapper.offsetY,
                width: args.source.wrapper.actualSize.width, height: args.source.wrapper.actualSize.height
            };

            const arg: ISizeChangeEventArgs = {
                source: args.source, state: 'Start', oldValue: oldValue, newValue: this.currentElement, cancel: false
            };
            if (!isBlazor()) {
                this.commandHandler.triggerEvent(DiagramEvent.sizeChange, arg);
            }
        }
        this.currentPosition = args.position;
        const x: number = this.currentPosition.x - this.startPosition.x;
        const y: number = this.currentPosition.y - this.startPosition.y;
        let changes: PointModel = { x: x, y: y };
        changes = rotatePoint(-this.currentElement.wrapper.rotateAngle, undefined, undefined, changes);
        const sx: number = (this.currentElement.wrapper.actualSize.width + changes.x) / this.currentElement.wrapper.actualSize.width;
        const sy: number = (this.currentElement.wrapper.actualSize.height + changes.y) / this.currentElement.wrapper.actualSize.height;
        changes = this.getChanges(changes);
        this.commandHandler.removeSnap();
        const deltaValues: Rect = this.updateSize(args.source, this.startPosition, this.currentPosition, this.corner, this.initialBounds);
        this.blocked = !(this.scaleObjects(
            deltaValues.width, deltaValues.height, this.corner, this.startPosition, this.currentPosition, object));
        if (this.commandHandler.canEnableDefaultTooltip()) {
            const content: string = this.getTooltipContent(args.source as SelectorModel);
            this.commandHandler.showTooltip(args.source, args.position, content, 'ResizeTool', this.isTooltipVisible);
            this.isTooltipVisible = false;
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }
    /**
     * @param args
     * @private
     */
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
     *
     * @param deltaWidth
     * @param deltaHeight
     * @param corner
     * @param startPoint
     * @param endPoint
     * @param source
     * @param deltaWidth
     * @param deltaHeight
     * @param corner
     * @param startPoint
     * @param endPoint
     * @param source
     * @param deltaWidth
     * @param deltaHeight
     * @param corner
     * @param startPoint
     * @param endPoint
     * @param source
     * @param deltaWidth
     * @param deltaHeight
     * @param corner
     * @param startPoint
     * @param endPoint
     * @param source
     * @param deltaWidth
     * @param deltaHeight
     * @param corner
     * @param startPoint
     * @param endPoint
     * @param source
     * @param deltaWidth
     * @param deltaHeight
     * @param corner
     * @param startPoint
     * @param endPoint
     * @param source
     */
    private scaleObjects(
        deltaWidth: number, deltaHeight: number, corner: string, startPoint: PointModel, endPoint: PointModel,
        source?: SelectorModel | NodeModel)
        : boolean {
        if (source instanceof Selector && source.nodes.length === 1 && source.nodes[0].constraints & NodeConstraints.AspectRatio) {
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
        const oldValue: SelectorModel = {
            offsetX: source.offsetX, offsetY: source.offsetY,
            width: source.width, height: source.height
        };
        this.blocked = this.commandHandler.scaleSelectedItems(deltaWidth, deltaHeight, this.getPivot(this.corner));
        const newValue: SelectorModel = {
            offsetX: source.offsetX, offsetY: source.offsetY,
            width: source.width, height: source.height
        };
        let arg: ISizeChangeEventArgs;
        arg = { source: source as Selector, state: 'Progress', oldValue: oldValue, newValue: newValue, cancel: false };
        let arg1: ISizeChangeEventArgs;
        arg1 = {
            source: cloneBlazorObject(source) as Selector, state: 'Progress',
            oldValue: cloneBlazorObject(oldValue), newValue: cloneBlazorObject(newValue), cancel: arg.cancel
        };
        if (!isBlazor()) {
            this.commandHandler.triggerEvent(DiagramEvent.sizeChange, arg1);
        }
        if (arg1.cancel || this.canCancel) {
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

    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
        this.commandHandler.setFocus();
    }

    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let checkBoundaryConstraints: boolean;
        const node: NodeModel = {
            offsetX: this.currentPosition.x, width: 3, height: 3,
            offsetY: this.currentPosition.y
        };
        if (!this.drawingObject) {
            this.drawingObject = this.commandHandler.drawObject(node as Node);
        }
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            const rect: Rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
            checkBoundaryConstraints = this.commandHandler.checkBoundaryConstraints(undefined, undefined, rect);
            if (checkBoundaryConstraints) {
                this.commandHandler.updateNodeDimension(this.drawingObject, rect);
            }
        }
        return checkBoundaryConstraints;
    }

    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        this.checkPropertyValue();
        let checkBoundaryConstraints: boolean;
        const rect: Rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
        checkBoundaryConstraints = this.commandHandler.checkBoundaryConstraints(undefined, undefined, rect);
        if (this.drawingObject && this.drawingObject instanceof Node) {
            this.commandHandler.addObjectToDiagram(this.drawingObject);
            this.drawingObject = null;
        }
        this.commandHandler.updateBlazorSelector();
        super.mouseUp(args);
        this.inAction = false;
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
    }

    /**
     * @param args
     * @private
     */
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

    /**
     * @param args
     * @private
     */
    public async mouseDown(args: MouseEventArgs): Promise<void> {
        super.mouseDown(args);
        this.inAction = true;
        this.commandHandler.setFocus();
    }

    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        this.commandHandler.enableServerDataBinding(false);
        if (this.inAction) {
            const connector: ConnectorModel = {
                sourcePoint: this.currentPosition, targetPoint: this.currentPosition
            };
            if (!this.drawingObject) {
                this.drawingObject = this.commandHandler.drawObject(connector as Connector);
            }
            args.source = this.drawingObject;
            if (((args.target && args.target instanceof Node) || (args.actualObject && args.sourceWrapper && checkPort(args.actualObject, args.sourceWrapper)))
                && (this.endPoint !== 'ConnectorTargetEnd' || (canInConnect(args.target as NodeModel)))) {
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
        this.commandHandler.enableServerDataBinding(true);
        return !this.blocked;

    }

    /**
     * @param args
     * @private
     */
    public async mouseUp(args: MouseEventArgs): Promise<void> {
        this.commandHandler.enableServerDataBinding(false);
        this.checkPropertyValue();
        if (this.drawingObject && this.drawingObject instanceof Connector) {
            this.commandHandler.addObjectToDiagram(this.drawingObject);
            this.drawingObject = null;
        }
        this.commandHandler.updateBlazorSelector();
        this.inAction = false;
        this.commandHandler.enableServerDataBinding(true);
        super.mouseUp(args);
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
    }

    /**
     * @param args
     * @private
     */
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
    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.commandHandler.clearSelection();
        const node: NodeModel = {
            shape: { type: 'Text' },
            offsetX: this.currentPosition.x,
            offsetY: this.currentPosition.y
        };
        if (!args.source) {
            this.drawingNode = this.commandHandler.drawObject(node as Node);
        }
    }

    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (!this.drawingNode) {
            const node: NodeModel = {
                shape: { type: 'Text' }, offsetX: this.currentPosition.x, width: 30, height: 30,
                // EJ2-42640-Text size is different if Text Node is created over another diagram commited by sivakumar sekar
                // commanded style property and added it after the object is drawn
                // style: { strokeDashArray: '2 2', fill: 'transparent' },
                offsetY: this.currentPosition.y
            };
            this.drawingNode = this.commandHandler.drawObject(node as Node);
            this.drawingNode.style.strokeDashArray = '2 2';
            this.drawingNode.style.fill = 'transparent';
        } else {
            this.drawingNode.style.strokeColor = 'black';
            this.drawingNode.style.strokeDashArray = '2 2';
            this.drawingNode.style.fill = 'transparent';
        }
        if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
            const rect: Rect = Rect.toBounds([this.prevPosition, this.currentPosition]);
            this.commandHandler.updateNodeDimension(this.drawingNode, rect);
        }
        return !this.blocked;
    }

    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        this.checkPropertyValue();
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

    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
        this.commandHandler.setBlazorDiagramProps(true);
    }

    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            if (!this.zooming && Point.equals(this.currentPosition, this.prevPosition) === false) {
                const difX: number = this.currentPosition.x - this.prevPosition.x;
                const difY: number = this.currentPosition.y - this.prevPosition.y;
                this.commandHandler.scroll(difX, difY, this.currentPosition);
            } else if (args.moveTouches && args.moveTouches.length && args.moveTouches.length >= 2) {
                const startTouch0: ITouches = args.startTouches[0];
                const startTouch1: ITouches = args.startTouches[1];
                const moveTouch0: ITouches = args.moveTouches[0];
                const moveTouch1: ITouches = args.moveTouches[1];
                const scale: number = this.getDistance(moveTouch0, moveTouch1) / this.getDistance(startTouch0, startTouch1);
                const focusPoint: PointModel = args.position;
                this.commandHandler.zoom(scale, 0, 0, focusPoint);
                this.updateTouch(startTouch0, moveTouch0);
                this.updateTouch(startTouch1, moveTouch1);
            }
        }
        this.commandHandler.dataBinding();
        return !this.blocked;
    }

    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        this.commandHandler.setBlazorDiagramProps(false);
        this.checkPropertyValue();
        this.commandHandler.updatePanState(false);
        super.mouseUp(args);
        this.inAction = false;
    }

    /**   @private  */
    public endAction(): void {
        super.endAction();
    }

    private getDistance(touch1: ITouches, touch2: ITouches): number {
        const x: number = touch2.pageX - touch1.pageX;
        const y: number = touch2.pageY - touch1.pageY;
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

    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        this.checkPropertyValue();
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

    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        this.checkPropertyValue();
        let tab : string='_blank';
        let windowOption:string = '';
        let windowHeight = window.innerHeight
        let windowWidth = window.innerWidth
        let screenTop = window.screenTop
        let screenLeft = window.screenLeft
        if((args.sourceWrapper as TextElement).hyperlink.hyperlinkOpenState=='CurrentTab')
        {
            tab='_self';
        }
        else if((args.sourceWrapper as TextElement).hyperlink.hyperlinkOpenState=='NewWindow')
        { 
            windowOption = 'height='+windowHeight+',width='+windowWidth+',top='+screenTop+',left='+screenLeft;  
        }
        const win: Window = window.open((args.sourceWrapper as TextElement).hyperlink.link,tab,windowOption);
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
    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
        if (!this.drawingObject) {
            this.startPoint = { x: this.startPosition.x, y: this.startPosition.y };
            const node: NodeModel = {
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
            if (isBlazor() && node.shape.type === 'Basic') { (node.shape as DiagramShape).basicShape = 'Polygon'; }
            this.drawingObject = this.commandHandler.drawObject(node as Node);
        } else {
            let pt: PointModel;
            const obj: BasicShapeModel = (this.drawingObject.shape as BasicShapeModel);
            pt = obj.points[obj.points.length - 1];
            pt = { x: pt.x, y: pt.y };
            (this.drawingObject.shape as BasicShapeModel).points.push(pt);
        }
    }

    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            const obj: BasicShapeModel = (this.drawingObject.shape as BasicShapeModel);
            if (this.drawingObject && this.currentPosition) {
                obj.points[obj.points.length - 1].x = this.currentPosition.x;
                obj.points[obj.points.length - 1].y = this.currentPosition.y;
                (this.drawingObject.wrapper.children[0] as PathElement).data = getPolygonPath(
                    (this.drawingObject.shape as BasicShapeModel).points);
                if (this.inAction && Point.equals(this.currentPosition, this.prevPosition) === false) {
                    const region: Rect = Rect.toBounds((this.drawingObject.shape as BasicShapeModel).points);
                    this.commandHandler.updateNodeDimension(this.drawingObject, region);
                }
            }
        }
        return true;
    }

    /**
     * @param args
     * @param dblClickArgs
     * @param args
     * @param dblClickArgs
     * @private
     */
    public mouseUp(args: MouseEventArgs, dblClickArgs?: IDoubleClickEventArgs | IClickEventArgs): void {
        this.checkPropertyValue();
        super.mouseMove(args);
        if (this.inAction) {
            this.inAction = false;
            if (this.drawingObject) {
                this.commandHandler.addObjectToDiagram(this.drawingObject);
            }
        }
        this.endAction();
    }

    /**
     * @param args
     * @private
     */
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
    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            const obj: Connector = (this.drawingObject as Connector);
            obj.targetPoint = this.currentPosition;
            this.commandHandler.updateConnectorPoints(obj);
        }
        return true;
    }
    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        super.mouseDown(args);
        this.inAction = true;
        if (!this.drawingObject) {
            const connector: ConnectorModel = {
                id: 'Connector',
                type: 'Straight',
                sourcePoint: this.currentPosition,
                targetPoint: this.currentPosition
            };
            this.drawingObject = this.commandHandler.drawObject(connector as Connector);
        } else {
            const drawObject: Connector = this.drawingObject as Connector;
            let segment: StraightSegmentModel;
            segment = new StraightSegment(drawObject, 'segments', { type: 'Straight' }, true);
            segment.point = this.currentPosition;
            drawObject.segments[drawObject.segments.length - 1] = segment;
        }
    }
    /**
     * @param args
     * @private
     */
    public mouseWheel(args: MouseEventArgs): void {
        super.mouseWheel(args); this.mouseMove(args as MouseEventArgs);
    }
    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        this.checkPropertyValue();
        super.mouseMove(args);
        if (this.inAction) {
            if (this.drawingObject) {
                const drawObject: ConnectorModel = this.drawingObject as ConnectorModel;
                (drawObject.segments[drawObject.segments.length - 1] as StraightSegment).point = { x: 0, y: 0 };
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
    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        this.undoElement = cloneObject(args.source);
        this.annotationId = args.sourceWrapper.id;
        super.mouseDown(args);
    }
    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        let difx: number = this.currentPosition.x - this.prevPosition.x;
        let dify: number = this.currentPosition.y - this.prevPosition.y;
        const node: NodeModel = args.source;
        if (node instanceof Node) {
            const matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, -node.rotateAngle, 0, 0);
            const diff: PointModel = transformPointByMatrix(matrix, { x: difx, y: dify });
            difx = diff.x; dify = diff.y;
        }
        if (this.inAction) {
            this.commandHandler.labelDrag(args.source, args.sourceWrapper, difx, dify);
            this.commandHandler.updateSelector();
        }
        this.prevPosition = this.currentPosition;
        return !this.blocked;
    }
    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        this.checkPropertyValue();
        const redoValue: NodeModel | ConnectorModel = args.source;
        this.inAction = false;
        const entryValue: HistoryEntry = {
            type: 'AnnotationPropertyChanged',
            objectId: this.annotationId, undoObject: cloneObject(this.undoElement),
            category: 'Internal', redoObject: cloneObject(redoValue)
        };
        this.commandHandler.addHistoryEntry(entryValue);
        super.mouseUp(args);
    }
    /**
     * @param args
     * @private
     */
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
    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        const object: NodeModel | ConnectorModel = ((args.source as Selector).nodes.length) ?
            (args.source as Selector).nodes[0] : (args.source as Selector).connectors[0];
        this.annotationId = args.source.wrapper.children[0].id;
        this.undoElement = cloneObject(object);
        const annotation: DiagramElement = args.source.wrapper.children[0];
        this.initialBounds = {
            x: annotation.offsetX,
            y: annotation.offsetY,
            width: annotation.actualSize.width,
            height: annotation.actualSize.height
        } as Rect;
        super.mouseDown(args);
    }
    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (this.inAction) {
            this.resizeObject(args);
        }
        return !this.blocked;
    }
    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        this.checkPropertyValue();
        const redoObject: NodeModel | ConnectorModel = ((args.source as Selector).nodes.length) ?
            (args.source as Selector).nodes[0] : (args.source as Selector).connectors[0];
        this.inAction = false;
        const entry: HistoryEntry = {
            type: 'AnnotationPropertyChanged', objectId: this.annotationId,
            redoObject: cloneObject(redoObject), undoObject: cloneObject(this.undoElement), category: 'Internal'
        };
        this.commandHandler.addHistoryEntry(entry);
        super.mouseUp(args);
    }
    /**
     * @param args
     * @private
     */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }
    /**
     * @param args
     * @private
     */
    public resizeObject(args: MouseEventArgs): void {
        let object: NodeModel | ConnectorModel;
        object = ((args.source as Selector).nodes.length) ? (args.source as Selector).nodes[0] : (args.source as Selector).connectors[0];
        const textElement: DiagramElement = args.source.wrapper.children[0];
        let deltaWidth: number; let deltaHeight: number;
        const center: PointModel = { x: textElement.offsetX, y: textElement.offsetY };
        let rotateAngle: number = textElement.rotateAngle;
        rotateAngle += (object instanceof Node) ? object.rotateAngle : 0; rotateAngle = (rotateAngle + 360) % 360;
        const trans: Matrix = identityMatrix();
        rotateMatrix(trans, rotateAngle, center.x, center.y);
        const corner: string = (this.corner as string).slice(5);
        const pivot: Rect = this.updateSize(textElement, this.startPosition, this.currentPosition, corner, this.initialBounds, rotateAngle);
        const x: number = textElement.offsetX - textElement.actualSize.width * textElement.pivot.x;
        const y: number = textElement.offsetY - textElement.actualSize.height * textElement.pivot.y;
        let pivotPoint: PointModel = this.getPivot(corner);
        pivotPoint = { x: x + textElement.actualSize.width * pivotPoint.x, y: y + textElement.actualSize.height * pivotPoint.y };
        const point: PointModel = transformPointByMatrix(trans, pivotPoint);
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
    /**
     * @param args
     * @private
     */
    public mouseDown(args: MouseEventArgs): void {
        this.inAction = true;
        this.annotationId = args.source.wrapper.children[0].id;
        const object: NodeModel | ConnectorModel = ((args.source as Selector).nodes.length) ?
            (args.source as Selector).nodes[0] : (args.source as Selector).connectors[0];
        this.undoElement = cloneObject(object);
        super.mouseDown(args);
    }
    /**
     * @param args
     * @private
     */
    public mouseMove(args: MouseEventArgs): boolean {
        super.mouseMove(args);
        if (args.source) {
            if (this.inAction) {
                const object: NodeModel | ConnectorModel = (args.source as Selector).nodes[0] ? (args.source as Selector).nodes[0] :
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

    /**
     * @param args
     * @private
     */
    public mouseUp(args: MouseEventArgs): void {
        this.checkPropertyValue();
        this.inAction = false;
        const redoEntry: NodeModel | ConnectorModel = ((args.source as Selector).nodes.length) ?
            (args.source as Selector).nodes[0] : (args.source as Selector).connectors[0];
        const entryObject: HistoryEntry = {
            type: 'AnnotationPropertyChanged', objectId: this.annotationId,
            redoObject: cloneObject(redoEntry),
            undoObject: cloneObject(this.undoElement), category: 'Internal'
        };
        this.commandHandler.addHistoryEntry(entryObject);
        super.mouseUp(args);
    }
    /**
     * @param args
     * @private
     */
    public mouseLeave(args: MouseEventArgs): void {
        this.mouseUp(args);
    }
}
