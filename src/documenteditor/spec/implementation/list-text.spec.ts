import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, DocumentHelper } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Auto Convert List Test script
 */

describe('Text insert validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Text Insert at list text', () => {
console.log('Text Insert at list text');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.insertText('s');
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it('undo after Text Insert at list text', () => {
console.log('undo after Text Insert at list text');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
        expect(editor.selection.paragraphFormat.listText).toBe('1.');
    });
    it('redo after Text Insert at list text', () => {
console.log('redo after Text Insert at list text');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it('Multiple undo and redo after Text Insert at list text', () => {
console.log('Multiple undo and redo after Text Insert at list text');
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
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Backspace at list text', () => {
console.log('Backspace at list text');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.onBackSpace();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it('undo after Backspace at list text', () => {
console.log('undo after Backspace at list text');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
        expect(editor.selection.paragraphFormat.listText).toBe('1.');
    });
    it('redo after Backspace at list text', () => {
console.log('redo after Backspace at list text');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it('Multiple undo and redo after Backspace at list text', () => {
console.log('Multiple undo and redo after Backspace at list text');
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
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Delete at list text', () => {
console.log('Delete at list text');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.delete();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it('undo after Delete at list text', () => {
console.log('undo after Delete at list text');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.getList()).not.toBe(undefined);
        expect(editor.selection.paragraphFormat.listText).toBe('1.');
    });
    it('redo after Delete at list text', () => {
console.log('redo after Delete at list text');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.getList()).toBe(undefined);
    });
    it('Multiple undo and redo after Delete at list text', () => {
console.log('Multiple undo and redo after Delete at list text');
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
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Bold Apply validation', () => {
console.log('Bold Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.bold = true;
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.bold).toBe(true);
    });
    it('undo after bold apply at list text', () => {
console.log('undo after bold apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.bold).toBe(false);
    });
    it('redo after bold apply at list text', () => {
console.log('redo after bold apply at list text');
        editor.editorHistory.redo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.bold).toBe(true);
    });
    it('Multiple undo and redo after bold at list text', () => {
console.log('Multiple undo and redo after bold at list text');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.bold).toBe(false);
    });
});

describe('Apply Character Format -Italic validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('italic Apply validation', () => {
console.log('italic Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.italic = true;
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.italic).toBe(true);
    });
    it('undo after italic apply at list text', () => {
console.log('undo after italic apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.italic).toBe(false);
    });
    it('redo after italic apply at list text', () => {
console.log('redo after italic apply at list text');
        editor.editorHistory.redo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.italic).toBe(true);
    });
    it('Multiple undo and redo after italic at list text', () => {
console.log('Multiple undo and redo after italic at list text');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.italic).toBe(false);
    });
});

describe('Apply Character Format -Underline validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Underline Apply validation', () => {
console.log('Underline Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.underline = 'Single';
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.underline).toBe('Single');
    });
    it('undo after Underline apply at list text', () => {
console.log('undo after Underline apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.underline).toBe('None');
    });
    it('redo after Underline apply at list text', () => {
console.log('redo after Underline apply at list text');
        editor.editorHistory.redo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.underline).toBe('Single');
    });
    it('Multiple undo and redo after Underline at list text', () => {
console.log('Multiple undo and redo after Underline at list text');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.underline).toBe('None');
    });
});

describe('Apply Character Format -Strikethrough validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Strikethrough Apply validation', () => {
console.log('Strikethrough Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.strikethrough = 'SingleStrike';
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.strikethrough).toBe('SingleStrike');
    });
    it('undo after Strikethrough apply at list text', () => {
console.log('undo after Strikethrough apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.strikethrough).toBe('None');
    });
    it('redo after Strikethrough apply at list text', () => {
console.log('redo after Strikethrough apply at list text');
        editor.editorHistory.redo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.strikethrough).toBe('SingleStrike');
    });
    it('Multiple undo and redo after Strikethrough at list text', () => {
console.log('Multiple undo and redo after Strikethrough at list text');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.strikethrough).toBe('None');
    });
});

