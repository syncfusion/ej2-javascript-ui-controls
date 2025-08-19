import { createElement, select } from '@syncfusion/ej2-base';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { Editor } from '../../src/document-editor/implementation/editor/editor';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { DocumentHelper } from '../../src/index';
import { Selection, SfdtExport } from '../../src/index';
import { TestHelper } from '../test-helper.spec';


describe('Select revision case testing', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    
    beforeEach(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, SfdtExport);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true, enableSfdtExport: true});
        editor.enableLocalPaste = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterEach((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Selecting the particular revision', ()=> {
        let doc ='{"sfdt":"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"}';
        editor.open(doc);
        editor.documentHelper.showRevisions(true);
        editor.revisions.revisions[3].select();
        expect(editor.selection.text).toMatch('net');
        editor.revisions.revisions[12].select();
        expect(editor.selection.isTableSelected()).toBe(false);
        editor.revisions.revisions[5].select();
        expect(editor.selection.hasRevisions()).toBe(true);
        editor.revisions.revisions[16].select();
        expect(editor.selection.text).toMatch('have to');
        editor.revisions.revisions[10].select();
        expect(editor.selection.text).toMatch('C');
    });
});