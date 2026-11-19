/**
 * editor-state.ts — Syncfusion-owned snapshot of editor state.
 *
 * Zero PM types on this interface. Commands read from this to check
 * current document and selection without touching ProseMirror directly.
 */
import { DocumentRoot } from './editor-node';
import { Selection } from './selection';

/**
 * EditorState — a pure Syncfusion-owned view of the current editor snapshot.
 *
 * Passed to every command via `CommandContext`. Built internally by
 * `ImmediateExecutor` and `ChainExecutor` from PM state — PM types never
 * escape this boundary.
 */
export interface EditorState {
    /** The current document root. */
    readonly document: DocumentRoot;
    /** The current selection (cursor / range). */
    readonly selection: Selection;
    /** Whether the editor is currently mounted to the DOM. */
    readonly isMounted: boolean;
}