describe('Apply Character Format -BaselineAlignment validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('BaselineAlignment Apply validation', () => {
console.log('BaselineAlignment Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.baselineAlignment = 'Superscript';
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.baselineAlignment).toBe('Superscript');
    });
    it('undo after BaselineAlignment apply at list text', () => {
console.log('undo after BaselineAlignment apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.baselineAlignment).toBe('Normal');
    });
    it('redo after BaselineAlignment apply at list text', () => {
console.log('redo after BaselineAlignment apply at list text');
        editor.editorHistory.redo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.baselineAlignment).toBe('Superscript');
    });
    it('Multiple undo and redo after BaselineAlignment at list text', () => {
console.log('Multiple undo and redo after BaselineAlignment at list text');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.baselineAlignment).toBe('Normal');
    });
});

describe('Apply Character Format -Fontsize validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('FontSize Apply validation', () => {
console.log('FontSize Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.fontSize = 20;
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontSize).toBe(20);
    });
    it('undo after FontSize apply at list text', () => {
console.log('undo after FontSize apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontSize).toBe(11);
    });
    it('redo after FontSize apply at list text', () => {
console.log('redo after FontSize apply at list text');
        editor.editorHistory.redo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontSize).toBe(20);
    });
    it('Multiple undo and redo after FontSize at list text', () => {
console.log('Multiple undo and redo after FontSize at list text');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontSize).toBe(11);
    });
});


describe('Apply Character Format -FontFamily validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('FontFamily Apply validation', () => {
console.log('FontFamily Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.fontFamily = 'Arial';
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontFamily).toBe('Arial');
    });
    it('undo after FontSize apply at list text', () => {
console.log('undo after FontSize apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontFamily).toBe('Calibri');
    });
    it('redo after FontSize apply at list text', () => {
console.log('redo after FontSize apply at list text');
        editor.editorHistory.redo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontFamily).toBe('Arial');
    });
    it('Multiple undo and redo after FontSize at list text', () => {
console.log('Multiple undo and redo after FontSize at list text');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontFamily).toBe('Calibri');
    });
});

describe('Apply Character Format -FontColor validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Fontcolor Apply validation', () => {
console.log('Fontcolor Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.fontColor = 'Pink';
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('Pink');
    });
    it('undo after FontColor apply at list text', () => {
console.log('undo after FontColor apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('#00000000');
    });
    it('redo after FontColor apply at list text', () => {
console.log('redo after FontColor apply at list text');
        editor.editorHistory.redo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('Pink');
    });
    it('Multiple undo and redo after FontColor at list text', () => {
console.log('Multiple undo and redo after FontColor at list text');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('#00000000');
    });
});

describe('Apply Character Format -FontColor validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Fontcolor Apply validation', () => {
console.log('Fontcolor Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.fontColor = 'Pink';
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('Pink');
    });
    it('undo after FontColor apply at list text', () => {
console.log('undo after FontColor apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('#00000000');
    });
    it('redo after FontColor apply at list text', () => {
console.log('redo after FontColor apply at list text');
        editor.editorHistory.redo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('Pink');
    });
    it('Multiple undo and redo after FontColor at list text', () => {
console.log('Multiple undo and redo after FontColor at list text');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.fontColor).toBe('#00000000');
    });
});

describe('Apply Character Format -Highlight Color validation of selection context type is List Text with undo and redo', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Fontcolor Apply validation', () => {
console.log('Fontcolor Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.highlightColor = 'Yellow';
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.highlightColor).toBe('Yellow');
    });
    it('undo after FontColor apply at list text', () => {
console.log('undo after FontColor apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.highlightColor).toBe('NoColor');
    });
    it('redo after FontColor apply at list text', () => {
console.log('redo after FontColor apply at list text');
        editor.editorHistory.redo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.highlightColor).toBe('Yellow');
    });
    it('Multiple undo and redo after FontColor at list text', () => {
console.log('Multiple undo and redo after FontColor at list text');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.getListLevel(editor.selection.start.paragraph).characterFormat.highlightColor).toBe('NoColor');
    });
});

