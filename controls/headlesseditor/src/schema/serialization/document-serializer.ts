/**
 * DocumentSerializer — round-trip a DocumentRoot to/from a JSON string.
 *
 * Responsibilities:
 *  - serialize(root)               → JSON string
 *  - deserialize(json, schema)     → validated DocumentRoot (auto-migrates if a MigrationEngine is supplied)
 *  - toObject(root)                → plain JS object (no stringify)
 *  - fromObject(obj, schema)       → validated DocumentRoot
 *
 * Error handling:
 *  - Invalid JSON              → DeserializationError
 *  - Unknown node type         → UnknownNodeTypeError
 *  - Schema validation failure → SchemaValidationError (with full ValidationError[])
 *
 * The optional MigrationEngine is applied during deserialization. If omitted,
 * no migration is attempted; documents with schemaVersion older than the
 * registered schema's expectations will fail validation.
 */
import { DocumentRoot } from '../../model/editor-node';
import { SchemaManager } from '../schema-manager';
import { validateDocument } from '../validation/validate-document';
import { MigrationEngine } from '../migration/migration-engine';
import { DeserializationError } from '../../errors/deserialization-error';
import { UnknownNodeTypeError } from '../../errors/unknown-node-type-error';
import { SchemaValidationError } from '../../errors/schema-validation-error';
import { ValidationResult } from '../../errors/validation-error';

export interface DocumentSerializerOptions {
    /** Optional migration pipeline — applied during deserialization. */
    migrationEngine?: MigrationEngine;
}

export class DocumentSerializer {
    private readonly _migrationEngine?: MigrationEngine;

    constructor(options: DocumentSerializerOptions = {}) {
        this._migrationEngine = options.migrationEngine;
    }

    /**
     * Serialize a DocumentRoot to a JSON string.
     *
     * @param {DocumentRoot} root - The document to serialize.
     * @returns {string} A JSON string representation of the document.
     */
    public serialize(root: DocumentRoot): string {
        return JSON.stringify(this.toObject(root));
    }

    /**
     * Deserialize a JSON string into a validated DocumentRoot.
     *
     * @param {string} json - The JSON payload to parse.
     * @param {SchemaManager} schema - The schema manager used for validation.
     * @returns {DocumentRoot} The validated document root.
     */
    public deserialize(json: string, schema: SchemaManager): DocumentRoot {
        let obj: unknown;
        try {
            obj = JSON.parse(json);
        } catch (e) {
            const cause: Error = e instanceof Error ? e : new Error(String(e));
            throw new DeserializationError('input is not valid JSON', cause);
        }
        return this.fromObject(obj, schema);
    }

    /**
     * Convert a DocumentRoot to a plain JSON-safe object.
     *
     * @param {DocumentRoot} root - The document to convert.
     * @returns {object} A plain object representation of the document.
     */
    public toObject(root: DocumentRoot): object {
        return this._clone(root) as object;
    }

    /**
     * Convert a plain object to a validated DocumentRoot.
     *
     * @param {*} obj - The raw object to validate and convert.
     * @param {SchemaManager} schema - The schema manager used for validation.
     * @returns {DocumentRoot} The validated document root.
     */
    public fromObject(obj: unknown, schema: SchemaManager): DocumentRoot {
        if (obj === null || typeof obj !== 'object') {
            throw new DeserializationError('document payload must be an object');
        }
        const raw: Record<string, unknown> = obj as Record<string, unknown>;

        // Reject unknown types up front so a precise error is thrown
        this._assertNoUnknownTypes(raw, schema);

        let root: DocumentRoot = raw as unknown as DocumentRoot;

        // Apply migrations if an engine is configured
        if (this._migrationEngine && root.schemaVersion !== this._migrationEngine.getCurrentVersion()) {
            root = this._migrationEngine.migrate(root);
        }

        const result: ValidationResult = validateDocument(root, schema);
        if (!result.valid) {
            throw new SchemaValidationError(result.errors);
        }
        return root;
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    private _clone(value: unknown): unknown {
        // DocumentRoot is a tree of plain JSON-safe data; structuredClone is safe.
        if (typeof structuredClone === 'function') {
            return structuredClone(value);
        }
        return JSON.parse(JSON.stringify(value));
    }

    /**
     * Walk the tree and throw UnknownNodeTypeError at the first unregistered type.
     * Throws a single error rather than collecting all unknowns — matches SPEC.
     *
     * @param {Record<string, *>} node - The current node to check.
     * @param {SchemaManager} schema - The schema manager used to look up node types.
     * @returns {void}
     */
    private _assertNoUnknownTypes(node: Record<string, unknown>, schema: SchemaManager): void {
        const id: unknown = node['id'];
        const type: unknown = node['type'];
        if (typeof type !== 'string') {
            throw new DeserializationError('node is missing "type" string');
        }
        if (!schema.getNode(type)) {
            throw new UnknownNodeTypeError(type, typeof id === 'string' ? id : '<no-id>');
        }
        const children: unknown = node['children'];
        if (Array.isArray(children)) {
            for (const child of children) {
                if (child !== null && typeof child === 'object') {
                    this._assertNoUnknownTypes(child as Record<string, unknown>, schema);
                }
            }
        }
    }
}
