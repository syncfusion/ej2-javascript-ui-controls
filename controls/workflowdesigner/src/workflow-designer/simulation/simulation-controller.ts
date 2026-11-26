import { L10n } from '@syncfusion/ej2-base';
import { isRunStopped, runStoppedError } from './run-stopped';
import { LocaleContext } from '../localization/locale-context';
import { WorkflowConnection } from '../models/workflow-connection';
import { WorkflowDefinitionModel } from '../models/workflow-definition';
import { WorkflowErrorSettings } from '../models/workflow-error-settings';
import { WorkflowRuntimeContext, WorkflowStepResult } from '../models/workflow-runtime-context';
import { WorkflowExecutionSettingsModel } from '../models/workflow-execution-settings-model';
import { WorkflowExecutionState } from '../models/workflow-enums';
import { WorkflowStep } from '../models/workflow-step';
import { WorkflowStickyNote } from '../models/workflow-sticky-note';
import { WorkflowExecutionError, WorkflowExecutionLogEntry, WorkflowExecutionResult, WorkflowValidationMessage, WorkflowValidationResult } from '../models/workflow-validation';
import { ExecutionDispatcher, ExecutionHost, StepExecutionResult } from './execution-dispatcher';
import { FormatterOutput } from './formatter-output';
import { RuntimeContextStore } from './runtime-context-store';
import { WorkflowValidator } from '../validation/workflow-validator';
import { ExpressionEvaluator } from './expression-evaluator';
import { ScheduleEvaluator, ScheduleOccurrence, ScheduleProps, ScheduleRunStatus, ScheduleValidationIssue } from './schedule-evaluator';
import { resolveCancel } from './cancel';
import { localeDefaults } from '../localization/locale-defaults';

/**
 * Simulation Hooks.
 *
 * @private
 */
export interface SimulationHooks {
    getDefinition: () => WorkflowDefinitionModel;
    getSteps: () => WorkflowStep[];
    getConnections: () => WorkflowConnection[];
    getStickyNotes?: () => WorkflowStickyNote[];
    trigger: (name: string, args: Record<string, unknown>) => void;
    requestHost: (eventName: string, args: Record<string, unknown>, signal: AbortSignal, timeoutMs: number) => Promise<unknown>;
    setState: (state: WorkflowExecutionState) => void;
    applyNodeState: (stepId: string, state: 'processing' | 'completed' | 'error' | 'idle') => void;
    applyConnectorState: (connectionId: string, state: 'visited' | 'error' | 'idle') => void;
    /**
     * Removes ONLY the running-stroke animation from one step's rendered
     * card, leaving the node's status fill/border colors untouched. Used by
     * the user-initiated Stop / Cancel paths so a stopped run keeps its
     * completed / failed status but stops the dashed "processing" animation.
     */
    stopStepAnimation?: (stepId: string) => boolean;
    appendLog: (entry: WorkflowExecutionLogEntry) => void;
    promptForm?: (step: WorkflowStep, signal: AbortSignal) => Promise<unknown>;
    promptApproval?: (step: WorkflowStep, signal: AbortSignal) => Promise<unknown>;
    /**
     * Optional probe that reports whether the host handles an event.
     */
    hasHostEventHandler?: (eventName: string) => boolean;
    /** Identifies the workflow and designer instance; used to scope AI memory. */
    getWorkflowScope?: () => string;
}

/**
 * Owns simulation lifecycle: validate, run, stop, reset.
 *
 * @private
 */
export class SimulationController {
    /** Upper bound on step executions in one run; stops runaway graphs instead of freezing the page. */
    public static readonly MAX_STEPS_PER_RUN: number = 10000;
    /**
     * Context Store.
     *
     * @private
     */
    public readonly contextStore: RuntimeContextStore = new RuntimeContextStore();
    /**
     * Logs.
     *
     * @private
     */
    public logs: WorkflowExecutionLogEntry[] = [];
    /**
     * Visited Steps.
     *
     * @private
     */
    public visitedSteps: string[] = [];
    /** Loop steps whose iteration is currently executing (innermost last). */
    private activeLoops: string[] = [];
    /** Steps executed in the current run, used for the runaway-run guard. */
    private stepCount: number = 0;
    /**
     * Visited Connections.
     *
     * @private
     */
    public visitedConnections: string[] = [];
    /**
     * State.
     *
     * @private
     */
    public state: WorkflowExecutionState = 'Idle';
    private abortController: AbortController | null = null;
    private stopEmitted: boolean = false;
    private singleStepMode: boolean = false;
    private readonly validator: WorkflowValidator;
    /**
     * Localization instance shared with the Workflow Designer shell.
     * Wired by the constructor and refreshed on `setLocale(l10n)`.
     *
     * @private
     */
    private l10n: L10n | undefined;
    /** Schedule auto-run timer (1 s). */
    private scheduleWatcherTimer: ReturnType<typeof setInterval> | null = null;
    /** De-dupe keys for auto-fired schedule occurrences. */
    private scheduledRunKeys: { [key: string]: boolean } = Object.create(null);
    /** Tracks the current recurring/cron trigger being executed (for multi-occurrence continuity). */
    private recurringTriggerId: string | null = null;
    /** Store the schedule props for the current recurring trigger. */
    private recurringTriggerProps: ScheduleProps | null = null;
    /**
     * The ScheduledTrigger step currently driving a run (Once / Recurring /
     * Cron). Tracked so `stopSimulation()` can return the trigger node to an
     * inactive state on user Stop, regardless of schedule type.
     */
    private activeScheduledTriggerId: string | null = null;
    private readonly hooks: SimulationHooks;
    private readonly simulationSettings?: WorkflowExecutionSettingsModel;
    private readonly errorSettings?: WorkflowErrorSettings;

    /**
     * Creates the instance.
     *
     * @param {SimulationHooks} hooks The hooks.
     * @param {WorkflowExecutionSettingsModel} simulationSettings The simulation settings.
     * @param {WorkflowErrorSettingsModel} errorSettings The error settings.
     * @param {L10n} [l10n] - Optional localization instance for runtime
     *   status messages surfaced through `appendLog` / `getRunStatus`.
     *   Falls back to the bundled English defaults when omitted.
     * @returns {void} Nothing.
     * @private
     */
    public constructor(
        hooks: SimulationHooks,
        simulationSettings?: WorkflowExecutionSettingsModel,
        errorSettings?: WorkflowErrorSettings,
        l10n?: L10n
    ) {
        this.hooks = hooks;
        this.simulationSettings = simulationSettings;
        this.errorSettings = errorSettings;
        this.l10n = l10n;
        this.validator = new WorkflowValidator(l10n);
    }

    /**
     * Updates the shared localization instance and re-pushes it into every
     * collaborator that has a stored L10n reference. Mirrors the pattern in
     * `WorkflowDesigner.onPropertyChanged` so the entire simulation surface
     * (validator, executors, dispatcher, error log) flips language as one.
     *
     * @param {L10n} [l10n] - Optional localization instance. Pass `undefined`
     *   to revert collaborators to English fallbacks.
     * @returns {void} Nothing.
     * @private
     */
    public setLocale(l10n?: L10n): void {
        this.l10n = l10n;
    }

    /**
     * Resolves a translation key against the shared L10n instance.
     *
     * @param {string} key - The localization key to resolve.
     * @returns {string} The translated string, or the English fallback.
     * @private
     */
    /**
     * Translates a key and fills its `{0}`, `{1}` ... placeholders.
     *
     * @param {string} key - The locale key.
     * @param {...string} values - The placeholder values.
     * @returns {string} The text.
     */
    private format(key: string, ...values: string[]): string {
        return values.reduce((text: string, value: string, index: number) => text.split('{' + index + '}').join(value), this.t(key));
    }

