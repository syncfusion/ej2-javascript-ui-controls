import { Diagram } from '../diagram';
import { DiagramModel } from '../diagram-model';
import { HistoryEntry, History, } from '../diagram/history';
import { SelectorModel } from '../interaction/selector-model';
import { NodeModel } from '../objects/node-model';
import { Node, BpmnAnnotation } from './node';
import { Connector } from './connector';
import { ConnectorModel } from '../objects/connector-model';
import { DiagramAction } from '../enum/enum';
import { removeItem, getObjectType } from '../utility/diagram-util';
import { cloneObject } from '../utility/base-util';
import { IElement } from '../objects/interface/IElement';
import { ShapeAnnotationModel, PathAnnotationModel } from '../objects/annotation-model';
import { PointPortModel } from '../objects/port-model';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';
import { findAnnotation, findPort } from '../utility/diagram-util';
import { PointPort } from './port';

/**
 * Undo redo function used for revert and restore the changes
 */
export class UndoRedo {

    private groupUndo: boolean = false;

    private childTable: NodeModel[] = [];

    /** @private */
    public initHistory(diagram: Diagram): void {
        diagram.historyList = {
            canRedo: false, canUndo: false, currentEntry: null,
            push: diagram.addHistoryEntry.bind(diagram), undo: Function, redo: Function,
            startGroupAction: diagram.startGroupAction.bind(diagram), endGroupAction: diagram.endGroupAction.bind(diagram),
            canLog: null, undoStack: [], redoStack: []
        };
    }

    /** @private */
    public addHistoryEntry(entry: HistoryEntry, diagram: Diagram): void {
        let entryObject: HistoryEntry = null;
        let nextEntry: HistoryEntry = null;
        if (diagram.historyList.canLog) {
            let hEntry: HistoryEntry = diagram.historyList.canLog(entry);
            if (hEntry.cancel === true) {
                return;
            }
        }
        if (diagram.historyList && diagram.historyList.canUndo && diagram.historyList.currentEntry) {
            entryObject = diagram.historyList.currentEntry;
            if (entryObject.next) {
                if (entryObject.previous) {
                    nextEntry = entryObject.next;
                    nextEntry.previous = null;
                    entryObject.next = entry;
                    entry.previous = entryObject;
                }
            } else {
                entryObject.next = entry;
                entry.previous = entryObject;
            }
        }
        diagram.historyList.currentEntry = entry;
        this.getHistoryList(diagram);
        diagram.historyList.canUndo = true;
        diagram.historyList.canRedo = false;
    }

    /** @private */
    public undo(diagram: Diagram): void {
        let entry: HistoryEntry = this.getUndoEntry(diagram);
        let endGroupActionCount: number = 0;
        if (entry) {
            if (entry.category === 'Internal') {
                if (entry.type === 'EndGroup') {
                    endGroupActionCount++;
                    this.groupUndo = true;
                } else {
                    this.undoEntry(entry, diagram);
                }
                if (this.groupUndo) {
                    this.undoGroupAction(entry, diagram, endGroupActionCount);
                    this.groupUndo = false;
                }
            } else {
                diagram.historyList.undo(entry);
            }
        }
    }

    private getHistoryList(diagram: Diagram): void {
        let undoStack: HistoryEntry[] = [];
        let redoStack: HistoryEntry[] = [];
        let currEntry: HistoryEntry = diagram.historyList.currentEntry;
        let undoObj: HistoryEntry;
        let redoObj: HistoryEntry;

        currEntry = diagram.historyList.currentEntry;
        if (diagram.historyList.canUndo || diagram.historyList.undoStack.length === 0) {
            this.getHistroyObject(undoStack, currEntry);
        } else {
            this.getHistroyObject(redoStack, currEntry);
        }

        while (currEntry && currEntry.previous) {
            undoObj = currEntry.previous;
            this.getHistroyObject(undoStack, undoObj);
            currEntry = currEntry.previous;
        }

        currEntry = diagram.historyList.currentEntry;
        while (currEntry && currEntry.next) {
            redoObj = currEntry.next;
            this.getHistroyObject(redoStack, redoObj);
            currEntry = currEntry.next;
        }
        diagram.historyList.undoStack = undoStack;
        diagram.historyList.redoStack = redoStack;
    }

