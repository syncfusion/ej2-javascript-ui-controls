import { Complex, Component, EmitType, Event, INotifyPropertyChanged, L10n, Property, SanitizeHtmlHelper, compile, getUniqueID } from '@syncfusion/ej2-base';import { runStoppedError } from './simulation/run-stopped';import { WorkflowStepState, WorkflowStepTemplateArgs } from './models/workflow-step-template';import { WorkflowAIAssistSettings } from './models/workflow-ai-assist-settings';import { WorkflowAIAssistSettingsModel } from './models/workflow-ai-assist-settings-model';import { WorkflowConnection } from './models/workflow-connection';import { WorkflowDefinitionModel } from './models/workflow-definition';import { WorkflowErrorSettings } from './models/workflow-error-settings';import { WorkflowAIRequest, WorkflowChangedEventArgs, WorkflowChangeType, WorkflowPropertyChange, WorkflowAIAssistCompletedEventArgs, WorkflowAIAssistFailedEventArgs, WorkflowCustomExecutionRequestedEventArgs, WorkflowSelectionChangedEventArgs, WorkflowNotifyRequestedEventArgs, WorkflowExecutionCompletedEventArgs, WorkflowExecutionStartedEventArgs, WorkflowExecutionStepCompletedEventArgs, WorkflowExecutionStepFailedEventArgs, WorkflowExecutionStepStartedEventArgs, WorkflowApprovalRequestedEventArgs, WorkflowCredentialRequestedEventArgs, WorkflowBeforeStepExecuteEventArgs, WorkflowBeforeItemRemoveEventArgs, WorkflowBeforeConnectEventArgs, WorkflowBeforeRequestSendEventArgs, WorkflowCreatedEventArgs } from './models/workflow-events';import { WorkflowStepCollectionSettings } from './models/workflow-node-collection-settings';import { WorkflowStepCollectionSettingsModel } from './models/workflow-node-collection-settings-model';import { WorkflowPosition } from './models/workflow-position';import { WorkflowPropertyPanelSettings } from './models/workflow-property-panel-settings';import { WorkflowPropertyPanelSettingsModel } from './models/workflow-property-panel-settings-model';import { WorkflowSettings } from './models/workflow-settings';import { WorkflowSettingsModel } from './models/workflow-settings-model';import { WorkflowExecutionLogSettings } from './models/workflow-execution-log-settings';import { WorkflowExecutionLogSettingsModel } from './models/workflow-execution-log-settings-model';import { WorkflowExecutionState, WorkflowExecutionStatus } from './models/workflow-enums';import { WorkflowExecutionResult } from './models/workflow-validation';import { WorkflowRuntimeContext } from './models/workflow-runtime-context';import { WorkflowStep } from './models/workflow-step';import { WorkflowStickyNote } from './models/workflow-sticky-note';import { WorkflowCanvasToolbarSettings, WorkflowToolbarSettings } from './models/workflow-toolbar-settings';import { WorkflowCanvasToolbarSettingsModel, WorkflowToolbarSettingsModel } from './models/workflow-toolbar-settings-model';import { WorkflowValidationMessage, WorkflowValidationResult, WorkflowExecutionLogEntry } from './models/workflow-validation';import { IdRegistry } from './persistence/id-registry';import { WorkflowError, WorkflowImportError } from './persistence/errors';import { WorkflowJsonSerializer } from './persistence/workflow-json-serializer';import { AriaLive } from './rendering/aria-live';import { CanvasRenderer } from './rendering/canvas-renderer';import { CanvasToolbar } from './rendering/canvas-toolbar';import { ServiceLocator } from './rendering/service';import { WorkspaceShell } from './rendering/workspace-shell';import { DEFAULT_PROJECT_NAME, TopToolbar } from './rendering/top-toolbar';import { NodeCollection } from './rendering/node-collection';import { EmptyCanvasAddControl } from './rendering/empty-canvas-add';import { InsertionController } from './interactions/insertion-controller';import { PositionSynchronizer } from './interactions/position-synchronizer';import { HandleActions } from './interactions/handle-actions';import { KeyboardHandler, KeyboardHandlerCallbacks } from './interactions/keyboard-handler';import { PropertyPanel } from './rendering/property-panel';import { FormInputDialog } from './rendering/editors/form-input-dialog';import { ApprovalDialog } from './rendering/editors/approval-dialog';import { SimulationLog } from './rendering/simulation-log';import { SimulationController } from './simulation/simulation-controller';import { AIAssistController } from './ai/ai-assist-controller';import { WorkflowValidator, isReservedId } from './validation/workflow-validator';import { LocaleContext } from './localization/locale-context';import { PortResolver } from './mapping/port-resolver';import { DiagramMapper } from './mapping/diagram-mapper';import { DefaultsResolver } from './mapping/defaults-resolver';import { NodeMapper } from './mapping/node-mapper';import { WorkflowStepType } from './models/workflow-enums';import { WebhookTriggerStepProps } from './models/workflow-step-props';import { Dialog, DialogUtility } from '@syncfusion/ej2-popups';import { Diagram, DiagramTools, ISelectionChangeEventArgs, NodeModel, ConnectorModel, IHistoryChangeArgs } from '@syncfusion/ej2-diagrams';import { WorkflowExecutionSettingsModel } from './models/workflow-execution-settings-model';import { WorkflowExecutionSettings } from './models/workflow-execution-settings';import { WorkflowWebhookTriggerMessage } from './runtime/workflow-webhook-trigger-api';import { normalizeWebhookPath } from './runtime/webhook-utils';import { isPromiseLike, resolveCancel } from './simulation/cancel';import { localeDefaults } from './localization/locale-defaults';
import {ComponentModel} from '@syncfusion/ej2-base';

