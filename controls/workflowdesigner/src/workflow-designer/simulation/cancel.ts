/**
 * Helpers for cancelable events whose `cancel` may be a boolean or a promise of one.
 *
 * @private
 */

/**
 * Whether a value is a promise (or another thenable).
 *
 * @param {unknown} value - The value.
 * @returns {boolean} `true` for a thenable.
 * @private
 */
export function isPromiseLike(value: unknown): value is PromiseLike<unknown> {
    return !!value && (typeof value === 'object' || typeof value === 'function')
        && typeof (value as { then?: unknown }).then === 'function';
}

/**
 * Resolves an event's `cancel` value. A rejected promise counts as cancelled, so a failing
 * confirmation never lets the action through.
 *
 * @param {unknown} cancel - The `cancel` value set by handlers.
 * @returns {Promise<boolean>} Whether the action was cancelled.
 * @private
 */
export function resolveCancel(cancel: unknown): Promise<boolean> {
    if (!isPromiseLike(cancel)) {
        return Promise.resolve(!!cancel);
    }
    return Promise.resolve(cancel).then((value: unknown) => !!value, () => true);
}
