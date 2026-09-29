import { MarkSpec } from '../pm-guard';
import { MarkDefinition } from '../../schema/types/mark-definition';
import { DOMSpecRegistry } from '../dom/dom-spec-registry';
/**
 * MarkSpecBuilder — converts a MarkDefinition to a ProseMirror MarkSpec.
 *
 * Delegates toDOM resolution entirely to the DOMSpecRegistry — the builder
 * itself owns no rendering knowledge.
 *
 * Only used internally by PMSchemaAdapter.compile() to build full schemas.
 */
export declare class MarkSpecBuilder {
    private readonly _domRegistry;
    constructor(domRegistry: DOMSpecRegistry);
    build(def: MarkDefinition): MarkSpec;
}
