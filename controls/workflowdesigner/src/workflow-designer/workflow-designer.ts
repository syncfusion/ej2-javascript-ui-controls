import { Complex, Component, EmitType, Event, INotifyPropertyChanged, L10n, Property, SanitizeHtmlHelper, compile, getUniqueID } from '@syncfusion/ej2-base';
import { runStoppedError } from './simulation/run-stopped';
import { WorkflowStepState, WorkflowStepTemplateArgs } from './models/workflow-step-template';
import { WorkflowDesignerModel } from './workflow-designer-model';
import { WorkflowAIAssistSettings } from './models/workflow-ai-assist-settings';
import { WorkflowAIAssistSettingsModel } from './models/workflow-ai-assist-settings-model';
import { WorkflowConnection } from './models/workflow-connection';
import { WorkflowDefinitionModel } from './models/workflow-definition';
import { WorkflowErrorSettings } from './models/workflow-error-settings';
import { WorkflowAIRequest, WorkflowChangedEventArgs, WorkflowChangeType, WorkflowPropertyChange, WorkflowAIAssistCompletedEventArgs, WorkflowAIAssistFailedEventArgs, WorkflowCustomExecutionRequestedEventArgs, WorkflowSelectionChangedEventArgs, WorkflowNotifyRequestedEventArgs, WorkflowExecutionCompletedEventArgs, WorkflowExecutionStartedEventArgs, WorkflowExecutionStepCompletedEventArgs, WorkflowExecutionStepFailedEventArgs, WorkflowExecutionStepStartedEventArgs, WorkflowApprovalRequestedEventArgs, WorkflowCredentialRequestedEventArgs, WorkflowBeforeStepExecuteEventArgs, WorkflowBeforeItemRemoveEventArgs, WorkflowBeforeConnectEventArgs, WorkflowBeforeRequestSendEventArgs, WorkflowCreatedEventArgs } from './models/workflow-events';

import { WorkflowStepCollectionSettings } from './models/workflow-node-collection-settings';
import { WorkflowStepCollectionSettingsModel } from './models/workflow-node-collection-settings-model';
import { WorkflowPosition } from './models/workflow-position';
import { WorkflowPropertyPanelSettings } from './models/workflow-property-panel-settings';
import { WorkflowPropertyPanelSettingsModel } from './models/workflow-property-panel-settings-model';
import { WorkflowSettings } from './models/workflow-settings';
import { WorkflowSettingsModel } from './models/workflow-settings-model';
import { WorkflowExecutionLogSettings } from './models/workflow-execution-log-settings';
import { WorkflowExecutionLogSettingsModel } from './models/workflow-execution-log-settings-model';
import { WorkflowExecutionState, WorkflowExecutionStatus } from './models/workflow-enums';
import { WorkflowExecutionResult } from './models/workflow-validation';
import { WorkflowRuntimeContext } from './models/workflow-runtime-context';
import { WorkflowStep } from './models/workflow-step';
import { WorkflowStickyNote } from './models/workflow-sticky-note';
import { WorkflowCanvasToolbarSettings, WorkflowToolbarSettings } from './models/workflow-toolbar-settings';
import { WorkflowCanvasToolbarSettingsModel, WorkflowToolbarSettingsModel } from './models/workflow-toolbar-settings-model';
import { WorkflowValidationMessage, WorkflowValidationResult, WorkflowExecutionLogEntry } from './models/workflow-validation';
import { IdRegistry } from './persistence/id-registry';
import { WorkflowError, WorkflowImportError } from './persistence/errors';
import { WorkflowJsonSerializer } from './persistence/workflow-json-serializer';
import { AriaLive } from './rendering/aria-live';
import { CanvasRenderer } from './rendering/canvas-renderer';
import { CanvasToolbar } from './rendering/canvas-toolbar';
import { ServiceLocator } from './rendering/service';
import { WorkspaceShell } from './rendering/workspace-shell';
import { DEFAULT_PROJECT_NAME, TopToolbar } from './rendering/top-toolbar';
import { NodeCollection } from './rendering/node-collection';
import { EmptyCanvasAddControl } from './rendering/empty-canvas-add';
import { InsertionController } from './interactions/insertion-controller';
import { PositionSynchronizer } from './interactions/position-synchronizer';
import { HandleActions } from './interactions/handle-actions';
import { KeyboardHandler, KeyboardHandlerCallbacks } from './interactions/keyboard-handler';
import { PropertyPanel } from './rendering/property-panel';
import { FormInputDialog } from './rendering/editors/form-input-dialog';
import { ApprovalDialog } from './rendering/editors/approval-dialog';
import { SimulationLog } from './rendering/simulation-log';
import { SimulationController } from './simulation/simulation-controller';
import { AIAssistController } from './ai/ai-assist-controller';
import { WorkflowValidator, isReservedId } from './validation/workflow-validator';
import { LocaleContext } from './localization/locale-context';
import { PortResolver } from './mapping/port-resolver';
import { DiagramMapper } from './mapping/diagram-mapper';
import { DefaultsResolver } from './mapping/defaults-resolver';
import { NodeMapper } from './mapping/node-mapper';
import { WorkflowStepType } from './models/workflow-enums';
import { WebhookTriggerStepProps } from './models/workflow-step-props';
import { Dialog, DialogUtility } from '@syncfusion/ej2-popups';
import { Diagram, DiagramTools, ISelectionChangeEventArgs, NodeModel, ConnectorModel, IHistoryChangeArgs } from '@syncfusion/ej2-diagrams';
import { WorkflowExecutionSettingsModel } from './models/workflow-execution-settings-model';
import { WorkflowExecutionSettings } from './models/workflow-execution-settings';
import { WorkflowWebhookTriggerMessage } from './runtime/workflow-webhook-trigger-api';
import { normalizeWebhookPath } from './runtime/webhook-utils';
import { isPromiseLike, resolveCancel } from './simulation/cancel';
import { localeDefaults } from './localization/locale-defaults';

/** Subset of the Diagram history manager used for external item-edit entries. */
/** Host element attributes restored by `destroy()`. */
interface HostElementState {
    id: string | null;
    className: string | null;
    tabindex: string | null;
    width: string;
    height: string;
}

interface HistoryManagerLike {
    undo: (entry: { undoObject?: unknown; redoObject?: unknown }) => void;
    redo: (entry: { undoObject?: unknown; redoObject?: unknown }) => void;
    workflowEditHandlersBound?: boolean;
}

/**
 * The Workflow Designer is a visual editor for building, validating and running workflows.
 * Users add steps from the node collection, connect them on the canvas, configure each step in
 * the property panel and run the workflow in the browser, which reports progress through events.
 * API Request and AI steps make real network calls during a run; handle `beforeRequestSend` to
 * route, replace or block them.
 *
 * ```html
 * <div id="workflowDesigner"></div>
 * ```
 * ```typescript
 * const designer: WorkflowDesigner = new WorkflowDesigner({ height: '600px' });
 * designer.appendTo('#workflowDesigner');
 * ```
 *
 * @returns {WorkflowDesigner} The workflow designer instance.
 */
export class WorkflowDesigner extends Component<HTMLElement> implements INotifyPropertyChanged {

    private l10n: L10n;
    /**
     * Service registry shared with rendering submodules. The localization
     * instance is registered once here; submodules resolve it through
     * `getService<L10n>('localization')` instead of building their own
     * fallback instances. Mirrors the Diagram component's service pattern.
     *
     * @private
     */
    private serviceLocator: ServiceLocator;

    /**
     * Defines the width of the Workflow Designer. Accepts a number of pixels or any CSS length,
     * such as `'100%'` or `'800px'`.
     *
     * @default '100%'
     */
    @Property('100%')
    public width: string | number;

    /**
     * Defines the height of the Workflow Designer. Accepts a number of pixels or any CSS length,
     * such as `'100%'` or `'600px'`.
     *
     * @default '100%'
     */
    @Property('100%')
    public height: string | number;

    /**
     * Defines the executable workflow steps.
     */
    private workflowSteps: WorkflowStep[];

    /**
     * Defines the directed workflow connections.
     */
    private workflowConnections: WorkflowConnection[];

    /**
     * Defines non-executable plain-text documentation notes.
     */
    private stickyNotes: WorkflowStickyNote[];

    /**
     * Defines the canvas behavior of the Workflow Designer, including the selection tool, zoom limits,
     * automatic layout, grid lines and read-only mode.
     *
     * @default {}
     */
    @Complex<WorkflowSettingsModel>({}, WorkflowSettings)
    public workflowSettings: WorkflowSettingsModel;

    /**
     * Defines the top toolbar: whether it is shown and which commands it contains,
     * such as Undo, Redo, Layout, Execute, Lock, Import and Export.
     *
     * @default {}
     */
    @Complex<WorkflowToolbarSettingsModel>({}, WorkflowToolbarSettings)
    public toolbarSettings: WorkflowToolbarSettingsModel;

    /**
     * Defines the floating toolbar at the bottom of the canvas: whether it is shown and which commands
     * it contains, such as Add, Sticky Note, Select, Pan and the zoom controls.
     *
     * @default {}
     */
    @Complex<WorkflowCanvasToolbarSettingsModel>({}, WorkflowCanvasToolbarSettings)
    public canvasToolbarSettings: WorkflowCanvasToolbarSettingsModel;

    /**
     * Defines the node collection, the panel users pick new workflow steps from.
     * The panel opens when the user adds a step and is collapsed otherwise.
     *
     * @default {}
     */
    @Complex<WorkflowStepCollectionSettingsModel>({}, WorkflowStepCollectionSettings)
    public stepCollectionSettings: WorkflowStepCollectionSettingsModel;

    /**
     * Defines the property panel, which is used to configure the selected workflow step.
     * Selecting a sticky note does not open the property panel.
     *
     * @default {}
     */
    @Complex<WorkflowPropertyPanelSettingsModel>({}, WorkflowPropertyPanelSettings)
    public propertyPanelSettings: WorkflowPropertyPanelSettingsModel;

    /**
     * Defines the execution log, the panel docked below the canvas that lists the progress and
     * result of each step during a run.
     *
     * @default {}
     */
    @Complex<WorkflowExecutionLogSettingsModel>({}, WorkflowExecutionLogSettings)
    public executionLogSettings: WorkflowExecutionLogSettingsModel;

    /**
     * Defines how runs are paced, including the delay between steps and whether
     * Delay steps wait in real time.
     *
     * @default {}
     */
    @Complex<WorkflowExecutionSettingsModel>({}, WorkflowExecutionSettings)
    public executionSettings: WorkflowExecutionSettingsModel;

    /**
     * Defines the content of every workflow step. It replaces the built-in step content, while the
     * Workflow Designer keeps owning the step node, its ports, connections, selection, dragging and
     * resizing.
     *
     * Accepts an HTML string, or a function that receives `{ step, state }` and returns an HTML string
     * or an `HTMLElement`. A string can also use `${step.name}` and `${state}` expressions. The content is
     * refreshed when the step, its size or appearance, or its execution state changes. To refresh it on
     * demand, for example from `selectionChanged`, call `refreshWorkflowStepTemplate`.
     *
     * The template is not saved with the workflow.
     *
     * @default null
     * @aspType string
     */
    @Property()
    public workflowStepTemplate: string | Function;

    /**
     * Assigns common default `size` and `appearance` values to workflow steps. The callback receives a
     * copy of the step and returns it with the defaults set; only `size` and `appearance` are read.
     * A value set on the step itself always wins, and a default always wins over the built-in value.
     * Resolved defaults are written to the step, so they are included in the exported workflow. The
     * callback itself is never saved. After changing it, values that came from the previous callback
     * are re-evaluated; values you set yourself are kept.
     *
     * @default null
     * @aspType Func<WorkflowStep, WorkflowStep>
     */
    @Property()
    public stepDefaults: Function;

    /**
     * Assigns common default `type`, `style`, `sourceDecorator` and `targetDecorator` values to workflow
     * connections. The callback receives a copy of the connection and returns it with the defaults set.
     * A value set on the connection itself always wins, and a default always wins over the built-in
     * value. Execution styling stays temporary and takes visual priority while a connection is marked
     * as executed. The callback itself is never saved.
     *
     * @default null
     * @aspType Func<WorkflowConnection, WorkflowConnection>
     */
    @Property()
    public connectionDefaults: Function;

    /**
     * Workflow-level error defaults. Step-level `errorHandling` overrides them. Not configurable
     * in this release.
     */
    private errorSettings: WorkflowErrorSettings;

    /**
     * Defines AI Assist, which generates or updates the workflow from natural-language prompts.
     * AI Assist is disabled by default. To call an AI provider directly from the browser, set `provider`,
     * `model` and `credential`. To route requests through your own backend, set `mode` to `'Server'`
     * and `serverUrl`.
     *
     * @default { enabled: false }
     */
    @Complex<WorkflowAIAssistSettingsModel>({ enabled: false }, WorkflowAIAssistSettings)
    public aiAssistSettings: WorkflowAIAssistSettingsModel;

    /**
     * Tracks the current run state. Hosts read it through `executionState` and observe
     * transitions through `executionStarted` and `executionCompleted`.
     */
    private simulationState: WorkflowExecutionState;

    /**
     * Triggers once after the Workflow Designer has finished rendering.
     *
     * @event created
     */
    @Event()
    public created: EmitType<Object>;

    /**
     * Triggers after the workflow changes, whether the change is made in the UI (including a step
     * setting committed in the property panel) or by calling `importWorkflow` or
     * `clearWorkflow`. The `workflow` argument holds a snapshot of the updated workflow definition.
     *
     * @event workflowChanged
     */
    @Event()
    public workflowChanged: EmitType<WorkflowChangedEventArgs>;

    /**
     * Triggers when the selection on the canvas changes. The `selectedItem` argument holds the selected
     * step, connection or sticky note, or `null` when the selection is cleared.
     *
     * @event selectionChanged
     */
    @Event()
    public selectionChanged: EmitType<WorkflowSelectionChangedEventArgs>;

    /**
     * Triggers when a run starts, after the workflow passes validation.
     *
     * @event executionStarted
     */
    @Event()
    public executionStarted: EmitType<WorkflowExecutionStartedEventArgs>;

    /**
     * Triggers when a run reaches a step, before the step runs. The `step` argument holds
     * the step, `previousStep` and `incomingConnection` describe how it was reached, and `context` holds
     * the current runtime context.
     *
     * @event executionStepStarted
     */
    @Event()
    public executionStepStarted: EmitType<WorkflowExecutionStepStartedEventArgs>;

    /**
     * Triggers after a step completes during a run. The `result` argument holds the step's
     * response, and `outputPort` holds the output port the run continues from for branching steps such
     * as Condition and Switch.
     *
     * @event executionStepCompleted
     */
    @Event()
    public executionStepCompleted: EmitType<WorkflowExecutionStepCompletedEventArgs>;

    /**
     * Triggers when a step fails during a run. The `error` argument describes the failure.
     *
     * @event executionStepFailed
     */
    @Event()
    public executionStepFailed: EmitType<WorkflowExecutionStepFailedEventArgs>;

    /**
     * Triggers once when a run ends, whatever the outcome. `result.status` is `'Completed'`,
     * `'Failed'`, `'Stopped'` (the Stop command or `stopExecution`) or `'Cancelled'` (a host handler
     * cancelled the run). For a failed or cancelled run, `result.error`
     * describes the failure; when the workflow didn't pass validation, `result.error.type` is
     * `'Validation'` and `result.error.details` lists the validation messages. `result` also holds
     * the runtime context and the steps and connections that were visited.
     *
     * @event executionCompleted
     */
    @Event()
    public executionCompleted: EmitType<WorkflowExecutionCompletedEventArgs>;



    /**
     * Triggers when a Notify step runs, so the host application can deliver the notification. The
     * `notification` argument holds the step's resolved notification settings.
     *
     * Call `args.complete(result)` when delivery succeeds or `args.fail(error)` when it fails. The run
     * waits until one of them is called, the step times out, or the run is stopped, which aborts
     * `args.signal`. If no handler is bound to this event, the Notify step fails.
     *
     * Values from earlier steps are inserted into `args.notification` as-is. Escape them before
     * using them in HTML channels such as email bodies.
     *
     * @event notifyRequested
     */
    @Event()
    public notifyRequested: EmitType<WorkflowNotifyRequestedEventArgs>;



    /**
     * Triggers when a Custom step runs, so the host application can perform the step's work. The
     * `actionType` and `input` arguments come from the step's configuration.
     *
     * Call `args.complete(result)` with the step's result or `args.fail(error)` when it fails. The run
     * waits until one of them is called, the step times out, or the run is stopped, which aborts
     * `args.signal`. If no handler is bound to this event, the Custom step fails.
     *
     * @event customExecutionRequested
     */
    @Event()
    public customExecutionRequested: EmitType<WorkflowCustomExecutionRequestedEventArgs>;

    /**
     * Triggers when an Approve step runs and the host should route the request to its reviewers.
     * Call `args.complete({ decision: 'approved' | 'declined' })` when a reviewer decides. When no
     * handler is bound, a built-in approval dialog is shown so the run can be tested in the browser.
     *
     * @event approvalRequested
     * @private
     */
    @Event()
    public approvalRequested: EmitType<WorkflowApprovalRequestedEventArgs>;

    /**
     * Triggers when an AI or API Request step needs a secret. Look up `args.credentialRef` in your
     * secret store and call `args.complete(secret)`. Required in the default `Reference` credential mode.
     *
     * @event credentialRequested
     * @private
     */
    @Event()
    public credentialRequested: EmitType<WorkflowCredentialRequestedEventArgs>;

    /**
     * Triggers before each step runs, including Loop steps. Set `args.cancel` to true to end the run
     * with status `'Cancelled'` before the step executes.
     *
     * @event beforeStepExecute
     * @private
     */
    @Event()
    public beforeStepExecute: EmitType<WorkflowBeforeStepExecuteEventArgs>;

    /**
     * Triggers before an API Request or AI step sends its request, so the host can change the
     * request, route it through its own backend, supply the response itself or cancel it.
     * Runs make real network calls unless this event supplies the response.
     *
     * @event beforeRequestSend
     */
    @Event()
    public beforeRequestSend: EmitType<WorkflowBeforeRequestSendEventArgs>;

    /**
     * Triggers before the user removes a step, connection or sticky note. Set `args.cancel` to true
     * to keep the item.
     *
     * @event beforeItemRemove
     * @private
     */
    @Event()
    public beforeItemRemove: EmitType<WorkflowBeforeItemRemoveEventArgs>;

    /**
     * Triggers before the user adds a connection. Set `args.cancel` to true to reject the connection.
     *
     * @event beforeConnect
     * @private
     */
    @Event()
    public beforeConnect: EmitType<WorkflowBeforeConnectEventArgs>;



    /**
     * Triggers after AI Assist generates a workflow, validates it and applies it to the canvas.
     * The `workflow` argument holds the applied workflow definition.
     *
     * @event aiAssistCompleted
     */
    @Event()
    public aiAssistCompleted: EmitType<WorkflowAIAssistCompletedEventArgs>;

    /**
     * Triggers when an AI Assist request fails and won't be retried. The current workflow is left
     * unchanged. The `error` argument describes the failure.
     *
     * @event aiAssistFailed
     */
    @Event()
    public aiAssistFailed: EmitType<WorkflowAIAssistFailedEventArgs>;

    private registry: IdRegistry;
    private serializer: WorkflowJsonSerializer;
    /** Guards re-entrant collectionChange while adopting manual connectors. */
    private isAdoptingManualConnectors: boolean;
    private canvasRenderer: CanvasRenderer | null;
    private canvasToolbar: CanvasToolbar | null;
    private workspaceShell: WorkspaceShell | null;
    private topToolbar: TopToolbar | null;
    /** Author-facing project/workflow display name (default: Workflow Designer). */
    private projectName: string;

    /** The `id` of the loaded workflow definition, kept on export and matched by webhook messages. */
    private workflowDefinitionId: string;
    private nodeCollection: NodeCollection | null;
    /** Canvas region element — owns the diagram-interaction dismissal listener. */
    private canvasRegion: HTMLDivElement | null;
    private emptyCanvasAdd: EmptyCanvasAddControl | null;
    private insertionController: InsertionController | null;
    private ariaLive: AriaLive | null;
    private positionSynchronizer: PositionSynchronizer | null;
    private propertyPanel: PropertyPanel | null;
    private simulationLog: SimulationLog | null;
    private simulationController: SimulationController | null;
    private aiAssistController: AIAssistController | null;
    private keyboardHandler: KeyboardHandler | null;
    private selectedItem: WorkflowStep | WorkflowConnection | WorkflowStickyNote | null;
    /** Tracks the id of a newly inserted node that should auto-open the property panel. */
    private newlyInsertedNodeId: string;
    /**
     * Bound diagram-interaction dismissal handler for the Node Collection
     *. Captured on the canvas region in the capture phase so the
     * palette is dismissed before the Diagram processes the same press.
     *
     * @param {MouseEvent} event The canvas-region mouse-down event.
     * @returns {void} Nothing.
     */
    private onCanvasMouseDown: (event: MouseEvent) => void;

