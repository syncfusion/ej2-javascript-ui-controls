import {
    ConnectorModel,
    ConnectorConstraints,
    Diagram,
    DiagramAction,
    NodeModel,
    PointPortModel,
    PortVisibility
} from '@syncfusion/ej2-diagrams';
import { WorkflowConnection } from '../models/workflow-connection';
import { WorkflowPosition } from '../models/workflow-position';
import { WorkflowStep } from '../models/workflow-step';
import { WorkflowStickyNote } from '../models/workflow-sticky-note';
import { ConnectorMapper, WorkflowConnectorVisualState } from './connector-mapper';
import { NodeMapper } from './node-mapper';
import { StickyNoteRenderer } from '../rendering/sticky-note-renderer';
import { WorkflowStepTemplateRenderer } from '../rendering/workflow-step-renderer';
import { WorkflowStepState } from '../models/workflow-step-template';
import { getNextStaggeredOffset, applyStaggerMetadata, onNodeRemoved } from '../layout/stagger-positioning';

type RenderTrackerCallback = (id: string) => void;

/**
 * Owns the private bidirectional mapping between workflow models and Diagram objects.
 *
 * @private
 */
export class DiagramMapper {
    private diagram: Diagram | null;
    private readonly stickyLayerId: string = 'wf-sticky-notes';
    private readonly normalLayerId: string = 'wf-normal-objects';
    private readonly stepNodes: Map<string, NodeModel> = new Map<string, NodeModel>();
    private readonly nodeSteps: Map<string, string> = new Map<string, string>();
    private readonly connectionConnectors: Map<string, ConnectorModel> = new Map<string, ConnectorModel>();
    private readonly connectorConnections: Map<string, string> = new Map<string, string>();
    private readonly stickyNoteNodes: Map<string, NodeModel> = new Map<string, NodeModel>();
    private readonly nodeStickyNotes: Map<string, string> = new Map<string, string>();
    private readonly connectionModels: Map<string, WorkflowConnection> =
    new Map<string, WorkflowConnection>();
    private readonly connectorMapper: ConnectorMapper;
    private readonly stickyNoteRenderer: StickyNoteRenderer = new StickyNoteRenderer();
    private readonly renderTracker?: RenderTrackerCallback;
    private stepTemplate?: WorkflowStepTemplateRenderer;

    /**
     * Creates a Diagram mapper.
     *
     * @param {Diagram} diagram - The internal Diagram instance.
     * @param {RenderTrackerCallback} [renderTracker] - Optional callback invoked for touched object IDs.
     * @private
     */
    public constructor(diagram: Diagram, renderTracker?: RenderTrackerCallback) {
        this.diagram = diagram;
        this.renderTracker = renderTracker;
        this.connectorMapper = new ConnectorMapper();
    }

    /**
     * Sets the custom workflow-step content renderer used for every step repaint.
     *
     * @param {WorkflowStepTemplateRenderer} [template] - The renderer, or `undefined` to use the built-in content.
     * @returns {void} Nothing.
     * @private
     */
    public setStepTemplateRenderer(template?: WorkflowStepTemplateRenderer): void {
        this.stepTemplate = template;
    }

    /**
     * Repaints the content of one step, or of every step when no id is given. Ports,
     * connectors and execution state are not touched.
     *
     * @param {string} [stepId] - The workflow step identifier.
     * @returns {void} Nothing.
     * @private
     */
    public refreshStepContent(stepId?: string): void {
        const ids: string[] = [];
        if (stepId) {
            ids.push(stepId);
        } else {
            this.stepNodes.forEach((_node: NodeModel, key: string): void => {
                ids.push(key);
            });
        }
        let repainted: boolean = false;
        ids.forEach((id: string): void => {
            if (!this.stepNodes.has(id)) {
                return;
            }
            const node: NodeModel | null = this.resolveLiveNode(id);
            if (node) {
                NodeMapper.repaintHtml(node, this.stepTemplate);
                this.mark(id);
                repainted = true;
            }
        });
        if (repainted && this.diagram && typeof this.diagram.dataBind === 'function') {
            this.diagram.dataBind();
        }
    }

