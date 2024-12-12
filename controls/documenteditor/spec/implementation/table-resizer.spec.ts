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




describe('Table Resize at simple case in table middle validation', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper;
    beforeAll((): void => {
        document.body.innerHTML = '';
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
        editor.width='1280px';
        editor.height='500px';
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
//     it('simple resizeColumn validation', () => {
// console.log('simple resizeColumn validation');
//         documentHelper = editor.documentHelper;
//         editor.editor.insertTable(2, 2);
//         let offsetX = 632;
//         let offsetY = 129;
//         let event: any = { offsetX: offsetX, offsetY: offsetY, preventDefault: function () { }, ctrlKey: false, which: 1 };
//         editor.documentHelper.onMouseDownInternal(event);
//         expect(editor.editorModule.tableResize.resizerPosition).toBe(1);
//         offsetX = documentHelper.currentPage.boundingRectangle.x + 662;
//         offsetY = documentHelper.currentPage.boundingRectangle.y + 16;
//         event = { offsetX: offsetX, offsetY: offsetY, preventDefault: function () { }, ctrlKey: false, which: 0 };
//         editor.documentHelper.onMouseMoveInternal(event);
//         expect(editor.editorModule.tableResize.resizerPosition).toBe(1);
//         editor.documentHelper.onMouseUpInternal(event);
//         expect(editor.editorModule.tableResize.resizerPosition).toBe(-1);
//     });
    it('undo validation', () => {
console.log('undo validation');
        editor.editorHistory.undo();
    });
    it('redo validation', () => {
console.log('redo validation');
        editor.editorHistory.redo();
    });
    it('undo and redo validation', () => {
console.log('undo and redo validation');
    });
});


describe('Table row at simple case validation', () => {
    let editor: DocumentEditor = undefined;
    beforeEach((): void => {
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
        editor.openBlank();
    });
    afterEach((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Resize Table Row', () => {
console.log('Resize Table Row');
        editor.editor.insertTable(2, 2);
        let event: any = { offsetX: 557, offsetY: 134, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.documentHelper.onMouseDownInternal(event);
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.resizeNode = 1;
        editor.editorModule.tableResize.startingPoint.x = 305.5;
        editor.editorModule.tableResize.startingPoint.y = 114;
        let point: Point = new Point(305.5, 115);
        editor.editorModule.tableResize.handleResizing(point);

        event = { offsetX: 557, offsetY: 135, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.documentHelper.onMouseMoveInternal(event);
        event = { offsetX: 561, offsetY: 193, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.documentHelper.onMouseMoveInternal(event);
        editor.documentHelper.onMouseUpInternal(event);
    });
    it('Undo validation', () => {
console.log('Undo validation');
        editor.editorHistory.undo();
    });
    it('redo validation', () => {
console.log('redo validation');
        editor.editorHistory.redo();
    });

});



describe('After resize cell validation without selection', () => {
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
    it('Resize without selection', () => {
console.log('Resize without selection');
        documentHelper = editor.documentHelper;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        editor.editor.mergeCells();
        editor.selection.handleUpKey();
        editor.editorModule.tableResize.currentResizingTable = documentHelper.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget
        editor.editorModule.tableResize.resizeNode = 0;
        documentHelper.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.startingPoint = new Point(1075, 124);
        (editor.editorModule.tableResize as any).resizeTableCellColumn(500.5);
        expect(((editor.editorModule.tableResize.currentResizingTable.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.cellWidth).toBe(456.2);
    });
    // it('Resize without selection and merge cell in first column', () => {
    //     viewer = editor.viewer as PageLayoutViewer;
    //     editor.openBlank();
    //     editor.editor.insertTable(2, 2);
    //     editor.selection.handleRightKey();
    //     editor.selection.handleShiftDownKey();
    //     editor.editor.mergeCells();
    //     editor.selection.handleUpKey();
    //     editor.editorModule.tableResize.currentResizingTable = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget
    //     editor.editorModule.tableResize.resizeNode = 0;
    //     viewer.isRowOrCellResizing = true;
    //     editor.editorModule.tableResize.resizerPosition = 1;
    //     editor.editorModule.tableResize.startingPoint = new Point(407.5, 127);
    //     (editor.editorModule.tableResize as any).resizeTableCellColumn(1);
    //     expect(editor.editorModule.tableResize.resizerPosition).toBe(1);
    // });
});





