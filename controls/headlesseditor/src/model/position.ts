/**
 * position.ts — Syncfusion-owned, zero-PM position type.
 *
 * `Position` is the only position type exported from src/index.ts.
 * `InternalPosition` lives in src/pm/ and is never exported.
 */

/** A node-relative cursor position in the Syncfusion document model. */
export interface Position {
    /** Stable UUID of the target EditorNode. */
    nodeId: string;
    /** Zero-based character offset within the node's text content.
     *  For non-text block nodes this MUST be 0. */
    offset: number;
}