    private t(key: string): string {
        if (this.l10n) {
            const value: string = this.l10n.getConstant(key);
            if (value) {
                return value;
            }
        }
        return localeDefaults[`${key}`] || key;
    }

    /**
     * Validates the current workflow and emits the validation event.
     *
     * @returns {WorkflowValidationResult} The validation result.
     * @private
     */
    public validateWorkflow(): WorkflowValidationResult {
        this.validator.setCredentialMode(this.simulationSettings && this.simulationSettings.credentialMode);
        const result: WorkflowValidationResult = this.validator.validate(
            this.hooks.getSteps(),
            this.hooks.getConnections(),
            this.hooks.getStickyNotes ? this.hooks.getStickyNotes() : []
        );
        return result;
    }

    /**
     * Runs the whole workflow. `options.auto` marks a schedule-watcher fire so the occurrence key
     * is recorded.
     *
     * @param {WorkflowRuntimeContext} [context] - Initial runtime context.
     * @param {string} [selectedTriggerId] - Optional trigger identifier.
     * @param {object} [options] - Run options.
     * @param {boolean} [options.auto] - Whether this is an automatic schedule run.
     * @returns {Promise<WorkflowExecutionResult>} The simulation result.
     * @private
     */
    public async runSimulation(
        context?: WorkflowRuntimeContext,
        selectedTriggerId?: string,
        options?: { auto?: boolean; isAutoFire?: boolean }
    ): Promise<WorkflowExecutionResult> {

        // Clear prior run paints before every full execution (including failed
        // validation) so re-run from the toolbar never leaves stale node/connector colors.
        this.resetExecutionVisuals();
        const validation: WorkflowValidationResult = this.validateWorkflow();
        if (!validation.isValid) {
            this.setState('Failed');
            // Always surface the start trigger first so the log mirrors the
            // authored path even when later steps fail property validation.
            this.logTriggerBaseline(selectedTriggerId);
            this.appendGroupedValidationLogs(validation.messages);
            const error: WorkflowExecutionError = {
                type: 'Validation',
                message: this.t('workflowValidationFailed'),
                details: validation.messages
            };
            const failed: WorkflowExecutionResult = {
                status: 'Failed',
                stepResults: [],
                visitedConnections: [],
                error
            };
            this.appendFinalLog('Failed', this.t('executionFailedMessage'), error);
            this.triggerCompleted(failed);
            return failed;
        }

        const start: WorkflowStep | null = this.selectStart(selectedTriggerId);
        if (!start) {
            const error: WorkflowExecutionError = {
                type: 'Runtime',
                message: this.t('selectTriggerBeforeRun')
            };
            this.setState('Failed');
            this.appendFinalLog('Failed', error.message, error);
            const failed: WorkflowExecutionResult = {
                status: 'Failed',
                stepResults: [],
                visitedConnections: [],
                error
            };
            this.triggerCompleted(failed);
            return failed;
        }

        // Initialize abort controller early so it can be used for ScheduledTrigger waits.
        this.abortController = new AbortController();

        // Handle ScheduledTrigger: validate, then wait for scheduled time if needed.
        if (start.stepType === 'ScheduledTrigger') {
            const props: ScheduleProps = (start.props || {}) as ScheduleProps;
            // Track the trigger driving this run so Stop can return it to an
            // inactive state for every schedule type (not just Recurring/Cron).
            this.activeScheduledTriggerId = start.id || null;
            const scheduleType: unknown = props.scheduleType || 'Once';
            // Track recurring trigger for multi-occurrence continuity and start watcher
            if ((scheduleType === 'Recurring' || scheduleType === 'Cron') && !this.recurringTriggerId) {
                this.recurringTriggerId = start.id || null;
                this.recurringTriggerProps = props;
                // Start the schedule watcher only for Recurring/Cron execution
                this.startScheduleWatcher();
            }

            // Validate the schedule configuration (only check format/required fields, not timing).
            const validationIssues: ScheduleValidationIssue[] = ScheduleEvaluator.validate(props);
            if (validationIssues.length > 0) {
                // Schedule has configuration errors (missing fields, invalid format, etc.)
                const errorMessage: string = validationIssues.map((issue: ScheduleValidationIssue) => issue.message).join('; ');
                this.appendLog({
                    timestamp: Date.now(),
                    stepId: start.id,
                    status: 'Validation',
                    message: this.format('scheduleValidationFailed', errorMessage),
                    contextSummary: this.contextStore.snapshot()
                });
                this.setState('Idle');
                return {
                    status: 'Completed',
                    stepResults: [],
                    visitedConnections: []
                };
            }

            // Schedule is valid. Get next occurrence and determine wait/execution logic.
            const occ: ScheduleOccurrence | null = ScheduleEvaluator.nextOccurrence(props);
            if (!occ) {
                this.appendLog({
                    timestamp: Date.now(),
                    stepId: start.id,
                    status: 'Validation',
                    message: this.format('scheduleNoNextOccurrence', String(scheduleType)),
                    contextSummary: this.contextStore.snapshot()
                });
                this.setState('Idle');
                return {
                    status: 'Completed',
                    stepResults: [],
                    visitedConnections: []
                };
            }

            const occurrenceLabel: string = occ.label;
            const now: number = Date.now();
            const waitMs: number = Math.max(0, occ.time - now);
            // Capture the abort signal before any host callback runs: a host
            // hook (e.g. applyNodeState firing a synchronous Stop) can null
            // this.abortController between here and the wait call.
            const waitSignal: AbortSignal = this.abortController.signal;

            // Apply "processing" state to show running animation
            if (start.id) {
                this.hooks.applyNodeState(start.id, 'processing');
                this.visitedSteps.push(start.id);
            }

            // Log execution starting with next scheduled time
            this.appendLog({
                timestamp: Date.now(),
                stepId: start.id,
                status: 'Started',
                message: this.format('scheduleRunScheduled', String(scheduleType), occurrenceLabel),
                contextSummary: this.contextStore.snapshot()
            });

            // For 'Once' type or if there's a future time, wait for the scheduled time.
            // For auto-fired Recurring/Cron, they should execute immediately (already due from watcher).
            if (waitMs > 0) {
                // Visible to hosts and to the concurrent-run guard while armed.
                this.setState('Scheduled');
                const waitDone: boolean = await this.waitForScheduledTime(waitMs, start.id || '', waitSignal);
                if (!waitDone) {
                    // Wait was cancelled (simulation stopped or aborted).
                    if (start.id && this.hooks.stopStepAnimation) {
                        this.hooks.stopStepAnimation(start.id);
                    }
                    this.setState('Stopped');
                    return this.stoppedResult();
                }
            }
        }
        // Race guard: the scheduled wait resolved successfully but Stop may
        // have landed in the same tick (or the schedule was already due and
        // Stop arrived first). Never resurrect a stopped run.
        // (State is read into a local so the comparison does not narrow
        // `this.state` for the guards further down the run. A null
        // abortController means stopSimulation() already released it.)
        const stoppedByUser: boolean = this.state === 'Stopped';
        const signalAborted: boolean = this.abortController ? this.abortController.signal.aborted : true;
        if (signalAborted || stoppedByUser) {
            if (start.id && this.hooks.stopStepAnimation) {
                this.hooks.stopStepAnimation(start.id);
            }
            this.setState('Stopped');
            return this.stoppedResult();
        }
        this.stopEmitted = false;
        this.singleStepMode = false;
        this.visitedSteps = []; this.activeLoops = []; this.stepCount = 0;
        this.visitedConnections = [];
        if (context && context.input) {
            this.contextStore.setInput(context.input.response, context.input.webhook);
        }
        this.setState('Running');
        // Full-run start entry mirrors the terminal "Execution completed." row
        // so the log reflects the full lifecycle and resets UI run-state flags.
        this.appendLog({
            timestamp: Date.now(),
            stepId: start.id,
            status: 'Started',
            message: this.t('executionStartedMessage'),
            contextSummary: this.contextStore.snapshot()
        });
        this.hooks.trigger('simulationStarted', { workflow: this.hooks.getDefinition() });
        const dispatcher: ExecutionDispatcher = new ExecutionDispatcher(
            this.contextStore,
            this.createHost(),
            this.errorSettings,
            this.simulationSettings,
            false,
            this.l10n
        );
        try {
            // For recurring triggers, loop through all occurrences in a single execution
            let continueRecurringExecution: boolean = true;
            while (continueRecurringExecution) {
                // Check for abort signal before each iteration
                if (this.abortController.signal.aborted) {
                    if (start.id && this.hooks.stopStepAnimation) {
                        this.hooks.stopStepAnimation(start.id);
                    }
                    this.setState('Stopped');
                    return this.stoppedResult();
                }

                await this.walk(start, dispatcher, this.abortController.signal, undefined, undefined);
                if (this.state === 'Stopped') {
                    // stopSimulation already appended the Stopped final row.
                    return this.stoppedResult();
                }

                // Check if this is a recurring trigger with more occurrences
                continueRecurringExecution = false;
                if (this.recurringTriggerId && this.recurringTriggerProps) {
                    const scheduleType: unknown = this.recurringTriggerProps.scheduleType || 'Once';
                    if (this.hasMoreOccurrences(this.recurringTriggerProps, scheduleType)) {
                        // More occurrences coming - get next scheduled time and wait
                        const nextOcc: ScheduleOccurrence | null =
                            ScheduleEvaluator.nextOccurrenceAfter(this.recurringTriggerProps, Date.now());
                        if (nextOcc) {
                            const now: number = Date.now();
                            const waitMs: number = Math.max(0, nextOcc.time - now);

                            // Log only the next occurrence time ONCE (not every second)
                            if (waitMs > 0) {
                                this.appendLog({
                                    timestamp: Date.now(),
                                    stepId: this.recurringTriggerId,
                                    status: 'Started',
                                    message: this.format('scheduleNextRun', nextOcc.label),
                                    contextSummary: this.contextStore.snapshot()
                                });
                            }

                            // Keep node in processing state
                            this.hooks.applyNodeState(this.recurringTriggerId, 'processing');

                            // Wait for next occurrence
                            if (waitMs > 0) {
                                this.setState('Scheduled');
                                const waitDone: boolean =
                                    await this.waitForScheduledTime(waitMs, this.recurringTriggerId, this.abortController.signal);
                                if (!waitDone) {
                                    // Wait was cancelled (user clicked Stop)
                                    if (this.recurringTriggerId && this.hooks.stopStepAnimation) {
                                        this.hooks.stopStepAnimation(this.recurringTriggerId);
                                    }
                                    this.setState('Stopped');
                                    return this.stoppedResult();
                                }
                            }

                            this.setState('Running');
                            // Reset visited steps/connections for next iteration but keep context
                            this.visitedSteps = []; this.activeLoops = []; this.stepCount = 0;
                            this.visitedConnections = [];
                            this.resetExecutionVisuals();
                            continueRecurringExecution = true;
                        }
                    }
                }

                if (!continueRecurringExecution) {
                    break;
                }
            }

            // All occurrences exhausted - mark final completion and stop watcher
            if (this.recurringTriggerId && this.recurringTriggerProps) {
                const scheduleType: unknown = this.recurringTriggerProps.scheduleType || 'Once';
                this.appendLog({
                    timestamp: Date.now(),
                    stepId: this.recurringTriggerId,
                    status: 'Completed',
                    message: this.format('scheduleAllOccurrencesCompleted', String(scheduleType)),
                    contextSummary: this.contextStore.snapshot()
                });
                this.recurringTriggerId = null;
                this.recurringTriggerProps = null;
                // Stop the watcher since recurring execution is done
                this.stopScheduleWatcher();
            }

            this.setState('Completed');
            const completed: WorkflowExecutionResult = {
                status: 'Completed',
                ...this.runOutcome(),
                visitedConnections: this.visitedConnections.slice()
            };
            this.appendFinalLog('Completed', this.t('executionCompletedMessage'));
            this.triggerCompleted(completed);
            return completed;
        } catch (error) {
            // A stopped run unwinds with the RUN_STOPPED error code; do NOT
            // localize it. Only the user-facing log row (Execution stopped.)
            // is translated.
            if (error && (error as { runCancelled?: boolean }).runCancelled) {
                return this.cancelledResult(error as WorkflowExecutionError);
            }
            if (this.state === 'Stopped' || isRunStopped(error)) {
                if (this.state !== 'Stopped') {
                    this.setState('Stopped');
                }
                // stopSimulation already appended the Stopped final row when
                // invoked via the public API; only add one for abort-only paths.
                if (!this.stopEmitted) {
                    this.stopEmitted = true;
                    this.appendFinalLog('Stopped', this.t('executionStoppedMessage'));
                }
                return this.stoppedResult();
            }
            const simulationError: WorkflowExecutionError = this.toError(error);
            this.setState('Failed');
            const failed: WorkflowExecutionResult = {
                status: 'Failed',
                ...this.runOutcome(),
                visitedConnections: this.visitedConnections.slice(),
                error: simulationError
            };
            this.appendFinalLog('Failed', simulationError.message || this.t('executionFailedMessage'), simulationError);
            this.triggerCompleted(failed);
            return failed;
        } finally {
            this.activeScheduledTriggerId = null;
            this.abortController = null;
        }
    }

