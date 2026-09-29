import { DocumentRoot, EditorNode, TextNode } from '../../src/model/editor-node';
import { Mark } from '../../src/model/mark';

describe('DocumentRoot / EditorNode / TextNode — type contracts', () => {
    it('constructs a valid DocumentRoot with nested paragraph and text node', () => {
        const bold: Mark = { type: 'bold', attrs: {} };

        const textNode: TextNode = {
            id: '00000000-0000-4000-8000-000000000003',
            type: 'text',
            text: 'Hello world',
            attrs: {},
            children: [],
            marks: [bold]
        };

        const paragraph: EditorNode = {
            id: '00000000-0000-4000-8000-000000000002',
            type: 'paragraph',
            attrs: {},
            children: [textNode],
            marks: []
        };

        const doc: DocumentRoot = {
            id: '00000000-0000-4000-8000-000000000001',
            type: 'document',
            schemaVersion: 1,
            attrs: {},
            children: [paragraph],
            marks: []
        };

        expect(doc.type).toBe('document');
        expect(doc.schemaVersion).toBe(1);
        expect(doc.children.length).toBe(1);
        expect((doc.children[0] as EditorNode).type).toBe('paragraph');
        expect(((doc.children[0] as EditorNode).children[0] as TextNode).text).toBe('Hello world');
        expect(((doc.children[0] as EditorNode).children[0] as TextNode).marks[0].type).toBe('bold');
    });
});
