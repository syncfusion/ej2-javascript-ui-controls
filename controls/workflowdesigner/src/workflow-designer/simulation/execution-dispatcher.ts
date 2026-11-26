import { L10n } from '@syncfusion/ej2-base';
import { runStoppedError } from './run-stopped';
import { LocaleContext } from '../localization/locale-context';
import { WorkflowConnection } from '../models/workflow-connection';
import { WorkflowErrorSettings } from '../models/workflow-error-settings';
import { WorkflowExecutionSettingsModel } from '../models/workflow-execution-settings-model';
import { WorkflowStep } from '../models/workflow-step';
import { WorkflowExecutionError } from '../models/workflow-validation';
import { WorkflowExecutionLogEntry } from '../models/workflow-validation';
import { WorkflowRuntimeContext, WorkflowStepResult } from '../models/workflow-runtime-context';
import { BranchEvaluator } from './branch-evaluator';
import { ErrorPolicy } from './error-policy';
import { ExpressionEvaluator } from './expression-evaluator';
import { RuntimeContextStore } from './runtime-context-store';
import { ScheduleEvaluator } from './schedule-evaluator';
import { SecretRedactor } from './secret-redactor';
import { FormatterOutput } from './formatter-output';
import { ApiRequestExecutor } from './api-request-executor';
import { AiRequestExecutor } from './ai-request-executor';
import { AIMemoryIntegration } from '../ai/ai-memory-integration';
import { ConditionRule } from '../models/workflow-shared-types';
import { PortResolver } from '../mapping/port-resolver';
import { resolveCancel } from './cancel';
import { localeDefaults } from '../localization/locale-defaults';

/**
 * Execution Host.
 *
 * @private
 */
export interface ExecutionHost {
    trigger: (name: string, args: Record<string, unknown>) => void;
    requestHost: (
        eventName: string,
        args: Record<string, unknown>,
        signal: AbortSignal,
        timeoutMs: number
    ) => Promise<unknown>;
    appendLog?: (entry: WorkflowExecutionLogEntry) => void;
    /** Returns the workflow connections, used to report a step's outgoing connections. */
    getConnections?: () => WorkflowConnection[];
    promptForm?: (step: WorkflowStep, signal: AbortSignal) => Promise<unknown>;
    promptApproval?: (step: WorkflowStep, signal: AbortSignal) => Promise<unknown>;
    /**
     * Optional probe that reports whether the host handles an event. When
     * omitted, events are raised and an unhandled one fails with `NO_HANDLER`.
     */
    hasHostEventHandler?: (eventName: string) => boolean;
    /** Marks the run as waiting for a person (approval) or running again. */
    setWaiting?: (waiting: boolean) => void;
    /** Identifies the workflow and designer instance; used to scope AI memory. */
    getWorkflowScope?: () => string;
}

/**
 * Step Execution Result.
 *
 * @private
 */
export interface StepExecutionResult {
    response: unknown;
    outputPort?: string;
}

interface ExecutionPolicy {
    timeoutMs: number;
    continueOnError: boolean;
    retryPolicy: { enabled?: boolean; maxAttempts?: number; delayMs?: number };
}

/**
 * Executes a single workflow step, including host callbacks and retries.
 *
 * @private
 */
export class ExecutionDispatcher {
    private readonly contextStore: RuntimeContextStore;
    private readonly host: ExecutionHost;
    private readonly errorSettings?: WorkflowErrorSettings;
    private readonly simulationSettings?: WorkflowExecutionSettingsModel;
    private readonly strictMissingData: boolean;
    /**
     * Optional localization instance for runtime error messages that bubble
     * up to the user (retry notice, missing upstream data, delay timeout,
     * approval host missing, form input cancelled). When omitted, English
     * fallbacks are used.
     *
     * @private
     */
    private readonly l10n: L10n | undefined;

    /**
     * Creates the instance.
     *
     * @param {RuntimeContextStore} contextStore The context store.
     * @param {ExecutionHost} host The host.
     * @param {WorkflowErrorSettingsModel} errorSettings The error settings.
     * @param {WorkflowExecutionSettingsModel} simulationSettings The simulation settings.
     * @param {boolean} strictMissingData The strict missing data.
     * @param {L10n} [l10n] - Optional localization instance.
     * @returns {void} Nothing.
     * @private
     */
    public constructor(
        contextStore: RuntimeContextStore,
        host: ExecutionHost,
        errorSettings?: WorkflowErrorSettings,
        simulationSettings?: WorkflowExecutionSettingsModel,
        strictMissingData: boolean = false,
        l10n?: L10n
    ) {
        this.contextStore = contextStore;
        this.host = host;
        this.errorSettings = errorSettings;
        this.simulationSettings = simulationSettings;
        this.strictMissingData = strictMissingData;
        this.l10n = l10n;
    }

    /**
     * Resolves a translation key against the shared L10n instance.
     *
     * @param {string} key - The localization key to resolve.
     * @returns {string} The translated string, or the English fallback.
     * @private
     */
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
     * Lists the connections leaving a step; with an output port, only those the run follows.
     *
     * @param {WorkflowStep} step The step.
     * @param {string} [outputPort] The output port the run continues from.
     * @returns {WorkflowConnection[]} The outgoing connections.
     * @private
     */
    private outgoingConnections(step: WorkflowStep, outputPort?: string): WorkflowConnection[] {
        const all: WorkflowConnection[] = this.host.getConnections ? this.host.getConnections() : [];
        const logical: (port?: string) => string = (port?: string): string => {
            const parts: string[] = String(port || '').trim().split(':').filter((part: string) => part.length > 0);
            return parts.length ? parts[parts.length - 1] : 'output';
        };
        return all.filter((connection: WorkflowConnection) => {
            if (connection.sourceStepId !== step.id) {
                return false;
            }
            if (outputPort === undefined) {
                return true;
            }
            return outputPort === '*' ? logical(connection.sourcePort) !== 'error' : logical(connection.sourcePort) === outputPort;
        });
    }

