/**
 * Paragraph Extension
 *
 * Provides the core paragraph block node for body text.
 * Contributes the 'paragraph' node and 'setParagraph' command.
 */

import { defineExtension } from '../define-extension';
import type { NodeDefinition } from '../../schema/types/node-definition';
import type { AttributeDefinition } from '../../schema/types/attribute-definition';
import { NodeContent } from '../../schema/types/content-expression';
import type { Command } from '../../commands/types';
import { DOMOutputDescriptor, ExtensionDefinition, ExtensionDOMSpecs, ExtensionOptions, ExtensionScope } from '../types';
import { setParagraphCommand } from '../../commands/builtins/structure/set-paragraph';
import { mergeAlignStyle, textAlignAttribute } from './common/text-align-attributes';
import { indentAttribute, mergeIndentStyle } from './common/indent-attributes';
import { parseBlockFormat, BlockFormatDefault } from './common/block-format-attributes';

/**
 * Schema defaults for the block-format attributes carried by `paragraph`.
 * Kept in one place so {@link paragraphParseDefaults} and the node definition
 * stay in lockstep.
 */
const paragraphParseDefaults: readonly BlockFormatDefault[] = [
    { name: 'align', value: textAlignAttribute.default },
    { name: 'indent', value: indentAttribute.default }
];

/**
 * Paragraph built-in extension.
 * Declares all capabilities it contributes as explicit metadata.
 */
export const paragraphExtension: ExtensionDefinition = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'paragraph',

    /**
     * Tier 1 — non-recursive primary filler. `paragraph.createAndFill()` terminates
     * immediately (content: inline*), so it must be registered before any
     * recursive container in the block group.
     */
    priority: 100,

    /**
     * Adds options to the Bold extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `paragraph` node type.
     *
     * @returns {NodeDefinition[]} Array containing the paragraph node definition.
     */
    nodes(): NodeDefinition[] {
        const paragraphNode: NodeDefinition = {
            name: 'paragraph',
            group: 'block',
            content: NodeContent.inline().zeroOrMore(),
            attrs: [textAlignAttribute, indentAttribute]
        };
        return [paragraphNode];
    },

    /**
     * Contributes the `setParagraph` command for programmatic convertion of the current block to a paragraph.
     *
     * @returns {Command[]} Array containing the setParagraph command.
     */
    commands(): Command[] {
        return [setParagraphCommand];
    },

    /**
     * Renders paragraph node as semantic `<p>` tag with user-supplied
     * HTML attributes (or no attributes when none are configured).
     *
     * @param {ExtensionScope<ExtensionOptions>} this Extension scope
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const attrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        return {
            nodes: {
                paragraph: {
                    toDOM: (nodeAttrs: Record<string, unknown>): DOMOutputDescriptor => {
                        // Compose styles: align first, then indent. `mergeIndentStyle`
                        // accepts a `Record<string, unknown>` so callers can hand it
                        // either a strict HTML-attribute bag or a raw PM node-attrs
                        // payload. The composed bag is what PM's DOM serializer reads.
                        const mergedAttrs: Record<string, unknown> = mergeIndentStyle(
                            mergeAlignStyle(attrs, nodeAttrs['align']),
                            nodeAttrs['indent']
                        );
                        return ['p', mergedAttrs, 0];
                    },
                    parseDOM: [
                        {
                            tag: 'p',
                            // Preserve `align` (legacy attribute or `text-align` CSS)
                            // and `indent` (`margin-left` CSS) from pasted HTML.
                            getAttrs: (dom: unknown): Record<string, unknown> =>
                                parseBlockFormat(dom, paragraphParseDefaults)
                        }
                    ]
                }
            }
        };
    },

    /**
     * Contributes keyboard shortcuts for paragraph.
     * Maps Ctrl/Cmd + Alt + P to setParagraph command.
     *
     * @returns {Object} Keyboard shortcut entry for Mod-Alt-p.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-Alt-p': () => this.editor.commands.setParagraph()
        };
    }
});

export default paragraphExtension;
