import { DocumentEditor } from '../../../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import {
    TablePropertiesDialog, TableOptionsDialog, CellOptionsDialog
} from '../../../../../src/document-editor/implementation/dialogs/index';
import { TestHelper } from '../../../../test-helper.spec';
import { Editor } from '../../../../../src/index';
import { TextPosition } from '../../../../../src/index';
import { Selection } from '../../../../../src/index';
import { EditorHistory } from '../../../../../src/document-editor/implementation/editor-history/editor-history';
import { TableCellWidget } from '../../../../../src/index';

/**
 * Used to get the start and end text positions
 */
function getTextPosition(editor: DocumentEditor, hierarchicalIndex: string): TextPosition {
    let textPosition: TextPosition = new TextPosition(editor);
    textPosition.setPositionForCurrentIndex(hierarchicalIndex);
    return textPosition;
}

/**
 * Table Cell Margin dialog Spec
 */
describe('Table Options Dialog Apply cell margins validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, TablePropertiesDialog, TableOptionsDialog);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableTableOptionsDialog: true, enableTablePropertiesDialog: true });
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
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('set cell format values testing', () => {
console.log('set cell format values testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let tableOptions: TableOptionsDialog = editor.tableOptionsDialogModule;
        tableOptions.show();
        (tableOptions as any).cellSpaceTextBox.value = 10;
        (tableOptions as any).bottomMarginBox.value = 6;
        (tableOptions as any).topMarginBox.value = 6;
        (tableOptions as any).rightMarginBox.value = 8;
        (tableOptions as any).leftMarginBox.value = 8;
        (tableOptions as any).allowSpaceCheckBox.checked = true;
        expect(tableOptions.topMarginBox.value).toBe(6);
        tableOptions.applyTableCellProperties();
        editor.editorHistory.undo();
        editor.editorHistory.redo();
        
    });
    it('apply table options testing', () => {
console.log('apply table options testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        editor.selection.tableFormat.table.tableFormat.cellSpacing = 10;
        let tableOptions: TableOptionsDialog = editor.tableOptionsDialogModule;
        tableOptions.show();
        (tableOptions as any).allowSpaceCheckBox.checked = false;
        tableOptions.applyTableOptions(editor.selection.tableFormat.table.tableFormat);
        expect((tableOptions as any).allowSpaceCheckBox.checked).toBe(false);
    });
});

describe('Cell Options Dialog validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, CellOptionsDialog);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, enableTablePropertiesDialog: true, isReadOnly: false });
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
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Change same as table testing', () => {
console.log('Change same as table testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let cellOptions: CellOptionsDialog = editor.cellOptionsDialogModule;
        cellOptions.show();
       expect((cellOptions as any).sameAsTableCheckBox.checked).toBe(true);
        cellOptions.changeSameAsTable();
       // expect(cellOption).toBe(true);
    });
});

describe('Cell Options Dialog Initial loading validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, CellOptionsDialog);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableTablePropertiesDialog: true, enableSelection: true, isReadOnly: false });
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
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Remove events', () => {
console.log('Remove events');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let cellOptions: CellOptionsDialog = editor.cellOptionsDialogModule;
        cellOptions.show();
       cellOptions.removeEvents();
        expect(editor.documentHelper.updateFocus.length).toBe(0);
        cellOptions.closeCellMarginsDialog();
    });
});

describe('Cell Options Dialog apply properties loading validation', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, CellOptionsDialog);
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
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Change same as table testing', () => {
console.log('Change same as table testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let cellOptions: CellOptionsDialog = editor.cellOptionsDialogModule;
        cellOptions.show();
        cellOptions.topMarginBox.value = 10;
        cellOptions.rightMarginBox.value = undefined;
        cellOptions.bottomMarginBox.value = undefined;
        cellOptions.leftMarginBox.value = undefined;
        (cellOptions as any).sameAsTableCheckBox.checked = true;
        cellOptions.applyTableCellProperties();
        expect(cellOptions.topMarginBox.value).toBe(10);
    });
});


