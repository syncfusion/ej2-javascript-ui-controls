import { EditorEvent } from '../editor-event';
import { Selection } from '../../model/selection';
import type { PMNode, PMTransaction } from '../../pm/pm-guard';

//TransactionApplied
// HistoryRecorded
// SelectionUpdated
// SchemaLoaded
// RendererInitialized
// RendererInvalidated

/**
 * Payload for TransactionApplied — emitted after a ProseMirror transaction
 * is committed. Carries a flag indicating whether the document was mutated.
 *
 * @hidden
 */
export interface TransactionAppliedPayload {
    /** True when the transaction changed document content (not selection-only). */
    docChanged: boolean;
    /** PM transaction that was applied (for step-driven analysis). @hidden */
    transaction?: PMTransaction;
    /** PM document state before the transaction (only populated when docChanged=true). @hidden */
    beforeDoc?: PMNode;
    /** PM document state after the transaction (only populated when docChanged=true). @hidden */
    afterDoc?: PMNode;
}

/**
 * TransactionApplied — fired every time a ProseMirror transaction is applied.
 *
 * @hidden
 */
export type TransactionApplied = EditorEvent<TransactionAppliedPayload>;

/**
 * Payload for HistoryRecorded — emitted after a history entry is pushed to
 * the undo stack.
 *
 * @hidden
 */
export interface HistoryRecordedPayload {
    /** Number of steps currently in the undo stack. */
    undoDepth: number;
}

/**
 * HistoryRecorded — fired when a transaction is committed to the undo history.
 *
 * @hidden
 */
export type HistoryRecorded = EditorEvent<HistoryRecordedPayload>;

/**
 * Payload for SelectionUpdated — emitted whenever the PM selection changes.
 *
 * @hidden
 */
export interface SelectionUpdatedPayload {
    /** The new selection state. */
    selection: Selection;
    /** True when the document content also changed in the same transaction. */
    docChanged: boolean;
}

/**
 * SelectionUpdated — fired when the ProseMirror selection changes.
 *
 * @hidden
 */
export type SelectionUpdated = EditorEvent<SelectionUpdatedPayload>;

/**
 * Payload for SchemaLoaded — emitted after the schema is compiled and ready.
 *
 * @hidden
 */
export interface SchemaLoadedPayload {
    /** The resolved schema version string, if present. */
    version?: string;
}

/**
 * SchemaLoaded — fired once the PM schema is compiled from the SchemaDefinition.
 *
 * @hidden
 */
export type SchemaLoaded = EditorEvent<SchemaLoadedPayload>;

/**
 * Payload for RendererInvalidated — signals that the renderer needs to re-render.
 *
 * @hidden
 */
export interface RendererInvalidatedPayload {
    /** The reason the renderer was invalidated. */
    reason: 'transaction' | 'selection' | 'resize' | 'theme';
}

/**
 * RendererInvalidated — fired when the view layer needs to update.
 *
 * @hidden
 */
export type RendererInvalidated = EditorEvent<RendererInvalidatedPayload>;

/**
 * Payload for RendererInitialized — fired once after the PM view is fully mounted.
 *
 * @hidden
 */
export interface RendererInitializedPayload {
    /** The container element the editor was mounted into. */
    container: HTMLElement;
}

/**
 * RendererInitialized — fired once when the editor view completes its first render.
 *
 * @hidden
 */
export type RendererInitialized = EditorEvent<RendererInitializedPayload>;
