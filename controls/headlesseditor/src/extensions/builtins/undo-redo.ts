/**
 * Undo Redo Extension
 *
 * Exposes the ProseMirror history plugin's undo/redo as editor commands.
 *
 * The PM history plugin itself is installed by EditorBuilder
 * (see src/editor/editor-builder.ts → createHistoryPlugin) and is
 * positioned at index 0 of the plugins array. This extension is only
 * responsible for registering the undo/redo commands into the
 * CommandRegistry so they are reachable via `editor.commands.undo()`
 * and `editor.commands.redo()`.
 *
 * The commands themselves are defined in
 * src/commands/builtins/history and delegate dispatch to PM's
 * `undo()` / `redo()` functions.
 */

import { defineExtension } from '../define-extension';
import { ExtensionDefinition } from '../types';
import { undoCommand, redoCommand } from '../../commands/builtins/history';
import type { Command } from '../../commands/types';

/**
 * History plugin configuration options.
 */
export interface UndoRedoOptions {
    /** Maximum depth of the undo history stack (default: 30) */
    depth?: number;
    /** Time in milliseconds after which new edits form a new history group (default: 300) */
    newGroupDelay?: number;
}

/**
 * Extension definition that registers the undo and redo commands into the editor.
 */
export const undoRedoExtension: ExtensionDefinition<UndoRedoOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'undoRedo',

    /**
     * Defines the default configuration options for the history extension.
     *
     * @returns {HistoryPluginConfig} The default depth and new group delay values.
     * @property {number} depth - Maximum depth of the undo history stack (default: 30).
     * @property {number} newGroupDelay - Time in milliseconds after which new edits form a new history group (default: 300).
     */
    defineOptions(): UndoRedoOptions {
        return {
            depth: 30,
            newGroupDelay: 300
        };
    },

    /**
     * Contributes the `undo` and `redo` commands for programmatic
     * history navigation. Both delegate to PM's native undo/redo.
     *
     * @returns {Command[]} Array containing the undo and redo commands.
     */
    commands(): Command[] {
        return [undoCommand, redoCommand];
    },

    /**
     * Contributes keyboard shortcuts for history navigation.
     * Maps Mod-z to undo and Mod-y to redo.
     *
     * @returns {Object} Keyboard shortcut entries.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-z': () => this.editor.commands.undo(),
            'Mod-y': () => this.editor.commands.redo()
        };
    }
});

export default undoRedoExtension;
