import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../src/index';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/index';
import { TestHelper } from '../test-helper.spec';

describe('Selection Paragraph format auto space validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:100%;height:500px' });
        
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
        editor.editor.insertText('Hello world');
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
    it('Paragraph format space before auto apply validation',()=>{
        console.log('Paragraph format space before auto  apply validation');
        editor.selection.selectAll();
        editor.selection.paragraphFormat.spaceBeforeAuto=true;
        expect(editor.selection.paragraphFormat.spaceBeforeAuto).toBe(true);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.spaceBeforeAuto).toBe(false);
    });
    it('Paragraph format space after auto apply validation',()=>{
        console.log('Paragraph format space after auto  apply validation');
        editor.selection.selectAll();
        editor.selection.paragraphFormat.spaceAfterAuto=true;
        expect(editor.selection.paragraphFormat.spaceAfterAuto).toBe(true);
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.spaceAfterAuto).toBe(false);
    });
    it('both space after and before apply validation',()=>{
        console.log('both space after and before apply validation');
        editor.selection.selectAll();
        expect(editor.selection.paragraphFormat.spaceBeforeAuto).toBe(false);
        expect(editor.selection.paragraphFormat.spaceAfterAuto).toBe(false);
        editor.selection.paragraphFormat.spaceBeforeAuto=true;
        editor.selection.paragraphFormat.spaceAfterAuto=true;
        expect(editor.selection.paragraphFormat.spaceBeforeAuto).toBe(true) 
        expect(editor.selection.paragraphFormat.spaceAfterAuto).toBe(true);
        editor.editorHistory.undo();
        editor.editorHistory.undo();
        expect(editor.selection.paragraphFormat.spaceBeforeAuto).toBe(false);
        expect(editor.selection.paragraphFormat.spaceAfterAuto).toBe(false);
    });
    it('select multiple paragraph and apply space before auto validation',()=>{
        console.log('inserting multiple paragraph and apply auto space validation');
        editor.editor.onEnter();
        editor.editor.insertText('Sample');
        editor.selection.selectParagraph();
        editor.selection.paragraphFormat.spaceBeforeAuto=true;
        expect(editor.selection.paragraphFormat.spaceBeforeAuto).toBe(true);
        editor.selection.moveUp();
        editor.selection.selectParagraph();
        expect(editor.selection.paragraphFormat.spaceBeforeAuto).toBe(false);
        editor.selection.selectAll();
        expect(editor.selection.paragraphFormat.spaceBeforeAuto).toBe(undefined);
        editor.editorHistory.undo();
    });
    it('select multiple paragraph and apply space after auto validation',()=>{
        console.log('inserting multiple paragraph and apply auto space validation');
        editor.selection.selectParagraph();
        editor.selection.paragraphFormat.spaceAfterAuto=false;
        expect(editor.selection.paragraphFormat.spaceAfterAuto).toBe(false);
        editor.selection.moveUp();
        editor.selection.selectParagraph();
        expect(editor.selection.paragraphFormat.spaceAfterAuto).toBe(false);
        editor.selection.paragraphFormat.spaceAfterAuto=true;
        editor.selection.selectAll();
        expect(editor.selection.paragraphFormat.spaceAfterAuto).toBe(undefined);
    });
});