import { DocumentEditor } from '../../../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TablePropertiesDialog } from '../../../../../src/document-editor/implementation/dialogs/table-properties-dialog';
import { TestHelper } from '../../../../test-helper.spec';
import { Editor } from '../../../../../src/index';
import { ContextMenu } from '../../../../../src/document-editor/implementation/context-menu';
import { Selection } from '../../../../../src/index';
import { EditorHistory } from '../../../../../src/document-editor/implementation/editor-history/editor-history';
import {
    CellOptionsDialog, TableOptionsDialog, BordersAndShadingDialog
} from '../../../../../src/document-editor/implementation/dialogs/index';
import { WTableFormat } from '../../../../../src/document-editor/implementation/format/index';
import { TableWidget, TableRowWidget, TableCellWidget, BodyWidget, ParagraphWidget } from '../../../../../src/index';
import { WSectionFormat } from '../../../../../src/document-editor/implementation/format/index';
/**
 * Table Properties dialog spec
 */
describe('Table dialog validation', () => {
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
        
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Dialog with bold and italic property apply testing', () => {
console.log('Dialog with bold and italic property apply testing');
        editor.editor.insertTable(3, 3);
        editor.tablePropertiesDialogModule.show();
        expect(editor.documentHelper.dialog2.visible).toBe(true);
    });
});

describe('Show internal Dialogs validation', () => {
    let editor: DocumentEditor;
    let menu: ContextMenu;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, ContextMenu, TableOptionsDialog, EditorHistory, CellOptionsDialog, BordersAndShadingDialog);
        editor = new DocumentEditor({
            enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false,
            enableContextMenu: true, enableTableOptionsDialog: true,
            enableBordersAndShadingDialog: true, enableTablePropertiesDialog: true
        });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        menu = editor.contextMenuModule;
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Show Borders and shadings Dialog testing', () => {
console.log('Show Borders and shadings Dialog testing');
        editor.editor.insertTable(3, 3);
        editor.tablePropertiesDialogModule.showBordersShadingsPropertiesDialog();
        expect(editor.documentHelper.dialog.visible).toBe(true);
    });
    it('Show Cell Options Dialog testing', () => {
console.log('Show Cell Options Dialog testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        editor.tablePropertiesDialogModule.showCellOptionsDialog();
        expect(editor.documentHelper.dialog.visible).toBe(true);
    });
    it('Show Table Options Dialog testing', () => {
console.log('Show Table Options Dialog testing');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        editor.tablePropertiesDialogModule.showTableOptionsDialog();
        expect(editor.documentHelper.dialog.visible).toBe(true);
    });
    it('handle context menu items', () => {
console.log('handle context menu items');
        editor.editor.insertTable(3, 3);
        expect(() => { menu.handleContextMenuItem('container_contextmenu_table'); }).not.toThrowError();
    });
});

describe('Table Check box Validation Testing', () => {
    let editor: DocumentEditor;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, EditorHistory);
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
        }, 750);
    });
    it('Table checkbox checked validation', () => {
console.log('Table checkbox checked validation');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).preferCheckBox.checked = true;
        tablePropertiesDialog.changeTableCheckBox();
        expect((tablePropertiesDialog as any).tableWidthBox.enabled).toBe(true);
        expect((tablePropertiesDialog as any).tableWidthType.enabled).toBe(true);
    });
    it('Table checkbox uchecked validation', () => {
console.log('Table checkbox uchecked validation');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).preferCheckBox.checked = false;
        tablePropertiesDialog.changeTableCheckBox();
        expect((tablePropertiesDialog as any).tableWidthBox.enabled).toBe(false);
        expect((tablePropertiesDialog as any).tableWidthType.enabled).toBe(false);
    });
});

describe('Row Check box Validation Testing', () => {
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
        
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Row checkbox checked validation', () => {
console.log('Row checkbox checked validation');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).rowHeightCheckBox.checked = true;
        tablePropertiesDialog.changeTableRowCheckBox();
        expect((tablePropertiesDialog as any).rowHeightType.enabled).toBe(true);
        expect((tablePropertiesDialog as any).rowHeightBox.enabled).toBe(true);
    });
    it('Row checkbox unchecked validation', () => {
console.log('Row checkbox unchecked validation');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).rowHeightCheckBox.checked = false;
        tablePropertiesDialog.changeTableRowCheckBox();
        expect((tablePropertiesDialog as any).rowHeightType.enabled).toBe(false);
        expect((tablePropertiesDialog as any).rowHeightBox.enabled).toBe(false);
    });
});

