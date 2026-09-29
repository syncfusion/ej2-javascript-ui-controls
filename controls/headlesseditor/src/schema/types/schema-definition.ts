import { NodeDefinition } from './node-definition';
import { MarkDefinition } from './mark-definition';

/**
 * Top-level schema definition passed to SchemaManager.
 * Describes the full set of node and mark types for an editor instance.
 */
export interface SchemaDefinition {
    /** All node types in this schema, including the root document node. */
    nodes: NodeDefinition[];
    /** All mark types in this schema. */
    marks: MarkDefinition[];
}
