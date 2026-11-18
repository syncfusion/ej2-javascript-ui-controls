/**
 * Bold Extension
 *
 * Provides semantic bold text formatting (`<strong>`) with:
 * - Toggle command
 * - Customizable HTML attributes
 */

import { defineExtension } from '../define-extension';
import type { MarkDefinition } from '../../core/schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleBoldCommand } from './commands/toggle-bold';
import type { Command } from '../../core/commands/types';
import { createMarkRule } from '../inputrules/mark-input-rule';

/**
 * Bold extension for the Syncfusion Headless Editor.
 *
 * Provides semantic bold text formatting using the `<strong>` HTML tag. Enables users to apply
 * bold styling to text through the toggleBold command or via keyboard shortcut (Ctrl+B / Cmd+B).
 * Supports input rules for automatic bold conversion from Markdown-style markers (**text** or __text__).
 *
 * **Contributes:**
 * - `bold` mark type with inclusive boundary behavior
 * - `toggleBold` command for programmatic bold formatting
 * - Input rules for Markdown-style bold syntax (**text** and __text__)
 * - DOM specs for rendering as `<strong>` elements
 * - Keyboard shortcuts: Ctrl+B and Cmd+B
 *
 * **Supported HTML attributes:**
 * Can be customized through extension options to add custom attributes to the `<strong>` element.
 *
 * @type {ExtensionDefinition<ExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with bold extension
 * const editor = HeadlessEditor.create({
 *   extensions: [boldExtension]
 * });
 *
 * // Apply bold via command
 * editor.commands.toggleBold();
 *
 * // Use keyboard shortcut: Ctrl+B (Windows/Linux) or Cmd+B (Mac)
 * ```
 *
 * @see toggleBoldCommand for direct command usage
 * @see ExtensionOptions for configuration options
 */
export const boldExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier used to register and reference this extension.
     *
     * @type {string}
     */
    name: 'bold',

    /**
     * Defines the default configuration options for the Bold extension.
     *
     * Returns an object containing htmlAttributes that can be applied to the `<strong>` element.
     *
     * @returns {ExtensionOptions} Default option values with empty htmlAttributes object.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `bold` mark type with inclusive boundary behavior.
     *
     * The bold mark includes text at its boundaries, allowing bold to extend when adjacent text
     * is also marked as bold, preventing gaps in bold styling across the document.
     *
     * @returns {MarkDefinition[]} Array containing a single bold mark definition with inclusive: true.
     */
    marks(): MarkDefinition[] {
        return [
            {
                name: 'bold',
                inclusive: true
            }
        ];
    },

    /**
     * Registers the `toggleBold` command for programmatic bold formatting.
     *
     * The toggleBold command allows programmatic application or removal of bold styling
     * to the current selection or active mark.
     *
     * @returns {Command[]} Array containing the toggleBold command definition.
     */
    commands(): Command[] {
        return [toggleBoldCommand];
    },

    /**
     * Defines input rules that convert Markdown-style bold syntax to bold marks.
     *
     * Automatically converts **text** (double asterisks) and __text__ (double underscores)
     * to bold marks as the user types, following standard Markdown conventions.
     *
     * @returns {InputRuleDefinition[]} Array of input rule definitions for bold syntax.
     */
    inputRules(): readonly InputRuleDefinition[] {
        return [
            createMarkRule({
                id: 'bold:stars',
                pattern: /\*\*([^*]+)\*\*$/,
                target: 'bold'
            }),
            createMarkRule({
                id: 'bold:underscores',
                pattern: /__([^_]+)__$/,
                target: 'bold'
            })
        ];
    },

    /**
     * Defines DOM specifications for rendering bold marks as `<strong>` elements.
     *
     * Configures how bold marks are serialized to DOM (using `<strong>` or `<b>` tags) and
     * how DOM elements are parsed back into bold marks. Applies configured HTML attributes
     * to the generated `<strong>` element.
     *
     * @param {ExtensionScope<ExtensionOptions>} this - The extension scope providing access to options.
     * @returns {ExtensionDOMSpecs} DOM specs with bold mark rendering definitions.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const attrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        const descriptor: DOMOutputDescriptor = ['strong', attrs, 0];
        return {
            marks: {
                bold: {
                    toDOM: (): DOMOutputDescriptor => {
                        return descriptor;
                    },
                    parseDOM: [
                        { tag: 'strong' },
                        { tag: 'b' },
                        { style: 'font-weight', getAttrs: (value: string) => /^(bold|[5-9]\d{2,})$/.test(value as string) && null }
                    ]
                }
            }
        };
    },

    /**
     * Registers keyboard shortcuts for bold formatting.
     *
     * Maps both Ctrl/Cmd + B (lowercase) and Ctrl/Cmd + Shift + B (uppercase) to the toggleBold command,
     * allowing users to quickly toggle bold formatting with standard keyboard shortcuts.
     *
     * @returns {Object} Keyboard shortcut mapping.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-b': () => this.editor.commands.toggleBold(),
            'Mod-B': () => this.editor.commands.toggleBold()
        };
    }
});

export default boldExtension;