    private handleCanvasMouseDown(event: MouseEvent): void {
        // Dismiss only for presses inside the diagram interaction region.
        // The empty-canvas Add control is a sibling of the canvas host inside
        // the same region and keeps its open-toggle behaviour.
        const target: EventTarget | null = event.target;
        if (!(target instanceof Element)) {
            return;
        }
        if (!target.closest('.e-wf-canvas-host')) {
            return;
        }
        if (
            !this.nodeCollection ||
            !this.nodeCollection.isOpen()
        ) {
            return;
        }
        this.nodeCollection.close();
    }
    private disposed: boolean;
    private dirty: boolean;
    /** The host element's attributes before render; not reset by initializeFields (render may run first). */
    private hostState: HostElementState | null;
    /** The open Clear confirmation, if any. */
    private clearConfirmDialog: Dialog | null;
    private runPromise: Promise<WorkflowExecutionResult> | null;
    /** Tracks property panel changes to emit with previous/new values */
    private pendingPropertyPanelChanges: Map<string, Record<string, unknown>>;

    /**
     * Creates a new Workflow Designer instance.
     *
     * @param {WorkflowDesignerModel} [options] - The initial property values of the component.
     * @param {string | HTMLElement} [element] - The host element, or a CSS selector that identifies it.
     */
    public constructor(options?: WorkflowDesignerModel, element?: string | HTMLElement) {
        if (options && options.workflowSettings) {
            // Legacy `tools` is accepted as `tool`; `tool` wins when both are present.
            const legacy: { tools?: WorkflowSettingsModel['tool'] } & WorkflowSettingsModel = options.workflowSettings;
            if (legacy.tools !== undefined) {
                const normalized: WorkflowSettingsModel = { ...legacy };
                if (normalized.tool === undefined) {
                    normalized.tool = legacy.tools;
                }
                delete (normalized as { tools?: unknown }).tools;
                options = { ...options, workflowSettings: normalized };
            }
        }
        super(options, element);
        this.initializeFields();
    }

    /** Set once per instance; see initializeFields. */
    private fieldsInitialized: boolean;

    /**
     * Assigns the instance fields. EJ2 renders inside `super()` when an element is passed to the
     * constructor, before TypeScript field initialisers would run, and those initialisers would then
     * reset the rendered state. Fields are therefore declared without initialisers and assigned here,
     * from both `preRender()` and the constructor, whichever runs first.
     *
     * @returns {void} Nothing.
     */
    private initializeFields(): void {
        if (this.fieldsInitialized) {
            return;
        }
        this.fieldsInitialized = true;
        this.errorSettings = {
            defaultTimeoutMs: 30000,
            continueOnError: false,
            retryPolicy: { enabled: false, maxAttempts: 1, delayMs: 0 }
        };
        this.onCanvasMouseDown = (event: MouseEvent): void => this.handleCanvasMouseDown(event);
        this.onLocaleEvent = (): void => this.bindLocale();
        this.workflowSteps = [];
        this.workflowConnections = [];
        this.stickyNotes = [];
        this.simulationState = 'Idle';
        this.registry = new IdRegistry();
        this.serializer = new WorkflowJsonSerializer();
        this.isAdoptingManualConnectors = false;
        this.canvasRenderer = null;
        this.canvasToolbar = null;
        this.workspaceShell = null;
        this.topToolbar = null;
        this.projectName = DEFAULT_PROJECT_NAME;
        this.workflowDefinitionId = '';
        this.nodeCollection = null;
        this.canvasRegion = null;
        this.emptyCanvasAdd = null;
        this.insertionController = null;
        this.ariaLive = null;
        this.positionSynchronizer = null;
        this.propertyPanel = null;
        this.simulationLog = null;
        this.simulationController = null;
        this.aiAssistController = null;
        this.keyboardHandler = null;
        this.selectedItem = null;
        this.newlyInsertedNodeId = '';
        this.disposed = false;
        this.dirty = false;
        this.clearConfirmDialog = null;
        this.runPromise = null;
        this.pendingPropertyPanelChanges = new Map<string, Record<string, unknown>>();
        this.instanceScopeId = 'wd-' + Math.random().toString(36).slice(2, 10);
        this.paintedNodeStates = new WeakMap<object, string>();
        this.paintedConnectorStates = new WeakMap<object, string>();
        this.lastItemEdit = null;
        this.replayingItemEdit = false;
    }

    /**
     * Initializes component-owned state before rendering.
     *
     * @returns {void} Nothing.
     */
    protected preRender(): void {
        this.initializeFields();
        this.disposed = false;
        this.serviceLocator = new ServiceLocator();
        this.serviceLocator.register('localization', this.l10n = new L10n(
            this.getModuleName(),
            localeDefaults,
            this.locale
        ));
        this.serviceLocator.register('workflowScope', () => this.workflowScope());
        this.serviceLocator.register('credentialMode', () => this.credentialMode());
    }

    /**
     * Creates the workspace shell, canvas and renders the initial public workflow collections.
     *
     * @returns {void} Nothing.
     */
    protected render(): void {
        // Child elements derive their ids from the host id, and the Diagram finds
        // them by id. Without a unique host id, several designers on one page
        // share ids and one instance's cleanup removes another's canvas.
        this.captureHostState();
        if (!this.element.id) {
            this.element.id = getUniqueID('e-workflow-designer');
        }
        this.bindLocale();
        this.bindLocaleEvents(true);
        this.applyDimensions();
        this.element.classList.add('e-workflow-designer');
        this.element.classList.toggle('e-rtl', !!this.enableRtl);
        // Mount the structural workspace shell first. The shell owns
        // the top toolbar, left Node Collection, center canvas, right Property
        // Section and bottom Simulation Log regions as placeholders; functional
        // toolbar/palette/panel/log behavior lands in later batches. The shell
        // does not mutate workflow positions or Diagram bounds.
        this.workspaceShell = new WorkspaceShell(this.element);
        const canvasRegion: HTMLDivElement = this.workspaceShell.create();
        this.canvasRegion = canvasRegion;
        // The Node Collection is dismissed when the user interacts
        // with the diagram interaction region. Capture-phase so the palette
        // closes before the Diagram's own mousedown handling (selection,
        // user-handle Add) runs for the same press; the Add handle re-opens
        // the palette through its own entry point.
        canvasRegion.addEventListener('mousedown', this.onCanvasMouseDown, true);
        // R5:
        // insertion-driven Node Collection. The Node Collection is collapsed
        // by default; it opens only for an active insertion request (empty-canvas
        // Add at first-step insertion; node/connector Add entry points land in
        // R6). It performs insertion through the existing public mutation
        // boundary (`addWorkflowItem`) — never calls `DiagramMapper` directly.
        // The runtime-only insertion context is never persisted.
        this.insertionController = new InsertionController({
            addStep: (step: WorkflowStep): string | null => {
                this.addWorkflowItem(step);

                return this.workflowSteps.some(
                    (item: WorkflowStep): boolean => item.id === step.id
                )
                    ? step.id || null
                    : null;
            },

            startGroupAction: (): void => {
                if (this.canvasRenderer) {
                    this.canvasRenderer.startGroupAction();
                }
            },

            endGroupAction: (): void => {
                if (this.canvasRenderer) {
                    this.canvasRenderer.endGroupAction();
                }
            },

            selectStep: (stepId: string): void => {
                // Mark this as a newly inserted node so the property panel opens
                this.newlyInsertedNodeId = stepId;
                if (this.canvasRenderer) {
                    this.canvasRenderer.selectStep(stepId);
                }
            },

            generateStepId: (preferred: string): string =>
                this.generateUniqueStepId(preferred),

            getSteps: (): WorkflowStep[] =>
                this.workflowSteps || [],

            getStepGeometry: (
                stepId: string
            ): {
                x: number;
                y: number;
                width: number;
                height: number;
            } | null => {
                const mapper: DiagramMapper | null = this.canvasRenderer
                    ? this.canvasRenderer.getMapper()
                    : null;

                const node: NodeModel | null = mapper
                    ? mapper.getNodeForStep(stepId)
                    : null;

                if (!node) {
                    return null;
                }

                return {
                    x: typeof node.offsetX === 'number'
                        ? node.offsetX
                        : 0,

                    y: typeof node.offsetY === 'number'
                        ? node.offsetY
                        : 0,

                    width: typeof node.width === 'number' && node.width > 0
                        ? node.width
                        : 180,

                    height: typeof node.height === 'number' && node.height > 0
                        ? node.height
                        : 80
                };
            },

            addConnection: (connection: WorkflowConnection): void => {
                this.addWorkflowItem(connection);
            },

            updateStepPosition: (stepId: string, position: WorkflowPosition): void => {
                this.updateWorkflowItem(stepId, { position });
            },

            removeItem: (id: string): void => {
                this.removeWorkflowItem(id);
            },

            getConnection: (id: string): WorkflowConnection | null =>
                this.workflowConnections.find(
                    (item: WorkflowConnection): boolean => item.id === id
                ) || null,

            defaultOutputPort: (stepType: WorkflowStepType): string[] =>
                PortResolver.getOutputPorts({ stepType } as WorkflowStep)
        });
        this.createNodeCollection();
        this.emptyCanvasAdd = new EmptyCanvasAddControl(
            canvasRegion,
            () => this.openEmptyCanvasInsertion(),
            this.l10n
        );
        this.createTopToolbar();
        this.canvasRenderer = new CanvasRenderer(
            canvasRegion,
            this.workflowSettings || {},
            this.enableRtl,
            this.serviceLocator,
            this.handleActions(),
            () => this.onDiagramCollectionChange(),
            (args: ISelectionChangeEventArgs) => this.onDiagramSelectionChange(args),
            (id: string, text: string): void => {
                this.updateWorkflowItem(id, { text });
            },
            (id: string, width: number, height: number, completed: boolean): void => {
                if (completed) {
                    this.updateWorkflowItem(id, { size: { width, height } });
                }
            },
            (item: NodeModel | ConnectorModel | undefined) => this.openPropertyPanelForSelectedItem(item),
            (canUndo: boolean, canRedo: boolean, action?: IHistoryChangeArgs['action']): void =>
                this.onDiagramHistoryChange(canUndo, canRedo, action)
        );
        const diagram: Diagram = this.canvasRenderer.create(this.element);
        const templateMapper: DiagramMapper | null = this.canvasRenderer.getMapper();
        if (templateMapper) {
            templateMapper.setStepTemplateRenderer(
                (step: WorkflowStep, state: WorkflowStepState): Node[] | null => this.renderStepTemplate(step, state));
        }
        this.canvasToolbar = new CanvasToolbar(
            canvasRegion,
            diagram,
            this.serviceLocator,
            this.canvasToolbarSettings,
            () => this.addStickyNoteAtViewportCenter(),
            (fromUserHandle: boolean = true) => {
                if (this.nodeCollection) {
                    this.setStepCollectionVisibility(!this.nodeCollection.isOpen(), fromUserHandle, true);
                }
            },
            () => this.confirmClearWorkflow(),
            this.stepCollectionSettings
        );
        this.canvasToolbar.create();
        this.canvasToolbar.updateAddButtonState();
        const readOnly: boolean = this.isEditLocked();
        this.canvasToolbar.setReadOnly(readOnly);
        this.emptyCanvasAdd.setReadOnly(readOnly);
        this.ariaLive = new AriaLive(this.element);
        // Initialize keyboard handler for global shortcuts
        this.initializeKeyboardHandler(diagram);
        this.rebuildRegistry();
        this.rebindWorkflowSettingsShowGridLines();
        this.applyAllDefaults();
        this.canvasRenderer.renderAll(this.workflowSteps || [], this.workflowConnections || [], this.stickyNotes || []);
        this.canvasRenderer.runLayout(this.workflowSteps, undefined);
        // On initial render show the empty-canvas Add control when
        // the canvas has no workflow steps; hide it when steps exist.
        this.updateEmptyCanvasAdd();
        const mapper: DiagramMapper | null = this.canvasRenderer.getMapper();
        if (!mapper) {
            return;
        }
        // Steps are read through a getter because the collections are replaced on
        // import, clear and undo; a captured array would go stale.
        this.positionSynchronizer = new PositionSynchronizer(
            diagram,
            mapper,
            () => this.workflowSteps,
            this.isEditLocked(),
            () => this.emitChanged()
        );
        this.positionSynchronizer.attach();
        this.createCompleteWorkspace(diagram, canvasRegion);
        if (!this.element.hasAttribute('tabindex')) {
            this.element.setAttribute('tabindex', '0');
        }
    }

    /**
     * Returns the module name of the component. This is used by the Essential JS 2 framework.
     *
     * @returns {string} The module name.
     * @private
     */
    public getModuleName(): string {
        return 'workflow-designer';
    }

    /**
     * Returns the component persistence payload required by the EJ2 base.
     *
     * @returns {string} The persistence payload.
     */
    protected getPersistData(): string {
        return '';
    }

    /**
     * Handles supported property changes without introducing selection or layout behavior.
     *
     * @param {Object} newProperties - The changed properties.
     * @param {Object} [oldProperties] - The previous properties.
     * @returns {void} Nothing.
     * @private
     */
    public onPropertyChanged(newProperties: Object, oldProperties?: Object): void {
        void oldProperties;
        if (newProperties && Object.prototype.hasOwnProperty.call(newProperties, 'locale')) {
            // Rebuild the shared localization instance and re-register it so
            // every submodule resolves the fresh constants through the
            // service locator (keeps a single source of truth).
            this.serviceLocator.register('localization', this.l10n = new L10n(
                this.getModuleName(),
                localeDefaults,
                this.locale
            ));
            if (this.nodeCollection) {
                this.nodeCollection.setLocale();
            }
            if (this.topToolbar) {
                this.topToolbar.setLocale();
            }
            if (this.canvasToolbar) {
                this.canvasToolbar.setLocale();
            }
            if (this.simulationLog) {
                this.simulationLog.setLocale();
            }
            if (this.propertyPanel) {
                this.propertyPanel.setLocale(this.l10n);
            }
            if (this.simulationController) {
                this.simulationController.setLocale(this.l10n);
            }
            if (this.aiAssistController) {
                this.aiAssistController.setLocale(this.l10n, this.serviceLocator);
            }
            if (this.emptyCanvasAdd) {
                this.emptyCanvasAdd.setLocale(this.l10n);
            }
            if (this.canvasRenderer) {
                this.canvasRenderer.setLocale(this.l10n);
            }
            // Shared helpers read the current instance's localization.
            this.bindLocale();
        }
        if (this.disposed || !this.canvasRenderer || !newProperties) {
            return;
        }
        const changed: (name: string) => boolean = (name: string): boolean =>
            Object.prototype.hasOwnProperty.call(newProperties, name);
        if (changed('width') || changed('height')) {
            this.applyDimensions();
        }
        if (changed('workflowStepTemplate')) {
            this.clearTemplate(['workflowStepTemplate']);
            this.refreshWorkflowStepTemplate();
        }
        if (changed('stepDefaults') || changed('connectionDefaults')) {
            this.reapplyDefaults(changed('stepDefaults'), changed('connectionDefaults'));
        }
        if (changed('workflowSettings')) {
            this.rebindWorkflowSettingsShowGridLines();
            this.applyWorkflowSettings();
        }
        if (changed('enableRtl')) {
            this.applyWorkflowSettings();
        }
        if (changed('toolbarSettings')) {
            if (this.topToolbar) {
                this.topToolbar.destroy();
                this.topToolbar = null;
            }
            this.createTopToolbar();
        }
        if (changed('canvasToolbarSettings') && this.canvasToolbar) {
            this.canvasToolbar.applySettings(this.canvasToolbarSettings);
        }
        if (changed('stepCollectionSettings')) {
            if (this.nodeCollection) {
                this.nodeCollection.updateSettings(this.stepCollectionSettings);
            } else {
                this.createNodeCollection();
            }
            if (this.propertyPanel) {
                this.propertyPanel.setCustomStepSettings(this.stepCollectionSettings);
                this.bindPropertyPanelForSelection(this.selectedItem, false);
            }
            if (this.canvasToolbar) {
                this.canvasToolbar.updateAddButtonState();
            }
            this.updateEmptyCanvasAdd();
        }
        if (changed('propertyPanelSettings')) {
            if (this.propertyPanel) {
                this.propertyPanel.destroy();
                this.propertyPanel = null;
            }
            this.createPropertyPanel();
            this.bindPropertyPanelForSelection(this.selectedItem, false);
        }
        if (changed('executionLogSettings')) {
            // The log is rebuilt; entries from earlier runs are not kept.
            if (this.simulationLog) {
                this.simulationLog.destroy();
                this.simulationLog = null;
            }
            this.createSimulationLog();
        }
        // Only `enabled` and `position` need a rebuild. The other AI Assist settings are read
        // live, and the AI Assist settings dialog writes them itself while a conversation is open.
        const aiChanges: { enabled?: unknown; position?: unknown } =
            ((newProperties as { aiAssistSettings?: { enabled?: unknown; position?: unknown } }).aiAssistSettings) || {};
        if (changed('aiAssistSettings') && ('enabled' in aiChanges || 'position' in aiChanges)) {
            if (this.aiAssistController) {
                this.aiAssistController.destroy();
                this.aiAssistController = null;
            }
            this.createAIAssist();
        }
    }

    /**
     * Renders `workflowStepTemplate` again. Use it when the template output depends on something the
     * Workflow Designer does not track, for example the selected step inside `selectionChanged`.
     *
     * @param {string} [stepId] - The step to refresh. When omitted, every step is refreshed.
     * @returns {void}
     */
    public refreshWorkflowStepTemplate(stepId?: string): void {
        this.assertActive();
        const mapper: DiagramMapper | null = this.canvasRenderer ? this.canvasRenderer.getMapper() : null;
        if (mapper) {
            mapper.refreshStepContent(stepId);
        }
    }

    /**
     * Renders `workflowStepTemplate` for one step. Returns `null` when no template is set. A failing
     * template leaves the step empty instead of partly rendered; the workflow model is not touched.
     *
     * @param {WorkflowStep} step - The step to render.
     * @param {WorkflowStepState} state - The execution state of the step.
     * @returns {Node[] | null} The rendered nodes.
     */
    private renderStepTemplate(step: WorkflowStep, state: WorkflowStepState): Node[] | null {
        const template: string | Function = this.workflowStepTemplate;
        if (!template) {
            return null;
        }
        const args: WorkflowStepTemplateArgs = { step: step, state: state };
        try {
            if (typeof template === 'function') {
                const output: unknown = template(args);
                if (output instanceof Node) {
                    return [output];
                }
                // The function already produced the final markup, so it is only sanitized.
                const host: HTMLElement = document.createElement('div');
                host.innerHTML = SanitizeHtmlHelper.sanitize(String(output));
                return Array.prototype.slice.call(host.childNodes);
            }
            const nodes: NodeList = compile(SanitizeHtmlHelper.sanitize(template))(
                args, this, 'workflowStepTemplate');
            return Array.prototype.slice.call(nodes);
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('workflowStepTemplate failed for step "' + step.id + '":', error);
            return [];
        }
    }

    private applyAllDefaults(): void {
        this.defaultsResolver.stepDefaults = this.stepDefaults as never;
        this.defaultsResolver.connectionDefaults = this.connectionDefaults as never;
        (this.workflowSteps || []).forEach((step: WorkflowStep) => this.defaultsResolver.applyStep(step));
        (this.workflowConnections || []).forEach((c: WorkflowConnection) => this.defaultsResolver.applyConnection(c));
    }

    private defaultsResolverInstance: DefaultsResolver;

    private get defaultsResolver(): DefaultsResolver {
        if (!this.defaultsResolverInstance) {
            this.defaultsResolverInstance = new DefaultsResolver();
        }
        return this.defaultsResolverInstance;
    }

    /**
     * Re-applies the current execution visual (visited or error) to a connector after its configured style
     * changed, so a connector that is currently highlighted keeps the highlight with the updated values.
     *
     * @param {string} connectionId - The workflow connection identifier.
     * @returns {void} Nothing.
     */
    private repaintConnectorState(connectionId: string): void {
        const mapper: DiagramMapper | null = this.canvasRenderer ? this.canvasRenderer.getMapper() : null;
        const connector: ConnectorModel | null = mapper && typeof mapper.getConnectorForConnection === 'function'
            ? mapper.getConnectorForConnection(connectionId)
            : null;
        const state: string = connector ? (this.paintedConnectorStates.get(connector as object) || 'idle') : 'idle';
        if (mapper && (state === 'visited' || state === 'error')) {
            mapper.setConnectorVisualState(connectionId, state);
            const diagram: Diagram | null = this.canvasRenderer.getDiagram();
            if (diagram) {
                diagram.dataBind();
            }
        }
    }

    /**
     * Re-evaluates `stepDefaults` / `connectionDefaults` for existing items and repaints them.
     *
     * @param {boolean} steps - Whether `stepDefaults` changed.
     * @param {boolean} connections - Whether `connectionDefaults` changed.
     * @returns {void} Nothing.
     */
    private reapplyDefaults(steps: boolean, connections: boolean): void {
        const mapper: DiagramMapper | null = this.canvasRenderer ? this.canvasRenderer.getMapper() : null;
        if (!mapper) {
            return;
        }
        if (steps) {
            this.defaultsResolver.stepDefaults = this.stepDefaults as never;
            for (const step of this.workflowSteps) {
                this.defaultsResolver.applyStep(step);
                mapper.updateNode(step.id, { size: step.size, appearance: step.appearance, stateAppearance: step.stateAppearance });
            }
        }
        if (connections) {
            this.defaultsResolver.connectionDefaults = this.connectionDefaults as never;
            for (const connection of this.workflowConnections) {
                this.defaultsResolver.applyConnection(connection);
                const changes: Partial<WorkflowConnection> = {
                    type: connection.type || 'Orthogonal',
                    sourceDecorator: connection.sourceDecorator || 'None',
                    targetDecorator: connection.targetDecorator || 'Arrow',
                    style: connection.style || {}
                };
                const hadType: boolean = !!connection.type;
                const hadSource: boolean = !!connection.sourceDecorator;
                const hadTarget: boolean = !!connection.targetDecorator;
                const hadStyle: boolean = !!connection.style;
                mapper.updateConnector(connection.id, changes);
                if (!hadType) { delete connection.type; }
                if (!hadSource) { delete connection.sourceDecorator; }
                if (!hadTarget) { delete connection.targetDecorator; }
                if (!hadStyle) { delete connection.style; }
                this.repaintConnectorState(connection.id);
            }
        }
        this.emitChanged();
    }

