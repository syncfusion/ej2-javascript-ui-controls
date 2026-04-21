import { Diagram } from '../diagram';
import { DiagramModel } from '../diagram-model';
import { HistoryEntry, ExtendedHistoryEntry } from '../diagram/history';
import { PathAnnotationModel, ShapeAnnotationModel } from './annotation-model';
import { Connector } from './connector';
import { Node, SwimLane } from './node';
import { BezierSegmentModel, ConnectorModel, OrthogonalSegmentModel, StraightSegmentModel } from './connector-model';
import { IHistoryChangeArgs, StackEntryObject } from './interface/IElement';
import { NodeBaseModel } from './node-base-model';
import { NodeModel, SelectorModel, ShapeModel, SwimLaneModel } from './node-model';
import { PathPortModel, PointPortModel, PortModel } from './port-model';
import { DiagramAction, DiagramHistoryAction, EntryChangeType, EntryType, HistoryChangeAction, RealAction } from '../enum/enum';
import { laneInterChanged, swimLaneMeasureAndArrange, updateHeaderMaxWidth, updatePhaseMaxWidth, updateSwimLaneObject } from '../utility/swim-lane-util';
import { GridPanel } from '../core/containers/grid';
import { findAnnotation, getObjectType, removeItem } from '../utility/diagram-util';
import { BpmnTextAnnotationConnector } from './undo-redo';
import { Annotation, PathAnnotation, ShapeAnnotation } from './annotation';
import { cloneObject } from '../utility/base-util';
import { GradientModel, StopModel } from '../core/appearance-model';
import { Canvas } from '../core/containers/canvas';
import { PointPort } from './port';

/**
 * @private
 * Union type for any model object that can appear in diagram change payloads.
 *
 * - NodeModel: Represents diagram nodes (shapes, swimlanes, groups, etc.).
 * - ConnectorModel: Represents connectors/links between nodes.
 * - PathAnnotationModel: An annotation attached to a connector's path.
 * - ShapeAnnotationModel: An annotation attached to a node/shape.
 * - PointPortModel: A port defined by an absolute point on a node boundary.
 * - PathPortModel: A port defined along a connector/path for advanced routing.
 */
type Model = NodeModel | ConnectorModel | PathAnnotationModel | ShapeAnnotationModel | PointPortModel | PathPortModel;

/**
 * @private
 * Intersection (composite) type combining all model properties.
 *
 * Used as a typing aid when you need a view that contains every possible
 * property from the individual model types (useful for keyof/indexing while
 * narrowing to concrete models like NodeModel or ConnectorModel).
 */
type CompositeModel = NodeModel & ConnectorModel & PathAnnotationModel & ShapeAnnotationModel & PointPortModel & PathPortModel;

/**
 * Provides collaboration functionality for the Syncfusion Diagram component.
 * The `DiagramCollaboration` class enables real-time collaborative editing by serializing
 * local diagram changes into JSON payloads that can be transmitted to remote users,
 * and by applying incoming remote changes to the local diagram instance.
 * **Key Features:**
 * - Serializes history entries (undo/redo actions) into collaboration-friendly JSON format
 * - Applies remote diagram changes while maintaining consistency
 * - Handles grouped operations for batch updates
 * - Supports various change types: position, size, rotation, collections, properties, etc.
 * **Typical Usage:**
 * 1. Hook into the diagram's history change events
 * 2. Call `serializeHistoryChange()` to get JSON payloads for broadcasting
 * 3. Receive remote changes and apply via `applyRemoteChanges()`
 * @private
 */
