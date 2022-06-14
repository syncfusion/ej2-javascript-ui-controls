/* eslint-disable @typescript-eslint/ban-types */
import { Diagram } from '../diagram';
import { DiagramModel } from '../diagram-model';
import { HistoryEntry, History } from '../diagram/history';
import { SelectorModel } from '../objects/node-model';
import { NodeModel, PhaseModel, LaneModel } from '../objects/node-model';
import { SwimLane, Selector } from '../objects/node';
import { Node, BpmnAnnotation } from './node';
import { Connector } from './connector';
import { ConnectorModel } from '../objects/connector-model';
import { DiagramAction, HistoryEntryType } from '../enum/enum';
import { removeItem, getObjectType } from '../utility/diagram-util';
import { cloneObject, getFunction } from '../utility/base-util';
import { IElement, StackEntryObject, IBlazorCustomHistoryChangeArgs, HistoryChangeEventObject } from '../objects/interface/IElement';
import { ShapeAnnotationModel, PathAnnotationModel } from '../objects/annotation-model';
import { PointPortModel, PortModel } from '../objects/port-model';
import { ShapeAnnotation, PathAnnotation } from '../objects/annotation';
import { findAnnotation, findPort } from '../utility/diagram-util';
import { PointPort } from './port';
import { Size, GridPanel, addChildToContainer } from '../index';
import { swimLaneMeasureAndArrange, laneInterChanged, findLaneIndex, updateSwimLaneObject, pasteSwimLane } from '../utility/swim-lane-util';
import { ICustomHistoryChangeArgs } from '../objects/interface/IElement';
import { DiagramEvent, BlazorAction } from '../enum/enum';
import { isBlazor } from '@syncfusion/ej2-base';


/**
 * Undo redo function used for revert and restore the changes
 */
export class UndoRedo {

    private groupUndo: boolean = false;

    private childTable: NodeModel[] = [];

    private historyCount: number = 0;

    private hasGroup: boolean = false;

    private groupCount: number = 0;

    /**
     * initHistory method \
     *
     * @returns { void } initHistory method .\
     * @param {Diagram} diagram - provide the points value.
     *
     * @private
     */
    public initHistory(diagram: Diagram): void {
        diagram.historyManager = {
            canRedo: false, canUndo: false, currentEntry: null,
            push: diagram.addHistoryEntry.bind(diagram), undo: Function, redo: Function,
            startGroupAction: diagram.startGroupAction.bind(diagram), endGroupAction: diagram.endGroupAction.bind(diagram),
            canLog: null, undoStack: [], redoStack: [], stackLimit: diagram.historyManager ? diagram.historyManager.stackLimit : undefined
        };
    }

    /**
     * addHistoryEntry method \
     *
     * @returns { void } addHistoryEntry method .\
     * @param {HistoryEntry} entry - provide the points value.
     * @param {Diagram} diagram - provide the points value.
     *
     * @private
     */
    public addHistoryEntry(entry: HistoryEntry, diagram: Diagram): void {
        let entryObject: HistoryEntry = null;
        let nextEntry: HistoryEntry = null;
        if (diagram.historyManager.canLog) {
            const hEntry: HistoryEntry = diagram.historyManager.canLog(entry);
            if (hEntry.cancel === true) {
                return;
            }
        }
        if (diagram.historyManager && diagram.historyManager.canUndo && diagram.historyManager.currentEntry) {
            entryObject = diagram.historyManager.currentEntry;
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
        diagram.historyManager.currentEntry = entry;
        if (diagram.historyManager.stackLimit) {
            if (entry.type === 'StartGroup' || entry.type === 'EndGroup') {
                const value: boolean = entry.type === 'EndGroup' ? true : false;
                this.setEntryLimit(value);
            }
            if (!this.hasGroup && this.groupCount === 0) {
                if (this.historyCount < diagram.historyManager.stackLimit) {
                    this.historyCount++;
                } else {
                    this.applyLimit(diagram.historyManager.currentEntry, diagram.historyManager.stackLimit, diagram);
                }
            }
        }
        this.getHistoryList(diagram);
        diagram.historyManager.canUndo = true;
        diagram.historyManager.canRedo = false;
    }

    /**
     * applyLimit method \
     *
     * @returns { void } applyLimit method .\
     * @param {HistoryEntry} list - provide the list value.
     * @param {number} stackLimit - provide the list value.
     * @param {Diagram} diagram - provide the list value.
     * @param {boolean} limitHistory - provide the list value.
     *
     * @private
     */
    public applyLimit(list: HistoryEntry, stackLimit: number, diagram: Diagram, limitHistory?: boolean): void {
        if (list && list.previous) {
            if (list.type === 'StartGroup' || list.type === 'EndGroup') {
                const value: boolean = list.type === 'StartGroup' ? true : false;
                this.setEntryLimit(value);
            }
            if (!this.hasGroup && this.groupCount === 0) {
                stackLimit--;
            }
            if (stackLimit === 0) {
                if (limitHistory) {
                    this.limitHistoryStack(list.previous, diagram);
                }
                if (diagram.historyManager.stackLimit < this.historyCount) {
                    this.historyCount = diagram.historyManager.stackLimit;
                }
                delete list.previous;
            } else if (list.previous) {
                this.applyLimit(list.previous, stackLimit, diagram, limitHistory);
            }
        }
        this.groupCount = 0;
    }

    /**
     * clearHistory method \
     *
     * @returns { void } clearHistory method .\
     * @param {Diagram} diagram - provide the points value.
     *
     * @private
     */
    public clearHistory(diagram: Diagram): void {
        const hList: History = diagram.historyManager;
        hList.currentEntry = undefined;
        hList.canUndo = false;
        hList.canRedo = false;
        this.historyCount = 0;
        this.groupCount = 0;
        diagram.historyManager.undoStack = [];
        diagram.historyManager.redoStack = [];
    }

    private setEntryLimit(value: boolean): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        value ? this.groupCount-- : this.groupCount++;
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        value ? this.hasGroup = !value : this.hasGroup = value;
    }

