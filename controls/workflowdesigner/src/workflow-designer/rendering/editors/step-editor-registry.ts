import { L10n } from '@syncfusion/ej2-base';
import { LocaleContext } from '../../localization/locale-context';
import { WorkflowStepType } from '../../models/workflow-enums';

/**
 * Editor Field.
 *
 * @private
 */
export interface EditorField {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'number' | 'select' | 'json' | 'checkbox' | 'datetime'
    | 'formFields' | 'conditionRules' | 'switchBranches' | 'setVariables' | 'queryParameters'
    | 'reviewers' | 'requestFields' | 'responseFields'
    | 'credentialReference' | 'credentialLink';
    options?: string[];
    /** When true, field shows a runtime-context picker button (spec 10.1). */
    expression?: boolean;
    /**
     * Optional help shown via an info button next to the field: a locale key (or text) in help markup.
     * A `<key>Title` locale key, when present, is used as the popup heading.
     */
    helpText?: string;
    /**
     * When true, `helpText` is presented as a hover-only `?` icon next to
     * the field's label rather than the input row's `i` button. Used by
     * fields (e.g. cron expression) where the inline info button is
     * visually noisy and a labelled-trigger popup reads better.
     */
    helpIcon?: boolean;
    /**
     * When true, the property panel mounts the editor's structured host
     * (`formFields`/`requestFields`/…) **without** its outer label and the
     * editor itself is expected to surface the heading. Used by editors
     * (approval request fields, reviewers, set variables) where the
     * field-group label and the editor's own heading would otherwise
     * duplicate the title.
     */
    hideFieldLabel?: boolean;
    /** Hide field unless the current props satisfy this predicate. */
    /** Shown only when `executionSettings.credentialMode` equals this value. */
    credentialMode?: 'Inline' | 'Reference';
    visibleWhen?: (props: Record<string, unknown>) => boolean;
}

/**
 * Editor Descriptor.
 *
 * @private
 */
export interface EditorDescriptor {
    stepType: WorkflowStepType;
    fields: EditorField[];
}

/**
 * Internal mapping of step types to property-section fields.
 * Callers should pass current props so type-dependent fields can be filtered.
 *
 * @returns {EditorDescriptor} The fields visible for the step type.
 * @param {WorkflowStepType} stepType The step type to inspect.
 * @param {Record<string, unknown>} props Current step properties.
 * @private
 */
export class StepEditorRegistry {
    /**
     * Optional localization instance for caption resolution. Wired by the
     * property panel and editor components so each step-type field's visible
     * caption (and matching `aria-label`) reads through `l10n.getConstant(...)`
     * — the registry stores the *key* in `EditorField.label`, not the
     * rendered English text.
     *
     * @private
     */
    private static l10n: L10n | undefined;

    /**
     * Updates the shared localization instance for caption resolution.
     * Called by `PropertyPanel.setLocale(l10n)` on initial render and again
     * whenever `WorkflowDesigner.onPropertyChanged({locale})` rebuilds L10n.
     *
     * @param {L10n} [l10n] - Optional localization instance. Pass `undefined`
     *   to revert to literal English.
     * @returns {void} Nothing.
     * @private
     */
    public static setLocale(l10n?: L10n): void {
        StepEditorRegistry.l10n = l10n;
    }

    /**
     * Resolves a caption key against the shared L10n instance and falls back
     * to the literal key when no L10n is wired (legacy / unit tests).
     *
     * The `key` doubles as the legacy English string for the fallback path,
     * so callers do not need a side-table — passing `'Method'` returns the
     *   translated `Method` when L10n is wired, otherwise literally `'Method'`.
     *
     * @param {string} key - The caption key (also the English source string).
     * @returns {string} The localized or literal caption.
     * @private
     */
    public static resolveCaption(key: string): string {
        const l10n: L10n | undefined = LocaleContext.current() || StepEditorRegistry.l10n;
        if (l10n) {
            const value: string = l10n.getConstant(key);
            if (value) {
                return value;
            }
        }
        return key;
    }

    /**
     * Convenience wrapper that takes an `EditorField`'s `label` (which IS
     * the caption key) and resolves it through L10n. Equal to
     * `resolveCaption(field.label)`.
     *
     * @param {EditorField} field - The field whose caption should be resolved.
     * @returns {string} The localized caption, or the literal English.
     * @private
     */
    public static resolveLabel(field: EditorField): string {
        return StepEditorRegistry.resolveCaption(field.label);
    }

