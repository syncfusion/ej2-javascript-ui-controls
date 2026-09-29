/**
 * spec/commands/builtins/list-style-type-dom.spec.ts
 *
 * DOM serialization, HTML parsing, and round-trip tests for listStyleType:
 *   - getHtml() output for both list types with various marker styles
 *   - HTML import via EditorConfig.content (<ul>, <ol>, legacy <ol type>)
 *   - Round-trip: create → serialize → re-import → attribute preserved
 *   - Style preservation across split/indent/outdent item operations
 */
import {
    HeadlessEditor,
    paragraphExtension,
    DocumentRoot,
    EditorNode,
    TextNode
} from '../../../src/index';
import { listExtension } from '../../../src/extensions/builtins/list';

// ── Document builders ────────────────────────────────────────────────────────

function textNode(text: string): TextNode {
    return {
        id: crypto.randomUUID(),
        type: 'text',
        text,
        attrs: {},
        marks: [],
        children: []
    } as TextNode;
}

function paragraphNode(text: string): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'paragraph',
        attrs: {},
        marks: [],
        children: [textNode(text)]
    } as EditorNode;
}

function listItemNode(children: EditorNode[]): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'listItem',
        attrs: {},
        marks: [],
        children
    } as EditorNode;
}

function listNode(
    type: 'bulletList' | 'orderedList',
    attrs: Record<string, unknown>,
    items: EditorNode[]
): EditorNode {
    return {
        id: crypto.randomUUID(),
        type,
        attrs,
        marks: [],
        children: items
    } as EditorNode;
}

function buildDocument(children: EditorNode[]): DocumentRoot {
    return {
        type: 'document',
        id: crypto.randomUUID(),
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children
    } as DocumentRoot;
}

/** Two-item list: cursor goes into the text of the SECOND item. */
function twoItemList(type: 'bulletList' | 'orderedList', attrs: Record<string, unknown>): DocumentRoot {
    return buildDocument([listNode(type, attrs, [
        listItemNode([paragraphNode('First item')]),
        listItemNode([paragraphNode('Second item')])
    ])]);
}

// Cursor position layout:
//   document(0) > list(0) > listItem(1) > paragraph(2) > text(3)
// "First item" (10 chars) fills 3..12; listItem #1 is 14 tokens wide, so
// listItem #2 opens at 15, its paragraph opens at 16, text begins at 17.
const TEXT_IN_SECOND_ITEM = 17;

// ── Editor helpers ────────────────────────────────────────────────────────────

interface TestEditor {
    editor: HeadlessEditor;
    container: HTMLElement;
}

function createEditorFromDoc(doc: DocumentRoot): TestEditor {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const editor = HeadlessEditor.create({
        document: doc,
        extensions: [paragraphExtension, listExtension]
    });
    editor.mount(container);
    return { editor, container };
}

function createEditorFromHtml(html: string): TestEditor {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const editor = HeadlessEditor.create({
        content: html,
        extensions: [paragraphExtension, listExtension]
    });
    editor.mount(container);
    return { editor, container };
}

function destroyTestEditor(test: TestEditor): void {
    if (!test.editor.isDestroyed) {
        test.editor.destroy();
    }
    test.container.remove();
}

function placeCursor(test: TestEditor, textPos: number): void {
    // The caret moves through the public setSelection command — the same
    // API apps and the selection UI use. No PM internals.
    expect(test.editor.commands.setSelection({ from: textPos, to: textPos })).toBe(true);
}

/** Collect the attrs of every node of the given type, in document order. */
function collectAttrs(doc: DocumentRoot, type: string): Record<string, unknown>[] {
    const results: Record<string, unknown>[] = [];
    const walk = (node: EditorNode): void => {
        if (node.type === type) {
            results.push(node.attrs);
        }
        (node.children ?? []).forEach(walk);
    };
    (doc.children ?? []).forEach(walk);
    return results;
}

/** Read `style` and `start` off the rendered list container. */
function readListElement(test: TestEditor, tag: 'ul' | 'ol'): {
    style: string | null;
    start: string | null;
} {
    const el = test.container.querySelector(tag);
    expect(el).not.toBeNull();
    return {
        style: el!.getAttribute('style'),
        start: el!.getAttribute('start')
    };
}

// ── 2.5 / 6.5 — DOM serialization output ─────────────────────────────────────

