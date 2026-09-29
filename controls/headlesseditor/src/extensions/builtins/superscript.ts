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
import type { MarkDefinition } from '../../schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleSuperscriptCommand } from '../../commands/builtins/formatting/toggle-superscript';
import { createMarkRule } from '../inputrules/mark-input-rule';
import type { Command } from '../../commands/types';

export const superscriptExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'superscript',

    /**
     * Adds options to the Superscript extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `superscript` mark type with exclusive boundary behavior
     * (a superscript range should not include adjacent superscript ranges).
     *
     * @returns {MarkDefinition[]} Array containing the superscript mark definition.
     */
    marks(): MarkDefinition[] {
        return [
            {
                name: 'superscript',
                inclusive: false
            }
        ];
    },

    /**
     * Contributes the `toggleSuperscript` command.
     *
     * @returns {Command[]} Array containing the toggleSuperscript command.
     */
    commands(): Command[] {
        return [toggleSuperscriptCommand];
    },

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
     * Contributes keyboard shortcuts for superscript formatting.
     * Maps Mod-. to toggleSuperscript command.
     *
     * @returns {Object} Keyboard shortcut entries.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-.': () => this.editor.commands.toggleSuperscript()
        };
    }
});

export default superscriptExtension;
