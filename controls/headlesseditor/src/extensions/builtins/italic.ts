/**
 * Italic Extension
 *
 * Provides semantic italic text formatting (`<em>`) with:
 * - Toggle command
 * - Customizable HTML attributes
 */

import { defineExtension } from '../define-extension';
import type { MarkDefinition } from '../../schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleItalicCommand } from '../../commands/builtins/formatting/toggle-italic';
import { createMarkRule } from '../inputrules/mark-input-rule';
import type { Command } from '../../commands/types';

export const italicExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'italic',

    /**
     * Adds options to the Italic extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `italic` mark type with inclusive boundary behavior.
     *
     * @returns {MarkDefinition[]} Array containing the italic mark definition.
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
     * Contributes the `toggleItalic` command for programmatic italic formatting.
     *
     * @returns {Command[]} Array containing the toggleItalic command.
     */
    commands(): Command[] {
        return [toggleItalicCommand];
    },

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
     * Renders italic mark as semantic `<em>` tag with user-supplied
     * HTML attributes (or no attributes when none are configured).
     *
     * @param {ExtensionScope<ExtensionOptions>} this Extension scope
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
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
     * Contributes keyboard shortcuts for the italic mark.
     * Maps Ctrl/Cmd + I to the toggleItalic command.
     *
     * @returns {Object} Keyboard shortcut entries for Mod-i and Mod-I.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-i': () => this.editor.commands.toggleItalic(),
            'Mod-I': () => this.editor.commands.toggleItalic()
        };
    }
});

export default italicExtension;
