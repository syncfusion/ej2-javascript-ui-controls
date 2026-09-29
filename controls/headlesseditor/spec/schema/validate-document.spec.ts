/**
 * validateDocument unit tests.
 */
import { validateDocument } from '../../src/schema/validation/validate-document';
import { SchemaManager } from '../../src/schema/schema-manager';
import { NodeContent } from '../../src/schema/types/content-expression';
import { DocumentRoot, TextNode } from '../../src/model/editor-node';

function buildTestSchema(): SchemaManager {
    const sm = new SchemaManager();
    sm.registerNode({ name: 'document', group: 'root', content: NodeContent.block().oneOrMore() });
    sm.registerNode({ name: 'paragraph', group: 'block', content: NodeContent.inline().zeroOrMore() });
    sm.registerNode({ name: 'text', group: 'inline', inline: true });
    return sm;
}

describe('validateDocument', () => {
    it('validates a simple document with one paragraph', () => {
        const schema = buildTestSchema();
        const root: DocumentRoot = {
            id: 'd1',
            type: 'document',
            attrs: {},
            children: [
                {
                    id: 'p1',
                    type: 'paragraph',
                    attrs: {},
                    children: [
                        { id: 't1', type: 'text', text: 'Hello', attrs: {}, children: [], marks: [] } as TextNode
                    ],
                    marks: []
                }
            ],
            marks: [],
            schemaVersion: 1
        };
        const result = validateDocument(root, schema);
        expect(result.valid).toBe(true);
    });

    it('rejects root with wrong type', () => {
        const schema = buildTestSchema();
        const root = {
            id: 'd1',
            type: 'section',
            attrs: {},
            children: [],
            marks: [],
            schemaVersion: 1
        } as unknown as DocumentRoot;
        const result = validateDocument(root, schema);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.path === 'type')).toBe(true);
    });

    it('rejects root with missing schemaVersion', () => {
        const schema = buildTestSchema();
        const root = {
            id: 'd1',
            type: 'document',
            attrs: {},
            children: [],
            marks: []
        } as unknown as DocumentRoot;
        const result = validateDocument(root, schema);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.path === 'schemaVersion')).toBe(true);
    });

    it('rejects unregistered node type', () => {
        const schema = buildTestSchema();
        const root = {
            id: 'd1',
            type: 'document',
            attrs: {},
            children: [
                { id: 'x1', type: 'unknown-block', attrs: {}, children: [], marks: [] }
            ],
            marks: [],
            schemaVersion: 1
        } as unknown as DocumentRoot;
        const result = validateDocument(root, schema);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('not registered'))).toBe(true);
    });

    it('rejects invalid parent/child combination', () => {
        const schema = buildTestSchema();
        // text is inline, but document expects block
        const root = {
            id: 'd1',
            type: 'document',
            attrs: {},
            children: [
                { id: 't1', type: 'text', text: 'orphan', attrs: {}, children: [], marks: [] }
            ],
            marks: [],
            schemaVersion: 1
        } as unknown as DocumentRoot;
        const result = validateDocument(root, schema);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.message.includes('not a valid child'))).toBe(true);
    });

    it('rejects node with empty id', () => {
        const schema = buildTestSchema();
        const root = {
            id: 'd1',
            type: 'document',
            attrs: {},
            children: [
                { id: '', type: 'paragraph', attrs: {}, children: [], marks: [] }
            ],
            marks: [],
            schemaVersion: 1
        } as unknown as DocumentRoot;
        const result = validateDocument(root, schema);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.path === 'root.children[0].id')).toBe(true);
    });

    it('rejects a leaf node that erroneously has children', () => {
        const schema = buildTestSchema();
        // Register an image node that is `leaf: true` and is a valid inline child of paragraphs.
        schema.registerNode({ name: 'image', group: 'inline', leaf: true });
        const root: DocumentRoot = {
            id: 'd1',
            type: 'document',
            attrs: {},
            children: [
                {
                    id: 'p1',
                    type: 'paragraph',
                    attrs: {},
                    // image (leaf) is being given children — should be rejected
                    children: [
                        { id: 'i1', type: 'image', attrs: {}, children: [
                            { id: 'i2', type: 'image', attrs: {}, children: [], marks: [] } as TextNode
                        ], marks: [] } as TextNode
                    ],
                    marks: []
                }
            ],
            marks: [],
            schemaVersion: 1
        };
        const result = validateDocument(root, schema);
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) =>
            e.path === 'root.children[0].children[0].children' &&
            /Leaf node "image" must not have children/.test(e.message)
        )).toBe(true);
    });

    it('accepts a non-leaf container node with no children defined (defaults to empty)', () => {
        const schema = buildTestSchema();
        // paragraph is non-leaf; walk should default `children` to [] when undefined.
        const root = {
            id: 'd1',
            type: 'document',
            attrs: {},
            children: [
                { id: 'p1', type: 'paragraph', attrs: {}, marks: [] }
            ],
            marks: [],
            schemaVersion: 1
        } as unknown as DocumentRoot;
        const result = validateDocument(root, schema);
        expect(result.valid).toBe(true);
    });
});
