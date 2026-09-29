import { NodeContent } from '../../src/schema/types/content-expression';

describe('NodeContent factory methods', () => {
    it('block() produces a group expression named "block"', () => {
        const expr = NodeContent.block();
        expect(expr._tree.kind).toBe('group');
        expect(expr._tree.name).toBe('block');
        expect(expr._tree.quantifier).toBe('none');
    });

    it('inline() produces a group expression named "inline"', () => {
        const expr = NodeContent.inline();
        expect(expr._tree.kind).toBe('group');
        expect(expr._tree.name).toBe('inline');
        expect(expr._tree.quantifier).toBe('none');
    });

    it('text() produces a node expression named "text"', () => {
        const expr = NodeContent.text();
        expect(expr._tree.kind).toBe('node');
        expect(expr._tree.name).toBe('text');
        expect(expr._tree.quantifier).toBe('none');
    });

    it('node(name) produces a node expression with the given name', () => {
        const expr = NodeContent.node('tableRow');
        expect(expr._tree.kind).toBe('node');
        expect(expr._tree.name).toBe('tableRow');
    });

    it('sequence() produces a sequence expression', () => {
        const expr = NodeContent.sequence(NodeContent.block(), NodeContent.inline());
        expect(expr._tree.kind).toBe('sequence');
        expect(expr._tree.children).toBeDefined();
        expect(expr._tree.children!.length).toBe(2);
    });

    it('choice() produces a choice expression', () => {
        const expr = NodeContent.choice(NodeContent.block(), NodeContent.text());
        expect(expr._tree.kind).toBe('choice');
        expect(expr._tree.children).toBeDefined();
        expect(expr._tree.children!.length).toBe(2);
    });

    it('all 5 factory methods produce distinct quantifier-none variants', () => {
        const exprs = [
            NodeContent.block(),
            NodeContent.inline(),
            NodeContent.text(),
            NodeContent.node('x'),
            NodeContent.sequence(NodeContent.block())
        ];
        const quantifiers = exprs.map((e) => e._tree.quantifier);
        expect(quantifiers.every((q) => q === 'none')).toBe(true);
    });
});

describe('NodeContent quantifier methods', () => {
    it('.oneOrMore() sets quantifier to "oneOrMore"', () => {
        expect(NodeContent.block().oneOrMore()._tree.quantifier).toBe('oneOrMore');
    });

    it('.zeroOrMore() sets quantifier to "zeroOrMore"', () => {
        expect(NodeContent.inline().zeroOrMore()._tree.quantifier).toBe('zeroOrMore');
    });

    it('.optional() sets quantifier to "optional"', () => {
        expect(NodeContent.text().optional()._tree.quantifier).toBe('optional');
    });

    it('.exactly(n) sets quantifier to "exactly" and stores n', () => {
        const expr = NodeContent.node('row').exactly(3);
        expect(expr._tree.quantifier).toBe('exactly');
        expect(expr._tree.n).toBe(3);
    });

    it('.atLeast(n) sets quantifier to "atLeast" and stores n', () => {
        const expr = NodeContent.block().atLeast(2);
        expect(expr._tree.quantifier).toBe('atLeast');
        expect(expr._tree.n).toBe(2);
    });

    it('quantifier on a sequence wraps it in a new expression without throwing', () => {
        const seq = NodeContent.sequence(NodeContent.block());
        // Sequences can carry a quantifier — the PMSchemaAdapter will wrap
        // them in parentheses when compiling to PM (e.g. "(block)+").
        expect(() => seq.oneOrMore()).not.toThrow();
        const out = seq.oneOrMore();
        expect(out._tree.kind).toBe('sequence');
        expect(out._tree.quantifier).toBe('oneOrMore');
    });

    it('quantifier on a choice wraps it in a new expression without throwing', () => {
        const choice = NodeContent.choice(NodeContent.block(), NodeContent.inline());
        // Choices can carry a quantifier — the PMSchemaAdapter will wrap
        // them in parentheses when compiling to PM (e.g. "(block | inline)?").
        expect(() => choice.optional()).not.toThrow();
        const out = choice.optional();
        expect(out._tree.kind).toBe('choice');
        expect(out._tree.quantifier).toBe('optional');
    });
});
