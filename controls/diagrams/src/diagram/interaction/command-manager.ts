import { IElement, ISelectionChangeEventArgs, IConnectionChangeEventArgs, IDragOverEventArgs } from '../objects/interface/IElement';
import { IDropEventArgs } from '../objects/interface/IElement';
import { Connector, getBezierPoints, isEmptyVector, BezierSegment } from '../objects/connector';
import { Node, BpmnShape, BpmnSubEvent, BpmnAnnotation } from '../objects/node';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { PointModel } from '../primitives/point-model';
import { MouseEventArgs } from './event-handlers';
import { PointPortModel } from '../objects/port-model';
import { ConnectorModel, StraightSegmentModel, OrthogonalSegmentModel, BezierSegmentModel } from '../objects/connector-model';
import { NodeModel, BpmnTransactionSubProcessModel, BpmnAnnotationModel } from '../objects/node-model';
import { OrthogonalSegment } from '../objects/connector';
import { Rect } from '../primitives/rect';
import { Diagram } from '../../diagram/diagram';
import { DiagramElement, Corners } from './../core/elements/diagram-element';
import { identityMatrix, rotateMatrix, transformPointByMatrix, scaleMatrix, Matrix } from './../primitives/matrix';
import { cloneObject as clone, cloneObject, getBounds } from './../utility/base-util';
import { completeRegion, getTooltipOffset, sort, findObjectIndex, intersect3, getAnnotationPosition } from './../utility/diagram-util';
import { randomId, cornersPointsBeforeRotation } from './../utility/base-util';
import { SelectorModel } from './selector-model';
import { Selector } from './selector';
import { hasSelection, isSelected, hasSingleConnection } from './actions';
import { AlignmentOptions, DistributeOptions, SizingOptions, DiagramEvent, BoundaryConstraints, AlignmentMode } from '../enum/enum';
import { HistoryEntry } from '../diagram/history';
import { canSelect, canMove, canRotate, canDragSourceEnd, canDragTargetEnd, canSingleSelect, canDrag } from './../utility/constraints-util';
import { canMultiSelect, canContinuousDraw } from './../utility/constraints-util';
import { canPanX, canPanY, canPageEditable } from './../utility/constraints-util';
import { SnapConstraints, DiagramTools, DiagramAction } from '../enum/enum';
import { Snapping } from '../objects/snapping';
import { LayoutAnimation } from '../objects/layout-animation';
import { Container } from '../core/containers/container';
import { Canvas } from '../core/containers/canvas';
import { getDiagramElement, getAdornerLayerSvg, getHTMLLayer, getAdornerLayer } from '../utility/dom-util';
import { Point } from '../primitives/point';
import { Size } from '../primitives/size';
import { getObjectType, getPoint } from './../utility/diagram-util';
import { LayerModel } from '../diagram/layer-model';
import { Layer } from '../diagram/layer';
import { SelectorConstraints, Direction } from '../enum/enum';
import { PageSettings } from '../diagram/page-settings';
import { DiagramScroller, Segment } from '../interaction/scroller';
import { remove } from '@syncfusion/ej2-base';
import { ConnectTool } from './tool';
import { getOppositeDirection, getPortDirection, findAngle, Intersection } from './../utility/connector';
import { ILayout } from '../layout/layout-base';
import { swapBounds, findPoint, orthoConnection2Segment, End, getIntersection } from './../utility/connector';
import { ShapeAnnotationModel, PathAnnotationModel } from '../objects/annotation-model';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';
import { SegmentInfo } from '../rendering/canvas-interface';
import { PointPort } from '../objects/port';

/**
 * Defines the behavior of commands
 */

export class CommandHandler {
    /**   @private  */
    public clipboardData: ClipBoardObject = {};
    /**   @private  */
    public connectorsTable: Object[] = [];
    /**   @private  */
    public processTable: {} = {};

    private state: TransactionState;

    private diagram: Diagram;

    private childTable: {} = {};

    private parentTable: {} = {};

    /**   @private  */
    public get snappingModule(): Snapping {
        return this.diagram.snappingModule;
    }

    /**   @private  */
    public get layoutAnimateModule(): LayoutAnimation {
        return this.diagram.layoutAnimateModule;
    }

    constructor(diagram: Diagram) {
        this.diagram = diagram;
    }
    /** @private */
    public startTransaction(protectChange: boolean): void {
        this.state = { element: this.diagram.selectedItems, backup: null };
        if (protectChange) {
            this.diagram.protectPropertyChange(true);
        }
        getAdornerLayer(this.diagram.element.id).style.pointerEvents = 'none';
    }
    /** @private */
    public endTransaction(protectChange: boolean): void {
        this.state = null;
        if (protectChange) {
            this.diagram.protectPropertyChange(false);
        }
        getAdornerLayer(this.diagram.element.id).style.pointerEvents = 'all';
    }

    /**
     * @private
     */
    public showTooltip(node: IElement, position: PointModel, content: string, toolName: string, isTooltipVisible: boolean): void {
        if (isTooltipVisible) {
            this.diagram.tooltipObject.position = 'BottomCenter';
            this.diagram.tooltipObject.animation = { open: { delay: 0, duration: 0 } };
            this.diagram.tooltip.relativeMode = toolName === 'ConnectTool' ? 'Mouse' : 'Object';
            this.diagram.tooltipObject.openDelay = 0;
            this.diagram.tooltipObject.closeDelay = 0;
        }
        this.diagram.tooltipObject.content = content;

        let tooltipOffset: PointModel = getTooltipOffset(this.diagram, { x: position.x, y: position.y }, node);
        this.diagram.tooltipObject.offsetX = tooltipOffset.x + (toolName === 'ConnectTool' ? 10 : 0);
        this.diagram.tooltipObject.offsetY = tooltipOffset.y + 10;

        this.diagram.tooltipObject.dataBind();

        if (isTooltipVisible) {
            setTimeout(
                () => {
                    this.diagram.tooltipObject.open(this.diagram.element);
                },
                1);
        }
    }

    /**
     * @private
     */
    public closeTooltip(): void {
        this.diagram.tooltipObject.close();
    }