describe('Cell Options Dialog Without Selection Testing', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, CellOptionsDialog, TablePropertiesDialog);
        editor = new DocumentEditor({
            enableSelection: true, enableEditor: true,
            isReadOnly: false, enableTablePropertiesDialog: true, enableTableOptionsDialog: true
        });
        editor.enableEditorHistory = true;
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
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply Cell Format For Single Cell with undo redo', () => {
console.log('Apply Cell Format For Single Cell with undo redo');
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        let cellOptions: CellOptionsDialog = editor.cellOptionsDialogModule;
        tablePropertiesDialog.isCellOptionsUpdated = true;
        cellOptions.cellFormat.topMargin = 10;
        cellOptions.cellFormat.bottomMargin = 10;
        tablePropertiesDialog.applyTableSubProperties();
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.topMargin).toBe(10);
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.bottomMargin).toBe(10);
    });
    it('Apply Cell Format For Single Cell with undo redo', () => {
console.log('Apply Cell Format For Single Cell with undo redo');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.topMargin).toBe(0);
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.bottomMargin).toBe(0);
    });
    it('Apply Cell Format For Single Cell with undo redo', () => {
console.log('Apply Cell Format For Single Cell with undo redo');
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.topMargin).toBe(10);
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.bottomMargin).toBe(10);
    });
    it('Apply Cell Format Selection with undo redo', () => {
console.log('Apply Cell Format Selection with undo redo');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let start: TextPosition = getTextPosition(editor, "0;0;0;0;0;0;0;0");
        let end: TextPosition = getTextPosition(editor, "0;0;0;1;1;0;0;1");
        editor.selection.selectRange(start, end);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        let cellOptions: CellOptionsDialog = editor.cellOptionsDialogModule;
        tablePropertiesDialog.isCellOptionsUpdated = true;
        cellOptions.cellFormat.topMargin = 10;
        cellOptions.cellFormat.bottomMargin = 10;
        tablePropertiesDialog.applyTableSubProperties();
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.topMargin).toBe(10);
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.bottomMargin).toBe(10);
    });
    it('Apply Cell Format Selection with undo redo', () => {
console.log('Apply Cell Format Selection with undo redo');
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.topMargin).toBe(0);
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.bottomMargin).toBe(0);
    });
    it('Apply Cell Format Selection with undo redo', () => {
console.log('Apply Cell Format Selection with undo redo');
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.topMargin).toBe(10);
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.bottomMargin).toBe(10);
    });
});


describe('Table Options Dialog Without Selection Testing', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, TableOptionsDialog, TablePropertiesDialog);
        editor = new DocumentEditor({
            enableSelection: true, enableEditor: true,
            enableTablePropertiesDialog: true, enableTableOptionsDialog: true, isReadOnly: false
        });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Apply Table Format With undefined values', () => {
console.log('Apply Table Format With undefined values');
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        let tableOptions: TableOptionsDialog = editor.tableOptionsDialogModule;
        tablePropertiesDialog.show();
        tableOptions.show();
        tableOptions.leftMarginBox.value = undefined;
        tableOptions.rightMarginBox.value = undefined;
        tableOptions.topMarginBox.value = undefined;
        tableOptions.rightMarginBox.value = undefined;
        tableOptions.applyTableCellProperties();
        expect(tablePropertiesDialog.isCellOptionsUpdated).toBe(false);
    });
    it('Load Table Format With cell spacing greater than zero', () => {
console.log('Load Table Format With cell spacing greater than zero');
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        let tableOptions: TableOptionsDialog = editor.tableOptionsDialogModule;
        tablePropertiesDialog.show();
        tableOptions.show();
        editor.selection.tableFormat.cellSpacing = 10;
        tableOptions.loadCellMarginsDialog();
        expect(editor.selection.tableFormat.cellSpacing).toBe(10);
    });
});

describe('Cell Options Dialog With undefined values', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory, CellOptionsDialog, TablePropertiesDialog);
        editor = new DocumentEditor({
            isReadOnly: false, enableSelection: true, enableEditor: true,
            enableTablePropertiesDialog: true, enableTableOptionsDialog: true
        });
        editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Load Table Format With cell spacing greater than zero', () => {
console.log('Load Table Format With cell spacing greater than zero');
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        let cellOptions: CellOptionsDialog = editor.cellOptionsDialogModule;
        tablePropertiesDialog.show();
        cellOptions.show();
        editor.selection.cellFormat.bottomMargin = 10;
        cellOptions.loadCellMarginsDialog();
        expect(editor.selection.cellFormat.bottomMargin).toBe(10);
    });
});
