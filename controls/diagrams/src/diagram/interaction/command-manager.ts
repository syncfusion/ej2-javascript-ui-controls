/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable jsdoc/require-returns */
/* eslint-disable valid-jsdoc */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { IElement, ISelectionChangeEventArgs, IConnectionChangeEventArgs } from '../objects/interface/IElement';
import { ScrollValues, IScrollChangeEventArgs, IBlazorScrollChangeEventArgs } from '../objects/interface/IElement';
import { IDragOverEventArgs, IBlazorConnectionChangeEventArgs, IBlazorSelectionChangeEventArgs } from '../objects/interface/IElement';
import { ConnectorValue } from '../objects/interface/IElement';
import { DiagramEventObjectCollection,IPropertyChangeEventArgs } from '../objects/interface/IElement';
import { IDropEventArgs, IExpandStateChangeEventArgs } from '../objects/interface/IElement';
import { Connector, getBezierPoints, isEmptyVector, BezierSegment, BpmnFlow } from '../objects/connector';
import { Node, BpmnShape, BpmnSubEvent, BpmnAnnotation, DiagramShape, Native } from '../objects/node';
import { PathElement } from '../core/elements/path-element';
import { TextElement } from '../core/elements/text-element';
import { View } from '../objects/interface/interfaces';
import { PointModel } from '../primitives/point-model';
import { MouseEventArgs } from './event-handlers';
import { PointPortModel } from '../objects/port-model';
import { ConnectorModel, StraightSegmentModel, OrthogonalSegmentModel, BezierSegmentModel } from '../objects/connector-model';
import { BpmnTransactionSubProcessModel, BpmnAnnotationModel, SwimLaneModel, LaneModel } from '../objects/node-model';
import { OrthogonalSegment } from '../objects/connector';
import { Rect } from '../primitives/rect';
import { Diagram } from '../../diagram/diagram';
import { DiagramElement, Corners } from './../core/elements/diagram-element';
import { identityMatrix, rotateMatrix, transformPointByMatrix, scaleMatrix, Matrix } from './../primitives/matrix';
import { cloneObject as clone, cloneObject, getBounds, getFunction, getIndex } from './../utility/base-util';
import { completeRegion, getTooltipOffset, sort, findObjectIndex, intersect3, getAnnotationPosition, findParentInSwimlane } from './../utility/diagram-util';
import { updatePathElement, cloneBlazorObject, getUserHandlePosition, cloneSelectedObjects } from './../utility/diagram-util';
import { updateDefaultValues } from './../utility/diagram-util';
import { randomId, cornersPointsBeforeRotation } from './../utility/base-util';
import { SelectorModel } from '../objects/node-model';
import { Selector } from '../objects/node';
import { hasSelection, isSelected, hasSingleConnection, contains } from './actions';
import { AlignmentOptions, DistributeOptions, SizingOptions, DiagramEvent, BoundaryConstraints, AlignmentMode, ConnectorConstraints, BezierSmoothness } from '../enum/enum';
import { BlazorAction, EntryType } from '../enum/enum';
import { HistoryEntry } from '../diagram/history';
import { canSelect, canMove, canRotate, canDragSourceEnd, canDragTargetEnd, canSingleSelect, canDrag } from './../utility/constraints-util';
import { canMultiSelect, canContinuousDraw } from './../utility/constraints-util';
import { canPanX, canPanY, canPageEditable } from './../utility/constraints-util';
import { SnapConstraints, DiagramTools, DiagramAction, RealAction } from '../enum/enum';
import { Snapping } from '../objects/snapping';
import { LayoutAnimation } from '../objects/layout-animation';
import { Container } from '../core/containers/container';
import { Canvas } from '../core/containers/canvas';
import { getDiagramElement, getAdornerLayerSvg, getHTMLLayer, getAdornerLayer, getSelectorElement } from '../utility/dom-util';
import { Point } from '../primitives/point';
import { Size } from '../primitives/size';
import { getObjectType, getPoint, intersect2, getOffsetOfConnector, canShowCorner } from './../utility/diagram-util';
import { LayerModel } from '../diagram/layer-model';
import { selectionHasConnector } from './../utility/diagram-util';
import { Layer } from '../diagram/layer';
import { SelectorConstraints, Direction, DiagramConstraints } from '../enum/enum';
import { PageSettings } from '../diagram/page-settings';
import { DiagramScroller, Segment } from '../interaction/scroller';
import { remove, isBlazor, isNullOrUndefined } from '@syncfusion/ej2-base';
import { ConnectTool } from './tool';
import { getOppositeDirection, getPortDirection, findAngle, Intersection } from './../utility/connector';
import { ILayout } from '../layout/layout-base';
import { swapBounds, findPoint, orthoConnection2Segment, End, getIntersection } from './../utility/connector';
import { ShapeAnnotationModel, PathAnnotationModel } from '../objects/annotation-model';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';
import { SegmentInfo } from '../rendering/canvas-interface';
import { PointPort } from '../objects/port';
import { MarginModel } from '../core/appearance-model';
import { renderContainerHelper } from './container-interaction';
import { checkChildNodeInContainer, checkParentAsContainer, addChildToContainer } from './container-interaction';
import { renderStackHighlighter } from './container-interaction';
import { getConnectors, updateConnectorsProperties, canLaneInterchange, findLane } from './../utility/swim-lane-util';
import { GridPanel } from '../core/containers/grid';
import { swimLaneSelection, pasteSwimLane, gridSelection } from '../utility/swim-lane-util';
import { DeepDiffMapper } from '../utility/diff-map';
import { BlazorTooltip } from '../blazor-tooltip/blazor-Tooltip';
import { Tooltip } from '@syncfusion/ej2-popups';
import { DiagramTooltipModel } from '../objects/tooltip-model';
import { NodeModel } from '../objects/node-model';

/**
 * Defines the behavior of commands
 */

export class CommandHandler {

    /**   @private  */
    public clipboardData: ClipBoardObject = {};
    // private newNodeObject: Object[] = [];
    // private newConnectorObject: Object[] = [];
    /**   @private  */
    public diagramObject: object = {};
    /**   @private  */
    public newSelectedObjects: object = {};
    /**   @private  */
    public oldSelectedObjects: object = {};

    /**   @private  */
    public connectorsTable: Object[] = [];
    /** @private */
    public PreventConnectorSplit:boolean = false;
    /**   @private  */
    public processTable: {} = {};
    /**   @private  */
    public deepDiffer: DeepDiffMapper = new DeepDiffMapper();
    /** @private */
    public isContainer: boolean = false;
    private state: TransactionState;
    /** @private */
    public diagram: Diagram;
    /** @private */
    public canUpdateTemplate: boolean = false;

    private childTable: {} = {};

    private parentTable: {} = {};
    private blazor: string = 'Blazor';
    private blazorInterop: string = 'sfBlazor';
    private cloneGroupChildCollection: (NodeModel | ConnectorModel)[] = [];
    enableConnectorSplit: boolean;

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
    /**
     * startTransaction method\
     *
     * @returns {  void }    startTransaction method .\
     * @param {boolean} protectChange - provide the options value.
     * @private
     */
    public startTransaction(protectChange: boolean): void {
        this.state = { element: this.diagram.selectedItems, backup: null };
        if (protectChange) {
            this.diagram.protectPropertyChange(true);
        }
        getAdornerLayer(this.diagram.element.id).style.pointerEvents = 'none';
    }
    /**
     * endTransaction method\
     *
     * @returns {  void }    endTransaction method .\
     * @param {boolean} protectChange - provide the options value.
     * @private
     */
    public endTransaction(protectChange: boolean): void {
        this.state = null;
        if (protectChange) {
            this.diagram.protectPropertyChange(false);
        }
        getAdornerLayer(this.diagram.element.id).style.pointerEvents = 'all';
    }
    /**
     * setFocus method\
     *
     * @returns {  void }    setFocus method .\
     * @private
     */
    public setFocus(): void {
        document.getElementById(this.diagram.element.id).focus();
    }
    /**
     * showTooltip method\
     *
     * @returns {  void }    showTooltip method .\
     * @param {IElement} node - provide the options value.
     * @param {PointModel} position - provide the position value.
     * @param {string | HTMLElement} content - provide the content value.
     * @param {string} toolName - provide the toolName value.
     * @param {boolean} isTooltipVisible - provide the isTooltipVisible value.
     * @private
     */
    public showTooltip(
        node: IElement, position: PointModel, content: string | HTMLElement, toolName: string,
        isTooltipVisible: boolean): void {
        let targetId: string;
        let targetEle: HTMLElement;
        let isNative: Boolean = false;
        if (node instanceof Selector) {
            if ((node.nodes.length == 1) && node.connectors.length == 0) {
                targetId = node.nodes[0].id;
                if (node.nodes[0].shape && node.nodes[0].shape instanceof Native) { isNative = true; }
            }
            else if ((node.nodes.length == 0) && node.connectors.length == 1) { targetId = node.connectors[0].id }
            else {
                targetEle = document.getElementById(this.diagram.element.id + '_SelectorElement');
            }
        } else if (node instanceof Node) {
            targetId = (node as Node).id;
            if ((node as Node).shape && ((node as Node).shape instanceof Native)) {
                isNative = true;
            }
        } else {
            targetId = (node as Connector).id;
        }
        if (isNullOrUndefined(targetEle) && !isNullOrUndefined(targetId)) {
            let idName: string = isNative ? '_content_native_element' : '_groupElement';
            targetEle = document.getElementById(targetId + idName);
        }
        if (isTooltipVisible) {
            this.diagram.tooltipObject.position = 'BottomCenter';
            this.diagram.tooltipObject.animation = { open: { delay: 0, duration: 0 } };
            this.diagram.tooltipObject.openDelay = 0;
            this.diagram.tooltipObject.closeDelay = 0;
        }
        if (this.diagram.selectedItems.setTooltipTemplate) {
            let template: string | HTMLElement;
            const setTooltipTemplate: Function = getFunction(this.diagram.selectedItems.setTooltipTemplate);
            if (setTooltipTemplate) {
                template = setTooltipTemplate(node, this.diagram);
            }
            if (template instanceof HTMLElement) {
                content = template.cloneNode(true) as HTMLElement;
            } else {
                content = template ? template : content;
            }
        }
        if (isBlazor() && isTooltipVisible) {
            this.diagram.tooltipObject.close();
        }
        if ((node as Node).tooltip) {
            (this.diagram.tooltipObject as DiagramTooltipModel).openOn = ((node as Node).tooltip as DiagramTooltipModel).openOn;
        }

        this.diagram.tooltipObject.content = content;
        this.diagram.tooltipObject.offsetX = 0;
        this.diagram.tooltipObject.offsetY = 0;
        if (isBlazor()) {
            (this.diagram.tooltipObject as BlazorTooltip).updateTooltip(targetEle);
        } else {
            (this.diagram.tooltipObject as Tooltip).refresh(targetEle);
        }
        if (isTooltipVisible) {
            setTimeout(
                () => {
                    (this.diagram.tooltipObject as Tooltip).open(targetEle);
                },
                1);
        }
    }

    /**
     * Split the connector, when the node is dropped onto it and establish connection with that dropped node.
     *
     * @returns {  void }   connectorSplit  method .\
     * @param {NodeModel}  droppedObject - Provide the dropped node id
     * @param {ConnectorModel} targetConnector - Provide the connector id
     * @private
     */
    public connectorSplit(droppedObject:NodeModel, targetConnector:ConnectorModel): void {
        let droppedNodeId:string =droppedObject.id ;
        let existingConnector:ConnectorModel=cloneObject(targetConnector)
        let connectorIndex:number;
        connectorIndex=this.diagram.connectors.indexOf(targetConnector)
        let nodeIndex:number;
        nodeIndex =this.diagram.nodes.indexOf(droppedObject)
        let droppedNode:NodeModel = cloneObject(droppedObject)
        let connectorOldChanges: ConnectorPropertyChanging={} ;
        let nodeOldChanges:NodePropertyChanging={};
        let nodeOldProperty:NodeModel={
            offsetX:droppedNode.offsetX,
            offsetY:droppedNode.offsetY
        }; 
        let connectorOldProperty:ConnectorModel={
        sourceID:existingConnector.sourceID,
        sourcePoint:existingConnector.sourcePoint,
        sourcePortID:existingConnector.sourcePortID,
        targetID: existingConnector.targetID,
        targetPoint: existingConnector.targetPoint,
        targetPortID:existingConnector.targetPortID
        };
        connectorOldChanges[connectorIndex]=connectorOldProperty;
        nodeOldChanges[nodeIndex]=nodeOldProperty;
        let connectorNewChanges:ConnectorPropertyChanging={};
        let nodeNewChanges:NodePropertyChanging={};
        let nodeNewProperty:NodeModel={
        };   
        let connectorNewProperty:ConnectorModel={
        };  
        //Split the connector based on the dropped node      
        if(existingConnector.sourceID!= "" &&existingConnector.targetID != ""){
           connectorNewProperty.targetID = this.ConnectorTargetChange(targetConnector,droppedNodeId)
        }
        else if (existingConnector.sourceID != "" && existingConnector.targetID == "") {
            this.nodeOffsetChange(nodeNewProperty,droppedNode,targetConnector.targetPoint);
            connectorNewProperty.targetID = this. ConnectorTargetChange(targetConnector,droppedNodeId);
        }
        else if((existingConnector.sourceID == "" && existingConnector.targetID == "") || (existingConnector.sourceID== "" &&existingConnector.targetID != "")){
            this.nodeOffsetChange(nodeNewProperty,droppedNode,targetConnector.sourcePoint)
            connectorNewProperty.sourceID= this. ConnectorSourceChange(targetConnector,droppedNodeId);
        }
        connectorNewChanges[connectorIndex]=connectorNewProperty;
         nodeNewChanges[nodeIndex]=nodeNewProperty;
         this.diagram.nodePropertyChange(droppedObject as Node,nodeOldProperty as Node,nodeNewProperty as Node);
         this.diagram.updateSelector();
         this.diagram.connectorPropertyChange(targetConnector as Connector,connectorOldProperty as Connector,connectorNewProperty as Connector);
        //Check Whether the connector connects with the node 
         if(existingConnector.sourceID !="" && existingConnector.targetID !=""){
            let newConnector:ConnectorModel = { 
            id:"connector "+droppedNodeId,
            constraints:ConnectorConstraints.Default|ConnectorConstraints.AllowDrop,
            sourceID:droppedNodeId,
        }; 
        //Check whether the connector connects with the ports
        if(existingConnector.sourcePortID != "" && existingConnector.targetPortID != "") {
        newConnector.targetID = existingConnector.targetID;
        newConnector.targetPortID =existingConnector.targetPortID
        }
        else{
        newConnector.targetID =existingConnector.targetID;
        }
        this.diagram.add(newConnector);
        }
        const entry: HistoryEntry = {
            type: 'PropertyChanged', redoObject: {nodes:nodeNewChanges as NodeModel[]}, undoObject: {nodes:nodeOldChanges as NodeModel[]},
            category: 'Internal'
        };
        this.diagram.addHistoryEntry(entry);
        const entry1: HistoryEntry = {
            type: 'PropertyChanged', redoObject: {connectors:connectorNewChanges as ConnectorModel[]}, undoObject: {connectors:connectorOldChanges as ConnectorModel[] },
            category: 'Internal'
        };
        this.diagram.addHistoryEntry(entry1);
    }
    
      private nodeOffsetChange(propertyChangeArg:NodeModel,node:NodeModel,nodeNewOffset:PointModel ): void {
        propertyChangeArg.offsetX =node.offsetX =nodeNewOffset.x;
        propertyChangeArg.offsetY =node.offsetY =nodeNewOffset.y;
    }
    
       private ConnectorTargetChange(connector:ConnectorModel,newTarget:string): string {
        connector.targetID= newTarget;
        return newTarget
    }
   
       private ConnectorSourceChange(connector:ConnectorModel,newTarget:string): string {
        connector.sourceID= newTarget;
        return newTarget
    }

    /**
     * closeTooltip method\
     *
     * @returns {  void }    closeTooltip method .\
     * @private
     */
    public closeTooltip(): void {
        this.diagram.tooltipObject.close();
    }

    /**
     * canEnableDefaultTooltip method\
     *
     * @returns {  boolean }    canEnableDefaultTooltip method .\
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
     * updateSelector method\
     *
     * @returns {  void }    updateSelector method .\
     * @private
     */
    public updateSelector(): void {
        this.diagram.updateSelector();
    }

    /**
     * updateConnectorValue method\
     *
     * @returns {  void }    updateConnectorValue method .\
     * @param {IBlazorConnectionChangeEventArgs} args - provide the options value.
     * @private
     */
    public updateConnectorValue(args: IBlazorConnectionChangeEventArgs): void {
        if (args.cancel) {
            this.enableCloneObject(true);
            this.ismouseEvents(true);
            this.insertBlazorObject(args.connector as Connector);
            const newChanges: Connector = {} as Connector;
            const oldChanges: Connector = {} as Connector;
            const connector: Connector = this.diagram.nameTable[args.connector.id];
            const nodeEndId: string = args.connectorEnd === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
            const portEndId: string = args.connectorEnd === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
            const connectionEnd: boolean = args.connectorEnd === 'ConnectorTargetEnd';
            const newValue: ConnectorValue = connectionEnd ? args.newValue.connectorTargetValue : args.newValue.connectorSourceValue;
            const oldValue: ConnectorValue = connectionEnd ? args.oldValue.connectorTargetValue : args.oldValue.connectorSourceValue;
            oldChanges[nodeEndId] = newValue.nodeId;
            oldChanges[portEndId] = newValue.portId;
            newChanges[nodeEndId] = oldValue.nodeId;
            newChanges[portEndId] = oldValue.portId;
            if (args.cancel && args.connectorEnd !== 'ConnectorTargetEnd') {
                connector.sourceID = oldValue.nodeId;
                if (args.connector.sourcePortID) {
                    connector.sourcePortID = oldValue.portId;
                }
                this.diagram.connectorPropertyChange(connector, oldChanges, newChanges);
            }
            if (args.cancel && args.connectorEnd === 'ConnectorTargetEnd') {
                if (args.connector.targetPortID) {
                    connector.targetPortID = oldValue.portId;
                }
                connector.targetID = oldValue.nodeId;
                this.diagram.connectorPropertyChange(connector, oldChanges, newChanges);
            }
        }
    }

    /**
     * triggerEvent method\
     *
     * @returns {  Promise<void | object | IBlazorConnectionChangeEventArgs> }    triggerEvent method .\
     * @param {DiagramEvent} event - provide the options value.
     * @param {Object} args - provide the args value.
     * @private
     */
    public async triggerEvent(event: DiagramEvent, args: Object): Promise<void | object | IBlazorConnectionChangeEventArgs> {
        if (event === DiagramEvent.drop || event === DiagramEvent.positionChange ||
            event === DiagramEvent.connectionChange) {
            if (this.diagram.currentSymbol) {
                return;
            }
            if (event === DiagramEvent.drop) {
                (args as IDropEventArgs).source = cloneBlazorObject(this.diagram);
            }
            if (this.diagram.currentDrawingObject && event !== DiagramEvent.positionChange) {
                return;

            }
        }

        const temparg: IBlazorConnectionChangeEventArgs = await this.diagram.triggerEvent(event, args) as IBlazorConnectionChangeEventArgs;
        return temparg;
    }

    /**
     * dragOverElement method\
     *
     * @returns { void }    dragOverElement method .\
     * @param {MouseEventArgs} args - provide the options value.
     * @param {PointModel} currentPosition - provide the args value.
     * @private
     */
    public dragOverElement(args: MouseEventArgs, currentPosition: PointModel): void {
        if (this.diagram.currentSymbol) {
            const dragOverArg: IDragOverEventArgs = {
                element: cloneBlazorObject(args.source), target: cloneBlazorObject(args.target),
                mousePosition: cloneBlazorObject(currentPosition), diagram: cloneBlazorObject(this.diagram)
            };
            this.triggerEvent(DiagramEvent.dragOver, dragOverArg);
        }
    }
    /**
     * disConnect method\
     *
     * @returns { IConnectionChangeEventArgs | IBlazorConnectionChangeEventArgs }    disConnect method .\
     * @param {IElement} obj - provide the obj value.
     * @param {string} endPoint - provide the endPoint value.
     * @param {boolean} canCancel - provide the canCancel value.
     * @private
     */
    public disConnect(
        obj: IElement, endPoint?: string, canCancel?: boolean)
        : IConnectionChangeEventArgs | IBlazorConnectionChangeEventArgs {
        const checkBlazor: boolean = isBlazor();
        let oldChanges: Connector = {} as Connector; let newChanges: Connector = {} as Connector;
        let returnargs: IConnectionChangeEventArgs | IBlazorConnectionChangeEventArgs;
        let selectorModel: SelectorModel; let connector: Connector;
        if (obj instanceof Selector) {
            selectorModel = obj as SelectorModel;
            connector = selectorModel.connectors[0] as Connector;
        } else if (obj instanceof Connector && this.diagram.currentDrawingObject) {
            connector = this.diagram.currentDrawingObject as Connector;
        }
        if (obj && connector && (hasSingleConnection(this.diagram) || this.diagram.currentDrawingObject)) {
            if (isBlazor()) {
                this.diagram.insertValue(cloneObject(connector), false);
            }
            if (endPoint && (endPoint === 'ConnectorSourceEnd' || endPoint === 'ConnectorTargetEnd')) {
                const nodeEndId: string = endPoint === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
                const portEndId: string = endPoint === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
                if (connector[nodeEndId]) {//connector.sourceID || connector.targetID
                    oldChanges[nodeEndId] = connector[nodeEndId] as Connector;
                    connector[nodeEndId] = '';
                    newChanges[nodeEndId] = connector[nodeEndId] as Connector;
                    if (connector.sourcePortID || connector.targetPortID) {
                        oldChanges[portEndId] = connector[portEndId] as Connector;
                        connector[portEndId] = '';
                        newChanges[portEndId] = connector[portEndId] as Connector;
                    }
                    returnargs = this.connectionEventChange(connector, oldChanges, newChanges, endPoint, canCancel);
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
                let arg: IConnectionChangeEventArgs | IBlazorConnectionChangeEventArgs = {
                    connector: cloneBlazorObject(connector), oldValue: oldChanges,
                    newValue: newChanges, cancel: false, state: 'Changing', connectorEnd: endPoint
                };
                if (isBlazor()) {
                    arg = {
                        connector: cloneBlazorObject(connector),
                        oldValue: { connector: cloneBlazorObject(oldChanges) as Connector },
                        newValue: { connector: cloneBlazorObject(newChanges) as Connector },
                        cancel: false, state: 'Changed', connectorEnd: endPoint
                    } as IBlazorConnectionChangeEventArgs;
                    returnargs = arg;
                }
                if (!checkBlazor) {
                    this.triggerEvent(DiagramEvent.connectionChange, arg);
                }
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
                    if (isBlazor()) {
                        arg = {
                            connector: cloneBlazorObject(connector), oldValue: { connector: oldChanges },
                            newValue: { connector: newChanges }, cancel: false, state: 'Changed', connectorEnd: endPoint
                        } as IBlazorConnectionChangeEventArgs;
                        returnargs = arg;
                    }
                    if (!checkBlazor) {
                        this.triggerEvent(DiagramEvent.connectionChange, arg);
                    }
                }
            }
        }
        return returnargs;
    }


    private connectionEventChange(
        connector: Connector, oldChanges: Connector, newChanges: Connector, endPoint: string, canCancel?: boolean)
        : IConnectionChangeEventArgs | IBlazorConnectionChangeEventArgs {
        const checkBlazor: boolean = isBlazor();
        const nodeEndId: string = endPoint === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
        const portEndId: string = endPoint === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
        let connectedNode: Node;
        if (this.enableCloneObject) {
            connectedNode = this.diagram.nameTable[newChanges[nodeEndId]];
            const nodeObject: object = cloneObject(connectedNode);
            this.diagram.insertValue(nodeObject, true);

        }
        let returnargs: IConnectionChangeEventArgs | IBlazorConnectionChangeEventArgs;
        let arg: IConnectionChangeEventArgs | IBlazorConnectionChangeEventArgs = {
            cancel: false, state: 'Changing', connectorEnd: endPoint,
            connector: cloneBlazorObject(connector), oldValue: { nodeId: oldChanges[nodeEndId], portId: oldChanges[portEndId] },
            newValue: { nodeId: newChanges[nodeEndId], portId: newChanges[portEndId] }
        };
        if (isBlazor()) {
            arg = {
                connector: cloneBlazorObject(connector),
                cancel: false, state: 'Changing', connectorEnd: endPoint,
                oldValue: undefined, newValue: undefined
            };
            if (endPoint === 'ConnectorSourceEnd') {
                (arg as IBlazorConnectionChangeEventArgs).oldValue = {
                    connectorSourceValue: {
                        portId: oldChanges[portEndId], nodeId: oldChanges[nodeEndId]
                    }
                };
                (arg as IBlazorConnectionChangeEventArgs).newValue = {
                    connectorSourceValue: { nodeId: newChanges[nodeEndId], portId: newChanges[portEndId] }
                };
            } else {
                (arg as IBlazorConnectionChangeEventArgs).oldValue = {
                    connectorTargetValue: { nodeId: oldChanges[nodeEndId], portId: oldChanges[portEndId] }
                };
                (arg as IBlazorConnectionChangeEventArgs).newValue = {
                    connectorTargetValue: { nodeId: newChanges[nodeEndId], portId: newChanges[portEndId] }
                };
            }
            returnargs = arg;
        }
        if (!checkBlazor) {
            this.triggerEvent(DiagramEvent.connectionChange, arg);
        }
        if (arg.cancel || (isBlazor() && canCancel)) {
            connector[nodeEndId] = oldChanges[nodeEndId];
            connector[portEndId] = oldChanges[portEndId];
            newChanges = oldChanges;
        } else {
            this.diagram.connectorPropertyChange(connector as Connector, oldChanges, newChanges);
            this.diagram.updateDiagramObject(connector);
            arg = {
                connector: cloneBlazorObject(connector), oldValue: { nodeId: oldChanges[nodeEndId], portId: oldChanges[portEndId] },
                newValue: {
                    nodeId: newChanges[nodeEndId],
                    portId: newChanges[portEndId]
                },
                cancel: false, state: 'Changing', connectorEnd: endPoint
            };
            if (isBlazor()) {
                arg = {
                    connector: cloneBlazorObject(connector),
                    oldValue: undefined,
                    newValue: undefined,
                    cancel: false, state: 'Changing', connectorEnd: endPoint
                };
                if (endPoint === 'ConnectorSourceEnd') {

                    (arg as IBlazorConnectionChangeEventArgs).newValue = {
                        connectorSourceValue: { portId: newChanges[portEndId], nodeId: newChanges[nodeEndId] }
                    };
                    (arg as IBlazorConnectionChangeEventArgs).oldValue = {
                        connectorSourceValue: { portId: oldChanges[portEndId], nodeId: oldChanges[nodeEndId] }
                    };
                } else {
                    (arg as IBlazorConnectionChangeEventArgs).oldValue = {
                        connectorTargetValue: { nodeId: oldChanges[nodeEndId], portId: oldChanges[portEndId] }
                    };
                    (arg as IBlazorConnectionChangeEventArgs).newValue = {
                        connectorTargetValue: { portId: newChanges[portEndId], nodeId: newChanges[nodeEndId] }
                    };
                }
                returnargs = arg;
            }

        }
        if (this.enableCloneObject) {
            if (connectedNode === undefined) {
                connectedNode = this.diagram.nameTable[oldChanges[nodeEndId]];
                const nodeObject: object = cloneObject(connectedNode);
                this.diagram.insertValue(nodeObject, true);
            }
        }
        return returnargs;
    }

