import { WorkflowConnection } from '../models/workflow-connection';
import { WorkflowConnectionStyle } from '../models/workflow-style';
import { CURRENT_WORKFLOW_SCHEMA_VERSION, WorkflowDefinitionModel } from '../models/workflow-definition';
import { WorkflowSchemaVersion } from '../models/workflow-enums';
import { WorkflowPosition } from '../models/workflow-position';
import { WorkflowRetryPolicy, WorkflowStepErrorHandling } from '../models/workflow-error-handling';
import { WorkflowSize } from '../models/workflow-size';
import { WorkflowStepAppearance, WorkflowStepStateAppearance } from '../models/workflow-appearance';
import { WorkflowStep } from '../models/workflow-step';
import { WorkflowStickyNote } from '../models/workflow-sticky-note';
import { WorkflowStickyNoteStyle } from '../models/workflow-style';
import { IdRegistry } from './id-registry';
import { WorkflowImportError } from './errors';
import { LocaleContext } from '../localization/locale-context';
import { SchemaMigrator } from '../schema/schema-migrator';

const MAX_WORKFLOW_JSON_CHARS: number = 5 * 1024 * 1024;

/* Secret export policy: see sanitizeSecretsForExport. */

interface WorkflowSerializationSource {
    workflowSteps: WorkflowStep[];
    workflowConnections: WorkflowConnection[];
    stickyNotes?: WorkflowStickyNote[];
    id?: string;
    name?: string;
    /**
     * `Reference` (default): `credentialRef` is a name resolved by the host and is exported.
     * `Inline`: `credentialRef` holds a raw key and is stripped.
     */
    credentialMode?: 'Reference' | 'Inline';
}

type JsonPrimitive = string | number | boolean | null;

interface JsonObject {
    [key: string]: JsonValue;
}

interface JsonArray extends Array<JsonValue> {
    [index: number]: JsonValue;
}

type JsonValue = JsonPrimitive | JsonObject | JsonArray;

/**
 * Serializes and validates JSON-safe Workflow Designer definitions.
 *
 * @private
 */
export class WorkflowJsonSerializer {
    private static importError(key: string, fallback: string, code: string): WorkflowImportError {
        return new WorkflowImportError(LocaleContext.text(key, fallback), [], code);
    }

    private credentialMode: 'Reference' | 'Inline' = 'Reference';

    /**
     * Creates a persistence definition from the public workflow collections.
     *
     * @param {WorkflowSerializationSource} model The public workflow collections, id and name.
     * @returns {WorkflowDefinitionModel} An explicitly projected JSON-safe workflow definition.
     * @private
     */
    public serialize(model: WorkflowSerializationSource): WorkflowDefinitionModel {
        this.credentialMode = model.credentialMode === 'Inline' ? 'Inline' : 'Reference';
        const definition: WorkflowDefinitionModel = {
            schemaVersion: CURRENT_WORKFLOW_SCHEMA_VERSION,
            workflowSteps: model.workflowSteps.map((step: WorkflowStep) => this.serializeStep(step)),
            workflowConnections: model.workflowConnections.map(
                (connection: WorkflowConnection) => this.serializeConnection(connection)
            ),
            stickyNotes: (model.stickyNotes || []).map(
                (stickyNote: WorkflowStickyNote) => this.serializeStickyNote(stickyNote)
            )
        };

        if (typeof model.id === 'string') {
            definition.id = model.id;
        }
        if (typeof model.name === 'string') {
            definition.name = model.name;
        }
        return definition;
    }