export class DiagramCollaboration {
    /**
     * Buffer for accumulating serialized changes during grouped operations.
     * Cleared when a group action completes.
     * @private
     */
    private collaborativeCollection: string[] = [];
    /**
     * Indicates whether changes are currently being accumulated as part of a group action.
     * Set to true when a StartGroup entry is detected, false when EndGroup completes.
     * @private
     */
    public isGroupAction: boolean = false;
    /**
     * Serializes diagram changes for collaboration.
     * Serializes the given history change arguments into JSON payloads
     * that can be sent to remote collaborators.
     * @param {IHistoryChangeArgs} args - The history change event arguments containing change details.
     * @param {Diagram} diagram - The diagram instance from which the change originated.
     * @returns {string[]} An array of serialized diagram change JSON strings to send to collaborators.
     * @private
     */
    public serializeHistoryChange(args: IHistoryChangeArgs, diagram: Diagram): string[] {
        if (!args) {
            return [];
        }
        const historyEntry: HistoryEntry = args.change as HistoryEntry;
        if (!historyEntry) {
            return [];
        }
        const isUndo: boolean = args.action === 'Undo';
        const isStartGroup: boolean =
            historyEntry.type === (isUndo ? 'EndGroup' : 'StartGroup');
        const isEndGroup: boolean =
            historyEntry.type === (isUndo ? 'StartGroup' : 'EndGroup');
        if (historyEntry.type === 'EndGroup') {
            diagram.groupActionDepth += isUndo ? 1 : -1;
        }
        else if (historyEntry.type === 'StartGroup') {
            diagram.groupActionDepth += isUndo ? -1 : 1;
        }
        if (isStartGroup && (diagram.groupActionDepth === 1)) {
            this.collaborativeCollection = [];
            this.isGroupAction = true;
        }
        // 2. Determine the full list of objects affected by the change.
        const changedObjects: (NodeModel | ConnectorModel)[] =
            this.getChangedObjects(
                args,
                args.undoObject,
                args.redoObject,
                diagram
            );
        // 3. Categorize objects and enrich them with additional info
        const {
            nodes: nodes,
            connectors: connectors
        } = this.categorizeAndEnrichObjects(changedObjects, args);
        const propertyChanges: PropertyChangedAction =
            this.processHistoryEntryType(
                args,
                args.undoObject,
                args.redoObject,
                historyEntry,
                diagram
            );
        // 5. Check if there's any meaningful change to send
        const hasChanges: boolean = nodes.length > 0 || connectors.length > 0 || propertyChanges != null;
        if (hasChanges) {
            historyEntry.childTable = args.childTable;
            if (args.childTable) {
                for (const node in args.childTable) {
                    if (Object.prototype.hasOwnProperty.call(args.childTable, node)) {
                        historyEntry.childTable[`${node}`] = cloneObject(diagram.getNodeObject(node));
                    }
                }
            }
            // 6. Create the payload and serialize
            const value: DiagramChanges = {
                modifiedNodes: nodes, modifiedConnectors: connectors,
                entryType: historyEntry.type,
                collectionChangedAction: historyEntry.changeType,
                actionTrigger: args.action,
                propertyChanges: propertyChanges,
                historyAction: historyEntry.historyAction,
                entry: historyEntry as ExtendedHistoryEntry
            };
            const json: string = JSON.stringify(value);
            this.collaborativeCollection.push(json);
        }
        if ((isEndGroup || !this.isGroupAction) && diagram.groupActionDepth === 0) {
            const historyEntries: string[] = [...this.collaborativeCollection];
            this.collaborativeCollection = [];
            this.isGroupAction = false;
            return historyEntries;
        }
        return [];
    }
    /**
     * Processes a history entry and extracts property change metadata.
     * Examines the history entry type and constructs a `PropertyChangedAction` object
     * containing relevant old/new values, object IDs, and child references needed
     * for remote clients to apply the same change.
     * @param {IHistoryChangeArgs} args - The history change event arguments.
     * @param {NodeModel | ConnectorModel | SelectorModel | DiagramModel | ShapeAnnotationModel | PathAnnotationModel | PointPortModel} oldValue - The object state before the change.
     * @param {NodeModel | ConnectorModel | SelectorModel | DiagramModel} newValue - The object state after the change.
     * @param {HistoryEntry} historyEntry - The history entry describing the change type.
     * @param {Diagram} diagram - The diagram instance.
     * @returns {PropertyChangedAction} Metadata describing the property changes, or null if not applicable.
     * @private
     */
    private processHistoryEntryType(
        args: IHistoryChangeArgs,
        oldValue: NodeModel | ConnectorModel | SelectorModel | DiagramModel | ShapeAnnotationModel | PathAnnotationModel | PointPortModel,
        newValue: NodeModel | ConnectorModel | SelectorModel | DiagramModel,
        historyEntry: HistoryEntry,
        diagram: Diagram
    ): PropertyChangedAction {
        let action: PropertyChangedAction | null = null;

        switch (historyEntry.type) {
        case 'LabelCollectionChanged':
        case 'PortCollectionChanged':
        case 'PhaseCollectionChanged':
        case 'LaneCollectionChanged': {
            action = { newObjectValue: oldValue };
            break;
        }
        case 'LanePositionChanged': {
            action = args.action === 'Undo' ? { newObjectValue: oldValue } : args.action === 'Redo' ? { newObjectValue: newValue }
                : { newObjectValue: args.source[0] };
            break;
        }
        case 'PropertyChanged': {
            if ((newValue as DiagramModel).nodes) {
                for (const node in (newValue as DiagramModel).nodes) {
                    if (Object.prototype.hasOwnProperty.call((newValue as DiagramModel).nodes, node)) {
                        const obj: NodeModel = (newValue as DiagramModel).nodes[`${node}`];
                        if (obj.style && obj.style.gradient) {
                            this.cloneGradientStops(obj.style.gradient);
                        }
                        const nodechildrenId: string[] = this.getChildrenIds(node, obj, diagram, true);
                        action = { childrenId: nodechildrenId };
                    }
                }
            }
            if ((oldValue as DiagramModel).connectors) {
                for (const connector in (oldValue as DiagramModel).connectors) {
                    if (Object.prototype.hasOwnProperty.call((oldValue as DiagramModel).connectors, connector)) {
                        const obj: ConnectorModel = (oldValue as DiagramModel).connectors[`${connector}`];
                        this.cloneAsObject(obj);
                    }
                }
            }
            if ((newValue as DiagramModel).connectors) {
                for (const connector in (newValue as DiagramModel).connectors) {
                    if (Object.prototype.hasOwnProperty.call((newValue as DiagramModel).connectors, connector)) {
                        const obj: ConnectorModel = (newValue as DiagramModel).connectors[`${connector}`];
                        this.cloneAsObject(obj);
                        const nodechildrenId: string[] = this.getChildrenIds(connector, obj, diagram, false);
                        action = { childrenId: nodechildrenId };
                    }
                }
            }
            action = {
                ...action,
                sourceIds: args.sourceId,
                oldValue: { nodes: (oldValue as DiagramModel).nodes, connectors: (oldValue as DiagramModel).connectors },
                newValue: { nodes: (newValue as DiagramModel).nodes, connectors: (newValue as DiagramModel).connectors }
            };
            break;
        }
        case 'AddChildToGroupNode':
        case 'RemoveChildFromGroupNode':
        case 'AnnotationPropertyChanged': {
            action = { objectId: args.objectId };
            break;
        }
        }
        return action;
    }
    /**
     * Extracts child IDs (annotations and ports) from a node or connector.
     * Used to build a list of nested element IDs that need to be synchronized
     * during property change operations.
     * @param {string} index - The index key of the object in the diagram's nodes/connectors collection.
     * @param {NodeModel | ConnectorModel} obj - The node or connector model.
     * @param {Diagram} diagram - The diagram instance containing the object.
     * @param {boolean} isNode - Represets the object is node.
     * @returns {string[]} An array of child element IDs (annotations and ports).
     * @private
     */
    private getChildrenIds(index: string, obj: NodeModel | ConnectorModel, diagram: Diagram, isNode: boolean): string[] {
        const childrenId: string[] = [];
        if (obj.annotations) {
            for (const annotation in obj.annotations) {
                if (Object.prototype.hasOwnProperty.call(obj.annotations, annotation)) {
                    if (isNode) {
                        childrenId.push(diagram.nodes[`${index}`].annotations[`${annotation}`].id);
                    } else {
                        childrenId.push(diagram.connectors[`${index}`].annotations[`${annotation}`].id);
                    }
                }
            }
        }
        if (obj.ports) {
            for (const port in obj.ports) {
                if (Object.prototype.hasOwnProperty.call(obj.ports, port)) {
                    if (isNode) {
                        childrenId.push(diagram.nodes[`${index}`].ports[`${port}`].id);
                    } else {
                        childrenId.push(diagram.connectors[`${index}`].ports[`${port}`].id);
                    }
                }
            }
        }
        return childrenId;
    }
    /**
     * Clones connector-specific objects (decorators and segments) for serialization.
     * Ensures that complex nested properties like gradients and segment arrays
     * are properly cloned before being serialized for remote transmission.
     * @param {ConnectorModel} obj - The connector model to process.
     * @returns {void}
     * @private
     */
    private cloneAsObject(obj: ConnectorModel): void {
        if (obj.sourceDecorator && obj.sourceDecorator.style && obj.sourceDecorator.style.gradient) {
            this.cloneGradientStops(obj.sourceDecorator.style.gradient);
        }
        if (obj.targetDecorator && obj.targetDecorator.style && obj.targetDecorator.style.gradient) {
            this.cloneGradientStops(obj.targetDecorator.style.gradient);
        }
        if (obj.segments) {
            const clonedValue : Object = cloneObject(obj.segments);
            obj.segments = clonedValue as StraightSegmentModel[] | BezierSegmentModel[] | OrthogonalSegmentModel[];
        }
    }
    /**
     * Deep clones gradient stop objects within a gradient definition.
     * Gradient stops contain color and offset information that must be
     * individually cloned to avoid reference sharing during serialization.
     * @param {GradientModel} gradient - The gradient model containing stops to clone.
     * @returns {void}
     * @private
     */
    private cloneGradientStops(gradient: GradientModel) : void {
        if (gradient && gradient.stops) {
            for (let i: number = 0; i < gradient.stops.length; i++) {
                const stop : Object = cloneObject(gradient.stops[parseInt(i.toString(), 10)]);
                gradient.stops[parseInt(i.toString(), 10)] = stop as StopModel;
            }
        }
    }
    /**
     * Gets the affected objects for a change, expanding selection/undo/redo contexts.
     * @param {IHistoryChangeArgs} args - The history change event arguments.
     * @param {(NodeModel | ConnectorModel | SelectorModel | DiagramModel | ShapeAnnotationModel | PathAnnotationModel | PointPortModel)} undoObject - The object state for undo operations.
     * @param {(NodeModel | ConnectorModel | SelectorModel | DiagramModel)} redoObject - The object state for redo operations.
     * @param {Diagram} diagram - The Diagram instance against which the change is applied.
     * @returns {(NodeModel | ConnectorModel)[]} An array of affected NodeModel or ConnectorModel objects.
     * @private
     */
    private getChangedObjects(
        args: IHistoryChangeArgs,
        undoObject: NodeModel | ConnectorModel | SelectorModel | DiagramModel | ShapeAnnotationModel | PathAnnotationModel | PointPortModel,
        redoObject: NodeModel | ConnectorModel | SelectorModel | DiagramModel,
        diagram: Diagram
    ): (NodeModel | ConnectorModel)[] {
        const isUndoOrRedo : boolean =
            args.action === 'Undo' ||
            args.action === 'Redo';
        if (!isUndoOrRedo) {
            return args.source;
        }
        let historyObject: NodeModel | ConnectorModel | SelectorModel | DiagramModel
        | ShapeAnnotationModel | PathAnnotationModel | PointPortModel | undefined | null = undefined;
        if (args.action === 'Undo') {
            const undoHasId : boolean = !!(undoObject && (undoObject as NodeModel | ConnectorModel).id &&
                diagram.getObject((undoObject as NodeModel | ConnectorModel).id));
            const undoIsSelector : boolean = !!(
                undoObject &&
                (undoObject as SelectorModel).nodes &&
                (undoObject as SelectorModel).connectors
            );
            const isValidUndo: Object = undoHasId || undoIsSelector;
            historyObject = isValidUndo ? undoObject : undefined;
        } else {
            const redoHasId : boolean = !!(redoObject && (redoObject as NodeModel | ConnectorModel).id &&
                diagram.getObject((redoObject as NodeModel | ConnectorModel).id));
            const redoIsSelector : boolean = !!(
                redoObject &&
                (redoObject as SelectorModel).nodes &&
                (redoObject as SelectorModel).connectors
            );
            const isValidRedo: Object = redoHasId || redoIsSelector;
            historyObject = isValidRedo ? redoObject : undefined;
        }
        const selector: SelectorModel = historyObject as SelectorModel;
        if (selector && selector.nodes && selector.connectors) {
            const objects: (NodeModel | ConnectorModel)[] = [];
            objects.push(...(selector.nodes));
            objects.push(...(selector.connectors));
            return objects;
        }
        else if (historyObject && historyObject as NodeBaseModel) {
            return [historyObject as NodeBaseModel];
        }
        return args.source;
    }

