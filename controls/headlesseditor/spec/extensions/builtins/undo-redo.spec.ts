import { HeadlessEditor, TextNode, paragraphExtension, headingExtension, boldExtension, italicExtension, undoRedoExtension } from '../../../src/index';
import { fontFamilyExtension } from '../../../src/extensions/builtins/font-family';
import { fontSizeExtension } from '../../../src/extensions/builtins/font-size';
import { textStyleExtension } from '../../../src/extensions/builtins/text-style';

describe('Built-in: undoRedo formatting scenarios', () => {
    let editor: HeadlessEditor;
    let container: HTMLElement;
    const createEditor = (): void => {
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
                                text: 'Hello World',
                                marks: []
                            } as TextNode
                        ]
                    }
                ]
            },
            extensions: [
                paragraphExtension,
                headingExtension,
                textStyleExtension,
                boldExtension,
                italicExtension,
                fontFamilyExtension,
                fontSizeExtension,
                undoRedoExtension
            ]
        });
        editor.mount(container);
    };

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
        createEditor();
    });

    afterEach(() => {
        if (!editor.isDestroyed) {
            editor.destroy();
        }
        container.remove();
    });

    describe('italic undo/redo', () => {
        it('should undo italic formatting applied to text', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleItalic();
            expect(editor.getHtml()).toContain('<em>');
            expect(editor.commands.undo()).toBe(true);
            expect(editor.getHtml()).not.toContain('<em>');
        });

        it('should redo italic formatting after undo', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleItalic();
            const italicHtml = editor.getHtml();
            editor.commands.undo();
            expect(editor.commands.redo()).toBe(true);
            expect(editor.getHtml()).toBe(italicHtml);
        });
    });

    describe('heading undo/redo', () => {
        it('should undo heading conversion', () => {
            editor.commands.setSelection({ from: 1, to: 11 });
            editor.commands.setHeading({ level: 1 });
            expect(editor.getHtml()).toContain('<h1');
            expect(editor.commands.undo()).toBe(true);
            expect(editor.getHtml()).not.toContain('<h1');
        });

        it('should redo heading conversion', () => {
            editor.commands.setSelection({ from: 1, to: 11 });
            editor.commands.setHeading({ level: 1 });
            const headingHtml = editor.getHtml();
            editor.commands.undo();
            expect(editor.commands.redo()).toBe(true);
            expect(editor.getHtml()).toBe(headingHtml);
        });

        it('should redo heading level change', () => {
            editor.commands.setSelection({ from: 1, to: 11 });
            editor.commands.setHeading({ level: 1 });
            editor.commands.setHeading({ level: 2 });
            editor.commands.undo();
            expect(editor.commands.redo()).toBe(true);
            expect(editor.getHtml()).toContain('<h2');
        });
    });

    describe('font family undo/redo', () => {
        it('should undo font family change', () => {
            editor.commands.setSelection({ from: 1, to: 11 });
            editor.commands.setFontFamily({ family: 'Arial' });
            expect(editor.getHtml()).toContain('font-family');
            expect(editor.commands.undo()).toBe(true);
            expect(editor.getHtml()).not.toContain('font-family');
        });

        it('should redo font family change', () => {
            editor.commands.setSelection({ from: 1, to: 11 });
            editor.commands.setFontFamily({ family: 'Arial' });
            const formattedHtml = editor.getHtml();
            editor.commands.undo();
            expect(editor.commands.redo()).toBe(true);
            expect(editor.getHtml()).toBe(formattedHtml);
        });

        it('should undo multiple font family changes', () => {
            editor.commands.setSelection({ from: 1, to: 11 });
            editor.commands.setFontFamily({ family: 'Arial' });
            editor.commands.setFontFamily({ family: 'Times New Roman' });
            editor.commands.undo();
            expect(editor.getHtml()).toContain('Arial');
        });

        it('should redo multiple font family changes', () => {
            editor.commands.setSelection({ from: 1, to: 11 });
            editor.commands.setFontFamily({ family: 'Arial' });
            editor.commands.setFontFamily({ family: 'Times New Roman' });
            editor.commands.undo();
            editor.commands.redo();
            expect(editor.getHtml()).toContain('Times');
        });
    });

    describe('font size undo/redo', () => {
        it('should undo font size change', () => {
            editor.commands.setSelection({ from: 1, to: 11 });
            editor.commands.setFontSize({ size: '24px' });
            expect(editor.getHtml()).toContain('font-size');
            editor.commands.undo();
            expect(editor.getHtml()).not.toContain('font-size');
        });

        it('should redo font size change', () => {
            editor.commands.setSelection({ from: 1, to: 11 });
            editor.commands.setFontSize({ size: '24px' });
            const html = editor.getHtml();
            editor.commands.undo();
            expect(editor.commands.redo()).toBe(true);
            expect(editor.getHtml()).toBe(html);
        });

        it('should undo multiple font size changes', () => {
            editor.commands.setSelection({ from: 1, to: 11 });
            editor.commands.setFontSize({ size: '24px' });
            editor.commands.setFontSize({ size: '32px' });
            editor.commands.undo();
            expect(editor.getHtml()).toContain('24px');
        });

        it('should redo multiple font size changes', () => {
            editor.commands.setSelection({ from: 1, to: 11 });
            editor.commands.setFontSize({ size: '24px' });
            editor.commands.setFontSize({ size: '32px' });
            editor.commands.undo();
            editor.commands.redo();
            expect(editor.getHtml()).toContain('32px');
        });
    });

    describe('multi-format history', () => {
        it('should undo multiple formatting operations sequentially', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleBold();
            editor.commands.toggleItalic();
            expect(editor.getHtml()).toContain('<strong>');
            expect(editor.getHtml()).toContain('<em>');
            editor.commands.undo();
            expect(editor.getHtml()).toContain('<strong>');
            expect(editor.getHtml()).not.toContain('<em>');
            editor.commands.undo();
            expect(editor.getHtml()).not.toContain('<strong>');
        });

        it('should redo multiple formatting operations sequentially', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleBold();
            editor.commands.toggleItalic();
            editor.commands.undo();
            editor.commands.undo();
            editor.commands.redo();
            expect(editor.getHtml()).toContain('<strong>');
            editor.commands.redo();
            expect(editor.getHtml()).toContain('<em>');
        });

        it('should clear redo stack after a new edit', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleBold();
            editor.commands.undo();
            editor.commands.toggleItalic();
            expect(editor.commands.redo()).toBe(false);
        });

        it('should preserve history across mixed formatting operations', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleBold();
            editor.commands.setFontFamily({ family: 'Arial' });
            editor.commands.setFontSize({ size: '24px' });
            editor.commands.undo();
            editor.commands.undo();
            editor.commands.undo();
            expect(editor.getHtml()).not.toContain('<strong>');
            expect(editor.getHtml()).not.toContain('font-family');
            expect(editor.getHtml()).not.toContain('font-size');
        });
    });

    describe('history state', () => {
        it('should not allow redo when redo history is empty', () => {
            expect(editor.commands.redo()).toBe(false);
        });

        it('should not allow undo when history is empty', () => {
            expect(editor.commands.undo()).toBe(false);
        });

        it('should support undo and redo through keyboard shortcuts', () => {
            editor.commands.setSelection({ from: 1, to: 6 });
            editor.commands.toggleBold();
            expect(editor.getHtml()).toContain('<strong>');
            const editorView: any = editor.integration.getView();
            // Undo (Mod-z)
            editorView.dom.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'z', code: 'KeyZ', ctrlKey: true, bubbles: true, cancelable: true })
            );
            expect(editor.getHtml()).not.toContain('<strong>');
            // Redo (Mod-y)
            editorView.dom.dispatchEvent(
                new KeyboardEvent('keydown', { key: 'y', code: 'KeyY', ctrlKey: true, bubbles: true, cancelable: true })
            );
            expect(editor.getHtml()).toContain('<strong>');
        });
    });
});