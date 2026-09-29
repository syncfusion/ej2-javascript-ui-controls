/**
 * spec/commands/builtins/list-style-type.spec.ts
 *
 * User-journey tests for listStyleType styling:
 *   - toggleBulletList / toggleOrderedList seed default marker styles
 *   - setBulletListTypeCommand / setOrderedListTypeCommand apply CSS values
 *   - cross-type conversions adopt the target type's defaults
 *
 * Every test drives a complete flow on a mounted editor through the public
 * API only — EditorConfig.document for setup, commands.setSelection for the
 * caret, editor.commands.* for the action, then getDocument() + rendered DOM
 * for the result. No private internals or PM types are touched.
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

function listItemNode(text: string): EditorNode {
    return {
        id: crypto.randomUUID(),
        type: 'listItem',
        attrs: {},
        marks: [],
        children: [paragraphNode(text)]
    } as EditorNode;
}

function listNode(type: 'bulletList' | 'orderedList', attrs: Record<string, unknown>, items: string[]): EditorNode {
    return {
        id: crypto.randomUUID(),
        type,
        attrs,
        marks: [],
        children: items.map(listItemNode)
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

// ── Editor + query helpers ───────────────────────────────────────────────────

interface TestEditor {
    editor: HeadlessEditor;
    container: HTMLElement;
}

function createTestEditor(doc: DocumentRoot): TestEditor {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const editor = HeadlessEditor.create({
        document: doc,
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

/**
 * The user positions the caret the way apps do — through the public
 * setSelection command, the same API the selection UI drives. No PM
 * internals are touched.
 */
function placeCursorInFirstText(test: TestEditor, textPos: number): void {
    expect(test.editor.commands.setSelection({ from: textPos, to: textPos })).toBe(true);
}

/** Find the first node of the given type and return its attrs. */
function findAttrs(doc: DocumentRoot, type: string): Record<string, unknown> | null {
    let result: Record<string, unknown> | null = null;
    const walk = (node: EditorNode): void => {
        if (result) { return; }
        if (node.type === type) {
            result = node.attrs;
            return;
        }
        (node.children ?? []).forEach(walk);
    };
    doc.children.forEach(walk);
    return result;
}

// Doc layouts and their first cursor positions:
//   paragraph doc:      document(0) > paragraph(0) > text(1)
//   list doc:            document(0) > list(0) > listItem(1) > paragraph(2) > text(3)
const CURSOR_IN_PARAGRAPH = 1;
const CURSOR_IN_LIST_TEXT = 3;

// ── toggleBulletList seeds the default marker style ──────────────────────────

describe('toggleBulletList seeds listStyleType', () => {
    let test: TestEditor;

    beforeEach(() => {
        test = createTestEditor(buildDocument([paragraphNode('Wrap me in a bullet list')]));
        placeCursorInFirstText(test, CURSOR_IN_PARAGRAPH);
    });

    afterEach(() => {
        destroyTestEditor(test);
    });

    it('creates a bulletList with listStyleType "disc"', () => {
        expect(test.editor.commands.toggleBulletList()).toBe(true);

        const attrs = findAttrs(test.editor.getDocument(), 'bulletList');
        expect(attrs).not.toBeNull();
        expect(attrs!['listStyleType']).toBe('disc');
    });

    it('renders the default style as an inline CSS declaration', () => {
        test.editor.commands.toggleBulletList();

        const ul = test.container.querySelector('ul');
        expect(ul).not.toBeNull();
        expect(ul!.getAttribute('style')).toContain('list-style-type: disc');
    });
});

// ── toggleOrderedList seeds the default marker style ─────────────────────────