    /**
     * @private
     */
    public canEnableDefaultTooltip(): boolean {
        if (this.diagram.selectedItems.constraints & SelectorConstraints.ToolTip) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * @private
     */
    public updateSelector(): void {
        this.diagram.updateSelector();
    }

    /**
     * @private
     */
    public triggerEvent(event: DiagramEvent, args: Object): void {
        if (event === DiagramEvent.drop || event === DiagramEvent.positionChange ||
            event === DiagramEvent.connectionChange) {
            if (this.diagram.currentSymbol) {
                return;
            }
            if (event === DiagramEvent.drop) {
                (args as IDropEventArgs).source = this.diagram;
            }
            if (this.diagram.currentDrawingObject) {
                return;

            }
        }

        this.diagram.triggerEvent(event, args);
    }

    /**
     * @private
     */
    public dragOverElement(args: MouseEventArgs, currentPosition: PointModel): void {
        if (this.diagram.currentSymbol) {
            let dragOverArg: IDragOverEventArgs = {
                element: args.source, target: args.target, mousePosition: currentPosition, diagram: this.diagram
            };
            this.triggerEvent(DiagramEvent.dragOver, dragOverArg);
        }
    }
    /**
     * @private
     */
    public disConnect(obj: IElement, endPoint?: string): void {
        let oldChanges: Connector = {} as Connector; let newChanges: Connector = {} as Connector;
        let selectorModel: SelectorModel; let connector: Connector;
        if (obj instanceof Selector) {
            selectorModel = obj as SelectorModel;
            connector = selectorModel.connectors[0] as Connector;
        } else if (obj instanceof Connector && this.diagram.currentDrawingObject) {
            connector = this.diagram.currentDrawingObject as Connector;
        }
        if (obj && connector && (hasSingleConnection(this.diagram) || this.diagram.currentDrawingObject)) {
            if (endPoint && (endPoint === 'ConnectorSourceEnd' || endPoint === 'ConnectorTargetEnd')) {
                let nodeEndId: string = endPoint === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
                let portEndId: string = endPoint === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
                if (connector[nodeEndId]) {//connector.sourceID || connector.targetID
                    oldChanges[nodeEndId] = connector[nodeEndId] as Connector;
                    connector[nodeEndId] = '';
                    newChanges[nodeEndId] = connector[nodeEndId] as Connector;
                    if (connector.sourcePortID || connector.targetPortID) {
                        oldChanges[portEndId] = connector[portEndId] as Connector;
                        connector[portEndId] = '';
                        newChanges[portEndId] = connector[portEndId] as Connector;
                    }
                    this.connectionEventChange(connector, oldChanges, newChanges, endPoint);
                }
            } else if ((endPoint !== 'OrthoThumb' && endPoint !== 'SegmentEnd') && (connector.sourceID || connector.targetID)) {
                oldChanges = {
                    sourceID: connector.sourceID, sourcePortID: connector.sourcePortID,
                    targetID: connector.targetID, targetPortID: connector.targetPortID
                } as Connector;
                connector.sourceID = ''; connector.sourcePortID = '';
                connector.targetID = ''; connector.targetPortID = '';
                newChanges = {
                    sourceID: connector.sourceID, sourcePortID: connector.sourcePortID,
                    targetID: connector.targetID, targetPortID: connector.targetPortID
                } as Connector;
                let arg: IConnectionChangeEventArgs = {
                    connector: connector, oldValue: oldChanges,
                    newValue: newChanges, cancel: false, state: 'Changing', connectorEnd: endPoint
                };
                this.triggerEvent(DiagramEvent.connectionChange, arg);
                if (arg.cancel) {
                    connector.sourceID = oldChanges.sourceID; connector.sourcePortID = oldChanges.sourcePortID;
                    connector.targetID = oldChanges.targetID; connector.targetPortID = oldChanges.targetPortID;
                } else {
                    this.diagram.connectorPropertyChange(connector as Connector, oldChanges, newChanges);
                    this.diagram.updateDiagramObject(connector);
                    arg = {
                        connector: connector, oldValue: oldChanges,
                        newValue: newChanges, cancel: false, state: 'Changed', connectorEnd: endPoint
                    };
                    this.triggerEvent(DiagramEvent.connectionChange, arg);
                }
            }
        }
    }


    private connectionEventChange(
        connector: Connector, oldChanges: Connector, newChanges: Connector, endPoint: string): void {
        let nodeEndId: string = endPoint === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
        let portEndId: string = endPoint === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
        let arg: IConnectionChangeEventArgs = {
            connector: connector, oldValue: { nodeId: oldChanges[nodeEndId], portId: oldChanges[portEndId] },
            newValue: { nodeId: newChanges[nodeEndId], portId: newChanges[portEndId] },
            cancel: false, state: 'Changing', connectorEnd: endPoint
        };
        this.triggerEvent(DiagramEvent.connectionChange, arg);
        if (arg.cancel) {
            connector[nodeEndId] = oldChanges[nodeEndId];
            connector[portEndId] = oldChanges[portEndId];
            newChanges = oldChanges;
        } else {
            this.diagram.connectorPropertyChange(connector as Connector, oldChanges, newChanges);
            this.diagram.updateDiagramObject(connector);
            arg = {
                connector: connector, oldValue: { nodeId: oldChanges[nodeEndId], portId: oldChanges[portEndId] },
                newValue: { nodeId: newChanges[nodeEndId], portId: newChanges[portEndId] },
                cancel: false, state: 'Changed', connectorEnd: endPoint
            };
            this.triggerEvent(DiagramEvent.connectionChange, arg);
        }
    }

    /**
     * @private
     */
    public findTarget(
        element: DiagramElement, argsTarget: IElement,
        source?: boolean, connection?: boolean): NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel {
        let target: NodeModel | PointPortModel;
        if (argsTarget instanceof Node) {
            if (element && element.id === argsTarget.id + '_content') {
                return argsTarget;
            }

            if (source && argsTarget.shape.type === 'Bpmn' && (argsTarget.shape as BpmnShape).shape === 'Activity') {
                if ((argsTarget.shape as BpmnShape).activity.subProcess.type === 'Transaction') {
                    let transaction: BpmnTransactionSubProcessModel = (argsTarget.shape as BpmnShape).activity.subProcess.transaction;
                    if (transaction.success.visible && element.id.indexOf(argsTarget.id + '_success') === 0) {
                        return transaction.success;
                    }

                    if (transaction.cancel.visible && element.id.indexOf(argsTarget.id + '_cancel') === 0) {
                        return transaction.cancel;
                    }

                    if (transaction.failure.visible && element.id.indexOf(argsTarget.id + '_failure') === 0) {
                        return transaction.failure;
                    }
                }
            }


            if (element instanceof PathElement) {
                for (let i: number = 0; i < argsTarget.ports.length; i++) {
                    let port: PointPortModel = argsTarget.ports[i];
                    if (element.id === argsTarget.id + '_' + port.id) {
                        return port;
                    }
                }
            }
        }
        if (!connection && element instanceof TextElement) {
            let annotation: ShapeAnnotationModel | PathAnnotationModel;
            for (let i: number = 0; i < (argsTarget as NodeModel | ConnectorModel).annotations.length; i++) {
                annotation = (argsTarget as NodeModel | ConnectorModel).annotations[i];
                if (element.id === (argsTarget as NodeModel | ConnectorModel).id + '_' + annotation.id) {
                    return annotation;
                }
            }
        }
        return argsTarget;
    }

    /**
     * @private
     */
    public canDisconnect(endPoint: string, args: MouseEventArgs, targetPortId: string, targetNodeId: string): boolean {
        let selector: SelectorModel; let connect: Connector;
        if (args.source instanceof Selector) {
            selector = args.source as SelectorModel;
            connect = selector.connectors[0] as Connector;
        } else if (args.source instanceof Connector && this.diagram.currentDrawingObject) {
            connect = this.diagram.currentDrawingObject as Connector;
        }
        let targetObject: NodeModel | PointPortModel = this.findTarget(
            args.targetWrapper, args.target, endPoint === 'ConnectorSourceEnd', true) as (NodeModel | PointPortModel);
        let nodeEnd: string = endPoint === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
        let portEnd: string = endPoint === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
        if (connect[nodeEnd] !== targetNodeId || connect[portEnd] !== targetPortId) {
            return true;
        }
        return false;
    }

    /**
     * @private
     */
    public changeAnnotationDrag(args: MouseEventArgs): void {
        let selectorModel: SelectorModel; let connector: Connector;
        if (args.source && (args.source as SelectorModel).connectors &&
            (args.source as SelectorModel).connectors.length && this.diagram.bpmnModule &&
            this.diagram.bpmnModule.textAnnotationConnectors.indexOf(
                ((args.source as SelectorModel).connectors[0] as Connector)) > -1) {
            if (args.source instanceof Selector) {
                selectorModel = args.source as SelectorModel;
                connector = selectorModel.connectors[0] as Connector;
            }
            let id: string[] = connector.id.split('_');
            let annotationId: string = id[id.length - 1];
            let nodeId: string = id[id.length - 3] || id[0];
            if (args.target && (args.target as Node).id !== nodeId &&
                ((args.target as Node).shape as BpmnShape).shape !== 'TextAnnotation') {
                this.diagram.startGroupAction();
                let parentNode: Node = this.diagram.nameTable[id[0]];
                let clonedNode: Node = this.getAnnotation(parentNode, id[1]) as Node;
                let annotationNode: Object = {
                    id: id[1] + randomId(),
                    angle: Point.findAngle(connector.intermediatePoints[0], connector.intermediatePoints[1]),
                    text: (clonedNode as BpmnAnnotationModel).text,
                    length: Point.distancePoints(connector.intermediatePoints[0], connector.intermediatePoints[1]),
                    shape: { shape: 'TextAnnotation', type: 'Bpmn' },
                    nodeId: (clonedNode as BpmnAnnotationModel as BpmnAnnotation).nodeId
                };
                let annotationObj: BpmnAnnotationModel = new BpmnAnnotation(
                    (args.target as Node).shape, 'annotations', annotationNode, true);
                this.diagram.bpmnModule.checkAndRemoveAnnotations(this.diagram.nameTable[connector.targetID], this.diagram);
                this.diagram.refreshCanvasLayers();
                annotationObj.id = id[1];
                this.diagram.addTextAnnotation(annotationObj, args.target);
                this.diagram.endGroupAction();
            } else if (connector) {
                connector.sourceID = nodeId;
                this.diagram.connectorPropertyChange(connector, {} as Connector, { sourceID: nodeId } as Connector);
                this.diagram.updateDiagramObject(connector);
            }
        }
    }

    /**
     * @private
     */
    public connect(endPoint: string, args: MouseEventArgs): void {
        let newChanges: Connector = {} as Connector;
        let oldChanges: Connector = {} as Connector;
        let oldNodeId: string;
        let oldPortId: string;
        let selectorModel: SelectorModel; let connector: Connector;
        if (args.source instanceof Selector) {
            selectorModel = args.source as SelectorModel;
            connector = selectorModel.connectors[0] as Connector;
        } else if (args.source instanceof Connector && this.diagram.currentDrawingObject) {
            connector = this.diagram.currentDrawingObject as Connector;
        }
        let target: NodeModel | PointPortModel = this.findTarget(
            args.targetWrapper, args.target, endPoint === 'ConnectorSourceEnd', true) as (NodeModel | PointPortModel);
        let nodeEndId: string = endPoint === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
        let portEndId: string = endPoint === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
        if (target instanceof Node) {
            oldChanges[nodeEndId] = connector[nodeEndId];
            connector[nodeEndId] = target.id;
            newChanges[nodeEndId] = connector[nodeEndId] as Connector;
            oldChanges[portEndId] = connector[portEndId];
            this.connectionEventChange(connector, oldChanges, newChanges, endPoint);

        } else {
            oldNodeId = connector[nodeEndId];
            oldPortId = connector[portEndId];
            connector[portEndId] = target.id;
            connector[nodeEndId] = (args.target as Node).id;
            newChanges[nodeEndId] = connector[nodeEndId] as Connector;
            newChanges[portEndId] = connector[portEndId] as Connector;
            let arg: IConnectionChangeEventArgs = {
                connector: connector, oldValue: { nodeId: oldNodeId, portId: oldPortId },
                newValue: { nodeId: newChanges[nodeEndId], portId: newChanges[portEndId] },
                cancel: false, state: 'Changing', connectorEnd: endPoint
            };
            this.triggerEvent(DiagramEvent.connectionChange, arg);
            if (arg.cancel) {
                connector[nodeEndId] = oldNodeId; connector[portEndId] = oldPortId;
                newChanges[nodeEndId] = oldNodeId; newChanges[portEndId] = oldPortId;
            } else {
                this.diagram.connectorPropertyChange(connector as Connector, {} as Connector, newChanges);
                this.diagram.updateDiagramObject(connector);
                arg = {
                    connector: connector, oldValue: { nodeId: oldNodeId, portId: oldPortId },
                    newValue: { nodeId: newChanges[nodeEndId], portId: newChanges[portEndId] }, cancel: false,
                    state: 'Changed', connectorEnd: endPoint
                };
                this.triggerEvent(DiagramEvent.connectionChange, arg);
            }
        }
        this.renderHighlighter(args, undefined, endPoint === 'ConnectorSourceEnd');
    }


    /** @private */
    public cut(): void {
        let index: number;
        this.clipboardData.pasteIndex = 0;
        if (this.diagram.undoRedoModule) {
            this.diagram.historyList.startGroupAction();
        }
        this.clipboardData.clipObject = this.copyObjects();
        if (this.diagram.undoRedoModule) {
            this.diagram.historyList.endGroupAction();
        }
        if (this.diagram.mode !== 'SVG') {
            this.diagram.refreshDiagramLayer();
        }
    }
    /** @private */
    public addLayer(layer: LayerModel, objects?: Object[]): void {
        layer.id = layer.id || randomId();
        layer.zIndex = this.diagram.layers.length;
        layer = new Layer(this.diagram, 'layers', layer, true);
        (layer as Layer).objectZIndex = -1;
        (layer as Layer).zIndexTable = {};
        this.diagram.layers.push(layer);
        this.diagram.layerZIndexTable[layer.zIndex] = layer.id;
        this.diagram.activeLayer = layer;
        let layers: string[] = layer.objects;
        if (objects) {
            for (let i: number = 0; i < objects.length; i++) {
                this.diagram.add(objects[i]);
            }
        }
    }
    /** @private */
    public getObjectLayer(objectName: string): LayerModel {
        let layers: LayerModel[] = this.diagram.layers;
        for (let i: number = 0; i < layers.length; i++) {
            let objIndex: number = layers[i].objects.indexOf(objectName);
            if (objIndex > -1) {
                return layers[i];
            }
        }
        return this.diagram.activeLayer;
    }
    /** @private */
    public getLayer(layerName: string): LayerModel {
        let layers: LayerModel[] = this.diagram.layers;
        for (let i: number = 0; i < layers.length; i++) {
            if (layers[i].id === layerName) {
                return layers[i];
            }
        }
        return undefined;
    }
    /** @private */
    public removeLayer(layerId: string): void {
        let layers: LayerModel = this.getLayer(layerId);
        if (layers) {
            let index: number = this.diagram.layers.indexOf(layers);
            let layerObject: string[] = layers.objects;
            for (let i: number = layerObject.length - 1; i >= 0; i--) {
                this.diagram.unSelect(this.diagram.nameTable[layerObject[i]]);
                this.diagram.remove(this.diagram.nameTable[layerObject[i]]);
                if (layers.id !== 'default_layer') {
                    if (this.diagram.activeLayer.id === layerId) {
                        this.diagram.activeLayer = this.diagram.layers[this.diagram.layers.length - 1];
                    }
                }
            }
            delete this.diagram.layerZIndexTable[layers.zIndex];
            this.diagram.layers.splice(index, 1);
            if (this.diagram.mode !== 'SVG') {
                this.diagram.refreshDiagramLayer();
            }
        }
    }
    /** @private */
    public moveObjects(objects: string[], targetLayer?: string): void {
        let layer: LayerModel = this.getLayer(targetLayer) || this.diagram.activeLayer;
        this.diagram.setActiveLayer(layer.id);
        let targerNodes: NodeModel | ConnectorModel;
        for (let i of objects) {
            let layer: LayerModel = this.getObjectLayer(i);
            let index: number = layer.objects.indexOf(i);
            if (index > -1) {
                targerNodes = this.diagram.nameTable[i];
                this.diagram.unSelect(targerNodes);
                this.diagram.remove(this.diagram.nameTable[i]);
                this.diagram.add(targerNodes);
            }
        }
    }
    /** @private */
    public cloneLayer(layerName: string): void {
        let layers: LayerModel[] = this.diagram.layers;
        let layer: LayerModel = this.getLayer(layerName);
        if (layer) {
            let cloneObject: (NodeModel | ConnectorModel)[] = [];
            let newlayer: LayerModel = {
                id: layerName + '_' + randomId(), objects: [], visible: true, lock: false
            };
            this.addLayer(newlayer);
            (newlayer as Layer).zIndex = this.diagram.layers.length - 1;
            let multiSelect: boolean = cloneObject.length !== 1;
            for (let obj of layer.objects) {
                cloneObject.push(this.diagram.nameTable[obj]);
            }
            this.paste(cloneObject);
        }
    }

    /** @private */
    public copy(): Object {
        this.clipboardData.pasteIndex = 1;
        this.clipboardData.clipObject = this.copyObjects();
        return this.clipboardData.clipObject;
    }
    /** @private */
    public copyObjects(): Object[] {
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        let obj: Object[] = [];
        this.clipboardData.childTable = {};
        if (this.diagram.selectedItems.connectors.length > 0) {
            selectedItems = this.diagram.selectedItems.connectors;
            for (let j: number = 0; j < selectedItems.length; j++) {
                let element: Object;
                if (this.diagram.bpmnModule &&
                    this.diagram.bpmnModule.textAnnotationConnectors.indexOf(selectedItems[j] as Connector) > -1) {
                    element = cloneObject((this.diagram.nameTable[(selectedItems[j] as Connector).targetID]));
                } else {
                    element = cloneObject((selectedItems[j]));
                }
                obj.push(element);
            }
        }

        if (this.diagram.selectedItems.nodes.length > 0) {
            selectedItems = selectedItems.concat(this.diagram.selectedItems.nodes);
            for (let j: number = 0; j < this.diagram.selectedItems.nodes.length; j++) {
                let node: NodeModel = clone(this.diagram.selectedItems.nodes[j]);
                let processTable: {} = {};
                this.copyProcesses(node as Node);
                obj.push(clone(node));
                let matrix: Matrix = identityMatrix();
                rotateMatrix(matrix, -node.rotateAngle, node.offsetX, node.offsetY);
                if (node.children) {
                    let childTable: {} = this.clipboardData.childTable;
                    let tempNode: NodeModel | ConnectorModel;
                    let elements: (NodeModel | ConnectorModel)[] = [];
                    let nodes: (NodeModel | ConnectorModel)[] = this.getAllDescendants(node, elements, true);
                    for (let i: number = 0; i < nodes.length; i++) {
                        tempNode = this.diagram.nameTable[nodes[i].id];
                        let clonedObject: NodeModel | ConnectorModel = childTable[tempNode.id] = clone(tempNode);
                        let newOffset: PointModel = transformPointByMatrix(
                            matrix, { x: clonedObject.wrapper.offsetX, y: clonedObject.wrapper.offsetY });
                        if (tempNode instanceof Node) {
                            (clonedObject as Node).offsetX = newOffset.x;
                            (clonedObject as Node).offsetY = newOffset.y;
                            (clonedObject as Node).rotateAngle -= node.rotateAngle;
                        }
                    }
                    this.clipboardData.childTable = childTable;
                }
            }
        }
        if (this.clipboardData.pasteIndex === 0) {
            this.startGroupAction();
            for (let item of selectedItems) {
                if (this.diagram.nameTable[item.id]) {
                    if (this.diagram.bpmnModule &&
                        this.diagram.bpmnModule.textAnnotationConnectors.indexOf((item as Connector)) > -1) {
                        this.diagram.remove(this.diagram.nameTable[(item as Connector).targetID]);
                    } else {
                        this.diagram.remove(item);
                    }
                }
            }
            this.endGroupAction();
        }
        this.sortByZIndex(obj, 'zIndex');
        return obj;
    }

    private copyProcesses(node: Node): void {
        if (node.shape.type === 'Bpmn' && (node.shape as BpmnShape).activity &&
            (node.shape as BpmnShape).activity.subProcess.processes &&
            (node.shape as BpmnShape).activity.subProcess.processes.length > 0) {
            let processes: string[] = (node.shape as BpmnShape).activity.subProcess.processes;
            for (let i of processes) {
                this.processTable[i] = (clone(this.diagram.nameTable[i]));
                if ((this.processTable[i].shape as BpmnShape).activity.subProcess.processes &&
                    (this.processTable[i].shape as BpmnShape).activity.subProcess.processes.length > 0) {
                    this.copyProcesses(this.processTable[i]);
                }
            }
            this.clipboardData.processTable = this.processTable;
        }
    }

    /** @private */
    public group(): void {
        let propName: string = 'isProtectedOnChange';
        let protectedChange: boolean = this.diagram[propName];
        this.diagram.protectPropertyChange(true);
        this.diagram.diagramActions = this.diagram.diagramActions | DiagramAction.Group;
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        let obj: NodeModel = {};
        obj.id = 'group' + randomId();
        obj = new Node(this.diagram, 'nodes', obj, true);
        obj.children = [];
        selectedItems = this.diagram.selectedItems.nodes;
        selectedItems = selectedItems.concat(this.diagram.selectedItems.connectors);
        for (let i: number = 0; i < selectedItems.length; i++) {
            if (!(selectedItems[i] as Node).parentId) {
                obj.children.push(selectedItems[i].id);
            }
        }
        this.diagram.add(obj as IElement);
        let entry: HistoryEntry = { type: 'Group', undoObject: obj, redoObject: obj, category: 'Internal' };
        this.addHistoryEntry(entry);
        this.diagram.diagramActions = this.diagram.diagramActions & ~DiagramAction.Group;
        this.diagram.protectPropertyChange(protectedChange);
    }


    /** @private */
    public unGroup(obj?: NodeModel): void {
        let propName: string = 'isProtectedOnChange';
        let protectedChange: boolean = this.diagram[propName];
        this.diagram.protectPropertyChange(true);
        this.diagram.diagramActions = this.diagram.diagramActions | DiagramAction.Group;
        let selectedItems: NodeModel[] = [];
        if (obj) {
            selectedItems.push(obj);
        } else {
            selectedItems = this.diagram.selectedItems.nodes;
        }
        for (let i: number = 0; i < selectedItems.length; i++) {
            let node: NodeModel = selectedItems[i];
            let entry: HistoryEntry = {
                type: 'UnGroup', undoObject: cloneObject(node),
                redoObject: cloneObject(node), category: 'Internal'
            };
            if (!(this.diagram.diagramActions & DiagramAction.UndoRedo)) {
                this.addHistoryEntry(entry);
            }
            if (node.children) {
                if ((node as Node).ports && (node as Node).ports.length > 0) {
                    this.diagram.removePorts((node as Node), (node as Node).ports);
                }
                if ((node as Node).annotations && (node as Node).annotations.length > 0) {
                    this.diagram.removeLabels((node as Node), (node as Node).annotations);
                }
                let parentNode: NodeModel = this.diagram.nameTable[(node as Node).parentId];
                for (let j: number = node.children.length - 1; j >= 0; j--) {
                    (this.diagram.nameTable[node.children[0]]).parentId = '';
                    this.diagram.deleteChild(this.diagram.nameTable[node.children[0]], node);
                    if ((node as Node).parentId && node.children[0]) {
                        this.diagram.addChild(parentNode, node.children[0]);
                    }
                }
                if ((node as Node).parentId) {
                    this.diagram.deleteChild(node, parentNode);
                }
            }
            this.diagram.removeNode(node);
            this.clearSelection();
        }
        this.diagram.diagramActions = this.diagram.diagramActions & ~DiagramAction.Group;
        this.diagram.protectPropertyChange(protectedChange);
    }


    /** @private */
    public paste(obj: (NodeModel | ConnectorModel)[]): void {
        if (obj || this.clipboardData.clipObject) {
            this.diagram.protectPropertyChange(true);
            let copiedItems: (NodeModel | ConnectorModel)[] = obj ? this.getNewObject(obj) :
                this.clipboardData.clipObject as (NodeModel | ConnectorModel)[];
            if (copiedItems) {
                let multiSelect: boolean = copiedItems.length !== 1;
                let groupAction: boolean = false;
                let objectTable: {} = {};
                let keyTable: {} = {};

                if (this.clipboardData.pasteIndex !== 0) {
                    this.clearSelection();
                }
                if (this.diagram.undoRedoModule) {
                    groupAction = true;
                    this.diagram.historyList.startGroupAction();
                }
                for (let copy of copiedItems) {
                    objectTable[copy.id] = copy;
                }
                for (let j: number = 0; j < copiedItems.length; j++) {
                    let copy: NodeModel | ConnectorModel = copiedItems[j];
                    if (getObjectType(copy) === Connector) {
                        let clonedObj: ConnectorModel = clone(copy);
                        let nodeId: string = clonedObj.sourceID;
                        clonedObj.sourceID = '';
                        if (objectTable[nodeId] && keyTable[nodeId]) {
                            clonedObj.sourceID = keyTable[nodeId];
                        }
                        nodeId = clonedObj.targetID;
                        clonedObj.targetID = '';
                        if (objectTable[nodeId] && keyTable[nodeId]) {
                            clonedObj.targetID = keyTable[nodeId];
                        }
                        let newObj: ConnectorModel = this.cloneConnector(clonedObj, multiSelect);

                        keyTable[copy.id] = newObj.id;

                    } else {
                        let newNode: NodeModel = this.cloneNode(copy as NodeModel, multiSelect);
                        //bpmn text annotations will not be pasted
                        if (newNode) {
                            keyTable[copy.id] = newNode.id;
                            let edges: string[] = (copy as Node).inEdges;
                            if (edges) {
                                for (let edge of edges) {
                                    if (objectTable[edge] && keyTable[edge]) {
                                        let newConnector: ConnectorModel = this.diagram.nameTable[keyTable[edge]];
                                        newConnector.targetID = keyTable[copy.id];
                                        this.diagram.connectorPropertyChange(
                                            newConnector as Connector, { targetID: '', targetPortID: '' } as Connector,
                                            { targetID: newConnector.targetID, targetPortID: newConnector.targetPortID } as Connector);
                                    }
                                }
                            }
                            edges = (copy as Node).outEdges;
                            if (edges) {
                                for (let edge of edges) {
                                    if (objectTable[edge] && keyTable[edge]) {
                                        let newConnector: ConnectorModel = this.diagram.nameTable[keyTable[edge]];
                                        newConnector.sourceID = keyTable[copy.id];
                                        this.diagram.connectorPropertyChange(
                                            newConnector as Connector, { sourceID: '', sourcePortID: '' } as Connector,
                                            { sourceID: newConnector.sourceID, sourcePortID: newConnector.sourcePortID } as Connector);
                                    }
                                }
                            }
                        }
                    }
                }

                if (groupAction === true) {
                    this.diagram.historyList.endGroupAction();
                    groupAction = false;
                }
                if (this.diagram.mode !== 'SVG') {
                    this.diagram.refreshDiagramLayer();
                }
                this.clipboardData.pasteIndex++;
                this.diagram.protectPropertyChange(false);
            }
        }
    }

    private getNewObject(obj: (NodeModel | ConnectorModel)[]): (Node | Connector)[] {
        let newObj: Node | Connector;
        let newobjs: (Node | Connector)[] = [];
        this.clipboardData.pasteIndex = 1;
        for (let i: number = 0; i < obj.length; i++) {
            newObj = cloneObject(obj[i]) as Connector | Node;
            newobjs.push(newObj);
        }
        return newobjs as (Node | Connector)[];
    }

    private cloneConnector(connector: ConnectorModel, multiSelect: boolean): ConnectorModel {
        let newConnector: Node | Connector;
        let cloneObject: Object = clone(connector);
        this.translateObject(cloneObject as Connector);
        (cloneObject as Node).zIndex = -1;
        newConnector = this.diagram.add(cloneObject);
        this.selectObjects([newConnector], multiSelect);
        return newConnector as ConnectorModel;
    }

    private cloneNode(node: NodeModel, multiSelect: boolean, children?: string[]): NodeModel {
        let newNode: NodeModel;
        let connectorsTable: {} = {};
        let cloneObject: Object = clone(node);
        let process: string[];
        if (node.shape && node.shape.type === 'Bpmn' && (node.shape as BpmnShape).activity &&
            (node.shape as BpmnShape).activity.subProcess.processes
            && (node.shape as BpmnShape).activity.subProcess.processes.length) {
            process = ((cloneObject as Node).shape as BpmnShape).activity.subProcess.processes;
            (cloneObject as Node).zIndex = -1;
            ((cloneObject as Node).shape as BpmnShape).activity.subProcess.processes = undefined;
        }
        if (node.children && node.children.length && (!children || !children.length)) {
            newNode = this.cloneGroup(node, multiSelect);
        } else if (node.shape && (node.shape as BpmnShape).shape === 'TextAnnotation' && node.id.indexOf('_textannotation_') !== -1 &&
            this.diagram.nameTable[node.id]) {
            let checkAnnotation: string[] = node.id.split('_textannotation_');
            let parentNode: Node;
            let annotation: Node = this.diagram.nameTable[node.id];
            for (let j: number = 0; j < annotation.inEdges.length; j++) {
                let connector: Connector = this.diagram.nameTable[annotation.inEdges[j]];
                if (connector) {
                    parentNode = this.diagram.nameTable[connector.sourceID];
                    let clonedNode: Node = this.getAnnotation(parentNode, checkAnnotation[1]) as Node;
                    let annotationNode: Object = {
                        id: checkAnnotation[1] + randomId(),
                        angle: (clonedNode as BpmnAnnotationModel).angle,
                        text: (clonedNode as BpmnAnnotationModel).text,
                        length: (clonedNode as BpmnAnnotationModel).length,
                        shape: { shape: 'TextAnnotation', type: 'Bpmn' },
                        nodeId: (clonedNode as BpmnAnnotationModel as BpmnAnnotation).nodeId
                    };
                    this.diagram.addTextAnnotation(annotationNode, parentNode);
                }
            }
        } else {
            this.translateObject(cloneObject as Node);
            (cloneObject as Node).zIndex = -1;
            if (children) { (cloneObject as Node).children = children; }
            newNode = this.diagram.add(cloneObject) as Node;
        }
        for (let i of Object.keys(connectorsTable)) {
            this.diagram.add(connectorsTable[i]);
        }
        if (process && process.length) {
            ((newNode as Node).shape as BpmnShape).activity.subProcess.processes = process;
            this.cloneSubProcesses(newNode);
        }
        if (newNode) {
            this.selectObjects([newNode], multiSelect);
        }
        return newNode;
    }

    private getAnnotation(parent: Node, annotationId: string): BpmnAnnotationModel {
        let currentAnnotation: BpmnAnnotationModel[] = (parent.shape as BpmnShape).annotations;
        if (currentAnnotation && currentAnnotation.length) {
            for (let g: number = 0; g <= currentAnnotation.length; g++) {
                if (currentAnnotation[g].id === annotationId) {
                    return currentAnnotation[g];
                }
            }
        }
        return undefined;
    }

    private cloneSubProcesses(node: NodeModel): void {
        let connector: string[] = [];
        let temp: {} = {};
        if (node.shape.type === 'Bpmn' && (node.shape as BpmnShape).activity &&
            (node.shape as BpmnShape).activity.subProcess.processes
            && (node.shape as BpmnShape).activity.subProcess.processes.length) {
            let process: string[] = (node.shape as BpmnShape).activity.subProcess.processes;
            for (let g: number = 0; g < process.length; g++) {
                let child: Node = this.diagram.nameTable[process[g]] || this.clipboardData.processTable[process[g]];
                for (let j of child.outEdges) {
                    if (connector.indexOf(j) < 0) {
                        connector.push(j);
                    }
                }
                for (let j of child.inEdges) {
                    if (connector.indexOf(j) < 0) {
                        connector.push(j);
                    }
                }
                let innerChild: Node = cloneObject(this.clipboardData.processTable[process[g]]) as Node;
                innerChild.processId = node.id;
                let newNode: NodeModel = this.cloneNode(innerChild, false);
                temp[process[g]] = newNode.id;
                process[g] = newNode.id;
                this.diagram.addProcess(newNode, node.id);
                for (let i of connector) {
                    let node: ConnectorModel = this.diagram.nameTable[i] || this.diagram.connectorTable[i];
                    let clonedNode: Object = cloneObject(node);
                    if (temp[(clonedNode as Connector).sourceID] && temp[(clonedNode as Connector).targetID]) {
                        (clonedNode as Connector).zIndex = -1;
                        (clonedNode as Connector).id += randomId();
                        (clonedNode as Connector).sourceID = temp[(clonedNode as Connector).sourceID];
                        (clonedNode as Connector).targetID = temp[(clonedNode as Connector).targetID];
                        connector.splice(connector.indexOf(i), 1);
                        this.diagram.add(clonedNode);
                    }
                }
            }
        }
    }


    private cloneGroup(obj: NodeModel, multiSelect: boolean): NodeModel {
        let value: NodeModel;
        let newChildren: string[] = [];
        let children: string[] = [];
        children = children.concat(obj.children);
        if (this.clipboardData.childTable) {
            for (let i: number = 0; i < children.length; i++) {
                let childObj: NodeModel | ConnectorModel = this.clipboardData.childTable[children[i]];
                if (childObj) {
                    let newObj: NodeModel | ConnectorModel;
                    if (getObjectType(childObj) === Connector) {
                        newObj = this.cloneConnector(childObj as ConnectorModel, multiSelect);
                    } else {
                        newObj = this.cloneNode(childObj as NodeModel, multiSelect);
                    }
                    newChildren.push(newObj.id);
                }
            }
        }
        let parentObj: NodeModel = this.cloneNode(obj, multiSelect, newChildren);
        return parentObj;
    }

    /** @private */
    public translateObject(obj: Node | Connector): void {
        obj.id += randomId();
        let diff: number = this.clipboardData.pasteIndex * 10;
        if (getObjectType(obj) === Connector) {
            (obj as Connector).sourcePoint = {
                x: (obj as Connector).sourcePoint.x + diff, y: (obj as Connector).sourcePoint.y + diff
            };
            (obj as Connector).targetPoint = {
                x: (obj as Connector).targetPoint.x + diff, y: (obj as Connector).targetPoint.y + diff
            };
            if ((obj as Connector).type === 'Bezier') {
                let segments: BezierSegment[] = ((obj as Connector).segments as BezierSegment[]);
                for (let i: number = 0; i < segments.length; i++) {
                    if (!Point.isEmptyPoint(segments[i].point1)) {
                        segments[i].point1 = {
                            x: segments[i].point1.x + diff, y: segments[i].point1.y + diff
                        };
                    }
                    if (!Point.isEmptyPoint(segments[i].point2)) {
                        segments[i].point2 = {
                            x: segments[i].point2.x + diff, y: segments[i].point2.y + diff
                        };
                    }
                }
            }
            if ((obj as Connector).type === 'Straight' || (obj as Connector).type === 'Bezier') {
                if ((obj as Connector).segments && (obj as Connector).segments.length > 0) {
                    let segments: (StraightSegmentModel | BezierSegmentModel)[] = (obj as Connector).segments;
                    for (let i: number = 0; i < segments.length - 1; i++) {
                        segments[i].point.x += diff;
                        segments[i].point.y += diff;
                    }
                }
            }
        } else {
            (obj as Node).offsetX += diff;
            (obj as Node).offsetY += diff;
        }
    }

    /**
     * @private
     */
    public drawObject(obj: Node | Connector): Node | Connector {
        let newObj: Node | Connector;
        let cloneObject: Node | Connector;
        cloneObject = clone(this.diagram.drawingObject) as Node | Connector;
        for (let prop of Object.keys(obj)) {
            cloneObject[prop] = obj[prop];
        }
        if (getObjectType(this.diagram.drawingObject) === Node) {
            newObj = new Node(this.diagram, 'nodes', cloneObject, true);
            newObj.id = (this.diagram.drawingObject.id || 'node') + randomId();
            this.diagram.initObject(newObj as Node);
        } else {
            newObj = new Connector(this.diagram, 'connectors', cloneObject, true);
            newObj.id = (this.diagram.drawingObject.id || 'connector') + randomId();
            this.diagram.initObject(newObj as Connector);
        }
        this.diagram.updateDiagramObject(newObj);
        this.diagram.currentDrawingObject = newObj;
        return newObj;
    }

    /**
     * @private
     */
    public addObjectToDiagram(obj: Node | Connector): void {
        let newObj: Node | Connector;
        this.diagram.removeFromAQuad(obj);
        this.diagram.removeObjectsFromLayer(this.diagram.nameTable[obj.id]);
        delete this.diagram.nameTable[obj.id];
        newObj = this.diagram.add(obj);
        if (this.diagram.mode !== 'SVG') {
            this.diagram.refreshDiagramLayer();
        }
        this.selectObjects([newObj]);
        if (obj && (!(canContinuousDraw(this.diagram)))) {
            this.diagram.tool &= ~DiagramTools.DrawOnce;
            this.diagram.currentDrawingObject = undefined;
        }
    }

    /**
     * @private
     */
    public addText(obj: Node | Connector, currentPosition: PointModel): void {
        let annotation: DiagramElement = this.diagram.findElementUnderMouse(obj, currentPosition);
        this.diagram.startTextEdit(obj, annotation instanceof TextElement ? (annotation.id).split('_')[1] : undefined);
    }


    /** @private */
    public selectObjects(
        obj: (NodeModel | ConnectorModel)[], multipleSelection?: boolean, oldValue?: (NodeModel | ConnectorModel)[]
    ): void {
        let arg: ISelectionChangeEventArgs = {
            oldValue: oldValue ? oldValue : [], newValue: obj, cause: this.diagram.diagramActions,
            state: 'Changing', type: 'Addition', cancel: false
        };
        let select: boolean = true;
        this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
        let canDoMultipleSelection: number = canMultiSelect(this.diagram);
        let canDoSingleSelection: number = canSingleSelect(this.diagram);
        if (canDoSingleSelection || canDoMultipleSelection) {
            if (!canDoMultipleSelection && ((obj.length > 1) || (multipleSelection && obj.length === 1))) {
                if (obj.length === 1) {
                    this.clearSelection();
                } else {
                    return;
                }
            }
            if (!canDoSingleSelection && obj.length === 1 && (!multipleSelection || !hasSelection(this.diagram))) {
                this.clearSelection();
                return;
            }
        }
        if (!arg.cancel) {
            for (let i: number = 0; i < obj.length; i++) {
                let newObj: NodeModel | ConnectorModel = obj[i];
                select = true;
                if (!hasSelection(this.diagram)) {
                    this.select(newObj, i > 0 || multipleSelection, true);
                } else {
                    if ((i > 0 || multipleSelection) && (newObj as Node).children && !(newObj as Node).parentId) {
                        for (let i: number = 0; i < this.diagram.selectedItems.nodes.length; i++) {
                            let parentNode: NodeModel = this.diagram.nameTable[(this.diagram.selectedItems.nodes[i] as Node).parentId];
                            if (parentNode) {
                                parentNode = this.findParent((parentNode as Node));
                                if (parentNode) {
                                    if (newObj.id === parentNode.id) {
                                        this.selectGroup(newObj as Node);
                                    }
                                }
                            }
                        }
                    }
                    this.selectProcesses(newObj as Node);

                    select = this.selectBpmnSubProcesses(newObj as Node);
                    if (select) {
                        this.select(newObj, i > 0 || multipleSelection, true);
                    }
                }
            }
            arg = {
                oldValue: oldValue ? oldValue : [], newValue: obj, cause: this.diagram.diagramActions,
                state: 'Changed', type: 'Addition', cancel: false
            };
            this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
            this.diagram.renderSelector(multipleSelection || (obj && obj.length > 1));
        }
    }
    /**
     * @private
     */
    public findParent(node: Node): Node {
        if (node.parentId) {
            node = this.diagram.nameTable[node.parentId];
            this.findParent(node);
        }
        return node;
    }
    private selectProcesses(newObj: Node): void {
        if (this.hasProcesses(newObj)) {
            let processes: string[] = ((newObj).shape as BpmnShape).activity.subProcess.processes;
            for (let i: number = 0; i < processes.length; i++) {
                let innerChild: (NodeModel | ConnectorModel) = this.diagram.nameTable[processes[i]];
                if (this.hasProcesses(innerChild as Node)) {
                    this.selectObjects([innerChild], true);
                }
                this.unSelect(innerChild);
            }
        }
    }
    private selectGroup(newObj: Node): void {
        for (let j: number = 0; j < (newObj as Node).children.length; j++) {
            let innerChild: (NodeModel | ConnectorModel) = this.diagram.nameTable[(newObj as Node).children[j]];
            if ((innerChild as Node).children) { this.selectGroup(innerChild as Node); }
            this.unSelect(this.diagram.nameTable[(newObj as Node).children[j]]);
        }
    }

    /**
     * @private
     */
    private selectBpmnSubProcesses(node: Node): boolean {
        let select: boolean = true;
        let parent: string;
        if (node.processId) {
            if (isSelected(this.diagram, this.diagram.nameTable[node.processId])) {
                select = false;
            } else { select = this.selectBpmnSubProcesses(this.diagram.nameTable[node.processId]); }
        } else if (node instanceof Connector) {
            if (node.sourceID && this.diagram.nameTable[node.sourceID] &&
                this.diagram.nameTable[node.sourceID].processId) {
                parent = this.diagram.nameTable[node.sourceID].processId;
            }
            if (node.targetID && this.diagram.nameTable[node.targetID] &&
                this.diagram.nameTable[node.targetID].processId) {
                parent = this.diagram.nameTable[node.targetID].processId;
            }
            if (parent) {
                if (isSelected(this.diagram, this.diagram.nameTable[parent])) {
                    return false;
                } else { select = this.selectBpmnSubProcesses(this.diagram.nameTable[parent]); }
            }
        }
        return select;
    }

    /**
     * @private
     */
    private hasProcesses(node: Node): boolean {
        if (node) {
            if ((node.shape.type === 'Bpmn') && (node.shape as BpmnShape).activity &&
                (node.shape as BpmnShape).activity.subProcess.processes &&
                (node.shape as BpmnShape).activity.subProcess.processes.length > 0) {
                return true;
            }
        }
        return false;
    }

    /** @private */
    public select(obj: NodeModel | ConnectorModel, multipleSelection?: boolean, preventUpdate?: boolean): void {
        let hasLayer: LayerModel = this.getObjectLayer(obj.id);
        if ((canSelect(obj) && !(obj instanceof Selector) && !isSelected(this.diagram, obj))
            && (hasLayer && !hasLayer.lock && hasLayer.visible) && obj.wrapper.visible) {
            multipleSelection = hasSelection(this.diagram) ? multipleSelection : false;
            if (!multipleSelection) {
                this.clearSelection();
            }
            let selectorModel: SelectorModel = this.diagram.selectedItems;
            let convert: Node | Connector = obj as Node | Connector;
            if (convert instanceof Node) {
                selectorModel.nodes.push(obj as NodeModel);
            } else {
                selectorModel.connectors.push(obj as ConnectorModel);
            }
            if (!multipleSelection) {
                (selectorModel as Selector).init(this.diagram);
                if (selectorModel.nodes.length === 1 && selectorModel.connectors.length === 0) {
                    selectorModel.rotateAngle = selectorModel.nodes[0].rotateAngle;
                    selectorModel.wrapper.rotateAngle = selectorModel.nodes[0].rotateAngle;
                    selectorModel.wrapper.pivot = selectorModel.nodes[0].pivot;
                }
            } else {
                selectorModel.wrapper.rotateAngle = selectorModel.rotateAngle = 0;
                selectorModel.wrapper.children.push(obj.wrapper);
            }
            if (!preventUpdate) {
                this.diagram.renderSelector(multipleSelection);
            }
        }
    }
    /** @private */
    public labelSelect(obj: NodeModel | ConnectorModel, textWrapper: DiagramElement): void {
        let selectorModel: Selector = (this.diagram.selectedItems) as Selector;
        selectorModel.nodes = selectorModel.connectors = [];
        if (obj instanceof Node) {
            selectorModel.nodes[0] = obj as NodeModel;
        } else {
            selectorModel.connectors[0] = obj as ConnectorModel;
        }
        selectorModel.annotation = (this.findTarget(textWrapper, obj as IElement)) as PathAnnotationModel | ShapeAnnotationModel;
        selectorModel.init(this.diagram);
        this.diagram.renderSelector(false);
    }

    /** @private */
    public unSelect(obj: NodeModel | ConnectorModel): void {
        let objArray: (NodeModel | ConnectorModel)[] = [];
        objArray.push(obj);
        let arg: ISelectionChangeEventArgs = {
            oldValue: objArray, newValue: [], cause: this.diagram.diagramActions,
            state: 'Changing', type: 'Removal', cancel: false
        };
        if (!this.diagram.currentSymbol) {
            this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
        }
        if (isSelected(this.diagram, obj)) {
            let selectormodel: SelectorModel = this.diagram.selectedItems;
            let index: number;
            if (obj instanceof Node) {
                index = selectormodel.nodes.indexOf(obj as NodeModel, 0);
                selectormodel.nodes.splice(index, 1);
            } else {
                index = selectormodel.connectors.indexOf(obj as ConnectorModel, 0);
                selectormodel.connectors.splice(index, 1);
            }
            arg = {
                oldValue: objArray, newValue: [], cause: this.diagram.diagramActions,
                state: 'Changed', type: 'Removal', cancel: false
            };
            if (!arg.cancel) {
                index = selectormodel.wrapper.children.indexOf(obj.wrapper, 0);
                selectormodel.wrapper.children.splice(index, 1);
                this.diagram.updateSelector();
                if (!this.diagram.currentSymbol) {
                    this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
                }
            }
        }
    }
    /** @private */
    public getChildElements(child: DiagramElement[]): string[] {
        let children: string[] = [];
        for (let i: number = 0; i < child.length; i++) {
            let childNode: DiagramElement = child[i];
            if ((childNode as Container).children && (childNode as Container).children.length > 0) {
                children.concat(this.getChildElements((childNode as Container).children));
            } else {
                children.push(childNode.id);
                if (childNode instanceof TextElement) {
                    children.push(childNode.id + '_text');
                }
            }
        }
        return children;
    }
    private moveSvgNode(nodeId: string, targetID: string): void {
        let diagramDiv: HTMLElement = getDiagramElement(targetID + '_groupElement', this.diagram.element.id);
        let backNode: HTMLElement = getDiagramElement(nodeId + '_groupElement', this.diagram.element.id);
        diagramDiv.parentNode.insertBefore(backNode, diagramDiv);
    }
    /** @private */
    public sendLayerBackward(layerName: string): void {
        let layer: LayerModel = this.getLayer(layerName);
        if (layer && layer.zIndex !== 0) {
            let index: number = layer.zIndex;
            if (this.diagram.mode === 'SVG') {
                let currentLayerObject: string[] = layer.objects;
                let targetObject: string = this.getLayer(this.diagram.layerZIndexTable[index - 1]).objects[0];
                if (targetObject) {
                    for (let obj of currentLayerObject) {
                        this.moveSvgNode(obj, targetObject);
                    }
                }
            }
            let targetLayer: LayerModel = this.getLayer(this.diagram.layerZIndexTable[index - 1]);
            targetLayer.zIndex = targetLayer.zIndex + 1;
            layer.zIndex = layer.zIndex - 1;
            let temp: string = this.diagram.layerZIndexTable[index];
            this.diagram.layerZIndexTable[index] = this.diagram.layerZIndexTable[index - 1];
            this.diagram.layerZIndexTable[index - 1] = temp;
            if (this.diagram.mode === 'Canvas') {
                this.diagram.refreshDiagramLayer();
            }
        }
    }
    /** @private */
    public bringLayerForward(layerName: string): void {
        let layer: LayerModel = this.getLayer(layerName);
        if (layer && layer.zIndex < this.diagram.layers.length - 1) {
            let index: number = layer.zIndex;
            if (this.diagram.mode === 'SVG') {
                let targetObject: string = this.getLayer(this.diagram.layerZIndexTable[index + 1]).objects[0];
                let currentLayerObject: string[] = layer.objects;
                for (let obj of currentLayerObject) {
                    if (targetObject) {
                        this.moveSvgNode(targetObject, obj);
                    }
                }
            }
            let targetLayer: LayerModel = this.getLayer(this.diagram.layerZIndexTable[index + 1]);
            targetLayer.zIndex = targetLayer.zIndex - 1;
            layer.zIndex = layer.zIndex + 1;
            let temp: string = this.diagram.layerZIndexTable[index];
            this.diagram.layerZIndexTable[index] = this.diagram.layerZIndexTable[index + 1];
            this.diagram.layerZIndexTable[index + 1] = temp;

            if (this.diagram.mode === 'Canvas') {
                this.diagram.refreshDiagramLayer();
            }
        }
    }
    /** @private */
    public sendToBack(): void {
        if (hasSelection(this.diagram)) {
            let objectId: string = this.diagram.selectedItems.nodes.length ? this.diagram.selectedItems.nodes[0].id
                : this.diagram.selectedItems.connectors[0].id;
            let index: number = this.diagram.nameTable[objectId].zIndex;
            let layerNum: number = this.diagram.layers.indexOf(this.getObjectLayer(objectId));
            let zIndexTable: {} = (this.diagram.layers[layerNum] as Layer).zIndexTable;
            for (let i: number = index; i > 0; i--) {
                if (zIndexTable[i]) {
                    //When there are empty records in the zindex table
                    if (!zIndexTable[i - 1]) {
                        zIndexTable[i - 1] = zIndexTable[i];
                        this.diagram.nameTable[zIndexTable[i - 1]].zIndex = i;
                        delete zIndexTable[i];
                    } else {
                        //bringing the objects forward
                        zIndexTable[i] = zIndexTable[i - 1];
                        this.diagram.nameTable[zIndexTable[i]].zIndex = i;
                    }
                }
            }
            zIndexTable[0] = this.diagram.nameTable[objectId].id;
            this.diagram.nameTable[objectId].zIndex = 0;
            if (this.diagram.mode === 'SVG') {
                let i: number = 1;
                let target: string = zIndexTable[i];
                while (!target && i < index) {
                    target = zIndexTable[++i];
                }
                this.moveSvgNode(objectId, target);
                this.updateNativeNodeIndex(objectId);
            } else {
                this.diagram.refreshCanvasLayers();
            }
        }
    }


    /** @private */
    public bringToFront(): void {
        if (hasSelection(this.diagram)) {
            let objectName: string = this.diagram.selectedItems.nodes.length ? this.diagram.selectedItems.nodes[0].id
                : this.diagram.selectedItems.connectors[0].id;
            let layerNum: number = this.diagram.layers.indexOf(this.getObjectLayer(objectName));
            let zIndexTable: {} = (this.diagram.layers[layerNum] as Layer).zIndexTable;
            //find the maximum zIndex of the tabel
            let tabelLength: number = Number(Object.keys(zIndexTable).sort(
                (a: string, b: string) => { return Number(a) - Number(b); }).reverse()[0]);
            let index: number = this.diagram.nameTable[objectName].zIndex;
            for (let i: number = index; i < tabelLength; i++) {
                //When there are empty records in the zindex table
                if (zIndexTable[i]) {
                    if (!zIndexTable[i + 1]) {
                        zIndexTable[i + 1] = zIndexTable[i];
                        this.diagram.nameTable[zIndexTable[i + 1]].zIndex = i;
                        delete zIndexTable[i];
                    } else {
                        //bringing the objects backward
                        zIndexTable[i] = zIndexTable[i + 1];
                        this.diagram.nameTable[zIndexTable[i]].zIndex = i;
                    }
                }
            }
            zIndexTable[tabelLength] = this.diagram.nameTable[objectName].id;
            this.diagram.nameTable[objectName].zIndex = tabelLength;
            if (this.diagram.mode === 'SVG') {
                let diagramLayer: SVGGElement = this.diagram.diagramLayer as SVGGElement;
                let child: string[] = this.getChildElements(this.diagram.nameTable[objectName].wrapper.children);
                let targerNodes: Object = [];
                let element: HTMLElement = getDiagramElement(objectName + '_groupElement', this.diagram.element.id);
                element.parentNode.removeChild(element);
                let nodes: NodeModel[] = this.diagram.selectedItems.nodes;
                if (nodes.length > 0 && (nodes[0].shape.type === 'Native' || nodes[0].shape.type === 'HTML')) {
                    for (let j: number = 0; j < this.diagram.views.length; j++) {
                        element = getDiagramElement(
                            objectName + (nodes[0].shape.type === 'HTML' ? '_content_html_element' : '_content_groupElement'),
                            this.diagram.views[j]);
                        let lastChildNode: HTMLElement = element.parentNode.lastChild as HTMLElement;
                        lastChildNode.parentNode.insertBefore(element, lastChildNode.nextSibling);
                    }
                }
                let htmlLayer: HTMLElement = getHTMLLayer(this.diagram.element.id);
                this.diagram.diagramRenderer.renderElement(this.diagram.nameTable[objectName].wrapper, diagramLayer, htmlLayer);
            } else {
                this.diagram.refreshCanvasLayers();
            }
        }
    }

    /** @private */
    public sortByZIndex(nodeArray: Object[], sortID?: string): Object[] {
        let id: string = sortID ? sortID : 'zIndex';
        nodeArray = nodeArray.sort((a: Object, b: Object): number => {
            return a[id] - b[id];
        });
        return nodeArray;
    }

    /** @private */
    public sendForward(): void {
        if (hasSelection(this.diagram)) {
            let nodeId: string = this.diagram.selectedItems.nodes.length ? this.diagram.selectedItems.nodes[0].id
                : this.diagram.selectedItems.connectors[0].id;

            let layerIndex: number = this.diagram.layers.indexOf(this.getObjectLayer(nodeId));
            let zIndexTable: {} = (this.diagram.layers[layerIndex] as Layer).zIndexTable;
            let tabelLength: number = Object.keys(zIndexTable).length;
            let index: NodeModel = this.diagram.nameTable[nodeId];
            let intersectArray: NodeModel[] = [];
            let temp: Object[] = this.diagram.spatialSearch.findObjects(index.wrapper.bounds);
            if (temp.length > 2) {
                temp = this.sortByZIndex(temp);
            }
            for (let i of temp) {
                if (index.id !== (i as NodeModel).id) {
                    let currentLayer: number = this.getObjectLayer((i as NodeModel).id).zIndex;
                    if (layerIndex === currentLayer && (Number(this.diagram.nameTable[nodeId].zIndex) < Number((i as NodeModel).zIndex)) &&
                        index.wrapper.bounds.intersects((i as NodeModel).wrapper.bounds)) {
                        intersectArray.push((i as NodeModel));
                        break;
                    }
                }
            }
            if (intersectArray.length > 0) {
                let overlapObject: number = intersectArray[0].zIndex;
                let currentObject: number = index.zIndex;
                let temp: string = zIndexTable[overlapObject];
                //swap the nodes
                (this.diagram.layers[0] as Layer).zIndexTable[overlapObject] = index.id;
                this.diagram.nameTable[zIndexTable[overlapObject]].zIndex = overlapObject;
                (this.diagram.layers[0] as Layer).zIndexTable[currentObject] = intersectArray[0].id;
                this.diagram.nameTable[zIndexTable[currentObject]].zIndex = currentObject;
                if (this.diagram.mode === 'SVG') {
                    this.moveSvgNode(zIndexTable[Number(intersectArray[0].zIndex)], nodeId);
                    this.updateNativeNodeIndex(zIndexTable[Number(intersectArray[0].zIndex)], nodeId);
                } else {
                    this.diagram.refreshCanvasLayers();
                }
            }
        }
    }
    /** @private */
    public sendBackward(): void {
        if (hasSelection(this.diagram)) {
            let objectId: string = this.diagram.selectedItems.nodes.length ? this.diagram.selectedItems.nodes[0].id
                : this.diagram.selectedItems.connectors[0].id;
            let layerNum: number = this.diagram.layers.indexOf(this.getObjectLayer(objectId));
            let zIndexTable: {} = (this.diagram.layers[layerNum] as Layer).zIndexTable;
            let tabelLength: number = Object.keys(zIndexTable).length;
            let node: NodeModel = this.diagram.nameTable[objectId];
            let intersectArray: NodeModel[] = [];
            let temp: Object[] = this.diagram.spatialSearch.findObjects(node.wrapper.bounds);
            if (temp.length > 2) {
                temp = this.sortByZIndex(temp);
            }
            for (let i of temp) {
                if (node.id !== (i as NodeModel).id) {
                    let currentLayer: number = this.getObjectLayer((i as NodeModel).id).zIndex;
                    if (layerNum === currentLayer && (Number(this.diagram.nameTable[objectId].zIndex) > Number((i as NodeModel).zIndex)) &&
                        node.wrapper.bounds.intersects((i as NodeModel).wrapper.bounds)) {
                        intersectArray.push((i as NodeModel));
                    }
                }
            }
            if (intersectArray.length > 0) {
                let overlapObject: number = intersectArray[intersectArray.length - 1].zIndex;
                let currentObject: number = node.zIndex;
                let temp: string = zIndexTable[overlapObject];
                //swap the nodes
                zIndexTable[overlapObject] = node.id;
                this.diagram.nameTable[zIndexTable[overlapObject]].zIndex = overlapObject;
                zIndexTable[currentObject] = intersectArray[intersectArray.length - 1].id;
                this.diagram.nameTable[zIndexTable[currentObject]].zIndex = currentObject;
                if (this.diagram.mode === 'SVG') {
                    this.moveSvgNode(objectId, zIndexTable[intersectArray[intersectArray.length - 1].zIndex]);
                    this.updateNativeNodeIndex(objectId, zIndexTable[intersectArray[intersectArray.length - 1].zIndex]);
                } else {
                    this.diagram.refreshCanvasLayers();
                }
            }
        }
    }

    /**   @private  */
    public updateNativeNodeIndex(nodeId: string, targetID?: string): void {
        let nodes: NodeModel[] = this.diagram.selectedItems.nodes;
        for (let i: number = 0; i < this.diagram.views.length; i++) {
            if (nodes.length > 0
                && (nodes[0].shape.type === 'HTML'
                    || nodes[0].shape.type === 'Native')) {
                let id: string = nodes[0].shape.type === 'HTML' ? '_content_html_element' : '_content_groupElement';
                let backNode: HTMLElement = getDiagramElement(nodeId + id, this.diagram.views[i]);
                let diagramDiv: HTMLElement = targetID ? getDiagramElement(targetID + id, this.diagram.views[i])
                    : backNode.parentElement.firstChild as HTMLElement;
                diagramDiv.parentNode.insertBefore(backNode, diagramDiv);
            }
        }
    }

    /**   @private  */
    public initSelectorWrapper(): void {
        let selectorModel: SelectorModel = this.diagram.selectedItems;
        (selectorModel as Selector).init(this.diagram);
        if (selectorModel.nodes.length === 1 && selectorModel.connectors.length === 0) {
            selectorModel.rotateAngle = selectorModel.nodes[0].rotateAngle;
            selectorModel.wrapper.rotateAngle = selectorModel.nodes[0].rotateAngle;
            selectorModel.wrapper.pivot = selectorModel.nodes[0].pivot;
        }
    }

    /** @private */
    public doRubberBandSelection(region: Rect): void {
        this.clearSelectionRectangle();
        this.clearSelection();
        let selArray: (NodeModel | ConnectorModel)[] = [];
        let rubberArray: (NodeModel | ConnectorModel)[] = [];
        selArray = this.diagram.getNodesConnectors(selArray);
        if (this.diagram.selectedItems.rubberBandSelectionMode === 'CompleteIntersect') {
            rubberArray = completeRegion(region, selArray);
        } else {
            rubberArray = this.diagram.spatialSearch.findObjects(region);
        }
        if (rubberArray.length) {
            this.selectObjects(rubberArray, true);
        }
    }

    private clearSelectionRectangle(): void {
        let adornerSvg: SVGSVGElement = getAdornerLayerSvg(this.diagram.element.id);
        let element: SVGElement = adornerSvg.getElementById(
            this.diagram.element.id + '_diagramAdorner_selected_region') as SVGElement;
        if (element) {
            remove(element);
        }
    }

    /** @private */
    public dragConnectorEnds(
        endPoint: string, obj: IElement, point: PointModel, segment: BezierSegmentModel, target?: IElement, targetPortId?: string):
        boolean {

        let selectorModel: SelectorModel;
        let connector: Connector; let node: Node;
        let tx: number; let segmentPoint: PointModel;
        let ty: number; let index: number;
        let checkBezierThumb: boolean = false;
        if (obj instanceof Selector) {
            selectorModel = obj as SelectorModel;
            connector = selectorModel.connectors[0] as Connector;
        } else if (obj instanceof Connector && this.diagram.currentDrawingObject) {
            this.clearSelection();
            connector = this.diagram.currentDrawingObject as Connector;
        }
        if (endPoint === 'BezierSourceThumb' || endPoint === 'BezierTargetThumb') {
            checkBezierThumb = true;
        }
        if (endPoint === 'ConnectorSourceEnd' || endPoint === 'BezierSourceThumb') {
            tx = point.x - (checkBezierThumb ? (segment as BezierSegment).bezierPoint1.x : connector.sourcePoint.x);
            ty = point.y - (checkBezierThumb ? (segment as BezierSegment).bezierPoint1.y : connector.sourcePoint.y);
            return this.dragSourceEnd(
                connector, tx, ty, null, point, endPoint, undefined, target as Node, targetPortId, undefined, segment);
        } else {
            tx = point.x - (checkBezierThumb ? (segment as BezierSegment).bezierPoint2.x : connector.targetPoint.x);
            ty = point.y - (checkBezierThumb ? (segment as BezierSegment).bezierPoint2.y : connector.targetPoint.y);
            return this.dragTargetEnd(connector, tx, ty, null, point, endPoint, undefined, segment);
        }
    }

    /**   @private  */
    public getSelectedObject(): (NodeModel | ConnectorModel)[] {
        let selectormodel: SelectorModel = this.diagram.selectedItems;
        return (selectormodel.nodes).concat(selectormodel.connectors as Object);

    }

    /** @private */
    public clearSelection(triggerAction?: boolean): void {
        if (hasSelection(this.diagram)) {
            let selectormodel: SelectorModel = this.diagram.selectedItems;
            let arrayNodes: (NodeModel | ConnectorModel)[] = this.getSelectedObject();
            let arg: ISelectionChangeEventArgs = {
                oldValue: arrayNodes, newValue: [], cause: this.diagram.diagramActions,
                state: 'Changing', type: 'Removal', cancel: false
            };
            if (triggerAction) {
                this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
            }
            if (!arg.cancel) {
                selectormodel.offsetX = 0;
                selectormodel.offsetY = 0;
                selectormodel.width = 0;
                selectormodel.height = 0;
                selectormodel.rotateAngle = 0;
                selectormodel.nodes = [];
                selectormodel.connectors = [];
                selectormodel.wrapper = null;
                (selectormodel as Selector).annotation = undefined;
                this.diagram.clearSelectorLayer();
                if (triggerAction) {
                    arg = {
                        oldValue: arrayNodes, newValue: [], cause: this.diagram.diagramActions,
                        state: 'Changed', type: 'Removal', cancel: false
                    };
                    this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
                }
            }
        }
    }

    /** @private */
    public drag(obj: NodeModel | ConnectorModel, tx: number, ty: number): void {
        let tempNode: NodeModel | ConnectorModel;
        let elements: (NodeModel | ConnectorModel)[] = [];
        if (canMove(obj) && this.checkBoundaryConstraints(tx, ty, obj.wrapper.bounds) && canPageEditable(this.diagram)) {
            if (obj instanceof Node) {
                let oldValues: NodeModel = { offsetX: obj.offsetX, offsetY: obj.offsetY };
                obj.offsetX += tx;
                obj.offsetY += ty;
                if (obj.children) {
                    let nodes: (NodeModel | ConnectorModel)[] = this.getAllDescendants(obj, elements);
                    for (let i: number = 0; i < nodes.length; i++) {
                        tempNode = (this.diagram.nameTable[nodes[i].id]);
                        this.drag(tempNode, tx, ty);
                    }
                    this.updateInnerParentProperties(obj);
                }
                this.diagram.nodePropertyChange(obj as Node, oldValues as Node, { offsetX: obj.offsetX, offsetY: obj.offsetY } as Node);
            } else {
                let connector: Connector = obj as Connector;
                let update: boolean = connector.type === 'Bezier' ? true : false;
                let hasEnds: boolean = false;
                if (!connector.sourceWrapper) {
                    this.dragSourceEnd(connector, tx, ty, true, null, '', update);
                } else {
                    hasEnds = true;
                }
                if (!connector.targetWrapper) {
                    this.dragTargetEnd(connector, tx, ty, true, null, '', update);
                } else {
                    hasEnds = true;
                }
                if (!hasEnds) {
                    this.dragControlPoint(connector, tx, ty, true);
                    let conn: Connector = { sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint } as Connector;
                    this.diagram.connectorPropertyChange(connector as Connector, {} as Connector, conn);
                }
            }
        }
    }

    /**   @private  */
    public connectorSegmentChange(actualObject: Node, existingInnerBounds: Rect, isRotate: boolean): void {
        let tx: number; let ty: number; let segmentChange: boolean = true;
        if (existingInnerBounds.equals(existingInnerBounds, actualObject.wrapper.bounds) === false) {
            if (actualObject.outEdges.length > 0) {
                for (let k: number = 0; k < actualObject.outEdges.length; k++) {
                    let connector: Connector = this.diagram.nameTable[actualObject.outEdges[k]];
                    if (connector.targetID !== '') {
                        segmentChange = this.isSelected(this.diagram.nameTable[connector.targetID]) ? false : true;
                    } else {
                        segmentChange = this.isSelected(this.diagram.nameTable[connector.id]) ? false : true;
                    }
                    if (connector.type === 'Orthogonal' && connector.segments && connector.segments.length > 1) {
                        if (!isRotate) {
                            if (segmentChange) {
                                switch ((connector.segments[0] as OrthogonalSegment).direction) {
                                    case 'Bottom':
                                        tx = actualObject.wrapper.bounds.bottomCenter.x - existingInnerBounds.bottomCenter.x;
                                        ty = actualObject.wrapper.bounds.bottomCenter.y - existingInnerBounds.bottomCenter.y;
                                        break;
                                    case 'Top':
                                        tx = actualObject.wrapper.bounds.topCenter.x - existingInnerBounds.topCenter.x;
                                        ty = actualObject.wrapper.bounds.topCenter.y - existingInnerBounds.topCenter.y;
                                        break;
                                    case 'Left':
                                        tx = actualObject.wrapper.bounds.middleLeft.x - existingInnerBounds.middleLeft.x;
                                        ty = actualObject.wrapper.bounds.middleLeft.y - existingInnerBounds.middleLeft.y;
                                        break;
                                    case 'Right':
                                        tx = actualObject.wrapper.bounds.middleRight.x - existingInnerBounds.middleRight.x;
                                        ty = actualObject.wrapper.bounds.middleRight.y - existingInnerBounds.middleRight.y;
                                        break;
                                }
                                this.dragSourceEnd(
                                    connector, tx, ty, true, null, 'ConnectorSourceEnd', undefined, undefined, undefined, true);
                            }
                        } else {
                            let firstSegment: OrthogonalSegment = connector.segments[0] as OrthogonalSegment;
                            let secondSegment: OrthogonalSegment = connector.segments[1] as OrthogonalSegment;
                            let cornerPoints: Corners = swapBounds(
                                actualObject.wrapper, actualObject.wrapper.corners, actualObject.wrapper.bounds);
                            let sourcePoint: PointModel = findPoint(cornerPoints, firstSegment.direction);
                            sourcePoint = getIntersection(
                                connector, connector.sourceWrapper, sourcePoint,
                                { x: connector.sourceWrapper.offsetX, y: connector.sourceWrapper.offsetY }, false);
                            let source: End = {
                                corners: undefined, point: sourcePoint, margin: undefined, direction: firstSegment.direction
                            };
                            let target: End = {
                                corners: undefined, point: secondSegment.points[1], margin: undefined, direction: undefined
                            };
                            let intermediatePoints: PointModel[] = orthoConnection2Segment(source, target);
                            firstSegment.length = Point.distancePoints(intermediatePoints[0], intermediatePoints[1]);
                            if (secondSegment.direction && secondSegment.length) {
                                secondSegment.length = Point.distancePoints(intermediatePoints[1], intermediatePoints[2]);
                            }
                        }
                    }
                }
            }
        }
    }

    /** @private */
    public updateEndPoint(connector: Connector): void {
        let conn: Connector = {
            sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint,
            sourceID: connector.sourceID ? connector.sourceID : undefined,
            targetID: connector.targetID ? connector.targetID : undefined,
            sourcePortID: connector.sourcePortID ? connector.sourcePortID : undefined,
            targetPortID: connector.targetPortID ? connector.targetPortID : undefined,
            segments: connector.segments ? connector.segments : undefined
        } as Connector;
        this.diagram.connectorPropertyChange(connector as Connector, {} as Connector, conn);
        // this.diagram.refreshDiagramLayer();
        this.diagram.updateSelector();
    }


    /** @private */
    public dragSourceEnd(
        obj: ConnectorModel, tx: number, ty: number, preventUpdate?: boolean,
        point?: PointModel, endPoint?: string, update?: boolean, target?: NodeModel,
        targetPortId?: string, isDragSource?: boolean, segment?: BezierSegmentModel):
        boolean {
        let connector: Connector = this.diagram.nameTable[obj.id];
        let checkBoundaryConstraints: boolean = this.checkBoundaryConstraints(tx, ty, connector.wrapper.bounds);
        if (canDragSourceEnd(connector as Connector) && checkBoundaryConstraints
            && (endPoint !== 'BezierSourceThumb') && canPageEditable(this.diagram)) {
            connector.sourcePoint.x += tx;
            connector.sourcePoint.y += ty;
            if (endPoint === 'ConnectorSourceEnd' && connector.type === 'Orthogonal') {
                this.changeSegmentLength(connector, target, targetPortId, isDragSource);
            }
        }
        if (connector.type === 'Bezier') {
            if (segment) {
                this.translateBezierPoints(obj, (endPoint === '') ? 'ConnectorSourceEnd' : endPoint, tx, ty, segment, point, !update);
            } else {
                for (let i: number = 0; i < obj.segments.length; i++) {
                    this.translateBezierPoints(
                        obj, (endPoint === '') ? 'ConnectorSourceEnd' : endPoint, tx, ty, obj.segments[i], point, !update);
                }
            }
        }
        if (!preventUpdate) {
            this.updateEndPoint(connector as Connector);
        }
        return checkBoundaryConstraints;
    }

    /** 
     * Upadte the connector segments when change the source node
     */
    private changeSegmentLength(connector: Connector, target: NodeModel, targetPortId: string, isDragSource: boolean): void {
        if (connector.segments && (connector.segments[0] as OrthogonalSegment).direction !== null
            && ((!target && connector.sourceID === '') || isDragSource)) {
            let first: OrthogonalSegment = connector.segments[0] as OrthogonalSegment;
            let second: OrthogonalSegment = connector.segments[1] as OrthogonalSegment;
            let node: NodeModel = this.diagram.nameTable[connector.sourceID]; let secPoint: PointModel;
            first.points[0] = connector.sourcePoint;
            if (first.direction === 'Top' || first.direction === 'Bottom') {
                first.points[first.points.length - 1].x = connector.sourcePoint.x;
                second.points[0].y = first.points[first.points.length - 1].y;
            } else {
                first.points[first.points.length - 1].y = connector.sourcePoint.y;
                second.points[0].x = first.points[first.points.length - 1].x;
            }
            if (first.direction && (first.length || first.length === 0)) {
                first.length = Point.distancePoints(first.points[0], first.points[first.points.length - 1]);
            }
            if (second.direction && (second.length || second.length === 0)) {
                second.length = Point.distancePoints(first.points[first.points.length - 1], second.points[second.points.length - 1]);
                second.direction = Point.direction(
                    first.points[first.points.length - 1], second.points[second.points.length - 1]) as Direction;
            }
            if (connector.sourcePortID !== '' && first.length < 10) {
                if (connector.segments.length > 2) {
                    let next: OrthogonalSegment = connector.segments[2] as OrthogonalSegment;
                    let nextDirection: Direction = Point.direction(next.points[0], next.points[1]) as Direction;
                    if (first.direction === getOppositeDirection(nextDirection)) {
                        if (first.direction === 'Right') {
                            next.points[0].x = first.points[first.points.length - 1].x = node.wrapper.corners.middleRight.x + 20;
                        } else if (first.direction === 'Left') {
                            next.points[0].x = first.points[first.points.length - 1].x = node.wrapper.corners.middleLeft.x - 20;
                        } else if (first.direction === 'Top') {
                            next.points[0].y = first.points[first.points.length - 1].y = node.wrapper.corners.topCenter.y - 20;
                        } else {
                            next.points[0].y = first.points[first.points.length - 1].y = node.wrapper.corners.bottomCenter.y + 20;
                        }
                        if (next.direction && next.length) {
                            next.length = Point.distancePoints(next.points[0], next.points[next.points.length - 1]);
                        }
                        first.length = Point.distancePoints(first.points[0], first.points[first.points.length - 1]);
                    } else if (first.direction === nextDirection && next.direction && next.length) {
                        if (first.direction === 'Top' || first.direction === 'Bottom') {
                            next.points[0] = first.points[0];
                            next.points[next.points.length - 1].x = next.points[0].x;
                        } else {
                            next.points[0] = first.points[0];
                            next.points[next.points.length - 1].y = next.points[0].y;
                        }
                        next.length = Point.distancePoints(next.points[0], next.points[next.points.length - 1]);
                        connector.segments.splice(0, 2);
                    } else {
                        first.length = 20;
                    }
                } else {
                    first.length = 20;
                }
            } else if (first.length < 1) {
                if (connector.sourceID !== '') {
                    if (second.direction === 'Right') {
                        secPoint = node.wrapper.corners.middleRight;
                        second.points[second.points.length - 1].y = secPoint.y;
                    } else if (second.direction === 'Left') {
                        secPoint = node.wrapper.corners.middleLeft;
                        second.points[second.points.length - 1].y = secPoint.y;
                    } else if (second.direction === 'Top') {
                        secPoint = node.wrapper.corners.topCenter;
                        second.points[second.points.length - 1].x = secPoint.x;
                    } else {
                        secPoint = node.wrapper.corners.bottomCenter;
                        second.points[second.points.length - 1].x = secPoint.x;
                    }
                    second.length = Point.distancePoints(secPoint, second.points[second.points.length - 1]);
                    if (connector.segments.length > 2) {
                        let next: OrthogonalSegment = connector.segments[2] as OrthogonalSegment;
                        if (next.direction && next.length) {
                            next.length = Point.distancePoints(
                                second.points[second.points.length - 1], next.points[next.points.length - 1]);
                        }
                    }
                    connector.segments.splice(0, 1);
                } else {
                    connector.segments.splice(0, 1);
                }
            }
        } else {
            if (target && !targetPortId && connector.sourceID !== target.id &&
                connector.segments && (connector.segments[0] as OrthogonalSegment).direction !== null && target && target instanceof Node) {
                this.changeSourceEndToNode(connector, target);
            }
            if (target && targetPortId && connector.sourcePortID !== targetPortId &&
                connector.segments && (connector.segments[0] as OrthogonalSegment).direction !== null && target && target instanceof Node) {
                this.changeSourceEndToPort(connector, target, targetPortId);
            }
        }
    }

    /** 
     * Change the connector endPoint to port 
     */
    private changeSourceEndToPort(connector: ConnectorModel, target: Node, targetPortId: string): void {
        let port: DiagramElement = this.diagram.getWrapper(target.wrapper, targetPortId);
        let point: PointModel = { x: port.offsetX, y: port.offsetY };
        let direction: Direction = getPortDirection(point, cornersPointsBeforeRotation(target.wrapper), target.wrapper.bounds, false);
        let firstSegment: OrthogonalSegment = connector.segments[0] as OrthogonalSegment;
        let secondSegment: OrthogonalSegment = connector.segments[1] as OrthogonalSegment;
        if (firstSegment.direction !== direction) {
            let segments: OrthogonalSegmentModel[] = [];
            let segValues: Object = {};
            if (firstSegment.direction === getOppositeDirection(direction)) {
                segValues = {}; let segValues1: Object;
                if (direction === 'Top' || direction === 'Bottom') {
                    segValues1 = (direction === 'Top') ? {
                        type: 'Orthogonal', isTerminal: true, direction: direction,
                        length: Math.abs(firstSegment.points[0].y - point.y)
                    } :
                        {
                            type: 'Orthogonal', isTerminal: true, direction: direction,
                            length: Math.abs(point.y - firstSegment.points[0].y)
                        };
                    segValues = (firstSegment.points[0].x > point.x) ?
                        { type: 'Orthogonal', isTerminal: true, direction: 'Right', length: (firstSegment.points[0].x - point.x) } :
                        { type: 'Orthogonal', isTerminal: true, direction: 'Left', length: (point.x - firstSegment.points[0].x) };
                } else {
                    segValues1 = (direction === 'Right') ? {
                        type: 'Orthogonal', isTerminal: true, direction: direction,
                        length: Math.abs(firstSegment.points[0].x - point.x)
                    } :
                        {
                            type: 'Orthogonal', isTerminal: true, direction: direction,
                            length: Math.abs(point.x - firstSegment.points[0].x)
                        };
                    segValues = (firstSegment.points[0].y > point.y) ?
                        { type: 'Orthogonal', direction: 'Top', isTerminal: true, length: (firstSegment.points[0].y - point.y) } :
                        { type: 'Orthogonal', direction: 'Bottom', isTerminal: true, length: (point.y - firstSegment.points[0].y) };
                }
                segments.push(new OrthogonalSegment(connector, 'segments', segValues1, true));
                segments.push(new OrthogonalSegment(connector, 'segments', segValues, true));
            } else {
                segValues = { type: 'Orthogonal', direction: direction, length: 20, isTerminal: true };
                segments.push(new OrthogonalSegment(connector, 'segments', segValues, true));
            }
            if (firstSegment.direction !== getOppositeDirection(direction)) {
                if (direction === 'Top' || direction === 'Bottom') {
                    firstSegment.points[0].x = point.x;
                    firstSegment.points[0].y = firstSegment.points[firstSegment.points.length - 1].y = (direction === 'Top') ?
                        point.y - 20 : point.y + 20;
                } else {
                    firstSegment.points[0].y = point.y;
                    firstSegment.points[0].x = firstSegment.points[firstSegment.points.length - 1].x = (direction === 'Right') ?
                        point.x + 20 : point.x - 20;
                }
                firstSegment.length = Point.distancePoints(firstSegment.points[0], firstSegment.points[firstSegment.points.length - 1]);
                secondSegment.length = Point.distancePoints(
                    firstSegment.points[firstSegment.points.length - 1], secondSegment.points[secondSegment.points.length - 1]);
            }
            connector.segments = segments.concat(connector.segments);
        } else {
            firstSegment.points[0] = point;
            if (direction === 'Top' || direction === 'Bottom') {
                firstSegment.points[firstSegment.points.length - 1].x = point.x;

            } else {
                firstSegment.points[firstSegment.points.length - 1].y = point.y;
            }
            firstSegment.length = Point.distancePoints(firstSegment.points[0], firstSegment.points[firstSegment.points.length - 1]);
            secondSegment.length = Point.distancePoints(
                firstSegment.points[firstSegment.points.length - 1], secondSegment.points[secondSegment.points.length - 1]);
        }
    }
    /**
     * @private
     * Remove terinal segment in initial
     */
    public removeTerminalSegment(connector: Connector, changeTerminal?: boolean): void {
        for (let i: number = 0; i < connector.segments.length - 2; i++) {
            let segment: OrthogonalSegment = connector.segments[0] as OrthogonalSegment;
            if (segment.isTerminal) {
                if (changeTerminal) {
                    segment.isTerminal = false;
                } else {
                    connector.segments.splice(i, 1); i--;
                }
            }
        }
    }

    /** 
     * Change the connector endPoint from point to node 
     */
    private changeSourceEndToNode(connector: ConnectorModel, target: Node): void {
        this.removeTerminalSegment(connector as Connector);
        let sourceWrapper: Corners = target.wrapper.children[0].corners; let sourcePoint: PointModel; let sourcePoint2: PointModel;
        let firstSegment: OrthogonalSegment = connector.segments[0] as OrthogonalSegment;
        let nextSegment: OrthogonalSegment = connector.segments[1] as OrthogonalSegment;
        let segments: OrthogonalSegmentModel[] = [];
        if (firstSegment.direction === 'Right' || firstSegment.direction === 'Left') {
            sourcePoint = (firstSegment.direction === 'Left') ? sourceWrapper.middleLeft : sourceWrapper.middleRight;
            if (firstSegment.length > sourceWrapper.width || ((firstSegment.direction === 'Left' &&
                sourcePoint.x >= firstSegment.points[0].x) || (firstSegment.direction === 'Right' &&
                    sourcePoint.x <= firstSegment.points[0].x))) {

                firstSegment.points[0].y = firstSegment.points[firstSegment.points.length - 1].y = sourcePoint.y;
                firstSegment.points[0].x = sourcePoint.x;
                firstSegment.length = Point.distancePoints(
                    firstSegment.points[0], firstSegment.points[firstSegment.points.length - 1]);
                nextSegment.length = Point.distancePoints(
                    firstSegment.points[firstSegment.points.length - 1], nextSegment.points[nextSegment.points.length - 1]);
            } else {
                let direction: Direction;
                if (nextSegment.direction) {
                    direction = nextSegment.direction;
                } else {
                    direction = Point.direction(
                        nextSegment.points[0], nextSegment.points[nextSegment.points.length - 1]) as Direction;
                }
                sourcePoint2 = (direction === 'Bottom') ? sourceWrapper.bottomCenter : sourceWrapper.topCenter;
                if (nextSegment.length && nextSegment.direction) {
                    nextSegment.length =
                        (direction === 'Top') ? firstSegment.points[firstSegment.points.length - 1].y - (sourcePoint2.y + 20) :
                            (sourcePoint2.y + 20) - firstSegment.points[firstSegment.points.length - 1].y;
                }
                firstSegment.length = firstSegment.points[firstSegment.points.length - 1].x - sourcePoint2.x;
                firstSegment.direction = (firstSegment.length > 0) ? 'Right' : 'Left';
                let segValues: Object = { type: 'Orthogonal', direction: direction, length: 20 };
                segments.push(new OrthogonalSegment(connector as Connector, 'segments', segValues, true));
                connector.segments = segments.concat(connector.segments);
            }
        } else {
            sourcePoint = (firstSegment.direction === 'Bottom') ? sourceWrapper.bottomCenter : sourceWrapper.topCenter;

            if (firstSegment.length > sourceWrapper.height || ((firstSegment.direction === 'Top' &&
                sourcePoint.y >= firstSegment.points[0].y) ||
                (firstSegment.direction === 'Bottom' && sourcePoint.y <= firstSegment.points[0].y))) {
                firstSegment.points[0].x = firstSegment.points[firstSegment.points.length - 1].x = sourcePoint.x;
                firstSegment.points[0].y = sourcePoint.y;
                firstSegment.length = Point.distancePoints(
                    firstSegment.points[0], firstSegment.points[firstSegment.points.length - 1]);
                nextSegment.length = Point.distancePoints(
                    firstSegment.points[firstSegment.points.length - 1], nextSegment.points[nextSegment.points.length - 1]);
            } else {
                sourcePoint2 = (nextSegment.direction === 'Left') ? sourceWrapper.middleLeft : sourceWrapper.middleRight;
                let direction: Direction;
                if (nextSegment.direction) {
                    direction = nextSegment.direction;
                } else {
                    direction = Point.direction(
                        nextSegment.points[0], nextSegment.points[nextSegment.points.length - 1]) as Direction;
                }
                if (nextSegment.length && nextSegment.direction) {
                    nextSegment.length =
                        (direction === 'Left') ? firstSegment.points[firstSegment.points.length - 1].x - (sourcePoint2.x + 20) :
                            (sourcePoint2.x + 20) - firstSegment.points[firstSegment.points.length - 1].x;
                }
                firstSegment.length = firstSegment.points[firstSegment.points.length - 1].y - sourcePoint2.y;
                firstSegment.direction = (firstSegment.length > 0) ? 'Bottom' : 'Top';
                let segValues: Object = { type: 'Orthogonal', direction: direction, length: 20 };
                segments.push(new OrthogonalSegment(connector as Connector, 'segments', segValues, true));
                connector.segments = segments.concat(connector.segments);
            }
        }
    }
    /**
     * Translate the bezier points during the interaction
     */
    private translateBezierPoints(
        connector: ConnectorModel, value: string, tx: number, ty: number, seg: BezierSegmentModel, point?: PointModel,
        update?: boolean):
        void {
        let index: number = (connector.segments.indexOf(seg));
        let segment: BezierSegment = connector.segments[index] as BezierSegment;
        if (segment) {
            if (value === 'BezierSourceThumb' && (segment.vector1.angle || segment.vector1.distance)) {
                segment.vector1 = {
                    distance: (connector as Connector).distance(connector.sourcePoint, point),
                    angle: Point.findAngle(connector.sourcePoint, point),
                };
            } else if (value === 'BezierTargetThumb' && (segment.vector2.angle || segment.vector2.distance)) {
                segment.vector2 = {
                    distance: (connector as Connector).distance(connector.targetPoint, point),
                    angle: Point.findAngle(connector.targetPoint, point),
                };
            } else if ((value === 'ConnectorSourceEnd' && !connector.sourceID || value === 'ConnectorTargetEnd' && !connector.targetID)
                && update && isEmptyVector(segment.vector1) && isEmptyVector(segment.vector2)) {
                if (Point.isEmptyPoint(segment.point1)) {
                    segment.bezierPoint1 = getBezierPoints(connector.sourcePoint, connector.targetPoint);
                }
                if (Point.isEmptyPoint(segment.point2)) {
                    segment.bezierPoint2 = getBezierPoints(connector.targetPoint, connector.sourcePoint);
                }
            } else if (value === 'BezierSourceThumb' || (value === 'ConnectorSourceEnd' && !update && isEmptyVector(segment.vector1))) {
                segment.bezierPoint1.x += tx;
                segment.bezierPoint1.y += ty;
                if ((!Point.isEmptyPoint(segment.point1)) || (update)) {
                    segment.point1 = { x: segment.bezierPoint1.x, y: segment.bezierPoint1.y };
                }
            } else if (value === 'BezierTargetThumb' || (value === 'ConnectorTargetEnd' && !update && isEmptyVector(segment.vector2))) {
                segment.bezierPoint2.x += tx;
                segment.bezierPoint2.y += ty;
                if ((!Point.isEmptyPoint(segment.point2)) || (update)) {
                    segment.point2 = { x: segment.bezierPoint2.x, y: segment.bezierPoint2.y };
                }
            }
        }
    }


    /** @private */
    public dragTargetEnd(
        obj: ConnectorModel, tx: number, ty: number, preventUpdate?: boolean, point?: PointModel, endPoint?: string,
        update?: boolean, segment?: OrthogonalSegmentModel | BezierSegmentModel | StraightSegmentModel):
        boolean {
        let connector: ConnectorModel = this.diagram.nameTable[obj.id];
        let boundaryConstraints: boolean = this.checkBoundaryConstraints(tx, ty, connector.wrapper.bounds);
        if (canDragTargetEnd(connector as Connector) && endPoint !== 'BezierTargetThumb'
            && boundaryConstraints && canPageEditable(this.diagram)) {
            connector.targetPoint.x += tx;
            connector.targetPoint.y += ty;
            if (endPoint === 'ConnectorTargetEnd' && connector.type === 'Orthogonal' &&
                connector.segments && connector.segments.length > 0) {
                let prev: OrthogonalSegment = connector.segments[connector.segments.length - 2] as OrthogonalSegment;
                if (prev && (connector.segments[connector.segments.length - 1] as OrthogonalSegment).points.length === 2) {
                    if (prev.direction === 'Left' || prev.direction === 'Right') {
                        prev.points[prev.points.length - 1].x = connector.targetPoint.x;
                    } else {
                        prev.points[prev.points.length - 1].y = connector.targetPoint.y;
                    }
                    prev.length = Point.distancePoints(prev.points[0], prev.points[prev.points.length - 1]);
                    prev.direction = Point.direction(prev.points[0], prev.points[prev.points.length - 1]) as Direction;
                }
            }
        }
        if (connector.type === 'Bezier') {
            if (segment) {
                this.translateBezierPoints(obj, (endPoint === '') ? 'ConnectorTargetEnd' : endPoint, tx, ty, segment, point, !update);
            } else {
                for (let i: number = 0; i < obj.segments.length; i++) {
                    this.translateBezierPoints(
                        obj, (endPoint === '') ? 'ConnectorTargetEnd' : endPoint, tx, ty, obj.segments[i], point, !update);
                }
            }
        }
        if (!preventUpdate) {
            this.updateEndPoint(connector as Connector);
        }
        return boundaryConstraints;
    }

    /** @private */
    public dragControlPoint(obj: ConnectorModel, tx: number, ty: number, preventUpdate?: boolean, segmentNumber?: number): boolean {
        let connector: ConnectorModel = this.diagram.nameTable[obj.id];
        if ((connector.type === 'Straight' || connector.type === 'Bezier') && connector.segments.length > 0) {
            if (segmentNumber !== undefined && connector.segments[segmentNumber]) {
                (connector.segments[segmentNumber] as StraightSegmentModel).point.x += tx;
                (connector.segments[segmentNumber] as StraightSegmentModel).point.y += ty;
            } else {
                for (let i: number = 0; i < connector.segments.length - 1; i++) {
                    (connector.segments[i] as StraightSegmentModel).point.x += tx;
                    (connector.segments[i] as StraightSegmentModel).point.y += ty;
                }
            }
            if (!preventUpdate) {
                this.updateEndPoint(connector as Connector);
            }
        }
        return true;
    }

    /** @private */
    public rotateObjects(
        parent: NodeModel | SelectorModel, objects: (NodeModel | ConnectorModel)[], angle: number, pivot?: PointModel,
        includeParent?: boolean): void {
        pivot = pivot || {};
        let matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, angle, pivot.x, pivot.y);
        for (let obj of objects) {
            if (obj instanceof Node) {
                if (canRotate(obj) && canPageEditable(this.diagram)) {
                    if (includeParent !== false || parent !== obj) {
                        obj.rotateAngle += angle;
                        obj.rotateAngle = (obj.rotateAngle + 360) % 360;
                        let newOffset: PointModel = transformPointByMatrix(matrix, { x: obj.offsetX, y: obj.offsetY });
                        obj.offsetX = newOffset.x;
                        obj.offsetY = newOffset.y;
                        this.diagram.nodePropertyChange(
                            obj as Node, {} as Node,
                            { offsetX: obj.offsetX, offsetY: obj.offsetY, rotateAngle: obj.rotateAngle } as Node);
                    }
                    if (obj.processId) {
                        let parent: NodeModel = this.diagram.nameTable[obj.processId];
                        let bound: Rect = this.diagram.bpmnModule.getChildrenBound(parent, obj.id, this.diagram);
                        this.diagram.bpmnModule.updateSubProcessess(bound, obj, this.diagram);
                    }
                    if (obj.children && obj.children.length) {
                        this.getChildren(obj, objects);
                    }
                }
            } else {
                this.rotatePoints(obj as Connector, angle, pivot || { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY });
            }
            this.diagram.updateDiagramObject(obj);
        }
        this.diagram.updateSelector();
    }

