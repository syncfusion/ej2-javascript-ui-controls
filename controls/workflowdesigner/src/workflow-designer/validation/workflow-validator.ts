import { L10n } from '@syncfusion/ej2-base';
import { WorkflowConnection } from '../models/workflow-connection';
import { WorkflowDefinitionModel } from '../models/workflow-definition';
import { WorkflowStepType } from '../models/workflow-enums';
import { WorkflowStep } from '../models/workflow-step';
import { WorkflowStickyNote } from '../models/workflow-sticky-note';
import { WorkflowValidationMessage, WorkflowValidationResult } from '../models/workflow-validation';
import { PortResolver } from '../mapping/port-resolver';
import { ExpressionEvaluator } from '../simulation/expression-evaluator';
import { ScheduleEvaluator, ScheduleValidationIssue } from '../simulation/schedule-evaluator';
import { validateWebhookPath } from '../runtime/webhook-utils';
import { isHttpUrl } from './url-check';
import { localeDefaults } from '../localization/locale-defaults';

const ID_PATTERN: RegExp = /^[A-Za-z_][A-Za-z0-9_-]*$/;

/**
 * True for ids that collide with built-in object properties (`toString`, `constructor`, ...).
 * The Diagram library looks nodes up in plain objects keyed by id, so these ids break it.
 *
 * @param {string} id - The item id.
 * @returns {boolean} Whether the id is reserved.
 * @private
 */