    /**
     * Reconciles the model indexes with the live Diagram objects after an undo or redo.
     *
     * No Diagram objects are recreated.
     *
     * @returns {object} The workflow models represented by the current diagram.
     * @private
     */
    public syncWorkflowItemsFromDiagram(): {
        workflowSteps: WorkflowStep[];
        workflowConnections: WorkflowConnection[];
        stickyNotes: WorkflowStickyNote[];
    } {
        const workflowSteps: WorkflowStep[] = [];
        const workflowConnections: WorkflowConnection[] = [];
        const stickyNotes: WorkflowStickyNote[] = [];

        this.stepNodes.clear();
        this.nodeSteps.clear();
        this.connectionConnectors.clear();
        this.connectorConnections.clear();
        this.connectionModels.clear();
        this.stickyNoteNodes.clear();
        this.nodeStickyNotes.clear();

        if (!this.diagram) {
            return {
                workflowSteps: workflowSteps,
                workflowConnections: workflowConnections,
                stickyNotes: stickyNotes
            };
        }

        (this.diagram.nodes || []).forEach((node: NodeModel) => {
            const addInfo: {
                workflowStep?: WorkflowStep;
                workflowStickyNote?: WorkflowStickyNote;
            } | undefined = node.addInfo && typeof node.addInfo === 'object'
                ? node.addInfo as {
                    workflowStep?: WorkflowStep;
                    workflowStickyNote?: WorkflowStickyNote;
                }
                : undefined;
            const nodeId: string = String(node.id || '');
            if (!addInfo || !nodeId) {
                return;
            }
            if (addInfo.workflowStep && addInfo.workflowStep.id === nodeId) {
                workflowSteps.push(addInfo.workflowStep);
                this.stepNodes.set(nodeId, node);
                this.nodeSteps.set(nodeId, nodeId);
            } else if (addInfo.workflowStickyNote && addInfo.workflowStickyNote.id === nodeId) {
                const note: WorkflowStickyNote = addInfo.workflowStickyNote;
                stickyNotes.push(note);
                this.stickyNoteNodes.set(nodeId, node);
                this.nodeStickyNotes.set(nodeId, nodeId);
                this.stickyNoteRenderer.trackNode(node, note);
            }
        });

        (this.diagram.connectors || []).forEach((connector: ConnectorModel) => {
            const addInfo: { workflowConnection?: WorkflowConnection } | undefined =
                connector.addInfo && typeof connector.addInfo === 'object'
                    ? connector.addInfo as { workflowConnection?: WorkflowConnection }
                    : undefined;
            const connection: WorkflowConnection | undefined = addInfo && addInfo.workflowConnection;
            const connectorId: string = String(connector.id || '');
            if (!connection || !connection.id || connection.id !== connectorId) {
                return;
            }
            workflowConnections.push(connection);
            this.connectionConnectors.set(connection.id, connector);
            this.connectorConnections.set(connectorId, connection.id);
            this.connectionModels.set(connection.id, connection);
        });

        this.syncGeometryFromDiagram(workflowSteps, stickyNotes);

        return {
            workflowSteps: workflowSteps,
            workflowConnections: workflowConnections,
            stickyNotes: stickyNotes
        };
    }

    /**
     * Runs the supplied function with EJ2 history logging suppressed (only the
     * DiagramAction.PreventHistory flag is toggled on/off). Used to collapse the
     * post-add layer/ordering operations so a single user add triggers exactly
     * one history entry.
     *
     * @param {any} fn - Operations to run silently.
     * @returns {void} Nothing.
     */
    private runSilent(fn: any): void {
        if (!this.diagram) {
            return;
        }
        const d: Diagram = this.diagram;
        const prev: DiagramAction = d.diagramActions;
        d.diagramActions = prev | DiagramAction.PreventHistory;
        try {
            fn();
        } finally {
            d.diagramActions = prev;
        }
    }

    /**
     * Adds one sticky-note node to the Diagram.
     *
     * @param {WorkflowStickyNote} note - The sticky note to add.
     * @returns {void} Nothing.
     * @private
     */
    public addStickyNote(note: WorkflowStickyNote): void {
        if (!this.diagram) {
            return;
        }
        const node: NodeModel = this.stickyNoteRenderer.render(note);

        // Apply staggered positioning if node doesn't have explicit position
        if (!note.position || typeof note.position.x !== 'number' || typeof note.position.y !== 'number') {
            const baseX: number = 350;
            const baseY: number = 200;

            const { x, y, index } = getNextStaggeredOffset(this.diagram, baseX, baseY, {
                group: 'sticky',
                strategy: 'diagonal',
                stepX: 25,
                stepY: 25,
                usePersistentIndex: true
            });

            node.offsetX = x;
            node.offsetY = y;
            applyStaggerMetadata(node, 'sticky', index);
        }

        this.diagram.add(node);
        // Suppress history for the post-add layer move so only the user-triggered
        // CollectionChanged is recorded.
        this.runSilent(() => {
            this.diagram.moveObjects([`${node.id}`], this.stickyLayerId);
        });
        const id: string = note.id || '';
        this.stickyNoteNodes.set(id, node);
        this.nodeStickyNotes.set(id, id);
        // setTimeout fires asynchronously (after dispose() in test afterEach
        // may have nulled this.diagram). Capture the diagram reference now
        // and guard the callback so a torn-down mapper does not throw an
        // uncaught TypeError that disconnects the test run.
        const liveDiagram: Diagram | null = this.diagram;
        setTimeout(() => {
            if (!liveDiagram) {
                return;
            }
            this.stickyNoteRenderer.setStickyNoteZIndex(node, liveDiagram);
        }, 0);
        this.mark(id);
    }

    /**
     * Restores imported sticky-note geometry after the Diagram has bound its nodes.
     *
     * @param {WorkflowStickyNote[]} notes - The sticky notes to restore.
     * @returns {void} Nothing.
     * @private
     */
    public restoreStickyNoteGeometry(notes: WorkflowStickyNote[]): void {
        if (!this.diagram) {
            return;
        }
        notes.forEach((note: WorkflowStickyNote) => {
            const node: NodeModel | undefined = (this.diagram ? this.diagram.nodes || [] : []).find(
                (candidate: NodeModel) => String(candidate.id || '') === String(note.id || '')
            );
            if (!node) {
                return;
            }
            if (note.position) {
                if (typeof note.position.x === 'number') {
                    node.offsetX = note.position.x;
                }
                if (typeof note.position.y === 'number') {
                    node.offsetY = note.position.y;
                }
            }
            if (note.size) {
                if (typeof note.size.width === 'number') {
                    node.width = note.size.width;
                    if (node.annotations && node.annotations[0]) {
                        node.annotations[0].width = note.size.width;
                    }
                }
                if (typeof note.size.height === 'number') {
                    node.height = note.size.height;
                    if (node.annotations && node.annotations[0]) {
                        node.annotations[0].height = note.size.height;
                    }
                }
            }
            this.stickyNoteRenderer.trackNode(node, note);
            this.stickyNoteNodes.set(String(note.id || ''), node);
        });
        this.diagram.dataBind();
        notes.forEach((note: WorkflowStickyNote) => {
            const node: NodeModel | undefined = this.stickyNoteNodes.get(String(note.id || ''));
            const liveDiagram: Diagram | null = this.diagram;
            if (node && liveDiagram) {
                setTimeout(() => {
                    if (!liveDiagram) {
                        return;
                    }
                    this.stickyNoteRenderer.setStickyNoteZIndex(node, liveDiagram);
                }, 0);
            }
        });
    }

