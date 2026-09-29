/**
 * spec/integration/list-style-type-behavior.spec.ts
 *
 * Behavior-driven tests for listStyleType support.
 *
 * Every test drives a REAL user flow end-to-end:
 *   user action / API interaction → command execution → document model + DOM
 *
 * Flows covered (mirroring how customers actually use the editor):
 *   1. Toolbar button — user clicks "Bullet/Ordered List" while editing text
 *   2. Markdown typing — user types "- ", "* ", "+ ", "1. " at the start of a line
 *   3. Keyboard shortcut — user presses Mod-Shift-8 / Mod-Shift-9
 *   4. Style pickers — app calls setBulletListType / setOrderedListType (dropdown value)
 *   5. Indent / Tab — user nests a list and the nested list keeps readable markers
 *   6. Paste / import — user pastes legacy HTML (<ol type="a">) or styled lists
 *   7. Export — app reads getHtml() / getDocument() and sees expected attributes
 *   8. Undo — user hits undo and the previous marker style is back
 */
import {
    HeadlessEditor,
    paragraphExtension,
    undoRedoExtension,
    DocumentRoot,
    EditorNode,
    TextNode
} from '../../src/index';
import { listExtension } from '../../src/extensions/builtins/list';

// ── Shared document builders (the customer's data shape) ─────────────────────

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

function paragraph(text: string): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'paragraph',
        attrs: {},
        marks: [],
        children: [textNode(text)]
    } as EditorNode;
}

function listItem(children: EditorNode[]): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'listItem',
        attrs: {},
        marks: [],
        children
    } as EditorNode;
}