/**
 * Interface for a class WorkflowDesigner
 */
export interface WorkflowDesignerModel extends ComponentModel{

    /**
     * Defines the width of the Workflow Designer. Accepts a number of pixels or any CSS length,
     * such as `'100%'` or `'800px'`.
     *
     * @default '100%'
     */
    width?: string | number;

    /**
     * Defines the height of the Workflow Designer. Accepts a number of pixels or any CSS length,
     * such as `'100%'` or `'600px'`.
     *
     * @default '100%'
     */
    height?: string | number;

    /**
     * Defines the canvas behavior of the Workflow Designer, including the selection tool, zoom limits,
     * automatic layout, grid lines and read-only mode.
     *
     * @default {}
     */
    workflowSettings?: WorkflowSettingsModel;

    /**
     * Defines the top toolbar: whether it is shown and which commands it contains,
     * such as Undo, Redo, Layout, Execute, Lock, Import and Export.
     *
     * @default {}
     */
    toolbarSettings?: WorkflowToolbarSettingsModel;

    /**
     * Defines the floating toolbar at the bottom of the canvas: whether it is shown and which commands
     * it contains, such as Add, Sticky Note, Select, Pan and the zoom controls.
     *
     * @default {}
     */
    canvasToolbarSettings?: WorkflowCanvasToolbarSettingsModel;

    /**
     * Defines the node collection, the panel users pick new workflow steps from.
     * The panel opens when the user adds a step and is collapsed otherwise.
     *
     * @default {}
     */
    stepCollectionSettings?: WorkflowStepCollectionSettingsModel;

    /**
     * Defines the property panel, which is used to configure the selected workflow step.
     * Selecting a sticky note does not open the property panel.
     *
     * @default {}
     */
    propertyPanelSettings?: WorkflowPropertyPanelSettingsModel;

    /**
     * Defines the execution log, the panel docked below the canvas that lists the progress and
     * result of each step during a run.
     *
     * @default {}
     */
    executionLogSettings?: WorkflowExecutionLogSettingsModel;

    /**
     * Defines how runs are paced, including the delay between steps and whether
     * Delay steps wait in real time.
     *
     * @default {}
     */
    executionSettings?: WorkflowExecutionSettingsModel;

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
    workflowStepTemplate?: string | Function;

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
    stepDefaults?: Function;

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
    connectionDefaults?: Function;

    /**
     * Defines AI Assist, which generates or updates the workflow from natural-language prompts.
     * AI Assist is disabled by default. To call an AI provider directly from the browser, set `provider`,
     * `model` and `credential`. To route requests through your own backend, set `mode` to `'Server'`
     * and `serverUrl`.
     *
     * @default { enabled: false }
     */
    aiAssistSettings?: WorkflowAIAssistSettingsModel;

    /**
     * Triggers once after the Workflow Designer has finished rendering.
     *
     * @event created
     */
    created?: EmitType<Object>;