    /**
     * Updates only the mapped sticky-note node.
     *
     * @param {string} id - The sticky-note identifier.
     * @param {Partial<WorkflowStickyNote>} changes - The sticky-note changes.
     * @returns {void} Nothing.
     * @private
     */
    public updateStickyNote(id: string, changes: Partial<WorkflowStickyNote>): void {
        const liveNode: NodeModel | null = this.resolveLiveNode(id);
        const node: NodeModel | undefined = liveNode || this.stickyNoteNodes.get(id);
        if (!node) {
            return;
        }
        if (liveNode) {
            this.stickyNoteNodes.set(id, liveNode);
        }
        this.stickyNoteRenderer.applyChanges(node, changes);
        const diagramApi: Diagram & {
            updateDiagramObject?: (obj: NodeModel) => void;
        } = this.diagram as Diagram & {
            updateDiagramObject?: (obj: NodeModel) => void;
        };
        if (typeof diagramApi.updateDiagramObject === 'function') {
            diagramApi.updateDiagramObject(node);
        }
        if (this.diagram && typeof this.diagram.dataBind === 'function') {
            this.diagram.dataBind();
        }
        this.mark(id);
    }

    /**
     * Applies live resize dimensions without replacing the HTML template.
     *
     * @param {string} id - The sticky-note identifier.
     * @param {number} width - The new width.
     * @param {number} height - The new height.
     * @returns {void} Nothing.
     * @private
     */
    public updateStickyNoteSize(id: string, width: number, height: number): void {
        const node: NodeModel | undefined = this.stickyNoteNodes.get(id);
        if (!node) {
            return;
        }
        node.width = width;
        node.height = height;
        this.stickyNoteRenderer.applyChanges(node, { size: { width, height } });
        this.mark(id);
    }

    /**
     * Starts editing a mapped sticky note's embedded HTML template.
     *
     * @param {string} id - The sticky-note identifier.
     * @param {Function} onSave - Invoked with the saved text.
     * @returns {void} Nothing.
     * @private
     */
    public beginStickyNoteEdit(id: string, onSave: (text: string) => void): void {
        const node: NodeModel | undefined = this.stickyNoteNodes.get(id);
        if (node) {
            this.stickyNoteRenderer.beginEdit(node, onSave);
        }
    }

    /**
     * Removes one mapped sticky-note node.
     *
     * @param {string} id - The sticky-note identifier.
     * @returns {void} Nothing.
     * @private
     */
    public removeStickyNote(id: string): void {
        const node: NodeModel | undefined = this.stickyNoteNodes.get(id);
        if (node && this.diagram) {
            // Clean up stagger metadata and reindex remaining nodes in the group
            onNodeRemoved(node, this.diagram);
            this.diagram.remove(node);
        }
        this.stickyNoteNodes.delete(id);
        this.nodeStickyNotes.delete(id);
        this.mark(id);
    }

    /**
     * Resolves a Diagram node ID to its public sticky-note ID.
     *
     * @param {string} nodeId - The Diagram node identifier.
     * @returns {string | null} The sticky-note identifier, or null.
     * @private
     */
    public getStickyNoteIdForNode(nodeId: string): string | null {
        return this.nodeStickyNotes.get(nodeId) || null;
    }

    /**
     * Returns the mapped Diagram node for a public sticky-note ID.
     *
     * @param {string} id - The sticky-note identifier.
     * @returns {NodeModel | null} The mapped Diagram node, or null.
     * @private
     */
    public getNodeForStickyNote(id: string): NodeModel | null {
        return this.stickyNoteNodes.get(id) || null;
    }

    /**
     * Excludes mapped sticky-note nodes from automatic layout.
     *
     * @returns {void} Nothing.
     * @private
     */
    public markStickyNotesExcluded(): void {
        this.stickyNoteNodes.forEach((node: NodeModel) => {
            node.excludeFromLayout = true;
        });
    }

    /**
     * Adds one workflow step node to the Diagram.
     *
     * @param {WorkflowStep} step - The workflow step to add.
     * @returns {void} Nothing.
     * @private
     */
    public addNode(step: WorkflowStep): void {
        if (!this.diagram) {
            return;
        }
        const node: NodeModel = NodeMapper.toDiagramNode(step, this.stepTemplate);

        // Apply staggered positioning if node doesn't have explicit position
        if (!step.position || typeof step.position.x !== 'number' || typeof step.position.y !== 'number') {
            const baseX: number = 350;
            const baseY: number = 200;

            const { x, y, index } = getNextStaggeredOffset(this.diagram, baseX, baseY, {
                group: 'step',
                strategy: 'diagonal',
                stepX: 25,
                stepY: 25,
                usePersistentIndex: true
            });

            node.offsetX = x;
            node.offsetY = y;
            applyStaggerMetadata(node, 'step', index);
        }

        this.diagram.add(node);
        // Suppress history for the post-add layer move AND the bringLayerForward
        // re-order so a single add yields only its CollectionChanged entry.
        this.runSilent(() => {
            this.diagram.moveObjects([`${node.id}`], this.normalLayerId);
            this.diagram.bringLayerForward(this.normalLayerId);
        });
        const id: string = step.id || '';
        // Prefer the live instance from diagram.nodes after add (EJ2 may wrap
        // the model). Runtime content updates must use that same object.
        const live: NodeModel | undefined = this.diagram.nodes
            ? this.diagram.nodes.find((item: NodeModel) => String(item.id || '') === id)
            : undefined;
        this.stepNodes.set(id, live || node);
        this.nodeSteps.set(id, id);
        this.mark(id);
    }

