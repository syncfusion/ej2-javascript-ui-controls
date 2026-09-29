/**
 * List Extension
 *
 * Provides built-in support for bullet lists, ordered lists, and list items.
 * Contributes `bulletList`, `orderedList`, and `listItem` node types along
 * with all commands required for list editing.
 */

import { defineExtension } from '../define-extension';
import type { NodeDefinition } from '../../schema/types/node-definition';
import type { AttributeDefinition } from '../../schema/types/attribute-definition';
import { NodeContent } from '../../schema/types/content-expression';
import type { Command } from '../../commands/types';
import {
    DOMOutputDescriptor,
    ExtensionDefinition,
    ExtensionDOMSpecs,
    ExtensionOptions,
    ExtensionScope,
    InputRuleDefinition
} from '../types';
import { toggleBulletListCommand } from '../../commands/builtins/list/toggle-bullet-list';
import { toggleOrderedListCommand } from '../../commands/builtins/list/toggle-ordered-list';
import { toggleListTypeCommand } from '../../commands/builtins/list/toggle-list-type';
import { splitListItemCommand } from '../../commands/builtins/list/split-list-item';
import { indentListItemCommand } from '../../commands/builtins/list/indent-list-item';
import { outdentListItemCommand } from '../../commands/builtins/list/outdent-list-item';
import { joinListBackwardCommand } from '../../commands/builtins/list/join-list-backward';
import { deleteListItemCommand } from '../../commands/builtins/list/delete-list-item';
import { setOrderedListTypeCommand } from '../../commands/builtins/list/set-ordered-list-type';

import { createWrappingRule } from '../inputrules/wrap-input-rule';
import { mergeAlignStyle, textAlignAttribute } from './common/text-align-attributes';
import { parseBlockFormat, BlockFormatDefault } from './common/block-format-attributes';
import {
    DEFAULT_BULLET_LIST_STYLE,
    DEFAULT_ORDERED_LIST_STYLE,
    bulletListStyleTypeAttribute,
    orderedListStyleTypeAttribute,
    mergeListStyleTypeStyle,
    parseListStyleType
} from './common/list-style-attributes';
import { setBulletListTypeCommand } from '../../commands/builtins/list/set-bullet-list-type';

/**
 * Schema defaults for the block-format attributes carried by `listItem`.
 * `listItem` only carries `align` (no `indent`), so the defaults list
 * contains a single entry.
 */
const listItemParseDefaults: readonly BlockFormatDefault[] = [
    { name: 'align', value: textAlignAttribute.default }
];
/**
 * Options accepted by the List extension.
 */
export interface ListExtensionOptions extends ExtensionOptions {
    /** HTML attributes applied to the list container elements (`<ul>`, `<ol>`). */
    readonly htmlAttributes?: Readonly<Record<string, string>>;
    /** HTML attributes applied to list item elements (`<li>`). */
    readonly itemHtmlAttributes?: Readonly<Record<string, string>>;
}

/**
 * List built-in extension.
 *
 * Contributes:
 * - `bulletList` node — unordered list container rendered as `<ul>`
 * - `orderedList` node — ordered list container rendered as `<ol>`
 * - `listItem` node — list item rendered as `<li>`, supports nested block content
 * - Full list editing command set (toggle, indent, outdent, split)
 * - Extension keymaps for common list shortcuts
 */