    /**
     * Triggers after the workflow changes, whether the change is made in the UI (including a step
     * setting committed in the property panel) or by calling `importWorkflow` or
     * `clearWorkflow`. The `workflow` argument holds a snapshot of the updated workflow definition.
     *
     * @event workflowChanged
     */
    workflowChanged?: EmitType<WorkflowChangedEventArgs>;

    /**
     * Triggers when the selection on the canvas changes. The `selectedItem` argument holds the selected
     * step, connection or sticky note, or `null` when the selection is cleared.
     *
     * @event selectionChanged
     */
    selectionChanged?: EmitType<WorkflowSelectionChangedEventArgs>;

    /**
     * Triggers when a run starts, after the workflow passes validation.
     *
     * @event executionStarted
     */
    executionStarted?: EmitType<WorkflowExecutionStartedEventArgs>;

    /**
     * Triggers when a run reaches a step, before the step runs. The `step` argument holds
     * the step, `previousStep` and `incomingConnection` describe how it was reached, and `context` holds
     * the current runtime context.
     *
     * @event executionStepStarted
     */
    executionStepStarted?: EmitType<WorkflowExecutionStepStartedEventArgs>;

    /**
     * Triggers after a step completes during a run. The `result` argument holds the step's
     * response, and `outputPort` holds the output port the run continues from for branching steps such
     * as Condition and Switch.
     *
     * @event executionStepCompleted
     */
    executionStepCompleted?: EmitType<WorkflowExecutionStepCompletedEventArgs>;

    /**
     * Triggers when a step fails during a run. The `error` argument describes the failure.
     *
     * @event executionStepFailed
     */
    executionStepFailed?: EmitType<WorkflowExecutionStepFailedEventArgs>;

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
    executionCompleted?: EmitType<WorkflowExecutionCompletedEventArgs>;

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
    notifyRequested?: EmitType<WorkflowNotifyRequestedEventArgs>;

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
    customExecutionRequested?: EmitType<WorkflowCustomExecutionRequestedEventArgs>;

    /**
     * Triggers when an Approve step runs and the host should route the request to its reviewers.
     * Call `args.complete({ decision: 'approved' | 'declined' })` when a reviewer decides. When no
     * handler is bound, a built-in approval dialog is shown so the run can be tested in the browser.
     *
     * @event approvalRequested
     * @private
     */
    approvalRequested?: EmitType<WorkflowApprovalRequestedEventArgs>;

    /**
     * Triggers when an AI or API Request step needs a secret. Look up `args.credentialRef` in your
     * secret store and call `args.complete(secret)`. Required in the default `Reference` credential mode.
     *
     * @event credentialRequested
     * @private
     */
    credentialRequested?: EmitType<WorkflowCredentialRequestedEventArgs>;

    /**
     * Triggers before each step runs, including Loop steps. Set `args.cancel` to true to end the run
     * with status `'Cancelled'` before the step executes.
     *
     * @event beforeStepExecute
     * @private
     */
    beforeStepExecute?: EmitType<WorkflowBeforeStepExecuteEventArgs>;

    /**
     * Triggers before an API Request or AI step sends its request, so the host can change the
     * request, route it through its own backend, supply the response itself or cancel it.
     * Runs make real network calls unless this event supplies the response.
     *
     * @event beforeRequestSend
     */
    beforeRequestSend?: EmitType<WorkflowBeforeRequestSendEventArgs>;

    /**
     * Triggers before the user removes a step, connection or sticky note. Set `args.cancel` to true
     * to keep the item.
     *
     * @event beforeItemRemove
     * @private
     */
    beforeItemRemove?: EmitType<WorkflowBeforeItemRemoveEventArgs>;

    /**
     * Triggers before the user adds a connection. Set `args.cancel` to true to reject the connection.
     *
     * @event beforeConnect
     * @private
     */
    beforeConnect?: EmitType<WorkflowBeforeConnectEventArgs>;

    /**
     * Triggers after AI Assist generates a workflow, validates it and applies it to the canvas.
     * The `workflow` argument holds the applied workflow definition.
     *
     * @event aiAssistCompleted
     */
    aiAssistCompleted?: EmitType<WorkflowAIAssistCompletedEventArgs>;

    /**
     * Triggers when an AI Assist request fails and won't be retried. The current workflow is left
     * unchanged. The `error` argument describes the failure.
     *
     * @event aiAssistFailed
     */
    aiAssistFailed?: EmitType<WorkflowAIAssistFailedEventArgs>;

}