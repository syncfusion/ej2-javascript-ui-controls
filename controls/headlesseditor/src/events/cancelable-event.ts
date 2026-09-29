import { EditorEvent } from './editor-event';

/**
 * CancelableEvent<T> — extends EditorEvent<T> with a mutable `cancel` flag.
 *
 * A subscriber may set `cancel = true` to prevent the default action associated
 * with the event. Only events explicitly typed as cancelable (e.g. BeforePasteEvent,
 * BeforeDeleteEvent) extend this interface.
 *
 * @public
 */
export interface CancelableEvent<T> extends EditorEvent<T> {
    cancel: boolean;
}
