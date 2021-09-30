import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, FieldElementBox, TextFormField, CheckBoxFormField, DropDownFormField } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import {
    LineWidget, ParagraphWidget, TextElementBox, TableWidget, TableRowWidget, TableCellWidget
} from '../../src/index';

/**
 * Cell content alignment validation -9 combination
 */
describe('Cell content alignment validation in empty selection- Align Center Left', () => {
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.editor.onCellContentAlignment('Center', 'Left');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
});


describe('Cell content alignment validation in empty selection- Align Center Center', () => {
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.editor.onCellContentAlignment('Center', 'Center');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
});

describe('Cell content alignment validation in empty selection- Align Center Right', () => {
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.editor.onCellContentAlignment('Center', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
});



describe('Cell content alignment validation in empty selection- Align Bottom Right', () => {
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.editor.onCellContentAlignment('Bottom', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
});


describe('Cell content alignment validation in empty selection- Align Bottom Center', () => {
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.editor.onCellContentAlignment('Bottom', 'Center');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
});


describe('Cell content alignment validation in empty selection- Align Bottom Left', () => {
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.editor.onCellContentAlignment('Bottom', 'Center');
        editor.editor.onCellContentAlignment('Bottom', 'Left');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
});


describe('Cell content alignment validation in empty selection- Align Top Left', () => {
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.editor.onCellContentAlignment('Bottom', 'Center');
        editor.editor.onCellContentAlignment('Top', 'Left');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
});

describe('Cell content alignment validation in empty selection- Align Top Center', () => {
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.editor.onCellContentAlignment('Bottom', 'Left');
        editor.selection.handleRightKey();
        editor.editor.onCellContentAlignment('Top', 'Center');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
});


describe('Cell content alignment validation in empty selection- Align Top Right', () => {
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.editor.onCellContentAlignment('Bottom', 'Left');
        editor.selection.handleRightKey();
        editor.editor.onCellContentAlignment('Top', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
});

describe('Cell content alignment validation in Non-empty selection-Top Right and Align Center Left', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        editor.acceptTab = true;
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.selectTable();
        editor.editor.onCellContentAlignment('Top', 'Right');
        editor.editor.onCellContentAlignment('Center', 'Left');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
});


describe('Cell content alignment validation in Non-empty selection-Top Center and Align Center Right', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        editor.acceptTab = true;
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.selectTable();
        editor.editor.onCellContentAlignment('Top', 'Center');
        editor.editor.onCellContentAlignment('Center', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
});


describe('Cell content alignment validation in Non-empty selection-Bottom Center and Align TOp Left', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        editor.acceptTab = true;
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.selectTable();
        editor.editor.onCellContentAlignment('Bottom', 'Center');
        editor.editor.onCellContentAlignment('Top', 'Left');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
});



describe('Cell content alignment validation in Non-empty selection-Center Right and Align Bottom Left', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        editor.acceptTab = true;
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.selectTable();
        editor.editor.onCellContentAlignment('Center', 'Right');
        editor.editor.onCellContentAlignment('Bottom', 'Left');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
});