    private limitHistoryStack(list: HistoryEntry, diagram: Diagram): void {
        if (list.type !== 'StartGroup' && list.type !== 'EndGroup') {
            this.removeFromStack(diagram.historyManager.undoStack, list);
            this.removeFromStack(diagram.historyManager.redoStack, list);
        }
        if (list.previous) {
            this.limitHistoryStack(list.previous, diagram);
        }
    }
    private removeFromStack(entyList: HistoryEntry[], list: HistoryEntry): void {
        if (entyList.length) {
            for (let i: number = 0; i <= entyList.length; i++) {
                if (entyList[i].undoObject === list.undoObject && entyList[i].redoObject === list.redoObject) {
                    entyList.splice(i, 1); break;
                }
            }
        }
    }
    /**
     * undo method \
     *
     * @returns { void } undo method .\
     * @param {Diagram} diagram - provide the diagram value.
     *
     * @private
     */
    public undo(diagram: Diagram): void {
        const entry: HistoryEntry = this.getUndoEntry(diagram);
        let endGroupActionCount: number = 0;
        if (entry) {
            if (entry.category === 'Internal') {
                if (entry.type === 'EndGroup') {
                    endGroupActionCount++;
                    this.groupUndo = true;
                    if (isBlazor()) { diagram.blazorActions |= BlazorAction.GroupingInProgress; }
                } else {
                    this.undoEntry(entry, diagram);
                }
                if (this.groupUndo) {
                    this.undoGroupAction(entry, diagram, endGroupActionCount);
                    this.groupUndo = false;
                }
            } else {
                if (!isBlazor()) {
                    diagram.historyManager.undo(entry);
                }
                let arg: ICustomHistoryChangeArgs | IBlazorCustomHistoryChangeArgs = {
                    entryType: 'undo', oldValue: entry.undoObject, newValue: entry.redoObject
                };
                if (isBlazor()) {
                    arg = {
                        entryType: 'undo', oldValue: this.getHistoryChangeEvent(entry.undoObject, entry.blazorHistoryEntryType),
                        newValue: this.getHistoryChangeEvent(entry.redoObject, entry.blazorHistoryEntryType)
                    };
                }
                diagram.triggerEvent(DiagramEvent.historyStateChange, arg);
            }
        }
    }

    private getHistoryChangeEvent(
        object: NodeModel | ConnectorModel | SelectorModel | DiagramModel | ShapeAnnotation | PathAnnotation | PointPortModel,
        prop: HistoryEntryType):
        HistoryChangeEventObject {
        const value: HistoryChangeEventObject = {};
        switch (prop) {
            case 'Node':
                value.node = object as Node;
                break;
            case 'Connector':
                value.connector = object as Connector;
                break;
            case 'Selector':
                value.selector = object as Selector;
                break;
            case 'Diagram':
                value.diagram = object as Diagram;
                break;
            case 'ShapeAnnotation':
                value.shapeAnnotation = object as ShapeAnnotation;
                break;
            case 'PathAnnotation':
                value.pathAnnotation = object as PathAnnotation;
                break;
            case 'PortObject':
                value.pointPortModel = object as PortModel;
                break;
            case 'Object':
                value.object = object;
        }
        return value;
    }