    /**
     * Run From Step.
     *
     * @param {string} stepId The step id.
     * @param {WorkflowRuntimeContext} context The context.
     * @returns {Promise} The result.
     * @private
     */
    public async runFromStep(stepId: string, context?: WorkflowRuntimeContext): Promise<WorkflowExecutionResult> {
        // Debug/replay entrypoint: start at the named step (may be non-trigger).
        // Full-run UI uses runSimulation() with trigger-only start selection.
        this.resetExecutionVisuals();
        const validation: WorkflowValidationResult = this.validateWorkflow();
        if (!validation.isValid) {
            this.setState('Failed');
            this.appendGroupedValidationLogs(validation.messages);
            const error: WorkflowExecutionError = {
                type: 'Validation',
                message: this.t('workflowValidationFailed'),
                details: validation.messages
            };
            const failed: WorkflowExecutionResult = {
                status: 'Failed',
                stepResults: [],
                visitedConnections: [],
                error
            };
            this.appendFinalLog('Failed', this.t('executionFailedMessage'), error);
            this.triggerCompleted(failed);
            return failed;
        }
        this.abortController = new AbortController();
        this.stopEmitted = false;
        this.singleStepMode = false;
        this.visitedSteps = []; this.activeLoops = []; this.stepCount = 0;
        this.visitedConnections = [];
        if (context && context.input) {
            this.contextStore.setInput(context.input.response, context.input.webhook);
        }
        this.setState('Running');
        // Start entry so run-from-step logs carry the same lifecycle contract
        // as full runs (start + terminal row).
        this.appendLog({
            timestamp: Date.now(),
            stepId,
            status: 'Started',
            message: this.t('executionStartedMessage'),
            contextSummary: this.contextStore.snapshot()
        });
        this.hooks.trigger('simulationStarted', { workflow: this.hooks.getDefinition() });
        const dispatcher: ExecutionDispatcher = new ExecutionDispatcher(
            this.contextStore,
            this.createHost(),
            this.errorSettings,
            this.simulationSettings,
            false,
            this.l10n
        );
        try {
            const named: WorkflowStep | undefined = this.hooks.getSteps().filter(
                (step: WorkflowStep) => step.id === stepId
            )[0];
            if (!named) {
                // RUN_STOPPED / 'Step not found for runFromStep.'
                // are control-flow errors that bubble up to the caller — the
                // host decides whether to surface them. We translate only
                // the user-facing strings; these remain English so the
                // existing catch-blocks that compare them keep matching.
                throw new Error('Step not found for runFromStep.');
            }
            await this.walk(named, dispatcher, this.abortController.signal, undefined, undefined);
            if (this.state === 'Stopped') {
                return this.stoppedResult();
            }
            this.setState('Completed');
            const completed: WorkflowExecutionResult = {
                status: 'Completed',
                ...this.runOutcome(),
                visitedConnections: this.visitedConnections.slice()
            };
            this.appendFinalLog('Completed', this.t('executionCompletedMessage'));
            this.triggerCompleted(completed);
            return completed;
        } catch (error) {
            // A stopped run unwinds with the RUN_STOPPED error code; do NOT
            // localize it. Only the user-facing log row (Execution stopped.)
            // is translated.
            if (error && (error as { runCancelled?: boolean }).runCancelled) {
                return this.cancelledResult(error as WorkflowExecutionError);
            }
            if (this.state === 'Stopped' || isRunStopped(error)) {
                if (this.state !== 'Stopped') {
                    this.setState('Stopped');
                }
                if (!this.stopEmitted) {
                    this.stopEmitted = true;
                    this.appendFinalLog('Stopped', this.t('executionStoppedMessage'));
                }
                return this.stoppedResult();
            }
            const simulationError: WorkflowExecutionError = this.toError(error);
            this.setState('Failed');
            const failed: WorkflowExecutionResult = {
                status: 'Failed',
                ...this.runOutcome(),
                visitedConnections: this.visitedConnections.slice(),
                error: simulationError
            };
            this.appendFinalLog('Failed', simulationError.message || this.t('executionFailedMessage'), simulationError);
            this.triggerCompleted(failed);
            return failed;
        } finally {
            this.abortController = null;
        }
    }