describe('Restart Numbering with undo and redo', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Restart Numbering Apply validation', () => {
console.log('Restart Numbering Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('I');
        editor.editorModule.insertText(')');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample');
        editor.selection.handleUpKey();
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyRestartNumbering(editor.selection);
        expect(editor.selection.paragraphFormat.listText).toBe('I)');
    });
    it('undo after Restart Numbering apply at list text', () => {
console.log('undo after Restart Numbering apply at list text');
        editor.editorHistory.undo();
        editor.selection.handleUpKey();
        // expect(editor.selection.paragraphFormat.listText).toBe('IV)');
    });
    it('redo after Restart Numbering apply at list text', () => {
console.log('redo after Restart Numbering apply at list text');
        editor.editorHistory.redo();
        editor.selection.handleUpKey();
        expect(editor.selection.paragraphFormat.listText).toBe('II)');
    });
    it('Multiple undo and redo after Restart Numbering at list text', () => {
console.log('Multiple undo and redo after Restart Numbering at list text');
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
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Restart Numbering Apply validation', () => {
console.log('Restart Numbering Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('I');
        editor.editorModule.insertText(')');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.selection.handleTabKey(true, false);
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyRestartNumbering(editor.selection);
        expect(editor.selection.paragraphFormat.listText).toBe('a.');
    });
    it('undo after Restart Numbering apply at list text', () => {
console.log('undo after Restart Numbering apply at list text');
        editor.editorHistory.undo();
        // expect(editor.selection.paragraphFormat.listText).toBe('II.');
    });
    it('redo after Restart Numbering apply at list text', () => {
console.log('redo after Restart Numbering apply at list text');
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.listText).toBe('a.');
    });
    it('Multiple undo and redo after Restart Numbering at list text', () => {
console.log('Multiple undo and redo after Restart Numbering at list text');
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
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Restart Numbering Apply validation', () => {
console.log('Restart Numbering Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyContinueNumbering();
        // expect(editor.selection.paragraphFormat.listText).toBe('3.');
    });
    it('undo after Continue Numbering apply at list text', () => {
console.log('undo after Continue Numbering apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listText).toBe('1.');
    });
    it('redo after Continue Numbering apply at list text', () => {
console.log('redo after Continue Numbering apply at list text');
        editor.editorHistory.redo();
        // expect(editor.selection.paragraphFormat.listText).toBe('3.');
    });
    it('Multiple undo and redo after Continue Numbering at list text', () => {
console.log('Multiple undo and redo after Continue Numbering at list text');
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
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Continue Numbering Apply validation', () => {
console.log('Continue Numbering Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('I');
        editor.editorModule.insertText(')');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.selection.handleTabKey(true, false);
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyContinueNumbering();
        // expect(editor.selection.paragraphFormat.listText).toBe('II)');
    });
    it('undo after Continue Numbering apply at list text', () => {
console.log('undo after Continue Numbering apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listText).toBe('a.');
    });
    it('redo after Continue Numbering apply at list text', () => {
console.log('redo after Continue Numbering apply at list text');
        editor.editorHistory.redo();
        // expect(editor.selection.paragraphFormat.listText).toBe('II)');
    });
    it('Multiple undo and redo after Continue Numbering at list text', () => {
console.log('Multiple undo and redo after Continue Numbering at list text');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listText).toBe('a.');
    });
});
describe('Continue Numbering at level number 1', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Continue Numbering Apply validation', () => {
console.log('Continue Numbering Apply validation');
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.selection.handleTabKey(true, false);
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyContinueNumbering();
        // expect(editor.selection.paragraphFormat.listText).toBe('2.');
    });
});

describe('Continue Numbering validation with different level pattern with undo and redo', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Restart Numbering Apply validation', () => {
console.log('Restart Numbering Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('a');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editorModule.insertText('A');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyContinueNumbering();
        // expect(editor.selection.paragraphFormat.listText).toBe('c.');
    });
    it('undo after Continue Numbering apply at list text', () => {
console.log('undo after Continue Numbering apply at list text');
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.listText).toBe('A.');
    });
    it('redo after Continue Numbering apply at list text', () => {
console.log('redo after Continue Numbering apply at list text');
        editor.editorHistory.redo();
        // expect(editor.selection.paragraphFormat.listText).toBe('c.');
    });
    it('Multiple undo and redo after Continue Numbering at list text', () => {
console.log('Multiple undo and redo after Continue Numbering at list text');
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
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Restart Numbering Apply validation', () => {
console.log('Restart Numbering Apply validation');
        editor.openBlank();
        editor.editorModule.insertText('I');
        editor.editorModule.insertText(')');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.editor.applyRestartNumbering(editor.selection);
        expect(editor.selection.paragraphFormat.listText).toBe('I)');
    });
    it('Continue numbering without history Apply validation', () => {
console.log('Continue numbering without history Apply validation');
        editor.editor.applyContinueNumbering();
        //    expect(editor.selection.paragraphFormat.listText).toBe('III)');
    });
});