    private getHistroyObject(list: HistoryEntry[], obj: HistoryEntry): void {
        if (obj && obj.type !== 'StartGroup' && obj.type !== 'EndGroup') {
            list.push({
                redoObject: obj.redoObject ? obj.redoObject : null,
                undoObject: obj.undoObject ? obj.undoObject : null,
                type: obj.type ? obj.type : null,
                category: obj.category ? obj.category : null
            });
        }
    }

    private undoGroupAction(entry: HistoryEntry, diagram: Diagram, endGroupActionCount: number): void {
        while (endGroupActionCount !== 0) {
            this.undoEntry(entry, diagram);
            entry = this.getUndoEntry(diagram);
            if (entry.type === 'StartGroup') {
                endGroupActionCount--;
            } else if (entry.type === 'EndGroup') {
                endGroupActionCount++;
            }
        }
        endGroupActionCount = 0;
    }

    private undoEntry(entry: HistoryEntry, diagram: Diagram): void {
        let obj: SelectorModel;
        if (entry.type !== 'PropertyChanged' && entry.type !== 'CollectionChanged' && entry.type !== 'LabelCollectionChanged') {
            obj = (entry.undoObject) as SelectorModel;
        }
        if (entry.type !== 'StartGroup' && entry.type !== 'EndGroup') {
            if (diagram.historyList.undoStack.length > 0) {
                let addObject: HistoryEntry[] = diagram.historyList.undoStack.splice(0, 1);
                diagram.historyList.redoStack.splice(0, 0, addObject[0]);
            }
        }
        diagram.protectPropertyChange(true);
        diagram.diagramActions |= DiagramAction.UndoRedo;
        switch (entry.type) {
            case 'PositionChanged':
            case 'Align':
            case 'Distribute':
                this.recordPositionChanged(obj, diagram);
                break;
            case 'SizeChanged':
            case 'Sizing':
                this.recordSizeChanged(obj, diagram, entry);
                break;
            case 'RotationChanged':
                this.recordRotationChanged(obj, diagram, entry);
                break;
            case 'ConnectionChanged':
                this.recordConnectionChanged(obj, diagram);
                break;
            case 'PropertyChanged':
                this.recordPropertyChanged(entry, diagram, false);
                break;
            case 'CollectionChanged':
                entry.isUndo = true;
                this.recordCollectionChanged(entry, diagram);
                entry.isUndo = false;
                break;
            case 'LabelCollectionChanged':
                entry.isUndo = true;
                this.recordLabelCollectionChanged(entry, diagram);
                entry.isUndo = false;
                break;
            case 'PortCollectionChanged':
                entry.isUndo = true;
                this.recordPortCollectionChanged(entry, diagram);
                entry.isUndo = false;
                break;
            case 'Group':
                this.unGroup(entry, diagram);
                break;
            case 'UnGroup':
                this.group(entry, diagram);
                break;
            case 'SegmentChanged':
                this.recordSegmentChanged(obj, diagram);
                break;
            case 'PortPositionChanged':
                this.recordPortChanged(entry, diagram, false);
                break;
            case 'AnnotationPropertyChanged':
                this.recordAnnotationChanged(entry, diagram, false);
                break;
        }
        diagram.diagramActions &= ~DiagramAction.UndoRedo;
        diagram.protectPropertyChange(false);
        diagram.historyChangeTrigger(entry);
    }

    private group(historyEntry: HistoryEntry, diagram: Diagram): void {
        diagram.add(historyEntry.undoObject as IElement);
    }

    private unGroup(entry: HistoryEntry, diagram: Diagram): void {
        let i: number = 0;
        entry.redoObject = cloneObject(entry.undoObject);
        let node: NodeModel = entry.undoObject as Node;
        diagram.commandHandler.unGroup(node);
    }

    private ignoreProperty(key: string): boolean {
        if (key === 'zIndex' || key === 'wrapper') {
            return true;
        }
        return false;
    }

