import { LayoutViewer, PageLayoutViewer, DocumentHelper } from '../../src/index';
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
function getJson() {
    let leftIndent: any = {
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
                                            "cellWidth": 108,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 108,
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
                                            "cellWidth": 108,
                                            "columnSpan": 1,
                                            "rowSpan": 1,
                                            "preferredWidth": 108,
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
                            "leftIndent": 125.75,
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
    return JSON.stringify(leftIndent);
}

describe('Table Cell resizing testing at cell resizer position at 0 with selection at first column', () => {
    let editor: DocumentEditor = undefined;
    let documentHelper: DocumentHelper = undefined;
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
    afterAll((done): void => {
        editor.destroy();
        editor = undefined;
        document.body.removeChild(document.getElementById('container'));
        document.body.innerHTML = '';
        setTimeout(function () {
            done();
        }, 1000);
    });
    it('Table with leftindent > 0 and selection in first column test resizer at position 0', () => {
console.log('Table with leftindent > 0 and selection in first column test resizer at position 0');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        editor.selection.handleShiftDownKey();
        let offsetX: number = documentHelper.currentPage.boundingRectangle.x + 263.5;
        let offsety: number = documentHelper.currentPage.boundingRectangle.y + 100;
        let event: any = { offsetX: offsetX, offsetY: offsety, preventDefault: function () { }, ctrlKey: false, which: 1 };
        documentHelper.onMouseDownInternal(event);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(0);
        event = { offsetX: documentHelper.currentPage.boundingRectangle.x + 159.5, offsetY: 128, preventDefault: function () { }, ctrlKey: false, which: 0 };
        documentHelper.onMouseMoveInternal(event);
        event = { offsetX: documentHelper.currentPage.boundingRectangle.x + 159.5, offsetY: 138, preventDefault: function () { }, ctrlKey: false, which: 0 };
        documentHelper.onMouseMoveInternal(event);
        documentHelper.onMouseUpInternal(event);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(-1);
        editor.editorHistory.undo();
        editor.editorHistory.redo();
    });
    it('Table with leftindent > 0 and selection in first column test resizer at position 0', () => {
console.log('Table with leftindent > 0 and selection in first column test resizer at position 0');
        editor.open(getJson());
        documentHelper = editor.documentHelper;
        editor.selection.handleShiftDownKey();
        let offsetX: number = documentHelper.currentPage.boundingRectangle.x + 263.5;
        let offsety: number = documentHelper.currentPage.boundingRectangle.y + 100;
        let event: any = { offsetX: offsetX, offsetY: offsety, preventDefault: function () { }, ctrlKey: false, which: 1 };
        documentHelper.onMouseDownInternal(event);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(0);
        event = { offsetX: documentHelper.currentPage.boundingRectangle.x + 259.5, offsetY: 134, preventDefault: function () { }, ctrlKey: false, which: 0 };
        documentHelper.onMouseMoveInternal(event);
        event = { offsetX: documentHelper.currentPage.boundingRectangle.y + 259.5, offsetY: 132, preventDefault: function () { }, ctrlKey: false, which: 0 };
        documentHelper.onMouseMoveInternal(event);
        documentHelper.onMouseUpInternal(event);
        expect(editor.editorModule.tableResize.resizerPosition).toBe(-1);
        editor.editorHistory.undo();
        editor.editorHistory.redo();
    });
});