    private getHistoryList(diagram: Diagram): void {
        const undoStack: HistoryEntry[] = [];
        const redoStack: HistoryEntry[] = [];
        let currEntry: HistoryEntry = diagram.historyManager.currentEntry;
        let undoObj: HistoryEntry;
        let redoObj: HistoryEntry;

        currEntry = diagram.historyManager.currentEntry;
        if (diagram.historyManager.canUndo || diagram.historyManager.undoStack.length === 0) {
            this.getHistroyObject(undoStack, currEntry);
        } else {
            this.getHistroyObject(redoStack, currEntry);
        }

        while (currEntry && currEntry.previous) {
            undoObj = currEntry.previous;
            this.getHistroyObject(undoStack, undoObj);
            currEntry = currEntry.previous;
        }

        currEntry = diagram.historyManager.currentEntry;
        while (currEntry && currEntry.next) {
            redoObj = currEntry.next;
            this.getHistroyObject(redoStack, redoObj);
            currEntry = currEntry.next;
        }
        diagram.historyManager.undoStack = undoStack;
        diagram.historyManager.redoStack = redoStack;
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
        let obj: SelectorModel; let nodeObject: SelectorModel | Node;
        if (entry.type !== 'PropertyChanged' && entry.type !== 'CollectionChanged' && entry.type !== 'LabelCollectionChanged') {
            obj = (entry.undoObject) as SelectorModel;
            nodeObject = (entry.undoObject) as SelectorModel;
        }
        if (entry.type !== 'StartGroup' && entry.type !== 'EndGroup') {
            if (diagram.historyManager.undoStack.length > 0) {
                const addObject: HistoryEntry[] = diagram.historyManager.undoStack.splice(0, 1);
                diagram.historyManager.redoStack.splice(0, 0, addObject[0]);
                nodeObject = (entry.undoObject) as SelectorModel;
            }
        }
        diagram.protectPropertyChange(true); diagram.diagramActions |= DiagramAction.UndoRedo;
        if (isBlazor() && entry.previous && entry.previous.type === 'StartGroup') {
            diagram.blazorActions &= ~BlazorAction.GroupingInProgress;
        }
        switch (entry.type) {
            case 'PositionChanged':
            case 'Align':
            case 'Distribute':
                this.recordPositionChanged(obj, diagram);
                break;
            case 'SizeChanged':
            case 'Sizing':
                this.recordSizeChanged(obj, diagram, entry); break;
            case 'RotationChanged':
                this.recordRotationChanged(obj, diagram, entry); break;
            case 'ConnectionChanged':
                this.recordConnectionChanged(obj, diagram); break;
            case 'PropertyChanged':
                this.recordPropertyChanged(entry, diagram, false); break;
            case 'CollectionChanged':
                if (entry && entry.next && entry.next.type === 'AddChildToGroupNode' && entry.next.changeType === 'Insert') {
                    const group: NodeModel = diagram.getObject((entry.next.undoObject as NodeModel).id);
                    diagram.insertValue(cloneObject(group), true);
                }
                entry.isUndo = true; this.recordCollectionChanged(entry, diagram); entry.isUndo = false;
                if (entry && entry.next && entry.next.type === 'AddChildToGroupNode' && entry.next.changeType === 'Insert') {
                    const group: NodeModel = diagram.getObject((entry.next.undoObject as NodeModel).id);
                    group.wrapper.measure(new Size()); group.wrapper.arrange(group.wrapper.desiredSize);
                    diagram.updateDiagramObject(group);
                }
                break;
            case 'LabelCollectionChanged':
                entry.isUndo = true; this.recordLabelCollectionChanged(entry, diagram); entry.isUndo = false; break;
            case 'PortCollectionChanged':
                entry.isUndo = true; this.recordPortCollectionChanged(entry, diagram); entry.isUndo = false; break;
            case 'Group':
                this.unGroup(entry, diagram); break;
            case 'UnGroup':
                this.group(entry, diagram); break;
            case 'SegmentChanged':
                this.recordSegmentChanged(obj, diagram); break;
            case 'PortPositionChanged':
                this.recordPortChanged(entry, diagram, false); break;
            case 'AnnotationPropertyChanged':
                this.recordAnnotationChanged(entry, diagram, false); break;
            case 'ChildCollectionChanged':
                this.recordChildCollectionChanged(entry, diagram, false); break;
            case 'StackChildPositionChanged':
                this.recordStackPositionChanged(entry, diagram, false); break;
            case 'RowHeightChanged':
                this.recordGridSizeChanged(entry, diagram, false, true);
                break;
            case 'ColumnWidthChanged':
                this.recordGridSizeChanged(entry, diagram, false, false);
                break;
            case 'LanePositionChanged':
                this.recordLanePositionChanged(entry, diagram, false);
                break;
            case 'LaneCollectionChanged':
            case 'PhaseCollectionChanged':
                entry.isUndo = true;
                this.recordLaneOrPhaseCollectionChanged(entry, diagram, false);
                entry.isUndo = false;
                break;
            case 'SendToBack':
            case 'SendForward':
            case 'SendBackward':
            case 'BringToFront':
                this.recordOrderCommandChanged(entry, diagram, false);
                break;
            case 'AddChildToGroupNode':
                this.recordAddChildToGroupNode(entry, diagram, false);
                break;
        }
        diagram.diagramActions &= ~DiagramAction.UndoRedo;
        diagram.protectPropertyChange(false); diagram.historyChangeTrigger(entry, 'Undo');
        if (nodeObject) {
            const object: NodeModel | ConnectorModel = this.checkNodeObject(nodeObject, diagram);
            if (object) {
                const getnodeDefaults: Function = getFunction(diagram.updateSelection);
                if (getnodeDefaults) { getnodeDefaults(object, diagram); }
            }
        }
    }

