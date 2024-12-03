import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, DocumentHelper, SfdtExport } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Text Writer Validation
 */

describe('Text Writer Validation', () => {
    let editor: DocumentEditor;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableSelection: true, enableEditorHistory: true, enableTextExport: true });
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
    it('Empty Document Text Export', (done) => {
        console.log('Empty Document Text Export');
        editor.openBlank();
        editor.saveAsBlob('Txt').then((blob: Blob) => {            
            expect(blob.size).toEqual(2);
      });
      setTimeout(function () {
        done();
    }, 1000);
    });
});