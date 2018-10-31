import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Auto Convert List Test script
 */

describe('Text insert validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Text Insert at list text', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.insertText('s', false);
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it('undo after Text Insert at list text', () => {
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
        expect(editor.selection.paragraphFormat.listText).toBe('1.');
    });
    it('redo after Text Insert at list text', () => {
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);        
    });
    it('Multiple undo and redo after Text Insert at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
    });
});

describe('Backspace validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Backspace at list text', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.onBackSpace();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it('undo after Backspace at list text', () => {
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
        expect(editor.selection.paragraphFormat.listText).toBe('1.');
    });
    it('redo after Backspace at list text', () => {
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);        
    });
    it('Multiple undo and redo after Backspace at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
    });
});

describe('Delete validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Delete at list text', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.onDelete();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it('undo after Delete at list text', () => {
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
        expect(editor.selection.paragraphFormat.listText).toBe('1.');
    });
    it('redo after Delete at list text', () => {
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);        
    });
    it('Multiple undo and redo after Delete at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
    });
});

describe('Apply Character Format -bold validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Bold Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.bold=true;
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.bold).toBe(true);
    });
    it('undo after bold apply at list text', () => {
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.bold).toBe(false);
    });
    it('redo after bold apply at list text', () => {
        editor.editorHistory.redo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.bold).toBe(true);
    });
    it('Multiple undo and redo after bold at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.bold).toBe(false);
    });
});

describe('Apply Character Format -Italic validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('italic Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.italic=true;
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.italic).toBe(true);
    });
    it('undo after italic apply at list text', () => {
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.italic).toBe(false);
    });
    it('redo after italic apply at list text', () => {
        editor.editorHistory.redo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.italic).toBe(true);
    });
    it('Multiple undo and redo after italic at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.italic).toBe(false);
    });
});

describe('Apply Character Format -Underline validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Underline Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.underline='Single';
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.underline).toBe('Single');
    });
    it('undo after Underline apply at list text', () => {
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.underline).toBe('None');
    });
    it('redo after Underline apply at list text', () => {
        editor.editorHistory.redo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.underline).toBe('Single');
    });
    it('Multiple undo and redo after Underline at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.underline).toBe('None');
    });
});

describe('Apply Character Format -Strikethrough validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Strikethrough Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.strikethrough='SingleStrike';
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.strikethrough).toBe('SingleStrike');
    });
    it('undo after Strikethrough apply at list text', () => {
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.strikethrough).toBe('None');
    });
    it('redo after Strikethrough apply at list text', () => {
        editor.editorHistory.redo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.strikethrough).toBe('SingleStrike');
    });
    it('Multiple undo and redo after Strikethrough at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.strikethrough).toBe('None');
    });
});

describe('Apply Character Format -BaselineAlignment validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('BaselineAlignment Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.baselineAlignment='Superscript';
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.baselineAlignment).toBe('Superscript');
    });
    it('undo after BaselineAlignment apply at list text', () => {
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.baselineAlignment).toBe('Normal');
    });
    it('redo after BaselineAlignment apply at list text', () => {
        editor.editorHistory.redo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.baselineAlignment).toBe('Superscript');
    });
    it('Multiple undo and redo after BaselineAlignment at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.baselineAlignment).toBe('Normal');
    });
});

describe('Apply Character Format -Fontsize validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('FontSize Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.fontSize=20;
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontSize).toBe(20);
    });
    it('undo after FontSize apply at list text', () => {
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontSize).toBe(11);
    });
    it('redo after FontSize apply at list text', () => {
        editor.editorHistory.redo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontSize).toBe(20);
    });
    it('Multiple undo and redo after FontSize at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontSize).toBe(11);
    });
});


describe('Apply Character Format -FontFamily validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('FontFamily Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.fontFamily='Arial';
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontFamily).toBe('Arial');
    });
    it('undo after FontSize apply at list text', () => {
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontFamily).toBe('Calibri');
    });
    it('redo after FontSize apply at list text', () => {
        editor.editorHistory.redo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontFamily).toBe('Arial');
    });
    it('Multiple undo and redo after FontSize at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontFamily).toBe('Calibri');
    });
});

describe('Apply Character Format -FontColor validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Fontcolor Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.fontColor='Pink';
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('Pink');
    });
    it('undo after FontColor apply at list text', () => {
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('#000000');
    });
    it('redo after FontColor apply at list text', () => {
        editor.editorHistory.redo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('Pink');
    });
    it('Multiple undo and redo after FontColor at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('#000000');
    });
});

describe('Apply Character Format -FontColor validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Fontcolor Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.fontColor='Pink';
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('Pink');
    });
    it('undo after FontColor apply at list text', () => {
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('#000000');
    });
    it('redo after FontColor apply at list text', () => {
        editor.editorHistory.redo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('Pink');
    });
    it('Multiple undo and redo after FontColor at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('#000000');
    });
});