    /**
     * Updates only the mapped node for a workflow step.
     *
     * Returns the list of connection ids that became orphan during this
     * update (e.g. when a Switch branch port was removed and its outgoing
     * connection is no longer reachable). The caller is responsible for
     * removing them from the public `workflowConnections` collection and
     * from the registry. Returns an empty array when nothing was removed.
     *
     * @param {string} id - The workflow step identifier.
     * @param {Partial<WorkflowStep>} changes - The step changes.
     * @returns {string[]} The identifiers of orphaned connections.
     * @private
     */
    public updateNode(id: string, changes: Partial<WorkflowStep>): string[] {
        // Prefer live diagram.nodes instance so port wrappers attach to the painted node.
        const liveStep: NodeModel | null = this.stepNodes.has(id) || this.nodeSteps.has(id)
            ? this.resolveLiveNode(id)
            : null;
        const node: NodeModel | undefined = liveStep
            || this.stepNodes.get(id)
            || this.stickyNoteNodes.get(id);
        if (!node) {
            return [];
        }
        if (liveStep) {
            this.stepNodes.set(id, liveStep);
        }
        const storedStep: WorkflowStep = NodeMapper.getStoredStep(node);
        const portsMayChange: boolean = this.stepNodes.has(id)
            && (changes.stepType !== undefined
                || (changes.props !== undefined && storedStep.stepType === 'Switch'));
        // Capture the previous output port names BEFORE applyChanges mutates
        // the stored step's props. This lets us detect which output ports
        // (e.g. Switch branches) have been removed so we can delete the
        // direct connections that used them.
        const previousOutputPorts: Set<string> | null = portsMayChange
            ? this.captureOutputPortNames(id, node)
            : null;
        NodeMapper.applyChanges(node, changes, this.stepTemplate);
        // Switch branch add/remove (and any props/stepType port change) must go through
        // diagram.addPorts/removePorts — bare node.ports replacement leaves ports invisible
        // and drops connector sourcePortID binding.
        const orphanIds: string[] = [];
        if (portsMayChange) {
            this.syncNodePorts(id, node);
            this.rebindConnectorsForNode(id);
        }
        // EJ2's addPorts / removePorts / updateDiagramObject can replace or re-clone
        // the node instance managed by the Diagram. Re-resolve the live node
        // BEFORE we read its current output ports, so the cascade-remove diff
        // runs against the same instance the canvas is actually painting from.
        const liveAfter: NodeModel | null = this.resolveLiveNode(id);
        if (portsMayChange && previousOutputPorts && liveAfter) {
            const currentOutputPorts: Set<string> = this.captureOutputPortNames(id, liveAfter);
            const removedOutputPorts: string[] = [];
            previousOutputPorts.forEach((name: string) => {
                if (!currentOutputPorts.has(name)) {
                    removedOutputPorts.push(name);
                }
            });
            removedOutputPorts.forEach((portName: string) => {
                this.connectionModels.forEach((connection: WorkflowConnection, connectionId: string) => {
                    if (connection.sourceStepId === id && connection.sourcePort === portName) {
                        this.removeConnector(connectionId);
                        orphanIds.push(connectionId);
                    }
                });
            });
            if (liveAfter) {
                this.stepNodes.set(id, liveAfter);
            }
        }
        // Repaint the full HTML card on the live node so the canvas picks up
        // the new Switch / Formatter dimensions on the very next paint —
        // matching the path the simulation already exercises (see
        // `applyNodeVisualState`). Without this, the change is applied to the
        // model but the canvas keeps painting the prior frame and the height
        // only catches up when execution starts.
        if (liveAfter && this.stepNodes.has(id)) {
            NodeMapper.repaintHtml(liveAfter, this.stepTemplate);
        }
        // Eager dataBind so the canvas repaints the new height / shape immediately.
        // Without this, model mutations only paint on the next EJ2 internal
        // refresh pass — which for visual-only edits (Switch branch add/remove)
        // can be the execution start, leaving the canvas stale in between.
        if (this.diagram && typeof this.diagram.dataBind === 'function') {
            this.diagram.dataBind();
        }
        this.mark(id);
        return orphanIds;
    }

    /**
     * Returns the set of public output port names currently exposed by a
     * step, derived from its Diagram node's port ids (`{nodeId}:output:{name}`).
     * Returns an empty set when the step is not mapped.
     *
     * @param {string} stepId - The workflow step identifier.
     * @param {NodeModel | null | undefined} node - The mapped Diagram node.
     * @returns {Set<string>} The exposed output port names.
     */
    private captureOutputPortNames(stepId: string, node: NodeModel | null | undefined): Set<string> {
        const ports: PointPortModel[] = (node && Array.isArray(node.ports)) ? node.ports : [];
        const prefix: string = `${stepId}:output:`;
        const names: Set<string> = new Set<string>();
        ports.forEach((port: PointPortModel) => {
            const id: string = String(port.id || '');
            if (id.indexOf(prefix) === 0) {
                names.add(id.substring(prefix.length));
            }
        });
        return names;
    }

