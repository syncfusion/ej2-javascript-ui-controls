/**
 * Heading Extension
 *
 * Provides heading node types (h1-h6) for section headers.
 * Contributes the 'heading' node with level attribute (1-6) and 'setHeading' command.
 */

import { defineExtension } from '../define-extension';
import type { NodeDefinition } from '../../schema/types/node-definition';
import type { AttributeDefinition } from '../../schema/types/attribute-definition';
import { NodeContent } from '../../schema/types/content-expression';
import type { Command } from '../../commands/types';
import { DOMOutputDescriptor, ExtensionDefinition, ExtensionDOMSpecs, ExtensionOptions, ExtensionScope, InputRuleDefinition } from '../types';
import { createTextBlockRule } from '../inputrules/transform-input-rule';
import { setHeadingCommand } from '../../commands/builtins/structure/set-heading';
import { mergeAlignStyle, textAlignAttribute } from './common/text-align-attributes';
import { indentAttribute, mergeIndentStyle } from './common/indent-attributes';
import { parseBlockFormat, BlockFormatDefault } from './common/block-format-attributes';

/**
 * Schema defaults for the block-format attributes carried by `heading`.
 * Kept in one place so the parseDOM `getAttrs` and the node definition stay
 * in lockstep.
 */
const headingParseDefaults: readonly BlockFormatDefault[] = [
    { name: 'align', value: textAlignAttribute.default },
    { name: 'indent', value: indentAttribute.default }
];

/**
 * Payload accepted by the setHeading command.
 *
 * @property {number} level - The heading level (1-6)
 */
export interface SetHeadingPayload {
    level: number;
}

/**
 * Minimum heading level.
 */
export const HEADING_MIN_LEVEL: number = 1;

/**
 * Maximum heading level.
 */
export const HEADING_MAX_LEVEL: number = 6;

/**
 * Heading built-in extension.
 * Contributes heading node (h1-h6) and associated commands.
 */
export const headingExtension: ExtensionDefinition<ExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'heading',

    /**
     * Tier 1 — non-recursive primary filler. `heading.createAndFill()` terminates
     * immediately (content: inline*), so it must be registered before recursive containers.
     */
    priority: 100,

    /**
     * Adds options to the heading extension.
     *
     * @returns {ExtensionOptions} The options added to this extension.
     */
    defineOptions(): ExtensionOptions {
        return {
            htmlAttributes: {}
        };
    },

    /**
     * Registers the `heading` node type.
     *
     * @returns {NodeDefinition[]} Array containing the heading node definition.
     */
    nodes(): NodeDefinition[] {
        const headingNode: NodeDefinition = {
            name: 'heading',
            group: 'block',
            content: NodeContent.inline().zeroOrMore(),
            attrs: [
                {
                    name: 'level',
                    type: 'number',
                    default: 1
                } as AttributeDefinition,
                textAlignAttribute,
                indentAttribute
            ]
        };
        return [headingNode];
    },

    /**
     * Contributes the `setHeading` command for programmatic conversion of the current block to a heading.
     *
     * @returns {Command[]} Array containing the setHeading command.
     */
    commands(): Command[] {
        return [setHeadingCommand as any];
    },

    /**
     * Renders heading nodes as semantic heading tags with user-supplied HTML attributes.
     *
     * @param {ExtensionScope<ExtensionOptions>} this Extension scope
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
     */
    domSpecs(this: ExtensionScope<ExtensionOptions>): ExtensionDOMSpecs {
        const attrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        return {
            nodes: {
                heading: {
                    toDOM: (nodeAttrs: Record<string, unknown>) => {
                        const level: number = (nodeAttrs['level'] as number) ?? 1;
                        const tag: string = `h${Math.max(HEADING_MIN_LEVEL, Math.min(HEADING_MAX_LEVEL, level))}`;
                        // Compose align + indent so both render together on the heading.
                        const mergedAttrs: Record<string, unknown> = mergeIndentStyle(
                            mergeAlignStyle(attrs, nodeAttrs['align']),
                            nodeAttrs['indent']
                        );
                        return [tag, mergedAttrs, 0] as DOMOutputDescriptor;
                    },
                    parseDOM: [
                        // Preserve `align` and `indent` from pasted HTML so
                        // indentation survives clipboard round-trips.
                        {
                            tag: 'h1',
                            attrs: { level: 1 },
                            getAttrs: (dom: unknown): Record<string, unknown> => ({
                                level: 1,
                                ...parseBlockFormat(dom, headingParseDefaults)
                            })
                        },
                        {
                            tag: 'h2',
                            attrs: { level: 2 },
                            getAttrs: (dom: unknown): Record<string, unknown> => ({
                                level: 2,
                                ...parseBlockFormat(dom, headingParseDefaults)
                            })
                        },
                        {
                            tag: 'h3',
                            attrs: { level: 3 },
                            getAttrs: (dom: unknown): Record<string, unknown> => ({
                                level: 3,
                                ...parseBlockFormat(dom, headingParseDefaults)
                            })
                        },
                        {
                            tag: 'h4',
                            attrs: { level: 4 },
                            getAttrs: (dom: unknown): Record<string, unknown> => ({
                                level: 4,
                                ...parseBlockFormat(dom, headingParseDefaults)
                            })
                        },
                        {
                            tag: 'h5',
                            attrs: { level: 5 },
                            getAttrs: (dom: unknown): Record<string, unknown> => ({
                                level: 5,
                                ...parseBlockFormat(dom, headingParseDefaults)
                            })
                        },
                        {
                            tag: 'h6',
                            attrs: { level: 6 },
                            getAttrs: (dom: unknown): Record<string, unknown> => ({
                                level: 6,
                                ...parseBlockFormat(dom, headingParseDefaults)
                            })
                        }
                    ]
                }
            }
        };
    },

    inputRules(): readonly InputRuleDefinition[] {
        const levels: number[] = [1, 2, 3, 4, 5, 6];
        return levels.map((level: number) =>
            createTextBlockRule({
                id: `heading:h${level}`,
                pattern: getHeadingPattern(level),
                target: 'heading',
                attributeProvider: {
                    level
                }
            })
        );
    },

    // ── Keyboard Shortcuts ─────────────────────────────────────────────────

    /**
     * Contributes keyboard shortcuts for heading levels.
     * Maps Ctrl/Cmd + Alt + 1-6 to setHeading commands for h1-h6.
     *
     * @returns {Object} Keyboard shortcut entries for heading levels.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-Alt-1': () => this.editor.commands.setHeading({ level: 1 }),
            'Mod-Alt-2': () => this.editor.commands.setHeading({ level: 2 }),
            'Mod-Alt-3': () => this.editor.commands.setHeading({ level: 3 }),
            'Mod-Alt-4': () => this.editor.commands.setHeading({ level: 4 }),
            'Mod-Alt-5': () => this.editor.commands.setHeading({ level: 5 }),
            'Mod-Alt-6': () => this.editor.commands.setHeading({ level: 6 })
        };
    }
});

function getHeadingPattern(level: number): RegExp {
    switch (level) {
    case 1: return /^(#{1}) $/;
    case 2: return /^(#{2}) $/;
    case 3: return /^(#{3}) $/;
    case 4: return /^(#{4}) $/;
    case 5: return /^(#{5}) $/;
    case 6: return /^(#{6}) $/;
    default: return /^(#{1}) $/;
    }
}
export default headingExtension;
