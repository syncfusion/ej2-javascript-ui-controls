/**
 * SchemaManager integration-level spec.
 * These tests verify that SchemaManager definitions flow correctly into
 * PMSchemaAdapter (compiled in Section 7). They are written now as
 * compile-time / contract tests and will pass once Section 7 is complete.
 *
 * NOTE: Tests in this file that depend on PMSchemaAdapter are marked
 * `xdescribe` until Section 7 is implemented (they are pending, not failing).
 */
import { SchemaManager } from '../../src/schema/schema-manager';
import { NodeContent } from '../../src/schema/types/content-expression';
import * as attributeDefinition from '../../src/schema/types/attribute-definition';

describe('SchemaManager contract tests', () => {
    it('getAllNodes includes registered nodes in insertion order', () => {
        const sm = new SchemaManager();
        sm.registerNode({ name: 'document', group: 'root' });
        sm.registerNode({ name: 'paragraph', group: 'block' });
        sm.registerNode({ name: 'text', group: 'inline', leaf: true });

        const names = sm.getAllNodes().map((n) => n.name);
        expect(names).toEqual(['document', 'paragraph', 'text']);
    });

    it('load() followed by validate() succeeds for a minimal valid schema', () => {
        const sm = new SchemaManager();
        sm.load({
            nodes: [
                {
                    name: 'document',
                    group: 'root',
                    content: NodeContent.block().oneOrMore()
                },
                {
                    name: 'paragraph',
                    group: 'block',
                    content: NodeContent.inline().zeroOrMore()
                },
                {
                    name: 'text',
                    group: 'inline',
                    leaf: true
                }
            ],
            marks: [{ name: 'bold' }, { name: 'italic' }]
        });
        expect(() => sm.validate()).not.toThrow();
    });

    it('attribute color default passes through registration unchanged', () => {
        const sm = new SchemaManager();
        sm.registerNode({
            name: 'coloredSpan',
            group: 'inline',
            attrs: [
                { name: 'color', type: 'string', default: '#ff0000' }
            ]
        });
        const def = sm.getNode('coloredSpan')!;
        expect(def.attrs![0].default).toBe('#ff0000');
    });
});

describe('SchemaManager.isValidChild — content tree branches', () => {
    it('returns false when the parent node is not registered', () => {
        const sm = new SchemaManager();
        sm.registerNode({ name: 'paragraph', group: 'block' });
        expect(sm.isValidChild('missingParent', 'paragraph')).toBe(false);
    });

    it('returns false when the child node is not registered', () => {
        const sm = new SchemaManager();
        sm.registerNode({ name: 'document', group: 'root', content: NodeContent.block().oneOrMore() });
        expect(sm.isValidChild('document', 'missingChild')).toBe(false);
    });

    it('returns false when the parent has no content expression', () => {
        const sm = new SchemaManager();
        sm.registerNode({ name: 'document', group: 'root' });
        sm.registerNode({ name: 'paragraph', group: 'block' });
        expect(sm.isValidChild('document', 'paragraph')).toBe(false);
    });

    it('accepts a child whose group matches a top-level group expression', () => {
        const sm = new SchemaManager();
        sm.registerNode({ name: 'document', group: 'root', content: NodeContent.block().oneOrMore() });
        sm.registerNode({ name: 'paragraph', group: 'block' });
        expect(sm.isValidChild('document', 'paragraph')).toBe(true);
    });

    it('rejects a child whose group does not match a top-level group expression', () => {
        const sm = new SchemaManager();
        sm.registerNode({ name: 'document', group: 'root', content: NodeContent.block().oneOrMore() });
        sm.registerNode({ name: 'paragraph', group: 'block' });
        sm.registerNode({ name: 'text', group: 'inline' });
        expect(sm.isValidChild('document', 'text')).toBe(false);
    });

    it('accepts a child by name when the parent content is a single named node', () => {
        const sm = new SchemaManager();
        sm.registerNode({ name: 'caption', group: 'block', content: NodeContent.text() });
        sm.registerNode({ name: 'text', group: 'inline' });
        expect(sm.isValidChild('caption', 'text')).toBe(true);
    });

    it('rejects a non-matching child when the parent content is a single named node', () => {
        const sm = new SchemaManager();
        sm.registerNode({ name: 'caption', group: 'block', content: NodeContent.text() });
        sm.registerNode({ name: 'image', group: 'inline', leaf: true });
        expect(sm.isValidChild('caption', 'image')).toBe(false);
    });

    it('accepts a child inside a sequence when the child matches by group', () => {
        const sm = new SchemaManager();
        sm.registerNode({
            name: 'document',
            group: 'root',
            content: NodeContent.sequence(
                NodeContent.block().oneOrMore(),
                NodeContent.node('footer').optional()
            )
        });
        sm.registerNode({ name: 'paragraph', group: 'block' });
        sm.registerNode({ name: 'footer', group: 'block' });
        expect(sm.isValidChild('document', 'paragraph')).toBe(true);
        expect(sm.isValidChild('document', 'footer')).toBe(true);
    });

    it('rejects a child inside a sequence when the child matches no branch', () => {
        const sm = new SchemaManager();
        sm.registerNode({
            name: 'document',
            group: 'root',
            content: NodeContent.sequence(
                NodeContent.block().oneOrMore(),
                NodeContent.node('footer').optional()
            )
        });
        sm.registerNode({ name: 'image', group: 'inline', leaf: true });
        expect(sm.isValidChild('document', 'image')).toBe(false);
    });

    it('accepts a child inside a choice when the child matches by node name', () => {
        const sm = new SchemaManager();
        sm.registerNode({
            name: 'imageContainer',
            group: 'block',
            content: NodeContent.choice(
                NodeContent.node('image'),
                NodeContent.node('caption')
            )
        });
        sm.registerNode({ name: 'image', group: 'inline', leaf: true });
        sm.registerNode({ name: 'caption', group: 'block' });
        expect(sm.isValidChild('imageContainer', 'image')).toBe(true);
        expect(sm.isValidChild('imageContainer', 'caption')).toBe(true);
    });

    it('rejects a child inside a choice when no branch matches', () => {
        const sm = new SchemaManager();
        sm.registerNode({
            name: 'imageContainer',
            group: 'block',
            content: NodeContent.choice(
                NodeContent.node('image'),
                NodeContent.node('caption')
            )
        });
        sm.registerNode({ name: 'paragraph', group: 'block' });
        expect(sm.isValidChild('imageContainer', 'paragraph')).toBe(false);
    });
});

describe('SchemaManager._validateAttrs error handling', () => {
    it('coerces a non-Error throw from validateAttributeDefinition via String(e)', () => {
        const sm = new SchemaManager();
        const original = attributeDefinition.validateAttributeDefinition;
        (attributeDefinition as { validateAttributeDefinition: typeof original }).validateAttributeDefinition =
            function (_attr: unknown): void {
                throw 'string failure from attribute validator';
            };
        try {
            expect(() => sm.registerNode({
                name: 'coloredSpan',
                group: 'inline',
                attrs: [{ name: 'color', type: 'string' }]
            })).toThrowError(/string failure from attribute validator/);
        } finally {
            (attributeDefinition as { validateAttributeDefinition: typeof original }).validateAttributeDefinition = original;
        }
    });
});

// Section 7 dependency — pending until PMSchemaAdapter exists
xdescribe('SchemaManager → PMSchemaAdapter integration', () => {
    it('attribute color default passes through to PM NodeSpec attrs', () => {
        // Will be implemented in Section 7 (PMSchemaAdapter.spec.ts)
    });
});
