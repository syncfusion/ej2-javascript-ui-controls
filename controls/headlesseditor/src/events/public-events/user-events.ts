import { CancelableEvent } from '../cancelable-event';
import { EditorEvent } from '../editor-event';

// FocusEvent
// BlurEvent
// BeforePasteEvent
// AfterPasteEvent
// BeforeDeleteEvent
// AfterDeleteEvent

/**
 * Payload for focus — empty; the event itself signals the state change.
 *
 * @public
 */
export type FocusPayload = Record<string, never>;

/**
 * FocusEvent — published when the editor gains focus.
 *
 * @public
 */
export type FocusEvent = EditorEvent<FocusPayload>;

/**
 * Payload for blur — empty; the event itself signals the state change.
 *
 * @public
 */
export type BlurPayload = Record<string, never>;

/**
 * BlurEvent — published when the editor loses focus.
 *
 * @public
 */
export type BlurEvent = EditorEvent<BlurPayload>;

/**
 * Payload for beforePaste — carries the raw content about to be inserted.
 *
 * @public
 */
export interface BeforePastePayload {
    /** The raw HTML or plain text string about to be pasted. */
    content: string;
}

/**
 * BeforePasteEvent — cancelable event published before paste processing begins.
 * Set `event.cancel = true` to prevent insertion.
 *
 * @public
 */
export type BeforePasteEvent = CancelableEvent<BeforePastePayload>;

/**
 * Payload for afterPaste — carries the final inserted content.
 *
 * @public
 */
export interface AfterPastePayload {
    /** The content that was actually inserted after processing. */
    content: string;
}

/**
 * AfterPasteEvent — published after a paste operation completes.
 *
 * @public
 */
export type AfterPasteEvent = EditorEvent<AfterPastePayload>;

/**
 * Payload for beforeDelete — describes the node-level deletion about to occur.
 *
 * @public
 */
export interface BeforeDeletePayload {
    /** The unique ID of the node about to be deleted. */
    nodeId: string;
    /** The type of the node being deleted (e.g. 'paragraph', 'heading'). */
    nodeType: string;
}

/**
 * BeforeDeleteEvent — cancelable event published before a node-level block deletion.
 * Set `event.cancel = true` to abort the deletion.
 *
 * Scope: node-level deletes only. Character-level backspace is covered by contentChanged.
 *
 * @public
 */
export type BeforeDeleteEvent = CancelableEvent<BeforeDeletePayload>;

/**
 * Payload for afterDelete — describes the node that was removed.
 *
 * @public
 */
export interface AfterDeletePayload {
    /** The unique ID of the node that was deleted. */
    nodeId: string;
    /** The type of the node that was deleted. */
    nodeType: string;
}

/**
 * AfterDeleteEvent — published after a node-level block deletion completes.
 *
 * @public
 */
export type AfterDeleteEvent = EditorEvent<AfterDeletePayload>;