    /**
     * Execute Single Step.
     *
     * @param {WorkflowStep} step The step.
     * @returns {Promise} The result.
     * @private
     */
    public async executeSingleStep(step: WorkflowStep): Promise<StepExecutionResult> {
        this.singleStepMode = true;
        // Single-step execute must honor the same required-field rules as full-run
        // validation (e.g. ScheduledTrigger date/time) before dispatching.
        this.validator.setCredentialMode(this.simulationSettings && this.simulationSettings.credentialMode);
        const stepValidation: WorkflowValidationResult = this.validator.validateStepProps(step);
        if (!stepValidation.isValid) {
            const firstError: WorkflowValidationMessage | undefined = stepValidation.messages.find(
                (message: WorkflowValidationMessage) => message.type === 'Error'
            ) || stepValidation.messages[0];
            this.appendGroupedValidationLogs(
                stepValidation.messages.map((message: WorkflowValidationMessage) => ({
                    ...message,
                    stepId: step.id || message.stepId
                }))
            );
            this.hooks.applyNodeState(step.id || '', 'error');
            this.singleStepMode = false;
            const error: WorkflowExecutionError = {
                type: 'Validation',
                code: firstError && firstError.code,
                message: (firstError && firstError.message) || this.t('stepValidationFailed'),
                stepId: step.id,
                details: stepValidation.messages
            };
            throw error;
        }
        // Gate for single-step ScheduledTrigger (same as full-run manual path).
        if (step.stepType === 'ScheduledTrigger') {
            const props: ScheduleProps = (step.props || {}) as ScheduleProps;
            const status: ScheduleRunStatus = ScheduleEvaluator.getRunStatus(props);
            if (!status.canRun) {
                this.appendLog({
                    timestamp: Date.now(),
                    stepId: step.id,
                    status: 'NotRunning',
                    message: status.message,
                    contextSummary: this.contextStore.snapshot()
                });
                this.singleStepMode = false;
                return { response: { notRunning: true, reason: status.message }, outputPort: 'output' };
            }
        }
        // Log execution start for single-step mode to show "running" status in header
        this.appendLog({
            timestamp: Date.now(),
            stepId: step.id,
            status: 'Started',
            message: this.t('executionStartedMessage'),
            contextSummary: this.contextStore.snapshot()
        });
        const dispatcher: ExecutionDispatcher = new ExecutionDispatcher(
            this.contextStore,
            this.createHost(),
            this.errorSettings,
            this.simulationSettings,
            true,
            this.l10n
        );
        this.hooks.applyNodeState(step.id || '', 'processing');
        try {
            const result: StepExecutionResult = await dispatcher.execute(step);
            this.hooks.applyNodeState(step.id || '', 'completed');
            // Log successful completion for single-step mode
            this.appendFinalLog('Completed', this.t('stepCompletedMessage'));
            return result;
        } catch (error) {
            this.hooks.applyNodeState(step.id || '', 'error');
            const simulationError: WorkflowExecutionError = this.toError(error);
            // Log failed completion for single-step mode
            this.appendFinalLog('Failed', simulationError.message || this.t('stepExecutionFailedMessage'), simulationError);
            throw error;
        } finally {
            this.singleStepMode = false;
        }
    }

    /**
     * Stops the current simulation.
     *
     * @returns {void} Nothing.
     * @private
     */
    public stopSimulation(): void {
        if (this.abortController) {
            this.abortController.abort();
        }
        // Stop the schedule watcher to prevent auto-firing after user stops
        this.stopScheduleWatcher();

        // End all running animations immediately. The active schedule trigger
        // is explicitly returned to idle so the canvas no longer reports it as running.
        this.clearRunningAnimationsOnly();
        if (this.activeScheduledTriggerId) {
            this.hooks.applyNodeState(this.activeScheduledTriggerId, 'idle');
        } else if (this.recurringTriggerId) {
            this.hooks.applyNodeState(this.recurringTriggerId, 'idle');
        }

        // Reset recurring tracking and release the cancelled controller.
        this.activeScheduledTriggerId = null;
        this.recurringTriggerId = null;
        this.recurringTriggerProps = null;
        this.abortController = null;

        if (!this.stopEmitted) {
            this.stopEmitted = true;
            this.setState('Stopped');
            this.appendFinalLog('Stopped', this.t('executionStoppedMessage'));
            this.triggerCompleted(this.stoppedResult());
        }
    }

    /**
     * Strips the running-stroke animation from every step that currently has
     * one painted, without touching its stored state or status fill/border
     * colors. Used by `stopSimulation` (user-initiated Stop) so the canvas
     * stops "processing" motion but keeps the completed/failed/idle paint
     * the run reached before cancellation.
     *
     * @returns {void} Nothing.
     */
    private clearRunningAnimationsOnly(): void {
        if (!this.hooks.stopStepAnimation) {
            return;
        }
        const steps: WorkflowStep[] = this.hooks.getSteps() || [];
        for (let i: number = 0; i < steps.length; i++) {
            const step: WorkflowStep = steps[parseInt(i.toString(), 10)];
            if (!step || !step.id) {
                continue;
            }
            this.hooks.stopStepAnimation(step.id);
        }
    }