    /**
     * insertBlazorObject method\
     *
     * @returns { void }    insertBlazorObject method .\
     * @param {IElement} object - provide the object value.
     * @param {boolean} isNode - provide the isNode value.
     * @private
     */
    public insertBlazorObject(object: SelectorModel | Node | Connector, isNode?: boolean): void {
        let node: NodeModel; let connector: ConnectorModel;
        if (object instanceof Selector) {
            this.oldSelectedObjects = cloneSelectedObjects(this.diagram);
            for (let i: number = 0; i < object.nodes.length; i++) {
                node = this.diagram.getObject(object.nodes[i].id) as NodeModel;
                this.diagram.insertValue(cloneObject(node), true);
            }
            for (let i: number = 0; i < object.connectors.length; i++) {
                connector = this.diagram.getObject(object.connectors[i].id) as ConnectorModel;
                this.diagram.insertValue(cloneObject(connector), false);
            }
        } else {
            object = this.diagram.getObject((object as Node | Connector).id);
            this.diagram.insertValue(cloneObject(object), (object instanceof Node) ? true : false);
        }
    }
    /**
     * updatePropertiesToBlazor method\
     *
     * @returns { void }    updatePropertiesToBlazor method .\
     * @param {MouseEventArgs} args - provide the args value.
     * @param {PointModel} labelDrag - provide the labelDrag value.
     * @private
     */
    public updatePropertiesToBlazor(args: MouseEventArgs, labelDrag: boolean): void {
        this.enableCloneObject(false);
        this.ismouseEvents(false);
        this.getBlazorOldValues(args, labelDrag);
        this.updateBlazorSelector();
    }
    /**
     * insertSelectedObjects method\
     *
     * @returns { void }    insertSelectedObjects method .\
     * @private
     */
    public insertSelectedObjects(): void {
        this.oldSelectedObjects = cloneSelectedObjects(this.diagram);
    }
    /**
     * findTarget method\
     *
     * @returns { NodeModel | PointPortModel | ShapeAnnotationModel | PathAnnotationModel }    findTarget method .\
     * @param {DiagramElement} element - provide the element value.
     * @param {IElement} argsTarget - provide the argsTarget value.
     * @param {boolean} source - provide the source value.
     * @param {boolean} connection - provide the connection value.
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
            if (source && argsTarget.shape.type === 'Bpmn' && ((!isBlazor() && (argsTarget.shape as BpmnShape).shape === 'Activity') ||
                (isBlazor() && (argsTarget.shape as DiagramShape).bpmnShape === 'Activity'))) {
                if ((argsTarget.shape as BpmnShape).activity.subProcess.type === 'Transaction') {
                    const transaction: BpmnTransactionSubProcessModel = (argsTarget.shape as BpmnShape).activity.subProcess.transaction;
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
                    const port: PointPortModel = argsTarget.ports[i];
                    if (element.id === argsTarget.id + '_' + port.id) {
                        return port;
                    }
                }
            }
        }
        if (!connection) {
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
     * canDisconnect method\
     *
     * @returns { boolean }    canDisconnect method .\
     * @param {string} endPoint - provide the endPoint value.
     * @param {MouseEventArgs} args - provide the args value.
     * @param {string} targetPortId - provide the targetPortId value.
     * @param {string} targetNodeId - provide the targetNodeId value.
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
        const targetObject: NodeModel | PointPortModel = this.findTarget(
            args.targetWrapper, args.target, endPoint === 'ConnectorSourceEnd', true) as (NodeModel | PointPortModel);
        const nodeEnd: string = endPoint === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
        const portEnd: string = endPoint === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
        if (connect[nodeEnd] !== targetNodeId || connect[portEnd] !== targetPortId) {
            return true;
        }
        return false;
    }

    /**
     * changeAnnotationDrag method\
     *
     * @returns { void }    changeAnnotationDrag method .\
     * @param {MouseEventArgs} args - provide the endPoint value.
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
            const id: string[] = connector.id.split('_');
            const annotationId: string = id[id.length - 1];
            const nodeId: string = id[id.length - 3] || id[0];
            if (args.target && (args.target as Node).id !== nodeId &&
                ((!isBlazor() && ((args.target as Node).shape as BpmnShape).shape !== 'TextAnnotation') ||
                    (isBlazor() && ((args.target as Node).shape as DiagramShape).bpmnShape !== 'TextAnnotation'))) {
                this.diagram.startGroupAction();
                const parentNode: Node = this.diagram.nameTable[id[0]];
                const clonedNode: Node = this.getAnnotation(parentNode, id[1]) as Node;
                const annotationNode: Object = {
                    id: id[1] + randomId(),
                    angle: Point.findAngle(connector.intermediatePoints[0], connector.intermediatePoints[1]),
                    text: (clonedNode as BpmnAnnotationModel).text,
                    length: Point.distancePoints(connector.intermediatePoints[0], connector.intermediatePoints[1]),
                    shape: { shape: 'TextAnnotation', type: 'Bpmn' },
                    nodeId: (clonedNode as BpmnAnnotationModel as BpmnAnnotation).nodeId
                };
                const annotationObj: BpmnAnnotationModel = new BpmnAnnotation(
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

    /* tslint:disable */
    /**
     * connect method\
     *
     * @returns { IConnectionChangeEventArgs | IBlazorConnectionChangeEventArgs }    connect method .\
     * @param {string} endPoint - provide the endPoint value.
     * @param {MouseEventArgs} args - provide the args value.
     * @param {boolean} canCancel - provide the canCancel value.
     * @private
     */
    public connect(
        endPoint: string, args: MouseEventArgs, canCancel?: boolean): IConnectionChangeEventArgs | IBlazorConnectionChangeEventArgs {
        let checkBlazor: boolean;
        const newChanges: Connector = {} as Connector;
        const oldChanges: Connector = {} as Connector;
        let oldNodeId: string;
        let oldPortId: string;
        let selectorModel: SelectorModel; let connector: Connector;
        let returnargs: IConnectionChangeEventArgs | IBlazorConnectionChangeEventArgs;
        if (args.source instanceof Selector) {
            selectorModel = args.source as SelectorModel;
            connector = selectorModel.connectors[0] as Connector;
        } else if (args.source instanceof Connector && this.diagram.currentDrawingObject) {
            connector = this.diagram.currentDrawingObject as Connector;
        }
        const target: NodeModel | PointPortModel = this.findTarget(
            (args.targetWrapper || args.sourceWrapper),
            (args.target || args.actualObject), endPoint === 'ConnectorSourceEnd', true) as (NodeModel | PointPortModel);
        const nodeEndId: string = endPoint === 'ConnectorSourceEnd' ? 'sourceID' : 'targetID';
        const portEndId: string = endPoint === 'ConnectorSourceEnd' ? 'sourcePortID' : 'targetPortID';
        if (target instanceof Node) {
            oldChanges[nodeEndId] = connector[nodeEndId];
            connector[nodeEndId] = target.id;
            newChanges[nodeEndId] = connector[nodeEndId] as Connector;
            oldChanges[portEndId] = connector[portEndId];
            returnargs = this.connectionEventChange(connector, oldChanges, newChanges, endPoint, canCancel);
        } else {
            oldNodeId = connector[nodeEndId];
            oldPortId = connector[portEndId];
            connector[portEndId] = target.id;
            connector[nodeEndId] = (args.target && (args.target as Node).id || (args.actualObject as Node).id);
            newChanges[nodeEndId] = connector[nodeEndId] as Connector;
            newChanges[portEndId] = connector[portEndId] as Connector;
            let arg: IConnectionChangeEventArgs | IBlazorConnectionChangeEventArgs = {
                connector: cloneBlazorObject(connector), oldValue: { nodeId: oldNodeId, portId: oldPortId },
                newValue: { nodeId: newChanges[nodeEndId], portId: newChanges[portEndId] },
                cancel: false, state: 'Changing', connectorEnd: endPoint
            };
            if (isBlazor()) {
                arg = {
                    connector: cloneBlazorObject(connector),
                    oldValue: undefined,
                    newValue: undefined,
                    cancel: false, state: 'Changing', connectorEnd: endPoint
                };
                if (endPoint === 'ConnectorSourceEnd') {
                    (arg as IBlazorConnectionChangeEventArgs).oldValue = {
                        connectorSourceValue: { portId: oldChanges[portEndId], nodeId: oldChanges[nodeEndId] }
                    };
                    (arg as IBlazorConnectionChangeEventArgs).newValue = {
                        connectorSourceValue: { portId: newChanges[portEndId], nodeId: newChanges[nodeEndId] }
                    };
                } else {
                    (arg as IBlazorConnectionChangeEventArgs).newValue = {
                        connectorTargetValue: { portId: newChanges[portEndId], nodeId: newChanges[nodeEndId] }
                    };
                    (arg as IBlazorConnectionChangeEventArgs).oldValue = {
                        connectorTargetValue: { portId: oldChanges[portEndId], nodeId: oldChanges[nodeEndId] }
                    };
                }
                returnargs = arg;
            }
            if (!checkBlazor) {
                this.triggerEvent(DiagramEvent.connectionChange, arg);
            }
            if (arg.cancel || (isBlazor() && canCancel)) {
                connector[nodeEndId] = oldNodeId; connector[portEndId] = oldPortId;
                newChanges[nodeEndId] = oldNodeId; newChanges[portEndId] = oldPortId;
            } else {
                this.diagram.connectorPropertyChange(connector as Connector, oldChanges, newChanges);
                this.diagram.updateDiagramObject(connector);
                arg = {
                    connector: cloneBlazorObject(connector), oldValue: { nodeId: oldNodeId, portId: oldPortId },
                    newValue: { nodeId: newChanges[nodeEndId], portId: newChanges[portEndId] }, cancel: false,
                    state: 'Changing', connectorEnd: endPoint
                };
                if (isBlazor()) {
                    arg = {
                        newValue: undefined,
                        connector: cloneBlazorObject(connector),
                        oldValue: undefined,
                        cancel: false, state: 'Changing', connectorEnd: endPoint
                    };
                    if (endPoint === 'ConnectorSourceEnd') {
                        (arg as IBlazorConnectionChangeEventArgs).oldValue = {
                            connectorSourceValue: { portId: oldChanges[portEndId], nodeId: oldChanges[nodeEndId] }
                        };
                        (arg as IBlazorConnectionChangeEventArgs).newValue = {
                            connectorTargetValue: { portId: newChanges[portEndId], nodeId: newChanges[nodeEndId] }
                        };
                    } else {
                        (arg as IBlazorConnectionChangeEventArgs).oldValue = {
                            connectorTargetValue: { portId: oldChanges[portEndId], nodeId: oldChanges[nodeEndId] }
                        };
                        (arg as IBlazorConnectionChangeEventArgs).newValue = {
                            connectorTargetValue: { portId: newChanges[portEndId], nodeId: newChanges[nodeEndId] }
                        };
                    }
                }

            }
        }
        this.renderHighlighter(args, undefined, endPoint === 'ConnectorSourceEnd');
        return returnargs;
    }

    /* tslint:enable */

    /** @private */
    /**
     * cut method\
     *
     * @returns { void }    cut method .\
     * @private
     */
    public cut(): void {
        let index: number;
        this.clipboardData.pasteIndex = 0;
        if (this.diagram.undoRedoModule) {
            this.diagram.historyManager.startGroupAction();
        }
        this.clipboardData.clipObject = this.copyObjects();
        if (this.diagram.undoRedoModule) {
            this.diagram.historyManager.endGroupAction();
        }
        if (this.diagram.mode !== 'SVG') {
            this.diagram.refreshDiagramLayer();
        }
    }
    private UpdateBlazorDiagramModelLayers(layer: Layer, isRemove: boolean): void {
        const blazorInterop: string = 'sfBlazor';
        const updatedModel: object = cloneBlazorObject(layer);
        const blazor: string = 'Blazor';
        if (window && window[blazor]) {
            const obj: object = {
                'methodName': 'UpdateBlazorDiagramModelLayers',
                'diagramobj': JSON.stringify(updatedModel), 'isRemove': isRemove
            };
            if (!this.diagram.isLoading) {
                window[blazorInterop].updateBlazorProperties(obj, this.diagram);
            }
        }
    }
    /**
     * addLayer method\
     *
     * @returns { void }    addLayer method .\
     * @param {LayerModel} layer - provide the endPoint value.
     * @param {Object[]} objects - provide the args value.
     * @param {boolean} isServerUpdate - provide the canCancel value.
     * @private
     */
    public addLayer(layer: LayerModel, objects?: Object[], isServerUpdate: boolean = true): void {
        layer.id = layer.id || randomId();
        layer.zIndex = this.diagram.layers.length;
        let isEnableServerDatabind: boolean = this.diagram.allowServerDataBinding;
        this.diagram.enableServerDataBinding(false);
        layer = new Layer(this.diagram, 'layers', layer, true);
        this.diagram.enableServerDataBinding(isEnableServerDatabind);
        (layer as Layer).objectZIndex = -1;
        (layer as Layer).zIndexTable = {};
        this.diagram.layers.push(layer);
        if (isServerUpdate) {
            this.UpdateBlazorDiagramModelLayers(layer as Layer, false);
        }
        this.diagram.layerZIndexTable[layer.zIndex] = layer.id;
        this.diagram.activeLayer = layer;
        const layers: string[] = layer.objects;
        if (objects) {
            for (let i: number = 0; i < objects.length; i++) {
                this.diagram.add(objects[i]);
            }
        }
    }
    /**
     * getObjectLayer method\
     *
     * @returns { LayerModel }    getObjectLayer method .\
     * @param {string} objectName - provide the endPoint value.
     * @private
     */
    public getObjectLayer(objectName: string): LayerModel {
        const layers: LayerModel[] = this.diagram.layers;
        for (let i: number = 0; i < layers.length; i++) {
            const objIndex: number = layers[i].objects.indexOf(objectName);
            if (objIndex > -1) {
                return layers[i];
            }
        }
        return this.diagram.activeLayer;
    }
    /**
     * getLayer method\
     *
     * @returns { LayerModel }    getLayer method .\
     * @param {string} layerName - provide the endPoint value.
     * @private
     */
    public getLayer(layerName: string): LayerModel {
        const layers: LayerModel[] = this.diagram.layers;
        for (let i: number = 0; i < layers.length; i++) {
            if (layers[i].id === layerName) {
                return layers[i];
            }
        }
        return undefined;
    }
    /**
     * removeLayer method\
     *
     * @returns { void }    removeLayer method .\
     * @param {string} layerId - provide the endPoint value.
     * @param {boolean} isServerUpdate - provide the endPoint value.
     * @private
     */
    public removeLayer(layerId: string, isServerUpdate: boolean = true): void {
        const layers: LayerModel = this.getLayer(layerId);
        if (layers) {
            const index: number = this.diagram.layers.indexOf(layers);
            const layerObject: string[] = layers.objects;
            for (let i: number = layerObject.length - 1; i >= 0; i--) {
                this.diagram.unSelect(this.diagram.nameTable[layerObject[i]]);
                this.diagram.remove(this.diagram.nameTable[layerObject[i]]);
                if (layers.id !== 'default_layer') {
                    if (this.diagram.activeLayer.id === layerId) {
                        this.diagram.activeLayer = this.diagram.layers[this.diagram.layers.length - 1];
                    }
                }
            }
            if (isServerUpdate) {
                this.UpdateBlazorDiagramModelLayers(this.diagram.layers[index] as Layer, true);
            }
            delete this.diagram.layerZIndexTable[layers.zIndex];
            this.diagram.layers.splice(index, 1);
            if (this.diagram.mode !== 'SVG') {
                this.diagram.refreshDiagramLayer();
            }
        }
    }
    /**
     * moveObjects method\
     *
     * @returns { void }    moveObjects method .\
     * @param {string[]]} objects - provide the objects value.
     * @param {string} targetLayer - provide the targetLayer value.
     * @private
     */
    public moveObjects(objects: string[], targetLayer?: string): void {
        const layer: LayerModel = this.getLayer(targetLayer) || this.diagram.activeLayer;
        this.diagram.setActiveLayer(layer.id);
        let targerNodes: NodeModel | ConnectorModel;
        for (const i of objects) {
            const layer: LayerModel = this.getObjectLayer(i);
            const index: number = layer.objects.indexOf(i);
            if (index > -1) {
                targerNodes = this.diagram.nameTable[i];
                this.diagram.unSelect(targerNodes);
                this.diagram.remove(this.diagram.nameTable[i]);
                this.diagram.add(targerNodes);
            }
        }
    }
    /**
     * cloneLayer method\
     *
     * @returns { void }    cloneLayer method .\
     * @param {string[]} layerName - provide the objects value.
     * @private
     */
    public cloneLayer(layerName: string): void {
        const layers: LayerModel[] = this.diagram.layers;
        const layer: LayerModel = this.getLayer(layerName);
        if (layer) {
            const cloneObject: (NodeModel | ConnectorModel)[] = [];
            const newlayer: LayerModel = {
                id: layerName + '_' + randomId(), objects: [], visible: true, lock: false
            };
            this.addLayer(newlayer, null, true);
            (newlayer as Layer).zIndex = this.diagram.layers.length - 1;
            const multiSelect: boolean = cloneObject.length !== 1;
            for (const obj of layer.objects) {
                cloneObject.push(this.diagram.nameTable[obj]);
            }
            this.paste(cloneObject);
        }
    }

