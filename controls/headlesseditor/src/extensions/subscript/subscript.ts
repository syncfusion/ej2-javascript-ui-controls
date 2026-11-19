/**
 * Subscript Extension
 *
 * Provides semantic subscript text formatting (`<sub>`) with:
 * - Toggle command
 * - Customizable HTML attributes
 *
 * Note: Markdown has no standard subscript shorthand.
 */

import { defineExtension } from '../define-extension';
import type { MarkDefinition } from '../../core/schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleSubscriptCommand } from './commands/toggle-subscript';
import { createMarkRule } from '../inputrules/mark-input-rule';
import type { Command } from '../../core/commands/types';

/**
 * Subscript extension for the Syncfusion Headless Editor.
 *
 * Provides semantic subscript text formatting using the `<sub>` HTML tag. Enables users to apply
 * subscript styling to text through the toggleSubscript command. Supports input rules for
 * automatic subscript conversion from markup-style markers (,,text,,).
 *
 * **Note:** Markdown has no standard subscript shorthand. This extension uses ,, markers for conversion.
 *
 * **Contributes:**
 * - `subscript` mark type with inclusive boundary behavior
 * - `toggleSubscript` command for programmatic subscript formatting
 * - Input rules for markup-style subscript syntax (,,text,,)
 * - DOM specs for rendering as `<sub>` elements
 *
 * **Common Use Cases:**
 * - Chemical formulas (H₂O)
 * - Mathematical notation (subscripts in equations)
 * - Footnote/reference markers (text₁)
 *
 * @type {ExtensionDefinition<ExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with subscript extension
 * const editor = HeadlessEditor.create({
 *   extensions: [subscriptExtension]
 * });
 *
 * // Apply subscript via command
 * editor.commands.toggleSubscript();
 *
 * // Type ,,text,, to auto-convert to subscript
 * ```
 *
 * @see toggleSubscriptCommand for direct command usage
 * @see ExtensionOptions for configuration options
 */
export const subscriptExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier used to register and reference this extension.
     *
     * @type {string}
     */
    name: 'subscript',

    /**
     * Defines the default configuration options for the Subscript extension.
     *
     * Returns an object containing htmlAttributes that can be applied to the `<sub>` element.
     *
     * @returns {ExtensionOptions} Default option values with empty htmlAttributes object.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `subscript` mark type with inclusive boundary behavior.
     *
     * Characters typed at an empty cursor after toggling subscript continue to inherit
     * the mark, allowing seamless subscript text entry. Mirrors bold/italic/underline
     * for consistent typing experience.
     *
     * @returns {MarkDefinition[]} Array containing a single subscript mark definition with inclusive: true.
     */
    marks(): MarkDefinition[] {
        return [
            {
                name: 'subscript',
                inclusive: true
            }
        ];
    },

    /**
     * Registers the `toggleSubscript` command for programmatic subscript formatting.
     *
     * The toggleSubscript command allows programmatic application or removal of subscript styling
     * to the current selection or active mark.
     *
     * @returns {Command[]} Array containing the toggleSubscript command definition.
     */
    commands(): Command[] {
        return [toggleSubscriptCommand];
    },

    /**
     * Defines input rules that convert markup-style subscript syntax to subscript marks.
     *
     * Automatically converts ,,text,, (double comma markers) to subscript marks as the user types.
     * Supports undo/redo operations for automatic subscript conversions.
     *
     * @returns {InputRuleDefinition[]} Array of input rule definitions for subscript syntax.
     */
    inputRules(): readonly InputRuleDefinition[] {
        return [
            createMarkRule({
                id: 'mark:subscript',
                pattern: /,,(.+?),,/,
                target: 'subscript',
                allowUndo: true
            })
        ];
    },

    /**
     * Renders subscript mark as semantic `<sub>` tag with user-supplied
     * HTML attributes.
     *
     * @param {ExtensionScope<ExtensionOptions>} this Extension scope
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const attrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        const descriptor: DOMOutputDescriptor = ['sub', attrs, 0];
        return {
            marks: {
                subscript: {
                    toDOM: (): DOMOutputDescriptor => descriptor,
                    parseDOM: [{ tag: 'sub' }]
                }
            }
        };
    },

    /**
     * Registers keyboard shortcuts for subscript formatting.
     *
     * Maps Ctrl/Cmd + , (comma) to the toggleSubscript command,
     * allowing users to quickly toggle subscript formatting with standard keyboard shortcuts.
     *
     * @returns {Object} Keyboard shortcut mapping.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-,': () => this.editor.commands.toggleSubscript()
        };
    }
});

export default subscriptExtension;
