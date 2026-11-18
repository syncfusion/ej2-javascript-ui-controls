/**
 * EditorLifecycleError — typed error for invalid Editor lifecycle transitions.
 *
 * Canonical messages:
 *   "Editor not initialized"   — mount() called before create()
 *   "Editor already mounted"   — mount() called on an already-mounted editor
 *   "Editor has been destroyed" — any operation after destroy()
 */
export class EditorLifecycleError extends Error {
    public readonly name: string = 'EditorLifecycleError';

    constructor(message: string) {
        super(message);
        // Restore prototype chain (required when targeting ES5/ES2015 with tsc)
        Object.setPrototypeOf(this, EditorLifecycleError.prototype);
    }
}