    /**
     * Removes a step and any mapped connectors that reference it.
     *
     * @param {string} id - The workflow step identifier.
     * @returns {string[]} The identifiers of orphaned connections.
     * @private
     */
    public removeNode(id: string): string[] {
        const orphanIds: string[] = [];
        const node: NodeModel | undefined = this.stepNodes.get(id) || this.stickyNoteNodes.get(id);
        if (!node || !this.diagram) {
            return orphanIds;
        }
        this.connectionModels.forEach((connection: WorkflowConnection, connectionId: string) => {
            if (connection.sourceStepId === id || connection.targetStepId === id) {
                orphanIds.push(connectionId);
                this.removeConnector(connectionId);
            }
        });

        // Clean up stagger metadata and reindex remaining nodes in the group
        onNodeRemoved(node, this.diagram);
        this.diagram.remove(node);

        this.stepNodes.delete(id);
        this.nodeSteps.delete(id);
        this.stickyNoteNodes.delete(id);
        this.nodeStickyNotes.delete(id);
        this.mark(id);
        return orphanIds;
    }

    /**
     * Adds a validated connection connector to the Diagram.
     *
     * @param {WorkflowConnection} connection - The workflow connection to add.
     * @returns {boolean} Whether the connector was added.
     * @private
     */
    public addConnector(connection: WorkflowConnection): boolean {
        if (!this.diagram) {
            return false;
        }
        const connector: ConnectorModel | null = this.connectorMapper.toDiagramConnector(
            connection,
            this.stepNodes
        );
        if (!connector) {
            return false;
        }
        const id: string = connection.id || '';
        // Register maps before diagram.add so a collectionChange reconcile does
        // not treat this programmatic connector as an unmapped manual draw.
        this.connectionConnectors.set(id, connector);
        this.connectorConnections.set(id, id);
        this.connectionModels.set(id, connection);
        // Apply constraints to prevent disconnection of source/target ends
        connector.constraints =
            (ConnectorConstraints.Default | ConnectorConstraints.ReadOnly) &
            ~ConnectorConstraints.DragSourceEnd &
            ~ConnectorConstraints.DragTargetEnd &
            ~ConnectorConstraints.Drag;
        this.diagram.add(connector);
        this.runSilent(() => {
            this.diagram.moveObjects([String(connector.id || '')], this.normalLayerId);
            this.diagram.bringLayerForward(this.normalLayerId);
        });
        // Prefer the live instance from diagram.connectors after add (EJ2 may wrap
        // the model). Runtime stroke/decorator updates must use that same object.
        const live: ConnectorModel = this.diagram.connectors
            ? this.diagram.connectors.find((item: ConnectorModel) => String(item.id || '') === id)
            : null;
        if (live) {
            this.connectionConnectors.set(id, live);
            this.connectorConnections.set(String(live.id || id), id);
            // Re-apply constraints on the live instance
            live.constraints =
                (ConnectorConstraints.Default | ConnectorConstraints.ReadOnly) &
                ~ConnectorConstraints.DragSourceEnd &
                ~ConnectorConstraints.DragTargetEnd &
                ~ConnectorConstraints.Drag;
            this.runSilent(() => {
                this.diagram.moveObjects([String(live.id || id)], this.normalLayerId);
                this.diagram.bringLayerForward(this.normalLayerId);
            });
        }
        this.mark(id);
        return true;
    }

    /**
     * Registers an existing Diagram connector (e.g. manual port-to-port draw)
     * into the workflow bidirectional maps without calling `diagram.add` again.
     * Endpoints must already resolve to mapped workflow steps.
     *
     * @param {WorkflowConnection} connection - The workflow connection to register.
     * @param {ConnectorModel} existing - The existing Diagram connector.
     * @returns {boolean} Whether the connector was registered.
     * @private
     */
    public adoptConnector(connection: WorkflowConnection, existing: ConnectorModel): boolean {
        if (!this.diagram || !connection || !existing) {
            return false;
        }
        const id: string = connection.id || String(existing.id || '');
        if (!id) {
            return false;
        }
        const sourceStepId: string = connection.sourceStepId || '';
        const targetStepId: string = connection.targetStepId || '';
        if (!this.stepNodes.has(sourceStepId) || !this.stepNodes.has(targetStepId)) {
            return false;
        }
        // Normalize ports / decorators to the same shape as programmatic connectors
        // so simulation styling and export stay consistent.
        const expected: ConnectorModel | null = this.connectorMapper.toDiagramConnector(
            connection,
            this.stepNodes
        );
        if (!expected) {
            return false;
        }
        const connectorId: string = String(existing.id || id);
        const live: ConnectorModel | undefined = this.diagram.connectors
            ? this.diagram.connectors.find((item: ConnectorModel) => String(item.id || '') === connectorId)
            : undefined;
        const target: ConnectorModel = live || existing;
        if (String(target.id || '') !== id) {
            target.id = id;
        }
        target.sourceID = expected.sourceID;
        target.targetID = expected.targetID;
        target.sourcePortID = expected.sourcePortID;
        target.targetPortID = expected.targetPortID;
        target.type = expected.type;
        if (expected.sourceDecorator) {
            target.sourceDecorator = expected.sourceDecorator;
        }
        if (expected.targetDecorator) {
            target.targetDecorator = expected.targetDecorator;
        }
        if (expected.style) {
            target.style = expected.style;
        }
        const targetAddInfo: Record<string, unknown> = target.addInfo && typeof target.addInfo === 'object'
            ? target.addInfo as Record<string, unknown>
            : {};
        target.addInfo = Object.assign({}, targetAddInfo, { workflowConnection: connection });
        connection.id = id;
        this.connectionConnectors.set(id, target);
        this.connectorConnections.set(id, id);
        if (connectorId && connectorId !== id) {
            this.connectorConnections.set(connectorId, id);
        }
        this.connectionModels.set(id, connection);
        this.mark(id);
        return true;
    }

