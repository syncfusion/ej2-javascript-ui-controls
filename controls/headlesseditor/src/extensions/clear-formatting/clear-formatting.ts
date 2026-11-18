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
import { clearFormattingCommand } from './commands/clear-formatting';
import type { Command } from '../../core/commands/types';

/**
 * Clear formatting extension for the Syncfusion Headless Editor.
 *
 * Provides a single `clearFormatting` command that strips all inline marks (bold, italic,
 * underline, strikethrough, code, links, highlights) from the current selection and resets
 * block nodes (like headings and blockquotes) to plain paragraphs. Contributes no schema
 * definitions and no DOM rendering — it is a pure command extension.
 *
 * **Contributes:**
 * - `clearFormatting` command for removing all inline and block formatting
 * - Keyboard shortcut (Ctrl/Cmd + \\) for quick access
 * - No marks, nodes, or DOM specs (stateless command extension)
 *
 * Removed formatting includes:
 * - Inline marks: bold, italic, underline, strikethrough, inline code, links, highlights
 * - Block attributes: heading levels, blockquote nesting
 *
 * @type {ExtensionDefinition}
 *
 * @example
 * ```typescript
 * // Create editor with clear formatting extension
 * const editor = HeadlessEditor.create({
 *   extensions: [basicExtensions, clearFormattingExtension]
 * });
 *
 * // Apply mixed formatting to text
 * editor.commands.toggleBold();
 * editor.commands.toggleHeading(2);
 *
 * // Strip all formatting at once
 * editor.commands.clearFormatting();
 * // Press Ctrl/Cmd + \ for keyboard access
 * ```
 *
 * @see clearFormattingCommand for direct command usage
 */
export const clearFormattingExtension: ExtensionDefinition = defineExtension({
    /**
     * Unique extension identifier used to register and reference this extension.
     *
     * @type {string}
     */
    name: 'clearFormatting',

    /**
     * Contributes the `clearFormatting` command for stripping all formatting.
     *
     * The clearFormatting command removes all inline marks from the current selection
     * and resets block nodes (like headings) to paragraphs.
     *
     * @returns {Command[]} Array containing the clearFormatting command definition.
     */
    commands(): Command[] {
        return [clearFormattingCommand];
    },

    /**
     * Registers keyboard shortcuts for clearing formatting.
     *
     * Maps Ctrl/Cmd + \\ to the clearFormatting command, allowing users to quickly
     * remove all formatting with a standard keyboard shortcut.
     *
     * @returns {Object} Keyboard shortcut mapping.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-\\': () => this.editor.commands.clearFormatting()
        };
    }
});

export default clearFormattingExtension;
