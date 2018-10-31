import { DocumentEditor } from '../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer } from '../../src/index';

import { TestHelper } from '../test-helper.spec';
import { createElement } from '@syncfusion/ej2-base';
import { Editor } from '../../src/index';
import { Selection } from '../../src/index';
import { TextPosition } from '../../src/index';
import { LineWidget, ParagraphWidget, TextElementBox, BodyWidget, TableWidget, TableRowWidget, TableCellWidget } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { WSectionFormat } from '../../src/document-editor/implementation/format/section-format';
import { BookmarkDialog } from '../../src/document-editor/implementation/dialogs/bookmark-dialog';


//Table select API validation


describe('Select Table API validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
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
    it('Insert table cursor validation', () => {
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        expect(editor.selection.start.hierarchicalPosition).toBe("0;0;0;0;0;0;0;0");
        expect(editor.selection.start.paragraph.associatedCell).toBe((table.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget);
    });
    it('Nested insert Table cursor validation', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertTable(2, 2);
        expect(editor.selection.start.hierarchicalPosition).toBe("0;0;0;0;0;0;0;0;0;0;0");
    });
    it('Select Table in Forward selection', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.lastChild as TableRowWidget).lastChild as TableCellWidget;
        editor.selection.selectTable();
        expect(editor.selection.start.paragraph.associatedCell).toBe(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toBe(lastCell);
    });
    it('Select Table in Backward selection', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.lastChild as TableRowWidget).lastChild as TableCellWidget;
        editor.selection.moveDown();
        editor.selection.handleRightKey();
        editor.selection.selectTable();
        expect(editor.selection.start.paragraph.associatedCell).toBe(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toBe(lastCell);
    });
    it('Select Table if selection is not inside table', () => {
        editor.openBlank();
        editor.selection.selectTable();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
    });
    it('Select Table in nested Table case', () => {
        editor.openBlank();

        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = (((viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).firstChild as TableRowWidget).firstChild as TableCellWidget).childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.lastChild as TableRowWidget).lastChild as TableCellWidget;
        editor.selection.selectTable();
        expect(editor.selection.start.paragraph.associatedCell).toBe(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toBe(lastCell);
    });
    it('Select Table if selection is not empty', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.lastChild as TableRowWidget).lastChild as TableCellWidget;
        editor.selection.selectCell();
        expect(editor.selection.start.paragraph.associatedCell).toEqual(editor.selection.end.paragraph.associatedCell);
        editor.selection.selectTable();
        expect(editor.selection.start.paragraph.associatedCell).toBe(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toBe(lastCell);
    });
});

describe('Select Row API validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
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

    it('Select Row in Forward selection', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.firstChild as TableRowWidget).lastChild as TableCellWidget;
        editor.selection.selectRow();
        expect(editor.selection.start.paragraph.associatedCell).toBe(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toBe(lastCell);
        expect(editor.selection.start.paragraph.associatedCell.ownerRow).toEqual(editor.selection.end.paragraph.associatedCell.ownerRow);
    });
    it('Select Row in Backward selection', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.selection.handleRightKey();
        editor.selection.selectRow();
        expect(editor.selection.start.paragraph.associatedCell.ownerRow).toEqual(editor.selection.end.paragraph.associatedCell.ownerRow);
    });
    it('Select Row if selection is not inside table', () => {
        editor.openBlank();
        editor.selection.selectRow();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
    });
    it('Select Row in nested Table case', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertTable(2, 2);
        editor.selection.selectRow();
        expect(editor.selection.start.paragraph.associatedCell.ownerRow).toEqual(editor.selection.end.paragraph.associatedCell.ownerRow);
    });
    it('Select Row if selection is not empty', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.selection.handleRightKey();
        editor.selection.selectColumn();
        expect(editor.selection.start.paragraph.associatedCell).not.toEqual(editor.selection.end.paragraph.associatedCell);
        editor.selection.selectRow();
        expect(editor.selection.start.paragraph.associatedCell.ownerRow).not.toEqual(editor.selection.end.paragraph.associatedCell.ownerRow);
    });
});

describe('Select Cell API validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
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

    it('Select Cell in Forward selection', () => {
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        editor.selection.selectCell();
        expect(editor.selection.start.paragraph.associatedCell).toEqual(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toEqual(firstCell);
    });
    it('Select Cell in Nested Table', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertTable(2, 2);
        editor.selection.selectTable();
        editor.selection.selectCell();
        expect(editor.selection.start.paragraph.associatedCell).not.toEqual(editor.selection.end.paragraph.associatedCell)
    });

    it('Select Cell if selection is not inside table', () => {
        editor.openBlank();
        editor.selection.selectCell();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
    });
    it('Select Cell if selection is not empty', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstRow: TableRowWidget = (table.firstChild as TableRowWidget);
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.firstChild as TableRowWidget).lastChild as TableCellWidget;
        editor.selection.selectRow();
        expect(editor.selection.start.paragraph.associatedCell.ownerRow).toEqual(firstRow);
        expect(editor.selection.end.paragraph.associatedCell.ownerRow).toEqual(firstRow);
        editor.selection.selectCell();
        expect(editor.selection.start.paragraph.associatedCell).toEqual(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toEqual(lastCell);
    });

});


describe('Select Column API validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
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

    it('Select Cell if selection is not inside table', () => {
        editor.openBlank();
        editor.selection.selectColumn();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
    });
    it('Select Cell if selection is not empty', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.lastChild as TableRowWidget).lastChild as TableCellWidget;
        editor.selection.selectRow();
        expect(editor.selection.start.paragraph.associatedCell.ownerRow).toEqual(editor.selection.end.paragraph.associatedCell.ownerRow);
        editor.selection.selectColumn();
        expect(editor.selection.start.paragraph.associatedCell).toEqual(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toEqual(lastCell);
    });
    it('Select Column in Forward selection', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.lastChild as TableRowWidget).firstChild as TableCellWidget;
        editor.selection.selectColumn();
        expect(editor.selection.start.paragraph.associatedCell).toBe(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toBe(lastCell);
    });
    it('Select Column in nested table', () => {
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertTable(2, 2);
        editor.selection.moveDown();
        editor.selection.moveDown();
        editor.selection.selectColumn();
        expect(editor.selection.start.paragraph.associatedCell.ownerRow).not.toEqual(editor.selection.end.paragraph.associatedCell.ownerRow);
        editor.selection.selectCell();
    });
});


describe('BookMark validation in double tap', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableBookmarkDialog: true });
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
    it('Book Mark insert validation', () => {
        editor.editorModule.insertText('Sample Work', false);
        editor.selection.handleLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.bookmarkDialogModule.show();
        (editor.bookmarkDialogModule as any).addBookmark();
    });
    it('In bookmark element select current word validation', () => {
        editor.selection.selectCurrentWord();
        expect(editor.selection.start.offset).toBe(7);
        expect(editor.selection.end.offset).toBe(13);
    });
    it('start of line selection containing Bookmark element-select current word validation', () => {
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(8);
    });
});


describe('BookMark validation in double tap', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableBookmarkDialog: true });
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
    it('Book Mark insert validation', () => {
        editor.editorModule.insertText('Sample Work', false);
        editor.selection.selectAll();
        editor.bookmarkDialogModule.show();
        (editor.bookmarkDialogModule as any).addBookmark();
    });
    it('In bookmark element select current word validation', () => {
        editor.selection.handleEndKey();
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.start.offset).toBe(8);
        expect(editor.selection.end.offset).toBe(12);
    });
    it('start of line selection containing Bookmark element-select current word validation', () => {
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(8);
    });
});
