/**
 * Underline Extension
 *
 * Provides semantic underline text formatting as an inline mark
 * (rendered as `<u>`) with:
 * - Toggle command
 * - Customizable HTML attributes
 *
 * Note: Underline has no standard Markdown shorthand (``_text_`` and
 * ``__text__`` are already taken by italic and bold).
 */

import { defineExtension } from '../define-extension';
import type { MarkDefinition } from '../../core/schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleUnderlineCommand } from './commands/toggle-underline';
import { createMarkRule } from '../inputrules/mark-input-rule';
import type { Command } from '../../core/commands/types';

/**
 * Underline extension for the Syncfusion Headless Editor.
 *
 * Provides semantic underline text formatting using the `<u>` HTML tag. Enables users to apply
 * underline styling to text through the toggleUnderline command or via keyboard shortcut (Ctrl+U / Cmd+U).
 * Supports input rules for automatic underline conversion from markup-style markers (++text++).
 *
 * **Note:** Underline has no standard Markdown shorthand since * and _ are already reserved for bold and italic.
 * This extension uses ++ markers for Markdown-style conversion.
 *
 * **Contributes:**
 * - `underline` mark type with inclusive boundary behavior
 * - `toggleUnderline` command for programmatic underline formatting
 * - Input rules for markup-style underline syntax (++text++)
 * - DOM specs for rendering as `<u>` elements
 * - Keyboard shortcuts: Ctrl+U and Cmd+U
 *
 * **Supported HTML attributes:**
 * Can be customized through extension options to add custom attributes to the `<u>` element.
 *
 * @type {ExtensionDefinition<ExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with underline extension
 * const editor = HeadlessEditor.create({
 *   extensions: [underlineExtension]
 * });
 *
 * // Apply underline via command
 * editor.commands.toggleUnderline();
 *
 * // Use keyboard shortcut: Ctrl+U (Windows/Linux) or Cmd+U (Mac)
 * // Type ++text++ to auto-convert to underline
 * ```
 *
 * @see toggleUnderlineCommand for direct command usage
 * @see ExtensionOptions for configuration options
 */
export const underlineExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier used to register and reference this extension.
     *
     * @type {string}
     */
    name: 'underline',

    /**
     * Defines the default configuration options for the Underline extension.
     *
     * Returns an object containing htmlAttributes that can be applied to the `<u>` element.
     *
     * @returns {ExtensionOptions} Default option values with empty htmlAttributes object.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `underline` mark type with inclusive boundary behavior.
     *
     * The underline mark includes text at its boundaries, allowing underline to extend when adjacent text
     * is also marked as underline, preventing gaps in underline styling across the document.
     *
     * @returns {MarkDefinition[]} Array containing a single underline mark definition with inclusive: true.
     */
    marks(): MarkDefinition[] {
        return [
            {
                name: 'underline',
                inclusive: true
            }
        ];
    },

    /**
     * Registers the `toggleUnderline` command for programmatic underline formatting.
     *
     * The toggleUnderline command allows programmatic application or removal of underline styling
     * to the current selection or active mark.
     *
     * @returns {Command[]} Array containing the toggleUnderline command definition.
     */
    commands(): Command[] {
        return [toggleUnderlineCommand];
    },

    /**
     * Defines input rules that convert markup-style underline syntax to underline marks.
     *
     * Automatically converts ++text++ (double plus signs) to underline marks as the user types.
     * Supports undo/redo operations for automatic underline conversions.
     *
     * @returns {InputRuleDefinition[]} Array of input rule definitions for underline syntax.
     */
    inputRules(): readonly InputRuleDefinition[] {
        return [
            createMarkRule({
                id: 'mark:underline',
                pattern: /(^|\s)\+\+([^+]+)\+\+$/,
                target: 'underline',
                allowUndo: true
            })
        ];
    },

    /**
     * Defines DOM specifications for rendering underline marks as `<u>` elements.
     *
     * Configures how underline marks are serialized to DOM (using `<u>` tag) and
     * how DOM elements are parsed back into underline marks. Applies configured HTML attributes
     * to the generated `<u>` element.
     *
     * @param {ExtensionScope<ExtensionOptions>} this - The extension scope providing access to options.
     * @returns {ExtensionDOMSpecs} DOM specs with underline mark rendering definitions.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const attrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        const descriptor: DOMOutputDescriptor = ['u', attrs, 0];
        return {
            marks: {
                underline: {
                    toDOM: (): DOMOutputDescriptor => {
                        return descriptor;
                    },
                    parseDOM: [
                        { tag: 'u' },
                        { style: 'text-decoration', getAttrs: (value: string) => /underline/.test(value as string) && null }
                    ]
                }
            }
        };
    },

    /**
     * Registers keyboard shortcuts for underline formatting.
     *
     * Maps both Ctrl/Cmd + U (lowercase) and Ctrl/Cmd + Shift + U (uppercase) to the toggleUnderline command,
     * allowing users to quickly toggle underline formatting with standard keyboard shortcuts.
     *
     * @returns {Object} Keyboard shortcut mapping.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-u': () => this.editor.commands.toggleUnderline(),
            'Mod-U': () => this.editor.commands.toggleUnderline()
        };
    }
});

export default underlineExtension;
