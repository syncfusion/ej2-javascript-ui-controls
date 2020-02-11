import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index';
import { TestHelper } from '../test-helper.spec';

describe('Selection Paragraph format line  spacing apply validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Linespacing Double apply validation', () => {
        editor.editor.insertText('Hello World');
        editor.selection.paragraphFormat.lineSpacingType = 'AtLeast';
        editor.selection.paragraphFormat.lineSpacing = 15;
        editor.selection.paragraphFormat.lineSpacing = 2;
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('Multiple');
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(2);
    });
    it('undo after Linespacing Double apply validation', () => {
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(15);
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('AtLeast');
    });
    it('redo after Linespacing Double apply validation', () => {
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('Multiple');
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(2);
    });
});


describe('Selection Paragraph format line  spacing type apply validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        document.body.innerHTML = '';
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, EditorHistory, Selection);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true });
        editor.acceptTab = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        documentHelper = undefined;
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('LinespacingType atleast apply validation', () => {
        editor.editor.insertText('Hello World');
        editor.selection.paragraphFormat.lineSpacing = 2;
        editor.selection.paragraphFormat.lineSpacingType = 'AtLeast';
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('AtLeast');
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(12);
    });
    it('undo after LinespacingType atleast apply validation', () => {
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(2);
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('Multiple');
    });
    it('redo after LinespacingType atleast apply validation', () => {
        editor.editorHistory.redo();
        expect(editor.selection.paragraphFormat.lineSpacingType).toBe('AtLeast');
        expect(editor.selection.paragraphFormat.lineSpacing).toBe(12);
    });
}); 