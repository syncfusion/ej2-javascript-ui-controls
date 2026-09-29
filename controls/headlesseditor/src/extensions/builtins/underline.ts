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
import type { MarkDefinition } from '../../schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleUnderlineCommand } from '../../commands/builtins/formatting/toggle-underline';
import { createMarkRule } from '../inputrules/mark-input-rule';
import type { Command } from '../../commands/types';

export const underlineExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'underline',

    /**
     * Adds options to the Underline extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `underline` mark type with inclusive boundary behavior.
     *
     * @returns {MarkDefinition[]} Array containing the underline mark definition.
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
     * Contributes the `toggleUnderline` command for programmatic underline formatting.
     *
     * @returns {Command[]} Array containing the toggleUnderline command.
     */
    commands(): Command[] {
        return [toggleUnderlineCommand];
    },

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
     * Renders underline mark as semantic `<u>` tag with user-supplied
     * HTML attributes (or no attributes when none are configured).
     *
     * @param {ExtensionScope<ExtensionOptions>} this Extension scope
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
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
     * Contributes keyboard shortcuts for the underline mark.
     * Maps Ctrl/Cmd + U to the toggleUnderline command.
     *
     * @returns {Object} Keyboard shortcut entries for Mod-u and Mod-U.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-u': () => this.editor.commands.toggleUnderline(),
            'Mod-U': () => this.editor.commands.toggleUnderline()
        };
    }
});

export default underlineExtension;