    /**
     * Updates only the mapped connector for a workflow connection.
     *
     * @param {string} id - The workflow connection identifier.
     * @param {Partial<WorkflowConnection>} changes - The connection changes.
     * @returns {void} Nothing.
     * @private
     */
    public updateConnector(id: string, changes: Partial<WorkflowConnection>): void {
        const connector: ConnectorModel | undefined = this.connectionConnectors.get(id);
        if (!connector) {
            return;
        }
        const live: ConnectorModel | undefined = this.diagram && this.diagram.connectors
            ? this.diagram.connectors.find((item: ConnectorModel) => String(item.id || '') === id)
            : undefined;
        const target: ConnectorModel = live || connector;
        this.connectionConnectors.set(id, target);
        this.connectorMapper.applyChanges(target, changes);
        const connection: WorkflowConnection | undefined = this.connectionModels.get(id);
        if (connection) {
            Object.assign(connection, changes);
        }
        if (this.diagram && typeof this.diagram.updateConnectorProperties === 'function') {
            this.diagram.updateConnectorProperties(target);
        }
        if (this.diagram && typeof this.diagram.dataBind === 'function') {
            this.diagram.dataBind();
        }
        this.mark(id);
    }

    /**
     * Removes one mapped connector.
     *
     * @param {string} id - The workflow connection identifier.
     * @returns {void} Nothing.
     * @private
     */
    public removeConnector(id: string): void {
        const connector: ConnectorModel | undefined = this.connectionConnectors.get(id);
        if (connector && this.diagram) {
            this.diagram.remove(connector);
        }
        this.connectionConnectors.delete(id);
        this.connectorConnections.delete(id);
        this.connectionModels.delete(id);
        this.mark(id);
    }

    /**
     * Resolves a Diagram node ID to its public step ID.
     *
     * @param {string} nodeId - The Diagram node identifier.
     * @returns {string | null} The workflow step identifier, or null.
     * @private
     */
    public getStepIdForNode(nodeId: string): string | null {
        return this.nodeSteps.get(nodeId) || null;
    }

    /**
     * Resolves a Diagram connector ID to its public connection ID.
     *
     * @param {string} connectorId - The Diagram connector identifier.
     * @returns {string | null} The workflow connection identifier, or null.
     * @private
     */
    public getConnectionIdForConnector(connectorId: string): string | null {
        return this.connectorConnections.get(connectorId) || null;
    }

    /**
     * Returns the public workflow connection associated with an internal connector ID.
     *
     * @param {string} connectorId - The Diagram connector identifier.
     * @returns {WorkflowConnection | null} The workflow connection, or null.
     * @private
     */
    public getConnectionForConnector(connectorId: string): WorkflowConnection | null {
        const connectionId: string | null = this.getConnectionIdForConnector(connectorId);
        return connectionId ? this.connectionModels.get(connectionId) || null : null;
    }

    /**
     * Returns the mapped Diagram node for a public step ID.
     *
     * @param {string} stepId - The workflow step identifier.
     * @returns {NodeModel | null} The mapped Diagram node, or null.
     * @private
     */
    public getNodeForStep(stepId: string): NodeModel | null {
        return this.stepNodes.get(stepId) || null;
    }

    /**
     * Returns the mapped Diagram connector for a public connection ID.
     *
     * @param {string} connectionId - The workflow connection identifier.
     * @returns {ConnectorModel | null} The mapped Diagram connector, or null.
     * @private
     */
    public getConnectorForConnection(connectionId: string): ConnectorModel | null {
        return this.connectionConnectors.get(connectionId) || null;
    }

    /**
     * Returns the stored public connection model for a connection ID.
     *
     * @param {string} connectionId - The workflow connection identifier.
     * @returns {WorkflowConnection | null} The stored connection, or null.
     * @private
     */
    public getConnectionModel(connectionId: string): WorkflowConnection | null {
        return this.connectionModels.get(connectionId) || null;
    }

    /**
     * Applies runtime visual state to a mapped step node.
     * Optional `liveStep` re-binds the renderer to the workflow model object so
     * in-place simulation fields (e.g. Formatter runtimeOutput) are painted.
     *
     * @param {string} stepId - The workflow step identifier.
     * @param {WorkflowStepState} state - The runtime visual state.
     * @param {WorkflowStep} [liveStep] - The live workflow step model.
     * @returns {void} Nothing.
     * @private
     */
    public setNodeVisualState(
        stepId: string,
        state: WorkflowStepState,
        liveStep?: WorkflowStep
    ): void {
        // Prefer the live Diagram node (same object the sample mutates via
        // diagram.nodes[i]) so shape.content + dataBind refresh the HTML view.
        const node: NodeModel | null = this.resolveLiveNode(stepId);
        if (!node) {
            return;
        }
        // Keep the map pointing at the live instance for later lookups.
        this.stepNodes.set(stepId, node);
        if (liveStep) {
            NodeMapper.syncStoredStep(liveStep);
        }
        NodeMapper.setVisualState(node, state, this.stepTemplate);
        this.mark(stepId);
    }