describe('List continue numbering validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
    });
    it('Check list number', () => {
console.log('Check list number');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample');
        editor.editor.onEnter();
        editor.editorModule.insertText('Sample');
        editor.selection.handleUpKey();
        editor.editor.onEnter();
        editor.editor.onBackSpace();
        let paragraph: any = editor.selection.start.paragraph.bodyWidget;
        expect(paragraph.childWidgets[3].childWidgets[0].children[0].text).toBe('3.');
    });
});

/**
 * Selection list text format retieval validation
 */

describe('Character retrieval validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Font family at list text validation', () => {
console.log('Font family at list text validation');
        editor.openBlank();
        editor.editorModule.insertText('1');
        editor.editorModule.insertText('.');
        editor.editorModule.insertText(' ');
        editor.editorModule.insertText('Sample');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        editor.selection.characterFormat.fontFamily='Arial';
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        expect(editor.selection.characterFormat.fontFamily).toBe('Arial');
    });
    it('Font size validation', () => {
console.log('Font size validation');
       
        editor.selection.characterFormat.fontSize=12;
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        expect(editor.selection.characterFormat.fontSize).toBe(12);
    });
    it('Bold validation', () => {
console.log('Bold validation');
        
        editor.selection.characterFormat.bold=true;
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
});


