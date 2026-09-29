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
import type { MarkDefinition } from '../../schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleSubscriptCommand } from '../../commands/builtins/formatting/toggle-subscript';
import { createMarkRule } from '../inputrules/mark-input-rule';
import type { Command } from '../../commands/types';

export const subscriptExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'subscript',

    /**
     * Adds options to the Subscript extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `subscript` mark type with exclusive boundary behavior.
     *
     * @returns {MarkDefinition[]} Array containing the subscript mark definition.
     */
    marks(): MarkDefinition[] {
        return [
            {
                name: 'subscript',
                inclusive: false
            }
        ];
    },

    /**
     * Contributes the `toggleSubscript` command.
     *
     * @returns {Command[]} Array containing the toggleSubscript command.
     */
    commands(): Command[] {
        return [toggleSubscriptCommand];
    },

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
     * Contributes keyboard shortcuts for subscript formatting.
     * Maps Mod-, to toggleSubscript command.
     *
     * @returns {Object} Keyboard shortcut entries.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-,': () => this.editor.commands.toggleSubscript()
        };
    }
});

export default subscriptExtension;
