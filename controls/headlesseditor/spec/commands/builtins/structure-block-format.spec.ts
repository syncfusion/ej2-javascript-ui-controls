/**
 * spec/commands/builtins/structure-block-format.spec.ts
 *
 * Regression tests for two related bugs:
 *
 *   1. Indentation / alignment lost when content is moved around *within
 *      the editor* — e.g. a paragraph is indented, then converted to a heading,
 *      then duplicated / moved via editor commands.
 *   2. Indentation / alignment dropped when converting a block to a heading
 *      (paragraph → heading, heading → paragraph).
 *
 * Per the user's directive, the scope is restricted to **in-editor copy /
 * paste workflows** — operations driven by `editor.commands.*` that move
 * content within the same editor instance. External HTML paste (clipboard
 * events, third-party HTML imports) is intentionally out of scope: most
 * editors never preserve inline format attributes across that boundary, and
 * the schema's `parseDOM` rules already round-trip values produced by the
 * editor's own `toDOM`.
 *
 * The test file is organised top-down:
 *
 *   §1  Direct unit tests for the `parseBlockFormat` helper (all branches).
 *   §2  Direct unit tests for the `preserveBlockFormat` helper.
 *   §3  In-editor copy/paste:
 *         - Apply indent via `editor.commands.indent()` and a second copy of
 *           the editor (round-trip via the schema's own serializer +
 *           parser) preserves `indent`.
 *         - Apply alignment via `editor.commands.setTextAlign()` and the
 *           same round-trip preserves `align`.
 *   §4  In-editor setHeading / setParagraph conversions preserve `align`
 *       and `indent` in every direction.
 */
import { HeadlessEditor } from '../../../src/headless-editor/headless-editor';
import { EditorConfig } from '../../../src/model/editor-config';
import {
    paragraphExtension,
    headingExtension,
    listExtension,
    taskListExtension,
    indentOutdentExtension,
    textAlignExtension
} from '../../../src/extensions/builtins';
import { PMDOMParser, PMNode } from '../../../src/pm/pm-guard';
import { parseBlockFormat, BlockFormatDefault } from '../../../src/extensions/builtins/common/block-format-attributes';
import { preserveBlockFormat } from '../../../src/commands/common';

// ── Test infrastructure ──────────────────────────────────────────────────────

function buildEditor(): { editor: HeadlessEditor; container: HTMLElement } {
    const container: HTMLElement = document.createElement('div');
    document.body.appendChild(container);
    const config: EditorConfig = {
        extensions: [
            paragraphExtension,
            headingExtension,
            listExtension,
            taskListExtension,
            indentOutdentExtension,
            textAlignExtension
        ]
    };
    const editor: HeadlessEditor = HeadlessEditor.create(config);
    editor.mount(container);
    return { editor, container };
}

function teardown(editor: HeadlessEditor, container: HTMLElement): void {
    try {
        editor.destroy();
    } catch {
        // already destroyed
    }
    if (container.parentNode) {
        container.parentNode.removeChild(container);
    }
}

interface NodeAttrs {
    readonly type: string;
    readonly align: unknown;
    readonly indent: unknown;
    readonly level?: unknown;
}

function readFirstBlock(editor: HeadlessEditor): NodeAttrs | null {
    let captured: NodeAttrs | null = null;
    editor.integration.getState().doc.descendants((node) => {
        if (captured) { return false; }
        if (node.type.name === 'paragraph'
            || node.type.name === 'heading'
            || node.type.name === 'listItem'
            || node.type.name === 'taskItem') {
            const attrs: Record<string, unknown> = (node.attrs as Record<string, unknown>) ?? {};
            captured = {
                type: node.type.name,
                align: attrs['align'] ?? null,
                indent: attrs['indent'] ?? null,
                level: node.type.name === 'heading' ? attrs['level'] : undefined
            };
            return false;
        }
        return true;
    });
    return captured;
}

