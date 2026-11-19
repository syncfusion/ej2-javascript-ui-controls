/**
 * Italic Extension
 *
 * Provides semantic italic text formatting (`<em>`) with:
 * - Toggle command
 * - Customizable HTML attributes
 */

import { defineExtension } from '../define-extension';
import type { MarkDefinition } from '../../core/schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleItalicCommand } from './commands/toggle-italic';
import { createMarkRule } from '../inputrules/mark-input-rule';
import type { Command } from '../../core/commands/types';

/**
 * Italic extension for the Syncfusion Headless Editor.
 *
 * Provides semantic italic text formatting using the `<em>` HTML tag. Enables users to apply
 * italic styling to text through the toggleItalic command or via keyboard shortcut (Ctrl+I / Cmd+I).
 * Supports input rules for automatic italic conversion from Markdown-style markers (*text* or _text_).
 *
 * **Contributes:**
 * - `italic` mark type with inclusive boundary behavior
 * - `toggleItalic` command for programmatic italic formatting
 * - Input rules for Markdown-style italic syntax (*text* and _text_)
 * - DOM specs for rendering as `<em>` elements
 * - Keyboard shortcuts: Ctrl+I and Cmd+I
 *
 * **Supported HTML attributes:**
 * Can be customized through extension options to add custom attributes to the `<em>` element.
 *
 * @type {ExtensionDefinition<ExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with italic extension
 * const editor = HeadlessEditor.create({
 *   extensions: [italicExtension]
 * });
 *
 * // Apply italic via command
 * editor.commands.toggleItalic();
 *
 * // Use keyboard shortcut: Ctrl+I (Windows/Linux) or Cmd+I (Mac)
 * ```
 *
 * @see toggleItalicCommand for direct command usage
 * @see ExtensionOptions for configuration options
 */
export const italicExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier used to register and reference this extension.
     *
     * @type {string}
     */
    name: 'italic',

    /**
     * Defines the default configuration options for the Italic extension.
     *
     * Returns an object containing htmlAttributes that can be applied to the `<em>` element.
     *
     * @returns {ExtensionOptions} Default option values with empty htmlAttributes object.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `italic` mark type with inclusive boundary behavior.
     *
     * The italic mark includes text at its boundaries, allowing italic to extend when adjacent text
     * is also marked as italic, preventing gaps in italic styling across the document.
     *
     * @returns {MarkDefinition[]} Array containing a single italic mark definition with inclusive: true.
     */
    marks(): MarkDefinition[] {
        return [
            {
                name: 'italic',
                inclusive: true
            }
        ];
    },

    /**
     * Registers the `toggleItalic` command for programmatic italic formatting.
     *
     * The toggleItalic command allows programmatic application or removal of italic styling
     * to the current selection or active mark.
     *
     * @returns {Command[]} Array containing the toggleItalic command definition.
     */
    commands(): Command[] {
        return [toggleItalicCommand];
    },

    /**
     * Defines input rules that convert Markdown-style italic syntax to italic marks.
     *
     * Automatically converts *text* (single asterisks) and _text_ (single underscores)
     * to italic marks as the user types, following standard Markdown conventions.
     *
     * @returns {InputRuleDefinition[]} Array of input rule definitions for italic syntax.
     */
    inputRules(): readonly InputRuleDefinition[] {
        return [
            createMarkRule({
                id: 'mark:italic-star',
                pattern: /(?:^|\s)\*([^*\s][^*]*)\*$/,
                target: 'italic'
            }),
            createMarkRule({
                id: 'mark:italic-underscore',
                pattern: /(?:^|\s)_([^_\s][^_]*)_$/,
                target: 'italic'
            })
        ];
    },

    /**
     * Defines DOM specifications for rendering italic marks as `<em>` elements.
     *
     * Configures how italic marks are serialized to DOM (using `<em>` or `<i>` tags) and
     * how DOM elements are parsed back into italic marks. Applies configured HTML attributes
     * to the generated `<em>` element.
     *
     * @param {ExtensionScope<ExtensionOptions>} this - The extension scope providing access to options.
     * @returns {ExtensionDOMSpecs} DOM specs with italic mark rendering definitions.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const attrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        const descriptor: DOMOutputDescriptor = ['em', attrs, 0];
        return {
            marks: {
                italic: {
                    toDOM: (): DOMOutputDescriptor => {
                        return descriptor;
                    },
                    parseDOM: [
                        { tag: 'em' },
                        { tag: 'i' },
                        { style: 'font-style', getAttrs: (value: string) => value === 'italic' && null }
                    ]
                }
            }
        };
    },

    /**
     * Registers keyboard shortcuts for italic formatting.
     *
     * Maps both Ctrl/Cmd + I (lowercase) and Ctrl/Cmd + Shift + I (uppercase) to the toggleItalic command,
     * allowing users to quickly toggle italic formatting with standard keyboard shortcuts.
     *
     * @returns {Object} Keyboard shortcut mapping.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-i': () => this.editor.commands.toggleItalic(),
            'Mod-I': () => this.editor.commands.toggleItalic()
        };
    }
});

export default italicExtension;