    /**
     * Classifies changed objects by type and enriches them with collaboration metadata.
     * @param {Array.<(NodeModel|ConnectorModel)>|null|undefined} changedObjects - The list of node/connector models that were changed.
     * @param {HistoryEntry} historyEntry - The history entry describing the change.
     * @returns {{nodes: Node[], connectors: Connector[]}} An object with `nodes` and `connectors` arrays ready for serialization.
     * @private
     */
    private categorizeAndEnrichObjects(
        changedObjects: (NodeModel | ConnectorModel | SelectorModel)[] | null | undefined,
        historyEntry: HistoryEntry
    ): { nodes: Node[]; connectors: Connector[] } {
        const nodes: Node[] = [];
        const connectors: Connector[] = [];
        if (!changedObjects || changedObjects.length === 0 || historyEntry.type === 'PropertyChanged') {
            return { nodes: nodes, connectors: connectors };
        }
        for (const obj of changedObjects) {
            if ((obj as SelectorModel).nodes) {
                for (const node of (obj as SelectorModel).nodes as NodeModel[]) {
                    const nodeTyped: NodeModel = node as NodeModel;
                    this.updateNodeAndConnectors(nodeTyped, nodes, connectors);
                }
            } else if ((obj as SelectorModel).connectors) {
                for (const connector of (obj as SelectorModel).connectors as ConnectorModel[]) {
                    const connectorTyped: ConnectorModel = connector as ConnectorModel;
                    this.updateNodeAndConnectors(connectorTyped, nodes, connectors);
                }
            } else {
                this.updateNodeAndConnectors(obj as NodeModel | ConnectorModel, nodes, connectors);
            }
        }
        return { nodes: nodes, connectors: connectors };
    }
    /**
     * Categorizes and clones a single diagram object into the appropriate collection.
     * Determines if the object is a node or connector based on its properties,
     * adds parent information, and clones it for serialization.
     * @param {NodeModel | ConnectorModel} obj - The diagram object to categorize.
     * @param {Node[]} nodes - The collection of nodes to append to.
     * @param {Connector[]} connectors - The collection of connectors to append to.
     * @returns {void}
     * @private
     */
    private updateNodeAndConnectors(obj: NodeModel | ConnectorModel, nodes: Node[], connectors: Connector[]): void {
        if ((obj as NodeModel).offsetX !== undefined) {
            obj.addInfo = { 'parentId': (obj as Node).parentId };
            nodes.push(cloneObject(obj as Node) as Node);
        } else if ((obj as ConnectorModel).sourcePoint && (obj as ConnectorModel).targetPoint) {
            obj.addInfo = { 'parentId': (obj as Connector).parentId };
            connectors.push(cloneObject(obj as Connector) as Connector);
        }
    }

