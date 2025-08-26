import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement, isNullOrUndefined } from '@syncfusion/ej2-base';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';
import { ColumnsDialog } from '../../../src/document-editor/implementation/dialogs/columns-dialog';
import { ChangeEventArgs as NumericChangeEventArgs } from '@syncfusion/ej2-inputs';
/**
 * Layout dialog spec
 */
describe('Column Dialog Test Case Validation - 1', function () {
    let editor: DocumentEditor;
    let dialog: ColumnsDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ColumnsDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        editor.enableColumnsDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.columnsDialogModule;
        dialog.show()
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('On open Button testing', function () {
        console.log('On Open Button testing');
        dialog.openColumnsDialog();
    });
    it('On OK Button testing', function () {
        console.log('On OK Button testing');
        dialog.applyColumnDialog();
    });
    it('On Cancel Button testing', function () {
        console.log('On Cancel Button testing');
        dialog.closeDialog();
    });
});
describe('Column Dialog Test Case Validation - 2', function () {
    let editor: DocumentEditor;
    let dialog: ColumnsDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ColumnsDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        editor.enableColumnsDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.columnsDialogModule;
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Column Dialog Test Case Validation - 2', function () {
        console.log('Column Dialog Test Case Validation - 2');
        (dialog as any).numberOfColumns = 3;
        (dialog as any).equalCheckbox.checked = true;
        (dialog as any).lineCheckbox.checked = false;
        let event: any = {};
        event.previousValue = 1;
        event.value = 3;
        (dialog as any).createTextBox(event as NumericChangeEventArgs);
        (dialog as any).applyColumnDialog();
        expect(editor.selection.sectionFormat.numberOfColumns).toBe(3);
    });
});
describe('Undo validation after applied column value', function () {
    let editor: DocumentEditor;
    let dialog: ColumnsDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ColumnsDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        editor.enableColumnsDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.columnsDialogModule;
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Undo validation after applied column value', function () {
        console.log('Undo validation after applied column value');
        (dialog as any).numberOfColumns = 3;
        (dialog as any).equalCheckbox.checked = true;
        (dialog as any).lineCheckbox.checked = false;
        let event: any = {};
        event.previousValue = 1;
        event.value = 3;
        (dialog as any).createTextBox(event as NumericChangeEventArgs);
        (dialog as any).applyColumnDialog();
        expect(editor.selection.sectionFormat.numberOfColumns).toBe(3);
        editor.editorHistory.undo();
        expect(editor.selection.sectionFormat.numberOfColumns).toBe(1);
    });
});
describe('Column Dialog Test Case Validation - 3', function () {
    let editor: DocumentEditor;
    let dialog: ColumnsDialog;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(ColumnsDialog, Selection, Editor, EditorHistory);
        editor = new DocumentEditor({ enableEditorHistory: true, enableEditor: true, enableSelection: true, isReadOnly: false });
        editor.enableEditorHistory = true;
        editor.enableColumnsDialog = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.columnsDialogModule;
        dialog.show();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        dialog = undefined;
        document.body.removeChild(document.getElementById('container'));
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Left presets Column Dialog Test Case Validation', function (done: DoneFn) {
        console.log('Left presets Column Dialog Test Case Validation');
        editor.openBlank();
        dialog.openColumnsDialog();
        (dialog as any).lineCheckbox.checked = false;
        (dialog as any).leftDiv.click();
        (dialog as any).applyColumnDialog();
        setTimeout(() => {
            if(!isNullOrUndefined(editor) && !isNullOrUndefined(editor.selection)) { 
                expect(editor.selection.sectionFormat.numberOfColumns).toBe(2);
            }
            // expect(editor.selection.sectionFormat.columns[0].width).toBe(132);
            // expect(editor.selection.sectionFormat.columns[1].width).toBe(300);
        }, 50);
        done();
    }, 10);
    it('Right presets Column Dialog Test Case Validation', function (done: DoneFn) {
        console.log('Right presets Column Dialog Test Case Validation');
        editor.openBlank();
        dialog.openColumnsDialog();
        (dialog as any).lineCheckbox.checked = false;
        (dialog as any).rightDiv.click();
        (dialog as any).applyColumnDialog();
        setTimeout(() => {
            if(!isNullOrUndefined(editor) && !isNullOrUndefined(editor.selection)) { 
                expect(editor.selection.sectionFormat.numberOfColumns).toBe(2);
            }
            // expect(editor.selection.sectionFormat.columns[0].width).toBe(300);
            // expect(editor.selection.sectionFormat.columns[1].width).toBe(132);
        }, 50);
        done();
    }, 10);
    it('Two presets Column Dialog Test Case Validation', function (done: DoneFn) {
        console.log('Two presets Column Dialog Test Case Validation');
        editor.openBlank();
        dialog.openColumnsDialog();
        (dialog as any).lineCheckbox.checked = false;
        (dialog as any).twoDiv.click();
        (dialog as any).applyColumnDialog();
        setTimeout(() => {
            if(!isNullOrUndefined(editor) && !isNullOrUndefined(editor.selection)) {
                expect(editor.selection.sectionFormat.numberOfColumns).toBe(2);
                expect(editor.selection.sectionFormat.columns[0].width).toBe(216);
                expect(editor.selection.sectionFormat.columns[1].width).toBe(216);
            }
        }, 50);
        done();
    }, 10);
});