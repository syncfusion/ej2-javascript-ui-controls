/**
 * Executes extension lifecycle hooks.
 *
 * Responsible for invoking extension lifecycle methods in the correct order:
 *
 *   Register → Ready → Destroy
 *
 * Each lifecycle hook is optional. If a hook is not implemented, the extension
 * simply advances to the next lifecycle state.
 *
 */

import type { ExtensionConfig, FlattenedExtension } from './types';
import { ExtensionLifecycleState } from './types';

/** Tracks the current lifecycle state of every extension. */
export type LifecycleStateTracker = Record<string, ExtensionLifecycleState>;

export class LifecycleRunner {

    /** Current lifecycle state of each extension. */
    private readonly stateTracker: LifecycleStateTracker = {};

    /**
     * Executes the register phase.
     *
     * Invokes each extension's optional `onRegister()` hook.
     *
     * @param {FlattenedExtension[]} extensions - Extensions to register.
     * @returns {void}
     * @hidden
     */
    public runRegister(extensions: readonly FlattenedExtension[]): void {
        for (const extension of extensions) {
            this.executeLifecycleHook(extension, 'onRegister', ExtensionLifecycleState.Registered);
        }
    }

    /**
     * Executes the ready phase.
     *
     * Invokes each extension's optional `onReady()` hook.
     *
     * @param {FlattenedExtension[]} extensions - Registered extensions.
     * @returns {void}
     * @hidden
     */
    public runReady(extensions: readonly FlattenedExtension[]): void {
        for (const extension of extensions) {

            // Only registered extensions can enter the Ready phase.
            if (this.getState(extension.definition.name) !== ExtensionLifecycleState.Registered) {
                continue;
            }
            this.executeLifecycleHook(extension, 'onReady', ExtensionLifecycleState.Ready);
        }
    }

    /**
     * Executes the destroy phase.
     *
     * Hooks are executed in reverse registration order.
     *
     * @param {FlattenedExtension[]} extensions - Extensions to destroy.
     * @returns {void}
     * @hidden
     */
    public runDestroy(extensions: readonly FlattenedExtension[]): void {
        for (let index: number = extensions.length - 1; index >= 0; index--) {
            this.executeLifecycleHook(extensions[index as number], 'onDestroy', ExtensionLifecycleState.Destroyed
            );
        }
    }

    /**
     * Returns the lifecycle state of an extension.
     *
     * @param {string} extensionName - Extension name.
     * @returns {ExtensionLifecycleState | undefined} Current lifecycle state.
     * @hidden
     */
    public getState(extensionName: string): ExtensionLifecycleState | undefined {
        return this.stateTracker[extensionName as string];
    }

    /**
     * Returns a copy of all lifecycle states.
     *
     * @returns {LifecycleStateTracker} Lifecycle state snapshot.
     * @hidden
     */
    public getAllStates(): LifecycleStateTracker {
        return { ...this.stateTracker };
    }

    /**
     * Clears all lifecycle state.
     *
     * @returns {void}
     * @hidden
     */
    public reset(): void {
        Object.keys(this.stateTracker).forEach((extensionName: string) => {
            delete this.stateTracker[extensionName as string];
        });
    }

    /**
     * Executes a lifecycle hook for an extension.
     *
     * If the requested hook is not implemented, the extension is simply moved
     * to the supplied lifecycle state.
     *
     * @param {FlattenedExtension} extension - Extension being processed.
     * @param {'onRegister' | 'onReady' | 'onDestroy'} hookName - Lifecycle hook to execute.
     * @param {ExtensionLifecycleState} completedState - State after successful execution.
     * @returns {void}
     */
    private executeLifecycleHook(extension: FlattenedExtension, hookName: 'onRegister' | 'onReady' | 'onDestroy', completedState: ExtensionLifecycleState): void {
        // Read the extension name.
        const extensionName: string = extension.definition.name;
        // Read the requested lifecycle hook.
        const lifecycleHook: ExtensionConfig[typeof hookName] = extension.definition.config[hookName as 'onRegister' | 'onReady' | 'onDestroy'];
        // Lifecycle hooks are optional.
        if (!lifecycleHook) {
            this.stateTracker[extensionName as string] = completedState;
            return;
        }
        try {
            // Execute the lifecycle hook.
            lifecycleHook();
            // Record the completed lifecycle state.
            this.stateTracker[extensionName as string] = completedState;
        } catch (error: unknown) {
            // Mark the extension as failed.
            this.stateTracker[extensionName as string] = ExtensionLifecycleState.Failed;
            throw new Error(`Extension "${extensionName}" failed during ${hookName}: ${error instanceof Error ? error.message : String(error)}`
            );
        }
    }
}
