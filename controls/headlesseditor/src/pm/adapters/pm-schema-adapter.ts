import { MarkSpec, NodeSpec, PMSchema, SchemaSpec } from '../pm-guard';
import { SchemaDefinition } from '../../schema/types/schema-definition';
import { NodeSpecBuilder } from './node-spec-builder';
import { MarkSpecBuilder } from './mark-spec-builder';
import { DOMSpecRegistry } from '../dom/dom-spec-registry';
import { DiagnosticsService } from '../../diagnostics/diagnostics-service';
import { MissingDOMSpecError } from '../dom/dom-spec-errors';

/**
 * PMSchemaAdapter — compiles a SchemaDefinition into a ProseMirror Schema.
 *
 * The resulting PMSchema MUST NOT be exported from src/index.ts.
 * It stays inside src/pm/ and is only used by IntegrationManager and DocumentMapper.
 *
 * Accepts a DOMSpecRegistry via constructor injection — it never creates or
 * owns a registry. EditorBuilder is responsible for building the registry
 * (merging built-in defaults with any extension contributions) and passing it
 * in before calling compile().
 *
 * Accepts an optional DiagnosticsService. When provided, per-mark / per-node
 * build failures (specifically `MissingDOMSpecError`) are routed through the
 * diagnostics service instead of being thrown — the offending entry is
 * skipped and the schema is built from the remaining valid entries. This
 * keeps a single misconfigured mark from tearing down the whole editor.
 */
export class PMSchemaAdapter {
    private readonly _nodeBuilder: NodeSpecBuilder;
    private readonly _markBuilder: MarkSpecBuilder;
    private readonly _diagnostics: DiagnosticsService;

    public constructor(domRegistry: DOMSpecRegistry, diagnostics: DiagnosticsService) {
        this._nodeBuilder = new NodeSpecBuilder(domRegistry);
        this._markBuilder = new MarkSpecBuilder(domRegistry);
        this._diagnostics = diagnostics;
    }

    public compile(def: SchemaDefinition): PMSchema {
        const nodes: Record<string, NodeSpec> = {};
        const marks: Record<string, MarkSpec> = {};

        for (const nodeDef of def.nodes) {
            try {
                nodes[nodeDef.name] = this._nodeBuilder.build(nodeDef);
            } catch (error) {
                this._handleBuildError('node', nodeDef.name, error);
            }
        }

        for (const markDef of def.marks) {
            try {
                marks[markDef.name] = this._markBuilder.build(markDef);
            } catch (error) {
                this._handleBuildError('mark', markDef.name, error);
            }
        }

        const spec: SchemaSpec = { nodes, marks, topNode: 'document' };
        return new PMSchema(spec);
    }

    /**
     * Routes a single node/mark build failure through the diagnostics service.
     *
     * - `MissingDOMSpecError` is recorded as an error (a misconfigured mark
     *   or node should be visible to consumers via the diagnostics stream).
     * - Any other error is also recorded but re-thrown — it likely indicates
     *   a deeper bug in the builder that the consumer must see.
     *
     * @param {'node' | 'mark'} kind - Whether the failed entry was a node or a mark.
     * @param {string} name - The schema-level name of the failed entry.
     * @param {unknown} error - The error thrown by the builder.
     * @returns {void}
     */
    private _handleBuildError(kind: 'node' | 'mark', name: string, error: unknown): void {
        if (error instanceof MissingDOMSpecError) {
            this._diagnostics.error(
                `[PMSchemaAdapter] Skipping ${kind} "${name}": no DOM spec registered. ` +
                `Provide a DOMSpecs capability entry for this ${kind} in its extension.`,
                { kind, name, source: error.message }
            );
            return;
        }
        const message: string = error instanceof Error ? error.message : String(error);
        this._diagnostics.error(
            `[PMSchemaAdapter] ${kind} "${name}" build failed: ${message}`,
            { kind, name }
        );
        throw error instanceof Error ? error : new Error(message);
    }
}
