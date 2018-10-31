import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { TextPosition } from '../../src/index';
import { Point } from '../../src/document-editor/implementation/editor/editor-helper';
import { Editor } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { TableWidget, TableRowWidget, TableCellWidget } from '../../src/index';

describe('Nested Table Row Resizing validation and After merge cell resize cell at middle validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Nested Table Row Resizing validation', () => {
        viewer = editor.viewer as PageLayoutViewer;
        editor.editor.insertTable(2, 2);
        editor.editor.insertTable(2, 2);
        editor.editorModule.tableResize.currentResizingTable = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget;
        editor.editorModule.tableResize.resizeNode = 1;
        viewer.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 0;
        editor.editorModule.tableResize.startingPoint = new Point(227.5, 114);
        editor.editorModule.tableResize.resizeTableRow(2);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(0);
    });
    it('After merge cell resize cell at middle validation', () => {
        viewer = editor.viewer as PageLayoutViewer;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        editor.editor.mergeCells();
        editor.selection.handleUpKey();
        editor.selection.handleRightKey();
        editor.selection.handleShiftRightKey();
        editor.editorModule.tableResize.currentResizingTable = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget
        editor.editorModule.tableResize.resizeNode = 0;
        viewer.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.startingPoint = new Point(408.5, 104);
        viewer.currentPage = viewer.pages[0];
        editor.editorModule.tableResize.resizeTableCellColumn(-1);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(-1);
    });

});

describe('After resize cell validation without selection', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:100%;height:100%'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Resize without selection', () => {
        viewer = editor.viewer as PageLayoutViewer;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        editor.editor.mergeCells();
        editor.selection.handleUpKey();
        editor.editorModule.tableResize.currentResizingTable = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget
        editor.editorModule.tableResize.resizeNode = 0;
        viewer.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.startingPoint = new Point(1075, 124);
        editor.editorModule.tableResize.resizeTableCellColumn(500.5);
        expect(((editor.selection.tableFormat.table.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.cellWidth).toBe(457.2);
    });
    it('Resize without selection and merge cell in first column', () => {
        viewer = editor.viewer as PageLayoutViewer;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.handleRightKey();
        editor.selection.handleShiftDownKey();
        editor.editor.mergeCells();
        editor.selection.handleUpKey();
        editor.editorModule.tableResize.currentResizingTable = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget
        editor.editorModule.tableResize.resizeNode = 0;
        viewer.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.startingPoint = new Point(407.5, 127);
        viewer.currentPage = viewer.pages[0];
        editor.editorModule.tableResize.resizeTableCellColumn(1);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(1);
    });
});
describe('After resize cell validation with selection', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer = undefined;
    beforeAll((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:100%;height:100%'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Resize with selection', () => {
        viewer = editor.viewer as PageLayoutViewer;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        editor.editor.mergeCells();
        editor.editorModule.tableResize.currentResizingTable = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget
        editor.editorModule.tableResize.resizeNode = 0;
        viewer.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.startingPoint = new Point(407, 122);
        editor.editorModule.tableResize.resizeTableCellColumn(-80);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(1);
    });
});


describe('Table Column resizing validation with selection', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer = undefined;
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
    });
    afterEach((done): void => {
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Resize Table Row', () => {
        editor.editor.insertTable(2, 2);
        let event: any = { offsetX: 557, offsetY: 134, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.viewer.onMouseDownInternal(event);
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.resizeNode = 1;
        editor.editorModule.tableResize.startingPoint.x = 305.5;
        editor.editorModule.tableResize.startingPoint.y = 114;
        let point: Point = new Point(305.5, 115);
        editor.editorModule.tableResize.handleResizing(point);

        event = { offsetX: 557, offsetY: 135, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.viewer.onMouseMoveInternal(event);
        event = { offsetX: 561, offsetY: 193, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.viewer.onMouseMoveInternal(event);
        editor.viewer.onMouseUpInternal(event);
        editor.editorHistory.undo();
        editor.editorHistory.redo();
    });

});

describe('Table Column resizing validation with selection', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer = undefined;
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1000px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        viewer = editor.viewer as PageLayoutViewer;
    });
    afterEach((done): void => {
        editor.destroy();
        editor = undefined;
        viewer = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 2000);
    });
    it('Resize Table column with left column selection ', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        let event: any = { offsetX: 631, offsetY: 142, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.viewer.onMouseDownInternal(event);
        // event = { offsetX: 632, offsetY: 143, preventDefault: function () { }, ctrlKey: false, which: 0 };
        // editor.viewer.onMouseMoveInternal(event);        
        // editor.viewer.onMouseUpInternal(event);
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.resizeNode = 0;
        editor.editorModule.tableResize.startingPoint.x = 408.5;
        editor.editorModule.tableResize.startingPoint.y = 103;
        viewer.isRowOrCellResizing = true;
        let point: Point = new Point(409.5, 103);
        editor.editorModule.tableResize.handleResizing(point);
        event = { offsetX: 632, offsetY: 150, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.viewer.onMouseMoveInternal(event);
        editor.viewer.onMouseUpInternal(event);
        expect(((editor.selection.tableFormat.table.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.cellWidth).toBeGreaterThan(234);
    });
    it('Resize Table column with right column selection ', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.handleRightKey();
        editor.selection.handleShiftDownKey();
        let event: any = { offsetX: 631, offsetY: 142, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.viewer.onMouseDownInternal(event);
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.resizeNode = 0;
        editor.editorModule.tableResize.startingPoint.x = 408.5;
        editor.editorModule.tableResize.startingPoint.y = 103;
        let point: Point = new Point(409.5, 103);
        viewer.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizeTableCellColumn(2);
        event = { offsetX: 632, offsetY: 145, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.viewer.onMouseMoveInternal(event);
        editor.viewer.onMouseUpInternal(event);
        expect(((editor.selection.tableFormat.table.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.cellWidth).toBeGreaterThan(234);
    });
});

