import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TextPosition, SfdtExport } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';

describe('Page Break Character Document Copy Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection);
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });

    it('Test Page Break Character Document Html Export', () => {
        let object: any = {};
        expect(editor.selection.htmlWriter.serializeSpan('\f', object)).toBe('<br style = "page-break-after:always;"/>');
    });
});
describe('Merge Field Validation', () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableLocalPaste: false, isReadOnly: false, enableSfdtExport: true });
        DocumentEditor.Inject(Editor, Selection, SfdtExport);
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        setTimeout(function () {
            done();
        }, 500);
    });

    it('Test Merge Field Copy', () => {
        editor.editor.insertField('MERGEFIELD ' + 'Field' + ' \\* MERGEFORMAT');
        editor.selection.selectAll();
        let startPosition: TextPosition = editor.selection.start;
        let endPosition: TextPosition = editor.selection.end;
        let documentContent: any = editor.sfdtExportModule.write(startPosition.currentWidget, startPosition.offset, endPosition.currentWidget, endPosition.offset, true);
        editor.editorModule.copiedData = JSON.stringify(documentContent);
        let html: string = editor.selection.htmlWriter.writeHtml(documentContent);
        expect(html.indexOf('<a')).toBe(-1);
    });
});