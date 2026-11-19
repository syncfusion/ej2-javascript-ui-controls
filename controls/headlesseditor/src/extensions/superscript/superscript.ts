/**
 * Superscript Extension
 *
 * Provides semantic superscript text formatting (`<sup>`) with:
 * - Toggle command
 * - Customizable HTML attributes
 *
 * Note: Markdown has no standard superscript shorthand.
 */

import { defineExtension } from '../define-extension';
import type { MarkDefinition } from '../../core/schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleSuperscriptCommand } from './commands/toggle-superscript';
import { createMarkRule } from '../inputrules/mark-input-rule';
import type { Command } from '../../core/commands/types';

/**
 * Superscript extension for the Syncfusion Headless Editor.
 *
 * Provides semantic superscript text formatting using the `<sup>` HTML tag. Enables users to apply
 * superscript styling to text through the toggleSuperscript command. Supports input rules for
 * automatic superscript conversion from markup-style markers (^text^).
 *
 * **Note:** Markdown has no standard superscript shorthand. This extension uses ^ markers for conversion.
 *
 * **Contributes:**
 * - `superscript` mark type with inclusive boundary behavior
 * - `toggleSuperscript` command for programmatic superscript formatting
 * - Input rules for markup-style superscript syntax (^text^)
 * - DOM specs for rendering as `<sup>` elements
 *
 * **Common Use Cases:**
 * - Mathematical formulas (E=mc²)
 * - Copyright/trademark symbols (®, ™)
 * - Footnote references (text¹)
 *
 * @type {ExtensionDefinition<ExtensionOptions>}
 *
 * @example
 * ```typescript
 * // Create editor with superscript extension
 * const editor = HeadlessEditor.create({
 *   extensions: [superscriptExtension]
 * });
 *
 * // Apply superscript via command
 * editor.commands.toggleSuperscript();
 *
 * // Type ^text^ to auto-convert to superscript
 * ```
 *
 * @see toggleSuperscriptCommand for direct command usage
 * @see ExtensionOptions for configuration options
 */
export const superscriptExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier used to register and reference this extension.
     *
     * @type {string}
     */
    name: 'superscript',

    /**
     * Defines the default configuration options for the Superscript extension.
     *
     * Returns an object containing htmlAttributes that can be applied to the `<sup>` element.
     *
     * @returns {ExtensionOptions} Default option values with empty htmlAttributes object.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `superscript` mark type with inclusive boundary behavior.
     *
     * Characters typed at an empty cursor after toggling superscript continue to inherit
     * the mark, allowing seamless superscript text entry. Mirrors bold/italic/underline
     * for consistent typing experience.
     *
     * @returns {MarkDefinition[]} Array containing a single superscript mark definition with inclusive: true.
     */
    marks(): MarkDefinition[] {
        return [
            {
                name: 'superscript',
                inclusive: true
            }
        ];
    },

    /**
     * Registers the `toggleSuperscript` command for programmatic superscript formatting.
     *
     * The toggleSuperscript command allows programmatic application or removal of superscript styling
     * to the current selection or active mark.
     *
     * @returns {Command[]} Array containing the toggleSuperscript command definition.
     */
    commands(): Command[] {
        return [toggleSuperscriptCommand];
    },

    /**
     * Defines input rules that convert markup-style superscript syntax to superscript marks.
     *
     * Automatically converts ^text^ (caret markers) to superscript marks as the user types.
     * Supports undo/redo operations for automatic superscript conversions.
     *
     * @returns {InputRuleDefinition[]} Array of input rule definitions for superscript syntax.
     */
    inputRules(): readonly InputRuleDefinition[] {
        return [
            createMarkRule({
                id: 'mark:superscript',
                pattern: /\^([^^]+)\^$/,
                target: 'superscript',
                allowUndo: true
            })
        ];
    },

    /**
     * Renders superscript mark as semantic `<sup>` tag with user-supplied
     * HTML attributes.
     *
     * @param {ExtensionScope<ExtensionOptions>} this Extension scope
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const attrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        const descriptor: DOMOutputDescriptor = ['sup', attrs, 0];
        return {
            marks: {
                superscript: {
                    toDOM: (): DOMOutputDescriptor => descriptor,
                    parseDOM: [{ tag: 'sup' }]
                }
            }
        };
    },

    /**
     * Registers keyboard shortcuts for superscript formatting.
     *
     * Maps Ctrl/Cmd + . (period) to the toggleSuperscript command,
     * allowing users to quickly toggle superscript formatting with standard keyboard shortcuts.
     *
     * @returns {Object} Keyboard shortcut mapping.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-.': () => this.editor.commands.toggleSuperscript()
        };
    }
});

export default superscriptExtension;
