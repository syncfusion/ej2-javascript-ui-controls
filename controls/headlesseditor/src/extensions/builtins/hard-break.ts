/**
 * Hard Break Extension
 *
 * Provides hard break (line break) insertion as an inline node (`<br>`) with:
 * - Insert command (`setHardBreak`)
 * - Keyboard shortcuts (Shift+Enter and Mod+Enter)
 * - Customizable HTML attributes
 *
 * A hard break is different from splitting a block. It inserts a semantic
 * `<br>` node within the current line/block, allowing multiple lines within
 * a single paragraph.
 */

import { defineExtension } from '../define-extension';
import type { NodeDefinition } from '../../schema/types/node-definition';
import { ExtensionOptions, ExtensionDefinition, ExtensionDOMSpecs, ExtensionScope, DOMOutputDescriptor } from '../types';
import { setHardBreakCommand } from '../../commands/builtins/content/set-hard-break';
import type { Command } from '../../commands/types';

export const hardBreakExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'hardBreak',

    /**
     * Adds options to the Hard Break extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `hard_break` inline node.
     *
     * A hard break is:
     * - inline: appears within text flow
     * - group: 'inline' (allowed in inline contexts)
     *
     * @returns {NodeDefinition[]} Array containing the hard_break node definition.
     */
    nodes(): NodeDefinition[] {
        return [
            {
                name: 'hard_break',
                inline: true,
                group: 'inline'
            }
        ];
    },

    /**
     * Contributes the `setHardBreak` command for inserting hard breaks.
     *
     * @returns {Command[]} Array containing the setHardBreak command.
     */
    commands(): Command[] {
        return [setHardBreakCommand];
    },

    /**
     * Renders hard break node as semantic `<br>` tag with user-supplied
     * HTML attributes (or no attributes when none are configured).
     *
     * @param {ExtensionScope<ExtensionOptions>} this Extension scope
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const attrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        const descriptor: DOMOutputDescriptor = ['br', attrs];
        return {
            nodes: {
                'hard_break': {
                    toDOM: (): DOMOutputDescriptor => {
                        return descriptor;
                    }
                }
            }
        };
    },

    /**
     * Contributes keyboard shortcuts for the hard break.
     * Both Shift+Enter and Mod+Enter (Ctrl/Cmd+Enter) trigger hard break insertion.
     *
     *
     * @returns {Object} Keyboard shortcut entries.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Shift-Enter': () => this.editor.commands.setHardBreak()
        };
    }
});

export default hardBreakExtension;
