/**
 * Coordinates extension registration and lifecycle execution.
 *
 * The ExtensionManager is the central orchestrator for managing extensions throughout
 * their lifecycle. It coordinates the ExtensionResolver and LifecycleRunner to provide
 * a unified API for extension management, including registration, initialization,
 * readiness, and destruction phases.
 *
 * Lifecycle phases:
 * 1. **Registration** — Resolves and flattens extensions via the resolver
 * 2. **Initialization** — Executes onInitialize hooks with engine context
 * 3. **Ready** — Executes onReady hooks when the editor is fully operational
 * 4. **Destruction** — Cleans up extensions via onDestroy hooks in LIFO order
 *
 * @module extensions/extension-manager
 */

import type { ExtensionDefinition, FlattenedExtension } from './types';
import { ExtensionLifecycleState } from './types';
import { ExtensionResolver } from './extension-resolver';
import { LifecycleRunner } from './lifecycle-runner';
import type { ReadyContext } from './contexts';

/**
 * Manages extension registration and lifecycle.
 *
 * This class serves as the main public API for the extension system, providing
 * a stateful orchestrator that tracks extensions through their lifecycle phases.
 * All operations are idempotent and follow a strict state machine pattern.
 *
 * @example
 * ```typescript
 * const manager = new ExtensionManager(extensions);
 * manager.register();
 * manager.initialize(initContext);
 * manager.ready(readyContext);
 *
 * if (manager.isReady()) {
 *   // Editor is fully operational
 * }
 *
 * // Cleanup
 * manager.destroy();
 * ```
 */
export class ExtensionManager {
    /** Resolver instance for flattening and deduplicating extensions */
    private readonly resolver: ExtensionResolver;

    /** Lifecycle runner for executing extension hooks */
    private readonly lifecycleRunner: LifecycleRunner;

    /** Original extensions provided to the manager */
    private readonly extensions: readonly ExtensionDefinition<object>[];

    /** Flattened and resolved extensions after registration */
    private flattenedExtensions: FlattenedExtension[] = [];

    /** Flag indicating whether registration has completed */
    private registered: boolean = false;

    /** Flag indicating whether extensions are in ready state */
    private readyState: boolean = false;

    /**
     * Creates a new ExtensionManager.
     *
     * Initializes the resolver and lifecycle runner, storing the provided extensions
     * for later registration. The manager starts in an unregistered state.
     *
     * @param {ExtensionDefinition[]} extensions - Extensions to manage - Defaults to empty array.
     *
     */
    constructor(extensions: readonly ExtensionDefinition<object>[] = []) {
        this.extensions = extensions;
        this.resolver = new ExtensionResolver();
        this.lifecycleRunner = new LifecycleRunner();
    }

    /**
     * Resolves and registers all extensions.
     *
     * Flattens the extension tree (including nested extensions) and executes the registration phase.
     * This is an idempotent operation.
     * calling it multiple times has no additional effect after the first successful call.
     *
     * @returns {void} No return value.
     * @hidden
     */
    public register(): void {
        if (this.registered) {
            return;
        }
        this.flattenedExtensions = this.resolver.resolve(this.extensions);
        this.lifecycleRunner.runRegister(this.flattenedExtensions);
        this.registered = true;
    }

    /**
     * Marks all extensions as ready.
     *
     * Executes the ready phase for all registered extensions, signaling that
     * the editor is fully operational. Must be called after register() succeeds.
     * This operation is idempotent — subsequent calls have no effect.
     *
     * @returns {void} No return value.
     * @hidden
     */
    public ready(): void {
        if (!this.registered) {
            throw new Error('Extensions must be registered before ready.');
        }
        if (this.readyState) {
            return;
        }
        this.lifecycleRunner.runReady(this.flattenedExtensions);
        this.readyState = true;
    }

    /**
     * Destroys all registered extensions.
     *
     * Executes destruction hooks in LIFO (reverse registration) order and resets
     * the manager to its initial state. The manager can be reused by calling
     * register() again after destruction.
     *
     * @returns {void} No return value.
     * @hidden
     */
    public destroy(): void {
        this.lifecycleRunner.runDestroy(this.flattenedExtensions);
        this.flattenedExtensions = [];
        this.registered = false;
        this.readyState = false;
    }

    /**
     * Gets all resolved extensions.
     *
     * Returns the flattened list of extensions in their registration order.
     * Only available after register() has been called.
     *
     * @returns {FlattenedExtension[]} Registered extensions in registration order.
     * @hidden
     */
    public getExtensions(): readonly FlattenedExtension[] {
        return this.flattenedExtensions;
    }

    /**
     * Gets the lifecycle state of an extension.
     *
     * Retrieves the current lifecycle phase (e.g., Registered, Initialized, Ready)
     * for a specific extension. Returns undefined if the extension is not tracked.
     *
     * @param {string} extensionName - Name of the extension to query.
     * @returns {ExtensionLifecycleState | undefined} State of the extension, or undefined if not found.
     * @hidden
     */
    public getState(extensionName: string): ExtensionLifecycleState | undefined {
        return this.lifecycleRunner.getState(extensionName);
    }

    /**
     * Returns whether registration has completed.
     *
     * @returns {boolean} True if register() has been called successfully.
     * @hidden
     */
    public isRegistered(): boolean {
        return this.registered;
    }

    /**
     * Returns whether extensions are ready.
     *
     * @returns {boolean} True if ready() has been called successfully.
     * @hidden
     */
    public isReady(): boolean {
        return this.readyState;
    }

    /**
     * Checks if a specific extension is in the Registered state.
     *
     * @param {string} extensionName - Name of the extension to check.
     * @returns {boolean} True if the extension is registered and not failed.
     * @hidden
     */
    public isExtensionRegistered(extensionName: string): boolean {
        return this.getState(extensionName) === ExtensionLifecycleState.Registered;
    }
}
