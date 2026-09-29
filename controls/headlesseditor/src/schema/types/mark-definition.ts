import { AttributeDefinition } from './attribute-definition';

/**
 * MarkDefinition — describes a mark type in the Syncfusion schema.
 * Compiled to a PM MarkSpec by PMSchemaAdapter.
 *
 */
export interface MarkDefinition {
    /** Unique mark type name (e.g. 'bold', 'italic', 'link'). */
    name: string;
    /** Typed attribute definitions for this mark. */
    attrs?: AttributeDefinition[];
    /**
     * Whether the mark extends to cover text inserted at its boundary.
     * Defaults to true (inclusive) per ProseMirror convention.
     */
    inclusive?: boolean;
    /**
     * Whether the mark spans across block boundaries.
     */
    spanning?: boolean;
    /**
     * Marks that cannot coexist with this mark.
     * Stored as an array here; compiled to a space-separated string by PMSchemaAdapter
     * for PM's MarkSpec.excludes.
     */
    excludes?: string[];
}
