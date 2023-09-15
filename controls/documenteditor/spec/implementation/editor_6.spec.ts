import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, FieldElementBox, BookmarkDialog } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import {
    LineWidget, ParagraphWidget, TextElementBox, TableWidget, TableRowWidget, TableCellWidget
} from '../../src/index';
import { ListView } from '@syncfusion/ej2-lists';





describe('ApplyStyle API validation - 1', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('set ClearDirectFormatting as true', () => {
console.log('set ClearDirectFormatting as true');
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.selection.characterFormat.fontSize = 24;
        editor.selection.characterFormat.fontFamily = 'Algerian';
        editor.selection.paragraphFormat.textAlignment = 'Right';
        editor.editor.applyStyle('Heading 1', true);
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri Light');
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Left');
    });
    it('undo -after applyStyle validation', () => {
console.log('undo -after applyStyle validation');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.fontFamily).toBe('Algerian');
        expect(editor.selection.characterFormat.fontSize).toBe(24);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Right');
    });

    it('redo -after applyStyle validation', () => {
console.log('redo -after applyStyle validation');
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri Light');
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Left');
    });

    it('multiple undo and redo -after applyStyle validation', () => {
console.log('multiple undo and redo -after applyStyle validation');
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        expect(editor.selection.characterFormat.fontFamily).toBe('Calibri Light');
        expect(editor.selection.characterFormat.fontSize).toBe(16);
        expect(editor.selection.paragraphFormat.textAlignment).toBe('Left');
    });
});


describe('ApplyStyle API validation - 2', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('The paragraph already contains style and direct formatting, set ClearDirectFormatting as true', () => {
console.log('The paragraph already contains style and direct formatting, set ClearDirectFormatting as true');
        editor.editor.insertText('Sample');
        editor.editor.applyStyle('Heading 1', true);
        editor.selection.selectAll();
        editor.selection.characterFormat.fontSize = 24;
        editor.editor.applyStyle('Heading 4', true);
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });
    it('undo -after applyStyle validation', () => {
console.log('undo -after applyStyle validation');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.italic).toBe(false);
        expect(editor.selection.characterFormat.fontSize).toBe(24);
    });

    it('redo -after applyStyle validation', () => {
console.log('redo -after applyStyle validation');
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });

    it('multiple undo and redo -after applyStyle validation', () => {
console.log('multiple undo and redo -after applyStyle validation');
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        expect(editor.selection.characterFormat.italic).toBe(true);
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });
});


describe('ApplyStyle API validation - 2 without History', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

//     it('without specify ClearDirectFormatting', () => {
// console.log('without specify ClearDirectFormatting');
//         editor.editor.insertText('Sample');
//         editor.selection.selectAll();
//         editor.selection.characterFormat.fontSize = 24;
//         editor.editor.applyStyle('Heading 4');
//         expect(editor.selection.characterFormat.fontSize).toBe(24);
//     });
//     it('with ClearDirectFormatting', () => {
// console.log('with ClearDirectFormatting');
//         editor.editor.insertText('Sample');
//         editor.selection.selectAll();
//         editor.selection.characterFormat.fontSize = 24;
//         editor.editor.applyStyle('Heading 4', true);
//         expect(editor.selection.characterFormat.fontSize).toBe(11);
//     });
});

describe('Adding bookmark link in empty paragraph validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableBookmarkDialog: true });
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

//     it('Adding bookmark link in empty paragraph', () => {
// console.log('Adding bookmark link in empty paragraph');
//         editor.showBookmarkDialog();
//         (document.getElementById('bookmark_text_box') as any).value = 'firstpage';
//         editor.bookmarkDialogModule.onKeyUpOnTextBox();
//         (document.getElementById('add') as HTMLButtonElement).disabled = false;
//         document.getElementById('add').click();
//         expect(editor.documentHelper.bookmarks.length).toBe(1);
//     });
});


describe('Apply Character format in empty selection and paragraph is Empty', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('Apply character format value and paragraph is empty', () => {
console.log('Apply character format value and paragraph is empty');
        editor.selection.characterFormat.bold = true;
        editor.selection.handleRightKey();
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
    it('undo -after apply character format in empty selection', () => {
console.log('undo -after apply character format in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.bold).toBe(false);
    });

    it('redo -after apply character format in empty selection', () => {
console.log('redo -after apply character format in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.characterFormat.bold).toBe(true);
    });

    it('multiple undo and redo -after apply character format in empty selection', () => {
console.log('multiple undo and redo -after apply character format in empty selection');
        let count: number = 1;
        while (count <= 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            count++;
        }
        expect(editor.selection.characterFormat.bold).toBe(true);
    });
});

describe('Apply Character format in empty selection and paragraph is not Empty', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });

    it('Apply character format value and paragraph is empty', () => {
console.log('Apply character format value and paragraph is empty');
        editor.editor.insertText('Sample');
        editor.selection.characterFormat.fontSize = 48;
        editor.selection.characterFormat.fontColor = 'Red';
        expect(editor.selection.characterFormat.fontSize).toBe(48);
        expect(editor.selection.characterFormat.fontColor).toBe('Red');
    });
    it('Enter -after apply character format and paragraph is not empty', () => {
console.log('Enter -after apply character format and paragraph is not empty');
        editor.editor.onEnter();
        expect(editor.selection.characterFormat.fontSize).toBe(48);
        expect(editor.selection.characterFormat.fontColor).toBe('Red');
    });
    it('Undo - Enter -after apply character format and paragraph is not empty', () => {
console.log('Undo - Enter -after apply character format and paragraph is not empty');
        editor.editorHistory.undo();
        editor.editorHistory.undo();
        expect(editor.selection.characterFormat.fontSize).toBe(11);
    });
});