    /**
     * Execute.
     *
     * @param {WorkflowStepModel} step The step.
     * @param {WorkflowStepModel} previous The previous.
     * @param {WorkflowConnectionModel} incoming The incoming.
     * @param {AbortSignal} signal The signal.
     * @returns {Promise} The result.
     * @private
     */
    public async execute(
        step: WorkflowStep,
        previous?: WorkflowStep,
        incoming?: WorkflowConnection,
        signal?: AbortSignal
    ): Promise<StepExecutionResult> {
        const context: WorkflowRuntimeContext = this.contextStore.get();
        const priorStep: WorkflowStepResult | undefined = context.previousStep;
        this.host.trigger('simulationStepStarted', {
            step, previousStep: priorStep, incomingConnection: incoming,
            outgoingConnections: this.outgoingConnections(step),
            stepResults: this.contextStore.stepResults()
        });
        const started: number = Date.now();
        try {
            const resolvedProps: unknown = ExpressionEvaluator.resolveDeep(step.props || {}, context);
            this.warnUnresolved(step, step.props, context);
            const result: StepExecutionResult = await this.dispatch(step, resolvedProps, signal || new AbortController().signal);
            LocaleContext.set(this.l10n);
            this.contextStore.recordStep(step.id || '', step.stepType || 'Custom', step.name || '', result.response);
            this.host.trigger('simulationStepCompleted', {
                step,
                result: result.response,
                outputPort: result.outputPort,
                stepResults: this.contextStore.stepResults(),
                previousStep: priorStep,
                incomingConnection: incoming,
                followedConnections: this.outgoingConnections(step, result.outputPort)
            });
            this.log(step, 'Completed', this.t('stepCompleted'), Date.now() - started);
            return result;
        } catch (error) {
            LocaleContext.set(this.l10n);
            // Host calling args.fail() on an AI / ApiRequest observer event is
            // treated as a hard failure for this iteration: it ends the
            // simulation along the normal failure path so the consumer
            // gets `executionStepFailed` + a failed `executionCompleted` and the
            // error-handling / retry policy applies uniformly.
            const tagged: { __hostSkip?: boolean; __skipReason?: string; __formInputCancelled?: boolean } =
                (error && typeof error === 'object')
                    ? error as { __hostSkip?: boolean; __skipReason?: string; __formInputCancelled?: boolean }
                    : {};
            // Cancelling the FormInputTrigger dialog is an explicit stop, not
            // an empty successful response. Do not let continueOnError route
            // the workflow to the trigger's outgoing connection.
            if (tagged && tagged.__formInputCancelled) {
                const cancelledError: WorkflowExecutionError = this.toError(error, step.id);
                this.host.trigger('simulationStepFailed', {
                    step, error: cancelledError, stepResults: this.contextStore.stepResults(),
                    previousStep: priorStep, incomingConnection: incoming
                });
                this.log(step, 'Error', cancelledError.message, Date.now() - started, cancelledError);
                throw cancelledError;
            }

            const simulationError: WorkflowExecutionError = this.toError(error, step.id);
            this.host.trigger('simulationStepFailed', {
                step, error: simulationError, stepResults: this.contextStore.stepResults(),
                previousStep: priorStep, incomingConnection: incoming
            });
            this.log(step, 'Error', simulationError.message, Date.now() - started, simulationError);
            const policy: ExecutionPolicy = ErrorPolicy.resolve(step, this.errorSettings);
            if (policy.continueOnError && !ErrorPolicy.isBranching(step.stepType)) {
                this.contextStore.recordStep(step.id || '', step.stepType || 'Custom', step.name || '', simulationError);
                return { response: simulationError, outputPort: 'output' };
            }
            throw simulationError;
        }
    }

    private async dispatch(step: WorkflowStep, props: unknown, signal: AbortSignal): Promise<StepExecutionResult> {
        const record: Record<string, unknown> = props && typeof props === 'object' ? props as Record<string, unknown> : {};
        const policy: ExecutionPolicy = ErrorPolicy.resolve(step, this.errorSettings);
        switch (step.stepType) {
        case 'ManualTrigger':
            return { response: this.contextStore.get().input && this.contextStore.get().input!.response, outputPort: 'output' };
        case 'ScheduledTrigger':
        case 'WebhookTrigger':
            return { response: this.contextStore.get().input && this.contextStore.get().input!.response, outputPort: 'output' };
        case 'FormInputTrigger':
            return this.executeFormInput(step, signal);
        case 'SetVariable':
            return this.executeSetVariable(step, record);
        case 'Filter':
            return this.executeFilter(step, record);
        case 'Sort':
            return this.executeSort(step, record);
        case 'Formatter':
            return this.executeFormatter(step, record);
        case 'Delay':
            return this.executeDelay(record, policy.timeoutMs, signal);
        case 'Condition':
            return this.executeCondition(record);
        case 'Switch':
            return this.executeSwitch(record);
        case 'Loop':
            return { response: this.readItems(record.itemsPath), outputPort: 'loop' };
        case 'ApiRequest': {
            const executeApi: (deadline: AbortSignal) => Promise<StepExecutionResult> =
                (deadline: AbortSignal) => this.executeApiRequest(step, record, policy, deadline);
            return this.withRetry(step, policy, signal,
                                  () => this.withDeadline(policy, signal, executeApi)) as Promise<StepExecutionResult>;
        }
        case 'AI': {
            // The step's own timeout (seconds) wins over the workflow default; invalid values are ignored.
            const seconds: number = Number(record.timeoutSeconds);
            if (isFinite(seconds) && seconds > 0) {
                policy.timeoutMs = seconds * 1000;
            }
            const executeAi: (deadline: AbortSignal) => Promise<StepExecutionResult> =
                (deadline: AbortSignal) => this.executeAiRequest(step, record, policy, deadline);
            return this.withRetry(step, policy, signal,
                                  () => this.withDeadline(policy, signal, executeAi)) as Promise<StepExecutionResult>;
        }
        case 'Notify':
            return this.withRetry(step, policy, signal, () => this.host.requestHost('notifyRequested', {
                step, notification: record, signal
            }, signal, policy.timeoutMs)).then((response: unknown) => ({ response, outputPort: 'output' }));
        case 'Approve':
            return this.executeApprove(step, record, policy, signal);
        case 'Custom':
            return this.withRetry(step, policy, signal, () => this.host.requestHost('customExecutionRequested', {
                step, actionType: record.actionType, input: record.input, signal
            }, signal, policy.timeoutMs)).then((response: unknown) => ({ response, outputPort: 'output' }));
        case 'End':
            return { response: record.endMessage || null };
        default:
            return { response: null, outputPort: PortResolver.getOutputPorts(step)[0] };
        }
    }

    private async executeFormInput(step: WorkflowStep, signal: AbortSignal): Promise<StepExecutionResult> {
        let response: unknown = this.contextStore.get().input && this.contextStore.get().input!.response;
        if (this.host.promptForm) {
            response = await this.host.promptForm(step, signal);
            if (response === undefined) {
                const cancelled: Error & { __formInputCancelled?: boolean } = new Error(this.t('formInputCancelled'));
                cancelled.__formInputCancelled = true;
                throw cancelled;
            }
        }
        this.contextStore.setInput(response);
        this.contextStore.recordStep(step.id || '', step.stepType || 'FormInputTrigger', step.name || '', response);
        return { response, outputPort: 'output' };
    }

