import { DocumentEditor } from '../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, SfdtExport, DocumentHelper } from '../../src/index';

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
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Insert table cursor validation', () => {
console.log('Insert table cursor validation');
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        expect(editor.selection.start.hierarchicalPosition).toBe("0;0;0;0;0;0;0;0");
        expect(editor.selection.start.paragraph.associatedCell).toBe((table.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget);
    });
    it('Nested insert Table cursor validation', () => {
console.log('Nested insert Table cursor validation');
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertTable(2, 2);
        expect(editor.selection.start.hierarchicalPosition).toBe("0;0;0;0;0;0;0;0;0;0;0");
    });
    it('Select Table in Forward selection', () => {
console.log('Select Table in Forward selection');
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.lastChild as TableRowWidget).lastChild as TableCellWidget;
        editor.selection.selectTable();
        expect(editor.selection.start.paragraph.associatedCell).toBe(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toBe(lastCell);
    });
    it('Select Table in Backward selection', () => {
console.log('Select Table in Backward selection');
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.lastChild as TableRowWidget).lastChild as TableCellWidget;
        editor.selection.moveDown();
        editor.selection.handleRightKey();
        editor.selection.selectTable();
        expect(editor.selection.start.paragraph.associatedCell).toBe(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toBe(lastCell);
    });
    it('Select Table if selection is not inside table', () => {
console.log('Select Table if selection is not inside table');
        editor.openBlank();
        editor.selection.selectTable();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
    });
    it('Select Table in nested Table case', () => {
console.log('Select Table in nested Table case');
        editor.openBlank();

        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = (((documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget).firstChild as TableRowWidget).firstChild as TableCellWidget).childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.lastChild as TableRowWidget).lastChild as TableCellWidget;
        editor.selection.selectTable();
        expect(editor.selection.start.paragraph.associatedCell).toBe(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toBe(lastCell);
    });
    it('Select Table if selection is not empty', () => {
console.log('Select Table if selection is not empty');
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
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
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('Select Row in Forward selection', () => {
console.log('Select Row in Forward selection');
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.firstChild as TableRowWidget).lastChild as TableCellWidget;
        editor.selection.selectRow();
        expect(editor.selection.start.paragraph.associatedCell).toBe(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toBe(lastCell);
        expect(editor.selection.start.paragraph.associatedCell.ownerRow).toEqual(editor.selection.end.paragraph.associatedCell.ownerRow);
    });
    it('Select Row in Backward selection', () => {
console.log('Select Row in Backward selection');
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.selection.handleRightKey();
        editor.selection.selectRow();
        expect(editor.selection.start.paragraph.associatedCell.ownerRow).toEqual(editor.selection.end.paragraph.associatedCell.ownerRow);
    });
    it('Select Row if selection is not inside table', () => {
console.log('Select Row if selection is not inside table');
        editor.openBlank();
        editor.selection.selectRow();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
    });
    it('Select Row in nested Table case', () => {
console.log('Select Row in nested Table case');
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertTable(2, 2);
        editor.selection.selectRow();
        expect(editor.selection.start.paragraph.associatedCell.ownerRow).toEqual(editor.selection.end.paragraph.associatedCell.ownerRow);
    });
    it('Select Row if selection is not empty', () => {
console.log('Select Row if selection is not empty');
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
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('Select Cell in Forward selection', () => {
console.log('Select Cell in Forward selection');
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        editor.selection.selectCell();
        expect(editor.selection.start.paragraph.associatedCell).toEqual(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toEqual(firstCell);
    });
    it('Select Cell in Nested Table', () => {
console.log('Select Cell in Nested Table');
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertTable(2, 2);
        editor.selection.selectTable();
        editor.selection.selectCell();
        expect(editor.selection.start.paragraph.associatedCell).not.toEqual(editor.selection.end.paragraph.associatedCell)
    });

    it('Select Cell if selection is not inside table', () => {
console.log('Select Cell if selection is not inside table');
        editor.openBlank();
        editor.selection.selectCell();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
    });
    it('Select Cell if selection is not empty', () => {
console.log('Select Cell if selection is not empty');
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
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
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });

    it('Select Cell if selection is not inside table', () => {
console.log('Select Cell if selection is not inside table');
        editor.openBlank();
        editor.selection.selectColumn();
        expect(editor.selection.start.paragraph.isInsideTable).toBe(false);
    });
    it('Select Cell if selection is not empty', () => {
console.log('Select Cell if selection is not empty');
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.lastChild as TableRowWidget).lastChild as TableCellWidget;
        editor.selection.selectRow();
        expect(editor.selection.start.paragraph.associatedCell.ownerRow).toEqual(editor.selection.end.paragraph.associatedCell.ownerRow);
        editor.selection.selectColumn();
        expect(editor.selection.start.paragraph.associatedCell).toEqual(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toEqual(lastCell);
    });
    it('Select Column in Forward selection', () => {
console.log('Select Column in Forward selection');
        editor.openBlank();
        editor.editorModule.insertTable(2, 2);
        let table: TableWidget = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        let firstCell: TableCellWidget = (table.firstChild as TableRowWidget).firstChild as TableCellWidget;
        let lastCell: TableCellWidget = (table.lastChild as TableRowWidget).firstChild as TableCellWidget;
        editor.selection.selectColumn();
        expect(editor.selection.start.paragraph.associatedCell).toBe(firstCell);
        expect(editor.selection.end.paragraph.associatedCell).toBe(lastCell);
    });
    it('Select Column in nested table', () => {
console.log('Select Column in nested table');
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
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableBookmarkDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Book Mark insert validation', () => {
console.log('Book Mark insert validation');
        editor.editorModule.insertText('Sample Work');
        editor.selection.handleLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.selection.handleShiftLeftKey();
        editor.bookmarkDialogModule.show();
        (editor.bookmarkDialogModule as any).addBookmark();
    });
    it('In bookmark element select current word validation', () => {
console.log('In bookmark element select current word validation');
        editor.selection.selectCurrentWord();
        expect(editor.selection.start.offset).toBe(7);
        expect(editor.selection.end.offset).toBe(13);
    });
    it('start of line selection containing Bookmark element-select current word validation', () => {
console.log('start of line selection containing Bookmark element-select current word validation');
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(8);
    });
});


describe('BookMark validation in double tap', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableBookmarkDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Book Mark insert validation', () => {
console.log('Book Mark insert validation');
        editor.editorModule.insertText('Sample Work');
        editor.selection.selectAll();
        editor.bookmarkDialogModule.show();
        (editor.bookmarkDialogModule as any).addBookmark();
    });
    it('In bookmark element select current word validation', () => {
console.log('In bookmark element select current word validation');
        editor.selection.handleEndKey();
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.start.offset).toBe(8);
        expect(editor.selection.end.offset).toBe(11);
    });
    it('start of line selection containing Bookmark element-select current word validation', () => {
console.log('start of line selection containing Bookmark element-select current word validation');
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.start.offset).toBe(0);
        expect(editor.selection.end.offset).toBe(8);
    });
});