    /**
     * Removes the running-stroke animation from a single step's rendered card
     * without touching its fill/border colors or stored state. Used by
     * `STOP` / `CANCEL` so a stopped run keeps its completed / failed colors
     * but stops the dashed-stroke "processing" animation.
     *
     * No-op for steps whose current stored state is not `running`.
     *
     * @param {string} stepId - The workflow step identifier.
     * @returns {boolean} `true` when the running SVG was removed.
     * @private
     */
    public stopStepAnimation(stepId: string): boolean {
        const node: NodeModel | null = this.resolveLiveNode(stepId);
        if (!node) {
            return false;
        }
        return NodeMapper.stopStepAnimation(node, this.stepTemplate);
    }

    /**
     * Returns the live Diagram node for a step id when available; otherwise the
     * mapped model. Runtime HTML content updates must target diagram.nodes.
     *
     * @param {string} stepId - The workflow step identifier.
     * @returns {NodeModel | null} The live or mapped Diagram node, or null.
     */
    private resolveLiveNode(stepId: string): NodeModel | null {
        if (this.diagram && Array.isArray(this.diagram.nodes)) {
            const live: NodeModel | undefined = this.diagram.nodes.find(
                (item: NodeModel) => String(item.id || '') === stepId
            );
            if (live) {
                return live;
            }
        }
        return this.getNodeForStep(stepId);
    }

    /**
     * Applies runtime visual state to a mapped connection connector.
     *
     * @param {string} connectionId - The workflow connection identifier.
     * @param {WorkflowConnectorVisualState} state - The runtime visual state.
     * @returns {void} Nothing.
     * @private
     */
    public setConnectorVisualState(
        connectionId: string,
        state: WorkflowConnectorVisualState
    ): void {
        // Prefer the live Diagram connector so strokeColor + decorator updates paint.
        const connector: ConnectorModel | null = this.resolveLiveConnector(connectionId);
        if (!connector) {
            return;
        }
        this.connectionConnectors.set(connectionId, connector);
        this.connectorMapper.setVisualState(connector, state, this.connectionModels.get(connectionId));
        this.mark(connectionId);
    }

    /**
     * Returns the live Diagram connector for a connection id when available;
     * otherwise the mapped model. Runtime style updates must target diagram.connectors.
     *
     * @param {string} connectionId - The workflow connection identifier.
     * @returns {ConnectorModel | null} The live or mapped connector, or null.
     */
    private resolveLiveConnector(connectionId: string): ConnectorModel | null {
        if (this.diagram && Array.isArray(this.diagram.connectors)) {
            const live: ConnectorModel | undefined = this.diagram.connectors.find(
                (item: ConnectorModel) => String(item.id || '') === connectionId
            );
            if (live) {
                return live;
            }
        }
        return this.getConnectorForConnection(connectionId);
    }

    /**
     * Copies Diagram node coordinates into matching public step positions exactly.
     *
     * @param {WorkflowStep[]} steps - The workflow steps to update.
     * @returns {void} Nothing.
     * @private
     */
    public syncPositionsFromDiagram(steps: WorkflowStep[]): void {
        steps.forEach((step: WorkflowStep) => {
            const node: NodeModel | undefined = this.stepNodes.get(step.id || '');
            if (!node) {
                return;
            }
            const position: WorkflowPosition = step.position || { x: 0, y: 0 };
            position.x = typeof node.offsetX === 'number' ? node.offsetX : position.x;
            position.y = typeof node.offsetY === 'number' ? node.offsetY : position.y;
            step.position = position;
            this.mark(step.id || '');
        });
    }

    /**
     * Copies current Diagram geometry into workflow steps and sticky notes.
     *
     * @param {WorkflowStep[]} steps - The workflow steps to update.
     * @param {WorkflowStickyNote[]} stickyNotes - The sticky notes to update.
     * @returns {void} Nothing.
     * @private
     */
    public syncGeometryFromDiagram(
        steps: WorkflowStep[],
        stickyNotes: WorkflowStickyNote[]
    ): void {
        this.syncPositionsFromDiagram(steps);
        stickyNotes.forEach((note: WorkflowStickyNote) => {
            const node: NodeModel | undefined = this.stickyNoteNodes.get(note.id || '');
            if (!node) {
                return;
            }
            note.position = {
                x: typeof node.offsetX === 'number'
                    ? node.offsetX
                    : (note.position && note.position.x) || 0,
                y: typeof node.offsetY === 'number'
                    ? node.offsetY
                    : (note.position && note.position.y) || 0
            };
            note.size = {
                width: typeof node.width === 'number'
                    ? node.width
                    : (note.size && note.size.width) || 200,
                height: typeof node.height === 'number'
                    ? node.height
                    : (note.size && note.size.height) || 170
            };
            this.mark(note.id || '');
        });
    }

    /**
     * Removes all mapped objects and clears the private maps.
     *
     * @returns {void} Nothing.
     * @private
     */
    public clear(): void {
        if (this.diagram) {
            this.connectionConnectors.forEach((connector: ConnectorModel) =>
                this.diagram && typeof this.diagram.remove === 'function' && this.diagram.remove(connector));
            this.stepNodes.forEach((node: NodeModel) =>
                this.diagram && typeof this.diagram.remove === 'function' && this.diagram.remove(node));
            this.stickyNoteNodes.forEach((node: NodeModel) =>
                this.diagram && typeof this.diagram.remove === 'function' && this.diagram.remove(node));
        }
        this.stepNodes.clear();
        this.nodeSteps.clear();
        this.connectionConnectors.clear();
        this.connectorConnections.clear();
        this.connectionModels.clear();
        this.stickyNoteNodes.clear();
        this.nodeStickyNotes.clear();
    }

