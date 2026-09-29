/**
 * validateNodeDefinition unit tests.
 */
import { validateNodeDefinition } from '../../src/schema/validation/validate-node-definition';
import { NodeContent } from '../../src/schema/types/content-expression';

describe('validateNodeDefinition', () => {
    it('accepts a minimal well-formed root document node', () => {
        const result = validateNodeDefinition({ name: 'document', group: 'root' });
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
    });

    it('accepts a block node with content', () => {
        const result = validateNodeDefinition({
            name: 'paragraph',
            group: 'block',
            content: NodeContent.inline().zeroOrMore()
        });
        expect(result.valid).toBe(true);
    });

    it('rejects empty name', () => {
        const result = validateNodeDefinition({ name: '', group: 'block' });
        expect(result.valid).toBe(false);
        expect(result.errors[0].path).toBe('name');
    });

    it('rejects inline + content combination', () => {
        const result = validateNodeDefinition({
            name: 'mention',
            group: 'inline',
            inline: true,
            content: NodeContent.text()
        });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.path === 'content')).toBe(true);
    });

    it('rejects leaf + content combination', () => {
        const result = validateNodeDefinition({
            name: 'image',
            group: 'inline',
            leaf: true,
            content: NodeContent.text()
        });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.path === 'content')).toBe(true);
    });

    it('rejects inline + leaf combination', () => {
        const result = validateNodeDefinition({
            name: 'bogus',
            group: 'inline',
            inline: true,
            leaf: true
        });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.path === 'inline')).toBe(true);
    });

    it('rejects document node with group !== root', () => {
        const result = validateNodeDefinition({ name: 'document', group: 'block' });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.path === 'group')).toBe(true);
    });

    it('rejects non-document node with group === root', () => {
        const result = validateNodeDefinition({ name: 'subtree', group: 'root' });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.path === 'group')).toBe(true);
    });

    it('rejects duplicate attribute names', () => {
        const result = validateNodeDefinition({
            name: 'paragraph',
            group: 'block',
            attrs: [
                { name: 'align', type: 'string' },
                { name: 'align', type: 'enum', values: ['left', 'right'] }
            ]
        });
        expect(result.valid).toBe(false);
        expect(result.errors.some((e) => e.path === 'attrs.align')).toBe(true);
    });

    it('is integrated into SchemaManager.registerNode — invalid def throws', () => {
        // Imported lazily to also confirm the integration is wired
        const { SchemaManager } = require('../../src/schema/schema-manager');
        const sm = new SchemaManager();
        expect(() => sm.registerNode({ name: 'bad', group: 'inline', inline: true, leaf: true }))
            .toThrowError(/invalid node definition/);
    });
});
