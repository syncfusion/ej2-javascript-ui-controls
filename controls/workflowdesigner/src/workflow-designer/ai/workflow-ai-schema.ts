import { WorkflowStepType } from '../models/workflow-enums';

/**
 * @private
 */
export interface WorkflowAISchema {
    schemaVersion: string;
    workflow: Record<string, unknown>;
    steps: Record<string, unknown>;
    connections: Record<string, unknown>;
    rules: string[];
}

const conditionRule: Record<string, unknown> = {
    type: 'object',
    required: ['valueType', 'operator'],
    properties: {
        field: { type: 'string', expression: true },
        valueType: { enum: ['String', 'Array', 'Number', 'Date', 'Boolean'] },
        operator: { enum: ['Equal', 'NotEqual', 'Contains', 'NotContains', 'StartsWith', 'EndsWith', 'GreaterThan', 'LessThan', 'GreaterThanOrEqual', 'LessThanOrEqual', 'IsEmpty', 'IsNotEmpty', 'In', 'NotIn'] },
        value: { type: ['string', 'number', 'boolean', 'array', 'null'], expression: true }
    }
};

const keyValue: Record<string, unknown> = {
    type: 'object', required: ['key', 'value'],
    properties: { key: { type: 'string' }, value: { type: 'string', expression: true } }
};

/**
 * Form Input field (FormInputTrigger `props.fields` entries). Mirrors
 * `WorkflowInputFieldModel`: `name` and `type` are required by the
 * validator (`FORM_FIELD_NAME` / `FORM_FIELD_TYPE`), DropDown-like
 * types additionally require non-empty `options` (`FORM_FIELD_OPTIONS`).
 * @private
 */
const formInputField: Record<string, unknown> = {
    type: 'object', required: ['name', 'type'],
    properties: {
        name: { type: 'string' },
        type: { enum: ['TextBox', 'TextArea', 'Number', 'Date', 'Password', 'Email', 'DropDown', 'CheckBoxes', 'RadioButton'] },
        label: { type: 'string' },
        placeholder: { type: 'string' },
        required: { type: 'boolean' },
        options: { type: 'array', items: { type: 'string' }, requiredWhen: { type: ['DropDown', 'CheckBoxes', 'RadioButton'] } },
        defaultValue: { type: ['string', 'number', 'boolean'] }
    }
};

/**
 * Approval request detail (Approve `props.requestFields` entries).
 * Mirrors `ApprovalRequestField` — the validator rejects Approve steps
 * with an empty `requestFields` array (`APPROVE_REQUEST_FIELDS`).
 * @private
 */
const approvalRequestField: Record<string, unknown> = {
    type: 'object', required: ['label', 'value'],
    properties: {
        label: { type: 'string' },
        value: { type: 'string', expression: true }
    }
};

/**
 * Reviewer reference (Approve `props.reviewers` entries).
 * @private
 */
const reviewerRef: Record<string, unknown> = {
    type: 'object', required: ['type', 'value'],
    properties: {
        type: { enum: ['User', 'Role', 'Group', 'Email'] },
        value: { type: 'string', expression: true }
    }
};

/**
 * Step output field (Loop `itemFields`, AI `responseFields` entries).
 * Mirrors `WorkflowOutputFieldModel`.
 * @private
 */
const outputField: Record<string, unknown> = {
    type: 'object', required: ['name', 'type'],
    properties: {
        name: { type: 'string' },
        label: { type: 'string' },
        type: { enum: ['String', 'Number', 'Boolean', 'Array', 'Object', 'Json'] },
        description: { type: 'string' }
    }
};

function step(properties: Record<string, unknown>, required: string[], outputs: string[] = ['output']): Record<string, unknown> {
    return {
        required,
        properties,
        ports: { input: ['input'], outputs },
        commonFields: ['id', 'stepType', 'name', 'props', 'customStepId', 'customProps', 'position', 'size', 'appearance', 'errorHandling']
    };
}

/**
 * @private
 *
 * @returns {WorkflowAISchema} Workflow AI Schema.
 */
