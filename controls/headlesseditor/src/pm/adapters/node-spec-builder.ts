import { NodeSpec, AttributeSpec } from '../pm-guard';
import { NodeDefinition } from '../../schema/types/node-definition';
import { AttributeDefinition } from '../../schema/types/attribute-definition';
import { ContentExpressionCompiler } from './content-expression-compiler';
import { DOMSpecRegistry } from '../dom/dom-spec-registry';
import { getPMNodeMetadata } from './node-pm-metadata';

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
export class NodeSpecBuilder {
    private readonly _compiler: ContentExpressionCompiler = new ContentExpressionCompiler();
    private readonly _domRegistry: DOMSpecRegistry;

    public constructor(domRegistry: DOMSpecRegistry) {
        this._domRegistry = domRegistry;
    }

    public build(def: NodeDefinition): NodeSpec {
        // ── Special case: PM text node ────────────────────────────────────
        // ProseMirror requires that the text node has NO toDOM, NO attrs, and
        // no content string. Any customisation here would break PM's internals.
        if (def.name === 'text') {
            const textSpec: NodeSpec = {};
            if (def.group) {
                textSpec.group = def.group;
            }
            return textSpec;
        }

        const attrs: Record<string, AttributeSpec> = {
            id: { default: null }     // platform-injected id slot
        };

        if (def.attrs) {
            for (const attrDef of def.attrs) {
                attrs[attrDef.name] = this._buildAttrSpec(attrDef);
            }
        }

        const spec: NodeSpec = { attrs };

        if (def.content) {
            spec.content = this._compiler.compile(def.content);
        }

        if (def.group) {
            spec.group = def.group;
        }

        if (def.inline === true) {
            spec.inline = true;
        }

        if (def.leaf === true) {
            // leaf nodes have no content — PM uses this to determine parseability
            spec.content = undefined;
        }

        const pmMetadata: Record<string, any> = getPMNodeMetadata(def.name);
        Object.assign(spec, pmMetadata);

        // ── toDOM and parseDOM ────────────────────────────────────────────
        // Delegated to the registry. Throws MissingDOMSpecError if the node
        // type has no registered spec — missing specs are config errors.
        const nodeDOMSpec: ReturnType<DOMSpecRegistry['getNodeDOMSpec']> = this._domRegistry.getNodeDOMSpec(def.name);
        const domProps: Record<string, any> = { toDOM: nodeDOMSpec.toDOM };
        if (nodeDOMSpec.parseDOM) {
            domProps.parseDOM = nodeDOMSpec.parseDOM;
        }
        Object.assign(spec, domProps);

        return spec;
    }

    private _buildAttrSpec(attr: AttributeDefinition): AttributeSpec {
        const spec: AttributeSpec = {};
        if ('default' in attr && attr.default !== undefined) {
            spec.default = attr.default;
        }
        return spec;
    }
}
