/**
 * PM-free formatting and structural context for the current selection.
 */
export interface SelectionContext {
    /**
     * Gets the formatting marks applied to the current selection.
     * The state indicates whether the mark is active across the entire selection
     * or mixed across the selected content.
     */
    marks: SelectionMark[];

    /**
     * Gets the relevant structural nodes associated with the current selection.
     */
    nodes: SelectionNode[];
}

/**
 * Represents a formatting mark in the current selection.
 */
export interface SelectionMark {
    /**
     * Gets the name of the formatting mark.
     */
    type: string;
    /**
     * Gets the attributes associated with the formatting mark.
     */
    attrs: Record<string, unknown>;
    /**
     * Gets the formatting state within the current selection.
     * `active` indicates the mark is consistently applied.
     * `mixed` indicates the mark or its attributes differ within the selection.
     */
    state: 'active' | 'mixed';
}

/**
 * Represents a relevant structural node in the current selection.
 */
export interface SelectionNode {
    /**
     * Gets the name of the structural node type.
     */
    type: string;
    /**
     * Gets the attributes associated with the structural node.
     */
    attrs: Record<string, unknown>;
}
