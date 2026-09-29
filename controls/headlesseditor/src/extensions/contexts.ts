/**
 * Extension Lifecycle Context Types
 *
 * Three phase-specific context types enforce compile-time accessibility guarantees.
 * Each lifecycle hook receives an appropriate context. TypeScript ensures properties
 * not available in a phase cannot be accessed.
 *
 * v1 excludes: ServiceRegistry, storage, async lifecycle.
 * Context types provide explicit named properties (not a service container).
 *
 */

import type { HeadlessEditor } from '../headless-editor/headless-editor';
import type { Selection } from '../model/selection';
import type { NodeDefinition } from '../schema/types/node-definition';
import type { MarkDefinition } from '../schema/types/mark-definition';
import type { Command } from '../commands/types';

/**
 * Narrow read-only interface for accessing schema information.
 * Extensions can inspect nodes and marks but not register new ones at runtime.
 */
export interface SchemaAccessor {
    /**
     * Get a node type by name.
     *
     * @param {string} name - The node type name
     * @returns {NodeDefinition | undefined} The node definition or undefined if not found
     */
    getNodeType(name: string): NodeDefinition | undefined;

    /**
     * Get a mark type by name.
     *
     * @param {string} name - The mark type name
     * @returns {MarkDefinition | undefined} The mark definition or undefined if not found
     */
    getMarkType(name: string): MarkDefinition | undefined;
}

/**
 * Narrow interface for extension command registration.
 * Internally delegates to CommandRegistry.
 */
export interface CommandRegistrar {
    /**
     * Register a command definition.
     *
     * @param {Command} definition - The command definition to register
     * @returns {void}
     */
    register(definition: Command): void;
}

/**
 * Narrow read-only interface for accessing selection state.
 */
export interface SelectionAccessor {
    /**
     * Get the current selection.
     *
     * @returns {Selection} The current Selection object
     */
    getCurrent(): Selection;

    /**
     * Check if a command or mark is active at the current selection.
     *
     * @param {string} commandName - The command or mark name to check
     * @returns {boolean} True if the command/mark is active, false otherwise
     */
    isActive(commandName: string): boolean;
}

/**
 * Generic event bus shape used by extension-to-extension communication.
 */
export type ExtensionEventBus = Record<string, unknown>;

/**
 * Phase 1: Registration Context.
 * Available during `onRegister()` lifecycle hook.
 */
export interface RegisterContext {
    /** The registering extension's unique name */
    readonly extensionName: string;

    /** Event bus for extension-to-extension communication (deferred: not in v1) */
    readonly events?: ExtensionEventBus;
}

/**
 * Phase 2: Ready Context.
 * Available during `onReady()` lifecycle hook.
 */
export interface ReadyContext extends RegisterContext {
    /** Read-only access to schema (nodes and marks) */
    readonly schema: SchemaAccessor;

    /** Read-only access to current selection */
    readonly selection: SelectionAccessor;

    /** The fully initialized editor instance */
    readonly editor: HeadlessEditor;

    /** Interface for registering commands (available now that editor is ready) */
    readonly commands: CommandRegistrar;
}