    private executeSetVariable(step: WorkflowStep, props: Record<string, unknown>): StepExecutionResult {
        const variables: Array<Record<string, unknown>> = Array.isArray(props.variables)
            ? props.variables as Array<Record<string, unknown>>
            : [];
        const authored: unknown[] = Array.isArray(this.authoredProps(step).variables)
            ? this.authoredProps(step).variables as unknown[]
            : [];
        const written: Record<string, unknown> = {};
        variables.forEach((item: Record<string, unknown>, index: number) => {
            const name: string = String(item.variableName || '');
            let value: unknown = item.value;
            if (item.isMathOperation) {
                value = this.math(item.firstValue, item.secondValue, String(item.operator || ''));
            } else if (item.valueType && item.valueType !== 'Auto') {
                const source: Record<string, unknown> = (authored[parseInt(index.toString(), 10)] || {}) as Record<string, unknown>;
                value = this.typedValue(name, source.value, String(item.valueType));
            }
            this.contextStore.setVariable(name, value);
            // Variable names are user-defined workflow keys.
            // eslint-disable-next-line security/detect-object-injection
            written[name] = value;
        });
        return { response: written, outputPort: 'output' };
    }

    /**
     * Converts an authored Set Variable value to its declared type. Starts from the authored
     * value, not the auto-converted one, so `String` keeps `"00123"` and `"true"` as text.
     *
     * @param {string} name The variable name, for error messages.
     * @param {unknown} raw The authored value.
     * @param {string} valueType The declared type.
     * @returns {unknown} The typed value.
     */
    private typedValue(name: string, raw: unknown, valueType: string): unknown {
        const context: WorkflowRuntimeContext = this.contextStore.get();
        const isExpression: boolean = typeof raw === 'string'
            && (raw.indexOf('{{') !== -1 || /^\s*\$\./.test(raw));
        // Full expressions keep the referenced value's type; text with embedded
        // expressions is interpolated into a string.
        const value: unknown = isExpression ? ExpressionEvaluator.resolve(raw, context) : raw;
        const fail: () => never = (): never => {
            throw Object.assign(
                new Error(this.t('variableTypeMismatch').replace('{0}', name).replace('{1}', valueType)),
                { type: 'Expression', code: 'VARIABLE_TYPE' });
        };
        switch (valueType) {
        case 'String':
            if (value === undefined || value === null) {
                return '';
            }
            return typeof value === 'object' ? JSON.stringify(value) : String(value);
        case 'Number': {
            if (typeof value === 'number') {
                return value;
            }
            const text: string = String(value === undefined || value === null ? '' : value).trim();
            const parsed: number = Number(text);
            return text !== '' && isFinite(parsed) ? parsed : fail();
        }
        case 'Boolean':
            if (typeof value === 'boolean') {
                return value;
            }
            if (String(value).trim().toLowerCase() === 'true') {
                return true;
            }
            return String(value).trim().toLowerCase() === 'false' ? false : fail();
        case 'Json':
            if (typeof value !== 'string') {
                return value;
            }
            try {
                return JSON.parse(value);
            } catch {
                return fail();
            }
        default:
            return value;
        }
    }

    private executeFilter(step: WorkflowStep, props: Record<string, unknown>): StepExecutionResult {
        const authored: Record<string, unknown> = this.authoredProps(step);
        const list: unknown[] = this.readItems(authored.itemsPath !== undefined ? authored.itemsPath : props.itemsPath);
        const conditions: ConditionRule[] = Array.isArray(authored.conditions)
            ? authored.conditions as ConditionRule[]
            : (props.conditions || []) as ConditionRule[];
        const filtered: unknown[] = list.filter((item: unknown, index: number) => {
            return BranchEvaluator.evaluateConditions(
                conditions,
                (authored.conditionLogic !== undefined ? authored.conditionLogic : props.conditionLogic) as 'AND' | 'OR',
                this.withCurrent(item, index, list)
            );
        });
        return { response: filtered, outputPort: 'output' };
    }

    private executeSort(step: WorkflowStep, props: Record<string, unknown>): StepExecutionResult {
        const authored: Record<string, unknown> = this.authoredProps(step);
        const list: unknown[] = this.readItems(authored.itemsPath !== undefined ? authored.itemsPath : props.itemsPath).slice();
        const indexed: Array<{ value: unknown; index: number }> = list.map((value: unknown, index: number) => ({ value, index }));
        const field: string = String(authored.sortBy !== undefined ? authored.sortBy : props.sortBy || '');
        const direction: string = String(authored.sortDirection !== undefined ? authored.sortDirection : props.sortDirection || 'Ascending');
        indexed.sort((left: { value: unknown; index: number }, right: { value: unknown; index: number }) => {
            const a: unknown = this.resolveItemField(left.value, field, left.index, list);
            const b: unknown = this.resolveItemField(right.value, field, right.index, list);
            const cmp: number = this.compareItemValues(a, b);
            return direction === 'Descending' ? -cmp : cmp || left.index - right.index;
        });
        return { response: indexed.map((entry: { value: unknown }) => entry.value), outputPort: 'output' };
    }

    private authoredProps(step: WorkflowStep): Record<string, unknown> {
        return step.props && typeof step.props === 'object' ? step.props as Record<string, unknown> : {};
    }

    private resolveItemField(item: unknown, field: string, index: number, all: unknown[]): unknown {
        const trimmed: string = field.trim();
        if (trimmed.indexOf('$.') === 0 || trimmed.indexOf('{{') !== -1) {
            return ExpressionEvaluator.resolve(trimmed, this.withCurrent(item, index, all));
        }
        if (trimmed && item && typeof item === 'object') {
            return this.readFrom(item, trimmed);
        }
        return item;
    }

    private compareItemValues(left: unknown, right: unknown): number {
        if (left === right) {
            return 0;
        }
        if (left === undefined || left === null) {
            return 1;
        }
        if (right === undefined || right === null) {
            return -1;
        }
        if (typeof left === 'number' && typeof right === 'number') {
            return left < right ? -1 : 1;
        }
        if (typeof left === 'boolean' && typeof right === 'boolean') {
            return left === right ? 0 : (left ? 1 : -1);
        }
        const datePattern: RegExp = /^\d{4}-\d{2}-\d{2}(?:[T ]|$)/;
        const leftDate: number = typeof left === 'string' && datePattern.test(left) ? Date.parse(left) : NaN;
        const rightDate: number = typeof right === 'string' && datePattern.test(right) ? Date.parse(right) : NaN;
        if (!isNaN(leftDate) && !isNaN(rightDate)) {
            return leftDate < rightDate ? -1 : 1;
        }
        return String(left).localeCompare(String(right), undefined, { numeric: true, sensitivity: 'base' });
    }