    /**
     * copy method\
     *
     * @returns { void }    copy method .\
     * @private
     */
    public copy(): Object {
        this.clipboardData.pasteIndex = 1;
        this.clipboardData.clipObject = this.copyObjects();
        return this.clipboardData.clipObject;
    }
    /**
     * copyObjects method\
     *
     * @returns { Object[] }    copyObjects method .\
     * @private
     */
    public copyObjects(): Object[] {
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        const obj: Object[] = [];
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
                if (!(selectedItems[j] as Node).isPhase) {
                    const node: NodeModel = clone(this.diagram.selectedItems.nodes[j]);
                    if (node.wrapper && (node.offsetX !== node.wrapper.offsetX)) {
                        node.offsetX = node.wrapper.offsetX;
                    }
                    if (node.wrapper && (node.offsetY !== node.wrapper.offsetY)) {
                        node.offsetY = node.wrapper.offsetY;
                    }
                    const processTable: {} = {};
                    this.copyProcesses(node as Node);
                    obj.push(clone(node));
                    const matrix: Matrix = identityMatrix();
                    rotateMatrix(matrix, -node.rotateAngle, node.offsetX, node.offsetY);
                    if (node.children) {
                        const childTable: {} = this.clipboardData.childTable;
                        let tempNode: NodeModel | ConnectorModel;
                        const elements: (NodeModel | ConnectorModel)[] = [];
                        const nodes: (NodeModel | ConnectorModel)[] = this.getAllDescendants(node, elements, true);
                        for (let i: number = 0; i < nodes.length; i++) {
                            tempNode = this.diagram.nameTable[nodes[i].id];
                            const clonedObject: NodeModel | ConnectorModel = childTable[tempNode.id] = clone(tempNode);
                            const newOffset: PointModel = transformPointByMatrix(
                                matrix, { x: clonedObject.wrapper.offsetX, y: clonedObject.wrapper.offsetY });
                            if (tempNode instanceof Node) {
                                (clonedObject as Node).offsetX = newOffset.x;
                                (clonedObject as Node).offsetY = newOffset.y;
                                (clonedObject as Node).rotateAngle -= node.rotateAngle;
                            }
                        }
                        this.clipboardData.childTable = childTable;
                    }
                    if (node.shape.type === 'SwimLane') {
                        const swimlane: NodeModel = this.diagram.getObject(this.diagram.selectedItems.nodes[j].id);
                        const childTable: {} = this.clipboardData.childTable;
                        const connectorsList: string[] = getConnectors(this.diagram, swimlane.wrapper.children[0] as GridPanel, 0, true);
                        for (let i: number = 0; i < connectorsList.length; i++) {
                            const connector: ConnectorModel = this.diagram.getObject(connectorsList[i]);
                            childTable[connector.id] = clone(connector);
                        }
                    }
                    if (node && (node as Node).isLane) {
                        const childTable: {} = this.clipboardData.childTable;
                        const swimlane: NodeModel = this.diagram.getObject((node as Node).parentId);
                        const lane: LaneModel = findLane(node as Node, this.diagram);
                        childTable[node.id] = cloneObject(lane);
                        childTable[node.id].width = swimlane.wrapper.actualSize.width;
                    }
                }
            }
        }
        if (this.clipboardData.pasteIndex === 0) {
            this.startGroupAction();
            for (const item of selectedItems) {
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
            const processes: string[] = (node.shape as BpmnShape).activity.subProcess.processes;
            for (const i of processes) {
                this.processTable[i] = (clone(this.diagram.nameTable[i]));
                if ((this.processTable[i].shape as BpmnShape).activity.subProcess.processes &&
                    (this.processTable[i].shape as BpmnShape).activity.subProcess.processes.length > 0) {
                    this.copyProcesses(this.processTable[i]);
                }
            }
            this.clipboardData.processTable = this.processTable;
        }
    }

    /**
     * group method\
     *
     * @returns { void }    group method .\
     * @private
     */
    public group(): void {
        this.oldSelectedObjects = cloneSelectedObjects(this.diagram);
        const propName: string = 'isProtectedOnChange';
        const protectedChange: boolean = this.diagram[propName];
        this.diagram.protectPropertyChange(true);
        this.diagram.diagramActions = this.diagram.diagramActions | DiagramAction.Group;
        let selectedItems: (NodeModel | ConnectorModel)[] = [];
        let obj: NodeModel = {};
        //let group: Node | Connector;
        obj.id = 'group' + randomId();
        obj = new Node(this.diagram, 'nodes', obj, true);
        obj.children = [];
        selectedItems = this.diagram.selectedItems.nodes;
        selectedItems = selectedItems.concat(this.diagram.selectedItems.connectors);
        let order: (NodeModel | ConnectorModel)[] = selectedItems.sort(function (a, b) {
            return a.zIndex - b.zIndex;
        });
        for (let i: number = 0; i < order.length; i++) {
            if (!(order[i] as Node).parentId) {
                obj.children.push(order[i].id);
            }
        }
        const group: Node | Connector = this.diagram.add(obj as IElement);
        if (group) {
            this.select(group);
        }
        const entry: HistoryEntry = { type: 'Group', undoObject: obj, redoObject: obj, category: 'Internal' };
        this.addHistoryEntry(entry);
        this.diagram.diagramActions = this.diagram.diagramActions & ~DiagramAction.Group;
        this.diagram.protectPropertyChange(protectedChange);
        this.updateBlazorSelector();
    }


    /**
     * unGroup method\
     *
     * @returns {  void }    unGroup method .\
     * @param {NodeModel} obj - provide the angle value.
     * @private
     */
    public unGroup(obj?: NodeModel): void {
        const propName: string = 'isProtectedOnChange';
        const protectedChange: boolean = this.diagram[propName];
        this.diagram.protectPropertyChange(true);
        this.diagram.diagramActions = this.diagram.diagramActions | DiagramAction.Group;
        let selectedItems: NodeModel[] = [];
        if (obj) {
            selectedItems.push(obj);
        } else {
            selectedItems = this.diagram.selectedItems.nodes;
        }
        this.diagram.startGroupAction();
        for (let i: number = 0; i < selectedItems.length; i++) {
            const node: NodeModel = selectedItems[i];
            const undoObject: object = cloneObject(node);
            const childCollection: string[] = [];
            for (let k: number = 0; k < node.children.length; k++) {
                childCollection.push(node.children[k]);
            }
            if (node.children) {
                if ((node as Node).ports && (node as Node).ports.length > 0) {
                    this.diagram.removePorts((node as Node), (node as Node).ports);
                }
                if ((node as Node).annotations && (node as Node).annotations.length > 0
                    && (!isBlazor() || isBlazor() && node.annotations[0].content !== '')) {
                    this.diagram.removeLabels((node as Node), (node as Node).annotations);
                }
                const parentNode: NodeModel = this.diagram.nameTable[(node as Node).parentId];
                for (let j: number = node.children.length - 1; j >= 0; j--) {
                    (this.diagram.nameTable[node.children[j]]).parentId = '';
                    this.diagram.deleteChild(this.diagram.nameTable[node.children[j]], node);
                    if ((node as Node).parentId && node.children[j]) {
                        this.diagram.addChild(parentNode, node.children[j]);
                    }
                }
                this.resetDependentConnectors((node as Node).inEdges, true);
                this.resetDependentConnectors((node as Node).outEdges, false);
                const entry: HistoryEntry = {
                    type: 'UnGroup', undoObject: undoObject,
                    redoObject: undoObject, category: 'Internal'
                };
                if (!(this.diagram.diagramActions & DiagramAction.UndoRedo)) {
                    this.addHistoryEntry(entry);
                }
                if ((node as Node).parentId) {
                    this.diagram.deleteChild(node, parentNode);
                }
            }
            this.diagram.removeNode(node, childCollection);
            this.clearSelection();
        }
        this.diagram.endGroupAction();
        this.diagram.diagramActions = this.diagram.diagramActions & ~DiagramAction.Group;
        this.diagram.protectPropertyChange(protectedChange);
    }

    private resetDependentConnectors(edges: string[], isInEdges: boolean): void {
        for (let i: number = 0; i < edges.length; i++) {
            const newConnector: ConnectorModel = this.diagram.nameTable[edges[i]];
            const undoObject: object = cloneObject(newConnector);
            let newProp: Connector;
            if (isInEdges) {
                newConnector.targetID = ''; newConnector.targetPortID = '';
                newProp = { targetID: newConnector.targetID, targetPortID: newConnector.targetPortID } as Connector;
            } else {
                newConnector.sourceID = ''; newConnector.sourcePortID = '';
                newProp = { sourceID: newConnector.sourceID, sourcePortID: newConnector.sourcePortID } as Connector;
            }
            this.diagram.connectorPropertyChange(newConnector as Connector, {} as Connector, newProp);
            const entry: HistoryEntry = {
                type: 'ConnectionChanged', undoObject: { connectors: [undoObject], nodes: [] },
                redoObject: { connectors: [cloneObject(newConnector)], nodes: [] }, category: 'Internal'
            };
            if (!(this.diagram.diagramActions & DiagramAction.UndoRedo)) {
                this.addHistoryEntry(entry);
            }
        }
    }

    /**
     * paste method\
     *
     * @returns { void }    paste method .\
     * @param {(NodeModel | ConnectorModel)[]} obj - provide the objects value.
     * @private
     */
    public paste(obj: (NodeModel | ConnectorModel)[]): void {
        if (obj || this.clipboardData.clipObject) {
            this.diagram.protectPropertyChange(true);
            const copiedItems: (NodeModel | ConnectorModel)[] = obj ? this.getNewObject(obj) :
                this.clipboardData.clipObject as (NodeModel | ConnectorModel)[];
            if (copiedItems) {
                const multiSelect: boolean = copiedItems.length !== 1;
                let groupAction: boolean = false;
                const objectTable: {} = {};
                const keyTable: {} = {};

                if (this.clipboardData.pasteIndex !== 0) {
                    this.clearSelection();
                }
                if (this.diagram.undoRedoModule) {
                    groupAction = true;
                    this.diagram.historyManager.startGroupAction();
                }
                for (const copy of copiedItems) {
                    objectTable[copy.id] = copy;
                }
                let copiedObject: (NodeModel | ConnectorModel)[] = [];
                if (multiSelect) {
                    // This bool is also consider to prevent selection change event is triggered after every object clone
                    this.diagram.isServerUpdate = true;
                }
                for (let j: number = 0; j < copiedItems.length; j++) {
                    const copy: NodeModel | ConnectorModel = copiedItems[j];
                    if (getObjectType(copy) === Connector) {
                        const clonedObj: ConnectorModel = clone(copy);
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
                        const newObj: ConnectorModel = this.cloneConnector(clonedObj, multiSelect);
                        copiedObject.push(newObj);
                        keyTable[copy.id] = newObj.id;

                    } else {
                        const newNode: NodeModel = this.cloneNode(copy as NodeModel, multiSelect);
                        if (isBlazor() && newNode && newNode.children && newNode.children.length > 0) {
                            copiedObject = copiedObject.concat(this.cloneGroupChildCollection);
                            this.cloneGroupChildCollection = [];
                        } else {
                            copiedObject.push(newNode);
                        }
                        //bpmn text annotations will not be pasted
                        if (newNode) {
                            keyTable[copy.id] = newNode.id;
                            let edges: string[] = (copy as Node).inEdges;
                            if (edges) {
                                for (const edge of edges) {
                                    if (objectTable[edge] && keyTable[edge]) {
                                        const newConnector: ConnectorModel = this.diagram.nameTable[keyTable[edge]];
                                        newConnector.targetID = keyTable[copy.id];
                                        this.diagram.connectorPropertyChange(
                                            newConnector as Connector, { targetID: '', targetPortID: '' } as Connector,
                                            { targetID: newConnector.targetID, targetPortID: newConnector.targetPortID } as Connector);
                                    }
                                }
                            }
                            edges = (copy as Node).outEdges;
                            if (edges) {
                                for (const edge of edges) {
                                    if (objectTable[edge] && keyTable[edge]) {
                                        const newConnector: ConnectorModel = this.diagram.nameTable[keyTable[edge]];
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
                if (multiSelect) {
                    this.diagram.isServerUpdate = false;
                    this.diagram.UpdateBlazorDiagramModelCollection(copiedItems[0] as Node, copiedObject);
                    this.getBlazorOldValues();
                    this.diagram.select(copiedObject, true);
                }
                if (groupAction === true) {
                    this.diagram.historyManager.endGroupAction();
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
        const newobjs: (Node | Connector)[] = [];
        this.clipboardData.pasteIndex = 1;
        for (let i: number = 0; i < obj.length; i++) {
            newObj = cloneObject(obj[i]) as Connector | Node;
            newobjs.push(newObj);
        }
        return newobjs as (Node | Connector)[];
    }

    private cloneConnector(connector: ConnectorModel, multiSelect: boolean): ConnectorModel {
        //let newConnector: Node | Connector;
        const cloneObject: Object = clone(connector);
        this.translateObject(cloneObject as Connector);
        (cloneObject as Node).zIndex = -1;
        const newConnector: Node | Connector = this.diagram.add(cloneObject);
        if (!this.diagram.isServerUpdate) {
            this.selectObjects([newConnector], multiSelect);
        }
        return newConnector as ConnectorModel;
    }

    private cloneNode(node: NodeModel, multiSelect: boolean, children?: string[], groupnodeID?: string): NodeModel {
        let newNode: NodeModel;
        const connectorsTable: {} = {};
        const cloneObject: Object = clone(node);
        let process: string[];
        const temp: NodeModel = this.diagram.nameTable[(node as Node).parentId];
        if (node.shape && node.shape.type === 'Bpmn' && (node.shape as BpmnShape).activity &&
            (node.shape as BpmnShape).activity.subProcess.processes
            && (node.shape as BpmnShape).activity.subProcess.processes.length) {
            process = ((cloneObject as Node).shape as BpmnShape).activity.subProcess.processes;
            (cloneObject as Node).zIndex = -1;
            ((cloneObject as Node).shape as BpmnShape).activity.subProcess.processes = undefined;
        }
        if (node.shape && node.shape.type === 'SwimLane') {
            pasteSwimLane(node, this.diagram, this.clipboardData);
        } else if (temp && temp.shape.type === 'SwimLane') {
            pasteSwimLane(clone(temp), this.diagram, this.clipboardData, node, true);
        } else if (node.children && node.children.length && (!children || !children.length)) {
            newNode = this.cloneGroup(node, multiSelect);
        } else if (node.shape && ((!isBlazor() && (node.shape as BpmnShape).shape === 'TextAnnotation') ||
            (isBlazor() && (node.shape as DiagramShape).bpmnShape === 'TextAnnotation')) && node.id.indexOf('_textannotation_') !== -1 &&
            this.diagram.nameTable[node.id]) {
            const checkAnnotation: string[] = node.id.split('_textannotation_');
            //const parentNode: Node;
            const annotation: Node = this.diagram.nameTable[node.id];
            for (let j: number = 0; j < annotation.inEdges.length; j++) {
                const connector: Connector = this.diagram.nameTable[annotation.inEdges[j]];
                if (connector) {
                    const parentNode: Node = this.diagram.nameTable[connector.sourceID];
                    const clonedNode: Node = this.getAnnotation(parentNode, checkAnnotation[1]) as Node;
                    const annotationNode: Object = {
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
            this.translateObject(cloneObject as Node, groupnodeID);
            (cloneObject as Node).zIndex = -1;
            if (children) { (cloneObject as Node).children = children; }
            newNode = this.diagram.add(cloneObject) as Node;
        }
        for (const i of Object.keys(connectorsTable)) {
            this.diagram.add(connectorsTable[i]);
        }
        if (process && process.length) {
            ((newNode as Node).shape as BpmnShape).activity.subProcess.processes = process;
            this.cloneSubProcesses(newNode);
        }
        if (newNode && !this.diagram.isServerUpdate) {
            this.selectObjects([newNode], multiSelect);
        }
        return newNode;
    }

    private getAnnotation(parent: Node, annotationId: string): BpmnAnnotationModel {
        const currentAnnotation: BpmnAnnotationModel[] = (parent.shape as BpmnShape).annotations;
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
        const connector: string[] = [];
        const temp: {} = {};
        if (node.shape.type === 'Bpmn' && (node.shape as BpmnShape).activity &&
            (node.shape as BpmnShape).activity.subProcess.processes
            && (node.shape as BpmnShape).activity.subProcess.processes.length) {
            const process: string[] = (node.shape as BpmnShape).activity.subProcess.processes;
            for (let g: number = 0; g < process.length; g++) {
                const child: Node = this.diagram.nameTable[process[g]] || this.clipboardData.processTable[process[g]];
                for (const j of child.outEdges) {
                    if (connector.indexOf(j) < 0) {
                        connector.push(j);
                    }
                }
                for (const j of child.inEdges) {
                    if (connector.indexOf(j) < 0) {
                        connector.push(j);
                    }
                }
                const innerChild: Node = cloneObject(this.clipboardData.processTable[process[g]]) as Node;
                innerChild.processId = node.id;
                const newNode: NodeModel = this.cloneNode(innerChild, false);
                temp[process[g]] = newNode.id;
                process[g] = newNode.id;
                this.diagram.addProcess(newNode, node.id);
                for (const i of connector) {
                    const node: ConnectorModel = this.diagram.nameTable[i] || this.diagram.connectorTable[i];
                    const clonedNode: Object = cloneObject(node);
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
        const newChildren: string[] = [];
        let children: string[] = [];
        const connectorObj: ConnectorModel[] = [];
        let newObj: NodeModel | ConnectorModel;
        const oldID: string[] = [];
        children = children.concat(obj.children);
        const id: string = randomId();
        const objectCollection: (NodeModel | ConnectorModel)[] = [];
        this.diagram.blazorActions |= BlazorAction.GroupClipboardInProcess;
        if (this.clipboardData.childTable || obj.children.length > 0) {
            for (let i: number = 0; i < children.length; i++) {
                let childObj: NodeModel | ConnectorModel;
                if (this.clipboardData.childTable) {
                    childObj = this.clipboardData.childTable[children[i]];
                } else {
                    childObj = this.diagram.nameTable[children[i]];
                }
                (childObj as Node).parentId = '';

                if (childObj) {
                    if (getObjectType(childObj) === Connector) {
                        connectorObj.push(childObj as ConnectorModel);
                    } else {
                        newObj = this.cloneNode(childObj as NodeModel, multiSelect, undefined, id);
                        oldID.push(childObj.id);
                        newChildren.push(newObj.id);
                        objectCollection.push(newObj);
                    }
                }
            }
        }
        for (let k: number = 0; k < connectorObj.length; k++) {
            if (connectorObj[k].sourceID || connectorObj[k].targetID) {
                for (let j: number = 0; j < oldID.length; j++) {
                    if (connectorObj[k].sourceID === (oldID[j])) {
                        connectorObj[k].sourceID += id;
                    }
                    if (connectorObj[k].targetID === (oldID[j])) {
                        connectorObj[k].targetID += id;
                    }
                }
            }
            newObj = this.cloneConnector(connectorObj[k], multiSelect);
            newChildren.push(newObj.id);
            objectCollection.push(newObj);
        }
        const parentObj: NodeModel = this.cloneNode(obj, multiSelect, newChildren);
        objectCollection.push(parentObj);
        if (parentObj && parentObj.container && parentObj.shape && parentObj.shape.type === 'UmlClassifier') {
            this.diagram.updateDiagramObject(parentObj);
            parentObj.wrapper.measure(new Size());
        }
        this.diagram.blazorActions &= ~BlazorAction.GroupClipboardInProcess;
        if (!this.diagram.isServerUpdate) {
            this.diagram.UpdateBlazorDiagramModelCollection(undefined, objectCollection, undefined, true);
        } else {
            this.cloneGroupChildCollection = objectCollection;
        }
        return parentObj;
    }

    /**
     * translateObject method\
     *
     * @returns { Object[] }    translateObject method .\
     * @param {Node | Connector} obj - provide the objects value.
     * @param {string} groupnodeID - provide the objects value.
     * @private
     */
    public translateObject(obj: Node | Connector, groupnodeID?: string): void {
        obj.id += groupnodeID || randomId();
        const diff: number = this.clipboardData.pasteIndex * 10;
        if (getObjectType(obj) === Connector) {
            (obj as Connector).sourcePoint = {
                x: (obj as Connector).sourcePoint.x + diff, y: (obj as Connector).sourcePoint.y + diff
            };
            (obj as Connector).targetPoint = {
                x: (obj as Connector).targetPoint.x + diff, y: (obj as Connector).targetPoint.y + diff
            };
            if ((obj as Connector).type === 'Bezier') {
                const segments: BezierSegment[] = ((obj as Connector).segments as BezierSegment[]);
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
                    const segments: (StraightSegmentModel | BezierSegmentModel)[] = (obj as Connector).segments;
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
     * drawObject method\
     *
     * @returns { Node | Connector }    drawObject method .\
     * @param {Node | Connector} obj - provide the objects value.
     * @private
     */
    public drawObject(obj: Node | Connector): Node | Connector {
        let oldProtectPropertyChangeValue: boolean;
        if (isBlazor()) {
            oldProtectPropertyChangeValue = this.diagram.getProtectPropertyChangeValue();
            this.diagram.protectPropertyChange(true);
        }
        let newObj: Node | Connector;
        //let cloneObject: Node | Connector;
        if (obj && obj.shape) {
            if (obj.shape.type === 'Text') {
                (obj as Node).width = (this.diagram.drawingObject as Node).width ? (this.diagram.drawingObject as Node).width : 50;
                (obj as Node).height = (this.diagram.drawingObject as Node).height ? (this.diagram.drawingObject as Node).height : 20;
            }
        }
        const cloneObject: Node | Connector = clone(this.diagram.drawingObject) as Node | Connector;
        for (const prop of Object.keys(obj)) {
            cloneObject[prop] = obj[prop];
        }
        if (getObjectType(this.diagram.drawingObject) === Node) {
            newObj = new Node(this.diagram, 'nodes', cloneObject, true);
            newObj.id = (this.diagram.drawingObject.id || 'node') + randomId();
        } else {
            newObj = new Connector(this.diagram, 'connectors', cloneObject, true);
            if (isBlazor() && !this.diagram.drawingObject) {
                newObj.type === 'Orthogonal';
            }
            newObj.id = (this.diagram.drawingObject ? (this.diagram.drawingObject.id ? this.diagram.drawingObject.id : 'connector')
                : 'connector') + randomId();
        }
        if (isBlazor()) {
            updateDefaultValues(
                newObj, cloneObject,
                (getObjectType(this.diagram.drawingObject) === Node) ? this.diagram.nodeDefaults : this.diagram.connectorDefaults
            );
        }
        this.diagram.initObject(newObj as Node | Connector);
        this.diagram.updateDiagramObject(newObj);
        this.diagram.currentDrawingObject = newObj;
        if (isBlazor()) {
            this.diagram.protectPropertyChange(oldProtectPropertyChangeValue);
        }
        return newObj;
    }

    /**
     * addObjectToDiagram method\
     *
     * @returns { void }    addObjectToDiagram method .\
     * @param {Node | Connector} obj - provide the objects value.
     * @private
     */
    public addObjectToDiagram(obj: Node | Connector): void {
        //let newObj: Node | Connector;
        this.diagram.removeFromAQuad(obj);
        this.diagram.removeObjectsFromLayer(this.diagram.nameTable[obj.id]);
        delete this.diagram.nameTable[obj.id];
        const newObj: Node | Connector = this.diagram.add(obj);
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
     * addObjectToDiagram method\
     *
     * @returns { void }    addObjectToDiagram method .\
     * @param {boolean} enable - provide the objects value.
     * @private
     */
    public enableServerDataBinding(enable: boolean): void {
        this.diagram.enableServerDataBinding(enable);
    }

    /**
     * addText method\
     *
     * @returns { void }    addText method .\
     * @param {boolean} obj - provide the objects value.
     * @param {PointModel} currentPosition - provide the objects value.
     * @private
     */
    public addText(obj: Node | Connector, currentPosition: PointModel): void {
        const annotation: DiagramElement = this.diagram.findElementUnderMouse(obj, currentPosition);
        this.diagram.startTextEdit(obj, annotation instanceof TextElement ? (annotation.id).split('_')[1] : undefined);
    }

    private updateArgsObject(
        obj: (NodeModel | ConnectorModel)[], arg1: IBlazorSelectionChangeEventArgs, argValue: DiagramEventObjectCollection): void {
        if (obj) {
            let connector: boolean;
            for (let i: number = 0; i < obj.length; i++) {
                connector = (getObjectType(obj[i]) === Connector);
                if (connector) {
                    // In Blazor web assembly, deserialize the object. Itb takes time. - Suganthi
                    //argValue.connectors.push(cloneBlazorObject(obj[i]));
                    argValue.connectorCollection.push(obj[i].id);
                } else {
                    //argValue.nodes.push(cloneBlazorObject(obj[i]));
                    argValue.nodeCollection.push(obj[i].id);
                }
                //connector ? argValue.connectors.push(cloneBlazorObject(obj[i])) : argValue.nodes.push(cloneBlazorObject(obj[i]));
            }
        }
    }

    private updateSelectionChangeEventArgs(
        arg: IBlazorSelectionChangeEventArgs | ISelectionChangeEventArgs,
        obj: (NodeModel | ConnectorModel)[],
        oldValue?: (NodeModel | ConnectorModel)[]): IBlazorSelectionChangeEventArgs | ISelectionChangeEventArgs {
        if (isBlazor()) {
            arg = {
                cause: this.diagram.diagramActions, newValue: {}, oldValue: {},
                state: arg.state, type: arg.type, cancel: false
            } as IBlazorSelectionChangeEventArgs;
            const argOldValue: DiagramEventObjectCollection = arg.oldValue; const argNewValue: DiagramEventObjectCollection = arg.newValue;
            argOldValue.connectors = [];
            argOldValue.nodes = [];
            argNewValue.connectors = [];
            argNewValue.nodes = [];
            argOldValue.nodeCollection = [];
            argOldValue.connectorCollection = [];
            argNewValue.nodeCollection = [];
            argNewValue.connectorCollection = [];
            this.updateArgsObject(this.getSelectedObject(), arg, argNewValue);
            this.updateArgsObject(oldValue, arg, argOldValue);
            return arg;
        }
        return arg;
    }
    /**
     * isUserHandle method\
     *
     * @returns { boolean }    isUserHandle method .\
     * @param {PointModel} position - provide the objects value.
     * @private
     */
    public isUserHandle(position: PointModel): boolean {
        const handle: SelectorModel = this.diagram.selectedItems;
        if (handle.wrapper && canShowCorner(handle.constraints, 'UserHandle')) {
            for (const obj of handle.userHandles) {
                if (obj.visible) {
                    const paddedBounds: PointModel = getUserHandlePosition(handle, obj, this.diagram.scroller.transform);
                    if (contains(position, paddedBounds, obj.size / (2 * this.diagram.scroller.transform.scale))) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    /**
     * selectObjects method\
     *
     * @returns { Promise<void> }    selectObjects method .\
     * @param {(NodeModel | ConnectorModel)[]} obj - provide the objects value.
     * @param {boolean} multipleSelection - provide the objects value.
     * @param {(NodeModel | ConnectorModel)[]} oldValue - provide the objects value.
     * @private
     */
    public async selectObjects(
        obj: (NodeModel | ConnectorModel)[], multipleSelection?: boolean, oldValue?: (NodeModel | ConnectorModel)[]): Promise<void> {
        let arg: ISelectionChangeEventArgs | IBlazorSelectionChangeEventArgs = {
            oldValue: oldValue ? oldValue : this.getSelectedObject(),
            newValue: obj, cause: this.diagram.diagramActions,
            state: 'Changing', type: 'Addition', cancel: false
        };
        // EJ2-57157 - Added to consider the lane header at selection change when selecting a lane.
        if (obj.length > 0 &&(obj[0] &&(obj[0] as SwimLaneModel).isLane)) {
            let swimlaneNode: NodeModel = this.diagram.getObject((obj[0] as Node).parentId);
            (obj[0].shape as any).header = [];
            let laneId: string = '';
            for (let j = 0; j < obj.length; j++) {
                for (let i = 0; i < (swimlaneNode.shape as SwimLaneModel).lanes.length; i++) {
                    let parentId = (obj[0] as Node).id.split((obj[0] as Node).parentId);
                    laneId = parentId[1].slice(0, -1);
                    if (laneId === (swimlaneNode.shape as SwimLaneModel).lanes[i].id) {
                        (obj[0].shape as any).header.push((swimlaneNode.shape as SwimLaneModel).lanes[i].header)
                    }
                }
            }
        }
        this.diagram.enableServerDataBinding(false);
        let select: boolean = true;
        if (!isBlazor()) {
            this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
        } else {
            this.oldSelectedObjects = cloneSelectedObjects(this.diagram);
        }
        let oldSelectedItems = (this.diagram.selectedItems.nodes.concat(this.diagram.selectedItems.connectors as NodeModel));
        const canDoMultipleSelection: number = canMultiSelect(this.diagram);
        const canDoSingleSelection: number = canSingleSelect(this.diagram);
        if (canDoSingleSelection || canDoMultipleSelection) {
            if (!canDoMultipleSelection && ((obj.length > 1) || (multipleSelection && obj.length === 1))) {
                if (obj.length === 1) {
                    this.clearSelection();
                } else {
                    return;
                }
            }
            if (!(canDoSingleSelection || canDoMultipleSelection) && obj.length === 1
                && (!multipleSelection || !hasSelection(this.diagram))) {
                this.clearSelection();
                return;
            }
        }
        if (!arg.cancel) {
            for (let i: number = 0; i < obj.length; i++) {
                const newObj: NodeModel | ConnectorModel = obj[i];
                if (newObj) {
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
            }
            if (oldValue === undefined) {
                oldValue = oldSelectedItems;
            }
            arg = {
                oldValue: oldValue ? oldValue : [] as NodeModel[],
                newValue: this.getSelectedObject() as NodeModel[],
                cause: this.diagram.diagramActions, state: 'Changed', type: 'Addition', cancel: false
            };
            this.diagram.renderSelector(multipleSelection || (obj && obj.length > 1));
            this.updateBlazorSelectorModel(oldValue);
            if (isBlazor() && this.diagram.selectionChange) {
                arg = this.updateSelectionChangeEventArgs(arg, obj, oldValue ? oldValue : []);
                this.updateBlazorSelector();
            }
            if (!isBlazor()) {
                this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
            } else {
                let blazorArgs: void | object;
                if (window && window[this.blazor] && this.diagram.selectionChange) {
                    const eventObj: object = { 'EventName': 'selectionChange', args: JSON.stringify(arg) };
                    blazorArgs = await window[this.blazorInterop].updateBlazorDiagramEvents(eventObj, this.diagram);
                }
                // let blazorArgs: void | object = await this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
                if (blazorArgs && (blazorArgs as IBlazorSelectionChangeEventArgs).cancel) {
                    let selectedObjects: (NodeModel | ConnectorModel)[] = [];
                    if ((blazorArgs as IBlazorSelectionChangeEventArgs).oldValue.nodes.length > 0) {
                        selectedObjects = (blazorArgs as IBlazorSelectionChangeEventArgs).oldValue.nodes;
                    }
                    if ((blazorArgs as IBlazorSelectionChangeEventArgs).oldValue.connectors.length > 0) {
                        selectedObjects = selectedObjects.concat((blazorArgs as IBlazorSelectionChangeEventArgs).oldValue.connectors);
                    }
                    if (selectedObjects) {
                        if (selectedObjects.length > 0) {
                            for (let i: number = 0; i < selectedObjects.length; i++) {
                                this.select(
                                    this.diagram.nameTable[selectedObjects[i].id], (i !== 0 && selectedObjects.length > 1) ? true : false);
                            }
                        } else {
                            this.clearSelection();
                        }
                    }
                }
            }
            this.diagram.enableServerDataBinding(true); this.updateBlazorSelector();
        }
    }

    /**
     * updateBlazorSelector method\
     *
     * @returns { void }    updateBlazorSelector method .\
     * @private
     */
    public updateBlazorSelector(): void {
        if (isBlazor() && this.oldSelectedObjects) {
            this.newSelectedObjects = cloneSelectedObjects(this.diagram);
            const result: object = this.deepDiffer.map(cloneObject(this.newSelectedObjects), this.oldSelectedObjects);
            const diffValue: object = this.deepDiffer.frameObject({}, result);
            const diff: object = this.deepDiffer.removeEmptyValues(diffValue);
            (diff as SelectorModel).nodes = [];
            for (let i: number = 0; i < this.diagram.selectedItems.nodes.length; i++) {
                (diff as SelectorModel).nodes.push(this.diagram.selectedItems.nodes[i].id as NodeModel);
            }
            (diff as SelectorModel).connectors = [];
            for (let i: number = 0; i < this.diagram.selectedItems.connectors.length; i++) {
                (diff as SelectorModel).connectors.push(this.diagram.selectedItems.connectors[i].id as ConnectorModel);
            }
            const blazorInterop: string = 'sfBlazor';
            const blazor: string = 'Blazor';
            if (window && window[blazor]) {
                const obj: object = { 'methodName': 'UpdateBlazorProperties', 'diagramobj': { selectedItems: diff } };
                window[blazorInterop].updateBlazorProperties(obj, this.diagram);
            }
            this.oldSelectedObjects = undefined;
            this.newSelectedObjects = undefined;
        }
    }
    /**
     * findParent method\
     *
     * @returns { Node }    findParent method .\
     * @param {Node} node - provide the objects value.
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
            const processes: string[] = ((newObj).shape as BpmnShape).activity.subProcess.processes;
            for (let i: number = 0; i < processes.length; i++) {
                const innerChild: (NodeModel | ConnectorModel) = this.diagram.nameTable[processes[i]];
                if (this.hasProcesses(innerChild as Node)) {
                    this.selectObjects([innerChild], true);
                }
                this.unSelect(innerChild);
            }
        }
    }
    private selectGroup(newObj: Node): void {
        for (let j: number = 0; j < (newObj as Node).children.length; j++) {
            const innerChild: (NodeModel | ConnectorModel) = this.diagram.nameTable[(newObj as Node).children[j]];
            if ((innerChild as Node).children) { this.selectGroup(innerChild as Node); }
            this.unSelect(this.diagram.nameTable[(newObj as Node).children[j]]);
        }
    }


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
        } else if (node.parentId && this.diagram.nameTable[node.parentId] &&
            this.diagram.nameTable[node.parentId].shape.type === 'UmlClassifier') {
            if (isSelected(this.diagram, this.diagram.nameTable[node.parentId])) {
                select = false;
            }
        }
        return select;
    }


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


    /**
     * select method\
     *
     * @returns { void }    select method .\
     * @param {NodeModel | ConnectorModel} obj - provide the objects value.
     * @param {boolean} multipleSelection - provide the objects value.
     * @param {boolean} preventUpdate - provide the objects value.
     * @private
     */
    public select(obj: NodeModel | ConnectorModel, multipleSelection?: boolean, preventUpdate?: boolean): void {
        const hasLayer: LayerModel = this.getObjectLayer(obj.id);
        if ((canSelect(obj) && !(obj instanceof Selector) && !isSelected(this.diagram, obj))
            && (hasLayer && !hasLayer.lock && hasLayer.visible) && obj.wrapper.visible) {
            multipleSelection = hasSelection(this.diagram) ? multipleSelection : false;
            if (!multipleSelection) {
                this.clearSelection();
            }
            this.diagram.enableServerDataBinding(false);
            const selectorModel: SelectorModel = this.diagram.selectedItems;
            const convert: Node | Connector = obj as Node | Connector;
            if (convert instanceof Node) {
                if ((obj as Node).isHeader) {
                    const node: Node = this.diagram.nameTable[(obj as Node).parentId];
                    selectorModel.nodes.push(node);
                } else {
                    selectorModel.nodes.push((obj as Node));
                }
            } else {
                selectorModel.connectors.push(obj as ConnectorModel);
            }
            // EJ2-56919 - Push the newly selected objects in selectedObjects collection
            selectorModel.selectedObjects.push(obj);
            if (!multipleSelection) {
                (selectorModel as Selector).init(this.diagram);
                if (selectorModel.nodes.length === 1 && selectorModel.connectors.length === 0) {
                    const wrapper: Canvas = gridSelection(this.diagram, selectorModel);
                    if (wrapper) {
                        selectorModel.wrapper.children[0] = wrapper;
                    }
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
            this.diagram.enableServerDataBinding(true);
        }
    }

    private getObjectCollectionId(isNode: boolean, clearSelection?: boolean): string[] {
        const id: string[] = [];
        let i: number = 0;
        const selectedObject: (NodeModel | ConnectorModel)[] = isNode ? this.diagram.selectedItems.nodes
            : this.diagram.selectedItems.connectors;
        while (!clearSelection && i < selectedObject.length) {
            id[i] = selectedObject[i].id;
            i++;
        }
        return id;
    }

    private updateBlazorSelectorModel(oldItemsCollection: (NodeModel | ConnectorModel)[], clearSelection?: boolean): void {
        const blazorInterop: string = 'sfBlazor';
        if (window && window[blazorInterop]) {
            let i: number = 0;
            let nodes: string[] = [];
            let connectors: string[] = [];
            const oldItems: string[] = [];
            while (oldItemsCollection && i < oldItemsCollection.length) {
                oldItems[i] = oldItemsCollection[i].id;
                i++;
            }
            i = 0;
            nodes = this.getObjectCollectionId(true, clearSelection);
            connectors = this.getObjectCollectionId(false, clearSelection);
            const items: object = { nodes: nodes, connectors: connectors };
            const newItems: object = cloneBlazorObject(items);
            if (window[blazorInterop].updateDiagramCollection) {
                window[blazorInterop].updateDiagramCollection.call(this.diagram, 'selectedItems', newItems, oldItems, false, true);
            }
        }
    }
    /**
     * labelSelect method\
     *
     * @returns { void }    labelSelect method .\
     * @param {NodeModel | ConnectorModel} obj - provide the objects value.
     * @param {DiagramElement} textWrapper - provide the objects value.
     * @private
     */
    public labelSelect(obj: NodeModel | ConnectorModel, textWrapper: DiagramElement): void {
        this.oldSelectedObjects = cloneSelectedObjects(this.diagram);
        const selectorModel: Selector = (this.diagram.selectedItems) as Selector;
        const isEnableServerDatabind: boolean = this.diagram.allowServerDataBinding;
        this.diagram.allowServerDataBinding = false;
        selectorModel.nodes = selectorModel.connectors = [];
        this.diagram.allowServerDataBinding = isEnableServerDatabind;
        if (obj instanceof Node) {
            selectorModel.nodes[0] = obj as NodeModel;
        } else {
            selectorModel.connectors[0] = obj as ConnectorModel;
        }
        selectorModel.annotation = (this.findTarget(textWrapper, obj as IElement)) as PathAnnotationModel | ShapeAnnotationModel;
        selectorModel.init(this.diagram);
        this.diagram.renderSelector(false);
        this.updateBlazorSelector();
    }

    /**
     * unSelect method\
     *
     * @returns { void }    unSelect method .\
     * @param {NodeModel | ConnectorModel} obj - provide the objects value.
     * @private
     */
    public unSelect(obj: NodeModel | ConnectorModel): void {
        const objArray: (NodeModel | ConnectorModel)[] = [];
        objArray.push(obj);
        let items = (this.diagram.selectedItems.nodes.concat(this.diagram.selectedItems.connectors as NodeModel));
        let selectedObjects = items.filter(function (items) {
            return items.id !== obj.id;
        });
        let arg: ISelectionChangeEventArgs | IBlazorSelectionChangeEventArgs = {
            oldValue: items, newValue: selectedObjects, cause: this.diagram.diagramActions,
            state: 'Changing', type: 'Removal', cancel: false
        };
        if (!this.diagram.currentSymbol) {
            if (!isBlazor()) {
                this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
            }
        }
        if (isSelected(this.diagram, obj)) {
            const selectormodel: SelectorModel = this.diagram.selectedItems;
            let index: number;
            if (obj instanceof Node) {
                index = selectormodel.nodes.indexOf(obj as NodeModel, 0);
                selectormodel.nodes.splice(index, 1);
            } else {
                index = selectormodel.connectors.indexOf(obj as ConnectorModel, 0);
                selectormodel.connectors.splice(index, 1);
            }
            index = selectormodel.selectedObjects.indexOf(obj, 0);
            selectormodel.selectedObjects.splice(index, 1);
            arg = {
                oldValue: items, newValue: selectedObjects, cause: this.diagram.diagramActions,
                state: 'Changed', type: 'Removal', cancel: false
            };
            this.updateBlazorSelectorModel(objArray);
            arg = {
                oldValue: cloneBlazorObject(items) as NodeModel[], newValue: selectedObjects, cause: this.diagram.diagramActions,
                state: 'Changed', type: 'Removal', cancel: arg.cancel
            };
            if (!arg.cancel) {
                index = selectormodel.wrapper.children.indexOf(obj.wrapper, 0);
                selectormodel.wrapper.children.splice(index, 1);
                this.diagram.updateSelector();
                if (!this.diagram.currentSymbol) {
                    if (isBlazor()) {
                        arg = this.updateSelectionChangeEventArgs(arg, [], objArray);
                        this.updateBlazorSelector();
                        if (window && window[this.blazor] && this.diagram.selectionChange) {
                            const eventObj: object = { 'EventName': 'selectionChange', args: JSON.stringify(arg) };
                            window[this.blazorInterop].updateBlazorDiagramEvents(eventObj, this.diagram);
                        }
                    } else {
                        this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
                    }
                }
            }
        }
    }
    /**
     * getChildElements method\
     *
     * @returns { string[] }    getChildElements method .\
     * @param {DiagramElement[]} child - provide the objects value.
     * @private
     */
    public getChildElements(child: DiagramElement[]): string[] {
        const children: string[] = [];
        for (let i: number = 0; i < child.length; i++) {
            const childNode: DiagramElement = child[i];
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
    /**
     * moveSvgNode method\
     *
     * @returns { void }    moveSvgNode method .\
     * @param {string} nodeId - provide the objects value.
     * @param {string} targetID - provide the objects value.
     * @private
     */
    public moveSvgNode(nodeId: string, targetID: string): void {
        const diagramDiv: HTMLElement = getDiagramElement(targetID + '_groupElement', this.diagram.element.id);
        const backNode: HTMLElement = getDiagramElement(nodeId + '_groupElement', this.diagram.element.id);
        diagramDiv.parentNode.insertBefore(backNode, diagramDiv);
    }
    /**
     * sendLayerBackward method\
     *
     * @returns { void }    sendLayerBackward method .\
     * @param {string} layerName - provide the objects value.
     * @private
     */
    public sendLayerBackward(layerName: string): void {
        const layer: LayerModel = this.getLayer(layerName);
        if (layer && layer.zIndex !== 0) {
            const index: number = layer.zIndex;
            if (this.diagram.mode === 'SVG') {
                const currentLayerObject: string[] = layer.objects;
                const targetObject: string = this.getLayer(this.diagram.layerZIndexTable[index - 1]).objects[0];
                if (targetObject) {
                    for (const obj of currentLayerObject) {
                        this.moveSvgNode(obj, targetObject);
                    }
                }
            }
            const targetLayer: LayerModel = this.getLayer(this.diagram.layerZIndexTable[index - 1]);
            targetLayer.zIndex = targetLayer.zIndex + 1;
            layer.zIndex = layer.zIndex - 1;
            const temp: string = this.diagram.layerZIndexTable[index];
            this.diagram.layerZIndexTable[index] = this.diagram.layerZIndexTable[index - 1];
            this.diagram.layerZIndexTable[index - 1] = temp;
            if (this.diagram.mode === 'Canvas') {
                this.diagram.refreshDiagramLayer();
            }
        }
    }
    /**
     * bringLayerForward method\
     *
     * @returns { void }    bringLayerForward method .\
     * @param {string} layerName - provide the objects value.
     * @private
     */
    public bringLayerForward(layerName: string): void {
        const layer: LayerModel = this.getLayer(layerName);
        if (layer && layer.zIndex < this.diagram.layers.length - 1) {
            const index: number = layer.zIndex;
            const targetLayer: LayerModel = this.getLayer(this.diagram.layerZIndexTable[index + 1]);
            if (this.diagram.mode === 'SVG') {
                const currentLayerObject: string = layer.objects[0];
                const targetLayerObjects: string[] = targetLayer.objects;
                for (const obj of targetLayerObjects) {
                    if (obj) {
                        this.moveSvgNode(obj, currentLayerObject);
                    }
                }
            }
            targetLayer.zIndex = targetLayer.zIndex - 1;
            layer.zIndex = layer.zIndex + 1;
            const temp: string = this.diagram.layerZIndexTable[index];
            this.diagram.layerZIndexTable[index] = this.diagram.layerZIndexTable[index + 1];
            this.diagram.layerZIndexTable[index + 1] = temp;

            if (this.diagram.mode === 'Canvas') {
                this.diagram.refreshDiagramLayer();
            }
        }
    }
    /**
     * sendToBack method\
     *
     * @returns { void }    sendToBack method .\
     * @param {NodeModel | ConnectorModel} object - provide the objects value.
     * @private
     */
     public sendToBack(object?: NodeModel | ConnectorModel): void {
        this.diagram.protectPropertyChange(true);
        if (hasSelection(this.diagram) || object) {
            // EJ2-57772 - Added the below code to iterate all the selected nodes / connectors in the diagram and 
            // perform send to back operation
            const selectedItems: SelectorModel = this.diagram.selectedItems;
            let objects: (NodeModel | ConnectorModel)[] = [];
            if (object && object.id) {
                objects.push(object);
            } else {
                objects = objects.concat(selectedItems.nodes);
                objects = objects.concat(selectedItems.connectors);
            }
            let objectId: string = (object && object.id);
            for (let i: number = 0; i < objects.length; i++) {
                let clonedObject = cloneObject(objects[i]);
                objectId = objects[i].id;
                const index: number = this.diagram.nameTable[objectId].zIndex;
                const layerNum: number = this.diagram.layers.indexOf(this.getObjectLayer(objectId));
                const zIndexTable: {} = (this.diagram.layers[layerNum] as Layer).zIndexTable;
                const tempTable: {} = JSON.parse(JSON.stringify(zIndexTable));
                const undoObject: SelectorModel = cloneObject(this.diagram.selectedItems);
                let tempIndex: number = 0;
                //Checks whether the selected node is the only node in the node array.
                //Checks whether it is not a group and the nodes behind it are not it’s children.
                if (this.diagram.nodes.length !== 1 && (this.diagram.nameTable[objectId].children === undefined ||
                    this.checkObjectBehind(objectId, zIndexTable, index))) {
                    let obj: NodeModel = this.diagram.nameTable[objectId];
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
                    for (let i: number = index; i > 0; i--) {
                        if (zIndexTable[i]) {
                            this.diagram.nameTable[zIndexTable[i]].zIndex = i;
                        }
                    }
                    if (obj.shape.type !== 'SwimLane') {
                        zIndexTable[0] = this.diagram.nameTable[objectId].id;
                        this.diagram.nameTable[objectId].zIndex = 0;
                    } else {
                        tempIndex = this.swapZIndexObjects(index, zIndexTable, objectId, tempTable);
                    }
                    if (this.diagram.mode === 'SVG') {
                        let obj: NodeModel = this.diagram.nameTable[objectId];
                        let i: number = obj.shape.type !== 'SwimLane' ? 1 : tempIndex;
                        if (i !== tempIndex) {
                            i = (obj.children && obj.children.length > 0) ? index : 1;
                        }
                        let target: string = zIndexTable[i];
                        // EJ2-49326 - (CR issue fix) An exception raised when send the swimlane back to the normal node.
                        while (!target && i < index) {
                            target = zIndexTable[++i];
                        }
                        // EJ2-46656 - CR issue fix
                        target = this.resetTargetNode(objectId, target, i, zIndexTable);
                        target = this.diagram.nameTable[target].parentId ? this.checkParentExist(target) : target;
                        this.moveSvgNode(objectId, target);
                        this.updateNativeNodeIndex(objectId);
                    } else {
                        this.diagram.refreshCanvasLayers();
                    }
                    const redoObject: SelectorModel = cloneObject(this.diagram.selectedItems);
                    const entry: HistoryEntry = { type: 'SendToBack', category: 'Internal', undoObject: undoObject, redoObject: redoObject };
                    if (!(this.diagram.diagramActions & DiagramAction.UndoRedo)) {
                        this.addHistoryEntry(entry);
                    }
                }
                this.triggerOrderCommand(clonedObject, objects[i], objects[i]);
            }
        }
        this.diagram.protectPropertyChange(false);
        if (isBlazor()) {
            this.getZIndexObjects();
        }
    }

    private swapZIndexObjects(index: number, zIndexTable: {}, objectId: string, tempTable: {}): number {
        let tempIndex: number = 0;
        let childCount: number = 0;
        let childIndex: number = -1;
        let j: number = 1;
        // Get the swimlane's Children count
        for (let i: number = 0; i <= index; i++) {
            if (zIndexTable[i] && this.diagram.nameTable[zIndexTable[i]].parentId === objectId) {
                // Get the swimlane's first children position from z index table
                if (childIndex === -1) {
                    childIndex = i;
                }
                childCount++;
            }
        }
        // Swap the swimlane children to the top of the z index table
        for (let i: number = 0; i <= index; i++) {
            if (zIndexTable[i] && j <= childCount) {
                while (!zIndexTable[childIndex]) {
                    childIndex++;
                }
                zIndexTable[i] = zIndexTable[childIndex];
                this.diagram.nameTable[zIndexTable[i]].zIndex = i;
                childIndex++;
                j++;
            }
        }
        let k: number = 0;
        // Get the Z index from ZindexTable in the child's count position. In that position we want to put the swimlane
        for (let i: number = 0; i < childCount; i++) {
            while (!zIndexTable[k]) {
                k++;
            }
            tempIndex = this.diagram.nameTable[zIndexTable[k]].zIndex;
            k++;
        }
        tempIndex = tempIndex + 1;
        // Check if there is a object in the z index table or not
        while (!zIndexTable[tempIndex]) {
            ++tempIndex;
        }
        k = 0;
        // Place the swimlane at the next position of the swimlane's last children.
        zIndexTable[tempIndex] = this.diagram.nameTable[objectId].id;
        this.diagram.nameTable[objectId].zIndex = tempIndex;
        tempIndex = tempIndex + 1;
        // Now swap the intersect nodes at next position of the swimlane.
        for (let i: number = tempIndex; i <= index; i++) {
            if (zIndexTable[i]) {
                while (!tempTable[k]) {
                    k++;
                }
                zIndexTable[i] = tempTable[k];
                this.diagram.nameTable[zIndexTable[i]].zIndex = i;
                k++;
            }
        }
        return tempIndex;
    }

    private resetTargetNode(objectId: string, target: string, i: number, zIndexTable: {}): string {
        if (this.diagram.nameTable[objectId].shape.type === 'SwimLane'
            && this.diagram.nameTable[target].parentId != undefined && this.diagram.nameTable[target].parentId != "" && this.diagram.nameTable[this.diagram.nameTable[target].parentId].isLane) {
            i = i + 1;
            if (zIndexTable[i]) {
                target = zIndexTable[i]
                return target = this.resetTargetNode(objectId, target, i, zIndexTable)
            } else {
                return target;
            }
        } else {
            return target;
        }
    }
    private getZIndexObjects(): void {
        const element: (NodeModel | ConnectorModel)[] = [];
        let i: number; let j: number;
        for (i = 0; i < this.diagram.nodes.length; i++) {
            element.push(this.diagram.nodes[i]);
        }
        for (j = 0; j < this.diagram.connectors.length; j++) {
            element.push(this.diagram.connectors[j]);
        }
        this.updateBlazorZIndex(element);
    }

    private updateBlazorZIndex(element: (NodeModel | ConnectorModel)[]): void {
        const blazorInterop: string = 'sfBlazor';
        const blazor: string = 'Blazor';
        let diagramobject: object = {};
        const nodeObject: NodeModel[] = [];
        const connectorObject: ConnectorModel[] = [];
        let k: number;
        if (element && element.length > 0) {
            for (k = 0; k < element.length; k++) {
                const elementObject: (NodeModel | ConnectorModel) = element[k];
                if (elementObject instanceof Node) {
                    nodeObject.push(this.getBlazorObject(elementObject));
                } else if (elementObject instanceof Connector) {
                    connectorObject.push(this.getBlazorObject(elementObject));
                }
            }
        }
        diagramobject = {
            nodes: nodeObject,
            connectors: connectorObject
        };
        if (window && window[blazor]) {
            const obj: object = { 'methodName': 'UpdateBlazorProperties', 'diagramobj': diagramobject };
            window[blazorInterop].updateBlazorProperties(obj, this.diagram);
        }
    }
    private getBlazorObject(objectName: (NodeModel | ConnectorModel)): object {
        const object: object = {
            sfIndex: getIndex(this.diagram, objectName.id),
            zIndex: objectName.zIndex
        };
        return object;
    }
    //Checks whether the target is a child node.
    private checkParentExist(target: string): string {
        let objBehind: string = target;
        while (this.diagram.nameTable[objBehind].parentId) {
            objBehind = this.diagram.nameTable[objBehind].parentId;
        }
        return objBehind;
    }

    //Checks whether the selected node is not a parent of another node.
    public checkObjectBehind(objectId: string, zIndexTable: {}, index: number): boolean {
        for (let i: number = 0; i < index; i++) {
            const z: string = zIndexTable[i];
            if (this.diagram.nameTable[z] && objectId !== this.diagram.nameTable[z].parentId) {
                return true;
            }
        }
        return false;
    }

    /**
     * bringToFront method\
     *
     * @returns {  void  }    bringToFront method .\
     *  @param {NodeModel | ConnectorModel } obj - Provide the nodeArray element .
     * @private
     */
     public bringToFront(obj?: NodeModel | ConnectorModel): void {
        this.diagram.protectPropertyChange(true);
        if (hasSelection(this.diagram) || obj) {
            // EJ2-57772 - Added the below code to iterate all the selected nodes / connectors in the diagram and 
            // perform bring to front operation
            let objectName: string = (obj && obj.id);
            const selectedItems: SelectorModel = this.diagram.selectedItems;
            let objects: (NodeModel | ConnectorModel)[] = [];
            if (obj && obj.id) {
                objects.push(obj);
            } else {
                objects = objects.concat(selectedItems.nodes);
                objects = objects.concat(selectedItems.connectors);
            }
            for (let i: number = 0; i < objects.length; i++) {
                let clonedObject = cloneObject(objects[i]);
                objectName = objects[i].id;
                const layerNum: number = this.diagram.layers.indexOf(this.getObjectLayer(objectName));
                const zIndexTable: {} = (this.diagram.layers[layerNum] as Layer).zIndexTable;
                const undoObject: SelectorModel = cloneObject(this.diagram.selectedItems);
                let tempTable: {} = JSON.parse(JSON.stringify(zIndexTable));
                let tempIndex: number = 0;
                //find the maximum zIndex of the tabel
                let tabelLength: number = Number(Object.keys(zIndexTable).sort(
                    (a: string, b: string) => { return Number(a) - Number(b); }).reverse()[0]);
                const index: number = this.diagram.nameTable[objectName].zIndex;
                const oldzIndexTable: string[] = [];
                let length: number = 0;
                for (let i: number = 0; i <= tabelLength; i++) {
                    oldzIndexTable.push(zIndexTable[i]);
                }
                let object: NodeModel = this.diagram.nameTable[objectName];
                if (object.shape.type === 'SwimLane') {
                    for (let i: number = tabelLength; i >= index; i--) {
                        if (zIndexTable[i] && !(this.diagram.nameTable[zIndexTable[i]].parentId === objectName)) {
                            length = i;
                            tabelLength = length;
                            break;
                        }
                    }
                }
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
                for (let i: number = index; i < tabelLength; i++) {
                    if (zIndexTable[i]) {
                        this.diagram.nameTable[zIndexTable[i]].zIndex = i;
                    }
                }
                if (object.shape.type !== 'SwimLane') {
                    zIndexTable[tabelLength] = this.diagram.nameTable[objectName].id;
                    this.diagram.nameTable[objectName].zIndex = tabelLength;
                }
                else {
                    let childCount: number = 0;
                    let childIndex: number = -1;
                    let tempIndex: number = 0;
                    let laneIndex: number = 0;
                    let cloneTable: {} = JSON.parse(JSON.stringify(zIndexTable));
                    for (let i: number = 0; i <= index; i++) {
                        if (zIndexTable[i] && this.diagram.nameTable[zIndexTable[i]].parentId === objectName) {
                            if (childIndex === -1) {
                                childIndex = i;
                                tempIndex = i;
                                break;
                            }
                        }
                    }
                    for (let i: number = 0; i <= tabelLength; i++) {
                        if (tempTable[i] && tempTable[i] !== objectName && this.diagram.nameTable[tempTable[i]].parentId !== objectName) {
                            let node: Node = this.diagram.nameTable[tempTable[i]];
                            let swimlaneObject: Node = this.diagram.nameTable[objectName];
                            if (node.zIndex >= swimlaneObject.zIndex) {
                                childCount++;
                            }
                        }
                    }
                    let k: number = childIndex;
                    for (let i = 0; i <= childCount; i++) {
                        while (!zIndexTable[k]) {
                            k++;
                        }
                        laneIndex = this.diagram.nameTable[zIndexTable[k]].zIndex;
                        k++;
                    }
                    for (let i: number = laneIndex; i <= tabelLength; i++) {
                        while (!cloneTable[childIndex]) {
                            childIndex++;
                        }
                        while (!zIndexTable[i]) {
                            i++;
                        }
                        zIndexTable[i] = cloneTable[childIndex];
                        this.diagram.nameTable[zIndexTable[i]].zIndex = i;
                        childIndex++;
                    }
                    zIndexTable[tabelLength] = this.diagram.nameTable[objectName].id;
                    this.diagram.nameTable[objectName].zIndex = tabelLength;
                    k = index + 1;
                    let j: number = tempIndex;
                    for (let i: number = 0; i < childCount; i++) {
                        while (!tempTable[k]) {
                            k++;
                        }
                        while (this.diagram.nameTable[tempTable[k]].parentId === objectName) {
                            k++;
                        }
                        while (!zIndexTable[j]) {
                            j++;
                        }
                        zIndexTable[j] = tempTable[k];
                        this.diagram.nameTable[zIndexTable[j]].zIndex = j;
                        k++;
                        j++;
                    }
                }
                if (this.diagram.mode === 'SVG') {
                    const diagramLayer: SVGGElement = this.diagram.diagramLayer as SVGGElement;
                    //const child: string[] = this.getChildElements(this.diagram.nameTable[objectName].wrapper.children);
                    //const targerNodes: Object = [];
                    let element: HTMLElement = getDiagramElement(objectName + '_groupElement', this.diagram.element.id);
                    const nodes: NodeModel[] = this.diagram.selectedItems.nodes;
                    if (nodes.length > 0 && (nodes[0].shape.type === 'Native' || nodes[0].shape.type === 'HTML')) {
                        element.parentNode.removeChild(element);
                        for (let j: number = 0; j < this.diagram.views.length; j++) {
                            element = getDiagramElement(
                                objectName + (nodes[0].shape.type === 'HTML' ? '_html_element' : '_content_groupElement'),
                                this.diagram.views[j]);
                            const lastChildNode: HTMLElement = element.parentNode.lastChild as HTMLElement;
                            lastChildNode.parentNode.insertBefore(element, lastChildNode.nextSibling);
                        }
                        const htmlLayer: HTMLElement = getHTMLLayer(this.diagram.element.id);
                        this.diagram.diagramRenderer.renderElement(this.diagram.nameTable[objectName].wrapper, diagramLayer, htmlLayer);
                    } else {
                        Object.keys(zIndexTable).forEach((key: string) => {
                            let zIndexValue: string = zIndexTable[key];
                            if ((zIndexValue !== objectName) && (this.diagram.nameTable[zIndexValue].parentId) !== objectName) {
                                //EJ2-42101 - SendToBack and BringToFront not working for connector with group node
                                //Added @Dheepshiva to restrict the objects with lower zIndex
                                if (zIndexValue !== undefined &&
                                    (oldzIndexTable.indexOf(objectName) < oldzIndexTable.indexOf(zIndexValue))) {
                                    let objectNode: Node | Connector = this.diagram.nameTable[objectName];
                                    let zIndexNode: Node | Connector = this.diagram.nameTable[zIndexValue];
                                    if (objectNode.parentId === '' && zIndexNode.parentId === '' && zIndexNode.parentId === undefined
                                        && objectNode.parentId !== zIndexNode.id) {
                                        this.moveSvgNode(zIndexValue, objectName);
                                        this.updateNativeNodeIndex(objectName);
                                    } else {
                                        if (this.checkGroupNode(objectName, zIndexValue, this.diagram.nameTable)) {
                                            this.moveSvgNode(zIndexValue, objectName);
                                            this.updateNativeNodeIndex(objectName);
                                        }
                                    }
                                }
                            }
                        });
                    }
                } else {
                    this.diagram.refreshCanvasLayers();
                }
                const redoObject: SelectorModel = cloneObject(this.diagram.selectedItems);
                const entry: HistoryEntry = { type: 'BringToFront', category: 'Internal', undoObject: undoObject, redoObject: redoObject };
                if (!(this.diagram.diagramActions & DiagramAction.UndoRedo)) {
                    this.addHistoryEntry(entry);
                }
                this.triggerOrderCommand(clonedObject, objects[i], objects[i]);
            }
        }
        this.diagram.protectPropertyChange(false);
        if (isBlazor()) {
            this.getZIndexObjects();
        }
    }

    private triggerOrderCommand(oldObj : NodeModel | ConnectorModel, newObj : NodeModel | ConnectorModel, obj: NodeModel | ConnectorModel){
        let clonedObject = cloneObject(oldObj);
        let arg: IPropertyChangeEventArgs = {
                    element: obj, cause: this.diagram.diagramActions,
                    oldValue: clonedObject, newValue: newObj
                };
                this.diagram.triggerEvent(DiagramEvent.propertyChange, arg)
    }

    private checkGroupNode(selectedNodeName: string, layerObject: string, nameTable: object): boolean {
        return nameTable[layerObject].parentId === nameTable[selectedNodeName].parentId;
    }

    /**
     * sortByZIndex method\
     *
     * @returns {  Object[] }    sortByZIndex method .\
     *  @param { Object[] } nodeArray - Provide the nodeArray element .
     *  @param { string } sortID - Provide the sortID element .
     * @private
     */
    public sortByZIndex(nodeArray: Object[], sortID?: string): Object[] {
        const id: string = sortID ? sortID : 'zIndex';
        nodeArray = nodeArray.sort((a: Object, b: Object): number => {
            return a[id] - b[id];
        });
        return nodeArray;
    }
    /**
     * orderCommands method\
     *
     * @returns {  void }    orderCommands method .\
     *  @param { boolean } isRedo - Provide the previousObject element .
     *  @param { Selector } selector - Provide the previousObject element .
     *  @param { EntryType } action - Provide the previousObject element .
     * @private
     */
    public orderCommands(isRedo: boolean, selector: Selector, action: EntryType): void {
        let selectedObject: (NodeModel | ConnectorModel)[] = selector.nodes;
        selectedObject = selectedObject.concat(selector.connectors);
        if (isRedo) {
            if (action === 'SendBackward') {
                this.sendBackward(selectedObject[0]);
            } else if (action === 'SendForward') {
                this.sendForward(selectedObject[0]);
            } else if (action === 'BringToFront') {
                this.bringToFront(selectedObject[0]);
            } else if (action === 'SendToBack') {
                this.sendToBack(selectedObject[0]);
            }
        } else {
            const startZIndex: number = selectedObject[0].zIndex;
            const endZIndex: number = this.diagram.nameTable[selectedObject[0].id].zIndex;
            const undoObject: NodeModel = selectedObject[0] as NodeModel;
            const layer: LayerModel = this.getObjectLayer(undoObject.id);
            const layerIndex: number = layer.zIndex;
            const zIndexTable: {} = (layer as Layer).zIndexTable;
            if (action === 'SendBackward' || action === 'SendForward') {
                for (let i: number = 0; i < selectedObject.length; i++) {
                    const undoObject: NodeModel = selectedObject[i] as NodeModel;
                    const layer: number = this.diagram.layers.indexOf(this.getObjectLayer(undoObject.id));
                    const node: NodeModel = this.diagram.nameTable[selectedObject[i].id];
                    node.zIndex = undoObject.zIndex;
                    (this.diagram.layers[layer] as Layer).zIndexTable[undoObject.zIndex] = undoObject.id;
                }
            } else if (action === 'BringToFront') {
                if (selectedObject[0].shape.type === 'SwimLane') {
                    this.sendToBack(selectedObject[0]);
                } else {
                    const k: number = 1;
                    for (let j: number = endZIndex; j > startZIndex; j--) {
                        if (zIndexTable[j]) {
                            if (!zIndexTable[j - k]) {
                                zIndexTable[j - k] = zIndexTable[j];
                                this.diagram.nameTable[zIndexTable[j - k]].zIndex = j;
                                delete zIndexTable[j];
                            } else {
                                zIndexTable[j] = zIndexTable[j - k];
                                this.diagram.nameTable[zIndexTable[j]].zIndex = j;
                            }
                        }
                    }
                }
            } else if (action === 'SendToBack') {
                if (selectedObject[0].shape.type === 'SwimLane') {
                    this.bringToFront(selectedObject[0]);
                } else {
                    for (let j: number = endZIndex; j < startZIndex; j++) {
                        if (zIndexTable[j]) {
                            if (!zIndexTable[j + 1]) {
                                zIndexTable[j + 1] = zIndexTable[j];
                                this.diagram.nameTable[zIndexTable[j + 1]].zIndex = j;
                                delete zIndexTable[j];
                            } else {
                                zIndexTable[j] = zIndexTable[j + 1];
                                this.diagram.nameTable[zIndexTable[j]].zIndex = j;
                            }
                        }
                    }
                }
            }
            if (action === 'BringToFront' || action === 'SendToBack') {
                const node: NodeModel = this.diagram.nameTable[selectedObject[0].id];
                node.zIndex = undoObject.zIndex;
                (this.diagram.layers[layerIndex] as Layer).zIndexTable[undoObject.zIndex] = undoObject.id;
            }
            if (this.diagram.mode === 'SVG') {
                if (action === 'SendBackward') {
                    this.moveObject(selectedObject[1].id, selectedObject[0].id);
                } else if (action === 'SendForward') {
                    this.moveObject(selectedObject[0].id, selectedObject[1].id);
                } else if (action === 'BringToFront') {
                    if (selectedObject[0].shape.type !== 'SwimLane') {
                        this.moveObject(selectedObject[0].id, zIndexTable[selectedObject[0].zIndex + 1]);
                    }
                } else if (action === 'SendToBack') {
                    if (selectedObject[0].shape.type !== 'SwimLane') {
                        const layer: LayerModel = this.getObjectLayer(selectedObject[0].id);
                        for (let i: number = 0; i <= selectedObject[0].zIndex; i++) {
                            if (layer.objects[i] !== selectedObject[0].id) {
                                this.moveSvgNode(layer.objects[i], selectedObject[0].id);
                                this.updateNativeNodeIndex(selectedObject[0].id);
                            }
                        }
                    }
                }
            } else {
                this.diagram.refreshCanvasLayers();
            }

        }
    }

    private moveObject(sourceId: string, targetId: string): void {
        if (targetId) {
            this.moveSvgNode(sourceId, targetId);
            this.updateNativeNodeIndex(sourceId, targetId);
        }
    }
    /**
     * sendForward method\
     *
     * @returns {  void }    sendForward method .\
     *  @param {  NodeModel | ConnectorModel } obj - Provide the previousObject element .
     * @private
     */
    public sendForward(obj?: NodeModel | ConnectorModel): void {
        this.diagram.protectPropertyChange(true);

        if (hasSelection(this.diagram) || obj) {
            let elements: NodeModel | ConnectorModel = obj || (this.diagram.selectedItems.nodes.length ? this.diagram.selectedItems.nodes[0]
                : this.diagram.selectedItems.connectors[0]);
            let clonedObjects = cloneObject(elements);
            let nodeId: string = (obj && obj.id);
            nodeId = nodeId || (this.diagram.selectedItems.nodes.length ? this.diagram.selectedItems.nodes[0].id
                : this.diagram.selectedItems.connectors[0].id);

            const layerIndex: number = this.diagram.layers.indexOf(this.getObjectLayer(nodeId));
            const zIndexTable: {} = (this.diagram.layers[layerIndex] as Layer).zIndexTable;
            //const tabelLength: number = Object.keys(zIndexTable).length;
            const index: NodeModel = this.diagram.nameTable[nodeId];
            const intersectArray: NodeModel[] = [];
            let temp: Object[] = this.diagram.spatialSearch.findObjects(index.wrapper.bounds);
            if (temp.length > 2) {
                temp = this.sortByZIndex(temp);
            }
            for (const i of temp) {
                if (index.id !== (i as NodeModel).id) {
                    const currentLayer: number = this.getObjectLayer((i as NodeModel).id).zIndex;
                    if (layerIndex === currentLayer && (Number(this.diagram.nameTable[nodeId].zIndex) < Number((i as NodeModel).zIndex)) &&
                        index.wrapper.bounds.intersects((i as NodeModel).wrapper.bounds)) {
                        intersectArray.push((i as NodeModel));
                        break;
                    }
                }
            }
            if (intersectArray.length > 0) {
                let node: Node = this.diagram.nameTable[zIndexTable[Number(intersectArray[0].zIndex)]];
                if (node.parentId) {
                    let parentId: string = '';
                    let parent: string = findParentInSwimlane(node, this.diagram, parentId);
                    let obj: NodeModel = this.diagram.nameTable[parent];
                    if (obj.id !== nodeId) {
                        intersectArray[0] = obj;
                    }
                }
                const overlapObject: number = intersectArray[0].zIndex;
                const currentObject: number = index.zIndex;
                const temp: string = zIndexTable[overlapObject];
                //swap the nodes
                const undoObject: SelectorModel = cloneObject(this.diagram.selectedItems);
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                (this.diagram.nameTable[temp] instanceof Node) ? undoObject.nodes.push(cloneObject(this.diagram.nameTable[temp])) :
                    undoObject.connectors.push(cloneObject(this.diagram.nameTable[temp]));

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
                const redo: SelectorModel = cloneObject(this.diagram.selectedItems);
                // eslint-disable-next-line
                (this.diagram.nameTable[temp] instanceof Node) ? redo.nodes.push(cloneObject(this.diagram.nameTable[temp])) :
                    redo.connectors.push(cloneObject(this.diagram.nameTable[temp]));

                const historyEntry: HistoryEntry = {
                    type: 'SendForward', category: 'Internal',
                    undoObject: undoObject, redoObject: redo
                };
                if (!(this.diagram.diagramActions & DiagramAction.UndoRedo)) {
                    this.addHistoryEntry(historyEntry);
                }
            }
            if (isBlazor()) {
                const elements: (NodeModel | ConnectorModel)[] = [];
                elements.push(index);
                elements.push(intersectArray[intersectArray.length - 1]);
                this.updateBlazorZIndex(elements);
            }
            this.triggerOrderCommand(clonedObjects, elements, elements);
        }
        this.diagram.protectPropertyChange(false);

    }
    /**
     * sendBackward method\
     *
     * @returns {  void }    sendBackward method .\
     *  @param {  NodeModel | ConnectorModel } obj - Provide the previousObject element .
     * @private
     */
    public sendBackward(obj?: NodeModel | ConnectorModel): void {
        this.diagram.protectPropertyChange(true);

        if (hasSelection(this.diagram) || obj) {
            let element: NodeModel | ConnectorModel = obj || (this.diagram.selectedItems.nodes.length ? this.diagram.selectedItems.nodes[0]
                : this.diagram.selectedItems.connectors[0]);
            let clonedObject = cloneObject(element);
            let objectId: string = (obj && obj.id);
            objectId = objectId || (this.diagram.selectedItems.nodes.length ? this.diagram.selectedItems.nodes[0].id
                : this.diagram.selectedItems.connectors[0].id);
            const layerNum: number = this.diagram.layers.indexOf(this.getObjectLayer(objectId));
            const zIndexTable: {} = (this.diagram.layers[layerNum] as Layer).zIndexTable;
            //const tabelLength: number = Object.keys(zIndexTable).length;
            const node: NodeModel = this.diagram.nameTable[objectId];
            const intersectArray: NodeModel[] = [];
            let temp: Object[] = this.diagram.spatialSearch.findObjects(node.wrapper.bounds);
            if (temp.length > 2) {
                temp = this.sortByZIndex(temp);
            }
            for (const i of temp) {
                if (node.id !== (i as NodeModel).id) {
                    const currentLayer: number = this.getObjectLayer((i as NodeModel).id).zIndex;
                    if (layerNum === currentLayer && (Number(this.diagram.nameTable[objectId].zIndex) > Number((i as NodeModel).zIndex)) &&
                        node.wrapper.bounds.intersects((i as NodeModel).wrapper.bounds)) {
                        intersectArray.push((i as NodeModel));
                    }
                }
            }
            for (let i: number = intersectArray.length - 1; i >= 0; i--) {
                let child: Node = this.diagram.nameTable[intersectArray[i].id];
                if (child.parentId === objectId) {
                    intersectArray.splice(i, 1);
                }
            }

            if (intersectArray.length > 0) {
                let child: Node = this.diagram.nameTable[intersectArray[intersectArray.length - 1].id];
                if (child.parentId) {
                    let parentId: string = '';
                    let parent: string = findParentInSwimlane(child, this.diagram, parentId);
                    let obj: NodeModel = this.diagram.nameTable[parent];
                    if (objectId !== obj.id) {
                        intersectArray[intersectArray.length - 1] = obj;
                    }
                }
                const overlapObject: number = intersectArray[intersectArray.length - 1].zIndex;
                const currentObject: number = node.zIndex;
                const temp: string = zIndexTable[overlapObject];
                const undoObject: SelectorModel = cloneObject(this.diagram.selectedItems);
                // eslint-disable-next-line
                (this.diagram.nameTable[temp] instanceof Node) ? undoObject.nodes.push(cloneObject(this.diagram.nameTable[temp])) :
                    undoObject.connectors.push(cloneObject(this.diagram.nameTable[temp]));

                //swap the nodes
                zIndexTable[overlapObject] = node.id;
                this.diagram.nameTable[zIndexTable[overlapObject]].zIndex = overlapObject;
                zIndexTable[currentObject] = intersectArray[intersectArray.length - 1].id;
                this.diagram.nameTable[zIndexTable[currentObject]].zIndex = currentObject;
                if (this.diagram.mode === 'SVG') {
                    this.moveSvgNode(objectId, zIndexTable[intersectArray[intersectArray.length - 1].zIndex]);
                    let node: NodeModel = this.diagram.nameTable[zIndexTable[intersectArray[intersectArray.length - 1].zIndex]];
                    if (node.children && node.children.length > 0) {
                        this.updateNativeNodeIndex(objectId);
                    } else {
                        this.updateNativeNodeIndex(objectId, zIndexTable[intersectArray[intersectArray.length - 1].zIndex]);
                    }
                    if (isBlazor()) {
                        const elements: (NodeModel | ConnectorModel)[] = [];
                        elements.push(node);
                        elements.push(intersectArray[intersectArray.length - 1]);
                        this.updateBlazorZIndex(elements);
                    }
                } else {
                    this.diagram.refreshCanvasLayers();
                }
                const redoObject: SelectorModel = cloneObject(this.diagram.selectedItems);
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                (this.diagram.nameTable[temp] instanceof Node) ? redoObject.nodes.push(cloneObject(this.diagram.nameTable[temp])) :
                    redoObject.connectors.push(cloneObject(this.diagram.nameTable[temp]));

                const entry: HistoryEntry = { type: 'SendBackward', category: 'Internal', undoObject: undoObject, redoObject: redoObject };
                if (!(this.diagram.diagramActions & DiagramAction.UndoRedo)) {
                    this.addHistoryEntry(entry);
                }
                //swap the nodes
            }
            this.triggerOrderCommand(clonedObject, element, element);
        }
        this.diagram.protectPropertyChange(false);

    }

    /**
     * updateNativeNodeIndex method\
     *
     * @returns {  void }    updateNativeNodeIndex method .\
     *  @param { string } nodeId - Provide the previousObject element .
     *  @param { string } targetID - Provide the previousObject element .
     * @private
     */
    public updateNativeNodeIndex(nodeId: string, targetID?: string): void {
        const node: NodeModel = this.diagram.selectedItems.nodes[0] || this.diagram.getObject(targetID);
        for (let i: number = 0; i < this.diagram.views.length; i++) {
            if (node && (node.shape.type === 'HTML'
                || node.shape.type === 'Native')) {
                const id: string = node.shape.type === 'HTML' ? '_html_element' : '_content_groupElement';
                const backNode: HTMLElement = getDiagramElement(nodeId + id, this.diagram.views[i]);
                const diagramDiv: HTMLElement = targetID ? getDiagramElement(targetID + id, this.diagram.views[i])
                    : backNode.parentElement.firstChild as HTMLElement;
                if (backNode && diagramDiv) {
                    if ((backNode.parentNode as HTMLElement).id === (diagramDiv.parentNode as HTMLElement).id) {
                        diagramDiv.parentNode.insertBefore(backNode, diagramDiv);
                    }
                }
            }
        }
    }

    /**
     * initSelectorWrapper method\
     *
     * @returns {  void }    initSelectorWrapper method .\
     * @private
     */
    public initSelectorWrapper(): void {
        const selectorModel: SelectorModel = this.diagram.selectedItems;
        (selectorModel as Selector).init(this.diagram);
        if (selectorModel.nodes.length === 1 && selectorModel.connectors.length === 0) {
            selectorModel.rotateAngle = selectorModel.nodes[0].rotateAngle;
            selectorModel.wrapper.rotateAngle = selectorModel.nodes[0].rotateAngle;
            selectorModel.wrapper.pivot = selectorModel.nodes[0].pivot;
        }
    }

    /**
     * doRubberBandSelection method\
     *
     * @returns {  void }    doRubberBandSelection method .\
     *  @param { Rect } region - Provide the previousObject element .
     * @private
     */
    public doRubberBandSelection(region: Rect): void {
        this.clearSelectionRectangle();
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
        const adornerSvg: SVGSVGElement = getAdornerLayerSvg(this.diagram.element.id);
        const element: SVGElement = adornerSvg.getElementById(
            this.diagram.element.id + '_diagramAdorner_selected_region') as SVGElement;
        if (element) {
            remove(element);
        }
    }

    /**
     * dragConnectorEnds method\
     *
     * @returns {  void }    dragConnectorEnds method .\
     *  @param { string } endPoint - Provide the previousObject element .
     *  @param { IElement } obj - Provide the previousObject element .
     *  @param { PointModel } point - Provide the point element .
     *  @param { BezierSegmentModel } segment - Provide the segment element .
     *  @param { IElement } target - Provide the target element .
     *  @param { string } targetPortId - Provide the targetPortId element .
     * @private
     */
    public dragConnectorEnds(
        endPoint: string, obj: IElement, point: PointModel, segment: BezierSegmentModel, target?: IElement, targetPortId?: string):
        boolean {

        let selectorModel: SelectorModel;
        let connector: Connector; //let node: Node;
        let tx: number; //let segmentPoint: PointModel;
        let ty: number; //let index: number;
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
            connector.isBezierEditing = true;
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

    /**
     * getSelectedObject method\
     *
     * @returns {  void }    getSelectedObject method .\
     * @private
     */
    public getSelectedObject(): (NodeModel | ConnectorModel)[] {
        const selectormodel: SelectorModel = this.diagram.selectedItems;
        return (selectormodel.nodes).concat(selectormodel.connectors as Object);

    }

    /**
     * updateBlazorProperties method\
     *
     * @returns {  void }    updateBlazorProperties method .\
     *  @param { boolean } isObjectInteraction - Provide the previousObject element .
     * @private
     */
    public updateBlazorProperties(isObjectInteraction?: boolean): void {
        const blazorInterop: string = 'sfBlazor';
        const blazor: string = 'Blazor';
        if (!isObjectInteraction) {
            if (window && window[blazor]) {
                const obj: object = { 'methodName': 'UpdateBlazorProperties', 'diagramobj': this.diagramObject };
                window[blazorInterop].updateBlazorProperties(obj, this.diagram);
            }
        } else {
            if (window && window[blazor] && JSON.stringify(this.deepDiffer.diagramObject) !== '{}') {
                const obj: object = { 'methodName': 'UpdateBlazorProperties', 'diagramobj': this.deepDiffer.diagramObject };
                if (!this.diagram.isLoading) {
                    window[blazorInterop].updateBlazorProperties(obj, this.diagram);
                }
            }
        }
        //this.diagram.enableServerDataBinding(true);
        this.deepDiffer.newNodeObject = [];
        this.deepDiffer.newConnectorObject = [];
        this.diagramObject = [];
        this.diagram.oldNodeObjects = [];
        this.diagram.oldConnectorObjects = [];
    }

    /**
     * enableCloneObject method\
     *
     * @returns {  void }    enableCloneObject method .\
     *  @param { boolean } value - Provide the previousObject element .
     * @private
     */
    public enableCloneObject(value: boolean): void {
        if ((!this.diagram.lineRoutingModule || !(this.diagram.constraints & DiagramConstraints.LineRouting))) {
            this.diagram.canEnableBlazorObject = value;
        }
    }
    /**
     * ismouseEvents method\
     *
     * @returns {  void }    ismouseEvents method .\
     *  @param { boolean } value - Provide the previousObject element .
     * @private
     */
    public ismouseEvents(value: boolean): void {
        if (value) {
            this.diagram.blazorActions = this.diagram.addConstraints(this.diagram.blazorActions, BlazorAction.interaction);
        } else {
            this.diagram.blazorActions = this.diagram.removeConstraints(this.diagram.blazorActions, BlazorAction.interaction);
        }
    }


    /**
     * updateLayerObject method\
     *
     * @returns {  void }    updateLayerObject method .\
     *  @param { object } oldDiagram - Provide the previousObject element .
     *  @param { boolean } temp - Provide the temp element .
     * @private
     */
    public updateLayerObject(oldDiagram: object, temp?: boolean): void {
        if (isBlazor()) {
            let diffLayers: object = {};
            diffLayers = this.deepDiffer.getLayerObject(oldDiagram, temp, this.diagram);
            this.diagramObject = diffLayers;
            this.updateBlazorProperties();
        }
    }
    /* tslint:enable:no-string-literal */
    /**
     * getDiagramOldValues method\
     *
     * @returns {  void }    getDiagramOldValues method .\
     *  @param { object } oldDiagram - Provide the previousObject element .
     *  @param { string[] } attribute - Provide the previousObject element .
     * @private
     */
    public getDiagramOldValues(oldDiagram: object, attribute: string[]): void {
        const newDiagram: object = {};
        for (let i: number = 0; i < attribute.length; i++) {
            newDiagram[attribute[i]] = cloneObject(this.diagram[attribute[i]]);
        }
        const newObject: Object = cloneObject(newDiagram);
        const result: object = this.deepDiffer.map(newObject, oldDiagram);
        const diffValue: object = this.deepDiffer.frameObject({}, result);
        let diff: object = this.deepDiffer.removeEmptyValues(diffValue);
        diff = this.deepDiffer.changeSegments(diff, newObject);
        this.diagramObject = diff;
        if (!(this.diagram.blazorActions & BlazorAction.ClearObject)) {
            this.updateBlazorProperties();
        }
    }
    /* tslint:disable */
    /**
     * getBlazorOldValues method\
     *
     * @returns {  void }    getBlazorOldValues method .\
     *  @param { MouseEventArgs } args - Provide the previousObject element .
     *  @param { boolean } labelDrag - Provide the previousObject element .
     * @private
     */
    public getBlazorOldValues(args?: MouseEventArgs, labelDrag?: boolean): void {
        if (isBlazor()) {
            const oldNodeObject: Node[] = this.diagram.oldNodeObjects;
            for (let i: number = 0; i < oldNodeObject.length; i++) {
                if (oldNodeObject[i].id) {
                    if (this.diagram.oldNodeObjects[i] instanceof Node) {
                        this.diagram.oldNodeObjects[i] = cloneBlazorObject(this.diagram.oldNodeObjects[i]) as Node;
                    }
                    this.deepDiffer.getDifferenceValues(this.diagram.nameTable[oldNodeObject[i].id], args, labelDrag, this.diagram);
                }
            }
            const oldConnectorObject: Connector[] = this.diagram.oldConnectorObjects;
            for (let i: number = 0; i < oldConnectorObject.length; i++) {
                if (oldConnectorObject[i].id) {
                    if (this.diagram.oldConnectorObjects[i] instanceof Connector) {
                        this.diagram.oldConnectorObjects[i] = cloneBlazorObject(this.diagram.oldConnectorObjects[i]) as Connector;
                    }
                    this.deepDiffer.getDifferenceValues(this.diagram.nameTable[oldConnectorObject[i].id], args, labelDrag, this.diagram);
                }
            }
            if (oldNodeObject.length > 0 || oldConnectorObject.length > 0) {
                this.updateBlazorProperties(true);
            }
        }
    }

    /**
     * getObjectChanges method\
     *
     * @returns {  void }    getObjectChanges method .\
     *  @param { Object[] } previousObject - Provide the previousObject element .
     *  @param { Object[] } currentObject - Provide the previousObject element .
     *  @param { Object[] } previousObject - Provide the previousObject element .
     * @private
     */

    public getObjectChanges(previousObject: Object[], currentObject: Object[], changedNodes: Object[]): void {
        for (let i: number = 0; i < previousObject.length; i++) {
            const value: object = this.deepDiffer.map(currentObject[i], previousObject[i]);
            const result: object = this.deepDiffer.frameObject({}, value);
            let change: object = this.deepDiffer.removeEmptyValues(result);
            if ((change as any).children) {
                (change as any).children = (cloneObject(currentObject[i]) as any).children;
            }
            change = this.deepDiffer.changeSegments(change, currentObject[i]);
            (change as any).sfIndex = getIndex(this.diagram, (currentObject[i] as Node).id);
            changedNodes.push(change);
        }
    }

    /**
     * clearObjectSelection method\
     *
     * @returns {  void }    clearObjectSelection method .\
     *  @param { (NodeModel | ConnectorModel) } mouseDownElement - Provide the triggerAction element .
     * @private
     */
    // Bug fix - EJ2-44495 -Node does not gets selected on slight movement of mouse when drag constraints disabled for node
    public clearObjectSelection(mouseDownElement: (NodeModel | ConnectorModel)): void {
        const selectedItems: SelectorModel = this.diagram.selectedItems;
        let list: (NodeModel | ConnectorModel)[] = [];
        list = list.concat(selectedItems.nodes, selectedItems.connectors);
        if (list.indexOf(mouseDownElement) === -1) {
            this.clearSelection((list.length > 0) ? true : false);
            this.selectObjects([mouseDownElement], true);
        }
    }
    /**
     * clearSelection method\
     *
     * @returns {  void }    clearSelection method .\
     *  @param { boolean } triggerAction - Provide the triggerAction element .
     *  @param { boolean } isTriggered - Provide the isTriggered element .
     * @private
     */
    public async clearSelection(triggerAction?: boolean, isTriggered?: boolean): Promise<void> {
        const enableServerDataBinding: boolean = this.diagram.allowServerDataBinding;
        this.diagram.enableServerDataBinding(false);
        if (hasSelection(this.diagram)) {
            const selectormodel: SelectorModel = this.diagram.selectedItems;
            const arrayNodes: (NodeModel | ConnectorModel)[] = this.getSelectedObject();
            if (this.diagram.currentSymbol) {
                this.diagram.previousSelectedObject = arrayNodes;
            }
            let arg: ISelectionChangeEventArgs | IBlazorSelectionChangeEventArgs = {
                oldValue: arrayNodes, newValue: [], cause: this.diagram.diagramActions,
                state: 'Changing', type: 'Removal', cancel: false
            };
            this.updateBlazorSelectorModel(arrayNodes, true);
            if (triggerAction) {
                if (!isBlazor()) {
                    this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
                } else {
                    this.oldSelectedObjects = cloneObject(selectormodel);
                }
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
                // EJ2-56919 - While clear selection empty the selectedObjects collection
                selectormodel.selectedObjects = [];
                this.diagram.clearSelectorLayer();
                if (triggerAction) {
                    arg = {
                        oldValue: cloneBlazorObject(arrayNodes) as NodeModel[], newValue: [], cause: this.diagram.diagramActions,
                        state: 'Changed', type: 'Removal', cancel: false
                    };
                    if (isBlazor()) {
                        arg = this.updateSelectionChangeEventArgs(arg, [], arrayNodes);
                        this.updateBlazorSelector();
                    }
                    if (!isBlazor()) {
                        this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
                    } else {
                        let blazarArgs: void | object;
                        if (window && window[this.blazor] && this.diagram.selectionChange) {
                            const eventObj: object = { 'EventName': 'selectionChange', args: JSON.stringify(arg) };
                            blazarArgs = await window[this.blazorInterop].updateBlazorDiagramEvents(eventObj, this.diagram);
                        }
                        // let blazarArgs: void | object = await this.diagram.triggerEvent(DiagramEvent.selectionChange, arg);
                        if (blazarArgs && (blazarArgs as IBlazorSelectionChangeEventArgs).cancel && !isTriggered) {
                            let selectNodes: (NodeModel | ConnectorModel)[] = [];
                            if ((blazarArgs as IBlazorSelectionChangeEventArgs).oldValue.nodes.length > 0) {
                                selectNodes = (blazarArgs as IBlazorSelectionChangeEventArgs).oldValue.nodes;
                            }
                            if ((blazarArgs as IBlazorSelectionChangeEventArgs).oldValue.connectors.length > 0) {
                                selectNodes = selectNodes.concat((blazarArgs as IBlazorSelectionChangeEventArgs).oldValue.connectors);
                            }

                            if (selectNodes) {
                                for (let i: number = 0; i < selectNodes.length; i++) {
                                    this.select(this.diagram.nameTable[selectNodes[i].id], (i !== 0 && selectNodes.length > 1) ? true : false);
                                }
                            }
                        }
                    }
                }
            }
            this.updateBlazorSelector();
            this.diagram.enableServerDataBinding(enableServerDataBinding);
        }
    }

    /**
     * clearSelectedItems method\
     *
     * @returns {  void }    clearSelectedItems method .\
     * @private
     */
    public clearSelectedItems(): void {
        const selectedNodes: number = this.diagram.selectedItems.nodes ? this.diagram.selectedItems.nodes.length : 0;
        const selectedConnectors: number = this.diagram.selectedItems.connectors ? this.diagram.selectedItems.connectors.length : 0;
        this.clearSelection((selectedNodes + selectedConnectors) > 0 ? true : false);
    }
    /**
     * removeStackHighlighter method\
     *
     * @returns {  void }    removeStackHighlighter method .\
     * @private
     */
    public removeStackHighlighter(): void {
        const adornerSvg: SVGElement = getAdornerLayerSvg(this.diagram.element.id);
        const highlighter: SVGElement =
            (adornerSvg as SVGSVGElement).getElementById(adornerSvg.id + '_stack_highlighter') as SVGElement;
        if (highlighter) {
            highlighter.parentNode.removeChild(highlighter);
        }
    }

    /**
     * @param {End} args - provide the args  value.
     * @param {IElement} target - provide the target  value.
     * @private
     */
    public renderStackHighlighter(args: MouseEventArgs, target?: IElement): void {
        const source: Node = this.diagram.selectedItems.nodes[0] as Node;
        let symbolDrag: boolean; let node: NodeModel;
        let selectorModel: SelectorModel;
        if (!target) {
            const objects: IElement[] = this.diagram.findObjectsUnderMouse(args.position);
            target = this.diagram.findObjectUnderMouse(objects, 'Drag', true);
            if (target && !((target as Node).isLane || (target as Node).isPhase || (target as Node).isHeader)) {
                for (let i: number = 0; i < objects.length; i++) {
                    const laneNode: Node = this.diagram.nameTable[(objects[i] as NodeModel).id];
                    if (!laneNode.isLane || laneNode.isPhase || laneNode.isHeader) {
                        target = laneNode;
                        this.diagram.parentObject = target;
                    }
                }
            }
        }
        if (source && target && (target as Node).isLane && source.shape && !(source.shape as SwimLaneModel).isPhase) {
            node = this.diagram.nameTable[(target as Node).parentId];
            if (this.diagram.currentSymbol && node.shape.type === 'SwimLane') {
                symbolDrag = true;
            }
            if ((source && !source.parentId && source.shape.type !== 'SwimLane') ||
                (source && source.parentId && this.diagram.nameTable[source.parentId] && this.diagram.nameTable[source.parentId].isLane &&
                    (source.parentId !== (target as Node).parentId && source.parentId !== (target as Node).id))) {
                selectorModel = this.diagram.selectedItems;
                const canvas: Canvas = gridSelection(this.diagram, selectorModel, (target as Node).id, true);
                if (canvas) {
                    selectorModel.wrapper.children[0] = canvas;
                }
                this.diagram.renderSelector(false, true);
                selectorModel.wrapper.children[0] = selectorModel.nodes[0].wrapper;
            }
        }
        if (source && target && (target as Node).parentId && source.shape && (source.shape as SwimLaneModel).isPhase) {
            const node: NodeModel = this.diagram.nameTable[(target as Node).parentId];
            if (node.shape.type === 'SwimLane') {
                this.diagram.selectedItems.wrapper.children[0] = this.diagram.nameTable[(target as Node).parentId].wrapper;
                this.diagram.renderSelector(false, true);
            }
        }
        if ((symbolDrag && ((this.diagram.currentSymbol as Node).shape as SwimLaneModel).isLane) || (source && target &&
            source.parentId && (target as Node).parentId && !source.isPhase && (source.parentId === (target as Node).parentId)
            && (source.id !== (target as Node).id) && node &&
            (node.container && (node.container.type === 'Stack' || node.container.type === 'Grid')))) {
            let canvas: Canvas;
            const value: boolean = node.container.orientation === 'Vertical';
            const isVertical: boolean = node.container === 'Stack' ? value : !value;
            if (node.container.type === 'Grid' && (target as Node).isLane &&
                ((!this.diagram.currentSymbol &&
                    ((node.shape as SwimLaneModel).orientation === 'Horizontal' && (target as Node).rowIndex !== source.rowIndex) ||
                    ((node.shape as SwimLaneModel).orientation === 'Vertical' && (target as Node).columnIndex !== source.columnIndex))
                    || (this.diagram.currentSymbol &&
                        (this.diagram.currentSymbol.shape as SwimLaneModel).orientation === node.container.orientation))) {
                selectorModel = this.diagram.selectedItems;
                if ((source.isLane && canLaneInterchange(source, this.diagram)) || !source.isLane) {
                    canvas = gridSelection(this.diagram, selectorModel, (target as Node).id, symbolDrag);
                }
            }
            const wrapper: DiagramElement = node.container.type === 'Stack' ? target.wrapper : canvas;
            if (wrapper) {
                renderStackHighlighter(
                    wrapper, isVertical, args.position, this.diagram, false, true);
            }
        }
    }
    /** @private */
    public insertBlazorConnector(obj: Selector): void {
        if (obj instanceof Selector) {
            for (let i: number = 0; i < obj.connectors.length; i++) {
                this.diagram.insertBlazorConnector(obj.connectors[i] as Connector);
            }
        } else {
            this.diagram.insertBlazorConnector(obj as Connector);
        }

    }
    /** @private */
    public drag(obj: NodeModel | ConnectorModel, tx: number, ty: number): void {
        let tempNode: NodeModel | ConnectorModel;
        const elements: (NodeModel | ConnectorModel)[] = [];
        if (canMove(obj) && this.checkBoundaryConstraints(tx, ty, obj.wrapper.bounds) && canPageEditable(this.diagram)) {
            if (obj instanceof Node) {
                const oldValues: NodeModel = { offsetX: obj.offsetX, offsetY: obj.offsetY };
                obj.offsetX += tx;
                obj.offsetY += ty;
                if (obj.children && !(obj.container)) {
                    if (!(checkParentAsContainer(this.diagram, obj, true))) {
                        this.diagram.diagramActions = this.diagram.diagramActions | DiagramAction.isGroupDragging;
                    }
                    const nodes: (NodeModel | ConnectorModel)[] = this.getAllDescendants(obj, elements);
                    for (let i: number = 0; i < nodes.length; i++) {
                        tempNode = (this.diagram.nameTable[nodes[i].id]);
                        this.drag(tempNode, tx, ty);
                    }
                    this.updateInnerParentProperties(obj);
                    this.diagram.diagramActions = this.diagram.diagramActions & ~DiagramAction.isGroupDragging;
                }
                if (checkParentAsContainer(this.diagram, obj, true)) {
                    checkChildNodeInContainer(this.diagram, obj);
                } else {
                    if (obj && obj.shape && obj.shape.type === 'UmlClassifier') {
                        obj.wrapper.measureChildren = true;
                    }
                    this.diagram.nodePropertyChange(
                        obj as Node, oldValues as Node,
                        { offsetX: obj.offsetX, offsetY: obj.offsetY } as Node, undefined, undefined, false);
                    obj.wrapper.measureChildren = false;
                }
                if (obj.shape.type === 'SwimLane' && !this.diagram.currentSymbol) {
                    const grid: GridPanel = obj.wrapper.children[0] as GridPanel;
                    const connectors: string[] = getConnectors(this.diagram, grid, 0, true);
                    updateConnectorsProperties(connectors, this.diagram);
                }
            } else {
                const connector: Connector = obj as Connector;
                const oldValues: Connector = { sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint } as Connector;
                const update: boolean = connector.type === 'Bezier' ? true : false;
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
                let canDragPoints: boolean = false;
                if (obj instanceof Connector) {
                    canDragPoints = true;
                }
                if (!hasEnds || canDragPoints) {
                    this.dragControlPoint(connector, tx, ty, true);
                    const conn: Connector = { sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint } as Connector;
                    this.diagram.connectorPropertyChange(connector as Connector, oldValues, conn);
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
                    const connector: Connector = this.diagram.nameTable[actualObject.outEdges[k]];
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
                                    connector, tx, ty, true, null, 'ConnectorSourceEnd', undefined, undefined, undefined,
                                    (actualObject.parentId &&
                                        (this.diagram.diagramActions & DiagramAction.isGroupDragging)) ? false : true);
                            }
                        } else {
                            const firstSegment: OrthogonalSegment = connector.segments[0] as OrthogonalSegment;
                            const secondSegment: OrthogonalSegment = connector.segments[1] as OrthogonalSegment;
                            const cornerPoints: Corners = swapBounds(
                                actualObject.wrapper, actualObject.wrapper.corners, actualObject.wrapper.bounds);
                            let sourcePoint: PointModel = findPoint(cornerPoints, firstSegment.direction);
                            sourcePoint = getIntersection(
                                connector, connector.sourceWrapper, sourcePoint,
                                { x: connector.sourceWrapper.offsetX, y: connector.sourceWrapper.offsetY }, false);
                            const source: End = {
                                corners: undefined, point: sourcePoint, margin: undefined, direction: firstSegment.direction
                            };
                            const target: End = {
                                corners: undefined, point: secondSegment.points[1], margin: undefined, direction: undefined
                            };
                            const intermediatePoints: PointModel[] = orthoConnection2Segment(source, target);
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
    public updateEndPoint(connector: Connector, oldChanges?: Connector): void {
        const conn: Connector = {
            sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint,
            sourceID: connector.sourceID ? connector.sourceID : undefined,
            targetID: connector.targetID ? connector.targetID : undefined,
            sourcePortID: connector.sourcePortID ? connector.sourcePortID : undefined,
            targetPortID: connector.targetPortID ? connector.targetPortID : undefined,
            segments: connector.segments ? connector.segments : undefined
        } as Connector;
        const newValue: Connector = { sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint } as Connector;
        if (connector.sourceID) {
            newValue.sourceID = connector.sourceID;
        }
        if (connector.targetID) {
            newValue.targetID = connector.targetID;
        }
        if (connector.sourcePortID) {
            newValue.sourcePortID = connector.sourcePortID;
        }
        if (connector.targetPortID) {
            newValue.targetPortID = connector.targetPortID;
        }
        if (connector.segments) {
            newValue.segments = connector.segments;
        }
        this.diagram.connectorPropertyChange(connector as Connector, oldChanges ? oldChanges : {} as Connector, newValue);
        // this.diagram.refreshDiagramLayer();
        this.diagram.updateSelector();
    }


    /**
     * @param obj
     * @param tx
     * @param ty
     * @param preventUpdate
     * @param point
     * @param endPoint
     * @param update
     * @param target
     * @param targetPortId
     * @param isDragSource
     * @param segment
     * @private
     */
    public dragSourceEnd(
        obj: ConnectorModel, tx: number, ty: number, preventUpdate?: boolean,
        point?: PointModel, endPoint?: string, update?: boolean, target?: NodeModel,
        targetPortId?: string, isDragSource?: boolean, segment?: BezierSegmentModel):
        boolean {
        const connector: Connector = this.diagram.nameTable[obj.id];
        let oldChanges: Connector = {} as Connector;
        const checkBoundaryConstraints: boolean = this.checkBoundaryConstraints(tx, ty, connector.wrapper.bounds);
        if (canDragSourceEnd(connector as Connector) && checkBoundaryConstraints
            && (endPoint !== 'BezierSourceThumb') && canPageEditable(this.diagram)) {
            oldChanges = { sourcePoint: connector.sourcePoint } as Connector;
            oldChanges = cloneObject(oldChanges) as any;
            connector.sourcePoint.x += tx;
            connector.sourcePoint.y += ty;
            if (endPoint === 'ConnectorSourceEnd' && connector.type === 'Orthogonal') {
                this.changeSegmentLength(connector, target, targetPortId, isDragSource);
            }
            if (connector.shape.type === 'Bpmn' && (connector.shape as BpmnFlow).sequence === 'Default') {
                this.updatePathElementOffset(connector);
            }
        }
        if (connector.type === 'Bezier') {
            oldChanges = { sourcePoint: connector.sourcePoint } as Connector;
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
            this.updateEndPoint(connector as Connector, oldChanges);
        }
        if (!(this.diagram.realActions & RealAction.AnimationClick)) {
            this.diagram.refreshCanvasLayers();
        }
        return checkBoundaryConstraints;
    }

    /**
     * Update Path Element offset
     */

    public updatePathElementOffset(connector: ConnectorModel): void {
        connector.wrapper.children.splice(3, 1);
        let pathElement: PathElement = new PathElement();
        const anglePoints: PointModel[] = (connector as Connector).intermediatePoints as PointModel[];
        pathElement = updatePathElement(anglePoints, connector);
        connector.wrapper.children.splice(3, 0, pathElement);
    }

    /**
     * Upadte the connector segments when change the source node
     */
    private changeSegmentLength(connector: Connector, target: NodeModel, targetPortId: string, isDragSource: boolean): void {
        if (connector.segments && (connector.segments[0] as OrthogonalSegment).direction !== null
            && ((!target && connector.sourceID === '') || isDragSource)) {
            const first: OrthogonalSegment = connector.segments[0] as OrthogonalSegment;
            const second: OrthogonalSegment = connector.segments[1] as OrthogonalSegment;
            const node: NodeModel = this.diagram.nameTable[connector.sourceID]; let secPoint: PointModel;
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
                    const next: OrthogonalSegment = connector.segments[2] as OrthogonalSegment;
                    const nextDirection: Direction = Point.direction(next.points[0], next.points[1]) as Direction;
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
                        const next: OrthogonalSegment = connector.segments[2] as OrthogonalSegment;
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
        const port: DiagramElement = this.diagram.getWrapper(target.wrapper, targetPortId);
        const point: PointModel = { x: port.offsetX, y: port.offsetY };
        const direction: Direction = getPortDirection(point, cornersPointsBeforeRotation(target.wrapper), target.wrapper.bounds, false);
        const firstSegment: OrthogonalSegment = connector.segments[0] as OrthogonalSegment;
        const secondSegment: OrthogonalSegment = connector.segments[1] as OrthogonalSegment;
        if (firstSegment.direction !== direction) {
            const segments: OrthogonalSegmentModel[] = [];
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
     * @param connector
     * @param changeTerminal
     * @private
Remove terinal segment in initial
     */
    public removeTerminalSegment(connector: Connector, changeTerminal?: boolean): void {
        for (let i: number = 0; i < connector.segments.length - 2; i++) {
            const segment: OrthogonalSegment = connector.segments[0] as OrthogonalSegment;
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
        const sourceWrapper: Corners = target.wrapper.children[0].corners; let sourcePoint: PointModel; let sourcePoint2: PointModel;
        const firstSegment: OrthogonalSegment = connector.segments[0] as OrthogonalSegment;
        const nextSegment: OrthogonalSegment = connector.segments[1] as OrthogonalSegment;
        const segments: OrthogonalSegmentModel[] = [];
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
                const segValues: Object = { type: 'Orthogonal', direction: direction, length: 20 };
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
                const segValues: Object = { type: 'Orthogonal', direction: direction, length: 20 };
                segments.push(new OrthogonalSegment(connector as Connector, 'segments', segValues, true));
                connector.segments = segments.concat(connector.segments);
            }
        }
    }
    //Translate the bezier points during the interaction
    private translateBezierPoints(
        connector: ConnectorModel, value: string, tx: number, ty: number, seg: BezierSegmentModel, point?: PointModel,
        update?: boolean):
        void {
        const index: number = (connector.segments.indexOf(seg));
        const segment: BezierSegment = connector.segments[index] as BezierSegment;
        let prevSegment: BezierSegment = index > 0 ? connector.segments[index - 1] as BezierSegment : null;
        let startPoint: PointModel = prevSegment != null ? prevSegment.point : connector.sourcePoint;
        let endPoint: PointModel = index == connector.segments.length - 1 ? connector.targetPoint : segment.point;

        if (segment) {
            if (value === 'BezierSourceThumb' && (segment.vector1.angle || segment.vector1.distance)) {
                let oldDistance: number = segment.vector1.distance;
                let oldAngle: number = segment.vector1.angle;
                segment.vector1 = {
                    distance: (connector as Connector).distance(startPoint, point),
                    angle: Point.findAngle(startPoint, point)
                };

                let deltaLength: number = segment.vector1.distance - oldDistance;
                let deltaAngle: number = segment.vector1.angle - oldAngle;
                this.translateSubsequentSegment(connector, seg, true, deltaLength, deltaAngle);
            } else if (value === 'BezierTargetThumb' && (segment.vector2.angle || segment.vector2.distance)) {
                let oldDistance: number = segment.vector2.distance;
                let oldAngle: number = segment.vector2.angle;
                segment.vector2 = {
                    distance: (connector as Connector).distance(endPoint, point),
                    angle: Point.findAngle(endPoint, point)
                };

                let deltaLength: number = segment.vector2.distance - oldDistance;
                let deltaAngle: number = segment.vector2.angle - oldAngle;
                this.translateSubsequentSegment(connector, seg, false, deltaLength, deltaAngle);
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

    private translateSubsequentSegment(connector: ConnectorModel, seg: BezierSegmentModel, isSourceEnd: boolean, deltaLength?: number, deltaAngle?: number) {
        const index: number = (connector.segments.indexOf(seg));
        const segment: BezierSegment = connector.segments[index] as BezierSegment;
        if (!(connector.bezierSettings.smoothness & BezierSmoothness.SymmetricAngle)) {
            deltaAngle = null;
        }

        if (!(connector.bezierSettings.smoothness & BezierSmoothness.SymmetricDistance)) {
            deltaLength = null;
        }

        if (deltaLength == null && deltaAngle == null) {
            return;
        }

        if (isSourceEnd) {
            if (index != 0) {
                this.updatePreviousBezierSegment(connector, index, deltaLength, deltaAngle);
            }
        }
        else {
            if (index != connector.segments.length - 1) {
                this.updateNextBezierSegment(connector, index, deltaLength, deltaAngle);
            }
        }
    }

    private updatePreviousBezierSegment(connector: ConnectorModel, index: number, deltaLength: number, deltaAngle: number): void {
        const segment: BezierSegment = connector.segments[index - 1] as BezierSegment;
        let newDistance: number = segment.vector2.distance + deltaLength;
        let newAngle: number = (segment.vector2.angle + deltaAngle) % 360;
        if (newAngle < 0) {
            newAngle += 360;
        }

        segment.vector2 = { distance: newDistance, angle: newAngle };
    }

    private updateNextBezierSegment(connector: ConnectorModel, index: number, deltaLength: number, deltaAngle: number): void {
        const segment: BezierSegment = connector.segments[index + 1] as BezierSegment;
        let newDistance: number = segment.vector1.distance + deltaLength;
        let newAngle: number = (segment.vector1.angle + deltaAngle) % 360;
        if (newAngle < 0) {
            newAngle += 360;
        }

        segment.vector1 = { distance: newDistance, angle: newAngle };
    }


    /**
     * dragTargetEnd method \
     *
     * @returns { void }     dragTargetEnd method .\
     * @param {ConnectorModel} obj - provide the obj value.
     * @param {number} tx - provide the tx value.
     * @param {number} ty - provide the ty value.
     * @param {boolean} preventUpdate - provide the preventUpdate value.
     * @param {PointModel} point - provide the point value.
     * @param {string} endPoint - provide the endPoint value.
     * @param {boolean} update - provide the update value.
     * @param {OrthogonalSegmentModel | BezierSegmentModel | StraightSegmentModel} segment - provide the segment value.
     *
     * @private
     */
    public dragTargetEnd(
        obj: ConnectorModel, tx: number, ty: number, preventUpdate?: boolean, point?: PointModel, endPoint?: string,
        update?: boolean, segment?: OrthogonalSegmentModel | BezierSegmentModel | StraightSegmentModel):
        boolean {
        const connector: ConnectorModel = this.diagram.nameTable[obj.id];
        let oldChanges: Connector;
        const boundaryConstraints: boolean = this.checkBoundaryConstraints(tx, ty, connector.wrapper.bounds);
        if (canDragTargetEnd(connector as Connector) && endPoint !== 'BezierTargetThumb'
            && boundaryConstraints && canPageEditable(this.diagram)) {
            oldChanges = { targetPoint: connector.targetPoint } as Connector;
            oldChanges = cloneObject(oldChanges) as any;
            connector.targetPoint.x += tx;
            connector.targetPoint.y += ty;
            if (endPoint === 'ConnectorTargetEnd' && connector.type === 'Orthogonal' &&
                connector.segments && connector.segments.length > 0) {
                const prev: OrthogonalSegment = connector.segments[connector.segments.length - 2] as OrthogonalSegment;
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
            if (connector.shape.type === 'Bpmn' && (connector.shape as BpmnFlow).sequence === 'Default') {
                this.updatePathElementOffset(connector);
            }
        }
        if (connector.type === 'Bezier') {
            oldChanges = { targetPoint: connector.targetPoint } as Connector;
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
            this.updateEndPoint(connector as Connector, oldChanges);
        }
        if (!(this.diagram.realActions & RealAction.AnimationClick)) {
            this.diagram.refreshCanvasLayers();
        }
        return boundaryConstraints;
    }

    /**
     * dragControlPoint method \
     *
     * @returns { void }     dragControlPoint method .\
     * @param {ConnectorModel} obj - provide the obj value.
     * @param {number} tx - provide the tx value.
     * @param {number} ty - provide the ty value.
     * @param {boolean} preventUpdate - provide the preventUpdate value.
     * @param {number} segmentNumber - provide the segmentNumber value.
     *
     * @private
     */
    public dragControlPoint(obj: ConnectorModel, tx: number, ty: number, preventUpdate?: boolean, segmentNumber?: number): boolean {
        const connector: ConnectorModel = this.diagram.nameTable[obj.id];
        if ((connector.type === 'Straight' || connector.type === 'Bezier') && connector.segments.length > 0) {
            if (segmentNumber !== undefined && connector.segments[segmentNumber]) {
                if (connector.type === 'Bezier') {
                    let seg: BezierSegmentModel = connector.segments[segmentNumber] as BezierSegmentModel;
                    let isInternalSegment = (seg as BezierSegment).isInternalSegment;
                    if (!isInternalSegment || connector.bezierSettings == null || connector.bezierSettings.segmentEditOrientation == 'FreeForm') {
                        seg.point.x += tx;
                        seg.point.y += ty;
                    }
                    else {
                        if (seg.orientation == 'Horizontal') {
                            seg.point.x += tx;
                        }
                        else {
                            seg.point.y += ty;
                        }

                        this.updateDirectionalBezierCurve(connector);
                    }
                    
                    if (isInternalSegment) {
                        (connector as Connector).isBezierEditing = true;
                    }
                }
                else {
                    (connector.segments[segmentNumber] as StraightSegmentModel).point.x += tx;
                    (connector.segments[segmentNumber] as StraightSegmentModel).point.y += ty;
                }
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

    public updateDirectionalBezierCurve(connector: ConnectorModel): void {
        if (connector.segments.length < 2) {
            return;
        }

        let pts: PointModel[] = [];
        pts.push(connector.sourcePoint);
        for (let i: number = 0; i < connector.segments.length - 1; i++) {
            let seg: BezierSegmentModel = connector.segments[i] as BezierSegmentModel;
            if (seg.orientation == 'Horizontal') {
                pts.push({ x: seg.point.x, y: pts[pts.length - 1].y });
            }
            else {
                pts.push({ x: pts[pts.length - 1].x, y: seg.point.y });
            }

            if (i == connector.segments.length - 2) {
                if (seg.orientation == 'Horizontal') {
                    pts.push({ x: seg.point.x, y: connector.targetPoint.y });
                }
                else {
                    pts.push({ x: connector.targetPoint.x, y: seg.point.y });
                }
            }
        }

        pts.push(connector.targetPoint);

        let start: PointModel = pts[0];
        let end: PointModel = pts[pts.length - 1];

        if (connector.segments.length > 1) {
            let mid1: PointModel = pts[1];
            let mid2: PointModel = pts[2];
            let center1: PointModel = { x: (mid1.x + mid2.x) * 0.5, y: (mid1.y + mid2.y) * 0.5 };
            var segment1: BezierSegmentModel = connector.segments[0];
            segment1.vector1.angle = findAngle(start, mid1);
            segment1.vector1.distance = Point.findLength(start, mid1) * 0.5;
            segment1.vector2.angle = findAngle(center1, mid1);
            segment1.vector2.distance = Point.findLength(center1, mid1) * 0.5;
            segment1.point = center1;

            var segment2: BezierSegmentModel = connector.segments[1];
            segment2.vector1.angle = findAngle(center1, mid2);
            segment2.vector1.distance = Point.findLength(center1, mid2) * 0.5;
            if (connector.segments.length > 2) {
                let mid3: PointModel = pts[3];
                let center2: PointModel = { x: (mid2.x + mid3.x) * 0.5, y: (mid2.y + mid3.y) * 0.5 };
                segment2.vector2.angle = findAngle(center2, mid2);
                segment2.vector2.distance = Point.findLength(center2, mid2) * 0.5;
                segment2.point = center2;

                var segment3: BezierSegmentModel = connector.segments[2];
                segment3.vector1.angle = findAngle(center2, mid3);
                segment3.vector1.distance = Point.findLength(center2, mid3) * 0.5;
                if (connector.segments.length > 3) {
                    let mid4: PointModel = pts[4];
                    let center3: PointModel = { x: (mid3.x + mid4.x) * 0.5, y: (mid3.y + mid4.y) * 0.5 };
                    segment3.vector2.angle = findAngle(center3, mid3);
                    segment3.vector2.distance = Point.findLength(center3, mid3) * 0.5;
                    segment3.point = center3;

                    var segment4: BezierSegmentModel = connector.segments[3];
                    segment4.vector1.angle = findAngle(center3, mid4);
                    segment4.vector1.distance = Point.findLength(center3, mid4) * 0.5;
                    segment4.vector2.angle = findAngle(end, mid4);
                    segment4.vector2.distance = Point.findLength(end, mid4) * 0.5;
                }
                else {
                    segment3.vector2.angle = findAngle(end, mid3);
                    segment3.vector2.distance = Point.findLength(end, mid3) * 0.5;
                }
            }
            else {
                segment2.vector2.angle = findAngle(end, mid2);
                segment2.vector2.distance = Point.findLength(end, mid2) * 0.5;
            }
        }
    }

    /**
     * rotatePropertyChnage method \
     *
     * @returns { void }     rotatePropertyChnage method .\
     * @param {number} angle - provide the obj value.
     *
     * @private
     */
    public rotatePropertyChnage(angle: number): void {
        const selectedItems: SelectorModel = this.diagram.selectedItems;
        let objects: (NodeModel | ConnectorModel)[] = [];
        objects = objects.concat(selectedItems.nodes);
        objects = objects.concat(selectedItems.connectors);
        const pivotValue: PointModel = { x: selectedItems.offsetX, y: selectedItems.offsetY };
        this.rotateObjects(selectedItems, objects, angle - selectedItems.rotateAngle, pivotValue);
        selectedItems.wrapper.rotateAngle = selectedItems.rotateAngle = angle;
        this.diagram.updateSelector();
    }
    /**
     * rotateObjects method \
     *
     * @returns { void }     rotateObjects method .\
     * @param {NodeModel | SelectorModel} parent - provide the parent value.
     * @param {(NodeModel | ConnectorModel)[]} objects - provide the objects value.
     * @param {number} angle - provide the angle value.
     * @param {PointModel} pivot - provide the pivot value.
     * @param {boolean} includeParent - provide the includeParent value.
     *
     * @private
     */
    public rotateObjects(
        parent: NodeModel | SelectorModel, objects: (NodeModel | ConnectorModel)[], angle: number, pivot?: PointModel,
        includeParent?: boolean): void {
        pivot = pivot || {};
        const matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, angle, pivot.x, pivot.y);
        let oldValues: Node;
        for (const obj of objects) {
            if (obj instanceof Node) {
                if (canRotate(obj) && canPageEditable(this.diagram)) {
                    if (includeParent !== false || parent !== obj) {
                        oldValues = { rotateAngle: obj.rotateAngle } as Node;
                        obj.rotateAngle += angle;
                        obj.rotateAngle = (obj.rotateAngle + 360) % 360;
                        const newOffset: PointModel = transformPointByMatrix(matrix, { x: obj.offsetX, y: obj.offsetY });
                        obj.offsetX = newOffset.x;
                        obj.offsetY = newOffset.y;
                        this.diagram.nodePropertyChange(
                            obj as Node, {} as Node,
                            { offsetX: obj.offsetX, offsetY: obj.offsetY, rotateAngle: obj.rotateAngle } as Node);
                    }
                    if (obj.processId) {
                        const parent: NodeModel = this.diagram.nameTable[obj.processId];
                        const bound: Rect = this.diagram.bpmnModule.getChildrenBound(parent, obj.id, this.diagram);
                        this.diagram.bpmnModule.updateSubProcessess(bound, obj, this.diagram);
                    }
                    if (obj.children && obj.children.length && !obj.container) {
                        this.getChildren(obj, objects);
                    }
                }
            } else {
                this.rotatePoints(obj as Connector, angle, pivot || { x: obj.wrapper.offsetX, y: obj.wrapper.offsetY });
            }
            this.diagram.updateDiagramObject(obj);
        }
        this.diagram.refreshCanvasLayers();
        this.diagram.updateSelector();
    }

    /**
     * snapConnectorEnd method \
     *
     * @returns { PointModel }     snapConnectorEnd method .\
     * @param {PointModel} currentPosition - provide the parent value.
     *
     * @private
     */
    public snapConnectorEnd(currentPosition: PointModel): PointModel {
        if ((this.diagram.snapSettings.constraints & SnapConstraints.SnapToLines)
            && this.snappingModule) {
            this.diagram.snappingModule.snapConnectorEnd(currentPosition);
        }
        return currentPosition;

    }

    /**
     * snapAngle method \
     *
     * @returns { number }     snapAngle method .\
     * @param {number} angle - provide the parent value.
     *
     * @private
     */
    public snapAngle(angle: number): number {
        if ((this.diagram.snapSettings.constraints & SnapConstraints.SnapToLines)
            && this.snappingModule) {
            return this.snappingModule.snapAngle(this.diagram, angle);
        } else {
            return 0;
        }
    }

    /**
     * rotatePoints method \
     *
     * @returns { number }     rotatePoints method .\
     * @param {Connector} conn - provide the parent value.
     * @param {number} angle - provide the parent value.
     * @param {PointModel} pivot - provide the parent value.
     *
     * @private
     */
     public rotatePoints(conn: Connector, angle: number, pivot: PointModel): void {
        if (!conn.sourceWrapper || !conn.targetWrapper) {
            const matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, angle, pivot.x, pivot.y);
            conn.sourcePoint = transformPointByMatrix(matrix, conn.sourcePoint);
            conn.targetPoint = transformPointByMatrix(matrix, conn.targetPoint);
            if (conn.shape.type === 'Bpmn' && (conn.shape as BpmnFlow).sequence === 'Default') {
                this.updatePathElementOffset(conn);
            }
            const newProp: Connector = { sourcePoint: conn.sourcePoint, targetPoint: conn.targetPoint } as Connector;
            this.diagram.connectorPropertyChange(conn as Connector, {} as Connector, newProp);
            if (conn.segments && conn.segments.length > 0) {
                this.diagram.protectPropertyChange(true);
                let connector: Connector = conn;
                connector.segments = [];
                this.diagram.connectorPropertyChange(connector, {} as Connector, { segments: connector.segments } as Connector);
                this.diagram.protectPropertyChange(false);
            }
        }
    }

    private updateInnerParentProperties(tempNode: NodeModel): void {
        const elements: (NodeModel | ConnectorModel)[] = [];
        const protect: string = 'isProtectedOnChange';
        const protectChange: boolean = this.diagram[protect];
        this.diagram.protectPropertyChange(true);
        const innerParents: (NodeModel | ConnectorModel)[] = this.getAllDescendants(tempNode, elements, false, true);
        for (let i: number = 0; i < innerParents.length; i++) {
            const obj: NodeModel = this.diagram.nameTable[innerParents[i].id];
            obj.offsetX = obj.wrapper.offsetX;
            obj.offsetY = obj.wrapper.offsetY;
            obj.width = obj.wrapper.width;
            obj.height = obj.wrapper.height;
        }
        this.diagram.protectPropertyChange(protectChange);
    }

    /**
     * scale method \
     *
     * @returns { boolean }     scale method .\
     * @param {NodeModel | ConnectorModel} obj - provide the parent value.
     * @param {number} sw - provide the parent value.
     * @param {number} sh - provide the parent value.
     * @param {number} pivot - provide the parent value.
     * @param {number} refObject - provide the parent value.
     * @param {boolean} isOutsideBoundary - provide the parent value.
     *
     * @private
     */
    // eslint-disable-next-line max-len
    public scale(obj: NodeModel | ConnectorModel, sw: number, sh: number, pivot: PointModel, refObject?: IElement, isOutsideBoundary?: boolean): boolean {
        const node: IElement = this.diagram.nameTable[obj.id];
        const tempNode: Node = node as Node;
        const elements: (NodeModel | ConnectorModel)[] = [];
        const element: DiagramElement = node.wrapper;
        if (!refObject) { refObject = obj as IElement; }
        const refWrapper: Container = refObject.wrapper;
        const x: number = refWrapper.offsetX - refWrapper.actualSize.width * refWrapper.pivot.x;
        const y: number = refWrapper.offsetY - refWrapper.actualSize.height * refWrapper.pivot.y;
        const refPoint: PointModel = getPoint(
            x, y, refWrapper.actualSize.width, refWrapper.actualSize.height,
            refWrapper.rotateAngle, refWrapper.offsetX, refWrapper.offsetY, pivot);
        if (element.actualSize.width !== undefined && element.actualSize.height !== undefined && canPageEditable(this.diagram)) {
            if (tempNode.children && !(tempNode.container)) {
                const nodes: (NodeModel | ConnectorModel)[] = this.getAllDescendants(tempNode, elements);
                for (const temp of nodes) {
                    this.scaleObject(sw, sh, refPoint, temp as IElement, element, refObject);
                }
                obj.wrapper.measure(new Size());
                obj.wrapper.arrange(obj.wrapper.desiredSize);
                this.diagram.updateGroupOffset(node);
                this.updateInnerParentProperties(tempNode);
            } else {
                this.scaleObject(sw, sh, refPoint, node, element, refObject);
            }
            const bounds: Rect = getBounds(obj.wrapper);
            const checkBoundaryConstraints: boolean = this.checkBoundaryConstraints(undefined, undefined, bounds);
            if (!checkBoundaryConstraints && isOutsideBoundary) {
                this.scale(obj, 1 / sw, 1 / sh, pivot, undefined, true);
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
        const temp: NodeModel = node; const parentNodes: NodeModel[] = [];
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

    /**
     * getChildren method \
     *
     * @returns { (NodeModel | ConnectorModel)[]): (NodeModel | ConnectorModel)[] }     getChildren method .\
     * @param {NodeModel} node - provide the sw value.
     * @param {(NodeModel | ConnectorModel)[]} nodes - provide the sw value.
     *
     * @private
     */
    public getChildren(node: NodeModel, nodes: (NodeModel | ConnectorModel)[]): (NodeModel | ConnectorModel)[] {
        const temp: NodeModel = node;
        if (node.children) {
            for (let i: number = 0; i < temp.children.length; i++) {
                node = (this.diagram.nameTable[temp.children[i]]);
                nodes.push(node);
            }
        }
        return nodes;
    }

    /**
     * scaleObject method \
     *
     * @returns { NodeModel }     scaleObject method .\
     * @param {string} id - provide the sw value.
     *
     * @private
     */
    public cloneChild(id: string): NodeModel {
        const node: NodeModel = this.diagram.nameTable[id];
        return node;
    }

    /**
     * scaleObject method \
     *
     * @returns { void }     scaleObject method .\
     * @param {End} sw - provide the sw value.
     * @param {End} sh - provide the sh value.
     * @param {PointModel} pivot - provide the pivot value.
     * @param {IElement} obj - provide the pivot value.
     * @param {DiagramElement} element - provide the element value.
     * @param {IElement} refObject - provide the refObject value.
     *
     * @private
     */
     public scaleObject(sw: number, sh: number, pivot: PointModel, obj: IElement, element: DiagramElement, refObject: IElement, canUpdate?: boolean): void {
        sw = sw < 0 ? 1 : sw; sh = sh < 0 ? 1 : sh;
        let oldValues: NodeModel = {} as Node;
        if (sw !== 1 || sh !== 1) {
            let width: number; let height: number;
            if (obj instanceof Node) {
                const node: Node = obj; let isResize: boolean; let bound: Rect;
                oldValues = {
                    width: obj.wrapper.actualSize.width, height: obj.wrapper.actualSize.height,
                    offsetX: obj.wrapper.offsetX, offsetY: obj.wrapper.offsetY,
                    margin: { top: node.margin.top, left: node.margin.left }
                };
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
            const matrix: Matrix = identityMatrix();// let refWrapper: DiagramElement;
            if (!refObject) { refObject = obj; }
            const refWrapper: DiagramElement = refObject.wrapper;
            rotateMatrix(matrix, -refWrapper.rotateAngle, pivot.x, pivot.y);
            scaleMatrix(matrix, sw, sh, pivot.x, pivot.y);
            rotateMatrix(matrix, refWrapper.rotateAngle, pivot.x, pivot.y);
            if (obj instanceof Node) {
                const node: Node = obj; //let left: number; let top: number;
                const newPosition: PointModel = transformPointByMatrix(matrix, { x: node.wrapper.offsetX, y: node.wrapper.offsetY });
                const oldleft: number = node.wrapper.offsetX - node.wrapper.actualSize.width * node.pivot.x;
                const oldtop: number = node.wrapper.offsetY - node.wrapper.actualSize.height * node.pivot.y;
                if (width > 0) {
                    if (node.processId) {
                        const parent: Node = this.diagram.nameTable[node.processId];
                        if (!parent.maxWidth || ((node.margin.left + width) < parent.maxWidth)) {
                            node.width = width; node.offsetX = newPosition.x;
                        }
                    } else {
                        node.width = width; node.offsetX = newPosition.x;
                    }
                }
                if (height > 0) {
                    if (node.processId) {
                        const parent: Node = this.diagram.nameTable[node.processId];
                        if (!parent.maxHeight || ((node.margin.top + height) < parent.maxHeight)) {
                            node.height = height; node.offsetY = newPosition.y;
                        }
                    } else {
                        node.height = height; node.offsetY = newPosition.y;
                    }
                }
                const left: number = node.wrapper.offsetX - node.wrapper.actualSize.width * node.pivot.x;
                const top: number = node.wrapper.offsetY - node.wrapper.actualSize.height * node.pivot.y;
                const parent: NodeModel = this.diagram.nameTable[node.processId];
                if (parent && ((node.margin.top + (top - oldtop)) <= 0 ||
                    (node.margin.left + (left - oldleft) <= 0))) {
                    this.diagram.nodePropertyChange(obj as Node, {} as Node, {
                        margin: { top: node.margin.top, left: node.margin.left }
                    } as Node);
                } else {
                    if (checkParentAsContainer(this.diagram, obj, true)) {
                        checkChildNodeInContainer(this.diagram, obj);
                    } else {
                        if (!canUpdate) {
                            this.diagram.nodePropertyChange(obj as Node, oldValues as Node, {
                                width: node.width, height: node.height, offsetX: node.offsetX, offsetY: node.offsetY,
                                margin: { top: node.margin.top + (top - oldtop), left: node.margin.left + (left - oldleft) }
                            } as Node);
                        }
                    }
                }
            } else {
                const connector: Connector = obj as Connector;
                const oldValues: Connector = { sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint } as Connector;
                if (!connector.sourceWrapper || !connector.targetWrapper) {
                    this.scaleConnector(connector, matrix, oldValues, sw, sh, pivot);
                }
            }
            const parentNode: NodeModel = this.diagram.nameTable[(obj as Node).processId];
            if (parentNode) {
                const parent: Rect = parentNode.wrapper.bounds; const child: Rect = (obj as Node).wrapper.bounds;
                const bound: Rect = this.diagram.bpmnModule.getChildrenBound(parentNode, (obj as Node).id, this.diagram);
                this.diagram.bpmnModule.updateSubProcessess(bound, (obj as Node), this.diagram);
            }
        }
    }

    private scaleConnector(connector: Connector, matrix: Matrix, oldValues: Connector, sw?: number, sh?: number, pivot?: PointModel): void {
        connector.sourcePoint = transformPointByMatrix(matrix, connector.sourcePoint);
        connector.targetPoint = transformPointByMatrix(matrix, connector.targetPoint);
        if (connector.shape.type === 'Bpmn' && (connector.shape as BpmnFlow).sequence === 'Default') {
            this.updatePathElementOffset(connector);
        }
        const newProp: Connector = { sourcePoint: connector.sourcePoint, targetPoint: connector.targetPoint } as Connector;
        this.diagram.connectorPropertyChange(connector, oldValues, newProp);
        const selector: Selector = this.diagram.selectedItems as Selector;
        if (selectionHasConnector(this.diagram, selector)) {
            let clonedSelectedItems: object = cloneObject(this.diagram.selectedItems);
            const nodeModel: NodeModel = {
                offsetX: (clonedSelectedItems as any).offsetX, offsetY: (clonedSelectedItems as any).offsetY,
                height: (clonedSelectedItems as any).height, width: (clonedSelectedItems as any).width, rotateAngle: (clonedSelectedItems as any).rotateAngle
            };
            const obj: Node = new Node(this.diagram, 'nodes', nodeModel, true);
            obj.wrapper = (clonedSelectedItems as any).wrapper;
            obj.wrapper.rotateAngle = selector.rotateAngle;
            this.scaleObject(sw, sh, pivot, obj as IElement, obj.wrapper, obj, true);
            selector.wrapper.actualSize.width = obj.width;
            selector.wrapper.actualSize.height = obj.height;
            selector.wrapper.offsetX = obj.offsetX;
            selector.wrapper.offsetY = obj.offsetY;
            let child: ConnectorModel = this.diagram.selectedItems.connectors[0];
            if (child.id !== connector.id) {
                this.measureSelector(selector);
            }
        }
    }

    private measureSelector(selector: Selector) {
        let desiredBounds: Rect = undefined;
        //Measuring the children
        let clonedSelectedItems: object = cloneObject(this.diagram.selectedItems);
        let objects: ConnectorModel[] = [];
        let bounds: Rect;
        objects = (clonedSelectedItems as SelectorModel).connectors;
        const pivot: PointModel = { x: this.diagram.selectedItems.offsetX, y: this.diagram.selectedItems.offsetY };
        for (let i: number = 0; i < objects.length; i++) {
            const matrix: Matrix = identityMatrix();
            rotateMatrix(matrix, -selector.rotateAngle, pivot.x, pivot.y);
            objects[i].sourcePoint = transformPointByMatrix(matrix, objects[i].sourcePoint);
            objects[i].targetPoint = transformPointByMatrix(matrix, objects[i].targetPoint);
            let p1: PointModel = { x: objects[i].sourcePoint.x, y: objects[i].sourcePoint.y };
            let p2: PointModel = { x: objects[i].targetPoint.x, y: objects[i].targetPoint.y };
            bounds = (this.calculateBounds(p1, p2));
            if (desiredBounds === undefined) {
                desiredBounds = bounds;
            } else {
                desiredBounds.uniteRect(bounds);
            }
        }
        let offsetPt: PointModel = {};
        if (desiredBounds !== undefined) {
            offsetPt = {
                x: desiredBounds.x + desiredBounds.width * selector.wrapper.pivot.x,
                y: desiredBounds.y + desiredBounds.height * selector.wrapper.pivot.y
            };
        }
        const nodeModel: NodeModel = {
            offsetX: offsetPt.x, offsetY: offsetPt.y,
            height: desiredBounds.height, width: desiredBounds.width, rotateAngle: 0
        };
        const obj: Node = new Node(this.diagram, 'nodes', nodeModel, true);
        const matrix: Matrix = identityMatrix();
        rotateMatrix(matrix, selector.rotateAngle, pivot.x, pivot.y);
        obj.rotateAngle += selector.rotateAngle;
        obj.rotateAngle = (obj.rotateAngle + 360) % 360;
        const newOffset: PointModel = transformPointByMatrix(matrix, { x: obj.offsetX, y: obj.offsetY });
        obj.offsetX = newOffset.x;
        obj.offsetY = newOffset.y;
        selector.wrapper.actualSize.width = desiredBounds.width;
        selector.wrapper.actualSize.height = desiredBounds.height;
        selector.wrapper.offsetX = obj.offsetX;
        selector.wrapper.offsetY = obj.offsetY;
        const selectorEle: (SVGElement | HTMLCanvasElement) = getSelectorElement(this.diagram.element.id);
        this.diagram.diagramRenderer.renderResizeHandle(
            selector.wrapper, selectorEle, selector.thumbsConstraints, this.diagram.scroller.currentZoom,
            selector.constraints, this.diagram.scroller.transform, false, canMove(selector)
        );
    }

    private calculateBounds(p1: PointModel, p2: PointModel): Rect {
        let left: number = Math.min(p1.x, p2.x);
        let right: number = Math.max(p1.x, p2.x);
        let top: number = Math.min(p1.y, p2.y);
        let bottom: number = Math.max(p1.y, p2.y);
        let width: number = right - left;
        let height: number = bottom - top;
        let rect: Rect = new Rect(left, top, width, height);
        return rect;
    }

    /**
     * portDrag method \
     *
     * @returns { void }     portDrag method .\
     * @param { NodeModel | ConnectorModel} obj - provide the obj value.
     * @param {DiagramElement} portElement - provide the portElement value.
     * @param {number} tx - provide the tx value.
     * @param {number} ty - provide the tx value.
     *
     * @private
     */
    public portDrag(
        obj: NodeModel | ConnectorModel, portElement: DiagramElement, tx: number, ty: number): void {
        let oldValues: Object; let changedvalues: Object;
        const port: PointPortModel = this.findTarget(portElement, obj as IElement) as PointPortModel;
        const bounds: Rect = getBounds(obj.wrapper);
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
        //let changedvalues: Object;
        //let label: ShapeAnnotationModel | PathAnnotationModel;
        // eslint-disable-next-line max-len
        const label: ShapeAnnotationModel | PathAnnotationModel = this.findTarget(textElement, obj as IElement) as ShapeAnnotationModel | PathAnnotationModel;
        const bounds: Rect = cornersPointsBeforeRotation(obj.wrapper);
        const oldValues: Object = this.getAnnotationChanges(obj, label as ShapeAnnotation | PathAnnotation);
        if (label instanceof ShapeAnnotation) {
            label.offset.x += (tx / bounds.width);
            label.offset.y += (ty / bounds.height);
        } else {
            this.updatePathAnnotationOffset(obj as Connector, label as PathAnnotation, tx, ty);
            if (label instanceof PathAnnotation) { label.alignment = 'Center'; }
        }
        const changedvalues: Object = this.getAnnotationChanges(obj, label as ShapeAnnotation | PathAnnotation);
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
        const textWrapper: DiagramElement = this.diagram.getWrapper(object.wrapper, label.id);
        const offsetX: number = textWrapper.offsetX;
        const offsetY: number = textWrapper.offsetY; let offset: PointModel;
        const intermediatePoints: PointModel[] = object.intermediatePoints;
        let prev: PointModel; let pointLength: number = 0; let totalLength: number = 0;
        let intersectingOffset: PointModel;
        let currentPosition:PointModel;
        switch(label.verticalAlignment){
            case "Center":
                if(label.horizontalAlignment == 'Center'){
                    currentPosition = (newPosition) ? newPosition : { x: offsetX +tx, y: offsetY +ty};
                }
                else if(label.horizontalAlignment == 'Right'){
                    currentPosition = (newPosition) ? newPosition : { x: offsetX+(textWrapper.outerBounds.width)/2  +tx, y: offsetY +ty};
                }
                else if(label.horizontalAlignment == 'Left'){
                    currentPosition = (newPosition) ? newPosition : { x: offsetX-(textWrapper.outerBounds.width)/2  +tx, y: offsetY +ty};
                }
                break;
            case "Top":
                if(label.horizontalAlignment == 'Center'){
                    currentPosition = (newPosition) ? newPosition : { x: offsetX +tx, y: offsetY-(textWrapper.outerBounds.height)/2  +ty};
                }
                else if(label.horizontalAlignment == 'Right'){
                    currentPosition = (newPosition) ? newPosition : { x: offsetX+ (textWrapper.outerBounds.width)/2 +tx, y: offsetY-(textWrapper.outerBounds.height)/2  +ty};
                }
                else if(label.horizontalAlignment == 'Left'){
                    currentPosition = (newPosition) ? newPosition : { x: offsetX- (textWrapper.outerBounds.width)/2 +tx, y: offsetY-(textWrapper.outerBounds.height)/2  +ty};
                }
                break;
            case "Bottom":
                if(label.horizontalAlignment == 'Center'){
                    currentPosition = (newPosition) ? newPosition : { x: offsetX +tx, y: offsetY+ (textWrapper.outerBounds.height)/2 +ty};
                }
                else if(label.horizontalAlignment == 'Right'){
                    currentPosition = (newPosition) ? newPosition : { x: offsetX+ (textWrapper.outerBounds.width)/2 +tx, y: offsetY+ (textWrapper.outerBounds.height)/2 +ty};
                }
                else if(label.horizontalAlignment == 'Left'){
                    currentPosition = (newPosition) ? newPosition : { x: offsetX- (textWrapper.outerBounds.width)/2 +tx, y: offsetY+ (textWrapper.outerBounds.height)/2 +ty};
                }
                break;
        }
        const intersetingPts: PointModel[] = this.getInterceptWithSegment(currentPosition, intermediatePoints);
        let newOffset: PointModel = intermediatePoints[intermediatePoints.length - 1];
        totalLength = Point.getLengthFromListOfPoints(intermediatePoints);
        if (intersetingPts.length > 0) {
            if (label.dragLimit.top || label.dragLimit.bottom || label.dragLimit.left || label.dragLimit.right) {
                const minDistance: Distance = { minDistance: null };
                newOffset = this.getRelativeOffset(currentPosition, intermediatePoints, minDistance);
                const distance: Distance = { minDistance: null };
                intersectingOffset = this.getRelativeOffset(currentPosition, intersetingPts, distance);
                if (minDistance != null && (distance as Distance).minDistance < (minDistance as Distance).minDistance) {
                    newOffset = intersectingOffset;
                } else {
                    const connectorOffset: SegmentInfo = getOffsetOfConnector(object.intermediatePoints, label);
                    newOffset = connectorOffset.point;
                }
            } else {
                intersectingOffset = intersetingPts[intersetingPts.length - 1];
                newOffset = intersectingOffset;
            }
            if (newOffset) {
                let p: number; let bounds: Rect;
                for (p = 0; p < intermediatePoints.length; p++) {
                    if (prev != null) {
                        bounds = Rect.toBounds([prev, intermediatePoints[p]]);
                        if (bounds.containsPoint(newOffset)) {
                            pointLength += Point.findLength(prev, newOffset);
                            break;
                        } else {
                            pointLength += Point.findLength(prev, intermediatePoints[p]);
                        }
                    }
                    prev = intermediatePoints[p];
                }
                offset = { x: pointLength / totalLength, y: 0 };
            }
            this.updateLabelMargin(object, label, offset, currentPosition, size, tx, ty);
        } else {
            this.updateLabelMargin(object, label, null, currentPosition, size, tx, ty);
        }
    }

    private getRelativeOffset(currentPosition: PointModel, points: PointModel[], minDistance: Distance): PointModel {
        let newOffset: PointModel; let distance: number; let pt: PointModel; let i: number;
        for (i = 0; i < points.length; i++) {
            pt = points[i];
            distance = Math.round(Math.sqrt(Math.pow((currentPosition.x - pt.x), 2) +
                Math.pow((currentPosition.y - pt.y), 2)));
            if ((minDistance as Distance).minDistance === null ||
                Math.min(Math.abs((minDistance as Distance).minDistance), Math.abs(distance)) === Math.abs(distance)) {
                newOffset = pt;
                (minDistance as Distance).minDistance = distance;
            }
        }
        return newOffset;
    }

    private dragLimitValue(label: PathAnnotation, point: PointModel, tempPt: PointModel, contentDimension: Rect): IsDragArea {
        let x: boolean = false; let y: boolean = false;
        if ((tempPt.x >= (point.x - label.dragLimit.left - (contentDimension.width / 2))) &&
            (tempPt.x <= point.x + label.dragLimit.right + (contentDimension.width / 2))) {
            x = true;
        }
        if ((tempPt.y >= (point.y - label.dragLimit.top - (contentDimension.height / 2))) &&
            (tempPt.y <= point.y + label.dragLimit.bottom + (contentDimension.height / 2))) {
            y = true;
        }
        return { x: x, y: y };
    }
    /* eslint-disable */
    private updateLabelMargin(
        node: Connector, label: PathAnnotation, offset: PointModel, tempPt: PointModel, size?: Size, tx?: number, ty?: number): void {
        offset = offset ? offset : { x: label.offset, y: 0 };
        if (label && offset && offset.x > 0 && offset.x < 1) {
            //let point: PointModel;
            const length: number = Point.getLengthFromListOfPoints(node.intermediatePoints);
            const point: PointModel = this.getPointAtLength(length * offset.x, node.intermediatePoints, 0);
            const curZoomfactor: number = this.diagram.scrollSettings.currentZoom;
            const dragLimit: MarginModel = label.dragLimit;
            if (dragLimit.top || dragLimit.bottom || dragLimit.left || dragLimit.right) {
                const labelBounds: DiagramElement = this.diagram.getWrapper(node.wrapper, label.id);
                const contentDimension: Rect = new Rect(0, 0, 0, 0);
                const annotationWrtapper: DiagramElement = this.diagram.getWrapper(node.wrapper, label.id);
                contentDimension.x = ((annotationWrtapper).offsetX / curZoomfactor) + tx;
                contentDimension.y = (annotationWrtapper.offsetY / curZoomfactor) + ty;
                contentDimension.width = annotationWrtapper.bounds.width / curZoomfactor;
                contentDimension.height = annotationWrtapper.bounds.height / curZoomfactor;
                const draggableBounds: Rect = new Rect(
                    point.x - (dragLimit.left || 0) - contentDimension.width / 2,
                    point.y - (dragLimit.top || 0) - contentDimension.height / 2,
                    (dragLimit.left || 0) + (dragLimit.right || 0) + contentDimension.width,
                    (dragLimit.top || 0) + (dragLimit.bottom || 0) + contentDimension.height
                );
                if (draggableBounds.containsPoint(tempPt)) {
                    tempPt = tempPt;
                } else {
                    let lineIntersects: PointModel[];
                    const line1: PointModel[] = [point, tempPt];
                    lineIntersects = this.boundsInterSects(line1, draggableBounds, false);
                    for (const i of lineIntersects) {
                        const ptt: PointModel = i;
                        tempPt = ptt;
                    }
                }
                const cursorLimit: IsDragArea = this.dragLimitValue(label, point, tempPt, contentDimension as Rect);
                label.margin = {
                    left: cursorLimit.x ? tempPt.x - point.x : label.margin.left,
                    top: cursorLimit.y ? tempPt.y - point.y : label.margin.top, right: 0, bottom: 0
                };
            } else {
                label.margin = { left: tempPt.x - point.x, top: tempPt.y - point.y, right: 0, bottom: 0 };
            }
            label.offset = offset.x;
            if (size) {
                label.width = size.width;
                label.height = size.height;
            }
        }
    }

    private boundsInterSects(polyLine: PointModel[], bounds: Rect, self: boolean): PointModel[] {
        let intersects: PointModel[];
        if (bounds) {
            const polyLine2: PointModel[] = [
                { x: bounds.x, y: bounds.y },
                { x: bounds.x + bounds.width, y: bounds.y },
                { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
                { x: bounds.x, y: bounds.y + bounds.height },
                { x: bounds.x, y: bounds.y }
            ];
            intersects = this.intersect(polyLine, polyLine2, self);
        }
        return intersects;
    }

    private intersect(polyLine1: PointModel[], polyLine2: PointModel[], self: boolean): PointModel[] {
        const intersect: PointModel[] = [];
        for (let i: number = 0; i < polyLine1.length - 1; i++) {
            for (let j: number = 0; j < polyLine2.length - 1; j++) {
                const p: PointModel = intersect2(polyLine1[i], polyLine1[i + 1], polyLine2[j], polyLine2[j + 1]);
                if (p.x !== 0 && p.y !== 0) {
                    intersect.push(p);
                }
            }
        }
        return intersect;
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
                const l: number = Point.findLength(pre, pt);
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
        const intercepts: PointModel[] = []; let imgLine: PointModel[] = []; let segemnt: PointModel[] = [];
        let tarAngle: number; let srcAngle: number; //let maxLength: number;
        const maxLength: number = Point.findLength({ x: 0, y: 0 }, { x: this.diagram.scroller.viewPortWidth, y: this.diagram.scroller.viewPortHeight });
        for (let i: number = 1; i < conPoints.length; i++) {
            segemnt = [conPoints[i - 1], conPoints[i]];
            imgLine = [];
            srcAngle = Math.round(Point.findAngle(segemnt[0], segemnt[1]) % 360);
            tarAngle = Math.round(Point.findAngle(segemnt[1], segemnt[0]) % 360);
            const angleAdd: number = (srcAngle > 0 && srcAngle <= 90) || (srcAngle > 180 && srcAngle <= 270) ? 90 : -90;
            imgLine.push(Point.transform(currentPosition, srcAngle + angleAdd, maxLength));
            imgLine.push(Point.transform(currentPosition, tarAngle + angleAdd, maxLength));
            const lineUtil1: Segment = { x1: segemnt[0].x, y1: segemnt[0].y, x2: segemnt[1].x, y2: segemnt[1].y };
            const lineUtil2: Segment = { x1: imgLine[0].x, y1: imgLine[0].y, x2: imgLine[1].x, y2: imgLine[1].y };
            const line3: Intersection = intersect3(lineUtil1, lineUtil2);
            if (line3.enabled) {
                intercepts.push(line3.intersectPt);
            }
        }
        return intercepts;
    }
    /** @private */
    public getAnnotationChanges(object: NodeModel | ConnectorModel, label: ShapeAnnotation | PathAnnotation): Object {
        const index: string = findObjectIndex(object as NodeModel, label.id, true);
        const annotations: Object = {};
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
        const index: string = findObjectIndex(object as NodeModel, port.id, false);
        const ports: Object = {};
        ports[index] = { offset: port.offset };
        return { ports: ports };
    }

    /** @private */
    public labelRotate(
        object: NodeModel | ConnectorModel, label: ShapeAnnotation | PathAnnotation,
        currentPosition: PointModel, selector: Selector): void {
        let oldValues: Object; let changedvalues: Object;
        oldValues = this.getAnnotationChanges(object, label);
        const matrix: Matrix = identityMatrix();
        const rotateAngle: number = (label as ShapeAnnotation).rotateAngle;
        const labelWrapper: DiagramElement = this.diagram.getWrapper(object.wrapper, label.id);
        let angle: number = findAngle({ x: labelWrapper.offsetX, y: labelWrapper.offsetY }, currentPosition) + 90;
        const snapAngle: number = this.snapAngle(angle);
        angle = snapAngle !== 0 ? snapAngle : angle;
        if (label instanceof PathAnnotation && label.segmentAngle) {
            const getPointloop: SegmentInfo = getAnnotationPosition(
                (object as Connector).intermediatePoints, label as PathAnnotation, (object as Connector).wrapper.bounds);
            angle -= getPointloop.angle;
        }
        angle = (angle + 360) % 360;
        label.rotateAngle += angle - (label.rotateAngle + labelWrapper.parentTransform);
        if (label instanceof PathAnnotation) {
            label.alignment = 'Center';
            label.horizontalAlignment = label.verticalAlignment = 'Center';
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
        const textElement: DiagramElement = selector.wrapper.children[0];
        if ((deltaWidth && deltaWidth !== 1) || (deltaHeight && deltaHeight !== 1)) {
            const newMat: Matrix = identityMatrix(); const matrix: Matrix = identityMatrix();
            rotateMatrix(newMat, -(node as NodeModel).rotateAngle, (node as NodeModel).offsetX, (node as NodeModel).offsetY);
            rotateAngle = ((textElement.rotateAngle + ((node instanceof Node) ? (node as NodeModel).rotateAngle : 0)) + 360) % 360;
            rotateMatrix(matrix, -rotateAngle, pivot.x, pivot.y);
            scaleMatrix(matrix, deltaWidth, deltaHeight, pivot.x, pivot.y);
            rotateMatrix(matrix, rotateAngle, pivot.x, pivot.y);
            const height: number = textElement.actualSize.height * deltaHeight;
            const width: number = textElement.actualSize.width * deltaWidth;
            const shape: ShapeAnnotationModel | PathAnnotationModel = this.findTarget(textElement, node as IElement) as ShapeAnnotation;
            let newPosition: PointModel = transformPointByMatrix(matrix, { x: textElement.offsetX, y: textElement.offsetY });
            if(shape instanceof PathAnnotation){
                switch (label.verticalAlignment) {
                    case "Center":
                        if (label.horizontalAlignment == 'Center') {
                            newPosition = transformPointByMatrix(matrix, { x: textElement.offsetX, y: textElement.offsetY });
                        }
                        else if (label.horizontalAlignment == 'Right') {
                            newPosition = transformPointByMatrix(matrix, { x: textElement.offsetX+(textElement.outerBounds.width)/2, y: textElement.offsetY });
                        }
                        else if (label.horizontalAlignment == 'Left') {
                            newPosition = transformPointByMatrix(matrix, { x: textElement.offsetX-(textElement.outerBounds.width)/2, y: textElement.offsetY });
                        }
                        break;
                    case "Top":
                        if (label.horizontalAlignment == 'Center') {
                            newPosition = transformPointByMatrix(matrix, { x: textElement.offsetX, y: textElement.offsetY-(textElement.outerBounds.height)/2 });
                        }
                        else if (label.horizontalAlignment == 'Right') {
                            newPosition = transformPointByMatrix(matrix, { x: textElement.offsetX+(textElement.outerBounds.width)/2, y: textElement.offsetY-(textElement.outerBounds.height)/2 });
                        }
                        else if (label.horizontalAlignment == 'Left') {
                            newPosition = transformPointByMatrix(matrix, { x: textElement.offsetX-(textElement.outerBounds.width)/2, y: textElement.offsetY-(textElement.outerBounds.height)/2 });
                        }
                        break;
                    case "Bottom":
                        if (label.horizontalAlignment == 'Center') {
                            newPosition = transformPointByMatrix(matrix, { x: textElement.offsetX, y: textElement.offsetY+(textElement.outerBounds.height)/2 });
                        }
                        else if (label.horizontalAlignment == 'Right') {
                            newPosition = transformPointByMatrix(matrix, { x: textElement.offsetX+(textElement.outerBounds.width)/2, y: textElement.offsetY+(textElement.outerBounds.height)/2 })
                        }
                        else if (label.horizontalAlignment == 'Left') {
                            newPosition = transformPointByMatrix(matrix, { x: textElement.offsetX-(textElement.outerBounds.width)/2, y: textElement.offsetY+(textElement.outerBounds.height)/2 })
                        }
                        break;
                }
            }
            if (shape instanceof PathAnnotation) {
                this.updatePathAnnotationOffset(node as Connector, label as PathAnnotation, 0, 0, newPosition, new Size(width, height));
            } else {
                const bounds: Rect = cornersPointsBeforeRotation(node.wrapper);
                newPosition = transformPointByMatrix(newMat, newPosition);
                newPosition.x = newPosition.x - textElement.margin.left + textElement.margin.right;
                newPosition.y = newPosition.y - textElement.margin.top + textElement.margin.bottom;
                newPosition.y += (shape.verticalAlignment === 'Top') ? (-height / 2) : (
                    (shape.verticalAlignment === 'Bottom') ? (height / 2) : 0);
                newPosition.x += (shape.horizontalAlignment === 'Left') ? (-width / 2) : (
                    (shape.horizontalAlignment === 'Right') ? (width / 2) : 0);
                const offsetx: number = bounds.width / (newPosition.x - bounds.x);
                const offsety: number = bounds.height / (newPosition.y - bounds.y);
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
        const selector: SelectorModel = { nodes: [], connectors: [] };
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
        const pageSettings: PageSettings = this.diagram.pageSettings as PageSettings;
        const boundaryConstraints: BoundaryConstraints = (this.diagram.pageSettings as PageSettings).boundaryConstraints;
        const scroller: DiagramScroller = this.diagram.scroller;
        if (boundaryConstraints === 'Page' || boundaryConstraints === 'Diagram') {
            const selectorBounds: Rect = !nodeBounds ? this.diagram.selectedItems.wrapper.bounds : undefined;
            const width: number = boundaryConstraints === 'Page' ? pageSettings.width : scroller.viewPortWidth;
            const height: number = boundaryConstraints === 'Page' ? pageSettings.height : scroller.viewPortHeight;
            const bounds: Rect = nodeBounds;
            const right: number = (nodeBounds ? bounds.right : selectorBounds.right) + (tx || 0);
            const left: number = (nodeBounds ? bounds.left : selectorBounds.left) + (tx || 0);
            const top: number = (nodeBounds ? bounds.top : selectorBounds.top) + (ty || 0);
            const bottom: number = (nodeBounds ? bounds.bottom : selectorBounds.bottom) + (ty || 0);
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
        let obj: SelectorModel | NodeModel | ConnectorModel = this.diagram.selectedItems;
        if (this.state && !this.state.backup) {
            this.state.backup = {};
            this.state.backup.offsetX = obj.offsetX;
            this.state.backup.offsetY = obj.offsetY;
        }
        obj = renderContainerHelper(this.diagram, obj) || obj;
        if (this.checkBoundaryConstraints(tx, ty)) {
            this.diagram.diagramActions = this.diagram.diagramActions | (DiagramAction.PreventZIndexOnDragging | DiagramAction.DragUsingMouse);
            const actualObject: Node = this.diagram.selectedObject.actualObject as Node;
            if ((actualObject && actualObject instanceof Node && actualObject.isLane &&
                canLaneInterchange(actualObject, this.diagram)) || (!actualObject || !actualObject.isLane)) {
                this.diagram.drag(obj, tx, ty);
            }
            this.diagram.diagramActions = this.diagram.diagramActions & ~(DiagramAction.PreventZIndexOnDragging | DiagramAction.DragUsingMouse);
            this.diagram.refreshCanvasLayers();
            return true;
        }
        return false;
    }
    /** @private */
    public scaleSelectedItems(sx: number, sy: number, pivot: PointModel): boolean {
        let obj: SelectorModel | NodeModel | ConnectorModel = this.diagram.selectedItems;
        if (this.state && !this.state.backup) {
            this.state.backup = {};
            this.state.backup.offsetX = obj.offsetX;
            this.state.backup.offsetY = obj.offsetY;
            this.state.backup.width = obj.width;
            this.state.backup.height = obj.height;
            this.state.backup.pivot = pivot;
        }
        obj = renderContainerHelper(this.diagram, obj) || obj;
        return this.diagram.scale(obj, sx, sy, pivot);

    }
    /** @private */
    public rotateSelectedItems(angle: number): boolean {
        let obj: SelectorModel | NodeModel | ConnectorModel = this.diagram.selectedItems;
        if (this.state && !this.state.backup) {
            this.state.backup = {};
            this.state.backup.angle = obj.rotateAngle;
        }
        obj = renderContainerHelper(this.diagram, obj) || obj;
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
        const propName: string = 'isProtectedOnChange';
        const protectedChange: boolean = this.diagram[propName];
        this.diagram.protectPropertyChange(true);
        const node: Node = (args.target || args.source) as Node;
        const oldValues: Node = { isExpanded: node.isExpanded } as Node;
        node.isExpanded = !node.isExpanded;
        this.diagram.preventNodesUpdate = true;
        this.diagram.diagramActions |= DiagramAction.PreventIconsUpdate;
        this.diagram.nodePropertyChange(node, oldValues, { isExpanded: node.isExpanded } as Node);
        this.diagram.diagramActions = this.diagram.diagramActions & ~DiagramAction.PreventIconsUpdate;
        this.diagram.preventNodesUpdate = false;
        for (const temp of this.diagram.views) {
            const view: View = this.diagram.views[temp];
            if (!(view instanceof Diagram)) {
                this.diagram.refreshCanvasDiagramLayer(view);
            }
        }
        this.diagram.protectPropertyChange(protectedChange);
    }

    /** @private */
    public expandNode(node: Node, diagram?: Diagram, canLayout?: boolean): ILayout {
        let animation: boolean;
        //let objects: ILayout;
        const preventNodesUpdate: Boolean = this.diagram.preventNodesUpdate;
        const expand: boolean = node.isExpanded;
        this.diagram.preventNodesUpdate = true;
        this.diagram.preventConnectorsUpdate = true;
        this.expandCollapse(node, expand, this.diagram);
        node.isExpanded = expand;
        const fixedNode: string = this.diagram.layout.fixedNode;
        this.diagram.layout.fixedNode = node.id;
        if ((this.diagram.diagramActions != DiagramAction.Render) && this.diagram.layoutAnimateModule && this.diagram.layout.enableAnimation && this.diagram.organizationalChartModule) {
            this.diagram.organizationalChartModule.isAnimation = true;
        }
        this.diagram.blazorActions |= BlazorAction.expandNode;
        let objects: ILayout = {};
        if (!canLayout) {
            // BLAZ-22230 - Added below code to check if its blazor means then we set canUpdateTemplate as true
            if(isBlazor()) {
                this.canUpdateTemplate = true;
            }
            objects = this.diagram.doLayout() as ILayout;
        }
        this.canUpdateTemplate = false;
        this.diagram.blazorActions &= ~BlazorAction.expandNode;
        this.diagram.preventNodesUpdate = preventNodesUpdate;
        this.diagram.preventConnectorsUpdate = false;

        if (this.diagram.layoutAnimateModule && this.diagram.organizationalChartModule && !canLayout) {
            this.diagram.allowServerDataBinding = false;
            this.layoutAnimateModule.expand(this.diagram.layout.enableAnimation, objects, node, this.diagram);
        } else {
            const arg: IExpandStateChangeEventArgs = {
                element: cloneBlazorObject(clone(node)), state: (node.isExpanded) ? true : false
            };
            this.triggerEvent(DiagramEvent.expandStateChange, arg);
            if (this.diagram.lineRoutingModule && this.diagram.constraints & DiagramConstraints.LineRouting) {
                this.diagram.resetSegments();
            }
        }
        this.diagram.layout.fixedNode = fixedNode === '' ? '' : this.diagram.layout.fixedNode;
        return objects;
    }

    private getparentexpand(target: Node, diagram: Diagram, visibility: boolean, connector: ConnectorModel): boolean {
        let boolean: boolean;
        for (let i: number = 0; i < target.inEdges.length; i++) {
            const newConnector: ConnectorModel = diagram.nameTable[target.inEdges[i]];
            const previousNode: NodeModel = diagram.nameTable[newConnector.sourceID];
            if (previousNode.isExpanded && !visibility && previousNode.id !== connector.sourceID && newConnector.visible) {
                return false;
            } else {
                boolean = true;
            }
        }
        return boolean;
    }
    /**
     * Setinterval and Clear interval for layout animation
     */
    /** @private */
    public expandCollapse(source: Node, visibility: boolean, diagram: Diagram): void {
        for (let i: number = 0; i < source.outEdges.length; i++) {
            const connector: ConnectorModel = diagram.nameTable[source.outEdges[i]];
            const target: Node = diagram.nameTable[connector.targetID];
            const value: boolean = this.getparentexpand(target, diagram, visibility, connector);
            connector.visible = visibility;
            const oldValues: (NodeModel | ConnectorModel) = {
                visible: target.visible,
                style: { opacity: target.wrapper.style.opacity }
            };
            const newValues: (NodeModel | ConnectorModel) = {
                visible: target.visible,
                style: { opacity: target.wrapper.style.opacity }
            };
            if (value) {
                if (target.isExpanded) {
                    this.expandCollapse(target, visibility, diagram);
                }

                target.visible = visibility;
                target.style.opacity = (this.diagram.layoutAnimateModule &&
                    this.diagram.layout.enableAnimation && visibility) ? 0.1 : target.style.opacity;

                diagram.nodePropertyChange(target as Node, oldValues as Node, newValues as Node);
            }
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
            (obj.wrapper.children[0] as PathElement).canMeasurePath = true;
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
    /**
     * @private
     */
    public updateSelectedNodeProperties(object?: NodeModel | ConnectorModel[]): void {
        if (this.diagram.lineRoutingModule && (this.diagram.constraints & DiagramConstraints.LineRouting)) {
            const previousNodeObject: object[] = []; const previousConnectorObject: object[] = [];
            const updateNodeObject: object[] = []; const updateConnectorObject: object[] = [];
            const changeNodes: object[] = []; const changeConnectors: object[] = [];
            this.diagram.protectPropertyChange(true);
            let objects: NodeModel | ConnectorModel[] = []; const connectors: string[] = [];
            const actualObject: NodeModel = this.diagram.selectedObject.actualObject;
            const helperObject: NodeModel = this.diagram.selectedObject.helperObject;

            if (helperObject && actualObject) {
                const offsetX: number = (helperObject.offsetX - actualObject.offsetX);
                const offsetY: number = (helperObject.offsetY - actualObject.offsetY);
                const width: number = (helperObject.width - actualObject.width);
                const height: number = (helperObject.height - actualObject.height);
                const rotateAngle: number = (helperObject.rotateAngle - actualObject.rotateAngle);
                if (this.diagram.selectedItems.nodes.length + this.diagram.selectedItems.connectors.length > 0) {
                    this.diagram.selectedItems.wrapper.rotateAngle = this.diagram.selectedItems.rotateAngle = helperObject.rotateAngle;
                }
                if (actualObject instanceof Node &&
                    actualObject.shape.type !== 'SwimLane' && !actualObject.isLane && !actualObject.isPhase && !actualObject.isHeader) {
                    if (actualObject.offsetX !== actualObject.wrapper.offsetX || actualObject.offsetY !== actualObject.wrapper.offsetY ||
                        actualObject.width !== actualObject.wrapper.width || actualObject.height !== actualObject.wrapper.height ||
                        actualObject.rotateAngle !== actualObject.wrapper.rotateAngle) {
                        if (isBlazor()) {
                            previousNodeObject.push(cloneObject(actualObject, undefined, undefined, true));
                        }
                        actualObject.offsetX += offsetX; actualObject.offsetY += offsetY;
                        actualObject.width += width; actualObject.height += height; actualObject.rotateAngle += rotateAngle;
                        this.diagram.nodePropertyChange(actualObject as Node, {} as Node, {
                            offsetX: actualObject.offsetX, offsetY: actualObject.offsetY,
                            width: actualObject.width, height: actualObject.height, rotateAngle: actualObject.rotateAngle
                        } as Node);
                        if (isBlazor()) {
                            updateNodeObject.push(cloneObject(actualObject, undefined, undefined, true));
                        }
                    }
                    objects = this.diagram.spatialSearch.findObjects(actualObject.wrapper.outerBounds as Rect);
                } else if (actualObject instanceof Selector) {
                    for (let i: number = 0; i < actualObject.nodes.length; i++) {
                        const node: Node = actualObject.nodes[i] as Node;
                        if (node instanceof Node && node.shape.type !== 'SwimLane' && !node.isLane
                            && !node.isPhase && !node.isHeader) {
                            node.offsetX += offsetX; node.offsetY += offsetY;
                            node.width += width; node.height += height; node.rotateAngle += rotateAngle;
                            this.diagram.nodePropertyChange(node, {} as Node, {
                                offsetX: node.offsetX, offsetY: node.offsetY,
                                width: node.width, height: node.height, rotateAngle: node.rotateAngle
                            } as Node);
                            objects = objects.concat(this.diagram.spatialSearch.findObjects(actualObject.wrapper.outerBounds as Rect));
                        }
                    }
                }
            } else {
                if (object instanceof Connector) {
                    objects.push(object);
                } else if (object instanceof Selector && object.connectors.length) {
                    objects = objects.concat(object.connectors);
                }
            }
            for (let i: number = 0; i < objects.length; i++) {
                if (objects[i] instanceof Connector && connectors.indexOf(objects[i].id) === -1) {
                    connectors.push(objects[i].id);
                }
            }
            this.diagram.lineRoutingModule.renderVirtualRegion(this.diagram, true);
            for (let i: number = 0; i < connectors.length; i++) {
                const connector: Object = this.diagram.nameTable[connectors[i]];
                if (connector instanceof Connector && connector.type === 'Orthogonal') {
                    if (isBlazor()) {
                        previousConnectorObject.push(cloneObject(connector, undefined, undefined, true));
                    }
                    this.diagram.lineRoutingModule.refreshConnectorSegments(this.diagram, connector, true);
                    if (isBlazor()) {
                        updateConnectorObject.push(cloneObject(connector, undefined, undefined, true));
                    }
                }
            }
            this.updateSelector();
            if (isBlazor()) {
                this.getObjectChanges(previousNodeObject, updateNodeObject, changeNodes);
                this.getObjectChanges(previousConnectorObject, updateConnectorObject, changeConnectors);
                const blazorInterop: string = 'sfBlazor';
                const blazor: string = 'Blazor';
                const diagramObject: Object = { nodes: changeNodes, connectors: changeConnectors };
                if (window && window[blazor] && (changeConnectors.length + changeNodes.length)) {
                    const obj: object = { 'methodName': 'UpdateBlazorProperties', 'diagramobj': diagramObject };
                    window[blazorInterop].updateBlazorProperties(obj, this.diagram);
                }
            }
            this.diagram.protectPropertyChange(false);
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
        const obj: Node = this.diagram.nameTable[(child as Node).id] || (child as SelectorModel).nodes[0];
        if (oldTarget) {
            if ((obj) && obj.processId && obj.processId === oldTarget.wrapper.id) {
                const node: Node = clone(obj) as Node;
                node.processId = obj.processId;
                this.diagram.startGroupAction();
                let edges: string[] = [];
                edges = edges.concat((obj as Node).outEdges, (obj as Node).inEdges);
                for (let i: number = edges.length - 1; i >= 0; i--) {
                    const connector: ConnectorModel = this.diagram.nameTable[edges[i]];
                    if (connector) {
                        this.diagram.remove(connector);
                    }
                }
                //let nodeCollection: string[];
                const nodeCollection: string[] = ((this.diagram.nameTable[obj.processId].shape as BpmnShape).activity.subProcess.processes) || [];
                nodeCollection.splice(nodeCollection.indexOf((obj).id), 1);
                this.diagram.bpmnModule.removeChildFromBPMN(this.diagram.nameTable[obj.processId].wrapper, (obj).id);
                this.diagram.nameTable[(obj).id].processId = '';
                obj.offsetX = obj.wrapper.offsetX;
                obj.offsetY = obj.wrapper.offsetY;
                const undoElement: NodeModel = clone(obj);
                const entry: HistoryEntry = {
                    type: 'PositionChanged', redoObject: { nodes: [undoElement] }, undoObject: { nodes: [node] }, category: 'Internal'
                };
                this.addHistoryEntry(entry);
                this.diagram.endGroupAction();
            }
        }
    }

    /** @private */
    public isDroppable(source: IElement, targetNodes: IElement): boolean {
        const node: Node = this.diagram.nameTable[(source as Node).id] || (source as SelectorModel).nodes[0];
        if (node) {
            if ((!isBlazor() && (node.shape as BpmnShape).shape === 'TextAnnotation') ||
                (isBlazor() && (node.shape as DiagramShape).bpmnShape === 'TextAnnotation')) {
                return true;
            }
            if (node && node.shape.type === 'Bpmn') {
                if ((node.processId === (targetNodes as Node).id) || (node.id === (targetNodes as Node).processId) ||
                    (targetNodes as Node).shape.type === 'Bpmn'
                    && ((targetNodes as Node).shape as BpmnShape).activity.subProcess.collapsed) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    /**
     * @private
     */
    public renderHighlighter(args: MouseEventArgs, connectHighlighter?: boolean, source?: boolean): void {
        const bounds: Rect = new Rect();
        if (args.target instanceof Node || (connectHighlighter && args.source instanceof Node)) {
            const tgt: IElement = connectHighlighter ? args.source : args.target;
            const tgtWrap: DiagramElement = connectHighlighter ? args.sourceWrapper : args.targetWrapper;
            const target: NodeModel | PointPortModel = this.findTarget(tgtWrap, tgt, source, true) as (NodeModel | PointPortModel);
            let element: DiagramElement;
            if (target instanceof BpmnSubEvent) {
                const portId: string = target.id;
                const node: NodeModel = args.target;
                const parent: Canvas = ((node.wrapper.children[0] as Canvas).children[0] as Canvas).children[2] as Canvas;
                for (const child of parent.children) {
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
        const obj: SelectorModel = this.diagram.selectedItems;
        let point: PointModel;
        const towardsLeft: boolean = endPoint.x < startPoint.x;
        const towardsTop: boolean = endPoint.y < startPoint.y;
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
        const node: Node = (source instanceof Node) ? source : (source as Selector).nodes[0] as Node;
        if (this.diagram.bpmnModule && (target as Node).shape.type === 'Bpmn'
            && ((!isBlazor() && (node.shape as BpmnShape).shape === 'TextAnnotation') ||
                (isBlazor() && (node.shape as DiagramShape).bpmnShape === 'TextAnnotation'))) {
            const hasTarget: string = 'hasTarget';
            node[hasTarget] = (target as Node).id;
            ((node.shape as BpmnShape).annotation as BpmnAnnotation).nodeId = (target as Node).id;
            if (!this.diagram.currentSymbol) {
                this.diagram.addTextAnnotation((node.shape as BpmnShape).annotation, target);
                ((node.shape as BpmnShape).annotation as BpmnAnnotation).nodeId = '';
                this.diagram.remove(node);
            }
            this.diagram.refreshDiagramLayer();
        }
    }
    /** @private */
    public drop(source: IElement, target: IElement, position: PointModel): void {
        //drop
        if (this.diagram.bpmnModule) {
            const sourcenode: Node = (source instanceof Node) ? source : (source as Selector).nodes[0] as Node;
            if (sourcenode && sourcenode.shape.type === 'Bpmn' && (target as Node).shape.type === 'Bpmn') {
                this.diagram.bpmnModule.dropBPMNchild(
                    target as Node, (source instanceof Node) ? source : (source as Selector).nodes[0] as Node, this.diagram);
                this.diagram.refreshDiagramLayer();
            }
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
            objects[0] = this.diagram.nameTable[objects[0].id] || objects[0];
            const bounds: Rect = (type === 'Object') ? getBounds(objects[0].wrapper) : this.diagram.selectedItems.wrapper.bounds;
            let undoObj: SelectorModel = { nodes: [], connectors: [] };
            let redoObj: SelectorModel = { nodes: [], connectors: [] };
            for (i = ((type === 'Object') ? (i + 1) : i); i < objects.length; i++) {
                let tx: number = 0;
                let ty: number = 0;
                objects[i] = this.diagram.nameTable[objects[i].id] || objects[i];
                const objectBounds: Rect = getBounds(objects[i].wrapper);
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
            const entry: HistoryEntry = {
                type: 'Align', category: 'Internal',
                undoObject: cloneObject(undoObj), redoObject: cloneObject(redoObj)
            };
            this.addHistoryEntry(entry);
        }
    }
    /**
     * distribute method \
     *
     * @returns { void }     distribute method .\
     * @param {(NodeModel | ConnectorModel)[]} objects - provide the source value.
     * @param {SizingOptions} option - provide the target value.
     *
     * @private
     */
    public distribute(objects: (NodeModel | ConnectorModel)[], option: DistributeOptions): void {
        if (objects.length > 0) {
            let i: number = 0;
            //const j: number = 0;
            //const rect: Rect = new Rect();
            //const b: Rect[] = [];
            //let temp: NodeModel | ConnectorModel;
            let right: number = 0;
            let left: number = 0;
            let top: number = 0;
            let bottom: number = 0;
            let center: number = 0;
            let middle: number = 0;
            let btt: number = 0;
            //const sum: number = 0;
            let undoSelectorObj: SelectorModel = { nodes: [], connectors: [] };
            let redoSelectorObj: SelectorModel = { nodes: [], connectors: [] };
            for (i = 0; i < objects.length; i++) {
                objects[i] = this.diagram.nameTable[objects[i].id] || objects[i];
            }
            objects = sort(objects, option);
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
                const prev: Rect = getBounds(objects[i - 1].wrapper);
                const current: Rect = getBounds(objects[i].wrapper);
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
            const entry: HistoryEntry = {
                type: 'Distribute', category: 'Internal',
                undoObject: cloneObject(undoSelectorObj), redoObject: cloneObject(redoSelectorObj)
            };
            this.addHistoryEntry(entry);
        }
    }
    /* eslint-enable */
    /**
     * sameSize method \
     *
     * @returns { void }     sameSize method .\
     * @param {(NodeModel | ConnectorModel)[]} objects - provide the source value.
     * @param {SizingOptions} option - provide the target value.
     *
     * @private
     */
    public sameSize(objects: (NodeModel | ConnectorModel)[], option: SizingOptions): void {
        if (objects.length > 0) {
            let i: number = 0;
            //let pivot: PointModel;
            const pivot: PointModel = { x: 0.5, y: 0.5 };
            objects[0] = this.diagram.nameTable[objects[0].id] || objects[0];
            const bounds: Rect = getBounds(objects[0].wrapper);
            let undoObject: SelectorModel = { nodes: [], connectors: [] };
            let redoObject: SelectorModel = { nodes: [], connectors: [] };
            for (i = 1; i < objects.length; i++) {
                objects[i] = this.diagram.nameTable[objects[i].id] || objects[0];
                const rect: Rect = getBounds(objects[i].wrapper);
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
            const entry: HistoryEntry = {
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

    /**
     * updatePanState method \
     *
     * @returns { any }     updatePanState method .\
     * @param {number} eventCheck - provide the eventCheck value.
     *
     * @private
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public updatePanState(eventCheck: boolean): any {
        if (eventCheck) {
            this.diagram.realActions = this.diagram.realActions | RealAction.PanInProgress;
        } else {
            this.diagram.dataBind();
            const diagramScrollSettings = this.diagram.scrollSettings;
            this.diagram.realActions = this.diagram.realActions & ~RealAction.PanInProgress;
            const Values: ScrollValues = {
                VerticalOffset: diagramScrollSettings.verticalOffset, HorizontalOffset: diagramScrollSettings.horizontalOffset,
                ViewportHeight: diagramScrollSettings.viewPortHeight, ViewportWidth: diagramScrollSettings.viewPortWidth,
                CurrentZoom: diagramScrollSettings.currentZoom
            };
            const arg: IScrollChangeEventArgs | IBlazorScrollChangeEventArgs = {
                oldValue: Values as ScrollValues,
                newValue: Values, source: this.diagram, panState: 'Completed'
            };
            this.triggerEvent(DiagramEvent.scrollChange, arg);
        }
    }

    /**
     * dataBinding method \
     *
     * @returns { void }     dataBinding method .\
     *
     * @private
     */
    public dataBinding(): void {
        this.diagram.dataBind();
    }
    public setBlazorDiagramProps(arg: boolean): void {
        this.diagram.setBlazorDiagramProps(arg);
    }
    /**
     * scroll method \
     *
     * @returns { void }     scroll method .\
     * @param {number} scrollX - provide the source value.
     * @param {number} scrollY - provide the target value.
     * @param {PointModel} focusPoint - provide the layoutOrientation value.
     *
     * @private
     */
    public scroll(scrollX: number, scrollY: number, focusPoint?: PointModel): void {
        const panx: number = canPanX(this.diagram);
        const pany: number = canPanY(this.diagram);
        if (isBlazor()) {
            this.diagram.setCursor('grabbing');
            this.diagram.scroller.zoom(
                1, (scrollX = panx ? scrollX : 0) * this.diagram.scroller.currentZoom,
                (scrollY = pany ? scrollY : 0) * this.diagram.scroller.currentZoom, focusPoint);
        } else {
            this.diagram.pan(
                (scrollX = panx ? scrollX : 0) * this.diagram.scroller.currentZoom,
                (scrollY = pany ? scrollY : 0) * this.diagram.scroller.currentZoom, focusPoint);
        }
    }

    /**
     * drawHighlighter method \
     *
     * @returns { NodeModel | ConnectorModel }     drawHighlighter method .\
     * @param {IElement} element - provide the element value.
     *
     * @private
     */
    public drawHighlighter(element: IElement): void {
        this.diagram.renderHighlighter(element.wrapper);
    }


    /**
     * removeHighlighter method \
     *
     * @returns { void }     removeHighlighter method .\
     *
     * @private
     */
    public removeHighlighter(): void {
        this.diagram.clearHighlighter();
    }

    /**
     * renderContainerHelper method \
     *
     * @returns { NodeModel | ConnectorModel }     renderContainerHelper method .\
     * @param {NodeModel | SelectorModel | ConnectorModel} node - provide the parent value.
     *
     * @private
     */
    public renderContainerHelper(node: NodeModel | SelectorModel | ConnectorModel): NodeModel | ConnectorModel {
        return renderContainerHelper(this.diagram, node);
    }


    /**
     * isParentAsContainer method \
     *
     * @returns { boolean }     isParentAsContainer method .\
     * @param {NodeModel} node - provide the parent value.
     * @param {boolean} isChild - provide the target value.
     *
     * @private
     */
    public isParentAsContainer(node: NodeModel, isChild?: boolean): boolean {
        return checkParentAsContainer(this.diagram, node, isChild);
    }



    /**
     * dropChildToContainer method \
     *
     * @returns { void }     dropChildToContainer method .\
     * @param {NodeModel} parent - provide the parent value.
     * @param {NodeModel} node - provide the target value.
     *
     * @private
     */
    public dropChildToContainer(parent: NodeModel, node: NodeModel): void {
        if (!(this.diagram.diagramActions & DiagramAction.PreventLaneContainerUpdate)) {
            addChildToContainer(this.diagram, parent, node);
        }
    }
    /**
    *
    * @private
    */
    public updateLaneChildrenZindex(node: Node, target: IElement): void {
        let lowerIndexobject: Node = this.findLeastIndexObject(node, target) as Node;
        let swimlane: Node = this.diagram.nameTable[(target as Node).parentId];
        if (swimlane && swimlane.zIndex > lowerIndexobject.zIndex) {
            let layerIndex: number = this.diagram.layers.indexOf(this.diagram.getActiveLayer());
            const layerZIndexTable: {} = (this.diagram.layers[layerIndex] as Layer).zIndexTable;
            const tempTable: {} = JSON.parse(JSON.stringify(layerZIndexTable));
            let startIndex: number = lowerIndexobject.zIndex;
            let endIndex: number = swimlane.zIndex;
            for (var i = endIndex; i >= startIndex; i--) {
                if (startIndex !== i) {
                    if (!layerZIndexTable[i - 1]) {
                        layerZIndexTable[i - 1] = layerZIndexTable[i];
                        this.diagram.nameTable[layerZIndexTable[i - 1]].zIndex = i;
                        delete layerZIndexTable[i];
                    } else {
                        //bringing the objects forward
                        layerZIndexTable[i] = layerZIndexTable[i - 1];
                        this.diagram.nameTable[layerZIndexTable[i]].zIndex = i;
                    }
                } else {
                    let tempIndex: number = this.swapZIndexObjects(endIndex, layerZIndexTable, swimlane.id, tempTable);
                }
            }
            if (this.diagram.mode === 'SVG') {
                this.moveSvgNode((target as Node).parentId, lowerIndexobject.id);
                this.updateNativeNodeIndex((target as Node).parentId, lowerIndexobject.id);

            } else {
                this.diagram.refreshCanvasLayers();
            }
        }
    }
    private findLeastIndexConnector(edges: string[], target: IElement, index: Node | Connector): Node | Connector {
        for (let i: number = 0; i < edges.length; i++) {
            let connector: Connector = this.diagram.nameTable[edges[i]];
            if ((index as Node).zIndex > connector.zIndex) {
                index = connector
            }
        }
        return index;
    }
    private findLeastIndexObject(node: Node, target: IElement): Node | Connector {
        let lowerIndexobject: Node | Connector = node as Node;
        if (node instanceof Node) {
            lowerIndexobject = this.findLeastIndexConnector(node.inEdges, target, lowerIndexobject) as Node;
            lowerIndexobject = this.findLeastIndexConnector(node.outEdges, target, lowerIndexobject) as Node;
        }

        return lowerIndexobject;
    }
    /**
     * checkSelection method \
     *
     * @returns { void }     checkSelection method .\
     * @param {SelectorModel} selector - provide the source value.
     * @param {string} corner - provide the target value.
     *
     * @private
     */
    public checkSelection(selector: SelectorModel, corner: string): void {
        let node: NodeModel;// let wrapper: GridPanel; let child: Container; let index: number; let shape: SwimLaneModel;
        if (selector.nodes.length === 1 && selector.connectors.length === 0) {
            if (checkParentAsContainer(this.diagram, selector.nodes[0], true)) {
                node = (selector.nodes[0].shape === 'SwimLane') ? selector.nodes[0] :
                    this.diagram.nameTable[(selector.nodes[0] as Node).parentId];
                const child: Node = selector.nodes[0] as Node;
                if (node.shape.type === 'SwimLane') {
                    const orientation: boolean = ((node.shape as SwimLaneModel).orientation === 'Horizontal') ? true : false;
                    if ((child.isPhase && ((orientation && corner === 'ResizeSouth') || (!orientation && corner === 'ResizeEast'))) ||
                        (child.isLane && ((orientation && corner === 'ResizeEast') || (!orientation && corner === 'ResizeSouth')))) {
                        swimLaneSelection(this.diagram, node, corner);
                    }
                } else if (node.container.type === 'Grid') {
                    if (((node.container.orientation === 'Horizontal' && child.rowIndex === 1) ||
                        (node.container.orientation === 'Vertical' && child.rowIndex > 0 && child.columnIndex > 0))) {
                        if (corner === 'ResizeSouth') {
                            for (let i: number = 0; i < this.diagram.nodes.length; i++) {
                                const obj: NodeModel = this.diagram.nodes[i];
                                if (obj.rowIndex === node.rows.length - 1 && obj.columnIndex === 0) {
                                    this.select(obj);
                                    break;
                                }
                            }
                        }
                    } else {
                        if (corner === 'ResizeEast') {
                            for (let i: number = 0; i < this.diagram.nodes.length; i++) {
                                const obj: NodeModel = this.diagram.nodes[i];
                                if (obj.rowIndex === 1 && obj.columnIndex === node.columns.length - 1) {
                                    this.select(obj);
                                    break;
                                }
                            }
                        }
                    }
                }
            } else {
                swimLaneSelection(this.diagram, selector.nodes[0], corner);
            }
        }
    }

    /**
     * zoom method \
     *
     * @returns { void }     zoom method .\
     * @param {number} scale - provide the source value.
     * @param {number} scrollX - provide the target value.
     * @param {number} scrollY - provide the layoutOrientation value.
     * @param {PointModel} focusPoint - provide the layoutOrientation value.
     *
     * @private
     */
    public zoom(scale: number, scrollX: number, scrollY: number, focusPoint?: PointModel): void {
        this.diagram.scroller.zoom(
            scale, scrollX * this.diagram.scroller.currentZoom, scrollY * this.diagram.scroller.currentZoom, focusPoint);
    }
}

/** @private */
export interface ConnectorPropertyChanging{
    connectorIndex?:number;
    connectorOldProperty?:ConnectorModel;
    sourceId?:string;
    targetId?:string;
    sourcePoint?:PointModel;
    targetPoint?:PointModel;
    sourcePortId?:string;
    targetPortId?:string;
    connectors?:ConnectorModel[];
}
/** @private */
export interface NodePropertyChanging{
    nodeIndex?:number;
    nodeOldProperty?:NodeModel;
    offsetX?: number;
    offsetY?: number;
    nodes?:NodeModel[];
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
/** @private */
export interface Distance {
    minDistance?: number;
}
/** @private */
export interface IsDragArea {
    x?: boolean;
    y?: boolean;
}