describe('Cell content alignment validation in Non-empty selection-Align Bottom Right', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        editor.acceptTab = true;
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
    it('Align Center left in empty selection', () => {
        console.log('Align Center left in empty selection');
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample');
        editor.selection.selectTable();
        editor.editor.onCellContentAlignment('Bottom', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        console.log(' undo operation after Align Center left in empty selection');
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        console.log(' redo operation after Align Center left in empty selection');
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
        console.log(' undo operation after Align Center left in empty selection and multiple undo operation');
        let i: number = 0;
        while (i < 5) {
            editor.editorHistory.undo();
            editor.editorHistory.redo();
            i++;
        }
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
});


describe('Cell content alignment validation Without History', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        editor.acceptTab = true;
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
    it('Align Bottom Right without history in empty selection', () => {
        console.log('Align Bottom Right without history in empty selection');
        editor.editor.insertTable(2, 2);
        editor.editor.insertText('Sample');
        editor.editor.onEnter()
        editor.editor.insertText('Sample');
        editor.editor.onCellContentAlignment('Bottom', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it('Align Top Center without history in non empty selection', () => {
        console.log('Align Top Center without history in non empty selection');
        editor.editor.onCellContentAlignment('Top', 'Center');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });

    it('Align Center Right without history', () => {
        console.log('Align Center Right without history');
        editor.editor.onCellContentAlignment('Center', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
});


describe('Cell content alignment validation invalid cases', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        editor.acceptTab = true;
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
    it('Align Bottom Right selection including paragraph and table', () => {
        console.log('Align Bottom Right selection including paragraph and table');
        editor.editor.insertText('Sample');
        editor.editor.onEnter();
        editor.editor.insertTable(2, 2);
        editor.editor.insertText('Sample');
        editor.selection.selectAll();
        editor.editor.onCellContentAlignment('Bottom', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it('Align Bottom Right selection in empty selection and not in Table', () => {
        console.log('Align Bottom Right selection in empty selection and not in Table');
        editor.openBlank();
        editor.editor.insertText('Sample');
        editor.editor.onCellContentAlignment('Bottom', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
});

describe('Table center alignment validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        editor.acceptTab = true;
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Table center alightment relayout validation', () => {
        console.log('Table center alightment relayout validation');
        editor.editorModule.insertTable(2, 2);
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.x).toBeLessThan(100);
        editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.tableAlignment = 'Center';
        editor.editorModule.insertText('SYncfusion');
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.x).toBeLessThan(100);
    });
});
let sfdt: object = {
    'sections': [
        {
            'blocks': [
                {
                    'inlines': [
                        {
                            'characterFormat': {
                                'bold': false,
                                'italic': false
                            },
                            'text': ''
                        }
                    ]
                }
            ],
            'headersFooters': {
            },
            'sectionFormat': {
                'headerDistance': 36,
                'footerDistance': 36,
                'pageWidth': 612,
                'pageHeight': 250,
                'leftMargin': 72,
                'rightMargin': 72,
                'topMargin': 72,
                'bottomMargin': 72,
                'differentFirstPage': false,
                'differentOddAndEvenPages': false
            }
        }
    ]
};
// describe('Table relayouting with row span', () => {
//     let editor: DocumentEditor = undefined;
//     beforeAll(() => {
//         let ele: HTMLElement = createElement('div', { id: 'container' });
//         document.body.appendChild(ele);
//         editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
//         editor.acceptTab = true;
//         DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
//         (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
//         (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
//         (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
//         (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
//         editor.appendTo('#container');
//     });
//     afterAll((done) => {
//         editor.destroy();
//         document.body.removeChild(document.getElementById('container'));
//         editor = undefined;
//         setTimeout(() => {
//             document.body.innerHTML = '';
//             done();
//         }, 1000);
//     });
//     // it('Layout table with allow row break across pages', () => {
//     //     console.log('Layout table with allow row break across pages');
//     //     editor.open(JSON.stringify(sfdt));
//     //     editor.editorModule.insertTable(2, 2);
//     //     editor.selection.handleRightKey();
//     //     editor.selection.handleShiftDownKey();
//     //     editor.editor.mergeCells();
//     //     for (let i: number = 0; i < 24; i++) {
//     //         editor.editorModule.onEnter();
//     //     }
//     //     expect(() => { editor.editorModule.onEnter() }).not.toThrowError();
//     // });
//     it('Layout table without allow row break across pages', () => {
//         console.log('Layout table without allow row break across pages');
//         editor.open(JSON.stringify(sfdt));
//         editor.editorModule.insertTable(2, 2);
//         editor.selection.rowFormat.allowBreakAcrossPages = false;
//         editor.selection.handleDownKey();
//         editor.selection.rowFormat.allowBreakAcrossPages = false;
//         editor.selection.handleRightKey();
//         editor.selection.handleShiftUpKey();
//         editor.editor.mergeCells();
//         for (let i: number = 0; i < 24; i++) {
//             editor.editorModule.onEnter();
//         }
//         expect(() => { editor.editorModule.onEnter() }).not.toThrowError();
//     });
// });
let formfield: object = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "styleName": "Normal", "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": {}, "fieldType": 0, "hasFieldEnd": true, "formFieldData": { "name": "Text1", "enabled": true, "helpText": "", "statusText": "", "textInput": { "type": "Text", "maxLength": 0, "defaultValue": "", "format": "" } } }, { "characterFormat": {}, "bookmarkType": 0, "name": "Text1" }, { "characterFormat": {}, "text": " FORMTEXT " }, { "characterFormat": {}, "fieldType": 2 }, { "characterFormat": {}, "text": " " }, { "characterFormat": {}, "text": " " }, { "characterFormat": {}, "text": " " }, { "characterFormat": {}, "text": " " }, { "characterFormat": {}, "text": " " }, { "characterFormat": {}, "fieldType": 1 }, { "characterFormat": {}, "bookmarkType": 0, "name": "_GoBack" }, { "characterFormat": {}, "bookmarkType": 1, "name": "Text1" }, { "characterFormat": {}, "bookmarkType": 1, "name": "_GoBack" }] }], "headersFooters": {} }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Arial" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 8, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "dontUseHTMLParagraphAutoSpacing": false, "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [], "comments": [] };
describe('form field validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        editor.acceptTab = true;
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
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('insert text form field', () => {
        console.log('insert text form field');
        editor.editor.insertFormField('Text');
        let formfield: FieldElementBox[] = editor.documentHelper.formFields;
        expect((formfield[0].formFieldData as TextFormField).name).toBe('Text1');
        expect((formfield[0].formFieldData as TextFormField).defaultValue).toBe('');
        expect((formfield[0].formFieldData as TextFormField).format).toBe('');
        expect((formfield[0].formFieldData as TextFormField).maxLength).toBe(0);
    });
    it('insert checkbox form field', () => {
        console.log('insert checkbox form field');
        editor.editor.insertFormField('CheckBox');
        let formfield: FieldElementBox[] = editor.documentHelper.formFields;
        expect((formfield[1].formFieldData as CheckBoxFormField).name).toBe('CheckBox1');
        expect((formfield[1].formFieldData as CheckBoxFormField).defaultValue).toBe(false);
        expect((formfield[1].formFieldData as CheckBoxFormField).size).toBe(11);
        expect((formfield[1].formFieldData as CheckBoxFormField).sizeType).toBe('Auto');
    });
    it('insert drop down form field', () => {
        console.log('insert drop down form field');
        editor.editor.insertFormField('DropDown');
        let formfield: FieldElementBox[] = editor.documentHelper.formFields;
        expect((formfield[2].formFieldData as DropDownFormField).name).toBe('DropDown1');
        expect((formfield[2].formFieldData as DropDownFormField).selectedIndex).toBe(0);
    });
    it('edit text form field', () => {
        console.log('edit text form field');
        let formfields: FieldElementBox[] = editor.documentHelper.formFields;
        let formfield: TextFormField = formfields[0].formFieldData as TextFormField;
        formfield.defaultValue = 'Check';
        formfield.format = 'Uppercase';
        formfield.maxLength = 10;
        formfield.helpText = 'Check';
        editor.editor.editFormField('Text', formfield);
        (editor.documentHelper.formFields[0].formFieldData as TextFormField) = formfield;
        expect((formfields[0].formFieldData as TextFormField).defaultValue).toBe('Check');
        expect((formfields[0].formFieldData as TextFormField).format).toBe('Uppercase');
        expect((formfields[0].formFieldData as TextFormField).maxLength).toBe(10);
    });
    it('edit checkbox form field', () => {
        console.log('edit checkbox form field');
        let formfields: FieldElementBox[] = editor.documentHelper.formFields;
        let formfield: CheckBoxFormField = formfields[1].formFieldData as CheckBoxFormField;
        formfield.defaultValue = true;
        formfield.size = 20;
        formfield.sizeType = 'Exactly';
        editor.editor.editFormField('CheckBox', formfield);
        (editor.documentHelper.formFields[1].formFieldData as CheckBoxFormField) = formfield;
        expect((formfields[1].formFieldData as CheckBoxFormField).defaultValue).toBe(true);
        expect((formfields[1].formFieldData as CheckBoxFormField).size).toBe(20);
        expect((formfields[1].formFieldData as CheckBoxFormField).sizeType).toBe('Exactly');
    });
    it('edit dropdown form field', () => {
        console.log('edit dropdown form field');
        let formfields: FieldElementBox[] = editor.documentHelper.formFields;
        let formfield: DropDownFormField = formfields[2].formFieldData as DropDownFormField;
        formfield.dropdownItems = ['one', 'two', 'three'];
        formfield.selectedIndex = 1;
        editor.editor.editFormField('DropDown', formfield);
        (editor.documentHelper.formFields[2].formFieldData as DropDownFormField) = formfield;
        expect((formfields[2].formFieldData as DropDownFormField).selectedIndex).toBe(1);
    });
    it('update text form field', () => {
        console.log('update text form field');
        let formfields: FieldElementBox[] = editor.documentHelper.formFields;
        editor.editor.updateFormField(formfields[0], 'result', true);
        expect(formfields[0].resultText).toBe('RESULT');
    });
    it('update checkbox form field', () => {
        console.log('update checkbox form field');
        let formfields: FieldElementBox[] = editor.documentHelper.formFields;
        editor.editor.toggleCheckBoxFormField(formfields[1], true, true);
        expect((formfields[1].formFieldData as CheckBoxFormField).checked).toBe(true);
        editor.editor.toggleCheckBoxFormField(formfields[1], false, true);
        expect((formfields[1].formFieldData as CheckBoxFormField).checked).toBe(false);
    });
    it('get default text dropdown', () => {
        console.log('get default text dropdown');
        editor.editor.insertFormField('DropDown');
        let formfields: FieldElementBox[] = editor.documentHelper.formFields;
        let formfield: DropDownFormField = formfields[3].formFieldData as DropDownFormField;
        formfield.dropdownItems = ['one', 'two', 'three'];
        formfield.selectedIndex = 1;
        (formfields[3].formFieldData as DropDownFormField) = formfield;
        let text: string = (editor.editor as any).getDefaultText(formfield as DropDownFormField);
        expect(text).toBe('one');
    });
    it('get default text dropdown with no drop down items', () => {
        console.log('get default text dropdown with no drop down items');
        editor.editor.insertFormField('DropDown');
        let formfields: FieldElementBox[] = editor.documentHelper.formFields;
        let formfield: DropDownFormField = formfields[4].formFieldData as DropDownFormField;
        formfield.dropdownItems = [];
        formfield.selectedIndex = 1;
        (formfields[4].formFieldData as DropDownFormField) = formfield;
        let text: string = (editor.editor as any).getDefaultText(formfield as DropDownFormField);
        let value: string = editor.documentHelper.textHelper.repeatChar(editor.documentHelper.textHelper.getEnSpaceCharacter(), 5);
        expect(text).toBe(value);
    });
    it('get default text textform', () => {
        console.log('get default text textform');
        let formfields: FieldElementBox[] = editor.documentHelper.formFields;
        let formfield: TextFormField = formfields[0].formFieldData as TextFormField;
        formfield.defaultValue = '';
        let text: string = (editor.editor as any).getDefaultText(formfield);
        let value: string = editor.documentHelper.textHelper.repeatChar(editor.documentHelper.textHelper.getEnSpaceCharacter(), 5);
        expect(text).toBe(value);
    });
    it('update with null', () => {
        console.log('update with null');
        let formfields: FieldElementBox[] = editor.documentHelper.formFields;
        editor.editor.updateFormField(formfields[0], '', true);
        let value: string = editor.documentHelper.textHelper.repeatChar(editor.documentHelper.textHelper.getEnSpaceCharacter(), 5);
        expect(formfields[0].resultText).toBe(value);
    });
    it('update dropdown form field', () => {
        console.log('update dropdown form field');
        let formfields: FieldElementBox[] = editor.documentHelper.formFields;
        let formfield: DropDownFormField = formfields[4].formFieldData as DropDownFormField;
        formfield.dropdownItems = ['one', 'two', 'three'];
        editor.editor.updateFormField(formfields[4], 1, true);
        expect((formfields[4].formFieldData as DropDownFormField).selectedIndex).toBe(1);
    });
    it('insert with selection', () => {
        console.log('insert with selection');
        editor.selection.select({ x: 97.5 + editor.selection.start.paragraph.bodyWidget.page.boundingRectangle.x, y: 108 });
        editor.editor.insertFormField('Text');
    });
    it('update dropdown form field', () => {
        console.log('update dropdown form field');
        let formfields: FieldElementBox[] = editor.documentHelper.formFields;
        let formfield: DropDownFormField = formfields[4].formFieldData as DropDownFormField;
        formfield.dropdownItems = ['one', 'two', 'three'];
        editor.editor.setFormField;
        expect((formfields[4].formFieldData as DropDownFormField).selectedIndex).toBe(1);
    });

    it('insert text form field with word document', () => {
        console.log('insert text form field with word document');
        editor.open(JSON.stringify(formfield));
        let formfields: FieldElementBox[] = editor.documentHelper.formFields;
        expect((formfields[0].formFieldData as TextFormField).name).toBe('Text1');
        editor.editor.updateFormField(formfields[0], 'result', true);
        expect(formfields[0].resultText).toBe('result');
    });
});