describe('Apply Character Format -Highlight Color validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Fontcolor Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.highlightColor='Yellow';
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.highlightColor).toBe('Yellow');
    });
    it('undo after FontColor apply at list text', () => {
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.highlightColor).toBe('NoColor');
    });
    it('redo after FontColor apply at list text', () => {
        editor.editorHistory.redo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.highlightColor).toBe('Yellow');
    });
    it('Multiple undo and redo after FontColor at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.editor.getListLevel(editor.selection.start.paragraph).characterFormat.highlightColor).toBe('NoColor');
    });
});

describe('Restart Numbering with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Restart Numbering Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('I', false);
        editor.editorModule.insertText(')', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample', false);
        editor.selection.handleUpKey();        
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyRestartNumbering(editor.selection);
        expect(editor.selection.paragraphFormat.listText).toBe('I)');
    });
    it('undo after Restart Numbering apply at list text', () => {
        editor.editorHistory.undo();
        editor.selection.handleUpKey();
        // expect(editor.selection.paragraphFormat.listText).toBe('IV)');
    });
    it('redo after Restart Numbering apply at list text', () => {
        editor.editorHistory.redo();
        editor.selection.handleUpKey();
        expect(editor.selection.paragraphFormat.listText).toBe('II)');
    });
    it('Multiple undo and redo after Restart Numbering at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        // expect(editor.selection.paragraphFormat.listText).toBe('IV)');
    });
});


describe('Restart Numbering at level number 1', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Restart Numbering Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('I', false);
        editor.editorModule.insertText(')', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.selection.handleTabKey(true,false);
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyRestartNumbering(editor.selection);
        expect(editor.selection.paragraphFormat.listText).toBe('I.');
    });
    it('undo after Restart Numbering apply at list text', () => {
        editor.editorHistory.undo();        
        // expect(editor.selection.paragraphFormat.listText).toBe('II.');
    });
    it('redo after Restart Numbering apply at list text', () => {
        editor.editorHistory.redo();        
        expect(editor.selection.paragraphFormat.listText).toBe('I.');
    });
    it('Multiple undo and redo after Restart Numbering at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        // expect(editor.selection.paragraphFormat.listText).toBe('II.');
    });
});

describe('Continue Numbering validation with same level pattern with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Restart Numbering Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyContinueNumbering(editor.selection);
        // expect(editor.selection.paragraphFormat.listText).toBe('3.');
    });
    it('undo after Continue Numbering apply at list text', () => {
        editor.editorHistory.undo();        
        expect(editor.selection.paragraphFormat.listText).toBe('1.');
    });
    it('redo after Continue Numbering apply at list text', () => {
        editor.editorHistory.redo();        
        // expect(editor.selection.paragraphFormat.listText).toBe('3.');
    });
    it('Multiple undo and redo after Continue Numbering at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listText).toBe('1.');
    });
});
describe('Continue Numbering at level number 1', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Continue Numbering Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('I', false);
        editor.editorModule.insertText(')', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.selection.handleTabKey(true,false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyContinueNumbering(editor.selection);
        // expect(editor.selection.paragraphFormat.listText).toBe('II)');
    });
    it('undo after Continue Numbering apply at list text', () => {
        editor.editorHistory.undo();        
        expect(editor.selection.paragraphFormat.listText).toBe('I.');
    });
    it('redo after Continue Numbering apply at list text', () => {
        editor.editorHistory.redo();        
        // expect(editor.selection.paragraphFormat.listText).toBe('II)');
    });
    it('Multiple undo and redo after Continue Numbering at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listText).toBe('I.');
    });    
});
describe('Continue Numbering at level number 1', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Continue Numbering Apply validation', () => {
        editor.editorModule.insertText('1', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.selection.handleTabKey(true,false);
        editor.editorModule.insertText('Sample', false);
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyContinueNumbering(editor.selection);
        // expect(editor.selection.paragraphFormat.listText).toBe('2.');
    });
});

describe('Continue Numbering validation with different level pattern with undo and redo', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Restart Numbering Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('a', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editorModule.insertText('A', false);
        editor.editorModule.insertText('.', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);    
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyContinueNumbering(editor.selection);
        // expect(editor.selection.paragraphFormat.listText).toBe('c.');
    });
    it('undo after Continue Numbering apply at list text', () => {
        editor.editorHistory.undo();        
        expect(editor.selection.paragraphFormat.listText).toBe('A.');
    });
    it('redo after Continue Numbering apply at list text', () => {
        editor.editorHistory.redo();        
        // expect(editor.selection.paragraphFormat.listText).toBe('c.');
    });
    it('Multiple undo and redo after Continue Numbering at list text', () => {
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listText).toBe('A.');
    });
});


describe('without history Restart Numbering and continue numbering validation', () => {
    let editor: DocumentEditor;
    let viewer: LayoutViewer;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true});
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done): void => {
        viewer.destroy();
        viewer = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Restart Numbering Apply validation', () => {
        editor.openBlank();
        editor.editorModule.insertText('I', false);
        editor.editorModule.insertText(')', false);
        editor.editorModule.insertText(' ', false);
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample', false);        
        editor.viewer.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyRestartNumbering(editor.selection);
        expect(editor.selection.paragraphFormat.listText).toBe('I)');
    });
    it('Continue numbering without history Apply validation', () => {
       editor.editor.applyContinueNumbering(editor.selection);
    //    expect(editor.selection.paragraphFormat.listText).toBe('III)');
    });
});