    /**
     * Parses, validates and normalizes a complete workflow definition.
     *
     * @param {WorkflowDefinitionModel|string} input A workflow definition object or JSON string.
     * @returns {WorkflowDefinitionModel} A validated JSON-safe workflow definition.
     * @throws WorkflowImportError when the input is malformed, unsupported or duplicated.
     * @private
     */
    public deserialize(input: WorkflowDefinitionModel | string): WorkflowDefinitionModel {
        const value: unknown = typeof input === 'string' ? this.parseJson(input) : input;
        const definition: Record<string, unknown> = this.requireObject(value, 'Workflow definition must be an object.');

        const version: unknown = definition.schemaVersion || definition.version;
        if (version !== '1.0' && version !== '1.1') {
            throw new WorkflowImportError(LocaleContext.text('errorImportVersion'), [], 'IMPORT_UNSUPPORTED_VERSION');
        }
        const workflowSteps: unknown[] = this.requireArray(definition.workflowSteps, 'workflowSteps must be an array.');
        const workflowConnections: unknown[] = this.requireArray(
            definition.workflowConnections,
            'workflowConnections must be an array.'
        );
        const stickyNotes: unknown[] = definition.stickyNotes === undefined
            ? []
            : this.requireArray(definition.stickyNotes, 'stickyNotes must be an array.');
        const registry: IdRegistry = new IdRegistry();

        const normalizedSteps: WorkflowStep[] = workflowSteps.map((step: unknown) => {
            const record: Record<string, unknown> = this.requireObject(step, 'Each workflow step must be an object.');
            this.registerId(record.id, registry);
            return this.normalizeStep(record);
        });
        const normalizedConnections: WorkflowConnection[] = workflowConnections.map((connection: unknown) => {
            const record: Record<string, unknown> = this.requireObject(
                connection,
                'Each workflow connection must be an object.'
            );
            this.registerId(record.id, registry);
            return this.normalizeConnection(record);
        });
        const normalizedStickyNotes: WorkflowStickyNote[] = stickyNotes.map((stickyNote: unknown) => {
            const record: Record<string, unknown> = this.requireObject(
                stickyNote,
                'Each sticky note must be an object.'
            );
            this.registerId(record.id, registry);
            return this.normalizeStickyNote(record);
        });

        const normalized: WorkflowDefinitionModel = {
            schemaVersion: version as WorkflowSchemaVersion,
            workflowSteps: normalizedSteps,
            workflowConnections: normalizedConnections,
            stickyNotes: normalizedStickyNotes
        };
        if (typeof definition.id === 'string') {
            normalized.id = definition.id;
        }
        if (typeof definition.name === 'string') {
            normalized.name = definition.name;
        }
        return SchemaMigrator.migrate(normalized);
    }

    private serializeStep(step: WorkflowStep): WorkflowStep {
        const result: WorkflowStep = {
            id: step.id,
            stepType: step.stepType,
            name: step.name,
            // Strip empty values from props so a workflow that the author has
            // not yet configured round-trips through export -> import without
            // tripping per-field "is required" validators (e.g. an Approve step
            // inserted via the palette lands with `reviewers: []` and
            // `requestFields: []`; persisting them verbatim would make a
            // re-import fail APPROVE_REVIEWERS / APPROVE_REQUEST_FIELDS even
            // though nothing meaningful was authored). Treat "" / null /
            // empty-array / empty-object as "not configured" and drop the key
            // so the validated read path skips the rule entirely. User-set
            // non-empty values (e.g. `{ reviewers: [{type:'Role',...}] }`)
            // and structured empties with a non-empty leaf pass through.
            props: this.sanitizeSecretsForExport(
                step.stepType,
                this.serializeStepProps(step.props)
            ),
            customStepId: step.customStepId || undefined,
            customProps: this.serializeCustomProps(step.customProps),
            position: this.serializePosition(step.position),
            size: this.serializeSize(step.size),
            appearance: this.serializeAppearance(step.appearance),
            stateAppearance: this.serializeStateAppearance(step.stateAppearance),
            errorHandling: this.serializeErrorHandling(step.errorHandling)
        } as WorkflowStep;
        return result;
    }

    /**
     * Sanitizes a step props bag for persistence by recursively replacing /
     * dropping values that the validator treats as "not configured".
     *
     * Behavior:
     * - `undefined` / `null` keys: dropped (never written).
     * - Empty string `""`: replaced with `undefined` at the leaf only.
     * - Empty array `[]`: dropped entirely (array with only empties).
     * - Empty plain object `{}` after recursively stripping: dropped.
     *
     * @internal
     *
     * @param {Object} props The step properties to sanitize.
     * @returns {Object|undefined} The sanitized properties.
     */
    private serializeStepProps(props: unknown): Record<string, unknown> | undefined {
        const sanitized: unknown = this.stripEmpty(this.sanitizeJsonValue(props));
        return this.isRecord(sanitized) ? sanitized : undefined;
    }