    /** @private */
    public snapConnectorEnd(currentPosition: PointModel): PointModel {
        if ((this.diagram.snapSettings.constraints & SnapConstraints.SnapToLines)
            && this.snappingModule) {
            this.diagram.snappingModule.snapConnectorEnd(currentPosition);
        }
        return currentPosition;

    }

    /**   @private  */
    public snapAngle(angle: number): number {
        if ((this.diagram.snapSettings.constraints & SnapConstraints.SnapToLines)
            && this.snappingModule) {
            return this.snappingModule.snapAngle(this.diagram, angle);
        } else {
            return 0;
        }
    }

    /**   @private  */
    public rotatePoints(conn: Connector, angle: number, pivot: PointModel): void {
        if (!conn.sourceWrapper || !conn.targetWrapper) {
            let matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, angle, pivot.x, pivot.y);
            conn.sourcePoint = transformPointByMatrix(matrix, conn.sourcePoint);
            conn.targetPoint = transformPointByMatrix(matrix, conn.targetPoint);
            let newProp: Connector = { sourcePoint: conn.sourcePoint, targetPoint: conn.targetPoint } as Connector;
            this.diagram.connectorPropertyChange(conn as Connector, {} as Connector, newProp);
        }
    }

    private updateInnerParentProperties(tempNode: NodeModel): void {
        let elements: (NodeModel | ConnectorModel)[] = [];
        let protect: string = 'isProtectedOnChange';
        let protectChange: boolean = this.diagram[protect];
        this.diagram.protectPropertyChange(true);
        let innerParents: (NodeModel | ConnectorModel)[] = this.getAllDescendants(tempNode, elements, false, true);
        for (let i: number = 0; i < innerParents.length; i++) {
            let obj: NodeModel = this.diagram.nameTable[innerParents[i].id];
            obj.offsetX = obj.wrapper.offsetX;
            obj.offsetY = obj.wrapper.offsetY;
            obj.width = obj.wrapper.width;
            obj.height = obj.wrapper.height;
        }
        this.diagram.protectPropertyChange(protectChange);
    }

    /** @private */
    public scale(obj: NodeModel | ConnectorModel, sw: number, sh: number, pivot: PointModel, refObject?: IElement): boolean {
        let node: IElement = this.diagram.nameTable[obj.id];
        let tempNode: Node = node as Node;
        let elements: (NodeModel | ConnectorModel)[] = [];
        let element: DiagramElement = node.wrapper;
        if (!refObject) { refObject = obj as IElement; }
        let refWrapper: Container = refObject.wrapper;
        let x: number = refWrapper.offsetX - refWrapper.actualSize.width * refWrapper.pivot.x;
        let y: number = refWrapper.offsetY - refWrapper.actualSize.height * refWrapper.pivot.y;
        let refPoint: PointModel = getPoint(
            x, y, refWrapper.actualSize.width, refWrapper.actualSize.height,
            refWrapper.rotateAngle, refWrapper.offsetX, refWrapper.offsetY, pivot);
        if (element.actualSize.width !== undefined && element.actualSize.height !== undefined && canPageEditable(this.diagram)) {
            if (tempNode.children) {
                let nodes: (NodeModel | ConnectorModel)[] = this.getAllDescendants(tempNode, elements);
                for (let temp of nodes) {
                    this.scaleObject(sw, sh, refPoint, temp as IElement, element, refObject);
                }
                obj.wrapper.measure(new Size());
                obj.wrapper.arrange(obj.wrapper.desiredSize);
                this.diagram.updateGroupOffset(node);
                this.updateInnerParentProperties(tempNode);
            } else {
                this.scaleObject(sw, sh, refPoint, node, element, refObject);
            }
            let bounds: Rect = getBounds(obj.wrapper);
            let checkBoundaryConstraints: boolean = this.checkBoundaryConstraints(undefined, undefined, bounds);
            if (!checkBoundaryConstraints) {
                this.scale(obj, 1 / sw, 1 / sh, pivot);
                return false;
            }
            this.diagram.updateDiagramObject(obj);
        }
        return true;
    }


    /** @private */
    public getAllDescendants(
        node: NodeModel, nodes: (NodeModel | ConnectorModel)[],
        includeParent?: boolean, innerParent?: boolean): (NodeModel | ConnectorModel)[] {
        let temp: NodeModel = node; let parentNodes: NodeModel[] = [];
        for (let i: number = 0; i < temp.children.length; i++) {
            node = (this.diagram.nameTable[temp.children[i]]);
            if (node) {
                if (!node.children) {
                    nodes.push(node);
                } else {
                    if (includeParent) {
                        nodes.push(node);
                    }
                    if (innerParent) {
                        parentNodes.push(node);
                    }
                    nodes = this.getAllDescendants(node, nodes);
                }
            }
        }
        return (innerParent) ? parentNodes : nodes;
    }

    /**   @private  */
    public getChildren(node: NodeModel, nodes: (NodeModel | ConnectorModel)[]): (NodeModel | ConnectorModel)[] {
        let temp: NodeModel = node;
        if (node.children) {
            for (let i: number = 0; i < temp.children.length; i++) {
                node = (this.diagram.nameTable[temp.children[i]]);
                nodes.push(node);
            }
        }
        return nodes;
    }

    /** @private */
    public cloneChild(id: string): NodeModel {
        let node: NodeModel = this.diagram.nameTable[id];
        return node;
    }

    /** @private */
    public scaleObject(sw: number, sh: number, pivot: PointModel, obj: IElement, element: DiagramElement, refObject: IElement): void {
        sw = sw < 0 ? 1 : sw; sh = sh < 0 ? 1 : sh; let process: string[];
        let oldValues: NodeModel = {
            offsetX: obj.wrapper.offsetX, offsetY: obj.wrapper.offsetY,
            width: obj.wrapper.actualSize.width, height: obj.wrapper.actualSize.height
        };
        if (sw !== 1 || sh !== 1) {
            let width: number; let height: number;
            if (obj instanceof Node) {
                let node: Node = obj; let isResize: boolean; let bound: Rect;
                if (node.shape.type === 'Bpmn' && (node.shape as BpmnShape).activity.subProcess.processes
                    && (node.shape as BpmnShape).activity.subProcess.processes.length > 0) {
                    bound = this.diagram.bpmnModule.getChildrenBound(node, node.id, this.diagram);
                    isResize = node.wrapper.bounds.containsRect(bound);
                }
                width = node.wrapper.actualSize.width * sw; height = node.wrapper.actualSize.height * sh;
                if (node.maxWidth !== undefined && node.maxWidth !== 0) {
                    width = Math.min(node.maxWidth, width);
                }
                if (node.minWidth !== undefined && node.minWidth !== 0) {
                    width = Math.max(node.minWidth, width);
                }
                if (node.maxHeight !== undefined && node.maxHeight !== 0) {
                    height = Math.min(node.maxHeight, height);
                }
                if (node.minHeight !== undefined && node.minHeight !== 0) {
                    height = Math.max(node.minHeight, height);
                }
                if (isResize) {
                    width = Math.max(width, (bound.right - node.wrapper.bounds.x));
                    height = Math.max(height, (bound.bottom - node.wrapper.bounds.y));
                }
                sw = width / node.actualSize.width; sh = height / node.actualSize.height;
            }
            let matrix: Matrix = identityMatrix(); let refWrapper: DiagramElement;
            if (!refObject) { refObject = obj; }
            refWrapper = refObject.wrapper;
            rotateMatrix(matrix, -refWrapper.rotateAngle, pivot.x, pivot.y);
            scaleMatrix(matrix, sw, sh, pivot.x, pivot.y);
            rotateMatrix(matrix, refWrapper.rotateAngle, pivot.x, pivot.y);
            if (obj instanceof Node) {
                let node: Node = obj; let left: number; let top: number;
                let newPosition: PointModel = transformPointByMatrix(matrix, { x: node.wrapper.offsetX, y: node.wrapper.offsetY });
                let oldleft: number = node.wrapper.offsetX - node.wrapper.actualSize.width * node.pivot.x;
                let oldtop: number = node.wrapper.offsetY - node.wrapper.actualSize.height * node.pivot.y;
                if (width > 0) {
                    if (node.processId) {
                        let parent: Node = this.diagram.nameTable[node.processId];
                        if (!parent.maxWidth || ((node.margin.left + width) < parent.maxWidth)) {
                            node.width = width; node.offsetX = newPosition.x;
                        }
                    } else {
                        node.width = width; node.offsetX = newPosition.x;
                    }
                }
                if (height > 0) {
                    if (node.processId) {
                        let parent: Node = this.diagram.nameTable[node.processId];
                        if (!parent.maxHeight || ((node.margin.top + height) < parent.maxHeight)) {
                            node.height = height; node.offsetY = newPosition.y;
                        }
                    } else {
                        node.height = height; node.offsetY = newPosition.y;
                    }
                }
                left = node.wrapper.offsetX - node.wrapper.actualSize.width * node.pivot.x;
                top = node.wrapper.offsetY - node.wrapper.actualSize.height * node.pivot.y;
                let parent: NodeModel = this.diagram.nameTable[node.processId];
                if (parent && ((node.margin.top + (top - oldtop)) <= 0 ||
                    (node.margin.left + (left - oldleft) <= 0))) {
                    this.diagram.nodePropertyChange(obj as Node, {} as Node, {
                        margin: { top: node.margin.top, left: node.margin.left }
                    } as Node);
                } else {
                    this.diagram.nodePropertyChange(obj as Node, {} as Node, {
                        width: node.width, height: node.height, offsetX: node.offsetX,
                        offsetY: node.offsetY, margin: { top: node.margin.top + (top - oldtop), left: node.margin.left + (left - oldleft) }
                    } as Node);
                }
            } else {
                let connector: Connector = obj as Connector;
                if (!connector.sourceWrapper || !connector.targetWrapper) {
                    connector.sourcePoint = transformPointByMatrix(matrix, connector.sourcePoint);
                    connector.targetPoint = transformPointByMatrix(matrix, connector.targetPoint);
                    let newProp: Connector = { sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint } as Connector;
                    this.diagram.connectorPropertyChange(connector, {} as Connector, newProp);
                }
            }
            let parentNode: NodeModel = this.diagram.nameTable[(obj as Node).processId];
            if (parentNode) {
                let parent: Rect = parentNode.wrapper.bounds; let child: Rect = (obj as Node).wrapper.bounds;
                let bound: Rect = this.diagram.bpmnModule.getChildrenBound(parentNode, (obj as Node).id, this.diagram);
                this.diagram.bpmnModule.updateSubProcessess(bound, (obj as Node), this.diagram);
            }
        }
    }

    /** @private */
    public portDrag(
        obj: NodeModel | ConnectorModel, portElement: DiagramElement, tx: number, ty: number): void {
        let oldValues: Object; let changedvalues: Object;
        let port: PointPortModel = this.findTarget(portElement, obj as IElement) as PointPortModel;
        let bounds: Rect = getBounds(obj.wrapper);
        if (port && canDrag(port, this.diagram)) {
            oldValues = this.getPortChanges(obj, port as PointPort);
            port.offset.x += (tx / bounds.width);
            port.offset.y += (ty / bounds.height);
            changedvalues = this.getPortChanges(obj, port as PointPort);
            this.diagram.nodePropertyChange(obj as Node, oldValues as Node, changedvalues as Node);
            this.diagram.updateDiagramObject(obj);
        }
    }

    /** @private */
    public labelDrag(
        obj: NodeModel | ConnectorModel, textElement: DiagramElement, tx: number, ty: number): void {
        let oldValues: Object; let changedvalues: Object;
        let label: ShapeAnnotationModel | PathAnnotationModel;
        label = this.findTarget(textElement, obj as IElement) as ShapeAnnotationModel | PathAnnotationModel;
        let bounds: Rect = cornersPointsBeforeRotation(obj.wrapper);
        oldValues = this.getAnnotationChanges(obj, label as ShapeAnnotation | PathAnnotation);
        if (label instanceof ShapeAnnotation) {
            label.offset.x += (tx / bounds.width);
            label.offset.y += (ty / bounds.height);
        } else {
            this.updatePathAnnotationOffset(obj as Connector, label as PathAnnotation, tx, ty);
            if (label instanceof PathAnnotation) { label.alignment = 'Center'; }
        }
        changedvalues = this.getAnnotationChanges(obj, label as ShapeAnnotation | PathAnnotation);
        if (obj instanceof Node) {
            this.diagram.nodePropertyChange(obj as Node, oldValues as Node, changedvalues as Node);
        } else {
            this.diagram.connectorPropertyChange(obj as Connector, oldValues as Connector, changedvalues as Connector);
        }
        this.diagram.updateDiagramObject(obj);
        if (!isSelected(this.diagram, label, false, textElement)) {
            this.labelSelect(obj, textElement);
        }
    }

    private updatePathAnnotationOffset(
        object: Connector, label: PathAnnotation, tx: number, ty: number, newPosition?: PointModel, size?: Size): void {
        let textWrapper: DiagramElement = this.diagram.getWrapper(object.wrapper, label.id);
        let offsetX: number = textWrapper.offsetX;
        let offsetY: number = textWrapper.offsetY; let offset: PointModel;
        let intermediatePoints: PointModel[] = object.intermediatePoints;
        let prev: PointModel; let pointLength: number = 0; let totalLength: number = 0;
        let intersectingOffset: PointModel;
        let currentPosition: PointModel = (newPosition) ? newPosition : { x: offsetX + tx, y: offsetY + ty };
        let intersetingPts: PointModel[] = this.getInterceptWithSegment(currentPosition, intermediatePoints);
        let newOffset: PointModel = intermediatePoints[intermediatePoints.length - 1];
        totalLength = Point.getLengthFromListOfPoints(intermediatePoints);
        if (intersetingPts.length > 0) {
            intersectingOffset = intersetingPts[intersetingPts.length - 1];
            newOffset = intersectingOffset;
            if (newOffset) {
                let p: number; let bounds: Rect;
                for (p = 0; p < intermediatePoints.length; p++) {
                    if (prev != null) {
                        bounds = Rect.toBounds([prev, intermediatePoints[p]]);
                        if (bounds.containsPoint(newOffset)) {
                            pointLength += Point.findLength(prev, newOffset);
                            break;
                        }
                    }
                    prev = intermediatePoints[p];
                }
                offset = { x: pointLength / totalLength, y: 0 };
            }
            this.updateLabelMargin(object, label, offset, currentPosition, size);
        } else {
            this.updateLabelMargin(object, label, null, currentPosition, size);
        }
    }


    private updateLabelMargin(node: Connector, label: PathAnnotation, offset: PointModel, tempPt: PointModel, size?: Size): void {
        offset = offset ? offset : { x: label.offset, y: 0 };
        if (label && offset && offset.x > 0 && offset.x < 1) {
            let point: PointModel;
            let length: number = Point.getLengthFromListOfPoints(node.intermediatePoints);
            point = this.getPointAtLength(length * offset.x, node.intermediatePoints, 0);
            label.margin = { left: tempPt.x - point.x, top: tempPt.y - point.y, right: 0, bottom: 0 };
            label.offset = offset.x;
            if (size) {
                label.width = size.width;
                label.height = size.height;
            }
        }
    }
    private getPointAtLength(length: number, points: PointModel[], angle: number): PointModel {
        angle = 0;
        let run: number = 0; let pre: PointModel; let found: PointModel = { x: 0, y: 0 };
        let pt: PointModel;
        for (let i: number = 0; i < points.length; i++) {
            pt = points[i];
            if (!pre) {
                pre = pt;
                continue;
            } else {
                let l: number = Point.findLength(pre, pt);
                let r: number; let deg: number; let x: number; let y: number;
                if (run + l >= length) {
                    r = length - run;
                    deg = Point.findAngle(pre, pt);
                    x = r * Math.cos(deg * Math.PI / 180);
                    y = r * Math.sin(deg * Math.PI / 180);
                    found = { x: pre.x + x, y: pre.y + y };
                    angle = deg;
                    break;
                } else {
                    run += l;
                }
            }
            pre = pt;
        }
        return found;
    }

    private getInterceptWithSegment(currentPosition: PointModel, conPoints: PointModel[]): PointModel[] {
        let intercepts: PointModel[] = []; let imgLine: PointModel[] = []; let segemnt: PointModel[] = [];
        let tarAngle: number; let srcAngle: number; let maxLength: number;
        maxLength = Point.findLength({ x: 0, y: 0 }, { x: this.diagram.scroller.viewPortWidth, y: this.diagram.scroller.viewPortHeight });
        for (let i: number = 1; i < conPoints.length; i++) {
            segemnt = [conPoints[i - 1], conPoints[i]];
            imgLine = [];
            srcAngle = Math.round(Point.findAngle(segemnt[0], segemnt[1]) % 360);
            tarAngle = Math.round(Point.findAngle(segemnt[1], segemnt[0]) % 360);
            let angleAdd: number = (srcAngle > 0 && srcAngle <= 90) || (srcAngle > 180 && srcAngle <= 270) ? 90 : -90;
            imgLine.push(Point.transform(currentPosition, srcAngle + angleAdd, maxLength));
            imgLine.push(Point.transform(currentPosition, tarAngle + angleAdd, maxLength));
            let lineUtil1: Segment = { x1: segemnt[0].x, y1: segemnt[0].y, x2: segemnt[1].x, y2: segemnt[1].y };
            let lineUtil2: Segment = { x1: imgLine[0].x, y1: imgLine[0].y, x2: imgLine[1].x, y2: imgLine[1].y };
            let line3: Intersection = intersect3(lineUtil1, lineUtil2);
            if (line3.enabled) {
                intercepts.push(line3.intersectPt);
            }
        }
        return intercepts;
    }
    /** @private */
    public getAnnotationChanges(object: NodeModel | ConnectorModel, label: ShapeAnnotation | PathAnnotation): Object {
        let index: string = findObjectIndex(object as NodeModel, label.id, true);
        let annotations: Object = {};
        annotations[index] = {
            width: label.width, height: label.height, offset: (object instanceof Node) ? ({
                x: (label as ShapeAnnotationModel).offset.x,
                y: (label as ShapeAnnotationModel).offset.y
            }) : (label as PathAnnotationModel).offset,
            rotateAngle: label.rotateAngle,
            margin: { left: label.margin.left, right: label.margin.right, top: label.margin.top, bottom: label.margin.bottom },
            horizontalAlignment: label.horizontalAlignment, verticalAlignment: label.verticalAlignment,
            alignment: ((object instanceof Connector) ? (label as PathAnnotation).alignment : undefined)
        };
        return { annotations: annotations };
    }

    /** @private */
    public getPortChanges(object: NodeModel | ConnectorModel, port: PointPort): Object {
        let index: string = findObjectIndex(object as NodeModel, port.id, false);
        let ports: Object = {};
        ports[index] = { offset: port.offset };
        return { ports: ports };
    }

    /** @private */
    public labelRotate(
        object: NodeModel | ConnectorModel, label: ShapeAnnotation | PathAnnotation,
        currentPosition: PointModel, selector: Selector): void {
        let oldValues: Object; let changedvalues: Object;
        oldValues = this.getAnnotationChanges(object, label);
        let matrix: Matrix = identityMatrix();
        let rotateAngle: number = (label as ShapeAnnotation).rotateAngle;
        let labelWrapper: DiagramElement = this.diagram.getWrapper(object.wrapper, label.id);
        let angle: number = findAngle({ x: labelWrapper.offsetX, y: labelWrapper.offsetY }, currentPosition) + 90;
        let snapAngle: number = this.snapAngle(angle);
        angle = snapAngle !== 0 ? snapAngle : angle;
        if (label instanceof PathAnnotation && label.segmentAngle) {
            let getPointloop: SegmentInfo = getAnnotationPosition(
                (object as Connector).intermediatePoints, label as PathAnnotation, (object as Connector).wrapper.bounds);
            angle -= getPointloop.angle;
        }
        angle = (angle + 360) % 360;
        label.rotateAngle += angle - (label.rotateAngle + labelWrapper.parentTransform);
        label.margin.bottom += (labelWrapper.verticalAlignment === 'Top') ? (-label.height / 2) : (
            (labelWrapper.verticalAlignment === 'Bottom') ? (label.height / 2) : 0);
        label.margin.right += (labelWrapper.horizontalAlignment === 'Left') ? (-label.width / 2) : (
            (labelWrapper.horizontalAlignment === 'Right') ? (label.width / 2) : 0);
        if (label instanceof PathAnnotation) {
            label.alignment = 'Center';
        } else {
            label.horizontalAlignment = label.verticalAlignment = 'Center';
        }
        selector.wrapper.rotateAngle = selector.rotateAngle = label.rotateAngle;
        changedvalues = this.getAnnotationChanges(object, label);
        if (object instanceof Node) {
            this.diagram.nodePropertyChange(object as Node, oldValues as Node, changedvalues as Node);
        } else {
            this.diagram.connectorPropertyChange(object as Connector, oldValues as Connector, changedvalues as Connector);
        }
        this.diagram.updateDiagramObject(object);
    }
    /** @private */
    public labelResize(
        node: NodeModel | ConnectorModel, label: ShapeAnnotation | PathAnnotationModel, deltaWidth: number, deltaHeight: number,
        pivot: PointModel, selector: Selector): void {
        let oldValues: Object; let changedvalues: Object; let rotateAngle: number;
        oldValues = this.getAnnotationChanges(node, label as ShapeAnnotation | PathAnnotation);
        let textElement: DiagramElement = selector.wrapper.children[0];
        if ((deltaWidth && deltaWidth !== 1) || (deltaHeight && deltaHeight !== 1)) {
            let newMat: Matrix = identityMatrix(); let matrix: Matrix = identityMatrix();
            rotateMatrix(newMat, -(node as NodeModel).rotateAngle, (node as NodeModel).offsetX, (node as NodeModel).offsetY);
            rotateAngle = ((textElement.rotateAngle + ((node instanceof Node) ? (node as NodeModel).rotateAngle : 0)) + 360) % 360;
            rotateMatrix(matrix, -rotateAngle, pivot.x, pivot.y);
            scaleMatrix(matrix, deltaWidth, deltaHeight, pivot.x, pivot.y);
            rotateMatrix(matrix, rotateAngle, pivot.x, pivot.y);
            let newPosition: PointModel = transformPointByMatrix(matrix, { x: textElement.offsetX, y: textElement.offsetY });
            let height: number = textElement.actualSize.height * deltaHeight;
            let width: number = textElement.actualSize.width * deltaWidth;
            let shape: ShapeAnnotationModel | PathAnnotationModel = this.findTarget(textElement, node as IElement) as ShapeAnnotation;
            if (shape instanceof PathAnnotation) {
                this.updatePathAnnotationOffset(node as Connector, label as PathAnnotation, 0, 0, newPosition, new Size(width, height));
            } else {
                let bounds: Rect = cornersPointsBeforeRotation(node.wrapper);
                newPosition = transformPointByMatrix(newMat, newPosition);
                newPosition.x = newPosition.x - textElement.margin.left + textElement.margin.right;
                newPosition.y = newPosition.y - textElement.margin.top + textElement.margin.bottom;

                newPosition.y += (shape.verticalAlignment === 'Top') ? (-height / 2) : (
                    (shape.verticalAlignment === 'Bottom') ? (height / 2) : 0);
                newPosition.x += (shape.horizontalAlignment === 'Left') ? (-width / 2) : (
                    (shape.horizontalAlignment === 'Right') ? (width / 2) : 0);
                let offsetx: number = bounds.width / (newPosition.x - bounds.x);
                let offsety: number = bounds.height / (newPosition.y - bounds.y);
                if (width > 1) {
                    shape.width = width;
                    shape.offset.x = 1 / offsetx;
                }
                if (height > 1) {
                    shape.height = height;
                    shape.offset.y = 1 / offsety;
                }
            }
        }
        if (label instanceof PathAnnotation) { label.alignment = 'Center'; }
        changedvalues = this.getAnnotationChanges(node, label as ShapeAnnotation | PathAnnotation);
        if (node instanceof Node) {
            this.diagram.nodePropertyChange(node as Node, oldValues as Node, changedvalues as Node);
        } else {
            this.diagram.connectorPropertyChange(node as Connector, oldValues as Connector, changedvalues as Connector);
        }
        this.diagram.updateDiagramObject(node);
    }

    /** @private */
    public getSubProcess(source: IElement): SelectorModel {
        let selector: SelectorModel = { nodes: [], connectors: [] };
        let process: string;
        if (source instanceof Node) {
            process = source.processId;
        } else if (source && (source as SelectorModel).nodes && ((source as SelectorModel).nodes.length)
            && ((source as SelectorModel).nodes[0] as Node).processId) {
            process = ((source as SelectorModel).nodes[0] as Node).processId;
        }
        if (process) {
            selector.nodes.push(clone(this.diagram.nameTable[process]));
            return selector;
        }
        return selector;
    }

    /**   @private  */
    public checkBoundaryConstraints(tx: number, ty: number, nodeBounds?: Rect): boolean {
        let pageSettings: PageSettings = this.diagram.pageSettings as PageSettings;
        let boundaryConstraints: BoundaryConstraints = (this.diagram.pageSettings as PageSettings).boundaryConstraints;
        let scroller: DiagramScroller = this.diagram.scroller;
        if (boundaryConstraints === 'Page' || boundaryConstraints === 'Diagram') {
            let selectorBounds: Rect = !nodeBounds ? this.diagram.selectedItems.wrapper.bounds : undefined;
            let width: number = boundaryConstraints === 'Page' ? pageSettings.width : scroller.viewPortWidth;
            let height: number = boundaryConstraints === 'Page' ? pageSettings.height : scroller.viewPortHeight;
            let bounds: Rect = nodeBounds;
            let right: number = (nodeBounds ? bounds.right : selectorBounds.right) + (tx || 0);
            let left: number = (nodeBounds ? bounds.left : selectorBounds.left) + (tx || 0);
            let top: number = (nodeBounds ? bounds.top : selectorBounds.top) + (ty || 0);
            let bottom: number = (nodeBounds ? bounds.bottom : selectorBounds.bottom) + (ty || 0);
            if (right <= width && left >= 0
                && bottom <= height && top >= 0) {
                return true;
            }
            return false;
        }
        return true;
    }

    //interfaces
    /** @private */
    public dragSelectedObjects(tx: number, ty: number): boolean {
        let obj: SelectorModel = this.diagram.selectedItems;
        if (this.state && !this.state.backup) {
            this.state.backup = {};
            this.state.backup.offsetX = obj.offsetX;
            this.state.backup.offsetY = obj.offsetY;
        }
        if (this.checkBoundaryConstraints(tx, ty)) {
            this.diagram.drag(obj, tx, ty);
            return true;
        }
        return false;
    }
    /** @private */
    public scaleSelectedItems(sx: number, sy: number, pivot: PointModel): boolean {
        let obj: SelectorModel = this.diagram.selectedItems;
        if (this.state && !this.state.backup) {
            this.state.backup = {};
            this.state.backup.offsetX = obj.offsetX;
            this.state.backup.offsetY = obj.offsetY;
            this.state.backup.width = obj.width;
            this.state.backup.height = obj.height;
            this.state.backup.pivot = pivot;
        }
        return this.diagram.scale(obj, sx, sy, pivot);
    }
    /** @private */
    public rotateSelectedItems(angle: number): boolean {
        let obj: SelectorModel = this.diagram.selectedItems;
        if (this.state && !this.state.backup) {
            this.state.backup = {};
            this.state.backup.angle = obj.rotateAngle;
        }
        return this.diagram.rotate(obj, angle);
    }
    /** @private */
    public hasSelection(): boolean {
        return hasSelection(this.diagram);
    }
    /** @private */
    public isSelected(element: IElement): boolean {
        return isSelected(this.diagram, element);
    }

    /**
     * initExpand is used for layout expand and collapse interaction
     */
    public initExpand(args: MouseEventArgs): void {
        let node: Node = (args.target || args.source) as Node;
        let oldValues: Node = { isExpanded: node.isExpanded } as Node;
        node.isExpanded = !node.isExpanded;
        this.diagram.nodePropertyChange(node, oldValues, { isExpanded: node.isExpanded } as Node);
    }

    /** @private */
    public expandNode(node: Node, diagram?: Diagram): ILayout {
        let animation: boolean;
        let objects: ILayout;
        let expand: boolean = node.isExpanded;
        this.expandCollapse(node, expand, this.diagram);
        node.isExpanded = expand;
        this.diagram.layout.fixedNode = node.id;
        if (this.diagram.layoutAnimateModule && this.diagram.layout.enableAnimation) {
            this.diagram.organizationalChartModule.isAnimation = true;
        }
        this.diagram.preventNodesUpdate = true;
        this.diagram.preventConnectorsUpdate = true;
        objects = this.diagram.doLayout();
        this.diagram.preventNodesUpdate = false;
        this.diagram.preventConnectorsUpdate = false;

        if (this.diagram.layoutAnimateModule && this.diagram.layout.enableAnimation) {
            this.layoutAnimateModule.expand(this.diagram.organizationalChartModule.isAnimation, objects, node, this.diagram);
        }
        return objects;
    }
    /**
     * Setinterval and Clear interval for layout animation 
     */
    /** @private */
    public expandCollapse(source: Node, visibility: boolean, diagram: Diagram): void {
        for (let i: number = 0; i < source.outEdges.length; i++) {
            let connector: ConnectorModel = diagram.nameTable[source.outEdges[i]];
            let target: Node = diagram.nameTable[connector.targetID];
            connector.visible = visibility;
            if (target.isExpanded) {
                this.expandCollapse(target, visibility, diagram);
            }
            let oldValues: (NodeModel | ConnectorModel) = {
                visible: target.visible,
                style: { opacity: target.style.opacity }
            };
            target.visible = visibility;
            target.style.opacity = (this.diagram.layoutAnimateModule &&
                this.diagram.layout.enableAnimation && visibility) ? 0.1 : target.style.opacity;
            let newValues: (NodeModel | ConnectorModel) = {
                visible: target.visible,
                style: { opacity: target.style.opacity }
            };
            diagram.nodePropertyChange(target as Node, oldValues as Node, newValues as Node);
            diagram.connectorPropertyChange(connector as Connector, oldValues as Connector, newValues as Connector);
        }
    }
    /**
     * @private
     */
    public updateNodeDimension(obj: Node | Connector, rect?: Rect): void {
        if (obj instanceof Node) {
            obj.offsetX = rect.x + rect.width / 2;
            obj.offsetY = rect.y + rect.height / 2;
            obj.width = rect.width;
            obj.height = rect.height;
            this.diagram.nodePropertyChange(obj as Node, {} as Node, {
                width: rect.width, height: rect.height, offsetX: obj.offsetX,
                offsetY: obj.offsetY
            } as Node);
            if (this.diagram.mode !== 'SVG') {
                this.diagram.refreshDiagramLayer();
            }
        }
    }
    /**
     * @private
     */
    public updateConnectorPoints(obj: Node | Connector, rect?: Rect): void {
        if (obj instanceof Connector) {
            this.diagram.connectorPropertyChange(obj as Connector, {} as Connector, {
                targetPoint: obj.targetPoint
            } as Connector);
            this.diagram.updateDiagramObject(obj);
        }
    }
    /** @private */
    public drawSelectionRectangle(x: number, y: number, width: number, height: number): void {
        this.diagram.drawSelectionRectangle(x, y, width, height);
    }

    /** @private */
    public startGroupAction(): void {
        this.diagram.startGroupAction();
    }
    /** @private */
    public endGroupAction(): void {
        this.diagram.endGroupAction();
    }
    /** @private */
    public removeChildFromBPmn(child: IElement, newTarget: IElement, oldTarget: IElement): void {
        let obj: Node = this.diagram.nameTable[(child as Node).id] || (child as SelectorModel).nodes[0];
        if (oldTarget) {
            if ((obj) && obj.processId && obj.processId === oldTarget.wrapper.id) {
                let node: Node = clone(obj) as Node;
                node.processId = obj.processId;
                this.diagram.startGroupAction();
                let edges: string[] = [];
                edges = edges.concat((obj as Node).outEdges, (obj as Node).inEdges);
                for (let i: number = edges.length - 1; i >= 0; i--) {
                    let connector: ConnectorModel = this.diagram.nameTable[edges[i]];
                    if (connector) {
                        this.diagram.remove(connector);
                    }
                }
                let nodeCollection: string[];
                nodeCollection = ((this.diagram.nameTable[obj.processId].shape as BpmnShape).activity.subProcess.processes) || [];
                nodeCollection.splice(nodeCollection.indexOf((obj).id), 1);
                this.diagram.bpmnModule.removeChildFromBPMN(this.diagram.nameTable[obj.processId].wrapper, (obj).id);
                this.diagram.nameTable[(obj).id].processId = '';
                obj.offsetX = obj.wrapper.offsetX;
                obj.offsetY = obj.wrapper.offsetY;
                let undoElement: NodeModel = clone(obj);
                let entry: HistoryEntry = {
                    type: 'PositionChanged', redoObject: { nodes: [undoElement] }, undoObject: { nodes: [node] }, category: 'Internal'
                };
                this.addHistoryEntry(entry);
                this.diagram.endGroupAction();
            }
        }
    }

    /** @private */
    public isDroppable(source: IElement, targetNodes: IElement): boolean {
        let node: Node = this.diagram.nameTable[(source as Node).id] || (source as SelectorModel).nodes[0];
        if ((node.shape as BpmnShape).shape === 'TextAnnotation') {
            return true;
        }
        if (node && node.shape.type === 'Bpmn') {
            if ((node.processId === (targetNodes as Node).id) || (node.id === (targetNodes as Node).processId) ||
                ((targetNodes as Node).shape as BpmnShape).activity.subProcess.collapsed) {
                return false;
            }
        }
        return true;
    }
    /**
     * @private
     */
    public renderHighlighter(args: MouseEventArgs, connectHighlighter?: boolean, source?: boolean): void {
        let bounds: Rect = new Rect();
        if (args.target instanceof Node || (connectHighlighter && args.source instanceof Node)) {
            let tgt: IElement = connectHighlighter ? args.source : args.target;
            let tgtWrap: DiagramElement = connectHighlighter ? args.sourceWrapper : args.targetWrapper;
            let target: NodeModel | PointPortModel = this.findTarget(tgtWrap, tgt, source, true) as (NodeModel | PointPortModel);
            let element: DiagramElement;
            if (target instanceof BpmnSubEvent) {
                let portId: string = target.id;
                let node: NodeModel = args.target;
                let parent: Canvas = ((node.wrapper.children[0] as Canvas).children[0] as Canvas).children[2] as Canvas;
                for (let child of parent.children) {
                    if (child.id === node.id + '_' + portId) {
                        element = (child as Canvas).children[0];
                        break;
                    }
                }
            } else {
                element = target instanceof Node ?
                    target.wrapper : connectHighlighter ? args.sourceWrapper : args.targetWrapper;
            }
            this.diagram.renderHighlighter(element);
        }
    }

    //additional events
    /** @private */
    public mouseOver(source: IElement, target: IElement, position: PointModel): boolean {
        //mouse over
        //returns whether the source can move over the target or not
        return true;
    }
    /**
     * @private
     */
    public snapPoint(startPoint: PointModel, endPoint: PointModel, tx: number, ty: number): PointModel {
        let obj: SelectorModel = this.diagram.selectedItems;
        let point: PointModel;
        let towardsLeft: boolean = endPoint.x < startPoint.x;
        let towardsTop: boolean = endPoint.y < startPoint.y;
        point = { x: tx, y: ty };
        let snappedPoint: PointModel = point;
        if (this.snappingModule) {
            snappedPoint = this.diagram.snappingModule.snapPoint(
                this.diagram, obj, towardsLeft, towardsTop, point, startPoint, endPoint);
        }
        return snappedPoint;
    }
    /**
     * @private
     */
    public removeSnap(): void {
        if ((this.diagram.snapSettings.constraints & SnapConstraints.SnapToObject) && this.snappingModule) {
            this.snappingModule.removeGuidelines(this.diagram);
        }
    }
    /** @private */
    public dropAnnotation(source: IElement, target: IElement): void {
        let node: Node = (source instanceof Node) ? source : (source as Selector).nodes[0] as Node;
        if (this.diagram.bpmnModule && (target as Node).shape.type === 'Bpmn'
            && (node.shape as BpmnShape).shape === 'TextAnnotation') {
            let hasTarget: string = 'hasTarget';
            node[hasTarget] = (target as Node).id;
            ((node.shape as BpmnShape).annotation as BpmnAnnotation).nodeId = (target as Node).id;
            if (!this.diagram.currentSymbol) {
                this.diagram.addTextAnnotation((node.shape as BpmnShape).annotation, target);
                ((node.shape as BpmnShape).annotation as BpmnAnnotation).nodeId = '';
                this.diagram.remove(node);
            }
            this.diagram.refreshDiagramLayer();
        }
    };
    /** @private */
    public drop(source: IElement, target: IElement, position: PointModel): void {
        //drop
        if (this.diagram.bpmnModule) {
            this.diagram.bpmnModule.dropBPMNchild(
                target as Node, (source instanceof Node) ? source : (source as Selector).nodes[0] as Node, this.diagram);
            this.diagram.refreshDiagramLayer();
        }
    }

    /** @private */
    public addHistoryEntry(entry: HistoryEntry): void {
        this.diagram.addHistoryEntry(entry);
    }
    /** @private */
    public align(objects: (NodeModel | ConnectorModel)[], option: AlignmentOptions, type: AlignmentMode): void {
        if (objects.length > 0) {
            let i: number = 0;
            let bounds: Rect = (type === 'Object') ? getBounds(objects[0].wrapper) : this.diagram.selectedItems.wrapper.bounds;
            let undoObj: SelectorModel = { nodes: [], connectors: [] };
            let redoObj: SelectorModel = { nodes: [], connectors: [] };
            for (i = ((type === 'Object') ? (i + 1) : i); i < objects.length; i++) {
                let tx: number = 0;
                let ty: number = 0;
                let objectBounds: Rect = getBounds(objects[i].wrapper);
                if (option === 'Left') {
                    tx = bounds.left + objectBounds.width / 2 - objectBounds.center.x;
                } else if (option === 'Right') {
                    tx = bounds.right - objectBounds.width / 2 - objectBounds.center.x;
                } else if (option === 'Top') {
                    ty = bounds.top + objectBounds.height / 2 - objectBounds.center.y;
                } else if (option === 'Bottom') {
                    ty = bounds.bottom - objectBounds.height / 2 - objectBounds.center.y;
                } else if (option === 'Center') {
                    tx = bounds.center.x - objectBounds.center.x;
                } else if (option === 'Middle') {
                    ty = bounds.center.y - objectBounds.center.y;
                }
                undoObj = this.storeObject(undoObj, objects[i]);
                this.drag(objects[i], tx, ty);
                this.diagram.updateSelector();
                redoObj = this.storeObject(redoObj, objects[i]);
            }
            undoObj = clone(undoObj) as SelectorModel;
            redoObj = clone(redoObj) as SelectorModel;
            let entry: HistoryEntry = {
                type: 'Align', category: 'Internal',
                undoObject: cloneObject(undoObj), redoObject: cloneObject(redoObj)
            };
            this.addHistoryEntry(entry);
        }
    }
    /** @private */
    public distribute(objects: (NodeModel | ConnectorModel)[], option: DistributeOptions): void {
        if (objects.length > 0) {
            let i: number = 0;
            let j: number = 0;
            let rect: Rect = new Rect();
            let b: Rect[] = [];
            let temp: NodeModel | ConnectorModel;
            let right: number = 0;
            let left: number = 0;
            let top: number = 0;
            let bottom: number = 0;
            let center: number = 0;
            let middle: number = 0;
            let btt: number = 0;
            let sum: number = 0;
            let undoSelectorObj: SelectorModel = { nodes: [], connectors: [] };
            let redoSelectorObj: SelectorModel = { nodes: [], connectors: [] };

            objects = sort(objects);
            for (i = 1; i < objects.length; i++) {
                right = right + (objects[i] as Node).wrapper.bounds.topRight.x - (objects[i - 1] as Node).wrapper.bounds.topRight.x;
                left = left + (objects[i] as Node).wrapper.bounds.topLeft.x - (objects[i - 1] as Node).wrapper.bounds.topLeft.x;
                top = top + (objects[i] as Node).wrapper.bounds.topRight.y - (objects[i - 1] as Node).wrapper.bounds.topRight.y;
                bottom = bottom + (objects[i] as Node).wrapper.bounds.bottomRight.y - (objects[i - 1] as Node).wrapper.bounds.bottomRight.y;
                center = center + (objects[i] as Node).wrapper.bounds.center.x - (objects[i - 1] as Node).wrapper.bounds.center.x;
                middle = middle + (objects[i] as Node).wrapper.bounds.center.y - (objects[i - 1] as Node).wrapper.bounds.center.y;
                btt = btt + (objects[i] as Node).wrapper.bounds.topRight.y - (objects[i - 1] as Node).wrapper.bounds.bottomRight.y;
            }
            for (i = 1; i < objects.length - 1; i++) {
                let tx: number = 0;
                let ty: number = 0;
                let prev: Rect = getBounds(objects[i - 1].wrapper);
                let current: Rect = getBounds(objects[i].wrapper);
                if (option === 'RightToLeft' || option === 'Center') {
                    tx = prev.center.x - current.center.x + (center / (objects.length - 1));
                } else if (option === 'Right') {
                    tx = prev.topRight.x - current.topRight.x + (right / (objects.length - 1));
                } else if (option === 'Left') {
                    tx = prev.topLeft.x - current.topLeft.x + (left / (objects.length - 1));
                } else if (option === 'Middle') {
                    ty = prev.center.y - current.center.y + (middle / (objects.length - 1));
                } else if (option === 'Top') {
                    ty = prev.topRight.y - current.topRight.y + (top / (objects.length - 1));
                } else if (option === 'Bottom') {
                    ty = prev.bottomRight.y - current.bottomRight.y + (bottom / (objects.length - 1));
                } else if (option === 'BottomToTop') {
                    ty = prev.bottomRight.y - current.topRight.y + (btt / (objects.length - 1));
                }

                undoSelectorObj = this.storeObject(undoSelectorObj, objects[i]);

                this.drag(objects[i], tx, ty);
                this.diagram.updateSelector();

                redoSelectorObj = this.storeObject(redoSelectorObj, objects[i]);
            }
            undoSelectorObj = clone(undoSelectorObj) as SelectorModel;
            redoSelectorObj = clone(redoSelectorObj) as SelectorModel;
            let entry: HistoryEntry = {
                type: 'Distribute', category: 'Internal',
                undoObject: cloneObject(undoSelectorObj), redoObject: cloneObject(redoSelectorObj)
            };
            this.addHistoryEntry(entry);
        }
    }
    /** @private */
    public sameSize(objects: (NodeModel | ConnectorModel)[], option: SizingOptions): void {
        if (objects.length > 0) {
            let i: number = 0;
            let pivot: PointModel;
            pivot = { x: 0.5, y: 0.5 };
            let bounds: Rect = getBounds(objects[0].wrapper);
            let undoObject: SelectorModel = { nodes: [], connectors: [] };
            let redoObject: SelectorModel = { nodes: [], connectors: [] };
            for (i = 1; i < objects.length; i++) {
                let rect: Rect = getBounds(objects[i].wrapper);
                let sw: number = 1;
                let sh: number = 1;
                if (option === 'Width') {
                    sw = bounds.width / rect.width;
                } else if (option === 'Height') {
                    sh = bounds.height / rect.height;
                } else if (option === 'Size') {
                    sw = bounds.width / rect.width;
                    sh = bounds.height / rect.height;
                }
                undoObject = this.storeObject(undoObject, objects[i]);

                this.scale(objects[i], sw, sh, pivot);

                redoObject = this.storeObject(redoObject, objects[i]);
            }
            this.diagram.updateSelector();
            undoObject = clone(undoObject) as SelectorModel;
            redoObject = clone(redoObject) as SelectorModel;
            let entry: HistoryEntry = {
                type: 'Sizing', category: 'Internal',
                undoObject: cloneObject(undoObject), redoObject: cloneObject(redoObject)
            };
            this.addHistoryEntry(entry);
        }
    }
    private storeObject(selectorObject: SelectorModel, obj: NodeModel | ConnectorModel): SelectorModel {
        if (obj instanceof Node) {
            selectorObject.nodes.push(clone(obj) as NodeModel);
        } else {
            selectorObject.connectors.push(clone(obj) as ConnectorModel);
        }
        return selectorObject;
    }

    /** @private */
    public scroll(scrollX: number, scrollY: number, focusPoint?: PointModel): void {
        let panx: number = canPanX(this.diagram);
        let pany: number = canPanY(this.diagram);
        this.diagram.pan(
            (scrollX = panx ? scrollX : 0) * this.diagram.scroller.currentZoom,
            (scrollY = pany ? scrollY : 0) * this.diagram.scroller.currentZoom, focusPoint);
    }

    /**
     * @private
     */
    public drawHighlighter(element: IElement): void {
        this.diagram.renderHighlighter(element.wrapper);
    }

    /**
     * @private
     */
    public removeHighlighter(): void {
        this.diagram.clearHighlighter();
    }

    /** @private */
    public zoom(scale: number, scrollX: number, scrollY: number, focusPoint?: PointModel): void {
        this.diagram.scroller.zoom(
            scale, scrollX * this.diagram.scroller.currentZoom, scrollY * this.diagram.scroller.currentZoom, focusPoint);
    }
}

/** @private */
export interface TransactionState {
    element: SelectorModel;
    backup: ObjectState;
}
/** @private */
export interface ClipBoardObject {
    pasteIndex?: number;
    clipObject?: Object;
    childTable?: {};
    processTable?: {};
}
/** @private */
export interface ObjectState {
    offsetX?: number;
    offsetY?: number;
    width?: number;
    height?: number;
    pivot?: PointModel;
    angle?: number;
}