    /**
     * Get.
     *
     * @param {WorkflowStepType} stepType The step type.
     * @param {Record} props The props.
     * @returns {EditorDescriptor} The result.
     * @private
     */
    public static get(stepType?: WorkflowStepType, props?: Record<string, unknown>): EditorDescriptor {
        const type: WorkflowStepType = stepType || 'ManualTrigger';
        const current: Record<string, unknown> = props && typeof props === 'object' ? props : {};
        const fields: EditorField[] = StepEditorRegistry.fields(type).filter((field: EditorField) => {
            return !field.visibleWhen || field.visibleWhen(current);
        });
        return { stepType: type, fields: fields };
    }

    /**
     * Default props for a step type so property fields bind immediately.
     * - Every select uses the first option (and dependent visibleWhen fields pick up).
     * - Checkboxes default to false.
     * - Explicit product defaults for common number/json seeds where needed.
     * Free-text / empty-friendly fields are omitted so the UI shows blank inputs.
     *
     * @param {WorkflowStepType} stepType The step type to seed.
     * @returns {Record<string, unknown>} The default properties.
     * @private
     */
    public static getDefaultProps(stepType?: WorkflowStepType): Record<string, unknown> {
        const type: WorkflowStepType = stepType || 'ManualTrigger';
        const allFields: EditorField[] = StepEditorRegistry.fields(type);
        const defaults: Record<string, unknown> = {};
        // Seed non-conditional defaults first so visibleWhen can resolve.
        allFields.forEach((field: EditorField) => {
            if (field.visibleWhen) {
                return;
            }
            const value: unknown = StepEditorRegistry.defaultForField(field, type);
            if (value !== undefined) {
                defaults[field.key] = value;
            }
        });
        // Apply defaults for fields that become visible once parent selects are set.
        // Two passes cover nested dependencies (e.g. scheduleType → intervalUnit).
        for (let pass: number = 0; pass < 2; pass++) {
            allFields.forEach((field: EditorField) => {
                if (!field.visibleWhen || !field.visibleWhen(defaults)) {
                    return;
                }
                if (Object.prototype.hasOwnProperty.call(defaults, field.key)) {
                    return;
                }
                const value: unknown = StepEditorRegistry.defaultForField(field, type);
                if (value !== undefined) {
                    defaults[field.key] = value;
                }
            });
        }
        return defaults;
    }

    /**
     * Fills missing keys on existing step props with registry defaults.
     * Respects current prop values for visibleWhen (e.g. Recurring → intervalUnit).
     * Does not overwrite keys the user already set (including empty string / false).
     * Returns whether any key was added (caller can persist via onChange).
     *
     * @param {WorkflowStepType} stepType The step type whose defaults are applied.
     * @param {Record<string, unknown>} props Existing step properties.
     * @returns {Object} Updated properties and change state.
     * @private
     */
    public static applyMissingDefaults(
        stepType: WorkflowStepType | undefined,
        props: Record<string, unknown>
    ): { props: Record<string, unknown>; changed: boolean } {
        const type: WorkflowStepType = stepType || 'ManualTrigger';
        const allFields: EditorField[] = StepEditorRegistry.fields(type);
        const next: Record<string, unknown> = {};
        Object.keys(props).forEach((key: string) => { next[`${key}`] = props[`${key}`]; });
        let changed: boolean = false;
        // Empty Switch branch lists still need a seed branch so the canvas starts
        // with Condition-like dual ports (first branch + default).
        if (type === 'Switch' && Array.isArray(next.branches) && (next.branches as unknown[]).length === 0) {
            next.branches = StepEditorRegistry.defaultSwitchBranches();
            changed = true;
        }
        const tryFill: (field: EditorField) => void = (field: EditorField): void => {
            if (field.visibleWhen && !field.visibleWhen(next)) {
                return;
            }
            if (Object.prototype.hasOwnProperty.call(next, field.key) && next[field.key] !== undefined) {
                return;
            }
            const value: unknown = StepEditorRegistry.defaultForField(field, type);
            if (value !== undefined) {
                next[field.key] = value;
                changed = true;
            }
        };
        // Non-conditional first, then multipass for newly visible dependents.
        allFields.forEach((field: EditorField) => {
            if (!field.visibleWhen) {
                tryFill(field);
            }
        });
        for (let pass: number = 0; pass < 2; pass++) {
            allFields.forEach((field: EditorField) => {
                if (field.visibleWhen) {
                    tryFill(field);
                }
            });
        }
        return { props: next, changed: changed };
    }