    private getProperty(collection: Object, property: Object): void {
        for (let key of Object.keys(property)) {
            if (!this.ignoreProperty(key)) {
                if (property[key] instanceof Object) {
                    this.getProperty(collection[key] as Object, property[key] as Object);
                } else {
                    collection[key] = property[key];
                }
            }
        }
    }

    private recordAnnotationChanged(entry: HistoryEntry, diagram: Diagram, isRedo: boolean): void {
        let entryObject: NodeModel | ConnectorModel = ((isRedo) ? entry.redoObject : entry.undoObject) as NodeModel | ConnectorModel;
        let oldElement: ShapeAnnotation | PathAnnotation = findAnnotation(
            entryObject, entry.changeObjectId) as ShapeAnnotation | PathAnnotation;
        let undoChanges: Object = diagram.commandHandler.getAnnotationChanges(diagram.nameTable[entryObject.id], oldElement);
        let currentObject: NodeModel | ConnectorModel = diagram.nameTable[entryObject.id];
        let currentElement: ShapeAnnotation | PathAnnotation = findAnnotation(
            currentObject, entry.changeObjectId) as ShapeAnnotation | PathAnnotation;
        currentElement.offset = oldElement.offset; currentElement.margin = oldElement.margin;
        currentElement.width = oldElement.width;
        currentElement.height = oldElement.height;
        currentElement.rotateAngle = oldElement.rotateAngle; currentElement.margin = oldElement.margin;
        if (currentObject instanceof Node) {
            diagram.nodePropertyChange(currentObject as Node, {} as Node, undoChanges as Node);
        } else {
            diagram.connectorPropertyChange(currentObject as Connector, {} as Connector, undoChanges as Connector);
        }
    }

    private recordPortChanged(entry: HistoryEntry, diagram: Diagram, isRedo: boolean): void {
        let entryObject: NodeModel = ((isRedo) ? (entry.redoObject as SelectorModel).nodes[0] :
            (entry.undoObject as SelectorModel).nodes[0]);
        let oldElement: PointPort = findPort(entryObject, entry.changeObjectId) as PointPort;
        let undoChanges: Object = diagram.commandHandler.getPortChanges(diagram.nameTable[entryObject.id], oldElement);
        let currentObject: NodeModel | ConnectorModel = diagram.nameTable[entryObject.id];
        let currentElement: PointPort = findPort(currentObject, entry.changeObjectId) as PointPort;
        currentElement.offset = oldElement.offset;
        diagram.nodePropertyChange(currentObject as Node, {} as Node, undoChanges as Node);
    }

    private recordPropertyChanged(entry: HistoryEntry, diagram: Diagram, isRedo: boolean): void {
        let redoObject: DiagramModel = entry.redoObject as DiagramModel;
        let undoObject: DiagramModel = entry.undoObject as DiagramModel;
        this.getProperty(diagram as Object, (isRedo ? redoObject : undoObject) as Object);
        isRedo ? diagram.onPropertyChanged(redoObject, undoObject) : diagram.onPropertyChanged(undoObject, redoObject);
        diagram.diagramActions = diagram.diagramActions | DiagramAction.UndoRedo;
    }

    private recordSegmentChanged(obj: SelectorModel, diagram: Diagram): void {
        let i: number = 0;
        let node: NodeModel;
        let connector: ConnectorModel;

        if (obj.connectors && obj.connectors.length > 0) {
            for (i = 0; i < obj.connectors.length; i++) {
                connector = obj.connectors[i];
                this.segmentChanged(connector, diagram);
            }
        }
    }
    private segmentChanged(connector: ConnectorModel, diagram: Diagram): void {
        let conn: ConnectorModel = diagram.nameTable[connector.id];
        conn.segments = connector.segments;
        diagram.commandHandler.updateEndPoint(conn as Connector);
    }

