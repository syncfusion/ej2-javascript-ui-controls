import { IDisposable } from './types';

/**
 * DisposableCollection — aggregates multiple IDisposable instances into one.
 *
 * Usage:
 *   const collection = new DisposableCollection();
 *   collection.add(subscription1);
 *   collection.add(subscription2);
 *   collection.dispose(); // disposes all at once
 *
 * `dispose()` is idempotent — calling it more than once is safe.
 *
 * @hidden
 */
export class DisposableCollection implements IDisposable {
    private readonly items: IDisposable[] = [];
    private disposed: boolean = false;

    /**
     * Adds a disposable to the collection. No-ops if already disposed.
     *
     * @param {IDisposable} item - The disposable to track.
     * @returns {void}
     */
    public add(item: IDisposable): void {
        if (this.disposed) {
            item.dispose();
            return;
        }
        this.items.push(item);
    }

    /**
     * Disposes all contained items in registration order. Idempotent.
     *
     * @returns {void}
     */
    public dispose(): void {
        if (this.disposed) {
            return;
        }
        this.disposed = true;
        for (const item of this.items) {
            item.dispose();
        }
        this.items.length = 0;
    }

    /**
     * Returns true after the first `dispose()` call.
     *
     * @returns {boolean} True if the collection has been disposed.
     */
    public get isDisposed(): boolean {
        return this.disposed;
    }
}
