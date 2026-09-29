import { IDisposable } from './types';
import { EditorEvent } from './editor-event';
import { DisposableCollection } from './disposable-collection';

// ── Dependency interface (forward-declared to avoid circular imports) ─────────

/**
 * Minimal surface of DiagnosticsService that EventBus depends on.
 * The concrete DiagnosticsService satisfies this interface.
 *
 * @hidden
 */
export interface IErrorReporter {
    error(message: string, metadata?: Record<string, unknown>): void;
}

// ── Priority ──────────────────────────────────────────────────────────────────

/**
 * SubscriberPriority — controls the dispatch order within a single publish call.
 *
 * High subscribers run first, Low run last. Within the same priority level
 * subscribers are called in registration order (FIFO).
 *
 * @hidden
 */
export enum SubscriberPriority {
    High = 0,
    Normal = 1,
    Low = 2,
}

// ── Internal types ────────────────────────────────────────────────────────────
/**
 * Internal event handler signature.
 *
 * @hidden
 */
type EventHandler<T> = (event: EditorEvent<T>) => void;

/**
 * Internal subscriber metadata maintained by the EventBus.
 *
 * @hidden
 */
interface SubscriberEntry<T> {
    handler: EventHandler<T>;
    priority: SubscriberPriority;
    active: boolean;
}

/**
 * Internal mapping of event types to their handlers for bulk subscriptions.
 *
 * @hidden
 */
type BulkHandlerMap = {
    [eventType: string]: EventHandler<unknown>;
};

// ── EventBus ──────────────────────────────────────────────────────────────────

/**
 * EventBus — synchronous publish/subscribe hub for the Headless Editor runtime.
 *
 * Design decisions (from design.md):
 * - Dispatch is synchronous; `publish()` returns only after all handlers run.
 * - Subscribers are sorted by SubscriberPriority before each publish.
 * - Subscriber errors are caught, reported to IErrorReporter, and dispatch continues.
 * - A snapshot of the subscriber list is taken before iteration to handle
 *   mid-dispatch disposal safely.
 *
 * Bootstrap note: EventBus is constructed before ServiceRegistry. It receives
 * an IErrorReporter (DiagnosticsService) directly via constructor injection.
 *
 * @hidden
 */
export class EventBus implements IDisposable {
    private readonly errorReporter: IErrorReporter;
    private readonly subscriptions: Map<string, SubscriberEntry<unknown>[]> = new Map();
    private disposed: boolean = false;

    constructor(errorReporter: IErrorReporter) {
        this.errorReporter = errorReporter;
    }

    // ── Subscribe ─────────────────────────────────────────────────────────────

    /**
     * Registers a handler for events of the given type string.
     *
     * @param {string} eventType - The string key matching `EditorEvent.type`.
     * @param {EventHandler} handler - Callback invoked with the event payload.
     * @param {SubscriberPriority} [priority] - Dispatch order. Defaults to `Normal`.
     * @returns {IDisposable} An IDisposable that removes this subscription.
     */
    public subscribe<T>(
        eventType: string,
        handler: EventHandler<T>,
        priority: SubscriberPriority = SubscriberPriority.Normal
    ): IDisposable {
        if (this.disposed) {
            return { dispose: (): void => undefined };
        }

        const entry: SubscriberEntry<unknown> = {
            handler: handler as EventHandler<unknown>,
            priority,
            active: true
        };

        if (!this.subscriptions.has(eventType)) {
            this.subscriptions.set(eventType, []);
        }
        const list: SubscriberEntry<unknown>[] = this.subscriptions.get(eventType) as SubscriberEntry<unknown>[];
        list.push(entry);

        return {
            dispose: (): void => {
                entry.active = false;
                this.removeEntry(eventType, entry);
            }
        };
    }

    /**
     * Registers multiple handlers in a single call.
     * Returns a single IDisposable that removes all of them at once.
     *
     * @param {BulkHandlerMap} handlers - Map of event type to handler.
     * @returns {IDisposable} A single disposable that removes all subscriptions.
     */
    public subscribeBulk(handlers: BulkHandlerMap): IDisposable {
        const collection: DisposableCollection = new DisposableCollection();
        for (const eventType of Object.keys(handlers)) {
            const handler: EventHandler<unknown> = handlers[eventType as string];
            const disposable: IDisposable = this.subscribe(eventType, handler);
            collection.add(disposable);
        }
        return collection;
    }

    // ── Publish ───────────────────────────────────────────────────────────────

    /**
     * Publishes an event synchronously to all registered subscribers.
     *
     * - Subscribers are dispatched in priority order (High → Normal → Low).
     * - A snapshot is taken before iteration; mid-dispatch disposals are safe.
     * - Subscriber errors are caught and forwarded to the error reporter.
     *
     * @param {EditorEvent} event - The event to publish.
     * @returns {void}
     */
    public publish<T>(event: EditorEvent<T>): void {
        if (this.disposed) {
            return;
        }

        const entries: SubscriberEntry<unknown>[] | undefined = this.subscriptions.get(event.type);
        if (!entries || entries.length === 0) {
            return;
        }

        // Snapshot + sort so mid-dispatch disposal and priority both work correctly.
        const snapshot: SubscriberEntry<unknown>[] = [...entries].sort(
            (a: SubscriberEntry<unknown>, b: SubscriberEntry<unknown>) => a.priority - b.priority
        );

        for (const entry of snapshot) {
            if (!entry.active) {
                continue;
            }
            try {
                entry.handler(event as EditorEvent<unknown>);
            } catch (err) {
                const message: string = err instanceof Error ? err.message : String(err);
                this.errorReporter.error(
                    `EventBus: subscriber error on "${event.type}": ${message}`,
                    { eventType: event.type, error: err }
                );
            }
        }
    }

    // ── Dispose ───────────────────────────────────────────────────────────────

    /**
     * Clears all subscriptions. Subsequent publish calls are no-ops.
     *
     * @returns {void}
     */
    public dispose(): void {
        if (this.disposed) {
            return;
        }
        this.disposed = true;
        this.subscriptions.clear();
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private removeEntry(eventType: string, entry: SubscriberEntry<unknown>): void {
        const entries: SubscriberEntry<unknown>[] | undefined = this.subscriptions.get(eventType);
        if (!entries) {
            return;
        }
        const index: number = entries.indexOf(entry);
        if (index !== -1) {
            entries.splice(index, 1);
        }
        if (entries.length === 0) {
            this.subscriptions.delete(eventType);
        }
    }
}
