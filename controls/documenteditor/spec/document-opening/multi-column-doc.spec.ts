import { Toolbar } from "../../src/document-editor-container/tool-bar/tool-bar"
import { createElement } from "@syncfusion/ej2-base";
import { TestHelper } from "../test-helper.spec";
import { DocumentEditor } from "../../src/document-editor/document-editor";
import { Editor } from "../../src/document-editor/implementation/editor/editor";
import { Selection } from '../../src/document-editor/implementation/selection/selection';
import { EditorHistory } from "../../src/document-editor/implementation/editor-history/editor-history";
import { SfdtExport } from "../../src/document-editor/implementation/writer/sfdt-export";
import { WordExport } from "../../src/document-editor/implementation/writer/word-export";
var text1: string = '{"sfdt":"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"}';

describe('Document Opening cases - Multi-column', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Selection, Editor, EditorHistory, SfdtExport, WordExport);
        container = new DocumentEditor({ isReadOnly: false, documentEditorSettings: { showHiddenMarks: true, showBookmarks: true } });
        container.enableAllModules();
        // container.documentEditorSettings.showHiddenMarks =true;
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
    it('Multi-column document opening', () => {
        console.log('Multi-column document');
        container.open(text1);
        var length = container.documentHelper.pages.length;
        for (let i = 0; i < length; i++) {
            container.exportAsPath(i + 1);
        }
        expect(container.documentHelper.pages.length).not.toBe(0);

    });
    it('Export as word - multi-column document', () => {
        console.log('Export as word - multi-column document');
        expect(() => { container.save('multi-column', 'Docx') }).not.toThrowError();

    });
    it('Export as SFDT - multi-column document', () => {
        console.log('Export as SFDT - multi-columndocument');
        expect(() => { container.save('multi-column', 'Sfdt') }).not.toThrowError();

    });
});

