import { NodeSpec } from '../pm-guard';
import { NodeDefinition } from '../../core/schema/types/node-definition';
import { DOMSpecRegistry } from '../dom/dom-spec-registry';
/**
 * NodeSpecBuilder — converts a NodeDefinition to a ProseMirror NodeSpec.
 *
 * No persistent `attrs.id` slot is injected on every node — node identity
 * in Headless is position-based within the document tree, not UUID-based.
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
    build(def: NodeDefinition, availableNodes?: ReadonlySet<string>): NodeSpec;
    private _buildAttrSpec;
}
