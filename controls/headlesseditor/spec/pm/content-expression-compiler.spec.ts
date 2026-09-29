import { ContentExpressionCompiler } from '../../src/pm/adapters/content-expression-compiler';
import { NodeContent } from '../../src/schema/types/content-expression';

describe('ContentExpressionCompiler — 25 combinations (factory × quantifier)', () => {
    let compiler: ContentExpressionCompiler;

    beforeEach(() => {
        compiler = new ContentExpressionCompiler();
    });

    // ── block() ─────────────────────────────────────────────────────────────
    it('block().oneOrMore()  → "block+"',     () => expect(compiler.compile(NodeContent.block().oneOrMore())).toBe('block+'));
    it('block().zeroOrMore() → "block*"',     () => expect(compiler.compile(NodeContent.block().zeroOrMore())).toBe('block*'));
    it('block().optional()   → "block?"',     () => expect(compiler.compile(NodeContent.block().optional())).toBe('block?'));
    it('block().exactly(3)   → "block{3}"',   () => expect(compiler.compile(NodeContent.block().exactly(3))).toBe('block{3}'));
    it('block().atLeast(2)   → "block{2,}"',  () => expect(compiler.compile(NodeContent.block().atLeast(2))).toBe('block{2,}'));

    // ── inline() ────────────────────────────────────────────────────────────
    it('inline().oneOrMore()  → "inline+"',    () => expect(compiler.compile(NodeContent.inline().oneOrMore())).toBe('inline+'));
    it('inline().zeroOrMore() → "inline*"',    () => expect(compiler.compile(NodeContent.inline().zeroOrMore())).toBe('inline*'));
    it('inline().optional()   → "inline?"',    () => expect(compiler.compile(NodeContent.inline().optional())).toBe('inline?'));
    it('inline().exactly(4)   → "inline{4}"',  () => expect(compiler.compile(NodeContent.inline().exactly(4))).toBe('inline{4}'));
    it('inline().atLeast(1)   → "inline{1,}"', () => expect(compiler.compile(NodeContent.inline().atLeast(1))).toBe('inline{1,}'));

    // ── text() ──────────────────────────────────────────────────────────────
    it('text().oneOrMore()  → "text+"',    () => expect(compiler.compile(NodeContent.text().oneOrMore())).toBe('text+'));
    it('text().zeroOrMore() → "text*"',    () => expect(compiler.compile(NodeContent.text().zeroOrMore())).toBe('text*'));
    it('text().optional()   → "text?"',    () => expect(compiler.compile(NodeContent.text().optional())).toBe('text?'));
    it('text().exactly(2)   → "text{2}"',  () => expect(compiler.compile(NodeContent.text().exactly(2))).toBe('text{2}'));
    it('text().atLeast(1)   → "text{1,}"', () => expect(compiler.compile(NodeContent.text().atLeast(1))).toBe('text{1,}'));

    // ── node('x') ───────────────────────────────────────────────────────────
    it('node("x").oneOrMore()  → "x+"',    () => expect(compiler.compile(NodeContent.node('x').oneOrMore())).toBe('x+'));
    it('node("x").zeroOrMore() → "x*"',    () => expect(compiler.compile(NodeContent.node('x').zeroOrMore())).toBe('x*'));
    it('node("x").optional()   → "x?"',    () => expect(compiler.compile(NodeContent.node('x').optional())).toBe('x?'));
    it('node("x").exactly(5)   → "x{5}"',  () => expect(compiler.compile(NodeContent.node('x').exactly(5))).toBe('x{5}'));
    it('node("x").atLeast(3)   → "x{3,}"', () => expect(compiler.compile(NodeContent.node('x').atLeast(3))).toBe('x{3,}'));
});
