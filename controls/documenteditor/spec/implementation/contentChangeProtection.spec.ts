import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { BaseHistoryInfo, BookmarkElementBox, Editor, FieldElementBox, FootnoteElementBox, FootnoteEndnoteMarkerElementBox, Toolbar } from '../../src/index';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { LineWidget, BodyWidget, ParagraphWidget, TextElementBox } from '../../src/index';
import { SfdtExport } from '../../src/document-editor/implementation/writer/sfdt-export';
/**
 * bookmark to hyperLink conversion
 */
let sfdtContent: any ='{"sfdt":"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"}';
describe('Content Change event for protection', () => {
    let editor: DocumentEditor = undefined;
    let event: any;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory, SfdtExport); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.enableLocalPaste = true;
    });
    afterAll((done): void => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            document.body.innerHTML = '';
            done();
        }, 1000);
    });
    it('ContnetChange Event for protection', () => {
        editor.open(sfdtContent);
        editor.documentHelper.owner.editor.addProtection("123",undefined,undefined);
        editor.documentHelper.owner.editor.stopProtection("123");
    });
   
});