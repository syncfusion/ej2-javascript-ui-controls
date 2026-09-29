/**
 * Horizontal Rule Extension
 *
 * Provides horizontal rule (horizontalRule) node for visual separation.
 * Contributes the 'horizontalRule' node and 'setHorizontalRule' command.
 */

import { defineExtension } from '../define-extension';
import type { NodeDefinition } from '../../schema/types/node-definition';
import { NodeContent } from '../../schema/types/content-expression';
import type { Command } from '../../commands/types';
import { DOMOutputDescriptor, ExtensionDefinition, ExtensionDOMSpecs, ExtensionOptions, ExtensionScope, InputRuleDefinition } from '../types';
import { setHorizontalRuleCommand } from '../../commands/builtins/structure/set-horizontal-rule';
import { createNodeRule } from '../inputrules/insert-input-rule';

/**
 * HorizontalRule built-in extension.
 * Contributes horizontal rule (hr) node for visual separation.
 */
export const horizontalRuleExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'horizontalRule',

    /**
     * Tier 1 — leaf node (no content). `createAndFill()` terminates immediately.
     * Must be registered before recursive containers in the block group.
     */
    priority: 100,

    /**
     * Adds options to the HorizontalRule extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `horizontalRule` node type.
     *
     * @returns {NodeDefinition[]} Array containing the horizontalRule node definition.
     */
    nodes(): NodeDefinition[] {
        const horizontalRuleNode: NodeDefinition = {
            name: 'horizontalRule',
            group: 'block',
            leaf: true
        };
        return [horizontalRuleNode];
    },

    /**
     * Contributes the `setHorizontalRule` command for programmatic insertion of a HorizontalRule.
     *
     * @returns {Command[]} Array containing the setHorizontalRule command.
     */
    commands(): Command[] {
        return [setHorizontalRuleCommand];
    },

    inputRules(): readonly InputRuleDefinition[] {
        return [
            createNodeRule({
                id: 'divider:dash',
                pattern: /^---$/,
                target: 'horizontalRule'
            }),

            createNodeRule({
                id: 'divider:asterisk',
                pattern: /^\*\*\*$/,
                target: 'horizontalRule'
            }),

            createNodeRule({
                id: 'divider:underscore',
                pattern: /^___$/,
                target: 'horizontalRule'
            })
        ];
    },

    /**
     * Renders the HorizontalRule node as an `<hr>` element with user-supplied HTML attributes.
     *
     * @param {ExtensionScope<ExtensionOptions>} this Extension scope
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const attrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        return {
            nodes: {
                horizontalRule: {
                    toDOM: (): DOMOutputDescriptor => ['hr', attrs],
                    parseDOM: [{ tag: 'hr' }]
                }
            }
        };
    }
});

export default horizontalRuleExtension;
