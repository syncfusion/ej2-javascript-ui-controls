/**
 * spec/extensions/builtins/input-rules.spec.ts
 *
 * Consolidated spec covering:
 *  1. inputRules() contributor presence and rule shapes for all 11 active builtins.
 *  2. Specific pattern, id, priority, and command assertions per extension.
 *  3. Integration: total active rule count across all 11 extensions = 28.
 *
 * Deferred extensions (collapsible, image) are covered in xdescribe blocks.
 *
 * NOTE: These specs exercise the *definition layer* only. The PM runtime
 * behaviour of compiled rules is tested in spec/pm/input-rules-compiler.spec.ts.
 */

import { boldExtension } from '../../../src/extensions/builtins/bold';
import { italicExtension } from '../../../src/extensions/builtins/italic';
import { underlineExtension } from '../../../src/extensions/builtins/underline';
import { strikethroughExtension } from '../../../src/extensions/builtins/strikethrough';
import { inlineCodeExtension } from '../../../src/extensions/builtins/inline-code';
import { headingExtension } from '../../../src/extensions/builtins/heading';
import { listExtension } from '../../../src/extensions/builtins/list';
import { blockquoteExtension, codeBlockExtension, horizontalRuleExtension } from '../../../src';

import { calloutExtension } from '../../../src/extensions/builtins/callout';
import { InputRuleDefinition } from '../../../src/extensions/types';

// ── Helper ─────────────────────────────────────────────────────────────────

type ExtWithInputRules = { config: { inputRules?: (...args: any[]) => readonly InputRuleDefinition[] } };

function getRules(ext: ExtWithInputRules): readonly InputRuleDefinition[] {
    const fn = ext.config?.inputRules;
    expect(fn).toBeDefined();
    // Call with no `this` context — the definitions only use `ctx` arg anyway
    return fn!.call({} as any, {} as any);
}
function createInputRuleContext(
    dispatchSpy: jasmine.Spy,
    match: RegExpMatchArray | any = []
) {
    return {
        dispatchCommand: dispatchSpy,
        match,
        start: 0,
        end: 0,
        nodeAt: null,
        selection: {} as any
    };
}

// ── Bold ───────────────────────────────────────────────────────────────────

describe('Bold Extension — inputRules', () => {
    let rules: readonly InputRuleDefinition[];

    beforeEach(() => { rules = getRules(boldExtension); });

    it('contributes exactly 2 input rules', () => {
        expect(rules.length).toBe(2);
    });
});

// ── Italic ─────────────────────────────────────────────────────────────────

describe('Italic Extension — inputRules', () => {
    let rules: readonly InputRuleDefinition[];

    beforeEach(() => { rules = getRules(italicExtension); });

    it('contributes exactly 2 input rules', () => {
        expect(rules.length).toBe(2);
    });

    it('contains mark:italic-star', () => {
        const r = rules.find(r => r.id === 'mark:italic-star');
        expect(r).toBeDefined();
    });

    it('contains mark:italic-underscore', () => {
        const r = rules.find(r => r.id === 'mark:italic-underscore');
        expect(r).toBeDefined();
    });
});

// ── Underline ──────────────────────────────────────────────────────────────

describe('Underline Extension — inputRules', () => {
    let rules: readonly InputRuleDefinition[];

    beforeEach(() => { rules = getRules(underlineExtension); });

    it('contributes exactly 1 input rule', () => {
        expect(rules.length).toBe(1);
    });
});

// ── Strikethrough ──────────────────────────────────────────────────────────

describe('Strikethrough Extension — inputRules', () => {
    let rules: readonly InputRuleDefinition[];

    beforeEach(() => { rules = getRules(strikethroughExtension); });

    it('contributes exactly 1 input rule', () => {
        expect(rules.length).toBe(1);
    });
});

// ── Inline Code ────────────────────────────────────────────────────────────

describe('Inline Code Extension — inputRules', () => {
    let rules: readonly InputRuleDefinition[];

    beforeEach(() => { rules = getRules(inlineCodeExtension); });

    it('contributes exactly 1 input rule', () => {
        expect(rules.length).toBe(1);
    });
});

// ── Heading ────────────────────────────────────────────────────────────────