    /**
     * Walks a serialized props bag and removes raw secret values before
     * they reach the persisted JSON.
     *
     * Rules per known secret field (`credential`, `credentialRef`):
     * - The credential now lives directly on the step as a raw string.
     *   The field is **deleted** so a raw key never reaches the persisted JSON.
     *
     * Steps that don't carry secrets (Set Variable, Filter, etc.) pass
     * through the helper unchanged.
     *
     * @param {string | undefined} stepType - The step type owning the props.
     * @param {Record<string, unknown> | undefined} props - Already-sanitized props.
     * @returns {Record<string, unknown> | undefined} Props with secrets stripped.
     */
    private sanitizeSecretsForExport(
        stepType: string | undefined,
        props: Record<string, unknown> | undefined
    ): Record<string, unknown> | undefined {
        if (!props) {
            return props;
        }
        const sanitized: Record<string, unknown> = { ...props };
        if (stepType === 'AI') {
            // `credential` and `apiKey` are always raw keys and are never exported.
            // `credentialRef` is a reference name; drafts saved before `apiKey`
            // existed kept the raw Inline key there, so it is still stripped in Inline mode.
            delete sanitized.credential;
            delete sanitized.apiKey;
            if (this.credentialMode === 'Inline') {
                delete sanitized.credentialRef;
            }
        }
        if ((stepType === 'ApiRequest' || stepType === 'Notify') && Array.isArray(sanitized.headers)) {
            sanitized.headers = (sanitized.headers as unknown[]).map((header: unknown) => {
                if (!header || typeof header !== 'object') {
                    return header;
                }
                const record: Record<string, unknown> = header as Record<string, unknown>;
                const name: string = String(record.key !== undefined ? record.key : record.name || '');
                return WorkflowJsonSerializer.isSensitiveHeader(name) ? { ...record, value: '' } : record;
            });
        }
        return sanitized;
    }

    /**
     * True for request headers that normally carry credentials.
     *
     * @param {string} name The header name.
     * @returns {boolean} Whether the value must not be exported.
     */
    private static isSensitiveHeader(name: string): boolean {
        const lower: string = name.trim().toLowerCase();
        return ['authorization', 'proxy-authorization', 'cookie', 'x-api-key', 'api-key', 'apikey', 'x-auth-token', 'x-goog-api-key']
            .indexOf(lower) !== -1 || /(secret|token|password)/.test(lower);
    }

    /**
     * Recursively removes empty values (null / undefined / "" / [] / {})
     * from a JSON-safe value tree. Object / array results are normalized in
     * place; primitive leaves are returned as-is.
     *
     * @param {Object} value The value to strip.
     * @returns {Object} The value with empty entries removed.
     */
    private stripEmpty(value: unknown): unknown {
        if (value === null || value === undefined) {
            return undefined;
        }
        if (typeof value === 'string') {
            // Treat empty strings as "not configured"; drop them so the
            // validator doesn't trip REQUIRED_PROP for blanks.
            return value === '' ? undefined : value;
        }
        // Booleans, numbers, and other primitives are kept verbatim — the
        // validator accepts `false` and `0` as valid configurations (e.g.
        // setVariable `isMathOperation: false`, delayDuration `0`).
        if (typeof value !== 'object') {
            return value;
        }
        if (Array.isArray(value)) {
            const cleaned: unknown[] = [];
            for (const item of value) {
                const next: unknown = this.stripEmpty(item);
                if (next !== undefined) {
                    cleaned.push(next);
                }
            }
            return cleaned;
        }
        const cleaned: { [key: string]: unknown } = {};
        let hasKey: boolean = false;
        for (const key of Object.keys(value)) {
            const next: unknown = this.stripEmpty((value as Record<string, unknown>)[`${key}`]);
            if (next !== undefined) {
                // Skip arrays that became `[]`, and objects that became `{}`.
                if (Array.isArray(next) && next.length === 0) {
                    continue;
                }
                if (this.isRecord(next) && Object.keys(next).length === 0) {
                    continue;
                }
                cleaned[`${key}`] = next;
                hasKey = true;
            }
        }
        return hasKey ? cleaned : undefined;
    }

    /**
     * Removes simulation-only data from persisted workflow definitions.
     *
     * @param {Object} value The custom properties to sanitize.
     * @returns {Record<string, unknown>} The sanitized custom properties.
     */
    private serializeCustomProps(value: unknown): Record<string, unknown> {
        const customProps: Record<string, unknown> = this.sanitizeObject(value);
        delete customProps.runtimeOutput;
        return customProps;
    }