    /**
     * Adds a step, connection or sticky note to the workflow and triggers `workflowChanged`.
     *
     * The item type is detected from its properties: an object with `stepType` is added as a step, an
     * object with `sourceStepId` and `targetStepId` is added as a connection, and any other object is
     * added as a sticky note.
     *
     * The item is ignored when the Workflow Designer is read-only; when `id` is missing, already in use,
     * or contains characters other than letters, digits, `_` and `-`; or when a connection can't be
     * added to the canvas, for example because its source or target step does not exist.
     *
     * @param {WorkflowStep | WorkflowConnection | WorkflowStickyNote} item - The step, connection or sticky note to add.
     * @returns {boolean} `true` when the item was added; `false` when it was ignored.
     * @private
     */
    public addWorkflowItem(item: WorkflowStep | WorkflowConnection | WorkflowStickyNote): boolean {
        this.assertActive();
        if (this.isEditLocked()) {
            return false;
        }
        const id: string | undefined = item.id;
        if (!id || !/^[A-Za-z_][A-Za-z0-9_-]*$/.test(id) || isReservedId(id) || this.registry.has(id)) {
            return false;
        }

        if (this.isConnection(item)) {
            const before: WorkflowBeforeConnectEventArgs = { connection: item, cancel: false };
            this.trigger('beforeConnect', before);
            if (before.cancel) {
                return false;
            }
        }
        if (!this.registry.register(id)) {
            return false;
        }
        if (this.isStep(item)) {
            this.defaultsResolver.stepDefaults = this.stepDefaults as never;
            this.defaultsResolver.applyStep(item);
            this.workflowSteps.push(item);
            this.getMapper().addNode(item);
            this.emitChanged({ changeType: 'StepAdded', affectedItem: item });
        } else if (this.isConnection(item)) {
            this.defaultsResolver.connectionDefaults = this.connectionDefaults as never;
            this.defaultsResolver.applyConnection(item);
            if (!this.getMapper().addConnector(item)) {
                this.registry.unregister(id);
                return false;
            }
            this.workflowConnections.push(item);
            this.emitChanged({ changeType: 'ConnectionAdded', affectedItem: item });
        } else {
            this.stickyNotes.push(item);
            this.getMapper().addStickyNote(item);
            this.emitChanged({ changeType: 'StickyNoteAdded', affectedItem: item });
        }
        return true;
    }

    /**
     * Adds a plain-text sticky note at the center of the current Diagram viewport.
     *
     * @returns {void} Nothing.
     */
    private addStickyNoteAtViewportCenter(): void {
        const id: string = this.generateUniqueStepId('sticky-note');
        this.addWorkflowItem({
            id,
            text: this.formatText('stickyNoteDefaultText'),
            size: { width: 200, height: 170 },
            style: { fill: '#fff4b8', strokeWidth: 1, cornerRadius: 4 }
        });
    }

    /**
     * Scope for per-workflow runtime state such as AI memory: designer instance plus workflow.
     *
     * @returns {string} The scope key.
     */
    private workflowScope(): string {
        return (this.element && this.element.id ? this.element.id : this.instanceScopeId) + ':' + (this.workflowDefinitionId || this.projectName || '');
    }

    /** Last recorded item edit, used to merge keystroke-level edits into one undo step. */
    private lastItemEdit: { id: string; keys: string; at: number; token: string } | null;

    /** Fallback instance identity for scoping AI memory when the host element has no id. */
    private instanceScopeId: string;
    /** Last painted execution state per Diagram node; see applyNodeVisualState. */
    private paintedNodeStates: WeakMap<object, string>;
    /** Last painted execution state per Diagram connector. */
    private paintedConnectorStates: WeakMap<object, string>;
    /** True while an undo/redo entry for an item edit is being replayed. */
    private replayingItemEdit: boolean;

    /**
     * Records an item edit as an external Diagram history entry so `undo()`
     * restores the previous values instead of reverting an unrelated action.
     * Position, and the size of sticky notes, are skipped because the Diagram records those itself.
     *
     * @param {string} id - The edited item id.
     * @param {Record<string, unknown>} next - The incoming changes.
     * @returns {void} Nothing.
     */
    private recordItemEdit(id: string, next: Record<string, unknown>): void {
        const diagram: Diagram | null = this.canvasRenderer ? this.canvasRenderer.getDiagram() : null;
        if (this.replayingItemEdit || !diagram || !diagram.historyManager) {
            return;
        }
        // Sticky notes record their own resize; a step's size is only ever changed through this method.
        const isStep: boolean = this.workflowSteps.some((item: WorkflowStep) => item.id === id);
        const keys: string[] = Object.keys(next).filter((key: string) =>
            key !== 'position' && (key !== 'size' || isStep));
        if (!keys.length) {
            return;
        }
        const target: Record<string, unknown> | undefined =
            (this.workflowSteps.find((item: WorkflowStep) => item.id === id)
            || this.workflowConnections.find((item: WorkflowConnection) => item.id === id)
            || this.stickyNotes.find((item: WorkflowStickyNote) => item.id === id)) as Record<string, unknown> | undefined;
        if (!target) {
            return;
        }
        const clone: (value: unknown) => unknown = (value: unknown): unknown =>
            value === undefined ? undefined : JSON.parse(JSON.stringify(value));
        const before: Record<string, unknown> = {};
        const after: Record<string, unknown> = {};
        keys.forEach((key: string) => {
            before[`${key}`] = clone(target[`${key}`]);
            after[`${key}`] = clone(next[`${key}`]);
        });
        const history: HistoryManagerLike = diagram.historyManager as unknown as HistoryManagerLike;
        if (!history.workflowEditHandlersBound) {
            const replay: (entry: { undoObject?: unknown; redoObject?: unknown }, useUndo: boolean) => void =
                (entry: { undoObject?: unknown; redoObject?: unknown }, useUndo: boolean): void => {
                    const payload: { workflowItemId?: string; values?: Record<string, unknown> } =
                        ((useUndo ? entry.undoObject : entry.redoObject) || {}) as {
                            workflowItemId?: string; values?: Record<string, unknown>
                        };
                    if (!payload.workflowItemId || !payload.values) {
                        return;
                    }
                    this.replayingItemEdit = true;
                    try {
                        // Clone per key: a JSON clone of the whole object would drop keys whose previous value was undefined.
                        const values: Record<string, unknown> = {};
                        Object.keys(payload.values).forEach((key: string) => {
                            values[`${key}`] = clone((payload.values as Record<string, unknown>)[`${key}`]);
                        });
                        this.updateWorkflowItem(payload.workflowItemId, values);
                    } finally {
                        this.replayingItemEdit = false;
                    }
                };
            history.undo = (entry: { undoObject?: unknown; redoObject?: unknown }): void => replay(entry, true);
            history.redo = (entry: { undoObject?: unknown; redoObject?: unknown }): void => replay(entry, false);
            history.workflowEditHandlersBound = true;
        }
        // Merge rapid edits of the same fields (typing in the property panel)
        // into the previous entry so one undo reverts the whole edit. The
        // Diagram copies entries into its display stacks, so the live entry is
        // matched by token.
        const keySignature: string = keys.slice().sort().join(',');
        // `currentEntry` is the live linked-list entry that undo/redo replay;
        // `undoStack` only holds display copies.
        const liveTop: () => { undoObject?: { editToken?: string }; redoObject?: unknown } | undefined = () => {
            const manager: { currentEntry?: { undoObject?: { editToken?: string }; redoObject?: unknown } } =
                diagram.historyManager as unknown as {
                    currentEntry?: { undoObject?: { editToken?: string }; redoObject?: unknown }
                };
            return manager.currentEntry;
        };
        const last: { id: string; keys: string; at: number; token: string } | null = this.lastItemEdit;
        const now: number = Date.now();
        const top: { undoObject?: { editToken?: string }; redoObject?: unknown } | undefined = liveTop();
        if (last && last.id === id && last.keys === keySignature && now - last.at < 1000
            && top && top.undoObject && top.undoObject.editToken === last.token) {
            top.redoObject = { workflowItemId: id, values: after, editToken: last.token };
            last.at = now;
            return;
        }
        const token: string = id + ':' + now + ':' + Math.random().toString(36).slice(2, 8);
        diagram.addHistoryEntry({
            type: 'ExternalEntry',
            category: 'External',
            undoObject: { workflowItemId: id, values: before, editToken: token } as unknown as NodeModel,
            redoObject: { workflowItemId: id, values: after, editToken: token } as unknown as NodeModel
        });
        this.lastItemEdit = { id: id, keys: keySignature, at: now, token: token };
    }

