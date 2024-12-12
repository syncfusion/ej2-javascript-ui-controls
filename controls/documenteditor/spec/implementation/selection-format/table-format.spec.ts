import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { LayoutViewer, PageLayoutViewer, DocumentHelper, TextElementBox } from '../../../src/index';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/index';
import { TestHelper } from '../../test-helper.spec';

describe('Selection Table Format Validation', () => {
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });
    it('Simple document with page break',()=>{        
        editor.editor.insertTable(2,2);
        editor.selection.tableFormat.title = "Title";
        editor.selection.tableFormat.description = "Description";
        expect(editor.selection.tableFormat.title).toEqual("Title");
        expect(editor.selection.tableFormat.description).toEqual("Description");
    });   
});