    private checkNodeObject(value: SelectorModel | Node, diagram: Diagram): NodeModel | ConnectorModel {
        let object: NodeModel | ConnectorModel;
        if (!(value as Node).id) {
            if (((value as SelectorModel).nodes && (value as SelectorModel).nodes.length > 0) ||
                ((value as SelectorModel).connectors && (value as SelectorModel).connectors.length > 0)) {
                const undoNode: NodeModel[] | ConnectorModel[] = (value as SelectorModel).nodes.length > 0 ?
                    (value as SelectorModel).nodes : (value as SelectorModel).connectors;
                for (object of undoNode) {
                    object = diagram.nameTable[object.id];
                }
            } else {
                const knownNode: NodeModel[] | ConnectorModel[] = (value as SelectorModel).nodes ?
                    (value as SelectorModel).nodes : (value as SelectorModel).connectors;
                if (knownNode) {
                    for (const key of Object.keys(knownNode)) {
                        const index: number = Number(key);
                        object = (value as SelectorModel).nodes ? diagram.nodes[index] as Node : diagram.connectors[index];
                    }
                }
            }
        } else {
            object = diagram.nameTable[(value as Node).id];
        }
        return object;
    }

    private group(historyEntry: HistoryEntry, diagram: Diagram): void {
        diagram.add(historyEntry.undoObject as IElement);
    }

    private unGroup(entry: HistoryEntry, diagram: Diagram): void {
        //const i: number = 0;
        entry.redoObject = cloneObject(entry.undoObject);
        const node: NodeModel = entry.undoObject as Node;
        diagram.commandHandler.unGroup(node);
    }

    private ignoreProperty(key: string): boolean {
        if (key === 'zIndex' || key === 'wrapper' || key === 'parentObj' || key === 'controlParent') {
            return true;
        }
        return false;
    }

