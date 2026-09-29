/**
 * Strikethrough Extension
 *
 * Provides semantic strikethrough text formatting (`<s>`) with:
 * - Toggle command
 * - Customizable HTML attributes
 */

import { defineExtension } from '../define-extension';
import type { MarkDefinition } from '../../schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleStrikethroughCommand } from '../../commands/builtins/formatting/toggle-strikethrough';
import { createMarkRule } from '../inputrules/mark-input-rule';
import type { Command } from '../../commands/types';

export const strikethroughExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'strikethrough',

    /**
     * Adds options to the Strikethrough extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `strikethrough` mark type with inclusive boundary behavior.
     *
     * @returns {MarkDefinition[]} Array containing the strikethrough mark definition.
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
     * Contributes the `toggleStrikethrough` command for programmatic strikethrough formatting.
     *
     * @returns {Command[]} Array containing the toggleStrikethrough command.
     */
    commands(): Command[] {
        return [toggleStrikethroughCommand];
    },

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
     * Renders strikethrough mark as semantic `<s>` tag with user-supplied
     * HTML attributes (or no attributes when none are configured).
     *
     * @param {ExtensionScope<ExtensionOptions>} this Extension scope
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
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
     * Contributes keyboard shortcuts for the strikethrough mark.
     * Maps Ctrl/Cmd + Shift + X to the toggleStrikethrough command.
     *
     * @returns {Object} Keyboard shortcut entry for Mod-Shift-x.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-Shift-x': () => this.editor.commands.toggleStrikethrough()
        };
    }
});

export default strikethroughExtension;