    private serializeConnection(connection: WorkflowConnection): WorkflowConnection {
        return {
            id: connection.id,
            sourceStepId: connection.sourceStepId,
            targetStepId: connection.targetStepId,
            sourcePort: connection.sourcePort,
            targetPort: connection.targetPort,
            label: connection.label,
            type: connection.type,
            sourceDecorator: connection.sourceDecorator,
            targetDecorator: connection.targetDecorator,
            style: this.serializeConnectionStyle(connection.style),
            successStyle: this.serializeConnectionStyle(connection.successStyle)
        };
    }

    private serializeStickyNote(stickyNote: WorkflowStickyNote): WorkflowStickyNote {
        return {
            id: stickyNote.id,
            text: stickyNote.text,
            position: this.serializePosition(stickyNote.position),
            size: this.serializeSize(stickyNote.size),
            style: this.serializeStickyNoteStyle(stickyNote.style)
        };
    }

    private serializePosition(position: WorkflowPosition | undefined): WorkflowPosition | undefined {
        if (!position) {
            return undefined;
        }
        return { x: position.x, y: position.y };
    }

    private serializeSize(size: WorkflowSize | undefined): WorkflowSize | undefined {
        if (!size) {
            return undefined;
        }
        return { width: size.width, height: size.height };
    }

    private serializeAppearance(
        appearance: WorkflowStepAppearance | undefined
    ): WorkflowStepAppearance | undefined {
        if (!appearance) {
            return undefined;
        }
        return {
            iconCss: appearance.iconCss,
            strokeColor: appearance.strokeColor,
            strokeWidth: appearance.strokeWidth,
            fill: appearance.fill,
            textColor: appearance.textColor
        };
    }

    private serializeStateAppearance(
        value: WorkflowStepStateAppearance | undefined
    ): WorkflowStepStateAppearance | undefined {
        if (!value) {
            return undefined;
        }
        return {
            running: this.serializeAppearance(value.running),
            completed: this.serializeAppearance(value.completed),
            failed: this.serializeAppearance(value.failed)
        };
    }

    private serializeErrorHandling(
        errorHandling: WorkflowStepErrorHandling | undefined
    ): WorkflowStepErrorHandling | undefined {
        if (!errorHandling) {
            return undefined;
        }
        return {
            timeoutMs: errorHandling.timeoutMs,
            continueOnError: errorHandling.continueOnError,
            retryPolicy: this.serializeRetryPolicy(errorHandling.retryPolicy),
            errorPort: errorHandling.errorPort
        };
    }

    private serializeRetryPolicy(
        retryPolicy: WorkflowRetryPolicy | undefined
    ): WorkflowRetryPolicy | undefined {
        if (!retryPolicy) {
            return undefined;
        }
        return {
            enabled: retryPolicy.enabled,
            maxAttempts: retryPolicy.maxAttempts,
            delayMs: retryPolicy.delayMs
        };
    }

    private serializeStickyNoteStyle(
        style: WorkflowStickyNoteStyle | undefined
    ): WorkflowStickyNoteStyle | undefined {
        if (!style) {
            return undefined;
        }
        return {
            fill: style.fill,
            strokeWidth: style.strokeWidth,
            cornerRadius: style.cornerRadius,
            opacity: style.opacity,
            strokeDashArray: style.strokeDashArray
        };
    }

    private serializeConnectionStyle(
        style: WorkflowConnectionStyle | undefined
    ): WorkflowConnectionStyle | undefined {
        if (!style) {
            return undefined;
        }
        return {
            strokeColor: style.strokeColor,
            strokeWidth: style.strokeWidth,
            strokeDashArray: style.strokeDashArray
        };
    }