    /**
     * Clears mappings and releases the Diagram reference.
     *
     * @returns {void} Nothing.
     * @private
     */
    public dispose(): void {
        this.clear();
        this.diagram = null;
    }

    private mark(id: string): void {
        if (this.renderTracker && id) {
            this.renderTracker(id);
        }
    }

    /**
     * Syncs live node ports to the step's desired topology using EJ2
     * removePorts + addPorts so port wrappers are created and remain visible.
     * Full replace (not diff) also redistributes Switch branch Y offsets correctly.
     *
     * @param {string} stepId - The workflow step identifier.
     * @param {NodeModel} node - The live Diagram node.
     * @returns {void} Nothing.
     */
    private syncNodePorts(stepId: string, node: NodeModel): void {
        if (!this.diagram) {
            return;
        }
        const stored: WorkflowStep = NodeMapper.getStoredStep(node);
        // Extract clean step properties: handle both direct step objects and EJ2 complex
        // lifecycle objects that wrap the actual step in a 'properties' field.
        // This ensures that imported workflows (which have complex wrapping) build ports
        // from the actual step data, not from the EJ2 metadata.
        let step: WorkflowStep;
        const storedAny: any = stored;
        if (storedAny && storedAny.properties && typeof storedAny.properties === 'object') {
            // EJ2 complex lifecycle object: extract the clean properties
            step = Object.assign({}, storedAny.properties, { id: stepId });
        } else {
            // Direct step object
            step = Object.assign({}, stored, { id: stepId });
        }
        const desired: PointPortModel[] = NodeMapper.buildPorts(step);
        const current: PointPortModel[] = (node.ports || []).slice();
        if (NodeMapper.samePortTopology(current, desired)) {
            return;
        }

        const diagramApi: Diagram & {
            removePorts?: (obj: NodeModel, ports: PointPortModel[]) => void;
            addPorts?: (obj: NodeModel, ports: PointPortModel[]) => void;
            updateDiagramObject?: (obj: NodeModel) => void;
        } = this.diagram as Diagram & {
            removePorts?: (obj: NodeModel, ports: PointPortModel[]) => void;
            addPorts?: (obj: NodeModel, ports: PointPortModel[]) => void;
            updateDiagramObject?: (obj: NodeModel) => void;
        };

        // Replace via official APIs so initPortWrapper runs (bare node.ports = is invisible).
        if (current.length && typeof diagramApi.removePorts === 'function') {
            diagramApi.removePorts(node, current);
        }
        if (desired.length && typeof diagramApi.addPorts === 'function') {
            diagramApi.addPorts(node, desired);
        } else if (desired.length) {
            node.ports = desired.slice();
        }

        // Ensure visibility/style on whatever EJ2 stored after addPorts.
        const livePorts: PointPortModel[] = node.ports || [];
        livePorts.forEach((port: PointPortModel) => {
            port.visibility = PortVisibility.Visible;
            if (typeof port.width !== 'number') {
                port.width = 10;
            }
            if (typeof port.height !== 'number') {
                port.height = 10;
            }
            if (!port.style) {
                port.style = {
                    fill: '#605e5c',
                    strokeColor: '#323130',
                    strokeWidth: 1
                };
            }
        });

        if (typeof diagramApi.updateDiagramObject === 'function') {
            diagramApi.updateDiagramObject(node);
        }
    }

    /**
     * Re-applies sourcePortID/targetPortID on connectors that touch a step after
     * port topology changes, using the stored workflow connection port names.
     * Prevents "connection to port id is missed" when Switch branches change.
     *
     * @param {string} stepId - The workflow step identifier.
     * @returns {void} Nothing.
     */
    private rebindConnectorsForNode(stepId: string): void {
        if (!this.diagram) {
            return;
        }
        this.connectionModels.forEach((connection: WorkflowConnection, connectionId: string) => {
            const touchesSource: boolean = connection.sourceStepId === stepId;
            const touchesTarget: boolean = connection.targetStepId === stepId;
            if (!touchesSource && !touchesTarget) {
                return;
            }
            const connector: ConnectorModel | null = this.resolveLiveConnector(connectionId);
            if (!connector) {
                return;
            }
            this.connectionConnectors.set(connectionId, connector);

            const sourceNode: NodeModel | null = connection.sourceStepId
                ? this.resolveLiveNode(connection.sourceStepId)
                : null;
            const targetNode: NodeModel | null = connection.targetStepId
                ? this.resolveLiveNode(connection.targetStepId)
                : null;

            if (sourceNode && connection.sourceStepId) {
                const sourcePortId: string = NodeMapper.getPortId(
                    connection.sourceStepId,
                    connection.sourcePort || 'output',
                    false
                );
                if (this.nodeHasPort(sourceNode, sourcePortId)) {
                    connector.sourcePortID = sourcePortId;
                    connector.sourceID = sourceNode.id;
                } else {
                    // Branch removed: clear invalid port id so the connector does not
                    // point at a missing port; validation can flag the connection.
                    connector.sourcePortID = '';
                }
            }

            if (targetNode && connection.targetStepId) {
                const targetPortId: string = NodeMapper.getPortId(
                    connection.targetStepId,
                    connection.targetPort || 'input',
                    true
                );
                if (this.nodeHasPort(targetNode, targetPortId)) {
                    connector.targetPortID = targetPortId;
                    connector.targetID = targetNode.id;
                } else {
                    connector.targetPortID = '';
                }
            }

            this.mark(connectionId);
        });
    }

    private nodeHasPort(node: NodeModel, portId: string): boolean {
        return Boolean(node.ports && node.ports.some((port: PointPortModel) => String(port.id || '') === portId));
    }
}