function listBlock(
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

function documentRoot(children: EditorNode[]): DocumentRoot {
    return {
        type: 'document',
        id: crypto.randomUUID(),
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children
    } as DocumentRoot;
}

/** Paragraph with a leading space so input-rule triggers match the anchored regex. */
function blankParagraph(): EditorNode {
    return paragraph(' ');
}

// ── Test harness ──────────────────────────────────────────────────────────────

describe('List style type — real user flows', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    /**
     * Mount an editor the way an app would.
     * `source` is either a DocumentRoot (structured content) or an HTML
     * string (imported content) — exactly the two EditorConfig entry points.
     */
    function mountEditor(
        source: DocumentRoot | string,
        options: { inputRules?: boolean } = {}
    ): void {
        const config: any = {
            extensions: [paragraphExtension, listExtension, undoRedoExtension],
            enableInputRules: options.inputRules ?? false
        };
        if (typeof source === 'string') {
            config.content = source;
        } else {
            config.document = source;
        }
        editor = HeadlessEditor.create(config);
        editor.mount(container);
    }

    /** Simulate the user typing text at the cursor (input-rule path). */
    function typeText(text: string, from: number, to: number): boolean {
        const view: any = editor.integration.getView();
        let handled = false;
        view.someProp('handleTextInput', (handler: Function): void => {
            handled = handler(view, from, to, text) || handled;
        });
        return handled;
    }

    /** Simulate the user pressing a keyboard shortcut. */
    function pressShortcut(key: string, shiftKey: boolean): void {
        const view: any = editor.integration.getView();
        view.dom.dispatchEvent(new KeyboardEvent('keydown', {
            key,
            code: `Key${key.toUpperCase()}`,
            ctrlKey: true,
            shiftKey,
            bubbles: true,
            cancelable: true
        }));
    }

    /** The attributes of the first list container of `type` in the model. */
    function listAttrs(type: 'bulletList' | 'orderedList'): Record<string, unknown> | null {
        let result: Record<string, unknown> | null = null;
        const walk = (node: EditorNode): void => {
            if (result || node.type !== type) {
                if (!result) { (node.children ?? []).forEach(walk); }
                return;
            }
            result = node.attrs;
        };
        (editor.getDocument().children ?? []).forEach(walk);
        return result;
    }

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        if (editor && !editor.integration?.isDestroyed) {
            editor.destroy();
        }
        if (container) {
            container.remove();
        }
    });

    // ═══ 1. Toolbar buttons ═══════════════════════════════════════════════════

    describe('Flow 1 — toolbar: user converts typed text into a list', () => {
        it('B1 — clicking "Bullet List" on a paragraph produces a disc-styled <ul> in both model and DOM', () => {
            mountEditor(documentRoot([paragraph('Meeting notes')]));
            editor.commands.setSelection({ from: 1, to: 14 });

            // The app calls the same API the toolbar button invokes.
            expect(editor.commands.toggleBulletList()).toBe(true);

            // Document model: list created with the default marker style.
            const attrs = listAttrs('bulletList');
            expect(attrs).not.toBeNull();
            expect(attrs!['listStyleType']).toBe('disc');

            // DOM: the user sees a real <ul> list with a disc marker.
            const ul = container.querySelector('ul');
            expect(ul).not.toBeNull();
            expect(ul!.getAttribute('style')).toContain('list-style-type: disc');
            expect(ul!.querySelector('li')!.textContent).toBe('Meeting notes');

            // Export: HTML output carries the style for persistence.
            expect(editor.getHtml()).toContain('list-style-type: disc');
        });

        it('B2 — clicking "Ordered List" produces a decimal-styled <ol> with order 1', () => {
            mountEditor(documentRoot([paragraph('Step one')]));
            editor.commands.setSelection({ from: 1, to: 9 });

            expect(editor.commands.toggleOrderedList()).toBe(true);

            const attrs = listAttrs('orderedList');
            expect(attrs!['listStyleType']).toBe('decimal');
            expect(attrs!['order']).toBe(1);

            const ol = container.querySelector('ol');
            expect(ol).not.toBeNull();
            expect(ol!.getAttribute('style')).toContain('list-style-type: decimal');
            // order 1 → no redundant start attribute in the export.
            expect(editor.getHtml()).not.toContain('start=');
        });

        it('B3 — toggling the same list type off unwraps content back into a paragraph', () => {
            mountEditor(documentRoot([
                listBlock('bulletList', { listStyleType: 'circle' }, [listItem([paragraph('Task A')])])
            ]));
            editor.commands.setSelection({ from: 3, to: 3 });

            // User clicks "Bullet List" while already inside one → toggle off.
            expect(editor.commands.toggleBulletList()).toBe(true);

            const doc = editor.getDocument();
            expect(doc.children[0].type).toBe('paragraph');
            expect(listAttrs('bulletList')).toBeNull();
            expect(container.querySelector('ul')).toBeNull();

            // The text content survives the round trip.
            expect(editor.getHtml()).toContain('Task A');
        });
    });

    // ═══ 2. Markdown typing (input rules) ═════════════════════════════════════

    describe('Flow 2 — typing: user starts a list with markdown shortcuts', () => {
        it('T1 — typing "- " at the start of a line creates a disc bullet list', () => {
            mountEditor(documentRoot([blankParagraph()]), { inputRules: true });
            editor.commands.setSelection({ from: 1, to: 1 });

            const handled = typeText('- ', 1, 1);
            expect(handled).toBe(true);

            const attrs = listAttrs('bulletList');
            expect(attrs).not.toBeNull();
            expect(attrs!['listStyleType']).toBe('disc');
            expect(container.querySelector('ul')!.getAttribute('style'))
                .toContain('list-style-type: disc');
        });

        it('T2 — typing "* " and "+ " also create disc bullet lists', () => {
            for (const trigger of ['* ', '+ ']) {
                mountEditor(documentRoot([blankParagraph()]), { inputRules: true });
                editor.commands.setSelection({ from: 1, to: 1 });

                expect(typeText(trigger, 1, 1)).toBe(true);
                expect(listAttrs('bulletList')!['listStyleType']).toBe('disc');

                editor.destroy();
            }
        });

        it('T3 — typing "42. " creates a decimal ordered list starting at 42', () => {
            mountEditor(documentRoot([blankParagraph()]), { inputRules: true });
            editor.commands.setSelection({ from: 1, to: 1 });

            expect(typeText('42. ', 1, 1)).toBe(true);

            const attrs = listAttrs('orderedList');
            expect(attrs!['listStyleType']).toBe('decimal');
            expect(attrs!['order']).toBe(42);

            const ol = container.querySelector('ol');
            expect(ol!.getAttribute('start')).toBe('42');
            expect(ol!.getAttribute('style')).toContain('list-style-type: decimal');
        });
    });

    // ═══ 3. Keyboard shortcuts ════════════════════════════════════════════════

    describe('Flow 3 — keyboard: Mod-Shift-8 / Mod-Shift-9 create lists', () => {
        it('K1 — Mod-Shift-8 wraps the paragraph in a disc bullet list', () => {
            mountEditor(documentRoot([paragraph('Shortcut bullets')]));
            editor.commands.setSelection({ from: 1, to: 17 });

            pressShortcut('8', true);

            expect(listAttrs('bulletList')!['listStyleType']).toBe('disc');
            expect(container.querySelector('ul li')!.textContent).toBe('Shortcut bullets');
        });

        it('K2 — Mod-Shift-9 wraps the paragraph in a decimal ordered list', () => {
            mountEditor(documentRoot([paragraph('Shortcut ordered')]));
            editor.commands.setSelection({ from: 1, to: 17 });

            pressShortcut('9', true);

            expect(listAttrs('orderedList')!['listStyleType']).toBe('decimal');
            expect(container.querySelector('ol li')!.textContent).toBe('Shortcut ordered');
        });
    });

    // ═══ 4. Style pickers (set{Bullet,Ordered}ListType) ═══════════════════════

    describe('Flow 4 — style picker: user changes the list marker style', () => {
        it('S1 — picking "square" for a bullet list updates model, DOM, and export', () => {
            mountEditor(documentRoot([
                listBlock('bulletList', { listStyleType: 'disc' }, [listItem([paragraph('First')])])
            ]));
            // User places cursor in the list and picks a marker from a dropdown.
            editor.commands.setSelection({ from: 3, to: 3 });

            // can() reflects whether the action is currently available.
            expect(editor.can().setBulletListType({ listStyleType: 'square' })).toBe(true);
            expect(editor.commands.setBulletListType({ listStyleType: 'square' })).toBe(true);

            expect(listAttrs('bulletList')!['listStyleType']).toBe('square');
            expect(container.querySelector('ul')!.getAttribute('style'))
                .toContain('list-style-type: square');
            expect(editor.getHtml()).toContain('list-style-type: square');
        });

        it('S2 — picking "lower-roman" for an ordered list keeps the start number', () => {
            mountEditor(documentRoot([
                listBlock('orderedList', { order: 5, listStyleType: 'decimal' }, [listItem([paragraph('Item')])])
            ]));
            editor.commands.setSelection({ from: 3, to: 3 });

            expect(editor.commands.setOrderedListType({ listStyleType: 'lower-roman' })).toBe(true);

            const attrs = listAttrs('orderedList');
            expect(attrs!['listStyleType']).toBe('lower-roman');
            expect(attrs!['order']).toBe(5);

            const ol = container.querySelector('ol');
            expect(ol!.getAttribute('start')).toBe('5');
            expect(ol!.getAttribute('style')).toContain('list-style-type: lower-roman');
        });

        it('S3 — the picker rejects changes while the cursor is outside a matching list', () => {
            mountEditor(documentRoot([
                paragraph('Plain paragraph'),
                listBlock('bulletList', { listStyleType: 'disc' }, [listItem([paragraph('Item')])])
            ]));

            // Cursor in the paragraph: bullet picker unavailable.
            editor.commands.setSelection({ from: 1, to: 1 });
            expect(editor.can().setBulletListType({ listStyleType: 'square' })).toBe(false);

            // Cursor in the bullet list: ordered picker unavailable.
            // paragraph "Plain paragraph" (16 chars) → text pos 3..19; list
            // opens after it; its item text sits around 21.
            editor.commands.setSelection({ from: 21, to: 21 });
            expect(editor.can().setOrderedListType({ listStyleType: 'lower-roman' })).toBe(false);
        });

        it('S4 — custom marker names are accepted so apps can ship any enum they like', () => {
            mountEditor(documentRoot([
                listBlock('orderedList', { order: 1, listStyleType: 'decimal' }, [listItem([paragraph('Item')])])
            ]));
            editor.commands.setSelection({ from: 3, to: 3 });

            expect(editor.commands.setOrderedListType({ listStyleType: 'cjk-ideographic' })).toBe(true);
            expect(listAttrs('orderedList')!['listStyleType']).toBe('cjk-ideographic');
            expect(editor.getHtml()).toContain('list-style-type: cjk-ideographic');
        });
    });

    // ═══ 5. Tab / indent nesting ══════════════════════════════════════════════

    describe('Flow 5 — Tab: user nests a list item under another', () => {
        it('N1 — indenting an ordered item creates a nested list with the default decimal style', () => {
            // Two ordered items; cursor in the second item's text.
            mountEditor(documentRoot([
                listBlock('orderedList', { order: 1, listStyleType: 'lower-alpha' }, [
                    listItem([paragraph('Parent item')]),
                    listItem([paragraph('Child to indent')])
                ])
            ]));
            // item1: opens at 1, text 3..14, closes 15; item2 text at 17.
            editor.commands.setSelection({ from: 17, to: 17 });

            expect(editor.commands.indentListItem()).toBe(true);

            // Model: two orderedList nodes — the outer one keeps the custom
            // style, the nested one gets the schema default.
            const doc = editor.getDocument();
            let outer: Record<string, unknown> | null = null;
            let nested: Record<string, unknown> | null = null;
            const walkLists = (node: EditorNode): void => {
                if (node.type === 'orderedList') {
                    if (!outer) { outer = node.attrs; }
                    else if (!nested) { nested = node.attrs; }
                }
                (node.children ?? []).forEach(walkLists);
            };
            walkLists(doc as unknown as EditorNode);
            expect(outer!['listStyleType']).toBe('lower-alpha');
            expect(nested!['listStyleType']).toBe('decimal');

            // DOM: the nested <ol> is rendered inside the first item's <li>.
            const nestedOl = container.querySelectorAll('ol');
            expect(nestedOl.length).toBe(2);
            expect(nestedOl[1].getAttribute('style')).toContain('list-style-type: decimal');
        });

        it('N2 — indentation-driven style rotation works end-to-end (demo toolbar behavior)', () => {
            // Mirrors the demo: after indent, the app reads the depth and
            // applies the CSS style for that level via the public API.
            mountEditor(documentRoot([
                listBlock('bulletList', { listStyleType: 'disc' }, [
                    listItem([paragraph('Parent item')]),
                    listItem([paragraph('Child to indent')])
                ])
            ]));
            editor.commands.setSelection({ from: 17, to: 17 });

            expect(editor.commands.indentListItem()).toBe(true);
            expect(editor.commands.setBulletListType({ listStyleType: 'circle' })).toBe(true);

            const nested: HTMLElement | null = container.querySelectorAll('ul')[1] ?? null;
            expect(nested).not.toBeNull();
            expect(nested!.getAttribute('style')).toContain('list-style-type: circle');
        });
    });

    // ═══ 6. Paste & import flows ══════════════════════════════════════════════

    describe('Flow 6 — import: customer loads / pastes HTML lists', () => {
        it('P1 — legacy <ol type="a"> markup is imported as lower-alpha CSS style', () => {
            mountEditor('<ol type="a"><li>Legacy item</li></ol>');

            const attrs = listAttrs('orderedList');
            expect(attrs!['listStyleType']).toBe('lower-alpha');
            expect(attrs!['type']).toBeUndefined(); // legacy attr never reaches the model

            // The rendered DOM and export use CSS only.
            expect(container.querySelector('ol')!.getAttribute('style'))
                .toContain('list-style-type: lower-alpha');
            expect(editor.getHtml()).not.toContain('type=');
        });

        it('P2 — every legacy <ol type> value imports as its CSS equivalent', () => {
            const expectations: ReadonlyArray<[string, string]> = [
                ['1', 'decimal'],
                ['a', 'lower-alpha'],
                ['A', 'upper-alpha'],
                ['i', 'lower-roman'],
                ['I', 'upper-roman']
            ];

            for (const [legacyValue, cssValue] of expectations) {
                mountEditor(`<ol type="${legacyValue}"><li>Item ${legacyValue}</li></ol>`);
                expect(listAttrs('orderedList')!['listStyleType']).toBe(cssValue);
                editor.destroy();
            }
        });

        it('P3 — a styled list from another editor keeps its marker style on import', () => {
            mountEditor('<ul style="list-style-type: square"><li>Kept style</li></ul>');

            expect(listAttrs('bulletList')!['listStyleType']).toBe('square');
            expect(container.querySelector('ul')!.getAttribute('style'))
                .toContain('list-style-type: square');
        });

        it('P4 — an unstyled <ol start="5"> list imports with order and default style', () => {
            mountEditor('<ol start="5"><li>Kept start</li></ol>');

            const attrs = listAttrs('orderedList');
            expect(attrs!['order']).toBe(5);
            expect(attrs!['listStyleType']).toBe('decimal');
            expect(container.querySelector('ol')!.getAttribute('start')).toBe('5');
        });
    });

    // ═══ 7. Export round-trip ══════════════════════════════════════════════════

    describe('Flow 7 — export: saved HTML reloads identically', () => {
        it('R1 — getHtml() output re-imports with the exact same marker style', () => {
            mountEditor(documentRoot([
                listBlock('orderedList', { order: 9, listStyleType: 'upper-roman' }, [
                    listItem([paragraph('Persisted')]),
                    listItem([paragraph('Across reloads')])
                ])
            ]));

            // App persists the export…
            const exportedHtml = editor.getHtml();
            expect(exportedHtml).toContain('list-style-type: upper-roman');
            expect(exportedHtml).toContain('start="9"');

            // …and reloads it later in a fresh editor instance.
            editor.destroy();
            mountEditor(exportedHtml);

            const attrs = listAttrs('orderedList');
            expect(attrs!['listStyleType']).toBe('upper-roman');
            expect(attrs!['order']).toBe(9);
            expect(container.querySelectorAll('ol li').length).toBe(2);
        });

        it('R2 — the document model serializes with same attrs the user chose', () => {
            mountEditor(documentRoot([
                listBlock('bulletList', { listStyleType: 'circle' }, [listItem([paragraph('Model check')])])
            ]));

            const model = editor.getDocument();
            const list = model.children[0] as EditorNode;
            expect(list.attrs['listStyleType']).toBe('circle');
            expect(editor.getHtml()).toContain('<ul style="list-style-type: circle;">');
        });
    });

    // ═══ 8. Undo / redo ════════════════════════════════════════════════════════

    describe('Flow 8 — undo: user reverts a marker style change', () => {
        it('U1 — undo restores the previous marker style after a picker change', () => {
            mountEditor(documentRoot([
                listBlock('orderedList', { order: 1, listStyleType: 'decimal' }, [listItem([paragraph('Undo me')])])
            ]));
            editor.commands.setSelection({ from: 3, to: 3 });

            // User picks "lower-roman"…
            expect(editor.commands.setOrderedListType({ listStyleType: 'lower-roman' })).toBe(true);
            expect(container.querySelector('ol')!.getAttribute('style'))
                .toContain('list-style-type: lower-roman');

            // …then hits Ctrl+Z and the decimal style is back.
            expect(editor.commands.undo()).toBe(true);
            expect(container.querySelector('ol')!.getAttribute('style'))
                .toContain('list-style-type: decimal');

            // Redo re-applies the user's later choice.
            expect(editor.commands.redo()).toBe(true);
            expect(container.querySelector('ol')!.getAttribute('style'))
                .toContain('list-style-type: lower-roman');
        });
    });
});