    private normalizeStep(record: Record<string, unknown>): WorkflowStep {
        const result: WorkflowStep = {
            id: this.readString(record.id),
            // `nodeName` is the name used before version 1 of the API.
            name: this.readString(record.name !== undefined ? record.name : record.nodeName),
            props: this.sanitizeJsonValue(record.props) as WorkflowStep['props'],
            customStepId: typeof record.customStepId === 'string' && record.customStepId ? record.customStepId : undefined,
            customProps: this.sanitizeObject(record.customProps),
            position: this.normalizePosition(record.position),
            size: this.normalizeSize(record.size),
            appearance: this.normalizeAppearance(record.appearance),
            stateAppearance: this.normalizeStateAppearance(record.stateAppearance),
            errorHandling: this.normalizeErrorHandling(record.errorHandling)
        };
        // Legacy files enabled the error port with `props.errorPort`; the single
        // source is now `errorHandling.errorPort`.
        const legacyProps: Record<string, unknown> | undefined = this.isRecord(result.props)
            ? result.props as Record<string, unknown> : undefined;
        if (legacyProps && 'errorPort' in legacyProps) {
            if (legacyProps.errorPort === true) {
                result.errorHandling = Object.assign({}, result.errorHandling, { errorPort: true });
            }
            delete legacyProps.errorPort;
        }
        if (legacyProps && 'contextWindowLength' in legacyProps) {
            // Legacy name of `memoryHistorySize`; the new name wins when both exist.
            if (legacyProps.memoryHistorySize === undefined) {
                legacyProps.memoryHistorySize = legacyProps.contextWindowLength;
            }
            delete legacyProps.contextWindowLength;
        }
        if (typeof record.stepType === 'string') {
            // Untyped JSON: the step type and its props are checked by the validator.
            (result as { stepType?: string }).stepType = record.stepType;
        }
        return result;
    }

    private normalizeConnection(record: Record<string, unknown>): WorkflowConnection {
        return {
            id: this.readString(record.id),
            sourceStepId: this.readString(record.sourceStepId),
            targetStepId: this.readString(record.targetStepId),
            sourcePort: this.readString(record.sourcePort),
            targetPort: this.readString(record.targetPort) || 'input',
            label: this.readString(record.label),
            type: record.type as WorkflowConnection['type'],
            sourceDecorator: record.sourceDecorator as WorkflowConnection['sourceDecorator'],
            targetDecorator: record.targetDecorator as WorkflowConnection['targetDecorator'],
            style: this.normalizeConnectionStyle(record.style),
            successStyle: this.normalizeConnectionStyle(record.successStyle)
        };
    }

    private normalizeStickyNote(record: Record<string, unknown>): WorkflowStickyNote {
        return {
            id: this.readString(record.id),
            text: this.readString(record.text),
            position: this.normalizePosition(record.position),
            size: this.normalizeSize(record.size),
            style: this.normalizeStickyNoteStyle(record.style)
        };
    }

    private normalizePosition(value: unknown): WorkflowPosition | undefined {
        if (!this.isRecord(value)) {
            return undefined;
        }
        return {
            x: typeof value.x === 'number' ? value.x : undefined,
            y: typeof value.y === 'number' ? value.y : undefined
        };
    }

    private normalizeSize(value: unknown): WorkflowSize | undefined {
        if (!this.isRecord(value)) {
            return undefined;
        }
        return {
            width: typeof value.width === 'number' ? value.width : undefined,
            height: typeof value.height === 'number' ? value.height : undefined
        };
    }

    private normalizeAppearance(value: unknown): WorkflowStepAppearance | undefined {
        if (!this.isRecord(value)) {
            return undefined;
        }
        return {
            iconCss: this.readString(value.iconCss),
            strokeColor: this.readString(value.strokeColor),
            strokeWidth: this.readNumber(value.strokeWidth),
            // `fillColor` is the name used before version 1 of the API.
            fill: this.readString(value.fill !== undefined ? value.fill : value.fillColor),
            textColor: this.readString(value.textColor)
        };
    }

    private normalizeStateAppearance(value: unknown): WorkflowStepStateAppearance | undefined {
        if (!this.isRecord(value)) {
            return undefined;
        }
        return {
            running: this.normalizeAppearance(value.running),
            completed: this.normalizeAppearance(value.completed),
            failed: this.normalizeAppearance(value.failed)
        };
    }

    private normalizeErrorHandling(value: unknown): WorkflowStepErrorHandling | undefined {
        if (!this.isRecord(value)) {
            return undefined;
        }
        return {
            timeoutMs: this.readNumber(value.timeoutMs),
            continueOnError: this.readBoolean(value.continueOnError),
            retryPolicy: this.normalizeRetryPolicy(value.retryPolicy),
            errorPort: this.readBoolean(value.errorPort)
        };
    }