/**
 * Find the FIRST <p> attribute bag, regardless of the type name. Used by
 * tests that just want the first block's attrs (in-editor copies may
 * collapse into the empty `paragraph` type when no rules match).
 *
 * Captures the `level` attribute when the node is a heading so callers
 * can assert on the heading level after a `setHeading` transformation.
 */
function findParagraphNode(editor: HeadlessEditor): NodeAttrs | null {
    let captured: NodeAttrs | null = null;
    editor.integration.getState().doc.descendants((node) => {
        if (captured) { return false; }
        const attrs: Record<string, unknown> = (node.attrs as Record<string, unknown>) ?? {};
        captured = {
            type: node.type.name,
            align: attrs['align'] ?? null,
            indent: attrs['indent'] ?? null,
            level: node.type.name === 'heading' ? attrs['level'] : undefined
        };
        return false;
    });
    return captured;
}

/**
 * Replaces the entire document with content parsed from an HTML string.
 * Used by the in-editor copy/paste round-trip tests: the editor produces
 * HTML via its own `toDOM`, then we feed that HTML back in via the schema's
 * `parseDOM`. Both ends are owned by the editor's schema, so the round-trip
 * is fully internal.
 */
function replaceDocumentWithHtml(editor: HeadlessEditor, html: string): void {
    const dom: HTMLElement = document.createElement('div');
    // Use the topNode wrapper so the parser treats this as a full document
    // replacement instead of a partial slice.
    dom.innerHTML = html;
    const state: any = editor.integration.getState();
    const parser: any = PMDOMParser.fromSchema(state.schema);
    const doc: any = parser.parse(dom);
    const tr: any = state.tr.replaceWith(0, state.doc.content.size, doc.content);
    editor.integration.dispatch(tr);
}

// ── Defaults for direct helper tests ────────────────────────────────────────

const SCHEMA_DEFAULTS: readonly BlockFormatDefault[] = [
    { name: 'align', value: null },
    { name: 'indent', value: 0 }
];

function buildDom(html: string): HTMLElement {
    const wrapper: HTMLElement = document.createElement('div');
    wrapper.innerHTML = html;
    return wrapper.firstElementChild as HTMLElement;
}

// ════════════════════════════════════════════════════════════════════════════
// §1 — parseBlockFormat (direct helper unit tests)
// ════════════════════════════════════════════════════════════════════════════

