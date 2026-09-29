/**
 * internal-position.ts — PM-aware position record, sealed inside src/pm/.
 *
 * InternalPosition extends the public Position concept by attaching the
 * resolved prosemirror-model absolute integer position (`pmPos`).
 * Nothing outside src/pm/ should ever import or depend on this type.
 */
export interface InternalPosition {
    /** UUID of the target EditorNode. */
    nodeId: string;
    /** Zero-based character offset within that node. */
    offset: number;
    /**
     * Absolute ProseMirror document position.
     * Computed once during translation and treated as immutable for the
     * lifetime of a single transaction.
     */
    pmPos: number;
}