describe('Nested Table copy validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'height: 500px' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog, SfdtExport);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, enableSfdtExport: true, isReadOnly: false, enableBookmarkDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('copy nested table', () => {
console.log('copy nested table');
        editor.editorModule.insertTable(2, 2);
        editor.editorModule.insertTable(2, 2);
        editor.selection.selectTable();
        expect(() => { editor.selection.copy(); }).not.toThrowError();
    });
    it('Paste the copied table', () => {
console.log('Paste the copied table');
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.selection.handleDownKey();
        editor.enableLocalPaste = true;
        editor.editor.pasteInternal(undefined);
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.childWidgets.length).toBe(4);
    });
    it('copy after paste', () => {
console.log('copy after paste');
        editor.selection.selectAll();
        editor.selection.copy();
        editor.selection.handleControlDownKey();
        editor.editor.onEnter();
        editor.editor.pasteInternal(undefined);
        editor.selection.handleUpKey();
        expect(editor.selection.start.paragraph.associatedCell.ownerTable.childWidgets.length).toBe(4);
    });
});

let sfdtData: any = { "sections": [{ "sectionFormat": { "pageWidth": 612, "pageHeight": 792, "leftMargin": 72, "rightMargin": 72, "topMargin": 72, "bottomMargin": 72, "differentFirstPage": false, "differentOddAndEvenPages": false, "headerDistance": 36, "footerDistance": 36, "bidi": false }, "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [{ "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }, { "characterFormat": { "bidi": false }, "text": "Hello " }] }], "headersFooters": { "header": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "footer": { "blocks": [{ "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "inlines": [] }] }, "evenHeader": {}, "evenFooter": {}, "firstPageHeader": {}, "firstPageFooter": {} } }], "characterFormat": { "bold": false, "italic": false, "fontSize": 11, "fontFamily": "Calibri", "underline": "None", "strikethrough": "None", "baselineAlignment": "Normal", "highlightColor": "NoColor", "fontColor": "#000000", "fontSizeBidi": 11, "fontFamilyBidi": "Calibri" }, "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 0, "afterSpacing": 0, "lineSpacing": 1, "lineSpacingType": "Multiple", "listFormat": {}, "bidi": false }, "defaultTabWidth": 36, "enforcement": false, "hashValue": "", "saltValue": "", "formatting": false, "protectionType": "NoProtection", "styles": [{ "name": "Normal", "type": "Paragraph", "paragraphFormat": { "listFormat": {} }, "characterFormat": {}, "next": "Normal" }, { "name": "Heading 1", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 12, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level1", "listFormat": {} }, "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 1 Char", "next": "Normal" }, { "name": "Heading 1 Char", "type": "Character", "characterFormat": { "fontSize": 16, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Default Paragraph Font", "type": "Character", "characterFormat": {} }, { "name": "Heading 2", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level2", "listFormat": {} }, "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 2 Char", "next": "Normal" }, { "name": "Heading 2 Char", "type": "Character", "characterFormat": { "fontSize": 13, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 3", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level3", "listFormat": {} }, "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 3 Char", "next": "Normal" }, { "name": "Heading 3 Char", "type": "Character", "characterFormat": { "fontSize": 12, "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 4", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level4", "listFormat": {} }, "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 4 Char", "next": "Normal" }, { "name": "Heading 4 Char", "type": "Character", "characterFormat": { "italic": true, "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 5", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level5", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Normal", "link": "Heading 5 Char", "next": "Normal" }, { "name": "Heading 5 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#2F5496" }, "basedOn": "Default Paragraph Font" }, { "name": "Heading 6", "type": "Paragraph", "paragraphFormat": { "leftIndent": 0, "rightIndent": 0, "firstLineIndent": 0, "textAlignment": "Left", "beforeSpacing": 2, "afterSpacing": 0, "lineSpacing": 1.0791666507720947, "lineSpacingType": "Multiple", "outlineLevel": "Level6", "listFormat": {} }, "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Normal", "link": "Heading 6 Char", "next": "Normal" }, { "name": "Heading 6 Char", "type": "Character", "characterFormat": { "fontFamily": "Calibri Light", "fontColor": "#1F3763" }, "basedOn": "Default Paragraph Font" }], "lists": [], "abstractLists": [] };
describe('Selection HighLight Validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, BookmarkDialog);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableBookmarkDialog: true });
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
        editor.open(JSON.stringify(sfdtData));
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        editor.destroy();
        editor = undefined;
        documentHelper = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Selection Validation', () => {
console.log('Selection Validation');
        expect(() => { editor.selection.selectAll(); }).not.toThrowError();
    });
    it('HighLightNextBlock Validation', () => {
console.log('HighLightNextBlock Validation');
        expect(editor.selection.isHighlightNext).toBe(false);
    });
});