    /**
     * Resets simulation state, logs, and visual state.
     *
     * @returns {void} Nothing.
     * @private
     */
    public resetSimulation(): void {
        if (this.abortController) {
            this.abortController.abort();
        }
        this.activeScheduledTriggerId = null;
        this.recurringTriggerId = null;
        this.recurringTriggerProps = null;
        this.contextStore.reset();
        this.logs = [];
        this.visitedSteps = []; this.activeLoops = []; this.stepCount = 0;
        this.visitedConnections = [];
        this.stopEmitted = false;
        this.scheduledRunKeys = {};
        this.resetExecutionVisuals();
        this.setState('Idle');
    }

    /**
     * Schedule watcher tick: polls every second and auto-runs when a
     * ScheduledTrigger occurrence is due and not already fired.
     *
     * Note: A cooldown period is applied after a ScheduledTrigger's properties
     * are modified (via the property panel) to prevent auto-fire immediately
     * after the user changes the schedule datetime. This ensures that editing
     * the schedule does not trigger the workflow unintentionally.
     *
     * @returns {void} Nothing.
     * @private
     */
    public startScheduleWatcher(): void {
        this.stopScheduleWatcher();
        this.scheduleWatcherTimer = setInterval(() => {
            void this.tickScheduleWatcher();
        }, 1000);
    }

    /**
     * Stops the scheduled-trigger watcher.
     *
     * @returns {void} Nothing.
     * @private
     */
    public stopScheduleWatcher(): void {
        if (this.scheduleWatcherTimer !== null) {
            clearInterval(this.scheduleWatcherTimer);
            this.scheduleWatcherTimer = null;
        }
    }

    /**
     * Waits for a ScheduledTrigger to reach its scheduled time.
     *
     * @param {number} waitMs - Milliseconds to wait until the scheduled time.
     * @param {string} stepId - The ScheduledTrigger step ID (for logging).
     * @param {AbortSignal} signal - Signal to cancel the wait (e.g., on stopSimulation).
     * @returns {Promise<boolean>} True if wait completed, false if cancelled.
     * @private
     */
    private waitForScheduledTime(waitMs: number, stepId: string, signal: AbortSignal): Promise<boolean> {
        return new Promise<boolean>((resolve: (value: boolean) => void) => {
            if (waitMs <= 0) {
                resolve(true);
                return;
            }

            let resolved: boolean = false;

            const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    signal.removeEventListener('abort', abortHandler);
                    resolve(true);
                }
            }, waitMs);

            // If the simulation is cancelled (via stopSimulation), resolve with false immediately.
            const abortHandler: () => void = () => {
                if (!resolved) {
                    resolved = true;
                    clearTimeout(timeoutId);
                    resolve(false);
                }
            };

            // Check if signal is already aborted before adding listener
            if (signal.aborted) {
                clearTimeout(timeoutId);
                resolve(false);
                return;
            }