    private static defaultForField(field: EditorField, stepType: WorkflowStepType): unknown {
        // Product-meaningful seeds win over first-select (e.g. Switch no-match default path).
        const explicit: Record<string, unknown> | undefined = StepEditorRegistry.explicitDefaults(stepType);
        if (explicit && Object.prototype.hasOwnProperty.call(explicit, field.key)) {
            return explicit[field.key];
        }
        if (field.type === 'select' && field.options && field.options.length > 0) {
            return field.options[0];
        }
        if (field.type === 'checkbox') {
            return false;
        }
        return undefined;
    }

    /**
     * Initial Switch branch list: one named branch with an empty condition rule.
     *
     * @returns {Array<Object>} The initial Switch branches.
     */
    private static defaultSwitchBranches(): Array<{ branchName: string; condition: {
        field: string;
        valueType: string;
        operator: string;
        value: string;
    } }> {
        return [{
            branchName: 'branch1',
            condition: {
                field: '',
                valueType: 'String',
                operator: 'equal',
                value: ''
            }
        }];
    }

    /**
     * Optional non-select defaults that should bind for a usable starting state.
     *
     * @param {WorkflowStepType} stepType The step type to seed.
     * @returns {Record<string, unknown>} The explicit defaults.
     */
    private static explicitDefaults(stepType: WorkflowStepType): Record<string, unknown> {
        switch (stepType) {
        case 'ScheduledTrigger':
            // Applied only when Recurring is selected (visibleWhen + multipass / applyMissingDefaults).
            // maxOccurrences defaults to 5 so recurring runs don't loop without a stop bound.
            return { interval: 1, maxOccurrences: 5 };
        case 'Delay':
            // Fixed + duration + Seconds so simulation pauses by default (FR delay wait).
            return {
                delayType: 'Fixed',
                duration: 5,
                timeUnit: 'Seconds',
                dynamicDuration: 5,
                dynamicTimeUnit: 'Seconds',
                dynamicConditionLogic: 'AND'
            };
        case 'Loop':
            return { maxIterations: 10 };
        case 'FormInputTrigger':
            return { fields: [] };
        case 'SetVariable':
            // Seed one assignment so the property panel is immediately usable.
            return {
                variables: [{ variableName: 'status', value: 'New', isMathOperation: false }]
            };
        case 'Filter':
        case 'Condition':
            return { conditions: [] };
        case 'Switch':
            // One branch + default port path for no-match (Condition-like dual ports).
            return {
                defaultBranch: 'default',
                branches: StepEditorRegistry.defaultSwitchBranches()
            };
        case 'Approve':
            return { reviewers: [], requestFields: [] };
        case 'AI':
            // `memoryHistorySize` is conditionally visible (only when
            // `memoryEnabled` is true) so the seed only lands on the
            // step's props once the author opts in. The runtime memory
            // service already falls back to 10 when the property is
            // missing, but seeding it here makes the default visible in
            // the property-panel textbox from the moment memory is
            // enabled — instead of a blank field that only resolves at
            // simulation time.
            return { responseFields: [], memoryHistorySize: 10, timeoutSeconds: 30 };
        default:
            return {};
        }
    }

