import { EditorEvent } from '../editor-event';

// CreatedEvent
// DestroyedEvent

/**
 * Payload for created — emitted once the editor has fully initialised.
 * @public
 */
export type CreatedPayload = Record<string, never>;

/**
 * CreatedEvent — published exactly once after the full init sequence completes.
 * @public
 */
export type CreatedEvent = EditorEvent<CreatedPayload>;

/**
 * Payload for editorDestroyed — emitted before any teardown begins.
 * @public
 */
export type DestroyedPayload = Record<string, never>;

/**
 * DestroyedEvent — published before `editor.destroy()` tears down services.
 * @public
 */
export type DestroyedEvent = EditorEvent<DestroyedPayload>;