describe('Cell Check box Validation Testing', () => {
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
        
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Cell checkbox checked validation', () => {
console.log('Cell checkbox checked validation');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).preferredCellWidthCheckBox.checked = true;
        tablePropertiesDialog.changeTableCellCheckBox();
        expect((tablePropertiesDialog as any).cellWidthType.enabled).toBe(true);
        expect((tablePropertiesDialog as any).cellWidthBox.enabled).toBe(true);
    });
    it('Cell checkbox unchecked validation', () => {
console.log('Cell checkbox unchecked validation');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).preferredCellWidthCheckBox.checked = false;
        tablePropertiesDialog.changeTableCellCheckBox();
        expect((tablePropertiesDialog as any).cellWidthType.enabled).toBe(false);
        expect((tablePropertiesDialog as any).cellWidthBox.enabled).toBe(false);
    });
});

describe('Table,Row and cell Format history preservation validation', () => {
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
        
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Row Format  validation', () => {
console.log('Row Format  validation');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).allowRowBreak.checked = false;
        (tablePropertiesDialog as any).repeatHeader.checked = true;
        tablePropertiesDialog.applyTableProperties();
        editor.editorHistory.undo();
        expect(() => { editor.editorHistory.undo(); }).not.toThrowError();
    });

    it('cell Format with multiple selected cells validation', () => {
console.log('cell Format with multiple selected cells validation');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        editor.selection.handleShiftDownKey();
        editor.selection.handleShiftDownKey();
        let tablePropertiesDialog: any = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        tablePropertiesDialog.cellWidthBox.value = 178;
        tablePropertiesDialog.applyTableProperties();
        editor.editorHistory.undo();
        expect(() => { editor.editorHistory.undo(); }).not.toThrowError();
    });
    it('Table Format validation', () => {
console.log('Table Format validation');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).leftIndent = 12;
        tablePropertiesDialog.applyTableProperties();
        editor.editorHistory.undo();
        expect(() => { editor.editorHistory.undo(); }).not.toThrowError();
    });
});


