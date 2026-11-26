import {
    ComplexHierarchicalTree,
    Connector,
    ConnectorModel,
    Diagram,
    DiagramAction,
    DiagramConstraints,
    DiagramContextMenu,
    DiagramModel,
    DiagramTools,
    AnnotationConstraints,
    ISizeChangeEventArgs,
    ISelectionChangeEventArgs,
    IHistoryChangeArgs,
    IDoubleClickEventArgs,
    IElementDrawEventArgs,
    NodeConstraints,
    Node,
    NodeModel,
    SelectorConstraints,
    SelectorModel,
    SnapConstraints,
    UndoRedo,
    UserHandleModel,
    Keys,
    KeyModifiers,
    LayerModel,
    HistoryEntry,
    ConnectorConstraints
} from '@syncfusion/ej2-diagrams';
import { L10n } from '@syncfusion/ej2-base';
import { ServiceLocator } from './service';
import { WorkflowConnection } from '../models/workflow-connection';
import { WorkflowSettingsModel } from '../models/workflow-settings-model';
import { WorkflowStep } from '../models/workflow-step';
import { WorkflowStickyNote } from '../models/workflow-sticky-note';
import { DiagramMapper } from '../mapping/diagram-mapper';
import { NodeMapper } from '../mapping/node-mapper';
import { PortResolver } from '../mapping/port-resolver';
import { ComplexHierarchicalTreeLayout } from '../layout/flowchart-layout';
import {
    CONNECTOR_HANDLE_ADD,
    CONNECTOR_HANDLE_DELETE,
    HandleActions,
    NODE_HANDLE_ADD,
    NODE_HANDLE_DELETE,
    NODE_HANDLE_EXECUTE
} from '../interactions/handle-actions';
import { localeDefaults } from '../localization/locale-defaults';

/**
 * Escapes a localized string for use inside an HTML attribute.
 *
 * @param {string} value - The text to escape.
 * @returns {string} The escaped text.
 */