    private recordPositionChanged(obj: SelectorModel, diagram: Diagram): void {
        let i: number = 0;
        let node: NodeModel;
        let connector: ConnectorModel;
        if (obj.nodes && obj.nodes.length > 0) {
            for (i = 0; i < obj.nodes.length; i++) {
                node = obj.nodes[i];
                this.positionChanged(node, diagram);
            }
        }
        if (obj.connectors && obj.connectors.length > 0) {
            for (i = 0; i < obj.connectors.length; i++) {
                connector = obj.connectors[i];
                this.connectionChanged(connector, diagram);
            }
        }
    }

    private positionChanged(obj: NodeModel, diagram: Diagram, entry?: HistoryEntry): void {
        let node: NodeModel = diagram.nameTable[obj.id];
        if ((obj as Node).processId && !(node as Node).processId) {
            diagram.addProcess(obj as Node, (obj as Node).processId);
        }
        if (!(obj as Node).processId && (node as Node).processId) {
            diagram.removeProcess(obj.id);
        }
        if ((node as Node).processId) {
            let tx: number = (obj as NodeModel).margin.left - node.margin.left;
            let ty: number = (obj as NodeModel).margin.top - node.margin.top;
            diagram.drag(node, tx, ty);
        } else {
            let tx: number = (obj as NodeModel).offsetX - node.wrapper.offsetX;
            let ty: number = (obj as NodeModel).offsetY - node.wrapper.offsetY;
            diagram.drag(node, tx, ty);
        }
        if (diagram.bpmnModule) {
            diagram.bpmnModule.updateDocks(node as Node, diagram);
        }
    }

    private recordSizeChanged(obj: SelectorModel, diagram: Diagram, entry?: HistoryEntry): void {
        let i: number = 0;
        let connector: ConnectorModel;
        let node: NodeModel;
        if (obj && obj.nodes && obj.nodes.length > 0) {
            for (i = 0; i < obj.nodes.length; i++) {
                node = obj.nodes[i];
                if (node.children) {
                    let elements: (NodeModel | ConnectorModel)[] = [];
                    let nodes: (NodeModel | ConnectorModel)[] = diagram.commandHandler.getAllDescendants(node, elements);
                    for (let i: number = 0; i < nodes.length; i++) {
                        let tempNode: NodeModel | ConnectorModel = entry.childTable[nodes[i].id];
                        if ((getObjectType(tempNode) === Node)) {
                            this.sizeChanged(tempNode, diagram, entry);
                            this.positionChanged(tempNode as NodeModel, diagram, entry);
                        } else {
                            this.connectionChanged(tempNode as ConnectorModel, diagram, entry);
                        }
                    }
                } else {
                    this.sizeChanged(node, diagram);
                    this.positionChanged(node, diagram);
                }
            }
        }
        if (obj && obj.connectors && obj.connectors.length > 0) {
            let connectors: ConnectorModel[] = obj.connectors;
            for (i = 0; i < connectors.length; i++) {
                connector = connectors[i];
                this.connectionChanged(connector, diagram);
            }
        }
    }

    private sizeChanged(obj: NodeModel | ConnectorModel, diagram: Diagram, entry?: HistoryEntry): void {
        let node: NodeModel | ConnectorModel = diagram.nameTable[obj.id];
        let scaleWidth: number = obj.wrapper.actualSize.width / node.wrapper.actualSize.width;
        let scaleHeight: number = obj.wrapper.actualSize.height / node.wrapper.actualSize.height;
        if (entry && entry.childTable) {
            entry.childTable[obj.id] = cloneObject(node);
        }
        diagram.scale(node, scaleWidth, scaleHeight, {
            x: obj.wrapper.offsetX / node.wrapper.offsetX,
            y: obj.wrapper.offsetY / node.wrapper.offsetY
        });
    }

