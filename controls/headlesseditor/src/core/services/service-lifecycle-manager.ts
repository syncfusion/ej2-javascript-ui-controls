import { IDisposable } from '../events/types';
import { ServiceToken, tokenName } from './service-token';
import { ServiceState } from './service-state';
import { CircularDependencyError } from './service-errors';

// ── ManagedService ────────────────────────────────────────────────────────────

/**
 * ManagedService — contract that lifecycle-managed services must implement.
 *
 * @hidden
 */
export interface ManagedService extends IDisposable {
    initialize(): void;
    /** Optional dependency tokens this service requires. */
    readonly dependencies?: ReadonlyArray<ServiceToken<unknown>>;
}

// ── Internal registration entry ───────────────────────────────────────────────

/**
 * Options used internally for registration entry.
 *
 * @hidden
 */
interface ServiceEntry {
    token: ServiceToken<unknown>;
    service: ManagedService;
    state: ServiceState;
}

// ── ServiceLifecycleManager ───────────────────────────────────────────────────

/**
 * ServiceLifecycleManager — coordinates initialization and disposal of all
 * managed services in dependency order.
 *
 * Bootstrap singletons (DiagnosticsService, EventBus) are NOT registered here.
 * They are disposed directly by the editor teardown sequence.
 *
 * @hidden
 */
export class ServiceLifecycleManager implements IDisposable {
    private readonly entries: Map<symbol, ServiceEntry> = new Map();
    private initOrder: ServiceEntry[] = [];
    private disposed: boolean = false;

    // ── Registration ──────────────────────────────────────────────────────────

    /**
     * Adds a managed service. Must be called before `initializeAll()`.
     *
     * @param {ServiceToken} token - The token that uniquely identifies the service.
     * @param {ManagedService} service - The service instance to register.
     * @returns {void}
     * @hidden
     */
    public addService<T extends ManagedService>(token: ServiceToken<T>, service: T): void {
        const key: symbol = token as unknown as symbol;
        this.entries.set(key, {
            token: token as ServiceToken<unknown>,
            service,
            state: ServiceState.Uninitialized
        });
    }

    // ── Initialization ────────────────────────────────────────────────────────

    /**
     * Initializes all registered services in topological dependency order.
     * Throws `CircularDependencyError` before any service is initialized if a cycle exists.
     * Throws if any service is already in `Running` state.
     *
     * @returns {void}
     * @hidden
     */
    public initializeAll(): void {
        this.assertNotDisposed();
        this.initOrder = this.topologicalSort();

        for (const entry of this.initOrder) {
            if (entry.state === ServiceState.Running) {
                throw new Error(
                    `Service "${tokenName(entry.token)}" is already running. Cannot initialize twice.`
                );
            }
            entry.state = ServiceState.Initializing;
            entry.service.initialize();
            entry.state = ServiceState.Running;
        }
    }

    // ── Disposal ──────────────────────────────────────────────────────────────

    /**
     * Disposes all running services in reverse initialization order.
     * Errors during individual disposal are caught and logged; remaining services still disposed.
     *
     * @param {Function} [onError] - Optional callback invoked when a service throws during disposal.
     * @returns {void}
     * @hidden
     */
    public disposeAll(onError?: (token: ServiceToken<unknown>, err: unknown) => void): void {
        const reversedOrder: ServiceEntry[] = [...this.initOrder].reverse();

        for (const entry of reversedOrder) {
            if (entry.state !== ServiceState.Running) {
                continue;
            }
            entry.state = ServiceState.Disposing;
            try {
                entry.service.dispose();
                entry.state = ServiceState.Disposed;
            } catch (err) {
                entry.state = ServiceState.Disposed;
                if (onError) {
                    onError(entry.token, err);
                }
            }
        }
    }

    /**
     * IDisposable implementation — triggers disposeAll() and releases state.
     *
     * @returns {void}
     * @hidden
     */
    public dispose(): void {
        if (this.disposed) {
            return;
        }
        this.disposed = true;
        this.disposeAll();
        this.entries.clear();
        this.initOrder = [];
    }

    // ── Topological sort ──────────────────────────────────────────────────────

    private topologicalSort(): ServiceEntry[] {
        const result: ServiceEntry[] = [];
        const visited: Set<symbol> = new Set<symbol>();
        const visiting: Set<symbol> = new Set<symbol>();

        const visit: (key: symbol) => void = (key: symbol): void => {
            if (visited.has(key)) {
                return;
            }
            if (visiting.has(key)) {
                const getDesc: (s: symbol) => string = (s: symbol): string =>
                    ((s as unknown as { description?: string }).description) ?? 'unknown';
                const cycle: string[] = Array.from(visiting).map(getDesc);
                cycle.push(getDesc(key as symbol));
                throw new CircularDependencyError(cycle);
            }

            visiting.add(key);
            const entry: ServiceEntry | undefined = this.entries.get(key);
            if (entry?.service.dependencies) {
                for (const depToken of entry.service.dependencies) {
                    const depKey: symbol = depToken as unknown as symbol;
                    if (this.entries.has(depKey)) {
                        visit(depKey);
                    }
                }
            }
            visiting.delete(key);
            visited.add(key);

            if (entry) {
                result.push(entry);
            }
        };

        Array.from(this.entries.keys()).forEach((key: symbol) => visit(key));

        return result;
    }

    private assertNotDisposed(): void {
        if (this.disposed) {
            throw new Error('ServiceLifecycleManager has been disposed.');
        }
    }
}