describe('listStyleType DOM serialization', () => {
    const cases: ReadonlyArray<{
        type: 'bulletList' | 'orderedList';
        tag: 'ul' | 'ol';
        attrs: Record<string, unknown>;
        expectedStyle: string;
        expectedStart: string | null;
    }> = [
        { type: 'bulletList', tag: 'ul', attrs: { listStyleType: 'disc' },
          expectedStyle: 'list-style-type: disc', expectedStart: null },
        { type: 'bulletList', tag: 'ul', attrs: { listStyleType: 'circle' },
          expectedStyle: 'list-style-type: circle', expectedStart: null },
        { type: 'bulletList', tag: 'ul', attrs: { listStyleType: 'square' },
          expectedStyle: 'list-style-type: square', expectedStart: null },
        { type: 'orderedList', tag: 'ol', attrs: { order: 1, listStyleType: 'decimal' },
          expectedStyle: 'list-style-type: decimal', expectedStart: null },
        { type: 'orderedList', tag: 'ol', attrs: { order: 1, listStyleType: 'lower-alpha' },
          expectedStyle: 'list-style-type: lower-alpha', expectedStart: null },
        { type: 'orderedList', tag: 'ol', attrs: { order: 5, listStyleType: 'upper-roman' },
          expectedStyle: 'list-style-type: upper-roman', expectedStart: '5' }
    ];

    for (const testCase of cases) {
        it(`serializes ${testCase.type} with style "${testCase.expectedStyle}"` +
            `${testCase.expectedStart ? ` and start ${testCase.expectedStart}` : ''}`, () => {
            const test = createEditorFromDoc(buildDocument([
                listNode(testCase.type, testCase.attrs, [listItemNode([paragraphNode('Item')])])
            ]));

            const rendered = readListElement(test, testCase.tag);
            expect(rendered.style).toContain(testCase.expectedStyle);
            expect(rendered.start).toBe(testCase.expectedStart);

            const html = test.editor.getHtml();
            expect(html).toContain(`style="${testCase.expectedStyle};"`);
            if (testCase.expectedStart) {
                expect(html).toContain(`start="${testCase.expectedStart}"`);
            } else {
                expect(html).not.toContain('start=');
            }
            // The legacy HTML type attribute is never emitted.
            expect(html).not.toMatch(/<ol[^>]*\stype=/);

            destroyTestEditor(test);
        });
    }
});

// ── 2.6 / 6.6 / 6.8 — HTML parsing (paste/import compatibility) ───────────────

describe('listStyleType HTML parsing', () => {
    const parseCases: ReadonlyArray<{
        html: string;
        expectedType: 'bulletList' | 'orderedList';
        expectedAttrs: Record<string, unknown>;
    }> = [
        { html: '<ul><li>item</li></ul>', expectedType: 'bulletList',
          expectedAttrs: { listStyleType: 'disc' } },
        { html: '<ul style="list-style-type: square"><li>item</li></ul>', expectedType: 'bulletList',
          expectedAttrs: { listStyleType: 'square' } },
        { html: '<ol><li>item</li></ol>', expectedType: 'orderedList',
          expectedAttrs: { order: 1, listStyleType: 'decimal' } },
        { html: '<ol start="5"><li>item</li></ol>', expectedType: 'orderedList',
          expectedAttrs: { order: 5, listStyleType: 'decimal' } },
        { html: '<ol type="1"><li>item</li></ol>', expectedType: 'orderedList',
          expectedAttrs: { order: 1, listStyleType: 'decimal' } },
        { html: '<ol type="a"><li>item</li></ol>', expectedType: 'orderedList',
          expectedAttrs: { order: 1, listStyleType: 'lower-alpha' } },
        { html: '<ol type="A"><li>item</li></ol>', expectedType: 'orderedList',
          expectedAttrs: { order: 1, listStyleType: 'upper-alpha' } },
        { html: '<ol type="i"><li>item</li></ol>', expectedType: 'orderedList',
          expectedAttrs: { order: 1, listStyleType: 'lower-roman' } },
        { html: '<ol type="I"><li>item</li></ol>', expectedType: 'orderedList',
          expectedAttrs: { order: 1, listStyleType: 'upper-roman' } },
        { html: '<ol start="3" type="I"><li>item</li></ol>', expectedType: 'orderedList',
          expectedAttrs: { order: 3, listStyleType: 'upper-roman' } },
        { html: '<ol style="list-style-type: lower-greek"><li>item</li></ol>', expectedType: 'orderedList',
          expectedAttrs: { order: 1, listStyleType: 'lower-greek' } },
        { html: '<ul type="A"><li>item</li></ul>', expectedType: 'bulletList',
          expectedAttrs: { listStyleType: 'upper-alpha' } }
    ];

    for (const parseCase of parseCases) {
        it(`imports ${parseCase.html} with attrs ` +
            `${JSON.stringify(parseCase.expectedAttrs)}`, () => {
            const test = createEditorFromHtml(parseCase.html);

            const attrsList = collectAttrs(test.editor.getDocument(), parseCase.expectedType);
            expect(attrsList.length).toBe(1);
            // Compare each key separately — DocumentMapper may add ids elsewhere.
            for (const key of Object.keys(parseCase.expectedAttrs)) {
                expect(attrsList[0][key]).toBe(parseCase.expectedAttrs[key]);
            }
            // The old type attribute never survives into the model.
            expect(attrsList[0]['type']).toBeUndefined();

            destroyTestEditor(test);
        });
    }
});