export function isReservedId(id: string): boolean {
    return id in Object.prototype || id === '__proto__';
}
const TRIGGER_TYPES: WorkflowStepType[] = [
    'ManualTrigger', 'ScheduledTrigger', 'WebhookTrigger', 'FormInputTrigger'
];
const OPTION_FIELD_TYPES: string[] = ['DropDown', 'CheckBoxes', 'RadioButton'];
const UNARY_OPERATORS: string[] = ['IsEmpty', 'IsNotEmpty', 'IsTrue', 'IsFalse'];
const HTTP_METHODS: string[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Validates public workflow collections against graph and step contracts.
 *
 * The full check (validation used by `runSimulation`) runs both the
 * structural rules (IDs, triggers, connection endpoints, cycles,
 * secret-paths) and per-step required-prop rules (`APPROVE_REVIEWERS`,
 * `CONDITION_REQUIRED`, `NOTIFY.* required`, ...).
 *
 * Import (`fromWorkflowJson`) uses `validateStructure`, which runs the
 * structural rules that keep the graph sane, but intentionally skips the
 * trigger-presence rule so an author can round-trip an in-progress workflow
 * (for example, a canvas that only contains a first action step) without
 * rejection. Strict validation is still run at run time.
 *
 * @private
 */
export class WorkflowValidator {
    /** Per-instance flag toggled off by `validateStructure` so per-step
     *  validators tackled through shared helpers can read it. */
    private skipPropRequired: boolean = false;

    /** `executionSettings.credentialMode`: Inline requires provider and model; Reference requires the server URL. */
    private credentialMode: 'Inline' | 'Reference';

    /**
     * Localization instance used to render user-facing validation messages.
     * Optional: when omitted (legacy call sites / unit tests), `t()` falls
     * back to the original English strings so the validator keeps working
     * without `WorkflowDesigner` having constructed an L10n yet.
     *
     * @private
     */
    private readonly l10n: L10n | undefined;

    /**
     * Creates the WorkflowValidator.
     *
     * @param {L10n} [l10n] - Optional localization instance shared with the
     *   Workflow Designer shell. When provided, every user-facing message
     *   template is resolved through `l10n.getConstant(...)`; technical
     *   tokens (e.g. `sourcePort`, `valueType`, `maxIterations`) and the
     *   placeholders in message templates (`{0}`, `{1}`) are preserved
     *   verbatim — only the surrounding prose is translated.
     * @param {string} [credentialMode] - `executionSettings.credentialMode`; decides which AI fields are required.
     * @returns {void} Nothing.
     * @private
     */
    public constructor(l10n?: L10n, credentialMode?: string) {
        this.l10n = l10n;
        this.credentialMode = credentialMode === 'Inline' ? 'Inline' : 'Reference';
    }

    /**
     * Resolves a translation key against the shared L10n instance.
     * Falls back to the literal English string when no L10n was wired in.
     * Diagnostic codes (`ID_REQUIRED`, `EXPRESSION_SYNTAX`, ...) are kept
     * internal: they live on the `code` field of each
     * `WorkflowValidationMessage` and never travel through this method.
     *
     * @param {string} key - The localization key to resolve.
     * @returns {string} The translated string.
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
     * Sets the credential mode that decides which AI fields are required.
     *
     * @param {string} mode - `executionSettings.credentialMode`.
     * @returns {void} Nothing.
     * @private
     */
    public setCredentialMode(mode?: string): void {
        this.credentialMode = mode === 'Inline' ? 'Inline' : 'Reference';
    }

    /**
     * Validate.
     *
     * @param {WorkflowStepModel} steps The workflow steps.
     * @param {WorkflowConnectionModel} connections The workflow connections.
     * @param {WorkflowStickyNoteModel} stickyNotes The sticky notes.
     * @param {boolean} validateTriggerPresence Indicates whether validation should verify that a trigger step is present in the workflow. Defaults to true.
     * @returns {WorkflowValidationResult} The validation result.
     * @private
     */
    public validate(
        steps: WorkflowStep[],
        connections: WorkflowConnection[],
        stickyNotes?: WorkflowStickyNote[],
        validateTriggerPresence: boolean = true
    ): WorkflowValidationResult {
        // When called from validateStructure(), this.skipPropRequired is
        // already true and `validateStep` reads it to skip per-step
        // required-prop rules. Otherwise the flag is false (the default)
        // and strict per-step checks apply.
        const messages: WorkflowValidationMessage[] = [];
        const notes: WorkflowStickyNote[] = stickyNotes || [];
        this.validateIds(steps, connections, notes, messages);
        if (validateTriggerPresence) {
            this.validateTriggers(steps, messages);
        }
        this.validateConnections(steps, connections, messages);
        this.validateReachability(steps, connections, messages);
        steps.forEach((step: WorkflowStep) => this.validateStep(step, messages));
        connections.forEach((connection: WorkflowConnection) => {
            this.validateConnectionExpressions(connection, messages);
        });
        const hasError: boolean = messages.some((message: WorkflowValidationMessage) => message.type === 'Error');
        return { isValid: !hasError, messages };
    }

    /**
     * Validates the workflow definition.
     *
     * @param {WorkflowDefinitionModel} definition The workflow definition to validate.
     * @param {boolean} validateTriggerPresence Indicates whether validation should verify that a trigger step is present in the workflow. Defaults to true.
     * @returns {WorkflowValidationResult} The validation result for the workflow definition.
     * @private
     */
    public validateDefinition(
        definition: WorkflowDefinitionModel,
        validateTriggerPresence: boolean = true
    ): WorkflowValidationResult {
        return this.validate(
            definition.workflowSteps || [],
            definition.workflowConnections || [],
            definition.stickyNotes || [],
            validateTriggerPresence
        );
    }

    /**
     * Structural-only validator used on `fromWorkflowJson` / import. Runs
     * the schema-level checks (unique IDs, connection endpoints, cycles,
     * secret-path) but deliberately skips the trigger-presence rule so
     * incomplete draft workflows can be loaded and edited. It still skips the
     * per-step required-prop rules. The author reaches for `runSimulation()`
     * to surface them.
     *
     * Implementation note: validate() is re-entered through this method
     * with the private `skipPropRequired` flag held at `true` for the
     * duration. Per-step helpers read this flag instead of a forwarded
     * argument, so the public `validate(...)` signature is unchanged.
     *
     * @returns {WorkflowValidationResult} The structural validation result for the workflow definition.
     * @param {WorkflowDefinitionModel} definition - The workflow definition to validate structurally.
     * @private
     */
    public validateStructure(definition: WorkflowDefinitionModel): WorkflowValidationResult {
        this.skipPropRequired = true;
        try {
            return this.validateDefinition(definition, false);
        } finally {
            this.skipPropRequired = false;
        }
    }

    /**
     * Validates a single step's required properties (used by single-step execute).
     * Does not run full-graph checks (ids, reachability, multi-trigger rules).
     *
     * @returns {WorkflowValidationResult} The validation result for the workflow step.
     * @param {WorkflowStep} step - The workflow step whose required properties are validated.
     * @private
     */
    public validateStepProps(step: WorkflowStep): WorkflowValidationResult {
        const messages: WorkflowValidationMessage[] = [];
        this.validateStep(step, messages);
        const hasError: boolean = messages.some((message: WorkflowValidationMessage) => message.type === 'Error');
        return { isValid: !hasError, messages };
    }

    private validateIds(
        steps: WorkflowStep[],
        connections: WorkflowConnection[],
        notes: WorkflowStickyNote[],
        messages: WorkflowValidationMessage[]
    ): void {
        const seen: { [id: string]: boolean } = Object.create(null);
        const check: (
            id: string | undefined,
            stepId?: string,
            connectionId?: string
        ) => void = (id: string | undefined, stepId?: string, connectionId?: string): void => {
            if (!id) {
                messages.push(this.error('ID_REQUIRED', this.t('validationIdRequired'), stepId, connectionId, 'id'));
                return;
            }
            if (!ID_PATTERN.test(id) || isReservedId(id)) {
                messages.push(this.error(
                    'ID_INVALID',
                    this.t('validationIdInvalid'),
                    stepId,
                    connectionId,
                    'id'
                ));
            }
            if (seen[`${id}`]) {
                messages.push(this.error('ID_DUPLICATE', this.t('validationIdDuplicate'), stepId, connectionId, 'id'));
            }
            seen[`${id}`] = true;
        };
        steps.forEach((step: WorkflowStep) => check(step.id, step.id));
        connections.forEach((connection: WorkflowConnection) => check(connection.id, undefined, connection.id));
        notes.forEach((note: WorkflowStickyNote) => check(note.id));
    }

    private validateTriggers(steps: WorkflowStep[], messages: WorkflowValidationMessage[]): void {
        const triggers: WorkflowStep[] = steps.filter((step: WorkflowStep) => this.isTrigger(step.stepType));
        if (triggers.length === 0) {
            messages.push(this.error('TRIGGER_REQUIRED', this.t('validationTriggerRequired')));
        }
    }

    private validateConnections(
        steps: WorkflowStep[],
        connections: WorkflowConnection[],
        messages: WorkflowValidationMessage[]
    ): void {
        const stepMap: { [id: string]: WorkflowStep } = Object.create(null);
        steps.forEach((step: WorkflowStep) => {
            if (step.id) {
                stepMap[step.id] = step;
            }
        });
        const incoming: { [id: string]: number } = Object.create(null);
        const signature: { [key: string]: boolean } = Object.create(null);
        connections.forEach((connection: WorkflowConnection) => {
            const source: WorkflowStep | undefined = connection.sourceStepId ? stepMap[`${connection.sourceStepId}`] : undefined;
            const target: WorkflowStep | undefined = connection.targetStepId ? stepMap[`${connection.targetStepId}`] : undefined;
            if (!source || !target) {
                messages.push(this.error(
                    'CONNECTION_ENDPOINT',
                    this.t('validationConnectionEndpoint'),
                    undefined,
                    connection.id
                ));
                return;
            }
            if (connection.sourceStepId === connection.targetStepId) {
                messages.push(this.error('CONNECTION_SELF', this.t('validationSelfConnection'), undefined, connection.id));
            }
            const outputs: string[] = PortResolver.getOutputPorts(source);
            if (connection.sourcePort && outputs.indexOf(connection.sourcePort) === -1) {
                messages.push(this.error(
                    'SOURCE_PORT_INVALID',
                    this.t('validationSourcePortInvalid'),
                    source.id,
                    connection.id,
                    'sourcePort'
                ));
            }
            // A missing targetPort means the input port, as on import and on the canvas.
            if ((connection.targetPort || 'input') !== 'input') {
                messages.push(this.error(
                    'TARGET_PORT_INVALID',
                    this.t('validationTargetPortInvalid'),
                    target.id,
                    connection.id,
                    'targetPort'
                ));
            }
            if (this.isTrigger(target.stepType)) {
                messages.push(this.error(
                    'TRIGGER_INCOMING',
                    this.t('validationTriggerIncoming'),
                    target.id,
                    connection.id
                ));
            }
            const key: string = [
                connection.sourceStepId,
                connection.sourcePort,
                connection.targetStepId,
                connection.targetPort
            ].join('|');
            if (signature[`${key}`]) {
                messages.push(this.error('CONNECTION_DUPLICATE', this.t('validationConnectionDuplicate'), undefined, connection.id));
            }
            signature[`${key}`] = true;
            if (target.id) {
                incoming[`${target.id}`] = (incoming[`${target.id}`] || 0) + 1;
            }
        });
        const fanOut: { [key: string]: number } = Object.create(null);
        connections.forEach((connection: WorkflowConnection) => {
            if (!connection.sourceStepId) {
                return;
            }
            const outKey: string = connection.sourceStepId + '|' + (connection.sourcePort || 'output');
            fanOut[`${outKey}`] = (fanOut[`${outKey}`] || 0) + 1;
            if (fanOut[`${outKey}`] === 2) {
                messages.push(this.error(
                    'FANOUT',
                    this.t('validationFanOut'),
                    connection.sourceStepId,
                    connection.id,
                    'sourcePort'
                ));
            }
        });
        Object.keys(incoming).forEach((stepId: string) => {
            if (incoming[`${stepId}`] > 1 && !PortResolver.allowsMultipleIncoming(stepMap[`${stepId}`] || {})) {
                messages.push(this.error(
                    'MERGE_TOPOLOGY',
                    this.t('validationMergeTopology'),
                    stepId
                ));
            }
        });
        this.validateCycles(steps, connections, messages);
    }

    private validateCycles(
        steps: WorkflowStep[],
        connections: WorkflowConnection[],
        messages: WorkflowValidationMessage[]
    ): void {
        const outgoing: { [id: string]: string[] } = Object.create(null);
        connections.forEach((connection: WorkflowConnection) => {
            const sourceId: string = connection.sourceStepId || '';
            const targetId: string = connection.targetStepId || '';
            const source: WorkflowStep | undefined = steps.filter((step: WorkflowStep) => step.id === sourceId)[0];
            if (source && source.stepType === 'Loop' && connection.sourcePort === 'loop') {
                return;
            }
            if (!outgoing[`${sourceId}`]) {
                outgoing[`${sourceId}`] = [];
            }
            outgoing[`${sourceId}`].push(targetId);
        });
        const visiting: { [id: string]: boolean } = Object.create(null);
        const visited: { [id: string]: boolean } = Object.create(null);
        const visit: (id: string) => boolean = (id: string): boolean => {
            if (visited[`${id}`]) {
                return false;
            }
            if (visiting[`${id}`]) {
                return true;
            }
            visiting[`${id}`] = true;
            const next: string[] = outgoing[`${id}`] || [];
            for (let i: number = 0; i < next.length; i++) {
                if (visit(next[parseInt(i.toString(), 10)])) {
                    return true;
                }
            }
            visiting[`${id}`] = false;
            visited[`${id}`] = true;
            return false;
        };
        // Report each cycle once, against the first step found on it.
        for (let i: number = 0; i < steps.length; i++) {
            const id: string | undefined = steps[parseInt(i.toString(), 10)].id;
            if (id && visit(id)) {
                messages.push(this.error('CYCLE', this.t('validationCycle'), id));
                return;
            }
        }
    }

    private validateReachability(
        steps: WorkflowStep[],
        connections: WorkflowConnection[],
        messages: WorkflowValidationMessage[]
    ): void {
        const outgoing: { [id: string]: string[] } = Object.create(null);
        connections.forEach((connection: WorkflowConnection) => {
            const sourceId: string = connection.sourceStepId || '';
            if (!outgoing[`${sourceId}`]) {
                outgoing[`${sourceId}`] = [];
            }
            outgoing[`${sourceId}`].push(connection.targetStepId || '');
        });
        const reachable: { [id: string]: boolean } = Object.create(null);
        const queue: string[] = steps
            .filter((step: WorkflowStep) => this.isTrigger(step.stepType) && step.id)
            .map((step: WorkflowStep) => step.id as string);
        queue.forEach((id: string) => { reachable[`${id}`] = true; });
        while (queue.length) {
            const current: string = queue.shift() as string;
            (outgoing[`${current}`] || []).forEach((next: string) => {
                if (!reachable[`${next}`]) {
                    reachable[`${next}`] = true;
                    queue.push(next);
                }
            });
        }
        steps.forEach((step: WorkflowStep) => {
            if (!this.isTrigger(step.stepType) && step.id && !reachable[step.id]) {
                messages.push(this.warn(
                    'UNREACHABLE_STEP',
                    this.t('validationUnreachableStep'),
                    step.id
                ));
            }
        });
    }

    private validateStep(step: WorkflowStep, messages: WorkflowValidationMessage[]): void {
        const props: Record<string, unknown> = this.asRecord(step.props);
        switch (step.stepType) {
        case 'ScheduledTrigger':
            this.validateScheduledTrigger(step, props, messages);
            break;
        case 'WebhookTrigger':
            this.validateWebhookTrigger(step, props, messages);
            break;
        case 'FormInputTrigger':
            this.validateFormInput(step, props, messages);
            break;
        case 'SetVariable':
            this.validateSetVariable(step, props, messages);
            break;
        case 'Filter':
            if (!this.skipPropRequired) {
                this.require(step, props, 'itemsPath', messages);
            }
            this.validateConditions(step, props.conditions, messages, true);
            break;
        case 'Sort':
            if (!this.skipPropRequired) {
                this.require(step, props, 'itemsPath', messages);
                this.require(step, props, 'sortBy', messages);
                this.require(step, props, 'sortDirection', messages);
            }
            break;
        case 'ApiRequest':
            this.validateApiRequest(step, props, messages);
            break;
        case 'Delay':
            this.validateDelay(step, props, messages);
            break;
        case 'Condition':
            this.validateConditions(step, props.conditions, messages, true);
            break;
        case 'Switch':
            this.validateSwitch(step, props, messages);
            break;
        case 'Loop':
            if (!this.skipPropRequired) {
                this.require(step, props, 'itemsPath', messages);
            }
            if (props.maxIterations !== undefined && (!this.isPositiveInteger(props.maxIterations))) {
                messages.push(this.error('LOOP_MAX', this.t('validationLoopMax'), step.id, undefined, 'props.maxIterations'));
            }
            break;
        case 'Approve':
            this.validateApprove(step, props, messages);
            break;
        case 'Notify':
            this.validateNotify(step, props, messages);
            break;
        case 'AI':
            if (!this.skipPropRequired) {
                this.require(step, props, 'prompt', messages);
                this.require(step, props, 'outputFormat', messages);
                if (this.credentialMode === 'Inline') {
                    this.require(step, props, 'provider', messages);
                    this.require(step, props, 'model', messages);
                } else {
                    this.require(step, props, 'serverUrl', messages);
                }
            }
            // `apiKey` is where Inline credential mode keeps a development key; it is never exported.
            this.rejectSecrets(step, props, messages, ['apikey']);
            this.warnKeyInReference(step, props, messages);
            break;
        case 'Formatter':
            if (!this.skipPropRequired) {
                this.require(step, props, 'inputSource', messages);
                if (!props.format && !props.outputFormat) {
                    this.require(step, props, 'format', messages);
                }
                if (props.inputSource === 'ContextPath') {
                    this.require(step, props, 'sourcePath', messages);
                }
            }
            break;
        case 'Custom':
            if (!this.skipPropRequired && !step.customStepId) {
                this.require(step, props, 'actionType', messages);
            }
            break;
        default:
            break;
        }
        this.scanExpressions(step, props, messages);
    }

    private validateScheduledTrigger(
        step: WorkflowStep,
        props: Record<string, unknown>,
        messages: WorkflowValidationMessage[]
    ): void {
        if (!this.skipPropRequired) {
            this.require(step, props, 'scheduleType', messages);
            const scheduleType: unknown = props.scheduleType;
            if (scheduleType === 'Once') {
                this.require(step, props, 'startDateTime', messages);
            } else if (scheduleType === 'Recurring') {
                this.require(step, props, 'startDateTime', messages);
                this.require(step, props, 'intervalUnit', messages);
                if (!this.isPositiveNumber(props.interval)) {
                    messages.push(this.error('SCHEDULE_INTERVAL', this.t('validationScheduleInterval'), step.id, undefined, 'props.interval'));
                }
            } else if (scheduleType === 'Cron') {
                this.require(step, props, 'cronExpression', messages);
            } else if (scheduleType !== undefined && scheduleType !== null && scheduleType !== '') {
                messages.push(this.error(
                    'SCHEDULE_TYPE',
                    this.t('validationScheduleType'),
                    step.id,
                    undefined,
                    'props.scheduleType'
                ));
            }
        }

        // Date validity, end >= start, interval unit enum, and 5-field cron
        // syntax always run — these protect against syntax-level damage that
        // is unrelated to whether the author has filled the required props.
        const scheduleIssues: ScheduleValidationIssue[] = ScheduleEvaluator.validate(props);
        scheduleIssues.forEach((issue: ScheduleValidationIssue) => {
            messages.push(this.error(issue.code, issue.message, step.id, undefined, issue.propertyPath));
        });
    }

    private validateWebhookTrigger(
        step: WorkflowStep,
        props: Record<string, unknown>,
        messages: WorkflowValidationMessage[]
    ): void {
        if (!this.skipPropRequired) {
            // Method is required
            this.require(step, props, 'method', messages);
            if (typeof props.method === 'string' && HTTP_METHODS.indexOf(props.method) === -1) {
                messages.push(this.error('WEBHOOK_METHOD', this.t('validationWebhookMethod'), step.id, undefined, 'props.method'));
            }

            // Path is required and must be valid per webhook specification
            this.require(step, props, 'path', messages);
            if (typeof props.path === 'string') {
                // Use comprehensive webhook path validator (checks for query strings, fragments, parent segments, etc.)
                const pathError: string | undefined = validateWebhookPath(props.path);
                if (pathError) {
                    messages.push(this.error('WEBHOOK_PATH', pathError, step.id, undefined, 'props.path'));
                }
            }

            // Authentication: validate mode and require authRef when needed
            const authMode: unknown = props.authMode;
            const validAuthModes: string[] = ['None', 'Basic', 'ApiKeyHeader', 'Bearer', 'HmacSha256', 'Custom'];

            // Validate that authMode is a known value (even if 'None')
            if (
                authMode !== undefined &&
                (typeof authMode !== 'string' || validAuthModes.indexOf(authMode) === -1)
            ) {
                messages.push(this.error(
                    'WEBHOOK_AUTH_MODE', this.t('validationWebhookAuthMode'), step.id, undefined, 'props.authMode'
                ));
            }

            // When authMode is not 'None', authRef is required
            if (typeof authMode === 'string' && authMode !== 'None') {
                if (typeof props.authRef !== 'string' || !props.authRef.trim()) {
                    messages.push(this.error(
                        'WEBHOOK_AUTH', this.t('validationWebhookAuth'), step.id, undefined, 'props.authRef'
                    ));
                }
            }

            // Validate mode-specific header configuration
            if (typeof authMode === 'string') {
                if (authMode === 'ApiKeyHeader') {
                    // ApiKeyHeader requires authHeaderName to specify which header contains the key
                    if (typeof props.authHeaderName !== 'string' || !props.authHeaderName.trim()) {
                        messages.push(this.error(
                            'WEBHOOK_AUTH_HEADER', this.t('validationWebhookAuthHeader'), step.id, undefined, 'props.authHeaderName'
                        ));
                    }
                } else if (authMode === 'HmacSha256') {
                    // HmacSha256 requires authSignatureHeaderName to specify the signature header
                    if (typeof props.authSignatureHeaderName !== 'string' || !props.authSignatureHeaderName.trim()) {
                        messages.push(this.error(
                            'WEBHOOK_AUTH_SIG_HEADER', this.t('validationWebhookAuthSignatureHeader'), step.id, undefined, 'props.authSignatureHeaderName'
                        ));
                    }
                }
            }

            // Response code should be a valid HTTP status code if provided
            if (typeof props.responseCode === 'number') {
                if (props.responseCode < 100 || props.responseCode > 599) {
                    messages.push(this.error(
                        'WEBHOOK_RESPONSE_CODE', this.t('validationWebhookResponseCode'), step.id, undefined, 'props.responseCode'
                    ));
                }
            }
        } else if (typeof props.path === 'string') {
            // Even when skipping required-prop rules, a *user-supplied* path
            // with a bad shape (query strings, fragments, parent segments) must still be
            // rejected as a security / shape error.
            const pathError: string | undefined = validateWebhookPath(props.path);
            if (pathError) {
                messages.push(this.error('WEBHOOK_PATH', pathError, step.id, undefined, 'props.path'));
            }
        }

        // Reject any secrets stored in the props (authRef should never contain actual secrets)
        this.rejectSecrets(step, props, messages);
    }


    private validateFormInput(
        step: WorkflowStep,
        props: Record<string, unknown>,
        messages: WorkflowValidationMessage[]
    ): void {
        const fields: unknown[] = Array.isArray(props.fields) ? props.fields as unknown[] : [];
        if (fields.length === 0) {
            if (!this.skipPropRequired) {
                messages.push(this.error('FORM_FIELDS', this.t('validationFormFields'), step.id, undefined, 'props.fields'));
            }
            return;
        }
        const names: { [name: string]: boolean } = Object.create(null);
        fields.forEach((field: unknown, index: number) => {
            const record: Record<string, unknown> = this.asRecord(field);
            if (typeof record.name !== 'string' || !record.name) {
                messages.push(this.error('FORM_FIELD_NAME', this.t('validationFormFieldName'), step.id, undefined, 'props.fields[' + index + '].name'));
            } else if (names[record.name]) {
                messages.push(this.error('FORM_FIELD_UNIQUE', this.t('validationFormFieldUnique'), step.id, undefined, 'props.fields[' + index + '].name'));
            } else {
                names[record.name] = true;
            }
            if (typeof record.type !== 'string' || !record.type) {
                messages.push(this.error('FORM_FIELD_TYPE', this.t('validationFormFieldType'), step.id, undefined, 'props.fields[' + index + '].type'));
            }
            const options: unknown = record.options || record.choices;
            if (typeof record.type === 'string' && OPTION_FIELD_TYPES.indexOf(record.type) !== -1 && (!Array.isArray(options) || options.length === 0)) {
                messages.push(this.error('FORM_FIELD_OPTIONS', this.t('validationFormFieldOptions'), step.id, undefined, 'props.fields[' + index + '].options'));
            }
        });
    }

    /**
     * Checks a literal (non-expression) Set Variable value against its declared type.
     *
     * @param {unknown} value The authored value.
     * @param {unknown} valueType The declared type.
     * @returns {string | null} An error key, or null when valid or not checkable.
     */
    private static literalTypeError(value: unknown, valueType: unknown): string | null {
        if (typeof value !== 'string' || !valueType || valueType === 'Auto' || valueType === 'String') {
            return null;
        }
        if (value.indexOf('{{') !== -1 || /^\s*\$\./.test(value)) {
            return null; // resolved at run time
        }
        const text: string = value.trim();
        if (valueType === 'Number') {
            return text !== '' && isFinite(Number(text)) ? null : 'number';
        }
        if (valueType === 'Boolean') {
            return text.toLowerCase() === 'true' || text.toLowerCase() === 'false' ? null : 'boolean';
        }
        if (valueType === 'Json') {
            try {
                JSON.parse(text);
                return null;
            } catch {
                return 'json';
            }
        }
        return null;
    }

    private validateSetVariable(
        step: WorkflowStep,
        props: Record<string, unknown>,
        messages: WorkflowValidationMessage[]
    ): void {
        const variables: unknown[] = Array.isArray(props.variables) ? props.variables as unknown[] : [];
        if (variables.length === 0) {
            if (!this.skipPropRequired) {
                messages.push(this.error('SET_VARIABLE_REQUIRED', this.t('validationSetVariableRequired'), step.id, undefined, 'props.variables'));
            }
            return;
        }
        const names: { [name: string]: boolean } = Object.create(null);
        variables.forEach((item: unknown, index: number) => {
            const record: Record<string, unknown> = this.asRecord(item);
            if (typeof record.variableName !== 'string' || !record.variableName) {
                messages.push(this.error('SET_VARIABLE_NAME', this.t('validationSetVariableName'), step.id, undefined, 'props.variables[' + index + '].variableName'));
            } else if (names[record.variableName]) {
                messages.push(this.error('SET_VARIABLE_UNIQUE', this.t('validationSetVariableUnique'), step.id, undefined, 'props.variables[' + index + '].variableName'));
            } else {
                names[record.variableName] = true;
            }
            if (record.isMathOperation) {
                if (record.firstValue === undefined || record.secondValue === undefined || !record.operator) {
                    messages.push(this.error('SET_VARIABLE_MATH', this.t('validationSetVariableMath'), step.id, undefined, 'props.variables[' + index + ']'));
                }
                if ((record.operator === 'Divide' || record.operator === 'Modulo') && record.secondValue === 0) {
                    messages.push(this.error('SET_VARIABLE_ZERO', this.t('validationSetVariableZero'), step.id, undefined, 'props.variables[' + index + '].secondValue'));
                }
            } else if (record.value === undefined) {
                messages.push(this.error('SET_VARIABLE_VALUE', this.t('validationSetVariableValue'), step.id, undefined, 'props.variables[' + index + '].value'));
            }
            const typeError: string | null = WorkflowValidator.literalTypeError(record.value, record.valueType);
            // A content problem, not structure: drafts still load (see importWorkflow).
            if (!record.isMathOperation && typeError && !this.skipPropRequired) {
                messages.push(this.error('SET_VARIABLE_TYPE', this.t('validationSetVariableType').replace('{0}', String(record.valueType)),
                                         step.id, undefined, 'props.variables[' + index + '].value'));
            }
        });
    }

    private validateApiRequest(
        step: WorkflowStep,
        props: Record<string, unknown>,
        messages: WorkflowValidationMessage[]
    ): void {
        if (!this.skipPropRequired) {
            this.require(step, props, 'method', messages);
            this.require(step, props, 'url', messages);
        }
        // URL_PROTOCOL always runs: a user-supplied non-template URL with a
        // bad protocol is a security / shape problem regardless of whether
        // the host has finished configuring the step.
        if (typeof props.url === 'string' && !isHttpUrl(props.url) && props.url.indexOf('{{') === -1) {
            messages.push(this.error('URL_PROTOCOL', this.t('validationUrlProtocol'), step.id, undefined, 'props.url'));
        }
        this.rejectSecrets(step, props, messages);
    }

    private validateDelay(
        step: WorkflowStep,
        props: Record<string, unknown>,
        messages: WorkflowValidationMessage[]
    ): void {
        if (!this.skipPropRequired) {
            this.require(step, props, 'delayType', messages);
            if (props.delayType === 'Fixed') {
                if (!this.isNonNegativeNumber(props.duration)) {
                    messages.push(this.error('DELAY_DURATION', this.t('validationDelayDuration'), step.id, undefined, 'props.duration'));
                }
                this.require(step, props, 'timeUnit', messages);
            } else if (props.delayType === 'Until') {
                this.require(step, props, 'untilDateTime', messages);
            } else if (props.delayType === 'Dynamic') {
                const dynamicCondition: unknown = props.dynamicCondition;
                let hasDynamicCondition: boolean = false;
                if (Array.isArray(dynamicCondition)) {
                    for (let index: number = 0; index < dynamicCondition.length; index++) {
                        if (this.asRecord(dynamicCondition[parseInt(index.toString(), 10)]).field) {
                            hasDynamicCondition = true;
                            break;
                        }
                    }
                } else {
                    hasDynamicCondition = !!this.asRecord(dynamicCondition).field;
                }
                if (!hasDynamicCondition) {
                    messages.push(this.error('DELAY_DYNAMIC', this.t('validationDelayDynamic'), step.id, undefined, 'props.dynamicCondition'));
                }
                if (!this.isNonNegativeNumber(props.dynamicDuration)) {
                    messages.push(this.error('DELAY_DYNAMIC', this.t('validationDelayDynamic'), step.id, undefined, 'props.dynamicDuration'));
                }
                this.require(step, props, 'dynamicTimeUnit', messages);
            }
        }
    }

    private validateSwitch(
        step: WorkflowStep,
        props: Record<string, unknown>,
        messages: WorkflowValidationMessage[]
    ): void {
        const branches: unknown[] = Array.isArray(props.branches) ? props.branches as unknown[] : [];
        if (branches.length === 0) {
            if (!this.skipPropRequired) {
                messages.push(this.error('SWITCH_BRANCH', this.t('validationSwitchBranch'), step.id, undefined, 'props.branches'));
            }
            return;
        }
        const names: { [name: string]: boolean } = Object.create(null);
        branches.forEach((branch: unknown, index: number) => {
            const record: Record<string, unknown> = this.asRecord(branch);
            if (typeof record.branchName !== 'string' || !record.branchName) {
                if (!this.skipPropRequired) {
                    messages.push(this.error('SWITCH_BRANCH_NAME', this.t('validationSwitchBranchName'), step.id, undefined, 'props.branches[' + index + '].branchName'));
                }
            } else if (names[record.branchName]) {
                if (!this.skipPropRequired) {
                    messages.push(this.error('SWITCH_BRANCH_UNIQUE', this.t('validationSwitchBranchName'), step.id, undefined, 'props.branches[' + index + '].branchName'));
                }
            } else {
                names[record.branchName] = true;
            }
            this.validateConditions(step, [record.condition], messages, true);
        });
    }

    private validateApprove(
        step: WorkflowStep,
        props: Record<string, unknown>,
        messages: WorkflowValidationMessage[]
    ): void {
        if (!this.skipPropRequired) {
            if (!Array.isArray(props.reviewers) || (props.reviewers as unknown[]).length === 0) {
                messages.push(this.error('APPROVE_REVIEWERS', this.t('validationApproveReviewers'), step.id, undefined, 'props.reviewers'));
            }
            this.require(step, props, 'requestMessage', messages);
            if (!Array.isArray(props.requestFields) || (props.requestFields as unknown[]).length === 0) {
                messages.push(this.error(
                    'APPROVE_REQUEST_FIELDS',
                    this.t('validationApproveRequestFields'),
                    step.id,
                    undefined,
                    'props.requestFields'
                ));
            }
        }
    }

    private validateNotify(
        step: WorkflowStep,
        props: Record<string, unknown>,
        messages: WorkflowValidationMessage[]
    ): void {
        if (!this.skipPropRequired) {
            this.require(step, props, 'channel', messages);
            this.require(step, props, 'message', messages);
            switch (props.channel) {
            case 'Email':
                this.require(step, props, 'to', messages);
                break;
            case 'SMS':
                this.require(step, props, 'phoneNumber', messages);
                break;
            case 'Teams':
            case 'Slack':
                this.require(step, props, 'channelId', messages);
                break;
            case 'Push':
                this.require(step, props, 'deviceToken', messages);
                break;
            case 'Webhook':
                this.require(step, props, 'webhookUrl', messages);
                break;
            case 'Custom':
                this.require(step, props, 'target', messages);
                break;
            default:
                break;
            }
        }
        // URL_PROTOCOL always runs: a user-supplied Webhook URL must not
        // bypass the protocol guard just because required-prop rules are
        // suppressed.
        if (typeof props.webhookUrl === 'string' && !isHttpUrl(props.webhookUrl)) {
            messages.push(this.error('URL_PROTOCOL', this.t('validationUrlProtocol'), step.id, undefined, 'props.webhookUrl'));
        }
    }

    private validateConditions(
        step: WorkflowStep,
        value: unknown,
        messages: WorkflowValidationMessage[],
        required: boolean
    ): void {
        const conditions: unknown[] = Array.isArray(value) ? value as unknown[] : [];
        if (required && conditions.length === 0) {
            if (!this.skipPropRequired) {
                messages.push(this.error('CONDITION_REQUIRED', this.t('validationConditionRequired'), step.id, undefined, 'props.conditions'));
            }
            return;
        }
        conditions.forEach((condition: unknown, index: number) => {
            const record: Record<string, unknown> = this.asRecord(condition);
            if (typeof record.field !== 'string' || !record.field) {
                if (!this.skipPropRequired) {
                    messages.push(this.error('CONDITION_FIELD', this.t('validationConditionField'), step.id, undefined, 'props.conditions[' + index + '].field'));
                }
            }
            if (typeof record.valueType !== 'string' || !record.valueType) {
                if (!this.skipPropRequired) {
                    messages.push(this.error('CONDITION_VALUE_TYPE', this.t('validationConditionValueType'), step.id, undefined, 'props.conditions[' + index + '].valueType'));
                }
            }
            if (typeof record.operator !== 'string' || !record.operator) {
                if (!this.skipPropRequired) {
                    messages.push(this.error('CONDITION_OPERATOR', this.t('validationConditionOperator'), step.id, undefined, 'props.conditions[' + index + '].operator'));
                }
            } else if (!this.skipPropRequired && UNARY_OPERATORS.indexOf(record.operator) === -1 && record.value === undefined) {
                messages.push(this.error('CONDITION_VALUE', this.t('validationConditionValue'), step.id, undefined, 'props.conditions[' + index + '].value'));
            }
        });
    }

    private validateConnectionExpressions(
        connection: WorkflowConnection,
        messages: WorkflowValidationMessage[]
    ): void {
        if (typeof connection.label === 'string' && connection.label.indexOf('{{') !== -1) {
            const error: string | null = ExpressionEvaluator.validateSyntax(connection.label);
            if (error) {
                messages.push(this.error('EXPRESSION_SYNTAX', error, undefined, connection.id, 'label'));
            }
        }
    }

    private scanExpressions(
        step: WorkflowStep,
        props: Record<string, unknown>,
        messages: WorkflowValidationMessage[]
    ): void {
        const visit: (value: unknown, path: string) => void = (value: unknown, path: string): void => {
            if (typeof value === 'string' && (value.indexOf('{{') !== -1 || value.indexOf('$.') === 0)) {
                const error: string | null = ExpressionEvaluator.validateSyntax(value);
                if (error) {
                    messages.push(this.error('EXPRESSION_SYNTAX', error, step.id, undefined, path));
                }
            } else if (Array.isArray(value)) {
                value.forEach((item: unknown, index: number) => visit(item, path + '[' + index + ']'));
            } else if (this.isRecord(value)) {
                Object.keys(value).forEach((key: string) => visit(value[`${key}`], path + '.' + key));
            }
        };
        visit(props, 'props');
    }

    /**
     * Warns when a credential reference looks like a pasted API key. A reference is a name your app
     * resolves through `credentialRequested`; a raw key there would be exported with the workflow.
     *
     * @param {WorkflowStep} step - The AI step.
     * @param {Record<string, unknown>} props - Its props.
     * @param {WorkflowValidationMessage[]} messages - The messages to add to.
     * @returns {void}
     */
    private warnKeyInReference(step: WorkflowStep, props: Record<string, unknown>, messages: WorkflowValidationMessage[]): void {
        const value: string = typeof props.credentialRef === 'string' ? props.credentialRef.trim() : '';
        const knownPrefix: boolean = /^(AIza|sk-|sk_|AQ\.|xai-|gsk_|pk_|ghp_|github_pat_)/.test(value);
        const longOpaque: boolean = value.length >= 32 && !/\s/.test(value) && /[A-Za-z]/.test(value) && /\d/.test(value);
        if (value && (knownPrefix || longOpaque)) {
            messages.push({ ...this.warn('CREDENTIAL_LOOKS_LIKE_KEY', this.t('validationCredentialLooksLikeKey'), step.id), propertyPath: 'props.credentialRef' });
        }
    }

    private rejectSecrets(
        step: WorkflowStep,
        props: Record<string, unknown>,
        messages: WorkflowValidationMessage[],
        allowed: string[] = []
    ): void {
        const forbidden: string[] = ['password', 'token', 'apikey', 'secret', 'certificate', 'authorization'];
        Object.keys(props).forEach((key: string) => {
            if (forbidden.indexOf(key.toLowerCase()) !== -1 && allowed.indexOf(key.toLowerCase()) === -1) {
                messages.push(this.error('SECRET_FORBIDDEN', this.t('validationSecretForbidden'), step.id, undefined, 'props.' + key));
            }
        });
    }

    private require(
        step: WorkflowStep,
        props: Record<string, unknown>,
        field: string,
        messages: WorkflowValidationMessage[]
    ): void {
        const value: unknown = props[`${field}`];
        if (value === undefined || value === null || value === '') {
            // The `{0}` placeholder is preserved verbatim so translators can
            // reorder the field name vs. the rest of the sentence without
            // breaking the surrounding tokens. `field` is always a technical
            // identifier (e.g. `sourcePort`, `itemsPath`, `maxIterations`),
            // never localized text, so no per-key entry is needed.
            const template: string = this.t('validationRequiredProp');
            const rendered: string = template.indexOf('{0}') === -1
                ? template
                : template.replace('{0}', field);
            messages.push(this.error(
                'REQUIRED_PROP',
                rendered,
                step.id,
                undefined,
                'props.' + field
            ));
        }
    }

    private isTrigger(stepType?: WorkflowStepType): boolean {
        return !!stepType && TRIGGER_TYPES.indexOf(stepType) !== -1;
    }



    private isPositiveNumber(value: unknown): boolean {
        return typeof value === 'number' && isFinite(value) && value > 0;
    }

    private isNonNegativeNumber(value: unknown): boolean {
        return typeof value === 'number' && isFinite(value) && value >= 0;
    }

    private isPositiveInteger(value: unknown): boolean {
        return typeof value === 'number' && isFinite(value) && value > 0 && Math.floor(value) === value;
    }

    private asRecord(value: unknown): Record<string, unknown> {
        return this.isRecord(value) ? value : {};
    }

    private isRecord(value: unknown): value is Record<string, unknown> {
        return !!value && typeof value === 'object' && !Array.isArray(value);
    }

    private error(
        code: string,
        message: string,
        stepId?: string,
        connectionId?: string,
        propertyPath?: string
    ): WorkflowValidationMessage {
        return { code, type: 'Error', message, stepId, connectionId, propertyPath };
    }

    private warn(
        code: string,
        message: string,
        stepId?: string
    ): WorkflowValidationMessage {
        return { code, type: 'Warning', message, stepId };
    }
}

