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

    it('Table undo after merging cells validation',()=>{
        console.log('Table undo after merging cells validation');
        documentHelper = editor.documentHelper;
        editor.openBlank();
        let sfdt: string = '{"sfdt":"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"}';
        editor.open(sfdt);
        editor.selection.select('0;2;0;0;0;4','0;2;0;0;0;4');
        editor.selection.selectTable();
        editor.editor.mergeCells();
        expect(()=>{editor.editorHistory.undo();}).not.toThrowError();
    })
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





