import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { TextPosition } from '../../src/index';
import { Point } from '../../src/document-editor/implementation/editor/editor-helper';
import { Editor } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { TableWidget, TableRowWidget, TableCellWidget } from '../../src/index';


describe('Selection based Table middle Cell resize validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:100%;height:100%'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
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
    it('Resize At middle cell', () => {
        console.log('Resize At middle cell');
        documentHelper = editor.documentHelper;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.select('0;0;0;0;0;0', '0;0;0;1;0;1');
        editor.editorModule.tableResize.currentResizingTable = editor.selection.start.paragraph.associatedCell.ownerTable;
        editor.editorModule.tableResize.resizeNode = 0;
        documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.startingPoint = new Point(408, 105);
        let point: Point = new Point(499, 103);
        editor.editorModule.tableResize.handleResizing(point);
        expect(((editor.editorModule.tableResize.currentResizingTable.childWidgets[0] as TableRowWidget).childWidgets[1] as TableCellWidget).cellFormat.cellWidth).toBe(143);
    });
    
});

describe('Selection based Table Last Cell resize validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:100%;height:100%'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
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
    it('Resize At Last cell', () => {
        console.log('Resize At Last cell');
        documentHelper = editor.documentHelper;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.select('0;0;1;0;0;0', '0;0;1;1;0;1');
        editor.editorModule.tableResize.currentResizingTable = editor.selection.start.paragraph.associatedCell.ownerTable;
        editor.editorModule.tableResize.resizeNode = 0;
        documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 2;
        editor.editorModule.tableResize.startingPoint = new Point(719, 127);
        let point: Point = new Point(500, 123);
        editor.editorModule.tableResize.handleResizing(point);
        expect(((editor.editorModule.tableResize.currentResizingTable.childWidgets[1] as TableRowWidget).childWidgets[1] as TableCellWidget).cellFormat.cellWidth).toBe(15);
    });

});

describe('Selection based Table first Cell resize validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:100%;height:100%'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.documentHelper as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.documentHelper as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.documentHelper.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.documentHelper.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
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
    it('Resize At first cell', () => {
        console.log('Resize At first cell');
        documentHelper = editor.documentHelper;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.select('0;0;1;0;0;0', '0;0;1;1;0;1');
        editor.editorModule.tableResize.currentResizingTable = editor.selection.start.paragraph.associatedCell.ownerTable;
        editor.editorModule.tableResize.resizeNode = 0;
        documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 0;
        editor.editorModule.tableResize.startingPoint = new Point(96, 122);
        let point: Point = new Point(191, 124);
        editor.editorModule.tableResize.handleResizing(point);
        expect(((editor.editorModule.tableResize.currentResizingTable.childWidgets[1] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.cellWidth).toBe(139);
    });
});