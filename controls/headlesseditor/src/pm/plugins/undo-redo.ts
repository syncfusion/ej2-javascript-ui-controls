/**
 * undo-redo.ts — History plugin wrapper for ProseMirror undo/redo.
 *
 * This module wraps prosemirror-history's `history()` function with
 * configurable depth and grouping settings. The history plugin tracks
 * editor state changes and provides undo/redo functionality through
 * PM's native history mechanism (undo() and redo() functions).
 *
 * **Configuration:**
 * - depth: Maximum number of history steps (default 100; depth 0 disables history)
 * - newGroupDelay: Time in milliseconds after which new edits form a new history group (default 500ms)
 *   When the user pauses typing for `newGroupDelay`, the next keystroke starts a new group.
 *   This prevents every character from creating its own undo step; multiple keystrokes within
 *   the window are grouped as one undo event (standard editor behavior).
 *
 * **Plugin Ordering Requirement:**
 * History plugin MUST be positioned first in the plugins array (index 0).
 * This ensures all transactions are seen by the history plugin before being processed
 * by other plugins. If history is not first, it may miss transactions and produce
 * incomplete or inconsistent undo history.
 *
 * **Usage:**
 * ```typescript
 * const historyPlugin = createHistoryPlugin();
 * const plugins = [historyPlugin, ...otherPlugins];
 * ```
 *
 * @module pm/plugins/history
 */

import { history as pmHistory, PMPlugin } from '../pm-guard';

/**
 * History plugin configuration options.
 */
interface HistoryPluginConfig {
    /** Maximum depth of the undo history stack (default: 100) */
    depth?: number;
    /** Time in milliseconds after which new edits form a new history group (default: 500) */
    newGroupDelay?: number;
}

/**
 * Creates a configured ProseMirror history plugin.
 *
 * Wraps prosemirror-history's `history()` function with standard configuration
 * for the Headless Editor. The returned plugin handles undo/redo state tracking
 * and is delegated to by undo/redo commands.
 *
 * @param {HistoryPluginConfig} [config] - Optional configuration overrides
 * @returns {PMPlugin} A configured ProseMirror history plugin
 *
 * @example
 * ```typescript
 * const historyPlugin = createHistoryPlugin({ depth: 50 });
 * ```
 */
export function createHistoryPlugin(config?: HistoryPluginConfig): PMPlugin {
    const depth: number = config?.depth ?? 100;
    const newGroupDelay: number = config?.newGroupDelay ?? 500;
    return pmHistory({ depth, newGroupDelay });
}

/**
 * Export the default history plugin with standard configuration.
 *
 * This is a convenience export for the common case where default settings are used.
 * For custom configuration, use `createHistoryPlugin({ depth: N, newGroupDelay: M })`.
 *
 * @see createHistoryPlugin
 */
export const historyPlugin: PMPlugin = createHistoryPlugin();
