import { MarkDefinition } from '../../src/schema/types/mark-definition';

/**
 * All 12 built-in mark types from SPEC §3.3.
 */
export const builtInMarkDefs: MarkDefinition[] = [
    { name: 'bold',            inclusive: true  },
    { name: 'italic',          inclusive: true  },
    { name: 'underline',       inclusive: true  },
    { name: 'strikethrough',   inclusive: true  },
    { name: 'code',            inclusive: false },
    {
        name: 'color',
        inclusive: true,
        attrs: [{ name: 'color', type: 'string', default: '#000000' }]
    },
    {
        name: 'backgroundColor',
        inclusive: true,
        attrs: [{ name: 'color', type: 'string', default: 'transparent' }]
    },
    {
        name: 'fontSize',
        inclusive: true,
        attrs: [{ name: 'size', type: 'string', default: '16px' }]
    },
    {
        name: 'fontFamily',
        inclusive: true,
        attrs: [{ name: 'family', type: 'string', default: 'inherit' }]
    },
    {
        name: 'superscript',
        inclusive: false,
        excludes: ['subscript']
    },
    {
        name: 'subscript',
        inclusive: false,
        excludes: ['superscript']
    },
    {
        name: 'link',
        inclusive: false,
        spanning: false,
        attrs: [
            { name: 'href', type: 'string', default: '' },
            { name: 'title', type: 'string', default: '' },
            { name: 'target', type: 'string', default: '_self' }
        ]
    }
];
