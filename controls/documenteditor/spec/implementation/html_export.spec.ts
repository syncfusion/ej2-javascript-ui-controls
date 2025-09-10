import { createElement } from "@syncfusion/ej2-base";
import { TestHelper } from "../test-helper.spec";
import { DocumentEditor } from "../../src/document-editor/document-editor";
var text: string = '{"sfdt":"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"}';
describe('Copying the list content and exporting as html', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        container = new DocumentEditor({ isReadOnly: false, documentEditorSettings: { showHiddenMarks: true, showBookmarks: true } });
        container.enableAllModules();
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
        
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Copying the html list content', () => {
        console.log('Copying the html list content');
        container.open(text);
        container.selection.selectAll();
        container.selection.copy();
        expect(container.selection.getHtmlContent()).toEqual('<ul type="disc"><li style="font-weight:normal;font-style:normal;color:#000000;font-size:12pt;font-family:Aptos;letter-spacing:0pt;transform:scaleX(1);font-weight:normal;font-style:normal;color:#000000;font-size:12pt;font-family:Aptos;letter-spacing:0pt;transform:scaleX(1);text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:8pt; margin-left:0pt; line-height:115.83333015441895%;;white-space:pre"><span style="font-weight:normal;font-style:normal;">a</span></li></ul><ol type="1" start="1"><li style="font-weight:normal;font-style:normal;color:#000000;font-size:12pt;font-family:Aptos;letter-spacing:0pt;transform:scaleX(1);font-weight:normal;font-style:normal;color:#000000;font-size:12pt;font-family:Aptos;letter-spacing:0pt;transform:scaleX(1);text-align:left;margin-top:0pt; margin-right:0pt; margin-bottom:8pt; margin-left:0pt; line-height:115.83333015441895%;;white-space:pre"><span style="font-weight:normal;font-style:normal;">b</span></li></ol>');
    });
});