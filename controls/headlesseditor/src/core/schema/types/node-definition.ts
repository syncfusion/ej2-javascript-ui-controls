import { AttributeDefinition } from './attribute-definition';
import { NodeContent } from './content-expression';


/**
 * NodeGroup — semantic grouping for a node type.
 * Used in content expressions to refer to groups rather than specific types.
 * Multiple groups can be combined with a space (e.g. 'block list') following
 * ProseMirror's group convention, allowing generic queries across all list nodes.
 */
export type NodeGroup = 'block' | 'inline' | 'container' | 'root' | 'block list' | 'list';

/**
 * NodeDefinition — describes a node type in the Syncfusion schema.
 * Compiled to a PM NodeSpec by PMSchemaAdapter.
 */
export interface NodeDefinition {
    /** Unique node type name (e.g. 'paragraph', 'heading', 'table'). */
    name: string;
    /** Semantic group this node belongs to. */
    group: NodeGroup;
    /** Content rule — what child nodes are allowed. */
    content?: NodeContent;
    /** Typed attribute definitions for this node. */
    attrs?: AttributeDefinition[];
    /** Whether this node is an inline (leaf) node. */
    inline?: boolean;
    /** Whether this node is a leaf with no content (e.g. image, hr). */
    leaf?: boolean;
    /**
     * Whether this node participates in placeholder-container resolution.
     *
     * The placeholder plugin recognizes eligible block containers by default
     * (any block node that is not a textblock and is not the document root).
     * This property overrides that default for a specific node:
     *
     * - `undefined` (default): the generic predicate applies.
     * - `true`: explicitly recognize this node as a placeholder container,
     *   even when it would not qualify under the generic predicate (e.g.
     *   a textblock that should influence child placeholder resolution).
     * - `false`: explicitly opt out — this node is never selected as a
     *   placeholder container, and ancestor traversal continues past it.
     *
     * The value is propagated to the PM `NodeSpec` via the schema compiler
     * and is read at runtime via `nodeType.spec.enablePlaceholderContainer`.
     */
    enablePlaceholderContainer?: boolean;
}
