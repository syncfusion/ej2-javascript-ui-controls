import { DocumentEditor } from '../../src/document-editor/document-editor';
import { LayoutViewer, PageLayoutViewer, SfdtExport, DocumentHelper} from '../../src/index';
import { DocumentEditorContainer} from '../../src/document-editor-container/document-editor-container';
import { Toolbar} from '../../src/document-editor-container/tool-bar/tool-bar';
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
//     it('Book Mark insert validation', () => {
// console.log('Book Mark insert validation');
//         editor.editorModule.insertText('Sample Work');
//         editor.selection.handleLeftKey();
//         editor.selection.handleShiftLeftKey();
//         editor.selection.handleShiftLeftKey();
//         editor.selection.handleShiftLeftKey();
//         editor.bookmarkDialogModule.show();
//         (editor.bookmarkDialogModule as any).addBookmark();
//     });
    it('In bookmark element select current word validation', () => {
console.log('In bookmark element select current word validation');
        editor.selection.selectCurrentWord();
        // expect(editor.selection.start.offset).toBe(7);
        // expect(editor.selection.end.offset).toBe(13);
    });
    it('start of line selection containing Bookmark element-select current word validation', () => {
console.log('start of line selection containing Bookmark element-select current word validation');
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.start.offset).toBe(0);
        // expect(editor.selection.end.offset).toBe(8);
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
//     it('Book Mark insert validation', () => {
// console.log('Book Mark insert validation');
//         editor.editorModule.insertText('Sample Work');
//         editor.selection.selectAll();
//         editor.bookmarkDialogModule.show();
//         (editor.bookmarkDialogModule as any).addBookmark();
//     });
    it('In bookmark element select current word validation', () => {
console.log('In bookmark element select current word validation');
        editor.selection.handleEndKey();
        editor.selection.handleLeftKey();
        editor.selection.selectCurrentWord();
        // expect(editor.selection.start.offset).toBe(8);
        // expect(editor.selection.end.offset).toBe(11);
    });
    it('start of line selection containing Bookmark element-select current word validation', () => {
console.log('start of line selection containing Bookmark element-select current word validation');
        editor.selection.handleHomeKey();
        editor.selection.selectCurrentWord();
        expect(editor.selection.start.offset).toBe(0);
        // expect(editor.selection.end.offset).toBe(8);
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
//     it('Paste the copied table', () => {
// console.log('Paste the copied table');
//         editor.selection.handleDownKey();
//         editor.selection.handleDownKey();
//         editor.selection.handleDownKey();
//         editor.enableLocalPaste = true;
//         editor.editor.pasteInternal(undefined);
//         expect(editor.selection.start.paragraph.associatedCell.ownerTable.childWidgets.length).toBe(4);
//     });
//     it('copy after paste', () => {
// console.log('copy after paste');
//         editor.selection.selectAll();
//         editor.selection.copy();
//         editor.selection.handleControlDownKey();
//         editor.editor.onEnter();
//         editor.editor.pasteInternal(undefined);
//         editor.selection.handleUpKey();
//         expect(editor.selection.start.paragraph.associatedCell.ownerTable.childWidgets.length).toBe(4);
//     });
});

describe('selection table row navigation', () => {
    let container: DocumentEditorContainer = undefined;
    beforeAll(() => {
        let ele: HTMLElement = createElement('div', { id: 'container', styles: 'height: 500px' });
        document.body.appendChild(ele);
        DocumentEditorContainer.Inject(Toolbar);
        container = new DocumentEditorContainer({ enableToolbar: true});
        container.appendTo('#container');
    });
    afterAll((done) => {
        document.body.removeChild(document.getElementById('container'));
        container.destroy();
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it("selection table row forward navigation",()=>{
        container.onPropertyChanged({showPropertiesPane: true}, {});
        let element: Element = document.getElementsByClassName("e-de-pane")[0];
        expect((element as HTMLDivElement).style.display).toEqual("block");
        container.documentEditor.editor.insertTable(2,2);
        expect(container.documentEditor.selection.start.paragraph.isInsideTable).toBe(true);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.columnIndex).toBe(0);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.rowIndex).toBe(0);
        container.documentEditor.selection.handleTabKey(true,false);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.columnIndex).toBe(1);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.rowIndex).toBe(0);
        container.documentEditor.selection.handleTabKey(true,false);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.columnIndex).toBe(0);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.rowIndex).toBe(1);
        container.documentEditor.selection.handleTabKey(true,false);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.columnIndex).toBe(1);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.rowIndex).toBe(1);
    });
    it("selection table row backward navigation",()=>{
        expect(container.documentEditor.selection.start.paragraph.associatedCell.columnIndex).toBe(1);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.rowIndex).toBe(1);
        container.documentEditor.selection.handleTabKey(true,true);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.columnIndex).toBe(0);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.rowIndex).toBe(1);
        container.documentEditor.selection.handleTabKey(true,true);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.columnIndex).toBe(1);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.rowIndex).toBe(0);
        container.documentEditor.selection.handleTabKey(true,true);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.columnIndex).toBe(0);
        expect(container.documentEditor.selection.start.paragraph.associatedCell.rowIndex).toBe(0);
    });
    it("selection table navigation",()=>{
        container.documentEditor.selection.handleTabKey(true,false);
        container.documentEditor.selection.handleTabKey(true,false);
        container.documentEditor.selection.handleTabKey(true,false);
        container.documentEditor.selection.moveToNextParagraph();
        expect(container.documentEditor.selection.start.paragraph.isInsideTable).toBe(false);
    });
});
