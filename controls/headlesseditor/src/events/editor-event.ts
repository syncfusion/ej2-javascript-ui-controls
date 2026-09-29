/**
 * EditorEvent<T> — base interface for all events flowing through the EventBus.
 *
 * - `type`    — unique string identifier for the event (e.g. `'contentChanged'`).
 * - `payload` — strongly-typed data carried by the event.
 *
 * @public
 */
export interface EditorEvent<T> {
    readonly type: string;
    readonly payload: T;
}
