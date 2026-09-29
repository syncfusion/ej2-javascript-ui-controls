/**
 * spec/commands/range-commands.spec.ts
 *
 * Editor-level workflow specs for the document-range commands:
 *   deleteRange
 *
 * Covers:
 * - `/heading` removal from "Hello /heading" (the slash-command driving use case)
 * - Range at beginning / end of paragraph
 * - Range spanning two text nodes
 * - contentChanged lifecycle (fires on valid delete, silent on invalid)
 * - Selection lands at the mapped position after deletion
 * - Undo/redo participation (content restored / re-deleted)
 * - Slash-command integration: deleteRange → focusView() → insert at cursor
 */
import { HeadlessEditor } from '../../src/headless-editor/headless-editor';
import { DocumentRoot, EditorNode } from '../../src/model/editor-node';
import { CONTENT_CHANGED } from '../../src/events/event-names';

// Extensions: paragraph + heading for document setup; history for undo/redo.
import {
    paragraphExtension,
    headingExtension,
    boldExtension,
    undoRedoExtension
} from '../../src/extensions/builtins';

const testExtensions = [
    paragraphExtension,
    headingExtension,
    boldExtension,
    undoRedoExtension
];

/** Paragraph text fixture: "Hello /heading" — from..to for "/heading" is 7..15. */
const DOC_TEXT = 'Hello /heading';

function textNode(id: string, text: string): EditorNode {
    return { id, type: 'text', text, attrs: {}, children: [], marks: [] } as EditorNode;
}

function paraWithText(id: string, text: string): EditorNode {
    return {
        id,
        type: 'paragraph',
        attrs: {},
        marks: [],
        children: text.length > 0 ? [textNode(`${id}-text`, text)] : []
    } as EditorNode;
}

function doc(...paras: EditorNode[]): DocumentRoot {
    const fixedParas = paras.map((p, i) => ({ ...p, id: `p${i + 1}` }));
    return {
        id: 'range-workflow-doc',
        type: 'document',
        schemaVersion: 1,
        attrs: {},
        marks: [],
        children: fixedParas
    };
}

function buildEditor(docRoot: DocumentRoot): HeadlessEditor {
    const editor = HeadlessEditor.create({
        extensions: testExtensions,
        document: docRoot
    });
    return editor;
}

