import { DocumentEditor } from '../../../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, Search } from '../../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../../test-helper.spec';
import { Editor } from '../../../../src/index';
import { Selection } from '../../../../src/index';
describe('Search module testing', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, Search);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableSearch: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 1000);
    });

    it('find method testing with findoptions none value', (done) => {
        console.log('find method testing with findoptions none value');
        setTimeout(() => {
            editor.editor.insertText('The following example code illustrates how to use the replace All in the Document editor.')
            let result = editor.searchModule.find('the', 'None');
            expect(result).toBe(undefined);
            done();
        }, 10);
    });
    it('find method testing with findoptions none value and replace', (done) => {
        console.log('find method testing with findoptions none value and replace');
        setTimeout(() => {
            editor.editor.insertText('The following example code illustrates how to use the replace All in the Document editor.');
            let result = editor.search.findAll('the');
            editor.searchModule.searchResults.replaceAll('a');
            expect(result).toBe(undefined);
            done();
        }, 10);
    });
});



