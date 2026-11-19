/**
 * Horizontal Rule Extension
 *
 * Provides horizontal rule (horizontalRule) node for visual separation.
 * Contributes the 'horizontalRule' node and 'setHorizontalRule' command.
 */

import { defineExtension } from '../define-extension';
import type { NodeDefinition } from '../../core/schema/types/node-definition';
import { NodeContent } from '../../core/schema/types/content-expression';
import type { Command } from '../../core/commands/types';
import { DOMOutputDescriptor, ExtensionDefinition, ExtensionDOMSpecs, ExtensionOptions, ExtensionScope, InputRuleDefinition } from '../types';
import { setHorizontalRuleCommand } from './commands/set-horizontal-rule';
import { createNodeRule } from '../inputrules/insert-input-rule';
import { NodeSelection, PMEditorView, PMNode, PMPlugin } from '../../pm/pm-guard';

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

    /**
     * Selects the divider node when it is clicked directly.
     *
     * @returns {PMPlugin[]} ProseMirror interaction plugins.
     */
    plugins(): readonly PMPlugin[] {
        return [new PMPlugin({
            props: {
                /**
                 * Converts a direct divider click into a NodeSelection.
                 *
                 * @param {PMEditorView} view - The current editor view.
                 * @param {number} _pos - The clicked descendant position.
                 * @param {PMNode} node - The clicked node.
                 * @param {number} nodePos - The node's document position.
                 * @param {MouseEvent} _event - The browser click event.
                 * @param {boolean} direct - Whether the divider was clicked directly.
                 * @returns {boolean} `true` when the divider click was handled.
                 */
                handleClickOn(
                    // Current editor view used to dispatch the node selection.
                    view: PMEditorView,
                    // Position supplied by ProseMirror for the clicked descendant.
                    _pos: number,
                    // Node that was clicked.
                    node: PMNode,
                    // Document position of the clicked node.
                    nodePos: number,
                    // Browser mouse event that triggered the click.
                    _event: MouseEvent,
                    // Whether the click directly targeted the divider node.
                    direct: boolean
                ): boolean {
                    // Handle only direct clicks on the divider.
                    if (!direct || node.type.name !== 'horizontalRule') {
                        return false;
                    }
                    view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));
                    return true;
                }
            }
        })];
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