    private executeFormatter(step: WorkflowStep, props: Record<string, unknown>): StepExecutionResult {
        // Prefer authored props for path/format: resolveDeep already evaluates expressions in
        // `props`, which turns sourcePath into a runtime object and breaks path/label handling.
        const authored: Record<string, unknown> =
            step.props && typeof step.props === 'object' ? step.props as Record<string, unknown> : {};
        const inputSource: string = String(
            props.inputSource != null ? props.inputSource : (authored.inputSource || 'PreviousStep')
        );
        const format: string = String(
            props.format || props.outputFormat || authored.format || authored.outputFormat || 'Text'
        );
        let data: unknown;
        let pathLabel: string | undefined;
        if (inputSource === 'ContextPath') {
            const resolved: { data: unknown; label: string } = this.resolveFormatterContextPath(
                authored.sourcePath,
                props.sourcePath
            );
            data = resolved.data;
            pathLabel = resolved.label;
        } else {
            data = this.contextStore.get().previousStep && this.contextStore.get().previousStep!.response;
        }
        const safeData: unknown = SecretRedactor.redact(data);
        // ContextPath scalars (e.g. form field "Support ID") render as label|value rows,
        // not a generic "Value" column.
        const displayData: unknown = FormatterOutput.withContextPathLabel(safeData, pathLabel);
        const result: { format: string; html?: string; display: string } = FormatterOutput.format(displayData, format);
        step.customProps = step.customProps || {};
        step.customProps.runtimeOutput = FormatterOutput.toRuntimeOutput(result);
        return { response: result.display, outputPort: 'output' };
    }

    /**
     * Resolves a formatter context path against runtime data.
     *
     * @param {unknown} authoredPath - Original configured path.
     * @param {unknown} resolvedPath - Expression-resolved path or value.
     * @returns {{data: unknown, label: string}} Resolved data and display label.
     */
    private resolveFormatterContextPath(
        authoredPath: unknown,
        resolvedPath: unknown
    ): { data: unknown; label: string } {
        const pathText: string = typeof authoredPath === 'string'
            ? authoredPath.trim()
            : (typeof resolvedPath === 'string' ? resolvedPath.trim() : '');
        const label: string = FormatterOutput.labelFromPath(pathText);
        if (!pathText) {
            // resolveDeep may already have substituted the expression with a live value.
            if (resolvedPath !== undefined && typeof resolvedPath !== 'string') {
                return { data: resolvedPath, label: label };
            }
            return { data: undefined, label: label };
        }
        // Expression / JSONPath form: {{$.…}} or $.…
        if (pathText.indexOf('{{') !== -1 || pathText.indexOf('$.') === 0 || pathText.charAt(0) === '$') {
            try {
                const value: unknown = this.readPath(pathText);
                if (value !== undefined) {
                    return { data: value, label: label };
                }
            } catch (_error) {
                // Fall through to bare-field and pre-resolved value handling.
            }
            // Field-name fallback using the leaf label (handles misspaced path edges).
            if (label) {
                const previousResponse: unknown =
                    this.contextStore.get().previousStep && this.contextStore.get().previousStep!.response;
                const fromPrevious: unknown = this.readFrom(previousResponse, label);
                if (fromPrevious !== undefined) {
                    return { data: fromPrevious, label: label };
                }
                const inputResponse: unknown =
                    this.contextStore.get().input && this.contextStore.get().input!.response;
                const fromInput: unknown = this.readFrom(inputResponse, label);
                if (fromInput !== undefined) {
                    return { data: fromInput, label: label };
                }
            }
            if (resolvedPath !== undefined && typeof resolvedPath !== 'string') {
                return { data: resolvedPath, label: label };
            }
            return { data: this.readPath(pathText), label: label };
        }
        // Bare field name (e.g. "Support ID") — look up on previous step / form input payload.
        const previousResponse: unknown =
            this.contextStore.get().previousStep && this.contextStore.get().previousStep!.response;
        const fromPrevious: unknown = this.readFrom(previousResponse, pathText);
        if (fromPrevious !== undefined) {
            return { data: fromPrevious, label: pathText };
        }
        const inputResponse: unknown =
            this.contextStore.get().input && this.contextStore.get().input!.response;
        const fromInput: unknown = this.readFrom(inputResponse, pathText);
        if (fromInput !== undefined) {
            return { data: fromInput, label: pathText };
        }
        if (resolvedPath !== undefined && typeof resolvedPath !== 'string') {
            return { data: resolvedPath, label: pathText };
        }
        return { data: undefined, label: pathText };
    }



    /**
     * Executes a configured delay.
     *
     * @param {Record<string, unknown>} props - Delay properties.
     * @param {number} timeoutMs - Effective execution timeout.
     * @param {AbortSignal} signal - Signal used to cancel the delay.
     * @returns {Promise<StepExecutionResult>} Delay result.
     */
    private async executeDelay(props: Record<string, unknown>, timeoutMs: number, signal: AbortSignal): Promise<StepExecutionResult> {
        // `executionSpeed: 0` (or the legacy 'Instant') runs without waiting; an unset speed keeps the default delay.
        const speed: unknown = this.simulationSettings && this.simulationSettings.executionSpeed;
        const fastForward: boolean = (typeof speed === 'number' && speed <= 0) || speed === 'Instant';
        // Default to Fixed when delayType is missing so authored duration still pauses.
        const delayType: string = String(props.delayType || 'Fixed');
        let duration: number = 0;
        if (delayType === 'Fixed') {
            const rawDuration: number = Number(props.duration != null ? props.duration : props.delayDuration);
            duration = this.toMs(
                isFinite(rawDuration) ? rawDuration : 0,
                String(props.timeUnit || props.delayTimeUnit || 'Seconds')
            );
        } else if (delayType === 'Until') {
            const untilDate: Date | null = ScheduleEvaluator.parseDate(props.untilDateTime, ScheduleEvaluator.zone(props));
            duration = untilDate ? Math.max(0, untilDate.getTime() - Date.now()) : 0;
        } else if (delayType === 'Dynamic') {
            const dynamicCondition: unknown = props.dynamicCondition;
            const shouldWait: boolean = Array.isArray(dynamicCondition)
                ? BranchEvaluator.evaluateConditions(
                    dynamicCondition as ConditionRule[],
                    props.dynamicConditionLogic as 'AND' | 'OR' || 'AND',
                    this.contextStore.get()
                )
                : BranchEvaluator.evaluateRule(dynamicCondition as ConditionRule, this.contextStore.get());
            const rawDynamic: number = Number(props.dynamicDuration || 0);
            duration = shouldWait
                ? this.toMs(isFinite(rawDynamic) ? rawDynamic : 0, String(props.dynamicTimeUnit || 'Seconds'))
                : 0;
        }
        // Note: Delay nodes respect user-configured durations without effective timeout constraints.
        // The user explicitly sets the delay duration (minutes, hours, days), so we honor that
        // regardless of the step's effective timeout. The AbortSignal allows cancellation if needed.
        if (duration > 0 && !fastForward) {
            await this.sleep(duration, signal);
        }
        return {
            response: { duration, fastForward },
            outputPort: 'output'
        };
    }

    private executeCondition(props: Record<string, unknown>): StepExecutionResult {
        const matched: boolean = BranchEvaluator.evaluateConditions(
            (props.conditions || []) as ConditionRule[],
            props.conditionLogic as 'AND' | 'OR',
            this.contextStore.get()
        );
        return { response: matched, outputPort: matched ? 'true' : 'false' };
    }

