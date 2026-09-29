/**
 * This spec file contains test cases for:
 * - Font Color Extension
 * - Background Color Extension
 */

import {
    HeadlessEditor,
    paragraphExtension,
    TextNode,
    undoRedoExtension,
    textStyleExtension
} from '../../../src/index';

import { backgroundColorExtension } from '../../../src/extensions/builtins/background-color';
import { fontColorExtension } from '../../../src/extensions/builtins/font-color';

const makeDocument = (texts: string[]) => ({
    type: 'document' as const,
    id: crypto.randomUUID(),
    schemaVersion: 1,
    attrs: {},
    marks: [],
    children: texts.map((text) => ({
        type: 'paragraph' as const,
        id: crypto.randomUUID(),
        attrs: {},
        marks: [],
        children: [{
            type: 'text' as const,
            id: crypto.randomUUID(),
            attrs: {},
            children: [],
            text,
            marks: []
        } as TextNode]
    }))
});

const mountDocument = (container: HTMLElement, texts: string[], extensions: any[]): HeadlessEditor => {
    const mountedEditor = HeadlessEditor.create({
        document: makeDocument(texts),
        extensions
    });
    mountedEditor.mount(container);
    return mountedEditor;
};

describe('Color extension definitions', () => {
    it('exposes independent defaults and shared text-style dependencies', () => {
        expect(backgroundColorExtension.name).toBe('backgroundColor');
        expect(fontColorExtension.name).toBe('fontColor');

        const backgroundFirst = backgroundColorExtension.config.defineOptions!();
        const backgroundSecond = backgroundColorExtension.config.defineOptions!();
        const fontFirst = fontColorExtension.config.defineOptions!();
        const fontSecond = fontColorExtension.config.defineOptions!();

        expect(backgroundFirst).toEqual({ htmlAttributes: {} });
        expect(fontFirst).toEqual({ htmlAttributes: {} });
        expect(backgroundFirst).not.toBe(backgroundSecond);
        expect(fontFirst).not.toBe(fontSecond);

        expect(backgroundColorExtension.config.addExtensions!()).toEqual([textStyleExtension]);
        expect(fontColorExtension.config.addExtensions!()).toEqual([textStyleExtension]);
    });

    it('registers the apply and remove command pairs in order', () => {
        expect(backgroundColorExtension.config.commands!().map((command) => command.name))
            .toEqual(['setHighlight', 'unsetHighlight']);
        expect(fontColorExtension.config.commands!().map((command) => command.name))
            .toEqual(['setColor', 'unsetColor']);
    });
});

