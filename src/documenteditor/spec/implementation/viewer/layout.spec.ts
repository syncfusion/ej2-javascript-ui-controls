import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, Page, HelperMethods } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

describe("Insert and delete table validation", () => {
    let editor: DocumentEditor = undefined;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true });
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
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 750);
    });
    it("Shift table validation", () => {
        editor.editor.onEnter();
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertText("Syncfusion");
        editor.selection.selectColumn();
        editor.editor.mergeCells();
        editor.selection.selectPosition(editor.documentStart, editor.documentStart);
        for (let i = 0; i < 60; i++) {
            editor.editor.onEnter();
        }
        expect(editor.pageCount).toBe(2);
    });

});