export const listExtension: ExtensionDefinition<ListExtensionOptions> = defineExtension({
    /**
     * Unique extension identifier.
     */
    name: 'list',

    /**
     * Tier 3 — recursive containers. `bulletList` and `orderedList` are in the
     * `block list` group; `listItem` has `paragraph block*` content. All three
     * must be registered after Tier 1 primary fillers.
     */
    priority: 10,

    /**
     * Defines configurable options for the List extension.
     *
     * @returns {ListExtensionOptions} Default option values.
     */
    defineOptions(): ListExtensionOptions {
        return {
            htmlAttributes: {},
            itemHtmlAttributes: {}
        };
    },

    /**
     * Registers `bulletList`, `orderedList`, and `listItem` node types.
     *
     * Node naming matches the editor schema convention:
     * - `bulletList`  — unordered list (`<ul>`), `listStyleType` string attribute
     *   with default `'disc'` (CSS `list-style-type` values)
     * - `orderedList` — ordered list (`<ol>`) with `order` number attribute for
     *   the starting number and `listStyleType` string attribute with default
     *   `'decimal'` for marker presentation
     * - `listItem`    — list item (`<li>`) that may contain block content and nested lists
     *
     * @returns {NodeDefinition[]} Array of list node definitions.
     */
    nodes(): NodeDefinition[] {
        const bulletListNode: NodeDefinition = {
            name: 'bulletList',
            group: 'block list',
            content: NodeContent.node('listItem').oneOrMore(),
            attrs: [bulletListStyleTypeAttribute]
        };

        const orderedListAttrs: AttributeDefinition[] = [
            {
                name: 'order',
                type: 'number',
                default: 1
            } as AttributeDefinition,
            orderedListStyleTypeAttribute
        ];

        const orderedListNode: NodeDefinition = {
            name: 'orderedList',
            group: 'block list',
            content: NodeContent.node('listItem').oneOrMore(),
            attrs: orderedListAttrs
        };

        const listItemNode: NodeDefinition = {
            name: 'listItem',
            group: 'list',
            content: NodeContent.sequence(NodeContent.node('paragraph'), NodeContent.block().zeroOrMore()),
            attrs: [textAlignAttribute]
        };

        return [bulletListNode, orderedListNode, listItemNode];
    },

    /**
     * Contributes all required list editing commands.
     *
     * Commands that have ProseMirror equivalents delegate directly to those
     * implementations. Only editor-specific commands add custom logic.
     *
     * @returns {Command[]} Array of list commands.
     */
    commands(): Command[] {
        return [
            toggleBulletListCommand,
            toggleOrderedListCommand,
            toggleListTypeCommand,
            splitListItemCommand,
            indentListItemCommand,
            outdentListItemCommand,
            joinListBackwardCommand,
            deleteListItemCommand,
            setOrderedListTypeCommand,
            setBulletListTypeCommand
        ] as Command[];
    },

    /**
     * Renders list nodes as standard HTML elements.
     *
     * - `bulletList`  → `<ul>` with `list-style-type` inline CSS style and
     *   optional HTML attributes
     * - `orderedList` → `<ol>` with `start` attribute when order ≠ 1 plus
     *   `list-style-type` inline CSS style
     * - `listItem`    → `<li>` with optional HTML attributes
     *
     * Both list containers consistently serialize the `listStyleType` node
     * attribute as a CSS `list-style-type` inline style — never as the legacy
     * HTML `<ol type>` attribute. Parsing recognizes both formats.
     *
     * @param {ExtensionScope<ListExtensionOptions>} this Extension scope.
     * @returns {ExtensionDOMSpecs} DOM rendering specifications.
     */
    domSpecs(this: ExtensionScope<ListExtensionOptions>): ExtensionDOMSpecs {
        const listAttrs: Readonly<Record<string, string>> = this.options?.htmlAttributes ?? {};
        const itemAttrs: Readonly<Record<string, string>> = this.options?.itemHtmlAttributes ?? {};

        return {
            nodes: {
                bulletList: {
                    toDOM: (attrs: Record<string, unknown>): DOMOutputDescriptor => [
                        'ul', mergeListStyleTypeStyle(listAttrs, attrs['listStyleType']), 0
                    ],
                    parseDOM: [
                        { tag: 'ul', getAttrs: (dom: any) => parseListStyleType(dom as HTMLElement, DEFAULT_BULLET_LIST_STYLE) }
                    ]
                },
                orderedList: {
                    toDOM: (attrs: Record<string, unknown>): DOMOutputDescriptor => {
                        const order: number = (attrs['order'] as number) ?? 1;
                        const extra: Record<string, string> = mergeListStyleTypeStyle(listAttrs, attrs['listStyleType']);
                        if (order !== 1) { extra['start'] = String(order); }
                        return ['ol', extra, 0];
                    },
                    parseDOM: [
                        {
                            tag: 'ol',
                            getAttrs: (dom: any): Record<string, unknown> => ({
                                order: +(dom as HTMLElement).getAttribute('start') || 1,
                                ...parseListStyleType(dom as HTMLElement, DEFAULT_ORDERED_LIST_STYLE)
                            })
                        }
                    ]
                },
                listItem: {
                    toDOM: (nodeAttrs: Record<string, unknown>): DOMOutputDescriptor => {
                        return ['li', mergeAlignStyle(itemAttrs, nodeAttrs['align']), 0];
                    },
                    parseDOM: [
                        {
                            tag: 'li',
                            // Preserve `align` from pasted `<li>` elements so
                            // indentation-style alignment on list items
                            // survives clipboard round-trips.
                            getAttrs: (dom: unknown): Record<string, unknown> => ({
                                ...parseBlockFormat(dom, listItemParseDefaults)
                            })
                        }
                    ]
                }
            }
        };
    },

    /**
     * Registers keyboard shortcuts for list operations.
     * List-related keyboard shortcuts (`Tab`, `Shift-Tab`, `Backspace`,
     * `Enter`, `Delete`) are owned by the dedicated `listKeymapExtension`
     * Register `listKeymapExtension` in your `extensions` array (after
     * `listExtension`).
     *
     * @returns {Object} Keymap entries mapping shortcuts to command names.
     */
    keyboardShortcuts(): Record<string, () => boolean> {
        return {
            'Mod-Shift-8': () => this.editor.commands.toggleBulletList(),
            'Mod-Shift-9': () => this.editor.commands.toggleOrderedList()
        };
    },

    inputRules(): readonly InputRuleDefinition[] {
        return [
            createWrappingRule({
                id: 'list:bullet-dash',
                pattern: /^- $/,
                target: 'bulletList',
                attributeProvider: (): Record<string, unknown> => ({
                    listStyleType: DEFAULT_BULLET_LIST_STYLE
                })
            }),

            createWrappingRule({
                id: 'list:bullet-star',
                pattern: /^\* $/,
                target: 'bulletList',
                attributeProvider: (): Record<string, unknown> => ({
                    listStyleType: DEFAULT_BULLET_LIST_STYLE
                })
            }),

            createWrappingRule({
                id: 'list:bullet-plus',
                pattern: /^\+ $/,
                target: 'bulletList',
                attributeProvider: (): Record<string, unknown> => ({
                    listStyleType: DEFAULT_BULLET_LIST_STYLE
                })
            }),

            createWrappingRule({
                id: 'list:ordered',
                pattern: /^(\d+)\. $/,
                target: 'orderedList',
                attributeProvider: (match: RegExpMatchArray): Record<string, unknown> => ({
                    order: Number(match[1]),
                    listStyleType: DEFAULT_ORDERED_LIST_STYLE
                })
            })
        ];
    }
});

export default listExtension;