    /**
     * Updates the step, connection or sticky note with the given identifier. Only the properties
     * included in `changes` are updated, and the `id` property is never changed.
     *
     * The call is ignored when the Workflow Designer is read-only or no item has the given identifier.
     * Renaming a Switch step's branch also updates the connections that start from that branch.
     *
     * The method can also be called while a run is in progress, for example from an execution event, so a
     * step that has not run yet picks up the new values. During a run `stepType` of a step and the source
     * and target of a connection are ignored, and the edit is not added to the undo history. Connection
     * properties such as `type` and `label` can be changed.
     *
     * @param {string} id - The identifier of the item to update.
     * @param {Partial<WorkflowStep> | Partial<WorkflowConnection> | Partial<WorkflowStickyNote>} changes - The properties to change.
     * @param {boolean} [silent] - When `true`, the item is updated without triggering `workflowChanged`.
     * @returns {boolean} `true` when an item was updated; `false` when the call was ignored.
     */
    public updateWorkflowItem(
        id: string,
        changes: Partial<WorkflowStep> | Partial<WorkflowConnection> | Partial<WorkflowStickyNote>,
        silent?: boolean
    ): boolean {
        this.assertActive();
        if (this.workflowSettings && this.workflowSettings.readOnly) {
            return false;
        }
        const running: boolean = this.isExecutionActive();
        const step: WorkflowStep | undefined = this.workflowSteps.find((item: WorkflowStep) => item.id === id);
        const next: Record<string, unknown> = Object.assign({}, changes as Record<string, unknown>);
        delete next.id;
        if (running) {
            // Structural properties stay fixed during a run.
            ['stepType', 'sourceStepId', 'targetStepId', 'sourcePort', 'targetPort'].forEach((key: string) => {
                delete next[`${key}`];
            });
        } else {
            this.recordItemEdit(id, next);
        }
        if (step) {
            // Track changed properties for the event
            const changedProperties: WorkflowPropertyChange[] = [];
            const keys: string[] = Object.keys(next);
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[parseInt(i.toString(), 10)];
                const stepValue: any = (step as any)[`${key}`];
                const nextValue: any = next[`${key}`];
                changedProperties.push({
                    propertyName: key,
                    previousValue: stepValue,
                    newValue: nextValue
                });
            }
            this.remapSwitchBranchConnections(step, next);
            Object.assign(step, next);
            const orphanConnectionIds: string[] = this.getMapper()
                .updateNode(id, next as Partial<WorkflowStep>);
            // Splice the cascade-removed connections (e.g. Switch branch delete)
            // from the public collection and registry so model + Diagram stay
            // in lockstep.
            if (orphanConnectionIds && orphanConnectionIds.length) {
                orphanConnectionIds.forEach((orphanId: string) => {
                    const index: number = this.workflowConnections.findIndex(
                        (item: WorkflowConnection) => item.id === orphanId
                    );
                    if (index !== -1) {
                        this.workflowConnections.splice(index, 1);
                    }
                    this.registry.unregister(orphanId);
                });
            }
            // Switch branch add/remove updates ports + height without selectionChange;
            // sync public step.size and refresh Add userHandles to match ports.
            if (next.props !== undefined || next.stepType !== undefined) {
                if (step.stepType === 'Switch') {
                    const liveNode: NodeModel | null = this.canvasRenderer && this.canvasRenderer.getMapper()
                        ? this.canvasRenderer.getMapper().getNodeForStep(id)
                        : null;
                    if (liveNode && typeof liveNode.height === 'number') {
                        step.size = {
                            width: typeof liveNode.width === 'number' ? liveNode.width : 180,
                            height: liveNode.height
                        };
                    }
                }
                if (this.canvasRenderer) {
                    this.canvasRenderer.refreshSelectionHandles();
                }
            }
            if (!silent) {
                this.emitChanged({ changeType: 'StepModified', affectedItem: step, changedProperties });
            }
            return true;
        }
        const connection: WorkflowConnection | undefined = this.workflowConnections.find(
            (item: WorkflowConnection) => item.id === id
        );
        if (connection) {
            // Track changed properties for the event
            const changedProperties: WorkflowPropertyChange[] = [];
            const keys: string[] = Object.keys(next);
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[parseInt(i.toString(), 10)];
                const connValue: any = (connection as any)[`${key}`];
                const nextValue: any = next[`${key}`];
                changedProperties.push({
                    propertyName: key,
                    previousValue: connValue,
                    newValue: nextValue
                });
            }
            Object.assign(connection, next);
            this.getMapper().updateConnector(id, next as Partial<WorkflowConnection>);
            this.repaintConnectorState(id);
            if (!silent) {
                this.emitChanged({ changeType: 'ConnectionModified', affectedItem: connection, changedProperties });
            }
            return true;
        }
        const note: WorkflowStickyNote | undefined = this.stickyNotes.find((item: WorkflowStickyNote) => item.id === id);
        if (note) {
            // Track changed properties for the event
            const changedProperties: WorkflowPropertyChange[] = [];
            const keys: string[] = Object.keys(next);
            for (let i: number = 0; i < keys.length; i++) {
                const key: string = keys[parseInt(i.toString(), 10)];
                const noteValue: any = (note as any)[`${key}`];
                const nextValue: any = next[`${key}`];
                changedProperties.push({
                    propertyName: key,
                    previousValue: noteValue,
                    newValue: nextValue
                });
            }
            Object.assign(note, next);
            this.getMapper().updateStickyNote(id, next as Partial<WorkflowStickyNote>);
            if (!silent) {
                this.emitChanged({ changeType: 'StickyNoteModified', affectedItem: note, changedProperties });
            }
            return true;
        }
        return false;
    }

    /**
     * Type guard that narrows an unknown value to a plain object record.
     *
     * @param {unknown} value - The value to test.
     * @returns {boolean} Whether the value is a plain object record.
     */
    private isRecord(value: unknown): value is Record<string, unknown> {
        return value !== null && typeof value === 'object' && !Array.isArray(value);
    }

    /**
     * Keeps outgoing connections attached when a Switch branch is renamed.
     *
     * @param {WorkflowStep} step - The Switch step.
     * @param {Record<string, object>} changes - The proposed changes.
     * @returns {void} Nothing.
     */
    private remapSwitchBranchConnections(step: WorkflowStep, changes: Record<string, unknown>): void {
        if (step.stepType !== 'Switch' || !this.isRecord(changes.props)) {
            return;
        }
        const previousProps: Record<string, unknown> = this.isRecord(step.props) ? step.props : {};
        const previousBranches: unknown[] = Array.isArray(previousProps.branches)
            ? previousProps.branches
            : [];
        const nextProps: Record<string, unknown> = changes.props;
        const nextBranches: unknown[] = Array.isArray(nextProps.branches) ? nextProps.branches : [];
        const renamedPorts: Array<{ oldName: string; newName: string }> = [];
        const count: number = Math.min(previousBranches.length, nextBranches.length);
        for (let index: number = 0; index < count; index++) {
            const previousBranch: unknown = previousBranches[parseInt(index.toString(), 10)];
            const nextBranch: unknown = nextBranches[parseInt(index.toString(), 10)];
            if (!this.isRecord(previousBranch) || !this.isRecord(nextBranch)) {
                continue;
            }
            const oldName: string = typeof previousBranch.branchName === 'string'
                ? previousBranch.branchName
                : '';
            const newName: string = typeof nextBranch.branchName === 'string'
                ? nextBranch.branchName
                : '';
            if (oldName && newName && oldName !== newName) {
                renamedPorts.push({ oldName, newName });
            }
        }
        renamedPorts.forEach(({ oldName, newName }: { oldName: string; newName: string }) => {
            this.workflowConnections
                .filter((connection: WorkflowConnection) =>
                    connection.sourceStepId === step.id && connection.sourcePort === oldName)
                .forEach((connection: WorkflowConnection) => {
                    connection.sourcePort = newName;
                    this.getMapper().updateConnector(connection.id, { sourcePort: newName });
                });
        });
    }

    /**
     * Removes the step, connection or sticky note with the given identifier and triggers
     * `workflowChanged`. Removing a step also removes every connection attached to it.
     *
     * The call is ignored when the Workflow Designer is read-only, no item has the given identifier,
     * or a `beforeItemRemove` handler cancels it.
     *
     * @param {string} id - The identifier of the item to remove.
     * @returns {boolean} `true` when the item was removed; `false` when the call was ignored.
     * @private
     */
    public removeWorkflowItem(id: string): boolean {
        return this.removeItem(id, false);
    }

    /**
     * Removes an item, raising `beforeItemRemove` unless `confirmed` is true.
     *
     * @param {string} id - The identifier of the item to remove.
     * @param {boolean} confirmed - `true` when an asynchronous `beforeItemRemove` already allowed it.
     * @returns {boolean} `true` when the item was removed now.
     */
    private removeItem(id: string, confirmed: boolean): boolean {
        this.assertActive();
        const target: WorkflowStep | WorkflowConnection | WorkflowStickyNote | undefined =
            this.workflowSteps.find((item: WorkflowStep) => item.id === id)
            || this.workflowConnections.find((item: WorkflowConnection) => item.id === id)
            || this.stickyNotes.find((item: WorkflowStickyNote) => item.id === id);
        if (target && !confirmed && !this.isEditLocked()) {
            const before: WorkflowBeforeItemRemoveEventArgs = { item: target, cancel: false };
            this.trigger('beforeItemRemove', before);
            if (isPromiseLike(before.cancel)) {
                // Keep the item for now and remove it once the handler allows it.
                resolveCancel(before.cancel).then((cancelled: boolean) => {
                    if (!cancelled && !this.disposed) {
                        this.removeItem(id, true);
                    }
                });
                return false;
            }
            if (before.cancel) {
                return false;
            }
        }
        if (this.isEditLocked()) {
            return false;
        }
        const stepIndex: number = this.workflowSteps.findIndex((item: WorkflowStep) => item.id === id);
        if (stepIndex !== -1) {
            const removedStep: WorkflowStep = this.workflowSteps[parseInt(stepIndex.toString(), 10)];
            const canvasRenderer: CanvasRenderer | null = this.canvasRenderer;
            const groupRenderer: CanvasRenderer & {
                startGroupAction?: () => void;
                endGroupAction?: () => void;
            } | null = canvasRenderer as (CanvasRenderer & {
                startGroupAction?: () => void;
                endGroupAction?: () => void;
            }) | null;
            if (groupRenderer && typeof groupRenderer.startGroupAction === 'function') {
                groupRenderer.startGroupAction();
            }
            try {
                const orphanIds: string[] = this.getMapper().removeNode(id);
                this.workflowSteps.splice(stepIndex, 1);
                orphanIds.forEach((orphanId: string) => {
                    const connectionIndex: number = this.workflowConnections.findIndex(
                        (item: WorkflowConnection) => item.id === orphanId
                    );
                    if (connectionIndex !== -1) {
                        this.workflowConnections.splice(connectionIndex, 1);
                    }
                    this.registry.unregister(orphanId);
                });
                this.registry.unregister(id);
                this.emitChanged({ changeType: 'StepRemoved', affectedItem: removedStep });
            } finally {
                if (groupRenderer && typeof groupRenderer.endGroupAction === 'function') {
                    groupRenderer.endGroupAction();
                }
            }
            return true;
        }
        const connectionIndex: number = this.workflowConnections.findIndex((item: WorkflowConnection) => item.id === id);
        if (connectionIndex !== -1) {
            const removedConnection: WorkflowConnection = this.workflowConnections[parseInt(connectionIndex.toString(), 10)];
            this.getMapper().removeConnector(id);
            this.workflowConnections.splice(connectionIndex, 1);
            this.registry.unregister(id);
            this.emitChanged({ changeType: 'ConnectionRemoved', affectedItem: removedConnection });
            return true;
        }
        const noteIndex: number = this.stickyNotes.findIndex((item: WorkflowStickyNote) => item.id === id);
        if (noteIndex !== -1) {
            const removedNote: WorkflowStickyNote = this.stickyNotes[parseInt(noteIndex.toString(), 10)];
            this.getMapper().removeStickyNote(id);
            this.stickyNotes.splice(noteIndex, 1);
            this.registry.unregister(id);
            this.emitChanged({ changeType: 'StickyNoteRemoved', affectedItem: removedNote });
            return true;
        }
        return false;
    }

    /**
     * Serializes the public workflow collections. The host-facing surface
     * for raw JSON is `exportWorkflow()`; this private helper is the
     * canonical round-trip path used by the `workflowChanged`
     * event payload, the simulation controller's `getDefinition` hook,
     * etc.
     *
     * @private
     * @returns {WorkflowDefinitionModel} The workflow definition.
     */
    private _toWorkflowJson(): WorkflowDefinitionModel {
        this.assertActive();
        if (this.canvasRenderer && this.canvasRenderer.getMapper()) {
            this.getMapper().syncGeometryFromDiagram(
                this.workflowSteps,
                this.stickyNotes || []
            );
        }
        return this.serializer.serialize({
            workflowSteps: this.workflowSteps,
            workflowConnections: this.workflowConnections,
            stickyNotes: this.stickyNotes,
            id: this.ensureWorkflowId(),
            name: this.projectName,
            credentialMode: this.executionSettings && this.executionSettings.credentialMode === 'Inline' ? 'Inline' : 'Reference'
        });
    }

    /**
     * Drops the legacy `credential` prop from imported AI steps so a raw key stored by an
     * early build is never kept. `credentialRef` (a reference name) and `apiKey` (an Inline-mode
     * key) are kept.
     *
     * @param {WorkflowDefinitionModel} definition - The partially-validated definition.
     * @returns {void}
     */
    private static dropLegacyCredentialProps(definition: WorkflowDefinitionModel): void {
        if (!definition || !Array.isArray(definition.workflowSteps)) {
            return;
        }
        for (let s: number = 0; s < definition.workflowSteps.length; s++) {
            const step: WorkflowStep = definition.workflowSteps[parseInt(s.toString(), 10)];
            if (!step || !step.props || typeof step.props !== 'object') {
                continue;
            }
            const props: Record<string, unknown> = step.props as Record<string, unknown>;
            if ('credential' in props) {
                delete props.credential;
            }
        }
    }

    /**
     * Validates and replaces the public workflow collections and routes
     * the JSON through the serializer. The host-facing surface for raw
     * JSON is `importWorkflow()`; this private helper is the canonical
     * round-trip path used by every import-site in the component.
     *
     * Important: a workflow that an author has just authored and is now
     * round-tripping via the in-app load flow usually contains steps the
     * author has not yet configured (a freshly inserted Approve step has
     * empty reviewers / requestFields, a Notify step has no channel / to,
     * etc). Rejecting the load would block the very developer workflow the
     * designer is built for. Rounds therefore run only the structural
     * subset of `WorkflowValidator` checks (schema, IDs, triggers, connection
     * endpoints, cycles, secret-paths) — the same checks that would reject
     * an actually-broken file. Per-field required/missing-value and
     * configured-but-invalid rules are deferred to `runExecution()` so the
     * author still sees them as soon as they attempt to execute, but can
     * load and edit the file without a hard error.
     *
     * @private
     * @param {WorkflowDefinitionModel | string} definition - The workflow definition or JSON string.
     * @returns {void} Nothing.
     */
    private _fromWorkflowJson(definition: WorkflowDefinitionModel | string): void {
        this.assertActive();
        const normalized: WorkflowDefinitionModel = this.serializer.deserialize(definition);
        WorkflowDesigner.dropLegacyCredentialProps(normalized);
        // Only problems that make the graph impossible to build block an import.
        // Content problems (expressions, required fields, types, URLs) are loaded
        // and reported by validation, so a workflow saved mid-edit can always be
        // reopened.
        const report: WorkflowValidationResult = new WorkflowValidator(this.l10n, this.credentialMode()).validateStructure(normalized);
        const blocking: WorkflowValidationMessage[] = report.messages.filter(
            (message: WorkflowValidationMessage) => message.type === 'Error' && WorkflowDesigner.isStructuralCode(message.code));
        if (blocking.length) {
            throw new WorkflowImportError(WorkflowDesigner.describeMessages(blocking), blocking, 'IMPORT_INVALID_STRUCTURE');
        }
        // The workflow being replaced may be running (import, or AI Assist apply).
        this.stopActiveRun();
        this.applyDefinition(normalized, true);
        // A freshly loaded workflow has no unsaved changes.
        this.dirty = false;
        // Imported content replaces the previous workflow, so any execution
        // log timings/details captured for that workflow are stale — refresh
        // the simulation state and the Execution Log to match the import.
        if (this.simulationController) {
            this.simulationController.resetSimulation();
            this.simulationController.validateWorkflow();
        }
        if (this.simulationLog) {
            this.simulationLog.clear();
        }
        // Fit imported workflow to page view
        const diagram: Diagram | null = this.canvasRenderer ? this.canvasRenderer.getDiagram() : null;
        if (diagram) {
            diagram.fitToPage();
        }
    }

    /**
     * Returns the current workflow as a JSON string.
     *
     * Secrets are always left out: inline AI keys and the values of sensitive request headers.
     * Credential references are kept.
     *
     * @returns {string} The workflow JSON.
     */
    public exportWorkflow(): string {
        this.assertActive();
        return JSON.stringify(this._toWorkflowJson());
    }

    /**
     * Returns a copy of the current workflow. Changing the copy does not change the designer; use
     * `importWorkflow` or the item methods for that. Secrets are left out, as in `exportWorkflow`.
     *
     * @returns {WorkflowDefinitionModel} The workflow definition.
     * @private
     */
    public getWorkflow(): WorkflowDefinitionModel {
        this.assertActive();
        return JSON.parse(JSON.stringify(this._toWorkflowJson())) as WorkflowDefinitionModel;
    }

    /**
     * Whether the workflow has changed since it was loaded or since `markClean()` was last called.
     * Use it to warn about unsaved changes.
     *
     * @returns {boolean} `true` when there are unsaved changes.
     * @private
     */
    public isDirty(): boolean {
        return !!this.dirty;
    }

    /**
     * Marks the current workflow as saved, so `isDirty()` returns `false` until the next change.
     *
     * @returns {void}
     * @private
     */
    public markClean(): void {
        this.dirty = false;
    }

    /**
     * Selects a step, sticky note or connection on the canvas and opens it in the property panel.
     *
     * @param {string} id - The item ID.
     * @returns {boolean} `true` when the item was found.
     * @private
     */
    public selectItem(id: string): boolean {
        this.assertActive();
        return this.canvasRenderer ? this.canvasRenderer.selectItem(id) : false;
    }

    /**
     * Scrolls the canvas so a step, sticky note or connection is visible.
     *
     * @param {string} id - The item ID.
     * @returns {boolean} `true` when the item was found.
     * @private
     */
    public bringIntoView(id: string): boolean {
        this.assertActive();
        return this.canvasRenderer ? this.canvasRenderer.bringIntoView(id) : false;
    }

    /**
     * Zooms and scrolls the canvas so the whole workflow is visible.
     *
     * @returns {void}
     * @private
     */
    public fitToPage(): void {
        this.assertActive();
        if (this.canvasRenderer) {
            this.canvasRenderer.fitToPage();
        }
    }

    /**
     * Sets the canvas zoom level, where `1` is 100%.
     *
     * @param {number} zoom - The zoom level. Values of `0` or less are ignored.
     * @returns {void}
     * @private
     */
    public zoomTo(zoom: number): void {
        this.assertActive();
        if (this.canvasRenderer) {
            this.canvasRenderer.setZoom(zoom);
        }
    }

    /**
     * Downloads the current workflow as a JSON file in the browser.
     *
     * @param {string} fileName - The file name; `.json` is added when it has no extension.
     * @returns {void}
     * @private
     */
    public saveWorkflow(fileName: string): void {
        this.assertActive();
        this.downloadJson(this.exportWorkflow(), fileName || this.getExportFileName());
    }

    /** Stable codes for host-facing errors; messages are localized, codes never change. */
    private static readonly hostErrorCodes: { [key: string]: string } = {
        errorImportInvalidJson: 'IMPORT_INVALID_JSON',
        errorImportTooLarge: 'IMPORT_TOO_LARGE',
        errorRunInProgress: 'RUN_IN_PROGRESS',
        errorWebhookInvalidMessage: 'WEBHOOK_INVALID_MESSAGE',
        errorWebhookIdsRequired: 'WEBHOOK_IDS_REQUIRED',
        errorWebhookWorkflowMismatch: 'WEBHOOK_WORKFLOW_MISMATCH',
        errorWebhookTriggerNotFound: 'WEBHOOK_TRIGGER_NOT_FOUND',
        errorWebhookMethod: 'WEBHOOK_METHOD_MISMATCH',
        errorWebhookPath: 'WEBHOOK_PATH_MISMATCH',
        errorWebhookAuth: 'WEBHOOK_AUTH_REQUIRED',
        errorAIAssistDisabled: 'AI_ASSIST_DISABLED',
        errorAIAssistCredential: 'CREDENTIAL_UNRESOLVED'
    };

    /**
     * Returns a localized message with its `{0}`, `{1}`, ... placeholders filled in.
     *
     * @param {string} key - The locale key.
     * @param {string[]} [args] - Values for the placeholders.
     * @returns {string} The message.
     */
    private formatText(key: string, args?: string[]): string {
        let message: string = (this.l10n && this.l10n.getConstant(key)) || localeDefaults[`${key}`] || key;
        (args || []).forEach((value: string, index: number) => {
            message = message.split('{' + index + '}').join(value);
        });
        return message;
    }

    /**
     * Creates a localized host-facing error with a stable `code`.
     *
     * @param {string} key - The locale key.
     * @param {string[]} [args] - Values for the `{0}`, `{1}`, ... placeholders.
     * @param {boolean} [importError] - When true, a `WorkflowImportError` is created.
     * @returns {WorkflowError} The error.
     */
    private hostError(key: string, args?: string[], importError?: boolean): WorkflowError {
        const message: string = this.formatText(key, args);
        const code: string = WorkflowDesigner.hostErrorCodes[`${key}`];
        return importError ? new WorkflowImportError(message, [], code) : new WorkflowError(message, code);
    }

    /** Validation codes that make a workflow graph impossible to build; only these block an import. */
    private static readonly structuralCodes: string[] = [
        'ID_REQUIRED', 'ID_DUPLICATE', 'ID_INVALID', 'CONNECTION_ENDPOINT', 'CONNECTION_SELF',
        'CONNECTION_DUPLICATE', 'SOURCE_PORT_INVALID', 'TARGET_PORT_INVALID', 'CYCLE',
        'MERGE_TOPOLOGY', 'TRIGGER_INCOMING'
    ];

    private static isStructuralCode(code: string | undefined): boolean {
        return !!code && WorkflowDesigner.structuralCodes.indexOf(code) !== -1;
    }

    /**
     * Builds one readable message from validation messages: each says where the
     * problem is (step or connection, and field), and repeats are removed.
     *
     * @param {WorkflowValidationMessage[]} messages - The messages to describe.
     * @returns {string} The combined description.
     */
    private static describeMessages(messages: WorkflowValidationMessage[]): string {
        const seen: { [text: string]: boolean } = Object.create(null);
        const parts: string[] = [];
        messages.forEach((message: WorkflowValidationMessage) => {
            const record: { stepId?: string; connectionId?: string; propertyPath?: string } =
                message as unknown as { stepId?: string; connectionId?: string; propertyPath?: string };
            const where: string[] = [];
            if (record.stepId) {
                where.push('step \'' + record.stepId + '\'');
            }
            if (record.connectionId) {
                where.push('connection \'' + record.connectionId + '\'');
            }
            if (record.propertyPath) {
                where.push(record.propertyPath);
            }
            const text: string = message.message + (where.length ? ' (' + where.join(', ') + ')' : '');
            if (!seen[`${text}`]) {
                seen[`${text}`] = true;
                parts.push(text);
            }
        });
        return parts.join(' ') || 'Imported workflow failed validation.';
    }

    /**
     * Replaces the current workflow with one loaded from a `File`, a JSON string or a workflow object.
     * A run in progress is stopped before the new workflow is loaded.
     *
     * The returned promise always settles; this method never throws synchronously. It rejects with a
     * `WorkflowImportError` (code `'IMPORT_UNSUPPORTED_VERSION'` for unsupported schema versions) when the input
     * is malformed, larger than 5 MB or structurally invalid. On rejection the current workflow is left unchanged.
     *
     * @param {File | string | WorkflowDefinitionModel} fileOrJson - The workflow to load.
     * @returns {Promise<void>} Resolves when the workflow is loaded.
     */
    public importWorkflow(fileOrJson: File | string | WorkflowDefinitionModel): Promise<void> {
        try {
            this.assertActive();
            this.bindLocale();
        } catch (error) {
            return Promise.reject(error);
        }
        const load: (input: string | WorkflowDefinitionModel) => void = (input: string | WorkflowDefinitionModel): void => {
            this._fromWorkflowJson(input);
        };
        if (typeof fileOrJson !== 'object' || !(fileOrJson instanceof File)) {
            try {
                load(fileOrJson as string | WorkflowDefinitionModel);
                return Promise.resolve();
            } catch (error) {
                return Promise.reject(error);
            }
        }
        if (fileOrJson.size > 5 * 1024 * 1024) {
            return Promise.reject(this.hostError('errorImportTooLarge', [], true));
        }
        return this.readFile(fileOrJson).then((json: string) => load(json));
    }

    /**
     * Reverts the most recent change recorded on the canvas. Does nothing when there is nothing to undo.
     *
     * @returns {void}
     * @private
     */
    public undo(): void {
        this.assertActive();
        if (this.isExecutionActive()) {
            return;
        }
        const diagram: Diagram | null = this.canvasRenderer ? this.canvasRenderer.getDiagram() : null;
        if (diagram) {
            diagram.undo();
        }
    }

    /**
     * Reapplies the most recently undone change. Does nothing when there is nothing to redo.
     *
     * @returns {void}
     * @private
     */
    public redo(): void {
        this.assertActive();
        if (this.isExecutionActive()) {
            return;
        }
        const diagram: Diagram | null = this.canvasRenderer ? this.canvasRenderer.getDiagram() : null;
        if (diagram) {
            diagram.redo();
        }
    }

    /**
     * Updates toolbar state for every history event and synchronizes model state after replay.
     *
     * @param {boolean} canUndo Whether undo is available.
     * @param {boolean} canRedo Whether redo is available.
     * @param {string} action The Diagram history action.
     * @returns {void} Nothing.
     * @private
     */
    private onDiagramHistoryChange(
        canUndo: boolean,
        canRedo: boolean,
        action?: IHistoryChangeArgs['action']
    ): void {
        if (this.topToolbar) {
            this.topToolbar.applyUndoRedoAvailability(canUndo, canRedo);
        }
        if (action === 'Undo' || action === 'Redo') {
            this.syncWorkflowModelFromDiagram();
        }
    }

    /**
     * Synchronizes public workflow collections and mapper indexes after Diagram history replay.
     *
     * @returns {void} Nothing.
     * @private
     */
    private syncWorkflowModelFromDiagram(): void {
        const mapper: DiagramMapper | null = this.canvasRenderer ? this.canvasRenderer.getMapper() : null;
        if (!mapper) {
            return;
        }
        const restored: {
            workflowSteps: WorkflowStep[];
            workflowConnections: WorkflowConnection[];
            stickyNotes: WorkflowStickyNote[];
        } = mapper.syncWorkflowItemsFromDiagram();
        const sameIds: (current: Array<{ id?: string }>, next: Array<{ id?: string }>) => boolean = (
            current: Array<{ id?: string }>,
            next: Array<{ id?: string }>
        ): boolean => JSON.stringify(current.map((item: { id?: string }): string | undefined => item.id))
            === JSON.stringify(next.map((item: { id?: string }): string | undefined => item.id));
        const changed: boolean = !sameIds(this.workflowSteps, restored.workflowSteps)
            || !sameIds(this.workflowConnections, restored.workflowConnections)
            || !sameIds(this.stickyNotes, restored.stickyNotes);
        if (!changed) {
            return;
        }

        this.workflowSteps = restored.workflowSteps;
        this.workflowConnections = restored.workflowConnections;
        this.stickyNotes = restored.stickyNotes;
        this.rebuildRegistry();
        this.emitChanged();
    }

    /**
     * Runs the workflow starting at the given step, using `context` as the runtime data available to
     * it (for example, saved output from an earlier run). Use it to test one step or branch without
     * running the triggers before it. Rejects while another run is in progress.
     *
     * @param {string} stepId - The id of the step to start from.
     * @param {WorkflowRuntimeContext} [context] - Runtime data available to the step.
     * @returns {Promise<WorkflowExecutionResult>} The run result.
     * @private
     */
    public runFromStep(stepId: string, context?: WorkflowRuntimeContext): Promise<WorkflowExecutionResult> {
        this.assertActive();
        this.bindLocale();
        if (this.isExecutionActive()) {
            return Promise.reject(this.hostError('errorRunInProgress'));
        }
        if (!this.simulationController) {
            return Promise.resolve({ status: 'Failed' as WorkflowExecutionStatus, stepResults: [], visitedConnections: [] as string[] });
        }
        return this.simulationController.runFromStep(stepId, context);
    }


    /**
     * Arranges the workflow steps automatically in a left-to-right hierarchical layout and triggers
     * `workflowChanged`.
     *
     * @returns {void}
     * @private
     */
    public layoutWorkflow(): void {
        this.assertActive();
        if (this.canvasRenderer) {
            this.canvasRenderer.runLayout(this.workflowSteps, () => this.emitChanged());
        }
    }

    /**
     * Asks the user to confirm before the Clear command (toolbar or Ctrl+Backspace) removes the
     * whole workflow. Nothing is shown when the workflow is empty or read-only.
     *
     * @returns {void} Nothing.
     * @private
     */
    private confirmClearWorkflow(): void {
        if (this.disposed || this.isEditLocked()) {
            return;
        }
        const hasContent: boolean = this.workflowSteps.length > 0 || this.workflowConnections.length > 0
            || this.stickyNotes.length > 0;
        if (!hasContent || this.clearConfirmDialog) {
            return;
        }
        const text: (key: string) => string = (key: string): string => this.formatText(key);
        const dialog: Dialog = DialogUtility.confirm({
            title: text('clearWorkflowTitle'),
            content: text('clearWorkflowMessage'),
            okButton: {
                text: text('clearWorkflowConfirm'),
                click: (): void => {
                    dialog.hide();
                    if (!this.disposed) {
                        this.clearWorkflow();
                    }
                }
            },
            cancelButton: { text: text('cancel') },
            showCloseIcon: true,
            closeOnEscape: true,
            position: { X: 'center', Y: 'center' },
            animationSettings: { effect: 'None' },
            close: (): void => {
                this.clearConfirmDialog = null;
                // Release the dialog once its close event has finished.
                setTimeout(() => {
                    if (!dialog.isDestroyed) {
                        const host: HTMLElement = dialog.element;
                        dialog.destroy();
                        if (host && host.parentNode) {
                            host.parentNode.removeChild(host);
                        }
                    }
                }, 0);
            }
        });
        this.clearConfirmDialog = dialog;
    }

    /**
     * Removes all steps, connections and sticky notes, resets the run state and triggers
     * `workflowChanged` once. Unlike the Clear toolbar command, this method does not ask for
     * confirmation. A run in progress is stopped first. Does nothing when the workflow is read-only.
     *
     * The call is ignored when the Workflow Designer is read-only or the workflow is already empty.
     *
     * @returns {void}
     * @private
     */
    public clearWorkflow(): void {
        this.assertActive();
        if (this.workflowSettings && this.workflowSettings.readOnly) {
            return;
        }
        this.stopActiveRun();
        const hasContent: boolean =
            (this.workflowSteps && this.workflowSteps.length > 0)
            || (this.workflowConnections && this.workflowConnections.length > 0)
            || (this.stickyNotes && this.stickyNotes.length > 0);
        if (!hasContent) {
            return;
        }
        const diagram: Diagram | null = this.canvasRenderer ? this.canvasRenderer.getDiagram() : null;
        if (diagram) {
            diagram.clear();
        }
        // diagram.clear() empties the Diagram; mirror that on the public
        // collections so the model + canvas do not drift.
        this.workflowSteps = [];
        this.workflowConnections = [];
        this.stickyNotes = [];
        this.registry.clear();
        this.selectedItem = null;
        if (this.canvasRenderer) {
            this.canvasRenderer.clearSelection();
        }
        this.clearUndoHistory();
        if (this.simulationController) {
            this.simulationController.resetSimulation();
        }
        if (this.simulationLog) {
            this.simulationLog.clear();
        }
        this.emitChanged();
    }

    /**
     * Initializes the keyboard handler for global keyboard shortcuts.
     *
     * @param {Diagram} diagram - The Diagram instance for zoom operations.
     * @returns {void} Nothing.
     * @private
     */
    private initializeKeyboardHandler(diagram: Diagram): void {
        if (!this.element) {
            return;
        }

        const keyboardHandlerCallbacks: KeyboardHandlerCallbacks = {
            executeRun: () => this.runExecution(),
            stopExecution: () => this.stopExecution(),
            undo: () => this.undo(),
            redo: () => this.redo(),
            exportWorkflow: () => this.saveWorkflow(this.getExportFileName()),
            importWorkflow: () => this.triggerImportFile(),
            addStickyNote: () => this.addStickyNoteAtViewportCenter(),
            autoArrange: () => this.layoutWorkflow(),
            navigate: (direction: 'Left' | 'Right' | 'Up' | 'Down') => this.navigateSelection(direction),
            openSelected: () => this.openSelectedInPanel(),
            addNextStep: () => this.addNextToSelectedStep(),
            zoomIn: () => diagram.zoomTo({ type: 'ZoomIn', zoomFactor: 0.2 }),
            zoomOut: () => diagram.zoomTo({ type: 'ZoomOut', zoomFactor: 0.2 }),
            fitToPage: () => diagram.fitToPage(),
            resetZoom: () => {
                const currentZoom: number = diagram.scrollSettings.currentZoom || 1;
                diagram.zoomTo({ zoomFactor: 1 / currentZoom });
                diagram.reset();
            },
            toggleLock: () => this.toggleReadOnly(),
            selectTool: () => {
                diagram.tool = DiagramTools.SingleSelect | DiagramTools.MultipleSelect;
            },
            panTool: () => {
                diagram.tool = DiagramTools.ZoomPan;
            },
            clearDiagram: () => this.confirmClearWorkflow()
        };

        this.keyboardHandler = new KeyboardHandler(
            this.element,
            keyboardHandlerCallbacks,
            () => this.isExecutionActive()
        );

        this.keyboardHandler.attach();
    }

    /**
     * The state of the current or most recent run: `'Idle'`, `'Scheduled'` (a Scheduled Trigger is
     * waiting for its next occurrence), `'Running'`, `'WaitingForHuman'`,
     * `'Completed'`, `'Failed'`, `'Stopped'` or `'Cancelled'`. Read-only.
     *
     * @default 'Idle'
     * @returns {WorkflowExecutionState} The execution state.
     * @private
     */
    public get executionState(): WorkflowExecutionState {
        return this.simulationState;
    }

    private credentialMode(): 'Reference' | 'Inline' {
        return this.executionSettings && this.executionSettings.credentialMode === 'Inline' ? 'Inline' : 'Reference';
    }

    /**
     * Makes this instance's localization current for shared helpers (see `LocaleContext`).
     *
     * @returns {void} Nothing.
     */
    private bindLocale(): void {
        LocaleContext.set(this.l10n);
    }

    /** Events after which code runs on behalf of this instance; bound in the capture phase. */
    private static readonly localeEvents: string[] = [
        'pointerdown', 'mousedown', 'touchstart', 'click', 'dblclick', 'keydown', 'keyup',
        'input', 'change', 'focusin', 'wheel', 'dragstart', 'drop', 'paste'
    ];

    private onLocaleEvent: () => void;

    private bindLocaleEvents(add: boolean): void {
        if (!this.element) {
            return;
        }
        WorkflowDesigner.localeEvents.forEach((name: string) => {
            if (add) {
                this.element.addEventListener(name, this.onLocaleEvent, true);
            } else {
                this.element.removeEventListener(name, this.onLocaleEvent, true);
            }
        });
    }

    /**
     * Validates the workflow and returns the result, including any errors, warnings and
     * informational messages.
     *
     * @returns {WorkflowValidationResult} The validation result.
     */
    public validateWorkflow(): WorkflowValidationResult {
        this.assertActive();
        this.bindLocale();
        if (!this.simulationController) {
            return { isValid: true, messages: [] };
        }
        return this.simulationController.validateWorkflow();
    }

    /**
     * Starts a run of the workflow. The execution log is cleared and the state of any previous run
     * is reset before the run starts.
     *
     * The run is validated first and then reports its progress through the `executionStarted`,
     * `executionStepStarted`, `executionStepCompleted`, `executionStepFailed` and `executionCompleted`
     * events. `executionCompleted` fires once for every run, including runs that fail validation.
     *
     * @param {WorkflowRuntimeContext} [context] - The initial runtime context, such as the input data for the trigger step.
     * @param {string} [selectedTriggerId] - The identifier of the trigger step to start from. When omitted and a trigger step is selected on the canvas, the run starts from the selected trigger.
     * @returns {Promise<WorkflowExecutionResult>} A promise that resolves with the result when the run ends.
     */
    public runExecution(context?: WorkflowRuntimeContext, selectedTriggerId?: string): Promise<WorkflowExecutionResult> {
        this.assertActive();
        this.bindLocale();
        if (this.isExecutionActive()) {
            return Promise.reject(this.hostError('errorRunInProgress'));
        }
        if (!this.simulationController) {
            return Promise.resolve({ status: 'Failed' as WorkflowExecutionStatus, stepResults: [], visitedConnections: [] as string[] });
        }

        // Clear simulation logs and reset state before running
        if (this.simulationLog) {
            this.simulationLog.clear();
        }
        if (this.simulationController) {
            this.simulationController.resetSimulation();
        }

        // Clear any node selection before running
        if (this.canvasRenderer) {
            this.canvasRenderer.clearSelection();
        }

        // Full-run start id is trigger-only. Selecting a mid-graph step must not
        // skip the Manual/Schedule trigger in the simulation log path.
        let triggerId: string | undefined = selectedTriggerId;
        const sel: WorkflowStep | WorkflowConnection | WorkflowStickyNote | null = this.selectedItem;
        if (!triggerId && sel && 'stepType' in sel && sel.id && this.isTriggerStepType(sel.stepType)) {
            triggerId = sel.id;
        }
        // Show the Stop button and hide the Execute button before the run starts
        if (this.topToolbar) {
            this.topToolbar.showStopButton();
        }
        const simulationController: SimulationController = this.simulationController;
        this.runPromise = simulationController.runSimulation(context, triggerId);
        // When simulation completes (success or failure), hide the stop button and show play button
        return this.runPromise.then((result: WorkflowExecutionResult) => {
            if (this.topToolbar) {
                this.topToolbar.hideStopButton();
            }
            return result;
        }).catch((error: Error) => {
            if (this.topToolbar) {
                this.topToolbar.hideStopButton();
            }
            throw error;
        });
    }

    /**
     * Returns whether a run is in progress, waiting for its scheduled time or waiting for a person.
     *
     * @returns {boolean} Whether a run is active.
     */
    private isExecutionActive(): boolean {
        const state: string = String(this.simulationState || 'Idle');
        return state === 'Running' || state === 'Scheduled' || state === 'WaitingForHuman';
    }

    /**
     * Returns the workflow's id, creating one for a workflow that was built in the designer and
     * never had one, so its exports and webhook messages can refer to it.
     *
     * @returns {string} The workflow id.
     */
    private ensureWorkflowId(): string {
        if (!this.workflowDefinitionId) {
            this.workflowDefinitionId = getUniqueID('workflow');
        }
        return this.workflowDefinitionId;
    }

    /**
     * Whether editing is blocked: the workflow is read-only or a run is in progress.
     *
     * @returns {boolean} `true` when the canvas and panels must not change the workflow.
     */
    private isEditLocked(): boolean {
        return Boolean(this.workflowSettings && this.workflowSettings.readOnly) || this.isExecutionActive();
    }

    /**
     * Records the run state and, when a run starts or ends, locks or unlocks editing.
     *
     * @param {WorkflowExecutionState} state - The new run state.
     * @returns {void} Nothing.
     */
    private setExecutionState(state: WorkflowExecutionState): void {
        const wasActive: boolean = this.isExecutionActive();
        const previous: WorkflowExecutionState = this.simulationState;
        this.simulationState = state;
        if (state !== previous && this.ariaLive && !this.disposed) {
            const key: string = WorkflowDesigner.runAnnouncementKeys[`${state}`];
            if (key) {
                this.ariaLive.announce(this.l10n.getConstant(key) || localeDefaults[`${key}`]);
            }
        }
        if (wasActive !== this.isExecutionActive() && !this.disposed && this.canvasRenderer) {
            if (this.isExecutionActive() && this.nodeCollection && this.nodeCollection.isOpen()) {
                this.nodeCollection.close();
            }
            this.applyWorkflowSettings();
        }
    }

    /**
     * Stops the run in progress, if any, before the workflow is replaced or cleared.
     *
     * @returns {void} Nothing.
     */
    private stopActiveRun(): void {
        if (this.isExecutionActive()) {
            this.stopExecution();
        }
    }

    /**
     * Stops the run in progress. `executionCompleted` is triggered with `result.status` set to `'Stopped'`.
     *
     * @returns {void}
     */
    public stopExecution(): void {
        this.assertActive();
        if (this.simulationController) {
            this.simulationController.stopSimulation();
        }
        // Hide the Stop button and show the Execute button
        if (this.topToolbar) {
            this.topToolbar.hideStopButton();
        }
    }

    /**
     * Triggers a workflow execution from a WebhookTrigger step using an incoming webhook message.
     *
     * This is the transport-neutral public API for webhook triggers. Customers own the transport
     * (SignalR, WebSocket, SSE, polling, custom) and use this method to execute workflows
     * after transport-specific validation and authentication.
     *
     * The method validates that:
     * - The webhook message contains required fields (workflowId, triggerId)
     * - The workflowId matches the workflow's `id` (the `id` in the exported JSON; workflows created in
     *   the designer get one automatically)
     * - A matching WebhookTrigger step exists
     * - No execution is currently running
     *
     * Then it executes the workflow from the matched step with the webhook payload
     * as the runtime input.
     *
     * Example - Customer-owned SignalR transport:
     * ```typescript
     * const connection = new signalR.HubConnectionBuilder()
     *     .withUrl('https://backend.example.com/workflow-hub')
     *     .withAutomaticReconnect()
     *     .build();
     *
     * connection.on('WorkflowWebhookTriggered', async (message) => {
     *     try {
     *         const result = await designer.triggerWebhook(message);
     *         console.log('Execution completed:', result);
     *     } catch (error) {
     *         console.error('Webhook trigger failed:', error);
     *     }
     * });
     * ```
     *
     * The returned promise rejects with a `WorkflowError` whose `code` is one of:
     * `WEBHOOK_INVALID_MESSAGE` (missing message, `workflowId` or `triggerId`),
     * `WEBHOOK_IDS_REQUIRED` (empty `workflowId` or `triggerId`), `WEBHOOK_WORKFLOW_MISMATCH`
     * (`workflowId` differs from the loaded workflow's `id`), `RUN_IN_PROGRESS`, `WEBHOOK_TRIGGER_NOT_FOUND`,
     * `WEBHOOK_METHOD_MISMATCH`, `WEBHOOK_PATH_MISMATCH` or `WEBHOOK_AUTH_REQUIRED` (the trigger
     * requires authentication and `message.authenticated` is not true).
     *
     * @param {WorkflowWebhookTriggerMessage} message - The webhook trigger message.
     * @returns {Promise<WorkflowExecutionResult>} The run result.
     */
    public async triggerWebhook(message: WorkflowWebhookTriggerMessage): Promise<WorkflowExecutionResult> {
        this.assertActive();

        // Validate message structure
        if (
            !message ||
            typeof message.workflowId !== 'string' ||
            typeof message.triggerId !== 'string'
        ) {
            throw this.hostError('errorWebhookInvalidMessage');
        }

        const workflowId: string = message.workflowId.trim();
        const triggerId: string = message.triggerId.trim();

        // Validate required fields are not empty
        if (!workflowId || !triggerId) {
            throw this.hostError('errorWebhookIdsRequired');
        }

        // Validate workflowId matches the loaded workflow
        const currentWorkflowId: string = this.ensureWorkflowId().trim();

        if (!currentWorkflowId || workflowId !== currentWorkflowId) {
            throw this.hostError('errorWebhookWorkflowMismatch', [workflowId]);
        }

        // Validate no execution is in progress
        if (this.isExecutionActive()) {
            throw this.hostError('errorRunInProgress');
        }

        // Find the webhook trigger step
        const webhookStep: WorkflowStep | undefined = (this.workflowSteps || [])
            .find(
                (step: WorkflowStep): boolean =>
                    step.stepType === 'WebhookTrigger' &&
                    step.id === triggerId
            );

        if (!webhookStep) {
            throw this.hostError('errorWebhookTriggerNotFound', [triggerId]);
        }
        const webhookProps: Partial<WebhookTriggerStepProps> = (webhookStep.props || {}) as Partial<WebhookTriggerStepProps>;
        const receivedMethod: string | undefined = (message.context && message.context.method) || message.method;
        if (receivedMethod && webhookProps.method && receivedMethod.toUpperCase() !== String(webhookProps.method).toUpperCase()) {
            throw this.hostError('errorWebhookMethod', [triggerId, String(webhookProps.method), receivedMethod]);
        }
        const receivedPath: string | undefined = (message.context && message.context.path) || message.path;
        if (receivedPath && webhookProps.path && normalizeWebhookPath(receivedPath) !== normalizeWebhookPath(String(webhookProps.path))) {
            throw this.hostError('errorWebhookPath', [triggerId, receivedPath]);
        }
        if (webhookProps.authMode && webhookProps.authMode !== 'None' && message.authenticated !== true) {
            throw this.hostError('errorWebhookAuth', [triggerId, String(webhookProps.authMode)]);
        }

        // Build the execution input with webhook payload and context
        return this.runExecution(
            {
                input: {
                    response: message.payload as Object,
                    webhook: {
                        eventId: message.eventId,
                        executionId: message.executionId,
                        workflowId: workflowId,
                        triggerId: triggerId,
                        method: message.context && message.context.method ? message.context.method : message.method,
                        path: message.context && message.context.path ? message.context.path : message.path,
                        receivedAt: message.context && message.context.receivedAt ? message.context.receivedAt : message.receivedAt,
                        headers: message.context ? message.context.headers : undefined,
                        sourceIp: message.context ? message.context.sourceIp : undefined
                    }
                }
            },
            webhookStep.id
        );
    }

    /**
     * Resets simulation state and logs.
     *
     * @private
     * @returns {void} Nothing.
     */
    private resetSimulation(): void {
        this.assertActive();
        if (this.simulationController) {
            this.simulationController.resetSimulation();
        }
        if (this.simulationLog) {
            this.simulationLog.clear();
        }
    }

    /**
     * Returns the current runtime context.
     *
     * @private
     * @returns {WorkflowRuntimeContext} The runtime context snapshot.
     */
    private getWorkflowContext(): WorkflowRuntimeContext {
        this.assertActive();
        return this.simulationController ? this.simulationController.contextStore.snapshot() : {};
    }

    /**
     * Generates a new workflow from a natural-language prompt with AI Assist and loads it.
     * Rejects when `aiAssistSettings.enabled` is false or the AI request fails.
     *
     * @param {string} prompt - What the workflow should do.
     * @returns {Promise<WorkflowDefinitionModel>} The generated workflow.
     * @private
     */
    public generateWorkflow(prompt: string): Promise<WorkflowDefinitionModel> {
        this.assertActive();
        if (!this.aiAssistController) {
            return Promise.reject(this.hostError('errorAIAssistDisabled'));
        }
        return this.aiAssistController.generateWorkflow(prompt);
    }

    /**
     * Changes the current workflow from a natural-language prompt with AI Assist and loads the result.
     * Rejects when `aiAssistSettings.enabled` is false or the AI request fails.
     *
     * @param {string} prompt - The change to make.
     * @returns {Promise<WorkflowDefinitionModel>} The updated workflow.
     * @private
     */
    public updateWorkflowFromPrompt(prompt: string): Promise<WorkflowDefinitionModel> {
        this.assertActive();
        if (!this.aiAssistController) {
            return Promise.reject(this.hostError('errorAIAssistDisabled'));
        }
        return this.aiAssistController.updateWorkflowFromPrompt(prompt);
    }

    /**
     * Destroys the Workflow Designer and releases the resources it uses. Calling this method more
     * than once is safe. After the component is destroyed, calling any other public method throws
     * an error.
     *
     * @returns {void}
     */
    public destroy(): void {
        if (this.disposed) {
            return;
        }
        this.disposed = true;
        this.clearTemplate(['workflowStepTemplate']);
        this.bindLocaleEvents(false);
        if (this.clearConfirmDialog) {
            this.clearConfirmDialog.hide();
            this.clearConfirmDialog = null;
        }
        if (LocaleContext.current() === this.l10n) {
            LocaleContext.set(undefined);
        }
        if (this.keyboardHandler) {
            this.keyboardHandler.detach();
            this.keyboardHandler = null;
        }
        if (this.positionSynchronizer) {
            this.positionSynchronizer.dispose();
            this.positionSynchronizer = null;
        }
        if (this.propertyPanel) {
            this.propertyPanel.destroy();
            this.propertyPanel = null;
        }
        if (this.simulationLog) {
            this.simulationLog.destroy();
            this.simulationLog = null;
        }
        if (this.aiAssistController) {
            this.aiAssistController.destroy();
            this.aiAssistController = null;
        }
        if (this.simulationController) {
            this.simulationController.dispose();
            this.simulationController = null;
        }
        if (this.canvasToolbar) {
            this.canvasToolbar.destroy();
            this.canvasToolbar = null;
        }
        if (this.topToolbar) {
            this.topToolbar.destroy();
            this.topToolbar = null;
        }
        if (this.ariaLive) {
            this.ariaLive.destroy();
            this.ariaLive = null;
        }
        if (this.canvasRenderer) {
            this.canvasRenderer.destroy();
            this.canvasRenderer = null;
        }
        // Tear down insertion-driven Node
        // Collection, empty-canvas Add control and runtime InsertionController
        // context. The Node Collection owns its DOM + search input; the empty
        // canvas Add control owns its centered button + listener; the
        // InsertionController holds the runtime-only insertion context (never
        // persisted).
        if (this.nodeCollection) {
            this.nodeCollection.destroy();
            this.nodeCollection = null;
        }
        if (this.emptyCanvasAdd) {
            this.emptyCanvasAdd.destroy();
            this.emptyCanvasAdd = null;
        }
        if (this.insertionController) {
            this.insertionController.clearContext();
            this.insertionController = null;
        }
        if (this.workspaceShell) {
            if (this.canvasRegion) {
                this.canvasRegion.removeEventListener('mousedown', this.onCanvasMouseDown, true);
                this.canvasRegion = null;
            }
            this.workspaceShell.destroy();
            this.workspaceShell = null;
        }
        this.registry.clear();
        this.selectedItem = null;
        // Keep the host: the base class may release `this.element` while it tears down.
        const host: HTMLElement = this.element;
        super.destroy();
        this.restoreHostState(host);
    }

    /**
     * Records the host element's attributes before the designer changes them, so `destroy()`
     * can hand the element back as it was.
     *
     * @returns {void} Nothing.
     */
    private captureHostState(): void {
        if (this.hostState || !this.element) {
            return;
        }
        // The base class adds `e-lib`, `e-control` and the component class before rendering;
        // they aren't the host's own.
        const added: string[] = ['e-lib', 'e-control', 'e-workflow-designer'];
        const ownClasses: string = (this.element.getAttribute('class') || '').split(/\s+/)
            .filter((name: string) => name && added.indexOf(name) === -1).join(' ');
        this.hostState = {
            id: this.element.getAttribute('id'),
            className: ownClasses || (this.element.hasAttribute('class') ? '' : null),
            tabindex: this.element.getAttribute('tabindex'),
            width: this.element.style.width,
            height: this.element.style.height
        };
    }

    /**
     * Restores the attributes recorded by `captureHostState`.
     *
     * @param {HTMLElement} host - The host element.
     * @returns {void} Nothing.
     */
    private restoreHostState(host: HTMLElement): void {
        const state: HostElementState | null = this.hostState;
        this.hostState = null;
        if (!state || !host) {
            return;
        }
        const restore: (name: string, value: string | null) => void = (name: string, value: string | null): void => {
            if (value === null) {
                host.removeAttribute(name);
            } else {
                host.setAttribute(name, value);
            }
        };
        restore('id', state.id);
        restore('class', state.className);
        restore('tabindex', state.tabindex);
        host.style.width = state.width;
        host.style.height = state.height;
        if (!host.getAttribute('style')) {
            host.removeAttribute('style');
        }
    }

    /**
     * Creates the property panel, simulation log, and simulation controller.
     *
     * @param {object} diagram - The Diagram instance.
     * @param {HTMLDivElement} canvasRegion - The canvas region element.
     * @returns {void} Nothing.
     */
    private createCompleteWorkspace(diagram: object, canvasRegion: HTMLDivElement): void {
        void diagram;
        void canvasRegion;
        this.createPropertyPanel();
        this.createSimulationLog();
        this.simulationController = new SimulationController(
            {
                getDefinition: () => this._toWorkflowJson(),
                getSteps: () => this.workflowSteps || [],
                getConnections: () => this.workflowConnections || [],
                getStickyNotes: () => this.stickyNotes || [],
                trigger: (name: string, args: Record<string, unknown>) => this.emitNamed(name, args),
                requestHost: (eventName: string, args: Record<string, unknown>, signal: AbortSignal, timeoutMs: number) =>
                    this.requestHost(eventName, args, signal, timeoutMs),
                setState: (state: WorkflowExecutionState) => this.setExecutionState(state),
                applyNodeState: (stepId: string, state: 'processing' | 'completed' | 'error' | 'idle') =>
                    this.applyNodeVisualState(stepId, state),
                applyConnectorState: (connectionId: string, state: 'visited' | 'error' | 'idle') =>
                    this.applyConnectorVisualState(connectionId, state),
                // Stop animation only — used by user-initiated Stop so the
                // canvas clears the dashed "processing" stroke without
                // erasing the existing completed / failed / idle colors.
                stopStepAnimation: (stepId: string) => this.stopStepAnimation(stepId),
                appendLog: (entry: WorkflowExecutionLogEntry) => {
                    if (this.simulationLog) {
                        this.simulationLog.append(entry);
                    }
                },
                promptForm: (step: WorkflowStep, signal: AbortSignal) => FormInputDialog.show(this.element, step, signal),
                promptApproval: (step: WorkflowStep, signal: AbortSignal) => ApprovalDialog.show(this.element, step, {
                    context: this.simulationController
                        ? this.simulationController.contextStore.snapshot()
                        : { input: { response: {} }, nodes: {}, variables: {} },
                    signal: signal
                }),
                // Lets the dispatcher check whether the host handles an event.
                hasHostEventHandler: (eventName: string) => this.hasHostEventHandler(eventName),
                getWorkflowScope: () => this.workflowScope()
            },
            this.executionSettings,
            this.errorSettings,
            this.l10n
        );
        // Scheduled execution lifecycle is managed by SimulationController.
        // Active recurring and cron runs own their scheduled waits, preventing
        // duplicate polling, repeated wait logs, and overlapping executions.
        // Native Diagram user handles and the `onUserHandleMouseDown` event are
        // bound inside `CanvasRenderer.create()` using the actions supplied to
        // the renderer constructor. The Diagram
        // renders the user handles automatically around the selected
        // node/connector; handle clicks are routed through `onHandleMouseDown`.
        this.createAIAssist();
    }
    /**
     * Creates the step collection (node palette) from `stepCollectionSettings`.
     *
     * @returns {void} Nothing.
     */
    private createNodeCollection(): void {
        const nodeCollectionRegion: HTMLDivElement | null = this.workspaceShell ? this.workspaceShell.getNodeCollectionRegion() : null;
        if (nodeCollectionRegion && this.insertionController) {
            this.nodeCollection = new NodeCollection(
                nodeCollectionRegion,
                this.insertionController,
                this.serviceLocator,
                this.stepCollectionSettings
            );
            this.nodeCollection.create();
        }
    }

    /**
     * Creates the top toolbar from `toolbarSettings`. Undo/Redo availability and the
     * Execute/Stop state are restored when the toolbar is re-created at runtime.
     *
     * @returns {void} Nothing.
     */
    private createTopToolbar(): void {
        const topToolbarRegion: HTMLDivElement | null = this.workspaceShell ? this.workspaceShell.getTopToolbarRegion() : null;
        if (topToolbarRegion) {
            topToolbarRegion.removeAttribute('aria-hidden');
            this.topToolbar = new TopToolbar(
                topToolbarRegion,
                {
                    undo: () => this.undo(),
                    redo: () => this.redo(),
                    layout: () => this.layoutWorkflow(),
                    executeRun: (selectedTriggerId?: string) => this.runExecution(undefined, selectedTriggerId),
                    stop: () => this.stopExecution(),
                    reset: () => this.resetSimulation(),
                    lock: () => this.toggleReadOnly(),
                    exportWorkflow: () => this.saveWorkflow(this.getExportFileName()),
                    importWorkflow: () => this.triggerImportFile(),
                    projectNameChanged: (name: string) => this.setProjectName(name),
                    getTriggerOptions: () => (this.workflowSteps || [])
                        .filter((step: WorkflowStep) => this.isTriggerStepType(step.stepType))
                        .map((step: WorkflowStep) => ({
                            id: step.id,
                            name: step.name,
                            stepType: step.stepType
                        }))
                },
                () => Boolean(this.workflowSettings && this.workflowSettings.readOnly),
                this.serviceLocator
            );
            const toolbarSettings: WorkflowToolbarSettingsModel = this.toolbarSettings || {};
            this.topToolbar.create(
                toolbarSettings.visible !== false,
                toolbarSettings.items,
                this.projectName
            );
        }
        if (this.topToolbar) {
            const diagram: Diagram | null = this.canvasRenderer ? this.canvasRenderer.getDiagram() : null;
            const history: { undoStack?: unknown[]; redoStack?: unknown[] } | undefined =
                diagram ? diagram.historyManager as unknown as { undoStack?: unknown[]; redoStack?: unknown[] } : undefined;
            if (history) {
                this.topToolbar.applyUndoRedoAvailability(
                    (history.undoStack || []).length > 0, (history.redoStack || []).length > 0);
            }
            if (this.isExecutionActive()) {
                this.topToolbar.showStopButton();
            }
        }
    }

    /**
     * Creates the property panel from `propertyPanelSettings`.
     *
     * @returns {void} Nothing.
     */
    private createPropertyPanel(): void {
        const propertyRegion: HTMLDivElement | null = this.workspaceShell ? this.workspaceShell.getPropertyPanelRegion() : null;
        if (propertyRegion) {
            this.propertyPanel = new PropertyPanel(
                propertyRegion,
                this.propertyPanelSettings || {},
                // First arg: keystroke-level refresh path. Mutates the
                // designed step in place with `silent: true` so the public
                // `workflowChanged` event does not fire on every character.
                // The diagram still reflects each keystroke so the user
                // sees live typing in label fields.
                (id: string, changes: Record<string, unknown>) => {
                    // Store current values before updating (for tracking previous values)
                    if (!this.pendingPropertyPanelChanges.has(id)) {
                        const step: WorkflowStep | undefined = this.workflowSteps.find((s: WorkflowStep) => s.id === id);
                        const connection: WorkflowConnection | undefined = this.workflowConnections.find(
                            (c: WorkflowConnection) => c.id === id
                        );
                        const note: WorkflowStickyNote | undefined = this.stickyNotes.find(
                            (n: WorkflowStickyNote) => n.id === id
                        );
                        const item: any = step || connection || note;
                        if (item) {
                            // Capture initial state of all properties being changed
                            const originalState: Record<string, unknown> = {};
                            Object.keys(changes).forEach((key: string) => {
                                originalState[`${key}`] = item[`${key}`];
                            });
                            this.pendingPropertyPanelChanges.set(id, originalState);
                        }
                    }
                    this.updateWorkflowItem(id, changes, true);
                },
                // Second arg: commit handler. Fires synchronously when the
                // edit is finalized (input blur, Enter key, dropdown
                // `change`, picker confirm, structured-editor row add /
                // remove). `workflowChanged` fires exactly once per edit.
                (id: string) => {
                    if (id) {
                        const step: WorkflowStep | undefined = this.workflowSteps.find((s: WorkflowStep) => s.id === id);
                        if (step) {
                            const changedProperties: WorkflowPropertyChange[] = [];
                            const originalState: Record<string, unknown> | undefined =
                                this.pendingPropertyPanelChanges.get(id);
                            if (originalState) {
                                Object.keys(originalState).forEach((key: string) => {
                                    const newValue: any = (step as any)[`${key}`];
                                    const previousValue: any = originalState[`${key}`];
                                    changedProperties.push({ propertyName: key, previousValue, newValue });
                                });
                                this.pendingPropertyPanelChanges.delete(id);
                            }
                            this.emitChanged({ changeType: 'StepModified', affectedItem: step, changedProperties });
                        } else {
                            const connection: WorkflowConnection | undefined = this.workflowConnections.find(
                                (c: WorkflowConnection) => c.id === id
                            );
                            if (connection) {
                                const changedProperties: WorkflowPropertyChange[] = [];
                                const originalState: Record<string, unknown> | undefined =
                                    this.pendingPropertyPanelChanges.get(id);
                                if (originalState) {
                                    Object.keys(originalState).forEach((key: string) => {
                                        const newValue: any = (connection as any)[`${key}`];
                                        const previousValue: any = originalState[`${key}`];
                                        changedProperties.push({ propertyName: key, previousValue, newValue });
                                    });
                                    this.pendingPropertyPanelChanges.delete(id);
                                }
                                this.emitChanged({ changeType: 'ConnectionModified', affectedItem: connection, changedProperties });
                            } else {
                                const note: WorkflowStickyNote | undefined = this.stickyNotes.find(
                                    (n: WorkflowStickyNote) => n.id === id
                                );
                                if (note) {
                                    const changedProperties: WorkflowPropertyChange[] = [];
                                    const originalState: Record<string, unknown> | undefined =
                                        this.pendingPropertyPanelChanges.get(id);
                                    if (originalState) {
                                        Object.keys(originalState).forEach((key: string) => {
                                            const newValue: any = (note as any)[`${key}`];
                                            const previousValue: any = originalState[`${key}`];
                                            changedProperties.push({ propertyName: key, previousValue, newValue });
                                        });
                                        this.pendingPropertyPanelChanges.delete(id);
                                    }
                                    this.emitChanged({ changeType: 'StickyNoteModified', affectedItem: note, changedProperties });
                                }
                            }
                        }
                    }
                },
                // Third optional arg: shared L10n instance so every
                // caption (Properties title, SCHEDULE TYPE, ...) resolves
                // through the same registry the rest of the shell uses.
                this.l10n,
                // Fourth optional arg: shared ServiceLocator so the
                // structured editors (FormFields / Reviewers / ...) read
                // the live L10n through `getService('localization')` on
                // every `t()` call, picking up runtime `setLocale()`
                // changes without per-editor rewiring.
                this.serviceLocator
            );
            this.propertyPanel.setCustomStepSettings(this.stepCollectionSettings);
            this.propertyPanel.create(this.element);
        }
        if (this.propertyPanel) {
            this.propertyPanel.setReadOnly(this.isEditLocked());
        }
    }

    /**
     * Creates the execution log from `executionLogSettings`.
     *
     * @returns {void} Nothing.
     */
    private createSimulationLog(): void {
        const logRegion: HTMLDivElement | null = this.workspaceShell ? this.workspaceShell.getSimulationLogRegion() : null;
        if (logRegion) {
            this.simulationLog = new SimulationLog(
                logRegion,
                this.executionLogSettings || {},
                // Lazily resolved so the simulation log can refresh the
                // diagram bounds after collapsing/expanding. Capturing the
                // Diagram directly would freeze the reference; this allows a
                // future canvas rebuild to keep the wiring alive.
                () => this.canvasRenderer ? this.canvasRenderer.getDiagram() : null,
                this.serviceLocator
            );
            this.simulationLog.create();
        }
    }

    /**
     * Creates AI Assist when `aiAssistSettings.enabled` is true.
     *
     * @returns {void} Nothing.
     */
    private createAIAssist(): void {
        if (this.aiAssistSettings && this.aiAssistSettings.enabled && this.workspaceShell) {
            this.aiAssistController = new AIAssistController(this.aiAssistSettings, {
                apply: (definition: WorkflowDefinitionModel) => this._fromWorkflowJson(definition),
                currentJson: () => this._toWorkflowJson(),
                trigger: (name: string, args: Record<string, unknown>) => this.emitNamed(name, args),
                credentialMode: () => this.credentialMode(),
                resolveCredential: (reference: string, signal: AbortSignal): Promise<string> => {
                    if (!this.hasHostEventHandler('credentialRequested')) {
                        return Promise.reject(this.hostError('errorAIAssistCredential'));
                    }
                    return this.requestHost('credentialRequested', { credentialRef: reference, purpose: 'AIAssist', signal }, signal, 0)
                        .then((secret: unknown) => {
                            if (secret === undefined || secret === null || secret === '') {
                                throw this.hostError('errorAIAssistCredential');
                            }
                            return String(secret);
                        });
                },
                interceptRequest: (request: Record<string, unknown>) => this.interceptAIAssistRequest(request),
                updateSettings: (changes: Record<string, unknown>) => {
                    this.setProperties({ aiAssistSettings: changes as WorkflowAIAssistSettingsModel }, false);
                }
            }, this.serviceLocator);
            if (this.canvasRegion) {
                this.aiAssistController.createFloatingButton(this.canvasRegion);
            }
        }
    }

    /**
     * Raises `beforeRequestSend` for an AI Assist request.
     *
     * @param {Record<string, unknown>} request - The request; handlers may change it in place.
     * @returns {Promise<object>} `handled` with the host's response, or not handled.
     */
    private interceptAIAssistRequest(request: Record<string, unknown>): Promise<{ handled: boolean; response?: unknown }> {
        const args: WorkflowBeforeRequestSendEventArgs = {
            requestType: 'AIAssist', request: request as unknown as WorkflowAIRequest, cancel: false, response: undefined
        };
        this.trigger('beforeRequestSend', args);
        return resolveCancel(args.cancel).then<{ handled: boolean; response?: unknown }>((cancelled: boolean) => {
            if (args.response !== undefined) {
                return Promise.resolve(args.response).then((response: unknown) => ({ handled: true, response: response }));
            }
            if (cancelled) {
                return Promise.reject(Object.assign(new Error(this.formatText('requestCancelled')), { type: 'AI', code: 'REQUEST_CANCELLED' }));
            }
            return { handled: false };
        });
    }

    /**
     * Closes the node collection when selection is cleared.
     *
     * @param {WorkflowStep | WorkflowConnection | WorkflowStickyNote | null} item - The selected item.
     * @returns {void} Nothing.
     */
    private closeNodeCollectionOnDeselection(
        item:
        WorkflowStep |
        WorkflowConnection |
        WorkflowStickyNote |
        null
    ): void {
        if (item) {
            return;
        }

        if (
            !this.nodeCollection ||
            !this.nodeCollection.isOpen()
        ) {
            return;
        }

        this.nodeCollection.close();
    }
    /**
     * Opens the property panel for the currently selected item (called on double-click).
     * Only opens if an item is currently selected.
     *
     * @param {NodeModel | ConnectorModel} [item] - The Diagram item.
     * @returns {void} Nothing.
     */
    private openPropertyPanelForSelectedItem(item?: NodeModel | ConnectorModel): void {
        if (item) {
            this.selectedItem = this.resolveSelectedWorkflowItem({
                state: 'Changed',
                newValue: [item]
            } as ISelectionChangeEventArgs);
        }
        if (!this.selectedItem) {
            return;
        }

        if (!this.selectedItem.id) {
            return;
        }

        this.bindPropertyPanelForSelection(this.selectedItem, true);
    }

    /**
     * Handles a connector-label edit committed directly on the canvas
     * (double-click inline edit; see `CanvasRenderer.onDiagramTextEdit`).
    /**
     * Maps simulation node states onto WorkflowStepState, updates
     * (node.shape as any).content with the new HTML card, then dataBind()
     * — same pattern as the EJ2 HTML functional-template sample.
     *
     * @param {string} stepId - The workflow step identifier.
     * @param {string} state - The simulation state.
     * @returns {void} Nothing.
     */
    private applyNodeVisualState(stepId: string, state: string): void {
        const mapper: DiagramMapper | null = this.canvasRenderer ? this.canvasRenderer.getMapper() : null;
        const diagram: Diagram | null = this.canvasRenderer ? this.canvasRenderer.getDiagram() : null;
        if (!mapper || !stepId) {
            return;
        }
        const visualState: WorkflowStepState = this.mapSimulationNodeState(state);
        // Bind the live workflowSteps object so Formatter runtimeOutput is visible.
        const liveStep: WorkflowStep | undefined =
            this.workflowSteps.filter((item: WorkflowStep) => item.id === stepId)[0];
        // Skip repaints that would not change anything. The cache is keyed on
        // the Diagram node object, so a node recreated by import, undo or
        // re-render starts uncached. Freshly rendered nodes are idle, and
        // Formatter nodes always repaint because their content changes.
        const cachedNode: NodeModel | null = mapper.getNodeForStep(stepId);
        if (cachedNode && (!liveStep || liveStep.stepType !== 'Formatter')) {
            const previous: string = this.paintedNodeStates.get(cachedNode as object) || 'idle';
            if (previous === visualState) {
                return;
            }
        }
        // Mutates live diagram node shape.content via renderer.setHtmlContent.
        mapper.setNodeVisualState(stepId, visualState, liveStep);
        const node: NodeModel | null = mapper.getNodeForStep(stepId);
        if (node) {
            this.paintedNodeStates.set(node as object, visualState);
        }
        if (this.canvasRenderer) {
            this.canvasRenderer.refreshSelectionVisualState();
        }
        // Required for HTML content refresh, matching:
        // (diagram.nodes[0].shape as any).content = template2(...); diagram.dataBind();
        if (diagram) {
            diagram.dataBind();
        }
    }

    /**
     * Removes ONLY the running-stroke animation from a step's rendered card,
     * leaving its fill/border colors (completed/failed/idle) untouched. Used
     * by the user-initiated Stop path so a stopped run stops the dashed
     * "processing" stroke animation but keeps the run's status colors.
     *
     * @param {string} stepId - The workflow step identifier.
     * @returns {boolean} `true` when a running SVG was stripped.
     */
    private stopStepAnimation(stepId: string): boolean {
        const mapper: DiagramMapper | null = this.canvasRenderer ? this.canvasRenderer.getMapper() : null;
        const diagram: Diagram | null = this.canvasRenderer ? this.canvasRenderer.getDiagram() : null;
        if (!mapper || !stepId) {
            return false;
        }
        const stripped: boolean = mapper.stopStepAnimation(stepId);
        if (stripped && diagram) {
            // Refresh the Diagram so the SVG-less node repaints without the
            // dashed-stroke animation. Mirrors the dataBind() used by the
            // full state paint path in `applyNodeVisualState`.
            diagram.dataBind();
        }
        return stripped;
    }

    /**
     * Highlights connectors during simulation: visited (success path), error, or
     * idle (reset).
     *
     * @param {string} connectionId - The workflow connection identifier.
     * @param {'visited' | 'error' | 'idle'} state - The simulation state.
     * @returns {void} Nothing.
     */
    private applyConnectorVisualState(connectionId: string, state: 'visited' | 'error' | 'idle'): void {
        const mapper: DiagramMapper | null = this.canvasRenderer ? this.canvasRenderer.getMapper() : null;
        const diagram: Diagram | null = this.canvasRenderer ? this.canvasRenderer.getDiagram() : null;
        if (!mapper || !connectionId) {
            return;
        }
        const connector: ConnectorModel | null = mapper.getConnectorForConnection(connectionId);
        if (connector && (this.paintedConnectorStates.get(connector as object) || 'idle') === state) {
            return;
        }
        mapper.setConnectorVisualState(connectionId, state);
        // The mapper may switch to the live Diagram connector while painting, so record the state on
        // both objects; otherwise a later reset to idle would be skipped as "already idle".
        const painted: ConnectorModel | null = mapper.getConnectorForConnection(connectionId);
        if (connector) {
            this.paintedConnectorStates.set(connector as object, state);
        }
        if (painted) {
            this.paintedConnectorStates.set(painted as object, state);
        }
        if (diagram) {
            diagram.dataBind();
        }
    }

    /**
     * Maps SimulationController node states to renderer visual states.
     *
     * @param {string} state - The simulation state.
     * @returns {WorkflowStepState} The visual state.
     */
    private mapSimulationNodeState(
        state: string
    ): WorkflowStepState {
        switch (state) {
        case 'processing':
            return 'running';
        case 'completed':
            return 'completed';
        case 'error':
        case 'failed':
            return 'failed';
        case 'idle':
        default:
            return 'idle';
        }
    }

    /**
     * Dispatches a host callback with timeout and abort handling.
     *
     * @param {string} eventName - The host event name.
     * @param {Record<string, unknown>} args - The event payload.
     * @param {AbortSignal} signal - The cancellation signal.
     * @param {number} timeoutMs - The requested timeout; 0 or less uses 30 seconds.
     * @returns {Promise<object>} The host result.
     */
    private requestHost(
        eventName: string,
        args: Record<string, unknown>,
        signal: AbortSignal,
        timeoutMs: number
    ): Promise<unknown> {
        const defaultTimeout: number = 30000;
        const effectiveTimeout: number = timeoutMs > 0 ? timeoutMs : defaultTimeout;
        return new Promise<unknown>((resolve: (value: unknown) => void, reject: (reason?: unknown) => void) => {
            let settled: boolean = false;
            let timer: ReturnType<typeof setTimeout> | undefined;
            const finish: (callback: () => void) => void = (callback: () => void): void => {
                if (settled) {
                    return;
                }
                settled = true;
                if (timer) {
                    clearTimeout(timer);
                }
                signal.removeEventListener('abort', onAbort);
                callback();
            };
            const complete: (result: unknown) => void = (result: unknown): void => {
                finish(() => resolve(result));
            };
            const fail: (error: Error) => void = (error: Error): void => {
                finish(() => reject(error));
            };
            const onAbort: () => void = (): void => {
                fail(runStoppedError());
            };
            const payload: Record<string, unknown> = {};
            Object.keys(args).forEach((key: string) => { payload[`${key}`] = args[`${key}`]; });
            payload.complete = complete;
            payload.fail = fail;
            payload.signal = signal;
            payload.workflow = this._toWorkflowJson();
            const runtime: WorkflowRuntimeContext = this.getWorkflowContext();
            payload.stepResults = this.simulationController ? this.simulationController.contextStore.stepResults() : [];
            payload.previousStep = runtime.previousStep;
            // Fail fast when no handler is bound instead of waiting for the timeout.
            if (!this.hasHostEventHandler(eventName)) {
                fail(Object.assign(new Error(this.formatText('errorNoHandler', [eventName])),
                                   { type: 'Runtime', code: 'NO_HANDLER' }));
                return;
            }
            this.emitNamed(eventName, payload);
            if (!settled) {
                if (isFinite(effectiveTimeout)) {
                    timer = setTimeout(() => fail(Object.assign(
                        new Error(this.formatText('errorHandlerTimeout', [eventName, String(effectiveTimeout)])),
                        { type: 'Timeout', code: 'HANDLER_TIMEOUT' })), effectiveTimeout);
                }
                if (signal.aborted) {
                    onAbort();
                } else {
                    signal.addEventListener('abort', onAbort, { once: true });
                }
            }
        });
    }

    /**
     * True when the host has bound a handler for the named event, either
     * through an assigned Event() callback or through the Syncfusion
     * modelObserver / addEventListener path.
     *
     * @param {string} name - The event name.
     * @returns {boolean} Whether a handler is registered.
     */
    private hasHostEventHandler(name: string): boolean {
        // Event() properties are undefined until the host assigns a callback.
        // Also accept listeners registered through addEventListener / modelObserver.
        if (typeof this.resolveHostEventHandler(name) === 'function') {
            return true;
        }
        // Angular (and other framework wrappers built on ej2-angular-base)
        // replace each decorated Event() property with a framework emitter
        // object (e.g. an RxJS-style EventEmitter exposing `next`, `subscribe`
        // and an `observers` array). Template bindings like
        // `(customExecutionRequested)="..."` subscribe directly to that
        // emitter, never through the EJ2 event bus, so the two checks above
        // cannot see them. Treat an emitter with at least one subscriber as a
        // bound host handler so `requestHost` does not fail fast with
        // `NO_HANDLER` before dispatch. Existence of the emitter
        // alone is NOT enough — wrappers always instantiate emitters for
        // every event, so an empty `observers` array must stay "not handled".
        if (this.hasFrameworkEmitterSubscriber(name)) {
            return true;
        }
        return this.hasModelObserverHandler(name);
    }

    /**
     * True when the event property has been replaced by a framework emitter
     * object (Angular/React/Vue wrappers on ej2-angular-base) that has at
     * least one active subscriber.
     *
     * @param {string} name - The event name.
     * @returns {boolean} Whether a framework emitter is bound with subscribers.
     */
    private hasFrameworkEmitterSubscriber(name: string): boolean {
        const handler: unknown = this.resolveHostEventHandler(name);
        if (typeof handler !== 'object' || handler === null) {
            return false;
        }
        const emitter: { next?: unknown; subscribe?: unknown; observers?: unknown } =
            handler as { next?: unknown; subscribe?: unknown; observers?: unknown };
        // EventEmitter shape: callable `next`, a `subscribe` method and a
        // non-empty `observers` array of subscribed callbacks.
        if (typeof emitter.next !== 'function' || typeof emitter.subscribe !== 'function') {
            return false;
        }
        const observers: unknown = emitter.observers;
        return Array.isArray(observers) && observers.length > 0;
    }

    /**
     * Maps internal event names to their corresponding public event names for trigger dispatch.
     *
     * @param {string} name - The internal event name.
     * @returns {string} The public event name.
     */
    private mapEventName(name: string): string {
        const eventNameMap: { [key: string]: string } = {
            simulationStarted: 'executionStarted',
            simulationStepStarted: 'executionStepStarted',
            simulationStepCompleted: 'executionStepCompleted',
            simulationStepFailed: 'executionStepFailed',
            simulationCompleted: 'executionCompleted'
        };
        return eventNameMap[`${name}`] || name;
    }

    /**
     * Resolves a host event callback by name for addEventListener checks.
     *
     * @param {string} name - The event name.
     * @returns {Function | undefined} The callback, when assigned.
     */
    private resolveHostEventHandler(name: string): Function | undefined {
        const mappedName: string = this.mapEventName(name);
        const events: { [key: string]: Function | undefined } = {
            workflowChanged: this.workflowChanged,
            executionStarted: this.executionStarted,
            executionStepStarted: this.executionStepStarted,
            executionStepCompleted: this.executionStepCompleted,
            executionStepFailed: this.executionStepFailed,
            executionCompleted: this.executionCompleted,
            notifyRequested: this.notifyRequested,
            customExecutionRequested: this.customExecutionRequested,
            approvalRequested: this.approvalRequested,
            credentialRequested: this.credentialRequested,
            aiAssistCompleted: this.aiAssistCompleted,
            aiAssistFailed: this.aiAssistFailed,
            selectionChanged: this.selectionChanged,
            beforeStepExecute: this.beforeStepExecute,
            beforeRequestSend: this.beforeRequestSend,
            beforeItemRemove: this.beforeItemRemove,
            beforeConnect: this.beforeConnect
        };
        return events[`${mappedName}`];
    }

    /**
     * True when Syncfusion modelObserver has at least one bound handler for the event.
     * Covers addEventListener registrations that never assign the property.
     *
     * Checks whether the EJ2 model observer has a handler for an event.
     *
     * @param {string} name - The event name.
     * @returns {boolean} Whether a handler is registered.
     */
    private hasModelObserverHandler(name: string): boolean {
        type Observer = { boundedEvents?: { [event: string]: Array<unknown> } } | undefined;
        const self: { modelObserver?: Observer; localObserver?: Observer } =
            this as unknown as { modelObserver?: Observer; localObserver?: Observer };
        // addEventListener registers on the model observer; Component.on() on the local observer.
        return [self.modelObserver, self.localObserver].some((observer: Observer) => {
            if (!observer || !observer.boundedEvents) {
                return false;
            }
            const handlers: Array<unknown> | undefined = observer.boundedEvents[`${name}`];
            return Array.isArray(handlers) && handlers.length > 0;
        });
    }

    /**
     * Emits a named event through EJ2's trigger mechanism for cross-framework compatibility.
     * Maps simulation event names to their corresponding public event names.
     *
     * @param {string} name - The event name.
     * @param {Record<string, unknown>} args - The event payload.
     * @returns {void} Nothing.
     */
    private emitNamed(name: string, args: Record<string, unknown>): void {
        const mappedName: string = this.mapEventName(name);
        if (WorkflowDesigner.stepEvents.indexOf(mappedName) !== -1) {
            // Step events fire for every step: skip the payload when nobody listens, and hand
            // listeners copies so a handler can't change the running workflow.
            if (!this.hasHostEventHandler(mappedName)) {
                return;
            }
            args = WorkflowDesigner.detachedStepEventArgs(args);
        }
        this.trigger(mappedName, args);
    }

    /** Locale keys announced to screen readers when the run state changes. */
    private static readonly runAnnouncementKeys: { [state: string]: string } = {
        Scheduled: 'runAnnounceScheduled',
        Running: 'runAnnounceRunning',
        WaitingForHuman: 'runAnnounceWaiting',
        Completed: 'runAnnounceCompleted',
        Failed: 'runAnnounceFailed',
        Stopped: 'runAnnounceStopped',
        Cancelled: 'runAnnounceCancelled'
    };

    private static readonly stepEvents: string[] = ['executionStepStarted', 'executionStepCompleted', 'executionStepFailed'];

    /**
     * Copies the step, connections, previous step and step results of a step event so handlers can't mutate the run.
     *
     * @param {Record<string, unknown>} args - The internal event arguments.
     * @returns {Record<string, unknown>} Arguments safe to hand to host code.
     */
    private static detachedStepEventArgs(args: Record<string, unknown>): Record<string, unknown> {
        const copy: (value: unknown) => unknown = (value: unknown): unknown => {
            if (value === undefined || value === null || typeof value !== 'object') {
                return value;
            }
            try {
                return JSON.parse(JSON.stringify(value));
            } catch {
                return value;
            }
        };
        const result: Record<string, unknown> = { ...args };
        ['step', 'previousStep', 'incomingConnection', 'outgoingConnections', 'followedConnections', 'stepResults', 'result'].forEach((key: string) => {
            if (key in result) {
                result[`${key}`] = copy(result[`${key}`]);
            }
        });
        return result;
    }

    /**
     * Downloads serialized workflow JSON in browser environments.
     *
     * @param {string} json - The serialized workflow.
     * @param {string} fileName - The download filename.
     * @returns {void} Nothing.
     */
    private downloadJson(json: string, fileName: string): void {
        if (typeof document === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) {
            return;
        }
        const blob: Blob = new Blob([json], { type: 'application/json' });
        const url: string = URL.createObjectURL(blob);
        const link: HTMLAnchorElement = document.createElement('a');
        link.href = url;
        link.download = fileName.indexOf('.') === -1 ? fileName + '.json' : fileName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
    }

    /**
     * Refreshes the empty-canvas control and emits the public `workflowChanged` event.
     *
     * @param {object} [changeInfo] - Optional change information for the event.
     * @returns {void} Nothing.
     */
    private emitChanged(
        changeInfo?: {
            changeType?: WorkflowChangeType;
            affectedItem?: WorkflowStep | WorkflowConnection | WorkflowStickyNote;
            changedProperties?: WorkflowPropertyChange[];
        }
    ): void {
        // Keep the empty-canvas Add control in sync for every mutation path.
        this.updateEmptyCanvasAdd();
        this.dirty = true;
        // Serializing the whole workflow on every edit is the costly part; skip it when nobody listens.
        if (!this.hasHostEventHandler('workflowChanged')) {
            return;
        }
        const args: Record<string, unknown> = { workflow: this._toWorkflowJson(), changeType: changeInfo && changeInfo.changeType ? changeInfo.changeType : 'WorkflowModified' };
        if (changeInfo && changeInfo.affectedItem) {
            args.affectedItem = changeInfo.affectedItem;
        }
        if (changeInfo && changeInfo.changedProperties) {
            args.changedProperties = changeInfo.changedProperties;
        }
        this.trigger('workflowChanged', args);
    }

    /**
     * Applies a normalized workflow definition to the component.
     *
     * @param {WorkflowDefinitionModel} normalized - The normalized definition.
     * @param {boolean} emit - Whether to emit the change event.
     * @returns {void} Nothing.
     */
    private applyDefinition(normalized: WorkflowDefinitionModel, emit: boolean): void {
        this.workflowSteps = normalized.workflowSteps;
        this.workflowConnections = normalized.workflowConnections;
        this.stickyNotes = normalized.stickyNotes || [];
        this.selectedItem = null;
        this.workflowDefinitionId = typeof normalized.id === 'string' ? normalized.id : '';
        if (typeof normalized.name === 'string' && normalized.name.trim()) {
            this.setProjectName(normalized.name, false);
        }
        this.rebuildRegistry();
        this.bindPropertyPanelForSelection(null, false);
        if (this.canvasRenderer) {
            this.canvasRenderer.clearSelection();
            this.applyAllDefaults();
            this.canvasRenderer.renderAll(this.workflowSteps, this.workflowConnections, this.stickyNotes);
        }
        // Undo/redo entries refer to the previous workflow's items.
        this.clearUndoHistory();
        if (emit) {
            this.emitChanged({ changeType: 'WorkflowImported' });
        } else {
            this.updateEmptyCanvasAdd();
        }
    }

    /**
     * Sets the project/workflow display name.
     *
     * Empty values fall back to the default title; the value propagates to
     * the top-bar tile and is the basis for download filenames.
     *
     * @param {string} name - The proposed name.
     * @param {boolean} [emit] - Whether to emit a change event.
     * @returns {void} Nothing.
     */
    private setProjectName(name: string, emit: boolean = true): void {
        const trimmed: string = typeof name === 'string' ? name.replace(/\s+/g, ' ').trim() : '';
        this.projectName = trimmed || DEFAULT_PROJECT_NAME;
        if (this.topToolbar) {
            this.topToolbar.setProjectName(this.projectName);
        }
        if (emit) {
            this.emitChanged();
        }
    }

    /** Sanitized download base name derived from the current project name.
     *
     * Returns a sanitized workflow download filename.
     *
     * @returns {string} The sanitized filename.
     */
    private getExportFileName(): string {
        const sanitized: string = this.projectName
            .replace(/[<>:"/\\|?*]/g, '')
            .split('')
            .filter((character: string) => character.charCodeAt(0) >= 32)
            .join('')
            .replace(/\s+/g, ' ')
            .trim();
        return sanitized || DEFAULT_PROJECT_NAME;
    }


    /**
     * Returns the handle action callbacks used by the native Diagram user
     * handles. Each callback mutates workflow state
     * through the existing public mutation boundary.
     *
     * @returns {HandleActions} The handle callbacks.
     */
    private handleActions(): HandleActions {
        return {
            deleteItem: (id: string) => this.removeWorkflowItem(id),
            executeStep: (step: WorkflowStep) => {
                if (this.simulationController) {
                    this.simulationController.executeSingleStep(step).catch(() => { return; });
                }
            },
            addFromNode: (
                step: WorkflowStep,
                port: string
            ): void => {
                if (
                    !this.insertionController ||
                    !this.nodeCollection
                ) {
                    return;
                }

                const mapper: DiagramMapper | null = this.canvasRenderer
                    ? this.canvasRenderer.getMapper()
                    : null;

                const diagramNode: NodeModel | null =
                    mapper && step.id
                        ? mapper.getNodeForStep(step.id)
                        : null;

                const sourcePosition: WorkflowPosition = {
                    x: diagramNode &&
                        typeof diagramNode.offsetX === 'number'
                        ? diagramNode.offsetX
                        : (
                            step.position &&
                            typeof step.position.x === 'number'
                                ? step.position.x
                                : 0
                        ),

                    y: diagramNode &&
                        typeof diagramNode.offsetY === 'number'
                        ? diagramNode.offsetY
                        : (
                            step.position &&
                            typeof step.position.y === 'number'
                                ? step.position.y
                                : 0
                        )
                };

                this.insertionController.openForNodeOutput(
                    step.id || '',
                    port,
                    sourcePosition
                );

                this.nodeCollection.open();
            },
            addFromConnector: (connection: WorkflowConnection) => {
                if (!this.insertionController || !this.nodeCollection) {
                    return;
                }
                this.insertionController.openForConnector(connection.id || '', { x: 240, y: 240 });
                this.nodeCollection.open();
            },
            updateStickyNoteColor: (note: WorkflowStickyNote, fill: string): void => {
                this.updateWorkflowItem(note.id || '', {
                    style: Object.assign({}, note.style, { fill })
                });
            }
        };
    }

    /**
     * Shows or hides the step collection palette. Shared by the canvas toolbar Add button and
     * `showStepCollectionPalette`, so both follow the same path. Does nothing when the palette is
     * already in the requested state.
     *
     * @param {boolean} show - Whether the palette should be displayed.
     * @param {boolean} fromUserHandle - Whether it is opened from a user handle (closes after a step is picked).
     * @param {boolean} focusSearch - Whether to move focus to the palette search box when showing it.
     * @returns {void} Nothing.
     */
    private setStepCollectionVisibility(show: boolean, fromUserHandle: boolean, focusSearch: boolean): void {
        if (!this.nodeCollection || this.nodeCollection.isOpen() === show) {
            return;
        }
        if (show) {
            if (this.insertionController) {
                this.insertionController.openForToolbar(this.getEmptyCanvasInsertionPosition());
            }
            this.nodeCollection.open(fromUserHandle, focusSearch);
        } else {
            this.nodeCollection.close();
        }
    }

    /**
     * Shows or hides the step collection palette. Only the visibility of the palette changes; the
     * workflow, selection, zoom and pan are kept. Calling it with the current state has no effect.
     * Showing the palette has no effect while the Workflow Designer is read-only or running, or when
     * `stepCollectionSettings.visible` is `false`.
     *
     * @param {boolean} show - Specifies whether the step collection palette should be displayed: `true` shows it and `false` hides it.
     * @returns {void}
     */
    public showStepCollectionPalette(show: boolean): void {
        this.assertActive();
        if (show && (this.isEditLocked() || (this.stepCollectionSettings && this.stepCollectionSettings.visible === false))) {
            return;
        }
        this.setStepCollectionVisibility(Boolean(show), false, false);
    }

    /**
     * Opens the Node Collection at the empty-canvas first-trigger insertion
     * point. The palette shows/enables triggers and
     * hides/disables non-trigger node types.
     *
     * @returns {void} Nothing.
     */
    private openEmptyCanvasInsertion(): void {
        if (this.isEditLocked()) {
            return;
        }
        if (this.stepCollectionSettings && this.stepCollectionSettings.visible === false) {
            return;
        }
        if (!this.insertionController || !this.nodeCollection) {
            return;
        }
        const center: WorkflowPosition = this.getEmptyCanvasInsertionPosition();
        this.insertionController.openForEmptyCanvas(center);
        this.nodeCollection.open();
    }

    /**
     * Returns the visible canvas center as the first-trigger insertion
     * position. Does not set workflow coordinates or Diagram bounds.
     *
     * @returns {WorkflowPosition} The insertion position.
     */
    private getEmptyCanvasInsertionPosition(): WorkflowPosition {
        const region: HTMLElement | null = this.workspaceShell ? this.workspaceShell.getCanvasRegion() : null;
        if (region) {
            const rect: { width: number; height: number } = region.getBoundingClientRect();
            return { x: Math.round(rect.width / 2), y: Math.round(rect.height / 2) };
        }
        return { x: 200, y: 200 };
    }

    /**
     * Generates a unique workflow step ID not present in any public
     * collection. Uses the existing combined namespace `IdRegistry`.
     *
     * @param {string} preferred - The preferred identifier.
     * @returns {string} A unique identifier.
     */
    private generateUniqueStepId(preferred: string): string {
        const base: string = preferred || 'step';
        let id: string = base;
        let suffix: number = 1;
        while (this.registry.has(id)) {
            id = `${base}_${suffix}`;
            suffix++;
        }
        return id;
    }

    /**
     * Refreshes the empty-canvas Add control visibility: shown when the
     * canvas has no workflow steps, hidden once the first node is added.
     *
     * @returns {void} Nothing.
     */
    private updateEmptyCanvasAdd(): void {
        if (!this.emptyCanvasAdd) {
            return;
        }
        // Hide if step collection is disabled
        if (this.stepCollectionSettings && this.stepCollectionSettings.visible === false) {
            this.emptyCanvasAdd.hide();
            return;
        }
        // Prefer the actual Diagram node count so the control reappears as
        // soon as the canvas is empty again (e.g. after deleting the last
        // node), falling back to the public workflow-step collection.
        const diagram: Diagram | null = this.canvasRenderer ? this.canvasRenderer.getDiagram() : null;
        const diagramEmpty: boolean = diagram ? diagram.nodes.length === 0 : true;
        const hasSteps: boolean = (this.workflowSteps && this.workflowSteps.length > 0) || !diagramEmpty;
        if (hasSteps) {
            this.emptyCanvasAdd.hide();
        } else {
            this.emptyCanvasAdd.show();
        }
    }

    /** Handles the Diagram `collectionChange` event. Uses the live Diagram node
     * count to reconcile the empty-canvas Add control: when the canvas becomes
     * empty again (e.g. the last step is deleted), the centered Add button is
     * re-shown. Also adopts manual port-to-port connectors into the public
     * workflow connection model so delete, simulation, and download paths
     * the same as handle-created connections.
     *
     * Reconciles Diagram collection changes with public workflow state.
     *
     * @returns {void} Nothing.
     */
    private onDiagramCollectionChange(): void {
        this.updateEmptyCanvasAdd();
        this.reconcileManualConnectors();
    }

    /**
     * Registers Diagram connectors that were drawn by the user (port Draw)
     * but are not yet present in `workflowConnections` / mapper maps.
     * Programmatic `addConnector` paths are skipped via existing map entries.
     *
     * @returns {void} Nothing.
     */
    private reconcileManualConnectors(): void {
        if (this.isAdoptingManualConnectors) {
            return;
        }
        const diagram: Diagram | null = this.canvasRenderer
            ? this.canvasRenderer.getDiagram()
            : null;
        const mapper: DiagramMapper | null = this.canvasRenderer
            ? this.canvasRenderer.getMapper()
            : null;
        if (!diagram || !mapper || !Array.isArray(diagram.connectors)) {
            return;
        }

        this.isAdoptingManualConnectors = true;
        try {
            const connectors: ConnectorModel[] = diagram.connectors.slice();
            for (let i: number = 0; i < connectors.length; i++) {
                this.tryAdoptManualConnector(connectors[parseInt(i.toString(), 10)], mapper);
            }
        } finally {
            this.isAdoptingManualConnectors = false;
        }
    }

    /**
     * Adopts one complete Diagram connector into the workflow model if needed.
     *
     * @param {ConnectorModel} connector - The Diagram connector.
     * @param {DiagramMapper} mapper - The workflow mapper.
     * @returns {void} Nothing.
     */
    private tryAdoptManualConnector(
        connector: ConnectorModel,
        mapper: DiagramMapper
    ): void {
        if (!connector) {
            return;
        }

        const connectorId: string = String(connector.id || '');
        if (connectorId && mapper.getConnectionForConnector(connectorId)) {
            return;
        }

        const sourceNodeId: string = String(connector.sourceID || '');
        const targetNodeId: string = String(connector.targetID || '');
        if (!sourceNodeId || !targetNodeId) {
            // Incomplete draws are removed by CanvasRenderer's completed
            // connection-change handler, outside collection reconciliation.
            return;
        }

        const sourceStepId: string | null = mapper.getStepIdForNode(sourceNodeId);
        const targetStepId: string | null = mapper.getStepIdForNode(targetNodeId);
        if (!sourceStepId || !targetStepId) {
            this.removeUnadoptedConnector(connector);
            return;
        }

        const sourcePort: string = NodeMapper.parsePortName(
            String(connector.sourcePortID || ''),
            sourceNodeId,
            false
        );
        const targetPort: string = NodeMapper.parsePortName(
            String(connector.targetPortID || ''),
            targetNodeId,
            true
        );

        if (!String(connector.sourcePortID || '') || !String(connector.targetPortID || '')) {
            this.removeUnadoptedConnector(connector);
            return;
        }

        let connectionId: string = connectorId;
        if (!connectionId || !/^[A-Za-z_][A-Za-z0-9_-]*$/.test(connectionId) || isReservedId(connectionId) || this.registry.has(connectionId)) {
            connectionId = this.generateUniqueStepId('c');
        }

        const connection: WorkflowConnection = {
            id: connectionId,
            sourceStepId: sourceStepId,
            targetStepId: targetStepId,
            sourcePort: sourcePort,
            targetPort: targetPort
        };

        if (!mapper.adoptConnector(connection, connector)) {
            this.removeUnadoptedConnector(connector);
            return;
        }

        if (!this.registry.has(connectionId)) {
            this.registry.register(connectionId);
        }

        const alreadyListed: boolean = (this.workflowConnections || []).some(
            (item: WorkflowConnection): boolean =>
                String(item.id || '') === connectionId
        );
        if (!alreadyListed) {
            this.workflowConnections = (this.workflowConnections || []).concat([connection]);
        }

        this.emitChanged();
    }

    /**
     * Removes a manually drawn connector that did not resolve to two ports.
     *
     * @param {ConnectorModel} connector - The connector to remove.
     * @returns {void} Nothing.
     */
    private removeUnadoptedConnector(connector: ConnectorModel): void {
        const diagram: Diagram | null = this.canvasRenderer
            ? this.canvasRenderer.getDiagram()
            : null;
        const mapper: DiagramMapper | null = this.canvasRenderer
            ? this.canvasRenderer.getMapper()
            : null;
        const connectorId: string = String(connector && connector.id || '');
        setTimeout(() => {
            if (!diagram || !connector) {
                return;
            }
            if (connectorId && mapper && mapper.getConnectionForConnector(connectorId)) {
                return;
            }
            const live: ConnectorModel | undefined = diagram.connectors
                ? diagram.connectors.find((item: ConnectorModel): boolean =>
                    String(item.id || '') === connectorId)
                : undefined;
            if (live) {
                diagram.remove(live);
            }
        }, 0);
    }

    /**
     * Handles the Diagram `selectionChange` event. Resolves the selected
     * Diagram node/connector back to a public workflow item, updates the
     * `selectedItem` state, fires the public `selectionChanged` event and
     * binds the Property Section to the selected item. This is the
     * authoritative selection path used to keep the property panel in sync.
     *
     * @param {ISelectionChangeEventArgs} args - The selection event arguments.
     * @returns {void} Nothing.
     */
    private onDiagramSelectionChange(
        args: ISelectionChangeEventArgs
    ): void {
        if (
            args &&
            args.state &&
            args.state !== 'Changed'
        ) {
            return;
        }

        const item:
        | WorkflowStep
        | WorkflowConnection
        | WorkflowStickyNote
        | null = this.resolveSelectedWorkflowItem(args);

        const nextId: string =
            item && item.id
                ? String(item.id)
                : '';

        const previousId: string = this.selectedItem && this.selectedItem.id ? String(this.selectedItem.id) : '';
        this.selectedItem = item;

        this.closeNodeCollectionOnDeselection(item);

        // Diagram repeats selectionChange for the same item (for example after a
        // repaint); the public event and the announcement fire on real changes only.
        if (nextId !== previousId) {
            this.trigger('selectionChanged', {
                selectedItem: item
            });
            if (this.ariaLive && item) {
                this.ariaLive.announce(this.describeItem(item));
            }
        }

        // Keep an already-open panel synchronized with every selection change.
        // A closed panel remains closed unless its configured selection behavior
        // or the insertion/double-click paths explicitly open it.
        const insertedNow: boolean = !!nextId && nextId === this.newlyInsertedNodeId;
        if (insertedNow) {
            this.newlyInsertedNodeId = '';
        }
        const openOnSelection: boolean = !!item && this.isStep(item)
            && !!(this.propertyPanelSettings && this.propertyPanelSettings.openOnStepSelection === true);
        const openPanel: boolean = insertedNow || openOnSelection;
        this.bindPropertyPanelForSelection(item, openPanel);
    }

    /**
     * Returns the text announced to screen readers when an item is selected.
     *
     * @param {WorkflowStep | WorkflowConnection | WorkflowStickyNote} item - The selected item.
     * @returns {string} The step name, connection label or sticky-note text, else the id.
     */
    private describeItem(item: WorkflowStep | WorkflowConnection | WorkflowStickyNote): string {
        const stepName: (id?: string) => string = (id?: string): string => {
            const step: WorkflowStep | undefined = (this.workflowSteps || []).filter((s: WorkflowStep) => s.id === id)[0];
            return step ? (step.name || step.id || '') : (id || '');
        };
        if (this.isStep(item)) {
            return this.formatText('stepAccessibleName', [item.name || item.id || '', String(item.stepType || '')]);
        }
        if (this.isConnection(item)) {
            const name: string = this.formatText('connectionAccessibleName', [stepName(item.sourceStepId), stepName(item.targetStepId)]);
            return item.label ? item.label + ', ' + name : name;
        }
        return this.formatText('stickyNoteAccessibleName', [(item as WorkflowStickyNote).text || item.id || '']);
    }

    /**
     * Selects the nearest step in a direction from the selected item (Alt+Arrow keys). With nothing
     * selected, selects the first trigger, or else the top-left step.
     *
     * @param {string} direction - `'Left'`, `'Right'`, `'Up'` or `'Down'`.
     * @returns {void} Nothing.
     */
    private navigateSelection(direction: 'Left' | 'Right' | 'Up' | 'Down'): void {
        const steps: WorkflowStep[] = (this.workflowSteps || []).filter((step: WorkflowStep) => !!step.id);
        if (!steps.length) {
            return;
        }
        const center: (step: WorkflowStep) => { x: number; y: number } = (step: WorkflowStep): { x: number; y: number } => {
            const node: NodeModel | null = this.canvasRenderer && this.canvasRenderer.getMapper()
                ? this.canvasRenderer.getMapper().getNodeForStep(step.id) : null;
            return {
                x: node && typeof node.offsetX === 'number' ? node.offsetX : (step.position ? step.position.x : 0),
                y: node && typeof node.offsetY === 'number' ? node.offsetY : (step.position ? step.position.y : 0)
            };
        };
        const current: WorkflowStep | null = this.selectedItem && this.isStep(this.selectedItem) ? this.selectedItem : null;
        let next: WorkflowStep | null = null;
        if (!current) {
            const ordered: WorkflowStep[] = steps.slice().sort((a: WorkflowStep, b: WorkflowStep) => {
                const triggerOrder: number = Number(PortResolver.isTrigger(b.stepType)) - Number(PortResolver.isTrigger(a.stepType));
                const pa: { x: number; y: number } = center(a);
                const pb: { x: number; y: number } = center(b);
                return triggerOrder || (pa.x - pb.x) || (pa.y - pb.y);
            });
            next = ordered[0];
        } else {
            const from: { x: number; y: number } = center(current);
            let best: number = Infinity;
            steps.forEach((step: WorkflowStep) => {
                if (step.id === current.id) {
                    return;
                }
                const to: { x: number; y: number } = center(step);
                const dx: number = to.x - from.x;
                const dy: number = to.y - from.y;
                const main: number = direction === 'Left' ? -dx : direction === 'Right' ? dx : direction === 'Up' ? -dy : dy;
                const side: number = direction === 'Left' || direction === 'Right' ? Math.abs(dy) : Math.abs(dx);
                // Only steps ahead in that direction; sideways distance counts double so the
                // step most nearly in line wins.
                if (main <= 0) {
                    return;
                }
                const score: number = main + 2 * side;
                if (score < best) {
                    best = score;
                    next = step;
                }
            });
        }
        if (next && this.canvasRenderer) {
            this.canvasRenderer.selectItem(next.id);
            this.canvasRenderer.bringIntoView(next.id);
        } else if (this.ariaLive) {
            this.ariaLive.announce(this.formatText('noStepInDirection'));
        }
    }

    /**
     * Opens the selected item in the property panel (Enter).
     *
     * @returns {boolean} `true` when an item is selected.
     */
    private openSelectedInPanel(): boolean {
        if (!this.selectedItem || !this.propertyPanel) {
            return false;
        }
        this.bindPropertyPanelForSelection(this.selectedItem, true);
        return true;
    }

    /**
     * Opens the step list to add a step after the selected step, from its first output (Alt+N).
     *
     * @returns {boolean} `true` when a step is selected and editing is allowed.
     */
    private addNextToSelectedStep(): boolean {
        const step: WorkflowStep | null = this.selectedItem && this.isStep(this.selectedItem) ? this.selectedItem : null;
        if (!step || this.isEditLocked()) {
            return false;
        }
        const ports: string[] = PortResolver.getOutputPorts(step);
        if (!ports.length) {
            return false;
        }
        this.handleActions().addFromNode(step, ports[0]);
        return true;
    }

    /**
     * Clears the canvas undo and redo stacks and refreshes the toolbar buttons.
     *
     * @returns {void} Nothing.
     */
    private clearUndoHistory(): void {
        const diagram: Diagram | null = this.canvasRenderer ? this.canvasRenderer.getDiagram() : null;
        if (diagram && typeof diagram.clearHistory === 'function') {
            diagram.clearHistory();
        }
        this.lastItemEdit = null;
        if (this.topToolbar) {
            this.topToolbar.applyUndoRedoAvailability(false, false);
        }
    }

    /**
     * Binds the property panel for a selection change, preferring live step data.
     *
     * @param {WorkflowStep | WorkflowConnection | WorkflowStickyNote | null} item - The selected item.
     * @param {boolean} [openPanel] - Whether to open the panel.
     * @returns {void} Nothing.
     */
    private bindPropertyPanelForSelection(
        item: WorkflowStep | WorkflowConnection | WorkflowStickyNote | null,
        openPanel: boolean = false
    ): void {
        if (!this.propertyPanel) {
            return;
        }
        let bound: WorkflowStep | WorkflowConnection | WorkflowStickyNote | null = item;
        if (item && (item as WorkflowStep).stepType !== undefined && item.id) {
            const live: WorkflowStep | undefined =
                (this.workflowSteps || []).filter((step: WorkflowStep) => step.id === item.id)[0];
            if (live) {
                bound = live;
            }
        } else if (item && this.isConnection(item) && item.id) {
            const live: WorkflowConnection | undefined =
                (this.workflowConnections || []).filter((connection: WorkflowConnection) => connection.id === item.id)[0];
            if (live) {
                bound = live;
            }
        }
        const context: WorkflowRuntimeContext = this.getWorkflowContext();
        this.propertyPanel.bind(bound, this.workflowSteps || [], this.workflowConnections || [], context, openPanel);
    }

    /**
     * Maps a Diagram `selectionChange` payload to the corresponding public
     * workflow step, connection, sticky note or null.
     *
     * @param {ISelectionChangeEventArgs} args - The selection event arguments.
     * @returns {WorkflowStep | WorkflowConnection | WorkflowStickyNote | null} The selected item.
     */
    private resolveSelectedWorkflowItem(args: ISelectionChangeEventArgs): WorkflowStep | WorkflowConnection
    | WorkflowStickyNote | null {
        const diagram: Diagram | null = this.canvasRenderer ? this.canvasRenderer.getDiagram() : null;
        const mapper: DiagramMapper | null = this.canvasRenderer ? this.canvasRenderer.getMapper() : null;
        if (!diagram || !mapper) {
            return null;
        }
        const selected: NodeModel | ConnectorModel | undefined = this.extractSelectedDiagramItem(args);
        if (!selected) {
            return null;
        }
        if (this.isConnector(selected)) {
            return mapper.getConnectionForConnector(selected.id || '');
        }
        const stepId: string | null = mapper.getStepIdForNode(selected.id || '');
        if (stepId) {
            const step: WorkflowStep | undefined =
                this.workflowSteps.filter((s: WorkflowStep) => s.id === stepId)[0];
            if (step) {
                return step;
            }
        }
        const noteId: string | null = mapper.getStickyNoteIdForNode(selected.id || '');
        if (noteId) {
            const note: WorkflowStickyNote | undefined =
                this.stickyNotes.filter((n: WorkflowStickyNote) => n.id === noteId)[0];
            if (note) {
                return note;
            }
        }
        return null;
    }

    private extractSelectedDiagramItem(
        args: ISelectionChangeEventArgs
    ): NodeModel | ConnectorModel | undefined {
        if (
            args &&
            args.newValue &&
            args.newValue.length
        ) {
            return args.newValue[0] as
                NodeModel | ConnectorModel;
        }

        const diagram: Diagram | null =
            this.canvasRenderer
                ? this.canvasRenderer.getDiagram()
                : null;

        if (!diagram || !diagram.selectedItems) {
            return undefined;
        }

        const selectedNodes: NodeModel[] =
            diagram.selectedItems.nodes || [];

        if (selectedNodes.length) {
            return selectedNodes[0];
        }

        const selectedConnectors: ConnectorModel[] =
            diagram.selectedItems.connectors || [];

        if (selectedConnectors.length) {
            return selectedConnectors[0];
        }

        return undefined;
    }

    /**
     * Determines whether a Diagram object is a connector.
     *
     * @param {NodeModel | ConnectorModel} object - The Diagram object.
     * @returns {boolean} Whether the object is a connector.
     */
    private isConnector(object: NodeModel | ConnectorModel): object is ConnectorModel {
        return 'sourceID' in object || 'sourcePortID' in object;
    }

    /**
     * Toggles the read-only lock from the Lock command or Ctrl+L.
     *
     * @returns {void} Nothing.
     */
    private toggleReadOnly(): void {
        const readOnly: boolean = !(this.workflowSettings && this.workflowSettings.readOnly);
        this.setProperties({ workflowSettings: { ...(this.workflowSettings || {}), readOnly: readOnly } }, true);
        this.applyWorkflowSettings();
    }

    /**
     * Applies `workflowSettings` and `enableRtl` to the canvas and every panel. Used on first
     * change after render, by the Lock command and by `onPropertyChanged`.
     *
     * @returns {void} Nothing.
     */
    private rebindWorkflowSettingsShowGridLines(): void {
        if (!this.workflowSettings) {
            return;
        }
        const settings: WorkflowSettingsModel & { showGridLines?: boolean } = this.workflowSettings as WorkflowSettingsModel & {
            showGridLines?: boolean;
        };
        let current: boolean = settings.showGridLines === false ? false : true;
        Object.defineProperty(settings, 'showGridLines', {
            configurable: true,
            enumerable: true,
            get: (): boolean => current,
            set: (value: boolean): void => {
                const next: boolean = value === false ? false : true;
                if (current === next) {
                    return;
                }
                current = next;
                if (!this.disposed && this.canvasRenderer) {
                    this.applyWorkflowSettings();
                }
            }
        });
    }

    private applyWorkflowSettings(): void {
        const settingReadOnly: boolean = Boolean(this.workflowSettings && this.workflowSettings.readOnly);
        // A run in progress locks editing the same way read-only does, without changing the setting.
        const readOnly: boolean = this.isEditLocked();
        if (this.element) {
            this.element.classList.toggle('e-rtl', !!this.enableRtl);
            this.element.classList.toggle('e-wf-run-locked', readOnly && !settingReadOnly);
        }
        if (this.canvasRenderer) {
            this.canvasRenderer.applySettings({ ...(this.workflowSettings || {}), readOnly: readOnly }, !!this.enableRtl);
        }
        if (this.positionSynchronizer) {
            this.positionSynchronizer.setReadOnly(readOnly);
        }
        if (this.propertyPanel) {
            if (settingReadOnly) {
                this.propertyPanel.hide();
            }
            this.propertyPanel.setReadOnly(readOnly);
        }
        if (readOnly && this.nodeCollection && this.nodeCollection.isOpen()) {
            this.nodeCollection.close();
        }
        if (this.canvasToolbar) {
            this.canvasToolbar.setReadOnly(readOnly);
        }
        if (this.emptyCanvasAdd) {
            this.emptyCanvasAdd.setReadOnly(readOnly);
        }
        if (this.topToolbar) {
            this.topToolbar.applyEnabled(!(this.toolbarSettings && this.toolbarSettings.visible === false));
        }
        this.updateEmptyCanvasAdd();
    }

    /**
     * Opens a native file picker and imports the selected workflow JSON file.
     *
     * @returns {void} Nothing.
     */
    private triggerImportFile(): void {
        const input: HTMLInputElement = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json,.json';
        input.style.display = 'none';
        input.addEventListener('change', () => {
            const file: File | null = input.files && input.files.length ? input.files[0] : null;
            if (file) {
                this.importWorkflow(file).catch((error: Error) => {
                    // Keep the current workflow and tell the user why the file was rejected.
                    const message: string = this.l10n.getConstant('importFailed') + ' ' + (error && error.message ? error.message : '');
                    if (this.ariaLive) {
                        this.ariaLive.announce(message);
                    }
                    if (this.simulationLog) {
                        this.simulationLog.append({
                            timestamp: new Date().toISOString(),
                            level: 'Error',
                            message: message
                        } as unknown as WorkflowExecutionLogEntry);
                    }
                });
            }
            input.remove();
        });
        document.body.appendChild(input);
        input.click();
    }

    /**
     * Rebuilds the combined workflow ID registry.
     *
     * @returns {void} Nothing.
     */
    private rebuildRegistry(): void {
        // The registry must exist before render() walks the workflow items.
        // In rare ordering paths (such as the constructor of derived fixtures
        // that bypass the standard EJ2 lifecycle) the property can be
        // undefined; lazy-initialise so the render path never crashes a host
        // that is poking at render internals before initialisation completes.
        if (!this.registry) {
            this.registry = new IdRegistry();
        }
        this.registry.clear();
        this.workflowSteps.forEach((item: WorkflowStep) => this.registry.register(item.id || ''));
        this.workflowConnections.forEach((item: WorkflowConnection) => this.registry.register(item.id || ''));
        this.stickyNotes.forEach((item: WorkflowStickyNote) => this.registry.register(item.id || ''));
    }

    /**
     * Ensures the component has not been destroyed.
     *
     * @returns {void} Nothing.
     */
    private assertActive(): void {
        if (this.disposed) {
            throw new WorkflowError(LocaleContext.text('errorDestroyed'), 'DESTROYED');
        }
        // Every public method passes through here, so this instance's
        // localization is current for the rest of the synchronous call.
        this.bindLocale();
    }

    /**
     * Returns the initialized Diagram mapper.
     *
     * @returns {DiagramMapper} The initialized mapper.
     */
    private getMapper(): DiagramMapper {
        if (!this.canvasRenderer) {
            throw new Error('Workflow canvas is not initialized.');
        }
        const mapper: DiagramMapper | null = this.canvasRenderer.getMapper();
        if (!mapper) {
            throw new Error('Workflow mapper is not initialized.');
        }
        return mapper;
    }

    /**
     * Determines whether an item is a workflow step.
     *
     * @param {WorkflowStep | WorkflowConnection | WorkflowStickyNote} item - The workflow item.
     * @returns {boolean} Whether the item is a step.
     */
    private isStep(item: WorkflowStep | WorkflowConnection | WorkflowStickyNote): item is WorkflowStep {
        return 'stepType' in item;
    }

    /**
     * Determines whether a step type is a trigger.
     *
     * @param {WorkflowStepType | string | undefined} stepType - The step type.
     * @returns {boolean} Whether the type is a trigger.
     */
    private isTriggerStepType(stepType: WorkflowStepType | string | undefined): boolean {
        return stepType === 'ManualTrigger' || stepType === 'ScheduledTrigger'
            || stepType === 'WebhookTrigger' || stepType === 'FormInputTrigger';
    }

    /**
     * Determines whether an item is a workflow connection.
     *
     * @param {WorkflowStep | WorkflowConnection | WorkflowStickyNote} item - The workflow item.
     * @returns {boolean} Whether the item is a connection.
     */
    private isConnection(
        item: WorkflowStep | WorkflowConnection | WorkflowStickyNote
    ): item is WorkflowConnection {
        return 'sourceStepId' in item && 'targetStepId' in item;
    }

    /**
     * Reads a workflow file as text.
     *
     * @param {File} file - The file to read.
     * @returns {Promise<string>} The file contents.
     */
    private readFile(file: File): Promise<string> {
        return new Promise<string>((resolve: any, reject: any) => {
            const reader: FileReader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = () => reject(reader.error);
            reader.readAsText(file);
        });
    }

    /**
     * Applies the public dimensions to the component host. Numeric values use
     * CSS pixels, matching EJ2 Diagram dimension behavior.
     *
     * @returns {void} Nothing.
     */
    private applyDimensions(): void {
        if (this.width !== undefined && this.width !== null) {
            this.element.style.width = this.toCssDimension(this.width);
        } else {
            this.element.style.removeProperty('width');
        }
        if (this.height !== undefined && this.height !== null) {
            this.element.style.height = this.toCssDimension(this.height);
        } else {
            this.element.style.removeProperty('height');
        }
    }

    /**
     * Converts an EJ2 dimension value to a CSS dimension.
     *
     * @param {string | number | undefined} value - The configured dimension.
     * @returns {string} A CSS-compatible dimension.
     */
    private toCssDimension(value: string | number | undefined): string {
        if (typeof value === 'number') {
            return isFinite(value) && value >= 0 ? `${value}px` : '100%';
        }
        if (typeof value === 'string' && value.trim()) {
            return value.trim();
        }
        return '100%';
    }

}
