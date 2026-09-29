/**
 * Inline Code Extension
 *
 * Provides inline code formatting as an inline mark (renders as `<code>`).
 * - Toggle command
 * - Customizable HTML attributes
 *
 * Note: This is INLINE code (a mark). Block-level code is contributed
 * separately by the `code` extension (a node).
 */

import { defineExtension } from '../define-extension';
import type { MarkDefinition } from '../../schema/types/mark-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor, InputRuleDefinition } from '../types';
import { toggleCodeMarkCommand } from '../../commands/builtins/formatting/toggle-code-mark';
import { createMarkRule } from '../inputrules/mark-input-rule';
import type { Command } from '../../commands/types';

export const inlineCodeExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'inlineCode',

    /**
     * Adds options to the Inline Code extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `code` mark type with inclusive boundary behavior.
     *
     * @returns {MarkDefinition[]} Array containing the code mark definition.
     */
    marks(): MarkDefinition[] {
        return [
            {
                name: 'code',
                inclusive: true
            }
        ];
    },

    /**
     * Contributes the `toggleCodeMark` command for programmatic inline-code formatting.
     *
     * @returns {Command[]} Array containing the toggleCodeMark command.
     */
    commands(): Command[] {
        return [toggleCodeMarkCommand];
    },

    inputRules(): readonly InputRuleDefinition[] {
        return [
            createMarkRule({
                id: 'mark:inline-code',
                pattern: /(^|\s)`([^`]+)`$/,
                target: 'code'
            })
        ];
    },

    /**
     * Renders inline code mark as semantic `<code>` tag with user-supplied
     * HTML attributes (or no attributes when none are configured).
     *
     * @param {ExtensionScope<ExtensionOptions>} this Extension scope
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const attrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        const descriptor: DOMOutputDescriptor = ['code', attrs, 0];
        return {
            marks: {
                code: {
                    toDOM: (): DOMOutputDescriptor => {
                        return descriptor;
                    },
                    parseDOM: [{ tag: 'code' }]
                }
            }
        };
    },

    /**
     * Contributes keyboard shortcuts for inline code.
     * Maps Ctrl/Cmd + ` to the toggleCodeMark command.
     *
     * @returns {Object} Keyboard shortcut entry for Mod-`.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-`': () => this.editor.commands.toggleCodeMark()
        };
    }
});

export default inlineCodeExtension;