    private executeSwitch(props: Record<string, unknown>): StepExecutionResult {
        const branches: Array<{ branchName: string; condition: ConditionRule }> =
            Array.isArray(props.branches) ? props.branches as Array<{ branchName: string; condition: ConditionRule }> : [];
        // Reuse shared BranchEvaluator (same condition rules as Condition nodes).
        const match: string | null = BranchEvaluator.firstMatchingBranch(branches, this.contextStore.get());
        if (!match) {
            // Switch always falls through to the named default port on no-match.
            return { response: null, outputPort: String(props.defaultBranch || 'default') };
        }
        return { response: match, outputPort: match };
    }

    /**
     * Executes an API Request step: raises `beforeRequestSend`, attaches credentials and sends the request.
     *
     * @param {WorkflowStep} step - API request step.
     * @param {Record<string, unknown>} props - Resolved API properties.
     * @param {ExecutionPolicy} policy - Retry and timeout policy.
     * @param {AbortSignal} signal - Signal used to cancel the request.
     * @returns {Promise<StepExecutionResult>} API execution result.
     */
    private async executeApiRequest(
        step: WorkflowStep,
        props: Record<string, unknown>,
        policy: ExecutionPolicy,
        signal: AbortSignal
    ): Promise<StepExecutionResult> {
        // Drop body fields for body-less methods so host handlers also omit them.
        const request: Record<string, unknown> = {};
        Object.keys(props).forEach((key: string) => {
            // Request properties are copied from user-configured API step fields.
            // eslint-disable-next-line security/detect-object-injection
            request[key] = props[key];
        });
        const authoredProps: Record<string, unknown> = this.authoredProps(step);
        const authoredQueryParams: unknown = authoredProps.queryParams;
        if (Array.isArray(authoredQueryParams)) {
            const runtimeContext: WorkflowRuntimeContext = this.contextStore.get();
            request.queryParams = authoredQueryParams.map((parameter: unknown) => {
                if (!parameter || typeof parameter !== 'object') {
                    return parameter;
                }
                const record: Record<string, unknown> = parameter as Record<string, unknown>;
                return {
                    key: record.key,
                    value: ExecutionDispatcher.toRequestString(
                        ExpressionEvaluator.resolve(record.value, runtimeContext)
                    )
                };
            });
        }
        const authoredBody: unknown = authoredProps.body;
        if (String(authoredProps.bodyType || 'Json') === 'Json' && typeof authoredBody === 'string') {
            request.body = ExecutionDispatcher.buildJsonBody(authoredBody, this.contextStore.get());
        }
        if (ApiRequestExecutor.isBodylessMethod(request.method)) {
            delete request.body;
            delete request.bodyType;
        }

        const authRef: string = String(authoredProps.authRef || '').trim();
        delete request.authRef;
        const intercepted: { handled: boolean; response?: unknown } = await this.interceptRequest(step, 'ApiRequest', request);
        if (intercepted.handled) {
            return { response: intercepted.response, outputPort: 'output' };
        }
        if (authRef) {
            const secret: unknown = await this.resolveCredential(step, authRef, 'ApiRequest', signal);
            const extra: Array<{ key: string; value: string }> = [];
            if (typeof secret === 'string') {
                extra.push({ key: 'Authorization', value: secret });
            } else if (secret && typeof secret === 'object' && (secret as { headers?: unknown }).headers) {
                const headers: Record<string, unknown> = (secret as { headers: Record<string, unknown> }).headers;
                Object.keys(headers).forEach((name: string) => extra.push({ key: name, value: String(headers[`${name}`]) }));
            }
            const existing: unknown[] = Array.isArray(request.headers) ? request.headers as unknown[] : [];
            request.headers = existing.concat(extra);
        }
        const response: unknown = await ApiRequestExecutor.execute(request, signal);
        return { response, outputPort: 'output' };
    }

    /* eslint-disable valid-jsdoc */
    /**
     * Raises `beforeRequestSend` so the host can change the request, cancel it, or supply the
     * response itself. The event never carries a resolved secret.
     *
     * @param {WorkflowStep} step - The API Request or AI step.
     * @param {string} requestType - The kind of request.
     * @param {Record<string, unknown>} request - The resolved request; the host may change it.
     * @returns {Promise<{ handled: boolean; response?: unknown }>} Whether the host supplied the response.
     */
    private async interceptRequest(
        step: WorkflowStep,
        requestType: 'ApiRequest' | 'AI',
        request: Record<string, unknown>
    ): Promise<{ handled: boolean; response?: unknown }> {
        const args: { step: WorkflowStep; requestType: string; request: Record<string, unknown>; cancel: boolean | Promise<boolean>;
            response?: unknown; stepResults: WorkflowStepResult[]; previousStep?: WorkflowStepResult } = {
            step, requestType, request, cancel: false, response: undefined,
            stepResults: this.contextStore.stepResults(), previousStep: this.contextStore.snapshot().previousStep
        };
        this.host.trigger('beforeRequestSend', args as unknown as Record<string, unknown>);
        const cancelled: boolean = await resolveCancel(args.cancel);
        if (args.response !== undefined) {
            return { handled: true, response: await Promise.resolve(args.response) };
        }
        if (cancelled) {
            throw Object.assign(new Error(this.t('requestCancelled')), { type: requestType, code: 'REQUEST_CANCELLED' });
        }
        return { handled: false };
    }

    /* eslint-enable valid-jsdoc */
    /**
     * Builds a JSON request body from the authored template without string
     * interpolation, so values from the runtime context can never change the
     * JSON structure. Quoted expressions are resolved inside the parsed tree;
     * bare expressions (`{"n": {{$.x}}}`) are replaced by their JSON encoding.
     *
     * @param {string} template The authored body.
     * @param {unknown} context The runtime context.
     * @returns {unknown} The body object, or the template when it is not JSON.
     */
    private static buildJsonBody(template: string, context: unknown): unknown {
        const trimmed: string = template.trim();
        if (!trimmed) {
            return template;
        }
        try {
            return ExpressionEvaluator.resolveDeep(JSON.parse(trimmed), context);
        } catch {
            // Not JSON as authored; fall through to bare-expression handling.
        }
        // Encode only expressions that sit outside JSON strings; quoted ones
        // stay in place and are resolved as plain string values below.
        let encoded: string = '';
        let inString: boolean = false;
        for (let i: number = 0; i < trimmed.length; i++) {
            const ch: string = trimmed.charAt(i);
            if (inString) {
                encoded += ch;
                if (ch === '\\') {
                    encoded += trimmed.charAt(++i);
                } else if (ch === '"') {
                    inString = false;
                }
                continue;
            }
            if (ch === '"') {
                inString = true;
                encoded += ch;
                continue;
            }
            if (ch === '{' && trimmed.charAt(i + 1) === '{') {
                const close: number = trimmed.indexOf('}}', i + 2);
                if (close !== -1) {
                    const value: unknown = ExpressionEvaluator.resolve(trimmed.slice(i, close + 2), context);
                    encoded += value === undefined ? 'null' : JSON.stringify(value);
                    i = close + 1;
                    continue;
                }
            }
            encoded += ch;
        }
        let parsed: unknown;
        try {
            parsed = JSON.parse(encoded);
        } catch {
            throw Object.assign(new Error('The JSON request body is not valid JSON.'), { type: 'Validation', code: 'API_BODY_INVALID_JSON' });
        }
        return ExpressionEvaluator.resolveDeep(parsed, context);
    }

