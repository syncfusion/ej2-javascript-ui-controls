import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TablePropertiesDialog } from '../../../src/document-editor/implementation/dialogs/table-properties-dialog';
import { TestHelper } from '../../test-helper.spec';
import { Editor } from '../../../src/index';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * table alignment
 */
describe('Table vertical alignment - center validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
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
        }, 2000);
    });
    it('in 3*4 table cell table vertical alignment validation', () => {
console.log('in 3*4 table cell table vertical alignment validation');
        editor.editor.insertTable(2, 2);
        editor.selection.tableFormat.leftIndent = 10.8;
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).center.click();
        tablePropertiesDialog.applyTableProperties();
        expect(editor.selection.tableFormat.tableAlignment).toBe('Center');
        expect(editor.selection.tableFormat.leftIndent).toBe(0);
    });

    it('in 3*4 table and last column resized with minimum width', () => {
console.log('in 3*4 table and last column resized with minimum width');
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.cellFormat.preferredWidth = 0;
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).preferredCellWidthCheckBox.checked = false;
        (tablePropertiesDialog as any).preferredCellWidth.value = 0;
        (tablePropertiesDialog as any).preferCheckBox.checked = false;
        (tablePropertiesDialog as any).rowHeightCheckBox.checked = false;
        (tablePropertiesDialog as any).rowHeight.value = 0;
        tablePropertiesDialog.applyTableProperties();
        expect(editor.selection.tableFormat.preferredWidth).toBe(0);
    });
});

describe('Table direction- right to left and left to right validation', () => {
    let editor: DocumentEditor;
    let dialog: TablePropertiesDialog;
    let event: any;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.tablePropertiesDialogModule
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Table for bidi is false and left indent is 0', () => {
console.log('Table for bidi is false and left indent is 0');
        editor.editor.insertTable(2, 2);
        editor.tablePropertiesDialogModule.show();
        event = { value: "rtl" };
        (dialog as any).changeBidirectional(event);
        dialog.applyTableProperties();
        expect(editor.selection.tableFormat.bidi).toBe(true);
    });
    it('undo after applt rtl via dialog',()=>{
console.log('undo after applt rtl via dialog');
        editor.editorHistory.undo();
        expect(editor.selection.tableFormat.bidi).toBe(false);
    });
    it('redo after applt rtl via dialog',()=>{
console.log('redo after applt rtl via dialog');
        editor.editorHistory.redo();
        expect(editor.selection.tableFormat.bidi).toBe(true);
    });
    it('apply left to right for RTl table',()=>{
console.log('apply left to right for RTl table');
        editor.tablePropertiesDialogModule.show();
        event = { value: "ltr" };
        (dialog as any).changeBidirectional(event);
        dialog.applyTableProperties();
        expect(editor.selection.tableFormat.bidi).toBe(false);
    });
    it('undo after apply ltr via dialog',()=>{
console.log('undo after apply ltr via dialog');
        editor.editorHistory.undo();
        expect(editor.selection.tableFormat.bidi).toBe(true);
    });
    it('redo after apply ltr via dialog',()=>{
console.log('redo after apply ltr via dialog');
        editor.editorHistory.redo();
        expect(editor.selection.tableFormat.bidi).toBe(false);
    });
});
describe('Rtl table change table alignment validation', () => {
    let editor: DocumentEditor;
    let dialog: TablePropertiesDialog;
    let event: any;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.tablePropertiesDialogModule
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Table for bidi is true and table alignment as left', () => {
console.log('Table for bidi is true and table alignment as left');
        editor.editor.insertTable(2, 2);
        editor.selection.tableFormat.bidi=true;        
        editor.tablePropertiesDialogModule.show();
        // let event: any = {
        //     target: createElement('div', { className: 'e-de-table-properties-alignment e-de-table-left-alignment' }),
        //     preventDefault: function () { },
        //     ctrlKey: false, shiftKey: false, which: 0
        // };
        // dialog.changeTableAlignment(event);
        (dialog as any).left.click();
        dialog.applyTableProperties();
        expect(editor.selection.tableFormat.tableAlignment).toBe('Right');
    });
    it('undo after applt rtl via dialog',()=>{
console.log('undo after applt rtl via dialog');
        editor.editorHistory.undo();
        expect(editor.selection.tableFormat.tableAlignment).toBe('Left');
    });
    it('redo after applt rtl via dialog',()=>{
console.log('redo after applt rtl via dialog');
        editor.editorHistory.redo();
        expect(editor.selection.tableFormat.tableAlignment).toBe('Right');
    });  
});
describe('Change RTl options with table indent', () => {
    let editor: DocumentEditor;
    let dialog: TablePropertiesDialog;
    let event: any;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.tablePropertiesDialogModule
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Table for bidi is true and table alignment as left', () => {
console.log('Table for bidi is true and table alignment as left');
        editor.editor.insertTable(2, 2);
        editor.selection.tableFormat.preferredWidthType='Point';
        editor.selection.tableFormat.preferredWidth=100;
        editor.selection.tableFormat.leftIndent=36;    
        editor.tablePropertiesDialogModule.show();
        event = { value: "rtl" };
        (dialog as any).changeBidirectional(event);
        dialog.applyTableProperties();
        expect(editor.selection.tableFormat.bidi).toBe(true);
        expect(editor.selection.tableFormat.leftIndent).toBe(0);
    });
    it('undo after applt rtl via dialog',()=>{
console.log('undo after applt rtl via dialog');
        editor.editorHistory.undo();
        expect(editor.selection.tableFormat.leftIndent).toBe(36);
    });
    it('redo after applt rtl via dialog',()=>{
console.log('redo after applt rtl via dialog');
        editor.editorHistory.redo();
        expect(editor.selection.tableFormat.leftIndent).toBe(0);
    });  
});