describe('parseBlockFormat (direct)', () => {

    it('returns schema defaults when the element has no style attribute', () => {
        const el: HTMLElement = buildDom('<p></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['align']).toBeNull();
        expect(attrs['indent']).toBe(0);
    });

    it('reads text-align:left/center/right/justify from inline CSS', () => {
        for (const value of ['left', 'center', 'right', 'justify']) {
            const el: HTMLElement = buildDom(`<p style="text-align: ${value};"></p>`);
            const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
            expect(attrs['align']).toBe(value);
        }
    });

    it('normalises text-align to lower case', () => {
        const el: HTMLElement = buildDom('<p style="text-align: CENTER;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['align']).toBe('center');
    });

    it('returns schema default when the CSS value is invalid', () => {
        const el: HTMLElement = buildDom('<p style="text-align: bogus;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['align']).toBeNull();
    });

    it('reads the legacy `align` HTML attribute when present', () => {
        const el: HTMLElement = buildDom('<p align="justify"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['align']).toBe('justify');
    });

    it('ignores invalid `align` HTML attribute and falls back to CSS', () => {
        const el: HTMLElement = buildDom('<p align="bogus" style="text-align: center;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['align']).toBe('center');
    });

    it('legacy `align` attribute wins over CSS text-align when both are valid', () => {
        const el: HTMLElement = buildDom('<p align="left" style="text-align: right;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['align']).toBe('left');
    });

    it('skips malformed style declarations (no colon) without throwing', () => {
        const el: HTMLElement = buildDom('<p style="bogus; text-align: center;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['align']).toBe('center');
    });

    it('reads margin-left as positive integer indent (20px → 1 step)', () => {
        const el: HTMLElement = buildDom('<p style="margin-left: 20px;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['indent']).toBe(1);
    });

    it('reads margin-left:60px as indent=3', () => {
        const el: HTMLElement = buildDom('<p style="margin-left: 60px;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['indent']).toBe(3);
    });

    it('rounds non-integer pixel values to the nearest step', () => {
        const el: HTMLElement = buildDom('<p style="margin-left: 49px;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        // 49 / 20 = 2.45 → rounds to 2
        expect(attrs['indent']).toBe(2);
    });

    it('rounds up when within 0.5 of the next step', () => {
        const el: HTMLElement = buildDom('<p style="margin-left: 51px;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        // 51 / 20 = 2.55 → rounds to 3
        expect(attrs['indent']).toBe(3);
    });

    it('collapses sub-step values (margin-left < 20px) to 0', () => {
        const el: HTMLElement = buildDom('<p style="margin-left: 5px;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['indent']).toBe(0);
    });

    it('collapses negative margin-left to 0', () => {
        const el: HTMLElement = buildDom('<p style="margin-left: -10px;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['indent']).toBe(0);
    });

    it('returns 0 for non-pixel units (em)', () => {
        const el: HTMLElement = buildDom('<p style="margin-left: 2em;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['indent']).toBe(0);
    });

    it('returns 0 for percentage values', () => {
        const el: HTMLElement = buildDom('<p style="margin-left: 10%;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['indent']).toBe(0);
    });

    it('uses a custom stepPx argument when parsing margin-left', () => {
        const el: HTMLElement = buildDom('<p style="margin-left: 73px;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS, 15);
        // 73 / 15 = 4.87 → rounds to 5
        expect(attrs['indent']).toBe(5);
    });

    it('extracts both align and indent from a combined style declaration', () => {
        const el: HTMLElement = buildDom('<p style="text-align: right; margin-left: 40px; color: red;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['align']).toBe('right');
        expect(attrs['indent']).toBe(2);
    });

    it('tolerates declaration ordering and whitespace in the inline style', () => {
        const el: HTMLElement = buildDom('<p style="  margin-left : 20px ; text-align : right ;"></p>');
        const attrs: Record<string, unknown> = parseBlockFormat(el, SCHEMA_DEFAULTS);
        expect(attrs['align']).toBe('right');
        expect(attrs['indent']).toBe(1);
    });
});

// ════════════════════════════════════════════════════════════════════════════
// §2 — preserveBlockFormat (direct helper unit tests)
// ════════════════════════════════════════════════════════════════════════════

describe('preserveBlockFormat (direct)', () => {

    function makeOldNode(attrs: Record<string, unknown> | null): PMNode {
        return { attrs } as unknown as PMNode;
    }

    it('preserves align and indent from the source node', () => {
        const oldNode: PMNode = makeOldNode({ align: 'right', indent: 2, level: 1 });
        const out: Record<string, unknown> = preserveBlockFormat(oldNode, { level: 2 });
        expect(out['align']).toBe('right');
        expect(out['indent']).toBe(2);
        expect(out['level']).toBe(2);
    });

    it('overrides preserved attrs when newAttrs supplies a replacement', () => {
        const oldNode: PMNode = makeOldNode({ align: 'right', indent: 2 });
        const out: Record<string, unknown> = preserveBlockFormat(oldNode, { align: 'left', indent: 0 });
        expect(out['align']).toBe('left');
        expect(out['indent']).toBe(0);
    });

    it('does not preserve attrs outside the preserved-block-format list', () => {
        const oldNode: PMNode = makeOldNode({ align: 'right', indent: 1, level: 3, id: 'abc', language: 'js' });
        const out: Record<string, unknown> = preserveBlockFormat(oldNode, { level: 1 });
        expect(out['align']).toBe('right');
        expect(out['indent']).toBe(1);
        expect(out['level']).toBe(1);
        // id and language are NOT preserved.
        expect(Object.prototype.hasOwnProperty.call(out, 'id')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(out, 'language')).toBe(false);
    });

    it('handles a source node whose attrs is null (defensive)', () => {
        const oldNode: PMNode = makeOldNode(null);
        const out: Record<string, unknown> = preserveBlockFormat(oldNode, { level: 2 });
        expect(out['level']).toBe(2);
        expect(out['align']).toBeUndefined();
        expect(out['indent']).toBeUndefined();
    });

    it('handles a null oldNode without throwing (defensive)', () => {
        const out: Record<string, unknown> = preserveBlockFormat(null as unknown as PMNode, { level: 2 });
        expect(out['level']).toBe(2);
    });

    it('treats undefined newAttrs as an empty overlay', () => {
        const oldNode: PMNode = makeOldNode({ align: 'center', indent: 3 });
        const out: Record<string, unknown> = preserveBlockFormat(oldNode, undefined);
        expect(out['align']).toBe('center');
        expect(out['indent']).toBe(3);
    });

    it('uses hasOwnProperty guard so `undefined` source attrs are not copied', () => {
        const oldNode: PMNode = makeOldNode({ align: undefined, indent: undefined });
        const out: Record<string, unknown> = preserveBlockFormat(oldNode, {});
        expect(Object.prototype.hasOwnProperty.call(out, 'align')).toBe(false);
        expect(Object.prototype.hasOwnProperty.call(out, 'indent')).toBe(false);
    });

    it('returns a fresh object (does not alias the source attrs bag)', () => {
        const source: Record<string, unknown> = { align: 'right', indent: 1 };
        const oldNode: PMNode = makeOldNode(source);
        const out: Record<string, unknown> = preserveBlockFormat(oldNode, { level: 1 });
        expect(out).not.toBe(source);
    });

    it(`treats null as a valid override (the schema's "no align" sentinel)`, () => {
        const oldNode: PMNode = makeOldNode({ align: 'right', indent: 2 });
        const out: Record<string, unknown> = preserveBlockFormat(oldNode, { align: null });
        expect(out['align']).toBeNull();
        expect(out['indent']).toBe(2);
    });
});

// ════════════════════════════════════════════════════════════════════════════
// §3 — In-editor copy/paste: round-trip via the editor's own serializer
// ════════════════════════════════════════════════════════════════════════════

describe('In-editor copy/paste preserves align and indent', () => {

    it('round-trip: paragraph with indent serves as input to a fresh editor and keeps indent', () => {
        const { editor, container } = buildEditor();
        try {
            // Author a paragraph via editor commands and apply indent.
            editor.commands.setTextAlign({ align: 'right' });
            // two indents
            editor.commands.indent();
            editor.commands.indent();

            const before: NodeAttrs | null = findParagraphNode(editor);
            expect(before).not.toBeNull();
            expect(before!.indent).toBe(2);
            expect(before!.align).toBe('right');

            // Serialize → parse back into the same editor. Replaces the
            // document; this is an internal "paste-from-self" workflow.
            const html: string = editor.getHtml();
            replaceDocumentWithHtml(editor, html);

            const after: NodeAttrs | null = findParagraphNode(editor);
            expect(after).not.toBeNull();
            expect(after!.indent).toBe(2);
            expect(after!.align).toBe('right');
        } finally {
            teardown(editor, container);
        }
    });

    it('round-trip: paragraph with align=right and indent=3 survives', () => {
        const { editor, container } = buildEditor();
        try {
            editor.commands.setTextAlign({ align: 'right' });
            editor.commands.indent();
            editor.commands.indent();
            editor.commands.indent();

            const before: NodeAttrs | null = findParagraphNode(editor);
            expect(before!.align).toBe('right');
            expect(before!.indent).toBe(3);

            const html: string = editor.getHtml();
            replaceDocumentWithHtml(editor, html);

            const after: NodeAttrs | null = findParagraphNode(editor);
            expect(after!.align).toBe('right');
            expect(after!.indent).toBe(3);
        } finally {
            teardown(editor, container);
        }
    });

    it('round-trip: paragraph with no align/indent defaults to align=null indent=0', () => {
        const { editor, container } = buildEditor();
        try {
            const before: NodeAttrs | null = findParagraphNode(editor);
            expect(before!.align === null || before!.align === undefined).toBe(true);
            expect(before!.indent === null || before!.indent === undefined || before!.indent === 0).toBe(true);

            const html: string = editor.getHtml();
            replaceDocumentWithHtml(editor, html);

            const after: NodeAttrs | null = findParagraphNode(editor);
            expect(after!.align === null || after!.align === undefined).toBe(true);
            expect(after!.indent === null || after!.indent === undefined || after!.indent === 0).toBe(true);
        } finally {
            teardown(editor, container);
        }
    });

    it('round-trip: indented paragraph keeps indent after outdent-then-indent cycle', () => {
        const { editor, container } = buildEditor();
        try {
            editor.commands.indent();
            editor.commands.indent();
            expect(findParagraphNode(editor)!.indent).toBe(2);

            editor.commands.outdent();
            expect(findParagraphNode(editor)!.indent).toBe(1);

            // Serialise the live state (indent=1) and re-parse — indent must remain 1.
            const html: string = editor.getHtml();
            replaceDocumentWithHtml(editor, html);

            const after: NodeAttrs | null = findParagraphNode(editor);
            expect(after!.indent).toBe(1);
        } finally {
            teardown(editor, container);
        }
    });

    it('round-trip: paragraph with align=justify round-trips as align=justify', () => {
        const { editor, container } = buildEditor();
        try {
            editor.commands.setTextAlign({ align: 'justify' });
            const html: string = editor.getHtml();
            replaceDocumentWithHtml(editor, html);
            const after: NodeAttrs | null = findParagraphNode(editor);
            expect(after!.align).toBe('justify');
        } finally {
            teardown(editor, container);
        }
    });

    it('round-trip: indent survives multiple serialize-parse cycles', () => {
        const { editor, container } = buildEditor();
        try {
            editor.commands.indent();
            editor.commands.indent();

            for (let i: number = 0; i < 3; i++) {
                const html: string = editor.getHtml();
                replaceDocumentWithHtml(editor, html);
            }

            const after: NodeAttrs | null = findParagraphNode(editor);
            expect(after!.indent).toBe(2);
        } finally {
            teardown(editor, container);
        }
    });
});

// ════════════════════════════════════════════════════════════════════════════
// §4 — Heading / paragraph block-type conversions preserve align and indent
// ════════════════════════════════════════════════════════════════════════════

describe('Block-type conversion preserves align and indent', () => {

    it('paragraph → heading preserves indent (apply indent → setHeading)', () => {
        const { editor, container } = buildEditor();
        try {
            editor.commands.indent();
            editor.commands.indent();
            expect(findParagraphNode(editor)!.indent).toBe(2);

            editor.commands.setHeading({ level: 3 });

            const after: NodeAttrs | null = findParagraphNode(editor);
            expect(after!.type).toBe('heading');
            expect(after!.level).toBe(3);
            expect(after!.indent).toBe(2);
        } finally {
            teardown(editor, container);
        }
    });

    it('paragraph → heading preserves align (apply setTextAlign → setHeading)', () => {
        const { editor, container } = buildEditor();
        try {
            editor.commands.setTextAlign({ align: 'right' });
            expect(findParagraphNode(editor)!.align).toBe('right');

            editor.commands.setHeading({ level: 2 });

            const after: NodeAttrs | null = findParagraphNode(editor);
            expect(after!.type).toBe('heading');
            expect(after!.level).toBe(2);
            expect(after!.align).toBe('right');
        } finally {
            teardown(editor, container);
        }
    });

    it('paragraph → heading preserves both align and indent together', () => {
        const { editor, container } = buildEditor();
        try {
            editor.commands.setTextAlign({ align: 'justify' });
            editor.commands.indent();
            editor.commands.indent();
            editor.commands.indent();

            editor.commands.setHeading({ level: 1 });

            const after: NodeAttrs | null = findParagraphNode(editor);
            expect(after!.type).toBe('heading');
            expect(after!.align).toBe('justify');
            expect(after!.indent).toBe(3);
        } finally {
            teardown(editor, container);
        }
    });

    it('heading → paragraph preserves indent and align', () => {
        const { editor, container } = buildEditor();
        try {
            // Build a heading with indent + align via setHeading + post-formatting.
            editor.commands.setHeading({ level: 2 });
            editor.commands.setTextAlign({ align: 'center' });
            editor.commands.indent();

            const heading: NodeAttrs | null = findParagraphNode(editor);
            expect(heading!.type).toBe('heading');
            expect(heading!.align).toBe('center');
            expect(heading!.indent).toBe(1);

            editor.commands.setParagraph();

            const para: NodeAttrs | null = findParagraphNode(editor);
            expect(para!.type).toBe('paragraph');
            expect(para!.align).toBe('center');
            expect(para!.indent).toBe(1);
        } finally {
            teardown(editor, container);
        }
    });

    it('paragraph → heading → paragraph round-trips without losing align/indent', () => {
        const { editor, container } = buildEditor();
        try {
            editor.commands.setTextAlign({ align: 'right' });
            editor.commands.indent();
            editor.commands.indent();

            const before: NodeAttrs | null = findParagraphNode(editor);
            expect(before!.align).toBe('right');
            expect(before!.indent).toBe(2);

            editor.commands.setHeading({ level: 4 });
            const asHeading: NodeAttrs | null = findParagraphNode(editor);
            expect(asHeading!.type).toBe('heading');
            expect(asHeading!.align).toBe('right');
            expect(asHeading!.indent).toBe(2);

            editor.commands.setParagraph();
            const asParagraph: NodeAttrs | null = findParagraphNode(editor);
            expect(asParagraph!.type).toBe('paragraph');
            expect(asParagraph!.align).toBe('right');
            expect(asParagraph!.indent).toBe(2);
        } finally {
            teardown(editor, container);
        }
    });

    it('plain paragraph → heading at every level 1..6 keeps indent=1', () => {
        for (const level of [1, 2, 3, 4, 5, 6]) {
            const { editor, container } = buildEditor();
            try {
                editor.commands.indent();
                editor.commands.setHeading({ level });
                const after: NodeAttrs | null = findParagraphNode(editor);
                expect(after!.type).toBe('heading');
                expect(after!.level).toBe(level);
                expect(after!.indent).toBe(1);
            } finally {
                teardown(editor, container);
            }
        }
    });

    it('plain paragraph without any format attrs → heading yields heading with defaults', () => {
        const { editor, container } = buildEditor();
        try {
            const before: NodeAttrs | null = findParagraphNode(editor);
            expect(before!.align === null || before!.align === undefined).toBe(true);
            expect(before!.indent === null || before!.indent === undefined || before!.indent === 0).toBe(true);

            editor.commands.setHeading({ level: 4 });

            const after: NodeAttrs | null = findParagraphNode(editor);
            expect(after!.type).toBe('heading');
            expect(after!.align === null || after!.align === undefined).toBe(true);
            expect(after!.indent === null || after!.indent === undefined || after!.indent === 0).toBe(true);
        } finally {
            teardown(editor, container);
        }
    });
});