    /**
     * Converts resolved query values into strings without losing object data.
     *
     * @param {unknown} value - Query value to convert.
     * @returns {string} String representation of the query value.
     */
    private static toRequestString(value: unknown): string {
        if (value === undefined || value === null) {
            return '';
        }
        if (typeof value === 'string') {
            return value;
        }
        if (typeof value === 'object') {
            try {
                return JSON.stringify(value);
            } catch (_error) {
                return String(value);
            }
        }
        return String(value);
    }

    /**
     * Resolves a credential reference through the host's `credentialRequested` handler.
     * The reference itself is never included in error messages, because in Inline mode it may be a raw key.
     *
     * @param {WorkflowStep} step The step requesting the credential.
     * @param {string} reference The stored reference.
     * @param {'AI' | 'ApiRequest'} purpose The requesting step type.
     * @param {AbortSignal} signal The cancellation signal.
     * @returns {Promise<unknown>} The resolved secret.
     */
    private async resolveCredential(step: WorkflowStep, reference: string, purpose: 'AI' | 'ApiRequest', signal: AbortSignal): Promise<unknown> {
        if (!(this.host.hasHostEventHandler && this.host.hasHostEventHandler('credentialRequested'))) {
            throw Object.assign(new Error(this.t('credentialUnresolved')), { type: purpose === 'AI' ? 'AI' : 'ApiRequest', code: 'CREDENTIAL_UNRESOLVED' });
        }
        const secret: unknown = await this.host.requestHost('credentialRequested', {
            step, credentialRef: reference, purpose, signal
        }, signal, 0);
        if (secret === undefined || secret === null || secret === '') {
            throw Object.assign(new Error(this.t('credentialUnresolved')), { type: purpose === 'AI' ? 'AI' : 'ApiRequest', code: 'CREDENTIAL_UNRESOLVED' });
        }
        return secret;
    }

    private credentialMode(): string {
        const settings: { credentialMode?: string } | undefined = this.simulationSettings as { credentialMode?: string } | undefined;
        return settings && settings.credentialMode === 'Inline' ? 'Inline' : 'Reference';
    }

    /**
     * Executes an AI step: raises `beforeRequestSend`, resolves the credential and calls the provider or server.
     *
     * @param {WorkflowStep} step - AI step.
     * @param {Record<string, unknown>} props - Resolved AI properties.
     * @param {ExecutionPolicy} policy - Retry and timeout policy.
     * @param {AbortSignal} signal - Signal used to cancel the request.
     * @returns {Promise<StepExecutionResult>} AI execution result.
     */
    private async executeAiRequest(
        step: WorkflowStep,
        props: Record<string, unknown>,
        policy: ExecutionPolicy,
        signal: AbortSignal
    ): Promise<StepExecutionResult> {
        // Scope memory to this workflow and designer instance.
        const workflowId: string = this.host.getWorkflowScope ? this.host.getWorkflowScope() : '';
        const nodeId: string = step.id || '';

        // Prepare props with memory history if memory is enabled
        const propsWithMemory: Record<string, unknown> = AIMemoryIntegration.preparePropsWithMemory(
            workflowId,
            nodeId,
            props
        );

        // Single source of truth: only `credentialRef` is sent through
        // the host observer event payload. Legacy `credential` keys are
        // dropped at import time so a stale raw value never reaches the
        // bound observer.
        // `executionSettings.credentialMode` decides the transport: Inline calls the provider, Reference uses the server URL.
        const mode: string = this.credentialMode() === 'Inline' ? 'Direct' : 'Server';
        propsWithMemory.mode = mode;
        const authored: Record<string, unknown> = this.authoredProps(step);
        delete propsWithMemory.apiKey;
        delete propsWithMemory.credential;
        // The host sees the request before any secret is resolved or attached.
        const request: Record<string, unknown> = { ...propsWithMemory };
        delete request.credentialRef;
        const intercepted: { handled: boolean; response?: unknown } = await this.interceptRequest(step, 'AI', request);
        if (intercepted.handled) {
            return { response: intercepted.response, outputPort: 'output' };
        }
        Object.keys(request).forEach((key: string) => {
            propsWithMemory[`${key}`] = request[`${key}`];
        });
        delete propsWithMemory.credentialRef;
        // The handler may have switched the request to Server mode.
        const effectiveMode: string = String(propsWithMemory.mode || mode).trim() || 'Direct';
        if (effectiveMode !== 'Server') {
            // Inline mode (development only): the key lives in `apiKey`. Older drafts kept it
            // in `credentialRef`, which is still honoured. Reference mode posts to the server URL,
            // which holds its own key, so no credential is resolved.
            const inlineKey: string = String(authored.apiKey || authored.credentialRef || '').trim();
            if (inlineKey) {
                propsWithMemory.credentialRef = inlineKey;
            }
        }
        const result: { content: unknown; text: string } =
            await AiRequestExecutor.execute(propsWithMemory, signal, undefined);

        // Prefer structured content for JSON output; otherwise plain text.
        const response: unknown = result.content !== undefined ? result.content : result.text;

        // Save the exchange to memory if memory is enabled
        if (propsWithMemory.memoryEnabled === true || propsWithMemory.memoryEnabled === 'true') {
            const userPrompt: string = typeof props.prompt === 'string' ? props.prompt : '';
            const aiResponse: string = typeof response === 'string' ? response : JSON.stringify(response);
            AIMemoryIntegration.saveExchangeToMemory(workflowId, nodeId, propsWithMemory, userPrompt, aiResponse);
        }

        return { response, outputPort: 'output' };
    }

