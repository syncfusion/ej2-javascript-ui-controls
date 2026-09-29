/**
 * ServiceToken<T> — branded symbol that uniquely identifies a service interface.
 *
 * The generic parameter `T` encodes the service type at compile time so that
 * `ServiceRegistry.resolve(token)` returns `T` without a manual cast.
 *
 * Create tokens with `createToken<T>(name)`:
 *   const eventBusToken = createToken<EventBus>('EventBus');
 *
 * @hidden
 */
export type ServiceToken<T> = symbol & { readonly serviceType: T };

/**
 * createToken — factory that produces a uniquely-keyed ServiceToken<T>.
 *
 * Two calls with the same `name` produce different tokens (Symbol is always unique).
 * The `name` is used only for diagnostics/error messages.
 *
 * @param {string} name - Diagnostic label for the token. Not used for identity.
 * @returns {ServiceToken} A unique symbol branded with the service type `T`.
 * @hidden
 */
export function createToken<T>(name: string): ServiceToken<T> {
    return Symbol(name) as ServiceToken<T>;
}

/**
 * tokenName — extracts the debug name from a ServiceToken.
 * Returns the string passed to createToken, or 'unknown' if unavailable.
 *
 * @param {ServiceToken} token - The token whose diagnostic name should be read.
 * @returns {string} The string passed to createToken, or 'unknown' if unavailable.
 * @hidden
 */
export function tokenName(token: ServiceToken<unknown>): string {
    // Cast via any — symbol.description is ES2019 but we target ES5 with lib:es2015
    const desc: string | undefined = (token as unknown as { description?: string }).description;
    return desc !== undefined ? desc : 'unknown';
}
