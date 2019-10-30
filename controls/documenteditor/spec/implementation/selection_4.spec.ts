import { DocumentEditor } from '../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, TablePropertiesDialog } from '../../src/index';

import { TestHelper } from '../test-helper.spec';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';

describe('enable repeat row header test', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('enable repeat row header scenario 1', () => {
        editor.editor.insertTable(2, 2);
        expect(editor.tablePropertiesDialogModule.enableRepeatHeader()).toBe(true);
    });
    it('enable repeat row header scenario 2', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.moveDown();
        expect(editor.tablePropertiesDialogModule.enableRepeatHeader()).toBe(false);
    });
    it('enable repeat row header scenario 3', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.moveDown();
        editor.editor.insertTable(2, 2);
        expect(editor.tablePropertiesDialogModule.enableRepeatHeader()).toBe(true);
    });
    it('enable repeat row header scenario 4', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.moveDown();
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        expect(editor.tablePropertiesDialogModule.enableRepeatHeader()).toBe(false);
    });
});