let listText:any={"sections":[{"sectionFormat":{"pageWidth":612,"pageHeight":792,"leftMargin":72,"rightMargin":72,"topMargin":72,"bottomMargin":72,"differentFirstPage":false,"differentOddAndEvenPages":false,"headerDistance":36,"footerDistance":36,"bidi":false},"blocks":[{"paragraphFormat":{"styleName":"List Paragraph","listFormat":{"listId":0,"listLevelNumber":0}},"characterFormat":{"bold":true,"boldBidi":true},"inlines":[{"characterFormat":{},"text":"asdasdasda"},{"characterFormat":{},"bookmarkType":0,"name":"_GoBack"},{"characterFormat":{},"bookmarkType":1,"name":"_GoBack"}]}],"headersFooters":{"header":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"footer":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"evenFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageHeader":{"blocks":[{"paragraphFormat":{"styleName":"Header","listFormat":{}},"characterFormat":{},"inlines":[]}]},"firstPageFooter":{"blocks":[{"paragraphFormat":{"styleName":"Footer","listFormat":{}},"characterFormat":{},"inlines":[]}]}}}],"characterFormat":{"bold":false,"italic":false,"fontSize":11,"fontFamily":"Calibri","underline":"None","strikethrough":"None","baselineAlignment":"Normal","highlightColor":"NoColor","fontColor":"#000000","fontSizeBidi":11,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":0,"afterSpacing":8,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","listFormat":{},"bidi":false},"defaultTabWidth":35.400001525878906,"enforcement":false,"hashValue":"","saltValue":"","formatting":false,"protectionType":"NoProtection","dontUseHTMLParagraphAutoSpacing":false,"styles":[{"name":"Normal","type":"Paragraph","paragraphFormat":{"listFormat":{}},"characterFormat":{},"next":"Normal"},{"name":"Default Paragraph Font","type":"Character","characterFormat":{}},{"name":"Header","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Header Char","next":"Header"},{"name":"Header Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"Footer","type":"Paragraph","paragraphFormat":{"afterSpacing":0,"lineSpacing":1,"lineSpacingType":"Multiple","listFormat":{},"tabs":[{"position":225.64999389648438,"deletePosition":0,"tabJustification":"Center","tabLeader":"None"},{"position":451.29998779296875,"deletePosition":0,"tabJustification":"Right","tabLeader":"None"}]},"characterFormat":{},"basedOn":"Normal","link":"Footer Char","next":"Footer"},{"name":"Footer Char","type":"Character","characterFormat":{},"basedOn":"Default Paragraph Font"},{"name":"List Paragraph","type":"Paragraph","paragraphFormat":{"leftIndent":36,"listFormat":{},"contextualSpacing":true},"characterFormat":{},"basedOn":"Normal","next":"List Paragraph"},{"name":"Heading 1","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":12,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level1","listFormat":{}},"characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 1 Char","next":"Normal"},{"name":"Heading 1 Char","type":"Character","characterFormat":{"fontSize":16,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 2","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level2","listFormat":{}},"characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 2 Char","next":"Normal"},{"name":"Heading 2 Char","type":"Character","characterFormat":{"fontSize":13,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 3","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level3","listFormat":{}},"characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 3 Char","next":"Normal"},{"name":"Heading 3 Char","type":"Character","characterFormat":{"fontSize":12,"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"},{"name":"Heading 4","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level4","listFormat":{}},"characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 4 Char","next":"Normal"},{"name":"Heading 4 Char","type":"Character","characterFormat":{"italic":true,"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 5","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level5","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Normal","link":"Heading 5 Char","next":"Normal"},{"name":"Heading 5 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#2F5496"},"basedOn":"Default Paragraph Font"},{"name":"Heading 6","type":"Paragraph","paragraphFormat":{"leftIndent":0,"rightIndent":0,"firstLineIndent":0,"textAlignment":"Left","beforeSpacing":2,"afterSpacing":0,"lineSpacing":1.0791666507720947,"lineSpacingType":"Multiple","outlineLevel":"Level6","listFormat":{}},"characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Normal","link":"Heading 6 Char","next":"Normal"},{"name":"Heading 6 Char","type":"Character","characterFormat":{"fontFamily":"Calibri Light","fontColor":"#1F3763"},"basedOn":"Default Paragraph Font"}],"lists":[{"abstractListId":0,"levelOverrides":[],"listId":0}],"abstractLists":[{"abstractListId":0,"levels":[{"characterFormat":{"italic":true,"fontColor":"#A5A5A5FF","italicBidi":true,"fontFamilyBidi":"Arial"},"paragraphFormat":{"leftIndent":36,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%1.","restartLevel":0,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":72,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%2.","restartLevel":1,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":108,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%3.","restartLevel":2,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":144,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%4.","restartLevel":3,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":180,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%5.","restartLevel":4,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":216,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%6.","restartLevel":5,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":252,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"Arabic","numberFormat":"%7.","restartLevel":6,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":288,"firstLineIndent":-18,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowLetter","numberFormat":"%8.","restartLevel":7,"startAt":1},{"characterFormat":{},"paragraphFormat":{"leftIndent":324,"firstLineIndent":-9,"listFormat":{}},"followCharacter":"Tab","listLevelPattern":"LowRoman","numberFormat":"%9.","restartLevel":8,"startAt":1}]}],"comments":[]};
describe('List text format validation in loaded document', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(listText));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('italic apply validation', () => {
console.log('italic apply validation');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        expect(editor.selection.characterFormat.italic).toBe(true);
        editor.selection.characterFormat.italic=false;
        editor.selection.selectListText();
        expect(editor.selection.characterFormat.italic).toBe(false);
    });
    it('bold apply validation', () => {
console.log('bold apply validation');
        editor.documentHelper.selectionLineWidget = editor.selection.start.currentWidget;
        editor.selection.selectListText();
        expect(editor.selection.characterFormat.bold).toBe(false);
        editor.selection.characterFormat.bold=true;
        editor.selection.selectListText();
        expect(editor.selection.characterFormat.bold).toBe(true);
    });  
});
describe('Continue Numbering public API validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true});
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(listText));
    });
    afterAll((done): void => {
        documentHelper.destroy();
        documentHelper = undefined;
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Continue Numbering public API validation', () => {
console.log('Continue Numbering public API validation');
        editor.openBlank();
        editor.editorModule.insertText('Adventure');
        editor.editorModule.applyBulletOrNumbering('%1.', 'Arabic', 'Verdana');
        documentHelper.selection.handleEndKey();
        editor.editorModule.onEnter();
        editor.editorModule.insertText('Works');
        editor.selection.handleHomeKey();
        expect(() => { editor.editorModule.applyContinueNumbering(); }).not.toThrowError();
    });  
});