    private recordRotationChanged(obj: SelectorModel, diagram: Diagram, entry: HistoryEntry): void {
        let i: number = 0;
        let node: NodeModel;
        let connector: ConnectorModel;
        let selectorObj: SelectorModel = diagram.selectedItems;
        selectorObj.rotateAngle = obj.rotateAngle;
        if (selectorObj && selectorObj.wrapper) {
            selectorObj.wrapper.rotateAngle = obj.rotateAngle;
        }
        if (obj && obj.nodes && obj.nodes.length > 0) {
            for (i = 0; i < obj.nodes.length; i++) {
                node = obj.nodes[i];
                this.rotationChanged(node, diagram);
                this.positionChanged(node, diagram);
            }
        }
        if (obj && obj.connectors && obj.connectors.length > 0) {
            for (i = 0; i < obj.connectors.length; i++) {
                connector = obj.connectors[i];
                this.connectionChanged(connector, diagram);
            }
        }
    }

    private rotationChanged(obj: NodeModel, diagram: Diagram): void {
        let node: NodeModel = diagram.nameTable[obj.id];
        diagram.rotate(node, obj.rotateAngle - node.rotateAngle);
    }

    private recordConnectionChanged(obj: SelectorModel, diagram: Diagram):
        void {
        let connector: ConnectorModel = (obj as SelectorModel).connectors[0];
        this.connectionChanged(connector, diagram);
    }

    private connectionChanged(obj: ConnectorModel, diagram: Diagram, entry?: HistoryEntry): void {
        let connector: ConnectorModel = diagram.nameTable[obj.id];
        let node: Node;
        if (obj.sourcePortID !== connector.sourcePortID) {
            connector.sourcePortID = obj.sourcePortID;
            diagram.connectorPropertyChange(connector as Connector, {} as Connector, { sourcePortID: obj.sourcePortID } as Connector);
        }
        if (obj.targetPortID !== connector.targetPortID) {
            connector.targetPortID = obj.targetPortID;
            diagram.connectorPropertyChange(connector as Connector, {} as Connector, { targetPortID: obj.targetPortID } as Connector);
        }
        if (obj.sourceID !== connector.sourceID) {
            if (obj.sourceID === '') {
                node = diagram.nameTable[connector.sourceID];
                removeItem(node.outEdges, obj.id);
            } else {
                node = diagram.nameTable[obj.sourceID];
                node.outEdges.push(obj.id);
            }
            connector.sourceID = obj.sourceID;
            diagram.connectorPropertyChange(connector as Connector, {} as Connector, { sourceID: obj.sourceID } as Connector);
        }
        if (obj.targetID !== connector.targetID) {
            if (obj.targetID === '') {
                node = diagram.nameTable[connector.targetID];
                removeItem(node.inEdges, obj.id);
            } else {
                node = diagram.nameTable[obj.targetID];
                node.inEdges.push(obj.id);
            }
            connector.targetID = obj.targetID;
            diagram.connectorPropertyChange(connector as Connector, {} as Connector, { targetID: obj.targetID } as Connector);
        }
        if (entry && entry.childTable) {
            entry.childTable[obj.id] = cloneObject(connector);
        }
        let sx: number = obj.sourcePoint.x - connector.sourcePoint.x;
        let sy: number = obj.sourcePoint.y - connector.sourcePoint.y;
        if (sx !== 0 || sy !== 0) {
            diagram.dragSourceEnd(connector, sx, sy);
        }
        let tx: number = obj.targetPoint.x - connector.targetPoint.x;
        let ty: number = obj.targetPoint.y - connector.targetPoint.y;
        if (tx !== 0 || ty !== 0) {
            diagram.dragTargetEnd(connector, tx, ty);
        }
        diagram.updateSelector();
        if (diagram.mode !== 'SVG') {
            diagram.refreshDiagramLayer();
        }
    }

