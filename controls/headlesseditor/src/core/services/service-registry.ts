import { IDisposable } from '../events/types';
import { ServiceToken, tokenName } from './service-token';
import {
    DuplicateServiceError,
    ServiceNotFoundError,
    CircularDependencyError
} from './service-errors';

/**
 * Options used internally when registering services.
 *
 * @hidden
 */
export interface RegisterOptions {
    /** When true, replaces an existing registration for the same token. */
    override?: boolean;
}

// ── ServiceRegistry ───────────────────────────────────────────────────────────

/**
 * ServiceRegistry — type-safe container for runtime service instances.
 *
 * - `register<T>(token, instance)` — stores the instance keyed by token.
 * - `resolve<T>(token)` — retrieves the instance; throws if missing.
 * - `tryResolve<T>(token)` — retrieves or returns `undefined`.
 * - `listTokens()` — returns all registered tokens (used by lifecycle manager).
 *
 * @hidden
 */
export class ServiceRegistry implements IDisposable {
    private readonly entries: Map<symbol, unknown> = new Map();
    private disposed: boolean = false;

    // Active resolution chain for circular-dep detection
    private readonly resolving: Set<symbol> = new Set();

    // ── Registration ──────────────────────────────────────────────────────────

    /**
     * Registers a service instance for a token.
     *
     * @param {ServiceToken<T>} token - The service token used as the lookup key.
     * @param {T} instance - The service instance to store.
     * @param {RegisterOptions} [options] - Registration options such as override behavior.
     * @returns {void}
     * @hidden
     */
    public register<T>(
        token: ServiceToken<T>,
        instance: T,
        options: RegisterOptions = {}
    ): void {
        this.assertNotDisposed();
        const key: symbol = token as unknown as symbol;
        if (this.entries.has(key) && !options.override) {
            throw new DuplicateServiceError(tokenName(token as ServiceToken<unknown>));
        }
        this.entries.set(key, instance);
    }

    // ── Resolution ────────────────────────────────────────────────────────────
    /**
     * Resolves a registered service instance by token.
     *
     * @param {ServiceToken<T>} token - Service token used to look up the instance.
     * @returns {T} The registered service instance.
     * @hidden
     */
    public resolve<T>(token: ServiceToken<T>): T {
        this.assertNotDisposed();
        const key: symbol = token as unknown as symbol;

        if (this.resolving.has(key)) {
            const cycle: string[] = Array.from(this.resolving).map(
                (s: symbol) => ((s as unknown as { description?: string }).description) ?? 'unknown'
            );
            cycle.push(tokenName(token as ServiceToken<unknown>));
            throw new CircularDependencyError(cycle);
        }

        if (!this.entries.has(key)) {
            throw new ServiceNotFoundError(tokenName(token as ServiceToken<unknown>));
        }

        this.resolving.add(key);
        try {
            return this.entries.get(key) as T;
        } finally {
            this.resolving.delete(key);
        }
    }
    /**
     * Resolves a service if it exists without throwing when missing.
     *
     * @param {ServiceToken<T>} token - Service token to resolve.
     * @returns {T | undefined} The registered service instance, or undefined if it is missing or the registry is disposed.
     * @hidden
     */
    public tryResolve<T>(token: ServiceToken<T>): T | undefined {
        if (this.disposed) {
            return undefined;
        }
        const key: symbol = token as unknown as symbol;
        if (!this.entries.has(key)) {
            return undefined;
        }
        return this.entries.get(key) as T;
    }

    // ── Enumeration ───────────────────────────────────────────────────────────
    /**
     * Lists all registered service tokens.
     *
     * @returns {ServiceToken<unknown>[]} The service tokens currently registered in the registry.
     * @hidden
     */
    public listTokens(): ServiceToken<unknown>[] {
        return Array.from(this.entries.keys()) as unknown as ServiceToken<unknown>[];
    }

    // ── Dispose ───────────────────────────────────────────────────────────────
    /**
     * Disposes the registry and clears all tracked service entries.
     *
     * @returns {void}
     * @hidden
     */
    public dispose(): void {
        if (this.disposed) {
            return;
        }
        this.disposed = true;
        this.entries.clear();
        this.resolving.clear();
    }

    // ── Private ───────────────────────────────────────────────────────────────

    /**
     * Ensures the registry has not already been disposed.
     *
     * @returns {void}
     */
    private assertNotDisposed(): void {
        if (this.disposed) {
            throw new ServiceNotFoundError('(registry disposed)');
        }
    }
}