    /**
     * Validates a diagram changes object to ensure it has the required structure.
     * Performs security validation on incoming collaboration data to prevent
     * malicious payloads from corrupting the diagram state or causing runtime errors.
     * @param {unknown} data - The parsed JSON data to validate.
     * @returns {DiagramChanges | null} The validated DiagramChanges object, or null if invalid.
     * @private
     */
    private validateDiagramChanges(data: unknown): DiagramChanges | null {
        if (typeof data !== 'object' || data === null) {
            return null;
        }
        const changes: DiagramChanges = data as DiagramChanges;
        // Validate required fields
        if (!changes.entryType || typeof changes.entryType !== 'string') {
            return null;
        }
        // Validate arrays if present
        if (changes.modifiedNodes !== undefined && changes.modifiedNodes !== null && !Array.isArray(changes.modifiedNodes)) {
            return null;
        }
        if (changes.modifiedConnectors !== undefined && changes.modifiedConnectors !== null && !Array.isArray(changes.modifiedConnectors)) {
            return null;
        }
        return changes;
    }
    /**
     * Applies a collection of remote change operations to the current diagram.
     *
     * @param {string[]} modifiedOperations - An array of serialized `DiagramChanges` JSON strings
     *                                        received from remote collaborators.
     * @param {Diagram} diagram - The target `Diagram` instance to which the remote updates
     *                             should be applied.
     * @returns {void}
     * @private
     */
    public applyRemoteChanges(modifiedOperations: string[], diagram: Diagram): void {
        if (!diagram.undoRedoModule) {
            return;
        }
        if (modifiedOperations.length > 0) {
            diagram.realActions |= RealAction.PreventHistoryEntryForCollaboration;
            const previous: boolean = diagram.getProtectPropertyChangeValue();
            diagram.protectPropertyChange(true);
            modifiedOperations.forEach((data: string) => {
                try {
                    const parsedData: DiagramChanges | null = this.validateDiagramChanges(JSON.parse(data));
                    if (parsedData) {
                        this.updateDiagram(parsedData, diagram);
                    } else {
                        console.warn('[WARNING] :: Invalid diagram change payload received');
                    }
                } catch (error) {
                    console.warn('[WARNING] :: Failed to parse or apply diagram changes:', error);
                }
            });
            diagram.realActions &= ~RealAction.PreventHistoryEntryForCollaboration;
            diagram.protectPropertyChange(previous);
        }
    }
    /**
     * Updates the remote changes into the current diagram.
     *
     * @param {DiagramChanges} parsedData - The parsed `DiagramChanges` payload to apply.
     * @param {Diagram} diagram - The `Diagram` instance to update.
     * @returns {void}
     * @private
     */
    private updateDiagram(
        parsedData: DiagramChanges,
        diagram: Diagram
    ): void {
        const modifiedNodes: Node[] = parsedData.modifiedNodes;
        const modifiedConnectors: Connector[] = parsedData.modifiedConnectors;
        const historyEntryType: EntryType = parsedData.entryType;
        const historyAction: DiagramHistoryAction = parsedData.historyAction;
        const historyEntryChangeType: EntryChangeType = parsedData.collectionChangedAction;
        const propertyChanges: PropertyChangedAction = parsedData.propertyChanges;
        const actionTrigger: HistoryChangeAction = parsedData.actionTrigger;
        const entry : ExtendedHistoryEntry = parsedData.entry;
        if (actionTrigger === 'Undo' || actionTrigger === 'Redo') {
            diagram.diagramActions |= DiagramAction.UndoRedo;
        }

        const { type: adjustedHistoryType, change: adjustedChangeType } = this.getAdjustedHistoryTypes(
            historyEntryType,
            historyEntryChangeType,
            actionTrigger
        );
        if (historyEntryType === 'PropertyChanged') {
            if (actionTrigger !== 'Undo') {
                this.processPropertyChanges(
                    propertyChanges.sourceIds,
                    propertyChanges.oldValue,
                    propertyChanges.newValue,
                    propertyChanges.childrenId,
                    diagram
                );
            } else {
                this.processPropertyChanges(
                    propertyChanges.sourceIds,
                    propertyChanges.newValue,
                    propertyChanges.oldValue,
                    propertyChanges.childrenId,
                    diagram
                );
            }
        }
        if ((Array.isArray(modifiedNodes) && modifiedNodes.length > 0) || (propertyChanges && historyEntryType === 'LanePositionChanged')) {
            this.processNodeChangesAsync(
                modifiedNodes, propertyChanges,
                adjustedHistoryType,
                entry,
                adjustedChangeType,
                historyAction,
                diagram
            );
        }
        else if (Array.isArray(modifiedConnectors) && modifiedConnectors.length > 0) {
            this.processConnectorChangesAsync(
                modifiedConnectors, propertyChanges,
                adjustedHistoryType,
                adjustedChangeType, diagram
            );
        }
        if (actionTrigger === 'Undo' || actionTrigger === 'Redo') {
            diagram.diagramActions &= ~DiagramAction.UndoRedo;
        }
    }
    /**
     * Applies property-level updates from a remote payload into the given diagram.
     *
     * @param {string[]} stringids - Array of object ids (nodes/connectors) to update.
     * @param {DiagramModel} oldValues - DiagramModel containing the old state for undo comparisons.
     * @param {DiagramModel} newValues - DiagramModel containing the new state to apply.
     * @param {string[]} childrenId - Optional list of child ids (annotations/ports) to map nested updates.
     * @param {Diagram} diagram - The Diagram instance that will be updated.
     * @returns {void}
     * @private
     */
    private processPropertyChanges(
        stringids: string[],
        oldValues: DiagramModel,
        newValues: DiagramModel,
        childrenId: string[],
        diagram: Diagram
    ): void {
        if (newValues.nodes) {
            const newValue: NodeModel[] = [];
            const oldValue: NodeModel[] = [];
            const newData: NodeModel[] = newValues.nodes;
            const oldData: NodeModel[] = oldValues.nodes;
            for (const value in newData) {
                if (Object.prototype.hasOwnProperty.call(newData, value)) {
                    newValue.push(newData[`${value}`]);
                    oldValue.push(oldData[`${value}`]);
                }
            }
            for (let indexId: number = 0; indexId < stringids.length; indexId++) {
                const obj: Node = diagram.nameTable[`${stringids[parseInt(indexId.toString(), 10)]}`] as Node;
                if (newValue[parseInt(indexId.toString(), 10)].annotations && childrenId && childrenId.length > 0) {
                    let index: number = 0;
                    for (const annotationIndex in newValue[parseInt(indexId.toString(), 10)].annotations) {
                        if (Object.prototype.hasOwnProperty.call(
                            newValue[parseInt(indexId.toString(), 10)].annotations,
                            annotationIndex
                        )) {
                            for (const current of obj.annotations) {
                                if (current.id === childrenId[parseInt(indexId.toString(), 10)]) {
                                    this.updatePublicProperties(current, newValue[parseInt(indexId.toString(), 10)].annotations[`${annotationIndex}`]);
                                    index++;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (newValue[parseInt(indexId.toString(), 10)].ports && childrenId && childrenId.length > 0) {
                    let index: number = 0;
                    for (const newPort in newValue[parseInt(indexId.toString(), 10)].ports) {
                        if (Object.prototype.hasOwnProperty.call(
                            newValue[parseInt(indexId.toString(), 10)].ports,
                            newPort
                        )) {
                            for (const current of obj.ports) {
                                if (current.id === childrenId[parseInt(index.toString(), 10)]) {
                                    this.updatePublicProperties(current, newValue[parseInt(indexId.toString(), 10)].ports[`${newPort}`]);
                                    index++;
                                    break;
                                }
                            }
                        }
                    }
                }
                this.updatePublicProperties(obj, newValue[parseInt(indexId.toString(), 10)] as Node);
                if (newValue[parseInt(indexId.toString(), 10)].style && newValue[parseInt(indexId.toString(), 10)].style.gradient) {
                    const dstStops: StopModel[] = newValue[parseInt(indexId.toString(), 10)].style.gradient.stops;
                    const srcStops: StopModel[] = obj.style.gradient.stops;
                    for (let stopIndex: number = 0; stopIndex < dstStops.length; stopIndex++) {
                        dstStops[parseInt(stopIndex.toString(), 10)] = srcStops[parseInt(stopIndex.toString(), 10)];
                    }
                    diagram.updateGradient(newValue[parseInt(indexId.toString(), 10)], oldValue[parseInt(indexId.toString(), 10)], obj);
                    obj.oldGradientValue = cloneObject(newValue[parseInt(indexId.toString(), 10)].style.gradient);
                }
                const _oldNode: Node = oldValue[parseInt(indexId.toString(), 10)] as Node;
                const _newNode: Node = newValue[parseInt(indexId.toString(), 10)] as Node;
                diagram.nodePropertyChange(obj, _oldNode, _newNode, undefined, true, true);
            }
        }

        if (newValues.connectors) {
            const newValue: ConnectorModel[] = [];
            const oldValue: ConnectorModel[] = [];
            const newData: ConnectorModel[] = newValues.connectors;
            const oldData: ConnectorModel[] = oldValues.connectors;
            for (const value in newData) {
                if (Object.prototype.hasOwnProperty.call(newData, value)) {
                    newValue.push(newData[`${value}`]);
                    oldValue.push(oldData[`${value}`]);
                }
            }
            for (let i: number = 0; i < stringids.length; i++) {
                const obj: Connector = diagram.nameTable[`${stringids[parseInt(i.toString(), 10)]}`] as Connector;

                if (
                    newValue[parseInt(i.toString(), 10)].annotations &&
                    childrenId &&
                    childrenId.length > 0
                ) {
                    let index: number = 0;
                    for (const annotationIndex in newValue[parseInt(i.toString(), 10)].annotations) {
                        if (Object.prototype.hasOwnProperty.call(
                            newValue[parseInt(i.toString(), 10)].annotations,
                            annotationIndex
                        )) {
                            for (const current of obj.annotations) {
                                if (current.id === childrenId[parseInt(index.toString(), 10)]) {
                                    this.updatePublicProperties(current, newValue[parseInt(index.toString(), 10)].annotations[`${annotationIndex}`]);
                                    index++;
                                    break;
                                }
                            }
                        }
                    }
                }
                if (
                    newValue[parseInt(i.toString(), 10)].ports &&
                    childrenId &&
                    childrenId.length > 0
                ) {
                    let index: number = 0;
                    for (const newPort in newValue[parseInt(i.toString(), 10)].ports) {
                        if (Object.prototype.hasOwnProperty.call(newValue[parseInt(i.toString(), 10)].ports, newPort)) {
                            for (const port of obj.ports) {
                                if (port.id === childrenId[parseInt(index.toString(), 10)]) {
                                    this.updatePublicProperties(port, newValue[parseInt(i.toString(), 10)].ports[`${newPort}`]);
                                    index++;
                                    break;
                                }
                            }
                        }
                    }
                }
                const connectorNew: ConnectorModel = newValue[parseInt(i.toString(), 10)];
                this.updatePublicProperties(obj, connectorNew as Connector);
                const _oldConnector: Connector = oldValue[`${i}`] as Connector;
                const _newConnector: Connector = newValue[`${i}`] as Connector;
                diagram.connectorPropertyChange(obj, _oldConnector, _newConnector, undefined, true);
            }
        }
    }
    /**
     * Copies public properties from `target` onto `source` with security protections.
     *
     * Performs a shallow copy for primitives and arrays, and recursively copies
     * plain object properties. Includes protection against circular references
     * and prototype pollution attacks.
     *
     * @param {Model} source - The existing object that will receive updated properties.
     * @param {Model} target - The object providing new property values.
     * @returns {void}
     * @private
     */
    private updatePublicProperties(
        source: Model,
        target: Model
    ): void {
        if (!source || typeof source !== 'object') {
            return;
        }
        // Use an intersection-typed view so keys can be indexed safely and we can
        // narrow to concrete model types when handling specific collection properties.
        type CollaborationTargetKey = keyof (CompositeModel);
        const targetKeys: CollaborationTargetKey[] = Object.keys(target) as CollaborationTargetKey[];
        const sourceAll: CompositeModel = source as CompositeModel;
        const targetAll: CompositeModel = target as CompositeModel;

        for (const key of targetKeys) {
            // skip updating nested collections; handled elsewhere or intentionally omitted
            if (key === 'annotations' || key === 'ports') {
                continue;
            }

            // handle shape type changes: if a property is a ShapeModel with differing type, replace it entirely
            const isShape: ShapeModel | null = targetAll[`${key}`] as ShapeModel;
            if (isShape && isShape.type) {
                const srcShape: ShapeModel | null = sourceAll[`${key}`] as ShapeModel;
                if (srcShape && srcShape.type !== isShape.type) {
                    sourceAll[`${key}`] = targetAll[`${key}`];
                    continue;
                }
            }
            const isTargetPlainObject: boolean = targetAll[`${key}`] && typeof targetAll[`${key}`] === 'object' && !Array.isArray(targetAll[`${key}`]);
            if (isTargetPlainObject) {
                this.updatePublicProperties(sourceAll[`${key}`] as Model, targetAll[`${key}`] as Model);
            } else {
                sourceAll[`${key}`] = targetAll[`${key}`];
            }
        }
    }

    /**
     * Processes node-level history changes and delegates to the appropriate
     * undo/redo or collection handlers on the diagram.
     *
     * @param {Node[]} nodes - Array of `Node` instances from the remote payload.
     * @param {PropertyChangedAction} propertyChanges - Optional property-change metadata for nested updates.
     * @param {EntryType} historyType - The history entry type being applied (e.g., PositionChanged).
     * @param {ExtendedHistoryEntry} entry - The extended history entry with additional context.
     * @param {EntryChangeType} changeType - The collection change type (Insert/Remove) when relevant.
     * @param {DiagramHistoryAction} historyAction - The `DiagramHistoryAction` associated with the entry.
     * @param {Diagram} diagram - The `Diagram` instance to update.
     * @returns {void}
     * @private
     */
    private processNodeChangesAsync(
        nodes: Node[], propertyChanges: PropertyChangedAction,
        historyType: EntryType,
        entry: ExtendedHistoryEntry,
        changeType: EntryChangeType,
        historyAction: DiagramHistoryAction,
        diagram: Diagram
    ): void {
        for (const nodeObj of nodes) {
            const objectToUpdate : Node = diagram.getObject(nodeObj.id) as Node;
            const previous: boolean = diagram.getProtectPropertyChangeValue();
            diagram.protectPropertyChange(true);

            if (!objectToUpdate && historyType !== 'Group' && historyType !== 'CollectionChanged' && historyType !== 'LanePositionChanged'
                && historyType !== 'PhaseCollectionChanged' && historyType !== 'LaneCollectionChanged') {
                continue;
            }
            diagram.isCollaborativeContainerChanges =
                (nodeObj && nodeObj.shape && nodeObj.shape.type === 'Container') ||
                (!!(nodeObj && nodeObj.parentId) &&
                    diagram &&
                    diagram.nameTable &&
                    diagram.nameTable[nodeObj.parentId] &&
                    diagram.nameTable[nodeObj.parentId].shape &&
                    diagram.nameTable[nodeObj.parentId].shape.type === 'Container');
            try {
                switch (historyType) {
                case 'Align':
                case 'Distribute':
                case 'PositionChanged': {
                    diagram.undoRedoModule.positionChanged(nodeObj, diagram);
                    break;
                }
                case 'SizeChanged':
                case 'Sizing': {
                    diagram.undoRedoModule.nodeSizeChange(nodeObj, diagram, entry);
                    break;
                }
                case 'RotationChanged': {
                    diagram.undoRedoModule.rotateNode({ nodes: nodes } as SelectorModel, nodeObj, diagram, entry, 'undo');
                    break;
                }
                case 'LabelCollectionChanged': {
                    if (propertyChanges) {
                        const annotation: ShapeAnnotationModel = propertyChanges.newObjectValue as ShapeAnnotationModel;
                        if (annotation) {
                            diagram.undoRedoModule.labelCollectionChanged(nodeObj, annotation, changeType, diagram);
                        }
                    }
                    break;
                }
                case 'ColumnWidthChanged': {
                    this.recordGridSizeChanged(nodeObj, diagram, false, false);
                    break;
                }
                case 'RowHeightChanged': {
                    this.recordGridSizeChanged(nodeObj, diagram, false, true);
                    break;
                }
                case 'CollectionChanged': {
                    diagram.undoRedoModule.collectionChanged(nodeObj, changeType, null, diagram);
                    break;
                }
                case 'PhaseCollectionChanged':
                case 'LaneCollectionChanged': {
                    if (propertyChanges) {
                        diagram.undoRedoModule.laneOrPhaseCollectionChanged(
                            changeType, nodeObj, propertyChanges.newObjectValue, diagram
                        );
                    }
                    break;
                }
                case 'ChildCollectionChanged': {
                    diagram.isCollaborativeContainerChanges = true;
                    diagram.undoRedoModule.childCollectionChanged(nodeObj, diagram, false, historyAction);
                    break;
                }
                case 'PortCollectionChanged': {
                    if (changeType === 'Remove') {
                        diagram.removePorts(nodeObj as Node, [propertyChanges.newObjectValue as PointPortModel]);
                    } else {
                        diagram.addPorts(nodeObj, [propertyChanges.newObjectValue as PointPortModel]);
                    }
                    break;
                }
                case 'AnnotationPropertyChanged': {
                    this.annotationPropertyChange(nodeObj as Node, propertyChanges.objectId, diagram);
                    break;
                }
                case 'Group': {
                    diagram.add(nodeObj);
                    break;
                }
                case 'UnGroup': {
                    diagram.commandHandler.unGroup(nodeObj);
                    break;
                }
                case 'SendBackward': {
                    diagram.commandHandler.sendBackward(objectToUpdate);
                    break;
                }
                case 'SendToBack': {
                    diagram.commandHandler.sendToBack(objectToUpdate);
                    break;
                }
                case 'BringToFront': {
                    diagram.commandHandler.bringToFront(objectToUpdate);
                    break;
                }
                case 'SendForward': {
                    diagram.commandHandler.sendForward(objectToUpdate);
                    break;
                }
                case 'AddChildToGroupNode': {
                    diagram.addChildToGroup(objectToUpdate, propertyChanges.objectId);
                    break;
                }
                case 'RemoveChildFromGroupNode': {
                    diagram.removeChildFromGroup(objectToUpdate, propertyChanges.objectId);
                    break;
                }
                }
            }
            finally {
                diagram.isCollaborativeContainerChanges = false;
                diagram.protectPropertyChange(previous);
            }
        }
        if (propertyChanges && historyType === 'LanePositionChanged') {
            const positionChangedArgs: StackEntryObject = propertyChanges.newObjectValue as StackEntryObject;
            if (positionChangedArgs.source) {
                const parent: Node = diagram.nameTable[(positionChangedArgs.source as Node).parentId];
                if (parent && parent.shape.type === 'SwimLane') {
                    laneInterChanged(diagram, positionChangedArgs.target, positionChangedArgs.source);
                    diagram.clearSelection();
                }
            }
        }
    }

    /**
     * Applies annotation property changes from remote updates.
     * Finds the specified annotation on the object and triggers a property change
     * event with old and new values to update the visual state.
     * @param {Node | Connector} obj - The node or connector containing the annotation.
     * @param {string} annotationId - The unique identifier of the annotation to update.
     * @param {Diagram} diagram - The diagram instance.
     * @returns {void}
     * @private
     */
    private annotationPropertyChange(obj: Node | Connector, annotationId: string, diagram: Diagram) : void{
        const oldElement: ShapeAnnotation | PathAnnotation = findAnnotation(obj, annotationId) as ShapeAnnotation | PathAnnotation;
        const undoChanges: Object = diagram.commandHandler.getAnnotationChanges(diagram.nameTable[obj.id], oldElement);
        if ((obj as Node).offsetX) {
            diagram.nodePropertyChange(diagram.nameTable[obj.id] as Node, {} as Node, undoChanges as Node);
        } else {
            diagram.connectorPropertyChange(diagram.nameTable[obj.id] as Connector, {} as Connector, undoChanges as Connector);
        }
    }
    /**
     * Records and applies grid size changes for swimlane child elements.
     *
     * This method maps a child node's size differences back to its parent
     * swimlane's grid and triggers layout/arrange updates so the visual
     * swimlane reflects the resized phase/row/column.
     *
     * @param {Node} nodeObj - The node whose size changed (typically a swimlane phase or row child).
     * @param {Diagram} diagram - The Diagram instance containing the swimlane and grid.
     * @param {boolean} isRedo - Whether this change is being applied during a redo operation.
     * @param {boolean} isRow - True when updating a row height; false when updating a column width.
     * @returns {void}
     * @private
     */
    private recordGridSizeChanged(nodeObj: Node, diagram: Diagram, isRedo: boolean, isRow: boolean): void {
        const obj: Node = nodeObj;
        if (obj.parentId) {
            const swimlane: NodeModel = diagram.nameTable[obj.parentId];
            const actualObject: NodeModel = diagram.nameTable[obj.id];
            const x: number = swimlane.wrapper.bounds.x;
            const y: number = swimlane.wrapper.bounds.y;
            if (swimlane.shape.type === 'SwimLane') {
                const grid: GridPanel = swimlane.wrapper.children[0] as GridPanel;
                const padding: number = (swimlane.shape as SwimLane).padding;
                let isUndoRedo: boolean = false;
                if (diagram.diagramActions & DiagramAction.UndoRedo) {
                    isUndoRedo = true;
                }
                //Swimlane break - Phase collapsed upon serialization after resizing and undo-redo.
                let widthDiff: number = 0; let heightDiff: number = 0;
                if (obj.wrapper && obj.wrapper.actualSize && actualObject.wrapper && actualObject.wrapper.actualSize) {
                    widthDiff = obj.wrapper.actualSize.width - actualObject.wrapper.actualSize.width;
                    heightDiff = obj.wrapper.actualSize.height - actualObject.wrapper.actualSize.height;
                }
                updateSwimLaneObject(diagram, actualObject as Node, swimlane, obj, widthDiff, heightDiff);
                if (isRow) {
                    grid.updateRowHeight(obj.rowIndex, obj.wrapper.actualSize.height, true, padding, isUndoRedo);
                    swimlane.height = swimlane.wrapper.height = grid.height;
                } else {
                    grid.updateColumnWidth(obj.columnIndex, obj.wrapper.actualSize.width, true, padding, isUndoRedo);
                    swimlane.width = swimlane.wrapper.width = grid.width;
                    if (obj.isPhase) {
                        actualObject.maxWidth = actualObject.wrapper.maxWidth = obj.wrapper.actualSize.width;
                    }
                }
                swimLaneMeasureAndArrange(swimlane);
                if ((swimlane.shape as SwimLaneModel).orientation === 'Horizontal') {
                    updatePhaseMaxWidth(swimlane, diagram, actualObject.wrapper as Canvas, actualObject.columnIndex);
                }
                updateHeaderMaxWidth(diagram, swimlane);
                const tx: number = x - swimlane.wrapper.bounds.x;
                const ty: number = y - swimlane.wrapper.bounds.y;
                diagram.drag(swimlane, tx, ty);
                diagram.clearSelection();
                diagram.updateDiagramObject(swimlane);
            }
        }
    }
    /**
     * Processes connector-level history changes and delegates to the appropriate
     * handlers (segment/connection/collection/port/label updates and ordering
     * commands) on the diagram.
     *
     * @param {Connector[]} connectors - Array of `Connector` instances from the remote payload.
     * @param {PropertyChangedAction} propertyChanges - Optional property-change metadata for nested updates.
     * @param {EntryType} historyType - The history entry type being applied (e.g., SegmentChanged).
     * @param {EntryChangeType} changeType - The collection change type (Insert/Remove) when relevant.
     * @param {Diagram} diagram - The `Diagram` instance to update.
     * @returns {void}
     * @private
     */
    private processConnectorChangesAsync(
        connectors: Connector[], propertyChanges: PropertyChangedAction,
        historyType: EntryType,
        changeType: EntryChangeType,
        diagram: Diagram
    ): void {
        for (const connectorObj of connectors) {
            const objectToUpdate : Connector = diagram.getObject(connectorObj.id) as Connector;

            if (!objectToUpdate && historyType !== 'CollectionChanged') {
                continue;
            }
            switch (historyType) {
            case 'PositionChanged':
            case 'SizeChanged':
            case 'RotationChanged': {
                diagram.undoRedoModule.segmentChanged(connectorObj, diagram);
                diagram.undoRedoModule.connectionChanged(connectorObj, diagram);
                break;
            }
            case 'ConnectionChanged': {
                diagram.undoRedoModule.recordConnectionChanged(connectorObj, diagram);
                break;
            }
            case 'SegmentChanged': {
                diagram.undoRedoModule.segmentChanged(connectorObj, diagram);
                break;
            }
            case 'LabelCollectionChanged': {
                if (propertyChanges) {
                    const annotation: PathAnnotationModel = propertyChanges.newObjectValue as PathAnnotationModel;
                    if (annotation) {
                        diagram.undoRedoModule.labelCollectionChanged(connectorObj, annotation, changeType, diagram);
                    }
                }
                break;
            }
            case 'PortCollectionChanged': {
                if (propertyChanges) {
                    const port: PathPortModel = propertyChanges.newObjectValue as PathPortModel;
                    if (port) {
                        diagram.undoRedoModule.portCollectionChanged(connectorObj, port, changeType, diagram);
                    }
                }
                break;
            }
            case 'CollectionChanged': {
                diagram.undoRedoModule.collectionChanged(connectorObj, changeType, null, diagram);
                break;
            }
            case 'SendBackward': {
                diagram.commandHandler.sendBackward(objectToUpdate);
                break;
            }
            case 'SendToBack': {
                diagram.commandHandler.sendToBack(objectToUpdate);
                break;
            }
            case 'BringToFront': {
                diagram.commandHandler.bringToFront(objectToUpdate);
                break;
            }
            case 'SendForward': {
                diagram.commandHandler.sendForward(objectToUpdate);
                break;
            }
            }
        }
    }
    /**
     * Adjusts history type and collection change for Undo operations.
     *
     * @param {EntryType} type - Original history type.
     * @param {EntryChangeType} change - Original collection change.
     * @param {HistoryChangeAction} [trigger] - Trigger action (e.g., 'Undo').
     * @returns {{type: EntryType, change: EntryChangeType}} Adjusted type and change.
     * @private
     */
    private getAdjustedHistoryTypes(
        type: EntryType,
        change: EntryChangeType,
        trigger?: HistoryChangeAction
    ): { type: EntryType; change: EntryChangeType } {
        if (trigger === 'Undo') {
            const adjustedChange : EntryChangeType =
                change === 'Insert'
                    ? 'Remove'
                    : 'Insert';

            const adjustedTypeMap: Record<string, EntryType> = {
                Group: 'UnGroup',
                UnGroup: 'Group',
                AddChildToGroupNode: 'RemoveChildFromGroupNode',
                RemoveChildFromGroupNode: 'AddChildToGroupNode'
            };
            let adjustedType: EntryType = type;
            if (Object.prototype.hasOwnProperty.call(adjustedTypeMap, String(type))) {
                adjustedType = adjustedTypeMap[String(type)];
            }

            return { type: adjustedType, change: adjustedChange };
        }
        return { type, change };
    }

    /**
     * Constructor for the collaborative module
     *
     * @private
     */
    constructor() {
        //constructs the collaborative module
    }

    /**
     * To destroy the collaborative module
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        this.collaborativeCollection = [];
        this.isGroupAction = false;
    }

    /**
     * Returns the module name.
     *
     * @returns {string} The module name for this class.
     * @private
     */
    protected getModuleName(): string {
        return 'DiagramCollaboration';
    }
}

/**
 * Represents a serialized diagram change payload for collaboration.
 * This interface encapsulates all information needed to transmit and apply
 * diagram modifications between collaborating users in real-time. It includes
 * modified diagram objects (nodes and connectors), the type of change that occurred,
 * and metadata required for proper synchronization and undo/redo support.
 * **Change Categories:**
 * - **Object Changes**: Modified nodes and connectors with updated properties
 * - **Collection Changes**: Addition or removal of diagram elements
 * - **Property Changes**: Granular updates to object properties, styles, and nested elements
 * - **History Context**: Entry type, action trigger, and history action for proper application
 * **Typical Flow:**
 * 1. Local changes are serialized into this format via `serializeHistoryChange()`
 * 2. The JSON payload is transmitted to remote collaborators
 * 3. Remote clients deserialize and apply changes via `applyRemoteChanges()`
 * @private
 */
export interface DiagramChanges {
    /**
     * The list of modified nodes in this change batch.
     * Contains cloned node objects with updated properties and their parent IDs
     * stored in addInfo for proper context during application.
     * @type {Node[] | null}
     */
    modifiedNodes?: Node[] | null;
    /**
     * The list of modified connectors in this change batch.
     * Contains cloned connector objects with updated properties and their parent IDs
     * stored in addInfo for proper context during application.
     * @type {Connector[] | null}
     */
    modifiedConnectors?: Connector[] | null;
    /**
     * The history entry type for this change operation.
     * Indicates the nature of the change (e.g., PositionChanged, SizeChanged,
     * CollectionChanged, PropertyChanged, LabelCollectionChanged, etc.).
     * Used to route the change to the appropriate handler during application.
     * @type {EntryType}
     */
    entryType: EntryType;
    /**
     * The collection change type for collection-based operations.
     * Specifies whether elements were inserted or removed from a collection.
     * Valid values: 'Insert' | 'Remove'.
     * Only applicable when entryType involves collection modifications.
     * @type {EntryChangeType}
     */
    collectionChangedAction: EntryChangeType;
    /**
     * The action trigger that initiated this change.
     * Indicates whether this change originated from a normal user action,
     * an undo operation, or a redo operation. This affects how old/new values
     * are interpreted during application.
     * Valid values: 'None' | 'Undo' | 'Redo'.
     * @type {HistoryChangeAction | null}
     */
    actionTrigger?: HistoryChangeAction | null;
    /**
     * Optional metadata describing property-level changes.
     * Contains detailed information about property updates including old and new values,
     * affected object IDs, and references to child elements (annotations, ports).
     * Used for granular property synchronization during PropertyChanged operations.
     * @type {PropertyChangedAction}
     */
    propertyChanges?: PropertyChangedAction;
    /**
     * The diagram history action type associated with this change.
     * Provides additional context about the specific operation performed
     * (e.g., Custom, ConnectionChanged, SegmentChanged, etc.).
     * Used to determine the appropriate update behavior in certain scenarios.
     * @type {DiagramHistoryAction}
     */
    historyAction: DiagramHistoryAction;
    /**
     * The extended history entry containing additional context and metadata.
     * Includes supplementary information such as child table references for
     * complex operations (e.g., swimlane modifications, grouped actions).
     * Provides full history context needed for advanced change application scenarios.
     * @type {ExtendedHistoryEntry | null}
     */
    entry?: ExtendedHistoryEntry | null;
}
/**
 * Metadata describing property-level changes for diagram objects during collaboration.
 * This interface captures the context needed to apply property updates from remote
 * collaborators, including old/new values, affected object IDs, and nested child elements.
 * Different change types populate different subsets of these fields.
 * @private
 */
export interface PropertyChangedAction {
    /**
     * The new object value for single-object changes (e.g., an added/removed annotation, port, or swimlane element).
     * Used primarily for label/port/phase/lane collection changes.
     * @type {Object}
     */
    newObjectValue?: Object;
    /**
     * Array of object IDs (nodes/connectors) whose properties were changed.
     * Used to correlate property updates with specific diagram objects.
     * @type {string[] | null}
     */
    sourceIds?: string[] | null;
    /**
     * The previous state of the diagram model (nodes and connectors) before the property change.
     * Contains the old property values for comparison during undo/redo operations.
     * @type {DiagramModel | null}
     */
    oldValue?: DiagramModel | null;
    /**
     * The new state of the diagram model (nodes and connectors) after the property change.
     * Contains the updated property values to be applied.
     * @type {DiagramModel | null}
     */
    newValue?: DiagramModel | null;
    /**
     * The port object being added or removed during a PortCollectionChanged operation.
     * Can be either a PathPortModel (connector port) or PointPortModel (node port).
     * @type {PathPortModel | PointPortModel | null}
     */
    port?: PathPortModel | PointPortModel | null;
    /**
     * Array of child element IDs (annotations and ports) associated with the changed objects.
     * Used to map nested property updates to the correct child elements.
     * @type {string[] | null}
     */
    childrenId?: string[] | null;
    /**
     * The unique identifier of a specific object (e.g., annotation, child node) involved in the change.
     * Used for operations like AddChildToGroupNode or AnnotationPropertyChanged.
     * @type {string | null}
     */
    objectId?: string | null;
}