describe('Built-in: backgroundColor', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'paragraph',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'text',
                                id: crypto.randomUUID(),
                                attrs: {},
                                children: [],
                                text: 'Highlighted Text',
                                marks: []
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                backgroundColorExtension,
                fontColorExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        if (!editor.isDestroyed) {
            editor.destroy();
        }

        container.remove();
    });

    it('should apply background color to selected text', () => {
        editor.commands.setSelection({
            from: 1,
            to: 17
        });

        expect(editor.commands.setHighlight({ color: '#ffff00' })).toBe(true);

        const html = editor.getHtml();
        const textNode = editor.getDocument().children[0].children[0] as TextNode;

        expect(html).toContain('<span style="background-color: rgb(255, 255, 0);">Highlighted Text</span>');
        expect(textNode.marks[0].attrs.backgroundColor).toBe('#ffff00');
    });

    it('should apply background color after selecting the entire document', () => {
        editor.commands.selectAll();

        expect(editor.commands.setHighlight({ color: '#ffff00' })).toBe(true);

        expect(editor.getHtml()).toContain('<span style="background-color: rgb(255, 255, 0);">Highlighted Text</span>');

        const textNode: TextNode = editor.getDocument().children[0].children[0] as TextNode;
        expect(textNode.marks[0].attrs.backgroundColor).toBe('#ffff00');
    });

    it('should remove only the background color from selected text', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setHighlight({ color: '#ffff00' });
        expect(editor.commands.unsetHighlight()).toBe(true);

        expect(editor.getHtml()).not.toContain('background-color');
        expect((editor.getDocument().children[0].children[0] as TextNode).marks).toEqual([]);
    });

    it('should format only a partial background-color selection', () => {
        editor.commands.setSelection({ from: 1, to: 11 });
        editor.commands.setHighlight({ color: '#ffff00' });

        const html = editor.getHtml();

        expect(html).toContain('<span style="background-color: rgb(255, 255, 0);">Highlighte</span>');
        expect(html).toContain(' Text');
    });

    it('should accept a collapsed selection and store the background color as a stored mark', () => {
        // A setHighlight at a cursor should NOT be rejected: it stores the
        // mark as a transaction-level storedMark so the next inserted text
        // (typing or paste) inherits the highlight.
        editor.commands.setSelection({ from: 6, to: 6 });

        expect(editor.commands.setHighlight({ color: '#ffff00' })).toBe(true);
        expect(editor.isMarkActive('textStyle', { backgroundColor: '#ffff00' })).toBe(true);
    });

    it('should preserve font color while removing background color', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.setHighlight({ color: '#ffff00' });

        editor.commands.unsetHighlight();

        const html = editor.getHtml();
        expect(html).toContain('color: rgb(255, 0, 0)');
        expect(html).not.toContain('background-color');
    });

    it('should replace a background color without creating duplicate style marks', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setHighlight({ color: '#ffff00' });
        editor.commands.setHighlight({ color: '#00ff00' });

        const html = editor.getHtml();
        expect(html).toContain('background-color: rgb(0, 255, 0)');
        expect(html).not.toContain('rgb(255, 255, 0)');
    });

    it('should undo and redo a background color change', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setHighlight({ color: '#ffff00' });
        const highlightedHtml = editor.getHtml();

        expect(editor.commands.undo()).toBe(true);
        expect(editor.getHtml()).toBe(originalHtml);
        expect(editor.commands.redo()).toBe(true);
        expect(editor.getHtml()).toBe(highlightedHtml);
    });

    it('should reject an empty background color without changing the document', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setSelection({ from: 1, to: 17 });

        expect(editor.commands.setHighlight({ color: '' })).toBe(false);
        expect(editor.getHtml()).toBe(originalHtml);
    });

    it('should clear the stored background color when unsetHighlight is called at a cursor outside the painted range', () => {
        // Paint only the first half of "Highlighted Text" so the cursor
        // can sit inside the same paragraph but past the painted range.
        editor.commands.setSelection({ from: 1, to: 10 });
        editor.commands.setHighlight({ color: '#ffff00' });
        const highlightedHtml = editor.getHtml();

        // Move into the unpainted tail of the same paragraph and unset.
        // The painted text is left alone, but the stored mark that would
        // have applied to new typing at this cursor is cleared.
        editor.commands.setSelection({ from: 11, to: 11 });
        expect(editor.commands.unsetHighlight()).toBe(true);
        expect(editor.getHtml()).toBe(highlightedHtml);
        expect(editor.isMarkActive('textStyle', { backgroundColor: '#ffff00' })).toBe(false);
    });

    it('should apply different background colors to independent ranges', () => {
        editor.commands.setSelection({ from: 1, to: 10 });
        editor.commands.setHighlight({ color: '#ffff00' });
        editor.commands.setSelection({ from: 11, to: 17 });
        editor.commands.setHighlight({ color: '#00ff00' });

        const html = editor.getHtml();
        expect(html).toContain('background-color: rgb(255, 255, 0)');
        expect(html).toContain('background-color: rgb(0, 255, 0)');
        expect(html).toContain(' Text');
    });

    it('should include both endpoints when background color covers the text boundary', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setHighlight({ color: '#123456' });

        const html = editor.getHtml();
        expect(html).toContain('Highlighted Text');
        expect(html).toContain('background-color: rgb(18, 52, 86)');
    });

    it('should expose background color as an active text-style mark', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setHighlight({ color: '#ffff00' });

        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.isMarkActive('textStyle')).toBe(true);
    });

    it('should leave an unformatted selection unchanged when removing background color', () => {
        editor.commands.setSelection({ from: 1, to: 17 });

        expect(editor.commands.unsetHighlight()).toBe(true);
        expect(editor.getHtml()).not.toContain('background-color');
    });

    it('should keep one background style when the same value is applied twice', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setHighlight({ color: '#ffff00' });
        editor.commands.setHighlight({ color: '#ffff00' });

        const html = editor.getHtml();
        expect((html.match(/background-color:/g) || []).length).toBe(1);
    });

    it('should serialize a named background color through the mounted editor', () => {
        editor.commands.setSelection({ from: 1, to: 17 });
        editor.commands.setHighlight({ color: 'red' });

        expect(editor.getHtml()).toContain('background-color: red;');
    });

    it('should apply background color across both paragraphs without changing their text', () => {
        editor.destroy();
        editor = mountDocument(container, ['First paragraph', 'Second paragraph'], [
            paragraphExtension,
            backgroundColorExtension,
            undoRedoExtension
        ]);
        const originalText = editor.getDocument().children.map((node) => (node.children[0] as TextNode).text);

        editor.commands.setSelection({ from: 4, to: 22 });
        editor.commands.setHighlight({ color: '#ffff00' });

        expect(editor.getDocument().children.map((node) => node.children.map((child) => (child as TextNode).text).join(''))).toEqual(originalText);
        expect(editor.getHtml()).toContain('background-color: rgb(255, 255, 0)');
    });

    it('should expose the correct extension name', () => {
        expect(backgroundColorExtension.name).toBe('backgroundColor');
    });

    it('should expose background color commands through the editor', () => {
        expect(typeof editor.commands.setHighlight).toBe('function');
        expect(typeof editor.commands.unsetHighlight).toBe('function');
    });

    it('should expose the correct extension name', () => {
        expect(backgroundColorExtension.name).toBe('backgroundColor');
    });

    it('should return the default background color options', () => {
        expect(backgroundColorExtension.config.defineOptions!()).toEqual({
            htmlAttributes: {}
        });
    });

    it('should register textStyleExtension dependency for background color', () => {
        expect(
            backgroundColorExtension.config.addExtensions!()
        ).toEqual([
            textStyleExtension
        ]);
    });

    it('should register background color commands in order', () => {
        expect(
            backgroundColorExtension.config.commands!().map(
                command => command.name
            )
        ).toEqual([
            'setHighlight',
            'unsetHighlight'
        ]);
    });

    it('should apply background color and update schema', () => {
        editor.commands.setSelection({
            from: 1,
            to: 17
        });

        editor.commands.setHighlight({
            color: '#ffff00'
        });

        const textNode =
            editor.getDocument().children[0].children[0] as TextNode;

        expect(textNode.marks[0].type).toBe('textStyle');
        expect(textNode.marks[0].attrs.backgroundColor).toBe('#ffff00');
    });

    it('should apply background color and update html', () => {
        editor.commands.setSelection({
            from: 1,
            to: 17
        });

        editor.commands.setHighlight({
            color: '#ffff00'
        });

        expect(editor.getHtml()).toContain(
            'background-color: rgb(255, 255, 0)'
        );
    });

    it('should carry the active background color onto text inserted at a collapsed cursor', () => {
        // Regression for the active-formatting bug: setting a mark at a
        // cursor and then inserting text must produce text that carries
        // the mark. The mark lives on the transaction as a storedMark
        // until PM's insertText consumes it.
        editor.commands.setSelection({ from: 6, to: 6 });
        expect(editor.commands.setHighlight({ color: '#ffff00' })).toBe(true);

        editor.commands.insertText({ text: 'NEW' });

        const html = editor.getHtml();
        // PM splits the existing text node at the cursor, so the
        // inserted text appears between "Highl" and "ighted Text".
        // The inserted text must carry the stored background color.
        expect(html).toContain('Highl<span style="background-color: rgb(255, 255, 0);">NEW</span>ighted Text');
    });

    it('should merge a second setHighlight with an existing stored color at a cursor', () => {
        // Stacking setColor + setHighlight at the same cursor should
        // produce a single stored textStyle mark with both attrs so the
        // next inserted character carries both styles, not two separate
        // overlapping marks.
        editor.commands.setSelection({ from: 6, to: 6 });
        editor.commands.setHighlight({ color: '#ffff00' });
        editor.commands.setColor({ color: '#ff0000' });

        editor.commands.insertText({ text: 'X' });

        const html = editor.getHtml();
        // Both colors must be on the inserted text and they must live
        // inside a single span (single textStyle mark).
        const xBlock = html.match(/<span[^>]*>X<\/span>/);
        expect(xBlock).not.toBeNull();
        const xTag = xBlock![0]!;
        expect(xTag).toContain('background-color: rgb(255, 255, 0)');
        expect(xTag).toContain('color: rgb(255, 0, 0)');
        // Exactly one span wraps the inserted X — proves the two
        // operations merged into a single stored textStyle mark.
        expect(xTag.split('<span').length - 1).toBe(1);
    });
});

