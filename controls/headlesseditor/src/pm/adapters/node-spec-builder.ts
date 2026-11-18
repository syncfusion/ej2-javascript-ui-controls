import { NodeSpec, AttributeSpec } from '../pm-guard';
import { NodeDefinition } from '../../core/schema/types/node-definition';
import { AttributeDefinition } from '../../core/schema/types/attribute-definition';
import { NodeContent, ExpressionTree, pruneExpressionTree } from '../../core/schema/types/content-expression';
import { ContentExpressionCompiler } from './content-expression-compiler';
import { DOMSpecRegistry } from '../dom/dom-spec-registry';
import { getPMNodeMetadata } from './node-pm-metadata';

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
export class NodeSpecBuilder {
    private readonly _compiler: ContentExpressionCompiler = new ContentExpressionCompiler();
    private readonly _domRegistry: DOMSpecRegistry;

    public constructor(domRegistry: DOMSpecRegistry) {
        this._domRegistry = domRegistry;
    }

    public build(def: NodeDefinition, availableNodes?: ReadonlySet<string>): NodeSpec {
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

        const attrs: Record<string, AttributeSpec> = {};

        if (def.attrs) {
            for (const attrDef of def.attrs) {
                attrs[attrDef.name] = this._buildAttrSpec(attrDef);
            }
        }

        const spec: NodeSpec = { attrs };

        if (def.content) {
            // Degrade choice alternatives from unregistered extensions (e.g.
            // listItem's `(paragraph | heading)` becomes `paragraph` when
            // the heading extension is absent) instead of failing the whole
            // schema. Hard references outside choices are untouched.
            let contentTree: ExpressionTree = def.content._tree;
            if (availableNodes) {
                const pruned: ExpressionTree | null = pruneExpressionTree(contentTree, availableNodes);
                if (pruned === null) {
                    throw new Error(
                        `NodeSpecBuilder: node "${def.name}" has unsatisfiable content — ` +
                        'every alternative of a required choice is unregistered.'
                    );
                }
                contentTree = pruned;
            }
            spec.content = this._compiler.compile({ _tree: contentTree } as NodeContent);
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

        // Propagate the optional `enablePlaceholderContainer` override from the
        // NodeDefinition. This runs after NODE_PM_METADATA so that an
        // explicit value from the extension definition takes precedence
        // over the built-in metadata default. Undefined values are not
        // assigned — they leave any existing spec value untouched.
        if (def.enablePlaceholderContainer !== undefined) {
            spec.enablePlaceholderContainer = def.enablePlaceholderContainer;
        }
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
