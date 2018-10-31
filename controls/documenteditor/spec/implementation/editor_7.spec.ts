import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, FieldElementBox } from '../../src/index';
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.editor.onCellContentAlignment('Center', 'Left');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.editor.onCellContentAlignment('Center', 'Center');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.editor.onCellContentAlignment('Center', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.editor.onCellContentAlignment('Bottom', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.editor.onCellContentAlignment('Bottom', 'Center');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.editor.onCellContentAlignment('Bottom', 'Center');
        editor.editor.onCellContentAlignment('Bottom', 'Left');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.editor.onCellContentAlignment('Bottom', 'Center');
        editor.editor.onCellContentAlignment('Top', 'Left');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.editor.onCellContentAlignment('Bottom', 'Left');
        editor.selection.handleRightKey();
        editor.editor.onCellContentAlignment('Top', 'Center');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.editor.onCellContentAlignment('Bottom', 'Left');
        editor.selection.handleRightKey();
        editor.editor.onCellContentAlignment('Top', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.selectTable();
        editor.editor.onCellContentAlignment('Top', 'Right');
        editor.editor.onCellContentAlignment('Center', 'Left');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.selectTable();
        editor.editor.onCellContentAlignment('Top', 'Center');
        editor.editor.onCellContentAlignment('Center', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.selectTable();
        editor.editor.onCellContentAlignment('Bottom', 'Center');
        editor.editor.onCellContentAlignment('Top', 'Left');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.selectTable();
        editor.editor.onCellContentAlignment('Center', 'Right');
        editor.editor.onCellContentAlignment('Bottom', 'Left');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Center');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Center left in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.rowFormat.heightType = 'Exactly';
        editor.selection.rowFormat.height = 30;
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.handleTabKey(true, false);
        editor.editor.insertText('Sample', false);
        editor.selection.selectTable();
        editor.editor.onCellContentAlignment('Bottom', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection', () => {
        editor.editorHistory.undo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it(' redo operation after Align Center left in empty selection', () => {
        editor.editorHistory.redo();
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it(' undo operation after Align Center left in empty selection and multiple undo operation', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Bottom Right without history in empty selection', () => {
        editor.editor.insertTable(2, 2);
        editor.editor.insertText('Sample', false);
        editor.editor.onEnter()
        editor.editor.insertText('Sample', false);
        editor.editor.onCellContentAlignment('Bottom', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Bottom');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Right');
    });
    it('Align Top Center without history in non empty selection', () => {
        editor.editor.onCellContentAlignment('Top', 'Center');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Center');
    });

    it('Align Center Right without history', () => {
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Align Bottom Right selection including paragraph and table', () => {
        editor.editor.insertText('Sample', false);
        editor.editor.onEnter();
        editor.editor.insertTable(2, 2);
        editor.editor.insertText('Sample', false);
        editor.selection.selectAll();
        editor.editor.onCellContentAlignment('Bottom', 'Right');
        expect(editor.selection.cellFormat.verticalAlignment).toBe('Top');
        expect(editor.selection.start.paragraph.paragraphFormat.textAlignment).toBe('Left');
    });
    it('Align Bottom Right selection in empty selection and not in Table', () => {
        editor.openBlank();
        editor.editor.insertText('Sample', false);
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
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Table center alightment relayout validation', () => {
        editor.editorModule.insertTable(2, 2);
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.x).toBeLessThan(100);
        editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.tableAlignment = 'Center';
        editor.editorModule.insertText('SYncfusion', false);
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

describe('Table relayouting with row span', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        editor.acceptTab = true;
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Layout table with allow row break across pages', () => {
        editor.open(JSON.stringify(sfdt));
        editor.editorModule.insertTable(2, 2);
        editor.selection.handleRightKey();
        editor.selection.handleShiftDownKey();
        editor.editor.mergeCells();
        for (let i: number = 0; i < 24; i++) {
            editor.editorModule.onEnter();
        }
        expect(() => { editor.editorModule.onEnter() }).not.toThrowError();
    });
    it('Layout table without allow row break across pages', () => {
        editor.open(JSON.stringify(sfdt));
        editor.editorModule.insertTable(2, 2);
        editor.selection.rowFormat.allowBreakAcrossPages = false;
        editor.selection.handleDownKey();
        editor.selection.rowFormat.allowBreakAcrossPages = false;
        editor.selection.handleRightKey();
        editor.selection.handleShiftUpKey();
        editor.editor.mergeCells();
        for (let i: number = 0; i < 24; i++) {
            editor.editorModule.onEnter();
        }
        expect(() => { editor.editorModule.onEnter() }).not.toThrowError();
    });
});