    private recordCollectionChanged(entry: HistoryEntry, diagram: Diagram): void {
        let obj: NodeModel | ConnectorModel = entry.undoObject as NodeModel | ConnectorModel;
        if (entry && entry.changeType) {
            let changeType: string;
            if (entry.isUndo) {
                if (entry.changeType === 'Insert') {
                    changeType = 'Remove';
                } else {
                    changeType = 'Insert';
                }
            } else {
                changeType = entry.changeType;
            }
            if (changeType === 'Remove') {
                if ((obj as BpmnAnnotation).nodeId) {
                    diagram.remove(diagram.nameTable[(obj as BpmnAnnotation).nodeId + '_textannotation_' + obj.id]);
                } else {
                    diagram.remove(obj);
                    diagram.clearSelectorLayer();
                }
            } else {
                diagram.clearSelectorLayer();
                if ((obj as Node | Connector).parentId) {
                    let parentNode: NodeModel = diagram.nameTable[(obj as Node | Connector).parentId];
                    if (parentNode) {
                        diagram.addChild(parentNode, obj);
                    } else {
                        diagram.add(obj);
                    }
                } else if ((obj as BpmnAnnotation).nodeId) {
                    diagram.addTextAnnotation(obj, diagram.nameTable[(obj as BpmnAnnotation).nodeId]);
                } else {
                    if (!diagram.nameTable[obj.id]) {
                        diagram.add(obj);
                    }
                }
                if ((obj as Node).processId && diagram.nameTable[(obj as Node).processId]) {
                    diagram.addProcess((obj as Node), (obj as Node).processId);
                }
            }

            if (diagram.mode !== 'SVG') {
                diagram.refreshDiagramLayer();
            }
        }
    }


    private recordLabelCollectionChanged(entry: HistoryEntry, diagram: Diagram): void {
        let label: ShapeAnnotationModel | PathAnnotationModel = entry.undoObject as ShapeAnnotationModel | PathAnnotationModel;
        let obj: Node | Connector = entry.redoObject as Node | Connector;
        let node: Node | Connector = diagram.nameTable[obj.id];
        if (entry && entry.changeType) {
            let changeType: string;
            if (entry.isUndo) {
                changeType = (entry.changeType === 'Insert') ? 'Remove' : 'Insert';
            } else {
                changeType = entry.changeType;
            }
            if (changeType === 'Remove') {
                diagram.removeLabels(node, [label] as ShapeAnnotationModel[] | PathAnnotationModel[]);
                diagram.clearSelectorLayer();
            } else {
                diagram.clearSelectorLayer();
                diagram.addLabels(node, [label] as ShapeAnnotationModel[] | PathAnnotationModel[]);
            }
            if (diagram.mode !== 'SVG') {
                diagram.refreshDiagramLayer();
            }
        }
    }

    private recordPortCollectionChanged(entry: HistoryEntry, diagram: Diagram): void {
        let port: PointPortModel = entry.undoObject as PointPortModel;
        let obj: Node | Connector = entry.redoObject as Node | Connector;
        let node: NodeModel = diagram.nameTable[obj.id];
        if (entry && entry.changeType) {
            let changeType: string;
            if (entry.isUndo) {
                changeType = (entry.changeType === 'Insert') ? 'Remove' : 'Insert';
            } else {
                changeType = entry.changeType;
            }
            if (changeType === 'Remove') {
                diagram.removePorts(node as Node, [port]);
                diagram.clearSelectorLayer();
            } else {
                diagram.clearSelectorLayer();
                diagram.addPorts(node, [port]);
            }
            if (diagram.mode !== 'SVG') {
                diagram.refreshDiagramLayer();
            }
        }
    }
    /** @private */
    public redo(diagram: Diagram): void {
        let entry: HistoryEntry = this.getRedoEntry(diagram);
        let startGroupActionCount: number = 0;
        if (entry) {
            if (entry.category === 'Internal') {
                if (entry.type === 'StartGroup') {
                    startGroupActionCount++;
                    this.groupUndo = true;
                } else {
                    this.redoEntry(entry, diagram);
                }
                if (this.groupUndo) {
                    this.redoGroupAction(entry, diagram, startGroupActionCount);
                    this.groupUndo = false;
                }
            } else {
                diagram.historyList.redo(entry);
            }
        }
    }

    private redoGroupAction(entry: HistoryEntry, diagram: Diagram, startGroupActionCount: number): void {
        while (startGroupActionCount !== 0) {
            this.redoEntry(entry, diagram);
            entry = this.getRedoEntry(diagram);
            if (entry.type === 'EndGroup') {
                startGroupActionCount--;
            } else if (entry.type === 'StartGroup') {
                startGroupActionCount++;
            }
        }
        startGroupActionCount = 0;
    }