describe('toggleOrderedList seeds listStyleType and order', () => {
    let test: TestEditor;

    beforeEach(() => {
        test = createTestEditor(buildDocument([paragraphNode('Wrap me in an ordered list')]));
        placeCursorInFirstText(test, CURSOR_IN_PARAGRAPH);
    });

    afterEach(() => {
        destroyTestEditor(test);
    });

    it('creates an orderedList with listStyleType "decimal" and order 1', () => {
        expect(test.editor.commands.toggleOrderedList()).toBe(true);

        const attrs = findAttrs(test.editor.getDocument(), 'orderedList');
        expect(attrs).not.toBeNull();
        expect(attrs!['listStyleType']).toBe('decimal');
        expect(attrs!['order']).toBe(1);
    });

    it('renders decimal style and omits start when order is 1', () => {
        test.editor.commands.toggleOrderedList();

        const ol = test.container.querySelector('ol');
        expect(ol).not.toBeNull();
        expect(ol!.getAttribute('style')).toContain('list-style-type: decimal');
        expect(ol!.hasAttribute('start')).toBe(false);
    });
});

// ── setBulletListTypeCommand ──────────────────────────────────────────────────

describe('setBulletListTypeCommand', () => {
    it('rejects execution outside a bullet list', () => {
        const test = createTestEditor(buildDocument([paragraphNode('Just a paragraph')]));
        placeCursorInFirstText(test, CURSOR_IN_PARAGRAPH);

        expect(test.editor.can().setBulletListType({ listStyleType: 'circle' })).toBe(false);
        expect(test.editor.commands.setBulletListType({ listStyleType: 'circle' })).toBe(false);

        destroyTestEditor(test);
    });

    it('rejects execution while inside an ordered list', () => {
        const test = createTestEditor(buildDocument([
            listNode('orderedList', { order: 1, listStyleType: 'decimal' }, ['Ordered item'])
        ]));
        placeCursorInFirstText(test, CURSOR_IN_LIST_TEXT);

        expect(test.editor.can().setBulletListType({ listStyleType: 'circle' })).toBe(false);

        destroyTestEditor(test);
    });

    it('rejects an empty listStyleType value', () => {
        const test = createTestEditor(buildDocument([
            listNode('bulletList', { listStyleType: 'disc' }, ['Bullet item'])
        ]));
        placeCursorInFirstText(test, CURSOR_IN_LIST_TEXT);

        expect(test.editor.can().setBulletListType({ listStyleType: '' })).toBe(false);
        expect(test.editor.commands.setBulletListType({ listStyleType: '' })).toBe(false);
        // The attribute is untouched.
        expect(findAttrs(test.editor.getDocument(), 'bulletList')!['listStyleType']).toBe('disc');

        destroyTestEditor(test);
    });

    it('applies a standard CSS bullet value and re-renders the style', () => {
        const test = createTestEditor(buildDocument([
            listNode('bulletList', { listStyleType: 'disc' }, ['Bullet item'])
        ]));
        placeCursorInFirstText(test, CURSOR_IN_LIST_TEXT);

        expect(test.editor.commands.setBulletListType({ listStyleType: 'square' })).toBe(true);

        const attrs = findAttrs(test.editor.getDocument(), 'bulletList');
        expect(attrs!['listStyleType']).toBe('square');
        expect(test.container.querySelector('ul')!.getAttribute('style'))
            .toContain('list-style-type: square');

        destroyTestEditor(test);
    });

    it('accepts custom marker values without validation', () => {
        const test = createTestEditor(buildDocument([
            listNode('bulletList', { listStyleType: 'disc' }, ['Bullet item'])
        ]));
        placeCursorInFirstText(test, CURSOR_IN_LIST_TEXT);

        expect(test.editor.commands.setBulletListType({ listStyleType: 'custom-marker' })).toBe(true);
        expect(findAttrs(test.editor.getDocument(), 'bulletList')!['listStyleType'])
            .toBe('custom-marker');

        destroyTestEditor(test);
    });
});

// ── setOrderedListTypeCommand ─────────────────────────────────────────────────