    /**
     * Dispatches a provider step and optionally notifies a host observer.
     *
     * @param {WorkflowStep} step - Provider step.
     * @param {Record<string, unknown>} props - Provider step properties.
     * @param {ExecutionPolicy} policy - Retry and timeout policy.
     * @param {AbortSignal} signal - Signal used to cancel execution.
     * @returns {Promise<StepExecutionResult>} Provider execution result.
     */
    private async executeApprove(
        step: WorkflowStep,
        props: Record<string, unknown>,
        policy: ExecutionPolicy,
        signal: AbortSignal
    ): Promise<StepExecutionResult> {
        let decision: unknown;
        const hasHandler: boolean = !!(this.host.hasHostEventHandler && this.host.hasHostEventHandler('approvalRequested'));
        if (!hasHandler && !this.host.promptApproval) {
            throw new Error(this.t('approvalHostRequired'));
        }
        if (this.host.setWaiting) {
            this.host.setWaiting(true);
        }
        try {
            if (hasHandler) {
                // Approvals can take hours or days: only a timeout set on the step
                // itself applies, never the global default.
                const stepTimeout: number = step.errorHandling && step.errorHandling.timeoutMs
                    ? Number(step.errorHandling.timeoutMs) : 0;
                decision = await this.host.requestHost('approvalRequested', {
                    step,
                    reviewers: props.reviewers,
                    requestMessage: props.requestMessage,
                    requestFields: props.requestFields,
                    signal
                }, signal, stepTimeout > 0 ? stepTimeout : Infinity);
            } else {
                decision = await this.promptWithTimeout(step, signal);
            }
        } finally {
            if (this.host.setWaiting) {
                this.host.setWaiting(false);
            }
        }
        const record: Record<string, unknown> = decision && typeof decision === 'object' && !Array.isArray(decision)
            ? decision as Record<string, unknown>
            : { decision: decision === undefined ? 'declined' : decision, dismissed: decision === undefined };
        // Fail closed: anything other than an explicit approval is a decline.
        const outputPort: string = ExecutionDispatcher.normalizeApprovalDecision(decision);
        return { response: record, outputPort };
    }

    /**
     * Shows the built-in approval dialog. A timeout set on the step closes the dialog and fails the
     * step with code APPROVAL_TIMEOUT, so the step's error port (or error handling) decides what
     * happens next. Without a timeout the dialog waits until someone answers or the run stops.
     *
     * @param {WorkflowStep} step The Approve step.
     * @param {AbortSignal} signal The run's abort signal.
     * @returns {Promise<unknown>} The reviewer's decision.
     */
    private promptWithTimeout(step: WorkflowStep, signal: AbortSignal): Promise<unknown> {
        const timeoutMs: number = step.errorHandling && step.errorHandling.timeoutMs ? Number(step.errorHandling.timeoutMs) : 0;
        if (!(timeoutMs > 0)) {
            return this.host.promptApproval!(step, signal);
        }
        const dialogControl: AbortController = new AbortController();
        const onRunAbort: () => void = (): void => dialogControl.abort();
        signal.addEventListener('abort', onRunAbort, { once: true });
        let timer: number = 0;
        const timeout: Promise<never> = new Promise<never>((resolve: (value: never) => void, reject: (reason: unknown) => void) => {
            timer = window.setTimeout(() => {
                // Reject before closing the dialog: closing settles the dialog's promise too.
                reject(Object.assign(new Error(this.t('approvalTimedOut').replace('{0}', String(Math.round(timeoutMs / 1000)))), {
                    type: 'Runtime', code: 'APPROVAL_TIMEOUT', stepId: step.id
                }));
                dialogControl.abort();
            }, timeoutMs);
        });
        return Promise.race([this.host.promptApproval!(step, dialogControl.signal), timeout]).then((value: unknown) => {
            window.clearTimeout(timer);
            signal.removeEventListener('abort', onRunAbort);
            return value;
        }, (error: unknown) => {
            window.clearTimeout(timer);
            signal.removeEventListener('abort', onRunAbort);
            throw error;
        });
    }

    /**
     * Maps a reviewer response to an output port. Fails closed: only an
     * explicit approval routes to `approved`; a dismissed dialog, a missing
     * decision or an unrecognized value routes to `declined`.
     *
     * @param {unknown} decision The value returned by the approval prompt.
     * @returns {'approved' | 'declined'} The output port.
     */
    private static normalizeApprovalDecision(decision: unknown): 'approved' | 'declined' {
        let raw: unknown = decision;
        if (decision && typeof decision === 'object') {
            const record: Record<string, unknown> = decision as Record<string, unknown>;
            raw = record.decision !== undefined ? record.decision : record.approved;
        }
        if (raw === true) {
            return 'approved';
        }
        return typeof raw === 'string' && raw.trim().toLowerCase() === 'approved' ? 'approved' : 'declined';
    }