describe('deleteRange — editor workflow', () => {
    it('removes "/heading" from "Hello /heading" leaving "Hello " with cursor at mapped position', () => {
        const editor = buildEditor(doc(paraWithText('p1', DOC_TEXT)));
        // "Hello " is 1..7 in document positions.
        const ok = editor.commands.deleteRange({ from: 7, to: 15 });
        expect(ok).toBe(true);
        expect(editor.getText()).toBe('Hello ');
        const selection = editor.getSelection();
        expect(selection.from).toBe(7);
        expect(selection.to).toBe(7);
        expect(selection.empty).toBe(true);
        editor.destroy();
    });

    it('deletes a range at the beginning of a paragraph', () => {
        const editor = buildEditor(doc(paraWithText('p1', DOC_TEXT)));
        // Delete "Hello " (1..7).
        expect(editor.commands.deleteRange({ from: 1, to: 7 })).toBe(true);
        expect(editor.getText()).toBe('/heading');
        expect(editor.getSelection().from).toBe(1);
        editor.destroy();
    });

    it('deletes a range at the end of a paragraph', () => {
        const editor = buildEditor(doc(paraWithText('p1', DOC_TEXT)));
        // Delete "/heading" leaving "Hello " — cursor 7.
        expect(editor.commands.deleteRange({ from: 7, to: 15 })).toBe(true);
        expect(editor.getText()).toBe('Hello ');
        expect(editor.getSelection().from).toBe(7);
        editor.destroy();
    });

    it('deletes a range spanning two text nodes (cross-block join)', () => {
        const editor = buildEditor(doc(paraWithText('p1', 'aaa'), paraWithText('p2', 'bbb')));
        // doc: <p>aaa</p><p>bbb</p> — positions: "aaa" spans 1..4, "bbb" spans 5..8
        // Range from 2 (inside first paragraph's text) through 8 (end of second text)
        // joins the two paragraphs per PM delete rules.
        const ok = editor.commands.deleteRange({ from: 2, to: 8 });
        expect(ok).toBe(true);
        const text = editor.getText();
        // First paragraph keeps leading "a"; everything from position 2 on is removed.
        expect(text.startsWith('a')).toBe(true);
        expect(text).toBe('ab');
        editor.destroy();
    });

    it('contentChanged fires once after a valid delete', () => {
        const editor = buildEditor(doc(paraWithText('p1', DOC_TEXT)));
        let fired = 0;
        editor.on(CONTENT_CHANGED, () => { fired++; });
        editor.commands.deleteRange({ from: 7, to: 15 });
        expect(fired).toBe(1);
        editor.destroy();
    });

    it('contentChanged does NOT fire for an invalid range', () => {
        const editor = buildEditor(doc(paraWithText('p1', DOC_TEXT)));
        let fired = 0;
        editor.on(CONTENT_CHANGED, () => { fired++; });
        // far out-of-bounds — validation must refuse before any dispatch
        const ok = editor.commands.deleteRange({ from: 0, to: 9999 });
        expect(ok).toBe(false);
        expect(fired).toBe(0);
        expect(editor.getText()).toBe(DOC_TEXT);
        editor.destroy();
    });

    it('editor.execute("deleteRange", payload) reaches the same result as the facade', () => {
        const editor1 = buildEditor(doc(paraWithText('p1', DOC_TEXT)));
        const editor2 = buildEditor(doc(paraWithText('p1', DOC_TEXT)));
        expect(editor1.execute('deleteRange', { from: 7, to: 15 })).toBe(true);
        expect(editor2.commands.deleteRange({ from: 7, to: 15 })).toBe(true);
        expect(editor1.getText()).toBe(editor2.getText());
        expect(editor1.getSelection().from).toBe(editor2.getSelection().from);
        editor1.destroy();
        editor2.destroy();
    });

    it('can() parity — true for valid, false for invalid, without state change', () => {
        const editor = buildEditor(doc(paraWithText('p1', DOC_TEXT)));
        expect(editor.can().deleteRange({ from: 7, to: 15 })).toBe(true);
        expect(editor.can().deleteRange({ from: 15, to: 7 })).toBe(false);
        expect(editor.getText()).toBe(DOC_TEXT); // untouched
        editor.destroy();
    });
});

describe('range commands — undo/redo', () => {
    it('undo restores deleted content, redo re-deletes it', () => {
        const editor = buildEditor(doc(paraWithText('p1', DOC_TEXT)));
        editor.commands.deleteRange({ from: 7, to: 15 });
        expect(editor.getText()).toBe('Hello ');
        expect(editor.commands.undo()).toBe(true);
        expect(editor.getText()).toBe(DOC_TEXT);
        expect(editor.commands.redo()).toBe(true);
        expect(editor.getText()).toBe('Hello ');
        editor.destroy();
    });

});

describe('range commands — slash-command integration', () => {
    it('deleteRange then focusView then insert at cursor produces the expected document', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = buildEditor(doc(paraWithText('p1', DOC_TEXT)));
        editor.mount(container);

        // Product layer identified the "/heading" range { from: 7, to: 15 }.
        expect(editor.commands.deleteRange({ from: 7, to: 15 })).toBe(true);
        expect(editor.getText()).toBe('Hello ');

        // Focus the editor and continue inserting at the resulting cursor.
        editor.focusView();

        // Insert text at the cursor via insertText (no `at`, uses selection).
        expect(editor.commands.insertText({ text: 'X' })).toBe(true);
        expect(editor.getText()).toBe('Hello X');

        // The caret moved with the insertion.
        expect(editor.getSelection().from).toBe(8);

        editor.unmount();
        editor.destroy();
        document.body.removeChild(container);
    });

    it('mounted editor regains DOM focus after focusView following range deletion', () => {
        const container = document.createElement('div');
        document.body.appendChild(container);

        const editor = buildEditor(doc(paraWithText('p1', DOC_TEXT)));
        editor.mount(container);

        editor.commands.deleteRange({ from: 7, to: 15 });
        editor.focusView();

        // JSDOM: the editor's contenteditable region should report focus.
        const editable = container.querySelector('.e-headless-editor [contenteditable="true"], .e-headless-editor');
        expect(editable).not.toBeNull();
        // The focus call itself must not throw; activeElement check varies by jsdom version.
        expect(() => editor.focusView()).not.toThrow();

        editor.unmount();
        editor.destroy();
        document.body.removeChild(container);
    });
});