    private static fields(stepType: WorkflowStepType): EditorField[] {
        switch (stepType) {
        case 'ScheduledTrigger':
            return [
                { key: 'scheduleType', label: 'Schedule Type', type: 'select', options: ['Once', 'Recurring', 'Cron'] },
                {
                    key: 'startDateTime',
                    label: 'Start Date Time',
                    type: 'datetime',
                    visibleWhen: (props: Record<string, unknown>) => props.scheduleType === 'Once' || props.scheduleType === 'Recurring'
                },
                {
                    key: 'interval',
                    label: 'Interval',
                    type: 'number',
                    visibleWhen: (props: Record<string, unknown>) => props.scheduleType === 'Recurring'
                },
                {
                    key: 'intervalUnit',
                    label: 'Interval Unit',
                    type: 'select',
                    options: ['Minutes', 'Hours', 'Days', 'Weeks'],
                    visibleWhen: (props: Record<string, unknown>) => props.scheduleType === 'Recurring'
                },
                {
                    key: 'endDateTime',
                    label: 'End Date Time',
                    type: 'datetime',
                    visibleWhen: (props: Record<string, unknown>) => props.scheduleType === 'Recurring'
                },
                {
                    key: 'maxOccurrences',
                    label: 'Max Occurrences',
                    type: 'number',
                    visibleWhen: (props: Record<string, unknown>) => props.scheduleType === 'Recurring'
                },
                {
                    key: 'cronExpression',
                    label: 'Cron Expression',
                    type: 'text',
                    helpIcon: true,
                    helpText: 'helpScheduledTriggerCronExpression',
                    visibleWhen: (props: Record<string, unknown>) => props.scheduleType === 'Cron'
                },
                {
                    key: 'timeZone',
                    label: 'Time Zone',
                    type: 'text',
                    helpIcon: true,
                    helpText: 'helpScheduledTriggerTimeZone'
                }
            ];
        case 'WebhookTrigger':
            return [
                { key: 'method', label: 'HTTP Method', type: 'select', options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
                { key: 'path', label: 'Path', type: 'text', helpIcon: true, helpText: 'helpWebhookTriggerPath' },
                { key: 'authMode', label: 'Authentication', type: 'select', options: ['None', 'Basic', 'ApiKeyHeader', 'Bearer', 'HmacSha256', 'Custom'] },
                {
                    key: 'authRef',
                    label: 'Credential Reference',
                    type: 'text',
                    visibleWhen: (props: Record<string, unknown>) => !!props.authMode && props.authMode !== 'None',
                    helpText: 'helpWebhookTriggerAuthRef'
                },
                {
                    key: 'authHeaderName',
                    label: 'API Key Header Name',
                    type: 'text',
                    visibleWhen: (props: Record<string, unknown>) => props.authMode === 'ApiKeyHeader',
                    helpText: 'helpWebhookTriggerAuthHeaderName'
                },
                {
                    key: 'authSignatureHeaderName',
                    label: 'Signature Header Name',
                    type: 'text',
                    visibleWhen: (props: Record<string, unknown>) => props.authMode === 'HmacSha256',
                    helpText: 'helpWebhookTriggerAuthSignatureHeaderName'
                },
                { key: 'payloadSchema', label: 'Payload Schema', type: 'formFields', helpText: 'helpWebhookTriggerPayloadSchema' },
                { key: 'responseMode', label: 'Response Mode', type: 'select', options: ['Immediate'], helpText: 'helpWebhookTriggerResponseMode' },
                { key: 'responseCode', label: 'Response Code', type: 'number', helpIcon: true, helpText: 'helpWebhookTriggerResponseCode' },
                { key: 'responseBody', label: 'Response Body', type: 'json', helpText: 'helpWebhookTriggerResponseBody' }
            ];
        case 'FormInputTrigger':
            return [
                { key: 'formTitle', label: 'Form Title', type: 'text' },
                { key: 'fields', label: 'Fields', type: 'formFields' }
            ];
        case 'SetVariable':
            return [{
                key: 'variables',
                label: 'Variables',
                type: 'setVariables',
                expression: true,
                hideFieldLabel: true,
                helpText: 'helpSetVariableVariables'
            }];
        case 'Filter':
            return [
                { key: 'itemsPath', label: 'Items Path', type: 'text', expression: true },
                { key: 'conditionLogic', label: 'Logic', type: 'select', options: ['AND', 'OR'] },
                { key: 'conditions', label: 'Conditions', type: 'conditionRules', expression: true }
            ];
        case 'Sort':
            return [
                { key: 'itemsPath', label: 'Items Path', type: 'text', expression: true },
                { key: 'sortBy', label: 'Sort By', type: 'text', expression: true },
                { key: 'sortDirection', label: 'Direction', type: 'select', options: ['Ascending', 'Descending'] }
            ];
        case 'ApiRequest':
            return [
                { key: 'method', label: 'Method', type: 'select', options: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
                { key: 'url', label: 'URL', type: 'text', expression: true },
                { key: 'authRef', label: 'Auth Reference', type: 'text' },
                { key: 'queryParams', label: 'Query Parameters', type: 'queryParameters', expression: true },
                {
                    key: 'bodyType',
                    label: 'Body Type',
                    type: 'select',
                    options: ['Json', 'Text', 'Expression'],
                    // GET/DELETE must not configure a request body.
                    visibleWhen: (props: Record<string, unknown>) => props.method !== 'GET' && props.method !== 'DELETE'
                },
                {
                    key: 'body',
                    label: 'Body',
                    type: 'textarea',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.method !== 'GET' && props.method !== 'DELETE'
                }
            ];
        case 'Delay':
            return [
                { key: 'delayType', label: 'Delay Type', type: 'select', options: ['Fixed', 'Until', 'Dynamic'] },
                {
                    key: 'duration',
                    label: 'Duration',
                    type: 'number',
                    visibleWhen: (props: Record<string, unknown>) => props.delayType === 'Fixed'
                },
                {
                    key: 'timeUnit',
                    label: 'Time Unit',
                    type: 'select',
                    options: ['Seconds', 'Minutes', 'Hours', 'Days'],
                    visibleWhen: (props: Record<string, unknown>) => props.delayType === 'Fixed'
                },
                {
                    key: 'dynamicConditionLogic',
                    label: 'Logic',
                    type: 'select',
                    options: ['AND', 'OR'],
                    visibleWhen: (props: Record<string, unknown>) => props.delayType === 'Dynamic'
                },
                {
                    key: 'dynamicCondition',
                    label: 'Condition',
                    type: 'conditionRules',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.delayType === 'Dynamic'
                },
                {
                    key: 'dynamicDuration',
                    label: 'Duration',
                    type: 'number',
                    visibleWhen: (props: Record<string, unknown>) => props.delayType === 'Dynamic'
                },
                {
                    key: 'dynamicTimeUnit',
                    label: 'Time Unit',
                    type: 'select',
                    options: ['Seconds', 'Minutes', 'Hours', 'Days'],
                    visibleWhen: (props: Record<string, unknown>) => props.delayType === 'Dynamic'
                },
                {
                    key: 'untilDateTime',
                    label: 'Until',
                    type: 'datetime',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.delayType === 'Until'
                },
                {
                    key: 'timeZone',
                    label: 'Time Zone',
                    type: 'text',
                    visibleWhen: (props: Record<string, unknown>) => props.delayType === 'Until'
                }
            ];
        case 'Condition':
            return [
                { key: 'conditionLogic', label: 'Logic', type: 'select', options: ['AND', 'OR'] },
                { key: 'conditions', label: 'Conditions', type: 'conditionRules', expression: true }
            ];
        case 'Switch':
            return [
                // `defaultBranch` is a hard-wired internal port name used by the
                // port-resolver and dispatcher (always falls through to `default`
                // on no-match). It is intentionally NOT exposed in the property
                // panel — there is no user-facing setting for it.
                { key: 'branches', label: 'Branches', type: 'switchBranches', expression: true }
            ];
        case 'Loop':
            return [
                { key: 'itemsPath', label: 'Items Path', type: 'text', expression: true },
                { key: 'maxIterations', label: 'Max Iterations', type: 'number' }
            ];
        case 'Approve':
            return [
                { key: 'requestMessage', label: 'Request Message', type: 'textarea', expression: true },
                { key: 'requestFields', label: 'Request Details', type: 'requestFields', expression: true, hideFieldLabel: true },
                { key: 'reviewers', label: 'Reviewers', type: 'reviewers', expression: true, hideFieldLabel: true }
            ];
        case 'Notify':
            return [
                { key: 'channel', label: 'Channel', type: 'select', options: ['Email', 'SMS', 'Push', 'Teams', 'Slack', 'Webhook', 'Custom'] },
                { key: 'message', label: 'Message', type: 'textarea', expression: true },
                {
                    key: 'to',
                    label: 'To',
                    type: 'text',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.channel === 'Email'
                },
                {
                    key: 'cc',
                    label: 'CC',
                    type: 'text',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.channel === 'Email'
                },
                {
                    key: 'subject',
                    label: 'Subject',
                    type: 'text',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => ['Email', 'Teams', 'Slack', 'Push', 'Custom'].indexOf(props.channel as string) !== -1
                },
                {
                    key: 'phoneNumber',
                    label: 'Phone Number',
                    type: 'text',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.channel === 'SMS'
                },
                {
                    key: 'channelId',
                    label: 'Channel ID',
                    type: 'text',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.channel === 'Teams' || props.channel === 'Slack'
                },
                {
                    key: 'deviceToken',
                    label: 'Device Token',
                    type: 'text',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.channel === 'Push'
                },
                {
                    key: 'userId',
                    label: 'User ID',
                    type: 'text',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.channel === 'Push'
                },
                {
                    key: 'mentionUsers',
                    label: 'Mention Users',
                    type: 'text',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.channel === 'Teams' || props.channel === 'Slack'
                },
                {
                    key: 'webhookUrl',
                    label: 'Webhook URL',
                    type: 'text',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.channel === 'Webhook'
                },
                {
                    key: 'method',
                    label: 'Method',
                    type: 'select',
                    options: ['POST', 'PUT'],
                    visibleWhen: (props: Record<string, unknown>) => props.channel === 'Webhook'
                },
                {
                    key: 'headers',
                    label: 'Headers',
                    type: 'queryParameters',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.channel === 'Webhook'
                },
                {
                    key: 'body',
                    label: 'Body',
                    type: 'textarea',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.channel === 'Webhook'
                },
                {
                    key: 'target',
                    label: 'Target',
                    type: 'text',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.channel === 'Custom'
                }
            ];
        case 'AI':
            return [
                { key: 'serverUrl', label: 'Server URL', type: 'text', expression: true,
                    helpIcon: true, credentialMode: 'Reference',
                    helpText: 'helpAIServerUrl'
                },
                { key: 'provider', label: 'Provider', type: 'select', options: ['Gemini', 'OpenAI', 'Claude'],
                    credentialMode: 'Inline' },
                { key: 'model', label: 'Model', type: 'text', credentialMode: 'Inline' },
                {
                    key: 'apiKey',
                    label: 'API Key',
                    type: 'credentialLink',
                    credentialMode: 'Inline',
                    helpText: 'helpAIApiKey'
                },
                {
                    key: 'memoryEnabled',
                    label: 'Conversation Memory',
                    type: 'checkbox',
                    helpText: 'helpAIMemoryEnabled'
                },
                {
                    key: 'memoryHistorySize',
                    label: 'Memory History Size',
                    type: 'number',
                    visibleWhen: (props: Record<string, unknown>) => props.memoryEnabled === true,
                    helpIcon: true,
                    helpText: 'helpAIContextWindowLength'
                },
                { key: 'systemPrompt', label: 'System Prompt', type: 'textarea', expression: true },
                { key: 'prompt', label: 'Prompt', type: 'textarea', expression: true },
                { key: 'outputFormat', label: 'Output Format', type: 'select', options: ['Text', 'JSON', 'Markdown'] },
                { key: 'timeoutSeconds', label: 'Timeout (seconds)', type: 'number' },
                {
                    key: 'responseFields',
                    label: 'Desired Response Fields',
                    type: 'responseFields',
                    helpIcon: true,
                    helpText: 'helpAIResponseFields'
                }
            ];
        case 'Formatter':
            return [
                { key: 'inputSource', label: 'Input Source', type: 'select', options: ['PreviousStep', 'ContextPath'] },
                {
                    key: 'sourcePath',
                    label: 'Source Path',
                    type: 'text',
                    expression: true,
                    visibleWhen: (props: Record<string, unknown>) => props.inputSource === 'ContextPath'
                },
                { key: 'format', label: 'Format', type: 'select', options: ['Text', 'JSON', 'Markdown', 'Table'] }
            ];
        case 'Custom':
            return [
                { key: 'actionType', label: 'Action Type', type: 'text' },
                { key: 'input', label: 'Input JSON', type: 'json', expression: true }
            ];
        case 'End':
            return [{ key: 'endMessage', label: 'End Message', type: 'text', expression: true }];
        default:
            return [];
        }
    }
}
