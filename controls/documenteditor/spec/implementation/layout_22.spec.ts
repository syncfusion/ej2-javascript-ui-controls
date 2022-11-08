import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, LineWidget, ParagraphWidget, Selection, TextElementBox, Page } from '../../src/index';
import { TestHelper } from '../test-helper.spec';

describe('Document have blank pages when opening in MS Word', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
       let ele: HTMLElement = createElement('div', { id: 'container' });
       document.body.appendChild(ele);
       DocumentEditor.Inject(Selection, Editor)
       editor = new DocumentEditor({ isReadOnly: false, enableEditor: true });
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
       document.body.innerHTML = '';
       setTimeout(function () {
          done();
       }, 1000);
    });
    it('Document have blank pages when opening in MS Word',()=>{
       console.log("Document have blank pages when opening in MS Word");
       editor.open(JSON.stringify(CustDocument));
       let TextElementBox : TextElementBox = (((editor.documentHelper.pages[1] as Page).bodyWidgets[0].childWidgets[1] as ParagraphWidget).childWidgets[0]as LineWidget).children[0] as TextElementBox ;
       expect(TextElementBox.text).toBe("\f");
    });
 });