/**
 * Block Quote Extension
 *
 * Provides blockquote node type for quoted text.
 * Contributes the 'blockquote' node and 'toggleBlockQuote' command.
 */

import { defineExtension } from '../define-extension';
import type { NodeDefinition } from '../../schema/types/node-definition';
import { NodeContent } from '../../schema/types/content-expression';
import type { Command } from '../../commands/types';
import { DOMOutputDescriptor, ExtensionDefinition, ExtensionDOMSpecs, ExtensionOptions, ExtensionScope, InputRuleDefinition } from '../types';
import { toggleBlockquoteCommand } from '../../commands/builtins/structure/toggle-blockquote';
import { createWrappingRule } from '../inputrules/wrap-input-rule';

/**
 * Quote (blockquote) built-in extension.
 * Contributes blockquote node for quoting content.
 */
export const blockquoteExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'blockquote',

    /**
     * Tier 3 — recursive container (content: block+). Must be registered after
     * all Tier 1 primary fillers so `fillBefore` never picks `blockquote` as
     * the first candidate when auto-filling block+ content.
     */
    priority: 10,

    /**
     * Adds options to the quote extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `blockquote` node type.
     *
     * @returns {NodeDefinition[]} Array containing the blockquote node definition.
     */
    nodes(): NodeDefinition[] {
        const blockquoteNode: NodeDefinition = {
            name: 'blockquote',
            group: 'block',
            content: NodeContent.block().oneOrMore()
        };
        return [blockquoteNode];
    },

    /**
     * Contributes the `toggleBlockQuote` command for programmatic conversion of the current block to a quote.
     *
     * @returns {Command[]} Array containing the toggleBlockQuote command.
     */
    commands(): Command[] {
        return [toggleBlockquoteCommand];
    },

    /**
     * Renders quote nodes as semantic `<blockquote>` tags with user-supplied HTML attributes.
     *
     * @param {ExtensionScope<ExtensionOptions>} this Extension scope
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const attrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        return {
            nodes: {
                blockquote: {
                    toDOM: (): DOMOutputDescriptor => ['blockquote', attrs, 0],
                    parseDOM: [{ tag: 'blockquote' }]
                }
            }
        };
    },

    /**
     * Contributes input rules.
     *
     * @returns {InputRuleDefinition[]} Wrapping input rules for the callout block.
     */
    inputRules(): readonly InputRuleDefinition[] {
        return [
            createWrappingRule({
                id: 'quote:greater',
                pattern: /^> $/,
                target: 'blockquote'
            })
        ];
    },

    /**
     * Registers keyboard shortcuts for Block Quote operations.
     *
     * @returns {Object} Keyboard shortcut entry for Mod-Alt-q.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-Alt-q': () => this.editor.commands.toggleBlockQuote()
        };
    }
});

export default blockquoteExtension;