    private normalizeRetryPolicy(value: unknown): WorkflowRetryPolicy | undefined {
        if (!this.isRecord(value)) {
            return undefined;
        }
        return {
            enabled: this.readBoolean(value.enabled),
            maxAttempts: this.readNumber(value.maxAttempts),
            delayMs: this.readNumber(value.delayMs)
        };
    }

    private normalizeStickyNoteStyle(value: unknown): WorkflowStickyNoteStyle | undefined {
        if (!this.isRecord(value)) {
            return undefined;
        }
        return {
            fill: this.readString(value.fill),
            strokeWidth: this.readNumber(value.strokeWidth),
            cornerRadius: this.readNumber(value.cornerRadius),
            opacity: this.readNumber(value.opacity),
            strokeDashArray: this.readString(value.strokeDashArray)
        };
    }

    private normalizeConnectionStyle(value: unknown): WorkflowConnectionStyle | undefined {
        if (!this.isRecord(value)) {
            return undefined;
        }
        return {
            strokeColor: this.readString(value.strokeColor),
            strokeWidth: this.readNumber(value.strokeWidth),
            strokeDashArray: this.readString(value.strokeDashArray)
        };
    }

    private parseJson(input: string): unknown {
        if (input.length > MAX_WORKFLOW_JSON_CHARS) {
            throw WorkflowJsonSerializer.importError('errorImportTooLarge', 'Workflow JSON exceeds the maximum size of 5 MB.', 'IMPORT_TOO_LARGE');
        }
        try {
            return JSON.parse(input) as unknown;
        } catch (error) {
            throw WorkflowJsonSerializer.importError('errorImportInvalidJson', 'Workflow JSON is not valid JSON.', 'IMPORT_INVALID_JSON');
        }
    }

    private requireObject(value: unknown, message: string): Record<string, unknown> {
        if (!this.isRecord(value)) {
            throw new WorkflowImportError(message);
        }
        return value;
    }

    private requireArray(value: unknown, message: string): unknown[] {
        if (!Array.isArray(value)) {
            throw new WorkflowImportError(message);
        }
        return value;
    }

    private registerId(value: unknown, registry: IdRegistry): void {
        if (typeof value !== 'string' || !registry.register(value)) {
            throw WorkflowJsonSerializer.importError('errorImportIds', 'Workflow item IDs must be non-empty and unique.', 'IMPORT_IDS');
        }
    }

    private sanitizeObject(value: unknown): Record<string, unknown> {
        const sanitized: unknown = this.sanitizeJsonValue(value);
        return this.isRecord(sanitized) ? sanitized : {};
    }

    private sanitizeJsonValue(value: unknown): unknown {
        if (value === null || typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return value as JsonValue;
        }
        if (typeof value === 'function' || this.isDomValue(value)) {
            return undefined;
        }
        if (Array.isArray(value)) {
            return value
                .map((item: unknown) => this.sanitizeJsonValue(item))
                .filter((item: unknown): item is JsonValue => item !== undefined);
        }
        if (this.isRecord(value)) {
            const result: { [key: string]: JsonValue } = {};
            Object.keys(value).forEach((key: string) => {
                const item: unknown = this.sanitizeJsonValue(value[`${key}`]);
                if (item !== undefined) {
                    result[`${key}`] = item as JsonValue;
                }
            });
            return result;
        }
        return undefined;
    }

    private isDomValue(value: unknown): boolean {
        return Boolean(
            (typeof HTMLElement !== 'undefined' && value instanceof HTMLElement) ||
            (typeof SVGElement !== 'undefined' && value instanceof SVGElement)
        );
    }

    private isRecord(value: unknown): value is Record<string, unknown> {
        if (value === null || typeof value !== 'object' || Array.isArray(value) || this.isDomValue(value)) {
            return false;
        }
        const prototype: object | null = Object.getPrototypeOf(value) as object | null;
        return prototype === Object.prototype || prototype === null;
    }

    private readString(value: unknown): string | undefined {
        return typeof value === 'string' ? value : undefined;
    }

    private readNumber(value: unknown): number | undefined {
        return typeof value === 'number' ? value : undefined;
    }

    private readBoolean(value: unknown): boolean | undefined {
        return typeof value === 'boolean' ? value : undefined;
    }
}
