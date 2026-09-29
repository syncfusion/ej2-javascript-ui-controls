import { NodeSpec } from '../pm-guard';
import { NodeDefinition } from '../../schema/types/node-definition';
import { DOMSpecRegistry } from '../dom/dom-spec-registry';
/**
 * NodeSpecBuilder — converts a NodeDefinition to a ProseMirror NodeSpec.
 *
 * Automatically injects `attrs.id = { default: null }` on every node
 * (platform contract for tracking node identity across PM operations).
 *
 * Delegates toDOM resolution entirely to the DOMSpecRegistry — the builder
 * itself owns no rendering knowledge.
 *
 * Only used internally by PMSchemaAdapter.compile() to build full schemas.
 */
export declare class NodeSpecBuilder {
    private readonly _compiler;
    private readonly _domRegistry;
    constructor(domRegistry: DOMSpecRegistry);
    build(def: NodeDefinition): NodeSpec;
    private _buildAttrSpec;
}