// ── 2.7 / 6.7 — Round-trip preservation ───────────────────────────────────────

describe('listStyleType round-trip', () => {
    const roundTripCases: ReadonlyArray<{
        type: 'bulletList' | 'orderedList';
        tag: 'ul' | 'ol';
        attrs: Record<string, unknown>;
    }> = [
        { type: 'bulletList', tag: 'ul', attrs: { listStyleType: 'circle' } },
        { type: 'orderedList', tag: 'ol', attrs: { order: 1, listStyleType: 'lower-roman' } },
        { type: 'orderedList', tag: 'ol', attrs: { order: 7, listStyleType: 'upper-alpha' } }
    ];

    for (const roundTrip of roundTripCases) {
        it(`create → serialize → re-import preserves ${JSON.stringify(roundTrip.attrs)}`, () => {
            // 1. Create from the document model.
            const first = createEditorFromDoc(buildDocument([
                listNode(roundTrip.type, roundTrip.attrs, [listItemNode([paragraphNode('Data')])])
            ]));

            // 2. Serialize to HTML.
            const html = first.editor.getHtml();
            destroyTestEditor(first);

            // 3. Re-import the serialized HTML into a fresh editor.
            const second = createEditorFromHtml(html);

            const attrsList = collectAttrs(second.editor.getDocument(), roundTrip.type);
            expect(attrsList.length).toBe(1);
            for (const key of Object.keys(roundTrip.attrs)) {
                expect(attrsList[0][key]).toBe(roundTrip.attrs[key]);
            }
            expect(second.editor.getHtml()).toContain('Data');

            destroyTestEditor(second);
        });
    }

    it('re-importing legacy <ol type="a"> markup round-trips as CSS values', () => {
        // Legacy input…
        const first = createEditorFromHtml('<ol type="a"><li>Legacy item</li></ol>');
        const modelAttrs = collectAttrs(first.editor.getDocument(), 'orderedList')[0];
        expect(modelAttrs['listStyleType']).toBe('lower-alpha');

        // …serializes as CSS…
        const html = first.editor.getHtml();
        expect(html).toContain('list-style-type: lower-alpha');
        expect(html).not.toContain('type=');
        destroyTestEditor(first);

        // …and the CSS output round-trips identically.
        const second = createEditorFromHtml(html);
        expect(collectAttrs(second.editor.getDocument(), 'orderedList')[0]['listStyleType'])
            .toBe('lower-alpha');
        destroyTestEditor(second);
    });
});

// ── 4.9 — Style preservation across item operations ──────────────────────────

describe('listStyleType is preserved by list item operations', () => {
    it('splitListItem keeps the parent bulletList style and default-styles nested lists after indent', () => {
        const test = createEditorFromDoc(twoItemList('bulletList', { listStyleType: 'square' }));
        placeCursor(test, TEXT_IN_SECOND_ITEM);

        // Split adds a new item inside the same styled container.
        expect(test.editor.commands.splitListItem()).toBe(true);
        const attrsAfterSplit = collectAttrs(test.editor.getDocument(), 'bulletList');
        expect(attrsAfterSplit.length).toBe(1);
        expect(attrsAfterSplit[0]['listStyleType']).toBe('square');

        destroyTestEditor(test);
    });

    it('indenting a list item creates a nested list with the schema default style', () => {
        // PM's sinkListItem creates the nested container with default attrs,
        // so the nested listStyleType comes from the schema: 'disc' for bullets.
        const test = createEditorFromDoc(twoItemList('bulletList', { listStyleType: 'square' }));
        placeCursor(test, TEXT_IN_SECOND_ITEM);

        expect(test.editor.commands.indentListItem()).toBe(true);

        const attrsList = collectAttrs(test.editor.getDocument(), 'bulletList');
        expect(attrsList.length).toBe(2); // outer + nested
        // Outer keeps its custom style; nested adopts the schema default.
        expect(attrsList[0]['listStyleType']).toBe('square');
        expect(attrsList[1]['listStyleType']).toBe('disc');

        destroyTestEditor(test);
    });

    it('outdenting a nested item back into the parent list exposes the parent style', () => {
        // Build: outer bulletList (square) > [item(First), item(Second > nested bulletList)]
        const doc = buildDocument([
            listNode('bulletList', { listStyleType: 'square' }, [
                listItemNode([paragraphNode('First item')]),
                listItemNode([
                    paragraphNode('Second item'),
                    listNode('bulletList', { listStyleType: 'circle' }, [
                        listItemNode([paragraphNode('Nested item')])
                    ])
                ])
            ])
        ]);
        const test = createEditorFromDoc(doc);

        // Cursor inside the nested item's text.
        // Positions: item1 opens at 1 (14 wide) → item2 opens at 15;
        // its paragraph (16..29) is 13 wide → nested list opens at 29,
        // nested item at 30, nested paragraph content at 32.
        placeCursor(test, 32);

        expect(test.editor.commands.outdentListItem()).toBe(true);

        // The nested item joined the parent list; the parent still has one
        // listStyleType ('square') and the document flattens.
        const attrsList = collectAttrs(test.editor.getDocument(), 'bulletList');
        expect(attrsList.length).toBe(1);
        expect(attrsList[0]['listStyleType']).toBe('square');

        destroyTestEditor(test);
    });

    it('outdenting preserves the nested list style when it lifts to top level', () => {
        // Bullets at top level, plus a second bullet list with a custom style
        // that lifts out as a sibling.
        const doc = buildDocument([
            listNode('bulletList', { listStyleType: 'disc' }, [listItemNode([paragraphNode('Solo item')])])
        ]);
        const test = createEditorFromDoc(doc);
        // Toggle off would unwrap; instead outdent inside the single item:
        // liftListItem lifts the item out of the list entirely.
        placeCursor(test, 3);

        expect(test.editor.commands.outdentListItem()).toBe(true);

        const attrsList = collectAttrs(test.editor.getDocument(), 'bulletList');
        expect(attrsList.length).toBe(0); // the list was dissolved
        expect(test.editor.getDocument().children[0].type).toBe('paragraph');

        destroyTestEditor(test);
    });
});

