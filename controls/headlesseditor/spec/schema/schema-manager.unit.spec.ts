import { SchemaManager } from '../../src/schema/schema-manager';
import { NodeContent } from '../../src/schema/types/content-expression';
import { NodeDefinition } from '../../src/schema/types/node-definition';
import { MarkDefinition } from '../../src/schema/types/mark-definition';

describe('SchemaManager — register and retrieve', () => {
    let sm: SchemaManager;

    beforeEach(() => {
        sm = new SchemaManager();
    });

    it('registers and retrieves a node definition', () => {
        const def: NodeDefinition = { name: 'paragraph', group: 'block' };
        sm.registerNode(def);
        expect(sm.getNode('paragraph')).toBe(def);
    });

    it('registers and retrieves a mark definition', () => {
        const def: MarkDefinition = { name: 'bold' };
        sm.registerMark(def);
        expect(sm.getMark('bold')).toBe(def);
    });

    it('getAllNodes returns all registered nodes', () => {
        sm.registerNode({ name: 'paragraph', group: 'block' });
        sm.registerNode({ name: 'heading', group: 'block' });
        expect(sm.getAllNodes().length).toBe(2);
    });

    it('getAllMarks returns all registered marks', () => {
        sm.registerMark({ name: 'bold' });
        sm.registerMark({ name: 'italic' });
        expect(sm.getAllMarks().length).toBe(2);
    });

    it('returns undefined for an unregistered node', () => {
        expect(sm.getNode('nonexistent')).toBeUndefined();
    });

    it('returns undefined for an unregistered mark', () => {
        expect(sm.getMark('nonexistent')).toBeUndefined();
    });
});

describe('SchemaManager — duplicate registration', () => {
    let sm: SchemaManager;

    beforeEach(() => {
        sm = new SchemaManager();
    });

    it('throws on duplicate node registration', () => {
        sm.registerNode({ name: 'paragraph', group: 'block' });
        expect(() => sm.registerNode({ name: 'paragraph', group: 'block' }))
            .toThrowError(/duplicate.*paragraph/i);
    });

    it('throws on duplicate mark registration', () => {
        sm.registerMark({ name: 'bold' });
        expect(() => sm.registerMark({ name: 'bold' }))
            .toThrowError(/duplicate.*bold/i);
    });
});

describe('SchemaManager — attribute validation on registration', () => {
    let sm: SchemaManager;

    beforeEach(() => {
        sm = new SchemaManager();
    });

    it('throws when registering a node with an invalid enum attribute (empty values)', () => {
        expect(() => sm.registerNode({
            name: 'heading',
            group: 'block',
            attrs: [{ name: 'level', type: 'enum', values: [] }]
        })).toThrowError(/enum.*values|invalid attribute/i);
    });

    it('accepts a node with a valid enum attribute', () => {
        expect(() => sm.registerNode({
            name: 'heading',
            group: 'block',
            attrs: [{ name: 'level', type: 'enum', values: ['1', '2', '3'] }]
        })).not.toThrow();
    });
});

describe('SchemaManager — isValidChild', () => {
    let sm: SchemaManager;

    beforeEach(() => {
        sm = new SchemaManager();
        sm.registerNode({ name: 'document', group: 'root', content: NodeContent.block().oneOrMore() });
        sm.registerNode({ name: 'paragraph', group: 'block' });
        sm.registerNode({ name: 'image', group: 'inline' });
    });

    it('returns true when child group matches parent content group', () => {
        expect(sm.isValidChild('document', 'paragraph')).toBe(true);
    });

    it('returns false when child group does not match parent content group', () => {
        expect(sm.isValidChild('document', 'image')).toBe(false);
    });

    it('returns false for unknown parent', () => {
        expect(sm.isValidChild('unknown', 'paragraph')).toBe(false);
    });

    it('returns false for unknown child', () => {
        expect(sm.isValidChild('document', 'unknown')).toBe(false);
    });

    it('returns false when parent has no content', () => {
        sm.registerNode({ name: 'leaf', group: 'inline' });
        expect(sm.isValidChild('leaf', 'paragraph')).toBe(false);
    });
});

describe('SchemaManager — validate()', () => {
    it('throws when no document root is registered', () => {
        const sm = new SchemaManager();
        sm.registerNode({ name: 'paragraph', group: 'block' });
        expect(() => sm.validate()).toThrowError(/document/i);
    });

    it('does not throw when document root is present', () => {
        const sm = new SchemaManager();
        sm.registerNode({ name: 'document', group: 'root' });
        expect(() => sm.validate()).not.toThrow();
    });
});

describe('SchemaManager — load()', () => {
    it('loads a full SchemaDefinition at once', () => {
        const sm = new SchemaManager();
        sm.load({
            nodes: [
                { name: 'document', group: 'root' },
                { name: 'paragraph', group: 'block' }
            ],
            marks: [{ name: 'bold' }]
        });
        expect(sm.getNode('document')).toBeDefined();
        expect(sm.getNode('paragraph')).toBeDefined();
        expect(sm.getMark('bold')).toBeDefined();
    });
});