function escapeAttribute(value: string): string {
    return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Icon-only button used as a Diagram user-handle template.
 * The glyph comes from the EJ2 icon font (`e-icons`), not an inline SVG.
 *
 * @param {string} iconCss - Icon class without the `e-icons` prefix.
 * @param {string} label - Accessible name; escaped before it is written into the markup.
 * @returns {string} Button markup.
 */
function userHandleButton(iconCss: string, label: string): string {
    const safeLabel: string = escapeAttribute(label || '');
    return '<button type="button" class="e-btn e-wf-user-handle" aria-label="' + safeLabel +
        '" title="' + safeLabel + '"><span class="e-btn-icon e-icons ' + escapeAttribute(iconCss) + '"></span></button>';
}

/**
 * Creates and owns the internal Diagram canvas and its model mapper.
 *
 * @private
 */
export class CanvasRenderer {
    private readonly host: HTMLElement;
    private settings: WorkflowSettingsModel;
    private enableRtl: boolean;
    private canvasElement: HTMLDivElement | null = null;
    private diagram: Diagram | null = null;
    private mapper: DiagramMapper | null = null;
    private actions: HandleActions | null = null;
    private collectionChangeCallback: (() => void) | null = null;
    private selectionChangeCallback: ((args: ISelectionChangeEventArgs) => void) | null = null;
    private stickyNoteTextChangeCallback: ((id: string, text: string) => void) | null = null;
    private stickyNoteResizeCallback: ((id: string, width: number, height: number, completed: boolean) => void) | null = null;
    private nodeDoubleClickCallback: ((item?: NodeModel | ConnectorModel) => void) | null = null;
    /**
     * Optional callback invoked after every Diagram `historyChange` event so the
     * host can refresh toolbar availability against the live undo/redo stack.
     * The callback receives the current `canUndo` / `canRedo` flags derived
     * from the active stack lengths.
     */
    private historyChangeCallback: ((
        canUndo: boolean,
        canRedo: boolean,
        action?: IHistoryChangeArgs['action']
    ) => void) | null = null;
    private readonly nodeHandleStyle: {
        size: number;
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
        pathColor: string;
    } = {
        size: 28,
        backgroundColor: 'transparent',
        borderColor: 'transparent',
        borderWidth: 0,
        pathColor: 'transparent'
    };
    private fixedNodeHandles: UserHandleModel[];
    private fixedConnectorHandles: UserHandleModel[];
    private readonly stickyLayerId: string = 'wf-sticky-notes';
    private readonly normalLayerId: string = 'wf-normal-objects';
    private l10n: L10n;

    /**
     * Creates a canvas renderer.
     *
     * @param {HTMLElement} host The component host.
     * @param {WorkflowSettingsModel} settings The public workflow settings.
     * @param {boolean} enableRtl Whether RTL is enabled.
     * @param {ServiceLocator} serviceLocator Shared service registry; resolves L10n.
     * @param {HandleActions} handleActions Optional handle action callbacks; when supplied, the
     * native Diagram user handles are bound inside `create()` so they are
     * available as soon as the Diagram is constructed.
     * @param {Function} onCollectionChange Optional callback invoked on the Diagram
     * `collectionChange` event (used by the host to reconcile the empty-canvas
     * Add control against the actual Diagram node count).
     * @param {Function} onSelectionChange Optional callback invoked on the Diagram
     * `selectionChange` event. The host uses this to bind the Property Section
     * to the selected workflow item.
     * @param {Function} onStickyNoteTextChange Optional sticky-note text callback.
     * @param {Function} onStickyNoteResize Optional sticky-note resize callback.
     * @param {Function} onNodeDoubleClick Optional callback invoked when a node is double-clicked.
     * @param {Function} onHistoryChange Optional callback invoked on the Diagram
     * @private
     */
    public constructor(
        host: HTMLElement,
        settings: WorkflowSettingsModel,
        enableRtl: boolean = false,
        serviceLocator: ServiceLocator,
        handleActions?: HandleActions,
        onCollectionChange?: () => void,
        onSelectionChange?: (args: ISelectionChangeEventArgs) => void,
        onStickyNoteTextChange?: (id: string, text: string) => void,
        onStickyNoteResize?: (id: string, width: number, height: number, completed: boolean) => void,
        onNodeDoubleClick?: (item?: NodeModel | ConnectorModel) => void,
        onHistoryChange?: (canUndo: boolean, canRedo: boolean, action?: IHistoryChangeArgs['action']) => void
    ) {
        this.host = host;
        this.settings = settings;
        this.enableRtl = enableRtl;
        this.l10n = serviceLocator.getService<L10n>('localization');
        this.actions = handleActions || null;
        this.collectionChangeCallback = onCollectionChange || null;
        this.selectionChangeCallback = onSelectionChange || null;
        this.stickyNoteTextChangeCallback = onStickyNoteTextChange || null;
        this.stickyNoteResizeCallback = onStickyNoteResize || null;
        this.nodeDoubleClickCallback = onNodeDoubleClick || null;
        this.historyChangeCallback = onHistoryChange || null;
        this.fixedNodeHandles = this.createFixedNodeHandles();
        this.fixedConnectorHandles = this.createFixedConnectorHandles();
    }

    /**
     * Creates and appends the internal Diagram.
     *
     * @param {HTMLElement} element Optional host element.
     * @returns {Diagram} The internal Diagram instance.
     * @private
     */
    public create(element?: HTMLElement): Diagram {
        if (this.diagram) {
            return this.diagram;
        }
        this.canvasElement = document.createElement('div');
        this.canvasElement.className = 'e-wf-canvas-host';
        this.canvasElement.id = element ? (element.id + '-wf-canvas') : '';
        this.host.appendChild(this.canvasElement);
        const tool: DiagramTools = this.getDiagramTool(this.settings.tool);
        const constraints: DiagramConstraints = this.settings.readOnly
            ? DiagramConstraints.Zoom | DiagramConstraints.Pan
            : DiagramConstraints.Default;
        const handles: UserHandleModel[] = this.fixedNodeHandles.slice().concat(this.fixedConnectorHandles);
        Diagram.Inject(UndoRedo, ComplexHierarchicalTree, DiagramContextMenu);
        const diagramModel: DiagramModel = {
            width: '100%',
            height: '100%',
            tool,
            constraints,
            enableRtl: this.enableRtl,
            layers: [
                { id: this.normalLayerId, zIndex: 1 },
                { id: this.stickyLayerId, zIndex: 0 }
            ] as LayerModel[],
            commandManager: {
                commands: [{
                    name: 'delete',
                    canExecute: (): boolean => this.hasSelectedItems(),
                    execute: (): void => this.deleteSelectedItems(),
                    gesture: {
                        key: Keys.Delete,
                        keyModifiers: KeyModifiers.None
                    }
                }, {
                    name: 'blockCopy',
                    canExecute: (): boolean => true,
                    execute: (): void => { /* Copy is intentionally disabled. */ },
                    gesture: { key: Keys.C, keyModifiers: KeyModifiers.Control }
                }, {
                    name: 'blockPaste',
                    canExecute: (): boolean => true,
                    execute: (): void => { /* Paste is intentionally disabled. */ },
                    gesture: { key: Keys.V, keyModifiers: KeyModifiers.Control }
                }, {
                    name: 'blockCut',
                    canExecute: (): boolean => true,
                    execute: (): void => { /* Cut is intentionally disabled. */ },
                    gesture: { key: Keys.X, keyModifiers: KeyModifiers.Control }
                }, {
                    name: 'blockDuplicate',
                    canExecute: (): boolean => true,
                    execute: (): void => { /* Duplicate is intentionally disabled. */ },
                    gesture: { key: Keys.D, keyModifiers: KeyModifiers.Control }
                }]
            },
            getNodeDefaults: (node: NodeModel): void => {
                const isStickyNote: boolean = Boolean(
                    node.addInfo && typeof node.addInfo === 'object'
                    && (node.addInfo as { workflowStickyNote?: WorkflowStickyNote }).workflowStickyNote
                );
                if (!node.annotations || node.annotations.length === 0) {
                    node.annotations = [{ content: '', constraints: AnnotationConstraints.ReadOnly }];
                }
                node.constraints = (NodeConstraints.Default
                    | (isStickyNote ? 0 : NodeConstraints.HideThumbs))
                    & ~(isStickyNote ? NodeConstraints.Rotate : NodeConstraints.Resize | NodeConstraints.Rotate)
                    & ~ (NodeConstraints.InConnect | NodeConstraints.OutConnect);
                (node.annotations || []).forEach((annotation: any): void => {
                    annotation.constraints = AnnotationConstraints.ReadOnly;
                });
            },
            getConnectorDefaults: (connector: ConnectorModel): void => {
                if (!connector.annotations || connector.annotations.length === 0) {
                    connector.annotations = [{ content: '', constraints: AnnotationConstraints.ReadOnly }];
                }
                (connector.annotations || []).forEach((annotation: any): void => {
                    annotation.offset = 0.5;
                    annotation.constraints = AnnotationConstraints.ReadOnly;
                    annotation.style = Object.assign({}, annotation.style || {}, {
                        fill: '#ffffff',
                        fontSize: 12
                    });
                });
                // Connector stroke width matches the node stroke (--wf-node-stroke-width)
                // so the visual weight is consistent between cards and the lines that
                // connect them. Stroke color matches the user-handle chip palette
                // (--wf-color-border → --wf-handle-fill) for a neutral canvas look.
                if (!connector.style) {
                    connector.style = {};
                }
                connector.style.strokeColor = connector.style.strokeColor || '#64748b';
                connector.style.strokeWidth = connector.style.strokeWidth || 2;
                const lineColor: string = connector.style.strokeColor;
                connector.sourceDecorator = Object.assign({}, connector.sourceDecorator || {}, {
                    style: Object.assign({}, connector.sourceDecorator && connector.sourceDecorator.style || {}, {
                        fill: lineColor, strokeColor: lineColor
                    })
                });
                connector.targetDecorator = Object.assign({}, connector.targetDecorator || {}, {
                    style: Object.assign({}, connector.targetDecorator && connector.targetDecorator.style || {}, {
                        fill: lineColor, strokeColor: lineColor
                    })
                });
                connector.cornerRadius = 5;
            },
            selectedItems: {
                constraints: SelectorConstraints.All | SelectorConstraints.UserHandle,
                userHandles: handles
            },
            scrollSettings: {
                scrollLimit: 'Infinity',
                minZoom: this.settings.minZoom === null ? undefined : this.settings.minZoom,
                maxZoom: this.settings.maxZoom === null ? undefined : this.settings.maxZoom
            },
            snapSettings: {
                constraints: this.settings.showGridLines === false ? SnapConstraints.None : SnapConstraints.ShowLines,
                gridType: 'Dots', horizontalGridlines: { lineColor: '#bbbaba' }, verticalGridlines: { lineColor: '#bbbaba' }
            },
            layout: { type: 'ComplexHierarchicalTree', orientation: 'LeftToRight', horizontalSpacing: 130, verticalSpacing: 10 }
        };
        this.diagram = new Diagram(diagramModel);
        this.diagram.appendTo(this.canvasElement);
        if (this.diagram.historyManager) {
            this.diagram.historyManager.canLog = function (entry: HistoryEntry): HistoryEntry {
                if (entry.type === 'PropertyChanged') {
                    entry.cancel = true;
                }
                return entry;
            };
        }
        this.canvasElement.addEventListener('change', this.onUserHandleTemplateChange);
        this.canvasElement.addEventListener('dblclick', this.onStickyNoteDoubleClick);
        this.mapper = new DiagramMapper(this.diagram);
        // Route native user-handle clicks through the registered actions,
        // surface collection changes so the host can reconcile the empty-canvas
        // Add control against the actual Diagram node count, and surface
        // selection changes so the host can bind the Property Section.
        this.diagram.onUserHandleMouseDown = (args: { element: { name: string } }) => this.onHandleMouseDown(args);
        this.diagram.collectionChange = () => {
            // EJ2 emits collection changes while replaying an undo/redo entry.
            // Refreshing selection handles here calls dataBind(), which records
            // that replay as a new history entry and leaves Undo enabled forever.
            if (this.diagram && (this.diagram.diagramActions & DiagramAction.UndoRedo)) {
                return;
            }
            this.onDiagramCollectionChange();

            if (this.collectionChangeCallback) {
                this.collectionChangeCallback();
            }
        };
        const diagram: Diagram = this.diagram;
        diagram.elementDraw = (args: IElementDrawEventArgs) => {
            // Apply dotted style while drawing incomplete connector
            if (args && args.objectType === 'Connector' && args.state !== 'Completed') {
                const connector: ConnectorModel = args.source as ConnectorModel;
                if (connector && connector.style) {
                    connector.style.strokeDashArray = '5 3';
                }
            }
            // Handle completion - remove if disconnected, finalize if connected
            this.removeDisconnectedDrawnConnector(args, diagram);
        };
        this.diagram.selectionChange = (args: ISelectionChangeEventArgs) => {
            this.onDiagramSelectionChange();
            if (this.selectionChangeCallback) {
                this.selectionChangeCallback(args);
            }
        };
        this.diagram.doubleClick = (args: IDoubleClickEventArgs) => {
            const source: SelectorModel | Node | Connector | Diagram = args.source as
                SelectorModel | Node | Connector | Diagram;
            if (source === this.diagram) {
                return;
            }
            const selector: SelectorModel = source as SelectorModel;
            const directItem: NodeModel | ConnectorModel = source as NodeModel | ConnectorModel;
            const item: NodeModel | ConnectorModel | undefined = directItem && directItem.id
                ? directItem
                : source instanceof Connector
                    ? source
                    : source instanceof Node
                        ? source
                        : selector.connectors && selector.connectors.length
                            ? selector.connectors[0]
                            : selector.nodes && selector.nodes.length
                                ? selector.nodes[0]
                                : undefined;
            const stickyNote: WorkflowStickyNote | null = item
                && item.addInfo && typeof item.addInfo === 'object'
                && (item.addInfo as { workflowStickyNote?: WorkflowStickyNote }).workflowStickyNote
                ? (item.addInfo as { workflowStickyNote: WorkflowStickyNote }).workflowStickyNote
                : null;
            if (stickyNote && this.mapper) {
                const stickyNoteId: string = String(stickyNote.id || (item && item.id) || '');
                this.mapper.beginStickyNoteEdit(stickyNoteId, (text: string): void => {
                    if (this.stickyNoteTextChangeCallback) {
                        this.stickyNoteTextChangeCallback(stickyNoteId, text);
                    }
                });
                return;
            }
            if (item && this.nodeDoubleClickCallback) {
                this.nodeDoubleClickCallback(item);
            }
        };
        this.diagram.sizeChange = (args: ISizeChangeEventArgs) => this.onDiagramSizeChange(args);
        // Mirror your attached sample: every Diagram history mutation re-evaluates
        // undo/redo availability against the live stack lengths. The host-level
        // callback toggles the toolbar buttons accordingly.
        this.diagram.historyChange = (args: IHistoryChangeArgs) => this.onDiagramHistoryChange(args);
        return this.diagram;
    }

    /**
     * Reads the active Diagram undo/redo stacks and forwards their lengths to
     * the host callback. Invoked on every Diagram `historyChange` event.
     *
     * @param {IHistoryChangeArgs} args The Diagram history event details.
     * @returns {void} Nothing.
     */
    private onDiagramHistoryChange(args: IHistoryChangeArgs): void {
        if (!this.historyChangeCallback || !this.diagram) {
            return;
        }
        const history: { undoStack?: unknown[]; redoStack?: unknown[] } | undefined =
            this.diagram.historyManager;
        const canUndo: boolean = Boolean(history) && (history!.undoStack || []).length > 0;
        const canRedo: boolean = Boolean(history) && (history!.redoStack || []).length > 0;
        this.historyChangeCallback(canUndo, canRedo, args.action);
    }

    /** Rebuilds the internal Diagram from the public workflow collections.
     *
     * The full-mapping order is sticky notes first, then executable workflow
     * steps, then workflow connections. This order ensures
     * executable workflow nodes render above an overlapping sticky note.
     * Only initial construction and workflow import rebuild the whole Diagram.
     *
     * @param {WorkflowStep[]} steps Workflow steps to render.
     * @param {WorkflowConnection[]} connections Connections to render.
     * @param {WorkflowStickyNote[]} stickyNotes Sticky notes to render.
     * @returns {void}
     * @private
     */
    public renderAll(
        steps: WorkflowStep[],
        connections: WorkflowConnection[],
        stickyNotes: WorkflowStickyNote[]
    ): void {
        const diagram: Diagram = this.create();
        const mapper: DiagramMapper = this.mapper!;
        const previousActions: DiagramAction = diagram.diagramActions;
        diagram.diagramActions = previousActions | DiagramAction.PreventHistory;
        try {
            mapper.clear();
            stickyNotes.forEach((note: WorkflowStickyNote) => mapper.addStickyNote(note));
            steps.forEach((step: WorkflowStep) => mapper.addNode(step));
            connections.forEach((connection: WorkflowConnection) => mapper.addConnector(connection));
            diagram.dataBind();
            mapper.restoreStickyNoteGeometry(stickyNotes);
        } finally {
            diagram.diagramActions = previousActions;
        }
    }

    /**
     * Returns the internal Diagram instance, when created.
     *
     * @returns {Diagram|null} The internal Diagram instance.
     * @private
     */
    public getDiagram(): Diagram | null {
        return this.diagram;
    }

    /**
     * Returns the internal mapper, when created.
     *
     * @returns {DiagramMapper|null} The internal mapper.
     * @private
     */
    public getMapper(): DiagramMapper | null {
        return this.mapper;
    }

    /**
     * Starts one Diagram history group for a composite workflow insertion.
     *
     * @returns {void} Nothing.
     * @private
     */
    public startGroupAction(): void {
        if (this.diagram) {
            this.diagram.startGroupAction();
        }
    }

    /**
     * Ends the active Diagram history group for a composite workflow insertion.
     *
     * @returns {void} Nothing.
     * @private
     */
    public endGroupAction(): void {
        if (this.diagram) {
            this.diagram.endGroupAction();
        }
    }

    /**
     * Selects a mapped workflow step in the internal Diagram.
     *
     * @param {string} stepId The workflow step ID.
     * @returns {void}
     * @private
     */
    public selectStep(stepId: string): void {
        if (!this.diagram || !this.mapper) {
            return;
        }
        const node: NodeModel | null = this.mapper.getNodeForStep(stepId);
        if (node) {
            this.diagram.select([node]);
        }
    }

    /**
     * Finds the canvas element for a step, sticky note or connection.
     *
     * @param {string} id - The item ID.
     * @returns {NodeModel | ConnectorModel | null} The element, or `null`.
     * @private
     */
    public getElementForItem(id: string): NodeModel | ConnectorModel | null {
        if (!this.mapper || !id) {
            return null;
        }
        return this.mapper.getNodeForStep(id) || this.mapper.getNodeForStickyNote(id)
            || this.mapper.getConnectorForConnection(id);
    }

    /**
     * Selects a step, sticky note or connection on the canvas.
     *
     * @param {string} id - The item ID.
     * @returns {boolean} `true` when the item was found.
     * @private
     */
    public selectItem(id: string): boolean {
        const element: NodeModel | ConnectorModel | null = this.getElementForItem(id);
        if (!this.diagram || !element) {
            return false;
        }
        this.diagram.select([element]);
        return true;
    }

    /**
     * Scrolls the canvas so an item is visible.
     *
     * @param {string} id - The item ID.
     * @returns {boolean} `true` when the item was found.
     * @private
     */
    public bringIntoView(id: string): boolean {
        const element: NodeModel | ConnectorModel | null = this.getElementForItem(id);
        const bounds: object | undefined = element && (element as { wrapper?: { bounds?: object } }).wrapper
            ? (element as { wrapper: { bounds?: object } }).wrapper.bounds : undefined;
        if (!this.diagram || !bounds) {
            return false;
        }
        (this.diagram as unknown as { bringIntoView: (rect: object) => void }).bringIntoView(bounds);
        return true;
    }

    /**
     * Fits the whole workflow in the canvas.
     *
     * @returns {void}
     * @private
     */
    public fitToPage(): void {
        if (this.diagram) {
            this.diagram.fitToPage();
        }
    }

    /**
     * Sets the zoom level, where `1` is 100%.
     *
     * @param {number} zoom - The zoom level.
     * @returns {void}
     * @private
     */
    public setZoom(zoom: number): void {
        if (!this.diagram || !(zoom > 0) || !isFinite(zoom)) {
            return;
        }
        const current: number = this.getZoom();
        if (Math.abs(zoom - current) < 1e-6) {
            return;
        }
        // Diagram.zoomTo scales by (1 + zoomFactor) to zoom in and by 1 / (1 + zoomFactor) to zoom out.
        this.diagram.zoomTo(zoom > current
            ? { type: 'ZoomIn', zoomFactor: zoom / current - 1 }
            : { type: 'ZoomOut', zoomFactor: current / zoom - 1 });
    }

    /**
     * The current zoom level, where `1` is 100%.
     *
     * @returns {number} The zoom level.
     * @private
     */
    public getZoom(): number {
        const settings: { currentZoom?: number } | undefined = this.diagram
            ? (this.diagram as unknown as { scrollSettings?: { currentZoom?: number } }).scrollSettings : undefined;
        return settings && settings.currentZoom ? settings.currentZoom : 1;
    }

    /**
     * Clears the current selection on the canvas.
     *
     * @returns {void}
     * @private
     */
    public clearSelection(): void {
        if (!this.diagram) {
            return;
        }
        this.diagram.clearSelection();
    }

    /**
     * Runs automatic flowchart layout and synchronizes public positions.
     *
     * @param {WorkflowStep[]} steps Workflow steps to lay out.
     * @param {Function} notify Optional layout completion callback.
     * @returns {boolean} Whether layout ran successfully.
     * @private
     */
    public runLayout(steps: WorkflowStep[], notify?: () => void): boolean {
        if (!this.diagram || !this.mapper) {
            return false;
        }
        return new ComplexHierarchicalTreeLayout(this.diagram, this.mapper).run(steps, this.settings, notify);
    }

    /**
     * Disposes the Diagram and removes the component-owned canvas.
     *
     * @returns {void}
     * @private
     */
    public destroy(): void {
        if (this.mapper) {
            this.mapper.dispose();
            this.mapper = null;
        }
        if (this.diagram) {
            this.diagram.destroy();
            this.diagram = null;
        }
        if (this.canvasElement) {
            this.canvasElement.removeEventListener('change', this.onUserHandleTemplateChange);
            this.canvasElement.removeEventListener('dblclick', this.onStickyNoteDoubleClick);
            this.canvasElement.remove();
            this.canvasElement = null;
        }
        this.actions = null;
    }

    /**
     * Applies changed canvas settings (tool, zoom limits, grid lines, read-only) and the
     * right-to-left flag to the live Diagram without rebuilding it.
     *
     * @param {WorkflowSettingsModel} settings - The current canvas settings.
     * @param {boolean} enableRtl - Whether right-to-left rendering is enabled.
     * @returns {void}
     * @private
     */
    public applySettings(settings: WorkflowSettingsModel, enableRtl: boolean): void {
        this.settings = {
            tool: settings && settings.tool !== undefined ? settings.tool : this.settings.tool,
            minZoom: settings && settings.minZoom !== undefined ? settings.minZoom : this.settings.minZoom,
            maxZoom: settings && settings.maxZoom !== undefined ? settings.maxZoom : this.settings.maxZoom,
            showGridLines: settings && settings.showGridLines !== undefined ? settings.showGridLines : this.settings.showGridLines,
            readOnly: settings && settings.readOnly !== undefined ? settings.readOnly : this.settings.readOnly
        };

        this.enableRtl = enableRtl;
        this.fixedNodeHandles = this.createFixedNodeHandles();
        this.fixedConnectorHandles = this.createFixedConnectorHandles();
        if (!this.diagram) {
            return;
        }
        this.diagram.clearSelection();
        this.diagram.tool = this.getDiagramTool(this.settings.tool);
        this.diagram.constraints = this.settings.readOnly
            ? DiagramConstraints.Zoom | DiagramConstraints.Pan
            : DiagramConstraints.Default;
        this.diagram.scrollSettings.minZoom = this.settings.minZoom === null ? undefined : this.settings.minZoom;
        this.diagram.scrollSettings.maxZoom = this.settings.maxZoom === null ? undefined : this.settings.maxZoom;
        const gridConstraints: SnapConstraints = this.settings.showGridLines === false ? SnapConstraints.None : SnapConstraints.ShowLines;
        this.diagram.snapSettings.constraints = SnapConstraints.None;
        this.diagram.enableRtl = enableRtl;
        this.diagram.dataBind();
        this.diagram.snapSettings.constraints = gridConstraints;
        this.diagram.dataBind();
    }

    private getDiagramTool(tool: WorkflowSettingsModel['tool']): DiagramTools {
        switch (tool) {
        case 'MultiSelection':
            return DiagramTools.MultipleSelect;
        case 'ZoomPan':
            return DiagramTools.ZoomPan;
        default:
            return DiagramTools.SingleSelect;
        }
    }

    /** Dispatches a native user-handle mouse-down to the matching action.
     * The Diagram passes the selected element via `args.element`; we resolve
     * it back to the public workflow step/connection through the mapper.
     *
     * @param {Object} args The selected Diagram element.
     * @returns {void}
     */
    private onHandleMouseDown(args: { element: { name: string } }): void {
        if (!this.actions || !this.diagram || !this.mapper) {
            return;
        }
        const name: string = (args.element && args.element.name) || '';
        if (!this.diagram.selectedItems) {
            return;
        }
        switch (name) {
        case CONNECTOR_HANDLE_ADD:
        case CONNECTOR_HANDLE_DELETE: {
            const connection: WorkflowConnection | null = this.mapper.getConnectionForConnector(
                this.resolveSelectedId(true)
            );
            if (connection) {
                if (name === CONNECTOR_HANDLE_ADD) {
                    this.actions.addFromConnector(connection);
                } else {
                    this.actions.deleteItem(connection.id || '');
                }
            }
            break;
        }
        default: {
            const stickyNote: WorkflowStickyNote | null = this.resolveSelectedStickyNote();
            if (stickyNote && name === NODE_HANDLE_DELETE) {
                this.actions.deleteItem(stickyNote.id || '');
                return;
            }
            const step: WorkflowStep | null = this.resolveSelectedStep();
            if (step) {
                if (name === NODE_HANDLE_DELETE) {
                    this.actions.deleteItem(step.id || '');
                } else if (name === NODE_HANDLE_EXECUTE) {
                    this.actions.executeStep(step);
                } else if (this.isOutputPortHandle(name)) {
                    this.actions.addFromNode(step, this.resolveHandlePort(name));
                }
                return;
            }
            // Fallback: if a connector is selected and Delete was clicked (e.g.
            // legacy node handle still visible), delete the connection.
            if (name === NODE_HANDLE_DELETE) {
                const connection: WorkflowConnection | null = this.mapper.getConnectionForConnector(
                    this.resolveSelectedId(true)
                );
                if (connection) {
                    this.actions.deleteItem(connection.id || '');
                }
            }
        }
        }
    }

    /**
     * Returns whether the Diagram has a mapped item selected for deletion.
     *
     * @returns {boolean} Whether a mapped item is selected.
     */
    private hasSelectedItems(): boolean {
        if (!this.diagram || !this.mapper || !this.diagram.selectedItems) {
            return false;
        }
        return (this.diagram.selectedItems.nodes || []).some((node: NodeModel): boolean =>
            !!this.mapper!.getStepIdForNode(node.id || '') ||
            !!this.mapper!.getStickyNoteIdForNode(node.id || '')
        ) || (this.diagram.selectedItems.connectors || []).some((connector: ConnectorModel): boolean =>
            !!this.mapper!.getConnectionIdForConnector(connector.id || '')
        );
    }

    /**
     * Resolve a localised string from the active L10n bundle, with a
     * fallback to the bundled English string. Mirrors the helper used by
     * the other rendering submodules so a runtime locale change can be
     * applied via `setLocale()`.
     *
     * @param {string} key The key.
     * @param {string[]} [args] The args.
     * @returns {string} The resolved string.
     * @private
     */
    private resolveCaption(key: string, args?: string[]): string {
        let value: string = key;
        if (this.l10n) {
            const localised: string = this.l10n.getConstant(key);
            if (localised) {
                value = localised;
            }
        }
        if (value === key && localeDefaults[`${key}`]) {
            value = localeDefaults[`${key}`];
        }
        if (args && args.length) {
            return CANVAS_RENDERER_FORMAT(value, args);
        }
        return value;
    }

    /**
     * Update the L10n bundle at runtime. The fixed node / connector
     * handles are not auto-rebuilt here; the host triggers a fresh
     * selection cycle after `setLocale()` so the new strings take effect
     * the next time the user selects an item.
     *
     * @param {L10n} [l10n] The optional L10n instance to use.
     * @returns {void} Nothing.
     * @private
     */
    public setLocale(l10n?: L10n): void {
        if (l10n) {
            this.l10n = l10n;
        }
    }

    /**
     * Routes Diagram keyboard deletion through the public workflow mutation boundary.
     *
     * @returns {void}
     */
    private deleteSelectedItems(): void {
        if (!this.diagram || !this.mapper || !this.actions || !this.diagram.selectedItems) {
            return;
        }
        const ids: string[] = [];
        const addId: (id: string | null) => void = (id: string | null): void => {
            if (id && ids.indexOf(id) === -1) {
                ids.push(id);
            }
        };
        (this.diagram.selectedItems.nodes || []).forEach((node: NodeModel): void => {
            addId(this.mapper!.getStepIdForNode(node.id || ''));
            addId(this.mapper!.getStickyNoteIdForNode(node.id || ''));
        });
        (this.diagram.selectedItems.connectors || []).forEach((connector: ConnectorModel): void => {
            addId(this.mapper!.getConnectionIdForConnector(connector.id || ''));
        });
        ids.forEach((id: string): void => this.actions!.deleteItem(id));
    }

    /**
     * Returns the selected node's public workflow step, or null.
     *
     * @returns {WorkflowStep|null} The selected workflow step.
     */
    private resolveSelectedStep(): WorkflowStep | null {
        const diagram: Diagram | null = this.diagram;
        const mapper: DiagramMapper | null = this.mapper;
        if (!diagram || !mapper) {
            return null;
        }
        const nodes: NodeModel[] = (diagram as Diagram & { selectedItems?: { nodes?: NodeModel[] } })
            .selectedItems && (diagram as Diagram & { selectedItems?: { nodes?: NodeModel[] } }).selectedItems.nodes
            ? (diagram as Diagram & { selectedItems?: { nodes?: NodeModel[] } }).selectedItems.nodes as NodeModel[]
            : [];
        const node: NodeModel | undefined = nodes[0];
        if (!node) {
            return null;
        }
        const stepId: string | null = mapper.getStepIdForNode(node.id || '');
        if (!stepId) {
            return null;
        }
        const stored: { stepType?: string } | unknown = node.addInfo;
        return stored && typeof stored === 'object' && (stored as { workflowStep?: WorkflowStep }).workflowStep
            ? (stored as { workflowStep: WorkflowStep }).workflowStep
            : null;
    }

    /** Returns the id of the selected node or connector (the first selected
     * element). When `connector` is true, returns the selected connector id.
     *
     * @param {boolean} connector Whether to resolve a connector.
     * @returns {string} The selected item ID.
     */
    private resolveSelectedId(connector: boolean): string {
        const diagram: Diagram | null = this.diagram;
        if (!diagram) {
            return '';
        }
        const sel: { nodes?: NodeModel[]; connectors?: unknown[] } | undefined =
            (diagram as Diagram & { selectedItems?: { nodes?: NodeModel[]; connectors?: unknown[] } }).selectedItems;
        if (!sel) {
            return '';
        }
        if (connector) {
            const connectors: unknown[] = sel.connectors || [];
            const c: { id?: string } | undefined = connectors[0] as { id?: string } | undefined;
            return c ? c.id || '' : '';
        }
        const nodes: NodeModel[] = sel.nodes as NodeModel[] || [];
        return nodes[0] ? nodes[0].id || '' : '';
    }

    /** Returns the output port associated with a clicked Add handle name.
     * The handle name format is `wfAdd` (single port) or `wfAdd:<port>`
     * (one handle per output port). The port id is appended after the
     * `NODE_HANDLE_ADD` prefix when the selected step exposes multiple
     * output ports (e.g. Condition's `true` / `false`, Switch branches).
     *
     * @param {string} handleName The clicked handle name.
     * @returns {string} The output port name.
     */
    private resolveHandlePort(handleName: string): string {
        const encodedPrefix: string = NODE_HANDLE_ADD + '-port-';
        if (handleName.indexOf(encodedPrefix) === 0) {
            const encodedPort: string = handleName.substring(encodedPrefix.length);
            if (!encodedPort) {
                return 'output';
            }
            const codeUnits: string[] = encodedPort.split('_');
            if (codeUnits.some((codeUnit: string): boolean => !/^[0-9a-f]+$/i.test(codeUnit))) {
                return 'output';
            }
            return codeUnits.map((codeUnit: string): string =>
                String.fromCharCode(parseInt(codeUnit, 16))
            ).join('') || 'output';
        }
        const prefix: string = NODE_HANDLE_ADD + ':';
        if (handleName.indexOf(prefix) === 0) {
            return handleName.substring(prefix.length) || 'output';
        }
        return 'output';
    }

    /**
     * Returns whether a handle name represents an output-port Add action.
     * The encoded form is used by EJ2 HTML templates because the raw colon
     * form is interpreted as an invalid CSS selector by the renderer.
     *
     * @param {string} handleName The Diagram user-handle name.
     * @returns {boolean} Whether the name identifies an output-port handle.
     */
    private isOutputPortHandle(handleName: string): boolean {
        return handleName === NODE_HANDLE_ADD
            || handleName.indexOf(NODE_HANDLE_ADD + ':') === 0
            || handleName.indexOf(NODE_HANDLE_ADD + '-port-') === 0;
    }

    /**
     * Creates a CSS-selector-safe name for an output-port handle.
     *
     * @param {string} portName The public workflow port name.
     * @returns {string} The internal Diagram handle name.
     */
    private createOutputPortHandleName(portName: string): string {
        const source: string = portName || 'output';
        const codeUnits: string[] = [];
        for (let index: number = 0; index < source.length; index++) {
            codeUnits.push(source.charCodeAt(index).toString(16));
        }
        return NODE_HANDLE_ADD + '-port-' + codeUnits.join('_');
    }

    /**
     * Creates the handles that are available for every editable workflow node.
     *
     * @returns {UserHandleModel[]} The node handles.
     */
    private createFixedNodeHandles(): UserHandleModel[] {
        const deleteLabel: string = this.resolveCaption('deleteStep');
        const executeAriaLabel: string = this.resolveCaption('executeStep');
        const executeTooltip: string = this.resolveCaption('executeHandleTooltip');
        const handles: UserHandleModel[] = [
            {
                ...this.nodeHandleStyle,
                name: NODE_HANDLE_DELETE,
                side: 'Top',
                offset: 0.5,
                horizontalAlignment: 'Right',
                verticalAlignment: 'Center',
                // Node-only: without this flag the trash handle appears on
                // connectors and NODE_HANDLE_DELETE no-ops (no selected step).
                disableConnectors: true,
                margin: {
                    top: 8,
                    right: 5,
                    bottom: 0,
                    left: 0
                },
                template: userHandleButton('e-trash', deleteLabel) as any,
                tooltip: { content: deleteLabel }
            }
        ];
        if (!this.settings.readOnly) {
            handles.push({
                ...this.nodeHandleStyle,
                name: NODE_HANDLE_EXECUTE,
                side: 'Top',
                offset: 0.5,
                horizontalAlignment: 'Left',
                verticalAlignment: 'Center',
                margin: {
                    top: 8,
                    right: 0,
                    bottom: 0,
                    left: 5
                },
                disableConnectors: true,
                template: userHandleButton('e-play', executeAriaLabel) as any,
                tooltip: { content: executeTooltip }
            });
        }
        return handles;
    }

    /**
     * Creates handles shown when a connector is selected.
     * Only Delete is exposed; insert-on-connector is not offered as a user handle.
     *
     * @returns {UserHandleModel[]} The connector handles.
     */
    private createFixedConnectorHandles(): UserHandleModel[] {
        if (this.settings.readOnly) {
            return [];
        }
        const insertAriaLabel: string = this.resolveCaption('insertStepOnConnection');
        const insertTooltip: string = this.resolveCaption('insertStepHandleTooltip');
        const deleteConnectionLabel: string = this.resolveCaption('deleteConnection');
        return [
            {
                ...this.nodeHandleStyle,
                name: CONNECTOR_HANDLE_ADD,
                side: 'Top',
                offset: 0.5,
                horizontalAlignment: 'Center',
                verticalAlignment: 'Top',
                disableNodes: true,
                margin: {bottom: 7},
                template: userHandleButton('e-plus', insertAriaLabel) as any,
                tooltip: { content: insertTooltip }
            },
            {
                ...this.nodeHandleStyle,
                name: CONNECTOR_HANDLE_DELETE,
                side: 'Bottom',
                offset: 0.5,
                horizontalAlignment: 'Center',
                verticalAlignment: 'Bottom',
                disableNodes: true,
                margin: {top: 7},
                template: userHandleButton('e-trash', deleteConnectionLabel) as any,
                tooltip: { content: deleteConnectionLabel }
            }
        ];
    }

    /**
     * Handles Diagram collection changes.
     *
     * @returns {void}
     */
    private onDiagramCollectionChange(): void {
        if (!this.diagram) {
            return;
        }

        this.onDiagramSelectionChange();
    }

    /**
     * Removes a manually drawn connector when its draw ends without a target.
     * Also applies disconnected style during draw and finalizes when connected.
     *
     * @param {IElementDrawEventArgs} args Diagram draw event arguments.
     * @param {Diagram} diagram The internal Diagram instance.
     * @returns {void}
     */
    private removeDisconnectedDrawnConnector(
        args: IElementDrawEventArgs,
        diagram: Diagram
    ): void {
        if (!args || args.objectType !== 'Connector' || args.state !== 'Completed') {
            return;
        }
        const connector: ConnectorModel = args.source as ConnectorModel;
        const connectorId: string = String(connector && connector.id || '');
        if (!connector || !connectorId) {
            return;
        }
        setTimeout(() => {
            const live: ConnectorModel = diagram.connectors
                ? diagram.connectors.find((item: ConnectorModel): boolean =>
                    String(item.id || '') === connectorId)
                : null;

            if (live) {
                // Check if connector is disconnected
                const isDisconnected: boolean = !live.sourceID || live.sourceID.toString().trim() === '' ||
                                      !live.targetID || live.targetID.toString().trim() === '';

                if (isDisconnected) {
                    // Remove disconnected connector
                    diagram.remove(live);
                } else {
                    // Connector is fully connected - apply finalized style and constraints
                    // Remove dotted line style
                    if (live.style) {
                        live.style.strokeDashArray = '';
                    }
                    // Add constraints to prevent disconnection of source/target ends
                    live.constraints =
                        (ConnectorConstraints.Default | ConnectorConstraints.ReadOnly) &
                        ~ConnectorConstraints.DragSourceEnd &
                        ~ConnectorConstraints.DragTargetEnd &
                        ~ConnectorConstraints.Drag;
                    diagram.dataBind();
                }
            }
        }, 0);
    }

    /**
     * Rebuilds selection userHandles (including per-output Add) after port
     * topology or Switch branch layout changes without a selectionChange event.
     *
     * @returns {void}
     * @private
     */
    public refreshSelectionHandles(): void {
        if (!this.diagram) {
            return;
        }
        this.onDiagramSelectionChange();
        this.diagram.dataBind();
    }

    /**
     * Synchronizes selector handles with the current selection.
     * Node selection gets node + port Add handles; connector selection gets
     * connector Delete/Add. A fresh collection is assigned each time so stale
     * port handles cannot leak from the previously selected node.
     *
     * @returns {void}
     */
    private onDiagramSelectionChange(): void {
        if (!this.diagram) {
            return;
        }

        this.updateSelectionVisualState();

        const selectedStickyNote: WorkflowStickyNote | null = this.resolveSelectedStickyNote();
        const handles: UserHandleModel[] = selectedStickyNote
            ? this.createStickyNoteHandles(selectedStickyNote)
            : this.fixedNodeHandles.slice().concat(this.fixedConnectorHandles);

        if (!this.settings.readOnly && !selectedStickyNote) {
            const step: WorkflowStep | null =
                this.resolveSelectedStep();

            if (step) {
                handles.push(
                    ...this.createOutputPortHandles(step)
                );
            }
        }

        this.diagram.selectedItems.userHandles =
            handles;
        this.diagram.dataBind();
        this.updateNodeTemplateSelection();
    }

    /**
     * Toggles `e-wf-step-card-selected` on every rendered step card so that
     * exactly the selected steps carry it. Cards are found by
     * `data-wf-step-id`, so the class is restored after a card is repainted.
     *
     * @returns {void}
     */
    private updateNodeTemplateSelection(): void {
        if (!this.canvasElement) {
            return;
        }
        const selectedIds: Set<string> = new Set<string>();
        const selectedNodes: NodeModel[] = this.diagram && this.diagram.selectedItems
            ? this.diagram.selectedItems.nodes || []
            : [];
        selectedNodes.forEach((node: NodeModel): void => {
            if (node.id) {
                selectedIds.add(String(node.id));
            }
        });
        const cards: NodeListOf<HTMLElement> =
            this.canvasElement.querySelectorAll<HTMLElement>('.e-wf-step-card[data-wf-step-id]');
        for (let index: number = 0; index < cards.length; index++) {
            const card: HTMLElement = cards[parseInt(index.toString(), 10)];
            card.classList.toggle(
                'e-wf-step-card-selected',
                selectedIds.has(card.getAttribute('data-wf-step-id') || '')
            );
        }
    }

    /**
     * Repaints the selector palette after a runtime node state changes.
     *
     * @returns {void}
     * @private
     */
    public refreshSelectionVisualState(): void {
        this.updateSelectionVisualState();
        this.updateNodeTemplateSelection();
    }

    /**
     * Applies a status-aware selection palette to the Diagram selector.
     *
     * @returns {void}
     */
    private updateSelectionVisualState(): void {
        const root: Element | null = this.host.closest('.e-workflow-designer');
        if (!root || !this.diagram || !this.diagram.selectedItems) {
            return;
        }
        root.classList.remove(
            'e-wf-selection-state-running',
            'e-wf-selection-state-completed',
            'e-wf-selection-state-failed',
            'e-wf-selection-state-sticky-note'
        );
        const selectedNode: NodeModel | undefined = (this.diagram.selectedItems.nodes || [])[0];
        if (!selectedNode || !selectedNode.addInfo || typeof selectedNode.addInfo !== 'object') {
            return;
        }
        const addInfo: { workflowStickyNote?: WorkflowStickyNote; visualState?: unknown } =
            selectedNode.addInfo as { workflowStickyNote?: WorkflowStickyNote; visualState?: unknown };
        if (addInfo.workflowStickyNote) {
            root.classList.add('e-wf-selection-state-sticky-note');
            return;
        }
        const state: unknown = addInfo.visualState;
        if (state === 'running' || state === 'completed' || state === 'failed') {
            root.classList.add('e-wf-selection-state-' + state);
        }
    }

    /**
     * Synchronizes sticky-note size changes with the public model.
     *
     * @param {ISizeChangeEventArgs} args Diagram size-change event arguments.
     * @returns {void}
     */
    private onDiagramSizeChange(args: ISizeChangeEventArgs): void {
        const node: NodeModel | undefined = args && args.newValue && args.newValue.nodes
            ? args.newValue.nodes[0]
            : undefined;
        if (!node || !node.id || !this.mapper) {
            return;
        }
        const noteId: string | null = this.mapper.getStickyNoteIdForNode(String(node.id));
        if (!noteId || typeof node.width !== 'number' || typeof node.height !== 'number') {
            return;
        }
        this.mapper.updateStickyNoteSize(noteId, node.width, node.height);
        if (this.stickyNoteResizeCallback) {
            this.stickyNoteResizeCallback(
                noteId,
                node.width,
                node.height,
                String(args.state) === 'Completed'
            );
        }
    }

    /**
     * Returns the selected sticky note, when one is selected.
     *
     * @returns {WorkflowStickyNote|null} The selected sticky note.
     */
    private resolveSelectedStickyNote(): WorkflowStickyNote | null {
        if (!this.diagram || !this.mapper || !this.diagram.selectedItems) {
            return null;
        }
        const node: NodeModel | undefined = (this.diagram.selectedItems.nodes || [])[0];
        if (!node || !node.id || !this.mapper.getStickyNoteIdForNode(node.id)) {
            return null;
        }
        const stored: unknown = node.addInfo;
        return stored && typeof stored === 'object'
            && (stored as { workflowStickyNote?: WorkflowStickyNote }).workflowStickyNote
            ? (stored as { workflowStickyNote: WorkflowStickyNote }).workflowStickyNote
            : null;
    }

    /**
     * Creates handles for a selected sticky note.
     *
     * @param {WorkflowStickyNote} note The selected sticky note.
     * @returns {UserHandleModel[]} The sticky-note handles.
     */
    private createStickyNoteHandles(note: WorkflowStickyNote): UserHandleModel[] {
        if (this.settings.readOnly) {
            return [];
        }
        const fill: string = note.style && note.style.fill ? note.style.fill : '#fff4b8';
        const deleteStickyNoteLabel: string = this.resolveCaption('deleteStickyNote');
        const changeColorLabel: string = this.resolveCaption('changeStickyNoteColor');
        return [
            {
                ...this.nodeHandleStyle,
                name: NODE_HANDLE_DELETE,
                side: 'Top',
                offset: 0.35,
                margin: {top: 8},
                disableConnectors: true,
                template: userHandleButton('e-trash', deleteStickyNoteLabel) as any
            },
            {
                ...this.nodeHandleStyle,
                name: 'wfStickyColor',
                side: 'Top',
                offset: 0.65,
                margin: {top: 8},
                disableConnectors: true,
                template: `<input type="color" style="width:30px;" class="e-wf-sticky-color-input" value="${escapeAttribute(fill)}" aria-label="${escapeAttribute(changeColorLabel)}">` as any,
                tooltip: { content: changeColorLabel }
            }
        ];
    }

    /**
     * Handles changes to the sticky-note color user handle.
     *
     * @param {Event} event The native input event.
     * @returns {void}
     */
    private readonly onUserHandleTemplateChange = (event: Event): void => {
        const source: HTMLElement | null = event.target instanceof HTMLElement
            ? event.target
            : null;
        const target: HTMLInputElement | null = source
            ? source.closest('.e-wf-sticky-color-input') as HTMLInputElement | null
            : null;
        if (!target
            || !this.actions) {
            return;
        }
        const note: WorkflowStickyNote | null = this.resolveSelectedStickyNote();
        if (note && target.value) {
            this.actions.updateStickyNoteColor(note, target.value);
        }
    };

    /**
     * Handles double-clicks that begin sticky-note editing.
     *
     * @param {MouseEvent} event The native mouse event.
     * @returns {void}
     */
    private readonly onStickyNoteDoubleClick = (event: MouseEvent): void => {
        const target: Element | null = event.target instanceof Element
            ? event.target.closest('.e-wf-sticky-note-content') as HTMLElement | null
            : null;
        const id: string | undefined = target && target.id
            ? target.id.replace(/^wf-sticky-note-content-/, '')
            : undefined;
        if (id && this.mapper) {
            event.preventDefault();
            event.stopPropagation();
            this.mapper.beginStickyNoteEdit(id, (text: string): void => {
                if (this.stickyNoteTextChangeCallback) {
                    this.stickyNoteTextChangeCallback(id, text);
                }
            });
            return;
        }

    };
    /**
     * Returns the selected diagram node.
     *
     * @returns {NodeModel|null} The selected node.
     */
    private resolveSelectedNode(): NodeModel | null {
        if (
            !this.diagram ||
            !this.diagram.selectedItems
        ) {
            return null;
        }

        const selectedNodes: NodeModel[] =
            this.diagram.selectedItems.nodes || [];

        return selectedNodes.length
            ? selectedNodes[0]
            : null;
    }

    /**
     * Determines whether a node port already has an outgoing connector.
     *
     * @param {string} nodeId The node ID.
     * @param {string} portName The output port name.
     * @returns {boolean} Whether an outgoing connector exists.
     */
    private hasOutgoingConnector(
        nodeId: string,
        portName: string
    ): boolean {
        if (!this.diagram || !nodeId) {
            return false;
        }

        const outputPortId: string =
            NodeMapper.getPortId(
                nodeId,
                portName,
                false
            );

        const connectors: ConnectorModel[] =
            this.diagram.connectors || [];

        return connectors.some(
            (connector: ConnectorModel): boolean => {
                if (
                    String(connector.sourceID || '') !== nodeId
                ) {
                    return false;
                }
                const sourcePortId: string = String(connector.sourcePortID || '');
                return sourcePortId === outputPortId ||
                    sourcePortId === portName;
            }
        );
    }

    /**
     * Creates one right-side Add handle for each output port.
     *
     * @param {WorkflowStep} step The selected workflow step.
     * @returns {UserHandleModel[]} The output-port handles.
     */
    private createOutputPortHandles(
        step: WorkflowStep
    ): UserHandleModel[] {
        const selectedNode: NodeModel | null =
            this.resolveSelectedNode();

        if (!selectedNode || !selectedNode.id) {
            return [];
        }

        const nodeId: string =
            String(selectedNode.id);

        const outputPorts: string[] =
            PortResolver.getOutputPorts(step);

        const portCount: number =
            outputPorts.length;

        return outputPorts
            .map(
                (
                    portName: string,
                    index: number
                ): {
                    portName: string;
                    offset: number;
                } => {
                    return {
                        portName,
                        offset:
                            portCount === 1
                                ? 0.5
                                : (index + 1) /
                                    (portCount + 1)
                    };
                }
            )
            .filter(
                (
                    port: {
                        portName: string;
                        offset: number;
                    }
                ): boolean => {
                    return !this.hasOutgoingConnector(
                        nodeId,
                        port.portName
                    );
                }
            )
            .map(
                (
                    port: {
                        portName: string;
                        offset: number;
                    }
                ): UserHandleModel => {
                    const addNextStepLabel: string = this.resolveCaption(
                        'addNextStepFromPort',
                        [port.portName]
                    );
                    return {
                        ...this.nodeHandleStyle,
                        name: this.createOutputPortHandleName(port.portName),
                        side: 'Right',
                        offset: port.offset,
                        margin: {right: 4},
                        template: userHandleButton('e-plus', addNextStepLabel) as any,
                        tooltip: {
                            content: this.resolveCaption('addNextStepHandleTooltip')
                        }
                    };
                }
            );
    }
}


/**
 * Format a `key` carrying `{0}` / `{1}` placeholders.
 *
 * @param {string} value The value.
 * @param {string[]} args The args.
 * @returns {string} The formatted value.
 * @private
 */
function CANVAS_RENDERER_FORMAT(value: string, args: string[]): string {
    return args.reduce<string>((acc: string, arg: string, index: number) => {
        return acc.replace('{' + index + '}', arg);
    }, value);
}
