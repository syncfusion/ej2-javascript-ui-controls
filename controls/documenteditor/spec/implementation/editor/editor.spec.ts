import { DocumentEditor } from '../../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { Editor, TableWidget } from '../../../src/index';
import { TestHelper } from '../../test-helper.spec';
import { Selection } from '../../../src/index';
import { EditorHistory } from '../../../src/document-editor/implementation/editor-history/editor-history';

/**
 * Section Break Validation
 */
describe('Auto fit command ', () => {
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
    it('apply Fit to content', () => {
        editor.editor.insertTable(2, 2);
        editor.editor.autoFitTable('FitToContents');
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableFormat.allowAutoFit).toBe(true);
        expect(table.tableHolder.getTotalWidth(0)).toBeLessThan(25);
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(20);
    });
    it('Insert text in table', () => {
        editor.editor.insertText('Syncfusion');
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(25);
    });
    it('Undo operation after insert text ', () => {
        editor.editorHistory.undo();
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableHolder.getTotalWidth(0)).toBeLessThan(25);
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(20);
        editor.editorHistory.redo();
        table = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(25);
    });
    it('Apply fit to window', () => {
        editor.editor.autoFitTable('FitToWindow');
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableFormat.preferredWidthType).toBe('Percent');
        expect(table.tableFormat.preferredWidth).toBe(100);
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(465);
        expect(table.tableHolder.getTotalWidth(0)).toBeLessThan(471);
    });
    it('Undo fit to window operation after insert text ', () => {
        editor.editorHistory.undo();
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableFormat.allowAutoFit).toBe(true);
        expect(table.tableHolder.getTotalWidth(0)).toBeLessThan(75);
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(67);

    });
    it('Redo fit to window operation', () => {
        editor.editorHistory.redo();
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableFormat.preferredWidthType).toBe('Percent');
        expect(table.tableFormat.preferredWidth).toBe(100);
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(465);
        expect(table.tableHolder.getTotalWidth(0)).toBeLessThan(471);
    });
    it('Apply Fixed column width for Fit to window table', () => {
        editor.editor.autoFitTable('FixedColumnWidth');
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(editor.selection.start.paragraph.associatedCell.cellFormat.preferredWidthType).toBe('Point');
        expect(table.tableHolder.getTotalWidth(0)).toBeGreaterThan(465);
        expect(table.tableHolder.getTotalWidth(0)).toBeLessThan(471);
        editor.editorHistory.undo();
    });
    it('Apply Fixed column width in Fit to content table', () => {
        editor.editor.autoFitTable('FitToContents');
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        let previousTableWidth: number = table.tableHolder.getTotalWidth(0);
        editor.editor.autoFitTable('FixedColumnWidth');
        editor.editor.insertText('Syncfusion');
        table = editor.selection.start.paragraph.associatedCell.ownerTable;
        expect(table.tableHolder.getTotalWidth(0)).toBe(previousTableWidth);
    });
});

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
    it("Insert Table Validation", () => {
        editor.editorModule.applyStyle("Heading 1");
        editor.editorModule.insertTable(30, 2);
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
        expect(editor.pageCount).toBe(2);
    });
    it("Delete Table Validation", () => {
        editor.editorModule.deleteTable();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
        expect(editor.pageCount).toBe(1);
    });
    it("Undo and redo delete operation", () => {
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
        expect(editor.pageCount).toBe(2);
        editor.editorHistory.redo();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
        expect(editor.pageCount).toBe(1);
    });
    it("Insert table undo and redo", () => {
        editor.openBlank();
        editor.editorModule.applyStyle("Heading 1");
        editor.editorModule.insertTable(30, 2);
        expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
        expect(editor.pageCount).toBe(2);
        editor.editorHistory.undo();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
        expect(editor.pageCount).toBe(1);
        editor.editorHistory.redo();
        //expect(editor.selection.start.paragraph.isInsideTable).toBe(true);
        expect(editor.pageCount).toBe(2);
    });
});

describe("Insert Hyperlink and bookmark validation", () => {
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
    it("Insert Hyperlink with display text", () => {
        editor.editorModule.insertHyperlink('https://syncfusion.com', 'Syncfusion');
        editor.selection.movePreviousPosition();
        var field = editor.selection.getHyperlinkField();
        expect(field).toBeDefined();
    });
    it("InsertHyperlik with out display text", () => {
        editor.openBlank();
        editor.editorModule.insertHyperlink('https://syncfusion.com');
        editor.selection.selectAll();
        expect(editor.selection.text).toBe('https://syncfusion.com\r');
    });
    it("Insert bookmark", () => {
        editor.openBlank();
        editor.editorModule.insertText("Syncfusion");
        editor.selection.selectAll();
        editor.editorModule.insertBookmark("testbookmark");
        var bookmars = editor.getBookmarks();
        expect(bookmars.length).toBe(1);
        expect(bookmars[0]).toBe("testbookmark");
    });
});