describe('setOrderedListTypeCommand', () => {
    it('rejects execution outside an ordered list', () => {
        const test = createTestEditor(buildDocument([paragraphNode('Just a paragraph')]));
        placeCursorInFirstText(test, CURSOR_IN_PARAGRAPH);

        expect(test.editor.can().setOrderedListType({ listStyleType: 'lower-alpha' })).toBe(false);
        expect(test.editor.commands.setOrderedListType({ listStyleType: 'lower-alpha' })).toBe(false);

        destroyTestEditor(test);
    });

    it('rejects execution while inside a bullet list', () => {
        const test = createTestEditor(buildDocument([
            listNode('bulletList', { listStyleType: 'disc' }, ['Bullet item'])
        ]));
        placeCursorInFirstText(test, CURSOR_IN_LIST_TEXT);

        expect(test.editor.can().setOrderedListType({ listStyleType: 'lower-alpha' })).toBe(false);

        destroyTestEditor(test);
    });

    it('rejects an empty listStyleType value', () => {
        const test = createTestEditor(buildDocument([
            listNode('orderedList', { order: 1, listStyleType: 'decimal' }, ['Ordered item'])
        ]));
        placeCursorInFirstText(test, CURSOR_IN_LIST_TEXT);

        expect(test.editor.commands.setOrderedListType({ listStyleType: '' })).toBe(false);
        expect(findAttrs(test.editor.getDocument(), 'orderedList')!['listStyleType'])
            .toBe('decimal');

        destroyTestEditor(test);
    });

    it('changes the marker style while preserving the order attribute', () => {
        const test = createTestEditor(buildDocument([
            listNode('orderedList', { order: 5, listStyleType: 'decimal' }, ['Ordered item'])
        ]));
        placeCursorInFirstText(test, CURSOR_IN_LIST_TEXT);

        expect(test.editor.commands.setOrderedListType({ listStyleType: 'upper-roman' })).toBe(true);

        const attrs = findAttrs(test.editor.getDocument(), 'orderedList');
        expect(attrs!['listStyleType']).toBe('upper-roman');
        expect(attrs!['order']).toBe(5);
        // DOM keeps both signals: start for the number, CSS for the markers.
        const ol = test.container.querySelector('ol');
        expect(ol!.getAttribute('start')).toBe('5');
        expect(ol!.getAttribute('style')).toContain('list-style-type: upper-roman');

        destroyTestEditor(test);
    });
});

// ── Cross-type conversion adopts target defaults ──────────────────────────────

describe('list type conversion resets listStyleType to target defaults', () => {
    it('orderedList with a custom style converts to a default-styled bulletList', () => {
        const test = createTestEditor(buildDocument([
            listNode('orderedList', { order: 3, listStyleType: 'lower-alpha' }, ['Item one'])
        ]));
        placeCursorInFirstText(test, CURSOR_IN_LIST_TEXT);

        expect(test.editor.commands.toggleBulletList()).toBe(true);

        const doc = test.editor.getDocument();
        expect(findAttrs(doc, 'orderedList')).toBeNull();
        const attrs = findAttrs(doc, 'bulletList');
        expect(attrs!['listStyleType']).toBe('disc');
        // List content survives the conversion.
        expect(test.container.querySelector('ul li')!.textContent).toContain('Item one');

        destroyTestEditor(test);
    });

    it('bulletList with a custom style converts to a default-styled orderedList', () => {
        const test = createTestEditor(buildDocument([
            listNode('bulletList', { listStyleType: 'square' }, ['Item one'])
        ]));
        placeCursorInFirstText(test, CURSOR_IN_LIST_TEXT);

        expect(test.editor.commands.toggleOrderedList()).toBe(true);

        const doc = test.editor.getDocument();
        expect(findAttrs(doc, 'bulletList')).toBeNull();
        const attrs = findAttrs(doc, 'orderedList');
        expect(attrs!['listStyleType']).toBe('decimal');
        expect(attrs!['order']).toBe(1);

        destroyTestEditor(test);
    });
});

// ── Toggle off preserves content as paragraphs ────────────────────────────────

describe('toggling a list off unwraps content back to paragraphs', () => {
    it('bulletList toggles off and drops list-level attributes with the node', () => {
        const test = createTestEditor(buildDocument([
            listNode('bulletList', { listStyleType: 'circle' }, ['Item one'])
        ]));
        placeCursorInFirstText(test, CURSOR_IN_LIST_TEXT);

        expect(test.editor.commands.toggleBulletList()).toBe(true);

        const doc = test.editor.getDocument();
        expect(findAttrs(doc, 'bulletList')).toBeNull();
        expect(doc.children[0].type).toBe('paragraph');
        expect(doc.children[0].children[0]!.type).toBe('text');

        destroyTestEditor(test);
    });
});
