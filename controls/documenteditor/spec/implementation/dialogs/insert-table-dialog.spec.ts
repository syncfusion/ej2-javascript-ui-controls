import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { TableDialog } from '../../../src/document-editor/implementation/dialogs/table-dialog';
import { Editor } from '../../../src/index';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { Selection } from '../../../src/index';
/**
 * Table dialog spec
 */
describe('Insert Table Dialog Test Case Validation', () => {
    let editor: DocumentEditor;
    let dialog: TableDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TableDialog);
        DocumentEditor.Inject(EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false, enableTableDialog: true });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        dialog.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('On Insert Button testing', () => {
console.log('On Insert Button testing');
        dialog = new TableDialog(editor.documentHelper);
        dialog.show();
        dialog.onInsertTableClick();
        dialog.destroy();
    });
    it('On Cancel Button testing', () => {
console.log('On Cancel Button testing');
        dialog = new TableDialog(editor.documentHelper);
        dialog.show();
        dialog.onCancelButtonClick();
        dialog.destroy();
    });
    it('Insert Table using event testing', () => {
console.log('Insert Table using event testing');
        dialog = new TableDialog(editor.documentHelper);
        dialog.show();
        let event: any;
        event = { keyCode: 13, preventDefault: () => { }, ctrlKey: false, shiftKey: false, which: 0 };
        editor.editor.deleteTable();
        dialog.keyUpInsertTable(event);
        dialog.onCancelButtonClick();
        dialog.show();
        dialog.destroy();
    });
});

describe('Insert Table Dialog Test Case Validation', () => {
    let editor: DocumentEditor;
    let dialog: TableDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('Insert Table Value Null Condition testing', () => {
console.log('Insert Table Value Null Condition testing');
        dialog = new TableDialog(editor.documentHelper);
        dialog.show();
        let event: any;
        event = { keyCode: 13, preventDefault: () => { }, ctrlKey: false, shiftKey: false, which: 0 };
        (dialog as any).rowsCountBox.value = '';
        (dialog as any).columnsCountBox.value = '';
        dialog.keyUpInsertTable(event);
        dialog.destroy();
    });
    it('Insert Table Destory Parent Element testing', () => {
console.log('Insert Table Destory Parent Element testing');
        dialog = new TableDialog(editor.documentHelper);
        dialog.show();
        (dialog as any).columnsCountBox = document.createElement('div');
        (dialog as any).rowsCountBox = document.createElement('div');
        dialog.destroy();
    });
    it('Insert Table Parent Destroy Element testing', () => {
console.log('Insert Table Parent Destroy Element testing');
        dialog = new TableDialog(editor.documentHelper);
        dialog.show();
        (dialog as any).target = document.createElement('div');
        document.body.appendChild((dialog as any).target);
        dialog.destroy();
    });
});

describe('Insert Table Key and Destroy Test Case Validation', () => {
    let editor: DocumentEditor;
    let dialog: TableDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(() => {
            done();
        }, 2000);
    });
    it('Insert Table Diff Event Key Condition testing', () => {
console.log('Insert Table Diff Event Key Condition testing');
        dialog = new TableDialog(editor.documentHelper);
        dialog.show();
        let event: any;
        event = { keyCode: 35, preventDefault: () => { }, ctrlKey: false, shiftKey: false, which: 0 };
        dialog.keyUpInsertTable(event);
        dialog.onInsertTableClick();
        dialog.destroy();
    });
    it('Insert Table Destory testing', () => {
console.log('Insert Table Destory testing');
        dialog = new TableDialog(editor.documentHelper);
        dialog.show();
        dialog.destroy();
    });
    it('Insert Table Destory testing', () => {
console.log('Insert Table Destory testing');
        dialog = new TableDialog(editor.documentHelper);
        (dialog as any).target = undefined;
        dialog.show();
        dialog.destroy();
    });
});