describe('Built-in: fontColor', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);

        editor = HeadlessEditor.create({
            document: {
                type: 'document',
                id: crypto.randomUUID(),
                schemaVersion: 1,
                attrs: {},
                marks: [],
                children: [
                    {
                        type: 'paragraph',
                        id: crypto.randomUUID(),
                        attrs: {},
                        marks: [],
                        children: [
                            {
                                type: 'text',
                                id: crypto.randomUUID(),
                                attrs: {},
                                children: [],
                                text: 'Colored Text',
                                marks: []
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                fontColorExtension,
                backgroundColorExtension,
                undoRedoExtension
            ]
        });

        editor.mount(container);
    });

    afterEach(() => {
        if (!editor.isDestroyed) {
            editor.destroy();
        }

        container.remove();
    });

    it('should apply font color to selected text', () => {
        editor.commands.setSelection({
            from: 1,
            to: 13
        });

        expect(editor.commands.setColor({ color: '#ff0000' })).toBe(true);

        const html = editor.getHtml();
        const textNode = editor.getDocument().children[0].children[0] as TextNode;

        expect(html).toContain('<span style="color: rgb(255, 0, 0);">Colored Text</span>');
        expect(textNode.marks[0].attrs.color).toBe('#ff0000');
    });

    it('should apply font color after selecting the entire document', () => {
        editor.commands.selectAll();

        expect(editor.commands.setColor({ color: '#ff0000' })).toBe(true);

        expect(editor.getHtml()).toContain('<span style="color: rgb(255, 0, 0);">Colored Text</span>');

        const textNode: TextNode = editor.getDocument().children[0].children[0] as TextNode;
        expect(textNode.marks[0].attrs.color).toBe('#ff0000');
    });

    it('should remove only the font color from selected text', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setColor({ color: '#ff0000' });
        expect(editor.commands.unsetColor()).toBe(true);

        expect(editor.getHtml()).not.toContain('color:');
        expect((editor.getDocument().children[0].children[0] as TextNode).marks).toEqual([]);
    });

    it('should format only a partial font-color selection', () => {
        editor.commands.setSelection({ from: 1, to: 6 });
        editor.commands.setColor({ color: '#ff0000' });

        const html = editor.getHtml();

        expect(html).toContain('<span style="color: rgb(255, 0, 0);">Color</span>');
        expect(html).toContain('ed Text');
    });

    it('should accept a collapsed selection and store the font color as a stored mark', () => {
        // setColor at a cursor must NOT be rejected: it stores the mark as
        // a transaction-level storedMark so the next inserted character
        // (typed or pasted) inherits the color.
        editor.commands.setSelection({ from: 6, to: 6 });

        expect(editor.commands.setColor({ color: '#ff0000' })).toBe(true);
        expect(editor.isMarkActive('textStyle', { color: '#ff0000' })).toBe(true);
    });

    it('should preserve background color while removing font color', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setHighlight({ color: '#ffff00' });
        editor.commands.setColor({ color: '#ff0000' });

        editor.commands.unsetColor();

        const html = editor.getHtml();
        expect(html).toContain('background-color: rgb(255, 255, 0)');
        expect(html).not.toContain('color: rgb(255, 0, 0)');
    });

    it('should replace a font color without creating duplicate style marks', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.setColor({ color: '#0000ff' });

        const html = editor.getHtml();
        expect(html).toContain('color: rgb(0, 0, 255)');
        expect(html).not.toContain('rgb(255, 0, 0)');
    });

    it('should undo and redo a font color change', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setColor({ color: '#ff0000' });
        const coloredHtml = editor.getHtml();

        expect(editor.commands.undo()).toBe(true);
        expect(editor.getHtml()).toBe(originalHtml);
        expect(editor.commands.redo()).toBe(true);
        expect(editor.getHtml()).toBe(coloredHtml);
    });

    it('should reject an empty font color without changing the document', () => {
        const originalHtml = editor.getHtml();
        editor.commands.setSelection({ from: 1, to: 13 });

        expect(editor.commands.setColor({ color: '' })).toBe(false);
        expect(editor.getHtml()).toBe(originalHtml);
    });

    it('should preserve painted color while clearing the stored color at a cursor outside the painted range', () => {
        // Paint only the first half of "Colored Text" so the cursor can
        // sit inside the same paragraph but past the painted range.
        editor.commands.setSelection({ from: 1, to: 7 });
        editor.commands.setColor({ color: '#ff0000' });
        const coloredHtml = editor.getHtml();

        // Position 8 is the start of the unpainted tail of the same
        // paragraph. Unsetting the color there clears the stored mark
        // for any new typing, while the painted text stays intact.
        editor.commands.setSelection({ from: 8, to: 8 });
        expect(editor.commands.unsetColor()).toBe(true);
        expect(editor.getHtml()).toBe(coloredHtml);
        expect(editor.isMarkActive('textStyle', { color: '#ff0000' })).toBe(false);
    });

    it('should apply different font colors to independent ranges', () => {
        editor.commands.setSelection({ from: 1, to: 6 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.setSelection({ from: 7, to: 13 });
        editor.commands.setColor({ color: '#0000ff' });

        const html = editor.getHtml();
        expect(html).toContain('color: rgb(255, 0, 0)');
        expect(html).toContain('color: rgb(0, 0, 255)');
        expect(html).toContain('e<span style="color: rgb(0, 0, 255);">d Text</span>');
    });

    it('should include both endpoints when font color covers the text boundary', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setColor({ color: '#123456' });

        const html = editor.getHtml();
        expect(html).toContain('Colored Text');
        expect(html).toContain('color: rgb(18, 52, 86)');
    });

    it('should expose font color as an active text-style mark', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setColor({ color: '#ff0000' });

        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.isMarkActive('textStyle')).toBe(true);
    });

    it('should keep one font style when the same value is applied twice', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.setColor({ color: '#ff0000' });

        const html = editor.getHtml();
        expect((html.match(/color:/g) || []).length).toBe(1);
    });

    it('should serialize an rgb font color through the mounted editor', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setColor({ color: 'rgb(0, 128, 0)' });

        expect(editor.getHtml()).toContain('color: rgb(0, 128, 0)');
    });

    it('should preserve the document text when font color is removed', () => {
        const originalText = (editor.getDocument().children[0].children[0] as TextNode).text;
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.unsetColor();

        expect((editor.getDocument().children[0].children[0] as TextNode).text).toBe(originalText);
    });

    it('should remove font color from the selected range while preserving the unselected text', () => {
        editor.commands.setSelection({ from: 1, to: 6 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.setSelection({ from: 1, to: 6 });
        editor.commands.unsetColor();

        const html = editor.getHtml();
        expect(html).not.toContain('color: rgb(255, 0, 0)');
        expect(html).toContain('Colored Text');
    });

    it('should preserve font color when a background color is removed from the same range', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.setHighlight({ color: '#ffff00' });
        editor.commands.unsetHighlight();

        expect(editor.getHtml()).toContain('color: rgb(255, 0, 0)');
        expect(editor.getHtml()).not.toContain('background-color');
    });

    it('should leave an unformatted selection unchanged when removing font color', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        expect(editor.commands.unsetColor()).toBe(true);
        expect(editor.getHtml()).not.toContain('color:');
    });

    it('should clear and reapply a new font color', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.unsetColor();
        editor.commands.setColor({ color: '#0000ff' });

        expect(editor.getHtml()).toContain('color: rgb(0, 0, 255)');
        expect(editor.getHtml()).not.toContain('rgb(255, 0, 0)');
    });

    it('should preserve background color while replacing the font color', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setHighlight({ color: '#ffff00' });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.setColor({ color: '#0000ff' });

        const html = editor.getHtml();
        expect(html).toContain('background-color: rgb(255, 255, 0)');
        expect(html).toContain('color: rgb(0, 0, 255)');
    });

    it('should apply font color across two paragraphs', () => {
        editor.destroy();
        editor = mountDocument(container, ['First', 'Second'], [
            paragraphExtension,
            fontColorExtension,
            undoRedoExtension
        ]);
        editor.commands.setSelection({ from: 3, to: 12 });
        editor.commands.setColor({ color: '#ff0000' });

        const html = editor.getHtml();
        expect(html).toContain('color: rgb(255, 0, 0)');
        expect(editor.getDocument().children.map((node) => node.children.map((child) => (child as TextNode).text).join('')))
            .toEqual(['First', 'Second']);
    });

    it('should not retain color markup after destroying and remounting', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.destroy();
        editor = mountDocument(container, ['Plain text'], [paragraphExtension, fontColorExtension]);

        expect(editor.getHtml()).toContain('Plain text');
        expect(editor.getHtml()).not.toContain('color:');
    });
    it('should expose the correct extension name', () => {
        expect(fontColorExtension.name).toBe('fontColor');
    });

    it('should return the default font color options', () => {
        expect(fontColorExtension.config.defineOptions!()).toEqual({
            htmlAttributes: {}
        });
    });

    it('should return independent option instances', () => {
        const first = fontColorExtension.config.defineOptions!();
        const second = fontColorExtension.config.defineOptions!();

        expect(first).not.toBe(second);
        expect(first).toEqual(second);
    });

    it('should register textStyleExtension dependency', () => {
        expect(
            fontColorExtension.config.addExtensions!()
        ).toEqual([
            textStyleExtension
        ]);
    });

    it('should register font color commands', () => {
        expect(
            fontColorExtension.config.commands!().map(
                command => command.name
            )
        ).toEqual([
            'setColor',
            'unsetColor'
        ]);
    });

    it('should expose font color commands through the editor', () => {
        expect(typeof editor.commands.setColor).toBe('function');
        expect(typeof editor.commands.unsetColor).toBe('function');
    });

    it('should apply font color and update document schema', () => {
        editor.commands.setSelection({
            from: 1,
            to: 13
        });

        editor.commands.setColor({
            color: '#ff0000'
        });

        const textNode =
            editor.getDocument().children[0].children[0] as TextNode;

        expect(textNode.marks[0].type).toBe('textStyle');
        expect(textNode.marks[0].attrs.color).toBe('#ff0000');
    });

    it('should apply font color and update html', () => {
        editor.commands.setSelection({
            from: 1,
            to: 13
        });

        editor.commands.setColor({
            color: '#ff0000'
        });

        expect(editor.getHtml()).toContain(
            'color: rgb(255, 0, 0)'
        );
    });

    it('should remove font color and update schema', () => {
        editor.commands.setSelection({
            from: 1,
            to: 13
        });

        editor.commands.setColor({
            color: '#ff0000'
        });

        editor.commands.unsetColor();

        const textNode =
            editor.getDocument().children[0].children[0] as TextNode;

        expect(textNode.marks).toEqual([]);
    });

    it('should remove font color and update html', () => {
        editor.commands.setSelection({
            from: 1,
            to: 13
        });

        editor.commands.setColor({
            color: '#ff0000'
        });

        editor.commands.unsetColor();

        expect(editor.getHtml()).not.toContain('color:');
    });

    it('should expose font color as an active textStyle mark', () => {
        editor.commands.setSelection({
            from: 1,
            to: 13
        });

        editor.commands.setColor({
            color: '#ff0000'
        });

        expect(editor.getActiveMarks()).toContain('textStyle');
        expect(editor.isMarkActive('textStyle')).toBe(true);
    });

    it('should preserve text content when font color is applied', () => {
        const originalText =
            (editor.getDocument().children[0].children[0] as TextNode).text;

        editor.commands.setSelection({
            from: 1,
            to: 13
        });

        editor.commands.setColor({
            color: '#ff0000'
        });

        expect(
            (editor.getDocument().children[0].children[0] as TextNode).text
        ).toBe(originalText);
    });

    it('should remove only the font color when unset over a stacked color + highlight range', () => {
        editor.commands.setSelection({ from: 1, to: 13 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.setHighlight({ color: '#ffff00' });
        // Both color and highlight are now active on the range
        expect(editor.getHtml()).toContain('color: rgb(255, 0, 0)');
        expect(editor.getHtml()).toContain('background-color: rgb(255, 255, 0)');
        editor.commands.setSelection({ from: 1, to: 13 });
        expect(editor.commands.unsetColor()).toBe(true);
        // Font color must be gone from the rendered output, but the
        // background color must remain on the same range.
        const html: string = editor.getHtml();
        expect(html).not.toContain('color: rgb(255, 0, 0)');
        expect(html).toContain('background-color: rgb(255, 255, 0)');
        expect(html).toContain('Colored Text');
    });

    it('should carry the active font color onto text inserted at a collapsed cursor', () => {
        // Regression for the active-formatting bug: setting a mark at a
        // cursor and then inserting text must produce text that carries
        // the mark. Without storedMarks, the inserted character would
        // have no color at all.
        editor.commands.setSelection({ from: 6, to: 6 });
        expect(editor.commands.setColor({ color: '#ff0000' })).toBe(true);

        editor.commands.insertText({ text: 'NEW' });

        const html = editor.getHtml();
        // PM splits the existing "Colored Text" at position 6 (the
        // gap between "Color" and "ed Text") and inserts the new
        // text in between, placing the stored mark on it.
        expect(html).toContain('Color<span style="color: rgb(255, 0, 0);">NEW</span>ed Text');
    });

    it('should keep the active font color on every character typed at the cursor', () => {
        // After insertText consumes a stored mark, the cursor picks up
        // the mark from the just-inserted text node. Subsequent typing
        // at that cursor continues to inherit the mark — that is the
        // standard active-formatting behavior across editors and what
        // users expect.
        editor.commands.setSelection({ from: 6, to: 6 });
        editor.commands.setColor({ color: '#ff0000' });
        editor.commands.insertText({ text: 'A' });
        editor.commands.insertText({ text: 'B' });

        const html = editor.getHtml();
        // Both A and B inherit the color because the cursor is now
        // sitting inside a text node that carries the mark.
        expect(html).toContain('Color<span style="color: rgb(255, 0, 0);">AB</span>ed Text');
    });
});
