/**
 * Strikethrough Extension
 *
 * Provides semantic strikethrough text formatting (`<s>`) with:
 * - Toggle command
 * - Customizable HTML attributes
 */

import { defineExtension } from '../define-extension';
import type { MarkDefinition } from '../../core/schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleStrikethroughCommand } from './commands/toggle-strikethrough';
import { createMarkRule } from '../inputrules/mark-input-rule';
import type { Command } from '../../core/commands/types';

/**
 * Strikethrough extension for the Syncfusion Headless Editor.
 *
 * Provides semantic strikethrough text formatting using the `<s>` HTML tag. Enables users to apply
 * strikethrough styling to text through the toggleStrikethrough command. Supports input rules for
 * automatic strikethrough conversion from Markdown-style markers (~~text~~).
 *
 * **Contributes:**
 * - `strikethrough` mark type with inclusive boundary behavior
 * - `toggleStrikethrough` command for programmatic strikethrough formatting
 * - Input rules for Markdown-style strikethrough syntax (~~text~~)
 * - DOM specs for rendering as `<s>` elements
 *
 * **Supported HTML attributes:**
 * Can be customized through extension options to add custom attributes to the `<s>` element.
 *
 * @type {ExtensionDefinition<ExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with strikethrough extension
 * const editor = HeadlessEditor.create({
 *   extensions: [strikethroughExtension]
 * });
 *
 * // Apply strikethrough via command
 * editor.commands.toggleStrikethrough();
 *
 * // Type ~~text~~ to auto-convert to strikethrough
 * ```
 *
 * @see toggleStrikethroughCommand for direct command usage
 * @see ExtensionOptions for configuration options
 */
export const strikethroughExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier used to register and reference this extension.
     *
     * @type {string}
     */
    name: 'strikethrough',

    /**
     * Defines the default configuration options for the Strikethrough extension.
     *
     * Returns an object containing htmlAttributes that can be applied to the `<s>` element.
     *
     * @returns {ExtensionOptions} Default option values with empty htmlAttributes object.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `strikethrough` mark type with inclusive boundary behavior.
     *
     * The strikethrough mark includes text at its boundaries, allowing strikethrough to extend when adjacent text
     * is also marked as strikethrough, preventing gaps in strikethrough styling across the document.
     *
     * @returns {MarkDefinition[]} Array containing a single strikethrough mark definition with inclusive: true.
     */
    marks(): MarkDefinition[] {
        return [
            {
                name: 'strikethrough',
                inclusive: true
            }
        ];
    },

    /**
     * Registers the `toggleStrikethrough` command for programmatic strikethrough formatting.
     *
     * The toggleStrikethrough command allows programmatic application or removal of strikethrough styling
     * to the current selection or active mark.
     *
     * @returns {Command[]} Array containing the toggleStrikethrough command definition.
     */
    commands(): Command[] {
        return [toggleStrikethroughCommand];
    },

    /**
     * Defines input rules that convert Markdown-style strikethrough syntax to strikethrough marks.
     *
     * Automatically converts ~~text~~ (double tildes) to strikethrough marks as the user types.
     * Supports undo/redo operations for automatic strikethrough conversions.
     *
     * @returns {InputRuleDefinition[]} Array of input rule definitions for strikethrough syntax.
     */
    inputRules(): readonly InputRuleDefinition[] {
        return [
            createMarkRule({
                id: 'mark:strikethrough',
                pattern: /(^|\s)~~([^~]+)~~$/,
                target: 'strikethrough',
                allowUndo: true
            })
        ];
    },

    /**
     * Defines DOM specifications for rendering strikethrough marks as `<s>` elements.
     *
     * Configures how strikethrough marks are serialized to DOM (using `<s>` tag) and
     * how DOM elements are parsed back into strikethrough marks. Applies configured HTML attributes
     * to the generated `<s>` element.
     *
     * @param {ExtensionScope<ExtensionOptions>} this - The extension scope providing access to options.
     * @returns {ExtensionDOMSpecs} DOM specs with strikethrough mark rendering definitions.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const attrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        const descriptor: DOMOutputDescriptor = ['s', attrs, 0];
        return {
            marks: {
                strikethrough: {
                    toDOM: (): DOMOutputDescriptor => {
                        return descriptor;
                    },
                    parseDOM: [
                        { tag: 's' },
                        { tag: 'del' },
                        { style: 'text-decoration', getAttrs: (value: string) => /line-through/.test(value as string) && null }
                    ]
                }
            }
        };
    },

    /**
     * Registers keyboard shortcuts for strikethrough formatting.
     *
     * Maps Ctrl/Cmd + Shift + X to the toggleStrikethrough command,
     * allowing users to quickly toggle strikethrough formatting with standard keyboard shortcuts.
     *
     * @returns {Object} Keyboard shortcut mapping.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-Shift-x': () => this.editor.commands.toggleStrikethrough()
        };
    }
});

export default strikethroughExtension;
