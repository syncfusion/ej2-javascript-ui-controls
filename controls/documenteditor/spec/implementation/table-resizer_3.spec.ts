import { LayoutViewer, PageLayoutViewer, DocumentHelper, BodyWidget, TableRowWidget, TableCellWidget, ParagraphWidget, LineWidget, TextElementBox } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { TextPosition } from '../../src/index';
import { Editor } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { TableWidget } from '../../src/index';

function getTextPosition(editor: DocumentEditor, hierarchicalIndex: string): TextPosition {
    let textPosition: TextPosition = new TextPosition(editor);
    textPosition.setPositionForCurrentIndex(hierarchicalIndex);
    return textPosition;
}

describe('Table Cell Resizing With Final Cell Selection testing', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Resize Table Cell in Final Row Drag Value Testing ', () => {
console.log('Resize Table Cell in Final Row Drag Value Testing ');
        editor.editor.insertTable(2, 3);
        let startPosition: TextPosition = getTextPosition(editor, '0;0;0;1;1;0;0;0');
        let endPosition: TextPosition = getTextPosition(editor, '0;0;0;1;1;0;0;1');
        editor.selection.selectRange(startPosition, endPosition);
        let event: any = { offsetX: 735, offsetY: 143, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.documentHelper.onMouseDownInternal(event);
        event = { offsetX: 779, offsetY: 143, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.documentHelper.onMouseMoveInternal(event);
        editor.documentHelper.onMouseUpInternal(event);
        event = { offsetX: 799, offsetY: 143, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.documentHelper.onMouseDownInternal(event);
        let table: any = documentHelper.pages[0].bodyWidgets[0].childWidgets[0];
        expect(table.childWidgets[0].childWidgets[2].columnIndex).toBe(2);
        editor.editorHistory.undo();
        editor.editorHistory.redo();
    });
    it('Resize Table Cell With Selection table cell Spacing Resizing Testing ', () => {
console.log('Resize Table Cell With Selection table cell Spacing Resizing Testing ');
        editor.editor.insertTable(3, 3);
        let table: TableWidget = editor.selection.start.paragraph.associatedCell.ownerTable;
        table.tableFormat.cellSpacing = 10;
        editor.documentHelper.layout.reLayoutTable(table);
        let startPosition: TextPosition = getTextPosition(editor, '0;0;0;0;0;0;0;0');
        let endPosition: TextPosition = getTextPosition(editor, '0;0;0;0;1;0;0;1');
        editor.selection.selectRange(startPosition, endPosition);
        let event: any = { offsetX: 321, offsetY: 141, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.documentHelper.onMouseDownInternal(event);
        event = { offsetX: 381, offsetY: 141, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.documentHelper.onMouseMoveInternal(event);
        editor.documentHelper.onMouseUpInternal(event);
        event = { offsetX: 391, offsetY: 141, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.documentHelper.onMouseDownInternal(event);
    });
});

describe('Cell Width Restricting on cell Resizing testing', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Resize Table Without Selection on Zero index Testing', () => {
console.log('Resize Table Without Selection on Zero index Testing');
        editor.editor.insertTable(2, 3);
        let event: any = { offsetX: 320, offsetY: 126, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.documentHelper.onMouseDownInternal(event);
        event = { offsetX: 360, offsetY: 126, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.documentHelper.onMouseMoveInternal(event);
        editor.documentHelper.onMouseUpInternal(event);
        event = { offsetX: 370, offsetY: 126, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.documentHelper.onMouseDownInternal(event);
        let compareTable: any = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0];
        expect(compareTable.childWidgets[0].childWidgets[0].cellFormat.cellWidth).toBeGreaterThanOrEqual(116);
        expect(compareTable.childWidgets[1].childWidgets[0].cellFormat.cellWidth).toBeGreaterThanOrEqual(116);
        editor.editorHistory.undo();
        editor.editorHistory.redo();
    });
    it('Resize table without selection on middle index testing', () => {
console.log('Resize table without selection on middle index testing');
        editor.editor.insertTable(3, 3);
        let event: any = { offsetX: 736, offsetY: 145, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.documentHelper.onMouseDownInternal(event);
        event = { offsetX: 766, offsetY: 145, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.documentHelper.onMouseMoveInternal(event);
        editor.documentHelper.onMouseUpInternal(event);
        event = { offsetX: 776, offsetY: 145, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.documentHelper.onMouseDownInternal(event);
        editor.editorHistory.undo();
        editor.editorHistory.redo();
    });
});

describe('Cell Width Restricting on cell Resizing With Selection testing', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        documentHelper = editor.documentHelper;
    });
    beforeEach(() => {
        editor.openBlank();
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Resize Table With Selection on Zero index Testing', () => {
console.log('Resize Table With Selection on Zero index Testing');
        editor.editor.insertTable(2, 3);
        let startPosition: TextPosition = getTextPosition(editor, '0;0;0;0;0;0;0;0');
        let endPosition: TextPosition = getTextPosition(editor, '0;0;0;0;1;0;0;1');
        editor.selection.selectRange(startPosition, endPosition);
        let event: any = { offsetX: 320, offsetY: 126, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.documentHelper.onMouseDownInternal(event);
        event = { offsetX: 360, offsetY: 126, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.documentHelper.onMouseMoveInternal(event);
        editor.documentHelper.onMouseUpInternal(event);
        event = { offsetX: 370, offsetY: 126, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.documentHelper.onMouseDownInternal(event);
        let compareTable: any = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0];
        expect(compareTable.childWidgets[0].childWidgets[0].cellFormat.cellWidth).toBeGreaterThanOrEqual(116);
        expect(compareTable.childWidgets[1].childWidgets[0].cellFormat.cellWidth).toBeGreaterThanOrEqual(116);
    });
    // it('Resize table with selection on middle index testing', () => {
    //     editor.editor.insertTable(3, 3);
    //     let startPosition: TextPosition = getTextPosition(editor, '0;0;0;0;0;1;0;0');
    //     let endPosition: TextPosition = getTextPosition(editor, '0;0;0;0;1;1;0;1');
    //     editor.selection.selectRange(startPosition, endPosition);
    //     let event: any = { offsetX: 736, offsetY: 145, preventDefault: function () { }, ctrlKey: false, which: 1 };
    //     editor.documentHelper.onMouseDownInternal(event);
    //     event = { offsetX: 766, offsetY: 145, preventDefault: function () { }, ctrlKey: false, which: 0 };
    //     editor.documentHelper.onMouseMoveInternal(event);
    //     editor.documentHelper.onMouseUpInternal(event);
    //     event = { offsetX: 776, offsetY: 145, preventDefault: function () { }, ctrlKey: false, which: 1 };
    //     editor.documentHelper.onMouseDownInternal(event);
    //     let compareTable: any = editor.documentHelper.pages[0].bodyWidgets[0].childWidgets[0];
    //     expect(compareTable.childWidgets[2].childWidgets[1].cellFormat.cellWidth).toBeGreaterThanOrEqual(156);
    // });
});

describe('Check the backspace is working properly in table case with bookmark', () => {
    let container: DocumentEditor;
    beforeAll(() => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', { id: 'container' });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
        container = new DocumentEditor({ enableEditor: true, isReadOnly: false, enableEditorHistory: true, enableSfdtExport: true });
        (container.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (container.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (container.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (container.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        container.appendTo('#container');
    });
    afterAll((done): void => {
        container.destroy();
        document.body.removeChild(document.getElementById('container'));
        container = undefined;
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });

it('Check the backspace is working properly in table case with bookmark', () => {
    console.log('Check the backspace is working properly in table case with bookmark');
    container.openBlank();
    container.editor.insertTable(1,1);
    container.editor.insertBookmark('bookmark');
    container.editor.insertTable(1,2);
    container.selection.moveDown();
    container.editor.insertText('hello');
    container.editor.onBackSpace();
    container.editor.onBackSpace();
    let bodyWidget: BodyWidget = container.documentHelper.pages[0].bodyWidgets[0] as BodyWidget;
    let tableWidget: TableWidget = bodyWidget.childWidgets[0] as TableWidget;
    let tableRowWidget: TableRowWidget = tableWidget.childWidgets[0] as TableRowWidget;
    let tableCellWidget: TableCellWidget = tableRowWidget.childWidgets[0] as TableCellWidget;
    let paragraphWidget: ParagraphWidget = tableCellWidget.childWidgets[2] as ParagraphWidget;
    let lineWidget: LineWidget = paragraphWidget.childWidgets[0] as LineWidget;
    let textElementBox: TextElementBox = lineWidget.children[1] as TextElementBox;
    expect(textElementBox.text).toBe('hel');
});
});