    private getProperty(collection: Object, property: Object): void {
        for (const key of Object.keys(property)) {
            if (collection) {
                if (!this.ignoreProperty(key)) {
                    if (property[key] instanceof Object) {
                        this.getProperty(collection[key] as Object, property[key] as Object);
                    } else {
                        collection[key] = property[key];
                    }
                }
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private recordLaneOrPhaseCollectionChanged(entry: HistoryEntry, diagram: Diagram, isRedo: boolean): void {
        const node: NodeModel = entry.redoObject as NodeModel;
        const obj: LaneModel | PhaseModel = entry.undoObject as LaneModel | PhaseModel;
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
            diagram.remove(node);
        } else {
            if ((node as Node).isPhase) {
                const swimlane: NodeModel = diagram.nameTable[(node as Node).parentId];
                diagram.addPhases(swimlane, [obj]);
            } else {
                const swimlane: NodeModel = diagram.nameTable[(node as Node).parentId];
                const laneIndex: number = findLaneIndex(swimlane, node);
                diagram.addLanes(swimlane, [obj], laneIndex);
            }
        }
        diagram.clearSelection();
    }

    private recordAnnotationChanged(entry: HistoryEntry, diagram: Diagram, isRedo: boolean): void {
        const entryObject: NodeModel | ConnectorModel = ((isRedo) ? entry.redoObject : entry.undoObject) as NodeModel | ConnectorModel;
        if (diagram.canEnableBlazorObject) {
            const node: object = cloneObject(diagram.nameTable[entryObject.id]);
            diagram.insertValue(node, node instanceof Node ? true : false);
        }
        const oldElement: ShapeAnnotation | PathAnnotation = findAnnotation(
            entryObject, entry.objectId) as ShapeAnnotation | PathAnnotation;
        const undoChanges: Object = diagram.commandHandler.getAnnotationChanges(diagram.nameTable[entryObject.id], oldElement);
        const currentObject: NodeModel | ConnectorModel = diagram.nameTable[entryObject.id];
        const currentElement: ShapeAnnotation | PathAnnotation = findAnnotation(
            currentObject, entry.objectId) as ShapeAnnotation | PathAnnotation;
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

    private recordChildCollectionChanged(entry: HistoryEntry, diagram: Diagram, isRedo: boolean): void {
        const entryObject: NodeModel | ConnectorModel = ((isRedo) ? entry.redoObject : entry.undoObject) as NodeModel | ConnectorModel;
        let parentNode: NodeModel = diagram.nameTable[(entryObject as Node).parentId];
        const actualObject: Node = diagram.nameTable[(entryObject as Node).id];
        if (parentNode) {
            addChildToContainer(diagram, parentNode, actualObject, !isRedo, entry.historyAction === 'AddNodeToLane');
        } else {
            if (actualObject.parentId) {
                parentNode = diagram.nameTable[actualObject.parentId];
                parentNode.children.splice(parentNode.children.indexOf(actualObject.id), 1);
                parentNode.wrapper.children.splice(parentNode.wrapper.children.indexOf(actualObject.wrapper), 1);
            }
            if ((entryObject as Node).parentId && (entryObject as Node).parentId !== '') {
                parentNode = diagram.nameTable[(entryObject as Node).parentId];
                parentNode.children.push((entryObject as Node).id);
                parentNode.wrapper.children.push(actualObject.wrapper);
            }
            actualObject.parentId = (entryObject as Node).parentId;
            diagram.removeElements(actualObject);
            diagram.updateDiagramObject(actualObject);
        }
    }

    private recordStackPositionChanged(entry: HistoryEntry, diagram: Diagram, isRedo: boolean): void {
        const entryObject: StackEntryObject = ((isRedo) ? entry.redoObject : entry.undoObject) as StackEntryObject;
        if (entryObject.source) {
            const parent: Node = diagram.nameTable[(entryObject.source as Node).parentId];
            if (parent) {
                if (entryObject.target) {
                    parent.wrapper.children.splice(entryObject.targetIndex, 1);
                    parent.wrapper.children.splice(entryObject.sourceIndex, 0, entryObject.source.wrapper);
                } else {
                    if (entryObject.sourceIndex !== undefined) {
                        if (!diagram.nameTable[entryObject.source.id]) {
                            diagram.add(entryObject.source);
                        }
                        parent.wrapper.children.splice(entryObject.sourceIndex, 0, diagram.nameTable[entryObject.source.id].wrapper);
                        diagram.nameTable[entryObject.source.id].parentId = parent.id;
                    } else {
                        parent.wrapper.children.splice(
                            parent.wrapper.children.indexOf(diagram.nameTable[entryObject.source.id].wrapper), 1);
                        diagram.nameTable[entryObject.source.id].parentId = '';
                    }
                }
                if (isRedo && parent.shape.type === 'UmlClassifier') {
                    diagram.remove(entryObject.source);
                }
                parent.wrapper.measure(new Size());
                parent.wrapper.arrange(parent.wrapper.desiredSize);
                diagram.updateDiagramObject(parent);
                diagram.updateSelector();
            }
        }
    }

    private recordGridSizeChanged(entry: HistoryEntry, diagram: Diagram, isRedo: boolean, isRow: boolean): void {
        const obj: Node = (isRedo) ? entry.redoObject as Node : entry.undoObject as Node;
        const node: Node = (!isRedo) ? entry.redoObject as Node : entry.undoObject as Node;
        if (obj.parentId) {
            const swimlane: NodeModel = diagram.nameTable[obj.parentId];
            const actualObject: NodeModel = diagram.nameTable[obj.id];
            const x: number = swimlane.wrapper.bounds.x;
            const y: number = swimlane.wrapper.bounds.y;
            if (swimlane.shape.type === 'SwimLane') {
                const grid: GridPanel = swimlane.wrapper.children[0] as GridPanel;
                const padding: number = (swimlane.shape as SwimLane).padding;
                updateSwimLaneObject(diagram, node, swimlane, obj);
                if (isRow) {
                    grid.updateRowHeight(obj.rowIndex, obj.wrapper.actualSize.height, true, padding);
                    swimlane.height = swimlane.wrapper.height = grid.height;
                } else {
                    grid.updateColumnWidth(obj.columnIndex, obj.wrapper.actualSize.width, true, padding);
                    swimlane.width = swimlane.wrapper.width = grid.width;
                    if (obj.isPhase) {
                        actualObject.maxWidth = actualObject.wrapper.maxWidth = obj.wrapper.actualSize.width;
                    }
                }
                swimLaneMeasureAndArrange(swimlane);
                const tx: number = x - swimlane.wrapper.bounds.x;
                const ty: number = y - swimlane.wrapper.bounds.y;
                diagram.drag(swimlane, tx, ty);
                diagram.clearSelection();
                diagram.updateDiagramObject(swimlane);
            }
        }

    }

    private recordLanePositionChanged(entry: HistoryEntry, diagram: Diagram, isRedo: boolean): void {
        const entryObject: StackEntryObject = ((isRedo) ? entry.redoObject : entry.undoObject) as StackEntryObject;
        if (entryObject.source) {
            const parent: Node = diagram.nameTable[(entryObject.source as Node).parentId];
            if (parent && parent.shape.type === 'SwimLane') {
                laneInterChanged(diagram, entryObject.target, entryObject.source);
                diagram.clearSelection();
            }
        }
    }

    private recordPortChanged(entry: HistoryEntry, diagram: Diagram, isRedo: boolean): void {

        const entryObject: NodeModel = ((isRedo) ? (entry.redoObject as SelectorModel).nodes[0] :
            (entry.undoObject as SelectorModel).nodes[0]);
        if (diagram.canEnableBlazorObject) {
            const node: object = cloneObject(diagram.nameTable[entryObject.id]);
            diagram.insertValue(node, true);
        }
        const oldElement: PointPort = findPort(entryObject, entry.objectId) as PointPort;
        const undoChanges: Object = diagram.commandHandler.getPortChanges(diagram.nameTable[entryObject.id], oldElement);
        const currentObject: NodeModel | ConnectorModel = diagram.nameTable[entryObject.id];
        const currentElement: PointPort = findPort(currentObject, entry.objectId) as PointPort;
        currentElement.offset = oldElement.offset;
        diagram.nodePropertyChange(currentObject as Node, {} as Node, undoChanges as Node);
        if ((currentObject as Node).parentId) {
            diagram.updateConnectorEdges(diagram.nameTable[(currentObject as Node).parentId]);
        }
    }

    private recordPropertyChanged(entry: HistoryEntry, diagram: Diagram, isRedo: boolean): void {
        const redoObject: DiagramModel = entry.redoObject as DiagramModel;
        const undoObject: DiagramModel = entry.undoObject as DiagramModel;
        if (isBlazor()) {
            for (const prop of Object.keys(undoObject)) {
                let obj: object;
                switch (prop) {
                    case 'nodes':
                        for (const key of Object.keys(undoObject.nodes)) {
                            if (diagram.canEnableBlazorObject) {
                                obj = cloneObject(diagram.nodes[Number(key)]);
                                diagram.insertValue(obj, true);
                            }
                        }
                        break;
                    case 'connectors':
                        for (const key of Object.keys(undoObject.connectors)) {
                            if (diagram.canEnableBlazorObject) {
                                obj = cloneObject(diagram.connectors[Number(key)]);
                                diagram.insertValue(obj, false);
                            }
                        }
                        break;
                }
            }
        }
        this.getProperty(diagram as Object, (isRedo ? redoObject : undoObject) as Object);
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        isRedo ? diagram.onPropertyChanged(redoObject, undoObject) : diagram.onPropertyChanged(undoObject, redoObject);
        diagram.diagramActions = diagram.diagramActions | DiagramAction.UndoRedo;
    }
    private recordOrderCommandChanged(entry: HistoryEntry, diagram: Diagram, isRedo: boolean): void {
        const redoObject: Selector = entry.redoObject as Selector;
        const undoObject: Selector = entry.undoObject as Selector;
        diagram.commandHandler.orderCommands(isRedo, (isRedo ? redoObject : undoObject), entry.type);
        diagram.diagramActions = diagram.diagramActions | DiagramAction.UndoRedo;
    }
    private recordAddChildToGroupNode(entry: HistoryEntry, diagram: Diagram, isRedo: boolean): void {
        const group: Node = diagram.nameTable[(entry.undoObject as NodeModel).id];
        const child: Node = diagram.nameTable[entry.objectId];
        if (isRedo && entry.changeType === 'Insert') {
            diagram.addChildToGroup(group, child.id);
        }
    }
    private recordSegmentChanged(obj: SelectorModel, diagram: Diagram): void {
        let i: number = 0;
        //let node: NodeModel;
        let connector: ConnectorModel;

        if (obj.connectors && obj.connectors.length > 0) {
            for (i = 0; i < obj.connectors.length; i++) {
                connector = obj.connectors[i];
                this.segmentChanged(connector, diagram);
            }
        }
    }
    private segmentChanged(connector: ConnectorModel, diagram: Diagram): void {
        const conn: ConnectorModel = diagram.nameTable[connector.id];
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

    private positionChanged(obj: NodeModel, diagram: Diagram): void {
        const node: NodeModel = diagram.nameTable[obj.id];
        if ((obj as Node).processId && !(node as Node).processId) {
            diagram.addProcess(obj as Node, (obj as Node).processId);
        }
        if (!(obj as Node).processId && (node as Node).processId) {
            diagram.removeProcess(obj.id);
        }
        if ((node as Node).processId) {
            const tx: number = (obj as NodeModel).margin.left - node.margin.left;
            const ty: number = (obj as NodeModel).margin.top - node.margin.top;
            diagram.drag(node, tx, ty);
        } else {
            if ((node as Node).parentId) {
                const parent: Node = diagram.nameTable[(node as Node).parentId];
                if (parent.isLane) {
                    obj.wrapper.offsetX = (obj.width / 2) + (parent.wrapper.bounds.x + obj.margin.left);
                    obj.wrapper.offsetY = (obj.height / 2) + (parent.wrapper.bounds.y + obj.margin.top);
                }
            }
            const tx: number = (obj as NodeModel).wrapper.offsetX - node.offsetX;
            const ty: number = (obj as NodeModel).wrapper.offsetY - node.offsetY;
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
                if (node.children && !node.container) {
                    const elements: (NodeModel | ConnectorModel)[] = [];
                    const nodes: (NodeModel | ConnectorModel)[] = diagram.commandHandler.getAllDescendants(node, elements);
                    for (let i: number = 0; i < nodes.length; i++) {
                        const tempNode: NodeModel | ConnectorModel = entry.childTable[nodes[i].id];
                        if ((getObjectType(tempNode) === Node)) {
                            this.sizeChanged(tempNode, diagram, entry);
                            this.positionChanged(tempNode as NodeModel, diagram);
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
            const connectors: ConnectorModel[] = obj.connectors;
            for (i = 0; i < connectors.length; i++) {
                connector = connectors[i];
                this.connectionChanged(connector, diagram);
            }
        }
    }

    private sizeChanged(obj: NodeModel | ConnectorModel, diagram: Diagram, entry?: HistoryEntry): void {
        const node: NodeModel | ConnectorModel = diagram.nameTable[obj.id];
        const scaleWidth: number = obj.wrapper.actualSize.width / node.wrapper.actualSize.width;
        const scaleHeight: number = obj.wrapper.actualSize.height / node.wrapper.actualSize.height;
        if (entry && entry.childTable) {
            entry.childTable[obj.id] = cloneObject(node);
        }
        diagram.scale(node, scaleWidth, scaleHeight, {
            x: obj.wrapper.offsetX / node.wrapper.offsetX,
            y: obj.wrapper.offsetY / node.wrapper.offsetY
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    private recordRotationChanged(obj: SelectorModel, diagram: Diagram, entry: HistoryEntry): void {
        let i: number = 0;
        let node: NodeModel;
        let connector: ConnectorModel;
        const selectorObj: SelectorModel = diagram.selectedItems;
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
        const node: NodeModel = diagram.nameTable[obj.id];
        diagram.rotate(node, obj.rotateAngle - node.rotateAngle);
    }

    private recordConnectionChanged(obj: SelectorModel | ConnectorModel, diagram: Diagram):
        void {
            var connector: ConnectorModel;
            if((obj as SelectorModel) && (obj as SelectorModel).connectors)
            {
                connector = (obj as SelectorModel).connectors[0]; 
            }else
            {
                connector  = (obj as ConnectorModel)
            }
        if (connector.sourceID && diagram.nameTable[connector.sourceID]) {
            diagram.insertValue(diagram.nameTable[connector.sourceID], true);
        }
        if (connector.targetID && diagram.nameTable[connector.targetID]) {
            diagram.insertValue(diagram.nameTable[connector.targetID], true);
        }
        this.connectionChanged(connector, diagram);
    }

    private connectionChanged(obj: ConnectorModel, diagram: Diagram, entry?: HistoryEntry): void {
        const connector: ConnectorModel = diagram.nameTable[obj.id];
        let node: Node;
        if (obj.sourcePortID !== connector.sourcePortID) {
            diagram.removePortEdges(diagram.nameTable[connector.sourceID], connector.sourcePortID, connector.id, false);
            connector.sourcePortID = obj.sourcePortID;
            diagram.connectorPropertyChange(connector as Connector, {} as Connector, { sourcePortID: obj.sourcePortID } as Connector);
        }
        if (obj.targetPortID !== connector.targetPortID) {
            diagram.removePortEdges(diagram.nameTable[connector.targetID], connector.targetPortID, connector.id, true);
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
                diagram.updatePortEdges(node, obj, false);
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
                diagram.updatePortEdges(node, obj, true);
            }
            connector.targetID = obj.targetID;
            diagram.connectorPropertyChange(connector as Connector, {} as Connector, { targetID: obj.targetID } as Connector);
        }
        if (entry && entry.childTable) {
            entry.childTable[obj.id] = cloneObject(connector);
        }
        const sx: number = obj.sourcePoint.x - connector.sourcePoint.x;
        const sy: number = obj.sourcePoint.y - connector.sourcePoint.y;
        if (sx !== 0 || sy !== 0) {
            diagram.dragSourceEnd(connector, sx, sy);
        }
        const tx: number = obj.targetPoint.x - connector.targetPoint.x;
        const ty: number = obj.targetPoint.y - connector.targetPoint.y;
        if (tx !== 0 || ty !== 0) {
            diagram.dragTargetEnd(connector, tx, ty);
        }
        diagram.updateSelector();
        if (diagram.mode !== 'SVG') {
            diagram.refreshDiagramLayer();
        }
    }

    private recordCollectionChanged(entry: HistoryEntry, diagram: Diagram): void {
        const obj: NodeModel | ConnectorModel = entry.undoObject as NodeModel | ConnectorModel;
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
                    const parentNode: NodeModel = diagram.nameTable[(obj as Node | Connector).parentId];
                    if (parentNode) {
                        diagram.addChild(parentNode, obj);
                    } else {
                        diagram.add(obj);
                    }
                } else if ((obj as BpmnAnnotation).nodeId) {
                    diagram.addTextAnnotation(obj, diagram.nameTable[(obj as BpmnAnnotation).nodeId]);
                } else {
                    if (!diagram.nameTable[obj.id]) {
                        if (obj && obj.shape && (obj as Node).shape.type === 'SwimLane' && entry.isUndo) {
                            pasteSwimLane(obj as NodeModel, undefined, undefined, undefined, undefined, true);
                        }
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
        const label: ShapeAnnotationModel | PathAnnotationModel = entry.undoObject as ShapeAnnotationModel | PathAnnotationModel;
        const obj: Node | Connector = entry.redoObject as Node | Connector;
        const node: Node | Connector = diagram.nameTable[obj.id];
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
        const port: PointPortModel = entry.undoObject as PointPortModel;
        const obj: Node | Connector = entry.redoObject as Node | Connector;
        const node: NodeModel = diagram.nameTable[obj.id];
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
    /**
     * redo method \
     *
     * @returns { void } redo method .\
     * @param {Diagram} diagram - provide the diagram value.
     *
     * @private
     */
    public redo(diagram: Diagram): void {
        const entry: HistoryEntry = this.getRedoEntry(diagram);
        let startGroupActionCount: number = 0;
        if (entry) {
            if (entry.category === 'Internal') {
                if (entry.type === 'StartGroup') {
                    startGroupActionCount++;
                    this.groupUndo = true;
                    if (isBlazor()) { diagram.blazorActions |= BlazorAction.GroupingInProgress; }
                } else {
                    this.redoEntry(entry, diagram);
                }
                if (this.groupUndo) {
                    this.redoGroupAction(entry, diagram, startGroupActionCount);
                    this.groupUndo = false;
                }
            } else {
                if (!isBlazor()) {
                    diagram.historyManager.redo(entry);
                }
                let arg: ICustomHistoryChangeArgs | IBlazorCustomHistoryChangeArgs = {
                    entryType: 'redo', oldValue: entry.redoObject, newValue: entry.undoObject
                };
                if (isBlazor()) {
                    arg = {
                        entryType: 'redo', oldValue: this.getHistoryChangeEvent(entry.redoObject, entry.blazorHistoryEntryType),
                        newValue: this.getHistoryChangeEvent(entry.undoObject, entry.blazorHistoryEntryType)
                    };
                }
                diagram.triggerEvent(DiagramEvent.historyStateChange, arg);
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
        let redoObject: SelectorModel; let redovalue: SelectorModel | Node;
        if (historyEntry.type !== 'PropertyChanged' && historyEntry.type !== 'CollectionChanged') {
            redoObject = (historyEntry.redoObject) as SelectorModel;
            redovalue = (historyEntry.redoObject) as SelectorModel;
        }
        diagram.diagramActions |= DiagramAction.UndoRedo;
        if (historyEntry.type !== 'StartGroup' && historyEntry.type !== 'EndGroup') {
            if (diagram.historyManager.redoStack.length > 0) {
                const addObject: HistoryEntry[] = diagram.historyManager.redoStack.splice(0, 1);
                diagram.historyManager.undoStack.splice(0, 0, addObject[0]);
                redovalue = (historyEntry.redoObject) as SelectorModel;
            }
        }
        diagram.protectPropertyChange(true);
        if (isBlazor() && historyEntry.next && historyEntry.next.type === 'EndGroup') {
            diagram.blazorActions &= ~BlazorAction.GroupingInProgress;
        }
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
            case 'ChildCollectionChanged':
                this.recordChildCollectionChanged(historyEntry, diagram, true);
                break;
            case 'StackChildPositionChanged':
                this.recordStackPositionChanged(historyEntry, diagram, true);
                break;
            case 'RowHeightChanged':
                this.recordGridSizeChanged(historyEntry, diagram, true, true);
                break;
            case 'ColumnWidthChanged':
                this.recordGridSizeChanged(historyEntry, diagram, true, false);
                break;
            case 'LanePositionChanged':
                this.recordLanePositionChanged(historyEntry, diagram, true);
                break;
            case 'LaneCollectionChanged':
            case 'PhaseCollectionChanged':
                this.recordLaneOrPhaseCollectionChanged(historyEntry, diagram, true); break;
            case 'SendToBack':
            case 'SendForward':
            case 'SendBackward':
            case 'BringToFront':
                this.recordOrderCommandChanged(historyEntry, diagram, true); break;
            case 'AddChildToGroupNode':
                this.recordAddChildToGroupNode(historyEntry, diagram, true); break;
        }
        diagram.protectPropertyChange(false);
        diagram.diagramActions &= ~DiagramAction.UndoRedo;
        diagram.historyChangeTrigger(historyEntry, 'Redo');
        if (redovalue) {
            const value: NodeModel | ConnectorModel = this.checkNodeObject(redovalue, diagram);
            if (value) {
                const getnodeDefaults: Function = getFunction(diagram.updateSelection);
                if (getnodeDefaults) {
                    getnodeDefaults(value, diagram);
                }
            }
        }
    }

    private getUndoEntry(diagram: Diagram): HistoryEntry {
        let undoEntry: HistoryEntry = null;
        let currentObject: HistoryEntry;
        const hList: History = diagram.historyManager;
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
        const hList: History = diagram.historyManager;
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
     *
     * @private
     */

    constructor() {
        //constructs the undo redo module
    }

    /**
     * To destroy the undo redo module
     *
     * @returns {void}
     * @private
     */

    public destroy(): void {
        /**
         * Destroys the undo redo module
         */
    }

    /**
     * @returns { string } toBounds method .\
     * Get getModuleName name.
     */
    protected getModuleName(): string {
        /**
         * Returns the module name
         */
        return 'UndoRedo';
    }
}