describe("Form field inline editing validation", () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
        container.documentEditorSettings.formFieldSettings.formFillingMode = "Inline";
    });
    afterAll((done) => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        setTimeout(() => {
            document.body.innerHTML = '';
            done();
        }, 700);
    });
    it("Inline editing text validation", () => {
        container.editor.insertFormField("Text");
        container.editor.addProtection("", "FormFieldsOnly");
        var value = "a";
        let event: any = {
            offsetX: 100, offsetY: 100, preventDefault: function () { return true; },
            ctrlKey: false, shiftKey: false, which: 0, key: value
        };
        container.selection.movePreviousPosition();
        container.documentHelper.onKeyPressInternal(event);
        var formFieldDate = container.exportFormData();
        expect(formFieldDate[0].value).toBe(value);
    });
});

describe('Track changes Validation For FormField', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('Inserting form fields Validation For revision content  ', function () {
        console.log('Inserting form fields Validation For revision content  ');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText("hello");
        container.editor.insertFormField("Text");
        (container.documentHelper.formFields[0].formFieldData as TextFormField).name = 'Text1';
        container.editor.updateFormField(container.documentHelper.formFields[0], 'TEXT', true);
        container.showRevisions = true;
        let count: number = container.revisions.changes[0].range.length;
        expect(count).toBe(6);
    });

    it('form fields undo and redo Validation For revision content  ', function () {
        console.log('form fields undo and redo Validation For revision content  ');
        container.openBlank();
        container.enableTrackChanges = true;
        container.editor.insertText("hello");
        container.editor.insertFormField("Text");
        (container.documentHelper.formFields[0].formFieldData as TextFormField).name = 'Text1';
        container.editor.updateFormField(container.documentHelper.formFields[0], 'TEXT', true);
        container.showRevisions = true;
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.undo();
        container.editorHistory.redo();
        container.editorHistory.redo();
        container.editorHistory.redo();
        let count: number =  container.revisions.changes[0].range.length;
        expect(count).toBe(6);
    });
    // it('form fields BackSpace Validation For revision content  ', function () {
    //     console.log('form fields BackSpace Validation For revision content  ');
    //     container.openBlank();
    //     container.enableTrackChanges = true;
    //     container.editor.insertText("hello");
    //     container.showRevisions = true;
    //     container.editor.insertFormField("Text");
    //     (container.documentHelper.formFields[0].formFieldData as TextFormField).name = 'Text1';
    //     container.editor.updateFormField(container.documentHelper.formFields[0], 'TEXT', true);
    //     container.editor.onBackSpace();
    //     container.editor.onBackSpace();
    //     container.editorHistory.undo();
    //     let count: number =  container.revisions.changes[0].range.length;
    //     expect(count).toBe(6);
    // });
    // it('form fields Delete Validation For revision content  ', function () {
    //     console.log('form fields Delete Validation For revision content  ');
    //     container.openBlank();
    //     container.enableTrackChanges = true;
    //     container.editor.insertText("hello");
    //     container.showRevisions = true;
    //     container.editor.insertFormField("Text");
    //     (container.documentHelper.formFields[0].formFieldData as TextFormField).name = 'Text1';
    //     container.editor.updateFormField(container.documentHelper.formFields[0], 'TEXT', true);
    //     container.selection.selectAll();
    //     container.editor.delete();
    //     container.editorHistory.undo();
    //     let count: number =  container.revisions.changes[0].range.length;
    //     expect(count).toBe(6);
    // });
});
