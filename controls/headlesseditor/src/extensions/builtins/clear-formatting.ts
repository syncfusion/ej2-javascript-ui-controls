/**
 * Clear Formatting Extension
 *
 * Provides a single `clearFormatting` command that strips all inline marks
 * from the current selection and resets block nodes (like headings) to
 * paragraphs. Contributes no schema definitions and no DOM rendering —
 * it is a pure command extension.
 *
 * - Single command (no keymap, no input rule, no paste rule)
 * - Stateless: no `defineOptions`, no `domSpecs`
 */

import { defineExtension } from '../define-extension';
import { ExtensionDefinition } from '../types';
import { clearFormattingCommand } from '../../commands/builtins/formatting/clear-formatting';
import type { Command } from '../../commands/types';

export const clearFormattingExtension: ExtensionDefinition = defineExtension({
    /** Unique extension identifier */
    name: 'clearFormatting',

    /**
     * Contributes the `clearFormatting` command for stripping all formatting.
     *
     * @returns {Command[]} Command array
     */
    commands(): Command[] {
        return [clearFormattingCommand];
    },

    /**
     * Contributes keyboard shortcuts for clear formatting.
     * Maps Mod-\ to clearFormatting command.
     *
     * @returns {Object} Keyboard shortcut entries.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-\\': () => this.editor.commands.clearFormatting()
        };
    }
});

export default clearFormattingExtension;
