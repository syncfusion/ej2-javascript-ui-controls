import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { Editor } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
/**
 * Table resize on with table auto fit true
 */
describe('Remove content with track changes enabled', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableEditorHistory: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Remove selected content', () => {
        console.log('Remove selected content');
        editor.enableTrackChanges = true;
        editor.editor.insertText("Hello world");
        editor.editorModule.onEnter();
        editor.editor.insertText("Hello world");
        editor.editorModule.onEnter();
        editor.editor.insertText("Hello world");
        editor.editorModule.onEnter();
        editor.editor.insertText("Hello world");
        editor.editorModule.onEnter();
        editor.editor.insertText("Hello world");
        expect(editor.documentHelper.pages[0].bodyWidgets[0].childWidgets.length).toBe(5);
        editor.selection.selectAll();
        editor.editorModule.onBackSpace();
        expect(editor.documentHelper.pages[0].bodyWidgets.length).toBe(1);
        expect(editor.revisions.length).toBe(0);
    });
    it('Undo and redo mutiple times', () => {
       editor.editorHistoryModule.undo();
       expect(editor.revisions.length).toBe(1);
       editor.editorHistoryModule.redo();
       expect(editor.revisions.length).toBe(0);
       editor.editorHistoryModule.undo();
       expect(editor.revisions.length).toBe(1);
       editor.editorHistoryModule.redo();
       expect(editor.revisions.length).toBe(0);
    });
});

describe('Paragraph split revision adding issue', () => {
    let editor: DocumentEditor = undefined;
    beforeAll((): void => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableEditorHistory: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Table Paragraph split', () => {
        console.log('Table Paragraph split');
        editor.editor.insertTable(2,2);
        editor.editor.insertText("Hello world");
        editor.selection.extendToWordStart();
        editor.selection.handleLeftKey();
        editor.editorModule.onEnter();
        expect(editor.revisions.length).toBe(0);
    });
});