/**
 * Bold Extension
 *
 * Provides semantic bold text formatting (`<strong>`) with:
 * - Toggle command
 * - Customizable HTML attributes
 */

import { defineExtension } from '../define-extension';
import type { MarkDefinition } from '../../schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleBoldCommand } from '../../commands/builtins/formatting/toggle-bold';
import type { Command } from '../../commands/types';
import { createMarkRule } from '../inputrules/mark-input-rule';
export const boldExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'bold',

    /**
     * Adds options to the Bold extension.
     *
     *@returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `bold` mark type with inclusive boundary behavior.
     *
     * @returns {MarkDefinition[]} Array containing the bold mark definition.
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
     * Contributes the `toggleBold` command for programmatic bold formatting.
     *
     * @returns {Command[]} Array containing the toggleBold command.
     */
    commands(): Command[] {
        return [toggleBoldCommand];
    },

    /**
     * Renders bold mark as semantic `<strong>` tag with user-supplied
     * HTML attributes (or no attributes when none are configured).
     *
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
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
     * Contributes keyboard shortcuts for the bold mark.
     * Maps Ctrl/Cmd + B (both cases) to the toggleBold command.
     *
     * @returns {Object} Keyboard shortcut entries for Mod-b and Mod-B.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-b': () => this.editor.commands.toggleBold(),
            'Mod-B': () => this.editor.commands.toggleBold()
        };
    }
});

export default boldExtension;