export function createWorkflowAISchema(): WorkflowAISchema {
    const steps: Record<string, unknown> = {
        ManualTrigger: { required: [], properties: {}, ports: { input: [], outputs: ['output'] } },
        ScheduledTrigger: {
            required: ['scheduleType'],
            properties: {
                scheduleType: { enum: ['Once', 'Recurring', 'Cron'] },
                startDateTime: { type: 'date-time', requiredWhen: { scheduleType: ['Once', 'Recurring'] } },
                interval: { type: 'number', minimum: 1, requiredWhen: { scheduleType: 'Recurring' } },
                intervalUnit: { enum: ['Minutes', 'Hours', 'Days', 'Weeks', 'Months'], requiredWhen: { scheduleType: 'Recurring' } },
                endDateTime: { type: 'date-time', optionalWhen: { scheduleType: 'Recurring' } },
                maxOccurrences: { type: 'number', minimum: 1, optionalWhen: { scheduleType: 'Recurring' } },
                cronExpression: { type: 'string', requiredWhen: { scheduleType: 'Cron' } }
            },
            ports: { input: [], outputs: ['output'] }
        },
        WebhookTrigger: {
            required: ['method', 'path'],
            properties: {
                method: { enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] },
                path: { type: 'string' },
                authMode: { enum: ['None', 'Basic', 'ApiKeyHeader', 'Bearer', 'HmacSha256', 'Custom'] },
                authRef: { type: 'string' },
                authHeaderName: { type: 'string' },
                authSignatureHeaderName: { type: 'string' },
                responseMode: { enum: ['Immediate'] },
                responseCode: { type: 'number' },
                responseBody: { type: 'string', expression: true },
                payloadSchema: { type: 'array', items: formInputField  }
            },
            ports: { input: [], outputs: ['output'] }
        },
        FormInputTrigger: {
            required: ['fields'], properties: { formTitle: { type: 'string' }, fields: { type: 'array', items: formInputField, minItems: 1 } },
            ports: { input: [], outputs: ['output'] }
        },
        SetVariable: step({ variables: { type: 'array', items: { type: 'object', required: ['variableName'], properties: { variableName: { type: 'string' }, value: { type: 'string', expression: true }, isMathOperation: { type: 'boolean' }, firstValue: { type: 'string', expression: true }, secondValue: { type: 'string', expression: true }, operator: { enum: ['Add', 'Subtract', 'Multiply', 'Divide', 'Modulo', 'Power'] } } } } }, ['variables']),
        Filter: step({ itemsPath: { type: 'string', expression: true }, conditionLogic: { enum: ['AND', 'OR'] }, conditions: { type: 'array', items: conditionRule } }, ['itemsPath', 'conditions']),
        Sort: step({ itemsPath: { type: 'string', expression: true }, sortBy: { type: 'string', expression: true }, sortDirection: { enum: ['Ascending', 'Descending'] } }, ['itemsPath', 'sortBy', 'sortDirection']),
        ApiRequest: step({ method: { enum: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] }, url: { type: 'string', expression: true }, headers: { type: 'array', items: keyValue }, queryParams: { type: 'array', items: keyValue }, bodyType: { enum: ['None', 'JSON', 'FormData', 'Text'] }, body: { type: ['string', 'object'], expression: true, requiredWhen: { bodyType: ['JSON', 'FormData', 'Text'] } }, authRef: { type: 'string' } }, ['method', 'url']),
        Delay: step({ delayType: { enum: ['Fixed', 'Until', 'Dynamic'] }, duration: { type: 'number', minimum: 0, requiredWhen: { delayType: 'Fixed' } }, timeUnit: { enum: ['Seconds', 'Minutes', 'Hours', 'Days'], requiredWhen: { delayType: 'Fixed' } }, untilDateTime: { type: 'date-time', requiredWhen: { delayType: 'Until' } }, dynamicCondition: { type: 'array', items: conditionRule, requiredWhen: { delayType: 'Dynamic' } }, dynamicConditionLogic: { enum: ['AND', 'OR'] }, dynamicDuration: { type: 'number', minimum: 0 }, dynamicTimeUnit: { enum: ['Seconds', 'Minutes', 'Hours', 'Days'] } }, ['delayType']),
        Condition: step({ conditionLogic: { enum: ['AND', 'OR'] }, conditions: { type: 'array', items: conditionRule } }, ['conditions'], ['true', 'false']),
        Switch: step({ branches: { type: 'array', items: { type: 'object', required: ['branchName', 'condition'], properties: { branchName: { type: 'string' }, condition: conditionRule } } }, defaultBranch: { type: 'string', default: 'default' } }, ['branches'], ['<each branches[].branchName>', '<defaultBranch>']),
        Loop: step({ itemsPath: { type: 'string', expression: true }, itemFields: { type: 'array', outputField }, maxIterations: { type: 'number', minimum: 1, default: 10 } }, ['itemsPath'], ['loop', 'done']),
        Approve: step({ reviewers: { type: 'array', items: reviewerRef, minItems: 1 }, requestMessage: { type: 'string', expression: true }, requestFields: { type: 'array', items: approvalRequestField, minItems: 1 } }, ['reviewers', 'requestMessage', 'requestFields'], ['approved', 'declined']),
        Notify: step({ channel: { enum: ['Email', 'SMS', 'Push', 'Teams', 'Slack', 'Webhook', 'Custom'] }, message: { type: 'string', expression: true }, to: { type: 'string', requiredWhen: { channel: 'Email' } }, cc: { type: 'string' }, phoneNumber: { type: 'string', requiredWhen: { channel: 'SMS' } }, deviceToken: { type: 'string', requiredWhen: { channel: 'Push' } }, userId: { type: 'string' }, channelId: { type: 'string', requiredWhen: { channel: ['Teams', 'Slack'] } }, mentionUsers: { type: 'array' }, webhookUrl: { type: 'string', requiredWhen: { channel: 'Webhook' } }, method: { enum: ['POST', 'PUT', 'PATCH'] }, headers: { type: 'array', items: keyValue }, body: { type: ['string', 'object'] }, target: { type: 'string', requiredWhen: { channel: 'Custom' } }, subject: { type: 'string' } }, ['channel', 'message']),
        AI: step({ provider: { enum: ['Gemini', 'OpenAI', 'Claude'] }, model: { type: 'string' }, credentialRef: { type: 'string', secret: true }, systemPrompt: { type: 'string' }, prompt: { type: 'string', expression: true }, outputFormat: { enum: ['Text', 'JSON', 'Markdown'] }, timeoutSeconds: { type: 'number', minimum: 1, default: 30 }, responseFields: { type: 'array', items: outputField }, serverUrl: { type: 'string', expression: true } }, ['prompt', 'outputFormat']),
        Formatter: step({ inputSource: { enum: ['PreviousStep', 'Path', 'Expression'] }, sourcePath: { type: 'string', expression: true }, format: { enum: ['Text', 'JSON', 'Markdown', 'Table'] } }, ['inputSource', 'format']),
        Custom: step({ actionType: { type: 'string' }, input: { type: ['string', 'object'], expression: true } }, ['actionType']),
        End: { required: [], properties: {}, ports: { input: ['input'], outputs: [] } }
    };

    const allowedStepTypes: WorkflowStepType[] = Object.keys(steps) as WorkflowStepType[];
    return {
        schemaVersion: '1.1',
        workflow: {
            type: 'object', required: ['schemaVersion', 'name', 'workflowSteps', 'workflowConnections', 'stickyNotes'],
            properties: { schemaVersion: { const: '1.1' }, name: { type: 'string' }, workflowSteps: { type: 'array', allowedStepTypes }, workflowConnections: { type: 'array' }, stickyNotes: { type: 'array' } }
        },
        steps,
        connections: {
            required: ['id', 'sourceStepId', 'targetStepId', 'sourcePort', 'targetPort'],
            defaults: { label: '', type: 'Orthogonal', sourceDecorator: 'None', targetDecorator: 'Arrow', style: { strokeColor: '', strokeWidth: 1, strokeDashArray: '' } },
            rules: ['targetPort is always input', 'sourcePort must be declared by source step', 'triggers cannot have incoming connections', 'End cannot have outgoing connections']
        },
        rules: [
            'Use unique non-empty step and connection ids.',
            'Include position {x,y} for every step.',
            'Use only documented props and exact case-sensitive enum values.',
            'Do not include undefined values or secrets.',
            'Return a complete workflow object, never markdown or commentary.',
            'AI steps need provider and model when executionSettings.credentialMode is Inline, and serverUrl when it is Reference. Do not set a mode prop.',
            'Plain-text AI output means outputFormat "Text". Do not add responseFields unless the user asked for structured JSON fields — responseFields forces JSON output.',
            'AI credentialRef must be an empty string unless the user explicitly supplied a workflow credential. Never copy the AI Assist credential into step props.',
            'FormInputTrigger fields: every field needs a non-empty unique name and an exact type enum (TextBox, TextArea, Number, Date, Password, Email, DropDown, CheckBoxes, RadioButton); DropDown, CheckBoxes, and RadioButton fields also need a non-empty options array.',
            'Approve steps must include a non-empty reviewers array ({type: User|Role|Group|Email, value}), a non-empty requestMessage, and a non-empty requestFields array ({label, value}) — infer sensible values from the workflow description when the user did not specify them.',
            'Never emit two connections with the same (sourceStepId, sourcePort); parallel branches must use distinct output ports of a multi-output step, and single-output steps may not fan out to multiple targets.'
        ]
    };
}
