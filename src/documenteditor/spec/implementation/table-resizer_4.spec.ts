import { LayoutViewer, PageLayoutViewer } from '../../src/index';
import { DocumentEditor } from '../../src/document-editor/document-editor';
import { createElement } from '@syncfusion/ej2-base';
import { TestHelper } from '../test-helper.spec';
import { Selection } from '../../src/index';
import { TextPosition } from '../../src/index';
import { Point } from '../../src/document-editor/implementation/editor/editor-helper';
import { Editor } from '../../src/index';
import { EditorHistory } from '../../src/document-editor/implementation/editor-history/editor-history';
import { TableRowWidget, TableCellWidget } from '../../src/index';

describe('Table Column resizing validation with selection', () => {
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
        editor.editorHistory.undo();
        editor.editorHistory.redo();
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
    beforeEach(() => {
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
    it('Resize Table column with left column selection ', () => {
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        let event: any = { offsetX: 631, offsetY: 142, preventDefault: function () { }, ctrlKey: false, which: 1 };
        editor.viewer.onMouseDownInternal(event);
        editor.editorModule.tableResize.resizerPosition = 1;
        editor.editorModule.tableResize.resizeNode = 0;
        editor.editorModule.tableResize.startingPoint.x = 408.5;
        editor.editorModule.tableResize.startingPoint.y = 103;
        editor.viewer.isRowOrCellResizing = true;
        let point: Point = new Point(409.5, 103);
        editor.editorModule.tableResize.handleResizing(point);
        event = { offsetX: 632, offsetY: 150, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.viewer.onMouseMoveInternal(event);
        editor.viewer.onMouseUpInternal(event);
        // expect(((editor.selection.tableFormat.table.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.cellWidth).toBe(234);
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
        editor.viewer.isRowOrCellResizing = true;
        editor.editorModule.tableResize.resizeTableCellColumn(2);
        event = { offsetX: 632, offsetY: 145, preventDefault: function () { }, ctrlKey: false, which: 0 };
        editor.viewer.onMouseMoveInternal(event);
        editor.viewer.onMouseUpInternal(event);
        // expect(((editor.selection.tableFormat.table.childWidgets[0] as TableRowWidget).childWidgets[0] as TableCellWidget).cellFormat.cellWidth).toBe(234);
    });
});

function getJson() {
    let gridBefore: any = {
        "sections": [
            {
                "blocks": [
                    {
                        "rows": [
                            {
                                "rowFormat": {
                                    "allowBreakAcrossPages": true,
                                    "isHeader": false,
                                    "height": 0,
                                    "heightType": "AtLeast",
                                    "borders": {
                                        "left": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "right": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "top": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "bottom": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "vertical": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "horizontal": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalDown": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalUp": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        }
                                    }
                                },
                                "gridBeforeWidth": 65.75,
                                "gridAfterWidth": 0,
                                "gridBefore": 1,
                                "gridAfter": 0,
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "characterFormat": {
                                                    "bold": false,
                                                    "italic": false,
                                                    "strikethrough": "None",
                                                    "baselineAlignment": "Normal",
                                                    "fontSize": 11,
                                                    "fontFamily": "Calibri"
                                                },
                                                "paragraphFormat": {
                                                    "leftIndent": 0,
                                                    "rightIndent": 0,
                                                    "firstLineIndent": 0,
                                                    "beforeSpacing": 0,
                                                    "afterSpacing": 0,
                                                    "lineSpacing": 1,
                                                    "lineSpacingType": "Multiple",
                                                    "textAlignment": "Left"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 168,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 168,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "characterFormat": {
                                                    "bold": false,
                                                    "italic": false,
                                                    "strikethrough": "None",
                                                    "baselineAlignment": "Normal",
                                                    "fontSize": 11,
                                                    "fontFamily": "Calibri"
                                                },
                                                "paragraphFormat": {
                                                    "leftIndent": 0,
                                                    "rightIndent": 0,
                                                    "firstLineIndent": 0,
                                                    "beforeSpacing": 0,
                                                    "afterSpacing": 0,
                                                    "lineSpacing": 1,
                                                    "lineSpacingType": "Multiple",
                                                    "textAlignment": "Left"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    }
                                ]
                            },
                            {
                                "rowFormat": {
                                    "allowBreakAcrossPages": true,
                                    "isHeader": false,
                                    "height": 0,
                                    "heightType": "AtLeast",
                                    "borders": {
                                        "left": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "right": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "top": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "bottom": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "vertical": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "horizontal": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalDown": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        },
                                        "diagonalUp": {
                                            "lineStyle": "None",
                                            "lineWidth": 0,
                                            "shadow": false,
                                            "space": 0,
                                            "hasNoneStyle": false
                                        }
                                    }
                                },
                                "gridBeforeWidth": 0,
                                "gridAfterWidth": 0,
                                "gridBefore": 0,
                                "gridAfter": 0,
                                "cells": [
                                    {
                                        "blocks": [
                                            {
                                                "characterFormat": {
                                                    "bold": false,
                                                    "italic": false,
                                                    "strikethrough": "None",
                                                    "baselineAlignment": "Normal",
                                                    "fontSize": 11,
                                                    "fontFamily": "Calibri"
                                                },
                                                "paragraphFormat": {
                                                    "leftIndent": 0,
                                                    "rightIndent": 0,
                                                    "firstLineIndent": 0,
                                                    "beforeSpacing": 0,
                                                    "afterSpacing": 0,
                                                    "lineSpacing": 1,
                                                    "lineSpacingType": "Multiple",
                                                    "textAlignment": "Left"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 2,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    },
                                    {
                                        "blocks": [
                                            {
                                                "characterFormat": {
                                                    "bold": false,
                                                    "italic": false,
                                                    "strikethrough": "None",
                                                    "baselineAlignment": "Normal",
                                                    "fontSize": 11,
                                                    "fontFamily": "Calibri"
                                                },
                                                "paragraphFormat": {
                                                    "leftIndent": 0,
                                                    "rightIndent": 0,
                                                    "firstLineIndent": 0,
                                                    "beforeSpacing": 0,
                                                    "afterSpacing": 0,
                                                    "lineSpacing": 1,
                                                    "lineSpacingType": "Multiple",
                                                    "textAlignment": "Left"
                                                },
                                                "inlines": []
                                            }
                                        ],
                                        "cellFormat": {
                                            "cellWidth": 233.75,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 233.75,
                                            "preferredWidthType": "Point",
                                            "verticalAlignment": "Top",
                                            "isSamePaddingAsTable": true,
                                            "borders": {
                                                "left": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "right": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "top": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "bottom": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "vertical": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "horizontal": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalDown": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                },
                                                "diagonalUp": {
                                                    "lineStyle": "None",
                                                    "lineWidth": 0,
                                                    "shadow": false,
                                                    "space": 0,
                                                    "hasNoneStyle": false
                                                }
                                            }
                                        },
                                        "columnIndex": 0
                                    }
                                ]
                            }
                        ],
                        "title": null,
                        "description": null,
                        "tableFormat": {
                            "allowAutoFit": true,
                            "leftIndent": 0,
                            "tableAlignment": "Left",
                            "preferredWidthType": "Auto",
                            "borders": {
                                "left": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "right": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "top": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "bottom": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "vertical": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "horizontal": {
                                    "lineStyle": "Single",
                                    "lineWidth": 0.5,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "diagonalDown": {
                                    "lineStyle": "None",
                                    "lineWidth": 0,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                },
                                "diagonalUp": {
                                    "lineStyle": "None",
                                    "lineWidth": 0,
                                    "shadow": false,
                                    "space": 0,
                                    "hasNoneStyle": false
                                }
                            }
                        }
                    },
                    {
                        "characterFormat": {
                            "bold": false,
                            "italic": false,
                            "strikethrough": "None",
                            "baselineAlignment": "Normal",
                            "fontSize": 11,
                            "fontFamily": "Calibri"
                        },
                        "paragraphFormat": {
                            "leftIndent": 0,
                            "rightIndent": 0,
                            "firstLineIndent": 0,
                            "beforeSpacing": 0,
                            "afterSpacing": 8,
                            "lineSpacing": 1.0791666507720947,
                            "lineSpacingType": "Multiple",
                            "textAlignment": "Left"
                        },
                        "inlines": []
                    }
                ],
                "headersFooters": {},
                "sectionFormat": {
                    "headerDistance": 35.400001525878906,
                    "footerDistance": 35.400001525878906,
                    "pageWidth": 612,
                    "pageHeight": 792,
                    "leftMargin": 72,
                    "rightMargin": 72,
                    "topMargin": 72,
                    "bottomMargin": 72,
                    "differentFirstPage": false,
                    "differentOddAndEvenPages": false
                }
            }
        ],
        "characterFormat": {
            "bold": false,
            "italic": false,
            "strikethrough": "None",
            "baselineAlignment": "Normal",
            "fontSize": 11,
            "fontFamily": "Calibri"
        }
    };
    return JSON.stringify(gridBefore);
}

describe('Table Cell resizing testing at cell resizer position at 0', () => {
    let editor: DocumentEditor = undefined;
    let viewer: LayoutViewer = undefined;
    beforeAll((): void => {
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
    it('Table grid before width value 83 and test resizer at position 0', () => {
        editor.open(getJson());
        viewer = editor.viewer as PageLayoutViewer;
        editor.selection.handleDownKey();
        let offsetX: number = viewer.currentPage.boundingRectangle.x + 95.5;
        let event: any = { offsetX: offsetX, offsetY: 138, preventDefault: function () { }, ctrlKey: false, which: 1 };
        viewer.onMouseDownInternal(event);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(0);
        event = { offsetX: viewer.currentPage.boundingRectangle.x + 129.5, offsetY: 244, preventDefault: function () { }, ctrlKey: false, which: 0 };
        viewer.onMouseMoveInternal(event);
        event = { offsetX: -15.5 + viewer.currentPage.boundingRectangle.x, offsetY: 138, preventDefault: function () { }, ctrlKey: false, which: 0 };
        viewer.onMouseMoveInternal(event);
        event = { offsetX: viewer.currentPage.boundingRectangle.x + 220.5, offsetY: 236, preventDefault: function () { }, ctrlKey: false, which: 0 };
        viewer.onMouseMoveInternal(event);
        viewer.onMouseUpInternal(event);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(-1);
        editor.editorHistory.undo();
        editor.editorHistory.redo();
    });
    it('Table grid before width value 83 and test resizer at position 0', () => {
        viewer = editor.viewer as PageLayoutViewer;
        editor.openBlank();
        editor.editor.insertTable(2, 2);
        editor.selection.handleShiftDownKey();
        let offsetX: number = viewer.currentPage.boundingRectangle.x + 95.5;
        let event: any = { offsetX: offsetX, offsetY: 138, preventDefault: function () { }, ctrlKey: false, which: 1 };
        viewer.onMouseDownInternal(event);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(0);
        event = { offsetX: viewer.currentPage.boundingRectangle.x + 247.5, offsetY: 112, preventDefault: function () { }, ctrlKey: false, which: 0 };
        viewer.onMouseMoveInternal(event);
        event = { offsetX: viewer.currentPage.boundingRectangle.x - 15.5, offsetY: 138, preventDefault: function () { }, ctrlKey: false, which: 0 };
        viewer.onMouseMoveInternal(event);
        event = { offsetX: viewer.currentPage.boundingRectangle.x + 247.5, offsetY: 68, preventDefault: function () { }, ctrlKey: false, which: 0 };
        viewer.onMouseMoveInternal(event);
        viewer.onMouseUpInternal(event);
        viewer.onMouseUpInternal(event);
        editor.editorHistory.undo();
        editor.editorHistory.redo();
        expect(editor.selection.tableFormat.table.tableFormat.leftIndent).not.toBe(0);
    });
});

describe('Table Cell resizing testing at cell resizer position at 0', () => {
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
    it('Table grid before width value 83 and test resizer at position 0', () => {
        editor.open(getJson());
        viewer = editor.viewer as PageLayoutViewer;
        editor.selection.handleDownKey();
        editor.selection.handleShiftRightKey();
        let offsetX: number = viewer.currentPage.boundingRectangle.x + 95.5;
        let event: any = { offsetX: offsetX, offsetY: 142, preventDefault: function () { }, ctrlKey: false, which: 1 };
        viewer.onMouseDownInternal(event);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(0);
        event = { offsetX: viewer.currentPage.boundingRectangle.x + 151, offsetY: 168, preventDefault: function () { }, ctrlKey: false, which: 0 };
        viewer.onMouseMoveInternal(event);
        event = { offsetX: viewer.currentPage.boundingRectangle.x + 47, offsetY: 138, preventDefault: function () { }, ctrlKey: false, which: 0 };
        viewer.onMouseMoveInternal(event);
        event = { offsetX: viewer.currentPage.boundingRectangle.x + 10, offsetY: 120, preventDefault: function () { }, ctrlKey: false, which: 0 };
        viewer.onMouseMoveInternal(event);
        viewer.onMouseUpInternal(event);
    });
});