describe('load table format', () => {
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
        
        setTimeout((): void => {
            done();
        }, 750);
    });
    it('load Table format Left alignment', () => {
console.log('load Table format Left alignment');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        table.tableFormat.tableAlignment = 'Left';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);

        let dialog: any = editor.tablePropertiesDialogModule;

        editor.tablePropertiesDialogModule.show();
        editor.tablePropertiesDialogModule.loadTableProperties();

        expect((dialog.left as HTMLElement).classList.contains('e-de-table-alignment-active'));
        expect(dialog.getTableAlignment()).toBe('Left');
        editor.tablePropertiesDialogModule.applyTableProperties();
        editor.tablePropertiesDialogModule.closeTablePropertiesDialog();


    });
    it('load Table format Center alignment', () => {
console.log('load Table format Center alignment');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        table.tableFormat.tableAlignment = 'Center';
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);
        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);

        let dialog: any = editor.tablePropertiesDialogModule;

        editor.tablePropertiesDialogModule.show();
        editor.tablePropertiesDialogModule.loadTableProperties();

        expect((dialog.center as HTMLElement).classList.contains('e-de-table-alignment-active'));

        editor.tablePropertiesDialogModule.closeTablePropertiesDialog();
    });
    it('load Table format Right alignment', () => {
console.log('load Table format Right alignment');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        table.tableFormat.tableAlignment = 'Center';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);

        let dialog: any = editor.tablePropertiesDialogModule;

        editor.tablePropertiesDialogModule.show();
        editor.tablePropertiesDialogModule.loadTableProperties();

        expect((dialog.right as HTMLElement).classList.contains('e-de-table-alignment-active'));

        editor.tablePropertiesDialogModule.closeTablePropertiesDialog();

    });
    it('load Table format Right alignment with preferred with percentage', () => {
console.log('load Table format Right alignment with preferred with percentage');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        table.tableFormat.tableAlignment = 'Right';
        table.tableFormat.preferredWidthType = 'Percent';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);

        let dialog: any = editor.tablePropertiesDialogModule;

        editor.tablePropertiesDialogModule.show();
        editor.tablePropertiesDialogModule.loadTableProperties();

        expect((dialog.right as HTMLElement).classList.contains('e-de-table-alignment-active'));
        expect(dialog.tableWidthType.index).toBe(1);
        editor.tablePropertiesDialogModule.closeTablePropertiesDialog();


    });
    it('Load with preferred with undefined', () => {
console.log('Load with preferred with undefined');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        table.tableFormat.tableAlignment = 'Left';
        table.tableFormat.preferredWidthType = 'Point';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);
        let dialog: any = editor.tablePropertiesDialogModule;
        editor.selectionModule.tableFormat.tableAlignment = undefined;
        editor.selectionModule.tableFormat.preferredWidth = undefined;
        editor.tablePropertiesDialogModule.show();
        editor.tablePropertiesDialogModule.loadTableProperties();

        expect(dialog.getTableAlignment()).toBeUndefined();
        editor.tablePropertiesDialogModule.closeTablePropertiesDialog();

    });
    it('Load with preferred with undefined', () => {
console.log('Load with preferred with undefined');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        table.tableFormat.tableAlignment = 'Left';
        table.tableFormat.preferredWidthType = 'Point';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);

        let dialog: any = editor.tablePropertiesDialogModule;
        editor.tablePropertiesDialogModule.show();
        editor.tablePropertiesDialogModule.loadTableProperties();

        expect(dialog.getTableAlignment()).toBe('Left');
        editor.tablePropertiesDialogModule.closeTablePropertiesDialog();


    });
});
describe('Load Row Format', () => {
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
        
        setTimeout((): void => {
            done();
        }, 750);
    });

    it('Row Height with isHeader undefined', () => {
console.log('Row Height with isHeader undefined');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        row.rowFormat.isHeader = true;
        row.rowFormat.heightType = 'Exactly';
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);

        let dialog: any = editor.tablePropertiesDialogModule;
        editor.selectionModule.rowFormat.isHeader = undefined;
        editor.selectionModule.rowFormat.heightType = undefined;
        editor.selectionModule.rowFormat.allowBreakAcrossPages = undefined;
        editor.tablePropertiesDialogModule.show();
        editor.tablePropertiesDialogModule.loadTableProperties();

        expect(dialog.repeatHeader.checked).toBe(false);
        expect(dialog.allowRowBreak.indeterminate).toBe(true);
        expect(dialog.getCellAlignment()).toBe('Top');
        editor.tablePropertiesDialogModule.closeTablePropertiesDialog();
    });
});
describe('Load Cell format', () => {
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
        
        setTimeout((): void => {
            done();
        }, 750);
    });
    it('Load Cell format option', () => {
console.log('Load Cell format option');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        row.rowFormat.isHeader = true;
        row.rowFormat.heightType = 'Exactly';
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        cell.cellFormat.preferredWidth = 200;
        cell.cellFormat.preferredWidthType = 'Percent';
        cell.cellFormat.verticalAlignment = 'Center';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);

        let dialog: any = editor.tablePropertiesDialogModule;
        editor.tablePropertiesDialogModule.show();
        editor.tablePropertiesDialogModule.loadTableProperties();

        expect((dialog.cellCenterAlign as HTMLElement).classList.contains('e-de-table-alignment-active'));
        editor.tablePropertiesDialogModule.closeTablePropertiesDialog();

    });
    it('Load Cell format option', () => {
console.log('Load Cell format option');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        row.rowFormat.isHeader = true;
        row.rowFormat.heightType = 'Exactly';
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        cell.cellFormat.preferredWidth = 200;
        cell.cellFormat.preferredWidthType = 'Percent';
        cell.cellFormat.verticalAlignment = 'Bottom';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);
        let dialog: any = editor.tablePropertiesDialogModule;
        editor.tablePropertiesDialogModule.show();
        editor.tablePropertiesDialogModule.loadTableProperties();

        expect((dialog.cellBottomAlign as HTMLElement).classList.contains('e-de-table-alignment-active'));
        editor.tablePropertiesDialogModule.closeTablePropertiesDialog();

    });
    it('Load Cell format option', () => {
console.log('Load Cell format option');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        row.rowFormat.isHeader = true;
        row.rowFormat.heightType = 'Exactly';
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        cell.cellFormat.preferredWidth = 200;
        cell.cellFormat.preferredWidthType = 'Percent';
        cell.cellFormat.verticalAlignment = 'Bottom';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);
        let dialog: any = editor.tablePropertiesDialogModule;
        editor.selectionModule.cellFormat.verticalAlignment = undefined;
        editor.selectionModule.cellFormat.preferredWidth = undefined;
        editor.tablePropertiesDialogModule.show();
        editor.tablePropertiesDialogModule.loadTableProperties();
        expect(dialog.preferredCellWidthCheckBox.indeterminate).toBe(true);

        editor.tablePropertiesDialogModule.closeTablePropertiesDialog();
    });
});
describe('Table dialog Property change validation', () => {
    let editor: DocumentEditor;
    let dialog: TablePropertiesDialog;
    beforeAll((): void => {
        editor = undefined;
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'width:500px;height:700px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, TablePropertiesDialog, EditorHistory);
        editor = new DocumentEditor({ enableEditor: true, enableEditorHistory: true, enableSelection: true, isReadOnly: false, enableTablePropertiesDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        dialog = editor.tablePropertiesDialogModule;
    });
    afterEach((): void => {
        dialog.unWireEvent();
        dialog.closeTablePropertiesDialog();
    });
    afterAll((done) => {
        editor.destroy();
        document.body.removeChild(document.getElementById('container'));
        editor = undefined;
        
        setTimeout((): void => {
            done();
        }, 750);
    });
    it('cell width type change to percentage', () => {
console.log('cell width type change to percentage');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        table.tableFormat.preferredWidth = 200;
        table.tableFormat.preferredWidthType = 'Point';
        table.tableFormat.tableAlignment = 'Left';
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        cell.cellFormat.preferredWidth = 100;
        cell.cellFormat.preferredWidthType = 'Percent';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);
        table.calculateGrid();
        table.isGridUpdated = false;
        table.buildTableColumns();

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);
        let instance: any = dialog;
        dialog.show();
        dialog.loadTableProperties();
        instance.cellWidthType.index = 0;
        instance.cellWidthType.dataBind();
        dialog.onCellWidthTypeChange();
        expect(instance.cellWidthBox.value).toBe(200);
        instance.cellWidthType.index = 1;
        instance.cellWidthType.dataBind();
        dialog.onCellWidthTypeChange();
        expect(instance.cellWidthBox.value).toBe(100);
    });
    it('cell Width type change to point', () => {
console.log('cell Width type change to point');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        table.tableFormat.preferredWidth = 100;
        table.tableFormat.preferredWidthType = 'Point';
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 100;
        cell.cellFormat.preferredWidth = 100;
        cell.cellFormat.preferredWidthType = 'Point';
        table.tableFormat.tableAlignment = 'Left';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);
        table.calculateGrid();
        table.isGridUpdated = false;
        table.buildTableColumns();

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);

        let instance: any = dialog;
        dialog.show();
        dialog.loadTableProperties();
        (dialog as any).cellWidthType.index = 1;
        (dialog as any).cellWidthType.dataBind();
        dialog.onCellWidthTypeChange();
        expect(instance.cellWidthBox.value).toBe(100);
        instance.cellWidthType.index = 0;
        instance.cellWidthType.dataBind();
        dialog.onCellWidthTypeChange();
        expect(instance.cellWidthBox.value).toBe(100);
    });
    it('Table width type change to point', () => {
console.log('Table width type change to point');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        table.tableFormat.preferredWidth = 50;
        table.tableFormat.preferredWidthType = 'Percent';
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        cell.cellFormat.preferredWidth = 100;
        cell.cellFormat.preferredWidthType = 'Percent';
        table.tableFormat.tableAlignment = 'Left';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);
        table.calculateGrid();
        table.isGridUpdated = false;
        table.buildTableColumns();

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);
        let instance: any = dialog;
        dialog.show();
        dialog.loadTableProperties();
        instance.tableWidthType.index = 0;
        instance.tableWidthType.dataBind();
        dialog.onTableWidthTypeChange();
        expect(instance.tableWidthBox.value).toBeGreaterThanOrEqual(230);
        instance.tableWidthType.index = 1;
        instance.tableWidthType.dataBind();
        dialog.onTableWidthTypeChange();
        expect(instance.tableWidthBox.value).toBeLessThanOrEqual(50);
    });
    it('Table Width type change to percent', () => {
console.log('Table Width type change to percent');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        table.tableFormat.preferredWidth = 234;
        table.tableFormat.preferredWidthType = 'Point';
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 200;
        cell.cellFormat.preferredWidth = 100;
        cell.cellFormat.preferredWidthType = 'Percent';
        table.tableFormat.tableAlignment = 'Left';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);
        table.calculateGrid();
        table.isGridUpdated = false;
        table.buildTableColumns();

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);
        let instance: any = dialog;
        dialog.show();
        dialog.loadTableProperties();
        instance.tableWidthType.index = 1;
        instance.tableWidthType.dataBind();
        dialog.onTableWidthTypeChange();
        expect(instance.tableWidthBox.value).toBeLessThanOrEqual(51);
        instance.tableWidthType.index = 0;
        instance.tableWidthType.dataBind();
        dialog.onTableWidthTypeChange();
        expect(instance.tableWidthBox.value).toBeGreaterThanOrEqual(230);
    });
    it('Apply Cell format with as Percent width out table preferred width', () => {
console.log('Apply Cell format with as Percent width out table preferred width');
        let sections: BodyWidget[] = [];
        let section: BodyWidget = new BodyWidget();
        section.sectionFormat = new WSectionFormat();
        let table: TableWidget = new TableWidget();
        table.containerWidget = section;
        table.index = 1;
        table.tableFormat.preferredWidth = 0;
        table.tableFormat.preferredWidthType = 'Point';
        let row: TableRowWidget = new TableRowWidget();
        row.containerWidget = table;
        let cell: TableCellWidget = new TableCellWidget();
        cell.containerWidget = row;
        cell.cellFormat.cellWidth = 100;
        cell.cellFormat.preferredWidth = 100;
        cell.cellFormat.preferredWidthType = 'Point';
        table.tableFormat.tableAlignment = 'Left';
        let paragraph: ParagraphWidget = new ParagraphWidget();
        paragraph.containerWidget = cell;
        paragraph.index = 0;
        cell.childWidgets.push(paragraph);
        row.childWidgets.push(cell);
        table.childWidgets.push(row);
        table.calculateGrid();
        table.isGridUpdated = false;
        table.buildTableColumns();

        section.childWidgets.push(table);
        sections.push(section);
        editor.documentHelper.onDocumentChanged(sections);

        dialog.show();
        dialog.loadTableProperties();
        (dialog as any).cellWidthType.index = 1;
        (dialog as any).cellWidthType.dataBind();
        dialog.onCellWidthTypeChange();
        dialog.applyTableProperties();
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.preferredWidthType).toBe('Percent');
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.tableFormat.preferredWidth).toBe(100);
    })
});



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
        
        setTimeout(function () {
            done();
        }, 750);
    });
    it('in 3*4 table and last column resized with minimum width', () => {
console.log('in 3*4 table and last column resized with minimum width');
        editor.editor.insertTable(2, 2);
        editor.selection.handleRightKey();
        editor.selection.cellFormat.preferredWidth = 10.8;
        editor.selection.moveDown();
        editor.selection.cellFormat.preferredWidth = 10.8;
        editor.selection.handleLeftKey();
        let cellWidget: TableCellWidget = editor.selection.start.paragraph.containerWidget as TableCellWidget;
        let previousCellWidth: number = cellWidget.cellFormat.preferredWidth;
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).center.click();
        tablePropertiesDialog.applyTableProperties();
        expect(editor.selection.tableFormat.tableAlignment).toBe('Center');
        expect(editor.selection.tableFormat.table.x).not.toBe(96);
        expect(Math.round(cellWidget.cellFormat.preferredWidth)).toBe(Math.round(previousCellWidth));
    });
    it('cell with different backgroud validation', () => {
console.log('cell with different backgroud validation');
        editor.openBlank();
        editor.editor.insertTable(1, 2);
        editor.selection.handleHomeKey();
        editor.selection.handleControlRightKey();
        editor.selection.cellFormat.background = '#dd2626';
        editor.selection.handleHomeKey();
        editor.selection.handleControlRightKey();
        editor.selection.handleControlRightKey();
        expect(() => { editor.selection.cellFormat.background = '#dd2626'; }).not.toThrowError();
    });
});

describe('Updating row height value and type validation', () => {
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
        
        setTimeout(function () {
            done();
        }, 750);
    });
    it('Row height value and type  validation', () => {
console.log('Row height value and type  validation');
        editor.openBlank();
        editor.editor.insertTable(3, 3);
        let tablePropertiesDialog: TablePropertiesDialog = editor.tablePropertiesDialogModule;
        tablePropertiesDialog.show();
        (tablePropertiesDialog as any).rowHeightCheckBox.checked = true;
        tablePropertiesDialog.changeTableRowCheckBox();
        (tablePropertiesDialog as any).rowHeightBox.value = 1000;
        tablePropertiesDialog.onRowHeightChange();
        expect(() => { tablePropertiesDialog.applyTableProperties(); }).not.toThrowError();
    });
});