    private redoEntry(historyEntry: HistoryEntry, diagram: Diagram): void {
        let redoObject: SelectorModel;
        if (historyEntry.type !== 'PropertyChanged' && historyEntry.type !== 'CollectionChanged') {
            redoObject = (historyEntry.redoObject) as SelectorModel;
        }
        diagram.diagramActions |= DiagramAction.UndoRedo;
        if (historyEntry.type !== 'StartGroup' && historyEntry.type !== 'EndGroup') {
            if (diagram.historyList.redoStack.length > 0) {
                let addObject: HistoryEntry[] = diagram.historyList.redoStack.splice(0, 1);
                diagram.historyList.undoStack.splice(0, 0, addObject[0]);
            }
        }
        diagram.protectPropertyChange(true);
        switch (historyEntry.type) {
            case 'PositionChanged':
            case 'Align':
            case 'Distribute':
                this.recordPositionChanged(redoObject, diagram);
                break;
            case 'SizeChanged':
            case 'Sizing':
                this.recordSizeChanged(redoObject, diagram, historyEntry);
                break;
            case 'RotationChanged':
                this.recordRotationChanged(redoObject, diagram, historyEntry);
                break;
            case 'ConnectionChanged':
                this.recordConnectionChanged(redoObject, diagram);
                break;
            case 'PropertyChanged':
                this.recordPropertyChanged(historyEntry, diagram, true);
                break;
            case 'CollectionChanged':
                this.recordCollectionChanged(historyEntry, diagram);
                break;
            case 'LabelCollectionChanged':
                this.recordLabelCollectionChanged(historyEntry, diagram);
                break;
            case 'PortCollectionChanged':
                this.recordPortCollectionChanged(historyEntry, diagram);
                break;
            case 'Group':
                this.group(historyEntry, diagram);
                break;
            case 'UnGroup':
                this.unGroup(historyEntry, diagram);
                break;
            case 'SegmentChanged':
                this.recordSegmentChanged(redoObject, diagram);
                break;
            case 'PortPositionChanged':
                this.recordPortChanged(historyEntry, diagram, true);
                break;
            case 'AnnotationPropertyChanged':
                this.recordAnnotationChanged(historyEntry, diagram, true);
                break;
        }
        diagram.protectPropertyChange(false);
        diagram.diagramActions &= ~DiagramAction.UndoRedo;
        diagram.historyChangeTrigger(historyEntry);

    }

    private getUndoEntry(diagram: Diagram): HistoryEntry {
        let undoEntry: HistoryEntry = null;
        let currentObject: HistoryEntry;
        let hList: History = diagram.historyList;
        if (hList.canUndo) {
            undoEntry = hList.currentEntry;
            currentObject = hList.currentEntry.previous;
            if (currentObject) {
                hList.currentEntry = currentObject;
                if (!hList.canRedo) {
                    hList.canRedo = true;
                }
            } else {
                hList.canRedo = true;
                hList.canUndo = false;
            }
        }
        return undoEntry;
    }

    private getRedoEntry(diagram: Diagram): HistoryEntry {
        let redoEntry: HistoryEntry = null;
        let entryCurrent: HistoryEntry;
        let hList: History = diagram.historyList;
        if (hList.canRedo) {
            if (!hList.currentEntry.previous && !hList.canUndo) {
                entryCurrent = hList.currentEntry;
            } else {
                entryCurrent = hList.currentEntry.next;
            }
            if (entryCurrent) {
                hList.currentEntry = entryCurrent;
                if (!hList.canUndo) {
                    hList.canUndo = true;
                }
                if (!entryCurrent.next) {
                    hList.canRedo = false;
                    hList.canUndo = true;
                }
            }
            redoEntry = hList.currentEntry;
        }
        return redoEntry;
    }

    /**
     * Constructor for the undo redo module
     * @private
     */

    constructor() {
        //constructs the undo redo module
    }

    /**
     * To destroy the undo redo module
     * @return {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the undo redo module
         */
    }

    /**
     * Get module name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'UndoRedo';
    }
}