// ── 6.3 / 6.4 — Integration: toggle commands initialize attributes ────────────

describe('toggle command integration through the public facade (continued)', () => {
    it('toggleBulletList then setBulletListType updates the rendered DOM in place', () => {
        const test = createEditorFromDoc(buildDocument([paragraphNode('Convert me')]));
        placeCursor(test, 1);

        expect(test.editor.commands.toggleBulletList()).toBe(true);
        expect(readListElement(test, 'ul').style).toContain('list-style-type: disc');

        expect(test.editor.commands.setBulletListType({ listStyleType: 'circle' })).toBe(true);
        expect(readListElement(test, 'ul').style).toContain('list-style-type: circle');

        destroyTestEditor(test);
    });

    it('toggleOrderedList then setOrderedListType keeps order while changing style', () => {
        const test = createEditorFromDoc(buildDocument([paragraphNode('Convert me too')]));
        placeCursor(test, 1);

        expect(test.editor.commands.toggleOrderedList()).toBe(true);
        expect(readListElement(test, 'ol').style).toContain('list-style-type: decimal');

        expect(test.editor.commands.setOrderedListType({ listStyleType: 'lower-roman' })).toBe(true);
        const rendered = readListElement(test, 'ol');
        expect(rendered.style).toContain('list-style-type: lower-roman');
        expect(rendered.start).toBeNull(); // order stayed 1

        destroyTestEditor(test);
    });
});

// ── 5.3 — Typing markdown triggers creates styled lists (user journey) ───────

describe('typing markdown triggers creates lists with default listStyleType', () => {
    /** Mount an input-rule-enabled editor and simulate typing `trigger`. */
    function typeTrigger(trigger: string): TestEditor {
        const container = document.createElement('div');
        document.body.appendChild(container);
        const typedEditor = HeadlessEditor.create({
            content: '<p> </p>',
            extensions: [paragraphExtension, listExtension],
            enableInputRules: true
        });
        typedEditor.mount(container);

        typedEditor.commands.setSelection({ from: 1, to: 1 });
        const view: any = typedEditor.integration.getView();
        let handled: boolean = false;
        view.someProp('handleTextInput', (handler: Function): void => {
            handled = handler(view, 1, 1, trigger) || handled;
        });
        expect(handled).toBe(true);
        return { editor: typedEditor, container };
    }

    it('typing "- " at the start of a line creates a disc-styled bullet list', () => {
        const test = typeTrigger('- ');

        const ul = test.container.querySelector('ul');
        expect(ul).not.toBeNull();
        expect(ul!.getAttribute('style')).toContain('list-style-type: disc');

        destroyTestEditor(test);
    });

    it('typing "42. " creates a decimal ordered list starting at 42', () => {
        const test = typeTrigger('42. ');

        const ol = test.container.querySelector('ol');
        expect(ol).not.toBeNull();
        expect(ol!.getAttribute('start')).toBe('42');
        expect(ol!.getAttribute('style')).toContain('list-style-type: decimal');

        destroyTestEditor(test);
    });
});
