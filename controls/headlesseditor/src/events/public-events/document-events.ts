import { EditorEvent } from '../editor-event';
import { DocumentRoot, EditorNode } from '../../model/editor-node';
import { Selection } from '../../model/selection';

// ContentChangedEvent
// SelectionChangedEvent
// DocumentChangedEvent

/**
 * Semantic action that describes the nature of a document change.
 *
 * @public
 */
export type DocumentChangeAction = 'Insertion' | 'Deletion' | 'Moved' | 'Replaced' | 'Update' | 'Formatting' | 'Unknown';

/**
 * Payload for contentChanged — aggregated from TransactionApplied +
 * HistoryRecorded + SelectionUpdated + RendererInvalidated.
 *
 * Raw state snapshot. Use `documentChanged` for semantic action information.
 *
 * @public
 */
export interface ContentChangedPayload {
    /** The document state after the change. */
    document: DocumentRoot;
    /** The selection state after the change. */
    selection: Selection;
}

/**
 * ContentChangedEvent — published after a document-mutating transaction is fully processed.
 *
 * @public
 */
export type ContentChangedEvent = EditorEvent<ContentChangedPayload>;

/**
 * Payload for documentChanged — emitted on document-mutating transactions with semantic change information.
 *
 * Provides rich context about what changed (action), which nodes were affected, and the new state.
 * Use this for product-level behaviors (Block Editor block tracking, RTE undo previews, analytics).
 *
 * @public
 */
export interface DocumentChangedPayload {
    /**
     * Semantic action describing the nature of the change.
     * - `'Insertion'`: Content was added (typing, paste, insert command)
     * - `'Deletion'`: Content was removed (backspace, delete, remove command)
     * - `'Moved'`: Content was relocated (drag-drop, reorder, move command)
     * - `'Replaced'`: Content was swapped (find-replace, transform)
     * - `'Update'`: Node attributes changed without content/structural change (heading level, node attrs)
     * - `'Formatting'`: Mark/formatting changed (bold, italic, color) without content/structural change
     * - `'Unknown'`: Transaction too complex to categorize; examine `affectedNodes` for details
     */
    action: DocumentChangeAction;

    /** The document state after the change. */
    document: DocumentRoot;

    /** The selection state after the change. */
    selection: Selection;

    /**
     * All Headless Editor nodes touched by this transaction.
     * Populated based on action:
     * - `'Insertion'`: Newly inserted nodes and their ancestors
     * - `'Deletion'`: Nodes that existed before deletion (for archival/undo preview)
     * - `'Moved'`: Relocated nodes
     * - `'Replaced'`: Both old and new nodes
     * - `'Update'`: Nodes with changed attributes; normally containing block
     * - `'Formatting'`: Nodes with added/removed marks; normally containing block
     * - `'Unknown'`: All nodes with changes (best effort)
     */
    affectedNodes: EditorNode[];

    /**
     * Unique node IDs of affected nodes. Deduped for efficient lookups.
     * Use for: filtering changes, triggering targeted updates, analytics.
     */
    affectedNodeIds: string[];
}

/**
 * DocumentChangedEvent — published when document structure or content changes with semantic action information.
 *
 * @public
 */
export type DocumentChangedEvent = EditorEvent<DocumentChangedPayload>;

/**
 * Payload for selectionChanged — emitted on selection-only transactions.
 *
 * @public
 */
export interface SelectionChangedPayload {
    /** The new selection. */
    selection: Selection;
}

/**
 * SelectionChangedEvent — published when the selection changes without document mutation.
 *
 * @public
 */
export type SelectionChangedEvent = EditorEvent<SelectionChangedPayload>;
