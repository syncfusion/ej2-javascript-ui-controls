
import { ProgressEvent } from './interface';

/**
 * Represents an event listener callback function.
 *
 * @template T The type of event argument received by the listener.
 * @param event The event payload.
 */
export type EventListener<T = ProgressEvent> = (event: T) => void;

/**
 * Manages event subscription, unsubscription, and dispatching for conversion operations.
 */
export class EventEmitter {
    /**
     * Map storing registered listeners per event name.
     */
    private listeners: Map<string, EventListener[]> = new Map();

    /**
     * Registers a listener callback for a specific event.
     *
     * @param {string} event The name of the event to listen to.
     * @param {EventListener} listener The callback function invoked when the event is emitted.
     * @returns {void}
     */
    public on(event: string, listener: EventListener): void {
        let eventListeners: EventListener[] | undefined = this.listeners.get(event);
        if (!eventListeners) {
            eventListeners = [];
            this.listeners.set(event, eventListeners);
        }
        eventListeners.push(listener);
    }

    /**
     * Removes a previously registered listener callback for a specific event.
     *
     * @param {string} event The name of the event.
     * @param {EventListener} listener The callback function to remove.
     * @returns {void}
     */
    public off(event: string, listener: EventListener): void {
        const listeners: EventListener[] | undefined = this.listeners.get(event);
        if (listeners) {
            const index: number = listeners.indexOf(listener);
            if (index !== -1) {
                listeners.splice(index, 1);
            }
        }
    }

    /**
     * Triggers all listener callbacks subscribed to the specified event.
     *
     * @param {string} event The name of the event to trigger.
     * @param {ProgressEvent} data The progress event payload passed to listeners.
     * @returns {void}
     */
    public trigger(event: string, data: ProgressEvent): void {
        const listeners: EventListener[] | undefined = this.listeners.get(event);
        if (listeners) {
            for (let listenerIndex: number = 0; listenerIndex < listeners.length; listenerIndex++) {
                listeners[listenerIndex as number](data);
            }
        }
    }

    /**
     * Emits an event with the associated progress data.
     *
     * @param {string} event The name of the event to emit.
     * @param {ProgressEvent} data The progress event payload.
     * @returns {void}
     */
    public emit(event: string, data: ProgressEvent): void {
        this.trigger(event, data);
    }

    /**
     * Registers a one-time listener callback for a specific event.
     * The listener is automatically removed after its first invocation.
     *
     * @param {string} event The name of the event to listen to.
     * @param {EventListener} listener The callback function invoked once.
     * @returns {void}
     */
    public once(event: string, listener: EventListener): void {
        const onceListener: EventListener = (data: ProgressEvent): void => {
            this.off(event, onceListener);
            listener(data);
        };
        this.on(event, onceListener);
    }

    /**
     * Removes all listeners for a specified event, or all listeners across all events if none is specified.
     *
     * @param {string} [event] Optional event name whose listeners should be removed.
     * @returns {void}
     */
    public removeAllListeners(event?: string): void {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }
}
