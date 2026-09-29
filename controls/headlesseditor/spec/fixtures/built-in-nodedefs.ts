import { NodeDefinition } from '../../src/schema/types/node-definition';
import { NodeContent } from '../../src/schema/types/content-expression';

/**
 * All 18 built-in node types from SPEC §3.2.
 *
 * Order matters for PM schema: 'doc' must appear first.
 * 'text' must also be present (PM requires it).
 */
export const builtInNodeDefs: NodeDefinition[] = [
    // Root
    {
        name: 'document',
        group: 'root',
        content: NodeContent.block().oneOrMore()
    },

    // Block nodes
    {
        name: 'paragraph',
        group: 'block',
        content: NodeContent.inline().zeroOrMore()
    },
    {
        name: 'heading',
        group: 'block',
        content: NodeContent.inline().zeroOrMore(),
        attrs: [
            { name: 'level', type: 'number', default: 1 }
        ]
    },
    {
        name: 'blockquote',
        group: 'block',
        content: NodeContent.block().oneOrMore()
    },
    {
        name: 'callout',
        group: 'block',
        content: NodeContent.block().oneOrMore(),
        attrs: [
            { name: 'variant', type: 'enum', values: ['info', 'warning', 'error', 'success'], default: 'info' }
        ]
    },
    {
        name: 'codeBlock',
        group: 'block',
        content: NodeContent.text().zeroOrMore(),
        attrs: [
            { name: 'language', type: 'string', default: '' }
        ]
    },
    {
        name: 'bulletList',
        group: 'block',
        content: NodeContent.node('listItem').oneOrMore()
    },
    {
        name: 'numberedList',
        group: 'block',
        content: NodeContent.node('listItem').oneOrMore()
    },
    {
        name: 'listItem',
        group: 'block',
        content: NodeContent.block().oneOrMore()
    },
    {
        name: 'checkItem',
        group: 'block',
        content: NodeContent.block().oneOrMore(),
        attrs: [
            { name: 'checked', type: 'boolean', default: false }
        ]
    },
    {
        name: 'table',
        group: 'block',
        content: NodeContent.node('tableRow').oneOrMore()
    },
    {
        name: 'tableRow',
        group: 'block',
        content: NodeContent.node('tableCell').oneOrMore()
    },
    {
        name: 'tableCell',
        group: 'block',
        content: NodeContent.block().oneOrMore()
    },
    {
        name: 'image',
        group: 'block',
        leaf: true,
        attrs: [
            { name: 'src', type: 'string', default: '' },
            { name: 'alt', type: 'string', default: '' },
            { name: 'title', type: 'string', default: '' }
        ]
    },
    {
        name: 'horizontalRule',
        group: 'block',
        leaf: true
    },

    // Inline nodes
    {
        name: 'text',
        group: 'inline',
        inline: true,
        leaf: true
    },
    {
        name: 'mention',
        group: 'inline',
        inline: true,
        leaf: true,
        attrs: [
            { name: 'userId', type: 'string', default: '' },
            { name: 'label', type: 'string', default: '' }
        ]
    },
    {
        name: 'emoji',
        group: 'inline',
        inline: true,
        leaf: true,
        attrs: [
            { name: 'code', type: 'string', default: '' }
        ]
    },
    {
        name: 'hardBreak',
        group: 'inline',
        inline: true,
        leaf: true
    }
];
