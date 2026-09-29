import { DocumentRoot, EditorNode, TextNode } from '../../src/model/editor-node';
import { Mark } from '../../src/model/mark';

// ── Helpers ─────────────────────────────────────────────────────────────────

function textNode(id: string, text: string, marks: Mark[] = []): TextNode {
    return { id, type: 'text', text, attrs: {}, children: [], marks };
}

function node(id: string, type: string, children: EditorNode[], attrs: Record<string, unknown> = {}): EditorNode {
    return { id, type, attrs, children, marks: [] };
}

// ── Fixture 1: emptyDoc — one empty paragraph ────────────────────────────────

export const emptyDoc: DocumentRoot = {
    id: '00000000-0000-4000-8000-000000000001',
    type: 'document',
    schemaVersion: 1,
    attrs: {},
    marks: [],
    children: [
        {
            id: '00000000-0000-4000-8000-000000000002',
            type: 'paragraph',
            attrs: {},
            children: [],
            marks: []
        }
    ]
};

// ── Fixture 2: singleParagraphDoc — paragraph with bold + italic text ────────

export const singleParagraphDoc: DocumentRoot = {
    id: '00000000-0000-4000-8000-000000000010',
    type: 'document',
    schemaVersion: 1,
    attrs: {},
    marks: [],
    children: [
        {
            id: '00000000-0000-4000-8000-000000000011',
            type: 'paragraph',
            attrs: {},
            marks: [],
            children: [
                textNode('00000000-0000-4000-8000-000000000012', 'Hello '),
                textNode('00000000-0000-4000-8000-000000000013', 'world', [
                    { type: 'bold', attrs: {} },
                    { type: 'italic', attrs: {} }
                ]),
                textNode('00000000-0000-4000-8000-000000000014', '!')
            ]
        }
    ]
};

// ── Fixture 3: nestedListDoc — ordered list with nested items ─────────────────

export const nestedListDoc: DocumentRoot = {
    id: '00000000-0000-4000-8000-000000000020',
    type: 'document',
    schemaVersion: 1,
    attrs: {},
    marks: [],
    children: [
        {
            id: '00000000-0000-4000-8000-000000000021',
            type: 'numberedList',
            attrs: {},
            marks: [],
            children: [
                {
                    id: '00000000-0000-4000-8000-000000000022',
                    type: 'listItem',
                    attrs: {},
                    marks: [],
                    children: [
                        {
                            id: '00000000-0000-4000-8000-000000000023',
                            type: 'paragraph',
                            attrs: {},
                            marks: [],
                            children: [
                                textNode('00000000-0000-4000-8000-000000000024', 'Item one')
                            ]
                        }
                    ]
                },
                {
                    id: '00000000-0000-4000-8000-000000000025',
                    type: 'listItem',
                    attrs: {},
                    marks: [],
                    children: [
                        {
                            id: '00000000-0000-4000-8000-000000000026',
                            type: 'paragraph',
                            attrs: {},
                            marks: [],
                            children: [
                                textNode('00000000-0000-4000-8000-000000000027', 'Item two')
                            ]
                        },
                        {
                            id: '00000000-0000-4000-8000-000000000028',
                            type: 'bulletList',
                            attrs: {},
                            marks: [],
                            children: [
                                {
                                    id: '00000000-0000-4000-8000-000000000029',
                                    type: 'listItem',
                                    attrs: {},
                                    marks: [],
                                    children: [
                                        {
                                            id: '00000000-0000-4000-8000-000000000030',
                                            type: 'paragraph',
                                            attrs: {},
                                            marks: [],
                                            children: [
                                                textNode('00000000-0000-4000-8000-000000000031', 'Nested item')
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};
