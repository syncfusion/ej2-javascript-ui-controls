import { createElement } from "@syncfusion/ej2-base";
import { DocumentEditor } from "../../../src/document-editor/document-editor";
import { Editor } from "../../../src/document-editor/implementation/editor/editor";
import { Selection } from '../../../src/document-editor/implementation/selection/selection';
import { WCharacterFormat } from '../../../src/document-editor/implementation/format/character-format';
import { TestHelper } from "../../test-helper.spec";
describe('Text measuring logic validation', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        container.documentEditorSettings.enableOptimizedTextMeasuring = true;
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
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Initial font height validation', () => {
        const charFormat: WCharacterFormat = new WCharacterFormat(undefined);
        container.documentHelper.textHelper.getHeight(charFormat);
        const optimizedHeight: number = container.documentHelper.heightInfoCollection['calibri;11'].Height;
        expect(optimizedHeight).toBe(17.93);
     });
});