            signal.addEventListener('abort', abortHandler);
        });
    }

    /**
     * Checks if a recurring trigger has more occurrences coming.
     *
     * @param {ScheduleProps} props - The schedule props.
     * @param {ScheduleType} scheduleType - The schedule type.
     * @returns {boolean} True if more occurrences are coming, false otherwise.
     * @private
     */
    private hasMoreOccurrences(props: ScheduleProps, scheduleType: unknown): boolean {
        const occ: ScheduleOccurrence | null = ScheduleEvaluator.nextOccurrence(props);
        if (!occ) {
            return false;
        }

        // For Recurring, check limits
        if (scheduleType === 'Recurring') {
            const now: number = Date.now();
            const startStr: unknown = props.startDateTime;
            if (!startStr) {
                return false;
            }
            const start: Date = new Date(String(startStr));
            if (isNaN(start.getTime())) {
                return false;
            }
            const startMs: number = start.getTime();

            // Convert interval to milliseconds
            const intervalVal: number = Number(props.interval || 0);
            const unitStr: string = String(props.intervalUnit || 'Minutes');
            let intervalMs: number = 0;
            if (unitStr === 'Minutes') {
                intervalMs = intervalVal * 60000;
            } else if (unitStr === 'Hours') {
                intervalMs = intervalVal * 3600000;
            } else if (unitStr === 'Days') {
                intervalMs = intervalVal * 86400000;
            } else if (unitStr === 'Weeks') {
                intervalMs = intervalVal * 604800000;
            } else {
                intervalMs = intervalVal * 60000;
            }

            if (intervalMs <= 0) {
                return false;
            }

            const occurrence: number = now <= startMs ? 0 : Math.floor((now - startMs) / intervalMs);

            // Check if we've hit the max occurrences limit
            const max: number = Number(props.maxOccurrences || 0);
            if (max > 0 && occurrence >= max - 1) {
                // Current occurrence is the last one
                return false;
            }

            // Check if we've passed the end date
            const endStr: unknown = props.endDateTime;
            if (endStr) {
                const end: Date = new Date(String(endStr));
                if (!isNaN(end.getTime()) && now > end.getTime()) {
                    return false;
                }
            }

            return true;
        }

        // For Cron, always consider there are more occurrences (until endDate)
        if (scheduleType === 'Cron') {
            const endStr: unknown = props.endDateTime;
            if (endStr) {
                const end: Date = new Date(String(endStr));
                if (!isNaN(end.getTime()) && Date.now() > end.getTime()) {
                    return false;
                }
            }
            return true;
        }

        return false;
    }

    /**
     * Stops timers; call from WorkflowDesigner.destroy.
     *
     * @returns {void} Nothing.
     * @private
     */
    public dispose(): void {
        this.stopScheduleWatcher();
        if (this.abortController) {
            this.abortController.abort();
            this.abortController = null;
        }
    }

    /**
     * Auto-run timer tick: checks all ScheduledTriggers (Recurring, Cron) for next occurrence.
     * For 'Once' triggers, only manual Execute is supported (not auto-fired).
     * Recurring and Cron triggers fire automatically when their next occurrence arrives.
     *
     * @returns {Promise<void>} Nothing.
     * @private
     */
    private async tickScheduleWatcher(): Promise<void> {
        try {
            const steps: WorkflowStep[] = this.hooks.getSteps();
            if (!steps || steps.length === 0) {
                return;
            }

            // Scan for ScheduledTrigger (Recurring/Cron) that are due to fire.
            for (const step of steps) {
                if (step.stepType !== 'ScheduledTrigger' || !step.id) {
                    continue;
                }

                const props: ScheduleProps = (step.props || {}) as ScheduleProps;
                const scheduleType: unknown = props.scheduleType;

                // Only auto-fire Recurring and Cron; 'Once' is manual-only.
                if (scheduleType !== 'Recurring' && scheduleType !== 'Cron') {
                    continue;
                }

                // Skip if this recurring trigger is already being executed (in multi-occurrence loop).
                // The runSimulation method handles waiting for the next occurrence internally.
                if (this.recurringTriggerId === step.id) {
                    continue;
                }

                // Skip if validation fails.
                const validationIssues: ScheduleValidationIssue[] = ScheduleEvaluator.validate(props);
                if (validationIssues.length > 0) {
                    continue;
                }

                // Get next occurrence and build de-dupe key.
                const occ: ScheduleOccurrence | null = ScheduleEvaluator.nextOccurrence(props);
                if (!occ) {
                    continue;
                }

                const runKey: string = ScheduleEvaluator.runKey(step.id, props, occ.key);

                // De-dupe: skip if already fired this occurrence.
                if (this.scheduledRunKeys[`${runKey}`]) {
                    continue;
                }

                // Check if occurrence is now due.
                const now: number = Date.now();
                if (occ.time > now) {
                    // Not yet due; skip.
                    continue;
                }

                // Due! Mark as fired and auto-run the workflow.
                this.scheduledRunKeys[`${runKey}`] = true;

                // Apply processing state and trigger auto-run (minimal logging).
                this.hooks.applyNodeState(step.id, 'processing');
                await this.runSimulation(this.contextStore.snapshot(), step.id, { isAutoFire: true });
            }
        } catch (error) {
            // Silently swallow errors in watcher tick to avoid breaking the interval.
            // Errors are logged to the simulation log, not thrown.
        }
    }

    /**
     * Restores every step/connector to idle visuals without clearing logs or runtime context.
     * Used at the start of each run so previous blue/green/red paints do not linger.
     * /
     *
     * @returns {void} Nothing.
     */
    private resetExecutionVisuals(): void {
        this.hooks.getSteps().forEach((step: WorkflowStep) => {
            if (step.stepType === 'Formatter') {
                FormatterOutput.clearRuntimeOutput(step.customProps);
                // Drop expanded size so the next idle paint restores DEFAULT 180×80.
                if (step.size) {
                    step.size = { width: 180, height: 80 };
                }
            }
            this.hooks.applyNodeState(step.id || '', 'idle');
        });
        this.hooks.getConnections().forEach((connection: WorkflowConnection) => {
            this.hooks.applyConnectorState(connection.id || '', 'idle');
        });
    }

    private async walk(
        step: WorkflowStep,
        dispatcher: ExecutionDispatcher,
        signal: AbortSignal,
        previous?: WorkflowStep,
        incoming?: WorkflowConnection
    ): Promise<void> {
        if (signal.aborted) {
            throw runStoppedError();
        }
        // Each step resumes after an await, possibly after another designer
        // instance ran; make this run's localization current again.
        LocaleContext.set(this.l10n);
        if (step.stepType === 'Loop' && this.activeLoops.indexOf(step.id || '') !== -1) {
            // A connection back into a running Loop closes the current
            // iteration; the Loop itself advances to the next item.
            return;
        }
        const before: { step: WorkflowStep; previousStep?: WorkflowStep; incomingConnection?: WorkflowConnection;
            context: unknown; cancel: boolean | Promise<boolean> } = {
            step: step, previousStep: previous, incomingConnection: incoming, context: this.contextStore.get(), cancel: false
        };
        this.hooks.trigger('beforeStepExecute', before);
        const cancelled: boolean = await resolveCancel(before.cancel);
        if (signal.aborted) {
            throw runStoppedError();
        }
        if (cancelled) {
            throw Object.assign(new Error('The run was cancelled before step ' + (step.id || '') + '.'), {
                type: 'Runtime', code: 'RUN_CANCELLED', stepId: step.id, runCancelled: true
            });
        }
        if (++this.stepCount > SimulationController.MAX_STEPS_PER_RUN) {
            throw Object.assign(new Error('The run exceeded ' + SimulationController.MAX_STEPS_PER_RUN + ' step executions and was stopped.'), {
                type: 'Runtime', code: 'STEP_LIMIT', stepId: step.id
            });
        }
        this.visitedSteps.push(step.id || '');
        this.hooks.applyNodeState(step.id || '', 'processing');
        await this.pace(signal);
        if (step.stepType === 'Loop') {
            await this.runLoop(step, dispatcher, signal, previous, incoming);
            this.hooks.applyNodeState(step.id || '', 'completed');
            return;
        }
        let result: StepExecutionResult;
        try {
            result = await dispatcher.execute(step, previous, incoming, signal);
        } catch (error) {
            if (error && (error as { runCancelled?: boolean }).runCancelled) {
                throw error;
            }
            const errorOutgoing: WorkflowConnection[] = this.hooks.getConnections().filter(
                (connection: WorkflowConnection) =>
                    connection.sourceStepId === step.id && this.logicalPort(connection.sourcePort) === 'error'
            );
            if (errorOutgoing.length) {
                this.hooks.applyNodeState(step.id || '', 'error');
                await this.follow(errorOutgoing, dispatcher, signal, step);
                return;
            }
            // No error port — mark the node as error so its animated
            // 'processing' border stops, then re-throw so the run-level
            // catch can transition to Failed / Stopped. Without this,
            // an explicit failure (form-input cancel, validation throw)
            // leaves the animated border pinned in place.
            this.hooks.applyNodeState(step.id || '', 'error');
            throw error;
        }
        this.hooks.applyNodeState(step.id || '', 'completed');
        if (this.singleStepMode && step.stepType === 'FormInputTrigger') {
            return;
        }
        if (!result.outputPort) {
            return;
        }
        const outgoing: WorkflowConnection[] = this.hooks.getConnections().filter(
            (connection: WorkflowConnection) => {
                if (connection.sourceStepId !== step.id) {
                    return false;
                }
                const sourcePort: string = this.logicalPort(connection.sourcePort);
                if (result.outputPort === '*') {
                    return sourcePort !== 'error';
                }
                return sourcePort === result.outputPort;
            }
        );
        await this.follow(outgoing, dispatcher, signal, step);
    }

    private async follow(
        outgoing: WorkflowConnection[],
        dispatcher: ExecutionDispatcher,
        signal: AbortSignal,
        step: WorkflowStep
    ): Promise<void> {
        for (let i: number = 0; i < outgoing.length; i++) {
            await this.followOne(outgoing[parseInt(i.toString(), 10)], dispatcher, signal, step);
        }
    }

    private async followOne(
        connection: WorkflowConnection,
        dispatcher: ExecutionDispatcher,
        signal: AbortSignal,
        step: WorkflowStep
    ): Promise<void> {
        this.visitedConnections.push(connection.id || '');
        this.hooks.applyConnectorState(connection.id || '', 'visited');
        // Brief hold so connector stroke/decorator highlight is visible before next node.
        await this.pace(signal);
        const next: WorkflowStep | undefined = this.hooks.getSteps().filter(
            (candidate: WorkflowStep) => candidate.id === connection.targetStepId
        )[0];
        if (next) {
            await this.walk(next, dispatcher, signal, step, connection);
        }
    }

    private async runLoop(
        step: WorkflowStep,
        dispatcher: ExecutionDispatcher,
        signal: AbortSignal,
        previous?: WorkflowStep,
        incoming?: WorkflowConnection
    ): Promise<void> {
        const props: Record<string, unknown> = (step.props && typeof step.props === 'object') ? step.props as Record<string, unknown> : {};
        const itemsPath: string = String(props.itemsPath || '');
        const items: unknown = ExpressionEvaluator.resolve(itemsPath, this.contextStore.get());
        // A list loops over its items; a single value counts as a one-item list.
        // A missing value loops zero times, with a warning so a wrong path is visible.
        let list: unknown[];
        if (Array.isArray(items)) {
            list = items;
        } else if (items === undefined || items === null) {
            list = [];
            this.appendLog({
                timestamp: Date.now(),
                stepId: step.id,
                status: 'Warning',
                message: this.t('loopItemsMissing').replace('{0}', itemsPath || '(empty)'),
                contextSummary: this.contextStore.snapshot()
            });
        } else {
            list = [items];
        }
        const maxIterations: number = typeof props.maxIterations === 'number' ? props.maxIterations : list.length;
        const body: WorkflowConnection[] = this.hooks.getConnections().filter(
            (connection: WorkflowConnection) =>
                connection.sourceStepId === step.id && this.logicalPort(connection.sourcePort) === 'loop'
        );
        const done: WorkflowConnection[] = this.hooks.getConnections().filter(
            (connection: WorkflowConnection) =>
                connection.sourceStepId === step.id && this.logicalPort(connection.sourcePort) === 'done'
        );
        const priorStep: WorkflowStepResult | undefined = this.contextStore.get().previousStep;
        const resultsBefore: WorkflowStepResult[] = this.contextStore.stepResults();
        this.contextStore.recordStep(step.id || '', 'Loop', step.name || '', list);
        // Capture pre-loop state so exitLoop can restore previousStep /
        // outer-loop context for the `done` branch.
        this.hooks.trigger('simulationStepStarted', { step, previousStep: priorStep, incomingConnection: incoming,
            outgoingConnections: this.hooks.getConnections().filter((c: WorkflowConnection) => c.sourceStepId === step.id),
            stepResults: resultsBefore });
        this.contextStore.enterLoop(step.id || '', list);
        this.activeLoops.push(step.id || '');
        for (let index: number = 0; index < list.length && index < maxIterations; index++) {
            if (signal.aborted) {
                throw runStoppedError();
            }
            const iterationStepStart: number = this.visitedSteps.length;
            const iterationConnectionStart: number = this.visitedConnections.length;
            // Pass `list` as the 4th argument so the store can expose
            // `$.loop.all` (the entire iteration array) alongside the
            // current item. The store also rewires `previousStep.response`
            // to `list[index]` so body steps bound to `{{$.previousStep}}`
            // receive one item per iteration instead of the whole array.
            this.contextStore.setLoop(index, list.length, list[parseInt(index.toString(), 10)], list);
            for (let i: number = 0; i < body.length; i++) {
                const connection: WorkflowConnection = body[parseInt(i.toString(), 10)];
                this.visitedConnections.push(connection.id || '');
                this.hooks.applyConnectorState(connection.id || '', 'visited');
                await this.pace(signal);
                const next: WorkflowStep | undefined = this.hooks.getSteps().filter(
                    (candidate: WorkflowStep) => candidate.id === connection.targetStepId
                )[0];
                if (next && next.id !== step.id) {
                    await this.walk(next, dispatcher, signal, step, connection);
                }
            }
            const hasNextIteration: boolean = index + 1 < list.length && index + 1 < maxIterations;
            if (hasNextIteration) {
                this.resetIterationVisuals(iterationStepStart, iterationConnectionStart);
            }
        }
        this.activeLoops.pop();
        this.contextStore.clearLoop();
        this.hooks.trigger('simulationStepCompleted', { step, result: list, outputPort: 'done', stepResults: this.contextStore.stepResults(),
            previousStep: priorStep, incomingConnection: incoming, followedConnections: done });
        for (let i: number = 0; i < done.length; i++) {
            const connection: WorkflowConnection = done[parseInt(i.toString(), 10)];
            this.visitedConnections.push(connection.id || '');
            this.hooks.applyConnectorState(connection.id || '', 'visited');
            await this.pace(signal);
            const next: WorkflowStep | undefined = this.hooks.getSteps().filter(
                (candidate: WorkflowStep) => candidate.id === connection.targetStepId
            )[0];
            if (next) {
                await this.walk(next, dispatcher, signal, step, connection);
            }
        }
    }

    private resetIterationVisuals(stepStart: number, connectionStart: number): void {
        for (let index: number = stepStart; index < this.visitedSteps.length; index++) {
            this.hooks.applyNodeState(this.visitedSteps[parseInt(index.toString(), 10)], 'idle');
        }
        for (let index: number = connectionStart; index < this.visitedConnections.length; index++) {
            this.hooks.applyConnectorState(this.visitedConnections[parseInt(index.toString(), 10)], 'idle');
        }
    }

    /**
     * Selects the trigger used to start a full workflow run.
     *
     * @param {string} [selectedTriggerId] - Optional selected trigger identifier.
     * @returns {WorkflowStep | null} The selected trigger, or null.
     */
    private selectStart(selectedTriggerId?: string): WorkflowStep | null {
        // Full-run always begins at a trigger. A selected non-trigger step must
        // not skip the Manual/Schedule/etc. trigger (simulation log first step).
        if (selectedTriggerId) {
            const named: WorkflowStep | undefined = this.hooks.getSteps().filter(
                (step: WorkflowStep) => step.id === selectedTriggerId
            )[0];
            if (named && this.isTriggerStep(named)) {
                return named;
            }
            // Non-trigger selection is ignored for full-run start; fall through
            // to the default single-trigger resolution (do not pass the id into
            // selectTrigger or multi-trigger lookup would incorrectly return null).
        }
        return this.selectTrigger();
    }

    private isTriggerStep(step: WorkflowStep): boolean {
        return step.stepType === 'ManualTrigger' || step.stepType === 'ScheduledTrigger'
            || step.stepType === 'WebhookTrigger' || step.stepType === 'FormInputTrigger';
    }

    private stepDisplayName(stepId: string): string | undefined {
        const step: WorkflowStep | undefined = this.hooks.getSteps().filter(
            (candidate: WorkflowStep) => candidate.id === stepId
        )[0];
        if (!step) {
            return undefined;
        }
        return step.name || step.id;
    }

    /**
     * When full-run validation fails before walk(), still record the chosen
     * trigger as a completed baseline entry so the first step is visible.
     *
     * @param {string} [selectedTriggerId] - Optional explicit trigger identifier.
     * @returns {void} Nothing.
     */
    private logTriggerBaseline(selectedTriggerId?: string): void {
        const trigger: WorkflowStep | null = this.selectStart(selectedTriggerId);
        if (!trigger || !trigger.id) {
            return;
        }
        const name: string = trigger.name || trigger.id;
        this.contextStore.recordStep(
            trigger.id,
            trigger.stepType || 'ManualTrigger',
            name,
            this.contextStore.get().input ? this.contextStore.get().input.response : undefined
        );
        this.appendLog({
            timestamp: Date.now(),
            stepId: trigger.id,
            status: 'Completed',
            message: this.t('stepCompletedMessage'),
            contextSummary: this.contextStore.snapshot()
        });
        this.hooks.applyNodeState(trigger.id, 'completed');
    }


    /**
     * Emit one Validation log row per step/connection group. Multiple messages
     * for the same step share a single expandable parent row.
     *
     * @param {WorkflowValidationMessage[]} messages - Validation messages to group.
     * @returns {void} Nothing.
     */
    private appendGroupedValidationLogs(messages: WorkflowValidationMessage[]): void {
        if (!messages || !messages.length) {
            return;
        }
        const groups: {
            key: string;
            stepId?: string;
            connectionId?: string;
            texts: string[];
            first: WorkflowValidationMessage;
        }[] = [];
        const indexByKey: { [key: string]: number } = Object.create(null);

        messages.forEach((message: WorkflowValidationMessage) => {
            const stepKey: string = message.stepId ? ('s:' + message.stepId) : '';
            const connKey: string = message.connectionId ? ('c:' + message.connectionId) : '';
            const key: string = stepKey || connKey || ('m:' + groups.length + ':' + String(message.message || ''));
            const existingIndex: number | undefined = indexByKey[`${key}`];
            if (existingIndex === undefined) {
                indexByKey[`${key}`] = groups.length;
                groups.push({
                    key,
                    stepId: message.stepId,
                    connectionId: message.connectionId,
                    texts: [message.message],
                    first: message
                });
            } else {
                groups[parseInt(existingIndex.toString(), 10)].texts.push(message.message);
            }
            if (message.stepId) {
                this.hooks.applyNodeState(message.stepId, 'error');
            }
            if (message.connectionId) {
                this.hooks.applyConnectorState(message.connectionId, 'error');
            }
        });

        const stamp: number = Date.now();
        groups.forEach((group: {
            key: string;
            stepId?: string;
            connectionId?: string;
            texts: string[];
            first: WorkflowValidationMessage;
        }, groupIndex: number) => {
            const stepName: string | undefined = group.stepId
                ? this.stepDisplayName(group.stepId)
                : undefined;
            const count: number = group.texts.length;
            const primary: string = group.texts[0] || 'Validation failed.';
            const summary: string = count > 1
                ? (count + ' validation issues')
                : primary;
            const message: string = stepName && count === 1
                ? (stepName + ': ' + primary)
                : summary;
            this.appendLog({
                // Slight offset so grouped rows keep stable order if UI sorts by time.
                timestamp: stamp + groupIndex,
                stepId: group.stepId,
                connectionId: group.connectionId,
                status: 'Validation',
                message,
                messages: count > 1 ? group.texts.slice() : undefined,
                error: {
                    type: 'Validation',
                    code: group.first.code,
                    message: primary,
                    stepId: group.stepId,
                    details: count > 1 ? group.texts.slice() : undefined
                }
            });
        });
    }
    private appendFinalLog(
        outcome: 'Completed' | 'Failed' | 'Stopped',
        message: string,
        error?: WorkflowExecutionError
    ): void {
        const status: WorkflowExecutionLogEntry['status'] =
            outcome === 'Stopped' ? 'Stopped' : 'Final';
        this.appendLog({
            timestamp: Date.now(),
            status,
            message,
            error,
            contextSummary: this.contextStore.snapshot()
        });
    }


    private selectTrigger(selectedTriggerId?: string): WorkflowStep | null {
        const triggers: WorkflowStep[] = this.hooks.getSteps().filter((step: WorkflowStep) => {
            return step.stepType === 'ManualTrigger' || step.stepType === 'ScheduledTrigger'
                || step.stepType === 'WebhookTrigger' || step.stepType === 'FormInputTrigger';
        });
        if (selectedTriggerId) {
            return triggers.filter((step: WorkflowStep) => step.id === selectedTriggerId)[0] || null;
        }
        if (triggers.length === 1) {
            return triggers[0];
        }
        if (triggers.length > 1) {
            // A manual run must never implicitly choose between independent
            // entry points. The toolbar supplies the selected trigger id.
            return null;
        }
        return this.hooks.getSteps()[0] || null;
    }

    /**
     * Raises `simulationCompleted` with the run outcome and the ordered step results.
     *
     * @param {WorkflowExecutionResult} result - The run result.
     * @returns {void} Nothing.
     */
    private triggerCompleted(result: WorkflowExecutionResult): void {
        this.hooks.trigger('simulationCompleted', {
            workflow: this.hooks.getDefinition(),
            result: {
                status: result.status,
                stepResults: result.stepResults,
                visitedConnections: result.visitedConnections.slice(),
                lastStep: result.lastStep,
                error: result.error
            }
        });
    }

    private createHost(): ExecutionHost {
        return {
            getConnections: () => this.hooks.getConnections(),
            trigger: (name: string, args: Record<string, unknown>) => this.hooks.trigger(name, args),
            requestHost: (eventName: string, args: Record<string, unknown>, signal: AbortSignal, timeoutMs: number) =>
                this.hooks.requestHost(eventName, args, signal, timeoutMs),
            appendLog: (entry: WorkflowExecutionLogEntry) => this.appendLog(entry),
            promptForm: this.hooks.promptForm,
            promptApproval: this.hooks.promptApproval,
            // Lets the dispatcher check whether the host handles an event.
            hasHostEventHandler: (eventName: string) => this.hooks.hasHostEventHandler
                ? this.hooks.hasHostEventHandler(eventName)
                : true,
            setWaiting: (waiting: boolean) => {
                if (this.state === 'Running' || this.state === 'WaitingForHuman') {
                    this.setState(waiting ? 'WaitingForHuman' : 'Running');
                }
            },
            getWorkflowScope: this.hooks.getWorkflowScope
        };
    }

    private setState(state: WorkflowExecutionState): void {
        this.state = state;
        // Internal-only state surface. simulationStarted and
        // simulationCompleted (executionStarted / executionCompleted)
        // are the public transition events.
        this.hooks.setState(state);
    }

    private appendLog(entry: WorkflowExecutionLogEntry): void {
        this.logs.push(entry);
        this.hooks.appendLog(entry);
    }

    /**
     * Normalizes connection sourcePort to the logical branch name used by step
     * results (`true`/`false`/`output`/`loop`/`done`/`error`). Accepts diagram
     * port ids such as `Condition:output:false` or trailing path segments.
     * /
     *
     * @param {string} [sourcePort] - The source port identifier.
     * @returns {string} The logical port name.
     */
    private logicalPort(sourcePort?: string): string {
        const raw: string = String(sourcePort || '').trim();
        if (!raw) {
            return 'output';
        }
        if (raw.indexOf(':') === -1) {
            return raw;
        }
        const parts: string[] = raw.split(':').filter((part: string) => part.length > 0);
        return parts.length ? parts[parts.length - 1] : raw;
    }

    private cancelledResult(error: WorkflowExecutionError): WorkflowExecutionResult {
        this.setState('Cancelled');
        if (error.stepId) {
            this.hooks.applyNodeState(error.stepId, 'idle');
        }
        this.appendFinalLog('Stopped', error.message);
        const cancelled: WorkflowExecutionResult = {
            status: 'Cancelled',
            ...this.runOutcome(),
            visitedConnections: this.visitedConnections.slice(),
            error: error
        };
        this.triggerCompleted(cancelled);
        return cancelled;
    }

    /**
     * Builds the run-level step data of a result: ordered step results and the last step that ran.
     *
     * @returns {object} The `stepResults` and `lastStep` values.
     */
    private runOutcome(): { stepResults: WorkflowStepResult[]; lastStep?: WorkflowStepResult } {
        const stepResults: WorkflowStepResult[] = this.contextStore.stepResults();
        return { stepResults, lastStep: stepResults.length ? stepResults[stepResults.length - 1] : undefined };
    }

    private stoppedResult(): WorkflowExecutionResult {
        return {
            status: 'Stopped',
            ...this.runOutcome(),
            visitedConnections: this.visitedConnections.slice()
        };
    }

    private toError(error: unknown): WorkflowExecutionError {
        if (error && typeof error === 'object' && (error as WorkflowExecutionError).message) {
            return error as WorkflowExecutionError;
        }
        return { type: 'Runtime', message: error instanceof Error ? error.message : String(error) };
    }

    private async pace(signal: AbortSignal): Promise<void> {
        const speed: unknown = this.simulationSettings && this.simulationSettings.executionSpeed;
        let delay: number = 0;
        if (typeof speed === 'number') {
            delay = Math.max(0, speed);
        } else if (speed === 'Instant') {
            // Accepted for workflows configured before executionSpeed became a number.
            delay = 0;
        } else if (speed === 'Slow') {
            delay = 900;
        } else {
            delay = 550;
        }
        if (!delay) {
            return;
        }
        await new Promise<void>((resolve: () => void, reject: (reason?: unknown) => void) => {
            const timer: number = setTimeout(() => resolve(), delay) as unknown as number;
            const onAbort: () => void = (): void => {
                clearTimeout(timer);
                reject(runStoppedError());
            };
            if (signal.aborted) {
                onAbort();
                return;
            }
            signal.addEventListener('abort', onAbort, { once: true });
        });
    }
}