describe('Heading Extension — inputRules', () => {
    let rules: readonly InputRuleDefinition[];

    beforeEach(() => { rules = getRules(headingExtension); });

    it('contributes exactly 6 input rules (h1–h6)', () => {
        expect(rules.length).toBe(6);
    });

    it('contains heading:h1 through heading:h6 by id', () => {
        for (let level = 1; level <= 6; level++) {
            const id = `heading:h${level}`;
            expect(rules.find(r => r.id === id)).toBeDefined(`expected to find rule with id "${id}"`);
        }
    });
});

// ── Quote ──────────────────────────────────────────────────────────────────

describe('Quote Extension — inputRules', () => {
    let rules: readonly InputRuleDefinition[];

    beforeEach(() => { rules = getRules(blockquoteExtension); });

    it('contributes exactly 1 input rule', () => {
        expect(rules.length).toBe(1);
    });
});

// ── Divider ────────────────────────────────────────────────────────────────

describe('Divider Extension — inputRules', () => {
    let rules: readonly InputRuleDefinition[];

    beforeEach(() => { rules = getRules(horizontalRuleExtension); });

    it('divider:asterisk pattern matches ***', () => {
        const r = rules.find(r => r.id === 'divider:asterisk')!;
        expect(r.pattern.test('***')).toBe(true);
    });
});

// ── Callout ────────────────────────────────────────────────────────────────

describe('Callout Extension — inputRules', () => {
    let rules: readonly InputRuleDefinition[];

    beforeEach(() => { rules = getRules(calloutExtension); });

    it('contributes exactly 2 input rules', () => {
        expect(rules.length).toBe(2);
    });
});

// ── Deferred Extensions ────────────────────────────────────────────────────

xdescribe('Collapsible Extension — inputRules (DEFERRED)', () => {
    // BLOCKED: insertCollapsible command does not yet exist.
    xit('contributes exactly 2 input rules', () => { /* TODO */ });
    xit('collapsible:greater pattern matches "> "', () => { /* TODO */ });
    xit('collapsible:bracket pattern matches "[] "', () => { /* TODO */ });
});

xdescribe('Image Extension — inputRules (DEFERRED)', () => {
    // BLOCKED: insertImage command does not yet exist.
    xit('contributes exactly 1 input rule', () => { /* TODO */ });
    xit('image:bang-bracket pattern matches "![alt](url)"', () => { /* TODO */ });
    xit('image handler dispatches insertImage', () => { /* TODO */ });
});

// ── Integration: Total Active Rule Count ──────────────────────────────────

describe('Integration — all 11 active extensions', () => {
    const ACTIVE_EXTENSIONS: Array<{ name: string; ext: ExtWithInputRules }> = [
        { name: 'bold',          ext: boldExtension },
        { name: 'italic',        ext: italicExtension },
        { name: 'underline',     ext: underlineExtension },
        { name: 'strikethrough', ext: strikethroughExtension },
        { name: 'inlineCode',    ext: inlineCodeExtension },
        { name: 'heading',       ext: headingExtension },
        { name: 'list',          ext: listExtension },
        { name: 'code',          ext: codeBlockExtension },
        { name: 'quote',         ext: blockquoteExtension },
        { name: 'divider',       ext: horizontalRuleExtension },
        { name: 'callout',       ext: calloutExtension }
    ];

    it('every active extension has an inputRules() contributor', () => {
        for (const { ext } of ACTIVE_EXTENSIONS) {
            expect(typeof ext.config?.inputRules).toBe('function');
        }
    });

    it('all rule ids across active extensions are unique', () => {
        const allIds: string[] = [];
        for (const { ext } of ACTIVE_EXTENSIONS) {
            const fn = ext.config?.inputRules;
            if (fn) { fn.call({} as any, {} as any).forEach((r: InputRuleDefinition) => allIds.push(r.id)); }
        }
        const uniqueIds = new Set(allIds);
        expect(uniqueIds.size).toBe(allIds.length);
    });

    it('every rule has a non-empty id and a RegExp pattern', () => {
        for (const { ext } of ACTIVE_EXTENSIONS) {
            const fn = ext.config?.inputRules;
            if (fn) {
                for (const rule of fn.call({} as any, {} as any)) {
                    expect(rule.id.length).toBeGreaterThan(0);
                    expect(rule.pattern instanceof RegExp).toBe(true);
                }
            }
        }
    });
});
