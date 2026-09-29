/**
 * IDisposable — contract for any resource that must be explicitly released.
 *
 * Call `dispose()` to unregister subscriptions, clear state, or free references.
 * Implementations must make `dispose()` idempotent (safe to call multiple times).
 *
 * @hidden
 */
export interface IDisposable {
    dispose(): void;
}
