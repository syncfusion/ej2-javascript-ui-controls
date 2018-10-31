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




describe('Table Resize at simple case in table middle validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer = undefined;
    beforeAll((): void => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
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
    it('simple resizeColumn validation', () => {
        viewer = editor.viewer as PageLayoutViewer;
        editor.editor.insertTable(2, 2);
        let offsetX = 632;
        let offsetY = 129;
        let event: any = { offsetX: offsetX, offsetY: offsetY, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.viewer.onMouseDownInternal(event);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(1);
        offsetX = viewer.currentPage.boundingRectangle.x + 662;
        offsetY = viewer.currentPage.boundingRectangle.y + 16;
        event = { offsetX: offsetX, offsetY: offsetY, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.viewer.onMouseMoveInternal(event);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(1);
        editor.viewer.onMouseUpInternal(event);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(-1);
    });
    it('undo validation', () => {
        editor.editorHistory.undo();
    });
    it('redo validation', () => {
        editor.editorHistory.redo();
    });
    it('undo and redo validation', () => {
    });
});


describe('Table row at simple case validation', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer = undefined;
    beforeEach((): void => {
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
        DocumentEditor.Inject(Editor, Selection, EditorHistory); editor.enableEditorHistory = true;
        (editor.viewer as any).containerCanvasIn = TestHelper.containerCanvas;
        (editor.viewer as any).selectionCanvasIn = TestHelper.selectionCanvas;
        (editor.viewer.render as any).pageCanvasIn = TestHelper.pageCanvas;
        (editor.viewer.render as any).selectionCanvasIn = TestHelper.pageSelectionCanvas;
        editor.appendTo('#container');
        editor.openBlank();
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
    });
    it('Undo validation', () => {
        editor.editorHistory.undo();
    });
    it('redo validation', () => {
        editor.editorHistory.redo();
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
        (editor.editorModule.tableResize as any).resizeTableCellColumn(500.5);
        expect(((editor.editorModule.tableResize.currentResizingTable.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.cellWidth).toBe(457.2);
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



function getTableCellSpaceJson() {
    let cellSpaceTable: any = { "sections": [{ "blocks": [{ "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "right": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "top": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "bottom": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "vertical": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "horizontal": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "gridBeforeWidth": 0.0, "gridAfterWidth": 0.0, "gridBefore": 0, "gridAfter": 0, "cells": [{ "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [{ "text": "Column 1", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" } }] }, { "rows": [{ "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "right": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "top": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "bottom": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "vertical": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "horizontal": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "gridBeforeWidth": 0.0, "gridAfterWidth": 0.0, "gridBefore": 0, "gridAfter": 0, "cells": [{ "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [] }], "cellFormat": { "cellWidth": 103.30000305175781, "columnSpan": 1, "rowSpan": 1, "preferredWidth": 111.19999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "columnIndex": 0 }, { "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [] }], "cellFormat": { "cellWidth": 103.30000305175781, "columnSpan": 1, "rowSpan": 1, "preferredWidth": 111.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "columnIndex": 0 }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "right": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "top": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "bottom": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "vertical": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "horizontal": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "gridBeforeWidth": 0.0, "gridAfterWidth": 0.0, "gridBefore": 0, "gridAfter": 0, "cells": [{ "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [] }], "cellFormat": { "cellWidth": 103.30000305175781, "columnSpan": 1, "rowSpan": 1, "preferredWidth": 111.19999694824219, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "columnIndex": 0 }, { "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [] }], "cellFormat": { "cellWidth": 103.30000305175781, "columnSpan": 1, "rowSpan": 1, "preferredWidth": 111.25, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "columnIndex": 0 }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "right": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "top": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "bottom": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "vertical": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "horizontal": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [] }], "cellFormat": { "cellWidth": 232.5, "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "columnIndex": 0 }, { "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [{ "text": "Column 2", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" } }] }], "cellFormat": { "cellWidth": 232.5, "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "columnIndex": 0 }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "right": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "top": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "bottom": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "vertical": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "horizontal": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "gridBeforeWidth": 0.0, "gridAfterWidth": 0.0, "gridBefore": 0, "gridAfter": 0, "cells": [{ "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [{ "text": "Column 3", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" } }] }], "cellFormat": { "cellWidth": 232.5, "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "columnIndex": 0 }, { "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [{ "text": "Column 4", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" } }] }], "cellFormat": { "cellWidth": 232.5, "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "columnIndex": 0 }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "right": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "top": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "bottom": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "vertical": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "horizontal": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "gridBeforeWidth": 0.0, "gridAfterWidth": 0.0, "gridBefore": 0, "gridAfter": 0, "cells": [{ "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [{ "text": "Column 5", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" } }] }], "cellFormat": { "cellWidth": 232.5, "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "columnIndex": 0 }, { "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [{ "text": "Column 6", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" } }] }], "cellFormat": { "cellWidth": 232.5, "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "columnIndex": 0 }] }, { "rowFormat": { "allowBreakAcrossPages": true, "isHeader": false, "height": 0.0, "heightType": "AtLeast", "borders": { "left": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "right": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "top": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "bottom": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "vertical": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "horizontal": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "gridBeforeWidth": 0.0, "gridAfterWidth": 0.0, "gridBefore": 0, "gridAfter": 0, "cells": [{ "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [{ "text": "Column 7", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" } }] }], "cellFormat": { "cellWidth": 232.5, "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "columnIndex": 0 }, { "blocks": [{ "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [{ "text": "Column 8", "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" } }] }], "cellFormat": { "cellWidth": 232.5, "columnSpan": 1, "rowSpan": 1, "preferredWidth": 233.75, "preferredWidthType": "Point", "verticalAlignment": "Top", "isSamePaddingAsTable": true, "borders": { "left": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "right": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "top": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "bottom": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "vertical": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "horizontal": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } }, "columnIndex": 0 }] }], "title": null, "description": null, "tableFormat": { "allowAutoFit": true, "cellSpacing": 3.5999999046325684, "leftMargin": 5.75, "rightMargin": 5.75, "leftIndent": 0.0, "tableAlignment": "Left", "preferredWidthType": "Auto", "borders": { "left": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "right": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "top": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "bottom": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "vertical": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "horizontal": { "lineStyle": "Single", "lineWidth": 3.0, "shadow": false, "space": 0.0, "hasNoneStyle": false, "color": "#FF000000" }, "diagonalDown": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false }, "diagonalUp": { "lineStyle": "None", "lineWidth": 0.0, "shadow": false, "space": 0.0, "hasNoneStyle": false } } } }, { "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 11.0, "fontFamily": "Calibri" }, "paragraphFormat": { "leftIndent": 0.0, "rightIndent": 0.0, "firstLineIndent": 0.0, "beforeSpacing": 0.0, "afterSpacing": 8.0, "lineSpacing": 1.1499999761581421, "lineSpacingType": "Multiple", "textAlignment": "Left" }, "inlines": [] }], "headersFooters": {}, "sectionFormat": { "headerDistance": 36.0, "footerDistance": 36.0, "pageWidth": 612.0, "pageHeight": 792.0, "leftMargin": 72.0, "rightMargin": 72.0, "topMargin": 72.0, "bottomMargin": 72.0, "differentFirstPage": false, "differentOddAndEvenPages": false } }], "characterFormat": { "bold": false, "italic": false, "strikethrough": "None", "baselineAlignment": "Normal", "fontSize": 10.0, "fontFamily": "Times New Roman" } };
    return JSON.stringify(cellSpaceTable);
}

describe('Table CELL Resizing table cell Selection testing', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer = undefined;
    beforeAll((): void => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
        });
        document.body.appendChild(ele);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false, enableEditorHistory: true });
        DocumentEditor.Inject(Editor, Selection, EditorHistory);
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
    it('Table Cell Resizing With Cell Spacing', () => {
        editor.open(getTableCellSpaceJson());
        viewer = editor.viewer as PageLayoutViewer;
        let event: any = { offsetX: 318, offsetY: 144, preventDefault: function () { }, ctrlKey: false, which: 1 };
        viewer.onMouseDownInternal(event);
        event = { offsetX: 358, offsetY: 144, preventDefault: function () { }, ctrlKey: false, which: 0 };
        viewer.onMouseMoveInternal(event);
        viewer.onMouseUpInternal(event);
        event = { offsetX: 368, offsetY: 144, preventDefault: function () { }, ctrlKey: false, which: 1 };
        viewer.onMouseDownInternal(event);
    });

    it('Table Cell Resizing ResizeTableCell With Cell Spacing', () => {
        editor.open(getTableCellSpaceJson());
        viewer = editor.viewer as PageLayoutViewer;
        editor.editorModule.tableResize.currentResizingTable = viewer.pages[0].bodyWidgets[0].childWidgets[0] as TableWidget
        editor.editorModule.tableResize.resizeNode = 0;
        viewer.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizerPosition = 0;
        editor.editorModule.tableResize.startingPoint = new Point(102.5, 124);
        editor.editorModule.tableResize.resizeTableCellColumn(30);
    });
});

describe('Table CELL Resizing table cell Selection testing', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer = undefined;
    beforeAll((): void => {
        document.body.innerHTML = '';
        let ele: HTMLElement = createElement('div', {
            id: 'container',
            styles: 'width:1280px;height:500px'
        });
        document.body.appendChild(ele);
        DocumentEditor.Inject(Editor, Selection);
        editor = new DocumentEditor({ enableEditor: true, enableSelection: true, isReadOnly: false });
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
    it('Selection At Row Resizing Tesing', () => {
        editor.open(getTableCellSpaceJson());
        viewer = editor.viewer as PageLayoutViewer;
        (editor.editorModule.tableResize as any).getRowReSizerPosition(null, new Point(252.5, 391.33));
    });
});