    /**
     * Logs a warning for each `{{$...}}` expression in the step's props that resolves to
     * undefined or null, so silently empty values are visible in the execution log.
     * Steps that read data they expect to be missing (Condition, Filter, Switch, Delay rules)
     * are skipped, because IsEmpty-style checks rely on missing values.
     * Sort evaluates `$.loop.*` per item while sorting, so those expressions are checked
     * only after the current item is bound.
     *
     * @param {WorkflowStep} step The step.
     * @param {unknown} props The authored props.
     * @param {WorkflowRuntimeContext} context The runtime context.
     * @returns {void}
     */
    private warnUnresolved(step: WorkflowStep, props: unknown, context: WorkflowRuntimeContext): void {
        if (step.stepType === 'Condition' || step.stepType === 'Filter' || step.stepType === 'Switch' || step.stepType === 'Delay') {
            return;
        }
        const reported: { [expression: string]: boolean } = Object.create(null);
        if (step.stepType === 'Sort') {
            const authored: Record<string, unknown> = props && typeof props === 'object' ? props as Record<string, unknown> : {};
            const field: string = String(authored.sortBy || '');
            if (/\{\{\s*\$\.loop\b/.test(field)) {
                const list: unknown[] = this.readItems(authored.itemsPath);
                list.forEach((item: unknown, index: number) => {
                    this.visitUnresolved(field, this.withCurrent(item, index, list), reported, step);
                });
            } else {
                this.visitUnresolved(field, context, reported, step);
            }
            const rest: Record<string, unknown> = {};
            Object.keys(authored).forEach((key: string) => {
                if (key !== 'sortBy') {
                    rest[`${key}`] = authored[`${key}`];
                }
            });
            this.visitUnresolved(rest, context, reported, step);
            return;
        }
        this.visitUnresolved(props, context, reported, step);
    }

    private visitUnresolved(
        value: unknown,
        context: unknown,
        reported: { [expression: string]: boolean },
        step: WorkflowStep
    ): void {
        if (typeof value === 'string') {
            const pattern: RegExp = /\{\{\s*(\$[^}]*?)\s*\}\}/g;
            let match: RegExpExecArray | null = pattern.exec(value);
            while (match) {
                const expression: string = match[0];
                let resolved: unknown;
                try {
                    resolved = ExpressionEvaluator.resolve(expression, context);
                } catch {
                    resolved = undefined;
                }
                if ((resolved === undefined || resolved === null) && !reported[`${expression}`]) {
                    reported[`${expression}`] = true;
                    this.log(step, 'Warning', this.t('unresolvedExpression').replace('{0}', expression), 0);
                }
                match = pattern.exec(value);
            }
        } else if (Array.isArray(value)) {
            value.forEach((item: unknown) => this.visitUnresolved(item, context, reported, step));
        } else if (value && typeof value === 'object') {
            Object.keys(value as Record<string, unknown>).forEach((key: string) => {
                this.visitUnresolved((value as Record<string, unknown>)[`${key}`], context, reported, step);
            });
        }
    }

    /**
     * Runs an operation under the step's `timeoutMs`. The operation receives a
     * signal that aborts on either the run's cancellation or the deadline, so the
     * underlying fetch is cancelled instead of left running.
     *
     * @param {ExecutionPolicy} policy The resolved error policy.
     * @param {AbortSignal} signal The run's cancellation signal.
     * @param {Function} operation The operation to run.
     * @returns {Promise<T>} The operation result.
     */
    private withDeadline<T>(policy: ExecutionPolicy, signal: AbortSignal, operation: (deadline: AbortSignal) => Promise<T>): Promise<T> {
        const timeoutMs: number = policy.timeoutMs > 0 ? policy.timeoutMs : 0;
        if (!timeoutMs) {
            return operation(signal);
        }
        const controller: AbortController = new AbortController();
        const onAbort: () => void = (): void => controller.abort();
        if (signal.aborted) {
            controller.abort();
        } else {
            signal.addEventListener('abort', onAbort, { once: true });
        }
        let timer: ReturnType<typeof setTimeout> | undefined;
        const deadline: Promise<never> = new Promise<never>((_resolve: (value: never) => void, reject: (reason?: unknown) => void) => {
            timer = setTimeout(() => {
                controller.abort();
                reject(Object.assign(new Error(this.t('stepTimedOut').replace('{0}', String(timeoutMs))), { type: 'Timeout', code: 'STEP_TIMEOUT' }));
            }, timeoutMs);
        });
        return Promise.race([operation(controller.signal), deadline]).then((value: T) => {
            clearTimeout(timer);
            signal.removeEventListener('abort', onAbort);
            return value;
        }, (error: unknown) => {
            clearTimeout(timer);
            signal.removeEventListener('abort', onAbort);
            throw error;
        });
    }

    private async withRetry(
        step: WorkflowStep,
        policy: ExecutionPolicy,
        signal: AbortSignal,
        operation: () => Promise<unknown>
    ): Promise<unknown> {
        const attempts: number = policy.retryPolicy.enabled ? Math.max(1, policy.retryPolicy.maxAttempts || 1) : 1;
        let lastError: unknown;
        for (let attempt: number = 1; attempt <= attempts; attempt++) {
            try {
                return await operation();
            } catch (error) {
                lastError = error;
                if (signal.aborted) {
                    break;
                }
                if (attempt < attempts) {
                    this.log(step, 'Retry', this.t('retryingStep'), 0, this.toError(error, step.id), attempt);
                    await this.sleep(policy.retryPolicy.delayMs || 0, signal);
                }
            }
        }
        throw lastError;
    }

    private readItems(pathOrValue: unknown): unknown[] {
        if (Array.isArray(pathOrValue)) {
            return pathOrValue;
        }
        if (typeof pathOrValue === 'string' && pathOrValue) {
            const value: unknown = this.readPath(pathOrValue);
            if (Array.isArray(value)) {
                return value;
            }
        }
        if (this.strictMissingData) {
            throw Object.assign(new Error(this.t('upstreamDataMissingItemsPath')), {
                type: 'Expression',
                code: 'MISSING_UPSTREAM'
            });
        }
        return [];
    }

    private readPath(path: string): unknown {
        if (!path) {
            return undefined;
        }
        const value: unknown = ExpressionEvaluator.resolve(path, this.contextStore.get());
        if (this.strictMissingData && (value === undefined || value === null)) {
            // `{0}` placeholder is preserved verbatim — `path` is always a
            // technical expression identifier (`$.nodes.stepId`, ...) and
            // must not be translated.
            const template: string = this.t('upstreamDataMissingPath');
            const rendered: string = template.indexOf('{0}') === -1
                ? template
                : template.replace('{0}', path);
            throw Object.assign(new Error(rendered), {
                type: 'Expression',
                code: 'MISSING_UPSTREAM'
            });
        }
        return value;
    }

    private readFrom(target: unknown, field: string): unknown {
        if (!target || typeof target !== 'object') {
            return undefined;
        }
        // Field names may contain spaces and are defined by workflow authors.
        // eslint-disable-next-line security/detect-object-injection
        return (target as Record<string, unknown>)[field];
    }

    private withCurrent(item: unknown, index: number = 0, all: unknown[] = [item]): unknown {
        const snapshot: WorkflowRuntimeContext = this.contextStore.snapshot();
        // Keep the same shape for branch-condition evaluation as during a
        // live loop iteration; `all` mirrors the slice we're filtering
        // over so `${{$.loop.all}}` style bindings inside a Filter step
        // placed inside a Loop body also resolve.
        snapshot.loop = {
            index: index,
            count: all.length,
            currentItem: item,
            all: all
        };
        return snapshot;
    }

    private math(first: unknown, second: unknown, operator: string): unknown {
        const a: number = Number(first);
        const b: number = Number(second);
        switch (operator) {
        case 'Add': return a + b;
        case 'Subtract': return a - b;
        case 'Multiply': return a * b;
        case 'Divide': return b === 0 ? undefined : a / b;
        case 'Modulo': return b === 0 ? undefined : a % b;
        case 'Percentage': return a * b / 100;
        case 'GreaterThan': return a > b;
        case 'LessThan': return a < b;
        case 'GreaterThanOrEqual': return a >= b;
        case 'LessThanOrEqual': return a <= b;
        case 'StrictEqual': return first === second;
        default: return undefined;
        }
    }

    private toMs(duration: number, unit: string): number {
        switch (unit) {
        case 'Minutes': return duration * 60000;
        case 'Hours': return duration * 3600000;
        case 'Days': return duration * 86400000;
        case 'Weeks': return duration * 7 * 86400000;
        default: return duration * 1000;
        }
    }

    private sleep(ms: number, signal: AbortSignal): Promise<void> {
        if (ms <= 0) {
            return Promise.resolve();
        }
        return new Promise<void>((resolve: () => void, reject: (reason?: unknown) => void) => {
            const timer: number = setTimeout(() => resolve(), ms) as unknown as number;
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

    private toError(error: unknown, stepId?: string): WorkflowExecutionError {
        if (error && typeof error === 'object' && (error as WorkflowExecutionError).message) {
            const typed: WorkflowExecutionError = error as WorkflowExecutionError;
            return {
                type: typed.type || 'Runtime',
                code: typed.code,
                message: typed.message,
                stepId: typed.stepId || stepId,
                details: SecretRedactor.redact(typed.details)
            };
        }
        return { type: 'Runtime', message: error instanceof Error ? error.message : String(error), stepId };
    }

    private log(
        step: WorkflowStep,
        status: WorkflowExecutionLogEntry['status'],
        message: string,
        duration: number,
        error?: WorkflowExecutionError,
        retryAttempt?: number
    ): void {
        const entry: WorkflowExecutionLogEntry = {
            timestamp: Date.now(),
            stepId: step.id,
            status,
            message,
            retryAttempt,
            error,
            contextSummary: SecretRedactor.redact(this.contextStore.snapshot())
        };
        if (this.host.appendLog) {
            this.host.appendLog(entry);
        }
    }
}

